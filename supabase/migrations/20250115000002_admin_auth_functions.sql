-- ============================================================
-- Admin Authentication Functions
-- ============================================================
-- Purpose: Create functions for admin login, PIN management, and session handling
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
    session_token TEXT;
BEGIN
    -- Get admin user by email
    SELECT * INTO admin_record
    FROM public.admin_users
    WHERE email = p_email AND is_active = TRUE;
    
    -- Check if admin exists
    IF NOT FOUND THEN
        -- Log failed attempt
        INSERT INTO public.admin_activity_log (admin_user_id, activity_type, description)
        VALUES (NULL, 'login', 'Failed login attempt for email: ' || p_email);
        
        RAISE EXCEPTION 'Invalid email or password';
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
    
    -- Check if account is locked (too many failed attempts)
    IF admin_record.failed_login_attempts >= 5 THEN
        RAISE EXCEPTION 'Account locked due to too many failed attempts';
    END IF;
    
    -- Create session
    session_token := public.create_admin_session(admin_record.id);
    
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
    session_token TEXT;
    pin_hash TEXT;
BEGIN
    -- Hash the provided PIN
    pin_hash := public.hash_password(p_pin);
    
    -- Get admin user by PIN
    SELECT * INTO admin_record
    FROM public.admin_users
    WHERE pin_hash = pin_hash AND is_active = TRUE;
    
    -- Check if admin exists
    IF NOT FOUND THEN
        RAISE EXCEPTION 'Invalid PIN';
    END IF;
    
    -- Create session
    session_token := public.create_admin_session(admin_record.id);
    
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

-- Function to clean up expired sessions
CREATE OR REPLACE FUNCTION public.cleanup_expired_sessions()
RETURNS INTEGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    deleted_count INTEGER;
BEGIN
    -- Delete expired sessions
    DELETE FROM public.admin_sessions
    WHERE expires_at < NOW() OR is_active = FALSE;
    
    GET DIAGNOSTICS deleted_count = ROW_COUNT;
    
    RETURN deleted_count;
END;
$$;

-- Function to get admin activity log
CREATE OR REPLACE FUNCTION public.get_admin_activity_log(
    p_admin_user_id UUID DEFAULT NULL,
    p_limit INTEGER DEFAULT 50
)
RETURNS TABLE(
    id UUID,
    activity_type TEXT,
    description TEXT,
    metadata JSONB,
    created_at TIMESTAMPTZ
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    RETURN QUERY
    SELECT 
        al.id,
        al.activity_type,
        al.description,
        al.metadata,
        al.created_at
    FROM public.admin_activity_log al
    WHERE (p_admin_user_id IS NULL OR al.admin_user_id = p_admin_user_id)
    ORDER BY al.created_at DESC
    LIMIT p_limit;
END;
$$;

-- ============================================================
-- Update Image Review Functions with Comments
-- ============================================================

-- Function to approve image with comment
CREATE OR REPLACE FUNCTION public.approve_property_image(
    p_image_id UUID,
    p_admin_user_id UUID,
    p_comment TEXT DEFAULT NULL
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    -- Update image status
    UPDATE public.property_images
    SET 
        admin_approved = TRUE,
        admin_reviewed_at = NOW(),
        admin_reviewed_by = p_admin_user_id,
        admin_rejection_reason = NULL,
        admin_comment = p_comment,
        updated_at = NOW()
    WHERE id = p_image_id;
    
    -- Log activity
    INSERT INTO public.admin_activity_log (admin_user_id, activity_type, description, metadata)
    VALUES (
        p_admin_user_id, 
        'image_approved', 
        'Approved property image: ' || p_image_id,
        jsonb_build_object('image_id', p_image_id, 'comment', p_comment)
    );
    
    RETURN TRUE;
END;
$$;

-- Function to reject image with reason and comment
CREATE OR REPLACE FUNCTION public.reject_property_image(
    p_image_id UUID,
    p_admin_user_id UUID,
    p_rejection_reason TEXT,
    p_comment TEXT DEFAULT NULL
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    -- Update image status
    UPDATE public.property_images
    SET 
        admin_approved = FALSE,
        admin_reviewed_at = NOW(),
        admin_reviewed_by = p_admin_user_id,
        admin_rejection_reason = p_rejection_reason,
        admin_comment = p_comment,
        updated_at = NOW()
    WHERE id = p_image_id;
    
    -- Log activity
    INSERT INTO public.admin_activity_log (admin_user_id, activity_type, description, metadata)
    VALUES (
        p_admin_user_id, 
        'image_rejected', 
        'Rejected property image: ' || p_image_id,
        jsonb_build_object(
            'image_id', p_image_id, 
            'rejection_reason', p_rejection_reason,
            'comment', p_comment
        )
    );
    
    RETURN TRUE;
END;
$$;

-- ============================================================
-- Grant Permissions
-- ============================================================

-- Grant execute permissions on functions
GRANT EXECUTE ON FUNCTION public.admin_login TO authenticated, anon;
GRANT EXECUTE ON FUNCTION public.admin_login_with_pin TO authenticated, anon;
GRANT EXECUTE ON FUNCTION public.create_admin_pin TO authenticated;
GRANT EXECUTE ON FUNCTION public.invalidate_admin_session TO authenticated;
GRANT EXECUTE ON FUNCTION public.cleanup_expired_sessions TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_admin_activity_log TO authenticated;
GRANT EXECUTE ON FUNCTION public.approve_property_image TO authenticated;
GRANT EXECUTE ON FUNCTION public.reject_property_image TO authenticated;

-- ============================================================
-- Completion Message
-- ============================================================

DO $$
BEGIN
    RAISE NOTICE '=====================================================';
    RAISE NOTICE 'Admin Authentication Functions Created Successfully!';
    RAISE NOTICE '=====================================================';
    RAISE NOTICE 'Created functions:';
    RAISE NOTICE '  - admin_login (email/password)';
    RAISE NOTICE '  - admin_login_with_pin (4-digit PIN)';
    RAISE NOTICE '  - create_admin_pin (PIN creation)';
    RAISE NOTICE '  - invalidate_admin_session (logout)';
    RAISE NOTICE '  - approve_property_image (with comments)';
    RAISE NOTICE '  - reject_property_image (with comments)';
    RAISE NOTICE '';
    RAISE NOTICE 'Features:';
    RAISE NOTICE '  ✓ Secure password hashing';
    RAISE NOTICE '  ✓ 4-digit PIN system';
    RAISE NOTICE '  ✓ Session management';
    RAISE NOTICE '  ✓ Activity logging';
    RAISE NOTICE '  ✓ Image approval with comments';
    RAISE NOTICE '  ✓ Account lockout protection';
    RAISE NOTICE '=====================================================';
END $$;
