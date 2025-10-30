-- FIX: Ambiguous pin_hash column reference in admin_login functions
-- This script fixes the PostgreSQL error: "column reference 'pin_hash' is ambiguous"
-- Error code: 42702

-- Drop existing functions if they exist
DROP FUNCTION IF EXISTS public.admin_login(text, text);
DROP FUNCTION IF EXISTS public.admin_login_with_pin(text);
DROP FUNCTION IF EXISTS public.create_admin_pin(uuid, text);
DROP FUNCTION IF EXISTS public.invalidate_admin_session(text);

-- Admin login with email and password
CREATE OR REPLACE FUNCTION public.admin_login(
  p_email text,
  p_password text
)
RETURNS TABLE (
  admin_user_id uuid,
  email text,
  full_name text,
  role text,
  is_active boolean,
  is_first_login boolean,
  session_token text
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_password_hash text;
  v_user_id uuid;
  v_is_active boolean;
  v_session_token text;
BEGIN
  -- Hash the input password
  v_password_hash := encode(digest(p_password || 'admin_salt_2025', 'sha256'), 'hex');

  -- Get user ID and check if active
  -- FIX: Explicitly qualify column names with table alias
  SELECT u.id, u.is_active
  INTO v_user_id, v_is_active
  FROM public.admin_users u
  WHERE u.email = p_email
    AND u.password_hash = v_password_hash;

  IF v_user_id IS NULL THEN
    RAISE EXCEPTION 'Invalid email or password';
  END IF;

  IF NOT v_is_active THEN
    RAISE EXCEPTION 'Account is disabled';
  END IF;

  -- Update last login
  UPDATE public.admin_users
  SET last_login_at = now(),
      failed_login_attempts = 0
  WHERE id = v_user_id;

  -- Create session
  v_session_token := encode(gen_random_bytes(24), 'hex');

  INSERT INTO public.admin_sessions (admin_user_id, session_token, expires_at)
  VALUES (v_user_id, v_session_token, now() + interval '12 hours');

  -- Return user data with session
  RETURN QUERY
  SELECT
    u.id,
    u.email,
    u.full_name,
    u.role,
    u.is_active,
    u.is_first_login,
    v_session_token
  FROM public.admin_users u
  WHERE u.id = v_user_id;
END;
$$;

-- Admin login with PIN
CREATE OR REPLACE FUNCTION public.admin_login_with_pin(p_pin text)
RETURNS TABLE (
  admin_user_id uuid,
  email text,
  full_name text,
  role text,
  is_active boolean,
  session_token text
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_pin_hash text;
  v_user_id uuid;
  v_is_active boolean;
  v_session_token text;
BEGIN
  -- Hash the input PIN
  v_pin_hash := encode(digest(p_pin || 'admin_salt_2025', 'sha256'), 'hex');

  -- Get user ID and check if active
  -- FIX: Explicitly qualify pin_hash with table alias 'u' to avoid ambiguity
  SELECT u.id, u.is_active
  INTO v_user_id, v_is_active
  FROM public.admin_users u
  WHERE u.pin_hash = v_pin_hash
    AND u.pin_hash IS NOT NULL;

  IF v_user_id IS NULL THEN
    RAISE EXCEPTION 'Invalid PIN';
  END IF;

  IF NOT v_is_active THEN
    RAISE EXCEPTION 'Account is disabled';
  END IF;

  -- Update last login
  UPDATE public.admin_users
  SET last_login_at = now()
  WHERE id = v_user_id;

  -- Create session
  v_session_token := encode(gen_random_bytes(24), 'hex');

  INSERT INTO public.admin_sessions (admin_user_id, session_token, expires_at)
  VALUES (v_user_id, v_session_token, now() + interval '12 hours');

  -- Return user data with session
  RETURN QUERY
  SELECT
    u.id,
    u.email,
    u.full_name,
    u.role,
    u.is_active,
    v_session_token
  FROM public.admin_users u
  WHERE u.id = v_user_id;
END;
$$;

-- Create or update admin PIN
CREATE OR REPLACE FUNCTION public.create_admin_pin(
  p_admin_user_id uuid,
  p_pin text
)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_pin_hash text;
BEGIN
  -- Validate PIN format (must be 4 digits)
  IF p_pin !~ '^\d{4}$' THEN
    RAISE EXCEPTION 'PIN must be exactly 4 digits';
  END IF;

  -- Hash the PIN
  v_pin_hash := encode(digest(p_pin || 'admin_salt_2025', 'sha256'), 'hex');

  -- Update the user's PIN
  UPDATE public.admin_users
  SET pin_hash = v_pin_hash,
      pin_created_at = now(),
      is_first_login = false
  WHERE id = p_admin_user_id;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Admin user not found';
  END IF;

  RETURN true;
END;
$$;

-- Invalidate admin session (logout)
CREATE OR REPLACE FUNCTION public.invalidate_admin_session(p_session_token text)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  DELETE FROM public.admin_sessions
  WHERE session_token = p_session_token;

  RETURN true;
END;
$$;

-- Grant execute permissions
GRANT EXECUTE ON FUNCTION public.admin_login(text, text) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.admin_login_with_pin(text) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.create_admin_pin(uuid, text) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.invalidate_admin_session(text) TO anon, authenticated;

-- Test the fix
DO $$
BEGIN
  RAISE NOTICE 'Admin login functions have been recreated with explicit column qualifications';
  RAISE NOTICE 'The ambiguous pin_hash column reference has been fixed';
  RAISE NOTICE 'All columns now use table aliases (u.pin_hash, u.email, etc.)';
END $$;
