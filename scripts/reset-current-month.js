// Script to reset current month draw status
// Use this if the Add Participants button is not showing
// Run with: npm run reset-month

import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'

// Load environment variables
dotenv.config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ Missing required environment variables')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseAnonKey)

async function resetCurrentMonth() {
  console.log('🔧 Resetting current month draw status...')

  try {
    // Get the current chit fund
    const { data: chitFund } = await supabase
      .from('chit_funds')
      .select('*')
      .eq('status', 'active')
      .single()

    if (!chitFund) {
      console.log('❌ No active chit fund found')
      return
    }

    const currentMonth = chitFund.current_month || 1
    console.log(`📅 Current month: ${currentMonth}`)

    // Reset the current month's draw to pending with no winner
    const { error: drawError } = await supabase
      .from('chit_draws')
      .update({
        winner_participant_id: null,
        status: 'pending'
      })
      .eq('chit_fund_id', chitFund.id)
      .eq('month_number', currentMonth)

    if (drawError) {
      console.error('❌ Error resetting draw:', drawError.message)
      return
    }

    // Clear any winner status from participants for this month
    const { error: participantError } = await supabase
      .from('monthly_participants')
      .update({ status: 'active' })
      .eq('chit_fund_id', chitFund.id)
      .eq('status', 'winner')

    if (participantError) {
      console.error('❌ Error resetting participants:', participantError.message)
      return
    }

    console.log('✅ Current month reset successfully!')
    console.log('📋 Changes made:')
    console.log(`   - Month ${currentMonth} draw set to pending`)
    console.log('   - Winner participant ID cleared')
    console.log('   - All winner participants set to active')
    console.log('\n🚀 Refresh your admin dashboard - Add Participants button should now appear!')

  } catch (error) {
    console.error('❌ Error:', error)
  }
}

resetCurrentMonth()