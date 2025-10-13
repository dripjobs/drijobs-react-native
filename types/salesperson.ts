/**
 * Salesperson Type Definitions
 * Defines salesperson data structures for DripJobs
 */

import { SalespersonPermissionLevel } from './userRoles';

export type SalespersonStatus = 'active' | 'inactive' | 'on-leave';

export interface Salesperson {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  employeeNumber: string;
  
  // Role and permissions
  permissionLevel: SalespersonPermissionLevel;
  status: SalespersonStatus;
  
  // Employment info
  hireDate: string;
  
  // Sales info
  salesTarget: number;
  currentSales: number;
  territory?: string;
  specializations: string[];
  
  // Profile
  profilePicture?: string;
  emergencyContact?: {
    name: string;
    relationship: string;
    phone: string;
  };
}

export interface SalespersonMetrics {
  salespersonId: string;
  timeRange: 'day' | 'week' | 'month' | 'year';
  
  // Core metrics
  totalSales: number;
  closingRatio: number;
  proposalsSent: number;
  appointmentsSet: number;
  pipelineValue: number;
  
  // Additional metrics
  dealsWon: number;
  dealsLost: number;
  averageDealSize: number;
  conversionRate: number;
  
  // Trends
  salesTrend: number; // Percentage change
  closingRatioTrend: number;
  proposalsTrend: number;
  appointmentsTrend: number;
}

export interface SalespersonPipelineDeal {
  id: string;
  salespersonId: string;
  customerName: string;
  businessName?: string;
  stage: string;
  value: number;
  probability: number;
  expectedCloseDate: string;
  lastActivity: string;
}

export interface SalespersonAppointment {
  id: string;
  salespersonId: string;
  customerName: string;
  businessName?: string;
  date: string;
  time: string;
  type: 'estimate' | 'consultation' | 'follow-up' | 'site-visit' | 'other';
  location: string;
  status: 'scheduled' | 'completed' | 'cancelled' | 'no-show';
  notes?: string;
}

export interface SalespersonGoal {
  id: string;
  salespersonId: string;
  type: 'sales' | 'appointments' | 'proposals' | 'deals';
  target: number;
  current: number;
  period: 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'yearly';
  startDate: string;
  endDate: string;
}


