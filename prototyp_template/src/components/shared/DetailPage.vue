<script setup lang="ts">
import StandardHeader from '@/components/layout/StandardHeader.vue';
import Button from '@/components/common/Button.vue';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Combobox,
  ComboboxAnchor,
  ComboboxEmpty,
  ComboboxGroup,
  ComboboxInput,
  ComboboxItem,
  ComboboxItemIndicator,
  ComboboxList,
  ComboboxTrigger,
} from '@/components/ui/combobox';
import { ArrowLeft, Check, ChevronsUpDown, FileText, Info, Save, Undo2 } from 'lucide-vue-next';

import type { Field, Stat } from '@/types';

interface Props {
  data: { [key: string]: unknown };
  readonly?: boolean;
  hasUnsavedChanges?: boolean;
  mainFields?: Field[];
  sidebarFields?: Field[];
  title?: string;
  breadcrumbs?: Array<{ label: string; to: string; isCurrentPage?: boolean }>;
  showStats?: boolean;
  stats?: Stat[];
}

const props = withDefaults(defineProps<Props>(), {
  readonly: false,
  hasUnsavedChanges: false,
  mainFields: () => [],
  sidebarFields: () => [],
  title: '',
  breadcrumbs: () => [],
  showStats: false,
  stats: () => [],
});

const emit = defineEmits<{
  save: [];
  back: [];
  'discard-changes': [];
  'field-change': [key: string, value: any];
}>();

const updateField = (key: string, value: any) => {
  if (!props.readonly) {
    emit('field-change', key, value);
  }
};

const formatValue = (value: any, type?: string) => {
  if (value === null || value === undefined) return '-';

  switch (type) {
    case 'date':
      if (typeof value === 'string' || typeof value === 'number') {
        return `${value}`;
      }
      return '-';
    case 'number':
      if (typeof value === 'number') {
        return `${value}`;
      }
      return `${value}`;
    default:
      return `${value}`;
  }
};

// Helper function to get selected option for combobox
const getSelectedOption = (field: Field, value: any) => {
  if (!field.options || !value) return null;
  const stringValue = value?.toString() || '';
  return (
    field.options.find(
      (option: { value: string; label: string }) => option.value === stringValue
    ) || null
  );
};

// Helper function to handle combobox selection
const handleComboboxChange = (
  field: Field,
  selectedOption: { value: string; label: string } | string | number | bigint | null
) => {
  let value = '';
  if (selectedOption && typeof selectedOption === 'object' && 'value' in selectedOption) {
    value = selectedOption.value;
  } else if (
    typeof selectedOption === 'string' ||
    typeof selectedOption === 'number' ||
    typeof selectedOption === 'bigint'
  ) {
    value = selectedOption.toString();
  }
  updateField(field.key, value);
};

// Normalize combobox value to ensure only valid types are passed to the handler
function normalizeComboboxValue(
  val: unknown
): string | number | bigint | { value: string; label: string } | null {
  if (val && typeof val === 'object' && 'value' in val && 'label' in val) {
    return val as { value: string; label: string };
  }
  if (typeof val === 'string' || typeof val === 'number' || typeof val === 'bigint') {
    return val;
  }
  return null;
}
</script>

