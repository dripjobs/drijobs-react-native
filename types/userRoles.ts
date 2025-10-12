/**
 * User Role Type Definitions
 * Defines user roles and permissions for DripJobs
 */

export type UserRole = 'admin' | 'accountant' | 'crew' | 'salesperson';
export type CrewPermissionLevel = 1 | 2 | 3;
export type SalespersonPermissionLevel = 1 | 2 | 3;

export interface UserPermissions {
  // General permissions
  canCreate: boolean;
  canEdit: boolean;
  canDelete: boolean;
  canView: boolean;

  // QuickBooks specific permissions
  canAccessQuickBooksSettings: boolean;
  canSyncToQuickBooks: boolean;
  canViewSyncStatus: boolean;
  canExportReports: boolean;

  // Entity-specific permissions
  canManageContacts: boolean;
  canManageBusinesses: boolean;
  canManageInvoices: boolean;
  canManagePayments: boolean;
  canManageJobs: boolean;
  canManageProposals: boolean;

  // Time tracking permissions
  canClockIn: boolean;
  canViewOwnTimesheets: boolean;
  canViewAllTimesheets: boolean;
  canEditTimesheets: boolean;
  canApproveTimesheets: boolean;
  canViewAssignedJobs: boolean;
  canManageTimeTrackingSettings: boolean;

  // Crew-specific permissions
  canViewMyDay: boolean;
  canViewJobSchedule: boolean;
  canViewWorkOrders: boolean;
  canViewTeamChat: boolean;
  canViewOwnTasks: boolean;
  canEditBasicProfile: boolean;
  canChatWithCustomers: boolean;
  canPhoneCustomers: boolean;
  canViewContactDetails: boolean;

  // Salesperson-specific permissions
  canViewOwnSalesMetrics: boolean;
  canManageOwnPipeline: boolean;
  canScheduleAppointments: boolean;
  canSendProposals: boolean;
  canViewPipeline: boolean;
  canEmailCustomers: boolean;
}

export interface RoleDefinition {
  role: UserRole;
  label: string;
  description: string;
  permissions: UserPermissions;
}

// Role definitions
export const ROLE_DEFINITIONS: Record<UserRole, RoleDefinition> = {
  admin: {
    role: 'admin',
    label: 'Administrator',
    description: 'Full access to all features and settings',
    permissions: {
      canCreate: true,
      canEdit: true,
      canDelete: true,
      canView: true,
      canAccessQuickBooksSettings: true,
      canSyncToQuickBooks: true,
      canViewSyncStatus: true,
      canExportReports: true,
      canManageContacts: true,
      canManageBusinesses: true,
      canManageInvoices: true,
      canManagePayments: true,
      canManageJobs: true,
      canManageProposals: true,
      canClockIn: true,
      canViewOwnTimesheets: true,
      canViewAllTimesheets: true,
      canEditTimesheets: true,
      canApproveTimesheets: true,
      canViewAssignedJobs: true,
      canManageTimeTrackingSettings: true,
      canViewMyDay: true,
      canViewJobSchedule: true,
      canViewWorkOrders: true,
      canViewTeamChat: true,
      canViewOwnTasks: true,
      canEditBasicProfile: true,
      canChatWithCustomers: true,
      canPhoneCustomers: true,
      canViewContactDetails: true,
    },
  },
  accountant: {
    role: 'accountant',
    label: 'Accountant/Bookkeeper',
    description: 'Read-only access to QuickBooks-synced financial data for reconciliation',
    permissions: {
      canCreate: false,
      canEdit: false,
      canDelete: false,
      canView: true,
      canAccessQuickBooksSettings: false,
      canSyncToQuickBooks: false,
      canViewSyncStatus: true,
      canExportReports: true,
      canManageContacts: false,
      canManageBusinesses: false,
      canManageInvoices: false,
      canManagePayments: false,
      canManageJobs: false,
      canManageProposals: false,
      canClockIn: false,
      canViewOwnTimesheets: false,
      canViewAllTimesheets: true,
      canEditTimesheets: false,
      canApproveTimesheets: false,
      canViewAssignedJobs: false,
      canManageTimeTrackingSettings: false,
      canViewMyDay: false,
      canViewJobSchedule: false,
      canViewWorkOrders: false,
      canViewTeamChat: false,
      canViewOwnTasks: false,
      canEditBasicProfile: false,
      canChatWithCustomers: false,
      canPhoneCustomers: false,
      canViewContactDetails: false,
    },
  },
  crew: {
    role: 'crew',
    label: 'Crew Member',
    description: 'Field worker with time tracking and job access',
    permissions: {
      canCreate: false,
      canEdit: false,
      canDelete: false,
      canView: false,
      canAccessQuickBooksSettings: false,
      canSyncToQuickBooks: false,
      canViewSyncStatus: false,
      canExportReports: false,
      canManageContacts: false,
      canManageBusinesses: false,
      canManageInvoices: false,
      canManagePayments: false,
      canManageJobs: false,
      canManageProposals: false,
      canClockIn: true,
      canViewOwnTimesheets: true,
      canViewAllTimesheets: false,
      canEditTimesheets: false,
      canApproveTimesheets: false,
      canViewAssignedJobs: true,
      canManageTimeTrackingSettings: false,
      canViewMyDay: true,
      canViewJobSchedule: true,
      canViewWorkOrders: true,
      canViewTeamChat: true,
      canViewOwnTasks: true,
      canEditBasicProfile: true,
      canChatWithCustomers: false, // Level 2 only
      canPhoneCustomers: false, // Level 2 only
      canViewContactDetails: false, // Level 2 only
    },
  },
};

