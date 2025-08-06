// Vue-specific imports for types
import type { Ref } from 'vue';

// Validation-related interfaces

export interface ValidationRule {
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  min?: number;
  max?: number;
  pattern?: RegExp;
  email?: boolean;
  numeric?: boolean;
  custom?: (value: unknown) => boolean | string;
}

export interface ValidationResult {
  isValid: boolean;
  message?: string;
  errors?: string[];
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
