import { useState, useEffect } from 'react'
import { AuthUser, getCurrentUser, signIn, signOut } from '@/lib/auth'

export function useAuth() {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Only run on client side
    if (typeof window === 'undefined') {
      setLoading(false)
      return
    }

    // Get initial session
    const getInitialSession = async () => {
      try {
        const currentUser = await getCurrentUser()
        setUser(currentUser)
      } catch (error) {
        console.error('Error getting current user:', error)
        setUser(null)
      } finally {
        setLoading(false)
      }
    }

    getInitialSession()

    // Listen for auth changes
    let subscription: any = null
    
    const setupAuthListener = async () => {
      try {
        const { supabase } = await import('@/lib/supabase')
        const { data: { subscription: authSubscription } } = supabase.auth.onAuthStateChange(
          async (event, session) => {
            if (session?.user) {
              const { getUserRole } = await import('@/lib/user-roles')
              const role = getUserRole(session.user.email!)
              
              console.log('🔍 Auth State Change:', {
                email: session.user.email,
                detectedRole: role,
                event,
                timestamp: new Date().toISOString()
              })
              
              setUser({
                id: session.user.id,
                email: session.user.email!,
                role,
              })
            } else {
              setUser(null)
            }
            setLoading(false)
          }
        )
        subscription = authSubscription
      } catch (error) {
        console.error('Error setting up auth listener:', error)
        setLoading(false)
      }
    }

    setupAuthListener()

    return () => {
      if (subscription) {
        subscription.unsubscribe()
      }
    }
  }, [])

  const login = async (email: string, password: string) => {
    setLoading(true)
    const result = await signIn(email, password)
    setLoading(false)
    return result
  }

  const logout = async () => {
    setLoading(true)
    const result = await signOut()
    if (result.success) {
      setUser(null)
    }
    setLoading(false)
    return result
  }

  return {
    user,
    loading,
    login,
    logout,
    isAuthenticated: !!user,
    isAdmin: user?.role === 'admin',
    isMember: user?.role === 'member',
  }
}