<template>
  <div class="relative">
    <!-- Header -->
    <StandardHeader
      :title="props.title"
      :breadcrumbs="props.breadcrumbs"
      :show-stats="props.showStats"
      :stats="props.stats"
    ></StandardHeader>

    <!-- Back Button and Save Button -->
    <div class="flex items-center gap-2 mx-4">
      <!-- Back Button (always visible) -->
      <Button variant="secondary" size="sm" @click="emit('back')">
        <ArrowLeft class="w-3 h-3" />
        Tillbaka
      </Button>

      <!-- Save Button (appears when there are changes) -->
      <Button
        v-if="!readonly && hasUnsavedChanges"
        variant="primary"
        size="sm"
        @click="emit('save')"
      >
        <Save class="h-3 w-3" />
        Spara
      </Button>

      <!-- Discard Changes Button (appears when there are changes) -->
      <Button
        v-if="!readonly && hasUnsavedChanges"
        variant="secondary"
        size="sm"
        @click="emit('discard-changes')"
      >
        <Undo2 class="h-3 w-3" />
        Ångra
      </Button>

      <!-- Spacer to push toast to consistent position -->
      <div class="flex-1"></div>

      <!-- Toast in fixed position -->
      <Transition name="toast" appear>
        <div
          v-if="!readonly && hasUnsavedChanges"
          class="w-64 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2 flex items-center gap-2 shadow-sm h-8 transition-all duration-300 transform-gpu will-change-transform"
        >
          <div class="w-2 h-2 bg-amber-500 rounded-full"></div>
          <span class="text-xs text-amber-800 font-medium">Du har ändrat informationen</span>
        </div>
      </Transition>
    </div>

    <!-- Form Content -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-4 m-4">
      <!-- Main Content (2/3 width) -->
      <div class="lg:col-span-2">
        <slot name="main-content" :data="data" :readonly="readonly">
          <!-- Default form fields -->
          <div class="bg-background rounded-lg border p-4">
            <h3 class="text-sm font-semibold flex items-center text-foreground/80 mb-2 gap-2">
              <FileText class="h-4 w-4" />
              Grundläggande information
            </h3>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-2 gap-x-4">
              <div v-for="field in mainFields" :key="field.key" class="space-y-1">
                <Label class="text-[10px] font-medium text-foreground/80">{{ field.label }}</Label>
                <Input
                  v-if="field.type === 'text'"
                  :model-value="(data[field.key] ?? '').toString()"
                  :readonly="readonly"
                  class="h-8 md:text-xs"
                  @update:model-value="updateField(field.key, $event)"
                />
                <Input
                  v-else-if="field.type === 'number'"
                  :model-value="Number(data[field.key] ?? 0)"
                  :readonly="readonly"
                  type="number"
                  class="h-8 text-xs"
                  @update:model-value="updateField(field.key, $event)"
                />
                <Input
                  v-else-if="field.type === 'date'"
                  :model-value="(data[field.key] ?? '').toString()"
                  :readonly="readonly"
                  type="date"
                  class="h-8 text-xs"
                  @update:model-value="updateField(field.key, $event)"
                />
                <Textarea
                  v-else-if="field.type === 'textarea'"
                  :model-value="(data[field.key] ?? '').toString()"
                  :readonly="readonly"
                  rows="3"
                  class="md:text-xs resize-none"
                  @update:model-value="updateField(field.key, $event)"
                />
                <Combobox
                  v-else-if="field.type === 'select'"
                  :model-value="getSelectedOption(field, data[field.key])"
                  :disabled="readonly"
                  by="value"
                  @update:model-value="handleComboboxChange(field, normalizeComboboxValue($event))"
                >
                  <ComboboxAnchor as-child>
                    <ComboboxTrigger as-child>
                      <Button variant="outline" class="font-normal text-xs">
                        {{
                          getSelectedOption(field, data[field.key])?.label ?? 'Välj alternativ...'
                        }}
                        <ChevronsUpDown class="" />
                      </Button>
                    </ComboboxTrigger>
                  </ComboboxAnchor>

                  <ComboboxList class="">
                    <div class="">
                      <ComboboxInput :placeholder="`Sök ${field.label.toLowerCase()}...`" />
                    </div>

                    <ComboboxEmpty class="text-xs">Inga alternativ hittades.</ComboboxEmpty>

                    <ComboboxGroup>
                      <ComboboxItem
                        v-for="option in field.options"
                        :key="option.value"
                        :value="option"
                        class="text-xs"
                      >
                        {{ option.label }}
                        <ComboboxItemIndicator>
                          <Check class="" />
                        </ComboboxItemIndicator>
                      </ComboboxItem>
                    </ComboboxGroup>
                  </ComboboxList>
                </Combobox>
              </div>
            </div>
          </div>
        </slot>
      </div>

      <!-- Sidebar Content (1/3 width) -->
      <div class="space-y-4">
        <slot name="sidebar-content" :data="data" :readonly="readonly">
          <!-- Default sidebar -->
          <div class="bg-background rounded-lg border p-4">
            <h3
              class="text-sm font-semibold mb-3 flex items-center gap-2 text-secondary-foreground"
            >
              <Info class="h-4 w-4" />
              Information
            </h3>

            <div class="space-y-2">
              <div v-for="field in sidebarFields" :key="field.key" class="space-y-1">
                <Label class="text-[10px] font-medium text-secondary-foreground">
                  {{ field.label }}
                </Label>
                <div class="text-xs text-secondary-foreground">
                  {{ formatValue(data[field.key], field.type) }}
                </div>
              </div>
            </div>
          </div>
        </slot>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.toast-enter-active,
.toast-leave-active {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.toast-enter-from {
  opacity: 0;
  transform: translateX(100%) scale(0.95);
}

.toast-leave-to {
  opacity: 0;
  transform: translateX(100%) scale(0.95);
}
</style>
