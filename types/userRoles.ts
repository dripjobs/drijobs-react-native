/**
 * User Role Type Definitions
 * Defines user roles and permissions for DripJobs
 */

export type UserRole = 'admin' | 'accountant';

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
    },
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
