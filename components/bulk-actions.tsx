'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useBulkApproveImages } from '@/lib/hooks/use-image-reviews'
import { CheckCircle, X, AlertTriangle } from 'lucide-react'

interface BulkActionsProps {
  selectedCount: number
  onClear: () => void
}

export function BulkActions({ selectedCount, onClear }: BulkActionsProps) {
  const [showConfirm, setShowConfirm] = useState(false)
  const bulkApprove = useBulkApproveImages()

  const handleBulkApprove = async () => {
    // This would need to be passed down from the parent component
    // For now, we'll just show the confirmation
    setShowConfirm(true)
  }

  if (showConfirm) {
    return (
      <Card className="border-primary">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center">
            <AlertTriangle className="h-5 w-5 text-yellow-500 mr-2" />
            Confirm Bulk Approval
          </CardTitle>
          <CardDescription>
            Are you sure you want to approve {selectedCount} images? This action cannot be undone.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex space-x-3">
            <Button
              onClick={() => {
                // Handle bulk approval here
                setShowConfirm(false)
                onClear()
              }}
              className="bg-green-600 hover:bg-green-700"
              disabled={bulkApprove.isPending}
            >
              <CheckCircle className="h-4 w-4 mr-2" />
              Yes, Approve All
            </Button>
            <Button
              variant="outline"
              onClick={() => setShowConfirm(false)}
            >
              Cancel
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="flex items-center space-x-2">
      <span className="text-sm text-muted-foreground">
        {selectedCount} selected
      </span>
      <Button
        size="sm"
        onClick={handleBulkApprove}
        className="bg-green-600 hover:bg-green-700"
      >
        <CheckCircle className="h-4 w-4 mr-1" />
        Approve All
      </Button>
      <Button
        size="sm"
        variant="outline"
        onClick={onClear}
      >
        <X className="h-4 w-4 mr-1" />
        Clear
      </Button>
    </div>
  )
}
