<script setup lang="ts">
import { computed } from 'vue';
import {
  TooltipRoot,
  type TooltipRootEmits,
  type TooltipRootProps,
  useForwardPropsEmits,
} from 'reka-ui';
import { cleanUIProps } from '@/utils/libraryHelper';

const props = defineProps<TooltipRootProps>();
const emits = defineEmits<TooltipRootEmits>();

const forwarded = useForwardPropsEmits(props, emits);

// Filter out undefined values to satisfy exactOptionalPropertyTypes
const cleanForwarded = computed(() => cleanUIProps(forwarded.value));
</script>

<template>
  <TooltipRoot data-slot="tooltip" v-bind="cleanForwarded">
    <slot />
  </TooltipRoot>
</template>
