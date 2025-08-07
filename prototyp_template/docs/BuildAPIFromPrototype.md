# Dual API Architecture Migration Guide

## Overview

This guide provides step-by-step instructions for migrating from JSON
import-based prototyping to a proper Dual API architecture that supports both
Mock and Real API implementations. This architecture enables seamless
development workflow where UX designers can work with JSON data while developers
integrate with real APIs.

## Current Architecture Analysis

### TaskDetail API Structure

The current implementation demonstrates a mature dual API pattern with:

1. **Service Layer Architecture**: All entities have dedicated service classes
   (`TaskService`, `CarService`, etc.)
2. **Type System**: Comprehensive type definitions with relationship support
3. **Mock Data Service**: Centralized mock implementation with JSON data sources
4. **API Abstraction**: Clean interface that switches between mock and real APIs
5. **Composable Integration**: Vue composables for reactive API state management

### Key Components

- **Base Service**: `BaseService<T>` provides CRUD operations
- **Relationship Types**: `TaskWithRelations`, `CarWithRelations` for complex
  data structures
- **Mock Data Service**: Handles JSON data with relationship resolution
- **API Index**: Unified interface switching between mock and real
  implementations

## Migration Steps

### Step 1: Establish Project Structure

Create the necessary directory structure:

```
src/
├── api/
│   ├── client/           # HTTP client configuration
│   ├── config/           # API configuration
│   ├── mocks/            # Mock data services
│   ├── services/         # Real API services
│   └── index.ts          # Unified API interface
├── assets/
│   └── data/             # JSON data files (for prototyping)
├── types/
│   ├── entities.ts       # Base entity interfaces
│   ├── relationships.ts  # Related entity interfaces
│   ├── api-parameters.ts # API request parameters
│   ├── api.ts           # API-specific types
│   └── enhanced.ts       # Enhanced type definitions
└── composables/
    └── useApi.ts         # API interaction composables
```

### Step 2: Define Base Entity Types

Create comprehensive type definitions for your entities:

#### `src/types/entities.ts`

```typescript
// Base entity interface
export interface BaseEntity {
  CreatedDate: string;
  UpdatedDate: string;
}

// Example: Task entity
export interface Task extends BaseEntity {
  TaskID: number;
  TaskNumber: string;
  CarID: number;
  Status: 'active' | 'completed' | 'pending' | 'cancelled';
  Priority: 'low' | 'medium' | 'high' | 'urgent';
  Type: 'police_tow' | 'accident_tow' | 'private_tow' | 'abandoned_tow';
  TowingReason: string;
  TowingDate: string;
  TowingLocation: string;
  TowingOfficerName: string;
  TowingOfficerBadge: string | null;
  CompletedDate: string | null;
  ReleasedDate: string | null;
  TowDurationHours: number | null;
  TotalCost: number;
  PaidAmount: number;
  PaymentStatus: 'pending' | 'paid' | 'overdue' | 'hold';
  PaymentDate: string | null;
  PaymentMethod: 'cash' | 'card' | 'invoice' | 'transfer' | null;
  ReleaseAuthorizedBy: string | null;
  Notes: string;
}

// Related entities
export interface Car extends BaseEntity {
  CarID: number;
  LicensePlate: string;
  Brand: string;
  Model: string;
  Year: number;
  Color: string;
  VIN: string;
  OwnerName: string;
  OwnerPhone: string;
  OwnerEmail: string;
}

export interface TowingStation extends BaseEntity {
  TowingStationID: number;
  Name: string;
  Address: string;
  Capacity: number;
  CurrentOccupancy: number;
  PricePerHour: number;
  IsActive: boolean;
  ContactPhone: string;
  ContactEmail: string;
}

// Junction table for many-to-many relationships
export interface TaskTowingStationJunction {
  JunctionID: number;
  TaskID: number;
  TowingStationID: number;
  StorageStartDate: string;
  StorageEndDate: string | null;
  StorageType: 'outdoor' | 'covered' | 'secure';
  StorageLocation: string;
  PricePerHour: number;
  TotalStorageCost: number;
  Status: 'active' | 'completed' | 'transferred';
  Notes: string;
}
```

### Step 3: Define Relationship Types

Create relationship interfaces for complex data structures:

