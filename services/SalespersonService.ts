/**
 * Salesperson Service
 * Manages salesperson data and operations (currently using mock data)
 */

import {
    Salesperson,
    SalespersonAppointment,
    SalespersonMetrics,
    SalespersonPipelineDeal
} from '../types/salesperson';
import { SalespersonPermissionLevel } from '../types/userRoles';

// Mock data for salespeople
const mockSalespeople: Salesperson[] = [
  {
    id: 'sp1',
    firstName: 'Sarah',
    lastName: 'Johnson',
    email: 'sarah.johnson@example.com',
    phone: '(555) 101-2345',
    employeeNumber: 'SP-001',
    permissionLevel: 2,
    status: 'active',
    hireDate: '2023-01-15',
    salesTarget: 150000,
    currentSales: 129254,
    territory: 'North Region',
    specializations: ['Residential', 'Interior Painting'],
    emergencyContact: {
      name: 'Michael Johnson',
      relationship: 'Spouse',
      phone: '(555) 101-2346',
    },
  },
  {
    id: 'sp2',
    firstName: 'David',
    lastName: 'Chen',
    email: 'david.chen@example.com',
    phone: '(555) 202-3456',
    employeeNumber: 'SP-002',
    permissionLevel: 1,
    status: 'active',
    hireDate: '2023-06-01',
    salesTarget: 120000,
    currentSales: 85600,
    territory: 'South Region',
    specializations: ['Commercial', 'Exterior Painting'],
    emergencyContact: {
      name: 'Lisa Chen',
      relationship: 'Sister',
      phone: '(555) 202-3457',
    },
  },
  {
    id: 'sp3',
    firstName: 'Emily',
    lastName: 'Rodriguez',
    email: 'emily.rodriguez@example.com',
    phone: '(555) 303-4567',
    employeeNumber: 'SP-003',
    permissionLevel: 2,
    status: 'active',
    hireDate: '2022-09-10',
    salesTarget: 175000,
    currentSales: 145300,
    territory: 'East Region',
    specializations: ['Residential', 'Commercial', 'Restoration'],
    emergencyContact: {
      name: 'Carlos Rodriguez',
      relationship: 'Brother',
      phone: '(555) 303-4568',
    },
  },
];

// Mock pipeline deals
const mockPipelineDeals: SalespersonPipelineDeal[] = [
  {
    id: 'deal1',
    salespersonId: 'sp1',
    customerName: 'John Smith',
    businessName: 'Smith & Associates',
    stage: 'qualification',
    value: 12500,
    probability: 30,
    expectedCloseDate: '2025-11-15',
    lastActivity: '2025-10-10',
  },
  {
    id: 'deal2',
    salespersonId: 'sp1',
    customerName: 'Jane Doe',
    stage: 'proposal',
    value: 8750,
    probability: 60,
    expectedCloseDate: '2025-10-30',
    lastActivity: '2025-10-11',
  },
  {
    id: 'deal3',
    salespersonId: 'sp2',
    customerName: 'ABC Corporation',
    businessName: 'ABC Corp',
    stage: 'negotiation',
    value: 25000,
    probability: 80,
    expectedCloseDate: '2025-10-25',
    lastActivity: '2025-10-09',
  },
];

// Mock appointments
const mockAppointments: SalespersonAppointment[] = [
  {
    id: 'apt1',
    salespersonId: 'sp1',
    customerName: 'Robert Green',
    businessName: 'Green Industries',
    date: '2025-10-12',
    time: '2:00 PM',
    type: 'estimate',
    location: '123 Main St, Anytown',
    status: 'scheduled',
    notes: 'Needs quote for commercial building exterior',
  },
  {
    id: 'apt2',
    salespersonId: 'sp1',
    customerName: 'Nancy Lee',
    date: '2025-10-13',
    time: '10:00 AM',
    type: 'consultation',
    location: '456 Oak Ave, Anytown',
    status: 'scheduled',
    notes: 'Initial consultation for home interior',
  },
  {
    id: 'apt3',
    salespersonId: 'sp2',
    customerName: 'Kevin Hall',
    date: '2025-10-14',
    time: '3:00 PM',
    type: 'follow-up',
    location: '789 Pine Rd, Anytown',
    status: 'scheduled',
    notes: 'Follow-up on previous estimate',
  },
];

