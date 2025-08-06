<script lang="ts" setup>
import { computed, type HTMLAttributes } from 'vue';
import { reactiveOmit } from '@vueuse/core';
import { ChevronRight } from 'lucide-vue-next';
import { CalendarNext, type CalendarNextProps, useForwardProps } from 'reka-ui';
import { cn, filterUndefined } from '@/utils/libraryHelper';
import { buttonVariants } from '@/components/ui/button';

const props = defineProps<CalendarNextProps & { class?: HTMLAttributes['class'] }>();

const delegatedProps = reactiveOmit(props, 'class');

const forwardedProps = useForwardProps(delegatedProps);

// Filter out undefined values to satisfy exactOptionalPropertyTypes
const cleanProps = computed(() => filterUndefined(forwardedProps.value));
</script>

<template>
  <CalendarNext
    data-slot="calendar-next-button"
    :class="
      cn(
        buttonVariants({ variant: 'outline' }),
        'absolute right-1',
        'size-7 bg-transparent p-0 opacity-50 hover:opacity-100',
        props.class
      )
    "
    v-bind="cleanProps"
  >
    <slot>
      <ChevronRight class="size-4" />
    </slot>
  </CalendarNext>
</template>
