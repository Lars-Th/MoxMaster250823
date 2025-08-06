// Core API Types
export interface ApiResponse<T = unknown> {
  data: T;
  success: boolean;
  error?: ApiError;
  message?: string;
}

export interface ApiError {
  code: string;
  message: string;
  details?: Record<string, unknown> | null;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

// HTTP Client Configuration
export interface ApiConfig {
  baseURL: string;
  timeout: number;
  retries: number;
  headers: Record<string, string>;
}

export interface ApiRequestOptions {
  signal?: AbortSignal;
  timeout?: number;
  retries?: number;
  headers?: Record<string, string>;
}

// HTTP Types
export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

export type QueryParams = Record<string, string | number | boolean | undefined | null>;

export type RequestParams = {
  page?: number;
  pageSize?: number;
  sort?: string;
  order?: 'asc' | 'desc';
  search?: string;
  filters?: FilterParams;
};

export type FilterParams = Record<string, unknown>;

export type PaginationParams = {
  page: number;
  pageSize: number;
};

export type ApiResponseType<T, P extends boolean = false> = P extends true
  ? ApiResponse<PaginatedResponse<T>>
  : ApiResponse<T>;

export interface CrudService<
  T,
  TCreate = Partial<T>,
  TUpdate = Partial<T>,
  P extends boolean = false,
> {
  getAll(params?: RequestParams): Promise<ApiResponseType<T, P>>;
  getById(id: string): Promise<ApiResponse<T | null>>;
  create?(data: TCreate): Promise<ApiResponse<T>>;
  update?(id: string, data: TUpdate): Promise<ApiResponse<T>>;
  delete?(id: string): Promise<ApiResponse<boolean>>;
}
