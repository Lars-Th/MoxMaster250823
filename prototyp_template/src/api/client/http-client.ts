import type {
  ApiConfig,
  ApiError,
  ApiRequestOptions,
  ApiResponse,
  HttpMethod,
  QueryParams,
} from '@/types';

export class HttpClient {
  private config: ApiConfig;

  constructor(config: Partial<ApiConfig> = {}) {
    this.config = {
      baseURL: config.baseURL ?? '/api',
      timeout: config.timeout ?? 30000,
      retries: config.retries ?? 3,
      headers: {
        'Content-Type': 'application/json',
        ...config.headers,
      },
    };
  }

  private buildUrl(endpoint: string, params?: QueryParams): string {
    const url = new URL(endpoint, this.config.baseURL);

    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          url.searchParams.append(key, String(value));
        }
      });
    }

    return url.toString();
  }

  private async executeRequest<T>(
    url: string,
    method: HttpMethod,
    options: ApiRequestOptions & { body?: unknown } = {}
  ): Promise<ApiResponse<T>> {
    const {
      signal,
      timeout = this.config.timeout,
      retries = this.config.retries,
      headers = {},
      body,
    } = options;

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    const requestHeaders = {
      ...this.config.headers,
      ...headers,
    };

    const requestOptions: RequestInit = {
      method,
      headers: requestHeaders,
      signal: signal ?? controller.signal,
    };

    if (body && method !== 'GET') {
      requestOptions.body = JSON.stringify(body);
    }

    let lastError: Error | null = null;

    for (let attempt = 0; attempt <= (retries ?? 0); attempt++) {
      try {
        const response = await fetch(url, requestOptions);
        clearTimeout(timeoutId);

        if (!response.ok) {
          const errorData = await this.parseErrorResponse(response);
          throw new Error(`HTTP ${response.status}: ${errorData.message ?? response.statusText}`);
        }

        const data = await this.parseSuccessResponse<T>(response);

        return {
          data,
          success: true,
          message: 'Request successful',
        };
      } catch (error) {
        lastError = error instanceof Error ? error : new Error('Unknown error');

        // Don't retry on client errors (4xx) or abort errors
        if (
          error instanceof Error &&
          (error.message.includes('HTTP 4') || error.name === 'AbortError')
        ) {
          break;
        }

        // Wait before retrying (exponential backoff)
        if (attempt < (retries ?? 0)) {
          await this.delay(Math.pow(2, attempt) * 1000);
        }
      }
    }

    clearTimeout(timeoutId);

    const apiError: ApiError = {
      message: lastError?.message ?? 'Request failed',
      code: this.getErrorCode(lastError),
      details: this.convertErrorToDetails(lastError),
    };

    return {
      data: null as unknown as T,
      success: false,
      error: apiError,
    };
  }

  private async parseSuccessResponse<T>(response: Response): Promise<T> {
    const contentType = response.headers.get('content-type');

    if (contentType?.includes('application/json')) {
      return response.json() as T;
    }

    if (response.status === 204) {
      return null as unknown as T;
    }

    return response.text() as unknown as T;
  }

  private async parseErrorResponse(response: Response): Promise<{ message?: string }> {
    try {
      const contentType = response.headers.get('content-type');
      if (contentType?.includes('application/json')) {
        return (await response.json()) as { message?: string };
      }
      return { message: await response.text() };
    } catch {
      return { message: response.statusText };
    }
  }

  private getErrorCode(error: Error | null): string {
    if (!error) return 'UNKNOWN_ERROR';

    if (error.name === 'AbortError') return 'REQUEST_TIMEOUT';
    if (error.message.includes('HTTP 400')) return 'BAD_REQUEST';
    if (error.message.includes('HTTP 401')) return 'UNAUTHORIZED';
    if (error.message.includes('HTTP 403')) return 'FORBIDDEN';
    if (error.message.includes('HTTP 404')) return 'NOT_FOUND';
    if (error.message.includes('HTTP 409')) return 'CONFLICT';
    if (error.message.includes('HTTP 422')) return 'VALIDATION_ERROR';
    if (error.message.includes('HTTP 5')) return 'SERVER_ERROR';

    return 'NETWORK_ERROR';
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  private convertErrorToDetails(error: Error | null): Record<string, unknown> | null {
    if (!error) return null;
    return {
      name: error.name,
      message: error.message,
      stack: error.stack,
    };
  }

  // Public HTTP methods
  async get<T>(
    endpoint: string,
    params?: QueryParams,
    options?: ApiRequestOptions
  ): Promise<ApiResponse<T>> {
    const url = this.buildUrl(endpoint, params);
    return this.executeRequest<T>(url, 'GET', options);
  }

  async post<T>(
    endpoint: string,
    data?: unknown,
    options?: ApiRequestOptions
  ): Promise<ApiResponse<T>> {
    const url = this.buildUrl(endpoint);
    return this.executeRequest<T>(url, 'POST', { ...options, body: data });
  }

  async put<T>(
    endpoint: string,
    data?: unknown,
    options?: ApiRequestOptions
  ): Promise<ApiResponse<T>> {
    const url = this.buildUrl(endpoint);
    return this.executeRequest<T>(url, 'PUT', { ...options, body: data });
  }

  async patch<T>(
    endpoint: string,
    data?: unknown,
    options?: ApiRequestOptions
  ): Promise<ApiResponse<T>> {
    const url = this.buildUrl(endpoint);
    return this.executeRequest<T>(url, 'PATCH', { ...options, body: data });
  }

  async delete<T>(endpoint: string, options?: ApiRequestOptions): Promise<ApiResponse<T>> {
    const url = this.buildUrl(endpoint);
    return this.executeRequest<T>(url, 'DELETE', options);
  }

  // Configuration methods
  setBaseURL(baseURL: string): void {
    this.config.baseURL = baseURL;
  }

  setHeader(key: string, value: string): void {
    this.config.headers[key] = value;
  }

  removeHeader(key: string): void {
    delete this.config.headers[key];
  }

  setTimeout(timeout: number): void {
    this.config.timeout = timeout;
  }
}
