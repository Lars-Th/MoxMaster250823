export interface Field {
  key: string;
  label: string;
  type?: 'text' | 'date' | 'number' | 'email' | 'textarea' | 'select' | 'checkbox';
  value: string | number | boolean | null | undefined;
  options?: Array<{ label: string; value: string | number | boolean }>;
  readonly?: boolean;
  required?: boolean;
}

export interface Tab {
  id: string;
  label: string;
  icon?: unknown;
  content: Field[];
}

export interface SubTable {
  title: string;
  headers: string[];
  data: Array<Record<string, unknown>>;
  actions?: Array<{
    label: string;
    action: (item: Record<string, unknown>) => void;
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
  icon?: unknown;
  disabled?: boolean;
}

export interface SimpleFilterOption {
  label: string;
  value: string | number | boolean;
  count?: number;
}

export interface Filter {
  key: string;
  label: string;
  type: 'select' | 'multiselect' | 'date' | 'daterange' | 'text';
  options?: SimpleFilterOption[];
  value: string | number | boolean | Date | Array<string | number | boolean | Date>;
}

export interface FilterConfig {
  key: string;
  label: string;
  type: 'text' | 'select' | 'date' | 'daterange';
  options?: Array<{ label: string; value: string | number | boolean }>;
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
  data?: Record<string, unknown>;
}

export interface SpacingVariable {
  name: string;
  value: string;
  description?: string;
}
