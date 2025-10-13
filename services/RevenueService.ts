/**
 * Revenue Service - Handles revenue calculations by crew
 */

import { Job } from '../types/jobs';
import { CrewRevenue, DateRange, RevenueCalculationResult, RevenuePeriod, RevenueSettings } from '../types/revenue';

class RevenueService {
  /**
   * Calculate the number of working days between two dates
   * @param startDate Start date
   * @param endDate End date
   * @param excludeWeekends Whether to exclude weekends from count
   * @returns Number of working days
   */
  calculateWorkingDays(startDate: Date, endDate: Date, excludeWeekends: boolean): number {
    let count = 0;
    const current = new Date(startDate);
    current.setHours(0, 0, 0, 0);
    
    const end = new Date(endDate);
    end.setHours(0, 0, 0, 0);

    while (current <= end) {
      const dayOfWeek = current.getDay();
      const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
      
      if (!excludeWeekends || !isWeekend) {
        count++;
      }
      
      current.setDate(current.getDate() + 1);
    }

    return count;
  }

  /**
   * Calculate daily revenue for a job
   * @param job Job object
   * @param excludeWeekends Whether to exclude weekends
   * @returns Revenue per working day
   */
  calculateDailyRevenue(job: Job, excludeWeekends: boolean): number {
    const startDate = new Date(job.startDate);
    const endDate = job.endDate ? new Date(job.endDate) : startDate;
    
    const workingDays = this.calculateWorkingDays(startDate, endDate, excludeWeekends);
    
    if (workingDays === 0) return 0;
    
    return job.contractValue / workingDays;
  }

  /**
   * Get the date range for a given period
   * @param period Period type (day, week, month)
   * @param date Reference date
   * @returns Start and end dates for the period
   */
  getPeriodRange(period: RevenuePeriod, date: Date): DateRange {
    const start = new Date(date);
    const end = new Date(date);
    
    start.setHours(0, 0, 0, 0);
    end.setHours(23, 59, 59, 999);

    if (period === 'day') {
      // Single day
      return { start, end };
    } else if (period === 'week') {
      // Week starts on Sunday
      const dayOfWeek = start.getDay();
      start.setDate(start.getDate() - dayOfWeek);
      end.setDate(start.getDate() + 6);
      end.setHours(23, 59, 59, 999);
      return { start, end };
    } else {
      // Month
      start.setDate(1);
      end.setMonth(end.getMonth() + 1);
      end.setDate(0); // Last day of month
      end.setHours(23, 59, 59, 999);
      return { start, end };
    }
  }

  /**
   * Calculate revenue for a job within a specific period
   * @param job Job object
   * @param periodRange Period date range
   * @param settings Revenue calculation settings
   * @returns Revenue attributed to this period
   */
  calculateJobRevenueForPeriod(
    job: Job,
    periodRange: DateRange,
    settings: RevenueSettings
  ): number {
    const jobStart = new Date(job.startDate);
    const jobEnd = job.endDate ? new Date(job.endDate) : new Date(job.startDate);
    
    jobStart.setHours(0, 0, 0, 0);
    jobEnd.setHours(23, 59, 59, 999);

    // Check if job overlaps with period
    if (jobEnd < periodRange.start || jobStart > periodRange.end) {
      return 0; // No overlap
    }

    if (!settings.carryOverRevenue) {
      // Simple: if job starts in period, attribute all revenue
      if (jobStart >= periodRange.start && jobStart <= periodRange.end) {
        return job.contractValue;
      }
      return 0;
    }

    // Carry over mode: pro-rate revenue based on working days in period
    const overlapStart = jobStart > periodRange.start ? jobStart : periodRange.start;
    const overlapEnd = jobEnd < periodRange.end ? jobEnd : periodRange.end;

    // Calculate total working days for the entire job
    const totalWorkingDays = this.calculateWorkingDays(jobStart, jobEnd, settings.excludeWeekends);
    
    if (totalWorkingDays === 0) return 0;

    // Calculate working days in this period
    const periodWorkingDays = this.calculateWorkingDays(overlapStart, overlapEnd, settings.excludeWeekends);

    // Pro-rate revenue
    return (job.contractValue / totalWorkingDays) * periodWorkingDays;
  }

