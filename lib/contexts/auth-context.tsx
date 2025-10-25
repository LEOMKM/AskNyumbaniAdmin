'use client'

import React, { createContext, useContext, useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase/client'

interface AdminUser {
  id: string
  email: string
  full_name: string
  role: 'admin' | 'super_admin'
  is_active: boolean
  is_first_login: boolean
}

interface AuthContextType {
  user: AdminUser | null
  sessionToken: string | null
  isLoading: boolean
  login: (email: string, password: string) => Promise<{ success: boolean; message: string }>
  loginWithPin: (pin: string) => Promise<{ success: boolean; message: string }>
  createPin: (pin: string) => Promise<{ success: boolean; message: string }>
  logout: () => Promise<void>
  refreshSession: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AdminUser | null>(null)
  const [sessionToken, setSessionToken] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // Check for existing session on mount
  useEffect(() => {
    const token = localStorage.getItem('admin_session_token')
    if (token) {
      validateSession(token)
    } else {
      setIsLoading(false)
    }
  }, [])

  const validateSession = async (token: string) => {
    try {
      const { data, error } = await supabase.rpc('validate_admin_session', {
        p_session_token: token
      })

      if (error || !data || data.length === 0) {
        localStorage.removeItem('admin_session_token')
        setSessionToken(null)
        setUser(null)
        setIsLoading(false)
        return
      }

      const adminData = data[0]
      setUser({
        id: adminData.admin_user_id,
        email: adminData.email,
        full_name: adminData.full_name,
        role: adminData.role,
        is_active: adminData.is_active,
        is_first_login: false // This would come from the database
      })
      setSessionToken(token)
    } catch (error) {
      console.error('Session validation error:', error)
      localStorage.removeItem('admin_session_token')
      setSessionToken(null)
      setUser(null)
    } finally {
      setIsLoading(false)
    }
  }

  const login = async (email: string, password: string) => {
    try {
      setIsLoading(true)
      
      // Call the login function
      const { data, error } = await supabase.rpc('admin_login', {
        p_email: email,
        p_password: password
      })

      if (error) {
        return { success: false, message: error.message }
      }

      if (!data || data.length === 0) {
        return { success: false, message: 'Invalid email or password' }
      }

      const adminData = data[0]
      const token = adminData.session_token

      // Store session token
      localStorage.setItem('admin_session_token', token)
      setSessionToken(token)

      // Set user data
      setUser({
        id: adminData.admin_user_id,
        email: adminData.email,
        full_name: adminData.full_name,
        role: adminData.role,
        is_active: adminData.is_active,
        is_first_login: adminData.is_first_login
      })

      return { success: true, message: 'Login successful' }
    } catch (error) {
      console.error('Login error:', error)
      return { success: false, message: 'An error occurred during login' }
    } finally {
      setIsLoading(false)
    }
  }

  const loginWithPin = async (pin: string) => {
    try {
      setIsLoading(true)
      
      const { data, error } = await supabase.rpc('admin_login_with_pin', {
        p_pin: pin
      })

      if (error) {
        return { success: false, message: error.message }
      }

      if (!data || data.length === 0) {
        return { success: false, message: 'Invalid PIN' }
      }

      const adminData = data[0]
      const token = adminData.session_token

      localStorage.setItem('admin_session_token', token)
      setSessionToken(token)

      setUser({
        id: adminData.admin_user_id,
        email: adminData.email,
        full_name: adminData.full_name,
        role: adminData.role,
        is_active: adminData.is_active,
        is_first_login: false
      })

      return { success: true, message: 'Login successful' }
    } catch (error) {
      console.error('PIN login error:', error)
      return { success: false, message: 'An error occurred during PIN login' }
    } finally {
      setIsLoading(false)
    }
  }

  const createPin = async (pin: string) => {
    try {
      if (!user) {
        return { success: false, message: 'No user logged in' }
      }

      const { error } = await supabase.rpc('create_admin_pin', {
        p_admin_user_id: user.id,
        p_pin: pin
      })

      if (error) {
        return { success: false, message: error.message }
      }

      return { success: true, message: 'PIN created successfully' }
    } catch (error) {
      console.error('Create PIN error:', error)
      return { success: false, message: 'An error occurred creating PIN' }
    }
  }

  const logout = async () => {
    try {
      if (sessionToken) {
        // Invalidate session on server
        await supabase.rpc('invalidate_admin_session', {
          p_session_token: sessionToken
        })
      }
    } catch (error) {
      console.error('Logout error:', error)
    } finally {
      localStorage.removeItem('admin_session_token')
      setSessionToken(null)
      setUser(null)
    }
  }

  const refreshSession = async () => {
    if (sessionToken) {
      await validateSession(sessionToken)
    }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        sessionToken,
        isLoading,
        login,
        loginWithPin,
        createPin,
        logout,
        refreshSession
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
