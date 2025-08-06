import { ApiConfiguration } from '@/api/config';
import { MockDataService } from '@/api/mocks';
import type { RelationalParams } from '@/types/enhanced';
import type { RequestParams } from '@/types';

// Export all types and client functionality
export * from '@/api/client';
export * from '@/api/services';
export * from '@/api/config';
export * from '@/api/mocks';

// Environment-based API service selection
const USE_MOCK_API = (import.meta as any).env?.VITE_USE_MOCK_API === 'true';

// Create the main API service instance
const apiService = USE_MOCK_API ? new MockDataService() : new ApiConfiguration();

// Clean, domain-focused API interface
export const api = {
  // Activities
  users: {
    getAll: (params?: RequestParams & RelationalParams) =>
      USE_MOCK_API
        ? (apiService as MockDataService).getUsers(params)
        : (apiService as ApiConfiguration).users.getAll(),

    getById: (id: string, params?: RelationalParams) =>
      USE_MOCK_API
        ? (apiService as MockDataService).getUser(id, params)
        : (apiService as ApiConfiguration).users.getById(id),

    create: (data: Record<string, unknown>) =>
      USE_MOCK_API
        ? (apiService as MockDataService).createUser(data as never)
        : (apiService as ApiConfiguration).users.create(data),

    update: (id: string, data: Record<string, unknown>) =>
      USE_MOCK_API
        ? (apiService as MockDataService).updateUser(id, data as never)
        : (apiService as ApiConfiguration).users.update(id, data),

    delete: (id: string) =>
      USE_MOCK_API
        ? (apiService as MockDataService).deleteUser(id)
        : (apiService as ApiConfiguration).users.delete(id),

    updatePassword: (id: string, newPassword: string) =>
      USE_MOCK_API
        ? (apiService as MockDataService).updateUserPassword(id, newPassword)
        : (apiService as ApiConfiguration).users.changePassword(id, newPassword),
  },

  // PermissionGroups
  permissionGroups: {
    getAll: () =>
      USE_MOCK_API
        ? (apiService as MockDataService).getPermissionGroups()
        : Promise.reject(new Error('PermissionGroups not implemented in real API yet')),

    getById: (id: string) =>
      USE_MOCK_API
        ? (apiService as MockDataService).getPermissionGroup(id)
        : Promise.reject(new Error('PermissionGroups not implemented in real API yet')),

    create: (data: Record<string, unknown>) =>
      USE_MOCK_API
        ? (apiService as MockDataService).createPermissionGroup(data as never)
        : Promise.reject(new Error('PermissionGroups not implemented in real API yet')),

    update: (id: string, data: Record<string, unknown>) =>
      USE_MOCK_API
        ? (apiService as MockDataService).updatePermissionGroup(id, data as never)
        : Promise.reject(new Error('PermissionGroups not implemented in real API yet')),

    delete: (id: string) =>
      USE_MOCK_API
        ? (apiService as MockDataService).deletePermissionGroup(id)
        : Promise.reject(new Error('PermissionGroups not implemented in real API yet')),
  },

  // Authentication
  auth: {
    login: (email: string, password: string) =>
      USE_MOCK_API
        ? (apiService as MockDataService).login(email, password)
        : (apiService as ApiConfiguration).auth.login({ email, password }),

    logout: (token?: string) =>
      USE_MOCK_API
        ? (apiService as MockDataService).logout()
        : (apiService as ApiConfiguration).auth.logout(token),

    getCurrentUser: (token: string) =>
      USE_MOCK_API
        ? (apiService as MockDataService).getCurrentUser(token)
        : (apiService as ApiConfiguration).auth.getCurrentUser(token),

    refreshToken: (refreshToken: string) =>
      USE_MOCK_API
        ? Promise.reject(new Error('Refresh token not implemented in mock'))
        : (apiService as ApiConfiguration).auth.refreshToken(refreshToken),

    validateToken: (token: string) =>
      USE_MOCK_API
        ? Promise.reject(new Error('Token validation not implemented in mock'))
        : (apiService as ApiConfiguration).auth.validateToken(token),

    changePassword: (oldPassword: string, newPassword: string, token: string) =>
      USE_MOCK_API
        ? Promise.reject(new Error('Change password not implemented in mock'))
        : (apiService as ApiConfiguration).auth.changePassword(oldPassword, newPassword, token),

    requestPasswordReset: (email: string) =>
      USE_MOCK_API
        ? Promise.reject(new Error('Password reset not implemented in mock'))
        : (apiService as ApiConfiguration).auth.requestPasswordReset(email),

    resetPassword: (token: string, newPassword: string) =>
      USE_MOCK_API
        ? Promise.reject(new Error('Password reset not implemented in mock'))
        : (apiService as ApiConfiguration).auth.resetPassword(token, newPassword),

    getDemoUsers: () =>
      USE_MOCK_API
        ? (apiService as MockDataService).getDemoUsers()
        : (apiService as ApiConfiguration).auth.getDemoUsers(),

    getDefaultUser: () =>
      USE_MOCK_API
        ? (apiService as MockDataService).getDefaultUser()
        : Promise.reject(new Error('Default user not implemented in real API')),
  },
};

// Default export for convenience
export default api;

// Export the service instance for advanced usage
export { apiService };
