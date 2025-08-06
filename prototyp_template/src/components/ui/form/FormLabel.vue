<script lang="ts" setup>
import type { LabelProps } from 'reka-ui';
import type { HTMLAttributes } from 'vue';
import { cn } from '@/utils/libraryHelper';
import { Label } from '@/components/ui/label';
import { useFormField } from '@/components/ui/form/useFormField';

const props = defineProps<LabelProps & { class?: HTMLAttributes['class'] }>();

const { error, formItemId } = useFormField();
</script>

<template>
  <Label
    data-slot="form-label"
    :data-error="!!error"
    :class="cn('data-[error=true]:text-destructive-foreground', props.class)"
    :for="formItemId"
  >
    <slot />
  </Label>
</template>
