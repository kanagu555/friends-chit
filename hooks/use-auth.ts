import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { AuthUser, getCurrentUser, signIn, signOut } from '@/lib/auth'

export function useAuth() {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Get initial session
    const getInitialSession = async () => {
      const currentUser = await getCurrentUser()
      setUser(currentUser)
      setLoading(false)
    }

    getInitialSession()

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (session?.user) {
          const role = session.user.email === 'admin@chitfund.com' ? 'admin' : 'member'
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

    return () => subscription.unsubscribe()
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