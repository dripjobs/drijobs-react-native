import { CrewMember, CrewMetrics, Subcontractor, Timesheet } from '../types/crew';

class CrewService {
  private crewMembers: CrewMember[] = [];
  private subcontractors: Subcontractor[] = [];
  private timesheets: Timesheet[] = [];

  constructor() {
    this.initializeMockData();
  }

  private initializeMockData() {
    // Mock crew members
    this.crewMembers = [
      {
        id: '1',
        employeeNumber: 'EMP001',
        firstName: 'John',
        lastName: 'Smith',
        email: 'john.smith@example.com',
        phone: '(555) 123-4567',
        role: 'foreman',
        status: 'active',
        hourlyRate: 35,
        hireDate: '2022-01-15',
        skills: ['Plumbing', 'HVAC', 'Leadership'],
        certifications: [
          {
            id: 'cert1',
            name: 'Master Plumber',
            issuedBy: 'State Board',
            issuedDate: '2020-06-01',
            expiryDate: '2025-06-01',
          },
        ],
        address: '123 Main St, City, State 12345',
        emergencyContact: {
          name: 'Jane Smith',
          relationship: 'Spouse',
          phone: '(555) 123-4568',
        },
        notes: 'Excellent leadership skills',
        permissionLevel: 2, // Level 2: Can communicate with customers
        createdAt: new Date('2022-01-15').toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: '2',
        employeeNumber: 'EMP002',
        firstName: 'Mike',
        lastName: 'Johnson',
        email: 'mike.j@example.com',
        phone: '(555) 234-5678',
        role: 'technician',
        status: 'active',
        hourlyRate: 28,
        hireDate: '2023-03-20',
        skills: ['Electrical', 'Troubleshooting'],
        certifications: [
          {
            id: 'cert2',
            name: 'Journeyman Electrician',
            issuedBy: 'State Board',
            issuedDate: '2022-01-01',
            expiryDate: '2024-12-31',
          },
        ],
        permissionLevel: 1, // Level 1: Basic crew member
        createdAt: new Date('2023-03-20').toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ];

    // Mock subcontractors
    this.subcontractors = [
      {
        id: '1',
        companyName: 'ABC Roofing Co.',
        contactPerson: 'Robert Brown',
        email: 'robert@abcroofing.com',
        phone: '(555) 345-6789',
        status: 'active',
        specialties: ['Roofing', 'Gutters'],
        hourlyRate: 45,
        address: '456 Industrial Blvd, City, State 12345',
        taxId: '12-3456789',
        insuranceInfo: {
          provider: 'Insurance Co.',
          policyNumber: 'POL123456',
          expiryDate: '2025-12-31',
          coverageAmount: 1000000,
        },
        rating: 4.8,
        totalJobsCompleted: 125,
        createdAt: new Date('2021-05-10').toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: '2',
        companyName: 'Elite HVAC Services',
        contactPerson: 'Sarah Williams',
        email: 'sarah@elitehvac.com',
        phone: '(555) 456-7890',
        status: 'active',
        specialties: ['HVAC', 'Ductwork'],
        hourlyRate: 50,
        rating: 4.9,
        totalJobsCompleted: 89,
        createdAt: new Date('2022-02-15').toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ];

    // Mock timesheets
    const today = new Date();
    this.timesheets = [
      {
        id: '1',
        crewMemberId: '1',
        crewMemberName: 'John Smith',
        date: today.toISOString().split('T')[0],
        hoursWorked: 8,
        overtimeHours: 0,
        jobId: 'JOB001',
        jobName: 'Main Street Renovation',
        status: 'submitted',
        submittedAt: new Date().toISOString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: '2',
        crewMemberId: '2',
        crewMemberName: 'Mike Johnson',
        date: today.toISOString().split('T')[0],
        hoursWorked: 9,
        overtimeHours: 1,
        jobId: 'JOB002',
        jobName: 'Oak Avenue Repairs',
        status: 'submitted',
        submittedAt: new Date().toISOString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ];
  }

  // Crew Members
  getCrewMembers(): CrewMember[] {
    return this.crewMembers;
  }

  getCrewMember(id: string): CrewMember | undefined {
    return this.crewMembers.find(m => m.id === id);
  }

  createCrewMember(data: Omit<CrewMember, 'id' | 'employeeNumber' | 'createdAt' | 'updatedAt'>): CrewMember {
    const newMember: CrewMember = {
      ...data,
      id: Date.now().toString(),
      employeeNumber: `EMP${String(this.crewMembers.length + 1).padStart(3, '0')}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    this.crewMembers.push(newMember);
    return newMember;
  }

  updateCrewMember(id: string, data: Partial<CrewMember>): CrewMember | null {
    const index = this.crewMembers.findIndex(m => m.id === id);
    if (index === -1) return null;
    
    this.crewMembers[index] = {
      ...this.crewMembers[index],
      ...data,
      id,
      updatedAt: new Date().toISOString(),
    };
    return this.crewMembers[index];
  }

  deleteCrewMember(id: string): boolean {
    const index = this.crewMembers.findIndex(m => m.id === id);
    if (index === -1) return false;
    
    this.crewMembers.splice(index, 1);
    return true;
  }

  // Subcontractors
  getSubcontractors(): Subcontractor[] {
    return this.subcontractors;
  }

  getSubcontractor(id: string): Subcontractor | undefined {
    return this.subcontractors.find(s => s.id === id);
  }

  createSubcontractor(data: Omit<Subcontractor, 'id' | 'createdAt' | 'updatedAt'>): Subcontractor {
    const newSubcontractor: Subcontractor = {
      ...data,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    this.subcontractors.push(newSubcontractor);
    return newSubcontractor;
  }

  updateSubcontractor(id: string, data: Partial<Subcontractor>): Subcontractor | null {
    const index = this.subcontractors.findIndex(s => s.id === id);
    if (index === -1) return null;
    
    this.subcontractors[index] = {
      ...this.subcontractors[index],
      ...data,
      id,
      updatedAt: new Date().toISOString(),
    };
    return this.subcontractors[index];
  }

  deleteSubcontractor(id: string): boolean {
    const index = this.subcontractors.findIndex(s => s.id === id);
    if (index === -1) return false;
    
    this.subcontractors.splice(index, 1);
    return true;
  }

  // Timesheets
  getTimesheets(): Timesheet[] {
    return this.timesheets;
  }

  getTimesheet(id: string): Timesheet | undefined {
    return this.timesheets.find(t => t.id === id);
  }

  getTimesheetsByMember(memberId: string): Timesheet[] {
    return this.timesheets.filter(t => t.crewMemberId === memberId);
  }

  createTimesheet(data: Omit<Timesheet, 'id' | 'createdAt' | 'updatedAt'>): Timesheet {
    const newTimesheet: Timesheet = {
      ...data,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    this.timesheets.push(newTimesheet);
    return newTimesheet;
  }

  updateTimesheet(id: string, data: Partial<Timesheet>): Timesheet | null {
    const index = this.timesheets.findIndex(t => t.id === id);
    if (index === -1) return null;
    
    this.timesheets[index] = {
      ...this.timesheets[index],
      ...data,
      id,
      updatedAt: new Date().toISOString(),
    };
    return this.timesheets[index];
  }

  approveTimesheet(id: string, approvedBy: string): Timesheet | null {
    return this.updateTimesheet(id, {
      status: 'approved',
      approvedAt: new Date().toISOString(),
      approvedBy,
    });
  }

  rejectTimesheet(id: string): Timesheet | null {
    return this.updateTimesheet(id, { status: 'rejected' });
  }

  // Metrics
  getMetrics(): CrewMetrics {
    const activeMembers = this.crewMembers.filter(m => m.status === 'active');
    const now = new Date();
    const startOfWeek = new Date(now);
    startOfWeek.setDate(now.getDate() - now.getDay());
    startOfWeek.setHours(0, 0, 0, 0);

    const thisWeekTimesheets = this.timesheets.filter(t => {
      const timesheetDate = new Date(t.date);
      return timesheetDate >= startOfWeek;
    });

    const totalHoursThisWeek = thisWeekTimesheets.reduce(
      (sum, t) => sum + t.hoursWorked + (t.overtimeHours || 0),
      0
    );

    const totalPayrollThisWeek = thisWeekTimesheets.reduce((sum, t) => {
      const member = this.crewMembers.find(m => m.id === t.crewMemberId);
      if (!member) return sum;
      
      const regularPay = t.hoursWorked * member.hourlyRate;
      const overtimePay = (t.overtimeHours || 0) * member.hourlyRate * 1.5;
      return sum + regularPay + overtimePay;
    }, 0);

    const in90Days = new Date();
    in90Days.setDate(in90Days.getDate() + 90);

    const expiringCertifications = this.crewMembers.reduce((count, member) => {
      const expiring = member.certifications.filter(cert => {
        const expiryDate = new Date(cert.expiryDate);
        return expiryDate >= now && expiryDate <= in90Days;
      });
      return count + expiring.length;
    }, 0);

    const pendingTimesheets = this.timesheets.filter(
      t => t.status === 'submitted'
    ).length;

    return {
      totalActiveMembers: activeMembers.length,
      totalHoursThisWeek,
      totalPayrollThisWeek,
      expiringCertifications,
      totalSubcontractors: this.subcontractors.length,
      pendingTimesheets,
      currentlyClockedIn: 0, // Will be updated by TimeTrackingService
      totalLaborCostToday: 0, // Will be updated by TimeTrackingService
    };
  }
}

export const crewService = new CrewService();