// Permission levels for crew members
export const CREW_PERMISSION_LEVELS: Record<CrewPermissionLevel, UserPermissions> = {
  1: {
    // Level 1: Basic crew member
    canCreate: false,
    canEdit: false,
    canDelete: false,
    canView: false,
    canAccessQuickBooksSettings: false,
    canSyncToQuickBooks: false,
    canViewSyncStatus: false,
    canExportReports: false,
    canManageContacts: false,
    canManageBusinesses: false,
    canManageInvoices: false,
    canManagePayments: false,
    canManageJobs: false,
    canManageProposals: false,
    canClockIn: true,
    canViewOwnTimesheets: true,
    canViewAllTimesheets: false,
    canEditTimesheets: false,
    canApproveTimesheets: false,
    canViewAssignedJobs: true,
    canManageTimeTrackingSettings: false,
    canViewMyDay: true,
    canViewJobSchedule: true,
    canViewWorkOrders: true,
    canViewTeamChat: true,
    canViewOwnTasks: true,
    canEditBasicProfile: true,
    canChatWithCustomers: false,
    canPhoneCustomers: false,
    canViewContactDetails: false,
  },
  2: {
    // Level 2: Crew member with customer communication
    canCreate: false,
    canEdit: false,
    canDelete: false,
    canView: false,
    canAccessQuickBooksSettings: false,
    canSyncToQuickBooks: false,
    canViewSyncStatus: false,
    canExportReports: false,
    canManageContacts: false,
    canManageBusinesses: false,
    canManageInvoices: false,
    canManagePayments: false,
    canManageJobs: false,
    canManageProposals: false,
    canClockIn: true,
    canViewOwnTimesheets: true,
    canViewAllTimesheets: false,
    canEditTimesheets: false,
    canApproveTimesheets: false,
    canViewAssignedJobs: true,
    canManageTimeTrackingSettings: false,
    canViewMyDay: true,
    canViewJobSchedule: true,
    canViewWorkOrders: true,
    canViewTeamChat: true,
    canViewOwnTasks: true,
    canEditBasicProfile: true,
    canChatWithCustomers: true,  // Added in Level 2
    canPhoneCustomers: true,      // Added in Level 2
    canViewContactDetails: true,  // Added in Level 2
  },
  3: {
    // Level 3: Reserved for future expansion
    canCreate: false,
    canEdit: false,
    canDelete: false,
    canView: false,
    canAccessQuickBooksSettings: false,
    canSyncToQuickBooks: false,
    canViewSyncStatus: false,
    canExportReports: false,
    canManageContacts: false,
    canManageBusinesses: false,
    canManageInvoices: false,
    canManagePayments: false,
    canManageJobs: false,
    canManageProposals: false,
    canClockIn: true,
    canViewOwnTimesheets: true,
    canViewAllTimesheets: false,
    canEditTimesheets: false,
    canApproveTimesheets: false,
    canViewAssignedJobs: true,
    canManageTimeTrackingSettings: false,
    canViewMyDay: true,
    canViewJobSchedule: true,
    canViewWorkOrders: true,
    canViewTeamChat: true,
    canViewOwnTasks: true,
    canEditBasicProfile: true,
    canChatWithCustomers: true,
    canPhoneCustomers: true,
    canViewContactDetails: true,
  },
};

export interface UserRoleInfo {
  userId: string;
  role: UserRole;
  assignedAt: string; // ISO date string
  assignedBy?: string; // Admin user who assigned the role
}

export interface AccountantAccessLog {
  id: string;
  accountantId: string;
  action: string;
  entityType?: string;
  entityId?: string;
  timestamp: string;
  details?: string;
}