#### `src/types/relationships.ts`

```typescript
import type {
  Task,
  Car,
  TowingStation,
  TaskTowingStationJunction,
} from './entities';

// Extended interfaces with relationships
export interface TaskWithRelations extends Task {
  // Resolved relationships - always optional
  car?: CarWithRelations;
  towingStations?: TowingStationWithRelations[];

  // Computed fields from relationships
  carDetails?: string; // Car brand, model, license plate
  totalStorageCost?: number; // Sum of all storage costs
  storageStatus?: 'stored' | 'released' | 'transferred';
}

export interface CarWithRelations extends Car {
  tasks?: TaskWithRelations[];

  // Computed fields
  totalTasks?: number;
  activeTasks?: number;
  totalCost?: number;
  lastTaskDate?: string;
}

export interface TowingStationWithRelations extends TowingStation {
  tasks?: TaskWithRelations[];
  junction?: TaskTowingStationJunction; // For junction data

  // Computed fields
  totalTasks?: number;
  activeTasks?: number;
  occupancyRate?: number;
  totalRevenue?: number;
}

// Relationship loading options
export interface RelationshipLoadOptions {
  car?: boolean;
  towingStations?: boolean;
  all?: boolean; // Load all available relationships
}
```

### Step 4: Create API Parameter Types

Define standardized parameters for API calls:

#### `src/types/api-parameters.ts`

```typescript
// Base API request parameters
export interface ApiRequestParams {
  page?: number;
  pageSize?: number;
  search?: string;
  sort?: string;
  order?: 'asc' | 'desc';
  filters?: Record<string, any>;
}

// Entity-specific parameters
export interface TaskApiParams extends ApiRequestParams {
  status?: Task['Status'];
  priority?: Task['Priority'];
  type?: Task['Type'];
  dateRange?: {
    start: string;
    end: string;
  };
  carId?: number;
  towingStationId?: number;
}

// Relational parameters for loading relationships
export interface RelationalParams {
  include?: string[]; // Array of relationship names to include
}
```

### Step 5: Create JSON Data Structure

For prototyping, create JSON files that match your entity structure:

#### `src/assets/data/tasks.json`

```json
[
  {
    "TaskID": 1,
    "TaskNumber": "T001-2024",
    "CarID": 1,
    "Status": "completed",
    "Priority": "high",
    "Type": "police_tow",
    "TowingReason": "Parkering på förbjuden plats",
    "TowingDate": "2024-03-01T14:30:00Z",
    "TowingLocation": "Drottninggatan 45, Stockholm",
    "TowingOfficerName": "Polis Anders Svensson",
    "TowingOfficerBadge": "P12345",
    "CompletedDate": "2024-03-01T16:45:00Z",
    "ReleasedDate": "2024-03-02T10:15:00Z",
    "TowDurationHours": 19.75,
    "TotalCost": 1243.75,
    "PaidAmount": 1243.75,
    "PaymentStatus": "paid",
    "PaymentDate": "2024-03-02T10:15:00Z",
    "PaymentMethod": "card",
    "ReleaseAuthorizedBy": "Bil ägare med ID",
    "CreatedDate": "2024-03-01T14:30:00Z",
    "UpdatedDate": "2024-03-02T10:15:00Z",
    "Notes": "Snabb release, inga problem"
  }
]
```

#### `src/assets/data/cars.json`

```json
[
  {
    "CarID": 1,
    "LicensePlate": "ABC123",
    "Brand": "Volvo",
    "Model": "V70",
    "Year": 2018,
    "Color": "Blå",
    "VIN": "YV1SW61R982234567",
    "OwnerName": "Erik Eriksson",
    "OwnerPhone": "070-1234567",
    "OwnerEmail": "erik@example.com",
    "CreatedDate": "2024-01-01T00:00:00Z",
    "UpdatedDate": "2024-01-01T00:00:00Z"
  }
]
```

### Step 6: Implement Base Service Class

Create a generic base service that handles common CRUD operations:

#### `src/api/services/base.service.ts`

