import { ActiveClockSession, TimeEntry } from '@/types/crew';

/**
 * Calculate labor cost for a time entry
 */
export function calculateLaborCost(
  entry: TimeEntry,
  hourlyRate: number,
  overtimeMultiplier: number = 1.5,
  overtimeThresholdHours: number = 8
): {
  regularHours: number;
  overtimeHours: number;
  regularCost: number;
  overtimeCost: number;
  totalCost: number;
} {
  const totalMinutes = entry.totalMinutes || 0;
  const totalHours = totalMinutes / 60;

  let regularHours = 0;
  let overtimeHours = 0;

  if (totalHours <= overtimeThresholdHours) {
    regularHours = totalHours;
  } else {
    regularHours = overtimeThresholdHours;
    overtimeHours = totalHours - overtimeThresholdHours;
  }

  const regularCost = regularHours * hourlyRate;
  const overtimeCost = overtimeHours * hourlyRate * overtimeMultiplier;
  const totalCost = regularCost + overtimeCost;

  return {
    regularHours,
    overtimeHours,
    regularCost,
    overtimeCost,
    totalCost,
  };
}

/**
 * Calculate currently accruing cost for an active session
 */
export function calculateAccruingCost(
  session: ActiveClockSession,
  hourlyRate: number
): number {
  const hours = session.elapsedMinutes / 60;
  return hours * hourlyRate;
}

/**
 * Format a number as currency (USD)
 */
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

/**
 * Calculate total cost for multiple time entries
 */
export function calculateTotalCostForEntries(
  entries: TimeEntry[]
): number {
  return entries.reduce((total, entry) => {
    return total + (entry.totalCost || 0);
  }, 0);
}

/**
 * Calculate hourly cost rate based on elapsed time
 */
export function calculateHourlyCostRate(
  elapsedMinutes: number,
  hourlyRate: number
): number {
  if (elapsedMinutes === 0) return 0;
  const hours = elapsedMinutes / 60;
  return hourlyRate * hours;
}

/**
 * Format duration in minutes to human-readable string
 */
export function formatDuration(minutes: number): string {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  
  if (hours === 0) {
    return `${mins}m`;
  }
  
  return `${hours}h ${mins}m`;
}

/**
 * Calculate total cost per hour for multiple active sessions
 */
export function calculateTotalCostPerHour(
  sessions: ActiveClockSession[]
): number {
  return sessions.reduce((total, session) => {
    return total + session.hourlyRate;
  }, 0);
}

