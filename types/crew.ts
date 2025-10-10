export type CrewMemberRole = 'technician' | 'foreman' | 'apprentice' | 'specialist' | 'manager';
export type CrewMemberStatus = 'active' | 'inactive' | 'on_leave' | 'terminated';
export type SubcontractorStatus = 'active' | 'inactive' | 'pending' | 'suspended';
export type TimesheetStatus = 'draft' | 'submitted' | 'approved' | 'rejected';
export type ClockEventType = 'clock_in' | 'clock_out' | 'break_start' | 'break_end';
export type TimeEntryStatus = 'active' | 'completed' | 'approved' | 'rejected' | 'edited';
export type BreakDeductionPolicy = 'none' | 'auto_30min' | 'auto_60min' | 'manual';

export interface CrewMember {
  id: string;
  employeeNumber: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  role: CrewMemberRole;
  status: CrewMemberStatus;
  hourlyRate: number;
  hireDate: string;
  skills: string[];
  certifications: Certification[];
  address?: string;
  emergencyContact?: EmergencyContact;
  notes?: string;
  crewId?: string; // ID of the crew this member belongs to (e.g., "Beau's Crew")
  permissionLevel: 1 | 2 | 3; // Permission level for app access (1 = basic, 2 = +customer comms, 3 = future)
  createdAt: string;
  updatedAt: string;
}

export interface Certification {
  id: string;
  name: string;
  issuedBy: string;
  issuedDate: string;
  expiryDate: string;
  documentUrl?: string;
}

export interface EmergencyContact {
  name: string;
  relationship: string;
  phone: string;
  alternatePhone?: string;
}

export interface Subcontractor {
  id: string;
  companyName: string;
  contactPerson: string;
  email: string;
  phone: string;
  status: SubcontractorStatus;
  specialties: string[];
  hourlyRate?: number;
  address?: string;
  taxId?: string;
  insuranceInfo?: InsuranceInfo;
  notes?: string;
  rating?: number;
  totalJobsCompleted?: number;
  createdAt: string;
  updatedAt: string;
}

export interface InsuranceInfo {
  provider: string;
  policyNumber: string;
  expiryDate: string;
  coverageAmount: number;
  documentUrl?: string;
}

export interface Timesheet {
  id: string;
  crewMemberId: string;
  crewMemberName: string;
  date: string;
  hoursWorked: number;
  overtimeHours?: number;
  jobId?: string;
  jobName?: string;
  notes?: string;
  status: TimesheetStatus;
  submittedAt?: string;
  approvedAt?: string;
  approvedBy?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CrewMetrics {
  totalActiveMembers: number;
  totalHoursThisWeek: number;
  totalPayrollThisWeek: number;
  expiringCertifications: number;
  totalSubcontractors: number;
  pendingTimesheets: number;
  currentlyClockedIn: number;
  totalLaborCostToday: number;
}

// GPS Location data structure
export interface GPSLocation {
  latitude: number;
  longitude: number;
  accuracy: number; // in meters
  timestamp: string;
}

// Individual clock event (in, out, break start, break end)
export interface ClockEvent {
  id: string;
  timeEntryId: string;
  crewMemberId: string;
  eventType: ClockEventType;
  timestamp: string;
  location?: GPSLocation;
  deviceInfo?: string;
  isSynced: boolean; // For offline support
  createdAt: string;
}

// Complete time entry (one work session)
export interface TimeEntry {
  id: string;
  crewMemberId: string;
  crewMemberName: string;
  jobId: string;
  jobName: string;
  jobAddress?: string;
  clockInTime: string;
  clockInLocation?: GPSLocation;
  clockOutTime?: string;
  clockOutLocation?: GPSLocation;
  breaks: BreakRecord[];
  totalHours: number;
  regularHours: number;
  overtimeHours: number;
  totalBreakMinutes: number;
  hourlyRate: number;
  regularCost: number;
  overtimeCost: number;
  totalCost: number;
  status: TimeEntryStatus;
  notes?: string;
  adminNotes?: string;
  isEdited: boolean;
  editedBy?: string;
  editedAt?: string;
  approvedBy?: string;
  approvedAt?: string;
  rejectionReason?: string;
  createdAt: string;
  updatedAt: string;
}

// Break record within a time entry
export interface BreakRecord {
  id: string;
  startTime: string;
  endTime?: string;
  durationMinutes: number;
  isPaid: boolean;
}

// Active clock-in session (currently working)
export interface ActiveClockSession {
  id: string;
  timeEntryId: string;
  crewMemberId: string;
  crewMemberName: string;
  crewMemberRole: CrewMemberRole;
  jobId: string;
  jobName: string;
  jobAddress?: string;
  clockInTime: string;
  clockInLocation?: GPSLocation;
  elapsedMinutes: number;
  currentBreak?: {
    startTime: string;
    elapsedMinutes: number;
  };
  estimatedCost: number;
  hourlyRate: number;
}

// Crew assignment (links crew members to crews and jobs)
export interface Crew {
  id: string;
  name: string; // e.g., "Beau's Crew", "Dan's Team"
  leaderId: string; // CrewMember ID of the leader
  leaderName: string;
  memberIds: string[];
  activeJobIds: string[];
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

// Time tracking settings
export interface TimeTrackingSettings {
  id: string;
  // Overtime rules
  overtimeThresholdHours: number; // Default: 8 hours per day or 40 per week
  overtimeMultiplier: number; // Default: 1.5x
  doubleTimeThresholdHours?: number; // Optional: e.g., 12 hours
  doubleTimeMultiplier?: number; // Default: 2.0x

