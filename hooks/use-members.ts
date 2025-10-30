import { useState, useEffect } from 'react'
import { Member, MemberInsert, MemberUpdate } from '@/lib/supabase'

export function useMembers() {
  const [members, setMembers] = useState<Member[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Fetch all members
  const fetchMembers = async () => {
    try {
      // Only run on client side
      if (typeof window === 'undefined') {
        setLoading(false)
        return
      }

      setLoading(true)
      const { supabase } = await import('@/lib/supabase')
      const { data, error } = await supabase
        .from('members')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error
      setMembers(data || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  // Add new member
  const addMember = async (memberData: MemberInsert) => {
    try {
      const { supabase } = await import('@/lib/supabase')
      const { data, error } = await supabase
        .from('members')
        .insert([{ ...memberData, status: memberData.status || 'active' }])
        .select()
        .single()

      if (error) throw error
      
      setMembers(prev => [data, ...prev])
      return { success: true, data }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to add member'
      setError(errorMessage)
      return { success: false, error: errorMessage }
    }
  }

  // Update member
  const updateMember = async (id: string, updates: MemberUpdate) => {
    try {
      const { supabase } = await import('@/lib/supabase')
      const { data, error } = await supabase
        .from('members')
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq('id', id)
        .select()
        .single()

      if (error) throw error

      setMembers(prev => prev.map(member => 
        member.id === id ? data : member
      ))
      return { success: true, data }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update member'
      setError(errorMessage)
      return { success: false, error: errorMessage }
    }
  }

  // Delete member
  const deleteMember = async (id: string) => {
    try {
      const { supabase } = await import('@/lib/supabase')
      const { error } = await supabase
        .from('members')
        .delete()
        .eq('id', id)

      if (error) throw error

      setMembers(prev => prev.filter(member => member.id !== id))
      return { success: true }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete member'
      setError(errorMessage)
      return { success: false, error: errorMessage }
    }
  }

  useEffect(() => {
    fetchMembers()
  }, [])

  return {
    members,
    loading,
    error,
    addMember,
    updateMember,
    deleteMember,
    refetch: fetchMembers
  }
}