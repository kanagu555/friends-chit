import { supabase } from './supabase'

export type UserRole = 'admin' | 'member'

export interface AuthUser {
  id: string
  email: string
  role: UserRole
}

// Login function
export async function signIn(email: string, password: string) {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) throw error

    // Determine role based on email
    const role: UserRole = email === 'admin@chitfund.com' ? 'admin' : 'member'
    
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
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) return null

    const role: UserRole = user.email === 'admin@chitfund.com' ? 'admin' : 'member'
    
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
  return user?.role === 'member'
}