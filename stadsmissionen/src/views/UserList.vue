<script setup lang="ts">
import { computed, ref } from 'vue';
import { useRouter } from 'vue-router';
import StandardHeader from '@/components/layout/StandardHeader.vue';
import ViewControls from '@/components/shared/ViewControls.vue';
import DataTable from '@/components/shared/DataTable.vue';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Edit, Plus, Trash2, UserPlus } from 'lucide-vue-next';
import type { LoginAccount, TableColumn, UIBreadcrumbItem, User } from '@/types';
import { useToast } from '@/composables/useToast';
import { useApiList } from '@/composables/useApi';
import api from '@/api';

const router = useRouter();
const toast = useToast();

// const router = useRouter()

// Breadcrumbs
const breadcrumbs: UIBreadcrumbItem[] = [
  { label: 'Inställningar', to: '/settings' },
  { label: 'Användare', to: '/settings/users' },
  { label: 'Inloggningskonton', isCurrentPage: true },
];

// Modal state
const isAddUserModalOpen = ref(false);

// New user form data
const newUser = ref({
  username: '',
  email: '',
  firstName: '',
  lastName: '',
  role: '',
  department: '',
  status: 'Aktiv' as const,
});

// Permission groups/roles
const permissionGroups = [
  { value: 'Administrator', label: 'Administratör' },
  { value: 'Moderator', label: 'Moderator' },
  { value: 'Användare', label: 'Användare' },
];

// Departments
const departments = [
  { value: 'IT', label: 'IT' },
  { value: 'Försäljning', label: 'Försäljning' },
  { value: 'Teknik', label: 'Teknik' },
  { value: 'Ekonomi', label: 'Ekonomi' },
];

// Fetch users with permission groups using relationship resolution
// This now uses the enhanced API that automatically resolves the permissionGroup relationship
// based on the foreign key permissionID in the users.json file
const {
  data: usersWithPermissionGroups,
  loading: usersLoading,
  error: usersError,
} = useApiList<User>(
  () =>
    api.users.getAll({
      include: ['permissionGroup'],
    }),
  {
    cacheKey: 'users-with-permission-groups',
  }
);

// Loading and error states
const isLoading = computed(() => Boolean(usersLoading.value));
const hasError = computed(() => usersError.value !== null);

// Transform API data to match LoginAccount interface
const loginAccounts = computed(() => {
  if (!usersWithPermissionGroups.value) return [];

  return usersWithPermissionGroups.value.map((user: User) => {
    return {
      id: user.id,
      username: user.email.split('@')[0],
      email: user.email,
      firstName: user.name.split(' ')[0] ?? '',
      lastName: user.name.split(' ').slice(1).join(' ') ?? '',
      role: user.permissionGroup?.name ?? 'Okänd grupp',
      status: 'Aktiv' as const,
      lastLogin: 'Aldrig',
      createdAt: '2024-01-01',
      department: 'IT',
    };
  });
});

// Column configuration
const columns: TableColumn<Record<string, unknown>>[] = [
  {
    key: 'email',
    label: 'E-post',
    sortable: true,
  },
  {
    key: 'fullName',
    label: 'Namn',
    sortable: true,
  },
  {
    key: 'role',
    label: 'Behörighetsgrupp',
    sortable: true,
    type: 'badge',
    badgeVariant: (value: unknown) => {
      switch (value as string) {
        case 'Administrator':
          return 'destructive';
        case 'Moderator':
          return 'default';
        case 'Användare':
          return 'secondary';
        default:
          return 'outline';
      }
    },
  },
  {
    key: 'actions',
    label: 'Åtgärder',
    sortable: false,
    type: 'actions',
    align: 'right',
  },
];

// Filter options for status
const statusFilterOptions = [
  { key: 'all', value: 'all', label: 'Alla statusar' },
  { key: 'Aktiv', value: 'Aktiv', label: 'Aktiv' },
  { key: 'Inaktiv', value: 'Inaktiv', label: 'Inaktiv' },
  { key: 'Låst', value: 'Låst', label: 'Låst' },
];

// Filter options for permission groups
const roleFilterOptions = [
  { key: 'all', value: 'all', label: 'Alla behörighetsgrupper' },
  { key: 'Administrator', value: 'Administrator', label: 'Administratör' },
  { key: 'Moderator', value: 'Moderator', label: 'Moderator' },
  { key: 'Användare', value: 'Användare', label: 'Användare' },
];

