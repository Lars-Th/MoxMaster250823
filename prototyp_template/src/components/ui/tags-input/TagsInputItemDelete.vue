<script setup lang="ts">
import { computed, type HTMLAttributes } from 'vue';
import { reactiveOmit } from '@vueuse/core';
import { X } from 'lucide-vue-next';
import { TagsInputItemDelete, type TagsInputItemDeleteProps, useForwardProps } from 'reka-ui';
import { cn } from '@/utils/libraryHelper';

const props = defineProps<TagsInputItemDeleteProps & { class?: HTMLAttributes['class'] }>();

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
  <TagsInputItemDelete
    v-bind="cleanedForwardedProps"
    :class="cn('flex rounded bg-transparent mr-1', props.class)"
  >
    <slot>
      <X class="w-4 h-4" />
    </slot>
  </TagsInputItemDelete>
</template>
