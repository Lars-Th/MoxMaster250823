// Permission and routing types for access control

export interface PermissionConfig {
  [routeName: string]: string[];
}

export interface RoutePermission {
  routeName: string;
  requiredPermissions: string[];
  allowedRoles: string[];
}

export interface RoleDefinition {
  code: string;
  name: string;
  description?: string;
  permissions: string[];
}
