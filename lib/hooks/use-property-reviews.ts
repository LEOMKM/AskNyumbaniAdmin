import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase/client'

export interface PropertyWithImages {
  id: string
  title: string
  description: string
  property_type: string
  deal_type: string
  price: number
  currency: string
  price_period: string | null
  bedrooms: number | null
  bathrooms: number | null
  kitchen_areas: number | null
  square_feet: number | null
  square_meters: number | null
  address: string
  city: string
  region: string
  county: string | null
  country: string
  status: string
  created_at: string
  property_images: PropertyImage[]
}

export interface PropertyImage {
  id: string
  property_id: string
  image_url: string
  thumbnail_url: string | null
  caption: string | null
  is_primary: boolean
  display_order: number
  admin_approved: boolean | null
  admin_reviewed_at: string | null
  admin_reviewed_by: string | null
  admin_rejection_reason: string | null
  admin_comment: string | null
  created_at: string
}

// Fetch properties with pending images
export function usePropertiesWithPendingImages() {
  return useQuery({
    queryKey: ['properties-pending-review'],
    queryFn: async () => {
      // Get properties that have images pending review
      const { data, error } = await supabase
        .from('properties')
        .select(`
          id,
          title,
          description,
          property_type,
          deal_type,
          price,
          currency,
          price_period,
          bedrooms,
          bathrooms,
          kitchen_areas,
          square_feet,
          square_meters,
          address,
          city,
          region,
          county,
          country,
          status,
          created_at,
          property_images!inner(
            id,
            property_id,
            image_url,
            thumbnail_url,
            caption,
            is_primary,
            display_order,
            admin_approved,
            admin_reviewed_at,
            admin_reviewed_by,
            admin_rejection_reason,
            admin_comment,
            created_at
          )
        `)
        .is('property_images.admin_approved', null)
        .order('created_at', { ascending: false })

      if (error) throw error

      // Group images by property
      const propertiesMap = new Map<string, PropertyWithImages>()

      data?.forEach((item: any) => {
        const propertyId = item.id

        if (!propertiesMap.has(propertyId)) {
          propertiesMap.set(propertyId, {
            ...item,
            property_images: []
          })
        }

        const property = propertiesMap.get(propertyId)!
        if (item.property_images) {
          property.property_images.push(item.property_images)
        }
      })

      return Array.from(propertiesMap.values()).map(prop => ({
        ...prop,
        property_images: prop.property_images.sort((a, b) =>
          (b.is_primary ? 1 : 0) - (a.is_primary ? 1 : 0) || a.display_order - b.display_order
        )
      }))
    },
    refetchInterval: 30000, // Refetch every 30 seconds
  })
}

// Fetch all properties with images (for approved/rejected filters)
export function useAllPropertiesWithImages(filter?: 'approved' | 'rejected' | 'all') {
  return useQuery({
    queryKey: ['properties-all-reviews', filter],
    queryFn: async () => {
      let query = supabase
        .from('properties')
        .select(`
          id,
          title,
          description,
          property_type,
          deal_type,
          price,
          currency,
          price_period,
          bedrooms,
          bathrooms,
          kitchen_areas,
          square_feet,
          square_meters,
          address,
          city,
          region,
          county,
          country,
          status,
          created_at,
          property_images(
            id,
            property_id,
            image_url,
            thumbnail_url,
            caption,
            is_primary,
            display_order,
            admin_approved,
            admin_reviewed_at,
            admin_reviewed_by,
            admin_rejection_reason,
            admin_comment,
            created_at
          )
        `)

      // Apply filter based on image approval status
      if (filter === 'approved') {
        query = query.not('property_images.admin_approved', 'is', null).eq('property_images.admin_approved', true)
      } else if (filter === 'rejected') {
        query = query.eq('property_images.admin_approved', false)
      }

      const { data, error } = await query.order('created_at', { ascending: false })

      if (error) throw error

      // Filter out properties with no images and group properly
      return data
        ?.map((item: any) => ({
          ...item,
          property_images: (item.property_images || []).sort((a: PropertyImage, b: PropertyImage) =>
            (b.is_primary ? 1 : 0) - (a.is_primary ? 1 : 0) || a.display_order - b.display_order
          )
        }))
        .filter((prop: PropertyWithImages) => prop.property_images.length > 0) || []
    },
  })
}

// Approve all images for a property
export function useApprovePropertyImages() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({
      propertyId,
      imageIds,
      adminUserId,
      comment
    }: {
      propertyId: string
      imageIds: string[]
      adminUserId: string
      comment?: string | null
    }) => {
      // Approve each image
      const approvePromises = imageIds.map(imageId =>
        supabase.rpc('approve_property_image', {
          p_image_id: imageId,
          p_admin_user_id: adminUserId,
          p_comment: comment
        })
      )

      const results = await Promise.all(approvePromises)
      const errors = results.filter(r => r.error)

      if (errors.length > 0) {
        throw new Error(`Failed to approve ${errors.length} images`)
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['properties-pending-review'] })
      queryClient.invalidateQueries({ queryKey: ['properties-all-reviews'] })
      queryClient.invalidateQueries({ queryKey: ['image-review-stats'] })
    },
  })
}

// Reject images for a property
export function useRejectPropertyImages() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({
      propertyId,
      imageIds,
      adminUserId,
      rejectionReason,
      comment
    }: {
      propertyId: string
      imageIds: string[]
      adminUserId: string
      rejectionReason: string
      comment?: string | null
    }) => {
      // Reject each image
      const rejectPromises = imageIds.map(imageId =>
        supabase.rpc('reject_property_image', {
          p_image_id: imageId,
          p_admin_user_id: adminUserId,
          p_rejection_reason: rejectionReason,
          p_comment: comment
        })
      )

      const results = await Promise.all(rejectPromises)
      const errors = results.filter(r => r.error)

      if (errors.length > 0) {
        throw new Error(`Failed to reject ${errors.length} images`)
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['properties-pending-review'] })
      queryClient.invalidateQueries({ queryKey: ['properties-all-reviews'] })
      queryClient.invalidateQueries({ queryKey: ['image-review-stats'] })
    },
  })
}

// Get property review statistics
export function usePropertyReviewStats() {
  return useQuery({
    queryKey: ['property-review-stats'],
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