class SalespersonService {
  /**
   * Get all salespeople
   */
  getSalespeople(): Salesperson[] {
    return mockSalespeople;
  }

  /**
   * Get salesperson by ID
   */
  getSalespersonById(id: string): Salesperson | undefined {
    return mockSalespeople.find(sp => sp.id === id);
  }

  /**
   * Get active salespeople only
   */
  getActiveSalespeople(): Salesperson[] {
    return mockSalespeople.filter(sp => sp.status === 'active');
  }

  /**
   * Get salesperson metrics for a specific time range
   */
  getSalespersonMetrics(
    salespersonId: string,
    timeRange: 'day' | 'week' | 'month' | 'year' = 'month'
  ): SalespersonMetrics {
    // Mock metrics - in real app, this would come from API
    return {
      salespersonId,
      timeRange,
      totalSales: 129254,
      closingRatio: 31.9,
      proposalsSent: 24,
      appointmentsSet: 18,
      pipelineValue: 87500,
      dealsWon: 12,
      dealsLost: 8,
      averageDealSize: 10771,
      conversionRate: 60.0,
      salesTrend: 12.5,
      closingRatioTrend: -1.8,
      proposalsTrend: 8.3,
      appointmentsTrend: 5.2,
    };
  }

  /**
   * Update salesperson permission level
   */
  updateSalespersonPermissionLevel(
    salespersonId: string,
    level: SalespersonPermissionLevel
  ): void {
    const salesperson = mockSalespeople.find(sp => sp.id === salespersonId);
    if (salesperson) {
      salesperson.permissionLevel = level;
    }
  }

  /**
   * Get pipeline deals for a salesperson
   */
  getSalespersonPipeline(salespersonId: string): SalespersonPipelineDeal[] {
    return mockPipelineDeals.filter(deal => deal.salespersonId === salespersonId);
  }

  /**
   * Get all pipeline deals (admin only)
   */
  getAllPipelineDeals(): SalespersonPipelineDeal[] {
    return mockPipelineDeals;
  }

  /**
   * Get appointments for a salesperson
   */
  getSalespersonAppointments(salespersonId: string): SalespersonAppointment[] {
    return mockAppointments.filter(apt => apt.salespersonId === salespersonId);
  }

  /**
   * Get upcoming appointments for a salesperson
   */
  getUpcomingAppointments(salespersonId: string, days: number = 7): SalespersonAppointment[] {
    const today = new Date();
    const futureDate = new Date(today);
    futureDate.setDate(today.getDate() + days);

    return mockAppointments.filter(apt => {
      if (apt.salespersonId !== salespersonId) return false;
      const aptDate = new Date(apt.date);
      return aptDate >= today && aptDate <= futureDate && apt.status === 'scheduled';
    });
  }

  /**
   * Get salesperson by employee number
   */
  getSalespersonByEmployeeNumber(employeeNumber: string): Salesperson | undefined {
    return mockSalespeople.find(sp => sp.employeeNumber === employeeNumber);
  }

  /**
   * Update salesperson status
   */
  updateSalespersonStatus(
    salespersonId: string,
    status: 'active' | 'inactive' | 'on-leave'
  ): void {
    const salesperson = mockSalespeople.find(sp => sp.id === salespersonId);
    if (salesperson) {
      salesperson.status = status;
    }
  }

  /**
   * Get sales performance ranking
   */
  getSalesRanking(): Salesperson[] {
    return [...mockSalespeople].sort((a, b) => b.currentSales - a.currentSales);
  }

  /**
   * Calculate sales target progress
   */
  getSalesProgress(salespersonId: string): number {
    const salesperson = this.getSalespersonById(salespersonId);
    if (!salesperson) return 0;
    return (salesperson.currentSales / salesperson.salesTarget) * 100;
  }
}

export const salespersonService = new SalespersonService();


