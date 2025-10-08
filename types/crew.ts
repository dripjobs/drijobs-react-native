export type CrewMemberRole = 'technician' | 'foreman' | 'apprentice' | 'specialist' | 'manager';
export type CrewMemberStatus = 'active' | 'inactive' | 'on_leave' | 'terminated';
export type SubcontractorStatus = 'active' | 'inactive' | 'pending' | 'suspended';
export type TimesheetStatus = 'draft' | 'submitted' | 'approved' | 'rejected';

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
}
