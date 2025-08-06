<script setup lang="ts">
import { onMounted, onUnmounted, ref, watch } from 'vue';
import { AlertTriangle, CheckCircle, HelpCircle, Info, X, XCircle } from 'lucide-vue-next';
import type { Toast as ToastType } from '@/types/index';

interface Props {
  toast: ToastType;
  paused?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  paused: false,
});

const emit = defineEmits<{
  close: [id: string];
  mouseenter: [];
  mouseleave: [];
  click: [];
}>();

// Progress bar for duration
const progress = ref(100);
const progressInterval = ref<ReturnType<typeof setInterval> | undefined>();

// Toast type to classes mapping
const getToastClasses = (toast: ToastType): string => {
  const baseClasses =
    'pointer-events-auto rounded-lg border p-4 shadow-lg backdrop-blur-sm transition-all duration-300 transform-gpu will-change-transform';

  const typeClasses = {
    success:
      'border-green-200 bg-green-50 text-green-800 dark:border-green-800 dark:bg-green-900 dark:text-green-200',
    error:
      'border-red-200 bg-red-50 text-red-800 dark:border-red-800 dark:bg-red-900 dark:text-red-200',
    warning:
      'border-yellow-200 bg-yellow-50 text-yellow-800 dark:border-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
    info: 'border-blue-200 bg-blue-50 text-blue-800 dark:border-blue-800 dark:bg-blue-900 dark:text-blue-200',
    confirm:
      'border-purple-200 bg-purple-50 text-purple-800 dark:border-purple-800 dark:bg-purple-900 dark:text-purple-200',
  };

  return `${baseClasses} ${typeClasses[toast.type ?? 'info']}`;
};

// Icon classes
const getIconClasses = (toast: ToastType): string => {
  const iconClasses = {
    success: 'bg-green-100 text-green-600 dark:bg-green-800 dark:text-green-200',
    error: 'bg-red-100 text-red-600 dark:bg-red-800 dark:text-red-200',
    warning: 'bg-yellow-100 text-yellow-600 dark:bg-yellow-800 dark:text-yellow-200',
    info: 'bg-blue-100 text-blue-600 dark:bg-blue-800 dark:text-blue-200',
    confirm: 'bg-purple-100 text-purple-600 dark:bg-purple-800 dark:text-purple-200',
  };

  return iconClasses[toast.type ?? 'info'];
};

// Get the appropriate Lucide icon component for toast type
const getToastIcon = (toast: ToastType) => {
  const iconMap = {
    success: CheckCircle,
    error: XCircle,
    warning: AlertTriangle,
    info: Info,
    confirm: HelpCircle,
  };
  return iconMap[toast.type ?? 'info'];
};

// Action button classes
const getActionClasses = (style?: string, toastType?: string): string => {
  const baseClasses =
    'text-xs font-medium px-3 py-1.5 rounded border transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2';

  const styleClasses: { [key: string]: string } = {
    primary: (() => {
      // Different primary colors based on toast type
      switch (toastType) {
        case 'success':
          return 'bg-green-600 text-white border-green-600 hover:bg-green-700 focus:ring-green-500';
        case 'error':
          return 'bg-red-600 text-white border-red-600 hover:bg-red-700 focus:ring-red-500';
        case 'warning':
          return 'bg-yellow-600 text-white border-yellow-600 hover:bg-yellow-700 focus:ring-yellow-500';
        case 'info':
          return 'bg-blue-600 text-white border-blue-600 hover:bg-blue-700 focus:ring-blue-500';
        case 'confirm':
          return 'bg-purple-600 text-white border-purple-600 hover:bg-purple-700 focus:ring-purple-500';
        default:
          return 'bg-gray-600 text-white border-gray-600 hover:bg-gray-700 focus:ring-gray-500';
      }
    })(),
    secondary: (() => {
      // Different secondary colors based on toast type
      switch (toastType) {
        case 'success':
          return 'border-green-300 text-green-700 hover:bg-green-50 focus:ring-green-500';
        case 'error':
          return 'border-red-300 text-red-700 hover:bg-red-50 focus:ring-red-500';
        case 'warning':
          return 'border-yellow-300 text-yellow-700 hover:bg-yellow-50 focus:ring-yellow-500';
        case 'info':
          return 'border-blue-300 text-blue-700 hover:bg-blue-50 focus:ring-blue-500';
        case 'confirm':
          return 'border-purple-300 text-purple-700 hover:bg-purple-50 focus:ring-purple-500';
        default:
          return 'border-gray-300 text-gray-700 hover:bg-gray-50 focus:ring-gray-500';
      }
    })(),
    destructive: 'bg-red-600 text-white border-red-600 hover:bg-red-700 focus:ring-red-500',
  };

  return `${baseClasses} ${styleClasses[style ?? 'secondary']}`;
};

