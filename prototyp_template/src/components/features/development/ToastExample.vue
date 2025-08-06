<template>
  <div class="toast-examples">
    <!-- Header -->
    <div class="mb-6">
      <h2 class="text-2xl font-bold mb-2">🍞 Toast System</h2>
      <p class="text-gray-600">Demonstrerar det avancerade toast-systemet med alla funktioner</p>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- Basic Toasts -->
      <div class="bg-white rounded-lg border p-6">
        <h3 class="text-lg font-semibold mb-4 flex items-center gap-2">
          <CheckCircle class="h-5 w-5 text-green-600" />
          Grundläggande Toasts
        </h3>
        <div class="space-y-3">
          <Button class="w-full justify-start gap-2" variant="outline" @click="showSuccess">
            <CheckCircle class="h-4 w-4 text-green-600" />
            Success Toast
          </Button>
          <Button class="w-full justify-start gap-2" variant="outline" @click="showError">
            <XCircle class="h-4 w-4 text-red-600" />
            Error Toast
          </Button>
          <Button class="w-full justify-start gap-2" variant="outline" @click="showWarning">
            <AlertTriangle class="h-4 w-4 text-yellow-600" />
            Warning Toast
          </Button>
          <Button class="w-full justify-start gap-2" variant="outline" @click="showInfo">
            <Info class="h-4 w-4 text-blue-600" />
            Info Toast
          </Button>
        </div>
      </div>

      <!-- Advanced Features -->
      <div class="bg-white rounded-lg border p-6">
        <h3 class="text-lg font-semibold mb-4 flex items-center gap-2">
          <Settings class="h-5 w-5 text-blue-600" />
          Avancerade Funktioner
        </h3>
        <div class="space-y-3">
          <Button class="w-full justify-start gap-2" variant="outline" @click="showConfirmDialog">
            <HelpCircle class="h-4 w-4 text-purple-600" />
            Confirm Dialog
          </Button>
          <Button class="w-full justify-start gap-2" variant="outline" @click="showPromiseToast">
            <Clock class="h-4 w-4 text-orange-600" />
            Promise Toast
          </Button>
          <Button class="w-full justify-start gap-2" variant="outline" @click="showUnsavedChanges">
            <Save class="h-4 w-4 text-indigo-600" />
            Unsaved Changes
          </Button>
          <Button class="w-full justify-start gap-2" variant="outline" @click="showPersistentToast">
            <Pin class="h-4 w-4 text-gray-600" />
            Persistent Toast
          </Button>
        </div>
      </div>

      <!-- Positioner & Verktyg -->
      <div class="bg-white rounded-lg border p-6">
        <h3 class="text-lg font-semibold mb-4 flex items-center gap-2">
          <MapPin class="h-5 w-5 text-pink-600" />
          Positioner & Verktyg
        </h3>
        <div class="space-y-3">
          <Button class="w-full justify-start gap-2" variant="outline" @click="showAllPositions">
            <MapPin class="h-4 w-4 text-pink-600" />
            Alla Positioner
          </Button>
          <Button class="w-full justify-start gap-2" variant="outline" @click="showPersistentToast">
            <Pin class="h-4 w-4 text-gray-600" />
            Persistent Toast
          </Button>
          <Button class="w-full justify-start gap-2" variant="outline" @click="showStressTest">
            <Zap class="h-4 w-4 text-yellow-600" />
            Stress Test
          </Button>
          <Button class="w-full justify-start gap-2" variant="destructive" @click="clearAllToasts">
            <Trash2 class="h-4 w-4 text-red-600" />
            Rensa Alla
          </Button>
        </div>
      </div>
    </div>

    <!-- Configuration Section -->
    <div class="mt-6 bg-white rounded-lg border p-6">
      <h3 class="text-lg font-semibold mb-4 flex items-center gap-2">
        <Settings class="h-5 w-5 text-gray-600" />
        Konfiguration
      </h3>
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div class="space-y-2">
          <label
            class="flex items-center gap-2 p-3 border rounded-lg cursor-pointer hover:bg-gray-50"
          >
            <input
              v-model="pauseOnHover"
              type="checkbox"
              class="rounded"
              @change="updatePauseOnHover"
            />
            <span class="text-sm font-medium">Hover Pause</span>
          </label>
        </div>

        <div class="space-y-2">
          <label
            class="flex items-center gap-2 p-3 border rounded-lg cursor-pointer hover:bg-gray-50"
          >
            <input
              v-model="clickToClose"
              type="checkbox"
              class="rounded"
              @change="updateClickToClose"
            />
            <span class="text-sm font-medium">Click to Close</span>
          </label>
        </div>

        <div class="space-y-2">
          <label
            class="flex items-center gap-2 p-3 border rounded-lg cursor-pointer hover:bg-gray-50"
          >
            <span class="text-sm font-medium"># Max Toasts</span>
            <input
              v-model.number="maxToasts"
              type="number"
              min="1"
              max="10"
              class="w-16 p-1 border rounded text-center"
              @change="updateMaxToasts"
            />
          </label>
        </div>

        <div class="space-y-2">
          <label
            class="flex items-center gap-2 p-3 border rounded-lg cursor-pointer hover:bg-gray-50"
          >
            <input
              v-model="preventDuplicates"
              type="checkbox"
              class="rounded"
              @change="updatePreventDuplicates"
            />
            <span class="text-sm font-medium">No Duplicates</span>
          </label>
        </div>
      </div>
    </div>

    <!-- Instructions -->
    <div class="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-6">
      <h3 class="text-lg font-semibold mb-4 text-blue-900 flex items-center gap-2">
        <BookOpen class="h-5 w-5" />
        Instruktioner
      </h3>
      <div class="text-blue-800 space-y-2">
        <p>
          <strong>Grundläggande användning:</strong>
          Klicka på knapparna för att visa olika typer av toasts.
        </p>
        <p>
          <strong>Avancerade funktioner:</strong>
          Testa confirm dialogs, promise toasts och persistent toasts.
        </p>
        <p>
          <strong>Konfiguration:</strong>
          Ändra position, duration och andra inställningar för att se hur toasts beter sig.
        </p>
        <p>
          <strong>Tangentbord:</strong>
          Tryck ESC för att stänga den senaste toasten.
        </p>
        <p>
          <strong>Hover:</strong>
          Håll musen över en toast för att pausa timern (om aktiverat).
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { Button } from '@/components/ui/button';
import { useToast } from '@/composables/useToast';
import type { ToastPosition } from '@/types/index';
import {
  AlertTriangle,
  BookOpen,
  CheckCircle,
  Clock,
  HelpCircle,
  Info,
  MapPin,
  Pin,
  Save,
  Settings,
  Trash2,
  XCircle,
  Zap,
} from 'lucide-vue-next';