```typescript
import type { ApiResponse } from '@/types';
import type { HttpClient } from '../client/http-client';

export abstract class BaseService<T> {
  protected httpClient: HttpClient;
  protected endpoint: string;

  constructor(httpClient: HttpClient, endpoint: string) {
    this.httpClient = httpClient;
    this.endpoint = endpoint;
  }

  async getAll(params?: Record<string, any>): Promise<ApiResponse<T[]>> {
    return this.httpClient.get<T[]>(this.endpoint, params);
  }

  async getById(id: string): Promise<ApiResponse<T | null>> {
    return this.httpClient.get<T | null>(`${this.endpoint}/${id}`);
  }

  async create(data: Omit<T, keyof BaseEntity>): Promise<ApiResponse<T>> {
    return this.httpClient.post<T>(this.endpoint, data);
  }

  async update(id: string, data: Partial<T>): Promise<ApiResponse<T>> {
    return this.httpClient.put<T>(`${this.endpoint}/${id}`, data);
  }

  async delete(id: string): Promise<ApiResponse<boolean>> {
    return this.httpClient.delete<boolean>(`${this.endpoint}/${id}`);
  }
}
```

### Step 7: Implement Entity-Specific Service

Create specialized services extending the base service:

#### `src/api/services/task.service.ts`

```typescript
import type { Task, TaskWithRelations } from '@/types';
import type { TaskApiParams } from '@/types/api-parameters';
import type { RelationalParams } from '@/types/enhanced';
import type { ApiResponse } from '@/types';
import type { HttpClient } from '../client/http-client';
import { BaseService } from './base.service';

export class TaskService extends BaseService<Task> {
  constructor(httpClient: HttpClient) {
    super(httpClient, '/tasks');
  }

  async getAll(
    params?: TaskApiParams & RelationalParams
  ): Promise<ApiResponse<Task[] | TaskWithRelations[]>> {
    const queryParams: Record<string, any> = {};

    // Handle relationships
    if (params?.include && params.include.length > 0) {
      queryParams['include'] = params.include.join(',');
    }

    // Handle filtering
    if (params?.status) queryParams['status'] = params.status;
    if (params?.priority) queryParams['priority'] = params.priority;
    if (params?.type) queryParams['type'] = params.type;
    if (params?.carId) queryParams['carId'] = params.carId;

    // Handle date range
    if (params?.dateRange) {
      queryParams['dateStart'] = params.dateRange.start;
      queryParams['dateEnd'] = params.dateRange.end;
    }

    return this.httpClient.get<Task[] | TaskWithRelations[]>(
      this.endpoint,
      queryParams
    );
  }

  async getById(
    id: string,
    params?: RelationalParams
  ): Promise<ApiResponse<Task | TaskWithRelations | null>> {
    const queryParams: Record<string, any> = {};

    if (params?.include && params.include.length > 0) {
      queryParams['include'] = params.include.join(',');
    }

    return this.httpClient.get<Task | TaskWithRelations | null>(
      `${this.endpoint}/${id}`,
      queryParams
    );
  }

  // Task-specific methods
  async completeTask(
    id: string,
    completionData: {
      CompletedDate: string;
      TotalCost: number;
      Notes?: string;
    }
  ): Promise<ApiResponse<Task>> {
    return this.httpClient.patch<Task>(
      `${this.endpoint}/${id}/complete`,
      completionData
    );
  }

  async releaseTask(
    id: string,
    releaseData: {
      ReleasedDate: string;
      ReleaseAuthorizedBy: string;
      TowDurationHours: number;
      Notes?: string;
    }
  ): Promise<ApiResponse<Task>> {
    return this.httpClient.patch<Task>(
      `${this.endpoint}/${id}/release`,
      releaseData
    );
  }

  async getByStatus(
    status: Task['Status'],
    params?: RelationalParams
  ): Promise<ApiResponse<Task[]>> {
    return this.getAll({ ...params, status });
  }
}
```

### Step 8: Implement Mock Data Service

Create a comprehensive mock service that handles JSON data with relationship
resolution:

#### `src/api/mocks/mock-data.service.ts`

