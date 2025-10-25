-- ============================================================
-- Update Approval Functions - Remove Comments from Approval
-- ============================================================
-- Purpose: Simplify approval (no comments) and ensure rejection requires reason
-- ============================================================

-- Update approve function to remove comment parameter
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

-- Update reject function to ensure rejection reason is required
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
GRANT EXECUTE ON FUNCTION public.approve_property_image(UUID, UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION public.reject_property_image(UUID, UUID, TEXT) TO authenticated;

-- ============================================================
-- Completion Message
-- ============================================================

DO $$
BEGIN
    RAISE NOTICE '=====================================================';
    RAISE NOTICE 'Approval Functions Updated Successfully!';
    RAISE NOTICE '=====================================================';
    RAISE NOTICE 'Changes:';
    RAISE NOTICE '  ✓ Approval: No comments required';
    RAISE NOTICE '  ✓ Rejection: Requires reason, deletes image';
    RAISE NOTICE '  ✓ Both functions updated with new signatures';
    RAISE NOTICE '=====================================================';
END $$;
