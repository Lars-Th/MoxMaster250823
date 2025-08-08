import type { Ref } from 'vue';
import type { Notification, NotificationOptions, Toast, ToastConfig, ToastOptions } from './ui';
// Composable return type interfaces
export interface UseApiOptions {
  immediate?: boolean;
  cache?: boolean;
  cacheKey?: string;
  onSuccess?: (data: unknown) => void;
  onError?: (error: unknown) => void;
}

export interface UseApiReturn<TData = unknown> {
  data: Ref<TData | null>;
  loading: Ref<boolean>;
  error: Ref<unknown | null>;
  execute: () => Promise<void>;
  refresh: () => Promise<void>;
  reset: () => void;
  isSuccess: Ref<boolean>;
  isError: Ref<boolean>;
}

export interface UseToastReturn {
  toasts: Ref<Toast[]>;
  addToast: (options: ToastOptions) => string;
  removeToast: (id: string) => void;
  clearToasts: () => void;
  updateToast: (id: string, options: Partial<ToastOptions>) => void;
  toast: (message: string, options?: Omit<ToastOptions, 'title'>) => void;
  success: (
    title: string,
    description?: string,
    options?: Omit<ToastOptions, 'type' | 'title' | 'description'>
  ) => string;
  error: (
    title: string,
    description?: string,
    options?: Omit<ToastOptions, 'type' | 'title' | 'description'>
  ) => string;
  warning: (
    title: string,
    description?: string,
    options?: Omit<ToastOptions, 'type' | 'title' | 'description'>
  ) => string;
  info: (
    title: string,
    description?: string,
    options?: Omit<ToastOptions, 'type' | 'title' | 'description'>
  ) => string;
  confirm: (
    title: string,
    description?: string,
    onConfirm?: () => void,
    onCancel?: () => void
  ) => string;
  promise: <T>(
    promise: Promise<T>,
    options: { loading: string; success: string; error: string }
  ) => Promise<T>;
  unsavedChanges: (onSave: () => void, onDiscard: () => void) => string;
  config: ToastConfig;
  setConfig: (newConfig: Partial<ToastConfig>) => void;
  dismiss: (id?: string) => void;
  dismissAll: () => void;
}

export interface UseNotificationsReturn {
  notifications: Ref<Notification[]>;
  addNotification: (notification: NotificationOptions) => string;
  removeNotification: (id: string) => void;
  clearNotifications: () => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
}
