// User role configuration
// Add or modify admin and member email addresses here

export const USER_ROLES = {
  // Admin users - full access to all features
  ADMINS: [
    'harikrishnanwhb@gmail.com',  // Custom admin account
    'admin@chitfund.com',
    'superadmin@chitfund.com',
    'manager@chitfund.com',
    // Add more admin emails here
  ],
  
  // Member users - limited access
  MEMBERS: [
    'member@chitfund.com',
    'user@chitfund.com',
    'participant@chitfund.com',
    'kumarasamywhb@gmail.com',    // Kumarasamy
    'kanagarajwhb@gmail.com',     // Kanagaraj
    // Add more member emails here
  ]
}

export type UserRole = 'admin' | 'member' | 'unknown'

// Determine user role based on email
export function getUserRole(email: string): UserRole {
  const normalizedEmail = email.toLowerCase().trim()
  
  if (USER_ROLES.ADMINS.includes(normalizedEmail)) {
    return 'admin'
  }
  
  if (USER_ROLES.MEMBERS.includes(normalizedEmail)) {
    return 'member'
  }
  
  // Default to member for any other authenticated user
  // Change this to 'unknown' if you want to restrict access
  return 'member'
}

// Check if user has admin privileges
export function isAdmin(email: string): boolean {
  return getUserRole(email) === 'admin'
}

// Check if user has member privileges
export function isMember(email: string): boolean {
  const role = getUserRole(email)
  return role === 'member' || role === 'admin' // Admins can also access member features
}

// Get all configured users for setup scripts
export function getAllConfiguredUsers() {
  return {
    admins: USER_ROLES.ADMINS,
    members: USER_ROLES.MEMBERS,
    all: [...USER_ROLES.ADMINS, ...USER_ROLES.MEMBERS]
  }
}