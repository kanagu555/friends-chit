const { createClient } = require('@supabase/supabase-js')

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY // Need service role key for user creation

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing Supabase environment variables')
  console.error('Required: NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY')
  process.exit(1)
}

// Create admin client with service role key
const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})

async function createAuthAccounts() {
  try {
    console.log('🔐 Creating Supabase Auth accounts for members...\n')

    // Define auth accounts to create
    const authAccounts = [
      {
        email: 'kumarasamywhb@gmail.com',
        password: 'kumar@123',
        name: 'Kumarasamy'
      },
      {
        email: 'kanagarajwhb@gmail.com', 
        password: 'kanagu@123',
        name: 'Kanagaraj'
      }
    ]

    console.log('👤 Auth accounts to create:')
    authAccounts.forEach((account, index) => {
      console.log(`   ${index + 1}. ${account.name} (${account.email})`)
    })
    console.log('')

    for (const account of authAccounts) {
      console.log(`🔍 Creating auth account for ${account.name}...`)
      
      // Create the auth user
      const { data, error } = await supabase.auth.admin.createUser({
        email: account.email,
        password: account.password,
        email_confirm: true, // Auto-confirm email
        user_metadata: {
          name: account.name,
          role: 'member'
        }
      })

      if (error) {
        if (error.message.includes('already registered')) {
          console.log(`✅ ${account.name} auth account already exists`)
        } else {
          console.log(`❌ Failed to create auth account for ${account.name}:`, error.message)
        }
      } else {
        console.log(`✅ Successfully created auth account for ${account.name}`)
        console.log(`   User ID: ${data.user.id}`)
        console.log(`   Email: ${data.user.email}`)
      }
    }

    console.log('\n📊 Verification - Listing all auth users:')
    const { data: users, error: listError } = await supabase.auth.admin.listUsers()
    
    if (listError) {
      console.log('❌ Error listing users:', listError.message)
    } else {
      users.users.forEach((user, index) => {
        console.log(`   ${index + 1}. ${user.email} (ID: ${user.id.substring(0, 8)}...)`)
      })
    }

    console.log('\n✅ Auth account creation completed!')
    console.log('\n🔑 Login Credentials:')
    authAccounts.forEach(account => {
      console.log(`   ${account.name}: ${account.email} / ${account.password}`)
    })
    
    console.log('\n📋 Next steps:')
    console.log('   1. Test login with the credentials above')
    console.log('   2. Users should get "member" role automatically')
    console.log('   3. They can access member dashboard features')
    console.log('   4. Add their emails to USER_ROLES.MEMBERS if needed')

  } catch (error) {
    console.error('❌ Script failed:', error.message)
  }
}

createAuthAccounts()