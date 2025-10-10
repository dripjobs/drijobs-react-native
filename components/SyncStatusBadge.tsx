/**
 * Sync Status Badge Component
 * Shows pending sync count and allows manual sync trigger
 */

import { useNetwork } from '@/contexts/NetworkContext';
import ApiService from '@/services/ApiService';
import { LinearGradient } from 'expo-linear-gradient';
import { Cloud, CloudOff, RefreshCw } from 'lucide-react-native';
import { useEffect, useState } from 'react';
import {
    Animated,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import { SyncStatus } from '../types/offline';

export default function SyncStatusBadge() {
  const { isConnected } = useNetwork();
  const [syncStatus, setSyncStatus] = useState<SyncStatus>({
    isSyncing: false,
    pendingCount: 0,
    lastSyncTime: null,
    lastSyncSuccess: true,
    syncErrors: [],
  });
  const [spinAnim] = useState(new Animated.Value(0));
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    loadSyncStatus();
    
    // Poll for sync status updates
    const interval = setInterval(loadSyncStatus, 2000);
    
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    // Show badge if there are pending items or if currently syncing
    setVisible(syncStatus.pendingCount > 0 || syncStatus.isSyncing);
  }, [syncStatus]);

  useEffect(() => {
    if (syncStatus.isSyncing) {
      startSpinAnimation();
    }
  }, [syncStatus.isSyncing]);

  const loadSyncStatus = async () => {
    try {
      const status = await ApiService.getSyncStatus();
      setSyncStatus(status);
    } catch (error) {
      console.error('Error loading sync status:', error);
    }
  };

  const startSpinAnimation = () => {
    spinAnim.setValue(0);
    Animated.loop(
      Animated.timing(spinAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      })
    ).start();
  };

  const handleSync = async () => {
    if (!isConnected || syncStatus.isSyncing) return;
    
    await ApiService.manualSync();
    await loadSyncStatus();
  };

  const getLastSyncText = (): string => {
    if (!syncStatus.lastSyncTime) return 'Never synced';
    
    const now = Date.now();
    const diff = now - syncStatus.lastSyncTime;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(minutes / 60);
    
    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return 'Over 24h ago';
  };

  if (!visible) return null;

  const spin = spinAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={handleSync}
      disabled={!isConnected || syncStatus.isSyncing}
      activeOpacity={0.8}
    >
      <LinearGradient
        colors={
          syncStatus.isSyncing
            ? ['#3B82F6', '#2563EB']
            : syncStatus.pendingCount > 0
            ? ['#F59E0B', '#D97706']
            : ['#10B981', '#059669']
        }
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.gradient}
      >
        <View style={styles.content}>
          {syncStatus.isSyncing ? (
            <Animated.View style={{ transform: [{ rotate: spin }] }}>
              <RefreshCw size={16} color="#FFF" strokeWidth={2.5} />
            </Animated.View>
          ) : isConnected ? (
            <Cloud size={16} color="#FFF" strokeWidth={2.5} />
          ) : (
            <CloudOff size={16} color="#FFF" strokeWidth={2.5} />
          )}
          
          <View style={styles.textContainer}>
            {syncStatus.isSyncing ? (
              <Text style={styles.text}>Syncing...</Text>
            ) : syncStatus.pendingCount > 0 ? (
              <>
                <Text style={styles.text}>
                  {syncStatus.pendingCount} pending
                </Text>
                {isConnected && (
                  <Text style={styles.subtext}>Tap to sync</Text>
                )}
              </>
            ) : (
              <Text style={styles.text}>All synced</Text>
            )}
          </View>
        </View>
      </LinearGradient>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 60,
    right: 16,
    borderRadius: 20,
    overflow: 'hidden',
    zIndex: 1000,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  gradient: {
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  textContainer: {
    flexDirection: 'column',
  },
  text: {
    color: '#FFF',
    fontSize: 13,
    fontWeight: '700',
    letterSpacing: 0.2,
  },
  subtext: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 10,
    fontWeight: '600',
    marginTop: 1,
  },
});