const {
  success,
  error,
  warning,
  info,
  confirm,
  promise,
  unsavedChanges,
  clearToasts,
  setConfig,
  config,
} = useToast();

// Configuration state
const pauseOnHover = ref(config.pauseOnHover ?? true);
const preventDuplicates = ref(config.preventDuplicates ?? false);
const clickToClose = ref(config.closeOnClick ?? false);
const maxToasts = ref(config.maxToasts ?? 3);

// Basic toast methods
const showSuccess = () => {
  success('Framgång!', 'Operationen slutfördes framgångsrikt.');
};

const showError = () => {
  error('Fel uppstod', 'Något gick fel vid bearbetningen.');
};

const showWarning = () => {
  warning('Varning', 'Detta kan påverka systemets prestanda.');
};

const showInfo = () => {
  info('Information', 'Här är viktig information för dig.');
};

// Advanced toast methods
const showConfirmDialog = () => {
  confirm(
    'Bekräfta åtgärd',
    'Är du säker på att du vill fortsätta?',
    () => {
      success('Bekräftat', 'Åtgärden har bekräftats.');
    },
    () => {
      info('Avbrutet', 'Åtgärden avbröts.');
    }
  );
};

const showPromiseToast = () => {
  const mockPromise = new Promise((resolve, reject) => {
    setTimeout(() => {
      if (Math.random() > 0.5) {
        resolve('Data loaded successfully');
      } else {
        reject(new Error('Failed to load data'));
      }
    }, 2000);
  });

  promise(mockPromise, {
    loading: 'Laddar data...',
    success: 'Data laddad framgångsrikt!',
    error: 'Misslyckades att ladda data',
  });
};

const showUnsavedChanges = () => {
  unsavedChanges(
    () => {
      success('Sparat', 'Dina ändringar har sparats.');
    },
    () => {
      warning('Ignorerat', 'Ändringar ignorerades.');
    }
  );
};

const showPersistentToast = () => {
  info('Persistent Toast', 'Denna toast försvinner inte automatiskt.', {
    persistent: true,
    actions: [
      {
        label: 'Stäng',
        action: () => {},
        style: 'secondary',
      },
    ],
  });
};

// Configuration methods
const updatePauseOnHover = () => {
  setConfig({ pauseOnHover: pauseOnHover.value });
};

const updatePreventDuplicates = () => {
  setConfig({ preventDuplicates: preventDuplicates.value });
};

// New methods for Positioner & Verktyg section
const showAllPositions = () => {
  const positions: ToastPosition[] = [
    'top-right',
    'top-left',
    'bottom-right',
    'bottom-left',
    'top-center',
    'bottom-center',
  ];
  positions.forEach((position, index) => {
    setTimeout(() => {
      success(`Position: ${position}`, `Toast från ${position} position`, { position });
    }, index * 500);
  });
};

const showStressTest = () => {
  const methods = { success, error, warning, info };
  const types = ['success', 'error', 'warning', 'info'] as const;

  for (let i = 1; i <= 10; i++) {
    setTimeout(() => {
      const typeIndex = (i - 1) % 4;
      const type = types[typeIndex] as keyof typeof methods;
      methods[type](`Stress Test ${i}`, `Detta är toast nummer ${i} i stress testet`);
    }, i * 200);
  }
};

// Configuration update methods
const updateClickToClose = () => {
  setConfig({ closeOnClick: clickToClose.value });
};

const updateMaxToasts = () => {
  setConfig({ maxToasts: maxToasts.value });
};

const clearAllToasts = () => {
  clearToasts();
  info('Rensad', 'Alla toasts har rensats.');
};
</script>
