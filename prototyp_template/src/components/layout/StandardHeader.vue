<script setup lang="ts">
import { useRouter } from 'vue-router';
import { ChevronRight } from 'lucide-vue-next';

import type { Stat, UIBreadcrumbItem } from '@/types';

interface Props {
  title: string;
  breadcrumbs?: UIBreadcrumbItem[];
  stats?: Stat[];
  showBackButton?: boolean;
  showStats?: boolean;
}

withDefaults(defineProps<Props>(), {
  breadcrumbs: () => [],
  stats: () => [],
  showBackButton: false,
});

const router = useRouter();

const navigateTo = (breadcrumb: UIBreadcrumbItem) => {
  if (breadcrumb.to && !breadcrumb.isCurrentPage) {
    if (typeof breadcrumb.to === 'string') {
      router.push(breadcrumb.to);
    } else {
      router.push(breadcrumb.to as Record<string, unknown>);
    }
  }
};
</script>

<template>
  <div class="bg-background mx-4 my-3">
    <div class="flex flex-col gap-3">
      <!-- Title and breadcrumbs (integrated from TitleBreadcrumbs) -->
      <div class="flex flex-col lg:flex-row lg:items-center lg:justify-between">
        <div class="flex-1">
          <h1 class="text-3xl font-semibold text-foreground">
            {{ title }}
          </h1>

          <!-- Functional breadcrumbs -->
          <nav
            class="flex items-center space-x-1 text-xs text-muted-foreground"
            aria-label="Breadcrumb"
          >
            <template v-for="(breadcrumb, index) in breadcrumbs ?? []" :key="index">
              <!-- Breadcrumb item -->
              <button
                v-if="breadcrumb.to && !breadcrumb.isCurrentPage"
                class="hover:text-foreground transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-opacity-50 rounded"
                @click="navigateTo(breadcrumb)"
              >
                {{ breadcrumb.label }}
              </button>
              <span
                v-else
                :class="{
                  'text-foreground font-medium': breadcrumb.isCurrentPage,
                  'text-muted-foreground': !breadcrumb.isCurrentPage,
                }"
              >
                {{ breadcrumb.label }}
              </span>

              <!-- Separator -->
              <ChevronRight
                v-if="index < (breadcrumbs ?? []).length - 1"
                class="h-3 w-3 text-muted-foreground"
              />
            </template>
          </nav>
        </div>
      </div>

      <!-- Analytics/Stats (integrated from TitleAnalytics) -->
      <div class="min-h-[1.5rem]">
        <div v-if="showStats && stats && stats.length > 0" class="flex gap-2 flex-wrap">
          <div v-for="stat in stats" :key="stat.label" class="flex items-center gap-2">
            <span class="text-xs text-muted-foreground">{{ stat.label }}:</span>
            <span
              class="inline-flex items-center rounded-full px-2 py-1 text-xs font-medium"
              :class="{
                'bg-primary text-primary-foreground': stat.variant === 'default' || !stat.variant,
                'bg-secondary text-secondary-foreground': stat.variant === 'secondary',
                'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300':
                  stat.color === 'text-green-600',
                'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300':
                  stat.color === 'text-orange-600',
                'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300':
                  stat.color === 'text-blue-600',
                'bg-muted text-muted-foreground': stat.variant === 'outline',
              }"
            >
              {{ stat.value }}
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
