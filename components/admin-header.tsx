'use client'

import { useState } from 'react'
import { useAuth } from '@/lib/contexts/auth-context'
import { Button } from '@/components/ui/button'
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu'
import { Badge } from '@/components/ui/badge'
import { 
  Shield, 
  User, 
  LogOut, 
  Settings, 
  Activity,
  Bell,
  Menu
} from 'lucide-react'

export function AdminHeader() {
  const { user, logout } = useAuth()
  const [isLoggingOut, setIsLoggingOut] = useState(false)

  const handleLogout = async () => {
    setIsLoggingOut(true)
    try {
      await logout()
    } catch (error) {
      console.error('Logout error:', error)
    } finally {
      setIsLoggingOut(false)
    }
  }

  return (
    <div className="bg-gradient-to-r from-primary via-primary to-primary/90 text-primary-foreground shadow-2xl relative overflow-hidden backdrop-blur-sm">
      {/* Animated background pattern */}
      <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10"></div>
      <div className="absolute inset-0 bg-gradient-to-b from-transparent to-primary/20"></div>

      <div className="container mx-auto px-6 py-4 relative z-10">
        <div className="flex items-center justify-between">
          {/* Logo and Title */}
          <div className="flex items-center space-x-4 group">
            <div className="p-2 bg-primary-foreground/20 rounded-xl backdrop-blur-sm transition-all duration-300 hover:scale-110 hover:rotate-6 hover:bg-primary-foreground/30 cursor-pointer group-hover:shadow-lg">
              <Shield className="h-8 w-8 text-primary-foreground transition-transform duration-300 group-hover:rotate-12" />
            </div>
            <div className="transition-transform duration-300 hover:translate-x-1">
              <h1 className="text-2xl font-bold text-primary-foreground tracking-tight">
                AskNyumbani Admin
              </h1>
              <p className="text-primary-foreground/90 text-sm font-medium">
                Image Review & Approval System
              </p>
            </div>
          </div>

          {/* Right Side - User Info and Actions */}
          <div className="flex items-center space-x-2">
            {/* Notifications */}
            <Button
              variant="ghost"
              size="sm"
              className="relative text-primary-foreground hover:bg-primary-foreground/20 transition-all duration-300 hover:scale-110 rounded-xl"
            >
              <Bell className="h-5 w-5 transition-transform hover:rotate-12" />
              <span className="absolute top-1 right-1 h-2 w-2 bg-destructive rounded-full animate-pulse"></span>
            </Button>

            {/* Activity Log */}
            <Button
              variant="ghost"
              size="sm"
              className="text-primary-foreground hover:bg-primary-foreground/20 transition-all duration-300 hover:scale-110 rounded-xl"
            >
              <Activity className="h-5 w-5 transition-transform hover:rotate-12" />
            </Button>

            {/* User Menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="text-primary-foreground hover:bg-primary-foreground/20 p-2 transition-all duration-300 hover:scale-105 rounded-xl group"
                >
                  <div className="flex items-center space-x-3">
                    <div className="p-1 bg-primary-foreground/20 rounded-full transition-all duration-300 group-hover:scale-110 group-hover:rotate-6">
                      <User className="h-5 w-5" />
                    </div>
                    <div className="text-left">
                      <p className="text-sm font-medium text-primary-foreground">
                        {user?.full_name}
                      </p>
                      <div className="flex items-center space-x-2">
                        <Badge
                          variant="secondary"
                          className="bg-primary-foreground/20 text-primary-foreground text-xs transition-all duration-300 hover:bg-primary-foreground/30"
                        >
                          {user?.role === 'super_admin' ? 'Super Admin' : 'Admin'}
                        </Badge>
                      </div>
                    </div>
                    <Menu className="h-4 w-4 transition-transform group-hover:rotate-90 duration-300" />
                  </div>
                </Button>
              </DropdownMenuTrigger>

              <DropdownMenuContent align="end" className="w-56 animate-in slide-in-from-top-2 fade-in-0 duration-200 backdrop-blur-sm">
                <div className="px-2 py-1.5">
                  <p className="text-sm font-medium">{user?.full_name}</p>
                  <p className="text-xs text-muted-foreground">{user?.email}</p>
                </div>

                <DropdownMenuSeparator />

                <DropdownMenuItem className="cursor-pointer transition-all duration-200 hover:translate-x-1">
                  <User className="mr-2 h-4 w-4" />
                  Profile
                </DropdownMenuItem>

                <DropdownMenuItem className="cursor-pointer transition-all duration-200 hover:translate-x-1">
                  <Settings className="mr-2 h-4 w-4" />
                  Settings
                </DropdownMenuItem>

                <DropdownMenuItem className="cursor-pointer transition-all duration-200 hover:translate-x-1">
                  <Activity className="mr-2 h-4 w-4" />
                  Activity Log
                </DropdownMenuItem>

                <DropdownMenuSeparator />

                <DropdownMenuItem
                  onClick={handleLogout}
                  disabled={isLoggingOut}
                  className="text-destructive focus:text-destructive cursor-pointer transition-all duration-200 hover:translate-x-1"
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  {isLoggingOut ? 'Logging out...' : 'Logout'}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </div>
  )
}
