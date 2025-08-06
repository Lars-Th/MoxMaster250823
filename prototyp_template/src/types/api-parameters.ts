// API service parameter types and query builders

// Relationship loading parameters
export interface RelationalParams {
  include?: string[]; // Array of relationship names to include
}

// Base request parameters for API calls
export interface BaseRequestParams {
  page?: number;
  pageSize?: number;
  search?: string;
  sort?: string;
  order?: 'asc' | 'desc';
  filters?: Record<string, any>;
}

// Combined parameters for API calls with relationships
export interface ApiRequestParams extends BaseRequestParams, RelationalParams {}

// Query builder for complex filtering
export interface QueryBuilder {
  where?: WhereClause[];
  orderBy?: OrderByClause[];
  limit?: number;
  offset?: number;
  include?: string[];
  select?: string[];
}

// Where clause for filtering
export interface WhereClause {
  field: string;
  operator:
    | 'equals'
    | 'notEquals'
    | 'greaterThan'
    | 'lessThan'
    | 'greaterThanOrEqual'
    | 'lessThanOrEqual'
    | 'contains'
    | 'startsWith'
    | 'endsWith'
    | 'in'
    | 'notIn'
    | 'isNull'
    | 'isNotNull'
    | 'between';
  value: any;
  logicalOperator?: 'AND' | 'OR';
}

// Order by clause for sorting
export interface OrderByClause {
  field: string;
  direction: 'asc' | 'desc';
}

// Pagination parameters
export interface PaginationParams {
  page: number;
  pageSize: number;
  totalCount?: number;
  totalPages?: number;
}

// Pagination result
export interface PaginatedResult<T> {
  data: T[];
  pagination: {
    currentPage: number;
    pageSize: number;
    totalCount: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
}

// Search parameters
export interface SearchParams {
  query: string;
  fields?: string[];
  fuzzy?: boolean;
  caseSensitive?: boolean;
  limit?: number;
}

// Aggregation parameters
export interface AggregationParams {
  groupBy: string[];
  functions: Array<{
    field: string;
    function: 'count' | 'sum' | 'avg' | 'min' | 'max' | 'distinct';
    alias?: string;
  }>;
  having?: WhereClause[];
}

// Bulk operation parameters
export interface BulkCreateParams<T> {
  items: Partial<T>[];
  validateEach?: boolean;
  continueOnError?: boolean;
  batchSize?: number;
}

export interface BulkUpdateParams<T> {
  updates: Array<{
    id: string | number;
    data: Partial<T>;
  }>;
  validateEach?: boolean;
  continueOnError?: boolean;
  batchSize?: number;
}

export interface BulkDeleteParams {
  ids: Array<string | number>;
  softDelete?: boolean;
  continueOnError?: boolean;
  batchSize?: number;
}

// Export/Import parameters
export interface ExportParams extends ApiRequestParams {
  format: 'csv' | 'xlsx' | 'json' | 'pdf';
  fields?: string[];
  includeHeaders?: boolean;
  filename?: string;
}

export interface ImportParams {
  format: 'csv' | 'xlsx' | 'json';
  data: File | string | object[];
  fieldMapping?: Record<string, string>;
  skipInvalidRows?: boolean;
  validateData?: boolean;
  batchSize?: number;
}

// Cache parameters
export interface CacheParams {
  key: string;
  ttl?: number; // Time to live in seconds
  tags?: string[];
  invalidateOnUpdate?: boolean;
}

// Real-time subscription parameters
export interface SubscriptionParams {
  entity: string;
  events?: Array<'create' | 'update' | 'delete'>;
  filters?: WhereClause[];
  includeRelations?: string[];
}

// API operation context
export interface ApiContext {
  userId?: string;
  permissions?: string[];
  locale?: string;
  timezone?: string;
  requestId?: string;
  traceId?: string;
}

// API operation options
export interface ApiOperationOptions {
  context?: ApiContext;
  cache?: CacheParams;
  timeout?: number;
  retries?: number;
  retryDelay?: number;
  validateResponse?: boolean;
  transformResponse?: (data: any) => any;
}

// Generic API service interface
export interface ApiService<T> {
  getAll(params?: ApiRequestParams, options?: ApiOperationOptions): Promise<PaginatedResult<T>>;
  getById(
    id: string | number,
    params?: RelationalParams,
    options?: ApiOperationOptions
  ): Promise<T | null>;
  create(data: Partial<T>, options?: ApiOperationOptions): Promise<T>;
  update(id: string | number, data: Partial<T>, options?: ApiOperationOptions): Promise<T>;
  delete(id: string | number, options?: ApiOperationOptions): Promise<boolean>;

  // Bulk operations
  bulkCreate?(
    params: BulkCreateParams<T>,
    options?: ApiOperationOptions
  ): Promise<BulkOperationResult<T>>;
  bulkUpdate?(
    params: BulkUpdateParams<T>,
    options?: ApiOperationOptions
  ): Promise<BulkOperationResult<T>>;
  bulkDelete?(
    params: BulkDeleteParams,
    options?: ApiOperationOptions
  ): Promise<BulkOperationResult<boolean>>;

  // Search and filtering
  search?(params: SearchParams, options?: ApiOperationOptions): Promise<T[]>;
  query?(builder: QueryBuilder, options?: ApiOperationOptions): Promise<PaginatedResult<T>>;

  // Export/Import
  export?(params: ExportParams, options?: ApiOperationOptions): Promise<Blob>;
  import?(params: ImportParams, options?: ApiOperationOptions): Promise<ImportResult>;

  // Aggregation
  aggregate?(params: AggregationParams, options?: ApiOperationOptions): Promise<AggregationResult>;
}

// Bulk operation result
export interface BulkOperationResult<T> {
  successful: T[];
  failed: Array<{
    item: any;
    error: string;
    index: number;
  }>;
  totalProcessed: number;
  successCount: number;
  failureCount: number;
  processingTime: number;
}

// Import result
export interface ImportResult {
  totalRows: number;
  successfulRows: number;
  failedRows: number;
  errors: Array<{
    row: number;
    error: string;
    data: any;
  }>;
  warnings: Array<{
    row: number;
    warning: string;
    data: any;
  }>;
}

// Aggregation result
export interface AggregationResult {
  groups: Array<{
    groupValues: Record<string, any>;
    aggregates: Record<string, any>;
    count: number;
  }>;
  totalGroups: number;
  overallAggregates?: Record<string, any>;
}

// Validation result
export interface ValidationResult {
  isValid: boolean;
  errors: Array<{
    field: string;
    message: string;
    code: string;
  }>;
  warnings: Array<{
    field: string;
    message: string;
    code: string;
  }>;
}
