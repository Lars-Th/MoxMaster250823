<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-vue-next';

interface Props {
  totalItems: number;
  itemsPerPage?: number;
  currentPage?: number;
  showItemsPerPageSelector?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  itemsPerPage: 25,
  currentPage: 1,
  showItemsPerPageSelector: true,
});

const emit = defineEmits<{
  'update:currentPage': [page: number];
  'update:itemsPerPage': [itemsPerPage: number];
}>();

// Local state
const itemsPerPageState = ref(props.itemsPerPage);
const currentPageState = ref(props.currentPage);

// Watch for prop changes
watch(
  () => props.itemsPerPage,
  newValue => {
    itemsPerPageState.value = newValue;
  }
);

watch(
  () => props.currentPage,
  newValue => {
    currentPageState.value = newValue;
  }
);

// Computed values
const totalPages = computed(() => Math.ceil(props.totalItems / itemsPerPageState.value));

const startIndex = computed(() => {
  if (props.totalItems === 0) return 0;
  return (currentPageState.value - 1) * itemsPerPageState.value + 1;
});

const endIndex = computed(() => {
  const end = currentPageState.value * itemsPerPageState.value;
  return Math.min(end, props.totalItems);
});

const visiblePages = computed(() => {
  const pages = [];
  const maxVisible = 5;
  let start = Math.max(1, currentPageState.value - Math.floor(maxVisible / 2));
  const end = Math.min(totalPages.value, start + maxVisible - 1);

  if (end - start + 1 < maxVisible) {
    start = Math.max(1, end - maxVisible + 1);
  }

  for (let i = start; i <= end; i++) {
    pages.push(i);
  }

  return pages;
});

// Methods
const updateItemsPerPage = (value: any) => {
  const newItemsPerPage = parseInt(String(value));
  itemsPerPageState.value = newItemsPerPage;
  emit('update:itemsPerPage', newItemsPerPage);

  // Reset to page 1 when changing items per page
  if (currentPageState.value !== 1) {
    goToPage(1);
  }
};

const goToPage = (page: number) => {
  if (page >= 1 && page <= totalPages.value && page !== currentPageState.value) {
    currentPageState.value = page;
    emit('update:currentPage', page);
  }
};

// Watch for total pages changes and reset to page 1 if current page is out of bounds
watch([totalPages, () => currentPageState.value], ([newTotalPages, currentPageValue]) => {
  if (currentPageValue > newTotalPages && newTotalPages > 0) {
    goToPage(1);
  }
});
</script>

<template>
  <div class="flex items-center justify-between text-xs text-muted-foreground mx-6 my-2 mb-10 mt-6">
    <!-- Items per page selector -->
    <div v-if="showItemsPerPageSelector" class="flex items-center gap-2">
      <span>Visa</span>
      <Select :model-value="String(itemsPerPageState)" @update:model-value="updateItemsPerPage">
        <SelectTrigger size="sm" class="w-16 h-8 text-xs">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="10">10</SelectItem>
          <SelectItem value="25">25</SelectItem>
          <SelectItem value="50">50</SelectItem>
          <SelectItem value="100">100</SelectItem>
        </SelectContent>
      </Select>
      <span>per sida</span>
    </div>
    <div v-else></div>

    <!-- Object counter -->
    <div class="text-xs text-muted-foreground">
      Visar {{ startIndex }}-{{ endIndex }} av {{ totalItems }} objekt
    </div>

    <!-- Page navigation -->
    <div class="flex items-center gap-1">
      <Button
        variant="outline"
        size="sm"
        :disabled="currentPageState === 1"
        class="h-8 w-8 p-0 text-xs"
        @click="goToPage(1)"
      >
        <ChevronsLeft class="h-3 w-3" />
      </Button>
      <Button
        variant="outline"
        size="sm"
        :disabled="currentPageState === 1"
        class="h-8 w-8 p-0 text-xs"
        @click="goToPage(currentPageState - 1)"
      >
        <ChevronLeft class="h-3 w-3" />
      </Button>

      <div class="flex items-center gap-1">
        <Button
          v-for="page in visiblePages"
          :key="page"
          :variant="page === currentPageState ? 'default' : 'outline'"
          size="sm"
          class="h-8 w-8 p-0 text-xs"
          @click="goToPage(page)"
        >
          {{ page }}
        </Button>
      </div>

      <Button
        variant="outline"
        size="sm"
        :disabled="currentPageState === totalPages"
        class="h-8 w-8 p-0 text-xs"
        @click="goToPage(currentPageState + 1)"
      >
        <ChevronRight class="h-3 w-3" />
      </Button>
      <Button
        variant="outline"
        size="sm"
        :disabled="currentPageState === totalPages"
        class="h-8 w-8 p-0 text-xs"
        @click="goToPage(totalPages)"
      >
        <ChevronsRight class="h-3 w-3" />
      </Button>
    </div>
  </div>
</template>
