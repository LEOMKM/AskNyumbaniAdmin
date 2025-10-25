-- ============================================================
-- Fix Image Approval Workflow
-- ============================================================
-- Purpose: Update rejection workflow to DELETE images instead of marking as rejected
--          Ensure approval workflow works correctly
-- ============================================================

-- Drop the old reject function
DROP FUNCTION IF EXISTS public.reject_property_image(UUID, UUID, TEXT, TEXT);

-- Create new reject function that DELETES the image
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
DECLARE
    v_image_url TEXT;
    v_property_id UUID;
BEGIN
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
            'rejection_reason', p_rejection_reason,
            'comment', p_comment
        )
    );

    -- DELETE the image from database
    -- Note: The actual file in Supabase Storage should be deleted from the admin app
    DELETE FROM public.property_images
    WHERE id = p_image_id;

    RETURN TRUE;
END;
$$;

-- Update approve function to ensure it sets the correct fields
CREATE OR REPLACE FUNCTION public.approve_property_image(
    p_image_id UUID,
    p_admin_user_id UUID,
    p_comment TEXT DEFAULT NULL
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

    -- Update image status to APPROVED
    UPDATE public.property_images
    SET
        admin_approved = TRUE,
        admin_reviewed_at = NOW(),
        admin_reviewed_by = p_admin_user_id,
        admin_rejection_reason = NULL,
        admin_comment = p_comment
    WHERE id = p_image_id;

    -- Log activity
    INSERT INTO public.admin_activity_log (admin_user_id, activity_type, description, metadata)
    VALUES (
        p_admin_user_id,
        'image_approved',
        'Approved property image: ' || p_image_id,
        jsonb_build_object(
            'image_id', p_image_id,
            'property_id', v_property_id,
            'comment', p_comment
        )
    );

    RETURN TRUE;
END;
$$;

-- Drop and recreate the view for pending image reviews
DROP VIEW IF EXISTS public.pending_image_reviews CASCADE;

CREATE VIEW public.pending_image_reviews AS
SELECT
    pi.*,
    p.title as property_title,
    p.address as property_address,
    p.city as property_city,
    p.status as property_status,
    prof.full_name as property_owner_name,
    prof.email as property_owner_email,
    prof.phone_number as property_owner_phone
FROM public.property_images pi
JOIN public.properties p ON pi.property_id = p.id
JOIN public.profiles prof ON p.owner_id = prof.id
WHERE pi.admin_approved IS NULL
ORDER BY pi.created_at ASC;

-- Update the check constraint since rejected images are now deleted
ALTER TABLE public.property_images
DROP CONSTRAINT IF EXISTS check_rejection_reason;

ALTER TABLE public.property_images
ADD CONSTRAINT check_rejection_reason
CHECK (
    (admin_approved = TRUE AND admin_rejection_reason IS NULL) OR
    (admin_approved IS NULL)
);

-- Grant execute permissions
GRANT EXECUTE ON FUNCTION public.approve_property_image TO authenticated;
GRANT EXECUTE ON FUNCTION public.reject_property_image TO authenticated;

-- ============================================================
-- Completion Message
-- ============================================================

DO $$
BEGIN
    RAISE NOTICE '=====================================================';
    RAISE NOTICE 'Image Approval Workflow Fixed Successfully!';
    RAISE NOTICE '=====================================================';
    RAISE NOTICE 'Changes:';
    RAISE NOTICE '  ✓ Approval: Sets admin_approved = TRUE';
    RAISE NOTICE '  ✓ Rejection: DELETES image from database';
    RAISE NOTICE '  ✓ Updated constraint: No more rejected status';
    RAISE NOTICE '';
    RAISE NOTICE 'Image States:';
    RAISE NOTICE '  • admin_approved = NULL → Pending review';
    RAISE NOTICE '  • admin_approved = TRUE → Approved (visible in app)';
    RAISE NOTICE '  • Rejected → Image deleted from database';
    RAISE NOTICE '';
    RAISE NOTICE 'Next Steps:';
    RAISE NOTICE '  1. Update admin app to delete from Storage on rejection';
    RAISE NOTICE '  2. Update mobile app to filter admin_approved = TRUE';
    RAISE NOTICE '=====================================================';
END $$;
