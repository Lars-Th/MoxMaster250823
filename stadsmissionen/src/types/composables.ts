// Composable return type interfaces
export interface UseApiOptions<T = unknown> {
  immediate?: boolean;
  cache?: boolean;
  cacheKey?: string;
  onSuccess?: (data: T) => void;
  onError?: (error: any) => void;
}

export interface UseApiReturn {
  data: any;
  loading: any;
  error: any;
  execute: () => Promise<void>;
  refresh: () => Promise<void>;
  reset: () => void;
  isSuccess: any;
  isError: any;
}

export interface UseToastReturn {
  toasts: any;
  addToast: (options: any) => string;
  removeToast: (id: string) => void;
  clearToasts: () => void;
  updateToast: (id: string, options: any) => void;
  toast: (message: string, options?: any) => void;
  success: (title: string, description?: string, options?: any) => string;
  error: (title: string, description?: string, options?: any) => string;
  warning: (title: string, description?: string, options?: any) => string;
  info: (title: string, description?: string, options?: any) => string;
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
  config: any;
  setConfig: (newConfig: any) => void;
  dismiss: (id?: string) => void;
  dismissAll: () => void;
}

export interface UseNotificationsReturn {
  notifications: any;
  addNotification: (notification: any) => void;
  removeNotification: (id: string) => void;
  clearNotifications: () => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
}
