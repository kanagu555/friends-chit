-- Create specific member accounts
-- Run this in Supabase SQL Editor

-- Insert the specific members
INSERT INTO members (name, email, phone, role, status) VALUES
('Kumarasamy', 'kumarasamywhb@gmail.com', '+91-9876543210', 'member', 'active'),
('Kanagaraj', 'kanagarajwhb@gmail.com', '+91-9876543211', 'member', 'active')
ON CONFLICT (email) DO NOTHING;

-- Verify the members were created
SELECT 
  'Created Members' as info,
  id,
  name,
  email,
  role,
  status,
  created_at
FROM members 
WHERE email IN ('kumarasamywhb@gmail.com', 'kanagarajwhb@gmail.com')
ORDER BY created_at DESC;

-- Show total member count
SELECT 
  'Total Members' as info,
  COUNT(*) as total_count
FROM members;

-- Success message
SELECT 'Member accounts created successfully!' as message;