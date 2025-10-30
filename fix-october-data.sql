-- Fix October Draw Data
-- Run this in Supabase SQL Editor to restore October winner and participants

-- First, let's check what data we have
SELECT 
  'Current October Draw' as info,
  cd.status,
  cd.winner_participant_id,
  cd.winner_name,
  cd.payout_amount
FROM chit_draws cd
JOIN chit_funds cf ON cd.chit_fund_id = cf.id
WHERE cf.status = 'active' AND cd.month_number = 1;

-- Check if we have a winner in the old chit_participants table
SELECT 
  'October Winner in old table' as info,
  cp.id as participant_id,
  m.name as winner_name,
  cp.status
FROM chit_participants cp
JOIN members m ON cp.member_id = m.id
JOIN chit_funds cf ON cp.chit_fund_id = cf.id
WHERE cf.status = 'active' AND cp.status = 'winner';

-- If there's a winner, migrate them to monthly_participants
INSERT INTO monthly_participants (chit_fund_id, member_id, month_number, status)
SELECT 
  cp.chit_fund_id,
  cp.member_id,
  1 as month_number,
  'winner' as status
FROM chit_participants cp
JOIN chit_funds cf ON cp.chit_fund_id = cf.id
WHERE cf.status = 'active' 
  AND cp.status = 'winner'
  AND NOT EXISTS (
    SELECT 1 FROM monthly_participants mp 
    WHERE mp.chit_fund_id = cp.chit_fund_id 
      AND mp.member_id = cp.member_id 
      AND mp.month_number = 1
  );

-- Update the draw with winner name if missing
UPDATE chit_draws 
SET winner_name = (
  SELECT m.name 
  FROM chit_participants cp
  JOIN members m ON cp.member_id = m.id
  WHERE cp.id = chit_draws.winner_participant_id
)
WHERE winner_name IS NULL 
  AND winner_participant_id IS NOT NULL
  AND month_number = 1;

-- Add some sample participants to October if none exist
-- (You can modify this to add specific members)
INSERT INTO monthly_participants (chit_fund_id, member_id, month_number, status)
SELECT 
  cf.id as chit_fund_id,
  m.id as member_id,
  1 as month_number,
  CASE 
    WHEN EXISTS (
      SELECT 1 FROM chit_draws cd 
      JOIN chit_participants cp ON cd.winner_participant_id = cp.id
      WHERE cd.chit_fund_id = cf.id 
        AND cd.month_number = 1 
        AND cp.member_id = m.id
    ) THEN 'winner'
    ELSE 'active'
  END as status
FROM chit_funds cf
CROSS JOIN members m
WHERE cf.status = 'active'
  AND NOT EXISTS (
    SELECT 1 FROM monthly_participants mp 
    WHERE mp.chit_fund_id = cf.id 
      AND mp.member_id = m.id 
      AND mp.month_number = 1
  )
LIMIT 5; -- Add first 5 members to October

-- Verify the results
SELECT 
  'October participants after migration' as info,
  mp.status,
  m.name,
  mp.month_number
FROM monthly_participants mp
JOIN members m ON mp.member_id = m.id
JOIN chit_funds cf ON mp.chit_fund_id = cf.id
WHERE cf.status = 'active' AND mp.month_number = 1
ORDER BY mp.status DESC, m.name;

-- Check the updated draw
SELECT 
  'Updated October Draw' as info,
  cd.status,
  cd.winner_name,
  cd.payout_amount,
  COUNT(mp.id) as participant_count
FROM chit_draws cd
JOIN chit_funds cf ON cd.chit_fund_id = cf.id
LEFT JOIN monthly_participants mp ON cd.chit_fund_id = mp.chit_fund_id AND cd.month_number = mp.month_number
WHERE cf.status = 'active' AND cd.month_number = 1
GROUP BY cd.id, cd.status, cd.winner_name, cd.payout_amount;