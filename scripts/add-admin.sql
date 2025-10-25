-- ================================================
-- Add Admin User with PIN Script
-- ================================================
-- This SQL script creates an admin user with a PIN
-- Run this in your Supabase SQL Editor
-- ================================================

-- Admin details (MODIFY THESE AS NEEDED)
-- Email: admin@asknyumbani.com
-- Password: Admin@2025
-- PIN: 2025
-- Role: super_admin

-- Insert the admin user
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
    'admin@asknyumbani.com',                                                     -- Email
    public.hash_password('Admin@2025'),                                          -- Password hash
    public.hash_password('2025'),                                                -- PIN hash (uses same function)
    'Ask Nyumbani Admin',                                                        -- Full name
    'super_admin',                                                               -- Role: 'admin' or 'super_admin'
    TRUE,                                                                        -- Is active
    FALSE,                                                                       -- Is first login (FALSE since PIN is already set)
    0,                                                                           -- Failed login attempts
    NOW()                                                                        -- PIN created at
)
ON CONFLICT (email) DO NOTHING
RETURNING
    id,
    email,
    full_name,
    role,
    created_at;

-- Log the activity
INSERT INTO public.admin_activity_log (
    admin_user_id,
    activity_type,
    description,
    metadata
)
SELECT
    id,
    'account_created',
    'Admin account created via SQL script',
    jsonb_build_object(
        'created_by', 'sql_script',
        'has_pin', true
    )
FROM public.admin_users
WHERE email = 'admin@asknyumbani.com';

-- Display success message
SELECT
    '✅ Admin user created successfully!' as status,
    email,
    full_name,
    role,
    'Use PIN: 2025 to login' as login_info
FROM public.admin_users
WHERE email = 'admin@asknyumbani.com';
