<script setup lang="ts">
import { computed, ref } from 'vue';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

import { ArrowUpDown, ChevronDown, ChevronUp, Edit, Trash2 } from 'lucide-vue-next';
import type { TableColumn } from '@/types/ui';

interface Props {
  data: Record<string, unknown>[];
  columns: TableColumn[];
  itemsPerPage?: number;
  searchFields?: string[];
  filterField?: string;
  filterOptions?: { value: string; label: string }[];
  onRowClick?: (item: Record<string, unknown>) => void;
  onSendEmail?: (item: Record<string, unknown>, event: Event) => void;
  onDelete?: (item: Record<string, unknown>, event: Event) => void;
  onView?: (item: Record<string, unknown>, event: Event) => void;
  onEdit?: (item: Record<string, unknown>, event: Event) => void;
  deleteConfirmMessage?: string;
  loading?: boolean;
  showActions?: boolean;
  showSearch?: boolean;
  showPagination?: boolean;
  idField?: string; // Allow customization of the ID field
}

const props = withDefaults(defineProps<Props>(), {
  itemsPerPage: 25,
  searchFields: () => [],
  filterField: '',
  filterOptions: () => [],
  deleteConfirmMessage: 'Är du säker på att du vill radera detta objekt',
  loading: false,
  showActions: true,
  showSearch: true,
  showPagination: true,
  idField: 'id',
});

const emit = defineEmits<{
  rowClick: [item: Record<string, unknown>];
  delete: [item: Record<string, unknown>, event: Event];
  edit: [item: Record<string, unknown>];
  view: [item: Record<string, unknown>];
}>();

// Sök och filter
const searchQuery = ref('');
const statusFilter = ref('all');

// Sortering
const sortField = ref('');
const sortDirection = ref<'asc' | 'desc'>('asc');

// Function to get responsive classes for columns
const getResponsiveClasses = (column: TableColumn, index: number) => {
  // Use custom class if provided
  if (column.class) {
    return column.class;
  }

  // Always show name/company columns and actions
  if (
    column.key === 'name' ||
    column.key === 'companyName' ||
    column.key === 'company' ||
    column.type === 'actions' ||
    column.key === 'actions'
  ) {
    return '';
  }

  // Always show first non-name column (usually the first filter/category)
  const nameColumnExists = props.columns.some(
    col => col.key === 'name' || col.key === 'companyName' || col.key === 'company'
  );
  const firstDataColumnIndex = nameColumnExists ? 1 : 0;

  if (index === firstDataColumnIndex && column.key !== 'actions') {
    return '';
  }

  // Hide other columns on smaller screens
  // sm: >= 640px, md: >= 768px, lg: >= 1024px, xl: >= 1280px
  if (index <= 2) {
    return 'hidden sm:table-cell'; // Show from small screens up
  } else if (index <= 4) {
    return 'hidden md:table-cell'; // Show from medium screens up
  } else {
    return 'hidden lg:table-cell'; // Show from large screens up
  }
};

// Filtrerad och sorterad lista - now returns all data since pagination is handled externally
const filteredData = computed(() => {
  const filtered = props.data.filter((item: Record<string, unknown>) => {
    // Search functionality
    const matchesSearch =
      props.searchFields.length === 0 ||
      props.searchFields.some(field => {
        const value = field.includes('.')
          ? field.split('.').reduce((obj: any, key: string) => obj?.[key], item)
          : item[field];
        return value && String(value).toLowerCase().includes(searchQuery.value.toLowerCase());
      });

    // Filter functionality
    const matchesFilter =
      !statusFilter.value ||
      statusFilter.value === 'all' ||
      item[props.filterField] === statusFilter.value;

    return matchesSearch && matchesFilter;
  });

  // Sortering
  if (sortField.value) {
    filtered.sort((a: Record<string, unknown>, b: Record<string, unknown>) => {
      const aValue = a[sortField.value];
      const bValue = b[sortField.value];

      if (aValue === bValue) return 0;
      if (aValue === null || aValue === undefined) return 1;
      if (bValue === null || bValue === undefined) return -1;

      const comparison = aValue < bValue ? -1 : 1;
      return sortDirection.value === 'asc' ? comparison : -comparison;
    });
  }

  return filtered;
});

const sortBy = (field: string) => {
  if (sortField.value === field) {
    sortDirection.value = sortDirection.value === 'asc' ? 'desc' : 'asc';
  } else {
    sortField.value = field;
    sortDirection.value = 'asc';
  }
};

const getSortIcon = (field: string) => {
  if (sortField.value !== field) return ArrowUpDown;
  return sortDirection.value === 'asc' ? ChevronUp : ChevronDown;
};

const handleRowClick = (item: Record<string, unknown>) => {
  if (props.onRowClick) {
    props.onRowClick(item);
  }
  emit('rowClick', item);
};

const handleDelete = (item: Record<string, unknown>, event: Event) => {
  event.stopPropagation();
  if (confirm(props.deleteConfirmMessage)) {
    if (props.onDelete) {
      props.onDelete(item, event);
    }
    emit('delete', item, event);
  }
};

