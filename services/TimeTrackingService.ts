import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Location from 'expo-location';
import {
    ActiveClockSession,
    BreakRecord,
    ClockEvent,
    Crew,
    CrewMember,
    GPSLocation,
    LaborCostReport,
    OfflineClockEvent,
    TimeEntry,
    TimeEntryFilters,
    TimeTrackingSettings
} from '../types/crew';
import { Job } from '../types/jobs';

const STORAGE_KEYS = {
  TIME_ENTRIES: '@time_entries',
  ACTIVE_SESSIONS: '@active_clock_sessions',
  CLOCK_EVENTS: '@clock_events',
  OFFLINE_QUEUE: '@offline_clock_queue',
  SETTINGS: '@time_tracking_settings',
  CREWS: '@crews',
};

class TimeTrackingService {
  private timeEntries: TimeEntry[] = [];
  private activeSessions: ActiveClockSession[] = [];
  private clockEvents: ClockEvent[] = [];
  private offlineQueue: OfflineClockEvent[] = [];
  private settings: TimeTrackingSettings;
  private crews: Crew[] = [];

  constructor() {
    // Initialize default settings
    this.settings = this.getDefaultSettings();
    this.initializeData();
  }

  private async initializeData() {
    try {
      // Load from AsyncStorage
      const [
        entriesJson,
        sessionsJson,
        eventsJson,
        queueJson,
        settingsJson,
        crewsJson,
      ] = await Promise.all([
        AsyncStorage.getItem(STORAGE_KEYS.TIME_ENTRIES),
        AsyncStorage.getItem(STORAGE_KEYS.ACTIVE_SESSIONS),
        AsyncStorage.getItem(STORAGE_KEYS.CLOCK_EVENTS),
        AsyncStorage.getItem(STORAGE_KEYS.OFFLINE_QUEUE),
        AsyncStorage.getItem(STORAGE_KEYS.SETTINGS),
        AsyncStorage.getItem(STORAGE_KEYS.CREWS),
      ]);

      if (entriesJson) this.timeEntries = JSON.parse(entriesJson);
      if (sessionsJson) this.activeSessions = JSON.parse(sessionsJson);
      if (eventsJson) this.clockEvents = JSON.parse(eventsJson);
      if (queueJson) this.offlineQueue = JSON.parse(queueJson);
      if (settingsJson) this.settings = JSON.parse(settingsJson);
      if (crewsJson) this.crews = JSON.parse(crewsJson);

      // Initialize mock data if empty
      if (this.crews.length === 0) {
        this.initializeMockCrews();
      }
    } catch (error) {
      console.error('Error initializing time tracking data:', error);
    }
  }