// Action buttons
const actionButtons = [
  {
    label: 'Lägg till användare',
    icon: Plus,
    onClick: openAddUserModal,
    class: 'text-xs h-8',
  },
];

// Statistics
const stats = computed(() => {
  if (!loginAccounts.value) {
    return [
      { label: 'Totalt antal användare', value: '0' },
      { label: 'Aktiva användare', value: '0' },
      { label: 'Låsta konton', value: '0' },
      { label: 'Administratörer', value: '0' },
    ];
  }
  return [
    {
      label: 'Totalt antal användare',
      value: loginAccounts.value.filter((account: any) => account.status === 'Aktiv' || account.status === 'Inaktiv' || account.status === 'Låst').length.toString(),
    },
    {
      label: 'Aktiva användare',
      value: loginAccounts.value.filter((account: any) => account.status === 'Aktiv').length.toString(),
    },
    {
      label: 'Låsta konton',
      value: loginAccounts.value.filter((account: any) => account.status === 'Låst').length.toString(),
    },
    {
      label: 'Administratörer',
      value: loginAccounts.value.filter((account: any) => account.role === 'Administrator').length.toString(),
    },
  ];
});

// Table data with computed full name
const tableData = computed(() =>
  loginAccounts.value.map((account: any) => ({
    ...account,
    fullName: `${account.firstName} ${account.lastName}`.trim(),
  }))
);

// Search and filter state
const searchQuery = ref('');
const statusFilter = ref('all');
const roleFilter = ref('all');

// Filtered data
const filteredData = computed(() => {
  let filtered = tableData.value;

  // Apply search filter
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase();
    filtered = filtered.filter((account: any) =>
      account.email.toLowerCase().includes(query) ||
      account.fullName.toLowerCase().includes(query) ||
      account.username.toLowerCase().includes(query)
    );
  }

  // Apply status filter
  if (statusFilter.value !== 'all') {
    filtered = filtered.filter((account: any) => account.status === statusFilter.value);
  }

  // Apply role filter
  if (roleFilter.value !== 'all') {
    filtered = filtered.filter((account: any) => account.role === roleFilter.value);
  }

  return filtered;
});

// Action methods
function openAddUserModal() {
  isAddUserModalOpen.value = true;
}

function closeAddUserModal() {
  isAddUserModalOpen.value = false;
  resetNewUserForm();
}

function resetNewUserForm() {
  newUser.value = {
    username: '',
    email: '',
    firstName: '',
    lastName: '',
    role: '',
    department: '',
    status: 'Aktiv',
  };
}

function addUser() {
  // Validate form
  if (
    !newUser.value.email ||
    !newUser.value.firstName ||
    !newUser.value.lastName ||
    !newUser.value.role
  ) {
    try {
      (toast as any).addToast('Vänligen fyll i alla obligatoriska fält', 'error');
    } catch (_error) {
      console.error('Failed to show toast');
    }
    return;
  }

  // Create new user account
  const newUserAccount: LoginAccount = {
    id: Math.max(...loginAccounts.value.map((acc: any) => acc.id)) + 1,
    username: newUser.value.username ?? newUser.value.email.split('@')[0],
    email: newUser.value.email,
    firstName: newUser.value.firstName,
    lastName: newUser.value.lastName,
    role: newUser.value.role,
    status: newUser.value.status,
    lastLogin: 'Aldrig',
    createdAt: new Date().toISOString().split('T')[0] || '',
    department: newUser.value.department,
  };

  // Add to list (in real app, this would be an API call)
  loginAccounts.value.push(newUserAccount);

  try {
    (toast as any).addToast('Användare skapad framgångsrikt', 'success');
  } catch (_error) {
    console.error('Failed to show toast');
  }
  closeAddUserModal();
}

function editUser(item: Record<string, unknown>) {
  const user = item as unknown as LoginAccount & { fullName: string };
  router.push(`/settings/login-accounts/${user.id}`);
}

