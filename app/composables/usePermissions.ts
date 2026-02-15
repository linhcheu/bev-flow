// Role-based permissions composable
import { ref } from 'vue';

export type UserRole = 'admin' | 'manager' | 'user';
export type DbRole = UserRole; // Alias for middleware compatibility
export type DisplayRole = 'System Administrator' | 'Manager' | 'Staff';

export interface UserPermissions {
  canManageUsers: boolean;
  canChangeRoles: boolean;
  canBackupRestore: boolean;
  canManageProducts: boolean;
  canManageSales: boolean;
  canManagePurchaseOrders: boolean;
  canManageSuppliers: boolean;
  canViewAnalytics: boolean;
  canExportData: boolean;
}

// Map display role to db role
export const roleToDbRole = (displayRole: DisplayRole): UserRole => {
  const map: Record<DisplayRole, UserRole> = {
    'System Administrator': 'admin',
    'Manager': 'manager',
    'Staff': 'user',
  };
  return map[displayRole] || 'user';
};
// Map db role to display role
export const dbRoleToDisplay = (dbRole: UserRole): DisplayRole => {
  const map: Record<UserRole, DisplayRole> = {
    'admin': 'System Administrator',
    'manager': 'Manager',
    'user': 'Staff',
  };
  return map[dbRole] || 'Staff';
};

// Get permissions based on role
export const getPermissionsByRole = (role: UserRole | DisplayRole): UserPermissions => {
  // Normalize role to db format
  const normalizedRole: UserRole = 
    role === 'System Administrator' ? 'admin' :
    role === 'Manager' ? 'manager' :
    role === 'Staff' ? 'user' :
    role as UserRole;

  switch (normalizedRole) {
    case 'admin':
      return {
        canManageUsers: true,
        canChangeRoles: true,
        canBackupRestore: true,
        canManageProducts: true,
        canManageSales: true,
        canManagePurchaseOrders: true,
        canManageSuppliers: true,
        canViewAnalytics: true,
        canExportData: true,
      };
    case 'manager':
      return {
        canManageUsers: false,
        canChangeRoles: false,
        canBackupRestore: false,
        canManageProducts: true,
        canManageSales: true,
        canManagePurchaseOrders: true,
        canManageSuppliers: true,
        canViewAnalytics: true,
        canExportData: true,
      };
    case 'user':
    default:
      return {
        canManageUsers: false,
        canChangeRoles: false,
        canBackupRestore: false,
        canManageProducts: true,
        canManageSales: true,
        canManagePurchaseOrders: true,
        canManageSuppliers: true,
        canViewAnalytics: true,
        canExportData: false,
      };
  }
};

export const usePermissions = () => {
  const userRole = ref<DisplayRole>('Staff');
  const permissions = ref<UserPermissions>(getPermissionsByRole('user'));
  const isLoading = ref(true);

  // Fetch current user's role
  const fetchUserRole = async () => {
    isLoading.value = true;
    try {
      const profile = await $fetch<{ role: DisplayRole }>('/api/profile');
      userRole.value = profile.role;
      permissions.value = getPermissionsByRole(profile.role);
    } catch (error) {
      console.error('Failed to fetch user role:', error);
      // Default to lowest permissions on error
      userRole.value = 'Staff';
      permissions.value = getPermissionsByRole('user');
    } finally {
      isLoading.value = false;
    }
  };

  // Check if user can access a specific feature
  const canAccess = (feature: keyof UserPermissions): boolean => {
    return permissions.value[feature];
  };

  // Check if current user can change another user's role
  const canChangeUserRole = (): boolean => {
    return permissions.value.canChangeRoles;
  };

  return {
    userRole,
    permissions,
    isLoading,
    fetchUserRole,
    canAccess,
    canChangeUserRole,
    getPermissionsByRole,
  };
};
