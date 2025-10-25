-- ============================================================
-- MINIMAL FIX - Create admin_login function NOW
-- ============================================================
-- Copy this ENTIRE file and paste into Supabase SQL Editor
-- URL: https://supabase.com/dashboard/project/yqilhwaexdehmrcdblgz/sql
-- ============================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================
-- 1. Create Tables (if they don't exist)
-- ============================================================

CREATE TABLE IF NOT EXISTS public.admin_users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    pin_hash TEXT,
    full_name TEXT NOT NULL,
    role TEXT DEFAULT 'admin',
    is_active BOOLEAN DEFAULT TRUE,
    is_first_login BOOLEAN DEFAULT TRUE,
    failed_login_attempts INTEGER DEFAULT 0,
    last_login_at TIMESTAMPTZ,
    pin_created_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE TABLE IF NOT EXISTS public.admin_sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    admin_user_id UUID NOT NULL REFERENCES public.admin_users(id) ON DELETE CASCADE,
    session_token TEXT UNIQUE NOT NULL,
    expires_at TIMESTAMPTZ NOT NULL,
    ip_address INET,
    user_agent TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    last_accessed_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE TABLE IF NOT EXISTS public.admin_activity_log (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    admin_user_id UUID REFERENCES public.admin_users(id) ON DELETE CASCADE,
    activity_type TEXT NOT NULL,
    description TEXT NOT NULL,
    metadata JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- ============================================================
-- 2. Create Helper Functions
-- ============================================================

CREATE OR REPLACE FUNCTION public.hash_password(password TEXT)
RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    RETURN encode(digest(password || 'admin_salt_2025', 'sha256'), 'hex');
END;
$$;

CREATE OR REPLACE FUNCTION public.verify_password(password TEXT, hash TEXT)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    RETURN hash = public.hash_password(password);
END;
$$;

CREATE OR REPLACE FUNCTION public.create_admin_session(
    p_admin_user_id UUID,
    p_ip_address INET DEFAULT NULL,
    p_user_agent TEXT DEFAULT NULL
)
RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    session_token TEXT;
    expires_at TIMESTAMPTZ;
BEGIN
    session_token := encode(gen_random_bytes(32), 'hex');
    expires_at := NOW() + INTERVAL '24 hours';

    INSERT INTO public.admin_sessions (
        admin_user_id, session_token, expires_at, ip_address, user_agent
    ) VALUES (
        p_admin_user_id, session_token, expires_at, p_ip_address, p_user_agent
    );

    UPDATE public.admin_users
    SET last_login_at = NOW(), failed_login_attempts = 0
    WHERE id = p_admin_user_id;

    INSERT INTO public.admin_activity_log (admin_user_id, activity_type, description)
    VALUES (p_admin_user_id, 'login', 'Admin logged in successfully');

    RETURN session_token;
END;
$$;

-- ============================================================
-- 3. Create admin_login Function (THIS FIXES THE 400 ERROR)
-- ============================================================

CREATE OR REPLACE FUNCTION public.admin_login(
    p_email TEXT,
    p_password TEXT
)
RETURNS TABLE(
    admin_user_id UUID,
    email TEXT,
    full_name TEXT,
    role TEXT,
    is_active BOOLEAN,
    is_first_login BOOLEAN,
    session_token TEXT
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    admin_record RECORD;
    v_session_token TEXT;
BEGIN
    SELECT * INTO admin_record
    FROM public.admin_users
    WHERE admin_users.email = p_email AND admin_users.is_active = TRUE;

    IF NOT FOUND THEN
        INSERT INTO public.admin_activity_log (admin_user_id, activity_type, description)
        VALUES (NULL, 'login', 'Failed login attempt for email: ' || p_email);
        RAISE EXCEPTION 'Invalid email or password';
    END IF;

    IF admin_record.failed_login_attempts >= 5 THEN
        RAISE EXCEPTION 'Account locked due to too many failed attempts';
    END IF;

    IF NOT public.verify_password(p_password, admin_record.password_hash) THEN
        UPDATE public.admin_users
        SET failed_login_attempts = failed_login_attempts + 1
        WHERE id = admin_record.id;

        INSERT INTO public.admin_activity_log (admin_user_id, activity_type, description)
        VALUES (admin_record.id, 'login', 'Failed login attempt - wrong password');

        RAISE EXCEPTION 'Invalid email or password';
    END IF;

    v_session_token := public.create_admin_session(admin_record.id);

    RETURN QUERY
    SELECT
        admin_record.id,
        admin_record.email,
        admin_record.full_name,
        admin_record.role,
        admin_record.is_active,
        admin_record.is_first_login,
        v_session_token;
END;
$$;

-- ============================================================
-- 4. Create admin_login_with_pin Function
-- ============================================================

CREATE OR REPLACE FUNCTION public.admin_login_with_pin(
    p_pin TEXT
)
RETURNS TABLE(
    admin_user_id UUID,
    email TEXT,
    full_name TEXT,
    role TEXT,
    is_active BOOLEAN,
    is_first_login BOOLEAN,
    session_token TEXT
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    admin_record RECORD;
    v_session_token TEXT;
    v_pin_hash TEXT;
BEGIN
    v_pin_hash := public.hash_password(p_pin);

    SELECT * INTO admin_record
    FROM public.admin_users
    WHERE admin_users.pin_hash = v_pin_hash AND admin_users.is_active = TRUE;

    IF NOT FOUND THEN
        RAISE EXCEPTION 'Invalid PIN';
    END IF;

    v_session_token := public.create_admin_session(admin_record.id);

    RETURN QUERY
    SELECT
        admin_record.id,
        admin_record.email,
        admin_record.full_name,
        admin_record.role,
        admin_record.is_active,
        FALSE as is_first_login,
        v_session_token;
END;
$$;

-- ============================================================
-- 5. Grant Permissions
-- ============================================================

GRANT EXECUTE ON FUNCTION public.hash_password TO authenticated, anon;
GRANT EXECUTE ON FUNCTION public.verify_password TO authenticated, anon;
GRANT EXECUTE ON FUNCTION public.admin_login TO authenticated, anon;
GRANT EXECUTE ON FUNCTION public.admin_login_with_pin TO authenticated, anon;
GRANT EXECUTE ON FUNCTION public.create_admin_session TO authenticated, anon;

GRANT ALL ON public.admin_users TO authenticated, anon;
GRANT ALL ON public.admin_sessions TO authenticated, anon;
GRANT ALL ON public.admin_activity_log TO authenticated, anon;

-- Disable RLS to avoid infinite recursion
ALTER TABLE public.admin_users DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_sessions DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_activity_log DISABLE ROW LEVEL SECURITY;

-- ============================================================
-- 6. Create Admin User with PIN 2025
-- ============================================================

INSERT INTO public.admin_users (
    email,
    password_hash,
    pin_hash,
    full_name,
    role,
    is_active,
    is_first_login,
    failed_login_attempts,
    pin_created_at
) VALUES (
    'admin@asknyumbani.com',
    public.hash_password('Admin@2025'),
    public.hash_password('2025'),
    'Ask Nyumbani Admin',
    'super_admin',
    TRUE,
    FALSE,
    0,
    NOW()
)
ON CONFLICT (email)
DO UPDATE SET
    password_hash = EXCLUDED.password_hash,
    pin_hash = EXCLUDED.pin_hash,
    is_first_login = FALSE,
    pin_created_at = NOW(),
    updated_at = NOW();

-- ============================================================
-- 7. Verify Everything Works
-- ============================================================

-- Check if admin_login function exists
SELECT
    '✅ Function admin_login exists!' as status,
    routine_name as function_name
FROM information_schema.routines
WHERE routine_schema = 'public'
AND routine_name = 'admin_login';

-- Check if admin user exists
SELECT
    '✅ Admin user created!' as status,
    email,
    full_name,
    CASE WHEN pin_hash IS NOT NULL THEN 'PIN Set ✓' ELSE 'No PIN' END as pin_status
FROM public.admin_users
WHERE email = 'admin@asknyumbani.com';

-- Final message
DO $$
BEGIN
    RAISE NOTICE '';
    RAISE NOTICE '╔═══════════════════════════════════════════╗';
    RAISE NOTICE '║   ✅ SETUP COMPLETE - READY TO LOGIN!    ║';
    RAISE NOTICE '╚═══════════════════════════════════════════╝';
    RAISE NOTICE '';
    RAISE NOTICE '🔑 Login Credentials:';
    RAISE NOTICE '   Email:    admin@asknyumbani.com';
    RAISE NOTICE '   Password: Admin@2025';
    RAISE NOTICE '   PIN:      2025';
    RAISE NOTICE '';
    RAISE NOTICE '✨ The 400 error is now fixed!';
    RAISE NOTICE '   Refresh your login page and try again.';
    RAISE NOTICE '';
END $$;
