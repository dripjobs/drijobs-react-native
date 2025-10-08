import React, { createContext, ReactNode, useContext, useState } from 'react';

interface CallContextType {
  isCallActive: boolean;
  isCallMinimized: boolean;
  activeCallContact: {
    name: string;
    phoneNumber: string;
  } | null;
  startCall: (contactName: string, phoneNumber: string) => void;
  endCall: () => void;
  minimizeCall: () => void;
  expandCall: () => void;
}

const CallContext = createContext<CallContextType | undefined>(undefined);

interface CallProviderProps {
  children: ReactNode;
}

export function CallProvider({ children }: CallProviderProps) {
  const [isCallActive, setIsCallActive] = useState(false);
  const [isCallMinimized, setIsCallMinimized] = useState(false);
  const [activeCallContact, setActiveCallContact] = useState<{
    name: string;
    phoneNumber: string;
  } | null>(null);

  const startCall = (contactName: string, phoneNumber: string) => {
    setActiveCallContact({ name: contactName, phoneNumber });
    setIsCallActive(true);
    setIsCallMinimized(false);
  };

  const endCall = () => {
    setIsCallActive(false);
    setIsCallMinimized(false);
    setActiveCallContact(null);
  };

  const minimizeCall = () => {
    setIsCallMinimized(true);
  };

  const expandCall = () => {
    setIsCallMinimized(false);
  };

  return (
    <CallContext.Provider
      value={{
        isCallActive,
        isCallMinimized,
        activeCallContact,
        startCall,
        endCall,
        minimizeCall,
        expandCall,
      }}
    >
      {children}
    </CallContext.Provider>
  );
}

export function useCall() {
  const context = useContext(CallContext);
  if (context === undefined) {
    throw new Error('useCall must be used within a CallProvider');
  }
  return context;
}
