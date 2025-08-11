# Types Organization

This directory contains all TypeScript type definitions organized by
functionality and concern.

## Structure

### Core Business Types

- **`entities.ts`** - Core business entities (User, LoginAccount,
  PermissionGroup, etc.)
- **`auth.ts`** - Authentication and authorization related types
- **`enums.ts`** - Application-wide enums and constants

### API and Data Layer

- **`api.ts`** - Core API types (responses, requests, services)
- **`api-parameters.ts`** - API parameter types and configurations
- \*\*`relationships.ts` - Relationship and association types

### UI and Components

- **`ui.ts`** - UI component types (toasts, notifications, navigation)
- **`components.ts`** - Component-specific prop interfaces
- **`navigation.ts`** - Navigation and routing types

### Data Display and Interaction

- **`table.ts`** - Table, data grid, and list view types
- **`validation.ts`** - Form validation and field types

### Dashboard and Widgets

- **`widgets.ts`** - Dashboard widget and visualization types

### Common Utilities

- **`common.ts`** - Shared utility types (audit, bulk operations, search, etc.)
- **`enhanced.ts`** - Enhanced functionality types for advanced features
- **`system.ts`** - System configuration and settings types

### Composables

- **`composables.ts`** - Types for Vue composables

## Import Guidelines

### For Components

```typescript
// Import specific types
import type { User, LoginAccount } from '@/types/entities';
import type { TableColumn, TableConfig } from '@/types/table';

// Or import from main index (for multiple types)
import type { User, TableColumn, ToastOptions } from '@/types';
```

### For Services

```typescript
import type { ApiResponse, CrudService } from '@/types/api';
import type { RequestParams, EnhancedRequestParams } from '@/types/enhanced';
```

### For Composables

```typescript
import type { UseApiOptions, UseAuthOptions } from '@/types/composables';
```

## Best Practices

1. **Single Responsibility**: Each file should focus on one domain area
2. **No Circular Dependencies**: Avoid importing from `index.ts` in type files
3. **Consistent Naming**: Use PascalCase for interfaces, camelCase for types
4. **Generic Types**: Use generics for reusable type patterns
5. **Documentation**: Add JSDoc comments for complex types

## Adding New Types

1. **Identify the domain** - Which file does this type belong to?
2. **Check for duplicates** - Ensure the type doesn't already exist
3. **Follow naming conventions** - Use consistent naming patterns
4. **Update exports** - Add to the appropriate file and export from `index.ts`
5. **Add documentation** - Include JSDoc comments for clarity

## Migration Notes

- **`enhanced.ts`** was refactored to remove table, validation, and widget types
- **`TableColumn`** moved from `ui.ts` to `table.ts` to avoid duplication
- **Common utility types** consolidated in `common.ts`
- **Widget types** moved to dedicated `widgets.ts` file
