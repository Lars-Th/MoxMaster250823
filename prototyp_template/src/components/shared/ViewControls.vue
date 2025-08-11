<script setup lang="ts">
import { computed } from 'vue';
import Button from '@/components/common/Button.vue';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

import type { ActionButton, Filter, FilterOption } from '@/types';

interface Props {
  // Action buttons (left side) - support both old and new prop names
  actionButtons?: ActionButton[];
  addActions?: ActionButton[];

  // Search functionality
  searchQuery?: string;
  searchPlaceholder?: string;
  showSearch?: boolean;

  // View switcher - use v-model pattern
  viewMode?: 'list' | 'grid';
  showViewSwitcher?: boolean;

  // Filter system - support both old individual filters and new filters array
  filters?: Filter[];

  // Legacy filter props (for backward compatibility)
  statusFilter?: string;
  filterOptions?: FilterOption[];
  secondaryFilter?: string;
  secondaryFilterOptions?: FilterOption[];
  secondaryFilterLabel?: string;

  // Additional actions (right side)
  additionalActions?: ActionButton[];
}

const props = withDefaults(defineProps<Props>(), {
  actionButtons: () => [],
  addActions: () => [],
  additionalActions: () => [],
  filters: () => [],
  filterOptions: () => [],
  secondaryFilterOptions: () => [],
  searchQuery: '',
  searchPlaceholder: 'Sök...',
  showSearch: true,
  viewMode: 'list',
  showViewSwitcher: true,
  statusFilter: '',
  secondaryFilter: '',
  secondaryFilterLabel: 'Filter',
});

const emit = defineEmits<{
  'update:searchQuery': [value: string];
  'update:search-query': [value: string];
  'update:statusFilter': [value: string];
  'update:secondaryFilter': [value: string];
  'update:viewMode': [value: 'list' | 'grid'];
}>();

// Computed property to get the correct action buttons (support both prop names)
const leftActionButtons = computed(() => {
  return props.addActions.length > 0 ? props.addActions : props.actionButtons;
});

const updateSearchQuery = (value: string | number) => {
  const stringValue = `${value}`;
  emit('update:searchQuery', stringValue);
  emit('update:search-query', stringValue);
};

const updateStatusFilter = (value: unknown) => {
  const stringValue = String(value ?? '');
  emit('update:statusFilter', stringValue);
};

const updateSecondaryFilter = (value: unknown) => {
  const stringValue = String(value ?? '');
  emit('update:secondaryFilter', stringValue);
};

// Helper function to handle filter changes
const handleFilterChange = (filter: Filter) => {
  return (value: unknown) => {
    const stringValue = String(value ?? '');
    filter.onChange(stringValue);
  };
};
</script>

<template>
  <div class="mx-4 mb-2">
    <!-- Top Row: Action Buttons (left) and Additional Actions (right) -->
    <div class="flex items-center justify-between">
      <!-- Action Buttons (left side) -->
      <div class="flex items-center gap-2">
        <Button
          v-for="button in leftActionButtons"
          :key="button.label"
          :variant="button.variant ?? 'primary'"
          :class="['gap-2 text-xs font-semibold', button.class]"
          @click="button.onClick"
        >
          <component :is="button.icon" v-if="button.icon" class="h-4 w-4" />
          {{ button.label }}
        </Button>
      </div>

      <!-- Additional Actions (right side) -->
      <div class="flex items-center gap-2">
        <Button
          v-for="button in additionalActions"
          :key="button.label"
          :variant="button.variant ?? 'secondary'"
          :class="['gap-2 text-xs font-semibold', button.class]"
          @click="button.onClick"
        >
          <component :is="button.icon" v-if="button.icon" class="h-4 w-4" />
          {{ button.label }}
        </Button>
      </div>
    </div>

    <!-- Bottom Row: Search (left), View Switcher (center), and Filters (right) -->
    <div class="flex items-center justify-between gap-2 mt-2">
      <!-- Search Input (left side) -->
      <div class="flex items-center gap-2">
        <Input
          v-if="showSearch"
          :model-value="searchQuery"
          :placeholder="searchPlaceholder"
          class="w-64 h-8 text-xs"
          @update:model-value="updateSearchQuery"
        />
      </div>

      <!-- View Switcher and Filters (right side) -->
      <div class="flex items-center gap-2">
        <!-- Filters -->
        <!-- New filters array system -->
        <template v-if="filters.length > 0">
          <Select
            v-for="(filter, index) in filters"
            :key="index"
            :model-value="filter.modelValue"
            @update:model-value="handleFilterChange(filter)"
          >
            <SelectTrigger class="w-[160px] h-8 text-xs">
              <SelectValue :placeholder="filter.placeholder" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem v-for="option in filter.options" :key="option.key" :value="option.value">
                {{ option.label }}
              </SelectItem>
            </SelectContent>
          </Select>
        </template>

        <!-- Legacy filter system (for backward compatibility) -->
        <template v-else>
          <!-- Primary Filter (Status) -->
          <Select
            v-if="filterOptions.length > 0"
            :model-value="statusFilter"
            @update:model-value="updateStatusFilter"
          >
            <SelectTrigger class="w-[160px] h-8 text-xs">
              <SelectValue placeholder="Filtrera status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem v-for="option in filterOptions" :key="option.value" :value="option.value">
                {{ option.label }}
              </SelectItem>
            </SelectContent>
          </Select>

          <!-- Secondary Filter (e.g., Permission Groups) -->
          <Select
            v-if="secondaryFilterOptions.length > 0"
            :model-value="secondaryFilter"
            @update:model-value="updateSecondaryFilter"
          >
            <SelectTrigger class="w-[180px] h-8 text-xs">
              <SelectValue :placeholder="`Filtrera ${secondaryFilterLabel.toLowerCase()}`" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem
                v-for="option in secondaryFilterOptions"
                :key="option.value"
                :value="option.value"
              >
                {{ option.label }}
              </SelectItem>
            </SelectContent>
          </Select>
        </template>
      </div>
    </div>
  </div>
</template>
