'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/contexts/auth-context'
import { PinForm } from '@/components/auth/pin-form'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Shield } from 'lucide-react'

export default function LoginPage() {
  const { user, isLoading } = useAuth()
  const router = useRouter()

  // Redirect if already logged in
  useEffect(() => {
    if (!isLoading && user) {
      router.push('/')
    }
  }, [user, isLoading, router])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex items-center space-x-3">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          <span className="text-muted-foreground">Loading...</span>
        </div>
      </div>
    )
  }

  if (user) {
    return null // Will redirect
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-primary text-primary-foreground shadow-lg">
        <div className="container mx-auto px-6 py-6">
          <div className="flex items-center justify-center space-x-3">
            <div className="p-2 bg-primary-foreground/20 rounded-lg">
              <Shield className="h-8 w-8 text-primary-foreground" />
            </div>
            <div className="text-center">
              <h1 className="text-3xl font-bold text-primary-foreground">
                AskNyumbani Admin
              </h1>
              <p className="text-primary-foreground/80">
                Image Review & Approval System
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* PIN Login Form */}
      <div className="container mx-auto px-6 py-12">
        <div className="max-w-md mx-auto">
          <Card className="shadow-xl">
            <CardHeader className="text-center pb-6">
              <div className="mx-auto mb-4 p-3 bg-primary/10 rounded-full w-fit">
                <Shield className="h-8 w-8 text-primary" />
              </div>

              <CardTitle className="text-2xl">
                Admin Login
              </CardTitle>

              <CardDescription>
                Enter your 4-digit PIN to access the admin panel
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-6">
              <PinForm
                onSuccess={() => router.push('/')}
              />
            </CardContent>
          </Card>

          {/* Footer */}
          <div className="text-center mt-8 text-sm text-muted-foreground">
            <p>© 2025 Codzure Group. All rights reserved.</p>
            <p className="mt-1">AskNyumbani Real Estate Platform</p>
          </div>
        </div>
      </div>
    </div>
  )
}