  // Cost calculations
  overheadMultiplier: number; // Default: 0.30 (30% for benefits, insurance, etc.)
  benefitsPercentage: number; // Default: 0.15 (15%)

  // Break policies
  breakDeductionPolicy: BreakDeductionPolicy;
  autoBreakThresholdHours: number; // Default: 6 hours
  autoBreakDurationMinutes: number; // Default: 30 minutes

  // GPS settings
  requireGPSForClockIn: boolean;
  requireGPSForClockOut: boolean;
  gpsAccuracyThresholdMeters: number; // Default: 100 meters
  allowedGPSlessExceptions: boolean;

  // General settings
  allowManualTimeEntry: boolean; // Admin can manually add entries
  requireJobSelection: boolean; // Must select job to clock in
  enableBreakTracking: boolean;
  enablePhotoCapture: boolean; // Photo verification on clock in/out
  roundingInterval: number; // Round to nearest X minutes (0 = no rounding)

  updatedAt: string;
  updatedBy: string;
}

// Offline sync queue item
export interface OfflineClockEvent {
  id: string;
  crewMemberId: string;
  eventType: ClockEventType;
  timestamp: string;
  jobId?: string;
  location?: GPSLocation;
  notes?: string;
  isSynced: boolean;
  syncAttempts: number;
  createdAt: string;
}

// Time entry filters for reporting
export interface TimeEntryFilters {
  crewMemberIds?: string[];
  jobIds?: string[];
  startDate?: string;
  endDate?: string;
  status?: TimeEntryStatus[];
  crewIds?: string[];
}

// Cost report data
export interface LaborCostReport {
  periodStart: string;
  periodEnd: string;
  totalRegularHours: number;
  totalOvertimeHours: number;
  totalHours: number;
  totalRegularCost: number;
  totalOvertimeCost: number;
  totalLaborCost: number;
  averageHourlyRate: number;
  byCrewMember: Array<{
    crewMemberId: string;
    crewMemberName: string;
    hours: number;
    cost: number;
  }>;
  byJob: Array<{
    jobId: string;
    jobName: string;
    hours: number;
    cost: number;
    crewMemberCount: number;
  }>;
  byCrew: Array<{
    crewId: string;
    crewName: string;
    hours: number;
    cost: number;
  }>;
}
