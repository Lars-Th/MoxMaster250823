import { ref } from 'vue';
import type { Toast, ToastOptions, UseNotificationsReturn } from '@/types';

// Global state for notifications
const notifications = ref<Toast[]>([]);
let notificationId = 0;

const generateId = (): string => {
  return `notification-${++notificationId}-${Date.now()}`;
};

const addNotification = (options: ToastOptions): string => {
  const newNotification: Toast = {
    ...options,
    id: generateId(),
    timestamp: Date.now(),
    read: false,
    actions: options.actions ?? [],
    variant: options.variant ?? 'default',
    type: options.type ?? 'info',
    duration: options.duration ?? (options.type === 'error' ? 8000 : 5000),
    persistent: options.persistent ?? false,
  };

  notifications.value.push(newNotification);

  // Auto remove after duration (except for confirm type and persistent notifications)
  if (newNotification.type !== 'confirm' && !newNotification.persistent) {
    setTimeout(() => {
      removeNotification(newNotification.id);
    }, newNotification.duration);
  }

  return newNotification.id;
};

const removeNotification = (id: string): void => {
  const index = notifications.value.findIndex(n => n.id === id);
  if (index > -1) {
    notifications.value.splice(index, 1);
  }
};

const clearNotifications = (): void => {
  notifications.value = [];
};

const markAsRead = (id: string): void => {
  const notification = notifications.value.find(n => n.id === id);
  if (notification) {
    notification.read = true;
  }
};

const markAllAsRead = (): void => {
  notifications.value.forEach(n => (n.read = true));
};

export const useNotifications = (): UseNotificationsReturn => {
  return {
    notifications,
    addNotification,
    removeNotification,
    clearNotifications,
    markAsRead,
    markAllAsRead,
  };
};

// Export types for convenience
export type { Toast, ToastOptions, UseNotificationsReturn } from '@/types';
