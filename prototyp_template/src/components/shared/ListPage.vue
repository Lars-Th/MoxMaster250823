<script setup lang="ts">
import { computed } from 'vue';
import StandardHeader from '@/components/layout/StandardHeader.vue';
import ViewControls from '@/components/shared/ViewControls.vue';
import DataTable from '@/components/shared/DataTable.vue';
import PaginationControls from '@/components/shared/PaginationControls.vue';
import { Button } from '@/components/ui/button';

import type { ActionButton, Filter } from '@/types';

interface Props {
  // Header props
  title: string;
  description?: string;
  breadcrumbs?: any[];
  showStats?: boolean;
  stats?: any[];

  // ViewControls props
  searchQuery?: string;
  searchPlaceholder?: string;
  addActions?: ActionButton[];
  additionalActions?: ActionButton[];
  filters?: Filter[];
  showViewSwitcher?: boolean;
  viewMode?: 'list' | 'grid';

  // DataTable props
  data: any[];
  columns: any[];
  searchFields?: string[];
  loading?: boolean;

  // Pagination props
  totalItems: number;
  currentPage: number;
  itemsPerPage: number;

  // Error handling
  hasError?: boolean;
  errorMessage?: string;
}

const props = withDefaults(defineProps<Props>(), {
  description: '',
  breadcrumbs: () => [],
  showStats: false,
  stats: () => [],
  searchQuery: '',
  searchPlaceholder: 'Sök...',
  addActions: () => [],
  additionalActions: () => [],
  filters: () => [],
  showViewSwitcher: false,
  viewMode: 'list',
  searchFields: () => [],
  loading: false,
  hasError: false,
  errorMessage: 'Ett fel uppstod vid laddning av data',
});

const emit = defineEmits<{
  'update:searchQuery': [value: string];
  'update:viewMode': [value: 'list' | 'grid'];
  'update:currentPage': [page: number];
  'update:itemsPerPage': [itemsPerPage: number];
  'row-click': [row: any];
  refresh: [];
}>();

// Computed for loading state display
const isLoadingState = computed(() => props.loading);
</script>

<template>
  <div>
    <!-- Header with title, breadcrumbs, and stats -->
    <StandardHeader
      :title="title"
      :description="description"
      :breadcrumbs="breadcrumbs"
      :show-stats="showStats"
      :stats="stats"
    />

    <!-- View Controls with search, filters, and actions -->
    <ViewControls
      v-if="!isLoadingState"
      :model-value="searchQuery"
      :search-placeholder="searchPlaceholder"
      :add-actions="addActions"
      :additional-actions="additionalActions"
      :filters="filters"
      :show-view-switcher="showViewSwitcher"
      :view-mode="viewMode"
      @update:search-query="emit('update:searchQuery', $event)"
      @update:view-mode="emit('update:viewMode', $event)"
    />

    <!-- Loading State -->
    <div v-if="isLoadingState" class="flex items-center justify-center py-12">
      <div class="text-center">
        <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4" />
        <p class="text-muted-foreground">Laddar data...</p>
      </div>
    </div>

    <!-- Error State -->
    <div v-else-if="hasError" class="flex items-center justify-center py-12">
      <div class="text-center">
        <p class="text-destructive mb-2">{{ errorMessage }}</p>
        <Button variant="outline" @click="emit('refresh')">Försök igen</Button>
      </div>
    </div>

    <!-- Main Content -->
    <div v-else>
      <!-- DataTable -->
      <DataTable
        :data="data"
        :columns="columns"
        :search-fields="searchFields"
        :loading="loading"
        @row-click="emit('row-click', $event)"
      >
        <!-- Pass through all slots -->
        <template v-for="(_, name) in $slots" :key="name" #[name]="slotData">
          <slot :name="name" v-bind="slotData" />
        </template>
      </DataTable>

      <!-- Pagination Controls -->
      <PaginationControls
        :total-items="totalItems"
        :current-page="currentPage"
        :items-per-page="itemsPerPage"
        @update:current-page="emit('update:currentPage', $event)"
        @update:items-per-page="emit('update:itemsPerPage', $event)"
      />
    </div>
  </div>
</template>
