// Shared component interfaces used across multiple components

export interface Stat {
  label: string;
  value: string | number;
  variant?: 'default' | 'secondary' | 'destructive' | 'outline';
  color?: string;
}

export interface ActionButton {
  label: string;
  icon?: unknown;
  onClick: () => void;
  variant?: 'primary' | 'secondary';
  class?: string;
}

export interface FilterOption {
  key: string;
  label: string;
  value: string;
}

export interface Filter {
  modelValue: string;
  placeholder: string;
  options: FilterOption[];
  onChange: (value: string) => void;
}

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

export interface BreadcrumbItem {
  label: string;
  href?: string;
  current?: boolean;
}

export interface StatItem {
  label: string;
  value: string | number;
  change?: string;
  trend?: 'up' | 'down' | 'neutral';
}
