-- Complete Migration to Monthly Participants System
-- Run this in Supabase SQL Editor to fully migrate from chit_participants to monthly_participants

-- Step 1: Create monthly_participants table if not exists
CREATE TABLE IF NOT EXISTS monthly_participants (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  chit_fund_id UUID REFERENCES chit_funds(id) ON DELETE CASCADE,
  member_id UUID REFERENCES members(id) ON DELETE CASCADE,
  month_number INTEGER NOT NULL,
  status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'winner', 'removed')),
  added_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(chit_fund_id, member_id, month_number)
);

-- Step 2: Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_monthly_participants_chit_fund ON monthly_participants(chit_fund_id);
CREATE INDEX IF NOT EXISTS idx_monthly_participants_member ON monthly_participants(member_id);
CREATE INDEX IF NOT EXISTS idx_monthly_participants_month ON monthly_participants(month_number);
CREATE INDEX IF NOT EXISTS idx_monthly_participants_chit_month ON monthly_participants(chit_fund_id, month_number);

-- Step 3: Create trigger for updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_monthly_participants_updated_at 
  BEFORE UPDATE ON monthly_participants 
  FOR EACH ROW 
  EXECUTE FUNCTION update_updated_at_column();

-- Step 4: Enable Row Level Security
ALTER TABLE monthly_participants ENABLE ROW LEVEL SECURITY;

-- Step 5: Create RLS policy
CREATE POLICY "Allow all operations for authenticated users" ON monthly_participants
  FOR ALL USING (auth.role() = 'authenticated');

-- Step 6: Fix foreign key relationship in chit_draws
ALTER TABLE chit_draws DROP CONSTRAINT IF EXISTS chit_draws_winner_participant_id_fkey;
ALTER TABLE chit_draws 
ADD CONSTRAINT chit_draws_winner_participant_id_fkey 
FOREIGN KEY (winner_participant_id) 
REFERENCES monthly_participants(id) 
ON DELETE SET NULL;

-- Step 7: Add winner_name and participants columns to chit_draws if not exists
ALTER TABLE chit_draws ADD COLUMN IF NOT EXISTS winner_name VARCHAR(255);
ALTER TABLE chit_draws ADD COLUMN IF NOT EXISTS participants TEXT[];

-- Step 8: Migrate existing data from chit_participants to monthly_participants
-- This will migrate winners and active participants to the current month
INSERT INTO monthly_participants (chit_fund_id, member_id, month_number, status)
SELECT 
  cp.chit_fund_id,
  cp.member_id,
  COALESCE(cf.current_month, 1) as month_number,
  cp.status
FROM chit_participants cp
JOIN chit_funds cf ON cp.chit_fund_id = cf.id
WHERE cf.status = 'active'
  AND NOT EXISTS (
    SELECT 1 FROM monthly_participants mp 
    WHERE mp.chit_fund_id = cp.chit_fund_id 
      AND mp.member_id = cp.member_id 
      AND mp.month_number = COALESCE(cf.current_month, 1)
  );

-- Step 9: Update chit_draws with winner names from monthly_participants
UPDATE chit_draws 
SET winner_name = (
  SELECT m.name 
  FROM monthly_participants mp
  JOIN members m ON mp.member_id = m.id
  WHERE mp.id = chit_draws.winner_participant_id
)
WHERE winner_name IS NULL 
  AND winner_participant_id IS NOT NULL;

-- Step 10: Update chit_payments to reference monthly_participants
-- First, add a new column for monthly_participant_id
ALTER TABLE chit_payments ADD COLUMN IF NOT EXISTS monthly_participant_id UUID REFERENCES monthly_participants(id) ON DELETE CASCADE;

-- Update existing payments to reference monthly_participants
UPDATE chit_payments 
SET monthly_participant_id = (
  SELECT mp.id 
  FROM monthly_participants mp
  JOIN chit_participants cp ON mp.member_id = cp.member_id AND mp.chit_fund_id = cp.chit_fund_id
  WHERE cp.id = chit_payments.participant_id
    AND mp.month_number = chit_payments.month_number
  LIMIT 1
)
WHERE monthly_participant_id IS NULL;

-- Step 11: Verification queries
SELECT 'Migration Summary:' as info;

SELECT 
  'Monthly Participants Created' as table_name,
  COUNT(*) as record_count
FROM monthly_participants;

SELECT 
  'Chit Draws with Winners' as table_name,
  COUNT(*) as record_count
FROM chit_draws 
WHERE winner_participant_id IS NOT NULL;

SELECT 
  'Foreign Key Constraints' as info,
  constraint_name,
  table_name,
  column_name
FROM information_schema.key_column_usage 
WHERE constraint_name LIKE '%monthly_participants%';

-- Success message
SELECT 'Complete migration to monthly_participants system finished successfully!' as message;

-- Optional: Comment out the chit_participants table (don't drop it yet, just in case)
-- You can uncomment this after verifying everything works
-- ALTER TABLE chit_participants RENAME TO chit_participants_backup;