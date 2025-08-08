import { computed, ref, shallowRef } from 'vue';
import type { ApiError, ApiResponse } from '@/types';
import type { UseApiOptions, UseApiReturn } from '@/types/composables';

// Simple in-memory cache
const cache = new Map<string, { data: unknown; timestamp: number }>();
const CACHE_DURATION = 1000; // ms

function convertErrorToDetails(error: unknown): Record<string, unknown> | null {
  if (!error) return null;
  if (error instanceof Error) {
    return {
      name: error.name,
      message: error.message,
      stack: error.stack,
    };
  }
  if (typeof error === 'object' && error !== null) {
    return error as Record<string, unknown>;
  }
  return { message: String(error) };
}

export function useApi(
  apiCall: () => Promise<ApiResponse>,
  options: UseApiOptions = {}
): UseApiReturn {
  const { immediate = false, cache: useCache = false, cacheKey, onSuccess, onError } = options;

  const data = shallowRef<unknown>(null);
  const loading = ref(false);
  const error = ref<ApiError | null>(null);

  const isSuccess = computed(() => data.value !== null && error.value === null);
  const isError = computed(() => error.value !== null);

  const getCachedData = (key: string): unknown | null => {
    if (!useCache || !key) return null;

    const cached = cache.get(key);
    if (!cached) return null;

    const isExpired = Date.now() - cached.timestamp > CACHE_DURATION;
    if (isExpired) {
      cache.delete(key);
      return null;
    }

    return cached.data;
  };

  const setCachedData = (key: string, value: unknown): void => {
    if (!useCache || !key) return;

    cache.set(key, {
      data: value,
      timestamp: Date.now(),
    });
  };

  const execute = async (): Promise<void> => {
    // Check cache first
    if (useCache && cacheKey) {
      const cachedData = getCachedData(cacheKey);
      if (cachedData) {
        data.value = cachedData ?? null;
        error.value = null;
        return;
      }
    }

    loading.value = true;
    error.value = null;

    try {
      const response = await apiCall();

      if (response.success && response.data !== null && response.data !== undefined) {
        data.value = response.data;

        // Cache the data
        if (useCache && cacheKey) {
          setCachedData(cacheKey, response.data);
        }

        onSuccess?.(response.data);
      } else {
        data.value = null;
        error.value = response.error ?? {
          message: 'Unknown error occurred',
          code: 'UNKNOWN_ERROR',
        };
        onError?.(error.value);
      }
    } catch (err) {
      const apiError: ApiError = {
        message: err instanceof Error ? err.message : 'Network error occurred',
        code: 'NETWORK_ERROR',
        details: convertErrorToDetails(err),
      };
      error.value = apiError;
      onError?.(apiError);
    } finally {
      loading.value = false;
    }
  };

  const refresh = async (): Promise<void> => {
    // Clear cache for this key
    if (useCache && cacheKey) {
      cache.delete(cacheKey);
    }
    await execute();
  };

  const reset = (): void => {
    data.value = null;
    loading.value = false;
    error.value = null;
  };

  // Execute immediately if requested
  if (immediate) {
    execute();
  }

  return {
    data,
    loading,
    error,
    execute,
    refresh,
    reset,
    isSuccess,
    isError,
  };
}

// Specialized composables for common patterns
export function useApiList<T>(
  apiCall: () => Promise<ApiResponse<T[]>>,
  options: UseApiOptions = {}
) {
  const api = useApi(apiCall, { immediate: true, cache: true, ...options });

  const isEmpty = computed(() => {
    const v = api.data.value;
    if (!api.isSuccess.value || v == null) return false;
    return Array.isArray(v) && v.length === 0;
  });

  return {
    ...api,
    isEmpty,
  };
}

export function useApiItem<T>(
  apiCall: () => Promise<ApiResponse<T | null>>,
  options: UseApiOptions = {}
) {
  return useApi(apiCall, { immediate: true, cache: true, ...options });
}

// Mutation composable for create/update/delete operations
export function useApiMutation<TData, TVariables = unknown>(
  apiCall: (variables: TVariables) => Promise<ApiResponse<TData>>,
  options: UseApiOptions = {}
) {
  const loading = ref(false);
  const error = ref<ApiError | null>(null);
  const data = ref<TData | null>(null);

  const mutate = async (variables: TVariables): Promise<TData | null> => {
    loading.value = true;
    error.value = null;

    try {
      const response = await apiCall(variables);

      if (response.success && response.data !== null) {
        data.value = response.data;
        options.onSuccess?.(response.data);
        return response.data;
      } else {
        error.value = response.error ?? {
          message: 'Mutation failed',
          code: 'MUTATION_ERROR',
        };
        options.onError?.(error.value);
        return null;
      }
    } catch (err) {
      const apiError: ApiError = {
        message: err instanceof Error ? err.message : 'Network error occurred',
        code: 'NETWORK_ERROR',
        details: convertErrorToDetails(err),
      };
      error.value = apiError;
      options.onError?.(apiError);
      return null;
    } finally {
      loading.value = false;
    }
  };

  const reset = (): void => {
    data.value = null;
    loading.value = false;
    error.value = null;
  };

  return {
    mutate,
    loading,
    error,
    data,
    reset,
    isLoading: loading,
    isError: computed(() => error.value !== null),
    isSuccess: computed(() => data.value !== null && error.value === null),
  };
}
