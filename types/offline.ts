/**
 * Offline functionality types
 * Defines interfaces for cached data, pending requests, and sync status
 */

export interface CacheMetadata {
  timestamp: number;
  expiresAt?: number;
  version: string;
}

export interface CachedData<T> {
  data: T;
  metadata: CacheMetadata;
}

export interface PendingRequest {
  id: string;
  url: string;
  method: 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  body?: any;
  headers?: Record<string, string>;
  timestamp: number;
  retryCount: number;
  entityType: string;
  entityId?: string;
  localId?: string; // For optimistic updates
}

export interface SyncStatus {
  isSyncing: boolean;
  pendingCount: number;
  lastSyncTime: number | null;
  lastSyncSuccess: boolean;
  syncErrors: SyncError[];
}

export interface SyncError {
  requestId: string;
  error: string;
  timestamp: number;
  entityType: string;
}

export interface NetworkState {
  isConnected: boolean;
  isInternetReachable: boolean | null;
  connectionType: string | null;
}

export type EntityType = 
  | 'contact'
  | 'business'
  | 'appointment'
  | 'job'
  | 'pipeline'
  | 'proposal'
  | 'invoice'
  | 'workOrder'
  | 'task'
  | 'product'
  | 'teamChat'
  | 'email';

export interface CacheConfig {
  maxAge: number; // in milliseconds
  maxSize?: number; // max number of items
  version: string;
}

export const DEFAULT_CACHE_CONFIG: CacheConfig = {
  maxAge: 24 * 60 * 60 * 1000, // 24 hours
  version: '1.0.0',
};

export interface ApiRequestOptions extends RequestInit {
  skipCache?: boolean;
  cacheKey?: string;
  entityType?: EntityType;
  entityId?: string;
}

export interface ApiResponse<T> {
  data: T;
  cached: boolean;
  timestamp: number;
}

