-- Fix Foreign Key Relationship for Monthly Participants
-- Run this in Supabase SQL Editor to fix the winner_participant_id reference

-- First, drop the existing foreign key constraint
ALTER TABLE chit_draws DROP CONSTRAINT IF EXISTS chit_draws_winner_participant_id_fkey;

-- Update the foreign key to reference monthly_participants instead of chit_participants
ALTER TABLE chit_draws 
ADD CONSTRAINT chit_draws_winner_participant_id_fkey 
FOREIGN KEY (winner_participant_id) 
REFERENCES monthly_participants(id) 
ON DELETE SET NULL;

-- Verify the constraint was added
SELECT 
    tc.constraint_name, 
    tc.table_name, 
    kcu.column_name, 
    ccu.table_name AS foreign_table_name,
    ccu.column_name AS foreign_column_name 
FROM 
    information_schema.table_constraints AS tc 
    JOIN information_schema.key_column_usage AS kcu
      ON tc.constraint_name = kcu.constraint_name
      AND tc.table_schema = kcu.table_schema
    JOIN information_schema.constraint_column_usage AS ccu
      ON ccu.constraint_name = tc.constraint_name
      AND ccu.table_schema = tc.table_schema
WHERE tc.constraint_type = 'FOREIGN KEY' 
  AND tc.table_name='chit_draws'
  AND kcu.column_name='winner_participant_id';

-- Success message
SELECT 'Foreign key relationship fixed! winner_participant_id now references monthly_participants table.' as message;