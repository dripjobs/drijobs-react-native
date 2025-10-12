import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import { AccountantAccessLog, CREW_PERMISSION_LEVELS, CrewPermissionLevel, ROLE_DEFINITIONS, SALESPERSON_PERMISSION_LEVELS, SalespersonPermissionLevel, UserPermissions, UserRole } from '../types/userRoles';

export interface UserRoleContextType {
  currentRole: UserRole;
  permissions: UserPermissions;
  isLoading: boolean;
  impersonatingCrewMemberId: string | null;
  impersonatingSalespersonId: string | null;
  permissionLevel: CrewPermissionLevel;
  salespersonPermissionLevel: SalespersonPermissionLevel;
  setUserRole: (role: UserRole, userId?: string, permissionLevel?: CrewPermissionLevel | SalespersonPermissionLevel) => Promise<void>;
  setPermissionLevel: (level: CrewPermissionLevel | SalespersonPermissionLevel) => Promise<void>;
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
  IMPERSONATING_SALESPERSON: '@impersonating_salesperson',
  PERMISSION_LEVEL: '@crew_permission_level',
  SALESPERSON_PERMISSION_LEVEL: '@salesperson_permission_level',
};

export const UserRoleProvider: React.FC<UserRoleProviderProps> = ({ children }) => {
  const [currentRole, setCurrentRole] = useState<UserRole>('admin');
  const [permissions, setPermissions] = useState<UserPermissions>(ROLE_DEFINITIONS.admin.permissions);
  const [isLoading, setIsLoading] = useState(true);
  const [impersonatingCrewMemberId, setImpersonatingCrewMemberId] = useState<string | null>(null);
  const [impersonatingSalespersonId, setImpersonatingSalespersonId] = useState<string | null>(null);
  const [permissionLevel, setPermissionLevelState] = useState<CrewPermissionLevel>(1);
  const [salespersonPermissionLevel, setSalespersonPermissionLevelState] = useState<SalespersonPermissionLevel>(1);

  // Load saved role on mount
  useEffect(() => {
    loadUserRole();
  }, []);

  const loadUserRole = async () => {
    try {
      const savedRole = await AsyncStorage.getItem(STORAGE_KEYS.USER_ROLE);
      const savedCrewMemberId = await AsyncStorage.getItem(STORAGE_KEYS.IMPERSONATING_CREW_MEMBER);
      const savedSalespersonId = await AsyncStorage.getItem(STORAGE_KEYS.IMPERSONATING_SALESPERSON);
      const savedPermissionLevel = await AsyncStorage.getItem(STORAGE_KEYS.PERMISSION_LEVEL);
      const savedSalespersonPermissionLevel = await AsyncStorage.getItem(STORAGE_KEYS.SALESPERSON_PERMISSION_LEVEL);
      
      if (savedRole && (savedRole === 'admin' || savedRole === 'accountant' || savedRole === 'crew' || savedRole === 'salesperson')) {
        const role = savedRole as UserRole;
        setCurrentRole(role);
        
        // Load permission level for crew
        const crewLevel = savedPermissionLevel ? parseInt(savedPermissionLevel) as CrewPermissionLevel : 1;
        setPermissionLevelState(crewLevel);
        
        // Load permission level for salesperson
        const salesLevel = savedSalespersonPermissionLevel ? parseInt(savedSalespersonPermissionLevel) as SalespersonPermissionLevel : 1;
        setSalespersonPermissionLevelState(salesLevel);
        
        // Set permissions based on role and level
        if (role === 'crew') {
          setPermissions(CREW_PERMISSION_LEVELS[crewLevel]);
        } else if (role === 'salesperson') {
          setPermissions(SALESPERSON_PERMISSION_LEVELS[salesLevel]);
        } else {
          setPermissions(ROLE_DEFINITIONS[role].permissions);
        }
        
        if (savedCrewMemberId) {
          setImpersonatingCrewMemberId(savedCrewMemberId);
        }
        if (savedSalespersonId) {
          setImpersonatingSalespersonId(savedSalespersonId);
        }
      }
    } catch (error) {
      console.error('Error loading user role:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const setUserRole = async (role: UserRole, userId?: string, newPermissionLevel?: CrewPermissionLevel | SalespersonPermissionLevel) => {
    try {
      setCurrentRole(role);
      await AsyncStorage.setItem(STORAGE_KEYS.USER_ROLE, role);
      
      // Handle permission level for crew
      if (role === 'crew') {
        const level = (newPermissionLevel as CrewPermissionLevel) || 1;
        setPermissionLevelState(level);
        setPermissions(CREW_PERMISSION_LEVELS[level]);
        await AsyncStorage.setItem(STORAGE_KEYS.PERMISSION_LEVEL, level.toString());
      } else if (role === 'salesperson') {
        // Handle permission level for salesperson
        const level = (newPermissionLevel as SalespersonPermissionLevel) || 1;
        setSalespersonPermissionLevelState(level);
        setPermissions(SALESPERSON_PERMISSION_LEVELS[level]);
        await AsyncStorage.setItem(STORAGE_KEYS.SALESPERSON_PERMISSION_LEVEL, level.toString());
      } else {
        setPermissions(ROLE_DEFINITIONS[role].permissions);
        setPermissionLevelState(1); // Reset to 1 for non-crew roles
        setSalespersonPermissionLevelState(1); // Reset to 1 for non-salesperson roles
      }
      
      if (role === 'crew' && userId) {
        setImpersonatingCrewMemberId(userId);
        await AsyncStorage.setItem(STORAGE_KEYS.IMPERSONATING_CREW_MEMBER, userId);
        setImpersonatingSalespersonId(null);
        await AsyncStorage.removeItem(STORAGE_KEYS.IMPERSONATING_SALESPERSON);
      } else if (role === 'salesperson' && userId) {
        setImpersonatingSalespersonId(userId);
        await AsyncStorage.setItem(STORAGE_KEYS.IMPERSONATING_SALESPERSON, userId);
        setImpersonatingCrewMemberId(null);
        await AsyncStorage.removeItem(STORAGE_KEYS.IMPERSONATING_CREW_MEMBER);
      } else {
        setImpersonatingCrewMemberId(null);
        setImpersonatingSalespersonId(null);
        await AsyncStorage.removeItem(STORAGE_KEYS.IMPERSONATING_CREW_MEMBER);
        await AsyncStorage.removeItem(STORAGE_KEYS.IMPERSONATING_SALESPERSON);
      }
    } catch (error) {
      console.error('Error saving user role:', error);
      throw error;
    }
  };

  const setPermissionLevel = async (level: CrewPermissionLevel | SalespersonPermissionLevel) => {
    try {
      if (currentRole === 'crew') {
        const crewLevel = level as CrewPermissionLevel;
        setPermissionLevelState(crewLevel);
        setPermissions(CREW_PERMISSION_LEVELS[crewLevel]);
        await AsyncStorage.setItem(STORAGE_KEYS.PERMISSION_LEVEL, crewLevel.toString());
      } else if (currentRole === 'salesperson') {
        const salesLevel = level as SalespersonPermissionLevel;
        setSalespersonPermissionLevelState(salesLevel);
        setPermissions(SALESPERSON_PERMISSION_LEVELS[salesLevel]);
        await AsyncStorage.setItem(STORAGE_KEYS.SALESPERSON_PERMISSION_LEVEL, salesLevel.toString());
      }
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
      setImpersonatingSalespersonId(null);
      await AsyncStorage.setItem(STORAGE_KEYS.USER_ROLE, 'admin');
      await AsyncStorage.removeItem(STORAGE_KEYS.IMPERSONATING_CREW_MEMBER);
      await AsyncStorage.removeItem(STORAGE_KEYS.IMPERSONATING_SALESPERSON);
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
        impersonatingSalespersonId,
        permissionLevel,
        salespersonPermissionLevel,
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

// Convenience hook for salesperson role check
export const useIsSalesperson = (): boolean => {
  const { currentRole } = useUserRole();
  return currentRole === 'salesperson';
};

// Convenience hook for salesperson permission level
export const useSalespersonPermissionLevel = (): SalespersonPermissionLevel => {
  const { salespersonPermissionLevel } = useUserRole();
  return salespersonPermissionLevel;
};