```typescript
import type { ApiResponse, Task, Car, TowingStation } from '@/types';
import type { TaskWithRelations, RelationalParams } from '@/types';

// Import JSON data
import tasksData from '@/assets/data/tasks.json';
import carsData from '@/assets/data/cars.json';
import towingStationsData from '@/assets/data/towingstations.json';
import taskTowingStationJunctionData from '@/assets/data/taskTowingStationJunction.json';

export class MockDataService {
  private delay = 300; // Simulate network delay

  private async simulateNetworkDelay(): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, this.delay));
  }

  private async mockRequest<T>(data: T): Promise<ApiResponse<T>> {
    await this.simulateNetworkDelay();

    // Simulate occasional network errors (0.5% chance)
    if (Math.random() < 0.005) {
      return {
        data: null as T,
        success: false,
        error: {
          message: 'Simulated network error',
          code: 'NETWORK_ERROR',
        },
      };
    }

    return {
      data,
      success: true,
      message: 'Request successful',
    };
  }

  // Task methods with relationship support
  async getTasks(
    params?: any
  ): Promise<ApiResponse<Task[] | TaskWithRelations[]>> {
    let tasks = [...(tasksData as Task[])];

    // Apply filtering
    if (params?.status) {
      tasks = tasks.filter(task => task.Status === params.status);
    }
    if (params?.priority) {
      tasks = tasks.filter(task => task.Priority === params.priority);
    }
    if (params?.carId) {
      tasks = tasks.filter(task => task.CarID === params.carId);
    }

    // Handle relationships
    if (params?.include && params.include.length > 0) {
      const enhancedTasks = tasks.map(task => {
        const enhanced = { ...task } as TaskWithRelations;

        if (params.include.includes('car')) {
          const car = (carsData as Car[]).find(c => c.CarID === task.CarID);
          enhanced.car = car;
        }

        if (params.include.includes('towingStations')) {
          const junctions = taskTowingStationJunctionData.filter(
            j => j.TaskID === task.TaskID
          );
          const stations = junctions
            .map(junction => {
              const station = (towingStationsData as TowingStation[]).find(
                s => s.TowingStationID === junction.TowingStationID
              );
              return station ? { ...station, junction } : null;
            })
            .filter(Boolean);
          enhanced.towingStations = stations;
        }

        return enhanced;
      });

      return this.mockRequest(enhancedTasks);
    }

    return this.mockRequest(tasks);
  }

  async getTask(
    id: string,
    params?: RelationalParams
  ): Promise<ApiResponse<Task | TaskWithRelations | null>> {
    const task = (tasksData as Task[]).find(t => t.TaskID === parseInt(id));
    if (!task) {
      return this.mockRequest(null);
    }

    // Handle relationships
    if (params?.include && params.include.length > 0) {
      const enhanced = { ...task } as TaskWithRelations;

      if (params.include.includes('car')) {
        const car = (carsData as Car[]).find(c => c.CarID === task.CarID);
        enhanced.car = car;
      }

      if (params.include.includes('towingStations')) {
        const junctions = taskTowingStationJunctionData.filter(
          j => j.TaskID === task.TaskID
        );
        const stations = junctions
          .map(junction => {
            const station = (towingStationsData as TowingStation[]).find(
              s => s.TowingStationID === junction.TowingStationID
            );
            return station ? { ...station, junction } : null;
          })
          .filter(Boolean);
        enhanced.towingStations = stations;
      }

      return this.mockRequest(enhanced);
    }

    return this.mockRequest(task);
  }

  async createTask(
    data: Omit<Task, 'TaskID' | 'CreatedDate' | 'UpdatedDate'>
  ): Promise<ApiResponse<Task>> {
    const newTask: Task = {
      ...data,
      TaskID: Math.max(...tasksData.map(t => t.TaskID)) + 1,
      CreatedDate: new Date().toISOString(),
      UpdatedDate: new Date().toISOString(),
    };

    // In a real implementation, you'd persist this
    (tasksData as Task[]).push(newTask);

    return this.mockRequest(newTask);
  }

  async updateTask(
    id: string,
    data: Partial<Task>
  ): Promise<ApiResponse<Task>> {
    const taskIndex = tasksData.findIndex(t => t.TaskID === parseInt(id));
    if (taskIndex === -1) {
      return {
        data: null as unknown as Task,
        success: false,
        error: {
          message: 'Task not found',
          code: 'NOT_FOUND',
        },
      };
    }

    const updatedTask = {
      ...tasksData[taskIndex],
      ...data,
      UpdatedDate: new Date().toISOString(),
    };

    (tasksData as any)[taskIndex] = updatedTask;

    return this.mockRequest(updatedTask);
  }

  async deleteTask(id: string): Promise<ApiResponse<boolean>> {
    const taskIndex = tasksData.findIndex(t => t.TaskID === parseInt(id));
    if (taskIndex === -1) {
      return {
        data: false,
        success: false,
        error: {
          message: 'Task not found',
          code: 'NOT_FOUND',
        },
      };
    }

    (tasksData as any).splice(taskIndex, 1);
    return this.mockRequest(true);
  }

  // Similar methods for Cars, TowingStations, etc.
  async getCars(params?: any): Promise<ApiResponse<Car[]>> {
    return this.mockRequest(carsData as Car[]);
  }

  async getCar(id: string): Promise<ApiResponse<Car | null>> {
    const car = (carsData as Car[]).find(c => c.CarID === parseInt(id));
    return this.mockRequest(car || null);
  }
}
```

