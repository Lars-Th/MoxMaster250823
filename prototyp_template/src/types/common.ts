// Common utility types used across the application

// Audit and tracking information
export interface AuditInfo {
  createdBy?: string;
  createdAt?: string;
  updatedBy?: string;
  updatedAt?: string;
  version?: number;
}

// Soft delete information
export interface SoftDeleteInfo {
  deletedBy?: string;
  deletedAt?: string;
  isDeleted?: boolean;
}

// Enhanced entity with audit and soft delete capabilities
export interface EnhancedEntity extends AuditInfo, SoftDeleteInfo {
  id: string | number;
}

// Relationship loading status
export interface RelationshipLoadingStatus {
  [relationshipName: string]: {
    loading: boolean;
    loaded: boolean;
    error?: string;
  };
}

// Entity with loading status for relationships
export interface EntityWithLoadingStatus<T> {
  entity: T;
  relationshipStatus: RelationshipLoadingStatus;
}

// Bulk operation types
export interface BulkOperation<T> {
  operation: 'create' | 'update' | 'delete';
  items: T[];
  options?: {
    skipValidation?: boolean;
    continueOnError?: boolean;
    batchSize?: number;
  };
}

export interface BulkOperationResult<T> {
  successful: T[];
  failed: Array<{
    item: T;
    error: string;
  }>;
  totalProcessed: number;
  successCount: number;
  failureCount: number;
}

// Search configuration
export interface SearchConfig {
  searchableFields: string[];
  searchType?: 'contains' | 'startsWith' | 'endsWith' | 'exact' | 'fuzzy';
  caseSensitive?: boolean;
  highlightMatches?: boolean;
  minSearchLength?: number;
  maxResults?: number;
}

// Filter configuration
export interface FilterConfig {
  filterableFields: Array<{
    field: string;
    type: 'text' | 'number' | 'date' | 'select' | 'multiselect' | 'boolean' | 'range';
    label: string;
    options?: Array<{ value: string | number | boolean; label: string }>;
    operator?:
      | 'equals'
      | 'contains'
      | 'startsWith'
      | 'endsWith'
      | 'greaterThan'
      | 'lessThan'
      | 'between'
      | 'in'
      | 'notIn';
  }>;
}

// Export configuration
export interface ExportConfig {
  formats: Array<'csv' | 'xlsx' | 'json' | 'pdf'>;
  includeHeaders?: boolean;
  selectedFields?: string[];
  fileName?: string;
  maxRows?: number;
}

// Import configuration
export interface ImportConfig {
  formats: Array<'csv' | 'xlsx' | 'json'>;
  requiredFields: string[];
  optionalFields?: string[];
  fieldMapping?: Record<string, string>;
  validateData?: boolean;
  skipInvalidRows?: boolean;
  maxRows?: number;
}
