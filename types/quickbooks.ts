/**
 * QuickBooks Online Integration Type Definitions
 * Defines types for QuickBooks entities, sync status, OAuth, and integration metadata
 */

// ============================================================================
// Sync Status Types
// ============================================================================

export type SyncStatus = 'synced' | 'pending' | 'error' | 'not_synced';

export interface SyncMetadata {
  quickbooksId?: string; // QuickBooks entity ID
  syncStatus: SyncStatus;
  lastSyncedAt?: string; // ISO date string
  lastSyncError?: string;
  syncVersion?: number; // For conflict resolution
}

// ============================================================================
// OAuth & Authentication Types
// ============================================================================

export interface QuickBooksOAuthTokens {
  accessToken: string;
  refreshToken: string;
  realmId: string; // QuickBooks Company ID
  expiresAt: string; // ISO date string
  refreshTokenExpiresAt: string; // ISO date string
}

export interface QuickBooksConnectionStatus {
  isConnected: boolean;
  companyName?: string;
  realmId?: string;
  lastSyncedAt?: string;
  connectionError?: string;
}

export interface QuickBooksConfig {
  clientId: string;
  redirectUri: string;
  environment: 'sandbox' | 'production';
  apiBaseUrl: string;
}

// ============================================================================
// QuickBooks Entity Types (matching QB API structure)
// ============================================================================

export interface QBAddress {
  Line1?: string;
  Line2?: string;
  City?: string;
  CountrySubDivisionCode?: string; // State
  PostalCode?: string;
  Country?: string;
}

export interface QBEmailAddress {
  Address: string;
}

export interface QBPhoneNumber {
  FreeFormNumber: string;
}

// Customer (Business or Contact)
export interface QBCustomer {
  Id?: string;
  SyncToken?: string;
  DisplayName: string;
  CompanyName?: string;
  GivenName?: string;
  FamilyName?: string;
  PrimaryEmailAddr?: QBEmailAddress;
  PrimaryPhone?: QBPhoneNumber;
  Mobile?: QBPhoneNumber;
  BillAddr?: QBAddress;
  ParentRef?: {
    value: string; // Parent customer ID for sub-customers
    name?: string;
  };
  Notes?: string;
  Active?: boolean;
  MetaData?: {
    CreateTime: string;
    LastUpdatedTime: string;
  };
}

// Invoice Line Item
export interface QBLineItem {
  Id?: string;
  LineNum?: number;
  Description: string;
  Amount: number;
  DetailType: 'SalesItemLineDetail' | 'SubTotalLineDetail' | 'DescriptionOnly';
  SalesItemLineDetail?: {
    ItemRef: {
      value: string;
      name: string;
    };
    Qty?: number;
    UnitPrice?: number;
    TaxCodeRef?: {
      value: string;
    };
  };
}

// Invoice
export interface QBInvoice {
  Id?: string;
  SyncToken?: string;
  DocNumber?: string;
  TxnDate: string; // YYYY-MM-DD
  DueDate?: string; // YYYY-MM-DD
  CustomerRef: {
    value: string;
    name?: string;
  };
  Line: QBLineItem[];
  TotalAmt?: number;
  Balance?: number;
  BillEmail?: QBEmailAddress;
  CustomerMemo?: {
    value: string;
  };
  PrivateNote?: string;
  MetaData?: {
    CreateTime: string;
    LastUpdatedTime: string;
  };
}

// Payment
export interface QBPayment {
  Id?: string;
  SyncToken?: string;
  TxnDate: string; // YYYY-MM-DD
  CustomerRef: {
    value: string;
    name?: string;
  };
  TotalAmt: number;
  Line?: Array<{
    Amount: number;
    LinkedTxn?: Array<{
      TxnId: string;
      TxnType: 'Invoice';
    }>;
  }>;
  PrivateNote?: string;
  PaymentMethodRef?: {
    value: string;
    name?: string;
  };
  DepositToAccountRef?: {
    value: string;
    name?: string;
  };
  MetaData?: {
    CreateTime: string;
    LastUpdatedTime: string;
  };
}

// Recurring Transaction Template
export interface QBRecurringTransaction {
  Id?: string;
  Name: string;
  Type: 'RecurringInvoice';
  Active: boolean;
  ScheduleInfo: {
    IntervalType: 'Daily' | 'Weekly' | 'Monthly' | 'Yearly';
    NumInterval: number;
    DayOfWeek?: string;
    DayOfMonth?: number;
    StartDate: string;
    EndDate?: string;
    NextDate?: string;
  };
  RecurringInvoice: QBInvoice;
}

