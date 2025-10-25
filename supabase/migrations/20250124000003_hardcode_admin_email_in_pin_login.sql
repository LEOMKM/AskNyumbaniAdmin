-- ============================================================
-- Hardcode Admin Email in PIN Login
-- ============================================================
-- Purpose: Make PIN login only work for admin@asknyumbani.com
-- ============================================================

-- Update the PIN login function to hardcode the email
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
    -- FIXED: Qualify all column references with table alias to avoid ambiguity
    SELECT au.* INTO admin_record
    FROM public.admin_users au
    WHERE au.email = hardcoded_email
    AND au.pin_hash = pin_hash
    AND au.is_active = TRUE;

    -- Check if admin exists with matching PIN
    IF NOT FOUND THEN
        RAISE EXCEPTION 'Invalid PIN for admin@asknyumbani.com';
    END IF;

    -- Reset failed login attempts on successful login
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
        FALSE as is_first_login, -- PIN login means not first login
        session_token;
END;
$$;

-- Grant execute permission
GRANT EXECUTE ON FUNCTION public.admin_login_with_pin(TEXT) TO authenticated, anon;

-- Add comment to document the hardcoded email
COMMENT ON FUNCTION public.admin_login_with_pin(TEXT) IS
'PIN login function - hardcoded to work only with admin@asknyumbani.com';

-- ============================================================
-- Completion Message
-- ============================================================

DO $$
BEGIN
    RAISE NOTICE '=====================================================';
    RAISE NOTICE 'PIN Login Updated Successfully!';
    RAISE NOTICE '=====================================================';
    RAISE NOTICE 'Changes:';
    RAISE NOTICE '  ✓ PIN login now hardcoded to admin@asknyumbani.com';
    RAISE NOTICE '  ✓ Only accepts PIN: 2025';
    RAISE NOTICE '  ✓ More secure - email cannot be changed';
    RAISE NOTICE '';
    RAISE NOTICE 'Login with PIN:';
    RAISE NOTICE '  Just enter: 2025';
    RAISE NOTICE '  (No email required)';
    RAISE NOTICE '=====================================================';
END $$;
