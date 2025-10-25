import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase/client'
import { PropertyImage } from '@/lib/types/database'
import { useAuth } from '@/lib/contexts/auth-context'

// Fetch pending image reviews
export function usePendingImageReviews() {
  return useQuery({
    queryKey: ['pending-image-reviews'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('pending_image_reviews')
        .select('*')
        .order('created_at', { ascending: true })

      if (error) throw error
      return data
    },
    refetchInterval: 30000, // Refetch every 30 seconds
  })
}

// Fetch image review history
export function useImageReviewHistory() {
  return useQuery({
    queryKey: ['image-review-history'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('image_review_history')
        .select('*')
        .order('admin_reviewed_at', { ascending: false })

      if (error) throw error
      return data
    },
  })
}

// Approve image mutation (no comments)
export function useApproveImage() {
  const queryClient = useQueryClient()
  const { user } = useAuth()

  return useMutation({
    mutationFn: async ({ imageId }: { imageId: string }) => {
      if (!user) {
        throw new Error('User not authenticated')
      }

      const { error } = await supabase.rpc('approve_property_image', {
        p_image_id: imageId,
        p_admin_user_id: user.id,
      })

      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pending-image-reviews'] })
      queryClient.invalidateQueries({ queryKey: ['image-review-history'] })
      queryClient.invalidateQueries({ queryKey: ['image-review-stats'] })
    },
  })
}

// Reject image mutation (requires reason, deletes image)
export function useRejectImage() {
  const queryClient = useQueryClient()
  const { user } = useAuth()

  return useMutation({
    mutationFn: async ({ imageId, imageUrl, rejectionReason }: { imageId: string; imageUrl: string; rejectionReason: string }) => {
      if (!user) {
        throw new Error('User not authenticated')
      }

      // Validate rejection reason
      if (!rejectionReason || rejectionReason.trim() === '') {
        throw new Error('Rejection reason is required')
      }

      // First, delete the image from Supabase Storage
      if (imageUrl) {
        try {
          // Extract the path from the URL
          // Format: https://[project].supabase.co/storage/v1/object/public/[bucket]/[path]
          const urlParts = imageUrl.split('/storage/v1/object/public/')
          if (urlParts.length === 2) {
            const [bucket, ...pathParts] = urlParts[1].split('/')
            const path = pathParts.join('/')

            // Delete from storage
            const { error: storageError } = await supabase.storage
              .from(bucket)
              .remove([path])

            if (storageError) {
              console.error('Failed to delete image from storage:', storageError)
              // Continue anyway to delete from database
            }
          }
        } catch (e) {
          console.error('Error parsing image URL for deletion:', e)
          // Continue anyway to delete from database
        }
      }

      // Then delete from database using RPC function
      const { error } = await supabase.rpc('reject_property_image', {
        p_image_id: imageId,
        p_admin_user_id: user.id,
        p_rejection_reason: rejectionReason.trim()
      })

      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pending-image-reviews'] })
      queryClient.invalidateQueries({ queryKey: ['image-review-history'] })
      queryClient.invalidateQueries({ queryKey: ['image-review-stats'] })
    },
  })
}

// Bulk approve images
export function useBulkApproveImages() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (imageIds: string[]) => {
      const { error } = await supabase
        .from('property_images')
        .update({
          admin_approved: true,
          admin_rejection_reason: null,
        })
        .in('id', imageIds)

      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pending-image-reviews'] })
      queryClient.invalidateQueries({ queryKey: ['image-review-history'] })
    },
  })
}

// Get image review statistics
export function useImageReviewStats() {
  return useQuery({
    queryKey: ['image-review-stats'],
    queryFn: async () => {
      const [pendingResult, approvedResult, rejectedResult] = await Promise.all([
        supabase
          .from('property_images')
          .select('id', { count: 'exact' })
          .is('admin_approved', null),
        supabase
          .from('property_images')
          .select('id', { count: 'exact' })
          .eq('admin_approved', true),
        supabase
          .from('property_images')
          .select('id', { count: 'exact' })
          .eq('admin_approved', false),
      ])

      if (pendingResult.error) throw pendingResult.error
      if (approvedResult.error) throw approvedResult.error
      if (rejectedResult.error) throw rejectedResult.error

      return {
        pending: pendingResult.count || 0,
        approved: approvedResult.count || 0,
        rejected: rejectedResult.count || 0,
        total: (pendingResult.count || 0) + (approvedResult.count || 0) + (rejectedResult.count || 0),
      }
    },
    refetchInterval: 60000, // Refetch every minute
  })
}
