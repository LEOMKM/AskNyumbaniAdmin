import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase/client'
import { PropertyImage, AdminActivityLog } from '@/lib/types/database'
import { useAuth } from '@/lib/contexts/auth-context'

type ActivityMetadata = Record<string, unknown>

async function logAdminActivity(params: {
  adminUserId: string
  activityType: AdminActivityLog['activity_type']
  description: string
  metadata?: ActivityMetadata
}) {
  const { adminUserId, activityType, description, metadata } = params

  try {
    const { error } = await supabase.from('admin_activity_log').insert([
      {
        admin_user_id: adminUserId,
        activity_type: activityType,
        description,
        metadata: metadata ?? null,
      },
    ])

    if (error) {
      throw error
    }
  } catch (error) {
    console.error('Failed to log admin activity:', error)
  }
}

// Fetch pending image reviews
export function usePendingImageReviews() {
  return useQuery({
    queryKey: ['pending-image-reviews'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('property_images')
        .select(`
          *,
          property:properties(
            id,
            title,
            property_type,
            deal_type,
            city,
            address,
            price,
            currency,
            bedrooms,
            bathrooms,
            square_meters
          )
        `)
        .is('admin_approved', null)
        .order('created_at', { ascending: true })

      if (error) throw error

      // Flatten the data structure to match the expected format
      return data?.map(img => ({
        ...img,
        property_title: img.property?.title,
        property_address: img.property?.address,
        property_city: img.property?.city,
        property_type: img.property?.property_type,
        deal_type: img.property?.deal_type,
        price: img.property?.price,
        currency: img.property?.currency,
        bedrooms: img.property?.bedrooms,
        bathrooms: img.property?.bathrooms,
        size_m2: img.property?.square_meters,
      })) || []
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
        .from('property_images')
        .select(`
          *,
          property:properties(
            id,
            title,
            property_type,
            deal_type,
            city,
            address,
            price,
            currency,
            bedrooms,
            bathrooms,
            square_meters
          )
        `)
        .not('admin_approved', 'is', null)
        .order('admin_reviewed_at', { ascending: false })

      if (error) throw error

      // Flatten the data structure to match the expected format
      return data?.map(img => ({
        ...img,
        property_title: img.property?.title,
        property_address: img.property?.address,
        property_city: img.property?.city,
        property_type: img.property?.property_type,
        deal_type: img.property?.deal_type,
        price: img.property?.price,
        currency: img.property?.currency,
        bedrooms: img.property?.bedrooms,
        bathrooms: img.property?.bathrooms,
        size_m2: img.property?.square_meters,
      })) || []
    },
  })
}

// Approve image mutation (no comments)
interface ApproveImageInput {
  imageId: string
  propertyId?: string
  propertyTitle?: string
  imageUrl?: string
}

export function useApproveImage() {
  const queryClient = useQueryClient()
  const { user } = useAuth()

  return useMutation({
    mutationFn: async ({ imageId, propertyId, propertyTitle, imageUrl }: ApproveImageInput) => {
      if (!user) {
        throw new Error('User not authenticated')
      }

      const { error } = await supabase.rpc('approve_property_image', {
        p_image_id: imageId,
        p_admin_user_id: user.id,
      })

      if (error) throw error

      await logAdminActivity({
        adminUserId: user.id,
        activityType: 'image_approved',
        description: `Approved property image${propertyTitle ? ` for "${propertyTitle}"` : ''}`,
        metadata: {
          imageId,
          propertyId: propertyId ?? null,
          propertyTitle: propertyTitle ?? null,
          imageUrl: imageUrl ?? null,
          action: 'approve',
        },
      })
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pending-image-reviews'] })
      queryClient.invalidateQueries({ queryKey: ['image-review-history'] })
      queryClient.invalidateQueries({ queryKey: ['image-review-stats'] })
      queryClient.invalidateQueries({ queryKey: ['admin-activity-log'] })
    },
  })
}

// Reject image mutation (requires reason, deletes image)
interface RejectImageInput {
  imageId: string
  imageUrl: string
  rejectionReason: string
  propertyId?: string
  propertyTitle?: string
}

export function useRejectImage() {
  const queryClient = useQueryClient()
  const { user } = useAuth()

  return useMutation({
    mutationFn: async ({ imageId, imageUrl, rejectionReason, propertyId, propertyTitle }: RejectImageInput) => {
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

      await logAdminActivity({
        adminUserId: user.id,
        activityType: 'image_rejected',
        description: `Rejected property image${propertyTitle ? ` for "${propertyTitle}"` : ''}`,
        metadata: {
          imageId,
          propertyId: propertyId ?? null,
          propertyTitle: propertyTitle ?? null,
          imageUrl: imageUrl ?? null,
          rejectionReason: rejectionReason.trim(),
          action: 'reject',
        },
      })
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pending-image-reviews'] })
      queryClient.invalidateQueries({ queryKey: ['image-review-history'] })
      queryClient.invalidateQueries({ queryKey: ['image-review-stats'] })
      queryClient.invalidateQueries({ queryKey: ['admin-activity-log'] })
    },
  })
}

// Bulk approve images
export function useBulkApproveImages() {
  const queryClient = useQueryClient()
  const { user } = useAuth()

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

      if (user && imageIds.length > 0) {
        await logAdminActivity({
          adminUserId: user.id,
          activityType: 'bulk_image_approved',
          description: `Bulk approved ${imageIds.length} image${imageIds.length === 1 ? '' : 's'}`,
          metadata: {
            imageIds,
            action: 'bulk_approve',
          },
        })
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pending-image-reviews'] })
      queryClient.invalidateQueries({ queryKey: ['image-review-history'] })
      queryClient.invalidateQueries({ queryKey: ['admin-activity-log'] })
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

export function useAdminActivityLog(limit = 10) {
  return useQuery({
    queryKey: ['admin-activity-log', limit],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('admin_activity_log')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(limit)

      if (error) throw error
      return data as AdminActivityLog[]
    },
    refetchInterval: 60000,
  })
}
