/**
 * API Service
 * Smart wrapper for all API requests with offline support, caching, and request queuing
 */

import Toast from 'react-native-toast-message';
import { ApiRequestOptions, ApiResponse, EntityType } from '../types/offline';
import OfflineStorageService from './OfflineStorageService';

const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000/api';

// Retry configuration
const MAX_RETRIES = 3;
const INITIAL_RETRY_DELAY = 1000; // 1 second
const MAX_RETRY_DELAY = 10000; // 10 seconds

class ApiService {
  private isOnline: boolean = true;
  private syncInProgress: boolean = false;
  private authToken: string | null = null;

  /**
   * Set online status
   */
  setOnlineStatus(status: boolean): void {
    const wasOffline = !this.isOnline;
    this.isOnline = status;

    // Trigger sync when coming back online
    if (wasOffline && status) {
      this.syncPendingRequests().catch(console.error);
    }
  }

  /**
   * Set authentication token
   */
  setAuthToken(token: string | null): void {
    this.authToken = token;
  }

  /**
   * Main fetch wrapper with offline support
   */
  async fetch<T>(
    endpoint: string,
    options: ApiRequestOptions = {}
  ): Promise<ApiResponse<T>> {
    const {
      skipCache = false,
      cacheKey,
      entityType,
      entityId,
      ...fetchOptions
    } = options;

    const url = endpoint.startsWith('http') ? endpoint : `${API_BASE_URL}${endpoint}`;
    const method = fetchOptions.method || 'GET';
    const isReadOperation = method === 'GET' || method === 'HEAD';

    // Try to return cached data if offline or cache is requested
    if (!this.isOnline || !skipCache) {
      if (cacheKey || entityType) {
        const key = cacheKey || this.getCacheKey(entityType!, entityId);
        const cachedData = await OfflineStorageService.getData<T>(key);
        
        if (cachedData) {
          // If offline, return cached data
          if (!this.isOnline) {
            return {
              data: cachedData,
              cached: true,
              timestamp: Date.now(),
            };
          }
          
          // If online but we have cache, return it immediately for better UX
          // and fetch fresh data in background
          if (!skipCache && isReadOperation) {
            // Fire and forget - update cache in background
            this.fetchAndUpdateCache<T>(url, fetchOptions, key).catch(console.error);
            
            return {
              data: cachedData,
              cached: true,
              timestamp: Date.now(),
            };
          }
        }
      }
    }

    // If offline and this is a mutation, queue it
    if (!this.isOnline && !isReadOperation) {
      await this.queueRequest(endpoint, fetchOptions, entityType, entityId);
      
      Toast.show({
        type: 'info',
        text1: 'Offline',
        text2: 'Your changes will be synced when you\'re back online',
        position: 'bottom',
      });

      // Return a placeholder response for mutations
      // In a real app, you might return an optimistic response
      throw new Error('Offline - request queued');
    }

    // If offline and no cached data available
    if (!this.isOnline) {
      throw new Error('No internet connection and no cached data available');
    }

    // Online - make the actual request
    try {
      const response = await this.makeRequest<T>(url, fetchOptions);
      
      // Cache successful GET requests
      if (isReadOperation && !skipCache) {
        const key = cacheKey || (entityType ? this.getCacheKey(entityType, entityId) : undefined);
        if (key) {
          await OfflineStorageService.saveData(key, response);
        }
      }
      
      return {
        data: response,
        cached: false,
        timestamp: Date.now(),
      };
    } catch (error) {
      // If request fails and we have cached data, return it
      if (cacheKey || entityType) {
        const key = cacheKey || this.getCacheKey(entityType!, entityId);
        const cachedData = await OfflineStorageService.getData<T>(key);
        
        if (cachedData) {
          Toast.show({
            type: 'warning',
            text1: 'Connection Issue',
            text2: 'Showing cached data',
            position: 'bottom',
          });
          
          return {
            data: cachedData,
            cached: true,
            timestamp: Date.now(),
          };
        }
      }
      
      throw error;
    }
  }

  /**
   * Make actual HTTP request with retry logic
   */
  private async makeRequest<T>(
    url: string,
    options: RequestInit,
    retryCount: number = 0
  ): Promise<T> {
    try {
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
        ...(options.headers as Record<string, string>),
      };

      if (this.authToken) {
        headers['Authorization'] = `Bearer ${this.authToken}`;
      }

      const response = await fetch(url, {
        ...options,
        headers,
      });

      if (!response.ok) {
        // Handle specific error codes
        if (response.status === 401) {
          throw new Error('Unauthorized - please log in again');
        }
        if (response.status === 403) {
          throw new Error('Forbidden - you don\'t have permission');
        }
        if (response.status === 404) {
          throw new Error('Not found');
        }
        if (response.status >= 500) {
          throw new Error('Server error - please try again later');
        }
        
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      // Retry logic for network errors
      if (retryCount < MAX_RETRIES && this.shouldRetry(error)) {
        const delay = Math.min(
          INITIAL_RETRY_DELAY * Math.pow(2, retryCount),
          MAX_RETRY_DELAY
        );
        
        await this.sleep(delay);
        return this.makeRequest<T>(url, options, retryCount + 1);
      }
      
      throw error;
    }
  }

