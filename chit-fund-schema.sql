-- Chit Fund Management Database Schema
-- Run this in your Supabase SQL Editor

-- Create chit_funds table
CREATE TABLE IF NOT EXISTS chit_funds (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  total_amount INTEGER NOT NULL DEFAULT 100000,
  monthly_payment INTEGER NOT NULL DEFAULT 10000,
  duration_months INTEGER NOT NULL DEFAULT 10,
  start_date DATE NOT NULL,
  status VARCHAR(20) DEFAULT 'upcoming' CHECK (status IN ('upcoming', 'active', 'completed')),
  current_month INTEGER DEFAULT 1,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create chit_participants table
CREATE TABLE IF NOT EXISTS chit_participants (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  chit_fund_id UUID REFERENCES chit_funds(id) ON DELETE CASCADE,
  member_id UUID REFERENCES members(id) ON DELETE CASCADE,
  joined_date DATE DEFAULT CURRENT_DATE,
  status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'winner')),
  total_paid INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(chit_fund_id, member_id)
);

-- Create chit_draws table
CREATE TABLE IF NOT EXISTS chit_draws (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  chit_fund_id UUID REFERENCES chit_funds(id) ON DELETE CASCADE,
  month_number INTEGER NOT NULL,
  draw_date DATE NOT NULL,
  winner_participant_id UUID REFERENCES chit_participants(id),
  payout_amount INTEGER NOT NULL,
  benefit_amount INTEGER NOT NULL,
  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'completed')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(chit_fund_id, month_number)
);

-- Create chit_payments table
CREATE TABLE IF NOT EXISTS chit_payments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  chit_fund_id UUID REFERENCES chit_funds(id) ON DELETE CASCADE,
  participant_id UUID REFERENCES chit_participants(id) ON DELETE CASCADE,
  month_number INTEGER NOT NULL,
  amount INTEGER NOT NULL,
  payment_date DATE DEFAULT CURRENT_DATE,
  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'paid', 'overdue')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(participant_id, month_number)
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_chit_participants_chit_fund ON chit_participants(chit_fund_id);
CREATE INDEX IF NOT EXISTS idx_chit_participants_member ON chit_participants(member_id);
CREATE INDEX IF NOT EXISTS idx_chit_draws_chit_fund ON chit_draws(chit_fund_id);
CREATE INDEX IF NOT EXISTS idx_chit_draws_month ON chit_draws(month_number);
CREATE INDEX IF NOT EXISTS idx_chit_payments_participant ON chit_payments(participant_id);
CREATE INDEX IF NOT EXISTS idx_chit_payments_month ON chit_payments(month_number);

-- Create triggers for updated_at
CREATE TRIGGER update_chit_funds_updated_at 
  BEFORE UPDATE ON chit_funds 
  FOR EACH ROW 
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_chit_participants_updated_at 
  BEFORE UPDATE ON chit_participants 
  FOR EACH ROW 
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_chit_draws_updated_at 
  BEFORE UPDATE ON chit_draws 
  FOR EACH ROW 
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_chit_payments_updated_at 
  BEFORE UPDATE ON chit_payments 
  FOR EACH ROW 
  EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security
ALTER TABLE chit_funds ENABLE ROW LEVEL SECURITY;
ALTER TABLE chit_participants ENABLE ROW LEVEL SECURITY;
ALTER TABLE chit_draws ENABLE ROW LEVEL SECURITY;
ALTER TABLE chit_payments ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Allow all operations for authenticated users" ON chit_funds
  FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Allow all operations for authenticated users" ON chit_participants
  FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Allow all operations for authenticated users" ON chit_draws
  FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Allow all operations for authenticated users" ON chit_payments
  FOR ALL USING (auth.role() = 'authenticated');

-- Insert sample data
INSERT INTO chit_funds (name, total_amount, monthly_payment, duration_months, start_date, status, current_month) 
VALUES ('1 Lakh Chit', 100000, 10000, 10, '2025-10-10', 'active', 1);

-- Get the chit fund ID for sample data
DO $$
DECLARE
    chit_id UUID;
BEGIN
    SELECT id INTO chit_id FROM chit_funds WHERE name = '1 Lakh Chit' LIMIT 1;
    
    -- Insert sample draws
    INSERT INTO chit_draws (chit_fund_id, month_number, draw_date, payout_amount, benefit_amount, status) VALUES
    (chit_id, 1, '2025-10-10', 95500, -4500, 'pending'),
    (chit_id, 2, '2025-11-10', 96500, -3500, 'pending'),
    (chit_id, 3, '2025-12-10', 97500, -2500, 'pending'),
    (chit_id, 4, '2026-01-10', 98500, -1500, 'pending'),
    (chit_id, 5, '2026-02-10', 99500, -500, 'pending'),
    (chit_id, 6, '2026-03-10', 100500, 500, 'pending'),
    (chit_id, 7, '2026-04-10', 101500, 1500, 'pending'),
    (chit_id, 8, '2026-05-10', 102500, 2500, 'pending'),
    (chit_id, 9, '2026-06-10', 103500, 3500, 'pending'),
    (chit_id, 10, '2026-07-10', 104500, 4500, 'pending');
END $$;