<script setup lang="ts">
import { ref } from 'vue';
import DetailPage from '@/components/shared/DetailPage.vue';
import companyDefaults from '@/assets/data/companySettings.json';
import { useToast } from '@/composables/useToast';

const { success, error } = useToast();

const data = ref<Record<string, unknown>>({
  companyName: companyDefaults.companyName,
  street: companyDefaults.address.street,
  zip: companyDefaults.address.zip,
  city: companyDefaults.address.city,
  country: companyDefaults.address.country,
  contactName: companyDefaults.contact.name,
  contactEmail: companyDefaults.contact.email,
  contactPhone: companyDefaults.contact.phone,
  logoUrl: companyDefaults.logoUrl,
});

const mainFields = [
  { key: 'companyName', label: 'Företagsnamn', type: 'text' },
  { key: 'street', label: 'Adress', type: 'text' },
  { key: 'zip', label: 'Postnummer', type: 'text' },
  { key: 'city', label: 'Ort', type: 'text' },
  { key: 'country', label: 'Land', type: 'text' },
  { key: 'contactName', label: 'Kontaktperson', type: 'text' },
  { key: 'contactEmail', label: 'Kontakt e-post', type: 'text' },
  { key: 'contactPhone', label: 'Kontakt telefon', type: 'text' },
];

const descriptionSections = [
  {
    title: 'Om vyn',
    paragraphs: [
      'Här konfigurerar du företagsuppgifter som används i hela systemet.',
      'Logotypen visas överst i sidomenyn när den laddas upp.',
    ],
  },
  {
    title: 'Tips',
    paragraphs: ['Använd PNG med transparens för bästa resultat.'],
  },
];

const handleFieldChange = (key: string, value: unknown) => {
  data.value[key] = value as never;
};

const handleSave = () => {
  try {
    // Placeholder: här skulle vi spara till backend eller localStorage
    localStorage.setItem('companySettings', JSON.stringify(data.value));
    success('Sparat', 'Företagsinställningarna har sparats.');
  } catch (e) {
    error('Fel', 'Kunde inte spara företagsinställningarna.');
  }
};

const handleLogoChange = (event: Event) => {
  const input = event.target as HTMLInputElement;
  const file = input.files?.[0];
  if (!file) return;
  if (!file.type.includes('png')) {
    error('Ogiltig fil', 'Logotyp måste vara en PNG med transparens.');
    return;
  }
  const reader = new FileReader();
  reader.onload = () => {
    data.value.logoUrl = reader.result as string;
    success('Logotyp uppladdad', 'Förhandsvisas nu och används i sidomenyn.');
    try {
      const saved = localStorage.getItem('companySettings');
      const parsed = saved ? JSON.parse(saved) : {};
      localStorage.setItem('companySettings', JSON.stringify({ ...parsed, logoUrl: data.value.logoUrl }));
    } catch {}
  };
  reader.readAsDataURL(file);
};
</script>

<template>
  <div class="w-full">
    <DetailPage
      :title="'Företagsinställningar'"
      :data="data"
      :main-fields="mainFields"
      :description-sections="descriptionSections"
      :show-stats="false"
      @field-change="handleFieldChange"
      @save="handleSave"
      @back="$router.back()"
    >
      <template #main-content="{ data: d }">
        <div class="bg-background rounded-lg border p-4">
          <h3 class="text-sm font-semibold flex items-center text-foreground/80 mb-2 gap-2">Logotyp</h3>
          <div class="flex items-center gap-4">
            <img :src="(d.logoUrl as string)" alt="Logotyp" class="h-10 object-contain" />
            <label class="text-xs font-medium">Ladda upp PNG:
              <input type="file" accept="image/png" class="ml-2 text-xs" @change="handleLogoChange" />
            </label>
          </div>
        </div>

        <div class="bg-background rounded-lg border p-4 mt-4">
          <h3 class="text-sm font-semibold flex items-center text-foreground/80 mb-2 gap-2">
            Grundläggande information
          </h3>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-2 gap-x-4">
            <div v-for="field in mainFields" :key="field.key" class="space-y-1">
              <Label class="label-xs">{{ field.label }}</Label>
              <Input
                v-if="field.type === 'text'"
                :model-value="String(d[field.key] ?? '')"
                class="form-xs"
                @update:modelValue="val => handleFieldChange(field.key, val)"
              />
            </div>
          </div>
        </div>
      </template>
    </DetailPage>
  </div>
 </template>


