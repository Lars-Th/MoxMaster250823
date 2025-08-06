// Import base types
import type { LoginAccount, User } from './index';
import type { DetailedPermissionGroup } from './enhanced';

// User relationships
export interface UserWithRelations extends User {
  // Resolved relationships
  permissionGroup?: DetailedPermissionGroup;

  // Computed fields
  permissions?: string[]; // From permission group
}

// PermissionGroup relationships
export interface PermissionGroupWithRelations extends DetailedPermissionGroup {
  // Resolved relationships
  users?: UserWithRelations[];

  // Computed fields
  totalUsers?: number; // Count of users with this permission group
  activeUsers?: number; // Count of active users with this permission group
}

// LoginAccount relationships
export interface LoginAccountWithRelations extends LoginAccount {
  // Resolved relationships
  permissionGroup?: DetailedPermissionGroup;

  // Computed fields
  isActive?: boolean; // status === 'Aktiv'
  daysSinceLastLogin?: number; // Days since lastLogin
}

// Relationship loading options
export interface RelationshipLoadOptions {
  // User relationships
  permissionGroup?: boolean;

  // Generic relationships
  all?: boolean; // Load all available relationships
}
