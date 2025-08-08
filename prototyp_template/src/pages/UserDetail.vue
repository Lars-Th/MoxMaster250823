<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Key, Save } from 'lucide-vue-next';
import { useApiItem } from '@/composables/useApi';
import { useToast } from '@/composables/useToast';
import { useAuth } from '@/composables/useAuth';
import api from '@/api';

const route = useRoute();
const router = useRouter();
const { info, error: showError } = useToast();
const { currentUser } = useAuth();

// Get user ID from route params or use current user's ID for "my account"
const userId = computed(() => {
  const routeId = route.params['id'] as string;

  // If we have a route ID, use it
  if (routeId) {
    return routeId;
  }

  // If no route ID and we're on the my-account route, use current user's ID
  if (route.name === 'settings-my-account' && currentUser.value) {
    return currentUser.value.id.toString();
  }

  return null;
});

// Check if this is the "my account" view
const isMyAccount = computed(() => route.name === 'settings-my-account');

// Fetch user data with permission group relationship
const {
  data: user,
  loading: isLoading,
  error: userError,
  refresh: refreshUser,
} = useApiItem(
  () => {
    if (!userId.value) {
      throw new Error('No user ID available');
    }
    return api.users.getById(userId.value, { include: ['permissionGroup'] });
  },
  {
    cacheKey: userId.value ? `user-${userId.value}-with-permissions` : 'no-user',
    immediate: !!userId.value,
  }
);

// Get the permission group name from the enhanced user data
const userPermissionGroup = computed(() => {
  const u = user.value as { permissionGroup?: { name?: string } } | null;
  if (!u) return 'Laddar...';
  if (u.permissionGroup?.name) return u.permissionGroup.name;
  return 'Okänd grupp';
});

// User profile data (editable)
const userProfile = ref({
  name: '',
  email: '',
  adminGroup: '',
});

// Password data
const passwordData = ref({
  newPassword: '',
});

// Store original values for reset functionality
const originalProfile = ref({ ...userProfile.value });

// Loading and error states
const hasError = computed(() => userError.value !== null);
const isSaving = ref(false);
const isUpdatingPassword = ref(false);

// Update userProfile when user data is loaded
const updateUserProfile = () => {
  const u = user.value as { name?: string; email?: string } | null;
  if (u) {
    userProfile.value = {
      name: u.name ?? '',
      email: u.email ?? '',
      adminGroup: userPermissionGroup.value,
    };
    originalProfile.value = { ...userProfile.value };
  }
};

// Methods
const createPassword = async () => {
  if (!passwordData.value.newPassword) {
    info('Vänligen ange ett lösenord');
    return;
  }

  if (!userId.value) {
    showError('Ingen användare vald');
    return;
  }

  isUpdatingPassword.value = true;

  try {
    const response = await api.users.updatePassword(userId.value, passwordData.value.newPassword);

    if (response.success) {
      info('Lösenord uppdaterat framgångsrikt');
      passwordData.value.newPassword = '';
    } else {
      showError(response.error?.message ?? 'Ett fel uppstod vid uppdatering av lösenord');
    }
  } catch (error) {
    showError('Ett oväntat fel uppstod vid uppdatering av lösenord');
  } finally {
    isUpdatingPassword.value = false;
  }
};

const saveChanges = async () => {
  if (!userId.value) return;

  // For regular users, we need user.value to get permissionID
  // For "My Account", we can use currentUser as fallback
  const sourceUser =
    (user.value as {
      permissionID?: number;
      permissionGroup?: { id?: number };
    } | null) ??
    (isMyAccount.value ? ((currentUser.value ?? null) as unknown as { id?: number } | null) : null);
  if (!sourceUser) return;

  isSaving.value = true;

  const updateData = {
    name: userProfile.value.name,
    email: userProfile.value.email,
    permissionID:
      (sourceUser as { permissionID?: number }).permissionID ??
      (sourceUser as { permissionGroup?: { id?: number } }).permissionGroup?.id, // Keep existing permission
  };

  try {
    const response = await api.users.update(userId.value, updateData);

    if (response.success && response.data) {
      // Update local data immediately
      if (user.value) {
        // Use spread operator instead of Object.assign for better compatibility
        user.value = { ...(user.value as object), ...response.data } as any;
      }

      // If this is "my account", also update the current user in auth
      if (isMyAccount.value && currentUser.value) {
        currentUser.value.name = response.data.name;
        currentUser.value.email = response.data.email;
        // Update localStorage as well - using try-catch for safety
        try {
          const userString = JSON.stringify(currentUser.value);
          localStorage.setItem('currentUser', userString);
        } catch (storageError) {
          // Ignore localStorage errors in case it's not available
        }
      }

      // Refresh cache
      refreshUser();
      info('Ändringar sparade');

      // Update original values
      originalProfile.value = { ...userProfile.value };
    } else {
      showError(response.error?.message ?? 'Ett fel uppstod vid sparande');
    }
  } catch (error) {
    showError('Ett oväntat fel uppstod vid sparande');
  } finally {
    isSaving.value = false;
  }
};

