export interface Field {
  key: string;
  label: string;
  type?: 'text' | 'date' | 'number' | 'email' | 'textarea' | 'select' | 'checkbox';
  value: any;
  options?: Array<{ label: string; value: any }>;
  readonly?: boolean;
  required?: boolean;
}

export interface Tab {
  id: string;
  label: string;
  icon?: any;
  content: Field[];
}

export interface SubTable {
  title: string;
  headers: string[];
  data: Record<string, any>[];
  actions?: Array<{
    label: string;
    action: (item: any) => void;
    variant?: 'primary' | 'secondary' | 'danger';
  }>;
}

export interface SimpleBreadcrumbItem {
  label: string;
  href?: string;
  current?: boolean;
}

export interface ActionButton {
  label: string;
  action: () => void;
  variant?: 'primary' | 'secondary' | 'danger';
  icon?: any;
  disabled?: boolean;
}

export interface SimpleFilterOption {
  label: string;
  value: any;
  count?: number;
}

export interface Filter {
  key: string;
  label: string;
  type: 'select' | 'multiselect' | 'date' | 'daterange' | 'text';
  options?: SimpleFilterOption[];
  value: any;
}

export interface FilterConfig {
  key: string;
  label: string;
  type: 'text' | 'select' | 'date' | 'daterange';
  options?: Array<{ label: string; value: any }>;
  placeholder?: string;
  multiple?: boolean;
}

export interface Stat {
  label: string;
  value: string | number;
  change?: string;
  trend?: 'up' | 'down' | 'neutral';
}

export interface TreeNode {
  id: string;
  label: string;
  children?: TreeNode[];
  data?: any;
}

export interface SpacingVariable {
  name: string;
  value: string;
  description?: string;
}
