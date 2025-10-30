// Production-ready script to create admin account
// This script can be run in production environment
// Run with: npm run create-production-admin

import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'

// Load environment variables
dotenv.config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl) {
  console.error('❌ Missing NEXT_PUBLIC_SUPABASE_URL')
  console.error('Set this in your production environment variables')
  process.exit(1)
}

if (!supabaseServiceKey) {
  console.log('⚠️  SUPABASE_SERVICE_ROLE_KEY not found')
  console.log('Using anon key - user will need email confirmation')
  
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  if (!supabaseAnonKey) {
    console.error('❌ Missing NEXT_PUBLIC_SUPABASE_ANON_KEY')
    process.exit(1)
  }
}

// Create Supabase client (prefer service key for production)
const supabase = createClient(
  supabaseUrl, 
  supabaseServiceKey || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  supabaseServiceKey ? {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  } : {}
)

// Production admin credentials
const ADMIN_EMAIL = 'harikrishnanwhb@gmail.com'
const ADMIN_PASSWORD = 'hari@7733'

async function createProductionAdmin() {
  console.log('🚀 Creating production admin account...')
  console.log(`📧 Email: ${ADMIN_EMAIL}`)
  console.log(`🌐 Environment: ${process.env.NODE_ENV || 'development'}`)

  try {
    let result

    if (supabaseServiceKey) {
      // Use admin API (no email confirmation needed)
      console.log('🔑 Using service role key (admin API)')
      result = await supabase.auth.admin.createUser({
        email: ADMIN_EMAIL,
        password: ADMIN_PASSWORD,
        email_confirm: true
      })
    } else {
      // Use signup API (email confirmation needed)
      console.log('📧 Using anon key (signup API)')
      result = await supabase.auth.signUp({
        email: ADMIN_EMAIL,
        password: ADMIN_PASSWORD,
      })
    }

    const { data, error } = result

    if (error) {
      if (error.message.includes('already registered') || error.message.includes('already exists')) {
        console.log('ℹ️  Admin user already exists!')
        console.log('✅ You can login with the existing account')
      } else {
        console.error('❌ Error creating admin user:', error.message)
        return
      }
    } else {
      console.log('✅ Admin user created successfully!')
      
      if (supabaseServiceKey) {
        console.log('✅ Email automatically confirmed (service key used)')
      } else if (!data.user?.email_confirmed_at) {
        console.log('⚠️  Admin user needs email confirmation')
        console.log('   Go to Supabase Dashboard > Authentication > Users')
        console.log('   Find your user and confirm the email')
      }
    }

    console.log('\n🎉 Production admin setup complete!')
    console.log('\n🔑 Production Admin Credentials:')
    console.log(`   Email: ${ADMIN_EMAIL}`)
    console.log(`   Password: ${ADMIN_PASSWORD}`)
    console.log('\n🌐 Production Access:')
    console.log('   ✅ Full member management')
    console.log('   ✅ Admin dashboard')
    console.log('   ✅ All CRUD operations')
    console.log('\n🚀 Your production admin account is ready!')

  } catch (error) {
    console.error('❌ Unexpected error:', error)
    console.log('\n🔧 Troubleshooting:')
    console.log('1. Check your environment variables')
    console.log('2. Verify Supabase project is accessible')
    console.log('3. Ensure you have the correct permissions')
  }
}

createProductionAdmin()