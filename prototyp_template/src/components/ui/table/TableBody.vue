<script setup lang="ts">
import type { HTMLAttributes } from 'vue';
import { cn } from '@/utils/libraryHelper';

const props = defineProps<{
  class?: HTMLAttributes['class'];
}>();
</script>

<template>
  <tbody data-slot="table-body" :class="cn(props.class)">
    <slot />
  </tbody>
</template>