function deleteUser(item: Record<string, unknown>) {
  const user = item as unknown as LoginAccount & { fullName: string };
  const userId = user.id;
  const index = loginAccounts.value.findIndex((acc: any) => acc.id === userId);
  if (index > -1) {
    loginAccounts.value.splice(index, 1);
    try {
      (toast as any).addToast('Användare raderad', 'success');
    } catch (_error) {
      console.error('Failed to show toast');
    }
  }
}

// Row actions
const rowActions = [
  {
    label: 'Redigera',
    icon: Edit,
    onClick: editUser,
    variant: 'ghost' as const,
  },
  {
    label: 'Radera',
    icon: Trash2,
    onClick: deleteUser,
    variant: 'ghost' as const,
    class: 'text-destructive hover:text-destructive',
  },
];

// In template, use a method for reload instead of direct globalThis.location.reload()
function reloadPage() {
  window.location.reload();
}
</script>

<template>
  <div class="w-full">
    <StandardHeader
      title="Inloggningskonton"
      :breadcrumbs="breadcrumbs"
      description="Hantera användarnas inloggningskonton och behörigheter"
      show-stats
      :stats="stats"
    />

    <!-- Loading State -->
    <div v-if="isLoading" class="flex items-center justify-center py-12">
      <div class="text-center">
        <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4" />
        <p class="text-muted-foreground">Laddar användare...</p>
      </div>
    </div>

    <!-- Error State -->
    <div v-else-if="hasError" class="flex items-center justify-center py-12">
      <div class="text-center">
        <p class="text-destructive mb-2">Ett fel uppstod vid laddning av användare</p>
        <Button variant="outline" @click="reloadPage">Försök igen</Button>
      </div>
    </div>

    <!-- Main Content -->
    <div v-else>
      <!-- Controls -->
      <ViewControls
        v-model:search-query="searchQuery"
        v-model:status-filter="statusFilter"
        v-model:secondary-filter="roleFilter"
        :action-buttons="actionButtons"
        :filter-options="statusFilterOptions"
        :secondary-filter-options="roleFilterOptions"
        secondary-filter-label="Behörighetsgrupp"
        search-placeholder="Sök användare..."
      />

      <!-- Data Table -->
      <DataTable
        :data="filteredData"
        :columns="columns"
        :row-actions="rowActions"
        :loading="isLoading"
        empty-message="Inga användare hittades"
        @row-click="editUser"
      />
    </div>

    <!-- Add User Modal -->
    <Dialog v-model:open="isAddUserModalOpen">
      <DialogContent class="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Lägg till ny användare</DialogTitle>
        </DialogHeader>

        <div class="grid gap-4 py-4">
          <div class="grid grid-cols-2 gap-4">
            <div class="space-y-2">
              <Label for="firstName">Förnamn *</Label>
              <Input id="firstName" v-model="newUser.firstName" placeholder="Ange förnamn" />
            </div>
            <div class="space-y-2">
              <Label for="lastName">Efternamn *</Label>
              <Input id="lastName" v-model="newUser.lastName" placeholder="Ange efternamn" />
            </div>
          </div>

          <div class="space-y-2">
            <Label for="email">E-post *</Label>
            <Input
              id="email"
              v-model="newUser.email"
              type="email"
              placeholder="anvandare@example.com"
            />
          </div>

          <div class="space-y-2">
            <Label for="username">Användarnamn</Label>
            <Input
              id="username"
              v-model="newUser.username"
              placeholder="Lämna tomt för att använda e-post"
            />
          </div>

          <div class="grid grid-cols-2 gap-4">
            <div class="space-y-2">
              <Label for="role">Behörighetsgrupp *</Label>
              <Select v-model="newUser.role">
                <SelectTrigger>
                  <SelectValue placeholder="Välj behörighetsgrupp" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem
                    v-for="group in permissionGroups"
                    :key="group.value"
                    :value="group.value"
                  >
                    {{ group.label }}
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div class="space-y-2">
              <Label for="department">Avdelning</Label>
              <Select v-model="newUser.department">
                <SelectTrigger>
                  <SelectValue placeholder="Välj avdelning" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem v-for="dept in departments" :key="dept.value" :value="dept.value">
                    {{ dept.label }}
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        <div class="flex justify-end gap-3">
          <Button variant="outline" @click="closeAddUserModal">Avbryt</Button>
          <Button @click="addUser">
            <UserPlus class="mr-2 h-4 w-4" />
            Skapa användare
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  </div>
</template>
