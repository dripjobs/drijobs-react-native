import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, ReactNode, useContext, useEffect, useState } from 'react';

export interface TabOption {
  id: string;
  name: string;
  title: string;
  icon: string; // Icon name from lucide-react-native
}

export interface QuickAction {
  id: string;
  name: string;
  label: string;
  icon: string;
  colors: string[];
}

export interface AppSettingsContextType {
  availableTabs: TabOption[];
  selectedTabs: TabOption[];
  setSelectedTabs: (tabs: TabOption[]) => void;
  availableQuickActions: QuickAction[];
  selectedQuickActions: QuickAction[];
  setSelectedQuickActions: (actions: QuickAction[]) => void;
  resetToDefaults: () => void;
  isLoading: boolean;
}

const AppSettingsContext = createContext<AppSettingsContextType | undefined>(undefined);

export const useAppSettings = () => {
  const context = useContext(AppSettingsContext);
  if (!context) {
    throw new Error('useAppSettings must be used within an AppSettingsProvider');
  }
  return context;
};

interface AppSettingsProviderProps {
  children: ReactNode;
}

// Define all available tabs (only screens that exist in the (tabs) directory or as standalone app screens)
const ALL_TABS: TabOption[] = [
  { id: 'index', name: 'index', title: 'Dashboard', icon: 'House' },
  { id: 'contacts', name: 'contacts', title: 'Contacts', icon: 'Users' },
  { id: 'businesses', name: 'businesses', title: 'Businesses', icon: 'Building2' },
  { id: 'pipeline', name: 'pipeline', title: 'Pipeline', icon: 'BarChart3' },
  { id: 'metrics', name: 'metrics', title: 'Metrics', icon: 'TrendingUp' },
  { id: 'phone', name: 'phone', title: 'Voice', icon: 'Grid3x3' },
  { id: 'chat', name: 'chat', title: 'Chat', icon: 'MessageSquare' },
  { id: 'email', name: 'email', title: 'Email', icon: 'Mail' },
  { id: 'team-chat', name: 'team-chat', title: 'Team Chat', icon: 'Hash' },
  { id: 'work-orders', name: 'work-orders', title: 'Work Orders', icon: 'Wrench' },
  { id: 'tasks', name: 'tasks', title: 'Tasks', icon: 'SquareCheck' },
  { id: 'products', name: 'products', title: 'Products', icon: 'Package' },
  { id: 'appointments', name: 'appointments', title: 'Appointments', icon: 'Calendar' },
  { id: 'job-schedule', name: 'job-schedule', title: 'Job Schedule', icon: 'CalendarDays' },
];

// Define default selected tabs (Dashboard must always be first)
const DEFAULT_TABS: TabOption[] = [
  ALL_TABS.find(t => t.id === 'index')!,      // Dashboard
  ALL_TABS.find(t => t.id === 'contacts')!,   // Contacts
  ALL_TABS.find(t => t.id === 'pipeline')!,   // Pipeline
  ALL_TABS.find(t => t.id === 'phone')!,      // Voice
  ALL_TABS.find(t => t.id === 'chat')!,       // Chat
  ALL_TABS.find(t => t.id === 'team-chat')!,  // Team Chat
  ALL_TABS.find(t => t.id === 'products')!,   // Products
];

// Define all available quick actions
const ALL_QUICK_ACTIONS: QuickAction[] = [
  { 
    id: 'appointment', 
    name: 'Create Appointment',
    label: 'Create Appt',
    icon: 'Calendar',
    colors: ['#F59E0B', '#D97706']
  },
  { 
    id: 'task', 
    name: 'Create Task',
    label: 'Create Task',
    icon: 'SquareCheck',
    colors: ['#8B5CF6', '#A855F7']
  },
  { 
    id: 'request', 
    name: 'Send Request',
    label: 'Send Request',
    icon: 'Send',
    colors: ['#6366F1', '#8B5CF6']
  },
  { 
    id: 'proposal', 
    name: 'Create Proposal',
    label: 'Create Proposal',
    icon: 'FileText',
    colors: ['#10B981', '#059669']
  },
  { 
    id: 'job', 
    name: 'Create Job',
    label: 'Create Job',
    icon: 'Briefcase',
    colors: ['#14B8A6', '#0D9488']
  },
  { 
    id: 'lead', 
    name: 'Create Lead',
    label: 'Create Lead',
    icon: 'UserPlus',
    colors: ['#EF4444', '#DC2626']
  },
  { 
    id: 'invoice', 
    name: 'Create Invoice',
    label: 'Create Invoice',
    icon: 'Receipt',
    colors: ['#F97316', '#EA580C']
  },
  { 
    id: 'call', 
    name: 'Phone Call',
    label: 'Phone Call',
    icon: 'Phone',
    colors: ['#06B6D4', '#0891B2']
  },
  { 
    id: 'text', 
    name: 'Send Text',
    label: 'Text',
    icon: 'MessageSquare',
    colors: ['#3B82F6', '#2563EB']
  },
];

