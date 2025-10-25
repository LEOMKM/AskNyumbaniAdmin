-- ============================================================
-- COMPLETE DATABASE SETUP - RUN ALL MIGRATIONS
-- ============================================================
-- This script sets up the entire admin authentication system
-- Run this in your Supabase SQL Editor to fix the 400 error
-- ============================================================

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================
-- STEP 1: Create Tables
-- ============================================================

-- Create admin_users table for authentication
CREATE TABLE IF NOT EXISTS public.admin_users (
    -- Primary Key
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

    -- Authentication
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    pin_hash TEXT, -- 4-digit PIN for subsequent logins

    -- Admin Information
    full_name TEXT NOT NULL,
    role TEXT DEFAULT 'admin' CHECK (role IN ('admin', 'super_admin')),

    -- Status
    is_active BOOLEAN DEFAULT TRUE,
    is_first_login BOOLEAN DEFAULT TRUE,

    -- Security
    failed_login_attempts INTEGER DEFAULT 0,
    last_login_at TIMESTAMPTZ,
    pin_created_at TIMESTAMPTZ,

    -- Timestamps
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,

    -- Constraints
    CONSTRAINT valid_email CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'),
    CONSTRAINT valid_full_name CHECK (LENGTH(TRIM(full_name)) >= 2)
);

-- Create indexes for admin_users
CREATE INDEX IF NOT EXISTS idx_admin_users_email ON public.admin_users(email);
CREATE INDEX IF NOT EXISTS idx_admin_users_active ON public.admin_users(is_active) WHERE is_active = TRUE;

