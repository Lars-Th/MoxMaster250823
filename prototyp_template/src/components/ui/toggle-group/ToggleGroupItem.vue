<script setup lang="ts">
import type { VariantProps } from 'class-variance-authority';
import { ToggleGroupItem, type ToggleGroupItemProps } from 'reka-ui';
import { type HTMLAttributes, inject } from 'vue';
import { cn } from '@/utils/libraryHelper';
import { toggleVariants } from '@/components/ui/toggle';

type ToggleGroupVariants = VariantProps<typeof toggleVariants>;

const props = defineProps<
  ToggleGroupItemProps & {
    class?: HTMLAttributes['class'];
    variant?: ToggleGroupVariants['variant'];
    size?: ToggleGroupVariants['size'];
  }
>();

const context = inject<ToggleGroupVariants>('toggleGroup');
</script>

<template>
  <ToggleGroupItem
    v-slot="slotProps"
    data-slot="toggle-group-item"
    :data-variant="context?.variant ?? variant"
    :data-size="context?.size ?? size"
    :value="props.value"
    :disabled="props.disabled ?? false"
    :as-child="props.asChild ?? false"
    :as="props.as ?? 'button'"
    :class="
      cn(
        toggleVariants({
          variant: context?.variant ?? variant,
          size: context?.size ?? size,
        }),
        'min-w-0 flex-1 shrink-0 rounded-none shadow-none first:rounded-l-md last:rounded-r-md focus:z-10 focus-visible:z-10 data-[variant=outline]:border-l-0 data-[variant=outline]:first:border-l',
        props.class
      )
    "
  >
    <slot v-bind="slotProps" />
  </ToggleGroupItem>
</template>
