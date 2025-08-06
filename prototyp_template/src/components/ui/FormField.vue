<script setup lang="ts">
import { computed } from 'vue';
import { Label } from '@/components/ui/label';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { AlertCircle, HelpCircle } from 'lucide-vue-next';

interface Props {
  label: string;
  fieldName: string;
  required?: boolean;
  error?: string | null;
  tooltip?: string;
  description?: string;
}

const props = withDefaults(defineProps<Props>(), {
  required: false,
  error: null,
  tooltip: '',
  description: '',
});

// Computed för att bestämma label-klasser baserat på fel
const labelClasses = computed(() => {
  const baseClasses = 'text-xs font-medium';
  if (props.error) {
    return `${baseClasses} text-red-700`;
  }
  return `${baseClasses} text-gray-700`;
});

// Computed för att bestämma om vi ska visa tooltip
const showTooltip = computed(() => {
  return props.tooltip ?? props.description;
});

// Computed för tooltip-innehåll
const tooltipContent = computed(() => {
  if (props.tooltip) return props.tooltip;
  if (props.description) return props.description;
  return '';
});
</script>

<template>
  <div class="space-y-1">
    <!-- Label med asterisk och tooltip -->
    <div class="flex items-center gap-1">
      <Label :for="fieldName" :class="labelClasses">
        {{ label }}
        <span v-if="required" class="text-red-500 ml-1">*</span>
      </Label>

      <!-- Tooltip ikon -->
      <TooltipProvider v-if="showTooltip">
        <Tooltip>
          <TooltipTrigger as-child>
            <button type="button" class="inline-flex items-center">
              <HelpCircle class="h-3 w-3 text-gray-400 hover:text-gray-600" />
            </button>
          </TooltipTrigger>
          <TooltipContent side="top" class="max-w-xs">
            <p class="text-xs">
              {{ tooltipContent }}
            </p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>

    <!-- Slot för input-fältet -->
    <div class="relative">
      <slot />

      <!-- Fel-ikon i input-fältet -->
      <div
        v-if="error"
        class="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none"
      >
        <AlertCircle class="h-4 w-4 text-red-500" />
      </div>
    </div>

    <!-- Felmeddelande -->
    <div v-if="error" class="flex items-center gap-1 mt-1">
      <AlertCircle class="h-3 w-3 text-red-500 flex-shrink-0" />
      <p class="text-xs text-red-600">
        {{ error }}
      </p>
    </div>

    <!-- Beskrivning (om ingen tooltip) -->
    <p v-if="description && !tooltip" class="text-xs text-gray-500 mt-1">
      {{ description }}
    </p>
  </div>
</template>
