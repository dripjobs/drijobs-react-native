import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import { AccountantAccessLog, CREW_PERMISSION_LEVELS, CrewPermissionLevel, ROLE_DEFINITIONS, UserPermissions, UserRole } from '../types/userRoles';

export interface UserRoleContextType {
  currentRole: UserRole;
  permissions: UserPermissions;
  isLoading: boolean;
  impersonatingCrewMemberId: string | null;
  permissionLevel: CrewPermissionLevel;
  setUserRole: (role: UserRole, crewMemberId?: string, permissionLevel?: CrewPermissionLevel) => Promise<void>;
  setPermissionLevel: (level: CrewPermissionLevel) => Promise<void>;
  checkPermission: (permission: keyof UserPermissions) => boolean;
  logAccountantAction: (action: string, entityType?: string, entityId?: string, details?: string) => Promise<void>;
  getAccountantLogs: () => Promise<AccountantAccessLog[]>;
  clearImpersonation: () => Promise<void>;
}

const UserRoleContext = createContext<UserRoleContextType | undefined>(undefined);

export const useUserRole = () => {
  const context = useContext(UserRoleContext);
  if (!context) {
    throw new Error('useUserRole must be used within a UserRoleProvider');
  }
  return context;
};

interface UserRoleProviderProps {
  children: ReactNode;
}

const STORAGE_KEYS = {
  USER_ROLE: '@user_role',
  ACCOUNTANT_LOGS: '@accountant_access_logs',
  IMPERSONATING_CREW_MEMBER: '@impersonating_crew_member',
  PERMISSION_LEVEL: '@crew_permission_level',
};

