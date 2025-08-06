// Core business entity interfaces
import type { DetailedPermissionGroup } from './enhanced';

export interface LoginAccount {
  id: number;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  status: 'Aktiv' | 'Inaktiv' | 'Låst';
  lastLogin: string;
  createdAt: string;
  department: string;
  permissionGroup?: DetailedPermissionGroup;
}

export interface User {
  id: number;
  name: string;
  email: string;
  password: string;
  permissionID: number;
  role?: string;
  permissionGroup?: DetailedPermissionGroup;
}

export interface PermissionGroup {
  PermissionGroupID: number;
  GroupName: string;
  Description: string;
  Permissions: string[];
  CreatedDate: string;
  UpdatedDate: string;
}
