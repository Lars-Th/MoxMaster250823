import { computed, ref } from 'vue';
import defaults from '@/assets/data/companySettings.json';

type CompanySettings = {
  companyName?: string;
  street?: string;
  zip?: string;
  city?: string;
  country?: string;
  contactName?: string;
  contactEmail?: string;
  contactPhone?: string;
  logoUrl?: string;
};

const storageKey = 'companySettings';

const readFromStorage = (): CompanySettings => {
  try {
    if (typeof window === 'undefined' || !window.localStorage) return {};
    const raw = window.localStorage.getItem(storageKey);
    return raw ? (JSON.parse(raw) as CompanySettings) : {};
  } catch {
    return {};
  }
};

const writeToStorage = (settings: CompanySettings): void => {
  try {
    if (typeof window === 'undefined' || !window.localStorage) return;
    window.localStorage.setItem(storageKey, JSON.stringify(settings));
  } catch {
    // ignore
  }
};

const state = ref<CompanySettings>({
  companyName: defaults.companyName,
  street: defaults.address.street,
  zip: defaults.address.zip,
  city: defaults.address.city,
  country: defaults.address.country,
  contactName: defaults.contact.name,
  contactEmail: defaults.contact.email,
  contactPhone: defaults.contact.phone,
  logoUrl: defaults.logoUrl,
});

// Initialize from storage if available
Object.assign(state.value, readFromStorage());

export function useCompanySettings() {
  const settings = computed(() => state.value);

  const updateSettings = (partial: Partial<CompanySettings>) => {
    state.value = { ...state.value, ...partial };
    writeToStorage(state.value);
  };

  const setLogoUrl = (dataUrl: string) => updateSettings({ logoUrl: dataUrl });

  const logoUrl = computed(
    () => state.value.logoUrl || defaults.logoUrl || '/images/logo-placeholder.png'
  );

  return { settings, updateSettings, logoUrl, setLogoUrl };
}
