// Vue-specific imports for types
import type { Component, VNode } from 'vue';

// UI Component interfaces

export interface UIBreadcrumbItem {
  label: string;
  href?: string;
  to?: string | { name: string; params?: Record<string, unknown> };
  icon?: string | Component;
  isCurrentPage?: boolean;
}

export interface TableColumn<T = Record<string, unknown>> {
  key: keyof T | string;
  label: string;
  sortable?: boolean;
  width?: string;
  align?: 'left' | 'center' | 'right';
  type?: 'text' | 'badge' | 'actions' | 'custom';
  class?: string;
  render?: (value: unknown, row: T) => string | VNode;
  format?: (value: unknown) => string;
  badgeVariant?: (value: unknown) => string;
}

export interface UINavigationItem {
  label: string;
  path?: string;
  icon?: string | Component;
  children?: UINavigationItem[];
  badge?: string | number;
  external?: boolean;
}

export interface LoadingState {
  isLoading: boolean;
  error?: string | null;
  data?: unknown;
}

export interface UIFilterOption {
  key?: string;
  label: string;
  value?: string | number | boolean | Date;
  options?: Array<{ value: string | number | boolean; label: string }>;
  isSimple?: boolean;
}

// Toast and Notification types
export type ToastType = 'success' | 'error' | 'warning' | 'info' | 'confirm';
export type ToastVariant = 'default' | 'destructive' | 'success' | 'warning';
export type ToastPosition =
  | 'top-right'
  | 'top-left'
  | 'bottom-right'
  | 'bottom-left'
  | 'top-center'
  | 'bottom-center';

export interface ToastAction {
  label: string;
  action: () => void;
  style?: 'primary' | 'secondary' | 'destructive';
  variant?: 'default' | 'outline' | 'ghost';
}

export interface Toast {
  id: string;
  title: string;
  description?: string;
  message?: string;
  variant?: ToastVariant;
  type?: ToastType;
  timestamp: number;
  read: boolean;
  duration?: number;
  persistent?: boolean;
  actions?: ToastAction[];
  position?: ToastPosition;
  icon?: string;
  closable?: boolean;
}

export interface ToastOptions {
  title: string;
  message?: string;
  description?: string;
  type?: ToastType;
  variant?: ToastVariant;
  duration?: number;
  persistent?: boolean;
  actions?: ToastAction[];
  position?: ToastPosition;
  icon?: string;
  closable?: boolean;
}

export interface ToastConfig {
  position?: ToastPosition;
  duration?: number;
  maxToasts?: number;
  pauseOnHover?: boolean;
  closeOnClick?: boolean;
  showProgressBar?: boolean;
  newestOnTop?: boolean;
  preventDuplicates?: boolean;
  icons?: {
    success?: string;
    error?: string;
    warning?: string;
    info?: string;
    confirm?: string;
  };
}

export interface Notification extends Toast {
  confirm?: boolean;
  onConfirm?: () => void;
  onCancel?: () => void;
  confirmText?: string;
  cancelText?: string;
  confirmVariant?: 'default' | 'destructive' | 'secondary' | 'outline';
}

export interface NotificationOptions {
  title: string;
  message?: string;
  description?: string;
  type?: 'success' | 'error' | 'warning' | 'info' | 'confirm';
  duration?: number;
  persistent?: boolean;
  actions?: NotificationAction[];
}

export interface NotificationAction {
  label: string;
  action: () => void;
  style?: 'primary' | 'secondary' | 'destructive';
}
