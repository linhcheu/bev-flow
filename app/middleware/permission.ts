// User role types
type DbRole = 'admin' | 'manager' | 'user';

// Permission structure
interface UserPermissions {
  canForecast: boolean;
  canBackupRestore: boolean;
  canChangeRoles: boolean;
  canExport: boolean;
  canManageProducts: boolean;
  canManageSales: boolean;
  canManagePurchaseOrders: boolean;
  canManageSuppliers: boolean;
  canViewAnalytics: boolean;
  canManageUsers: boolean;
}

// Get permissions by role
function getPermissionsByRole(role: DbRole): UserPermissions {
  switch (role) {
    case 'admin':
      return {
        canForecast: true,
        canBackupRestore: true,
        canChangeRoles: true,
        canExport: true,
        canManageProducts: true,
        canManageSales: true,
        canManagePurchaseOrders: true,
        canManageSuppliers: true,
        canViewAnalytics: true,
        canManageUsers: true,
      };
    case 'manager':
      return {
        canForecast: true,
        canBackupRestore: false,
        canChangeRoles: false,
        canExport: true,
        canManageProducts: true,
        canManageSales: true,
        canManagePurchaseOrders: true,
        canManageSuppliers: true,
        canViewAnalytics: true,
        canManageUsers: false,
      };
    case 'user':
    default:
      return {
        canForecast: false,
        canBackupRestore: false,
        canChangeRoles: false,
        canExport: false,
        canManageProducts: true,
        canManageSales: true,
        canManagePurchaseOrders: false,
        canManageSuppliers: false,
        canViewAnalytics: true,
        canManageUsers: false,
      };
  }
}

// Route permission mapping
const routePermissions: Record<string, keyof UserPermissions> = {
  '/forecasts': 'canForecast',
  '/users': 'canManageUsers',
};

export default defineNuxtRouteMiddleware(async (to) => {
  // Skip if no permission check needed for this route
  const requiredPermission = routePermissions[to.path];
  if (!requiredPermission) {
    return;
  }

  // Skip on server side - let client handle permission check
  if (import.meta.server) {
    return;
  }

  try {
    // Fetch user role from profile API
    const profileData = await $fetch<{ role: string }>('/api/profile');
    
    // Map display role to db role for permission check
    let dbRole: DbRole = 'user';
    if (profileData.role === 'System Administrator') {
      dbRole = 'admin';
    } else if (profileData.role === 'Manager') {
      dbRole = 'manager';
    }
    
    const permissions = getPermissionsByRole(dbRole);
    
    // Check if user has required permission
    if (!permissions[requiredPermission]) {
      // Redirect to home with error message
      return navigateTo('/', { replace: true });
    }
  } catch (error) {
    // If API fails, redirect to login
    return navigateTo('/login', { replace: true });
  }
});
