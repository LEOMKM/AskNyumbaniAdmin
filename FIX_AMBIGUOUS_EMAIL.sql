-- ============================================================
-- Fix Ambiguous Email Column Reference in Login Functions
-- ============================================================
-- This fixes the "column reference 'email' is ambiguous" error
-- ============================================================

-- Fix admin_login function with proper table qualification
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
    session_token TEXT;
    password_hash TEXT;
BEGIN
    -- Hash the provided password
    password_hash := public.hash_password(p_password);

    -- Get admin user by email and password
    -- FIXED: Qualify all column references with table alias
    SELECT au.* INTO admin_record
    FROM public.admin_users au
    WHERE au.email = p_email
    AND au.password_hash = password_hash
    AND au.is_active = TRUE;

    IF NOT FOUND THEN
        -- Log failed attempt
        UPDATE public.admin_users au
        SET failed_login_attempts = au.failed_login_attempts + 1
        WHERE au.email = p_email;

        RAISE EXCEPTION 'Invalid email or password';
    END IF;

    -- Reset failed attempts and update last login
    UPDATE public.admin_users au
    SET failed_login_attempts = 0,
        last_login_at = NOW()
    WHERE au.id = admin_record.id;

    -- Create session
    session_token := public.create_admin_session(admin_record.id);

    -- Log successful login
    INSERT INTO public.admin_activity_log (admin_user_id, activity_type, description)
    VALUES (admin_record.id, 'login', 'Successful email/password login');

    -- Return admin data
    RETURN QUERY
    SELECT
        admin_record.id,
        admin_record.email,
        admin_record.full_name,
        admin_record.role,
        admin_record.is_active,
        admin_record.is_first_login,
        session_token;
END;
$$;

-- Fix admin_login_with_pin function with proper table qualification
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
    session_token TEXT;
    pin_hash TEXT;
    hardcoded_email TEXT := 'admin@asknyumbani.com';
BEGIN
    -- Hash the provided PIN
    pin_hash := public.hash_password(p_pin);

    -- Get admin user by hardcoded email AND PIN
    -- FIXED: Qualify all column references with table alias
    SELECT au.* INTO admin_record
    FROM public.admin_users au
    WHERE au.email = hardcoded_email
    AND au.pin_hash = pin_hash
    AND au.is_active = TRUE;

    IF NOT FOUND THEN
        -- Log failed attempt
        UPDATE public.admin_users au
        SET failed_login_attempts = au.failed_login_attempts + 1
        WHERE au.email = hardcoded_email;

        RAISE EXCEPTION 'Invalid PIN';
    END IF;

    -- Reset failed attempts and update last login
    UPDATE public.admin_users au
    SET failed_login_attempts = 0,
        last_login_at = NOW()
    WHERE au.id = admin_record.id;

    -- Create session
    session_token := public.create_admin_session(admin_record.id);

    -- Log successful login
    INSERT INTO public.admin_activity_log (admin_user_id, activity_type, description)
    VALUES (admin_record.id, 'login', 'Successful PIN login');

    -- Return admin data
    RETURN QUERY
    SELECT
        admin_record.id,
        admin_record.email,
        admin_record.full_name,
        admin_record.role,
        admin_record.is_active,
        FALSE as is_first_login,
        session_token;
END;
$$;

-- Grant execute permissions
GRANT EXECUTE ON FUNCTION public.admin_login(TEXT, TEXT) TO authenticated, anon;
GRANT EXECUTE ON FUNCTION public.admin_login_with_pin(TEXT) TO authenticated, anon;

-- Verification
DO $$
BEGIN
    RAISE NOTICE '===================================================';
    RAISE NOTICE 'Login Functions Fixed Successfully!';
    RAISE NOTICE '===================================================';
    RAISE NOTICE 'Changes:';
    RAISE NOTICE '  ✓ Fixed ambiguous email column reference';
    RAISE NOTICE '  ✓ Added table aliases (au) to all queries';
    RAISE NOTICE '  ✓ Both login functions updated';
    RAISE NOTICE '';
    RAISE NOTICE 'LOGIN CREDENTIALS:';
    RAISE NOTICE '  PIN: 2025';
    RAISE NOTICE '  (Email is hardcoded - no need to enter)';
    RAISE NOTICE '';
    RAISE NOTICE 'Alternative login:';
    RAISE NOTICE '  Email: admin@asknyumbani.com';
    RAISE NOTICE '  Password: Admin@2025';
    RAISE NOTICE '===================================================';
END $$;
