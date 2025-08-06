<script lang="ts" setup>
import { computed, type HTMLAttributes } from 'vue';
import { reactiveOmit } from '@vueuse/core';
import { CalendarHeader, type CalendarHeaderProps, useForwardProps } from 'reka-ui';
import { cn, filterUndefined } from '@/utils/libraryHelper';

const props = defineProps<CalendarHeaderProps & { class?: HTMLAttributes['class'] }>();

const delegatedProps = reactiveOmit(props, 'class');

const forwardedProps = useForwardProps(delegatedProps);

// Filter out undefined values to satisfy exactOptionalPropertyTypes
const cleanProps = computed(() => filterUndefined(forwardedProps.value));
</script>

<template>
  <CalendarHeader
    data-slot="calendar-header"
    :class="cn('flex justify-center pt-1 relative items-center w-full', props.class)"
    v-bind="cleanProps"
  >
    <slot />
  </CalendarHeader>
</template>
