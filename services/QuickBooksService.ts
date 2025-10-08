/**
 * QuickBooks Online Service
 * Handles all QuickBooks API interactions, OAuth, and sync operations
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import * as WebBrowser from 'expo-web-browser';
import {
    BatchSyncResponse,
    DEFAULT_SYNC_SETTINGS,
    DripJobsBusiness,
    DripJobsContact,
    DripJobsInvoice,
    DripJobsPayment,
    DripJobsRecurringJob,
    QBCustomer,
    QBInvoice,
    QBPayment,
    QBRecurringTransaction,
    QuickBooksAuthError,
    QuickBooksConfig,
    QuickBooksConnectionStatus,
    QuickBooksOAuthTokens,
    QuickBooksSyncError,
    QuickBooksSyncSettings,
    SyncLogEntry,
    SyncRequest,
    SyncResponse,
    SyncStats
} from '../types/quickbooks';

const STORAGE_KEYS = {
  QB_TOKENS: '@quickbooks_tokens',
  QB_SETTINGS: '@quickbooks_settings',
  QB_SYNC_LOGS: '@quickbooks_sync_logs',
};

// TODO: Replace with actual backend API URL
const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000/api';

class QuickBooksService {
  private config: QuickBooksConfig;
  private tokens: QuickBooksOAuthTokens | null = null;

  constructor() {
    // TODO: Move these to environment variables
    this.config = {
      clientId: process.env.EXPO_PUBLIC_QB_CLIENT_ID || 'YOUR_CLIENT_ID',
      redirectUri: process.env.EXPO_PUBLIC_QB_REDIRECT_URI || 'dripjobs://quickbooks-callback',
      environment: (process.env.EXPO_PUBLIC_QB_ENVIRONMENT as 'sandbox' | 'production') || 'sandbox',
      apiBaseUrl: process.env.EXPO_PUBLIC_QB_API_URL || 'https://sandbox-quickbooks.api.intuit.com/v3',
    };
  }

  // ============================================================================
  // OAuth & Authentication
  // ============================================================================

  /**
   * Initiate OAuth flow by opening browser
   */
  async connect(): Promise<void> {
    try {
      const authUrl = `${API_BASE_URL}/quickbooks/auth/url`;
      const response = await fetch(authUrl);
      const { url } = await response.json();

      if (!url) {
        throw new QuickBooksAuthError('Failed to generate authorization URL');
      }

      // Open OAuth URL in browser
      const result = await WebBrowser.openAuthSessionAsync(url, this.config.redirectUri);

      if (result.type === 'success' && result.url) {
        // Extract authorization code from redirect URL
        const code = this.extractAuthCode(result.url);
        if (code) {
          await this.exchangeCodeForTokens(code);
        }
      } else if (result.type === 'cancel') {
        throw new QuickBooksAuthError('User cancelled OAuth flow');
      }
    } catch (error) {
      console.error('QuickBooks connect error:', error);
      throw error;
    }
  }

  /**
   * Extract authorization code from redirect URL
   */
  private extractAuthCode(url: string): string | null {
    const match = url.match(/code=([^&]+)/);
    return match ? match[1] : null;
  }

  /**
   * Exchange authorization code for access tokens
   */
  private async exchangeCodeForTokens(code: string): Promise<void> {
    try {
      const response = await fetch(`${API_BASE_URL}/quickbooks/auth/token`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code, redirectUri: this.config.redirectUri }),
      });

      if (!response.ok) {
        throw new QuickBooksAuthError('Failed to exchange authorization code');
      }

      const tokens: QuickBooksOAuthTokens = await response.json();
      await this.saveTokens(tokens);
      this.tokens = tokens;
    } catch (error) {
      console.error('Token exchange error:', error);
      throw error;
    }
  }

  /**
   * Refresh access token using refresh token
   */
  async refreshAccessToken(): Promise<void> {
    try {
      const tokens = await this.getTokens();
      if (!tokens) {
        throw new QuickBooksAuthError('No tokens available to refresh');
      }

      const response = await fetch(`${API_BASE_URL}/quickbooks/auth/refresh`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refreshToken: tokens.refreshToken }),
      });

      if (!response.ok) {
        throw new QuickBooksAuthError('Failed to refresh access token');
      }

      const newTokens: QuickBooksOAuthTokens = await response.json();
      await this.saveTokens(newTokens);
      this.tokens = newTokens;
    } catch (error) {
      console.error('Token refresh error:', error);
      throw error;
    }
  }

  /**
   * Disconnect from QuickBooks
   */
  async disconnect(): Promise<void> {
    try {
      const tokens = await this.getTokens();
      if (tokens) {
        // Revoke tokens on backend
        await fetch(`${API_BASE_URL}/quickbooks/auth/revoke`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ token: tokens.accessToken }),
        });
      }

      // Clear local storage
      await AsyncStorage.multiRemove([
        STORAGE_KEYS.QB_TOKENS,
        STORAGE_KEYS.QB_SETTINGS,
        STORAGE_KEYS.QB_SYNC_LOGS,
      ]);
      this.tokens = null;
    } catch (error) {
      console.error('Disconnect error:', error);
      throw error;
    }
  }

  /**
   * Check if connected to QuickBooks
   */
  async isConnected(): Promise<boolean> {
    const tokens = await this.getTokens();
    if (!tokens) return false;

    // Check if access token is expired
    const now = new Date();
    const expiresAt = new Date(tokens.expiresAt);
    return now < expiresAt;
  }

  /**
   * Get connection status
   */
  async getConnectionStatus(): Promise<QuickBooksConnectionStatus> {
    try {
      const tokens = await this.getTokens();
      if (!tokens) {
        return { isConnected: false };
      }

      const isConnected = await this.isConnected();
      if (!isConnected) {
        return { isConnected: false, connectionError: 'Token expired' };
      }

      // Fetch company info from QuickBooks
      const companyInfo = await this.makeAuthenticatedRequest(
        `${this.config.apiBaseUrl}/company/${tokens.realmId}/companyinfo/${tokens.realmId}`
      );

      return {
        isConnected: true,
        companyName: companyInfo?.CompanyInfo?.CompanyName,
        realmId: tokens.realmId,
        lastSyncedAt: new Date().toISOString(),
      };
    } catch (error) {
      return {
        isConnected: false,
        connectionError: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  // ============================================================================
  // Token Management
  // ============================================================================

  private async saveTokens(tokens: QuickBooksOAuthTokens): Promise<void> {
    await AsyncStorage.setItem(STORAGE_KEYS.QB_TOKENS, JSON.stringify(tokens));
  }

  private async getTokens(): Promise<QuickBooksOAuthTokens | null> {
    if (this.tokens) return this.tokens;

    const tokensJson = await AsyncStorage.getItem(STORAGE_KEYS.QB_TOKENS);
    if (tokensJson) {
      this.tokens = JSON.parse(tokensJson);
      return this.tokens;
    }
    return null;
  }

  // ============================================================================
  // Settings Management
  // ============================================================================

  async getSyncSettings(): Promise<QuickBooksSyncSettings> {
    const settingsJson = await AsyncStorage.getItem(STORAGE_KEYS.QB_SETTINGS);
    return settingsJson ? JSON.parse(settingsJson) : DEFAULT_SYNC_SETTINGS;
  }

  async updateSyncSettings(settings: Partial<QuickBooksSyncSettings>): Promise<void> {
    const currentSettings = await this.getSyncSettings();
    const newSettings = { ...currentSettings, ...settings };
    await AsyncStorage.setItem(STORAGE_KEYS.QB_SETTINGS, JSON.stringify(newSettings));
  }

  // ============================================================================
  // Customer Sync (Businesses and Contacts)
  // ============================================================================

  /**
   * Sync business as parent customer in QuickBooks
   */
  async syncBusiness(business: DripJobsBusiness): Promise<SyncResponse> {
    try {
      const qbCustomer: QBCustomer = {
        Id: business.quickbooksId,
        DisplayName: business.name,
        CompanyName: business.name,
        PrimaryEmailAddr: business.email ? { Address: business.email } : undefined,
        PrimaryPhone: business.phone ? { FreeFormNumber: business.phone } : undefined,
        BillAddr: business.address
          ? {
              Line1: business.address,
              City: business.city,
              CountrySubDivisionCode: business.state,
              PostalCode: business.zip,
            }
          : undefined,
        Active: true,
      };

      const response = await this.syncEntity('customer', business.id, qbCustomer);
      await this.logSync('customer', business.id, business.quickbooksId ? 'update' : 'create', response);

      return response;
    } catch (error) {
      console.error('Business sync error:', error);
      throw new QuickBooksSyncError('Failed to sync business', business.id);
    }
  }

  /**
   * Sync contact as sub-customer in QuickBooks
   */
  async syncContact(contact: DripJobsContact, parentBusinessQBId?: string): Promise<SyncResponse> {
    try {
      const displayName = `${contact.firstName} ${contact.lastName}`;

      const qbCustomer: QBCustomer = {
        Id: contact.quickbooksId,
        DisplayName: displayName,
        GivenName: contact.firstName,
        FamilyName: contact.lastName,
        PrimaryEmailAddr: contact.email ? { Address: contact.email } : undefined,
        PrimaryPhone: contact.phone ? { FreeFormNumber: contact.phone } : undefined,
        ParentRef: parentBusinessQBId ? { value: parentBusinessQBId } : undefined,
        Active: true,
      };

      const response = await this.syncEntity('customer', contact.id, qbCustomer);
      await this.logSync('customer', contact.id, contact.quickbooksId ? 'update' : 'create', response);

      return response;
    } catch (error) {
      console.error('Contact sync error:', error);
      throw new QuickBooksSyncError('Failed to sync contact', contact.id);
    }
  }

  // ============================================================================
  // Invoice Sync
  // ============================================================================

  /**
   * Sync invoice to QuickBooks
   */
  async syncInvoice(invoice: DripJobsInvoice, customerQBId: string): Promise<SyncResponse> {
    try {
      const qbInvoice: QBInvoice = {
        Id: invoice.quickbooksId,
        DocNumber: invoice.invoiceNumber,
        TxnDate: invoice.invoiceDate.split('T')[0],
        DueDate: invoice.dueDate?.split('T')[0],
        CustomerRef: { value: customerQBId },
        Line: invoice.lineItems.map((item, index) => ({
          LineNum: index + 1,
          Description: item.description,
          Amount: item.amount,
          DetailType: 'SalesItemLineDetail',
          SalesItemLineDetail: {
            ItemRef: {
              value: '1', // TODO: Map to actual QuickBooks items
              name: item.description,
            },
            Qty: item.quantity,
            UnitPrice: item.unitPrice,
          },
        })),
        TotalAmt: invoice.total,
        CustomerMemo: invoice.notes ? { value: invoice.notes } : undefined,
      };

      const response = await this.syncEntity('invoice', invoice.id, qbInvoice);
      await this.logSync('invoice', invoice.id, invoice.quickbooksId ? 'update' : 'create', response);

      return response;
    } catch (error) {
      console.error('Invoice sync error:', error);
      throw new QuickBooksSyncError('Failed to sync invoice', invoice.id);
    }
  }

  // ============================================================================
  // Payment Sync
  // ============================================================================

  /**
   * Sync payment to QuickBooks
   */
  async syncPayment(payment: DripJobsPayment, customerQBId: string, invoiceQBId?: string): Promise<SyncResponse> {
    try {
      const qbPayment: QBPayment = {
        Id: payment.quickbooksId,
        TxnDate: payment.paymentDate.split('T')[0],
        CustomerRef: { value: customerQBId },
        TotalAmt: payment.amount,
        Line: invoiceQBId
          ? [
              {
                Amount: payment.amount,
                LinkedTxn: [{ TxnId: invoiceQBId, TxnType: 'Invoice' }],
              },
            ]
          : undefined,
        PrivateNote: payment.notes,
      };

      const response = await this.syncEntity('payment', payment.id, qbPayment);
      await this.logSync('payment', payment.id, payment.quickbooksId ? 'update' : 'create', response);

      return response;
    } catch (error) {
      console.error('Payment sync error:', error);
      throw new QuickBooksSyncError('Failed to sync payment', payment.id);
    }
  }

  // ============================================================================
  // Recurring Job Sync
  // ============================================================================

  /**
   * Sync recurring job as recurring transaction in QuickBooks
   */
  async syncRecurringJob(job: DripJobsRecurringJob, customerQBId: string): Promise<SyncResponse> {
    try {
      // Map DripJobs frequency to QuickBooks interval
      const intervalMap: Record<string, { type: 'Daily' | 'Weekly' | 'Monthly' | 'Yearly'; num: number }> = {
        weekly: { type: 'Weekly', num: 1 },
        biweekly: { type: 'Weekly', num: 2 },
        monthly: { type: 'Monthly', num: 1 },
        quarterly: { type: 'Monthly', num: 3 },
        yearly: { type: 'Yearly', num: 1 },
      };

      const interval = intervalMap[job.frequency] || { type: 'Monthly', num: 1 };

      const qbRecurring: QBRecurringTransaction = {
        Id: job.quickbooksId,
        Name: job.title,
        Type: 'RecurringInvoice',
        Active: job.isActive,
        ScheduleInfo: {
          IntervalType: interval.type,
          NumInterval: interval.num,
          StartDate: job.startDate.split('T')[0],
          EndDate: job.endDate?.split('T')[0],
        },
        RecurringInvoice: {
          CustomerRef: { value: customerQBId },
          Line: [
            {
              Description: job.description || job.title,
              Amount: job.amount,
              DetailType: 'SalesItemLineDetail',
              SalesItemLineDetail: {
                ItemRef: {
                  value: '1',
                  name: job.title,
                },
              },
            },
          ],
          TxnDate: job.startDate.split('T')[0],
        },
      };

      const response = await this.syncEntity('recurring', job.id, qbRecurring);
      await this.logSync('recurring', job.id, job.quickbooksId ? 'update' : 'create', response);

      return response;
    } catch (error) {
      console.error('Recurring job sync error:', error);
      throw new QuickBooksSyncError('Failed to sync recurring job', job.id);
    }
  }

  // ============================================================================
  // Generic Sync Methods
  // ============================================================================

  /**
   * Generic entity sync to backend
   */
  private async syncEntity(entityType: string, entityId: string, data: any): Promise<SyncResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/quickbooks/sync/${entityType}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${this.tokens?.accessToken}`,
        },
        body: JSON.stringify({ entityId, data }),
      });

      if (!response.ok) {
        const error = await response.json();
        return {
          success: false,
          error: error.message || 'Sync failed',
        };
      }

      const result = await response.json();
      return {
        success: true,
        quickbooksId: result.id,
        syncToken: result.syncToken,
        data: result,
      };
    } catch (error) {
      console.error('Sync entity error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  /**
   * Batch sync multiple entities
   */
  async batchSync(requests: SyncRequest[]): Promise<BatchSyncResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/quickbooks/sync/batch`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${this.tokens?.accessToken}`,
        },
        body: JSON.stringify({ entities: requests }),
      });

      if (!response.ok) {
        throw new Error('Batch sync failed');
      }

      return await response.json();
    } catch (error) {
      console.error('Batch sync error:', error);
      throw error;
    }
  }

  // ============================================================================
  // Sync Logging
  // ============================================================================

  private async logSync(
    entityType: 'customer' | 'invoice' | 'payment' | 'recurring',
    entityId: string,
    action: 'create' | 'update' | 'delete',
    response: SyncResponse
  ): Promise<void> {
    try {
      const logsJson = await AsyncStorage.getItem(STORAGE_KEYS.QB_SYNC_LOGS);
      const logs: SyncLogEntry[] = logsJson ? JSON.parse(logsJson) : [];

      const logEntry: SyncLogEntry = {
        id: `log_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        timestamp: new Date().toISOString(),
        entityType,
        entityId,
        action,
        status: response.success ? 'success' : 'error',
        errorMessage: response.error,
        quickbooksId: response.quickbooksId,
      };

      logs.push(logEntry);

      // Keep only last 500 logs
      const recentLogs = logs.slice(-500);

      await AsyncStorage.setItem(STORAGE_KEYS.QB_SYNC_LOGS, JSON.stringify(recentLogs));
    } catch (error) {
      console.error('Error logging sync:', error);
    }
  }

  async getSyncLogs(limit?: number): Promise<SyncLogEntry[]> {
    try {
      const logsJson = await AsyncStorage.getItem(STORAGE_KEYS.QB_SYNC_LOGS);
      const logs: SyncLogEntry[] = logsJson ? JSON.parse(logsJson) : [];
      return limit ? logs.slice(-limit) : logs;
    } catch (error) {
      console.error('Error getting sync logs:', error);
      return [];
    }
  }

  async getSyncStats(): Promise<SyncStats> {
    try {
      const logs = await this.getSyncLogs();
      const successCount = logs.filter((l) => l.status === 'success').length;
      const errorCount = logs.filter((l) => l.status === 'error').length;
      const totalSynced = logs.length;

      return {
        totalSynced,
        lastSyncTime: logs.length > 0 ? logs[logs.length - 1].timestamp : undefined,
        pendingCount: 0, // TODO: Track pending syncs
        errorCount,
        successRate: totalSynced > 0 ? (successCount / totalSynced) * 100 : 0,
      };
    } catch (error) {
      console.error('Error getting sync stats:', error);
      return {
        totalSynced: 0,
        pendingCount: 0,
        errorCount: 0,
        successRate: 0,
      };
    }
  }

  // ============================================================================
  // Utility Methods
  // ============================================================================

  /**
   * Make authenticated request to QuickBooks API
   */
  private async makeAuthenticatedRequest(url: string, options: RequestInit = {}): Promise<any> {
    const tokens = await this.getTokens();
    if (!tokens) {
      throw new QuickBooksAuthError('Not authenticated');
    }

    // Check if token needs refresh
    const now = new Date();
    const expiresAt = new Date(tokens.expiresAt);
    if (now >= expiresAt) {
      await this.refreshAccessToken();
    }

    const response = await fetch(url, {
      ...options,
      headers: {
        ...options.headers,
        Authorization: `Bearer ${this.tokens?.accessToken}`,
        Accept: 'application/json',
      },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Request failed');
    }

    return await response.json();
  }
}

// Export singleton instance
export default new QuickBooksService();
