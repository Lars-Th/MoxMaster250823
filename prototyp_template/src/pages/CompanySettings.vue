<script setup lang="ts">
import { ref } from 'vue';
import DetailPage from '@/components/shared/DetailPage.vue';
import companyDefaults from '@/assets/data/companySettings.json';
import { useToast } from '@/composables/useToast';
import { useCompanySettings } from '@/composables/useCompanySettings';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Upload } from 'lucide-vue-next';

const { success, error } = useToast();

const { updateSettings, setLogoUrl } = useCompanySettings();
const fileInputRef = ref<HTMLInputElement | null>(null);

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
    updateSettings({
      companyName: String(data.value.companyName ?? ''),
      street: String(data.value.street ?? ''),
      zip: String(data.value.zip ?? ''),
      city: String(data.value.city ?? ''),
      country: String(data.value.country ?? ''),
      contactName: String(data.value.contactName ?? ''),
      contactEmail: String(data.value.contactEmail ?? ''),
      contactPhone: String(data.value.contactPhone ?? ''),
      logoUrl: String(data.value.logoUrl ?? ''),
    });
    success('Sparat', 'Företagsinställningarna har sparats.');
  } catch (e) {
    error('Fel', 'Kunde inte spara företagsinställningarna.');
  }
};

const fileName = ref<string>('');

const handleLogoChange = (event: Event) => {
  const input = event.target as HTMLInputElement;
  const file = input.files?.[0];
  if (!file) return;
  if (!file.type.includes('png')) {
    error('Ogiltig fil', 'Logotyp måste vara en PNG med transparens.');
    return;
  }
  fileName.value = file.name;
  const reader = new FileReader();
  reader.onload = () => {
    data.value.logoUrl = reader.result as string;
    setLogoUrl(String(data.value.logoUrl));
    success('Logotyp uppladdad', 'Förhandsvisas nu och används i sidomenyn.');
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
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div class="flex items-center">
              <img :src="(d.logoUrl as string)" alt="Logotyp" class="h-10 object-contain" />
            </div>
            <div class="space-y-1">
              <Label class="label-xs">Ladda upp PNG (med transparens)</Label>
              <div class="flex items-center gap-2">
                <input id="company-logo" ref="fileInputRef" type="file" accept="image/png" class="hidden" @change="handleLogoChange" />
                <Button type="button" variant="secondary" size="sm" class="h-8 text-xs" @click="() => (fileInputRef as HTMLInputElement | null)?.click()">
                  <Upload class="h-4 w-4 mr-2" />
                  Välj fil
                </Button>
                <span class="text-xs text-foreground/70" v-if="fileName">{{ fileName }}</span>
              </div>
            </div>
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
