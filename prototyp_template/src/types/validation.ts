// Vue-specific imports for types
import type { Ref } from 'vue';

// Validation types for consistent data validation across the application

export interface ValidationSchema {
  [fieldName: string]: {
    rules: string[];
    displayName: string;
  };
}

export interface ValidationRule {
  type: string;
  message?: string;
  value?: unknown;
}

export interface ValidationResult {
  isValid: boolean;
  errors: Record<string, string[]>;
}

export interface FormField {
  name: string;
  label: string;
  type:
    | 'text'
    | 'email'
    | 'password'
    | 'number'
    | 'textarea'
    | 'select'
    | 'checkbox'
    | 'radio'
    | 'date';
  value?: unknown;
  required?: boolean;
  placeholder?: string;
  validation?: ValidationRule[];
  options?: Array<{ value: string | number; label: string }>;
  disabled?: boolean;
  readonly?: boolean;
}

export interface FormConfig {
  fields: FormField[];
  submitLabel?: string;
  cancelLabel?: string;
  showCancel?: boolean;
  onSubmit?: (data: Record<string, unknown>) => void | Promise<void>;
  onCancel?: () => void;
  loading?: boolean;
  error?: string | null;
}

export interface UseValidationReturn {
  validate: (value: unknown, rules: ValidationRule) => ValidationResult;
  validateForm: (
    data: Record<string, unknown>,
    schema: Record<string, ValidationRule>
  ) => Record<string, ValidationResult>;
  isFormValid: (results: Record<string, ValidationResult>) => boolean;
  validateField: (
    fieldName: string,
    value: unknown,
    rules: string[],
    displayName?: string
  ) => boolean;
  validateAll: (
    data: Record<string, unknown>,
    schema: Record<string, { rules: string[]; displayName?: string }>
  ) => boolean;
  validateNestedField: (
    data: Record<string, unknown>,
    fieldPath: string,
    rules: string[],
    displayName?: string
  ) => boolean;
  touchField: (fieldName: string) => void;
  hasError: (fieldName: string) => boolean;
  getError: (fieldName: string) => string | null;
  isRequired: (fieldName: string, schema: Record<string, { rules?: string[] }>) => boolean;
  clearErrors: () => void;
  clearFieldError: (fieldName: string) => void;
  errors: Ref<Record<string, string | null>>;
  touchedFields: Ref<Record<string, boolean>>;
}
