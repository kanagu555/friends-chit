-- Create Auth Users via SQL
-- Note: This approach has limitations - manual creation in dashboard is recommended

-- Check current auth users
SELECT 
  'Current Auth Users' as info,
  email,
  created_at,
  email_confirmed_at
FROM auth.users
ORDER BY created_at DESC;

-- Note: You cannot create auth users directly via SQL for security reasons
-- Use one of these methods instead:

-- Method 1: Supabase Dashboard (Recommended)
-- 1. Go to Authentication → Users
-- 2. Click "Add User"
-- 3. Email: kumarasamywhb@gmail.com, Password: kumar@123
-- 4. Email: kanagarajwhb@gmail.com, Password: kanagu@123

-- Method 2: Enable public sign-up temporarily
-- 1. Go to Authentication → Settings
-- 2. Enable "Enable email confirmations" 
-- 3. Users can sign up at your login page
-- 4. Disable after they create accounts

-- Verification query (run after creating users)
SELECT 
  'Newly Created Users' as info,
  email,
  created_at,
  email_confirmed_at,
  CASE 
    WHEN email IN ('kumarasamywhb@gmail.com', 'kanagarajwhb@gmail.com') 
    THEN 'Target User' 
    ELSE 'Other User' 
  END as user_type
FROM auth.users
WHERE email IN ('kumarasamywhb@gmail.com', 'kanagarajwhb@gmail.com')
ORDER BY created_at DESC;