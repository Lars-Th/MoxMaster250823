export interface MainNavigationItem {
  name: string;
  path: string;
  icon: any;
  permissions: string[];
  dropdown?: NavigationGroup[];
}

export interface NavigationGroup {
  name?: string;
  icon?: any;
  children: NavigationChild[];
}

export interface NavigationChild {
  name: string;
  path: string;
  icon: any;
  permissions: string[];
}
