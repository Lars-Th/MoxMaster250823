// Core business entity interfaces

export interface DetailedPermissionGroup {
  id: number;
  name: string;
  administreraInloggningskonton: boolean;
  hanteraAnvandare: boolean;
  laddaUppOchRedigera: boolean;
  visaOchLaddaNer: boolean;
  lasaPubliceradeNyheter: boolean;
  publiceranyheter: boolean;
  administreraKategorier: boolean;
  redigeraVerksamheter: boolean;
  skapaVerksamheter: boolean;
}

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

// Enhanced user types with relational data
export interface UserWithPermissionGroup extends User {
  permissionGroup?: DetailedPermissionGroup;
}

// Enhanced auth user type for authentication
export interface AuthUser {
  id: number;
  name: string;
  email: string;
  role: string;
  stadsmission?: number;
  permissionGroup?: DetailedPermissionGroup;
}
