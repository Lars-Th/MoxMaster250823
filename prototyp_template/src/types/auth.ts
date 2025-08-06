// Authentication and user-related interfaces

export interface User {
  id: string | number;
  name: string;
  email: string;
  role: string;
  permissionGroup?: {
    name: string;
  };
}

export interface UserExtended {
  // Add extended properties as needed
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  user: {
    id: number;
    name: string;
    email: string;
    role: string;
  };
  token: string;
  refreshToken?: string;
  expiresIn?: number;
}

export interface PasswordForm {
  oldPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export interface RoleDefinition {
  id: string;
  name: string;
  description: string;
  permissions: string[];
  level: number;
}

export interface NewUser {
  name: string;
  email: string;
  password: string;
  role: string;
  permissions: string[];
}
