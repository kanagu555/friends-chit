import { getUserRole, UserRole } from './user-roles'

export interface AuthUser {
  id: string
  email: string
  role: UserRole
}

// Login function
export async function signIn(email: string, password: string) {
  try {
    const { supabase } = await import('./supabase')
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) throw error

    // Determine role based on configured roles
    const role = getUserRole(data.user.email!)
    
    console.log('🔍 Login Debug:', {
      email: data.user.email,
      detectedRole: role,
      timestamp: new Date().toISOString()
    })
    
    return {
      success: true,
      user: {
        id: data.user.id,
        email: data.user.email!,
        role,
      } as AuthUser,
    }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Login failed',
    }
  }
}

// Logout function
export async function signOut() {
  try {
    const { supabase } = await import('./supabase')
    const { error } = await supabase.auth.signOut()
    if (error) throw error
    return { success: true }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Logout failed',
    }
  }
}

// Get current user
export async function getCurrentUser(): Promise<AuthUser | null> {
  try {
    // Only run on client side
    if (typeof window === 'undefined') {
      return null
    }

    const { supabase } = await import('./supabase')
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) return null

    // Determine role based on configured roles
    const role = getUserRole(user.email!)
    
    return {
      id: user.id,
      email: user.email!,
      role,
    }
  } catch (error) {
    return null
  }
}

// Check if user has admin role
export function isAdmin(user: AuthUser | null): boolean {
  return user?.role === 'admin'
}

// Check if user has member role
export function isMember(user: AuthUser | null): boolean {
  return user?.role === 'member' || user?.role === 'admin' // Admins can access member features
}