<script lang="ts" setup>
import { StepperTitle, type StepperTitleProps, useForwardProps } from 'reka-ui';
import type { HTMLAttributes } from 'vue';
import { reactiveOmit } from '@vueuse/core';
import { cn } from '@/utils/libraryHelper';

const props = defineProps<StepperTitleProps & { class?: HTMLAttributes['class'] }>();

const delegatedProps = reactiveOmit(props, 'class');

const forwarded = useForwardProps(delegatedProps);
</script>

<template>
  <StepperTitle
    v-bind="forwarded"
    :class="cn('text-md font-semibold whitespace-nowrap', props.class)"
  >
    <slot />
  </StepperTitle>
</template>
