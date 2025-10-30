import { useState, useEffect } from 'react'
import { ChitParticipant, ChitFund } from '@/lib/chit-fund-types'

export function useChitParticipants(chitFundId?: string) {
  const [participants, setParticipants] = useState<ChitParticipant[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Fetch all participants for a chit fund
  const fetchParticipants = async () => {
    if (!chitFundId) {
      setLoading(false)
      return
    }

    try {
      setLoading(true)
      const { supabase } = await import('@/lib/supabase')
      
      const { data, error } = await supabase
        .from('chit_participants')
        .select(`
          *,
          members:member_id (
            id,
            name,
            email,
            phone
          )
        `)
        .eq('chit_fund_id', chitFundId)
        .order('created_at', { ascending: false })

      if (error) throw error
      
      // Transform data to include member details
      const transformedData = data?.map(participant => ({
        ...participant,
        member_name: participant.members?.name || 'Unknown',
        member_email: participant.members?.email || '',
        member_phone: participant.members?.phone || ''
      })) || []
      
      setParticipants(transformedData)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  // Add new participant
  const addParticipant = async (memberId: string) => {
    if (!chitFundId) return { success: false, error: 'No chit fund selected' }

    try {
      const { supabase } = await import('@/lib/supabase')
      
      // Check if member is already a participant
      const { data: existing } = await supabase
        .from('chit_participants')
        .select('id')
        .eq('chit_fund_id', chitFundId)
        .eq('member_id', memberId)
        .single()

      if (existing) {
        return { success: false, error: 'Member is already a participant' }
      }

      const { data, error } = await supabase
        .from('chit_participants')
        .insert([{
          chit_fund_id: chitFundId,
          member_id: memberId,
          status: 'active',
          total_paid: 0
        }])
        .select(`
          *,
          members:member_id (
            id,
            name,
            email,
            phone
          )
        `)
        .single()

      if (error) throw error
      
      const transformedData = {
        ...data,
        member_name: data.members?.name || 'Unknown',
        member_email: data.members?.email || '',
        member_phone: data.members?.phone || ''
      }
      
      setParticipants(prev => [transformedData, ...prev])
      return { success: true, data: transformedData }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to add participant'
      setError(errorMessage)
      return { success: false, error: errorMessage }
    }
  }

  // Add multiple participants
  const addMultipleParticipants = async (memberIds: string[]) => {
    if (!chitFundId) return { success: false, error: 'No chit fund selected' }

    try {
      const { supabase } = await import('@/lib/supabase')
      
      // Check for existing participants
      const { data: existing } = await supabase
        .from('chit_participants')
        .select('member_id')
        .eq('chit_fund_id', chitFundId)
        .in('member_id', memberIds)

      const existingMemberIds = existing?.map(p => p.member_id) || []
      const newMemberIds = memberIds.filter(id => !existingMemberIds.includes(id))

      if (newMemberIds.length === 0) {
        return { success: false, error: 'All selected members are already participants' }
      }

      const participantsToInsert = newMemberIds.map(memberId => ({
        chit_fund_id: chitFundId,
        member_id: memberId,
        status: 'active' as const,
        total_paid: 0
      }))

      const { data, error } = await supabase
        .from('chit_participants')
        .insert(participantsToInsert)
        .select(`
          *,
          members:member_id (
            id,
            name,
            email,
            phone
          )
        `)

      if (error) throw error
      
      const transformedData = data?.map(participant => ({
        ...participant,
        member_name: participant.members?.name || 'Unknown',
        member_email: participant.members?.email || '',
        member_phone: participant.members?.phone || ''
      })) || []
      
      setParticipants(prev => [...transformedData, ...prev])
      return { success: true, data: transformedData }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to add participants'
      setError(errorMessage)
      return { success: false, error: errorMessage }
    }
  }

  // Update participant status
  const updateParticipantStatus = async (participantId: string, status: 'active' | 'inactive' | 'winner') => {
    try {
      const { supabase } = await import('@/lib/supabase')
      
      const { data, error } = await supabase
        .from('chit_participants')
        .update({ 
          status,
          updated_at: new Date().toISOString()
        })
        .eq('id', participantId)
        .select(`
          *,
          members:member_id (
            id,
            name,
            email,
            phone
          )
        `)
        .single()

      if (error) throw error

      const transformedData = {
        ...data,
        member_name: data.members?.name || 'Unknown',
        member_email: data.members?.email || '',
        member_phone: data.members?.phone || ''
      }

      setParticipants(prev => prev.map(participant => 
        participant.id === participantId ? transformedData : participant
      ))
      
      return { success: true, data: transformedData }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update participant'
      setError(errorMessage)
      return { success: false, error: errorMessage }
    }
  }

  // Remove participant
  const removeParticipant = async (participantId: string) => {
    try {
      const { supabase } = await import('@/lib/supabase')
      
      const { error } = await supabase
        .from('chit_participants')
        .delete()
        .eq('id', participantId)

      if (error) throw error

      setParticipants(prev => prev.filter(participant => participant.id !== participantId))
      return { success: true }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to remove participant'
      setError(errorMessage)
      return { success: false, error: errorMessage }
    }
  }

  // Update payment amount
  const updatePaymentAmount = async (participantId: string, totalPaid: number) => {
    try {
      const { supabase } = await import('@/lib/supabase')
      
      const { data, error } = await supabase
        .from('chit_participants')
        .update({ 
          total_paid: totalPaid,
          updated_at: new Date().toISOString()
        })
        .eq('id', participantId)
        .select(`
          *,
          members:member_id (
            id,
            name,
            email,
            phone
          )
        `)
        .single()

      if (error) throw error

      const transformedData = {
        ...data,
        member_name: data.members?.name || 'Unknown',
        member_email: data.members?.email || '',
        member_phone: data.members?.phone || ''
      }

      setParticipants(prev => prev.map(participant => 
        participant.id === participantId ? transformedData : participant
      ))
      
      return { success: true, data: transformedData }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update payment'
      setError(errorMessage)
      return { success: false, error: errorMessage }
    }
  }

  useEffect(() => {
    fetchParticipants()
  }, [chitFundId])

  return {
    participants,
    loading,
    error,
    addParticipant,
    addMultipleParticipants,
    updateParticipantStatus,
    removeParticipant,
    updatePaymentAmount,
    refetch: fetchParticipants
  }
}