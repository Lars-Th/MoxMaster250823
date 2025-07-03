<script setup lang="ts">
import { computed } from 'vue';
import StandardHeader from '@/components/layout/StandardHeader.vue';
import ViewControls from '@/components/shared/ViewControls.vue';
import DataTable from '@/components/shared/DataTable.vue';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-vue-next';
import type { TableColumn, UIBreadcrumbItem } from '@/types';
import { useToast } from '@/composables/useToast';
import { useApiList } from '@/composables/useApi';
import api from '@/api';

const { info } = useToast();

// Breadcrumbs
const breadcrumbs: UIBreadcrumbItem[] = [
  { label: 'Inställningar', to: '/settings' },
  { label: 'Användare', to: '/settings/users' },
  { label: 'Behörighetsgrupper', isCurrentPage: true },
];

// Fetch data using the API service
const {
  data: permissionGroups,
  loading: permissionGroupsLoading,
  error: permissionGroupsError,
} = useApiList(() => api.permissionGroups.getAll(), {
  cacheKey: 'permissionGroups',
});

// Column configuration - only showing name
const columns: TableColumn<Record<string, unknown>>[] = [
  {
    key: 'name',
    label: 'Gruppnamn',
    sortable: true,
  },
];

// Action buttons - only add button
const actionButtons = [
  {
    label: 'Skapa grupp',
    icon: Plus,
    onClick: addNewGroup,
    class: 'text-xs h-8',
  },
];

// Loading and error states
const isLoading = computed(() => Boolean(permissionGroupsLoading.value));
const hasError = computed(() => permissionGroupsError.value !== null);

// Statistics
const stats = computed(() => {
  if (!permissionGroups.value) {
    return [
      { label: 'Totalt antal grupper', value: '0' },
      { label: 'Systemgrupper', value: '0' },
      { label: 'Anpassade grupper', value: '0' },
      { label: 'Totalt antal användare', value: '0' },
    ];
  }

  return [
    {
      label: 'Totalt antal grupper',
      value: permissionGroups.value.length.toString(),
    },
    {
      label: 'Systemgrupper',
      value: '1', // Administratör is system group
    },
    {
      label: 'Anpassade grupper',
      value: (permissionGroups.value.length - 1).toString(),
    },
    {
      label: 'Totalt antal användare',
      value: '6', // Based on users.json
    },
  ];
});

// Table data
const tableData = computed(() => permissionGroups.value ?? []);

// Action methods
function addNewGroup() {
  console.log('Add new permission group');
  info('Skapa grupp - funktionalitet kommer snart');
}

function viewGroupDetails(group: Record<string, unknown>) {
  console.log('View group details:', group);
  // TODO: Navigate to group details
}
</script>

<template>
  <div class="w-full">
    <StandardHeader
      title="Behörighetsgrupper"
      :breadcrumbs="breadcrumbs"
      description="Hantera användarroller och behörigheter i systemet"
      show-stats
      :stats="stats"
    />

    <!-- Loading State -->
    <div v-if="isLoading" class="flex items-center justify-center py-12">
      <div class="text-center">
        <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4" />
        <p class="text-muted-foreground">Laddar behörighetsgrupper...</p>
      </div>
    </div>

    <!-- Error State -->
    <div v-else-if="hasError" class="flex items-center justify-center py-12">
      <div class="text-center">
        <p class="text-destructive mb-2">Ett fel uppstod vid laddning av behörighetsgrupper</p>
        <Button variant="outline" @click="() => globalThis.window.location.reload()">Försök igen</Button>
      </div>
    </div>

    <!-- Data Table -->
    <DataTable
      v-else
      :data="tableData"
      :columns="columns"
      :search-fields="['name']"
      :on-row-click="viewGroupDetails"
    >
      <template #filters="{ searchQuery, updateSearchQuery }">
        <ViewControls :action-buttons="actionButtons" :show-search="false" />
      </template>
    </DataTable>
  </div>
</template>
