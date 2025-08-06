<script setup lang="ts">
import { computed } from 'vue';
import { TooltipProvider, type TooltipProviderProps } from 'reka-ui';
import { cleanUIProps } from '@/utils/libraryHelper';

const props = withDefaults(defineProps<TooltipProviderProps>(), {
  delayDuration: 0,
});

// Filter out undefined values to satisfy exactOptionalPropertyTypes
const cleanProps = computed(() => cleanUIProps(props));
</script>

<template>
  <TooltipProvider v-bind="cleanProps">
    <slot />
  </TooltipProvider>
</template>
