import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Database types
export interface Member {
  id: string
  name: string
  email: string
  phone: string
  cycles: number
  status: 'active' | 'inactive'
  created_at: string
  updated_at: string
}

export interface MemberInsert {
  name: string
  email: string
  phone: string
  cycles: number
  status?: 'active' | 'inactive'
}

export interface MemberUpdate {
  name?: string
  email?: string
  phone?: string
  cycles?: number
  status?: 'active' | 'inactive'
}