-- ============================================================
-- COMPLETE ADMIN SETUP SCRIPT
-- ============================================================
-- This script:
-- 1. Creates all necessary functions if they don't exist
-- 2. Adds an admin user with PIN 2025
-- ============================================================

-- ============================================================
-- STEP 1: Create Helper Functions
-- ============================================================

-- Function to hash passwords and PINs
CREATE OR REPLACE FUNCTION public.hash_password(password TEXT)
RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    RETURN encode(digest(password || 'admin_salt_2025', 'sha256'), 'hex');
END;
$$;

-- ============================================================
-- STEP 2: Add Admin User with PIN 2025
-- ============================================================

-- Delete existing user if needed (uncomment if you want to replace)
-- DELETE FROM public.admin_users WHERE email = 'admin@asknyumbani.com';

-- Insert new admin user with PIN already set
INSERT INTO public.admin_users (
    email,
    password_hash,
    pin_hash,
    full_name,
    role,
    is_active,
    is_first_login,
    failed_login_attempts,
    pin_created_at,
    created_at,
    updated_at
) VALUES (
    'admin@asknyumbani.com',                                    -- Email
    public.hash_password('Admin@2025'),                         -- Password
    public.hash_password('2025'),                               -- PIN (using same hash function)
    'Ask Nyumbani Admin',                                       -- Full name
    'super_admin',                                              -- Role
    TRUE,                                                       -- Active
    FALSE,                                                      -- Not first login (PIN already set)
    0,                                                          -- No failed attempts
    NOW(),                                                      -- PIN created now
    NOW(),                                                      -- Created now
    NOW()                                                       -- Updated now
)
ON CONFLICT (email)
DO UPDATE SET
    password_hash = EXCLUDED.password_hash,
    pin_hash = EXCLUDED.pin_hash,
    is_first_login = FALSE,
    pin_created_at = NOW(),
    updated_at = NOW()
RETURNING
    id,
    email,
    full_name,
    role,
    is_active,
    created_at;

-- ============================================================
-- STEP 3: Log the Activity
-- ============================================================

INSERT INTO public.admin_activity_log (
    admin_user_id,
    activity_type,
    description,
    metadata
)
SELECT
    id,
    'pin_created',
    'Admin account created with PIN via SQL script',
    jsonb_build_object(
        'created_by', 'setup_script',
        'has_pin', true,
        'pin', '2025'
    )
FROM public.admin_users
WHERE email = 'admin@asknyumbani.com';

-- ============================================================
-- STEP 4: Verify Creation
-- ============================================================

SELECT
    '✅ ADMIN CREATED SUCCESSFULLY!' as "STATUS",
    '' as "---",
    email as "EMAIL",
    full_name as "FULL NAME",
    role as "ROLE",
    CASE WHEN pin_hash IS NOT NULL THEN '2025' ELSE 'Not Set' END as "PIN",
    'Admin@2025' as "PASSWORD",
    is_active as "ACTIVE"
FROM public.admin_users
WHERE email = 'admin@asknyumbani.com';

-- ============================================================
-- SUCCESS MESSAGE
-- ============================================================

DO $$
BEGIN
    RAISE NOTICE '';
    RAISE NOTICE '========================================';
    RAISE NOTICE '✅  ADMIN USER CREATED SUCCESSFULLY!';
    RAISE NOTICE '========================================';
    RAISE NOTICE '';
    RAISE NOTICE '📧  Email:    admin@asknyumbani.com';
    RAISE NOTICE '🔑  Password: Admin@2025';
    RAISE NOTICE '📌  PIN:      2025';
    RAISE NOTICE '🎭  Role:     super_admin';
    RAISE NOTICE '';
    RAISE NOTICE '💡 You can now login using:';
    RAISE NOTICE '   • Quick PIN login: Enter 2025';
    RAISE NOTICE '   • Or email/password login';
    RAISE NOTICE '';
    RAISE NOTICE '========================================';
END $$;
