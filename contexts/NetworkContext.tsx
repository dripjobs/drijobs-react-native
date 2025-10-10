/**
 * Network Context
 * Monitors network connectivity and provides online/offline state to the app
 */

import NetInfo from '@react-native-community/netinfo';
import React, { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import ApiService from '../services/ApiService';

interface NetworkContextType {
  isConnected: boolean;
  isInternetReachable: boolean | null;
  connectionType: string | null;
  refreshNetworkState: () => Promise<void>;
}

const NetworkContext = createContext<NetworkContextType>({
  isConnected: true,
  isInternetReachable: null,
  connectionType: null,
  refreshNetworkState: async () => {},
});

export const useNetwork = () => {
  const context = useContext(NetworkContext);
  if (!context) {
    throw new Error('useNetwork must be used within a NetworkProvider');
  }
  return context;
};

interface NetworkProviderProps {
  children: ReactNode;
}

export const NetworkProvider: React.FC<NetworkProviderProps> = ({ children }) => {
  const [isConnected, setIsConnected] = useState(true);
  const [isInternetReachable, setIsInternetReachable] = useState<boolean | null>(null);
  const [connectionType, setConnectionType] = useState<string | null>(null);
  const [hasShownReconnectionAlert, setHasShownReconnectionAlert] = useState(false);

  useEffect(() => {
    // Get initial network state
    NetInfo.fetch().then(state => {
      const connected = state.isConnected ?? false;
      setIsConnected(connected);
      setIsInternetReachable(state.isInternetReachable);
      setConnectionType(state.type);
      ApiService.setOnlineStatus(connected);
    });

    // Subscribe to network state updates
    const unsubscribe = NetInfo.addEventListener(state => {
      const wasOffline = !isConnected;
      const nowOnline = state.isConnected ?? false;
      
      setIsConnected(nowOnline);
      setIsInternetReachable(state.isInternetReachable);
      setConnectionType(state.type);
      
      // Update API service with new online status
      ApiService.setOnlineStatus(nowOnline);
      
      // Show alert when connection is restored
      if (wasOffline && nowOnline && !hasShownReconnectionAlert) {
        setHasShownReconnectionAlert(true);
        
        // Trigger sync when connection is restored
        ApiService.syncPendingRequests()
          .catch(error => {
            console.error('Auto-sync failed:', error);
          });
        
        // Reset the flag after a delay
        setTimeout(() => {
          setHasShownReconnectionAlert(false);
        }, 5000);
      }
      
      // Log connection changes for debugging
      if (wasOffline !== !nowOnline) {
        console.log(`Network status changed: ${nowOnline ? 'Online' : 'Offline'}`);
      }
    });

    return () => {
      unsubscribe();
    };
  }, [isConnected, hasShownReconnectionAlert]);

  const refreshNetworkState = async () => {
    const state = await NetInfo.fetch();
    const connected = state.isConnected ?? false;
    setIsConnected(connected);
    setIsInternetReachable(state.isInternetReachable);
    setConnectionType(state.type);
    ApiService.setOnlineStatus(connected);
  };

  return (
    <NetworkContext.Provider
      value={{
        isConnected,
        isInternetReachable,
        connectionType,
        refreshNetworkState,
      }}
    >
      {children}
    </NetworkContext.Provider>
  );
};

