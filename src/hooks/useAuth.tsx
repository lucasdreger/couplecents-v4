
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { useEffect } from 'react'
import { supabase } from '@/lib/supabaseClient'
import React, { createContext, useContext } from 'react'
import type { User } from '@supabase/supabase-js'
import { useToast } from '@/components/ui/use-toast'

interface AuthContextType {
  user: User | null
  isAuthenticated: boolean
  signIn: (email: string, password: string) => Promise<void>
  signOut: () => Promise<void>
  refreshUser: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const navigate = useNavigate()
  const { toast } = useToast()
  const queryClient = useQueryClient()

  // Use React Query for session management
  const { data: session, isError } = useQuery({
    queryKey: ['session'],
    queryFn: async () => {
      const { data: { session } } = await supabase.auth.getSession()
      return session
    }
  })

  // Listen for auth changes
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      queryClient.setQueryData(['session'], session)
    })

    return () => subscription.unsubscribe()
  }, [queryClient])

  // Auth change effect for navigation
  useEffect(() => {
    // Let PrivateRoute handle the navigation
    if (session && window.location.hash === '#/login') {
      navigate('/')
    }
  }, [session, navigate])

  const value = {
    user: session?.user ?? null,
    isAuthenticated: !!session,
    signIn: async (email: string, password: string) => {
      try {
        const { error } = await supabase.auth.signInWithPassword({ email, password })
        if (error) throw error
        navigate('/')
      } catch (error) {
        toast({
          variant: "destructive",
          title: "Authentication Error",
          description: error instanceof Error ? error.message : "Failed to sign in"
        })
        throw error
      }
    },
    signOut: async () => {
      try {
        const { error } = await supabase.auth.signOut()
        if (error) throw error
        navigate('/login')
      } catch (error) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to sign out"
        })
        throw error
      }
    },
    refreshUser: async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession()
        if (session) {
          const { data, error } = await supabase.auth.refreshSession({
            refresh_token: session.refresh_token,
          })
          if (error) throw error
          queryClient.setQueryData(['session'], data.session)
        }
      } catch (error) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to refresh user session"
        })
        throw error
      }
    }
  }

  if (isError) {
    toast({
      variant: "destructive",
      title: "Error",
      description: "Failed to check authentication status"
    })
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
