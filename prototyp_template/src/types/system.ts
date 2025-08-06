export interface Role {
  id: string;
  name: string;
  description: string;
  permissions: string[];
}

export interface Theme {
  name: string;
  displayName: string;
  colors: Record<string, string>;
}

export interface ColorDefinition {
  key: string;
  label: string;
  description: string;
  category: 'brand' | 'layout' | 'content' | 'status';
}

export interface Question {
  id: string;
  text: string;
  type: 'text' | 'number' | 'select' | 'multiselect' | 'textarea' | 'date' | 'checkbox';
  options?: string[];
  required: boolean;
  order: number;
}
