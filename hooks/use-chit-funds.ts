import { useState, useEffect } from 'react'
import { ChitFund } from '@/lib/chit-fund-types'

export function useChitFunds() {
  const [chitFunds, setChitFunds] = useState<ChitFund[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Fetch all chit funds
  const fetchChitFunds = async () => {
    try {
      setLoading(true)
      const { supabase } = await import('@/lib/supabase')
      
      const { data, error } = await supabase
        .from('chit_funds')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error
      setChitFunds(data || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  // Get current active chit fund
  const getCurrentChitFund = () => {
    return chitFunds.find(chit => chit.status === 'active') || chitFunds[0]
  }

  useEffect(() => {
    fetchChitFunds()
  }, [])

  return {
    chitFunds,
    loading,
    error,
    getCurrentChitFund,
    refetch: fetchChitFunds
  }
}