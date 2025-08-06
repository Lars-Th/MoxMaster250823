<script lang="ts" setup>
import type { HTMLAttributes } from 'vue';
import { cn } from '@/utils/libraryHelper';
import { useFormField } from '@/components/ui/form/useFormField';

const props = defineProps<{
  class?: HTMLAttributes['class'];
}>();

const { formDescriptionId } = useFormField();
</script>

<template>
  <p
    :id="formDescriptionId"
    data-slot="form-description"
    :class="cn('text-muted-foreground text-sm', props.class)"
  >
    <slot />
  </p>
</template>
