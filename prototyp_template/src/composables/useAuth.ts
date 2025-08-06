import { computed, ref } from 'vue';
import { useRouter } from 'vue-router';
import api from '@/api';
import type { AuthUser } from '@/types/enhanced';

// Global state
const currentUser = ref<AuthUser | null>(null);
const isAuthenticated = computed(() => currentUser.value !== null);

export function useAuth() {
  const router = useRouter();

  const login = async (
    email: string,
    password: string
  ): Promise<{ success: boolean; error?: string }> => {
    try {
      // Use API to authenticate
      const response = await api.auth.login(email, password);

      if (!response.success || !response.data) {
        return {
          success: false,
          error: response.error?.message ?? 'Felaktigt användarnamn eller lösenord',
        };
      }

      // Set current user from API response
      let { user } = response.data;
      if (user && 'permissionGroup' in user && user.permissionGroup) {
        user = { ...user, permissionGroup: mapPermissionGroupToDetailed(user.permissionGroup) };
      }
      currentUser.value = user as AuthUser;

      // Store user and token in localStorage for persistence
      localStorage.setItem('currentUser', JSON.stringify(currentUser.value));
      if (response.data.token) {
        localStorage.setItem('authToken', response.data.token);
      }

      // Redirect to dashboard
      router.push('/dashboard');

      return { success: true };
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, error: 'Ett fel uppstod vid inloggning' };
    }
  };

  const logout = async () => {
    try {
      const token = localStorage.getItem('authToken');

      // Call API logout if we have a token
      if (token) {
        await api.auth.logout(token);
      }
    } catch (error) {
      console.error('Logout error:', error);
      // Continue with local logout even if API call fails
    } finally {
      // Clear local state regardless of API call result
      currentUser.value = null;
      localStorage.removeItem('currentUser');
      localStorage.removeItem('authToken');
      router.push('/login');
    }
  };

  const initializeAuth = async () => {
    // Check if user is stored in localStorage (router guard may have already set this)
    const storedUser = localStorage.getItem('currentUser');
    const storedToken = localStorage.getItem('authToken');

    if (storedUser) {
      try {
        let parsedUser = JSON.parse(storedUser);
        if (parsedUser && 'permissionGroup' in parsedUser && parsedUser.permissionGroup) {
          parsedUser = {
            ...parsedUser,
            permissionGroup: mapPermissionGroupToDetailed(parsedUser.permissionGroup),
          };
        }
        currentUser.value = parsedUser as AuthUser;

        // If we have a token, validate it with the API
        if (storedToken && !storedToken.startsWith('mock-token-')) {
          try {
            const response = await api.auth.getCurrentUser(storedToken);
            if (response.success && response.data) {
              // Token is valid, use fresh user data from API
              let freshUser = response.data;
              if (freshUser && 'permissionGroup' in freshUser && freshUser.permissionGroup) {
                freshUser = {
                  ...freshUser,
                  permissionGroup: mapPermissionGroupToDetailed(freshUser.permissionGroup),
                };
              }
              currentUser.value = freshUser as AuthUser;
              localStorage.setItem('currentUser', JSON.stringify(freshUser));
            } else {
              // Token is invalid, clear stored data
              localStorage.removeItem('currentUser');
              localStorage.removeItem('authToken');
              currentUser.value = null;
            }
          } catch (error) {
            console.error('Error validating stored token:', error);
            // Keep the stored user data if API is unavailable
          }
        }
      } catch (parseError) {
        console.error('Error parsing stored user:', parseError);
        localStorage.removeItem('currentUser');
        localStorage.removeItem('authToken');
        currentUser.value = null;
      }
    }

    // If still no user and in development mode, the router guard will handle default user setup
    // We don't need to duplicate that logic here
  };

  return {
    currentUser: computed(() => currentUser.value),
    isAuthenticated,
    login,
    logout,
    initializeAuth,
  };
}

export function mapPermissionGroupToDetailed(pg: any): any {
  if (!pg) return undefined;
  if ('id' in pg && 'administreraInloggningskonton' in pg) return pg;
  // Map legacy or API shape to detailed
  return {
    id: pg.PermissionGroupID ?? pg.id,
    name: pg.GroupName ?? pg.name,
    administreraInloggningskonton: pg.administreraInloggningskonton ?? false,
    hanteraAnvandare: pg.hanteraAnvandare ?? false,
    laddaUppOchRedigera: pg.laddaUppOchRedigera ?? false,
    visaOchLaddaNer: pg.visaOchLaddaNer ?? false,
    lasaPubliceradeNyheter: pg.lasaPubliceradeNyheter ?? false,
    publiceranyheter: pg.publiceranyheter ?? false,
    administreraKategorier: pg.administreraKategorier ?? false,
    redigeraVerksamheter: pg.redigeraVerksamheter ?? false,
    skapaVerksamheter: pg.skapaVerksamheter ?? false,
  };
}
