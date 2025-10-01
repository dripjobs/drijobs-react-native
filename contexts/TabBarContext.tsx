import React, { createContext, ReactNode, useContext, useState } from 'react';

export interface TabBarContextType {
  isTransparent: boolean;
  setIsTransparent: (transparent: boolean) => void;
  isVisible: boolean;
  setIsVisible: (visible: boolean) => void;
}

const TabBarContext = createContext<TabBarContextType | undefined>(undefined);

export const useTabBar = () => {
  const context = useContext(TabBarContext);
  if (!context) {
    throw new Error('useTabBar must be used within a TabBarProvider');
  }
  return context;
};

interface TabBarProviderProps {
  children: ReactNode;
}

export const TabBarProvider: React.FC<TabBarProviderProps> = ({ children }) => {
  const [isTransparent, setIsTransparent] = useState(false);
  const [isVisible, setIsVisible] = useState(true);

  return (
    <TabBarContext.Provider value={{ isTransparent, setIsTransparent, isVisible, setIsVisible }}>
      {children}
    </TabBarContext.Provider>
  );
};
