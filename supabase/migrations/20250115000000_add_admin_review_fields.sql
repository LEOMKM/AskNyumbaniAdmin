-- ============================================================
-- Add Admin Review Fields to Property Images
-- ============================================================
-- Purpose: Add fields to track admin approval/rejection of images
-- ============================================================

-- Add admin review fields to property_images table
ALTER TABLE public.property_images 
ADD COLUMN IF NOT EXISTS admin_approved BOOLEAN DEFAULT NULL,
ADD COLUMN IF NOT EXISTS admin_reviewed_at TIMESTAMPTZ DEFAULT NULL,
ADD COLUMN IF NOT EXISTS admin_reviewed_by UUID DEFAULT NULL REFERENCES public.profiles(id),
ADD COLUMN IF NOT EXISTS admin_rejection_reason TEXT DEFAULT NULL;

-- Add indexes for admin review queries
CREATE INDEX IF NOT EXISTS idx_property_images_admin_approved 
    ON public.property_images(admin_approved);

CREATE INDEX IF NOT EXISTS idx_property_images_pending_review 
    ON public.property_images(admin_approved, created_at)
    WHERE admin_approved IS NULL;

-- Add constraint for rejection reason
ALTER TABLE public.property_images 
ADD CONSTRAINT check_rejection_reason 
CHECK (
    (admin_approved = TRUE AND admin_rejection_reason IS NULL) OR
    (admin_approved = FALSE AND admin_rejection_reason IS NOT NULL) OR
    (admin_approved IS NULL)
);

-- ============================================================
-- Create Admin Review Policies
-- ============================================================

-- Policy: Admins can view all images for review
CREATE POLICY "Admins can view all images for review"
    ON public.property_images FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE profiles.id = auth.uid()
            AND profiles.user_type IN ('agent', 'both')
            AND profiles.is_verified = TRUE
        )
    );

-- Policy: Admins can update image review status
CREATE POLICY "Admins can update image review status"
    ON public.property_images FOR UPDATE
    USING (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE profiles.id = auth.uid()
            AND profiles.user_type IN ('agent', 'both')
            AND profiles.is_verified = TRUE
        )
    )
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE profiles.id = auth.uid()
            AND profiles.user_type IN ('agent', 'both')
            AND profiles.is_verified = TRUE
        )
    );

-- ============================================================
-- Create Function to Auto-Update Review Fields
-- ============================================================

CREATE OR REPLACE FUNCTION public.update_image_review_fields()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    -- If admin_approved is being set, update review fields
    IF OLD.admin_approved IS DISTINCT FROM NEW.admin_approved THEN
        NEW.admin_reviewed_at = NOW();
        NEW.admin_reviewed_by = auth.uid();
        
        -- Clear rejection reason if approved
        IF NEW.admin_approved = TRUE THEN
            NEW.admin_rejection_reason = NULL;
        END IF;
    END IF;
    
    RETURN NEW;
END;
$$;

-- Create trigger for auto-updating review fields
DROP TRIGGER IF EXISTS update_image_review_fields_trigger ON public.property_images;
CREATE TRIGGER update_image_review_fields_trigger
    BEFORE UPDATE ON public.property_images
    FOR EACH ROW
    EXECUTE FUNCTION public.update_image_review_fields();

-- ============================================================
-- Create View for Pending Image Reviews
-- ============================================================

CREATE OR REPLACE VIEW public.pending_image_reviews AS
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

-- Grant access to the view
GRANT SELECT ON public.pending_image_reviews TO authenticated;

-- ============================================================
-- Create View for Image Review History
-- ============================================================

CREATE OR REPLACE VIEW public.image_review_history AS
SELECT 
    pi.*,
    p.title as property_title,
    p.address as property_address,
    p.city as property_city,
    prof.full_name as property_owner_name,
    prof.email as property_owner_email,
    reviewer.full_name as reviewer_name,
    reviewer.email as reviewer_email
FROM public.property_images pi
JOIN public.properties p ON pi.property_id = p.id
JOIN public.profiles prof ON p.owner_id = prof.id
LEFT JOIN public.profiles reviewer ON pi.admin_reviewed_by = reviewer.id
WHERE pi.admin_approved IS NOT NULL
ORDER BY pi.admin_reviewed_at DESC;

-- Grant access to the view
GRANT SELECT ON public.image_review_history TO authenticated;

-- ============================================================
-- Completion Message
-- ============================================================

DO $$
BEGIN
    RAISE NOTICE '=====================================================';
    RAISE NOTICE 'Admin Review Fields Added Successfully!';
    RAISE NOTICE '=====================================================';
    RAISE NOTICE 'Added fields:';
    RAISE NOTICE '  - admin_approved (boolean)';
    RAISE NOTICE '  - admin_reviewed_at (timestamp)';
    RAISE NOTICE '  - admin_reviewed_by (uuid)';
    RAISE NOTICE '  - admin_rejection_reason (text)';
    RAISE NOTICE '';
    RAISE NOTICE 'Created views:';
    RAISE NOTICE '  - pending_image_reviews';
    RAISE NOTICE '  - image_review_history';
    RAISE NOTICE '';
    RAISE NOTICE 'Next steps:';
    RAISE NOTICE '  1. Update admin app to use new fields';
    RAISE NOTICE '  2. Test image approval/rejection flow';
    RAISE NOTICE '  3. Verify admin policies work correctly';
    RAISE NOTICE '=====================================================';
END $$;
