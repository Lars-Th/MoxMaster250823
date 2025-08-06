<script setup lang="ts">
import type { HTMLAttributes } from 'vue';
import { TagsInputItem, type TagsInputItemProps } from 'reka-ui';
import { cn } from '@/utils/libraryHelper';

const props = defineProps<TagsInputItemProps & { class?: HTMLAttributes['class'] }>();
</script>

<template>
  <TagsInputItem
    :value="props.value"
    :disabled="props.disabled"
    :class="
      cn(
        'flex h-5 items-center rounded-md bg-secondary data-[state=active]:ring-ring data-[state=active]:ring-2 data-[state=active]:ring-offset-2 ring-offset-background',
        props.class
      )
    "
  >
    <slot />
  </TagsInputItem>
</template>
