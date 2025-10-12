/**
 * Revenue Scorecard Type Definitions
 */

export type RevenuePeriod = 'day' | 'week' | 'month';

export interface RevenueSettings {
  excludeWeekends: boolean;
  carryOverRevenue: boolean;
}

export interface CrewRevenue {
  crewId: string;
  crewName: string;
  totalRevenue: number;
  jobCount: number;
  jobs: {
    jobId: string;
    jobName: string;
    revenue: number;
  }[];
}

export interface RevenueCalculationResult {
  period: RevenuePeriod;
  periodStart: string;
  periodEnd: string;
  crewRevenues: CrewRevenue[];
  totalRevenue: number;
  settings: RevenueSettings;
}

export interface DateRange {
  start: Date;
  end: Date;
}

