// Test script to verify role detection is working
// Run with: npm run test-roles

import { getUserRole, USER_ROLES } from '../lib/user-roles.js'

console.log('🧪 Testing Role Detection System')
console.log('================================')

// Test emails
const testEmails = [
  'harikrishnanwhb@gmail.com',
  'admin@chitfund.com',
  'member@chitfund.com',
  'random@example.com',
  'HARIKRISHNANWHB@GMAIL.COM', // Test case sensitivity
]

console.log('\n📋 Configured Roles:')
console.log('Admins:', USER_ROLES.ADMINS)
console.log('Members:', USER_ROLES.MEMBERS)

console.log('\n🔍 Role Detection Tests:')
testEmails.forEach(email => {
  const role = getUserRole(email)
  const status = role === 'admin' ? '👑' : role === 'member' ? '👤' : '❓'
  console.log(`${status} ${email} → ${role}`)
})

console.log('\n✅ Test Complete!')
console.log('If harikrishnanwhb@gmail.com shows as "admin", the system is working correctly.')