  /**
   * Get revenue grouped by crew for a specific period
   * @param jobs Array of jobs
   * @param period Period type
   * @param date Reference date for the period
   * @param settings Revenue settings
   * @returns Revenue calculation result
   */
  getRevenueForPeriod(
    jobs: Job[],
    period: RevenuePeriod,
    date: Date,
    settings: RevenueSettings
  ): RevenueCalculationResult {
    const periodRange = this.getPeriodRange(period, date);
    const crewRevenueMap = new Map<string, CrewRevenue>();

    // Process each job
    jobs.forEach(job => {
      const revenue = this.calculateJobRevenueForPeriod(job, periodRange, settings);
      
      if (revenue <= 0) return; // Skip jobs with no revenue in this period

      // Get crew ID (use first assigned crew, or "unassigned")
      const crewId = job.assignedCrewIds && job.assignedCrewIds.length > 0 
        ? job.assignedCrewIds[0] 
        : 'unassigned';
      
      // Get or create crew revenue entry
      if (!crewRevenueMap.has(crewId)) {
        crewRevenueMap.set(crewId, {
          crewId,
          crewName: this.getCrewName(crewId, job),
          totalRevenue: 0,
          jobCount: 0,
          jobs: [],
        });
      }

      const crewRevenue = crewRevenueMap.get(crewId)!;
      crewRevenue.totalRevenue += revenue;
      crewRevenue.jobCount++;
      crewRevenue.jobs.push({
        jobId: job.id,
        jobName: job.projectName || job.workOrderNumber,
        revenue,
      });
    });

    // Convert map to array and sort by revenue (highest first)
    const crewRevenues = Array.from(crewRevenueMap.values()).sort(
      (a, b) => b.totalRevenue - a.totalRevenue
    );

    // Calculate total revenue
    const totalRevenue = crewRevenues.reduce((sum, crew) => sum + crew.totalRevenue, 0);

    return {
      period,
      periodStart: periodRange.start.toISOString(),
      periodEnd: periodRange.end.toISOString(),
      crewRevenues,
      totalRevenue,
      settings,
    };
  }

  /**
   * Get crew name from crew ID or job data
   * @param crewId Crew ID
   * @param job Job object (fallback for crew name)
   * @returns Crew name
   */
  private getCrewName(crewId: string, job: Job): string {
    if (crewId === 'unassigned') {
      return 'Unassigned';
    }

    // Try to get crew name from job's assigned team
    if (job.assignedTo?.crewLeader) {
      return `${job.assignedTo.crewLeader}'s Crew`;
    }

    // Fallback to crew ID
    return `Crew ${crewId}`;
  }

  /**
   * Navigate to next/previous period
   * @param currentDate Current date
   * @param period Period type
   * @param direction Direction to navigate
   * @returns New date
   */
  navigatePeriod(currentDate: Date, period: RevenuePeriod, direction: 'prev' | 'next'): Date {
    const newDate = new Date(currentDate);
    const delta = direction === 'next' ? 1 : -1;

    if (period === 'day') {
      newDate.setDate(newDate.getDate() + delta);
    } else if (period === 'week') {
      newDate.setDate(newDate.getDate() + (delta * 7));
    } else {
      newDate.setMonth(newDate.getMonth() + delta);
    }

    return newDate;
  }

  /**
   * Format period label for display
   * @param period Period type
   * @param date Reference date
   * @returns Formatted label
   */
  formatPeriodLabel(period: RevenuePeriod, date: Date): string {
    if (period === 'day') {
      return date.toLocaleDateString('en-US', { 
        weekday: 'long',
        month: 'long', 
        day: 'numeric', 
        year: 'numeric' 
      });
    } else if (period === 'week') {
      const range = this.getPeriodRange(period, date);
      const startStr = range.start.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      const endStr = range.end.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
      return `${startStr} - ${endStr}`;
    } else {
      return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
    }
  }
}

export const revenueService = new RevenueService();