  private initializeMockCrews() {
    this.crews = [
      {
        id: 'crew_1',
        name: "Beau's Crew",
        leaderId: '1',
        leaderName: 'John Smith',
        memberIds: ['1', '2'],
        activeJobIds: ['JOB001', 'JOB002'],
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: 'crew_2',
        name: "Dan's Team",
        leaderId: '2',
        leaderName: 'Mike Johnson',
        memberIds: ['2'],
        activeJobIds: ['JOB003'],
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ];
    this.saveCrews();
  }

  private getDefaultSettings(): TimeTrackingSettings {
    return {
      id: 'settings_1',
      overtimeThresholdHours: 8,
      overtimeMultiplier: 1.5,
      doubleTimeThresholdHours: 12,
      doubleTimeMultiplier: 2.0,
      overheadMultiplier: 0.30,
      benefitsPercentage: 0.15,
      breakDeductionPolicy: 'auto_30min',
      autoBreakThresholdHours: 6,
      autoBreakDurationMinutes: 30,
      requireGPSForClockIn: true,
      requireGPSForClockOut: true,
      gpsAccuracyThresholdMeters: 100,
      allowedGPSlessExceptions: true,
      allowManualTimeEntry: true,
      requireJobSelection: true,
      enableBreakTracking: true,
      enablePhotoCapture: false,
      roundingInterval: 0,
      updatedAt: new Date().toISOString(),
      updatedBy: 'system',
    };
  }

  // ==================== GPS FUNCTIONS ====================

  private async captureGPSLocation(): Promise<GPSLocation | null> {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        console.warn('Location permission not granted');
        return null;
      }

      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });

      return {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        accuracy: location.coords.accuracy || 0,
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      console.error('Error capturing GPS location:', error);
      return null;
    }
  }

  // ==================== CLOCK IN/OUT FUNCTIONS ====================

  async clockIn(
    crewMemberId: string,
    crewMember: CrewMember,
    jobId: string,
    jobName: string,
    jobAddress?: string,
    notes?: string
  ): Promise<{ success: boolean; timeEntry?: TimeEntry; session?: ActiveClockSession; error?: string }> {
    try {
      // Check if already clocked in
      const existingSession = this.activeSessions.find(
        s => s.crewMemberId === crewMemberId
      );
      if (existingSession) {
        return {
          success: false,
          error: 'Already clocked in. Please clock out first.',
        };
      }

      // Capture GPS location
      const location = await this.captureGPSLocation();
      if (this.settings.requireGPSForClockIn && !location && !this.settings.allowedGPSlessExceptions) {
        return {
          success: false,
          error: 'GPS location required to clock in',
        };
      }

      const now = new Date().toISOString();
      const timeEntryId = `entry_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

      // Create clock event
      const clockEvent: ClockEvent = {
        id: `event_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        timeEntryId,
        crewMemberId,
        eventType: 'clock_in',
        timestamp: now,
        location: location || undefined,
        isSynced: true,
        createdAt: now,
      };

      // Create time entry
      const timeEntry: TimeEntry = {
        id: timeEntryId,
        crewMemberId,
        crewMemberName: `${crewMember.firstName} ${crewMember.lastName}`,
        jobId,
        jobName,
        jobAddress,
        clockInTime: now,
        clockInLocation: location || undefined,
        breaks: [],
        totalHours: 0,
        regularHours: 0,
        overtimeHours: 0,
        totalBreakMinutes: 0,
        hourlyRate: crewMember.hourlyRate,
        regularCost: 0,
        overtimeCost: 0,
        totalCost: 0,
        status: 'active',
        notes,
        isEdited: false,
        createdAt: now,
        updatedAt: now,
      };

      // Create active session
      const session: ActiveClockSession = {
        id: timeEntryId,
        timeEntryId,
        crewMemberId,
        crewMemberName: `${crewMember.firstName} ${crewMember.lastName}`,
        crewMemberRole: crewMember.role,
        jobId,
        jobName,
        jobAddress,
        clockInTime: now,
        clockInLocation: location || undefined,
        elapsedMinutes: 0,
        estimatedCost: 0,
        hourlyRate: crewMember.hourlyRate,
      };

      // Save to storage
      this.clockEvents.push(clockEvent);
      this.timeEntries.push(timeEntry);
      this.activeSessions.push(session);

      await this.saveAll();

      return { success: true, timeEntry, session };
    } catch (error) {
      console.error('Error clocking in:', error);
      return {
        success: false,
        error: 'Failed to clock in. Please try again.',
      };
    }
  }

  async clockOut(
    crewMemberId: string,
    notes?: string
  ): Promise<{ success: boolean; timeEntry?: TimeEntry; error?: string }> {
    try {
      // Find active session
      const sessionIndex = this.activeSessions.findIndex(
        s => s.crewMemberId === crewMemberId
      );
      if (sessionIndex === -1) {
        return {
          success: false,
          error: 'No active clock-in session found',
        };
      }

      const session = this.activeSessions[sessionIndex];

      // Capture GPS location
      const location = await this.captureGPSLocation();
      if (this.settings.requireGPSForClockOut && !location && !this.settings.allowedGPSlessExceptions) {
        return {
          success: false,
          error: 'GPS location required to clock out',
        };
      }

      const now = new Date().toISOString();

      // Create clock out event
      const clockEvent: ClockEvent = {
        id: `event_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        timeEntryId: session.timeEntryId,
        crewMemberId,
        eventType: 'clock_out',
        timestamp: now,
        location: location || undefined,
        isSynced: true,
        createdAt: now,
      };

      // Update time entry
      const entryIndex = this.timeEntries.findIndex(e => e.id === session.timeEntryId);
      if (entryIndex !== -1) {
        const entry = this.timeEntries[entryIndex];
        entry.clockOutTime = now;
        entry.clockOutLocation = location || undefined;
        if (notes) entry.notes = notes;

        // Calculate hours and costs
        const calculations = this.calculateTimeAndCost(entry);
        Object.assign(entry, calculations);

        entry.status = 'completed';
        entry.updatedAt = now;
      }

      // Save clock event and remove active session
      this.clockEvents.push(clockEvent);
      this.activeSessions.splice(sessionIndex, 1);

      await this.saveAll();

      return {
        success: true,
        timeEntry: this.timeEntries[entryIndex],
      };
    } catch (error) {
      console.error('Error clocking out:', error);
      return {
        success: false,
        error: 'Failed to clock out. Please try again.',
      };
    }
  }

  async adminClockOut(
    crewMemberId: string,
    adminId: string,
    reason: string
  ): Promise<{ success: boolean; timeEntry?: TimeEntry; error?: string }> {
    try {
      const result = await this.clockOut(crewMemberId);
      if (result.success && result.timeEntry) {
        result.timeEntry.adminNotes = `Admin clock-out by ${adminId}: ${reason}`;
        result.timeEntry.isEdited = true;
        result.timeEntry.editedBy = adminId;
        result.timeEntry.editedAt = new Date().toISOString();
        await this.saveTimeEntries();
      }
      return result;
    } catch (error) {
      console.error('Error in admin clock out:', error);
      return {
        success: false,
        error: 'Failed to perform admin clock out',
      };
    }
  }

  // ==================== BREAK FUNCTIONS ====================

  async startBreak(crewMemberId: string): Promise<{ success: boolean; error?: string }> {
    try {
      const session = this.activeSessions.find(s => s.crewMemberId === crewMemberId);
      if (!session) {
        return { success: false, error: 'No active session found' };
      }

      if (session.currentBreak) {
        return { success: false, error: 'Already on break' };
      }

      const now = new Date().toISOString();
      session.currentBreak = {
        startTime: now,
        elapsedMinutes: 0,
      };

      // Create break start event
      const clockEvent: ClockEvent = {
        id: `event_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        timeEntryId: session.timeEntryId,
        crewMemberId,
        eventType: 'break_start',
        timestamp: now,
        isSynced: true,
        createdAt: now,
      };

      this.clockEvents.push(clockEvent);
      await this.saveAll();

      return { success: true };
    } catch (error) {
      console.error('Error starting break:', error);
      return { success: false, error: 'Failed to start break' };
    }
  }

  async endBreak(crewMemberId: string): Promise<{ success: boolean; error?: string }> {
    try {
      const session = this.activeSessions.find(s => s.crewMemberId === crewMemberId);
      if (!session || !session.currentBreak) {
        return { success: false, error: 'No active break found' };
      }

      const now = new Date().toISOString();
      const breakStart = new Date(session.currentBreak.startTime);
      const breakEnd = new Date(now);
      const durationMinutes = Math.floor((breakEnd.getTime() - breakStart.getTime()) / 60000);

      // Add break to time entry
      const entry = this.timeEntries.find(e => e.id === session.timeEntryId);
      if (entry) {
        const breakRecord: BreakRecord = {
          id: `break_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          startTime: session.currentBreak.startTime,
          endTime: now,
          durationMinutes,
          isPaid: false,
        };
        entry.breaks.push(breakRecord);
        entry.totalBreakMinutes += durationMinutes;
      }

      // Create break end event
      const clockEvent: ClockEvent = {
        id: `event_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        timeEntryId: session.timeEntryId,
        crewMemberId,
        eventType: 'break_end',
        timestamp: now,
        isSynced: true,
        createdAt: now,
      };

      this.clockEvents.push(clockEvent);
      session.currentBreak = undefined;
      await this.saveAll();

      return { success: true };
    } catch (error) {
      console.error('Error ending break:', error);
      return { success: false, error: 'Failed to end break' };
    }
  }

  // ==================== CALCULATION FUNCTIONS ====================

  private calculateTimeAndCost(entry: TimeEntry): Partial<TimeEntry> {
    if (!entry.clockInTime || !entry.clockOutTime) {
      return {
        totalHours: 0,
        regularHours: 0,
        overtimeHours: 0,
        regularCost: 0,
        overtimeCost: 0,
        totalCost: 0,
      };
    }

    const clockIn = new Date(entry.clockInTime);
    const clockOut = new Date(entry.clockOutTime);
    let totalMinutes = Math.floor((clockOut.getTime() - clockIn.getTime()) / 60000);

    // Subtract break time
    totalMinutes -= entry.totalBreakMinutes;

    // Apply auto break deduction if policy requires
    if (this.settings.breakDeductionPolicy !== 'none' && this.settings.breakDeductionPolicy !== 'manual') {
      const hoursWorked = totalMinutes / 60;
      if (hoursWorked >= this.settings.autoBreakThresholdHours) {
        const autoBreakMinutes = this.settings.breakDeductionPolicy === 'auto_30min' ? 30 : 60;
        totalMinutes -= autoBreakMinutes;
      }
    }

    const totalHours = totalMinutes / 60;

    // Calculate regular and overtime hours
    let regularHours = 0;
    let overtimeHours = 0;

    if (totalHours <= this.settings.overtimeThresholdHours) {
      regularHours = totalHours;
    } else {
      regularHours = this.settings.overtimeThresholdHours;
      overtimeHours = totalHours - this.settings.overtimeThresholdHours;
    }

    // Calculate costs with overhead multiplier
    const baseRate = entry.hourlyRate;
    const costMultiplier = 1 + this.settings.overheadMultiplier;

    const regularCost = regularHours * baseRate * costMultiplier;
    const overtimeCost = overtimeHours * baseRate * this.settings.overtimeMultiplier * costMultiplier;
    const totalCost = regularCost + overtimeCost;

    return {
      totalHours: Math.round(totalHours * 100) / 100,
      regularHours: Math.round(regularHours * 100) / 100,
      overtimeHours: Math.round(overtimeHours * 100) / 100,
      regularCost: Math.round(regularCost * 100) / 100,
      overtimeCost: Math.round(overtimeCost * 100) / 100,
      totalCost: Math.round(totalCost * 100) / 100,
    };
  }

  // ==================== DATA RETRIEVAL ====================

  getActiveSessions(): ActiveClockSession[] {
    // Update elapsed time for each session
    const now = new Date();
    return this.activeSessions.map(session => {
      const clockIn = new Date(session.clockInTime);
      const elapsedMinutes = Math.floor((now.getTime() - clockIn.getTime()) / 60000);
      const estimatedCost = (elapsedMinutes / 60) * session.hourlyRate * (1 + this.settings.overheadMultiplier);

      return {
        ...session,
        elapsedMinutes,
        estimatedCost: Math.round(estimatedCost * 100) / 100,
      };
    });
  }

  getActiveSessionByCrewMember(crewMemberId: string): ActiveClockSession | null {
    const session = this.activeSessions.find(s => s.crewMemberId === crewMemberId);
    if (!session) return null;

    // Update elapsed time
    const now = new Date();
    const clockIn = new Date(session.clockInTime);
    const elapsedMinutes = Math.floor((now.getTime() - clockIn.getTime()) / 60000);
    const estimatedCost = (elapsedMinutes / 60) * session.hourlyRate * (1 + this.settings.overheadMultiplier);

    return {
      ...session,
      elapsedMinutes,
      estimatedCost: Math.round(estimatedCost * 100) / 100,
    };
  }

  getTimeEntries(filters?: TimeEntryFilters): TimeEntry[] {
    let filtered = [...this.timeEntries];

    if (filters) {
      if (filters.crewMemberIds && filters.crewMemberIds.length > 0) {
        filtered = filtered.filter(e => filters.crewMemberIds!.includes(e.crewMemberId));
      }

      if (filters.jobIds && filters.jobIds.length > 0) {
        filtered = filtered.filter(e => filters.jobIds!.includes(e.jobId));
      }

      if (filters.startDate) {
        filtered = filtered.filter(e => e.clockInTime >= filters.startDate!);
      }

      if (filters.endDate) {
        filtered = filtered.filter(e => e.clockInTime <= filters.endDate!);
      }

      if (filters.status && filters.status.length > 0) {
        filtered = filtered.filter(e => filters.status!.includes(e.status));
      }
    }

    return filtered.sort((a, b) => new Date(b.clockInTime).getTime() - new Date(a.clockInTime).getTime());
  }

  getTimeEntriesByCrewMember(crewMemberId: string, startDate?: string, endDate?: string): TimeEntry[] {
    return this.getTimeEntries({
      crewMemberIds: [crewMemberId],
      startDate,
      endDate,
    });
  }

  getTimeEntriesByJob(jobId: string): TimeEntry[] {
    return this.getTimeEntries({ jobIds: [jobId] });
  }

  // ==================== JOB ASSIGNMENT FUNCTIONS ====================

  getAssignedJobs(crewMemberId: string, allJobs: Job[]): Job[] {
    // Get crew member's crew
    const crewMember = this.crews.find(c => c.memberIds.includes(crewMemberId));
    
    if (!crewMember) {
      // If not in a crew, only return jobs directly assigned to the member
      return allJobs.filter(job => 
        job.assignedCrewMemberIds && job.assignedCrewMemberIds.includes(crewMemberId)
      );
    }

    // Return jobs assigned to the crew or to the member directly
    return allJobs.filter(job => 
      (job.assignedCrewIds && job.assignedCrewIds.includes(crewMember.id)) ||
      (job.assignedCrewMemberIds && job.assignedCrewMemberIds.includes(crewMemberId))
    );
  }

  // ==================== ADMIN FUNCTIONS ====================

  async editTimeEntry(
    entryId: string,
    updates: Partial<TimeEntry>,
    adminId: string
  ): Promise<{ success: boolean; timeEntry?: TimeEntry; error?: string }> {
    try {
      const index = this.timeEntries.findIndex(e => e.id === entryId);
      if (index === -1) {
        return { success: false, error: 'Time entry not found' };
      }

      const entry = this.timeEntries[index];
      Object.assign(entry, updates);
      entry.isEdited = true;
      entry.editedBy = adminId;
      entry.editedAt = new Date().toISOString();
      entry.updatedAt = new Date().toISOString();

      // Recalculate if times were changed
      if (updates.clockInTime || updates.clockOutTime) {
        const calculations = this.calculateTimeAndCost(entry);
        Object.assign(entry, calculations);
      }

      await this.saveTimeEntries();
      return { success: true, timeEntry: entry };
    } catch (error) {
      console.error('Error editing time entry:', error);
      return { success: false, error: 'Failed to edit time entry' };
    }
  }

  async approveTimeEntry(entryId: string, adminId: string): Promise<boolean> {
    const index = this.timeEntries.findIndex(e => e.id === entryId);
    if (index === -1) return false;

    this.timeEntries[index].status = 'approved';
    this.timeEntries[index].approvedBy = adminId;
    this.timeEntries[index].approvedAt = new Date().toISOString();
    this.timeEntries[index].updatedAt = new Date().toISOString();

    await this.saveTimeEntries();
    return true;
  }

  async rejectTimeEntry(entryId: string, reason: string): Promise<boolean> {
    const index = this.timeEntries.findIndex(e => e.id === entryId);
    if (index === -1) return false;

    this.timeEntries[index].status = 'rejected';
    this.timeEntries[index].rejectionReason = reason;
    this.timeEntries[index].updatedAt = new Date().toISOString();

    await this.saveTimeEntries();
    return true;
  }

  // ==================== COST REPORTING ====================

  generateLaborCostReport(startDate: string, endDate: string): LaborCostReport {
    const entries = this.getTimeEntries({ startDate, endDate, status: ['completed', 'approved'] });

    const report: LaborCostReport = {
      periodStart: startDate,
      periodEnd: endDate,
      totalRegularHours: 0,
      totalOvertimeHours: 0,
      totalHours: 0,
      totalRegularCost: 0,
      totalOvertimeCost: 0,
      totalLaborCost: 0,
      averageHourlyRate: 0,
      byCrewMember: [],
      byJob: [],
      byCrew: [],
    };

    // Aggregate by crew member
    const memberMap = new Map<string, { hours: number; cost: number }>();
    const jobMap = new Map<string, { hours: number; cost: number; members: Set<string> }>();
    let totalRate = 0;
    let rateCount = 0;

    entries.forEach(entry => {
      // Totals
      report.totalRegularHours += entry.regularHours;
      report.totalOvertimeHours += entry.overtimeHours;
      report.totalHours += entry.totalHours;
      report.totalRegularCost += entry.regularCost;
      report.totalOvertimeCost += entry.overtimeCost;
      report.totalLaborCost += entry.totalCost;

      totalRate += entry.hourlyRate;
      rateCount++;

      // By crew member
      const memberKey = entry.crewMemberId;
      if (!memberMap.has(memberKey)) {
        memberMap.set(memberKey, { hours: 0, cost: 0 });
      }
      const memberData = memberMap.get(memberKey)!;
      memberData.hours += entry.totalHours;
      memberData.cost += entry.totalCost;

      // By job
      const jobKey = entry.jobId;
      if (!jobMap.has(jobKey)) {
        jobMap.set(jobKey, { hours: 0, cost: 0, members: new Set() });
      }
      const jobData = jobMap.get(jobKey)!;
      jobData.hours += entry.totalHours;
      jobData.cost += entry.totalCost;
      jobData.members.add(entry.crewMemberId);
    });

    report.averageHourlyRate = rateCount > 0 ? totalRate / rateCount : 0;

    // Convert maps to arrays
    memberMap.forEach((data, memberId) => {
      const entry = entries.find(e => e.crewMemberId === memberId);
      report.byCrewMember.push({
        crewMemberId: memberId,
        crewMemberName: entry?.crewMemberName || 'Unknown',
        hours: Math.round(data.hours * 100) / 100,
        cost: Math.round(data.cost * 100) / 100,
      });
    });

    jobMap.forEach((data, jobId) => {
      const entry = entries.find(e => e.jobId === jobId);
      report.byJob.push({
        jobId,
        jobName: entry?.jobName || 'Unknown',
        hours: Math.round(data.hours * 100) / 100,
        cost: Math.round(data.cost * 100) / 100,
        crewMemberCount: data.members.size,
      });
    });

    // Round totals
    report.totalRegularHours = Math.round(report.totalRegularHours * 100) / 100;
    report.totalOvertimeHours = Math.round(report.totalOvertimeHours * 100) / 100;
    report.totalHours = Math.round(report.totalHours * 100) / 100;
    report.totalRegularCost = Math.round(report.totalRegularCost * 100) / 100;
    report.totalOvertimeCost = Math.round(report.totalOvertimeCost * 100) / 100;
    report.totalLaborCost = Math.round(report.totalLaborCost * 100) / 100;
    report.averageHourlyRate = Math.round(report.averageHourlyRate * 100) / 100;

    return report;
  }

  // ==================== SETTINGS ====================

  getSettings(): TimeTrackingSettings {
    return { ...this.settings };
  }

  async updateSettings(updates: Partial<TimeTrackingSettings>, updatedBy: string): Promise<boolean> {
    try {
      this.settings = {
        ...this.settings,
        ...updates,
        updatedAt: new Date().toISOString(),
        updatedBy,
      };
      await AsyncStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(this.settings));
      return true;
    } catch (error) {
      console.error('Error updating settings:', error);
      return false;
    }
  }

  // ==================== CREW MANAGEMENT ====================

  getCrews(): Crew[] {
    return [...this.crews];
  }

  getCrew(crewId: string): Crew | undefined {
    return this.crews.find(c => c.id === crewId);
  }

  getCrewByMember(crewMemberId: string): Crew | undefined {
    return this.crews.find(c => c.memberIds.includes(crewMemberId));
  }

  async createCrew(crewData: Omit<Crew, 'id' | 'createdAt' | 'updatedAt'>): Promise<Crew> {
    const crew: Crew = {
      ...crewData,
      id: `crew_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    this.crews.push(crew);
    await this.saveCrews();
    return crew;
  }

  async updateCrew(crewId: string, updates: Partial<Crew>): Promise<Crew | null> {
    const index = this.crews.findIndex(c => c.id === crewId);
    if (index === -1) return null;

    this.crews[index] = {
      ...this.crews[index],
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    await this.saveCrews();
    return this.crews[index];
  }

  // ==================== OFFLINE SUPPORT ====================

  async queueOfflineClockEvent(event: Omit<OfflineClockEvent, 'id' | 'isSynced' | 'syncAttempts' | 'createdAt'>): Promise<void> {
    const offlineEvent: OfflineClockEvent = {
      ...event,
      id: `offline_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      isSynced: false,
      syncAttempts: 0,
      createdAt: new Date().toISOString(),
    };
    this.offlineQueue.push(offlineEvent);
    await this.saveOfflineQueue();
  }

  async syncOfflineEvents(): Promise<{ synced: number; failed: number }> {
    let synced = 0;
    let failed = 0;

    for (const event of this.offlineQueue) {
      if (event.isSynced) continue;

      // In a real app, this would sync to a backend
      // For now, we'll just mark as synced
      event.isSynced = true;
      event.syncAttempts++;
      synced++;
    }

    // Remove synced events
    this.offlineQueue = this.offlineQueue.filter(e => !e.isSynced);
    await this.saveOfflineQueue();

    return { synced, failed };
  }

  getPendingOfflineEvents(): OfflineClockEvent[] {
    return this.offlineQueue.filter(e => !e.isSynced);
  }

  // ==================== STORAGE FUNCTIONS ====================

  private async saveTimeEntries() {
    await AsyncStorage.setItem(STORAGE_KEYS.TIME_ENTRIES, JSON.stringify(this.timeEntries));
  }

  private async saveSessions() {
    await AsyncStorage.setItem(STORAGE_KEYS.ACTIVE_SESSIONS, JSON.stringify(this.activeSessions));
  }

  private async saveClockEvents() {
    await AsyncStorage.setItem(STORAGE_KEYS.CLOCK_EVENTS, JSON.stringify(this.clockEvents));
  }

  private async saveOfflineQueue() {
    await AsyncStorage.setItem(STORAGE_KEYS.OFFLINE_QUEUE, JSON.stringify(this.offlineQueue));
  }

  private async saveCrews() {
    await AsyncStorage.setItem(STORAGE_KEYS.CREWS, JSON.stringify(this.crews));
  }

  private async saveAll() {
    await Promise.all([
      this.saveTimeEntries(),
      this.saveSessions(),
      this.saveClockEvents(),
      this.saveOfflineQueue(),
    ]);
  }

  // ==================== MOCK DATA INITIALIZATION ====================

  async initializeMockData() {
    // Clear existing data
    this.timeEntries = [];
    this.activeSessions = [];
    this.clockEvents = [];
    
    await this.saveAll();
  }
}

export const timeTrackingService = new TimeTrackingService();

