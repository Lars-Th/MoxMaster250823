// Table and data display related types

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
export interface TableColumn<T = Record<string, unknown>> {
  key: keyof T | string;
  label: string;
  sortable?: boolean;
  filterable?: boolean;
  searchable?: boolean;
  type?: 'text' | 'number' | 'date' | 'boolean' | 'custom' | 'actions';
  width?: string;
  align?: 'left' | 'center' | 'right';
  formatter?: (value: unknown, item: T) => string;
  component?: unknown; // Vue component for custom rendering
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
  onFilter?: (filters: Record<string, unknown>) => void;
  onSearch?: (searchTerm: string) => void;
}

// Table operation options
export interface TableOperationOptions {
  // Pagination
  page?: number;
  pageSize?: number;

  // Sorting
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';

  // Filtering
  filters?: Record<string, unknown>;
  search?: string;

  // Relationship loading
  include?: string[];

  // Caching
  useCache?: boolean;
  cacheKey?: string;

  // Loading states
  loadingStates?: boolean;
}
