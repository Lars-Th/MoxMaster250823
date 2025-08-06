import type { ApiResponse } from '@/types';
import type { User } from '@/types/index';
import type { HttpClient } from '@/api/client/http-client';
import { BaseService } from '@/api/services/base.service';

/**
 * User API Service
 *
 * This service handles all user-related API operations including
 * CRUD operations, authentication, and user management.
 */
export class UserService extends BaseService<User> {
  constructor(httpClient: HttpClient) {
    super(httpClient, '/users');
  }

  /**
   * Get all users (overrides BaseService method)
   */
  async getAll(): Promise<ApiResponse<User[]>> {
    return super.getAll();
  }

  /**
   * Get user by ID (overrides BaseService method)
   */
  async getById(id: string): Promise<ApiResponse<User | null>> {
    return super.getById(id);
  }

  /**
   * Create a new user (overrides BaseService method)
   */
  async create(user: Partial<User>): Promise<ApiResponse<User>> {
    return super.create(user);
  }

  /**
   * Update an existing user (overrides BaseService method)
   */
  async update(id: string, user: Partial<User>): Promise<ApiResponse<User>> {
    return super.update(id, user);
  }

  /**
   * Delete a user (overrides BaseService method)
   */
  async delete(id: string): Promise<ApiResponse<boolean>> {
    return super.delete(id);
  }

  /**
   * Change user password
   */
  async changePassword(id: string, newPassword: string): Promise<ApiResponse<boolean>> {
    return this.put(`/${id}/password`, { newPassword });
  }

  /**
   * Update user roles
   */
  async updateRoles(id: string, roles: string[]): Promise<ApiResponse<User>> {
    return this.put(`/${id}/roles`, { roller: roles });
  }

  /**
   * Update user units
   */
  async updateUnits(id: string, units: string[]): Promise<ApiResponse<User>> {
    return this.put(`/${id}/units`, { enheter: units });
  }
}

// Note: Default instance removed - now created via ApiConfiguration with proper HttpClient
