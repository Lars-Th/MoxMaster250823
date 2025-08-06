<script setup lang="ts">
import { reactiveOmit } from '@vueuse/core';
import { TagsInputInput, type TagsInputInputProps, useForwardProps } from 'reka-ui';
import { computed, type HTMLAttributes } from 'vue';
import { cn } from '@/utils/libraryHelper';

const props = defineProps<TagsInputInputProps & { class?: HTMLAttributes['class'] }>();

const delegatedProps = reactiveOmit(props, 'class');

const forwardedProps = useForwardProps(delegatedProps);

// Filter undefined values for exactOptionalPropertyTypes compatibility
const cleanedForwardedProps = computed(() => {
  const cleaned: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(forwardedProps)) {
    if (value !== undefined && value !== null) {
      cleaned[key] = value;
    }
  }
  return cleaned;
});
</script>

<template>
  <TagsInputInput
    v-bind="cleanedForwardedProps"
    :class="cn('text-sm min-h-5 focus:outline-none flex-1 bg-transparent px-1', props.class)"
  />
</template>
