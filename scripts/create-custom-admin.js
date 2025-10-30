// Script to create custom admin account
// Run with: npm run create-admin

import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'

// Load environment variables
dotenv.config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ Missing required environment variables')
  console.error('Make sure you have NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in your .env.local')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Custom admin credentials
const ADMIN_EMAIL = 'harikrishnanwhb@gmail.com'
const ADMIN_PASSWORD = 'hari@7733'

async function createCustomAdmin() {
  console.log('🔧 Creating custom admin account...')
  console.log(`📧 Email: ${ADMIN_EMAIL}`)

  try {
    const { data, error } = await supabase.auth.signUp({
      email: ADMIN_EMAIL,
      password: ADMIN_PASSWORD,
    })

    if (error) {
      if (error.message.includes('already registered')) {
        console.log('ℹ️  Admin user already exists!')
        console.log('✅ You can login with the existing account')
      } else {
        console.error('❌ Error creating admin user:', error.message)
        return
      }
    } else {
      console.log('✅ Admin user created successfully!')
      if (!data.user?.email_confirmed_at) {
        console.log('⚠️  Admin user needs email confirmation')
      }
    }

    console.log('\n🎉 Setup complete!')
    console.log('\n🔑 Admin Login Credentials:')
    console.log(`   Email: ${ADMIN_EMAIL}`)
    console.log(`   Password: ${ADMIN_PASSWORD}`)
    console.log('\n📝 Next steps:')
    console.log('1. Go to Supabase Dashboard > Authentication > Users')
    console.log('2. Find your admin user and confirm the email (click ... menu > Confirm email)')
    console.log('3. Or disable email confirmation in Auth settings for development')
    console.log('\n🚀 Then start your app with: npm run dev')
    console.log('🎯 Login as admin to access the member management system!')

  } catch (error) {
    console.error('❌ Unexpected error:', error)
  }
}

createCustomAdmin()