### Step 9: Create Unified API Interface

Create a single interface that switches between mock and real APIs:

#### `src/api/index.ts`

```typescript
import { ApiConfiguration } from '@/api/config';
import { MockDataService } from '@/api/mocks';
import type { Task, Car, TowingStation } from '@/types';
import type { RelationalParams } from '@/types/enhanced';

// Environment-based API service selection
const USE_MOCK_API = import.meta.env?.['VITE_USE_MOCK_API'] === 'true';

// Create the main API service instance
const apiService = USE_MOCK_API
  ? new MockDataService()
  : new ApiConfiguration();

// Clean, domain-focused API interface
export const api = {
  // Tasks
  tasks: {
    getAll: (params?: any) =>
      USE_MOCK_API
        ? (apiService as MockDataService).getTasks(params)
        : (apiService as ApiConfiguration).tasks.getAll(params),

    getById: (id: string, params?: RelationalParams) =>
      USE_MOCK_API
        ? (apiService as MockDataService).getTask(id, params)
        : (apiService as ApiConfiguration).tasks.getById(id, params),

    create: (data: Omit<Task, 'TaskID' | 'CreatedDate' | 'UpdatedDate'>) =>
      USE_MOCK_API
        ? (apiService as MockDataService).createTask(data)
        : (apiService as ApiConfiguration).tasks.create(data),

    update: (id: string, data: Partial<Task>) =>
      USE_MOCK_API
        ? (apiService as MockDataService).updateTask(id, data)
        : (apiService as ApiConfiguration).tasks.update(id, data),

    delete: (id: string) =>
      USE_MOCK_API
        ? (apiService as MockDataService).deleteTask(id)
        : (apiService as ApiConfiguration).tasks.delete(id),

    // Task-specific methods
    completeTask: (id: string, data: any) =>
      USE_MOCK_API
        ? Promise.reject(new Error('CompleteTask not implemented in mock yet'))
        : (apiService as ApiConfiguration).tasks.completeTask(id, data),

    releaseTask: (id: string, data: any) =>
      USE_MOCK_API
        ? Promise.reject(new Error('ReleaseTask not implemented in mock yet'))
        : (apiService as ApiConfiguration).tasks.releaseTask(id, data),

    getByStatus: (status: string, params?: any) =>
      USE_MOCK_API
        ? (apiService as MockDataService).getTasks({ ...params, status })
        : (apiService as ApiConfiguration).tasks.getByStatus(status, params),
  },

  // Cars
  cars: {
    getAll: () =>
      USE_MOCK_API
        ? (apiService as MockDataService).getCars()
        : (apiService as ApiConfiguration).cars.getAll(),

    getById: (id: string) =>
      USE_MOCK_API
        ? (apiService as MockDataService).getCar(id)
        : (apiService as ApiConfiguration).cars.getById(id),
  },

  // Add other entities similarly...
};

// Export environment flag for conditional logic
export { USE_MOCK_API };
```

### Step 10: Create API Composables

Implement Vue composables for reactive API state management:

#### `src/composables/useApi.ts`

