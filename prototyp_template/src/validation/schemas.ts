// Validation schemas for consistent data validation across the application

export const userValidationSchema = {
  namn: {
    rules: ['required'],
    displayName: 'Namn',
  },
  epost: {
    rules: ['required', 'email'],
    displayName: 'E-post',
  },
  losenord: {
    rules: ['required'],
    displayName: 'Lösenord',
  },
  roller: {
    rules: ['required'],
    displayName: 'Roller',
  },
  enheter: {
    rules: ['required'],
    displayName: 'Enheter',
  },
  organisationId: {
    rules: ['required'],
    displayName: 'Organisation',
  },
};

export const loginValidationSchema = {
  epost: {
    rules: ['required', 'email'],
    displayName: 'E-post',
  },
  losenord: {
    rules: ['required'],
    displayName: 'Lösenord',
  },
};

// Type-safe validation schema type
import type { ValidationSchema } from '@/types';

// Helper function to validate nested object properties
export const validateNestedProperty = (obj: Record<string, unknown>, path: string): unknown => {
  return path.split('.').reduce((current: unknown, key: string): unknown => {
    return current && typeof current === 'object' && current !== null
      ? (current as Record<string, unknown>)[key]
      : undefined;
  }, obj as unknown);
};
