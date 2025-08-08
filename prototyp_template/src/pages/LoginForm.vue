<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import { useAuth } from '@/composables/useAuth';
import api from '@/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Eye, EyeOff, LogIn } from 'lucide-vue-next';
import logo from '/images/logo-placeholder.png';

const { login } = useAuth();

// Form state
const email = ref('');
const password = ref('');
const showPassword = ref(false);
const isLoading = ref(false);
const error = ref('');

// Demo users state
const demoUsers = ref<
  Array<{
    id: number;
    name: string;
    email: string;
    role: string;
    type: 'admin' | 'manager' | 'user';
  }>
>([]);
const loadingDemoUsers = ref(false);

// Handle form submission
const handleSubmit = async () => {
  if (!email.value || !password.value) {
    error.value = 'Vänligen fyll i både e-post och lösenord';
    return;
  }

  isLoading.value = true;
  error.value = '';

  try {
    const result = await login(email.value, password.value);

    if (!result.success) {
      error.value = result.error ?? 'Inloggning misslyckades';
    }
  } catch (err) {
    error.value = 'Ett oväntat fel uppstod';
    console.error('Login error:', err);
  } finally {
    isLoading.value = false;
  }
};

// Toggle password visibility
const togglePasswordVisibility = () => {
  showPassword.value = !showPassword.value;
};

// Load demo users from API
const loadDemoUsers = async () => {
  loadingDemoUsers.value = true;
  try {
    const usersResponse = await api.auth.getDemoUsers();

    // Process demo users
    if (usersResponse.success && usersResponse.data) {
      demoUsers.value = usersResponse.data;
    }
  } catch (err) {
    console.error('Failed to load demo users:', err);
  } finally {
    loadingDemoUsers.value = false;
  }
};

// Fill credentials with selected demo user
const fillDemoCredentials = (user: (typeof demoUsers.value)[0]) => {
  email.value = user.email;
  // For demo purposes, we'll use a predictable password pattern
  // In a real app, this would come from the API or be handled differently
  const passwordMap: { [key: string]: string } = {
    'superadmin@stadsmissionen.se': 'admin123',
    'erik.enhetschef@ostergotlandsstadsmission.se': 'erik123',
    'maria.koordinator@ostergotlandsstadsmission.se': 'maria123',
    'johan.handlaggare@ostergotlandsstadsmission.se': 'johan123',
    'lisa.medarbetare@ostergotlandsstadsmission.se': 'lisa123',
    'karin.admin@stadsmissionen.se': 'karin123',
    'anna.chef@goteborgsstadsmission.se': 'anna123',
    'peter.handlaggare@goteborgsstadsmission.se': 'peter123',
    'sara.koordinator@arvikastadsmission.se': 'sara123',
    'magnus.medarbetare@arvikastadsmission.se': 'magnus123',
  };
  password.value = passwordMap[user.email] ?? 'demo123';
};

// Sort users by role
const sortedUsers = computed(() => {
  if (!demoUsers.value.length) {
    return [];
  }

  // Define role hierarchy for sorting (higher number = higher priority)
  const roleHierarchy: { [key: string]: number } = {
    'System Administrator': 5,
    Administratör: 4,
    Enhetsansvarig: 3,
    Handläggare: 2,
    Medarbetare: 1,
  };

  return [...demoUsers.value].sort((a, b) => {
    const aLevel = roleHierarchy[a.role] ?? 0;
    const bLevel = roleHierarchy[b.role] ?? 0;
    return bLevel - aLevel; // Descending order
  });
});

// Initialize demo users on component mount
onMounted(() => {
  loadDemoUsers();
});
</script>

<template>
  <div
    class="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4"
  >
    <div class="w-full max-w-2xl">
      <!-- Logo -->
      <div class="text-center mb-8">
        <img :src="logo" alt="Östergötlands Stadsmission" class="h-16 mx-auto mb-4" />
        <h1 class="text-2xl font-bold text-gray-900">Välkommen tillbaka</h1>
        <p class="text-gray-600 mt-2">Logga in på ditt konto</p>
      </div>

      <!-- Login Form -->
      <Card>
        <CardHeader>
          <CardTitle>Logga in</CardTitle>
          <CardDescription>
            Ange dina inloggningsuppgifter för att komma åt systemet
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form class="space-y-4" @submit.prevent="handleSubmit">
            <!-- Error Alert -->
            <Alert v-if="error" variant="destructive">
              <AlertDescription>{{ error }}</AlertDescription>
            </Alert>

            <!-- Email Field -->
            <div class="space-y-2">
              <Label for="email">E-postadress</Label>
              <Input
                id="email"
                v-model="email"
                type="email"
                placeholder="din.epost@stadsmissionen.se"
                :disabled="isLoading"
                required
              />
            </div>

            <!-- Password Field -->
            <div class="space-y-2">
              <Label for="password">Lösenord</Label>
              <div class="relative">
                <Input
                  id="password"
                  v-model="password"
                  :type="showPassword ? 'text' : 'password'"
                  placeholder="Ange ditt lösenord"
                  :disabled="isLoading"
                  required
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  class="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  :disabled="isLoading"
                  @click="togglePasswordVisibility"
                >
                  <Eye v-if="!showPassword" class="h-4 w-4" />
                  <EyeOff v-else class="h-4 w-4" />
                </Button>
              </div>
            </div>

            <!-- Submit Button -->
            <Button type="submit" class="w-full" :disabled="isLoading">
              <div
                v-if="isLoading"
                class="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"
              />
              <LogIn v-else class="h-4 w-4 mr-2" />
              {{ isLoading ? 'Loggar in...' : 'Logga in' }}
            </Button>
          </form>

          <!-- Demo Credentials -->
          <div class="mt-6 pt-6 border-t border-gray-200">
            <p class="text-sm text-gray-600 mb-3">Demo-konton för testning:</p>

            <!-- Loading state for demo users -->
            <div v-if="loadingDemoUsers" class="flex items-center justify-center py-4">
              <div class="animate-spin rounded-full h-4 w-4 border-b-2 border-primary mr-2" />
              <span class="text-sm text-gray-500">Laddar demo-konton...</span>
            </div>

            <!-- Demo user buttons in a simple list -->
            <div v-else class="space-y-2">
              <div class="grid grid-cols-1 md:grid-cols-2 gap-2">
                <Button
                  v-for="user in sortedUsers"
                  :key="user.id"
                  variant="outline"
                  size="sm"
                  :disabled="isLoading"
                  class="text-left justify-start h-auto py-2 text-xs"
                  @click="fillDemoCredentials(user)"
                >
                  <div class="flex flex-col items-start w-full">
                    <div class="text-xs font-medium">{{ user.role }}</div>
                    <div class="text-xs text-muted-foreground mt-1">
                      {{ user.name }}
                    </div>
                  </div>
                </Button>
              </div>

              <!-- Fallback if no demo users loaded -->
              <div v-if="demoUsers.length === 0" class="text-sm text-gray-500 text-center py-2">
                Inga demo-konton tillgängliga
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <!-- Footer -->
      <div class="text-center mt-8 text-sm text-gray-500">
        <p>&copy; 2024 Östergötlands Stadsmission. Alla rättigheter förbehållna.</p>
      </div>
    </div>
  </div>
</template>
