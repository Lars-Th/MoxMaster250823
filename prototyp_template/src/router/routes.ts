import type { RouteRecordRaw } from 'vue-router';

// Lazy load all views
const LoginForm = () => import('@/views/LoginForm.vue');

// User management
const UserList = () => import('@/views/UserList.vue');
const UserDetail = () => import('@/views/UserDetail.vue');
const PermissionGroups = () => import('@/views/PermissionGroups.vue');

// Development
const CustomComponents = () => import('@/views/CustomComponents.vue');
const Placeholder = () => import('@/views/Placeholder.vue');

// Auth routes
export const authRoutes: RouteRecordRaw[] = [
  {
    path: '/login',
    name: 'login',
    component: LoginForm,
    meta: { requiresAuth: false },
  },
];

// Settings routes
export const settingsRoutes: RouteRecordRaw[] = [
  {
    path: '/settings',
    name: 'settings',
    component: UserDetail,
  },
  {
    path: '/settings/my-account',
    name: 'settings-my-account',
    component: UserDetail,
  },
  {
    path: '/settings/login-accounts',
    name: 'settings-login-accounts',
    component: UserList,
  },
  {
    path: '/settings/login-accounts/:id',
    name: 'user-detail',
    component: UserDetail,
  },
  {
    path: '/settings/permission-groups',
    name: 'settings-permission-groups',
    component: PermissionGroups,
  },
];

// Home/Dashboard routes
export const homeRoutes: RouteRecordRaw[] = [
  {
    path: '/home',
    name: 'home',
    component: Placeholder,
  },
];

// Development routes
export const developmentRoutes: RouteRecordRaw[] = [
  {
    path: '/custom-components',
    name: 'custom-components',
    component: CustomComponents,
  },
  {
    path: '/placeholder',
    name: 'placeholder',
    component: Placeholder,
  },
];

// Utility routes
export const utilityRoutes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'root',
    redirect: '/home',
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'not-found',
    redirect: '/home',
  },
];

// Combine all routes
export const allRoutes: RouteRecordRaw[] = [
  ...utilityRoutes,
  ...authRoutes,
  ...homeRoutes,
  ...settingsRoutes,
  ...developmentRoutes,
];
