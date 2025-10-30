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
    console.error('🚨 Login Error:', error)
    
    // Handle specific Supabase auth errors
    let errorMessage = 'Login failed'
    
    if (error && typeof error === 'object' && 'message' in error) {
      const authError = error as any
      
      switch (authError.message) {
        case 'Invalid login credentials':
          errorMessage = 'Invalid email or password. Please check your credentials and try again.'
          break
        case 'Email not confirmed':
          errorMessage = 'Please check your email and click the confirmation link before signing in.'
          break
        case 'Too many requests':
          errorMessage = 'Too many login attempts. Please wait a moment and try again.'
          break
        case 'User not found':
          errorMessage = 'No account found with this email address.'
          break
        default:
          errorMessage = authError.message || 'Login failed'
      }
    } else if (error instanceof Error) {
      errorMessage = error.message
    }
    
    return {
      success: false,
      error: errorMessage,
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