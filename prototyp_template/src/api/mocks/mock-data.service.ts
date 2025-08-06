import type { ApiResponse } from '@/types/api';
import type { RelationalParams } from '@/types/api-parameters';

// Import JSON data
import usersData from '@/assets/data/users.json';
import permissionGroupsData from '@/assets/data/permissionGroups.json';

export class MockDataService {
  private delay = 300; // Simulate network delay

  private async simulateNetworkDelay(): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, this.delay));
  }

  private async mockRequest<T>(data: T): Promise<ApiResponse<T>> {
    await this.simulateNetworkDelay();

    // Simulate occasional network errors (0.005% chance)
    if (Math.random() < 0.00005) {
      return {
        data: null as T,
        success: false,
        error: {
          message: 'Simulated network error',
          code: 'NETWORK_ERROR',
        },
      };
    }

    return {
      data,
      success: true,
      message: 'Request successful',
    };
  }

  // Shared permission mapping function
  private getPermissionRole(permissionID: number): string {
    const group = permissionGroupsData.find(pg => pg.id === permissionID);
    if (!group) return 'Handläggare';

    // Map permission group names to expected role names for the router
    const roleMapping: { [key: string]: string } = {
      Administratör: 'Administratör',
      'Full tillgång till dokument': 'Enhetsansvarig',
      'Tillgång till dokument': 'Handläggare',
      Versamhetsanvändare: 'Handläggare',
    };

    return roleMapping[group.name] ?? 'Handläggare';
  }

  // Users
  async getUsers(params?: RelationalParams): Promise<ApiResponse<any[]>> {
    const users = usersData as any[];

    if (!params?.include || params.include.length === 0) {
      return this.mockRequest(users);
    }

    const enhancedUsers = users.map(user => {
      const enhanced: any = { ...user };

      if (params.include?.includes('permissionGroup')) {
        const permissionGroupRaw = permissionGroupsData.find(pg => pg.id === user.permissionID);
        if (permissionGroupRaw) {
          enhanced.permissionGroup = permissionGroupRaw;
        }
      }

      return enhanced;
    });

    return this.mockRequest(enhancedUsers);
  }

  async getUser(id: string, params?: RelationalParams): Promise<ApiResponse<any | null>> {
    const user = usersData.find(u => u.id === parseInt(id));
    if (!user) {
      return this.mockRequest(null);
    }

    if (!params?.include || params.include.length === 0) {
      return this.mockRequest(user);
    }

    const enhanced: any = { ...user };

    if (params.include?.includes('permissionGroup')) {
      const permissionGroupRaw = permissionGroupsData.find(pg => pg.id === user.permissionID);
      if (permissionGroupRaw) {
        enhanced.permissionGroup = permissionGroupRaw;
      }
    }

    return this.mockRequest(enhanced);
  }

  async createUser(
    user: Partial<(typeof usersData)[0]>
  ): Promise<ApiResponse<(typeof usersData)[0]>> {
    const newUser = {
      ...user,
      id: Math.max(...usersData.map(u => u.id)) + 1,
    } as unknown as (typeof usersData)[0];

    return this.mockRequest(newUser);
  }

  async updateUser(
    id: string,
    user: Partial<(typeof usersData)[0]>
  ): Promise<ApiResponse<(typeof usersData)[0]>> {
    const existingUserIndex = usersData.findIndex(u => u.id === parseInt(id));
    if (existingUserIndex === -1) {
      return {
        data: null as unknown as (typeof usersData)[0],
        success: false,
        error: {
          message: 'User not found',
          code: 'NOT_FOUND',
        },
      };
    }

    const existingUser = usersData[existingUserIndex]!;
    const updatedUser = {
      ...existingUser,
      ...user,
      // Ensure required fields are not undefined
      name: user.name ?? existingUser.name,
      email: user.email ?? existingUser.email,
      permissionID: user.permissionID ?? existingUser.permissionID,
    } as (typeof usersData)[0];

    // Actually update the data in the mock data array
    usersData[existingUserIndex] = updatedUser;

    return this.mockRequest(updatedUser);
  }

  async deleteUser(id: string): Promise<ApiResponse<boolean>> {
    const exists = usersData.some(u => u.id === parseInt(id));
    if (!exists) {
      return {
        data: false,
        success: false,
        error: {
          message: 'User not found',
          code: 'NOT_FOUND',
        },
      };
    }

    return this.mockRequest(true);
  }

  async updateUserPassword(id: string, newPassword: string): Promise<ApiResponse<boolean>> {
    const existingUserIndex = usersData.findIndex(u => u.id === parseInt(id));
    if (existingUserIndex === -1) {
      return {
        data: false,
        success: false,
        error: {
          message: 'User not found',
          code: 'NOT_FOUND',
        },
      };
    }

    // Update the password in the mock data array
    usersData[existingUserIndex]!.password = newPassword;

    return this.mockRequest(true);
  }

  // PermissionGroups
  async getPermissionGroups(): Promise<ApiResponse<typeof permissionGroupsData>> {
    return this.mockRequest(permissionGroupsData);
  }

  async getPermissionGroup(
    id: string
  ): Promise<ApiResponse<(typeof permissionGroupsData)[0] | null>> {
    const group = permissionGroupsData.find(g => g.id === parseInt(id));
    return this.mockRequest(group ?? null);
  }

  async createPermissionGroup(
    data: Partial<(typeof permissionGroupsData)[0]>
  ): Promise<ApiResponse<(typeof permissionGroupsData)[0]>> {
    const newGroup = {
      ...data,
      id: Math.max(...permissionGroupsData.map(g => g.id)) + 1,
    } as (typeof permissionGroupsData)[0];

    return this.mockRequest(newGroup);
  }

  async updatePermissionGroup(
    id: string,
    data: Partial<(typeof permissionGroupsData)[0]>
  ): Promise<ApiResponse<(typeof permissionGroupsData)[0]>> {
    const existingGroup = permissionGroupsData.find(g => g.id === parseInt(id));
    if (!existingGroup) {
      return {
        data: null as unknown as (typeof permissionGroupsData)[0],
        success: false,
        error: {
          message: 'Permission group not found',
          code: 'NOT_FOUND',
        },
      };
    }

    const updatedGroup = { ...existingGroup, ...data } as (typeof permissionGroupsData)[0];
    return this.mockRequest(updatedGroup);
  }

  async deletePermissionGroup(id: string): Promise<ApiResponse<boolean>> {
    const exists = permissionGroupsData.some(g => g.id === parseInt(id));
    if (!exists) {
      return {
        data: false,
        success: false,
        error: {
          message: 'Permission group not found',
          code: 'NOT_FOUND',
        },
      };
    }

    return this.mockRequest(true);
  }

  // Authentication
  async login(
    email: string,
    password: string
  ): Promise<
    ApiResponse<{
      user: {
        id: number;
        name: string;
        email: string;
        role: string;
        permissionGroup?: any;
      };
      token?: string;
    }>
  > {
    // Find user in the JSON data
    const user = usersData.find((u: any) => u.email === email && u.password === password);

    if (!user) {
      return {
        data: null as any,
        success: false,
        error: {
          message: 'Felaktigt användarnamn eller lösenord',
          code: 'UNAUTHORIZED',
        },
      };
    }

    // Get permission group for the user
    const permissionGroup = permissionGroupsData.find(pg => pg.id === user.permissionID);

    const authUser = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: this.getPermissionRole(user.permissionID),
      permissionGroup,
    };

    return this.mockRequest({
      user: authUser,
      token: `mock-token-${user.id}-${Date.now()}`, // Mock JWT token
    });
  }

  async logout(): Promise<ApiResponse<boolean>> {
    // In a real API, this would invalidate the token
    return this.mockRequest(true);
  }

  async getCurrentUser(token: string = ''): Promise<
    ApiResponse<{
      id: number;
      name: string;
      email: string;
      role: string;
      permissionGroup?: any;
    } | null>
  > {
    // In a real API, this would validate the token and return user info
    // For mock, we'll just return null if no valid token format
    if (!token.startsWith('mock-token-')) {
      return {
        data: null,
        success: false,
        error: {
          message: 'Invalid or expired token',
          code: 'UNAUTHORIZED',
        },
      };
    }

    // Extract user ID from mock token
    const tokenParts = token.split('-');
    const userId = parseInt(tokenParts[2] ?? '0');

    const user = usersData.find((u: any) => u.id === userId);
    if (!user) {
      return {
        data: null,
        success: false,
        error: {
          message: 'User not found',
          code: 'NOT_FOUND',
        },
      };
    }

    // Get permission group for the user
    const permissionGroup = permissionGroupsData.find(pg => pg.id === user.permissionID);

    const authUser = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: this.getPermissionRole(user.permissionID),
      permissionGroup,
    };

    return this.mockRequest(authUser);
  }

  // Get default user for development
  async getDefaultUser(): Promise<
    ApiResponse<{
      id: number;
      name: string;
      email: string;
      role: string;
      permissionGroup?: any;
    } | null>
  > {
    const user = usersData.find((u: any) => u.id === 1); // Lars Thomas
    if (!user) {
      return {
        data: null,
        success: false,
        error: {
          message: 'Default user not found',
          code: 'NOT_FOUND',
        },
      };
    }

    // Get permission group for the user
    const permissionGroup = permissionGroupsData.find(pg => pg.id === user.permissionID);

    const authUser = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: this.getPermissionRole(user.permissionID),
      permissionGroup,
    };

    return this.mockRequest(authUser);
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
    // Use shared permission mapping

    // Get user type based on role
    const getUserType = (permissionID: number): 'admin' | 'manager' | 'user' => {
      switch (permissionID) {
        case 1:
        case 2:
          return 'admin';
        case 4:
          return 'manager';
        default:
          return 'user';
      }
    };

    // Map users to demo format
    const demoUsers = usersData.map((user: any) => ({
      id: user.id,
      name: user.name,
      email: user.email,
      role: this.getPermissionRole(user.permissionID),
      type: getUserType(user.permissionID),
    }));

    return this.mockRequest(demoUsers);
  }
}
