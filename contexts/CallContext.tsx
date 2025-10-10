import React, { createContext, ReactNode, useContext, useEffect, useState } from 'react';

interface CallContextType {
  isCallActive: boolean;
  isCallMinimized: boolean;
  activeCallContact: {
    name: string;
    phoneNumber: string;
  } | null;
  callDuration: number;
  isMuted: boolean;
  isSpeakerOn: boolean;
  isOnHold: boolean;
  startCall: (contactName: string, phoneNumber: string) => void;
  endCall: () => void;
  minimizeCall: () => void;
  expandCall: () => void;
  toggleMute: () => void;
  toggleSpeaker: () => void;
  toggleHold: () => void;
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
  const [callDuration, setCallDuration] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [isSpeakerOn, setIsSpeakerOn] = useState(false);
  const [isOnHold, setIsOnHold] = useState(false);

  // Call duration timer
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isCallActive && !isOnHold) {
      interval = setInterval(() => {
        setCallDuration(prev => prev + 1);
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isCallActive, isOnHold]);

  const startCall = (contactName: string, phoneNumber: string) => {
    console.log('CallContext.startCall called with:', contactName, phoneNumber);
    setActiveCallContact({ name: contactName, phoneNumber });
    setIsCallActive(true);
    setIsCallMinimized(false);
    setCallDuration(0);
    setIsMuted(false);
    setIsSpeakerOn(false);
    setIsOnHold(false);
    console.log('Call state updated, isCallActive should now be true');
  };

  const endCall = () => {
    setIsCallActive(false);
    setIsCallMinimized(false);
    setActiveCallContact(null);
    setCallDuration(0);
    setIsMuted(false);
    setIsSpeakerOn(false);
    setIsOnHold(false);
  };

  const minimizeCall = () => {
    setIsCallMinimized(true);
  };

  const expandCall = () => {
    setIsCallMinimized(false);
  };

  const toggleMute = () => {
    setIsMuted(prev => !prev);
  };

  const toggleSpeaker = () => {
    setIsSpeakerOn(prev => !prev);
  };

  const toggleHold = () => {
    setIsOnHold(prev => !prev);
  };

  return (
    <CallContext.Provider
      value={{
        isCallActive,
        isCallMinimized,
        activeCallContact,
        callDuration,
        isMuted,
        isSpeakerOn,
        isOnHold,
        startCall,
        endCall,
        minimizeCall,
        expandCall,
        toggleMute,
        toggleSpeaker,
        toggleHold,
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
