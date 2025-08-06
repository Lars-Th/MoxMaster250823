<script setup lang="ts">
import { computed, type HTMLAttributes } from 'vue';
import { reactiveOmit } from '@vueuse/core';
import {
  TagsInputRoot,
  type TagsInputRootEmits,
  type TagsInputRootProps,
  useForwardPropsEmits,
} from 'reka-ui';
import { cn } from '@/utils/libraryHelper';

const props = defineProps<TagsInputRootProps & { class?: HTMLAttributes['class'] }>();
const emits = defineEmits<TagsInputRootEmits>();

const delegatedProps = reactiveOmit(props, 'class');

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
  <TagsInputRoot
    v-bind="cleanedForwarded"
    :class="
      cn(
        'flex flex-wrap gap-2 items-center rounded-md border border-input bg-background px-3 py-1.5 text-sm',
        props.class
      )
    "
  >
    <slot />
  </TagsInputRoot>
</template>
