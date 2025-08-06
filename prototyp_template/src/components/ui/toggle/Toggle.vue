<script setup lang="ts">
import { computed, type HTMLAttributes } from 'vue';
import { reactiveOmit } from '@vueuse/core';
import { Toggle, type ToggleEmits, type ToggleProps, useForwardPropsEmits } from 'reka-ui';
import { cn } from '@/utils/libraryHelper';
import { type ToggleVariants, toggleVariants } from '.';

const props = withDefaults(
  defineProps<
    ToggleProps & {
      class?: HTMLAttributes['class'];
      variant?: ToggleVariants['variant'];
      size?: ToggleVariants['size'];
    }
  >(),
  {
    variant: 'default',
    size: 'default',
    disabled: false,
  }
);

const emits = defineEmits<ToggleEmits>();

const delegatedProps = reactiveOmit(props, 'class', 'size', 'variant');
const forwarded = useForwardPropsEmits(delegatedProps, emits);

// Filter undefined values for exactOptionalPropertyTypes compatibility
const cleanedForwarded = computed(() => {
  const cleaned: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(forwarded)) {
    if (value !== undefined && value !== null) {
      cleaned[key] = value;
    }
  }
  return cleaned;
});
</script>

<template>
  <Toggle
    v-slot="slotProps"
    data-slot="toggle"
    v-bind="cleanedForwarded"
    :class="cn(toggleVariants({ variant, size }), props.class)"
  >
    <slot v-bind="slotProps" />
  </Toggle>
</template>
