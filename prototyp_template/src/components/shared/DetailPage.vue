<script setup lang="ts">
import StandardHeader from '@/components/layout/StandardHeader.vue';
import Button from '@/components/common/Button.vue';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { ArrowLeft, FileText, Info, Save, Undo2 } from 'lucide-vue-next';

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
  descriptionTitle?: string;
  descriptionSections?: Array<{ title?: string; paragraphs: string[] }>;
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
  descriptionTitle: 'Beskrivning',
  descriptionSections: () => [],
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

// Local state to mirror props.data for immediate UI feedback (like ViewControls)
import { ref, watch } from 'vue';
const localData = ref<Record<string, unknown>>({ ...props.data });

watch(
  () => props.data,
  (newData) => {
    localData.value = { ...newData };
  },
  { deep: true }
);

const setLocalAndEmit = (key: string, value: unknown) => {
  localData.value[key] = value;
  updateField(key, value);
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

// Helper for Select value
const getSelectValue = (key: string): string | number | undefined => {
  const value = localData.value?.[key];
  if (value === null || value === undefined) return undefined;
  if (typeof value === 'string' || typeof value === 'number') return value;
  return String(value);
};
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
      <Button variant="secondary" size="sm" class="gap-2 h-8 text-xs" @click="emit('back')">
        <ArrowLeft class="w-3 h-3" />
        Tillbaka
      </Button>

      <!-- Save Button (appears when there are changes) -->
      <Button
        v-if="!readonly && hasUnsavedChanges"
        variant="primary"
        size="sm"
        class="gap-2 h-8 text-xs"
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
        class="gap-2 h-8 text-xs"
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
                <Label class="label-xs">{{ field.label }}</Label>
                <Input
                  v-if="field.type === 'text'"
                  :model-value="String(localData[field.key] ?? '')"
                  :readonly="readonly"
                  class="form-xs"
                  @update:modelValue="setLocalAndEmit(field.key, $event)"
                />
                <Input
                  v-else-if="field.type === 'number'"
                  :model-value="Number(localData[field.key] ?? 0)"
                  :readonly="readonly"
                  type="number"
                  class="form-xs"
                  @update:modelValue="setLocalAndEmit(field.key, $event)"
                />
                <Input
                  v-else-if="field.type === 'date'"
                  :model-value="String(localData[field.key] ?? '')"
                  :readonly="readonly"
                  type="date"
                  class="form-xs"
                  @update:modelValue="setLocalAndEmit(field.key, $event)"
                />
                <Textarea
                  v-else-if="field.type === 'textarea'"
                  :model-value="String(localData[field.key] ?? '')"
                  :readonly="readonly"
                  rows="3"
                  class="text-xs resize-none"
                  @update:modelValue="setLocalAndEmit(field.key, $event)"
                />
                <Select
                  v-else-if="field.type === 'select'"
                  :model-value="getSelectValue(field.key)"
                  :disabled="readonly"
                  @update:modelValue="(v) => setLocalAndEmit(field.key, v)"
                >
                  <SelectTrigger class="form-xs">
                    <SelectValue :placeholder="`Välj ${field.label.toLowerCase()}...`" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem
                      v-for="option in field.options"
                      :key="String(option.value)"
                      :value="String(option.value)"
                      class="text-xs"
                    >
                      {{ option.label }}
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </slot>
      </div>

      <!-- Description Column (1/3 width) -->
      <div class="space-y-4">
        <slot name="description">
          <div class="bg-background rounded-lg border p-4">
            <h3 class="text-sm font-semibold mb-3 flex items-center gap-2 text-gray-600">
              <Info class="h-4 w-4" />
              {{ props.descriptionTitle }}
            </h3>
            <div class="space-y-3">
              <div class="rounded-md border p-3" v-for="(section, i) in props.descriptionSections" :key="i">
                <p v-if="section.title" class="text-xs font-medium mb-1 text-gray-600">{{ section.title }}</p>
                <p v-for="(p, j) in section.paragraphs" :key="j" class="text-xs text-gray-700 leading-relaxed">
                  {{ p }}
                </p>
              </div>
              <div v-if="!props.descriptionSections.length" class="text-xs text-gray-600">
                Lägg till `descriptionSections`-prop på sidan för att visa förklarande avsnitt.
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
