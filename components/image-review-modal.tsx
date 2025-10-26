'use client'

import { useState } from 'react'
import Image from 'next/image'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Textarea } from '@/components/ui/textarea'
import { useApproveImage, useRejectImage } from '@/lib/hooks/use-image-reviews'
import { PropertyImage } from '@/lib/types/database'
import { 
  CheckCircle, 
  XCircle, 
  Clock, 
  MapPin, 
  User, 
  Calendar,
  AlertTriangle,
  X
} from 'lucide-react'
import { format } from 'date-fns'

interface ImageReviewModalProps {
  image: PropertyImage & {
    property_title?: string
    property_address?: string
    property_city?: string
    property_owner_name?: string
    property_owner_email?: string
    property_owner_phone?: string
    reviewer_name?: string
    reviewer_email?: string
  }
  isOpen: boolean
  onClose: () => void
}

export function ImageReviewModal({ image, isOpen, onClose }: ImageReviewModalProps) {
  const [rejectionReason, setRejectionReason] = useState('')
  const [imageError, setImageError] = useState(false)
  
  const approveImage = useApproveImage()
  const rejectImage = useRejectImage()

  const handleApprove = async () => {
    try {
      await approveImage.mutateAsync({
        imageId: image.id,
        propertyId: image.property_id,
        propertyTitle: image.property_title,
        imageUrl: image.image_url,
      })
      onClose()
    } catch (error) {
      console.error('Failed to approve image:', error)
      alert('Failed to approve image. Please try again.')
    }
  }

  const handleReject = async () => {
    if (!rejectionReason.trim()) {
      alert('Please provide a reason for rejection')
      return
    }

    try {
      await rejectImage.mutateAsync({
        imageId: image.id,
        imageUrl: image.image_url,
        rejectionReason: rejectionReason.trim(),
        propertyId: image.property_id,
        propertyTitle: image.property_title,
      })
      onClose()
    } catch (error) {
      console.error('Failed to reject image:', error)
      alert('Failed to reject image. Please try again.')
    }
  }

  const getStatusBadge = () => {
    if (image.admin_approved === true) {
      return (
        <Badge variant="secondary" className="bg-green-100 text-green-800 border-green-200">
          <CheckCircle className="h-3 w-3 mr-1" />
          Approved
        </Badge>
      )
    } else if (image.admin_approved === false) {
      return (
        <Badge variant="secondary" className="bg-red-100 text-red-800 border-red-200">
          <XCircle className="h-3 w-3 mr-1" />
          Rejected
        </Badge>
      )
    } else {
      return (
        <Badge variant="secondary" className="bg-yellow-100 text-yellow-800 border-yellow-200">
          <Clock className="h-3 w-3 mr-1" />
          Pending Review
        </Badge>
      )
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
      <Card className="w-full max-w-4xl max-h-[90vh] overflow-hidden">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <div className="space-y-1">
            <CardTitle className="text-xl">Image Review</CardTitle>
            <CardDescription>
              Review property image for approval
            </CardDescription>
          </div>
          <div className="flex items-center space-x-3">
            {getStatusBadge()}
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Image Display */}
          <div className="relative aspect-video w-full overflow-hidden rounded-lg bg-muted">
            {imageError ? (
              <div className="flex items-center justify-center h-full">
                <AlertTriangle className="h-16 w-16 text-muted-foreground" />
              </div>
            ) : (
              <Image
                src={image.image_url}
                alt={image.caption || 'Property image'}
                fill
                className="object-contain"
                onError={() => setImageError(true)}
                sizes="(max-width: 768px) 100vw, 80vw"
              />
            )}
          </div>

          {/* Property Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Property Details</h3>
              <div className="space-y-3">
                <div className="flex items-start space-x-3">
                  <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="font-medium">{image.property_title || 'Property Image'}</p>
                    <p className="text-sm text-muted-foreground">
                      {image.property_address}, {image.property_city}
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">{image.property_owner_name || 'Unknown Owner'}</p>
                    <p className="text-xs text-muted-foreground">{image.property_owner_email}</p>
                    {image.property_owner_phone && (
                      <p className="text-xs text-muted-foreground">{image.property_owner_phone}</p>
                    )}
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">Uploaded</p>
                    <p className="text-xs text-muted-foreground">
                      {format(new Date(image.created_at), 'MMM d, yyyy \'at\' h:mm a')}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Image Details */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Image Details</h3>
              <div className="space-y-3">
                <div>
                  <p className="text-sm font-medium">Caption</p>
                  <p className="text-sm text-muted-foreground">
                    {image.caption || 'No caption provided'}
                  </p>
                </div>

                <div>
                  <p className="text-sm font-medium">Display Order</p>
                  <p className="text-sm text-muted-foreground">
                    {image.display_order}
                  </p>
                </div>

                <div>
                  <p className="text-sm font-medium">Primary Image</p>
                  <p className="text-sm text-muted-foreground">
                    {image.is_primary ? 'Yes' : 'No'}
                  </p>
                </div>

                {image.admin_rejection_reason && (
                  <div>
                    <p className="text-sm font-medium text-red-600">Rejection Reason</p>
                    <p className="text-sm text-red-600">
                      {image.admin_rejection_reason}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Review Actions */}
          {image.admin_approved === null && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Review Actions</h3>

              <div className="space-y-4">
                {/* Quick approve with no comment */}
                <div className="mt-2 flex flex-col sm:flex-row sm:justify-start">
                  <Button
                    onClick={handleApprove}
                    disabled={approveImage.isPending || rejectImage.isPending}
                    className="w-full sm:w-auto bg-green-600 hover:bg-green-700 text-white"
                  >
                    <CheckCircle className="h-4 w-4 mr-2" />
                    {approveImage.isPending ? 'Approving...' : 'Approve Image'}
                  </Button>
                </div>

                {/* Rejection with reason */}
                <div className="border-t pt-4">
                  <label className="text-sm font-medium text-red-600">Reject with Reason (Required)</label>
                  <Textarea
                    placeholder="Provide a reason for rejecting this image..."
                    value={rejectionReason}
                    onChange={(e) => setRejectionReason(e.target.value)}
                    className="mt-2 border-red-200 focus:border-red-500"
                    rows={3}
                  />
                  <div className="mt-3 flex flex-col gap-2 sm:flex-row sm:gap-3">
                    <Button
                      variant="destructive"
                      onClick={handleReject}
                      disabled={rejectImage.isPending || approveImage.isPending || !rejectionReason.trim()}
                      className="w-full sm:flex-1"
                    >
                      <XCircle className="h-4 w-4 mr-2" />
                      {rejectImage.isPending ? 'Rejecting...' : 'Reject & Delete Image'}
                    </Button>
                    <Button
                      variant="outline"
                      onClick={onClose}
                      disabled={rejectImage.isPending || approveImage.isPending}
                      className="w-full sm:w-auto"
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Review History */}
          {image.admin_approved !== null && image.admin_reviewed_at && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Review History</h3>
              <div className="bg-muted p-4 rounded-lg">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium">Reviewed On</p>
                    <p className="text-sm text-muted-foreground">
                      {format(new Date(image.admin_reviewed_at), 'MMM d, yyyy \'at\' h:mm a')}
                    </p>
                  </div>
                  {image.reviewer_name && (
                    <div>
                      <p className="text-sm font-medium">Reviewed By</p>
                      <p className="text-sm text-muted-foreground">
                        {image.reviewer_name}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
