import type { PermissionGroup, User } from './index';

// Enhanced user types with relational data
export interface DetailedPermissionGroup {
  id: number;
  name: string;
  administreraInloggningskonton: boolean;
  hanteraAnvandare: boolean;
  laddaUppOchRedigera: boolean;
  visaOchLaddaNer: boolean;
  lasaPubliceradeNyheter: boolean;
  publiceranyheter: boolean;
  administreraKategorier: boolean;
  redigeraVerksamheter: boolean;
  skapaVerksamheter: boolean;
}

export interface UserWithPermissionGroup extends User {
  permissionGroup?: DetailedPermissionGroup;
}

// API parameter types for include options
export interface RelationalParams {
  include?: string[];
}

export interface UserRelationalParams extends RelationalParams {
  include?: 'permissionGroup'[];
}

// Union types for different API responses based on include parameters

// Enhanced auth user type for authentication
export interface AuthUser {
  id: number;
  name: string;
  email: string;
  role: string;
  stadsmission?: number;
  permissionGroup?: PermissionGroup;
}

// Enhanced types for API operations and relationship loading

// Request parameters for paginated API calls
export interface RequestParams {
  page?: number;
  pageSize?: number;
  search?: string;
  sort?: string;
  order?: 'asc' | 'desc';
  filters?: Record<string, any>;
}

// Combined parameters for API calls with relationships
export interface EnhancedRequestParams extends RequestParams, RelationalParams {}

// Table operation types
export interface TableOperationOptions {
  // Pagination
  page?: number;
  pageSize?: number;

  // Sorting
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';

  // Filtering
  filters?: Record<string, any>;
  search?: string;

  // Relationship loading
  include?: string[];

  // Caching
  useCache?: boolean;
  cacheKey?: string;

  // Loading states
  loadingStates?: boolean;
}

// Generic table data structure
export interface TableData<T> {
  items: T[];
  totalCount: number;
  pageCount: number;
  currentPage: number;
  pageSize: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

// Column definition for tables
export interface TableColumn<T = any> {
  key: keyof T | string;
  label: string;
  sortable?: boolean;
  filterable?: boolean;
  searchable?: boolean;
  type?: 'text' | 'number' | 'date' | 'boolean' | 'custom' | 'actions';
  width?: string;
  align?: 'left' | 'center' | 'right';
  formatter?: (value: any, item: T) => string;
  component?: any; // Vue component for custom rendering
}

// Table configuration
export interface TableConfig<T> {
  columns: TableColumn<T>[];
  data: TableData<T>;
  loading?: boolean;
  error?: string | null;

  // Row operations
  allowSelect?: boolean;
  allowMultiSelect?: boolean;
  selectedItems?: T[];

  // CRUD operations
  allowAdd?: boolean;
  allowEdit?: boolean;
  allowDelete?: boolean;
  allowView?: boolean;

  // Callbacks
  onSelect?: (item: T) => void;
  onAdd?: () => void;
  onEdit?: (item: T) => void;
  onDelete?: (item: T) => void;
  onView?: (item: T) => void;

  // Pagination
  onPageChange?: (page: number) => void;
  onPageSizeChange?: (pageSize: number) => void;

  // Sorting
  onSort?: (column: string, order: 'asc' | 'desc') => void;

  // Filtering
  onFilter?: (filters: Record<string, any>) => void;
  onSearch?: (searchTerm: string) => void;
}

// Validation rule
export interface ValidationRule {
  type: 'required' | 'email' | 'min' | 'max' | 'minLength' | 'maxLength' | 'pattern' | 'custom';
  value?: any;
  message: string;
  validator?: (value: any, formData: any) => boolean;
}

// Entity operation types
export type EntityOperation = 'create' | 'read' | 'update' | 'delete' | 'list' | 'search';

// Entity permission check
export interface EntityPermissions {
  create?: boolean;
  read?: boolean;
  update?: boolean;
  delete?: boolean;
  list?: boolean;
  search?: boolean;
}

// Audit trail information
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

// Enhanced entity with audit and soft delete
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

// Entity with relationship loading status
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

// Bulk operation result
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
    options?: Array<{ value: any; label: string }>;
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

// Dashboard widget configuration
export interface WidgetConfig {
  id: string;
  title: string;
  type: 'chart' | 'table' | 'stat' | 'list' | 'custom';
  size: 'small' | 'medium' | 'large' | 'full';
  refreshInterval?: number; // in seconds
  dataSource: {
    entity: string;
    filters?: Record<string, any>;
    aggregation?: {
      groupBy?: string[];
      functions?: Array<{
        field: string;
        function: 'count' | 'sum' | 'avg' | 'min' | 'max';
        alias?: string;
      }>;
    };
  };
  visualization?: {
    chartType?: 'line' | 'bar' | 'pie' | 'doughnut' | 'area' | 'scatter';
    xAxis?: string;
    yAxis?: string | string[];
    colors?: string[];
    showLegend?: boolean;
    showGrid?: boolean;
  };
  permissions?: EntityPermissions;
}