// Handle actions
const handleAction = (action: () => void): void => {
  action();
  emit('close', props.toast.id);
};

// Handle close
const handleClose = (): void => {
  emit('close', props.toast.id);
};

// Progress bar logic
const startProgress = (): void => {
  if (!props.toast.duration || props.toast.persistent) return;

  const interval = 50; // Update every 50ms
  const totalSteps = props.toast.duration / interval;
  let currentStep = 0;

  progressInterval.value = setInterval(() => {
    if (props.paused) return;

    currentStep++;
    progress.value = Math.max(0, 100 - (currentStep / totalSteps) * 100);

    if (progress.value <= 0) {
      if (progressInterval.value) {
        clearInterval(progressInterval.value);
      }
      emit('close', props.toast.id);
    }
  }, interval);
};

// Watch for pause changes
watch(
  () => props.paused,
  isPaused => {
    if (isPaused) {
      if (progressInterval.value) {
        clearInterval(progressInterval.value);
      }
    } else if (progress.value > 0 && !props.toast.persistent) {
      startProgress();
    }
  }
);

onMounted(() => {
  if (!props.toast.persistent && props.toast.duration) {
    startProgress();
  }
});

onUnmounted(() => {
  if (progressInterval.value) {
    clearInterval(progressInterval.value);
  }
});
</script>

<template>
  <div
    :class="getToastClasses(toast)"
    role="alert"
    :aria-live="toast.type === 'error' ? 'assertive' : 'polite'"
    @mouseenter="emit('mouseenter')"
    @mouseleave="emit('mouseleave')"
    @click="emit('click')"
  >
    <!-- Progress bar -->
    <div
      v-if="toast.duration && !toast.persistent"
      class="absolute top-0 left-0 h-1 bg-current opacity-30 transition-all duration-100 ease-linear"
      :style="{ width: `${progress}%` }"
    />

    <div class="flex items-start gap-3">
      <!-- Icon -->
      <div
        class="flex-shrink-0 w-6 h-6 flex items-center justify-center rounded-full"
        :class="getIconClasses(toast)"
      >
        <Component :is="getToastIcon(toast)" :size="16" />
      </div>

      <!-- Content -->
      <div class="flex-1 min-w-0">
        <h4 v-if="toast.title" class="text-sm font-medium mb-1">
          {{ toast.title }}
        </h4>
        <p v-if="toast.description" class="text-sm opacity-90">
          {{ toast.description }}
        </p>

        <!-- Actions -->
        <div v-if="toast.actions && toast.actions.length > 0" class="flex gap-2 mt-3">
          <button
            v-for="action in toast.actions"
            :key="action.label"
            :class="getActionClasses(action.style, toast.type)"
            @click.stop="handleAction(action.action)"
          >
            {{ action.label }}
          </button>
        </div>
      </div>

      <!-- Close button -->
      <button
        v-if="toast.closable"
        class="flex-shrink-0 w-6 h-6 flex items-center justify-center rounded-full opacity-60 hover:opacity-100 transition-all duration-200 hover:bg-black hover:bg-opacity-10"
        :aria-label="`Stäng ${toast.type} meddelande`"
        @click.stop="handleClose"
      >
        <X :size="14" />
      </button>
    </div>
  </div>
</template>

<style lang="scss" scoped>
/* Ensure proper positioning for progress bar */
.relative {
  position: relative;
}

.absolute {
  position: absolute;
}
</style>