const getCellValue = (item: Record<string, unknown>, column: TableColumn) => {
  const value = item[String(column.key)];

  // Apply formatting if provided
  if (column.format && value !== null && value !== undefined) {
    return column.format(value);
  }

  // Apply custom render function if provided
  if (column.render) {
    return column.render(value, item);
  }

  return value;
};

const getBadgeVariant = (
  value: unknown,
  column: TableColumn
): 'default' | 'secondary' | 'outline' | 'destructive' => {
  if (column.badgeVariant) {
    const variant = column.badgeVariant(value);
    // Ensure the variant is one of the allowed types
    if (['default', 'secondary', 'outline', 'destructive'].includes(variant)) {
      return variant as 'default' | 'secondary' | 'outline' | 'destructive';
    }
  }
  return 'default';
};

// Generate a unique key for each row
const getRowKey = (item: Record<string, unknown>, index: number): string => {
  // Try to use the configured ID field first
  if (item[props.idField]) {
    return String(item[props.idField]);
  }

  // Fallback to common ID fields
  const commonIdFields = ['id', 'uuid', '_id', 'key'];
  for (const field of commonIdFields) {
    if (item[field]) {
      return String(item[field]);
    }
  }

  // If no ID field is found, use the index
  return String(index);
};

// Expose search and filter for parent components
defineExpose({
  searchQuery,
  statusFilter,
  filteredData,
});
</script>

<template>
  <div>
    <!-- Search and Filter Bar -->
    <slot
      name="filters"
      :search-query="searchQuery"
      :status-filter="statusFilter"
      :filter-options="filterOptions"
      :update-search-query="(value: string) => (searchQuery = value)"
      :update-status-filter="(value: string) => (statusFilter = value)"
    >
      <!-- Default filter implementation can be added here if needed -->
    </slot>

    <!-- Table - full width without padding -->
    <div class="w-full overflow-x-auto">
      <Table class="w-full">
        <TableHeader class="bg-gray-100">
          <TableRow class="border-t border-gray-300 border-b">
            <TableHead
              v-for="(column, index) in columns"
              :key="column.key"
              :class="[
                'bg-gray-100 text-xs first:pl-6 last:pr-6',
                column.sortable ? 'cursor-pointer' : '',
                column.align === 'right' ? 'text-right' : '',
                column.align === 'center' ? 'text-center' : '',
                getResponsiveClasses(column, index),
              ]"
              :style="column.width ? { width: column.width } : {}"
              @click="column.sortable ? sortBy(String(column.key)) : null"
            >
              <div
                v-if="column.sortable"
                class="flex items-center gap-2"
                :class="
                  column.align === 'right'
                    ? 'justify-end'
                    : column.align === 'center'
                      ? 'justify-center'
                      : ''
                "
              >
                {{ column.label }}
                <component :is="getSortIcon(String(column.key))" class="h-3 w-3" />
              </div>
              <span v-else>{{ column.label }}</span>
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow
            v-for="(item, index) in filteredData"
            :key="getRowKey(item, index)"
            class="hover:bg-muted/30 cursor-pointer"
            @click="handleRowClick(item)"
          >
            <TableCell
              v-for="(column, colIndex) in columns"
              :key="column.key"
              :class="[
                'text-xs first:pl-6 last:pr-4 text-left',
                column.key === 'company' || column.key === 'name' || column.key === 'companyName'
                  ? 'font-bold'
                  : '',
                column.align === 'right' ? 'text-right' : '',
                column.align === 'center' ? 'text-center' : '',
                getResponsiveClasses(column, colIndex),
              ]"
            >
              <!-- Badge type -->
              <Badge
                v-if="column.type === 'badge'"
                :variant="getBadgeVariant(getCellValue(item, column), column)"
                class="text-xs"
              >
                {{ getCellValue(item, column) }}
              </Badge>

              <!-- Custom type with slot -->
              <slot
                v-else-if="column.type === 'custom'"
                :name="`cell-${String(column.key)}`"
                :value="getCellValue(item, column)"
                :row="item"
              >
                {{ getCellValue(item, column) }}
              </slot>

              <!-- Actions type -->
              <div
                v-else-if="column.type === 'actions'"
                class="flex items-center gap-0.5 justify-end"
                :class="
                  column.align === 'right'
                    ? 'justify-end'
                    : column.align === 'center'
                      ? 'justify-center'
                      : ''
                "
              >
                <!-- Custom actions slot -->
                <slot name="row-actions" :row="item">
                  <!-- Default actions - always show edit and delete -->
                  <Button
                    variant="ghost"
                    size="sm"
                    class="h-6 w-6 p-0 text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                    title="Redigera"
                    @click="emit('edit', item)"
                  >
                    <Edit class="h-3.5 w-3.5" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    class="h-6 w-6 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
                    title="Radera"
                    @click="handleDelete(item, $event)"
                  >
                    <Trash2 class="h-3.5 w-3.5" />
                  </Button>
                </slot>
              </div>

              <!-- Regular text -->
              <span v-else>{{ getCellValue(item, column) }}</span>
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>
  </div>
</template>
