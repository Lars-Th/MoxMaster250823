<script setup lang="ts">
import { useNotifications } from '@/composables/useNotifications';
import { AlertCircle, CheckCircle, Info, XCircle } from 'lucide-vue-next';
import { Button } from '@/components/ui/button';

const { notifications, removeNotification } = useNotifications();

type StyleType = 'success' | 'error' | 'warning' | 'info' | 'confirm';

const getStyles = (type?: string) => {
  const styles: Record<StyleType, { container: string; icon: string; text: string }> = {
    success: {
      container: 'bg-green-50 text-green-800 dark:bg-green-900/20 dark:text-green-400',
      icon: 'text-green-500 dark:text-green-400',
      text: 'text-green-800 dark:text-green-400',
    },
    error: {
      container: 'bg-red-50 text-red-800 dark:bg-red-900/20 dark:text-red-400',
      icon: 'text-red-500 dark:text-red-400',
      text: 'text-red-800 dark:text-red-400',
    },
    warning: {
      container: 'bg-yellow-50 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400',
      icon: 'text-yellow-500 dark:text-yellow-400',
      text: 'text-yellow-800 dark:text-yellow-400',
    },
    info: {
      container: 'bg-blue-50 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400',
      icon: 'text-blue-500 dark:text-blue-400',
      text: 'text-blue-800 dark:text-blue-400',
    },
    confirm: {
      container: 'bg-purple-50 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400',
      icon: 'text-purple-500 dark:text-purple-400',
      text: 'text-purple-800 dark:text-purple-400',
    },
  };
  const styleType = (type ?? 'info') as StyleType;
  return styles[styleType] ?? styles.info;
};

const getIcon = (type?: string) => {
  const icons: Record<StyleType, typeof Info> = {
    success: CheckCircle,
    error: XCircle,
    warning: AlertCircle,
    info: Info,
    confirm: Info,
  };
  const styleType = (type ?? 'info') as StyleType;
  return icons[styleType] ?? Info;
};
</script>

<template>
  <div class="notification-container">
    <TransitionGroup
      enter-active-class="transition duration-300 ease-out"
      enter-from-class="transform translate-x-full opacity-0"
      enter-to-class="transform translate-x-0 opacity-100"
      leave-active-class="transition duration-200 ease-in"
      leave-from-class="transform translate-x-0 opacity-100"
      leave-to-class="transform translate-x-full opacity-0"
    >
      <div
        v-for="notification in notifications as unknown as import('@/types').Notification[]"
        :key="notification.id"
        class="notification-item"
        :class="getStyles(notification.type).container"
      >
        <component
          :is="getIcon(notification.type)"
          class="h-5 w-5 flex-shrink-0"
          :class="getStyles(notification.type).icon"
        />
        <div class="flex-1 min-w-0">
          <p class="text-xs font-medium" :class="getStyles(notification.type).text">
            {{ notification.title }}
          </p>
          <p
            v-if="notification.description"
            class="mt-1 text-xs"
            :class="getStyles(notification.type).text"
          >
            {{ notification.description }}
          </p>
        </div>

        <!-- Confirm actions -->
        <div v-if="notification.type === 'confirm'" class="flex gap-2 ml-4">
          <Button
            size="sm"
            :variant="notification.confirmVariant ?? 'destructive'"
            class="text-xs h-7"
            @click="notification.onConfirm?.()"
          >
            {{ notification.confirmText ?? 'Bekräfta' }}
          </Button>
          <Button
            size="sm"
            variant="outline"
            class="text-xs h-7"
            @click="notification.onCancel?.()"
          >
            {{ notification.cancelText ?? 'Avbryt' }}
          </Button>
        </div>

        <!-- Action buttons -->
        <div
          v-else-if="notification.actions && notification.actions.length > 0"
          class="flex gap-2 ml-4"
        >
          <button
            v-for="action in notification.actions"
            :key="action.label"
            class="text-xs px-2 py-1 rounded"
            :class="[
              action.style === 'destructive'
                ? 'bg-red-500/10 text-red-500 hover:bg-red-500/20'
                : action.style === 'secondary'
                  ? 'bg-gray-500/10 text-gray-500 hover:bg-gray-500/20'
                  : 'bg-blue-500/10 text-blue-500 hover:bg-blue-500/20',
            ]"
            @click="action.action"
          >
            {{ action.label }}
          </button>
        </div>

        <!-- Close button -->
        <button
          v-else-if="!notification.persistent || notification.type !== 'warning'"
          class="ml-4 -mt-1 -mr-1 p-1 rounded-full hover:bg-black/5 dark:hover:bg-white/5"
          @click="removeNotification(notification.id)"
        >
          <XCircle class="h-4 w-4" />
        </button>
      </div>
    </TransitionGroup>
  </div>
</template>

<style lang="scss" scoped>
.notification-container {
  @apply fixed top-4 right-4 z-50 flex flex-col gap-2 w-full max-w-sm;
}

.notification-item {
  @apply flex items-start gap-3 p-4 rounded-lg shadow-lg border border-current/10;
}
</style>
