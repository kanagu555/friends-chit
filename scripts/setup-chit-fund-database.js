// Script to setup chit fund database tables and sample data
// Run with: npm run setup-chit-db

import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'

// Load environment variables
dotenv.config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing required environment variables')
  console.error('Make sure you have NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in your .env.local')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})

async function setupChitFundDatabase() {
  console.log('🔧 Setting up Chit Fund Database...')

  try {
    // Create sample chit fund
    console.log('📊 Creating sample chit fund...')
    const { data: chitFund, error: chitError } = await supabase
      .from('chit_funds')
      .insert([{
        name: '1 Lakh Chit',
        total_amount: 100000,
        monthly_payment: 10000,
        duration_months: 10,
        start_date: '2025-10-10',
        status: 'active',
        current_month: 1
      }])
      .select()
      .single()

    if (chitError) {
      if (chitError.message.includes('already exists') || chitError.code === '23505') {
        console.log('ℹ️  Chit fund already exists, fetching existing...')
        const { data: existing } = await supabase
          .from('chit_funds')
          .select('*')
          .eq('name', '1 Lakh Chit')
          .single()
        
        if (existing) {
          console.log('✅ Using existing chit fund:', existing.name)
        }
      } else {
        throw chitError
      }
    } else {
      console.log('✅ Chit fund created:', chitFund.name)
    }

    // Get the chit fund ID
    const { data: currentChit } = await supabase
      .from('chit_funds')
      .select('*')
      .eq('name', '1 Lakh Chit')
      .single()

    if (!currentChit) {
      throw new Error('Failed to get chit fund')
    }

    // Create sample draws
    console.log('🎲 Creating sample draws...')
    const draws = [
      { month_number: 1, draw_date: '2025-10-10', payout_amount: 95500, benefit_amount: -4500, status: 'pending' },
      { month_number: 2, draw_date: '2025-11-10', payout_amount: 96500, benefit_amount: -3500, status: 'pending' },
      { month_number: 3, draw_date: '2025-12-10', payout_amount: 97500, benefit_amount: -2500, status: 'pending' },
      { month_number: 4, draw_date: '2026-01-10', payout_amount: 98500, benefit_amount: -1500, status: 'pending' },
      { month_number: 5, draw_date: '2026-02-10', payout_amount: 99500, benefit_amount: -500, status: 'pending' },
      { month_number: 6, draw_date: '2026-03-10', payout_amount: 100500, benefit_amount: 500, status: 'pending' },
      { month_number: 7, draw_date: '2026-04-10', payout_amount: 101500, benefit_amount: 1500, status: 'pending' },
      { month_number: 8, draw_date: '2026-05-10', payout_amount: 102500, benefit_amount: 2500, status: 'pending' },
      { month_number: 9, draw_date: '2026-06-10', payout_amount: 103500, benefit_amount: 3500, status: 'pending' },
      { month_number: 10, draw_date: '2026-07-10', payout_amount: 104500, benefit_amount: 4500, status: 'pending' }
    ]

    for (const draw of draws) {
      const { error: drawError } = await supabase
        .from('chit_draws')
        .insert([{
          chit_fund_id: currentChit.id,
          ...draw
        }])

      if (drawError && !drawError.message.includes('already exists') && drawError.code !== '23505') {
        console.error('Error creating draw:', drawError.message)
      }
    }

    console.log('✅ Sample draws created')

    console.log('\n🎉 Chit Fund Database Setup Complete!')
    console.log('\n📊 Created:')
    console.log(`   ✅ Chit Fund: ${currentChit.name}`)
    console.log(`   ✅ Start Date: ${currentChit.start_date}`)
    console.log(`   ✅ Status: ${currentChit.status}`)
    console.log(`   ✅ Monthly Payment: ₹${currentChit.monthly_payment.toLocaleString()}`)
    console.log(`   ✅ 10 Monthly Draws`)

    console.log('\n🚀 Next Steps:')
    console.log('1. Refresh your admin dashboard')
    console.log('2. Go to Chit Fund tab')
    console.log('3. Add participants from your members list')
    console.log('4. Start managing your chit fund!')

  } catch (error) {
    console.error('❌ Error setting up database:', error)
    console.log('\n🔧 Troubleshooting:')
    console.log('1. Make sure you have run the members schema first')
    console.log('2. Check your Supabase connection')
    console.log('3. Verify your environment variables')
  }
}

setupChitFundDatabase()