-- Create admin_sessions table for session management
CREATE TABLE IF NOT EXISTS public.admin_sessions (
    -- Primary Key
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

    -- Foreign Key
    admin_user_id UUID NOT NULL REFERENCES public.admin_users(id) ON DELETE CASCADE,

    -- Session Information
    session_token TEXT UNIQUE NOT NULL,
    expires_at TIMESTAMPTZ NOT NULL,

    -- Session Data
    ip_address INET,
    user_agent TEXT,

    -- Status
    is_active BOOLEAN DEFAULT TRUE,

    -- Timestamps
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    last_accessed_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Create indexes for admin_sessions
CREATE INDEX IF NOT EXISTS idx_admin_sessions_token ON public.admin_sessions(session_token);
CREATE INDEX IF NOT EXISTS idx_admin_sessions_admin_user ON public.admin_sessions(admin_user_id);
CREATE INDEX IF NOT EXISTS idx_admin_sessions_expires ON public.admin_sessions(expires_at);

-- Create admin_activity_log table for audit trail
CREATE TABLE IF NOT EXISTS public.admin_activity_log (
    -- Primary Key
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

    -- Foreign Key (nullable for failed login attempts)
    admin_user_id UUID REFERENCES public.admin_users(id) ON DELETE CASCADE,

    -- Activity Information
    activity_type TEXT NOT NULL,
    description TEXT NOT NULL,

    -- Additional Data
    metadata JSONB,

    -- Timestamps
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Create indexes for admin_activity_log
CREATE INDEX IF NOT EXISTS idx_admin_activity_admin_user ON public.admin_activity_log(admin_user_id);
CREATE INDEX IF NOT EXISTS idx_admin_activity_type ON public.admin_activity_log(activity_type);
CREATE INDEX IF NOT EXISTS idx_admin_activity_created_at ON public.admin_activity_log(created_at DESC);

-- ============================================================
-- STEP 2: Create Helper Functions
-- ============================================================

-- Function to hash passwords (using SHA256 with salt)
CREATE OR REPLACE FUNCTION public.hash_password(password TEXT)
RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    RETURN encode(digest(password || 'admin_salt_2025', 'sha256'), 'hex');
END;
$$;

-- Function to verify password
CREATE OR REPLACE FUNCTION public.verify_password(password TEXT, hash TEXT)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    RETURN hash = public.hash_password(password);
END;
$$;

-- Function to create admin session
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
    -- Generate session token
    session_token := encode(gen_random_bytes(32), 'hex');

    -- Set expiration (24 hours)
    expires_at := NOW() + INTERVAL '24 hours';

    -- Create session
    INSERT INTO public.admin_sessions (
        admin_user_id, session_token, expires_at, ip_address, user_agent
    ) VALUES (
        p_admin_user_id, session_token, expires_at, p_ip_address, p_user_agent
    );

    -- Update last login
    UPDATE public.admin_users
    SET last_login_at = NOW(), failed_login_attempts = 0
    WHERE id = p_admin_user_id;

    -- Log activity
    INSERT INTO public.admin_activity_log (admin_user_id, activity_type, description)
    VALUES (p_admin_user_id, 'login', 'Admin logged in successfully');

    RETURN session_token;
END;
$$;

-- ============================================================
-- STEP 3: Create Authentication Functions
-- ============================================================

-- Function for admin login with email and password
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
    -- Get admin user by email
    SELECT * INTO admin_record
    FROM public.admin_users
    WHERE admin_users.email = p_email AND is_active = TRUE;

    -- Check if admin exists
    IF NOT FOUND THEN
        -- Log failed attempt
        INSERT INTO public.admin_activity_log (admin_user_id, activity_type, description)
        VALUES (NULL, 'login', 'Failed login attempt for email: ' || p_email);

        RAISE EXCEPTION 'Invalid email or password';
    END IF;

    -- Check if account is locked (too many failed attempts)
    IF admin_record.failed_login_attempts >= 5 THEN
        RAISE EXCEPTION 'Account locked due to too many failed attempts';
    END IF;

    -- Check password
    IF NOT public.verify_password(p_password, admin_record.password_hash) THEN
        -- Increment failed attempts
        UPDATE public.admin_users
        SET failed_login_attempts = failed_login_attempts + 1
        WHERE id = admin_record.id;

        -- Log failed attempt
        INSERT INTO public.admin_activity_log (admin_user_id, activity_type, description)
        VALUES (admin_record.id, 'login', 'Failed login attempt - wrong password');

        RAISE EXCEPTION 'Invalid email or password';
    END IF;

    -- Create session
    v_session_token := public.create_admin_session(admin_record.id);

    -- Return admin data
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

-- Function for admin login with PIN
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
    -- Hash the provided PIN
    v_pin_hash := public.hash_password(p_pin);

    -- Get admin user by PIN
    SELECT * INTO admin_record
    FROM public.admin_users
    WHERE admin_users.pin_hash = v_pin_hash AND admin_users.is_active = TRUE;

    -- Check if admin exists
    IF NOT FOUND THEN
        RAISE EXCEPTION 'Invalid PIN';
    END IF;

    -- Create session
    v_session_token := public.create_admin_session(admin_record.id);

    -- Return admin data
    RETURN QUERY
    SELECT
        admin_record.id,
        admin_record.email,
        admin_record.full_name,
        admin_record.role,
        admin_record.is_active,
        FALSE as is_first_login, -- PIN login means not first login
        v_session_token;
END;
$$;

-- Function to create admin PIN
CREATE OR REPLACE FUNCTION public.create_admin_pin(
    p_admin_user_id UUID,
    p_pin TEXT
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    admin_record RECORD;
BEGIN
    -- Validate PIN format (4 digits)
    IF p_pin !~ '^[0-9]{4}$' THEN
        RAISE EXCEPTION 'PIN must be exactly 4 digits';
    END IF;

    -- Get admin user
    SELECT * INTO admin_record
    FROM public.admin_users
    WHERE id = p_admin_user_id AND is_active = TRUE;

    -- Check if admin exists
    IF NOT FOUND THEN
        RAISE EXCEPTION 'Admin user not found';
    END IF;

    -- Update admin user with PIN
    UPDATE public.admin_users
    SET
        pin_hash = public.hash_password(p_pin),
        pin_created_at = NOW(),
        is_first_login = FALSE,
        updated_at = NOW()
    WHERE id = p_admin_user_id;

    -- Log activity
    INSERT INTO public.admin_activity_log (admin_user_id, activity_type, description)
    VALUES (p_admin_user_id, 'pin_created', 'Admin created PIN for login');

    RETURN TRUE;
END;
$$;

-- Function to validate admin session
CREATE OR REPLACE FUNCTION public.validate_admin_session(p_session_token TEXT)
RETURNS TABLE(
    admin_user_id UUID,
    email TEXT,
    full_name TEXT,
    role TEXT,
    is_active BOOLEAN
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    RETURN QUERY
    SELECT
        au.id,
        au.email,
        au.full_name,
        au.role,
        au.is_active
    FROM public.admin_sessions s
    JOIN public.admin_users au ON s.admin_user_id = au.id
    WHERE s.session_token = p_session_token
    AND s.is_active = TRUE
    AND s.expires_at > NOW()
    AND au.is_active = TRUE;
END;
$$;

-- Function to invalidate admin session
CREATE OR REPLACE FUNCTION public.invalidate_admin_session(
    p_session_token TEXT
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    session_record RECORD;
BEGIN
    -- Get session
    SELECT * INTO session_record
    FROM public.admin_sessions
    WHERE session_token = p_session_token;

    -- Check if session exists
    IF NOT FOUND THEN
        RETURN FALSE;
    END IF;

    -- Invalidate session
    UPDATE public.admin_sessions
    SET is_active = FALSE
    WHERE session_token = p_session_token;

    -- Log activity
    INSERT INTO public.admin_activity_log (admin_user_id, activity_type, description)
    VALUES (session_record.admin_user_id, 'logout', 'Admin logged out');

    RETURN TRUE;
END;
$$;

-- ============================================================
-- STEP 4: Grant Permissions
-- ============================================================

-- Grant execute permissions on functions to anon and authenticated roles
GRANT EXECUTE ON FUNCTION public.hash_password TO authenticated, anon;
GRANT EXECUTE ON FUNCTION public.verify_password TO authenticated, anon;
GRANT EXECUTE ON FUNCTION public.admin_login TO authenticated, anon;
GRANT EXECUTE ON FUNCTION public.admin_login_with_pin TO authenticated, anon;
GRANT EXECUTE ON FUNCTION public.create_admin_pin TO authenticated, anon;
GRANT EXECUTE ON FUNCTION public.validate_admin_session TO authenticated, anon;
GRANT EXECUTE ON FUNCTION public.invalidate_admin_session TO authenticated, anon;
GRANT EXECUTE ON FUNCTION public.create_admin_session TO authenticated, anon;

-- Grant table permissions
GRANT ALL ON public.admin_users TO authenticated, anon;
GRANT ALL ON public.admin_sessions TO authenticated, anon;
GRANT ALL ON public.admin_activity_log TO authenticated, anon;

-- Disable RLS on admin tables
-- We use SECURITY DEFINER functions for access control instead
ALTER TABLE public.admin_users DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_sessions DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_activity_log DISABLE ROW LEVEL SECURITY;

-- ============================================================
-- STEP 5: Create Admin User with PIN 2025
-- ============================================================

-- Insert admin user with PIN already set
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
-- STEP 6: Verification and Success Message
-- ============================================================

-- Verify the setup
SELECT
    '✅ DATABASE SETUP COMPLETE!' as "STATUS",
    '' as "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━";

-- Show created functions
SELECT
    '📋 Functions Created:' as "CATEGORY",
    routine_name as "FUNCTION_NAME"
FROM information_schema.routines
WHERE routine_schema = 'public'
AND routine_name LIKE 'admin_%' OR routine_name LIKE 'hash_%' OR routine_name LIKE 'verify_%'
ORDER BY routine_name;

-- Show admin user
SELECT
    '👤 Admin User Created:' as "CATEGORY",
    email as "EMAIL",
    full_name as "FULL_NAME",
    role as "ROLE",
    CASE WHEN pin_hash IS NOT NULL THEN '✅ Set' ELSE '❌ Not Set' END as "PIN_STATUS"
FROM public.admin_users
WHERE email = 'admin@asknyumbani.com';

-- Final message
DO $$
BEGIN
    RAISE NOTICE '';
    RAISE NOTICE '╔════════════════════════════════════════════════╗';
    RAISE NOTICE '║  ✅  ADMIN SYSTEM SETUP COMPLETE!             ║';
    RAISE NOTICE '╚════════════════════════════════════════════════╝';
    RAISE NOTICE '';
    RAISE NOTICE '🔑 Login Credentials:';
    RAISE NOTICE '   Email:    admin@asknyumbani.com';
    RAISE NOTICE '   Password: Admin@2025';
    RAISE NOTICE '   PIN:      2025';
    RAISE NOTICE '';
    RAISE NOTICE '✨ You can now login with either:';
    RAISE NOTICE '   • PIN (Quick): Just enter 2025';
    RAISE NOTICE '   • Email/Password: Use credentials above';
    RAISE NOTICE '';
    RAISE NOTICE '🎯 Next Steps:';
    RAISE NOTICE '   1. Refresh your admin login page';
    RAISE NOTICE '   2. Try logging in with PIN: 2025';
    RAISE NOTICE '   3. Start managing property images!';
    RAISE NOTICE '';
    RAISE NOTICE '════════════════════════════════════════════════';
END $$;
