<script setup lang="ts">
import type { HTMLAttributes } from 'vue';
import { reactiveOmit } from '@vueuse/core';
import { ComboboxAnchor, type ComboboxAnchorProps, useForwardProps } from 'reka-ui';
import { cn } from '@/utils/libraryHelper';

const props = defineProps<ComboboxAnchorProps & { class?: HTMLAttributes['class'] }>();

const delegatedProps = reactiveOmit(props, 'class');

const forwarded = useForwardProps(delegatedProps);
</script>

<template>
  <ComboboxAnchor
    data-slot="combobox-anchor"
    v-bind="forwarded"
    :class="cn('w-[200px]', 'justify-between', props.class)"
  >
    <slot />
  </ComboboxAnchor>
</template>
