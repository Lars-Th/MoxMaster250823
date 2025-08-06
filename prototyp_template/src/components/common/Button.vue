<script setup lang="ts">
import { computed, type HTMLAttributes } from 'vue';
import { Primitive, type PrimitiveProps } from 'reka-ui';
import { cn } from '@/utils/libraryHelper';

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'default' | 'destructive' | 'outline';
type ButtonSize = 'default' | 'sm' | 'lg' | 'icon';

interface Props extends PrimitiveProps {
  variant?: ButtonVariant;
  size?: ButtonSize;
  class?: HTMLAttributes['class'];
  disabled?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  as: 'button',
  variant: 'primary',
  size: 'default',
  disabled: false,
});

// Base button classes using CSS variables from main.css
const baseClasses =
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]";

const variantClasses = computed(() => {
  switch (props.variant) {
    case 'primary':
    case 'default':
      return 'bg-primary text-primary-foreground shadow-xs hover:bg-primary/90 focus-visible:ring-primary/20';
    case 'secondary':
      return 'bg-background text-card-foreground shadow-xs hover:bg-secondary/20 focus-visible:ring-secondary/20 border border-border';
    case 'outline':
      return 'border border-input bg-background hover:bg-accent hover:text-accent-foreground';
    case 'destructive':
      return 'bg-destructive text-destructive-foreground hover:bg-destructive/80';
    case 'ghost':
      return 'text-blue-600 hover:text-blue-700 hover:bg-blue-50';
    default:
      return 'bg-primary text-primary-foreground shadow-xs hover:bg-primary/10 focus-visible:ring-primary/20';
  }
});

const sizeClasses = computed(() => {
  switch (props.size) {
    case 'sm':
      return 'h-8 rounded-md gap-1.5 px-3 has-[>svg]:px-2.5';
    case 'lg':
      return 'h-10 rounded-md px-6 has-[>svg]:px-4';
    case 'icon':
      return 'size-9';
    default:
      return 'h-9 px-4 py-2 has-[>svg]:px-3';
  }
});

const buttonClasses = computed(() => {
  return cn(baseClasses, variantClasses.value, sizeClasses.value, props.class);
});
</script>

<template>
  <Primitive
    data-slot="button"
    :as="as"
    :as-child="asChild"
    :class="buttonClasses"
    :disabled="disabled"
  >
    <slot />
  </Primitive>
</template>
