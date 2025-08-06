<script lang="ts" setup>
import { computed, type HTMLAttributes } from 'vue';
import { reactiveOmit } from '@vueuse/core';
import { ChevronLeft } from 'lucide-vue-next';
import { CalendarPrev, type CalendarPrevProps, useForwardProps } from 'reka-ui';
import { cleanUIProps, cn } from '@/utils/libraryHelper';
import { buttonVariants } from '@/components/ui/button';

const props = defineProps<CalendarPrevProps & { class?: HTMLAttributes['class'] }>();

const delegatedProps = reactiveOmit(props, 'class');

const forwardedProps = useForwardProps(delegatedProps);

// Filter out undefined values to satisfy exactOptionalPropertyTypes
const cleanProps = computed(() => cleanUIProps(forwardedProps.value));
</script>

<template>
  <CalendarPrev
    data-slot="calendar-prev-button"
    :class="
      cn(
        buttonVariants({ variant: 'outline' }),
        'absolute left-1',
        'size-7 bg-transparent p-0 opacity-50 hover:opacity-100',
        props.class
      )
    "
    v-bind="cleanProps"
  >
    <slot>
      <ChevronLeft class="size-4" />
    </slot>
  </CalendarPrev>
</template>
