<script setup lang="ts">
import { computed, type HTMLAttributes } from 'vue';
import { reactiveOmit } from '@vueuse/core';
import { TagsInputItemText, type TagsInputItemTextProps, useForwardProps } from 'reka-ui';
import { cn } from '@/utils/libraryHelper';

const props = defineProps<TagsInputItemTextProps & { class?: HTMLAttributes['class'] }>();

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
  <TagsInputItemText v-bind="cleanedForwardedProps" :class="cn('text-xs', props.class)">
    <slot />
  </TagsInputItemText>
</template>
