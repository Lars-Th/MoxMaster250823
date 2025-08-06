export interface PermissionConfig {
  [routeName: string]: string[];
}

// Map permission codes to role names
export const permissionToRole: { [key: string]: string[] } = {
  H: ['Handläggare'],
  A: ['Administratör', 'Enhetsansvarig'],
  SA: ['Systemadministratör'],
};

// Route permissions configuration
export const routePermissions: PermissionConfig = {
  // Dashboard
  dashboard: ['H', 'A', 'SA'],

  // Settings
  settings: ['H', 'A', 'SA'],
  'settings-my-account': ['H', 'A', 'SA'],
  'settings-login-accounts': ['A', 'SA'],
  'user-detail': ['A', 'SA'],
  'settings-permission-groups': ['A', 'SA'],

  // Development
  'custom-components': ['H', 'A', 'SA'],
};

/**
 * Check if a user has permission to access a route
 */
export function hasPermission(userRole: string, routeName: string): boolean {
  const requiredPermissions = routePermissions[routeName];

  if (!requiredPermissions) {
    // If no permissions are specified, allow access
    return true;
  }

  const allowedRoles = requiredPermissions.flatMap(perm => permissionToRole[perm] ?? []);
  return allowedRoles.includes(userRole);
}

/**
 * Get allowed roles for a given set of permissions
 */
export function getAllowedRoles(permissions: string[]): string[] {
  return permissions.flatMap(perm => permissionToRole[perm] ?? []);
}
