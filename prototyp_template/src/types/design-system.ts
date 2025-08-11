// Design system types for spacing, typography, and color variables

export interface TreeNode {
  name: string;
  path: string;
  type: 'folder' | 'file';
  children?: TreeNode[];
  component?: unknown;
  props?: Record<string, unknown>;
}

export interface SpacingVariable {
  name: string;
  variable: string;
  baseValue: number; // The base mathematical relationship
  computedValue: number; // Current computed value
}

export interface TextSizeVariable {
  name: string;
  variable: string;
  baseValue: number; // The base mathematical relationship (in rem)
  computedValue: number; // Current computed value
  pixelValue: number; // Pixel equivalent for display
}

export interface ColorVariable {
  name: string;
  variable: string;
  baseValue: string; // The base color value (hex, hsl, etc.)
  computedValue: string; // Current computed value
  category: 'primary' | 'secondary' | 'background' | 'accent' | 'destructive';
}

export type SpacingTarget = 'all' | 'margin' | 'padding' | 'gap';
export type TextSizeTarget = 'all' | 'text' | 'leading' | 'tracking';
export type ColorTarget = 'all' | 'primary' | 'secondary' | 'background' | 'accent' | 'destructive';
export type VariableEditorView = 'spacing' | 'text' | 'color';
