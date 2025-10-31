'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/contexts/auth-context'
import { PinForm } from '@/components/auth/pin-form'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Shield, Sparkles } from 'lucide-react'

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
        <div className="flex items-center space-x-3 animate-in fade-in duration-500">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          <span className="text-muted-foreground animate-pulse">Loading...</span>
        </div>
      </div>
    )
  }

  if (user) {
    return null // Will redirect
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-primary/5 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      {/* Header */}
      <div className="bg-gradient-to-r from-primary via-primary to-primary/90 text-primary-foreground shadow-2xl relative overflow-hidden animate-in slide-in-from-top duration-700">
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10"></div>
        <div className="container mx-auto px-6 py-8 relative z-10">
          <div className="flex items-center justify-center space-x-4 animate-in fade-in zoom-in duration-700 delay-200">
            <div className="p-3 bg-primary-foreground/20 rounded-2xl backdrop-blur-sm transition-all duration-300 hover:scale-110 hover:rotate-6 hover:bg-primary-foreground/30 cursor-pointer group">
              <Shield className="h-10 w-10 text-primary-foreground transition-transform group-hover:rotate-12" />
            </div>
            <div className="text-center">
              <h1 className="text-4xl font-bold text-primary-foreground tracking-tight flex items-center gap-2 justify-center">
                AskNyumbani Admin
                <Sparkles className="h-6 w-6 animate-pulse" />
              </h1>
              <p className="text-primary-foreground/90 mt-1 text-lg">
                Image Review & Approval System
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* PIN Login Form */}
      <div className="container mx-auto px-6 py-12 relative z-10">
        <div className="max-w-md mx-auto animate-in fade-in slide-in-from-bottom duration-700 delay-300">
          <Card className="shadow-2xl border-2 hover:shadow-3xl transition-all duration-300 hover:scale-[1.02] backdrop-blur-sm bg-card/95">
            <CardHeader className="text-center pb-6">
              <div className="mx-auto mb-4 p-4 bg-gradient-to-br from-primary/20 to-primary/10 rounded-2xl w-fit transition-all duration-300 hover:scale-110 hover:rotate-6 animate-in zoom-in duration-500 delay-500 group">
                <Shield className="h-10 w-10 text-primary transition-transform group-hover:rotate-12" />
              </div>

              <CardTitle className="text-3xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent animate-in fade-in duration-500 delay-600">
                Admin Login
              </CardTitle>

              <CardDescription className="text-base animate-in fade-in duration-500 delay-700">
                Enter your 4-digit PIN to access the admin panel
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-6 animate-in fade-in duration-500 delay-800">
              <PinForm
                onSuccess={() => router.push('/')}
              />
            </CardContent>
          </Card>

          {/* Footer */}
          <div className="text-center mt-8 text-sm text-muted-foreground space-y-2 animate-in fade-in duration-700 delay-1000">
            <p className="transition-colors hover:text-foreground cursor-default">© 2024 Codzure Solutions Limited. All rights reserved.</p>
            <p className="transition-colors hover:text-foreground cursor-default">AskNyumbani Real Estate Platform</p>
          </div>
        </div>
      </div>
    </div>
  )
}
