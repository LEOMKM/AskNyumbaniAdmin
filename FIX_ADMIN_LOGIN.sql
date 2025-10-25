-- ============================================================
-- COMPLETE ADMIN LOGIN FIX
-- ============================================================
-- Run this entire script in Supabase SQL Editor to fix login
-- ============================================================

-- Step 1: Fix RLS Policies (Remove Infinite Recursion)
-- ============================================================

DROP POLICY IF EXISTS "Admin users access policy" ON public.admin_users;
DROP POLICY IF EXISTS "Admin sessions access policy" ON public.admin_sessions;
DROP POLICY IF EXISTS "Admin activity log access policy" ON public.admin_activity_log;

ALTER TABLE public.admin_users DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_sessions DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_activity_log DISABLE ROW LEVEL SECURITY;

COMMENT ON TABLE public.admin_users IS
'Admin users table - Access controlled via SECURITY DEFINER functions, not RLS';

-- Step 2: Verify/Create Admin User
-- ============================================================

DO $$
DECLARE
    admin_exists BOOLEAN;
BEGIN
    SELECT EXISTS (
        SELECT 1 FROM public.admin_users
        WHERE email = 'admin@asknyumbani.com'
    ) INTO admin_exists;

    IF NOT admin_exists THEN
        INSERT INTO public.admin_users (
            email,
            password_hash,
            pin_hash,
            full_name,
            role,
            is_first_login,
            pin_created_at
        ) VALUES (
            'admin@asknyumbani.com',
            public.hash_password('Admin@2025'),
            public.hash_password('2025'),
            'Ask Nyumbani Admin',
            'super_admin',
            FALSE,
            NOW()
        );
        RAISE NOTICE '✓ Created admin user';
    ELSE
        -- Update existing admin with correct credentials
        UPDATE public.admin_users
        SET
            password_hash = public.hash_password('Admin@2025'),
            pin_hash = public.hash_password('2025'),
            is_first_login = FALSE,
            pin_created_at = NOW(),
            is_active = TRUE,
            failed_login_attempts = 0
        WHERE email = 'admin@asknyumbani.com';
        RAISE NOTICE '✓ Updated admin credentials';
    END IF;
END $$;

-- Step 3: Update Login Functions (Fix Ambiguous Email + Hardcode Email)
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

-- Fix admin_login_with_pin function with proper table qualification + hardcoded email
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

GRANT EXECUTE ON FUNCTION public.admin_login(TEXT, TEXT) TO authenticated, anon;
GRANT EXECUTE ON FUNCTION public.admin_login_with_pin(TEXT) TO authenticated, anon;

-- Step 4: Verification
-- ============================================================

DO $$
DECLARE
    admin_record RECORD;
BEGIN
    -- Check admin exists
    SELECT email, role, is_active INTO admin_record
    FROM public.admin_users
    WHERE email = 'admin@asknyumbani.com'
    LIMIT 1;

    RAISE NOTICE '=====================================================';
    RAISE NOTICE 'ADMIN LOGIN FIX COMPLETED!';
    RAISE NOTICE '=====================================================';

    IF FOUND THEN
        RAISE NOTICE '✓ Admin user exists';
        RAISE NOTICE '  Email: %', admin_record.email;
        RAISE NOTICE '  Role: %', admin_record.role;
        RAISE NOTICE '  Active: %', admin_record.is_active;
        RAISE NOTICE '';
        RAISE NOTICE 'LOGIN CREDENTIALS:';
        RAISE NOTICE '  PIN: 2025';
        RAISE NOTICE '  (Email is hardcoded - no need to enter)';
        RAISE NOTICE '';
        RAISE NOTICE 'Alternative login:';
        RAISE NOTICE '  Email: admin@asknyumbani.com';
        RAISE NOTICE '  Password: Admin@2025';
    ELSE
        RAISE NOTICE '❌ Admin user not created - check errors above';
    END IF;

    RAISE NOTICE '';
    RAISE NOTICE 'CHANGES APPLIED:';
    RAISE NOTICE '  ✓ Fixed RLS infinite recursion';
    RAISE NOTICE '  ✓ Disabled RLS on admin tables';
    RAISE NOTICE '  ✓ Created/updated admin user';
    RAISE NOTICE '  ✓ Hardcoded email in PIN login';
    RAISE NOTICE '  ✓ Fixed ambiguous email column reference';
    RAISE NOTICE '';
    RAISE NOTICE 'TRY LOGGING IN NOW!';
    RAISE NOTICE '=====================================================';
END $$;
