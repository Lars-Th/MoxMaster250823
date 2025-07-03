<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from 'vue';
import { useToast } from '@/composables/useToast';
import Toast from './Toast.vue';
import type { ToastPosition, Toast as ToastType } from '@/types/index';

const { toasts, removeToast, config } = useToast();

// Position classes mapping
const getPositionClasses = (position: ToastPosition): string => {
  const positions = {
    'top-right': 'top-4 right-4',
    'top-left': 'top-4 left-4',
    'bottom-right': 'bottom-4 right-4',
    'bottom-left': 'bottom-4 left-4',
    'top-center': 'top-4 left-1/2 transform -translate-x-1/2',
    'bottom-center': 'bottom-4 left-1/2 transform -translate-x-1/2',
  };
  return positions[position] ?? positions['top-right'];
};

// Group toasts by position
const toastsByPosition = computed(() => {
  const groups: { [K in ToastPosition]: ToastType[] } = {
    'top-right': [],
    'top-left': [],
    'bottom-right': [],
    'bottom-left': [],
    'top-center': [],
    'bottom-center': [],
  };

  toasts.value.forEach((toast: ToastType) => {
    const position = toast.position ?? config.position ?? 'top-right';
    (groups as any)[position].push(toast);
  });

  return groups;
});

// Pause timers on hover if enabled
const pausedToasts = ref<Set<string>>(new Set());

const handleMouseEnter = (toastId: string) => {
  if (config.pauseOnHover) {
    pausedToasts.value.add(toastId);
  }
};

const handleMouseLeave = (toastId: string) => {
  if (config.pauseOnHover) {
    pausedToasts.value.delete(toastId);
  }
};

// Handle click to close if enabled
const handleToastClick = (toast: ToastType) => {
  if (config.closeOnClick && toast.closable) {
    removeToast(toast.id);
  }
};

// Keyboard navigation
const handleKeydown = (event: KeyboardEvent) => {
  if (event.key === 'Escape') {
    // Close the newest toast
    if (toasts.value.length > 0) {
      const newestToast = config.newestOnTop
        ? toasts.value[0]
        : toasts.value[toasts.value.length - 1];
      if (newestToast?.closable) {
        removeToast(newestToast.id);
      }
    }
  }
};

onMounted(() => {
  document.addEventListener('keydown', handleKeydown);
});

onUnmounted(() => {
  document.removeEventListener('keydown', handleKeydown);
});
</script>

<template>
  <Teleport to="body">
    <!-- Render toast groups for each position -->
    <div
      v-for="(positionToasts, position) in toastsByPosition"
      v-show="positionToasts.length > 0"
      :key="position"
      :class="[
        'fixed z-[1080] flex flex-col gap-3 pointer-events-none max-w-sm w-full',
        getPositionClasses(position as ToastPosition),
      ]"
      role="region"
      :aria-label="`Notifications - ${position}`"
    >
      <TransitionGroup
        name="toast"
        tag="div"
        class="flex flex-col gap-3"
        :class="{
          'flex-col-reverse': position.includes('bottom'),
        }"
      >
        <Toast
          v-for="toast in positionToasts"
          :key="toast.id"
          :toast="toast"
          :paused="pausedToasts.has(toast.id)"
          @close="removeToast"
          @mouseenter="handleMouseEnter(toast.id)"
          @mouseleave="handleMouseLeave(toast.id)"
          @click="handleToastClick(toast)"
        />
      </TransitionGroup>
    </div>
  </Teleport>
</template>

<style lang="scss" scoped>
/* Toast animations */
.toast-enter-active,
.toast-leave-active {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.toast-enter-from {
  opacity: 0;
  transform: translateX(100%) scale(0.95);
}

.toast-leave-to {
  opacity: 0;
  transform: translateX(100%) scale(0.95);
}

.toast-move {
  transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

/* Position-specific animations */
.fixed.left-4 .toast-enter-from,
.fixed.left-4 .toast-leave-to {
  transform: translateX(-100%) scale(0.95);
}

.fixed.bottom-4 .toast-enter-from,
.fixed.bottom-4 .toast-leave-to {
  transform: translateY(100%) scale(0.95);
}

.fixed.top-4.left-1\/2 .toast-enter-from,
.fixed.top-4.left-1\/2 .toast-leave-to,
.fixed.bottom-4.left-1\/2 .toast-enter-from,
.fixed.bottom-4.left-1\/2 .toast-leave-to {
  transform: translateX(-50%) translateY(20px) scale(0.95);
}

/* Mobile responsive adjustments */
@media (max-width: 640px) {
  .fixed {
    left: 1rem !important;
    right: 1rem !important;
    max-width: none !important;
    transform: none !important;
  }

  .fixed.left-1\/2 {
    left: 1rem !important;
    transform: none !important;
  }
}
</style>
