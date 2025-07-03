import { ref } from 'vue';
import type { UseValidationReturn, ValidationResult, ValidationRule } from '@/types/validation';
import { validateNestedProperty } from '@/schemas/validationSchemas';

// Global state för validering
const errors = ref<Record<string, string | null>>({});
const touchedFields = ref<Record<string, boolean>>({});

export function useValidation(): UseValidationReturn {
  const validate = (value: unknown, rules: ValidationRule): ValidationResult => {
    const errors: string[] = [];

    // Required validation
    if (rules.required && (!value || value.toString().trim() === '')) {
      errors.push('Detta fält är obligatoriskt');
    }

    // Skip other validations if value is empty and not required
    if (!value && !rules.required) {
      return { isValid: true, errors: [] };
    }

    // Min length validation
    if (rules.min && String(value).length < rules.min) {
      errors.push(`Minst ${rules.min} tecken krävs`);
    }

    // Max length validation
    if (rules.max && String(value).length > rules.max) {
      errors.push(`Högst ${rules.max} tecken tillåtna`);
    }

    // Pattern validation
    if (rules.pattern && !rules.pattern.test(String(value))) {
      errors.push('Ogiltigt format');
    }

    // Custom validation
    if (rules.custom) {
      const customResult = rules.custom(value);
      if (typeof customResult === 'string') {
        errors.push(customResult);
      } else if (customResult === false) {
        errors.push('Ogiltigt värde');
      }
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  };

  const validateForm = (
    data: Record<string, unknown>,
    schema: Record<string, ValidationRule>
  ): Record<string, ValidationResult> => {
    const results: Record<string, ValidationResult> = {};

    Object.keys(schema).forEach(fieldName => {
      const value = data[fieldName];
      const rules = schema[fieldName];
      if (rules) {
        results[fieldName] = validate(value, rules);
      }
    });

    return results;
  };

  const isFormValid = (results: Record<string, ValidationResult>): boolean => {
    return Object.values(results).every(result => result.isValid);
  };

  // Valideringsregler
  const validationRules: Record<string, (value: unknown, fieldName: string) => string | null> = {
    required: (value: unknown, fieldName: string) => {
      if (!value || String(value).trim() === '') {
        return `${fieldName} är obligatoriskt`;
      }
      return null;
    },

    email: (value: unknown, fieldName: string) => {
      if (!value) return null; // Om inte required kommer det fångas av required-regeln
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(String(value))) {
        return `${fieldName} måste vara en giltig e-postadress`;
      }
      return null;
    },

    phone: (value: unknown, fieldName: string) => {
      if (!value) return null;
      const phoneRegex = /^[\d\s\-+()]+$/;
      if (!phoneRegex.test(String(value))) {
        return `${fieldName} får endast innehålla siffror, mellanslag och bindestreck`;
      }
      return null;
    },

    postalCode: (value: unknown, fieldName: string) => {
      if (!value) return null;
      const postalRegex = /^\d{5}$/;
      if (!postalRegex.test(String(value))) {
        return `${fieldName} måste vara 5 siffror`;
      }
      return null;
    },

    website: (value: unknown, fieldName: string) => {
      if (!value) return null;
      const urlRegex = /^https?:\/\/.+\..+/;
      if (!urlRegex.test(String(value))) {
        return `${fieldName} måste vara en giltig webbadress som börjar med http:// eller https://`;
      }
      return null;
    },
  };

  // Validera ett enskilt fält
  const validateField = (
    fieldName: string,
    value: unknown,
    rules: string[],
    displayName?: string
  ) => {
    const fieldDisplayName = displayName ?? fieldName;

    // Rensa tidigare fel för detta fält
    errors.value[fieldName] = null;

    // Kör igenom alla regler för fältet
    for (const rule of rules) {
      let error: string | null = null;

      // Check standard validation rules first
      if (validationRules[rule]) {
        error = validationRules[rule](value, fieldDisplayName);
      }
      // Then check custom business rules
      // else {
      //   error = validateWithCustomRules(value, rule);
      // }

      if (error) {
        errors.value[fieldName] = error;
        break; // Avbryt vid första felet
      }
    }

    return !errors.value[fieldName];
  };

  // Validera alla fält enligt schema
  const validateAll = (
    data: Record<string, unknown>,
    schema: Record<string, { rules: string[]; displayName?: string }>
  ) => {
    let isValid = true;

    Object.keys(schema).forEach(fieldName => {
      const fieldConfig = schema[fieldName];
      const value = data[fieldName];

      touchedFields.value[fieldName] = true;

      if (fieldConfig) {
        const fieldIsValid = validateField(
          fieldName,
          value,
          fieldConfig.rules,
          fieldConfig.displayName
        );

        if (!fieldIsValid) {
          isValid = false;
        }
      }
    });

    return isValid;
  };

  // Markera fält som "touched"
  const touchField = (fieldName: string) => {
    touchedFields.value[fieldName] = true;
  };

  // Kontrollera om fält har fel
  const hasError = (fieldName: string): boolean => {
    return !!(touchedFields.value[fieldName] && errors.value[fieldName]);
  };

  // Hämta felmeddelande för fält
  const getError = (fieldName: string): string | null => {
    return hasError(fieldName) ? (errors.value[fieldName] ?? null) : null;
  };

  // Kontrollera om fält är obligatoriskt
  const isRequired = (fieldName: string, schema: Record<string, { rules?: string[] }>) => {
    return schema[fieldName]?.rules?.includes('required') ?? false;
  };

  // Rensa alla fel
  const clearErrors = () => {
    errors.value = {};
    touchedFields.value = {};
  };

  // Rensa fel för specifikt fält
  const clearFieldError = (fieldName: string) => {
    errors.value[fieldName] = null;
    touchedFields.value[fieldName] = false;
  };

  // Validate nested object properties
  const validateNestedField = (
    data: Record<string, unknown>,
    fieldPath: string,
    rules: string[],
    displayName?: string
  ): boolean => {
    const value = validateNestedProperty(data, fieldPath);
    return validateField(fieldPath, value, rules, displayName);
  };

  return {
    validate,
    validateForm,
    isFormValid,
    validateField,
    validateAll,
    touchField,
    hasError,
    getError,
    isRequired,
    clearErrors,
    clearFieldError,
    validateNestedField,
    errors,
    touchedFields,
  };
}

// Common validation patterns
export const validationPatterns = {
  email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  phone: /^[+]?[1-9][\d]{0,15}$/,
  postalCode: /^\d{5}$/,
  website: /^https?:\/\/.+\..+/,
} as const;

// Common validation rules
export const commonRules = {
  required: { required: true },
  email: {
    required: true,
    pattern: validationPatterns.email,
  },
  phone: {
    pattern: validationPatterns.phone,
  },
  postalCode: {
    pattern: validationPatterns.postalCode,
  },
  website: {
    pattern: validationPatterns.website,
  },
  shortText: {
    required: true,
    min: 2,
    max: 100,
  },
  longText: {
    max: 1000,
  },
} as const;

// Export types for backward compatibility
export type { ValidationRule, ValidationResult, UseValidationReturn } from '@/types/validation';
