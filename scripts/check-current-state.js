const { createClient } = require('@supabase/supabase-js')

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase environment variables')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

async function checkCurrentState() {
  try {
    console.log('🔍 Checking current chit fund state...\n')

    // Get current chit fund
    const { data: chitFunds, error: chitError } = await supabase
      .from('chit_funds')
      .select('*')
      .eq('status', 'active')

    if (chitError) throw chitError

    if (!chitFunds || chitFunds.length === 0) {
      console.log('❌ No active chit fund found')
      return
    }

    const chitFund = chitFunds[0]
    console.log('📊 Chit Fund Details:')
    console.log(`   Name: ${chitFund.name}`)
    console.log(`   Current Month: ${chitFund.current_month}`)
    console.log(`   Start Date: ${chitFund.start_date}`)
    console.log(`   Status: ${chitFund.status}\n`)

    // Check draws for current month
    const { data: draws, error: drawError } = await supabase
      .from('chit_draws')
      .select('*')
      .eq('chit_fund_id', chitFund.id)
      .eq('month_number', chitFund.current_month)

    if (drawError) throw drawError

    console.log(`🎯 Draw for Month ${chitFund.current_month}:`)
    if (draws && draws.length > 0) {
      const draw = draws[0]
      console.log(`   Status: ${draw.status}`)
      console.log(`   Winner Participant ID: ${draw.winner_participant_id || 'None'}`)
      console.log(`   Winner Name: ${draw.winner_name || 'None'}`)
      console.log(`   Payout Amount: ₹${draw.payout_amount?.toLocaleString() || 'N/A'}`)
    } else {
      console.log('   No draw found for current month')
    }

    // Check participants
    const { data: participants, error: participantError } = await supabase
      .from('monthly_participants')
      .select(`
        *,
        members:member_id (
          name,
          email
        )
      `)
      .eq('chit_fund_id', chitFund.id)
      .eq('status', 'active')

    if (participantError) throw participantError

    console.log(`\n👥 Active Participants (${participants?.length || 0}):`)
    if (participants && participants.length > 0) {
      participants.forEach((p, index) => {
        console.log(`   ${index + 1}. ${p.members?.name || 'Unknown'} (${p.members?.email || 'No email'})`)
      })
    } else {
      console.log('   No active participants found')
    }

    // Check all draws
    const { data: allDraws, error: allDrawsError } = await supabase
      .from('chit_draws')
      .select('*')
      .eq('chit_fund_id', chitFund.id)
      .order('month_number')

    if (allDrawsError) throw allDrawsError

    console.log(`\n📅 All Draws:`)
    if (allDraws && allDraws.length > 0) {
      allDraws.forEach(draw => {
        console.log(`   Month ${draw.month_number}: ${draw.status} - Winner: ${draw.winner_name || 'None'}`)
      })
    } else {
      console.log('   No draws found')
    }

  } catch (error) {
    console.error('❌ Error:', error.message)
  }
}

checkCurrentState()