// Chit Fund Management Types

export interface ChitFund {
  id: string
  name: string
  total_amount: number // 1 Lakh = 100000
  monthly_payment: number // 10000
  duration_months: number // 10
  start_date: string // Oct 2025
  status: 'active' | 'completed' | 'upcoming'
  current_month?: number // Current month of the chit (1-10)
  created_at: string
  updated_at: string
}

export interface ChitParticipant {
  id: string
  chit_fund_id: string
  member_id: string
  member_name?: string
  member_email?: string
  member_phone?: string
  joined_date: string
  status: 'active' | 'inactive' | 'winner'
  total_paid: number
  created_at: string
  updated_at: string
  members?: {
    id: string
    name: string
    email: string
    phone: string
  }
}

export interface ChitDraw {
  id: string
  chit_fund_id: string
  month_number: number // 1-10
  draw_date: string // 10th of each month
  winner_participant_id: string
  winner_name: string
  payout_amount: number
  benefit_amount: number // positive or negative
  status: 'pending' | 'completed'
  created_at: string
}

export interface ChitPayment {
  id: string
  chit_fund_id: string
  participant_id: string
  month_number: number
  amount: number
  payment_date: string
  status: 'paid' | 'pending' | 'overdue'
  created_at: string
}

// Chit Fund Calculation Logic
export const CHIT_FUND_CONFIG = {
  TOTAL_AMOUNT: 100000, // 1 Lakh
  MONTHLY_PAYMENT: 10000, // 10k per month
  DURATION_MONTHS: 10,
  DRAW_DAY: 10, // 10th of each month
  START_MONTH: 'Sep 2025'
}

// Payout calculation based on your table
export const PAYOUT_STRUCTURE = [
  { month: 1, payout: 95500, benefit: -4500 },
  { month: 2, payout: 96500, benefit: -3500 },
  { month: 3, payout: 97500, benefit: -2500 },
  { month: 4, payout: 98500, benefit: -1500 },
  { month: 5, payout: 99500, benefit: -500 },
  { month: 6, payout: 100500, benefit: 500 },
  { month: 7, payout: 101500, benefit: 1500 },
  { month: 8, payout: 102500, benefit: 2500 },
  { month: 9, payout: 103500, benefit: 3500 },
  { month: 10, payout: 104500, benefit: 4500 }
]

export function getPayoutForMonth(month: number) {
  return PAYOUT_STRUCTURE.find(p => p.month === month) || PAYOUT_STRUCTURE[0]
}

export function calculateNextDrawDate(currentMonth: number): string {
  const startDate = new Date('2025-09-10') // Sep 10, 2025
  const nextDrawDate = new Date(startDate)
  nextDrawDate.setMonth(startDate.getMonth() + currentMonth - 1)
  return nextDrawDate.toISOString().split('T')[0]
}