export const UserRoleProvider: React.FC<UserRoleProviderProps> = ({ children }) => {
  const [currentRole, setCurrentRole] = useState<UserRole>('admin');
  const [permissions, setPermissions] = useState<UserPermissions>(ROLE_DEFINITIONS.admin.permissions);
  const [isLoading, setIsLoading] = useState(true);
  const [impersonatingCrewMemberId, setImpersonatingCrewMemberId] = useState<string | null>(null);
  const [permissionLevel, setPermissionLevelState] = useState<CrewPermissionLevel>(1);

  // Load saved role on mount
  useEffect(() => {
    loadUserRole();
  }, []);

  const loadUserRole = async () => {
    try {
      const savedRole = await AsyncStorage.getItem(STORAGE_KEYS.USER_ROLE);
      const savedCrewMemberId = await AsyncStorage.getItem(STORAGE_KEYS.IMPERSONATING_CREW_MEMBER);
      const savedPermissionLevel = await AsyncStorage.getItem(STORAGE_KEYS.PERMISSION_LEVEL);
      
      if (savedRole && (savedRole === 'admin' || savedRole === 'accountant' || savedRole === 'crew')) {
        const role = savedRole as UserRole;
        setCurrentRole(role);
        
        // Load permission level for crew
        const level = savedPermissionLevel ? parseInt(savedPermissionLevel) as CrewPermissionLevel : 1;
        setPermissionLevelState(level);
        
        // Set permissions based on role and level
        if (role === 'crew') {
          setPermissions(CREW_PERMISSION_LEVELS[level]);
        } else {
          setPermissions(ROLE_DEFINITIONS[role].permissions);
        }
        
        if (savedCrewMemberId) {
          setImpersonatingCrewMemberId(savedCrewMemberId);
        }
      }
    } catch (error) {
      console.error('Error loading user role:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const setUserRole = async (role: UserRole, crewMemberId?: string, newPermissionLevel?: CrewPermissionLevel) => {
    try {
      setCurrentRole(role);
      await AsyncStorage.setItem(STORAGE_KEYS.USER_ROLE, role);
      
      // Handle permission level for crew
      if (role === 'crew') {
        const level = newPermissionLevel || 1;
        setPermissionLevelState(level);
        setPermissions(CREW_PERMISSION_LEVELS[level]);
        await AsyncStorage.setItem(STORAGE_KEYS.PERMISSION_LEVEL, level.toString());
      } else {
        setPermissions(ROLE_DEFINITIONS[role].permissions);
        setPermissionLevelState(1); // Reset to 1 for non-crew roles
      }
      
      if (role === 'crew' && crewMemberId) {
        setImpersonatingCrewMemberId(crewMemberId);
        await AsyncStorage.setItem(STORAGE_KEYS.IMPERSONATING_CREW_MEMBER, crewMemberId);
      } else {
        setImpersonatingCrewMemberId(null);
        await AsyncStorage.removeItem(STORAGE_KEYS.IMPERSONATING_CREW_MEMBER);
      }
    } catch (error) {
      console.error('Error saving user role:', error);
      throw error;
    }
  };

  const setPermissionLevel = async (level: CrewPermissionLevel) => {
    try {
      setPermissionLevelState(level);
      if (currentRole === 'crew') {
        setPermissions(CREW_PERMISSION_LEVELS[level]);
      }
      await AsyncStorage.setItem(STORAGE_KEYS.PERMISSION_LEVEL, level.toString());
    } catch (error) {
      console.error('Error saving permission level:', error);
      throw error;
    }
  };

  const clearImpersonation = async () => {
    try {
      setCurrentRole('admin');
      setPermissions(ROLE_DEFINITIONS.admin.permissions);
      setImpersonatingCrewMemberId(null);
      await AsyncStorage.setItem(STORAGE_KEYS.USER_ROLE, 'admin');
      await AsyncStorage.removeItem(STORAGE_KEYS.IMPERSONATING_CREW_MEMBER);
    } catch (error) {
      console.error('Error clearing impersonation:', error);
      throw error;
    }
  };

  const checkPermission = (permission: keyof UserPermissions): boolean => {
    return permissions[permission] === true;
  };

  const logAccountantAction = async (
    action: string,
    entityType?: string,
    entityId?: string,
    details?: string
  ) => {
    // Only log actions for accountant role
    if (currentRole !== 'accountant') {
      return;
    }

    try {
      const logsJson = await AsyncStorage.getItem(STORAGE_KEYS.ACCOUNTANT_LOGS);
      const logs: AccountantAccessLog[] = logsJson ? JSON.parse(logsJson) : [];

      const newLog: AccountantAccessLog = {
        id: `log_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        accountantId: 'current_user', // TODO: Replace with actual user ID when auth is implemented
        action,
        entityType,
        entityId,
        timestamp: new Date().toISOString(),
        details,
      };

      logs.push(newLog);

      // Keep only last 1000 logs to prevent storage overflow
      const recentLogs = logs.slice(-1000);

      await AsyncStorage.setItem(STORAGE_KEYS.ACCOUNTANT_LOGS, JSON.stringify(recentLogs));
    } catch (error) {
      console.error('Error logging accountant action:', error);
    }
  };

  const getAccountantLogs = async (): Promise<AccountantAccessLog[]> => {
    try {
      const logsJson = await AsyncStorage.getItem(STORAGE_KEYS.ACCOUNTANT_LOGS);
      return logsJson ? JSON.parse(logsJson) : [];
    } catch (error) {
      console.error('Error retrieving accountant logs:', error);
      return [];
    }
  };

  return (
    <UserRoleContext.Provider
      value={{
        currentRole,
        permissions,
        isLoading,
        impersonatingCrewMemberId,
        permissionLevel,
        setUserRole,
        setPermissionLevel,
        checkPermission,
        logAccountantAction,
        getAccountantLogs,
        clearImpersonation,
      }}
    >
      {children}
    </UserRoleContext.Provider>
  );
};

// Convenience hook for checking specific permissions
export const usePermission = (permission: keyof UserPermissions): boolean => {
  const { checkPermission } = useUserRole();
  return checkPermission(permission);
};

// Convenience hook for accountant role check
export const useIsAccountant = (): boolean => {
  const { currentRole } = useUserRole();
  return currentRole === 'accountant';
};

// Convenience hook for admin role check
export const useIsAdmin = (): boolean => {
  const { currentRole } = useUserRole();
  return currentRole === 'admin';
};

// Convenience hook for crew role check
export const useIsCrew = (): boolean => {
  const { currentRole } = useUserRole();
  return currentRole === 'crew';
};

// Convenience hook for crew permission level
export const useCrewPermissionLevel = (): CrewPermissionLevel => {
  const { permissionLevel } = useUserRole();
  return permissionLevel;
};
