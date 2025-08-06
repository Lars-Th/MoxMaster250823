import { createRouter, createWebHistory } from 'vue-router';
import { allRoutes } from './routes';
import { bottomNavigationItems, mainNavigationItems, navigationItems } from './navigation';
import { hasPermission } from './permissions';

// Create router with all routes
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: allRoutes,
});

// Navigation guards with permission checking
router.beforeEach(async (to, _from, next) => {
  console.log(`[Router] Navigating to: ${to.fullPath}`);

  // Check for authenticated user
  try {
    let currentUser = null;

    // Try to get user from localStorage first
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      try {
        currentUser = JSON.parse(storedUser);
      } catch (error) {
        console.error('[Router] Error parsing stored user:', error);
        localStorage.removeItem('currentUser');
        localStorage.removeItem('authToken');
      }
    }

    // If no stored user and we're in development mode, set default user
    if (!currentUser && import.meta.env.DEV) {
      try {
        // Import API dynamically to avoid circular dependencies
        const { default: api } = await import('@/api');
        const response = await api.auth.getDefaultUser();
        if (response.success && response.data) {
          currentUser = response.data;
          const mockToken = `mock-token-${response.data.id}-${Date.now()}`;
          localStorage.setItem('currentUser', JSON.stringify(response.data));
          localStorage.setItem('authToken', mockToken);
          console.log('🔧 Development mode: Auto-logged in as default user (Lars Thomas)');
        }
      } catch (error) {
        console.error('[Router] Error setting default user:', error);
      }
    }

    if (!currentUser) {
      console.warn('[Router] No authenticated user found');
      next('/login');
      return;
    }

    // Check permissions for the route
    const routeName = to.name as string;
    if (routeName && !hasPermission(currentUser.role, routeName)) {
      console.warn(`[Router] Access denied to ${to.path}`);
      console.warn(`[Router] User role:`, currentUser.role);
      console.warn(`[Router] Route:`, routeName);
      next('/home'); // Redirect to dashboard if no permission
      return;
    }

    next();
  } catch (error) {
    console.error('[Router] Navigation error:', error);
    next('/login');
  }
});

// Export navigation items for use in components
export { mainNavigationItems, bottomNavigationItems, navigationItems };

export default router;
