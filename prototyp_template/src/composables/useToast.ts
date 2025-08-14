import { reactive, ref } from 'vue';
import type { Toast, ToastConfig, ToastOptions, UseToastReturn } from '@/types';

// Global state
const toasts = ref<Toast[]>([]);
let toastId = 0;

// Default configuration
const defaultConfig: ToastConfig = {
  position: 'top-center',
  duration: 5000,
  maxToasts: 5,
  pauseOnHover: true,
  closeOnClick: false,
  showProgressBar: false,
  newestOnTop: true,
  preventDuplicates: false,
  icons: {
    success: 'CheckCircle',
    error: 'XCircle',
    warning: 'AlertTriangle',
    info: 'Info',
    confirm: 'HelpCircle',
  },
};

const config = reactive<ToastConfig>({ ...defaultConfig });

export function useToast(): UseToastReturn {
  const generateId = (): string => {
    return `toast-${++toastId}-${Date.now()}`;
  };

  const addToast = (options: ToastOptions): string => {
    // Prevent duplicates if enabled
    if (config.preventDuplicates) {
      const duplicate = toasts.value.find(
        t =>
          t.title === options.title &&
          t.description === options.description &&
          t.type === options.type
      );
      if (duplicate) {
        return duplicate.id;
      }
    }

    const toast: Toast = {
      id: generateId(),
      title: options.title,
      description: options.description ?? '',
      variant: options.variant ?? 'default',
      type: options.type ?? 'info',
      timestamp: Date.now(),
      read: false,
      duration: options.duration ?? config.duration ?? 5000,
      persistent: options.persistent ?? false,
      actions: options.actions ?? [],
      position: options.position ?? config.position,
      icon: options.icon ?? config.icons?.[options.type ?? 'info'],
      closable: options.closable ?? true,
    };

    // Add to beginning or end based on config
    if (config.newestOnTop) {
      toasts.value.unshift(toast);
    } else {
      toasts.value.push(toast);
    }

    // Limit number of toasts
    if (config.maxToasts && toasts.value.length > config.maxToasts) {
      if (config.newestOnTop) {
        toasts.value = toasts.value.slice(0, config.maxToasts);
      } else {
        toasts.value = toasts.value.slice(-config.maxToasts);
      }
    }

    // Auto remove toast after duration (unless persistent)
    if (toast.duration && toast.duration > 0 && !toast.persistent) {
      setTimeout(() => {
        removeToast(toast.id);
      }, toast.duration);
    }

    return toast.id;
  };

  const removeToast = (id: string): void => {
    const index = toasts.value.findIndex(toast => toast.id === id);
    if (index > -1) {
      toasts.value.splice(index, 1);
    }
  };

  const clearToasts = (): void => {
    toasts.value = [];
  };

  const updateToast = (id: string, options: Partial<ToastOptions>): void => {
    const toast = toasts.value.find(t => t.id === id);
    if (toast) {
      Object.assign(toast, options);
    }
  };

  const success = (
    title: string,
    description?: string,
    options: Omit<ToastOptions, 'type' | 'title' | 'description'> = {}
  ): string => {
    return addToast({
      ...options,
      type: 'success',
      title,
      description,
      variant: 'success',
    });
  };

  const error = (
    title: string,
    description?: string,
    options: Omit<ToastOptions, 'type' | 'title' | 'description'> = {}
  ): string => {
    return addToast({
      ...options,
      type: 'error',
      title,
      description,
      variant: 'destructive',
      duration: options.duration ?? 8000, // Längre duration för fel
    });
  };

  const warning = (
    title: string,
    description?: string,
    options: Omit<ToastOptions, 'type' | 'title' | 'description'> = {}
  ): string => {
    return addToast({
      ...options,
      type: 'warning',
      title,
      description,
      variant: 'warning',
    });
  };

  const info = (
    title: string,
    description?: string,
    options: Omit<ToastOptions, 'type' | 'title' | 'description'> = {}
  ): string => {
    return addToast({
      ...options,
      type: 'info',
      title,
      description,
    });
  };

  const confirm = (
    title: string,
    description?: string,
    onConfirm?: () => void,
    onCancel?: () => void
  ): string => {
    return addToast({
      type: 'confirm',
      title,
      description,
      persistent: true,
      actions: [
        {
          label: 'Bekräfta',
          action: onConfirm ?? (() => {}),
          style: 'primary',
        },
        {
          label: 'Avbryt',
          action: onCancel ?? (() => {}),
          style: 'secondary',
        },
      ],
    });
  };

  const promise = async <T>(
    promise: Promise<T>,
    options: { loading: string; success: string; error: string }
  ): Promise<T> => {
    const loadingId = addToast({
      type: 'info',
      title: options.loading,
      persistent: true,
      closable: false,
    });

    try {
      const result = await promise;
      removeToast(loadingId);
      success(options.success);
      return result;
    } catch (err) {
      removeToast(loadingId);
      error(options.error, err instanceof Error ? err.message : 'Ett fel uppstod');
      throw err;
    }
  };

  const unsavedChanges = (onSave: () => void, onDiscard: () => void): string => {
    return addToast({
      type: 'warning',
      title: 'Osparade ändringar',
      description: 'Du har ändringar som inte har sparats.',
      persistent: true,
      actions: [
        {
          label: 'Spara',
          action: onSave,
          style: 'primary',
        },
        {
          label: 'Ignorera',
          action: onDiscard,
          style: 'secondary',
        },
      ],
    });
  };

  const setConfig = (newConfig: Partial<ToastConfig>): void => {
    Object.assign(config, newConfig);
  };

  // Generic toast method
  const toast = (message: string, options: Omit<ToastOptions, 'title'> = {}): void => {
    addToast({
      ...options,
      title: message,
    });
  };

  // Alias methods for better API consistency
  const dismiss = (id?: string): void => {
    if (id) {
      removeToast(id);
    }
  };

  const dismissAll = (): void => {
    clearToasts();
  };

  return {
    toasts,
    addToast,
    removeToast,
    clearToasts,
    updateToast,
    toast,
    success,
    error,
    warning,
    info,
    confirm,
    promise,
    unsavedChanges,
    config,
    setConfig,
    dismiss,
    dismissAll,
  };
}
