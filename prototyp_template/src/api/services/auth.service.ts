import { BaseService } from './base.service';
import type { ApiResponse } from '@/types';
import type { LoginRequest, LoginResponse, User } from '@/types/auth';
import type { HttpClient } from '../client/http-client';

export class AuthService extends BaseService<unknown> {
  constructor(httpClient: HttpClient) {
    super(httpClient, '/auth');
  }

  async login(credentials: LoginRequest): Promise<ApiResponse<LoginResponse>> {
    return this.post<LoginResponse>('/login', credentials);
  }

  async logout(token?: string): Promise<ApiResponse<boolean>> {
    const headers = token ? { Authorization: `Bearer ${token}` } : {};
    return this.post<boolean>('/logout', {}, { headers });
  }

  async getCurrentUser(token: string): Promise<ApiResponse<User>> {
    return this.get<User>(
      '/me',
      {},
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
  }

  async refreshToken(
    refreshToken: string
  ): Promise<ApiResponse<{ token: string; expiresIn: number }>> {
    return this.post<{ token: string; expiresIn: number }>('/refresh', { refreshToken });
  }

  async validateToken(token: string): Promise<ApiResponse<boolean>> {
    return this.post<boolean>('/validate', { token });
  }

  async changePassword(
    oldPassword: string,
    newPassword: string,
    token: string
  ): Promise<ApiResponse<boolean>> {
    return this.post<boolean>(
      '/change-password',
      { oldPassword, newPassword },
      { headers: { Authorization: `Bearer ${token}` } }
    );
  }

  async requestPasswordReset(email: string): Promise<ApiResponse<boolean>> {
    return this.post<boolean>('/forgot-password', { email });
  }

  async resetPassword(token: string, newPassword: string): Promise<ApiResponse<boolean>> {
    return this.post<boolean>('/reset-password', { token, newPassword });
  }

  async getDemoUsers(): Promise<
    ApiResponse<
      Array<{
        id: number;
        name: string;
        email: string;
        role: string;
        type: 'admin' | 'manager' | 'user';
      }>
    >
  > {
    return this.get<
      Array<{
        id: number;
        name: string;
        email: string;
        role: string;
        type: 'admin' | 'manager' | 'user';
      }>
    >('/demo-users');
  }
}
