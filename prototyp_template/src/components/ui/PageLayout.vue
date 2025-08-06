<script setup lang="ts">
import NotificationContainer from '@/components/ui/NotificationContainer.vue';

interface Props {
  title: string;
  breadcrumbs: string;
  description?: string;
  showStats?: boolean;
  stats?: Array<{
    value: string | number;
    label: string;
    color?: string;
    variant?: 'default' | 'secondary' | 'destructive' | 'outline';
  }>;
}

defineProps<Props>();
</script>

<template>
  <div class="w-full">
    <!-- Header med titel och breadcrumbs -->
    <div class="bg-background px-6 py-4">
      <div class="flex flex-col gap-4">
        <!-- Titel och breadcrumbs -->
        <div class="flex flex-col lg:flex-row lg:items-center lg:justify-between">
          <div class="flex-1">
            <h1 class="text-3xl font-semibold text-foreground mb-1">
              {{ title }}
            </h1>
            <p class="text-xs text-muted-foreground">
              {{ breadcrumbs }}
            </p>

            <!-- Små badges för statistik -->
            <div v-if="showStats && stats" class="flex gap-3 mt-3 flex-wrap">
              <div v-for="stat in stats" :key="stat.label" class="flex items-center gap-2">
                <span class="text-xs text-muted-foreground">{{ stat.label }}:</span>
                <span
                  class="inline-flex items-center rounded-full px-2 py-1 text-xs font-medium"
                  :class="{
                    'bg-primary text-primary-foreground':
                      stat.variant === 'default' || !stat.variant,
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

        <!-- Åtgärder och filter på samma linje -->
        <div class="flex items-center justify-between h-10">
          <!-- Åtgärdsknappar till vänster -->
          <div class="flex items-center gap-2">
            <slot name="actions" />
          </div>

          <!-- Sök och filter till höger -->
          <div class="flex items-center gap-2">
            <slot name="filters" />
          </div>
        </div>
      </div>
    </div>

    <!-- Notifikationer -->
    <NotificationContainer />

    <!-- Huvudinnehåll -->
    <div>
      <slot />
    </div>
  </div>
</template>
