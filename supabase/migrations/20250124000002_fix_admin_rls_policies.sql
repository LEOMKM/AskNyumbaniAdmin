-- ============================================================
-- Fix Admin RLS Policies - Remove Infinite Recursion
-- ============================================================
-- Purpose: Fix the infinite recursion issue in admin_users RLS policy
-- ============================================================

-- Drop existing policies that cause recursion
DROP POLICY IF EXISTS "Admin users access policy" ON public.admin_users;
DROP POLICY IF EXISTS "Admin sessions access policy" ON public.admin_sessions;
DROP POLICY IF EXISTS "Admin activity log access policy" ON public.admin_activity_log;

-- Disable RLS on admin tables (they use function-based auth, not Supabase auth)
ALTER TABLE public.admin_users DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_sessions DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_activity_log DISABLE ROW LEVEL SECURITY;

-- Instead, we'll use SECURITY DEFINER functions for all admin operations
-- This means the functions run with elevated privileges, bypassing RLS

-- The admin auth functions already use SECURITY DEFINER, so they can access the tables
-- No RLS needed because:
-- 1. Admin users authenticate through custom functions (not Supabase Auth)
-- 2. Sessions are managed server-side
-- 3. Access is controlled by the functions themselves

COMMENT ON TABLE public.admin_users IS
'Admin users table - Access controlled via SECURITY DEFINER functions, not RLS';

COMMENT ON TABLE public.admin_sessions IS
'Admin sessions table - Managed by authentication functions';

COMMENT ON TABLE public.admin_activity_log IS
'Admin activity log - Written by SECURITY DEFINER functions';

-- ============================================================
-- Verify Admin User Exists
-- ============================================================

DO $$
DECLARE
    admin_exists BOOLEAN;
BEGIN
    -- Check if default admin exists
    SELECT EXISTS (
        SELECT 1 FROM public.admin_users
        WHERE email = 'admin@asknyumbani.com'
    ) INTO admin_exists;

    IF NOT admin_exists THEN
        -- Create default admin if it doesn't exist
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

        RAISE NOTICE '✓ Created default admin user';
    ELSE
        RAISE NOTICE '✓ Admin user already exists';
    END IF;
END $$;

-- ============================================================
-- Completion Message
-- ============================================================

DO $$
BEGIN
    RAISE NOTICE '=====================================================';
    RAISE NOTICE 'Admin RLS Policies Fixed Successfully!';
    RAISE NOTICE '=====================================================';
    RAISE NOTICE 'Changes:';
    RAISE NOTICE '  ✓ Removed infinite recursion RLS policies';
    RAISE NOTICE '  ✓ Disabled RLS on admin tables';
    RAISE NOTICE '  ✓ Access now controlled by SECURITY DEFINER functions';
    RAISE NOTICE '  ✓ Verified admin user exists';
    RAISE NOTICE '';
    RAISE NOTICE 'Login credentials:';
    RAISE NOTICE '  Email: admin@asknyumbani.com';
    RAISE NOTICE '  Password: Admin@2025';
    RAISE NOTICE '  PIN: 2025';
    RAISE NOTICE '';
    RAISE NOTICE 'Try logging in now!';
    RAISE NOTICE '=====================================================';
END $$;
