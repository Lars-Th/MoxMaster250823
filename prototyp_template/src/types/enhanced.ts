// Enhanced types for advanced functionality and relationships

import type { User } from './entities';

// API parameter types for include options
export interface RelationalParams {
  include?: string[];
}

export interface UserRelationalParams extends RelationalParams {
  include?: 'permissionGroup'[];
}

// Request parameters for paginated API calls
export interface RequestParams {
  page?: number;
  pageSize?: number;
  search?: string;
  sort?: string;
  order?: 'asc' | 'desc';
  filters?: Record<string, unknown>;
}

// Combined parameters for API calls with relationships
export interface EnhancedRequestParams extends RequestParams, RelationalParams {}

// Enhanced types for specific business logic
export interface UserProfile extends User {
  lastLogin?: string;
  loginCount?: number;
  isActive?: boolean;
  preferences?: Record<string, unknown>;
}

export interface UserActivity {
  userId: number;
  action: string;
  timestamp: string;
  details?: Record<string, unknown>;
  ipAddress?: string;
  userAgent?: string;
}

export interface PermissionMatrix {
  userId: number;
  permissions: Record<string, boolean>;
  grantedAt: string;
  grantedBy?: number;
  expiresAt?: string;
}
