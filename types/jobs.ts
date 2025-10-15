/**
 * Job and Work Order Type Definitions
 * Extended to support crew assignments for time tracking
 */

export type JobStage = 'pending_schedule' | 'in_progress' | 'project_scheduled' | 'project_complete';
export type JobPriority = 'low' | 'medium' | 'high' | 'urgent';

export interface Job {
  id: string;
  workOrderNumber: string;
  customerName: string;
  businessName?: string;
  projectName: string;
  address: string;
  phone: string;
  jobStage: JobStage;
  proposalNumber?: string;
  contractValue: number;
  startDate: string;
  endDate?: string;
  daysInStage: number;
  assignedTo: {
    projectManager?: string;
    crewLeader?: string;
    salesperson: string;
  };
  // Crew assignments for time tracking
  assignedCrewIds: string[]; // Array of Crew IDs
  assignedCrewMemberIds: string[]; // Array of individual CrewMember IDs
  priority: JobPriority;
  completionPercentage?: number;
  lastActivity: string;
  hasIssues?: boolean;
  description?: string;
  createdAt: string;
  updatedAt: string;
}

export interface JobAssignment {
  id: string;
  jobId: string;
  jobName: string;
  crewId?: string;
  crewName?: string;
  crewMemberIds: string[];
  assignedAt: string;
  assignedBy: string;
  startDate?: string;
  endDate?: string;
  isActive: boolean;
}

