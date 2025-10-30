const { createClient } = require('@supabase/supabase-js')

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase environment variables')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

async function createSpecificMembers() {
  try {
    console.log('👥 Creating specific member accounts...\n')

    // Define the members to create
    // Note: Assuming the format was "email / password" - using only email part
    const membersToCreate = [
      {
        name: 'Kumarasamy',
        email: 'kumarasamywhb@gmail.com',
        phone: '+91-9876543210', // You can update this with actual phone
        role: 'member'
      },
      {
        name: 'Kanagaraj', 
        email: 'kanagarajwhb@gmail.com',
        phone: '+91-9876543211', // You can update this with actual phone
        role: 'member'
      }
    ]

    console.log('📝 Members to create:')
    membersToCreate.forEach((member, index) => {
      console.log(`   ${index + 1}. ${member.name} (${member.email})`)
    })
    console.log('')

    // Check if members already exist
    for (const member of membersToCreate) {
      console.log(`🔍 Checking if ${member.name} already exists...`)
      
      const { data: existing, error: checkError } = await supabase
        .from('members')
        .select('id, name, email')
        .eq('email', member.email)
        .single()

      if (checkError && checkError.code !== 'PGRST116') {
        console.log(`⚠️  Error checking ${member.name}:`, checkError.message)
        continue
      }

      if (existing) {
        console.log(`✅ ${member.name} already exists with ID: ${existing.id}`)
        continue
      }

      // Create the member
      console.log(`➕ Creating ${member.name}...`)
      const { data: newMember, error: createError } = await supabase
        .from('members')
        .insert([{
          name: member.name,
          email: member.email,
          phone: member.phone,
          role: member.role,
          status: 'active'
        }])
        .select()
        .single()

      if (createError) {
        console.log(`❌ Failed to create ${member.name}:`, createError.message)
      } else {
        console.log(`✅ Successfully created ${member.name} with ID: ${newMember.id}`)
      }
    }

    console.log('\n📊 Final member list:')
    const { data: allMembers, error: listError } = await supabase
      .from('members')
      .select('id, name, email, role, status')
      .order('created_at', { ascending: false })

    if (listError) {
      console.log('❌ Error fetching members:', listError.message)
    } else {
      allMembers.forEach((member, index) => {
        console.log(`   ${index + 1}. ${member.name} (${member.email}) - ${member.role} - ${member.status}`)
      })
    }

    console.log('\n✅ Member creation process completed!')
    console.log('\n📋 Next steps:')
    console.log('   • Members can now be added to chit fund participants')
    console.log('   • Use the Members tab in admin dashboard to manage them')
    console.log('   • Add them to monthly auctions as needed')

  } catch (error) {
    console.error('❌ Script failed:', error.message)
  }
}

createSpecificMembers()