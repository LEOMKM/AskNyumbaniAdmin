'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { EnhancedImageReviewCard } from '@/components/enhanced-image-review-card'
import { BulkActions } from '@/components/bulk-actions'
import { usePendingImageReviews, useImageReviewHistory } from '@/lib/hooks/use-image-reviews'
import { Clock, CheckCircle, XCircle, AlertCircle } from 'lucide-react'

interface ImageReviewGridProps {
  filter: 'pending' | 'approved' | 'all'
}

export function ImageReviewGrid({ filter }: ImageReviewGridProps) {
  const [selectedImages, setSelectedImages] = useState<string[]>([])

  const {
    data: pendingImages,
    isLoading: pendingLoading,
    error: pendingError
  } = usePendingImageReviews()

  const {
    data: reviewHistory,
    isLoading: historyLoading,
    error: historyError
  } = useImageReviewHistory()

  const isLoading = pendingLoading || historyLoading
  const error = pendingError || historyError

  // Filter images based on current filter
  const getFilteredImages = () => {
    if (filter === 'pending') {
      return pendingImages || []
    } else if (filter === 'approved') {
      return (reviewHistory || []).filter(img => img.admin_approved === true)
    } else {
      // 'all' - show both pending and approved (rejected images are deleted)
      return [...(pendingImages || []), ...((reviewHistory || []).filter(img => img.admin_approved === true))]
    }
  }

  const filteredImages = getFilteredImages()

  const handleImageSelect = (imageId: string, selected: boolean) => {
    if (selected) {
      setSelectedImages(prev => [...prev, imageId])
    } else {
      setSelectedImages(prev => prev.filter(id => id !== imageId))
    }
  }

  const handleSelectAll = () => {
    if (selectedImages.length === filteredImages.length) {
      setSelectedImages([])
    } else {
      setSelectedImages(filteredImages.map(img => img.id))
    }
  }

  const clearSelection = () => {
    setSelectedImages([])
  }

  if (error) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <AlertCircle className="h-12 w-12 text-destructive mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-foreground mb-2">
            Error Loading Images
          </h3>
          <p className="text-muted-foreground mb-4">
            There was an error loading the image data. Please try again.
          </p>
          <Button onClick={() => window.location.reload()}>
            Retry
          </Button>
        </CardContent>
      </Card>
    )
  }

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-8">
          <div className="flex items-center justify-center space-x-2">
            <Clock className="h-6 w-6 animate-spin text-primary" />
            <span className="text-muted-foreground">Loading images...</span>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (filteredImages.length === 0) {
    const getEmptyMessage = () => {
      switch (filter) {
        case 'pending':
          return {
            icon: CheckCircle,
            title: 'No Pending Reviews',
            description: 'All images have been reviewed. Great job!',
            color: 'text-green-600'
          }
        case 'approved':
          return {
            icon: CheckCircle,
            title: 'No Approved Images',
            description: 'No images have been approved yet.',
            color: 'text-muted-foreground'
          }
        default:
          return {
            icon: Clock,
            title: 'No Images Found',
            description: 'No property images available for review.',
            color: 'text-muted-foreground'
          }
      }
    }

    const emptyState = getEmptyMessage()
    const EmptyIcon = emptyState.icon

    return (
      <Card>
        <CardContent className="p-8 text-center">
          <EmptyIcon className={`h-12 w-12 ${emptyState.color} mx-auto mb-4`} />
          <h3 className="text-lg font-semibold text-foreground mb-2">
            {emptyState.title}
          </h3>
          <p className="text-muted-foreground">
            {emptyState.description}
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header with bulk actions */}
      {filter === 'pending' && filteredImages.length > 0 && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-lg">
                  Pending Image Reviews ({filteredImages.length})
                </CardTitle>
                <CardDescription>
                  Review and approve property images before they appear in the app
                </CardDescription>
              </div>
              <div className="flex items-center space-x-3">
                <Button
                  variant="outline"
                  onClick={handleSelectAll}
                  className="text-sm"
                >
                  {selectedImages.length === filteredImages.length ? 'Deselect All' : 'Select All'}
                </Button>
                {selectedImages.length > 0 && (
                  <BulkActions
                    selectedCount={selectedImages.length}
                    onClear={clearSelection}
                  />
                )}
              </div>
            </div>
          </CardHeader>
        </Card>
      )}

      {/* Image Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredImages.map((image) => (
          <EnhancedImageReviewCard
            key={image.id}
            image={image}
            isSelected={selectedImages.includes(image.id)}
            onSelect={(selected) => handleImageSelect(image.id, selected)}
            showSelection={filter === 'pending'}
          />
        ))}
      </div>

      {/* Load More Button (if needed) */}
      {filteredImages.length >= 20 && (
        <div className="text-center">
          <Button variant="outline" size="lg">
            Load More Images
          </Button>
        </div>
      )}
    </div>
  )
}
