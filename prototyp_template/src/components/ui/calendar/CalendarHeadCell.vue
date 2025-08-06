<script lang="ts" setup>
import { computed, type HTMLAttributes } from 'vue';
import { reactiveOmit } from '@vueuse/core';
import { CalendarHeadCell, type CalendarHeadCellProps, useForwardProps } from 'reka-ui';
import { cn, filterUndefined } from '@/utils/libraryHelper';

const props = defineProps<CalendarHeadCellProps & { class?: HTMLAttributes['class'] }>();

const delegatedProps = reactiveOmit(props, 'class');

const forwardedProps = useForwardProps(delegatedProps);

// Filter out undefined values to satisfy exactOptionalPropertyTypes
const cleanProps = computed(() => filterUndefined(forwardedProps.value));
</script>

<template>
  <CalendarHeadCell
    data-slot="calendar-head-cell"
    :class="cn('text-muted-foreground rounded-md w-8 font-normal text-[0.8rem]', props.class)"
    v-bind="cleanProps"
  >
    <slot />
  </CalendarHeadCell>
</template>
