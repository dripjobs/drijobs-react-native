import React, { createContext, useContext, useState, ReactNode } from 'react';

interface TabBarContextType {
  isTransparent: boolean;
  setIsTransparent: (transparent: boolean) => void;
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

  return (
    <TabBarContext.Provider value={{ isTransparent, setIsTransparent }}>
      {children}
    </TabBarContext.Provider>
  );
};