  /**
   * Fetch and update cache in background
   */
  private async fetchAndUpdateCache<T>(
    url: string,
    options: RequestInit,
    cacheKey: string
  ): Promise<void> {
    try {
      const data = await this.makeRequest<T>(url, options);
      await OfflineStorageService.saveData(cacheKey, data);
    } catch (error) {
      // Silently fail - we already returned cached data
      console.warn('Background cache update failed:', error);
    }
  }

  /**
   * Queue a request for later sync
   */
  private async queueRequest(
    endpoint: string,
    options: RequestInit,
    entityType?: EntityType,
    entityId?: string
  ): Promise<void> {
    const method = (options.method || 'POST') as 'POST' | 'PUT' | 'DELETE' | 'PATCH';
    
    await OfflineStorageService.addPendingRequest({
      url: endpoint,
      method,
      body: options.body,
      headers: options.headers as Record<string, string>,
      entityType: entityType || 'contact', // default
      entityId,
    });
  }

  /**
   * Sync all pending requests
   */
  async syncPendingRequests(): Promise<void> {
    if (this.syncInProgress || !this.isOnline) {
      return;
    }

    this.syncInProgress = true;
    await OfflineStorageService.updateSyncStatus({
      isSyncing: true,
      lastSyncTime: Date.now(),
    });

    try {
      const pending = await OfflineStorageService.getPendingRequests();
      
      if (pending.length === 0) {
        await OfflineStorageService.updateSyncStatus({
          isSyncing: false,
          lastSyncSuccess: true,
        });
        return;
      }

      const results = await Promise.allSettled(
        pending.map(request => this.syncSingleRequest(request))
      );

      // Remove successful requests
      const errors: any[] = [];
      for (let i = 0; i < results.length; i++) {
        const result = results[i];
        const request = pending[i];
        
        if (result.status === 'fulfilled') {
          await OfflineStorageService.removePendingRequest(request.id);
        } else {
          errors.push({
            requestId: request.id,
            error: result.reason?.message || 'Unknown error',
            timestamp: Date.now(),
            entityType: request.entityType,
          });
          
          // Update retry count
          if (request.retryCount < MAX_RETRIES) {
            await OfflineStorageService.updatePendingRequestRetry(request.id);
          } else {
            // Max retries reached, remove the request
            await OfflineStorageService.removePendingRequest(request.id);
          }
        }
      }

      const remainingPending = await OfflineStorageService.getPendingRequests();
      
      await OfflineStorageService.updateSyncStatus({
        isSyncing: false,
        lastSyncSuccess: errors.length === 0,
        syncErrors: errors,
        pendingCount: remainingPending.length,
      });

      if (errors.length === 0 && pending.length > 0) {
        Toast.show({
          type: 'success',
          text1: 'Synced',
          text2: `${pending.length} pending ${pending.length === 1 ? 'change' : 'changes'} synced successfully`,
          position: 'bottom',
        });
      } else if (errors.length > 0) {
        Toast.show({
          type: 'error',
          text1: 'Sync Issues',
          text2: `${errors.length} ${errors.length === 1 ? 'change' : 'changes'} failed to sync`,
          position: 'bottom',
        });
      }
    } catch (error) {
      console.error('Sync error:', error);
      await OfflineStorageService.updateSyncStatus({
        isSyncing: false,
        lastSyncSuccess: false,
      });
    } finally {
      this.syncInProgress = false;
    }
  }

  /**
   * Sync a single pending request
   */
  private async syncSingleRequest(request: any): Promise<void> {
    const url = request.url.startsWith('http') ? request.url : `${API_BASE_URL}${request.url}`;
    
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...request.headers,
    };

    if (this.authToken) {
      headers['Authorization'] = `Bearer ${this.authToken}`;
    }

    await fetch(url, {
      method: request.method,
      headers,
      body: request.body,
    });
  }

  /**
   * Get cache key for an entity
   */
  private getCacheKey(entityType: EntityType, entityId?: string): string {
    const baseKey = `@offline_${entityType}`;
    return entityId ? `${baseKey}_${entityId}` : baseKey;
  }

  /**
   * Determine if request should be retried
   */
  private shouldRetry(error: any): boolean {
    // Retry on network errors, not on application errors
    if (error.message?.includes('Network request failed')) return true;
    if (error.message?.includes('timeout')) return true;
    if (error.message?.includes('ECONNREFUSED')) return true;
    return false;
  }

  /**
   * Sleep utility for retry delays
   */
  private sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * Get sync status
   */
  async getSyncStatus() {
    return OfflineStorageService.getSyncStatus();
  }

  /**
   * Manually trigger sync
   */
  async manualSync(): Promise<void> {
    if (!this.isOnline) {
      Toast.show({
        type: 'error',
        text1: 'Offline',
        text2: 'Cannot sync while offline',
        position: 'bottom',
      });
      return;
    }

    await this.syncPendingRequests();
  }
}

export default new ApiService();

