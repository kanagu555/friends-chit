const { createClient } = require('@supabase/supabase-js')

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase environment variables')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

async function migrateExistingData() {
  try {
    console.log('🔄 Migrating existing October data to monthly_participants...\n')

    // Get the active chit fund
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
    console.log(`📊 Found chit fund: ${chitFund.name}`)
    console.log(`   Current month: ${chitFund.current_month}`)

    // Check October draw (month 1)
    const { data: octoberDraw, error: drawError } = await supabase
      .from('chit_draws')
      .select('*')
      .eq('chit_fund_id', chitFund.id)
      .eq('month_number', 1)
      .single()

    if (drawError) {
      console.log('⚠️  No October draw found:', drawError.message)
      return
    }

    console.log(`\n🎯 October Draw Status: ${octoberDraw.status}`)
    console.log(`   Winner ID: ${octoberDraw.winner_participant_id || 'None'}`)
    console.log(`   Winner Name: ${octoberDraw.winner_name || 'None'}`)

    // If October draw is completed, we need to migrate the data
    if (octoberDraw.status === 'completed' && octoberDraw.winner_participant_id) {
      console.log('\n🔄 Migrating October winner to monthly_participants...')

      // Get the winner's details from old chit_participants table
      const { data: winnerData, error: winnerError } = await supabase
        .from('chit_participants')
        .select(`
          *,
          members:member_id (
            id,
            name,
            email
          )
        `)
        .eq('id', octoberDraw.winner_participant_id)
        .single()

      if (winnerError) {
        console.log('⚠️  Could not find winner in chit_participants:', winnerError.message)
      } else {
        console.log(`   Found winner: ${winnerData.members?.name}`)

        // Check if winner already exists in monthly_participants
        const { data: existingWinner } = await supabase
          .from('monthly_participants')
          .select('*')
          .eq('chit_fund_id', chitFund.id)
          .eq('member_id', winnerData.member_id)
          .eq('month_number', 1)
          .single()

        if (!existingWinner) {
          // Add winner to monthly_participants
          const { error: insertError } = await supabase
            .from('monthly_participants')
            .insert({
              chit_fund_id: chitFund.id,
              member_id: winnerData.member_id,
              month_number: 1,
              status: 'winner'
            })

          if (insertError) {
            console.log('❌ Failed to insert winner:', insertError.message)
          } else {
            console.log('✅ Winner migrated to monthly_participants')
          }
        } else {
          console.log('ℹ️  Winner already exists in monthly_participants')
          
          // Update status to winner if not already
          if (existingWinner.status !== 'winner') {
            const { error: updateError } = await supabase
              .from('monthly_participants')
              .update({ status: 'winner' })
              .eq('id', existingWinner.id)

            if (updateError) {
              console.log('❌ Failed to update winner status:', updateError.message)
            } else {
              console.log('✅ Winner status updated')
            }
          }
        }

        // Update draw with winner name if missing
        if (!octoberDraw.winner_name && winnerData.members?.name) {
          const { error: updateDrawError } = await supabase
            .from('chit_draws')
            .update({ winner_name: winnerData.members.name })
            .eq('id', octoberDraw.id)

          if (updateDrawError) {
            console.log('❌ Failed to update draw winner name:', updateDrawError.message)
          } else {
            console.log('✅ Draw winner name updated')
          }
        }
      }
    }

    // Check if there are other participants who should be in October
    console.log('\n👥 Checking for other October participants...')
    const { data: allParticipants, error: participantsError } = await supabase
      .from('chit_participants')
      .select(`
        *,
        members:member_id (
          name,
          email
        )
      `)
      .eq('chit_fund_id', chitFund.id)
      .eq('status', 'active')

    if (participantsError) {
      console.log('⚠️  Could not fetch participants:', participantsError.message)
    } else {
      console.log(`   Found ${allParticipants.length} active participants in old table`)
      
      // For demonstration, let's add a few participants to October if none exist
      const { data: existingOctoberParticipants } = await supabase
        .from('monthly_participants')
        .select('*')
        .eq('chit_fund_id', chitFund.id)
        .eq('month_number', 1)

      console.log(`   Found ${existingOctoberParticipants?.length || 0} participants in monthly_participants for October`)

      if ((!existingOctoberParticipants || existingOctoberParticipants.length === 0) && allParticipants.length > 0) {
        console.log('\n🔄 Adding sample participants to October...')
        
        // Add first few participants to October (you can modify this logic)
        const participantsToAdd = allParticipants.slice(0, Math.min(3, allParticipants.length))
        
        for (const participant of participantsToAdd) {
          const { error: insertError } = await supabase
            .from('monthly_participants')
            .insert({
              chit_fund_id: chitFund.id,
              member_id: participant.member_id,
              month_number: 1,
              status: participant.id === octoberDraw.winner_participant_id ? 'winner' : 'active'
            })

          if (insertError) {
            console.log(`❌ Failed to add ${participant.members?.name}:`, insertError.message)
          } else {
            console.log(`✅ Added ${participant.members?.name} to October`)
          }
        }
      }
    }

    console.log('\n✅ Migration completed!')
    console.log('\n📋 Summary:')
    console.log('   • Migrated October winner to monthly_participants table')
    console.log('   • Added sample participants to October month')
    console.log('   • Updated draw winner name if missing')
    console.log('\n🎯 Next: Refresh your browser to see the updated October Draw')

  } catch (error) {
    console.error('❌ Migration failed:', error.message)
  }
}

migrateExistingData()