/**
 * Offline Storage Service
 * Handles all local data caching and pending request queue management
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import { CacheConfig, CachedData, DEFAULT_CACHE_CONFIG, PendingRequest, SyncStatus } from '../types/offline';

const STORAGE_KEYS = {
  // Data caches
  CONTACTS: '@offline_contacts',
  BUSINESSES: '@offline_businesses',
  APPOINTMENTS: '@offline_appointments',
  JOBS: '@offline_jobs',
  PIPELINE: '@offline_pipeline',
  PROPOSALS: '@offline_proposals',
  INVOICES: '@offline_invoices',
  WORK_ORDERS: '@offline_work_orders',
  TASKS: '@offline_tasks',
  PRODUCTS: '@offline_products',
  TEAM_CHAT: '@offline_team_chat',
  EMAIL: '@offline_email',
  
  // System data
  PENDING_REQUESTS: '@offline_pending_requests',
  SYNC_STATUS: '@offline_sync_status',
  LAST_SYNC: '@offline_last_sync',
};

class OfflineStorageService {
  private cacheConfig: CacheConfig;

  constructor(config: CacheConfig = DEFAULT_CACHE_CONFIG) {
    this.cacheConfig = config;
  }

  // ============================================================================
  // Generic Cache Methods
  // ============================================================================

  /**
   * Save data to cache with metadata
   */
  async saveData<T>(key: string, data: T, config?: Partial<CacheConfig>): Promise<void> {
    try {
      const effectiveConfig = { ...this.cacheConfig, ...config };
      const cachedData: CachedData<T> = {
        data,
        metadata: {
          timestamp: Date.now(),
          expiresAt: Date.now() + effectiveConfig.maxAge,
          version: effectiveConfig.version,
        },
      };
      
      await AsyncStorage.setItem(key, JSON.stringify(cachedData));
      await this.updateLastSync(key);
    } catch (error) {
      console.error(`Error saving ${key}:`, error);
      throw error;
    }
  }

  /**
   * Retrieve data from cache
   */
  async getData<T>(key: string, ignoreExpiry: boolean = false): Promise<T | null> {
    try {
      const cachedString = await AsyncStorage.getItem(key);
      if (!cachedString) return null;

      const cached: CachedData<T> = JSON.parse(cachedString);
      
      // Check if cache is expired
      if (!ignoreExpiry && cached.metadata.expiresAt && Date.now() > cached.metadata.expiresAt) {
        await AsyncStorage.removeItem(key);
        return null;
      }

      return cached.data;
    } catch (error) {
      console.error(`Error getting ${key}:`, error);
      return null;
    }
  }

  /**
   * Clear specific cache
   */
  async clearCache(key: string): Promise<void> {
    try {
      await AsyncStorage.removeItem(key);
    } catch (error) {
      console.error(`Error clearing ${key}:`, error);
    }
  }

  /**
   * Clear all caches
   */
  async clearAllCaches(): Promise<void> {
    try {
      const keys = Object.values(STORAGE_KEYS).filter(k => !k.includes('pending') && !k.includes('sync'));
      await AsyncStorage.multiRemove(keys);
    } catch (error) {
      console.error('Error clearing all caches:', error);
    }
  }

  // ============================================================================
  // Entity-Specific Cache Methods
  // ============================================================================

  async saveContacts(contacts: any[]): Promise<void> {
    await this.saveData(STORAGE_KEYS.CONTACTS, contacts);
  }

  async getContacts(): Promise<any[] | null> {
    return this.getData(STORAGE_KEYS.CONTACTS);
  }

  async saveBusinesses(businesses: any[]): Promise<void> {
    await this.saveData(STORAGE_KEYS.BUSINESSES, businesses);
  }

  async getBusinesses(): Promise<any[] | null> {
    return this.getData(STORAGE_KEYS.BUSINESSES);
  }

  async saveAppointments(appointments: any[]): Promise<void> {
    await this.saveData(STORAGE_KEYS.APPOINTMENTS, appointments);
  }

  async getAppointments(): Promise<any[] | null> {
    return this.getData(STORAGE_KEYS.APPOINTMENTS);
  }

  async saveJobs(jobs: any[]): Promise<void> {
    await this.saveData(STORAGE_KEYS.JOBS, jobs);
  }

  async getJobs(): Promise<any[] | null> {
    return this.getData(STORAGE_KEYS.JOBS);
  }

  async savePipeline(pipeline: any[]): Promise<void> {
    await this.saveData(STORAGE_KEYS.PIPELINE, pipeline);
  }

  async getPipeline(): Promise<any[] | null> {
    return this.getData(STORAGE_KEYS.PIPELINE);
  }

  async saveProposals(proposals: any[]): Promise<void> {
    await this.saveData(STORAGE_KEYS.PROPOSALS, proposals);
  }

  async getProposals(): Promise<any[] | null> {
    return this.getData(STORAGE_KEYS.PROPOSALS);
  }

  async saveInvoices(invoices: any[]): Promise<void> {
    await this.saveData(STORAGE_KEYS.INVOICES, invoices);
  }

  async getInvoices(): Promise<any[] | null> {
    return this.getData(STORAGE_KEYS.INVOICES);
  }

  async saveWorkOrders(workOrders: any[]): Promise<void> {
    await this.saveData(STORAGE_KEYS.WORK_ORDERS, workOrders);
  }

  async getWorkOrders(): Promise<any[] | null> {
    return this.getData(STORAGE_KEYS.WORK_ORDERS);
  }

  async saveTasks(tasks: any[]): Promise<void> {
    await this.saveData(STORAGE_KEYS.TASKS, tasks);
  }

  async getTasks(): Promise<any[] | null> {
    return this.getData(STORAGE_KEYS.TASKS);
  }

  async saveProducts(products: any[]): Promise<void> {
    await this.saveData(STORAGE_KEYS.PRODUCTS, products);
  }

  async getProducts(): Promise<any[] | null> {
    return this.getData(STORAGE_KEYS.PRODUCTS);
  }

  async saveTeamChat(messages: any[]): Promise<void> {
    await this.saveData(STORAGE_KEYS.TEAM_CHAT, messages);
  }

  async getTeamChat(): Promise<any[] | null> {
    return this.getData(STORAGE_KEYS.TEAM_CHAT);
  }

  async saveEmail(emails: any[]): Promise<void> {
    await this.saveData(STORAGE_KEYS.EMAIL, emails);
  }

  async getEmail(): Promise<any[] | null> {
    return this.getData(STORAGE_KEYS.EMAIL);
  }

  // ============================================================================
  // Pending Request Queue Management
  // ============================================================================

  /**
   * Add a pending request to the queue
   */
  async addPendingRequest(request: Omit<PendingRequest, 'id' | 'timestamp' | 'retryCount'>): Promise<void> {
    try {
      const pending = await this.getPendingRequests();
      const newRequest: PendingRequest = {
        ...request,
        id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        timestamp: Date.now(),
        retryCount: 0,
      };
      
      pending.push(newRequest);
      await AsyncStorage.setItem(STORAGE_KEYS.PENDING_REQUESTS, JSON.stringify(pending));
      await this.updateSyncStatus({ pendingCount: pending.length });
    } catch (error) {
      console.error('Error adding pending request:', error);
      throw error;
    }
  }

  /**
   * Get all pending requests
   */
  async getPendingRequests(): Promise<PendingRequest[]> {
    try {
      const pending = await AsyncStorage.getItem(STORAGE_KEYS.PENDING_REQUESTS);
      return pending ? JSON.parse(pending) : [];
    } catch (error) {
      console.error('Error getting pending requests:', error);
      return [];
    }
  }

  /**
   * Remove a pending request from the queue
   */
  async removePendingRequest(requestId: string): Promise<void> {
    try {
      const pending = await this.getPendingRequests();
      const filtered = pending.filter(r => r.id !== requestId);
      await AsyncStorage.setItem(STORAGE_KEYS.PENDING_REQUESTS, JSON.stringify(filtered));
      await this.updateSyncStatus({ pendingCount: filtered.length });
    } catch (error) {
      console.error('Error removing pending request:', error);
    }
  }

  /**
   * Update retry count for a pending request
   */
  async updatePendingRequestRetry(requestId: string): Promise<void> {
    try {
      const pending = await this.getPendingRequests();
      const request = pending.find(r => r.id === requestId);
      if (request) {
        request.retryCount += 1;
        await AsyncStorage.setItem(STORAGE_KEYS.PENDING_REQUESTS, JSON.stringify(pending));
      }
    } catch (error) {
      console.error('Error updating pending request retry:', error);
    }
  }

  /**
   * Clear all pending requests
   */
  async clearPendingRequests(): Promise<void> {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.PENDING_REQUESTS, JSON.stringify([]));
      await this.updateSyncStatus({ pendingCount: 0 });
    } catch (error) {
      console.error('Error clearing pending requests:', error);
    }
  }

  // ============================================================================
  // Sync Status Management
  // ============================================================================

  /**
   * Get current sync status
   */
  async getSyncStatus(): Promise<SyncStatus> {
    try {
      const status = await AsyncStorage.getItem(STORAGE_KEYS.SYNC_STATUS);
      return status ? JSON.parse(status) : {
        isSyncing: false,
        pendingCount: 0,
        lastSyncTime: null,
        lastSyncSuccess: true,
        syncErrors: [],
      };
    } catch (error) {
      console.error('Error getting sync status:', error);
      return {
        isSyncing: false,
        pendingCount: 0,
        lastSyncTime: null,
        lastSyncSuccess: true,
        syncErrors: [],
      };
    }
  }

  /**
   * Update sync status
   */
  async updateSyncStatus(updates: Partial<SyncStatus>): Promise<void> {
    try {
      const current = await this.getSyncStatus();
      const updated = { ...current, ...updates };
      await AsyncStorage.setItem(STORAGE_KEYS.SYNC_STATUS, JSON.stringify(updated));
    } catch (error) {
      console.error('Error updating sync status:', error);
    }
  }

  /**
   * Update last sync timestamp for a specific key
   */
  private async updateLastSync(key: string): Promise<void> {
    try {
      const syncData = await this.getLastSyncData();
      syncData[key] = Date.now();
      await AsyncStorage.setItem(STORAGE_KEYS.LAST_SYNC, JSON.stringify(syncData));
    } catch (error) {
      console.error('Error updating last sync:', error);
    }
  }

  /**
   * Get last sync timestamp for a specific key
   */
  async getLastSync(key: string): Promise<number | null> {
    try {
      const syncData = await this.getLastSyncData();
      return syncData[key] || null;
    } catch (error) {
      console.error('Error getting last sync:', error);
      return null;
    }
  }

  /**
   * Get all last sync data
   */
  private async getLastSyncData(): Promise<Record<string, number>> {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEYS.LAST_SYNC);
      return data ? JSON.parse(data) : {};
    } catch (error) {
      console.error('Error getting last sync data:', error);
      return {};
    }
  }

  // ============================================================================
  // Utility Methods
  // ============================================================================

  /**
   * Get cache size information
   */
  async getCacheInfo(): Promise<{ key: string; size: number }[]> {
    try {
      const keys = Object.values(STORAGE_KEYS);
      const info = await Promise.all(
        keys.map(async (key) => {
          const data = await AsyncStorage.getItem(key);
          return {
            key,
            size: data ? new Blob([data]).size : 0,
          };
        })
      );
      return info;
    } catch (error) {
      console.error('Error getting cache info:', error);
      return [];
    }
  }

  /**
   * Check if cache exists and is valid
   */
  async isCacheValid(key: string): Promise<boolean> {
    try {
      const cachedString = await AsyncStorage.getItem(key);
      if (!cachedString) return false;

      const cached: CachedData<any> = JSON.parse(cachedString);
      
      if (cached.metadata.expiresAt && Date.now() > cached.metadata.expiresAt) {
        return false;
      }

      return true;
    } catch (error) {
      return false;
    }
  }
}

export default new OfflineStorageService();

