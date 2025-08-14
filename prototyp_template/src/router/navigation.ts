import {
  Code,
  LayoutDashboard,
  Package,
  Settings,
  Shield,
  User,
  UserCheck,
  Users,
} from 'lucide-vue-next';
import type { MainNavigationItem } from '@/types/navigation';

// Main navigation items
export const mainNavigationItems: MainNavigationItem[] = [
  {
    name: 'Start',
    path: '/home',
    icon: LayoutDashboard,
    permissions: ['H', 'A', 'SA'],
  },
];

// Bottom navigation items
export const bottomNavigationItems: MainNavigationItem[] = [
  {
    name: 'Development',
    path: '/custom-components',
    icon: Code,
    permissions: ['H', 'A', 'SA'],
    dropdown: [
      {
        name: 'Komponenter',
        icon: Package,
        children: [
          {
            name: 'Komponenter',
            path: '/custom-components',
            icon: Package,
            permissions: ['H', 'A', 'SA'],
          },
        ],
      },
    ],
  },
  {
    name: 'Inställningar',
    path: '/settings',
    icon: Settings,
    permissions: ['H', 'A', 'SA'],
    dropdown: [
      {
        name: 'Användare',
        icon: Users,
        children: [
          {
            name: 'Mitt konto',
            path: '/settings/my-account',
            icon: User,
            permissions: ['H', 'A', 'SA'],
          },
          {
            name: 'Inloggningskonton',
            path: '/settings/login-accounts',
            icon: UserCheck,
            permissions: ['A', 'SA'],
          },
          {
            name: 'Behörighetsgrupper',
            path: '/settings/permission-groups',
            icon: Shield,
            permissions: ['A', 'SA'],
          },
          {
            name: 'Företagsinställningar',
            path: '/settings/company-settings',
            icon: Shield,
            permissions: ['A', 'SA'],
          },
        ],
      },
    ],
  },
];

// Legacy export for compatibility
export const navigationItems = [...mainNavigationItems, ...bottomNavigationItems];