// ============================================================================
// DripJobs Entity Extensions (for sync metadata)
// ============================================================================

export interface DripJobsContact extends SyncMetadata {
  id: string;
  firstName: string;
  lastName: string;
  email?: string;
  phone?: string;
  businessId?: string; // Link to business for sub-customer creation
  isPrimaryContact?: boolean;
}

export interface DripJobsBusiness extends SyncMetadata {
  id: string;
  name: string;
  address?: string;
  city?: string;
  state?: string;
  zip?: string;
  phone?: string;
  email?: string;
  primaryContactId?: string;
}

export interface DripJobsInvoice extends SyncMetadata {
  id: string;
  invoiceNumber: string;
  customerId: string; // Can be contact or business
  customerType: 'contact' | 'business';
  invoiceDate: string;
  dueDate?: string;
  lineItems: Array<{
    description: string;
    quantity: number;
    unitPrice: number;
    amount: number;
  }>;
  subtotal: number;
  tax?: number;
  total: number;
  balance: number;
  notes?: string;
  jobId?: string;
}

export interface DripJobsPayment extends SyncMetadata {
  id: string;
  invoiceId: string;
  customerId: string;
  amount: number;
  paymentDate: string;
  paymentMethod?: string;
  notes?: string;
}

export interface DripJobsRecurringJob extends SyncMetadata {
  id: string;
  businessId: string;
  contactId?: string;
  title: string;
  description?: string;
  amount: number;
  frequency: 'weekly' | 'biweekly' | 'monthly' | 'quarterly' | 'yearly';
  startDate: string;
  endDate?: string;
  isActive: boolean;
}

// ============================================================================
// Sync Settings & Configuration
// ============================================================================

export interface QuickBooksSyncSettings {
  autoSync: boolean;
  syncFrequency: 'realtime' | 'hourly' | 'daily' | 'manual';
  syncCustomers: boolean;
  syncInvoices: boolean;
  syncPayments: boolean;
  syncRecurringJobs: boolean;
  jobStatusTrigger: string; // e.g., "In Progress", "Started"
  createEstimatesForProposals: boolean;
  defaultTerms?: string;
  defaultPaymentMethod?: string;
  defaultTaxRate?: string;
}

export const DEFAULT_SYNC_SETTINGS: QuickBooksSyncSettings = {
  autoSync: true,
  syncFrequency: 'realtime',
  syncCustomers: true,
  syncInvoices: true,
  syncPayments: true,
  syncRecurringJobs: true,
  jobStatusTrigger: 'In Progress',
  createEstimatesForProposals: false,
};

// ============================================================================
// Sync Log & History
// ============================================================================

export interface SyncLogEntry {
  id: string;
  timestamp: string;
  entityType: 'customer' | 'invoice' | 'payment' | 'recurring';
  entityId: string;
  action: 'create' | 'update' | 'delete';
  status: 'success' | 'error';
  errorMessage?: string;
  quickbooksId?: string;
  userId?: string;
}

export interface SyncStats {
  totalSynced: number;
  lastSyncTime?: string;
  pendingCount: number;
  errorCount: number;
  successRate: number; // percentage
}

// ============================================================================
// API Request/Response Types
// ============================================================================

export interface SyncRequest {
  entityType: 'customer' | 'invoice' | 'payment' | 'recurring';
  entityId: string;
  data: QBCustomer | QBInvoice | QBPayment | QBRecurringTransaction;
  forceUpdate?: boolean;
}

export interface SyncResponse {
  success: boolean;
  quickbooksId?: string;
  syncToken?: string;
  error?: string;
  data?: any;
}

export interface BatchSyncRequest {
  entities: SyncRequest[];
}

export interface BatchSyncResponse {
  results: Array<SyncResponse & { entityId: string }>;
  successCount: number;
  errorCount: number;
}

// ============================================================================
// Error Types
// ============================================================================

export interface QuickBooksError {
  code: string;
  message: string;
  detail?: string;
  type: 'auth' | 'network' | 'validation' | 'conflict' | 'unknown';
}

export class QuickBooksAuthError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'QuickBooksAuthError';
  }
}

export class QuickBooksSyncError extends Error {
  public entityId: string;
  public quickbooksError?: QuickBooksError;

  constructor(message: string, entityId: string, qbError?: QuickBooksError) {
    super(message);
    this.name = 'QuickBooksSyncError';
    this.entityId = entityId;
    this.quickbooksError = qbError;
  }
}