```typescript
import { computed, ref, shallowRef } from 'vue';
import type { ApiError, ApiResponse } from '@/types';

export function useApi<T>(
  apiCall: () => Promise<ApiResponse<T>>,
  options: {
    immediate?: boolean;
    cache?: boolean;
    cacheKey?: string;
    onSuccess?: (data: T) => void;
    onError?: (error: ApiError) => void;
  } = {}
) {
  const { immediate = false, onSuccess, onError } = options;

  const data = shallowRef<T | null>(null);
  const loading = ref(false);
  const error = ref<ApiError | null>(null);

  const isSuccess = computed(() => data.value !== null && error.value === null);
  const isError = computed(() => error.value !== null);

  const execute = async (): Promise<void> => {
    loading.value = true;
    error.value = null;

    try {
      const response = await apiCall();

      if (response.success && response.data !== null) {
        data.value = response.data;
        onSuccess?.(response.data);
      } else {
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
      };
      error.value = apiError;
      onError?.(apiError);
    } finally {
      loading.value = false;
    }
  };

  const refresh = async (): Promise<void> => {
    await execute();
  };

  const reset = (): void => {
    data.value = null;
    loading.value = false;
    error.value = null;
  };

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

// List composable for collections
export function useApiList<T>(
  apiCall: () => Promise<ApiResponse<T[]>>,
  options = {}
) {
  const api = useApi(apiCall, { immediate: true, cache: true, ...options });

  const isEmpty = computed(
    () =>
      api.isSuccess.value && (!api.data.value || api.data.value.length === 0)
  );

  return {
    ...api,
    isEmpty,
  };
}

// Mutation composable for CUD operations
export function useApiMutation<TData, TVariables = unknown>(
  apiCall: (variables: TVariables) => Promise<ApiResponse<TData>>,
  options = {}
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
        return response.data;
      } else {
        error.value = response.error ?? {
          message: 'Mutation failed',
          code: 'MUTATION_ERROR',
        };
        return null;
      }
    } catch (err) {
      const apiError: ApiError = {
        message: err instanceof Error ? err.message : 'Network error occurred',
        code: 'NETWORK_ERROR',
      };
      error.value = apiError;
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
    data,
    loading,
    error,
    mutate,
    reset,
  };
}
```

### Step 11: Implement Vue Component Integration

Update your Vue components to use the new API structure:

#### Example Component Usage

```vue
<script setup lang="ts">
  import { computed, onMounted } from 'vue';
  import { useRoute } from 'vue-router';
  import { useApi, useApiList, useApiMutation } from '@/composables/useApi';
  import { api } from '@/api';
  import type { Task } from '@/types';

  const route = useRoute();
  const taskId = route.params.id as string;
  const isNew = computed(() => taskId === 'new');

  // API-based data fetching with relationships
  const { data: taskWithRelations, execute: fetchTaskWithRelations } = useApi(
    () => api.tasks.getById(taskId, { include: ['car', 'towingStations'] })
  );

  const { data: cars, execute: fetchCars } = useApiList(() =>
    api.cars.getAll()
  );

  // API mutations for CRUD operations
  const updateTaskMutation = useApiMutation(
    (data: { id: string; updates: Partial<Task> }) =>
      api.tasks.update(data.id, data.updates)
  );

  const createTaskMutation = useApiMutation(
    (data: Omit<Task, 'TaskID' | 'CreatedDate' | 'UpdatedDate'>) =>
      api.tasks.create(data)
  );

  // Initialize data
  onMounted(async () => {
    await fetchCars();
    if (!isNew.value) {
      await fetchTaskWithRelations();
    }
  });

  // Your component logic here...
</script>
```

### Step 12: Environment Configuration

Set up environment variables to control API mode:

#### `.env.development`

```env
VITE_USE_MOCK_API=true
VITE_API_BASE_URL=http://localhost:3000/api
```

#### `.env.production`

```env
VITE_USE_MOCK_API=false
VITE_API_BASE_URL=https://api.yourapp.com
```

### Step 13: Testing Strategy

Implement tests for both mock and real API implementations:

#### `tests/api/task.service.test.ts`

