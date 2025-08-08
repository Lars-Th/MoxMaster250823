export interface MainNavigationItem {
  name: string;
  path: string;
  icon: unknown;
  permissions: string[];
  dropdown?: NavigationGroup[];
}

export interface NavigationGroup {
  name?: string;
  icon?: unknown;
  children: NavigationChild[];
}

export interface NavigationChild {
  name: string;
  path: string;
  icon: unknown;
  permissions: string[];
}
