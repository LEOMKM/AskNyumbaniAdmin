-- ============================================================
-- Fix Duplicate Approval/Rejection Functions
-- ============================================================
-- Problem: Multiple versions of the same functions exist
-- Solution: Drop all versions and create clean versions
-- ============================================================

-- Drop ALL versions of approve_property_image
DROP FUNCTION IF EXISTS public.approve_property_image(UUID, UUID);
DROP FUNCTION IF EXISTS public.approve_property_image(UUID, UUID, TEXT);

-- Drop ALL versions of reject_property_image
DROP FUNCTION IF EXISTS public.reject_property_image(UUID, UUID, TEXT);
DROP FUNCTION IF EXISTS public.reject_property_image(UUID, UUID, TEXT, TEXT);

-- Create the CORRECT approve function (no comments)
CREATE OR REPLACE FUNCTION public.approve_property_image(
    p_image_id UUID,
    p_admin_user_id UUID
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_property_id UUID;
BEGIN
    -- Get property ID for logging
    SELECT property_id INTO v_property_id
    FROM public.property_images
    WHERE id = p_image_id;

    IF NOT FOUND THEN
        RAISE EXCEPTION 'Image not found';
    END IF;

    -- Update image status to APPROVED (no comments)
    UPDATE public.property_images
    SET
        admin_approved = TRUE,
        admin_reviewed_at = NOW(),
        admin_reviewed_by = p_admin_user_id,
        admin_rejection_reason = NULL,
        admin_comment = NULL
    WHERE id = p_image_id;

    -- Log activity
    INSERT INTO public.admin_activity_log (admin_user_id, activity_type, description, metadata)
    VALUES (
        p_admin_user_id,
        'image_approved',
        'Approved property image: ' || p_image_id,
        jsonb_build_object(
            'image_id', p_image_id,
            'property_id', v_property_id
        )
    );

    RETURN TRUE;
END;
$$;

-- Create the CORRECT reject function (requires reason, deletes image)
CREATE OR REPLACE FUNCTION public.reject_property_image(
    p_image_id UUID,
    p_admin_user_id UUID,
    p_rejection_reason TEXT
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_image_url TEXT;
    v_property_id UUID;
BEGIN
    -- Validate rejection reason is provided
    IF p_rejection_reason IS NULL OR TRIM(p_rejection_reason) = '' THEN
        RAISE EXCEPTION 'Rejection reason is required';
    END IF;

    -- Get image URL and property ID before deletion for logging
    SELECT image_url, property_id INTO v_image_url, v_property_id
    FROM public.property_images
    WHERE id = p_image_id;

    IF NOT FOUND THEN
        RAISE EXCEPTION 'Image not found';
    END IF;

    -- Log activity BEFORE deletion
    INSERT INTO public.admin_activity_log (admin_user_id, activity_type, description, metadata)
    VALUES (
        p_admin_user_id,
        'image_rejected',
        'Rejected and deleted property image: ' || p_image_id,
        jsonb_build_object(
            'image_id', p_image_id,
            'property_id', v_property_id,
            'image_url', v_image_url,
            'rejection_reason', p_rejection_reason
        )
    );

    -- DELETE the image from database
    DELETE FROM public.property_images
    WHERE id = p_image_id;

    RETURN TRUE;
END;
$$;

-- Grant execute permissions
GRANT EXECUTE ON FUNCTION public.approve_property_image(UUID, UUID) TO authenticated, anon;
GRANT EXECUTE ON FUNCTION public.reject_property_image(UUID, UUID, TEXT) TO authenticated, anon;

-- Verification
DO $$
BEGIN
    RAISE NOTICE '===================================================';
    RAISE NOTICE 'Duplicate Functions Removed!';
    RAISE NOTICE '===================================================';
    RAISE NOTICE 'Changes:';
    RAISE NOTICE '  ✓ Dropped old approve_property_image versions';
    RAISE NOTICE '  ✓ Dropped old reject_property_image versions';
    RAISE NOTICE '  ✓ Created clean approve function (2 params)';
    RAISE NOTICE '  ✓ Created clean reject function (3 params)';
    RAISE NOTICE '';
    RAISE NOTICE 'Function Signatures:';
    RAISE NOTICE '  approve_property_image(image_id, admin_user_id)';
    RAISE NOTICE '  reject_property_image(image_id, admin_user_id, reason)';
    RAISE NOTICE '';
    RAISE NOTICE 'Approval/rejection should now work!';
    RAISE NOTICE '===================================================';
END $$;
