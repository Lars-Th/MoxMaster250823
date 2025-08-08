<script setup lang="ts">
import { computed, onMounted } from 'vue';
import { RouterView, useRoute } from 'vue-router';
import { mapPermissionGroupToDetailed, useAuth } from './composables/useAuth';
import NavigationSidebar from './components/layout/NavigationSidebar.vue';
import ToastContainer from './components/common/ToastContainer.vue';
import ErrorBoundary from './components/common/ErrorBoundary.vue';

const { currentUser, isAuthenticated, logout, initializeAuth } = useAuth();
const route = useRoute();

// Initialize authentication on app start
onMounted(async () => {
  await initializeAuth();
});

// Handle user actions from sidebar
const handleUserAction = async (action: 'profile' | 'settings' | 'logout') => {
  switch (action) {
    case 'profile':
      console.log('Navigate to profile');
      break;
    case 'settings':
      console.log('Navigate to settings');
      break;
    case 'logout':
      await logout();
      break;
  }
};

const sidebarUser = computed(() => {
  if (!currentUser.value) return undefined;
  const user = currentUser.value;
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    permissionGroup: user.permissionGroup
      ? mapPermissionGroupToDetailed(user.permissionGroup)
      : undefined,
  };
});
</script>

<template>
  <ErrorBoundary show-details>
    <!-- Authenticated Layout -->
    <div v-if="isAuthenticated && route.name !== 'login'" class="flex h-screen bg-background">
      <!-- Navigation Sidebar -->
      <NavigationSidebar :current-user="sidebarUser" @user-action="handleUserAction" />

      <!-- Main Content Area -->
      <main class="flex-1 overflow-auto bg-background">
        <RouterView />
      </main>

      <!-- Toast Container -->
      <ToastContainer />
    </div>

    <!-- Login Layout -->
    <div v-else class="h-screen bg-background">
      <RouterView />
      <ToastContainer />
    </div>
  </ErrorBoundary>
</template>

<style lang="scss" scoped>
.logo {
  height: 6em;
  padding: 1.5em;
  will-change: filter;
  transition: filter 300ms;
}

.logo:hover {
  filter: drop-shadow(0 0 2em #646cffaa);
}

.logo.vue:hover {
  filter: drop-shadow(0 0 2em #42b883aa);
}
</style>
