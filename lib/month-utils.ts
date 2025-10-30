// Month utility functions for chit fund system

export function getMonthName(monthNumber: number, startDate: string = '2025-10-10'): string {
  const start = new Date(startDate)
  const targetDate = new Date(start)
  targetDate.setMonth(start.getMonth() + monthNumber - 1)
  
  return targetDate.toLocaleDateString('en-US', { month: 'long' })
}

export function getMonthYear(monthNumber: number, startDate: string = '2025-10-10'): string {
  const start = new Date(startDate)
  const targetDate = new Date(start)
  targetDate.setMonth(start.getMonth() + monthNumber - 1)
  
  return targetDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
}

export function getShortMonthYear(monthNumber: number, startDate: string = '2025-10-10'): string {
  const start = new Date(startDate)
  const targetDate = new Date(start)
  targetDate.setMonth(start.getMonth() + monthNumber - 1)
  
  return targetDate.toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
}

// Get all month names for the chit fund duration
export function getAllMonthNames(startDate: string = '2025-10-10', duration: number = 10): string[] {
  const months: string[] = []
  for (let i = 1; i <= duration; i++) {
    months.push(getMonthName(i, startDate))
  }
  return months
}

// Get month name with ordinal (1st, 2nd, 3rd, etc.)
export function getMonthWithOrdinal(monthNumber: number): string {
  const ordinals = ['', '1st', '2nd', '3rd', '4th', '5th', '6th', '7th', '8th', '9th', '10th']
  return ordinals[monthNumber] || `${monthNumber}th`
}