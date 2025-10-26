'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useAdminActivityLog } from '@/lib/hooks/use-image-reviews'
import { formatDistanceToNow } from 'date-fns'
import { Activity, CheckCircle, Loader2, XCircle, Images } from 'lucide-react'

const activityIconMap: Record<string, JSX.Element> = {
  image_approved: <CheckCircle className="h-4 w-4 text-green-600" />,
  image_rejected: <XCircle className="h-4 w-4 text-red-600" />,
  bulk_image_approved: <Images className="h-4 w-4 text-primary" />,
}

function ActivityIcon({ type }: { type: string }) {
  return activityIconMap[type] ?? <Activity className="h-4 w-4 text-muted-foreground" />
}

export function AdminActivityLog() {
  const { data, isLoading, error } = useAdminActivityLog(8)

  const content = () => {
    if (isLoading) {
      return (
        <div className="flex items-center justify-center py-10 text-muted-foreground">
          <Loader2 className="h-5 w-5 animate-spin mr-2" />
          Loading activity...
        </div>
      )
    }

    if (error) {
      return (
        <div className="py-6 text-sm text-red-600">
          Unable to load activity log. Please try again later.
        </div>
      )
    }

    if (!data || data.length === 0) {
      return (
        <div className="py-6 text-sm text-muted-foreground">
          No recent admin activity recorded yet.
        </div>
      )
    }

    return (
      <div className="space-y-4">
        {data.map((log) => {
          const metadata = (log.metadata ?? {}) as Record<string, unknown>
          const propertyTitle = (metadata.propertyTitle as string) || ''
          const propertyId = (metadata.propertyId as string) || ''
          const rejectionReason = metadata.rejectionReason as string | undefined

          return (
            <div
              key={log.id}
              className="flex items-start gap-3 rounded-lg border border-border/60 bg-muted/30 p-3"
            >
              <div className="mt-0.5 rounded-full bg-background p-2 shadow-sm">
                <ActivityIcon type={log.activity_type} />
              </div>
              <div className="flex-1 space-y-1">
                <p className="text-sm font-medium text-foreground">
                  {log.description ?? log.activity_type.replace(/_/g, ' ')}
                </p>
                {(propertyTitle || propertyId) && (
                  <p className="text-xs text-muted-foreground">
                    {propertyTitle ? propertyTitle : `Property ID: ${propertyId}`}
                  </p>
                )}
                {rejectionReason && (
                  <p className="text-xs text-red-600">
                    Reason: {rejectionReason}
                  </p>
                )}
                <p className="text-xs text-muted-foreground">
                  {formatDistanceToNow(new Date(log.created_at), { addSuffix: true })}
                </p>
              </div>
            </div>
          )
        })}
      </div>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Recent Activity</CardTitle>
      </CardHeader>
      <CardContent>{content()}</CardContent>
    </Card>
  )
}