const resetChanges = () => {
  updateUserProfile(); // Reset to original API data
  passwordData.value.newPassword = '';
  info('Ändringar återställda');
};

// Watch for changes in user data to populate fields
watch(
  user,
  () => {
    if (user.value) {
      updateUserProfile();
    }
  },
  { immediate: true }
);

// Watch for changes in currentUser (for my account case)
watch(
  currentUser,
  () => {
    if (isMyAccount.value && currentUser.value && !user.value) {
      // Trigger a refresh when current user becomes available
      refreshUser();
    }
  },
  { immediate: true }
);

// Component lifecycle
onMounted(() => {
  // Initial update when component mounts
  if (user.value) {
    updateUserProfile();
  }
});
</script>

<template>
  <div class="min-h-screen bg-gray-50 py-8">
    <div class="max-w-full mx-auto px-6">
      <!-- Header -->
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-gray-900">{{ (user as any)?.name ?? 'Användare' }}</h1>
        <p class="text-gray-600 mt-2">Hantera användarens kontoinställningar</p>
      </div>

      <!-- Loading State -->
      <div v-if="isLoading" class="flex items-center justify-center py-12">
        <div class="text-center">
          <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4" />
          <p class="text-muted-foreground">Laddar användarinformation...</p>
        </div>
      </div>

      <!-- Error State -->
      <div v-else-if="hasError" class="flex items-center justify-center py-12">
        <div class="text-center">
          <p class="text-destructive mb-2">Ett fel uppstod vid laddning av användarinformation</p>
          <Button variant="outline" @click="refreshUser">Försök igen</Button>
        </div>
      </div>

      <!-- Not Found State -->
      <div v-else-if="!user" class="flex items-center justify-center h-64">
        <div class="text-center">
          <h3 class="text-lg font-semibold text-muted-foreground">Användare hittades inte</h3>
          <p class="text-sm text-muted-foreground mt-2">
            Den begärda användaren kunde inte hittas.
          </p>
          <Button class="mt-4" @click="() => router.push('/settings/login-accounts')">
            Tillbaka till användare
          </Button>
        </div>
      </div>

      <!-- User Information Fields -->
      <div v-else class="flex flex-col gap-4">
        <!-- Name Field -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Namn</label>
          <Input v-model="userProfile.name" class="w-full" placeholder="Ange fullständigt namn" />
        </div>

        <!-- Email Field -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">E-post</label>
          <Input
            v-model="userProfile.email"
            type="email"
            class="w-full"
            placeholder="användarens.email@example.com"
          />
        </div>

        <!-- Permission Group Field (Read-only) -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Behörighetsgrupp</label>
          <Input
            :value="(user as any)?.permissionGroup?.name ?? 'Laddar...'"
            type="text"
            class="w-full bg-gray-100"
            readonly
          />
          <!-- Temporary debug info -->
          <div class="text-xs text-gray-500 mt-1">
            Debug:
            {{ (user as any)?.permissionGroup ? 'Has permissionGroup' : 'No permissionGroup' }} |
            PermissionID: {{ (user as any)?.permissionID }} | Group Name:
            {{ (user as any)?.permissionGroup?.name ?? 'N/A' }}
          </div>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Nytt lösenord</label>
          <Input
            v-model="passwordData.newPassword"
            type="password"
            class="w-full"
            placeholder="Ange nytt lösenord"
          />
        </div>

        <div>
          <Button
            class="w-full lg:w-auto flex items-center gap-2"
            :disabled="!passwordData.newPassword || isUpdatingPassword"
            @click="createPassword"
          >
            <div
              v-if="isUpdatingPassword"
              class="animate-spin rounded-full h-4 w-4 border-b-2 border-white"
            />
            <Key v-else class="h-4 w-4" />
            {{ isUpdatingPassword ? 'Uppdaterar...' : 'Skapa lösenord' }}
          </Button>
        </div>

        <!-- Action Buttons -->
        <div class="flex gap-3">
          <Button class="flex items-center gap-2" :disabled="isSaving" @click="saveChanges">
            <div
              v-if="isSaving"
              class="animate-spin rounded-full h-4 w-4 border-b-2 border-white"
            />
            <Save v-else class="h-4 w-4" />
            {{ isSaving ? 'Sparar...' : 'Spara ändringar' }}
          </Button>
          <Button variant="outline" :disabled="isSaving" @click="resetChanges">Återställ</Button>
        </div>
      </div>
    </div>
  </div>
</template>
