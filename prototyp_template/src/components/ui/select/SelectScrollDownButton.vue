<script setup lang="ts">
import type { HTMLAttributes } from 'vue';
import { ChevronDown } from 'lucide-vue-next';
import { SelectScrollDownButton, type SelectScrollDownButtonProps } from 'reka-ui';
import { cn } from '@/utils/libraryHelper';

const props = defineProps<SelectScrollDownButtonProps & { class?: HTMLAttributes['class'] }>();
</script>

<template>
  <SelectScrollDownButton
    data-slot="select-scroll-down-button"
    :as-child="props.asChild ?? false"
    :as="props.as ?? 'button'"
    :class="cn('flex cursor-default items-center justify-center py-1', props.class)"
  >
    <slot>
      <ChevronDown class="size-4" />
    </slot>
  </SelectScrollDownButton>
</template>
