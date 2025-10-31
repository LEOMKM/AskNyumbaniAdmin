'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/contexts/auth-context'
import { ImageReviewDashboard } from '@/components/image-review-dashboard'
import { AdminHeader } from '@/components/admin-header'

export default function HomePage() {
  const { user, isLoading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/login')
    }
  }, [user, isLoading, router])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4 animate-in fade-in zoom-in duration-500">
          <div className="relative">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-primary/30 border-t-primary"></div>
            <div className="absolute inset-0 animate-ping rounded-full h-16 w-16 border-4 border-primary/20"></div>
          </div>
          <span className="text-muted-foreground animate-pulse text-lg font-medium">Loading Dashboard...</span>
        </div>
      </div>
    )
  }

  if (!user) {
    return null // Will redirect to login
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 animate-in fade-in duration-500">
      <div className="animate-in slide-in-from-top duration-500">
        <AdminHeader />
      </div>
      <div className="animate-in fade-in slide-in-from-bottom duration-700 delay-150">
        <ImageReviewDashboard />
      </div>
    </main>
  )
}
