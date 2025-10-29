-- Create members table
CREATE TABLE IF NOT EXISTS members (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  phone VARCHAR(20) NOT NULL,
  cycles INTEGER NOT NULL DEFAULT 1,
  status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create an index on email for faster lookups
CREATE INDEX IF NOT EXISTS idx_members_email ON members(email);

-- Create an index on status for filtering
CREATE INDEX IF NOT EXISTS idx_members_status ON members(status);

-- Create a function to automatically update the updated_at column
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create a trigger to automatically update updated_at
CREATE TRIGGER update_members_updated_at 
  BEFORE UPDATE ON members 
  FOR EACH ROW 
  EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security (RLS)
ALTER TABLE members ENABLE ROW LEVEL SECURITY;

-- Create policies (adjust based on your authentication needs)
-- For now, allowing all operations for authenticated users
CREATE POLICY "Allow all operations for authenticated users" ON members
  FOR ALL USING (auth.role() = 'authenticated');

-- If you want to allow anonymous access (for development), uncomment below:
-- CREATE POLICY "Allow all operations for anonymous users" ON members
--   FOR ALL USING (true);

-- Note: Authentication users are handled automatically by Supabase Auth
-- No additional SQL is needed for login functionality
-- Use the setup-demo-users.js script to create demo users via the Auth API