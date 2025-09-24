import React, { createContext, useContext, useState, ReactNode } from 'react';

interface NotificationContextType {
  missedCalls: number;
  setMissedCalls: (count: number) => void;
  clearMissedCalls: () => void;
  hasViewedCallHistory: boolean;
  setHasViewedCallHistory: (viewed: boolean) => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const NotificationProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [missedCalls, setMissedCalls] = useState(0);
  const [hasViewedCallHistory, setHasViewedCallHistory] = useState(false);

  const clearMissedCalls = () => {
    setMissedCalls(0);
    setHasViewedCallHistory(true);
  };

  return (
    <NotificationContext.Provider value={{ 
      missedCalls, 
      setMissedCalls, 
      clearMissedCalls,
      hasViewedCallHistory,
      setHasViewedCallHistory
    }}>
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};