```typescript
import { describe, it, expect, beforeEach } from 'vitest';
import { MockDataService } from '@/api/mocks';
import type { Task } from '@/types';

describe('TaskService', () => {
  let mockService: MockDataService;

  beforeEach(() => {
    mockService = new MockDataService();
  });

  it('should fetch all tasks', async () => {
    const response = await mockService.getTasks();

    expect(response.success).toBe(true);
    expect(Array.isArray(response.data)).toBe(true);
  });

  it('should fetch task with relationships', async () => {
    const response = await mockService.getTask('1', {
      include: ['car', 'towingStations'],
    });

    expect(response.success).toBe(true);
    expect(response.data).toHaveProperty('car');
    expect(response.data).toHaveProperty('towingStations');
  });

  it('should create new task', async () => {
    const newTask = {
      TaskNumber: 'T999-2024',
      CarID: 1,
      Status: 'active' as const,
      Priority: 'medium' as const,
      Type: 'police_tow' as const,
      TowingReason: 'Test reason',
      TowingDate: '2024-03-01T00:00:00Z',
      TowingLocation: 'Test location',
      TowingOfficerName: 'Test Officer',
      TowingOfficerBadge: 'T123',
      // ... other required fields
    };

    const response = await mockService.createTask(newTask);

    expect(response.success).toBe(true);
    expect(response.data).toHaveProperty('TaskID');
    expect(response.data?.TaskNumber).toBe('T999-2024');
  });
});
```

## Implementation Benefits

### For UX Designers

- Work directly with JSON data files
- Immediate visual feedback without backend dependencies
- Ability to prototype complex data structures
- No need for API knowledge

### For Developers

- Seamless transition from mock to real API
- Type-safe development with full TypeScript support
- Consistent interface regardless of data source
- Easy testing with controlled mock data

### For Teams

- Parallel development workflow
- Reduced dependencies between frontend and backend
- Easier debugging and development
- Consistent development experience

## Advanced Features

### 1. Relationship Loading

The architecture supports complex relationship loading:

```typescript
// Load task with all relationships
const task = await api.tasks.getById('1', {
  include: ['car', 'towingStations'],
});

// Load multiple relationships selectively
const tasks = await api.tasks.getAll({
  include: ['car'],
  status: 'active',
  priority: 'high',
});
```

### 2. Computed Fields

Relationship interfaces can include computed fields:

```typescript
interface TaskWithRelations extends Task {
  car?: CarWithRelations;
  carDetails?: string; // Computed: "${car.Brand} ${car.Model} (${car.LicensePlate})"
  totalStorageCost?: number; // Sum of all storage costs
}
```

### 3. Caching Strategy

The composables support caching for performance:

```typescript
const { data: tasks } = useApiList(() => api.tasks.getAll(), {
  cache: true,
  cacheKey: 'tasks-list',
});
```

### 4. Error Handling

Comprehensive error handling with typed errors:

```typescript
const { data, error, isError } = useApi(() => api.tasks.getById('1'));

if (isError.value) {
  console.log('Error code:', error.value?.code);
  console.log('Error message:', error.value?.message);
}
```

## Migration Checklist

- [ ] Create directory structure
- [ ] Define base entity types
- [ ] Create relationship interfaces
- [ ] Set up API parameter types
- [ ] Create JSON data files
- [ ] Implement base service class
- [ ] Create entity-specific services
- [ ] Implement mock data service
- [ ] Create unified API interface
- [ ] Implement API composables
- [ ] Update Vue components
- [ ] Configure environment variables
- [ ] Write tests
- [ ] Document API usage
- [ ] Train team on new architecture

## Maintenance Guidelines

### Adding New Entities

1. Create entity interface in `entities.ts`
2. Create relationships interface in `relationships.ts`
3. Add JSON data file
4. Implement service class
5. Add methods to mock service
6. Update unified API interface
7. Create tests

### Modifying Existing Entities

1. Update entity interface
2. Update JSON data structure
3. Modify service methods if needed
4. Update mock service implementation
5. Update tests
6. Migrate existing data

### API Method Patterns

Follow consistent patterns for API methods:

- `getAll(params)` - List with filtering/pagination
- `getById(id, params)` - Single item with relationships
- `create(data)` - Create new item
- `update(id, data)` - Update existing item
- `delete(id)` - Delete item
- `getByStatus(status, params)` - Filtered lists
- `entitySpecificMethod(id, data)` - Domain-specific operations

This architecture provides a robust foundation for scaling from prototype to
production while maintaining developer productivity and type safety throughout
the development process.
