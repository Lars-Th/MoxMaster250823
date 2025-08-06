import type { HttpClient } from '../client/http-client';
import type { ApiResponse, QueryParams, RequestParams } from '@/types';

export abstract class BaseService<T> {
  protected httpClient: HttpClient;
  protected endpoint: string;

  constructor(httpClient: HttpClient, endpoint: string) {
    this.httpClient = httpClient;
    this.endpoint = endpoint;
  }

  async getAll(params?: RequestParams): Promise<ApiResponse<T[]>> {
    // Convert RequestParams to QueryParams for the HTTP client
    const queryParams: QueryParams = params
      ? {
          page: params.page,
          pageSize: params.pageSize,
          sort: params.sort,
          order: params.order,
          search: params.search,
          // Flatten filters into query params
          ...(params.filters ?? {}),
        }
      : {};

    return this.httpClient.get<T[]>(this.endpoint, queryParams);
  }

  async getById(id: string): Promise<ApiResponse<T | null>> {
    return this.httpClient.get<T | null>(`${this.endpoint}/${id}`);
  }

  async create(data: Partial<T>): Promise<ApiResponse<T>> {
    return this.httpClient.post<T>(this.endpoint, data);
  }

  async update(id: string, data: Partial<T>): Promise<ApiResponse<T>> {
    return this.httpClient.put<T>(`${this.endpoint}/${id}`, data);
  }

  async delete(id: string): Promise<ApiResponse<boolean>> {
    return this.httpClient.delete<boolean>(`${this.endpoint}/${id}`);
  }

  // Helper method for custom endpoints
  protected async get<TResult>(
    endpoint: string,
    params?: QueryParams,
    options?: any
  ): Promise<ApiResponse<TResult>> {
    return this.httpClient.get<TResult>(endpoint, params, options);
  }

  protected async post<TResult>(
    endpoint: string,
    data?: unknown,
    options?: any
  ): Promise<ApiResponse<TResult>> {
    return this.httpClient.post<TResult>(endpoint, data, options);
  }

  protected async put<TResult>(endpoint: string, data?: unknown): Promise<ApiResponse<TResult>> {
    return this.httpClient.put<TResult>(endpoint, data);
  }

  protected async patch<TResult>(endpoint: string, data?: unknown): Promise<ApiResponse<TResult>> {
    return this.httpClient.patch<TResult>(endpoint, data);
  }

  protected async deleteEndpoint<TResult>(endpoint: string): Promise<ApiResponse<TResult>> {
    return this.httpClient.delete<TResult>(endpoint);
  }
}
