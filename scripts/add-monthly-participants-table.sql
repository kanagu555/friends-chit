-- Add monthly participants table for month-specific participation tracking
-- This allows participants to join specific months rather than being general participants

-- Create monthly_participants table
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

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_monthly_participants_chit_fund ON monthly_participants(chit_fund_id);
CREATE INDEX IF NOT EXISTS idx_monthly_participants_member ON monthly_participants(member_id);
CREATE INDEX IF NOT EXISTS idx_monthly_participants_month ON monthly_participants(month_number);
CREATE INDEX IF NOT EXISTS idx_monthly_participants_chit_month ON monthly_participants(chit_fund_id, month_number);

-- Create trigger for updated_at
CREATE TRIGGER update_monthly_participants_updated_at 
  BEFORE UPDATE ON monthly_participants 
  FOR EACH ROW 
  EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security
ALTER TABLE monthly_participants ENABLE ROW LEVEL SECURITY;

-- Create RLS policy
CREATE POLICY "Allow all operations for authenticated users" ON monthly_participants
  FOR ALL USING (auth.role() = 'authenticated');

-- Add winner_name column to chit_draws for easier display
ALTER TABLE chit_draws ADD COLUMN IF NOT EXISTS winner_name VARCHAR(255);

-- Add participants column to chit_draws to store participant names for that month
ALTER TABLE chit_draws ADD COLUMN IF NOT EXISTS participants TEXT[];

COMMENT ON TABLE monthly_participants IS 'Tracks which members participate in which specific months of a chit fund';
COMMENT ON COLUMN monthly_participants.month_number IS 'The specific month number (1-10) that this participant is joining';
COMMENT ON COLUMN monthly_participants.status IS 'Status: active (participating), winner (won this month), removed (removed from this month)';