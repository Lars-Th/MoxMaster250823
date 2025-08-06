<script setup lang="ts">
import { computed } from 'vue';

interface Props {
  size?: 'sm' | 'md' | 'lg';
  variant?: 'primary' | 'secondary' | 'muted';
  text?: string;
  fullScreen?: boolean;
  message?: string;
}

const props = withDefaults(defineProps<Props>(), {
  size: 'md',
  variant: 'primary',
  text: '',
  fullScreen: false,
  message: 'Laddar...',
});

const sizeClasses = computed(() => {
  switch (props.size) {
    case 'sm':
      return 'w-4 h-4';
    case 'lg':
      return 'w-8 h-8';
    default:
      return 'w-6 h-6';
  }
});

const colorClasses = computed(() => {
  switch (props.variant) {
    case 'secondary':
      return 'text-secondary';
    case 'muted':
      return 'text-muted-foreground';
    default:
      return 'text-primary';
  }
});
</script>

<template>
  <div
    :class="[
      'flex items-center justify-center',
      fullScreen ? 'fixed inset-0 bg-background/80 backdrop-blur-sm z-50' : '',
      text ? 'flex-col gap-2' : '',
    ]"
  >
    <div
      :class="[
        'animate-spin rounded-full border-2 border-current border-t-transparent',
        sizeClasses,
        colorClasses,
      ]"
      role="status"
      aria-label="Loading"
    />
    <p v-if="text" class="text-sm text-muted-foreground">
      {{ text }}
    </p>
  </div>
</template>