// Default quick actions (first 6)
const DEFAULT_QUICK_ACTIONS = ALL_QUICK_ACTIONS.slice(0, 6);

const STORAGE_KEYS = {
  SELECTED_TABS: '@app_settings_selected_tabs',
  SELECTED_QUICK_ACTIONS: '@app_settings_selected_quick_actions',
};

export const AppSettingsProvider: React.FC<AppSettingsProviderProps> = ({ children }) => {
  const [selectedTabs, setSelectedTabsState] = useState<TabOption[]>(DEFAULT_TABS);
  const [selectedQuickActions, setSelectedQuickActionsState] = useState<QuickAction[]>(DEFAULT_QUICK_ACTIONS);
  const [isLoading, setIsLoading] = useState(true);

  // Load saved settings on mount
  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const [savedTabs, savedActions] = await Promise.all([
        AsyncStorage.getItem(STORAGE_KEYS.SELECTED_TABS),
        AsyncStorage.getItem(STORAGE_KEYS.SELECTED_QUICK_ACTIONS),
      ]);

      if (savedTabs) {
        const tabs = JSON.parse(savedTabs);
        // Ensure Home is always first
        if (tabs[0]?.id === 'index') {
          setSelectedTabsState(tabs);
        } else {
          setSelectedTabsState(DEFAULT_TABS);
        }
      }

      if (savedActions) {
        const actions = JSON.parse(savedActions);
        setSelectedQuickActionsState(actions);
      }
    } catch (error) {
      console.error('Error loading app settings:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const setSelectedTabs = async (tabs: TabOption[]) => {
    // Ensure Home is always first
    if (tabs[0]?.id !== 'index') {
      const homeTab = ALL_TABS.find(t => t.id === 'index')!;
      tabs = [homeTab, ...tabs.filter(t => t.id !== 'index')];
    }

    // Ensure we have between 4 and 6 tabs
    if (tabs.length < 4 || tabs.length > 6) {
      return;
    }

    setSelectedTabsState(tabs);
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.SELECTED_TABS, JSON.stringify(tabs));
    } catch (error) {
      console.error('Error saving selected tabs:', error);
    }
  };

  const setSelectedQuickActions = async (actions: QuickAction[]) => {
    setSelectedQuickActionsState(actions);
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.SELECTED_QUICK_ACTIONS, JSON.stringify(actions));
    } catch (error) {
      console.error('Error saving selected quick actions:', error);
    }
  };

  const resetToDefaults = async () => {
    setSelectedTabsState(DEFAULT_TABS);
    setSelectedQuickActionsState(DEFAULT_QUICK_ACTIONS);
    try {
      await Promise.all([
        AsyncStorage.setItem(STORAGE_KEYS.SELECTED_TABS, JSON.stringify(DEFAULT_TABS)),
        AsyncStorage.setItem(STORAGE_KEYS.SELECTED_QUICK_ACTIONS, JSON.stringify(DEFAULT_QUICK_ACTIONS)),
      ]);
    } catch (error) {
      console.error('Error resetting to defaults:', error);
    }
  };

  return (
    <AppSettingsContext.Provider
      value={{
        availableTabs: ALL_TABS,
        selectedTabs,
        setSelectedTabs,
        availableQuickActions: ALL_QUICK_ACTIONS,
        selectedQuickActions,
        setSelectedQuickActions,
        resetToDefaults,
        isLoading,
      }}
    >
      {children}
    </AppSettingsContext.Provider>
  );
};
