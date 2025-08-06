<script lang="ts" setup>
import { computed, type HTMLAttributes } from 'vue';
import { reactiveOmit } from '@vueuse/core';
import { CalendarGridRow, type CalendarGridRowProps, useForwardProps } from 'reka-ui';
import { cleanUIProps, cn } from '@/utils/libraryHelper';

const props = defineProps<CalendarGridRowProps & { class?: HTMLAttributes['class'] }>();

const delegatedProps = reactiveOmit(props, 'class');

const forwardedProps = useForwardProps(delegatedProps);

// Filter out undefined values to satisfy exactOptionalPropertyTypes
const cleanProps = computed(() => cleanUIProps(forwardedProps.value));
</script>

<template>
  <CalendarGridRow
    data-slot="calendar-grid-row"
    :class="cn('flex', props.class)"
    v-bind="cleanProps"
  >
    <slot />
  </CalendarGridRow>
</template>
