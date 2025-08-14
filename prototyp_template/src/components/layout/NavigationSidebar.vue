<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router';
import { computed } from 'vue';
import { useCompanySettings } from '@/composables/useCompanySettings';
import { bottomNavigationItems, mainNavigationItems } from '@/router';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { onMounted, ref } from 'vue';
import { ChevronDown, ChevronRight, LogOut, Palette, Settings, User } from 'lucide-vue-next';
// Props
interface Props {
  logoSrc?: string;
  logoAlt?: string;
  currentUser?: {
    id: number;
    name: string;
    email: string;
    role: string;
    permissionGroup?: {
      id: number;
      name: string;
      administreraInloggningskonton: boolean;
      hanteraAnvandare: boolean;
      laddaUppOchRedigera: boolean;
      visaOchLaddaNer: boolean;
      lasaPubliceradeNyheter: boolean;
      publiceranyheter: boolean;
      administreraKategorier: boolean;
      redigeraVerksamheter: boolean;
      skapaVerksamheter: boolean;
    };
  } | null;
}

const props = withDefaults(defineProps<Props>(), {
  logoSrc: '',
  logoAlt: 'Project Specific',
  currentUser: () => ({
    id: 1,
    name: 'Lars Thomas',
    email: 'lars.thomas@example.com',
    role: 'Administrator',
  }),
});

const router = useRouter();
const route = useRoute();

// State for expanded menu items
const expandedMenuItems = ref<Set<string>>(new Set());

const themes = [
  { name: 'Project Specific Theme', value: 'project-specific', class: 'theme_project-specific' },
  { name: 'Default', value: 'default', class: 'theme_default' },
  { name: 'Dark', value: 'dark', class: 'dark' },
];

const currentTheme = ref('project-specific');

const navigateTo = (path: string) => {
  router.push(path);
};

const isActiveRoute = (path: string) => {
  return route.path === path;
};

const toggleMenuExpansion = (itemName: string) => {
  if (expandedMenuItems.value.has(itemName)) {
    expandedMenuItems.value.delete(itemName);
  } else {
    expandedMenuItems.value.add(itemName);
  }
};

const isMenuExpanded = (itemName: string) => {
  return expandedMenuItems.value.has(itemName);
};

const setTheme = (theme: (typeof themes)[0] | undefined) => {
  if (!theme) return;

  currentTheme.value = theme.value;

  // Remove all theme classes
  document.documentElement.classList.remove(
    'dark',
    'theme_project-specific',
    'theme_default',
    'theme_pink'
  );

  // Add the new theme class
  if (theme.class) {
    document.documentElement.classList.add(theme.class);
  }

  // Store theme preference
  localStorage.setItem('theme', theme.value);
};

// Load saved theme on mount
onMounted(() => {
  const savedTheme = localStorage.getItem('theme') ?? 'project-specific';
  const theme = themes.find(t => t.value === savedTheme);
  if (theme) {
    setTheme(theme);
  }
});

// Check if any child route of a dropdown menu is active
type NavChild = { path: string; icon?: unknown; name?: string };
type NavSection = { children: NavChild[] };
type NavItem = { name: string; icon?: unknown; path?: string; dropdown?: NavSection[] };
const hasActiveChild = (item: NavItem) => {
  if (!item.dropdown) return false;
  return item.dropdown.some(section => section.children.some(child => isActiveRoute(child.path)));
};

// Emits for parent component
const emit = defineEmits<{
  userAction: [action: 'profile' | 'settings' | 'logout'];
}>();

const handleUserAction = (action: 'profile' | 'settings' | 'logout') => {
  emit('userAction', action);
};

// Handle image loading errors
const handleImageError = (event: Event) => {
  const img = event.target as HTMLImageElement;
  if (img.src !== '/images/logo-placeholder.png') {
    img.src = '/images/logo-placeholder.png';
  }
};

// Safe computed logo URL (guards SSR / non-browser contexts)
const { logoUrl: computedLogo } = useCompanySettings();
const sidebarLogoUrl = computed(() => computedLogo.value || props.logoSrc || '/images/logo-placeholder.png');
</script>

