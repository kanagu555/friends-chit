import { useState, useEffect } from 'react'
import { ChitParticipant } from '@/lib/chit-fund-types'

export function useMonthlyParticipants(chitFundId?: string, currentMonth?: number) {
  const [monthlyParticipants, setMonthlyParticipants] = useState<ChitParticipant[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [hasWinnerThisMonth, setHasWinnerThisMonth] = useState(false)

  // Fetch participants for current month's auction
  const fetchMonthlyParticipants = async () => {
    if (!chitFundId || !currentMonth) {
      setLoading(false)
      return
    }

    try {
      setLoading(true)
      const { supabase } = await import('@/lib/supabase')
      
      // Check if there's already a winner for this month
      const { data: drawData } = await supabase
        .from('chit_draws')
        .select('winner_participant_id, status')
        .eq('chit_fund_id', chitFundId)
        .eq('month_number', currentMonth)
        .single()

      // Only consider it has winner if there's actually a winner participant ID
      if (drawData?.winner_participant_id && drawData?.status === 'completed') {
        setHasWinnerThisMonth(true)
        setMonthlyParticipants([])
        setLoading(false)
        return
      } else {
        setHasWinnerThisMonth(false)
      }

      // Fetch participants for this specific month
      const { data, error } = await supabase
        .from('monthly_participants')
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
        .eq('month_number', currentMonth)
        .eq('status', 'active')
        .order('created_at', { ascending: false })

      if (error) throw error
      
      // Transform data to include member details
      const transformedData = data?.map(participant => ({
        ...participant,
        member_name: participant.members?.name || 'Unknown',
        member_email: participant.members?.email || '',
        member_phone: participant.members?.phone || ''
      })) || []
      
      setMonthlyParticipants(transformedData)
      setHasWinnerThisMonth(false)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  // Add participant for this month's auction
  const addMonthlyParticipant = async (memberId: string) => {
    if (!chitFundId || !currentMonth) return { success: false, error: 'No chit fund or month selected' }

    try {
      const { supabase } = await import('@/lib/supabase')
      
      // Check if member is already a participant for this month
      const { data: existing } = await supabase
        .from('monthly_participants')
        .select('id')
        .eq('chit_fund_id', chitFundId)
        .eq('member_id', memberId)
        .eq('month_number', currentMonth)
        .single()

      if (existing) {
        return { success: false, error: 'Member is already a participant for this month' }
      }

      const { data, error } = await supabase
        .from('monthly_participants')
        .insert([{
          chit_fund_id: chitFundId,
          member_id: memberId,
          month_number: currentMonth,
          status: 'active'
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
      
      setMonthlyParticipants(prev => [transformedData, ...prev])
      return { success: true, data: transformedData }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to add participant'
      setError(errorMessage)
      return { success: false, error: errorMessage }
    }
  }

  // Add multiple participants for this month
  const addMultipleMonthlyParticipants = async (memberIds: string[]) => {
    if (!chitFundId || !currentMonth) return { success: false, error: 'No chit fund or month selected' }

    try {
      const { supabase } = await import('@/lib/supabase')
      
      // Check for existing participants for this specific month
      const { data: existing } = await supabase
        .from('monthly_participants')
        .select('member_id')
        .eq('chit_fund_id', chitFundId)
        .eq('month_number', currentMonth)
        .in('member_id', memberIds)

      const existingMemberIds = existing?.map(p => p.member_id) || []
      const newMemberIds = memberIds.filter(id => !existingMemberIds.includes(id))

      if (newMemberIds.length === 0) {
        return { success: false, error: 'All selected members are already participants for this month' }
      }

      const participantsToInsert = newMemberIds.map(memberId => ({
        chit_fund_id: chitFundId,
        member_id: memberId,
        month_number: currentMonth,
        status: 'active' as const
      }))

      const { data, error } = await supabase
        .from('monthly_participants')
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
      
      setMonthlyParticipants(prev => [...transformedData, ...prev])
      return { success: true, data: transformedData }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to add participants'
      setError(errorMessage)
      return { success: false, error: errorMessage }
    }
  }

  // Declare winner and update draw
  const declareMonthlyWinner = async (participantId: string) => {
    if (!chitFundId || !currentMonth) return { success: false, error: 'Missing required data' }

    try {
      const { supabase } = await import('@/lib/supabase')
      
      // Update monthly participant status to winner
      const { error: participantError } = await supabase
        .from('monthly_participants')
        .update({ status: 'winner' })
        .eq('id', participantId)

      if (participantError) throw participantError

      // Update the draw with winner
      const { error: drawError } = await supabase
        .from('chit_draws')
        .update({ 
          winner_participant_id: participantId,
          status: 'completed'
        })
        .eq('chit_fund_id', chitFundId)
        .eq('month_number', currentMonth)

      if (drawError) throw drawError

      // Set winner selected for this month
      setHasWinnerThisMonth(true)
      setMonthlyParticipants([])
      
      return { success: true }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to declare winner'
      setError(errorMessage)
      return { success: false, error: errorMessage }
    }
  }

  // Remove participant from this month's auction
  const removeMonthlyParticipant = async (participantId: string) => {
    try {
      const { supabase } = await import('@/lib/supabase')
      
      const { error } = await supabase
        .from('monthly_participants')
        .delete()
        .eq('id', participantId)

      if (error) throw error

      setMonthlyParticipants(prev => prev.filter(participant => participant.id !== participantId))
      return { success: true }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to remove participant'
      setError(errorMessage)
      return { success: false, error: errorMessage }
    }
  }

  useEffect(() => {
    fetchMonthlyParticipants()
  }, [chitFundId, currentMonth])

  return {
    monthlyParticipants,
    hasWinnerThisMonth,
    loading,
    error,
    addMonthlyParticipant,
    addMultipleMonthlyParticipants,
    declareMonthlyWinner,
    removeMonthlyParticipant,
    refetch: fetchMonthlyParticipants
  }
}