<template>
  <aside class="w-64 bg-card border-r border-border flex flex-col">
    <!-- Sidebar Header -->
    <div class="p-3 flex flex-col" style="min-height: 96px;">
      <div class="mx-auto w-28 h-14 flex items-center justify-center flex-1">
        <img
          :src="sidebarLogoUrl"
          :alt="logoAlt || 'Project Specific'"
          class="max-w-full max-h-full object-contain"
          @error="handleImageError"
        />
      </div>
    </div>

    <!-- Main Navigation Section -->
    <nav class="flex-1 p-4 space-y-1">
      <template v-for="item in mainNavigationItems" :key="item.path">
        <!-- Regular navigation item without dropdown -->
        <Button
          v-if="!item.dropdown"
          :variant="isActiveRoute(item.path) ? 'default' : 'ghost'"
          class="w-full justify-start gap-3 h-10"
          @click="navigateTo(item.path)"
        >
          <component :is="item.icon" class="h-4 w-4" />
          {{ item.name }}
        </Button>

        <!-- Expandable navigation item -->
        <div v-else class="space-y-1">
          <!-- Main section header - clickable to expand/collapse -->
          <Button
            variant="ghost"
            class="w-full justify-start gap-3 h-10"
            :class="{
              'bg-accent/50 hover:bg-accent/70': hasActiveChild(item),
              'text-foreground': hasActiveChild(item),
            }"
            @click="toggleMenuExpansion(item.name)"
          >
            <component :is="item.icon" class="h-4 w-4" />
            <span class="flex-1 text-left">{{ item.name }}</span>
            <component
              :is="isMenuExpanded(item.name) ? ChevronDown : ChevronRight"
              class="h-4 w-4"
            />
          </Button>

          <!-- Submenu items - only show when expanded -->
          <div
            v-if="isMenuExpanded(item.name)"
            class="space-y-1 ml-5 pl-3 border-l border-primary/30"
          >
            <template
              v-for="(section, sectionIndex) in item.dropdown"
              :key="`section-${sectionIndex}`"
            >
              <template v-for="child in section.children" :key="child.path">
                <Button
                  :variant="isActiveRoute(child.path) ? 'default' : 'ghost'"
                  class="w-full justify-start gap-3 h-8 pl-6 text-sm"
                  @click="navigateTo(child.path)"
                >
                  <component :is="child.icon" class="h-3 w-3" />
                  {{ child.name }}
                </Button>
              </template>
            </template>
          </div>
        </div>
      </template>
    </nav>

    <!-- Bottom Navigation Section -->
    <div class="p-4 space-y-1">
      <Separator class="mb-3" />

      <!-- Bottom Navigation Items -->
      <template v-for="item in bottomNavigationItems" :key="item.path">
        <!-- Regular navigation item without dropdown -->
        <Button
          v-if="!item.dropdown"
          :variant="isActiveRoute(item.path) ? 'default' : 'ghost'"
          class="w-full justify-start gap-3 h-10"
          @click="navigateTo(item.path)"
        >
          <component :is="item.icon" class="h-4 w-4" />
          {{ item.name }}
        </Button>

        <!-- Expandable navigation item -->
        <div v-else class="space-y-1">
          <!-- Main section header - clickable to expand/collapse -->
          <Button
            variant="ghost"
            class="w-full justify-start gap-3 h-10"
            :class="{
              'bg-accent/50 hover:bg-accent/70': hasActiveChild(item),
              'text-foreground': hasActiveChild(item),
            }"
            @click="toggleMenuExpansion(item.name)"
          >
            <component :is="item.icon" class="h-4 w-4" />
            <span class="flex-1 text-left">{{ item.name }}</span>
            <component
              :is="isMenuExpanded(item.name) ? ChevronDown : ChevronRight"
              class="h-4 w-4"
            />
          </Button>

          <!-- Submenu items - only show when expanded -->
          <div
            v-if="isMenuExpanded(item.name)"
            class="space-y-1 ml-5 pl-3 border-l border-primary/30"
          >
            <template
              v-for="(section, sectionIndex) in item.dropdown"
              :key="`bottom-section-${sectionIndex}`"
            >
              <template v-for="child in section.children" :key="child.path">
                <Button
                  :variant="isActiveRoute(child.path) ? 'default' : 'ghost'"
                  class="w-full justify-start gap-3 h-8 pl-6 text-sm"
                  @click="navigateTo(child.path)"
                >
                  <component :is="child.icon" class="h-3 w-3" />
                  {{ child.name }}
                </Button>
              </template>
            </template>
          </div>
        </div>
      </template>

      <!-- Theme Switcher -->
      <DropdownMenu>
        <DropdownMenuTrigger as-child>
          <Button variant="ghost" class="w-full justify-start gap-3 h-10">
            <Palette class="h-4 w-4" />
            <span class="flex-1 text-left">Themes</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" class="w-48">
          <DropdownMenuLabel>Välj tema</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            v-for="theme in themes"
            :key="theme.value"
            class="cursor-pointer"
            @click="setTheme(theme)"
          >
            <span class="flex items-center">
              <span
                class="w-3 h-3 rounded-full mr-2 border"
                :class="{
                  'border-gray-600': theme.value === 'project-specific',
                  'bg-gray-100 border-gray-300': theme.value === 'default',
                  'bg-gray-800 border-gray-600': theme.value === 'dark',
                  'bg-fuchsia-500 border-fuchsia-600': theme.value === 'fuchsia',
                  'bg-purple-500 border-purple-600': theme.value === 'purple',
                  'bg-amber-500 border-amber-600': theme.value === 'amber',
                  'bg-sky-500 border-sky-600': theme.value === 'sky',
                  'bg-pink-500 border-pink-600': theme.value === 'pink',
                }"
                :style="theme.value === 'project-specific' ? { backgroundColor: '#0071ba' } : {}"
              />
              {{ theme.name }}
              <span v-if="currentTheme === theme.value" class="ml-auto">✓</span>
            </span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
    <Separator />

    <!-- User Info -->
    <div class="p-4">
      <div class="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
        <div class="flex-shrink-0">
          <div class="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
            <User class="h-4 w-4 text-primary-foreground" />
          </div>
        </div>
        <div class="flex-1 min-w-0">
          <p class="text-xs font-medium text-foreground truncate">
            {{ currentUser?.name ?? 'Unknown User' }}
          </p>
          <p class="text-xs text-muted-foreground truncate">
            {{ currentUser?.role ?? 'No Role' }}
          </p>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger as-child>
            <Button variant="ghost" size="sm" class="h-8 w-8 p-0">
              <LogOut class="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" class="w-48">
            <DropdownMenuLabel>{{ currentUser?.email ?? 'No Email' }}</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem class="cursor-pointer" @click="handleUserAction('profile')">
              <User class="mr-2 h-4 w-4" />
              Profil
            </DropdownMenuItem>
            <DropdownMenuItem class="cursor-pointer" @click="handleUserAction('settings')">
              <Settings class="mr-2 h-4 w-4" />
              Inställningar
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              class="cursor-pointer text-red-600"
              @click="handleUserAction('logout')"
            >
              <LogOut class="mr-2 h-4 w-4" />
              Logga ut
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  </aside>
</template>
