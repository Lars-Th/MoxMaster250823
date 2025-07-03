<script setup lang="ts">
import { computed, nextTick, onMounted, ref, shallowRef } from 'vue';
import {
  ChevronDown,
  ChevronRight,
  Download,
  Edit,
  FileText,
  Folder,
  FolderOpen,
  Laptop,
  Monitor,
  Plus,
  Settings,
  Smartphone,
  Trash2,
  Upload,
  User,
} from 'lucide-vue-next';
import StandardHeader from '@/components/layout/StandardHeader.vue';
import { Button } from '@/components/ui/button';

// Import all components
import DataTable from '@/components/shared/DataTable.vue';
import ViewControls from '@/components/shared/ViewControls.vue';
import DetailPage from '@/components/shared/DetailPage.vue';
import ComplexDetailPage from '@/components/shared/ComplexDetailPage.vue';
import ExtendedDetailPage from '@/components/shared/ExtendedDetailPage.vue';
import ListPage from '@/components/shared/ListPage.vue';
import LoadingSpinner from '@/components/common/LoadingSpinner.vue';
import ErrorBoundary from '@/components/common/ErrorBoundary.vue';
import NavigationSidebar from '@/components/layout/NavigationSidebar.vue';

// User components
import PasswordChangeDialog from '@/components/features/user/PasswordChangeDialog.vue';

// Toast Example component
import ToastExample from '@/components/features/development/ToastExample.vue';

// File tree structure
interface TreeNode {
  name: string;
  path: string;
  type: 'folder' | 'file';
  children?: TreeNode[];
  component?: any;
  props?: any;
}

const fileTree: TreeNode[] = [
  {
    name: 'pages',
    path: 'pages',
    type: 'folder',
    children: [],
  },
  {
    name: 'common',
    path: 'common',
    type: 'folder',
    children: [
      {
        name: 'ErrorBoundary.vue',
        path: 'common/ErrorBoundary.vue',
        type: 'file',
        component: ErrorBoundary,
        props: { fallback: 'Something went wrong in this component' },
      },
      {
        name: 'LoadingSpinner.vue',
        path: 'common/LoadingSpinner.vue',
        type: 'file',
        component: LoadingSpinner,
      },
    ],
  },
  {
    name: 'features',
    path: 'features',
    type: 'folder',
    children: [
      {
        name: 'user',
        path: 'features/user',
        type: 'folder',
        children: [
          {
            name: 'PasswordChangeDialog.vue',
            path: 'features/user/PasswordChangeDialog.vue',
            type: 'file',
            component: PasswordChangeDialog,
            props: {
              open: true,
              user: { id: '1', namn: 'Demo User', epost: 'demo@example.com' },
            },
          },
        ],
      },
    ],
  },
  {
    name: 'layout',
    path: 'layout',
    type: 'folder',
    children: [
      {
        name: 'NavigationSidebar.vue',
        path: 'layout/NavigationSidebar.vue',
        type: 'file',
        component: NavigationSidebar,
        props: {
          isCollapsed: false,
        },
      },

      {
        name: 'StandardHeader.vue',
        path: 'layout/StandardHeader.vue',
        type: 'file',
        component: StandardHeader,
        props: {
          title: 'Demo Header Titel',
          breadcrumbs: [
            { label: 'Dashboard', to: '/dashboard' },
            { label: 'Layout', to: '/layout' },
            { label: 'Headers', to: '/headers' },
            { label: 'Demo Header', isCurrentPage: true },
          ],
          showStats: true,
          stats: [
            { label: 'Användare', value: 1247, color: 'text-blue-600' },
            { label: 'Aktiva', value: 892, color: 'text-green-600' },
            { label: 'Väntar', value: 64, color: 'text-orange-600' },
            { label: 'Inaktiva', value: 291, color: 'text-red-600' },
          ],
        },
      },
    ],
  },
  {
    name: 'shared',
    path: 'shared',
    type: 'folder',
    children: [
      {
        name: 'DataTable.vue',
        path: 'shared/DataTable.vue',
        type: 'file',
        component: DataTable,
        props: {
          columns: [
            { key: 'name', label: 'Namn', sortable: true },
            { key: 'email', label: 'E-post', sortable: true },
            { key: 'phone', label: 'Telefon', sortable: true, class: 'hidden sm:table-cell' },
            {
              key: 'department',
              label: 'Avdelning',
              sortable: true,
              class: 'hidden md:table-cell',
            },
            {
              key: 'status',
              label: 'Status',
              sortable: true,
              type: 'badge',
              class: 'hidden lg:table-cell',
              badgeVariant: (value: string) => (value === 'active' ? 'default' : 'secondary'),
            },
            {
              key: 'lastLogin',
              label: 'Senast inloggad',
              sortable: true,
              class: 'hidden xl:table-cell',
              format: (value: string) =>
                value ? new Date(value).toLocaleDateString('sv-SE') : '-',
            },
            { key: 'actions', label: 'Åtgärder', type: 'actions', width: '120px', align: 'right' },
          ],
          data: [
            {
              id: 1,
              name: 'John Doe',
              email: 'john@example.com',
              phone: '070-123 45 67',
              department: 'IT',
              status: 'active',
              lastLogin: '2024-01-20T10:30:00Z',
            },
            {
              id: 2,
              name: 'Jane Smith',
              email: 'jane@example.com',
              phone: '070-234 56 78',
              department: 'HR',
              status: 'active',
              lastLogin: '2024-01-19T14:15:00Z',
            },
            {
              id: 3,
              name: 'Bob Johnson',
              email: 'bob@example.com',
              phone: '070-345 67 89',
              department: 'Sales',
              status: 'inactive',
              lastLogin: '2024-01-10T09:00:00Z',
            },
            {
              id: 4,
              name: 'Alice Williams',
              email: 'alice@example.com',
              phone: '070-456 78 90',
              department: 'Marketing',
              status: 'active',
              lastLogin: '2024-01-21T16:45:00Z',
            },
            {
              id: 5,
              name: 'Charlie Brown',
              email: 'charlie@example.com',
              phone: '070-567 89 01',
              department: 'Finance',
              status: 'active',
              lastLogin: '2024-01-18T11:20:00Z',
            },
          ],
          searchFields: ['name', 'email', 'phone', 'department'],
        },
      },
      {
        name: 'ListPage.vue',
        path: 'shared/ListPage.vue',
        type: 'file',
        component: ListPage,
        props: {
          title: 'Demo Lista',
          description: 'En demonstration av ListPage-komponenten',
          breadcrumbs: [
            { label: 'Dashboard', to: '/dashboard' },
            { label: 'Demo', to: '/demo' },
            { label: 'Lista', isCurrentPage: true },
          ],
          showStats: true,
          stats: [
            { label: 'Totalt', value: 156, color: 'text-blue-600' },
            { label: 'Aktiva', value: 142, color: 'text-green-600' },
            { label: 'Väntar', value: 8, color: 'text-orange-600' },
            { label: 'Inaktiva', value: 6, color: 'text-red-600' },
          ],
          searchQuery: '',
          searchPlaceholder: 'Sök demo objekt...',
          addActions: [
            {
              label: 'Lägg till objekt',
              icon: Plus,
              onClick: () => console.log('Add object clicked'),
              variant: 'default',
            },
          ],
          filters: [
            {
              modelValue: 'all',
              placeholder: 'Status',
              options: [
                { key: 'all', label: 'Alla status', value: 'all' },
                { key: 'active', label: 'Aktiva', value: 'active' },
                { key: 'inactive', label: 'Inaktiva', value: 'inactive' },
              ],
              onChange: (value: any) => console.log('Filter changed:', value),
            },
          ],
          data: [
            {
              id: 1,
              name: 'Demo Objekt 1',
              status: 'active',
              created: '2024-01-20',
              category: 'Kategori A',
            },
            {
              id: 2,
              name: 'Demo Objekt 2',
              status: 'inactive',
              created: '2024-01-19',
              category: 'Kategori B',
            },
            {
              id: 3,
              name: 'Demo Objekt 3',
              status: 'active',
              created: '2024-01-18',
              category: 'Kategori A',
            },
          ],
          columns: [
            { key: 'name', label: 'Namn', sortable: true },
            { key: 'status', label: 'Status', sortable: true, type: 'custom' },
            { key: 'category', label: 'Kategori', sortable: true },
            { key: 'created', label: 'Skapad', sortable: true },
            { key: 'actions', label: 'Åtgärder', type: 'actions', width: '120px' },
          ],
          totalItems: 3,
          currentPage: 1,
          itemsPerPage: 10,
          loading: false,
        },
      },
      {
        name: 'ViewControls.vue',
        path: 'shared/ViewControls.vue',
        type: 'file',
        component: ViewControls,
        props: {
          addActions: [
            {
              label: 'Lägg till komponent',
              icon: Plus,
              onClick: () => console.log('Add component clicked'),
              variant: 'default',
            },
            {
              label: 'Importera',
              icon: Upload,
              onClick: () => console.log('Import clicked'),
              variant: 'default',
              class: 'bg-blue-600 hover:bg-blue-700 text-white',
            },
          ],
          additionalActions: [
            {
              label: 'Exportera',
              icon: Download,
              onClick: () => console.log('Export clicked'),
              variant: 'outline',
            },
            {
              label: 'Inställningar',
              icon: Settings,
              onClick: () => console.log('Settings clicked'),
              variant: 'outline',
            },
          ],
          filters: [
            {
              modelValue: 'all',
              placeholder: 'Status',
              options: [
                { key: 'all', label: 'Alla status', value: 'all' },
                { key: 'active', label: 'Aktiva', value: 'active' },
                { key: 'inactive', label: 'Inaktiva', value: 'inactive' },
              ],
              onChange: (value: any) => console.log('Status filter changed:', value),
            },
            {
              modelValue: 'all',
              placeholder: 'Typ',
              options: [
                { key: 'all', label: 'Alla typer', value: 'all' },
                { key: 'component', label: 'Komponenter', value: 'component' },
                { key: 'page', label: 'Sidor', value: 'page' },
                { key: 'layout', label: 'Layout', value: 'layout' },
              ],
              onChange: (value: any) => console.log('Type filter changed:', value),
            },
          ],
          searchQuery: '',
          searchPlaceholder: 'Sök komponenter...',
          showSearch: true,
        },
      },

      {
        name: 'DetailPage.vue',
        path: 'shared/DetailPage.vue',
        type: 'file',
        component: DetailPage,
        props: {
          title: 'Demo Detaljer',
          description: 'En demonstration av DetailPage-komponenten',
          breadcrumbs: [
            { label: 'Dashboard', to: '/overview' },
            { label: 'Demo', to: '/demo' },
            { label: 'Detaljer', isCurrentPage: true },
          ],
          showStats: true,
          stats: [
            { label: 'Skapad', value: '2024-01-20', color: 'text-blue-600' },
            { label: 'Status', value: 'Aktiv', color: 'text-green-600' },
            { label: 'Uppdaterad', value: '2024-01-21', color: 'text-orange-600' },
          ],
          data: {
            name: 'Demo Produkt',
            description: 'En fantastisk demo produkt som visar alla funktioner',
            category: 'elektronik',
            price: 1299,
            status: 'active',
            manufacturer: 'Demo AB',
            model: 'DM-2024',
            serialNumber: 'DM240120001',
            purchaseDate: '2024-01-15',
            warrantyExpires: '2026-01-15',
            location: 'Lager A, Hylla 12',
            notes:
              'Denna produkt är en demonstration av DetailPage-komponenten och visar hur data presenteras på ett strukturerat sätt.',
          },
          mainFields: [
            { key: 'name', label: 'Produktnamn', type: 'text' },
            { key: 'description', label: 'Beskrivning', type: 'textarea' },
            {
              key: 'category',
              label: 'Kategori',
              type: 'select',
              options: [
                { value: 'elektronik', label: 'Elektronik' },
                { value: 'kläder', label: 'Kläder' },
                { value: 'böcker', label: 'Böcker' },
              ],
            },
            { key: 'price', label: 'Pris (SEK)', type: 'number' },
            { key: 'manufacturer', label: 'Tillverkare', type: 'text' },
            { key: 'model', label: 'Modell', type: 'text' },
          ],
          sidebarFields: [
            {
              key: 'status',
              label: 'Status',
              type: 'select',
              options: [
                { value: 'active', label: 'Aktiv' },
                { value: 'inactive', label: 'Inaktiv' },
                { value: 'discontinued', label: 'Utgått' },
              ],
            },
            { key: 'serialNumber', label: 'Serienummer', type: 'text' },
            { key: 'purchaseDate', label: 'Inköpsdatum', type: 'date' },
            { key: 'warrantyExpires', label: 'Garanti utgår', type: 'date' },
            { key: 'location', label: 'Plats', type: 'text' },
            { key: 'notes', label: 'Anteckningar', type: 'textarea' },
          ],
          readonly: false,
          hasUnsavedChanges: false,
        },
      },

      {
        name: 'ComplexDetailPage.vue',
        path: 'shared/ComplexDetailPage.vue',
        type: 'file',
        component: ComplexDetailPage,
        props: {
          title: 'Komplex Demo Sida',
          description: 'En demonstration av ComplexDetailPage-komponenten',
          breadcrumbs: [
            { label: 'Dashboard', to: '/overview' },
            { label: 'Demo', to: '/demo' },
            { label: 'Komplex', isCurrentPage: true },
          ],
          showStats: true,
          stats: [
            { label: 'Komponenter', value: 12, color: 'text-blue-600' },
            { label: 'Sektioner', value: 5, color: 'text-green-600' },
            { label: 'Interaktioner', value: 8, color: 'text-purple-600' },
          ],
          data: {
            projectName: 'Avancerat Demo Projekt',
            projectDescription:
              'Ett komplext projekt som demonstrerar alla funktioner i ComplexDetailPage-komponenten',
            projectManager: 'Anna Svensson',
            department: 'utveckling',
            priority: 'hög',
            budget: 250000,
            startDate: '2024-01-01',
            endDate: '2024-12-31',
            status: 'pågående',
            completionPercentage: 65,
            teamSize: 8,
            lastUpdated: '2024-01-21',
            notes:
              'Detta projekt visar hur ComplexDetailPage kan hantera stora mängder data och komplexa relationer mellan olika objekt.',
          },
          mainFields: [
            { key: 'projectName', label: 'Projektnamn', type: 'text' },
            { key: 'projectDescription', label: 'Beskrivning', type: 'textarea' },
            { key: 'projectManager', label: 'Projektledare', type: 'text' },
            {
              key: 'department',
              label: 'Avdelning',
              type: 'select',
              options: [
                { value: 'utveckling', label: 'Utveckling' },
                { value: 'design', label: 'Design' },
                { value: 'marknadsföring', label: 'Marknadsföring' },
              ],
            },
            { key: 'budget', label: 'Budget (SEK)', type: 'number' },
            { key: 'teamSize', label: 'Teamstörlek', type: 'number' },
          ],
          sidebarFields: [
            {
              key: 'status',
              label: 'Status',
              type: 'select',
              options: [
                { value: 'planering', label: 'Planering' },
                { value: 'pågående', label: 'Pågående' },
                { value: 'pausad', label: 'Pausad' },
                { value: 'avslutad', label: 'Avslutad' },
              ],
            },
            {
              key: 'priority',
              label: 'Prioritet',
              type: 'select',
              options: [
                { value: 'låg', label: 'Låg' },
                { value: 'medel', label: 'Medel' },
                { value: 'hög', label: 'Hög' },
                { value: 'kritisk', label: 'Kritisk' },
              ],
            },
            { key: 'startDate', label: 'Startdatum', type: 'date' },
            { key: 'endDate', label: 'Slutdatum', type: 'date' },
            { key: 'completionPercentage', label: 'Färdigställande (%)', type: 'number' },
            { key: 'lastUpdated', label: 'Senast uppdaterad', type: 'date' },
          ],
          subTables: [
            {
              key: 'team',
              title: 'Projektteam',
              data: [
                {
                  id: 1,
                  name: 'Erik Andersson',
                  role: 'Utvecklare',
                  email: 'erik@example.com',
                  active: true,
                },
                {
                  id: 2,
                  name: 'Maria Johansson',
                  role: 'Designer',
                  email: 'maria@example.com',
                  active: true,
                },
                {
                  id: 3,
                  name: 'Lars Pettersson',
                  role: 'Testare',
                  email: 'lars@example.com',
                  active: false,
                },
              ],
              columns: [
                { key: 'name', label: 'Namn', sortable: true },
                { key: 'role', label: 'Roll', sortable: true },
                { key: 'email', label: 'E-post', sortable: true },
                {
                  key: 'active',
                  label: 'Aktiv',
                  type: 'badge',
                  badgeVariant: (value: boolean) => (value ? 'default' : 'secondary'),
                },
                {
                  key: 'actions',
                  label: 'Åtgärder',
                  type: 'actions',
                  width: '120px',
                  align: 'right',
                },
              ],
              allowAdd: true,
              allowEdit: true,
              allowDelete: true,
            },
            {
              key: 'tasks',
              title: 'Uppgifter',
              data: [
                {
                  id: 1,
                  title: 'Designa UI',
                  status: 'completed',
                  assignee: 'Maria Johansson',
                  dueDate: '2024-01-15',
                },
                {
                  id: 2,
                  title: 'Implementera backend',
                  status: 'in-progress',
                  assignee: 'Erik Andersson',
                  dueDate: '2024-02-01',
                },
                {
                  id: 3,
                  title: 'Testa funktionalitet',
                  status: 'pending',
                  assignee: 'Lars Pettersson',
                  dueDate: '2024-02-15',
                },
              ],
              columns: [
                { key: 'title', label: 'Uppgift', sortable: true },
                {
                  key: 'status',
                  label: 'Status',
                  type: 'badge',
                  badgeVariant: (value: string) => {
                    switch (value) {
                      case 'completed':
                        return 'default';
                      case 'in-progress':
                        return 'secondary';
                      case 'pending':
                        return 'outline';
                      default:
                        return 'secondary';
                    }
                  },
                },
                { key: 'assignee', label: 'Tilldelad', sortable: true },
                { key: 'dueDate', label: 'Förfallodatum', type: 'date', sortable: true },
                {
                  key: 'actions',
                  label: 'Åtgärder',
                  type: 'actions',
                  width: '120px',
                  align: 'right',
                },
              ],
              allowAdd: true,
              allowEdit: true,
              allowDelete: true,
            },
          ],
          readonly: false,
          hasUnsavedChanges: true,
        },
      },

      {
        name: 'ExtendedDetailPage.vue',
        path: 'shared/ExtendedDetailPage.vue',
        type: 'file',
        component: ExtendedDetailPage,
        props: {
          title: 'Extended Demo Sida',
          description: 'En demonstration av ExtendedDetailPage-komponenten med flikar',
          breadcrumbs: [
            { label: 'Dashboard', to: '/overview' },
            { label: 'Demo', to: '/demo' },
            { label: 'Extended', isCurrentPage: true },
          ],
          showStats: true,
          stats: [
            { label: 'Totalt', value: 156, color: 'text-blue-600' },
            { label: 'Aktiva', value: 89, color: 'text-green-600' },
            { label: 'Väntande', value: 23, color: 'text-orange-600' },
            { label: 'Avslutade', value: 44, color: 'text-gray-600' },
          ],
          data: {
            name: 'Demo Extended Project',
            description:
              'Ett omfattande projekt som demonstrerar ExtendedDetailPage med flera flikar och komplex data',
            manager: 'Anna Svensson',
            department: 'utveckling',
            status: 'active',
            budget: 500000,
            startDate: '2024-01-01',
            endDate: '2024-12-31',
            progress: 75,
            priority: 'high',
            lastUpdated: '2024-01-21',
          },
          mainFields: [
            { key: 'name', label: 'Projektnamn', type: 'text' },
            { key: 'description', label: 'Beskrivning', type: 'textarea' },
            { key: 'manager', label: 'Projektledare', type: 'text' },
            {
              key: 'department',
              label: 'Avdelning',
              type: 'select',
              options: [
                { value: 'utveckling', label: 'Utveckling' },
                { value: 'design', label: 'Design' },
                { value: 'marknadsföring', label: 'Marknadsföring' },
              ],
            },
            { key: 'budget', label: 'Budget (SEK)', type: 'number' },
            { key: 'teamSize', label: 'Teamstörlek', type: 'number' },
          ],
          sidebarFields: [
            {
              key: 'status',
              label: 'Status',
              type: 'select',
              options: [
                { value: 'planering', label: 'Planering' },
                { value: 'pågående', label: 'Pågående' },
                { value: 'pausad', label: 'Pausad' },
                { value: 'avslutad', label: 'Avslutad' },
              ],
            },
            {
              key: 'priority',
              label: 'Prioritet',
              type: 'select',
              options: [
                { value: 'låg', label: 'Låg' },
                { value: 'medel', label: 'Medel' },
                { value: 'hög', label: 'Hög' },
                { value: 'kritisk', label: 'Kritisk' },
              ],
            },
            { key: 'startDate', label: 'Startdatum', type: 'date' },
            { key: 'endDate', label: 'Slutdatum', type: 'date' },
            { key: 'completionPercentage', label: 'Färdigställande (%)', type: 'number' },
            { key: 'lastUpdated', label: 'Senast uppdaterad', type: 'date' },
          ],
          subTables: [
            {
              key: 'team',
              title: 'Projektteam',
              data: [
                {
                  id: 1,
                  name: 'Erik Andersson',
                  role: 'Utvecklare',
                  email: 'erik@example.com',
                  active: true,
                },
                {
                  id: 2,
                  name: 'Maria Johansson',
                  role: 'Designer',
                  email: 'maria@example.com',
                  active: true,
                },
                {
                  id: 3,
                  name: 'Lars Pettersson',
                  role: 'Testare',
                  email: 'lars@example.com',
                  active: false,
                },
              ],
              columns: [
                { key: 'name', label: 'Namn', sortable: true },
                { key: 'role', label: 'Roll', sortable: true },
                { key: 'email', label: 'E-post', sortable: true },
                {
                  key: 'active',
                  label: 'Aktiv',
                  type: 'badge',
                  badgeVariant: (value: boolean) => (value ? 'default' : 'secondary'),
                },
                {
                  key: 'actions',
                  label: 'Åtgärder',
                  type: 'actions',
                  width: '120px',
                  align: 'right',
                },
              ],
              allowAdd: true,
              allowEdit: true,
              allowDelete: true,
            },
            {
              key: 'tasks',
              title: 'Uppgifter',
              data: [
                {
                  id: 1,
                  title: 'Designa UI',
                  status: 'completed',
                  assignee: 'Maria Johansson',
                  dueDate: '2024-01-15',
                },
                {
                  id: 2,
                  title: 'Implementera backend',
                  status: 'in-progress',
                  assignee: 'Erik Andersson',
                  dueDate: '2024-02-01',
                },
                {
                  id: 3,
                  title: 'Testa funktionalitet',
                  status: 'pending',
                  assignee: 'Lars Pettersson',
                  dueDate: '2024-02-15',
                },
              ],
              columns: [
                { key: 'title', label: 'Uppgift', sortable: true },
                {
                  key: 'status',
                  label: 'Status',
                  type: 'badge',
                  badgeVariant: (value: string) => {
                    switch (value) {
                      case 'completed':
                        return 'default';
                      case 'in-progress':
                        return 'secondary';
                      case 'pending':
                        return 'outline';
                      default:
                        return 'secondary';
                    }
                  },
                },
                { key: 'assignee', label: 'Tilldelad', sortable: true },
                { key: 'dueDate', label: 'Förfallodatum', type: 'date', sortable: true },
                {
                  key: 'actions',
                  label: 'Åtgärder',
                  type: 'actions',
                  width: '120px',
                  align: 'right',
                },
              ],
              allowAdd: true,
              allowEdit: true,
              allowDelete: true,
            },
          ],
          readonly: false,
          hasUnsavedChanges: true,
        },
      },
    ],
  },
];

// State
const expandedFolders = ref(new Set(['pages', 'features', 'shared']));
const selectedComponent = shallowRef<TreeNode | null>(null);

// Viewport state
type ViewportType = 'desktop' | 'laptop' | 'phone';
const currentViewport = ref<ViewportType>('desktop');

// View toggle state
const currentView = ref<'components' | 'colors' | 'toasts'>('components');

// Component preview ref for isolated styling
const componentPreview = ref<HTMLElement | null>(null);

// Spacing target selection
const spacingTarget = ref<SpacingTarget>('all');

// Methods
const toggleFolder = (path: string) => {
  if (expandedFolders.value.has(path)) {
    expandedFolders.value.delete(path);
  } else {
    expandedFolders.value.add(path);
  }
};

const selectComponent = (node: TreeNode) => {
  if (node.type === 'file' && node.component) {
    selectedComponent.value = node;
  }
};

const isExpanded = (path: string) => expandedFolders.value.has(path);

const setViewport = (viewport: ViewportType) => {
  currentViewport.value = viewport;
};

// Computed styles for different viewports
const viewportStyles = computed(() => {
  switch (currentViewport.value) {
    case 'desktop':
      return {
        width: '100%',
        maxWidth: '1200px',
        aspectRatio: '16/9',
      };
    case 'laptop':
      return {
        width: '1024px',
        maxWidth: '1024px',
        aspectRatio: '16/10',
      };
    case 'phone':
      return {
        width: '375px',
        maxWidth: '375px',
        aspectRatio: '9/16',
      };
    default:
      return {
        width: '100%',
        maxWidth: '1200px',
        aspectRatio: '16/9',
      };
  }
});

// Event handlers for ComplexDetailPage
const handleFieldChange = (key: string, value: any) => {
  console.log('Field changed:', key, value);
  // In a real app, you would update the data here
  if (selectedComponent.value?.props?.data) {
    selectedComponent.value.props.data[key] = value;
  }
};

const handleSave = () => {
  console.log('Save clicked');
  // In a real app, you would save the data here
};

const handleDelete = () => {
  console.log('Delete clicked');
  // In a real app, you would delete the item here
};

const handleBack = () => {
  console.log('Back clicked');
  // In a real app, you would navigate back here
};

const handleDiscardChanges = () => {
  console.log('Discard changes clicked');
  // In a real app, you would revert the changes here
};

const handleAddSubItem = (tableKey: string) => {
  console.log('Add sub item to table:', tableKey);
  // In a real app, you would add a new item to the specified table
};

const handleEditSubItem = (tableKey: string, item: any) => {
  console.log('Edit sub item from table:', tableKey, item);
  // In a real app, you would edit the specified item
};

const handleDeleteSubItem = (tableKey: string, item: any) => {
  console.log('Delete sub item from table:', tableKey, item);
  // In a real app, you would delete the specified item
};

const handleSubItemClick = (tableKey: string, item: any) => {
  console.log('Sub item clicked in table:', tableKey, item);
  // In a real app, you would handle the item click here
};

// Statistics for the header
const componentCount = computed(() => {
  if (!fileTree || !Array.isArray(fileTree)) return 0;
  let count = 0;
  const countComponents = (nodes: TreeNode[]) => {
    nodes.forEach(node => {
      if (node.type === 'file') {
        count++;
      } else if (node.children) {
        countComponents(node.children);
      }
    });
  };
  countComponents(fileTree);
  return count;
});

const pageCount = computed(() => {
  if (!fileTree || !Array.isArray(fileTree)) return 0;
  const pagesNode = fileTree.find(node => node.name === 'pages');
  return pagesNode?.children?.length ?? 0;
});

const uiComponentCount = computed(() => {
  if (!fileTree || !Array.isArray(fileTree)) return 0;
  const uiNodes = fileTree.filter(node => node.name !== 'pages');
  let count = 0;
  const countComponents = (nodes: TreeNode[]) => {
    nodes.forEach(node => {
      if (node.type === 'file') {
        count++;
      } else if (node.children) {
        countComponents(node.children);
      }
    });
  };
  countComponents(uiNodes);
  return count;
});

// Spacing Variables Management with Algebraic Relationships
interface SpacingVariable {
  name: string;
  variable: string;
  baseValue: number; // The base mathematical relationship
  computedValue: number; // Current computed value
}

type SpacingTarget = 'all' | 'margin' | 'padding' | 'gap';

// Text Size Variables Management
interface TextSizeVariable {
  name: string;
  variable: string;
  baseValue: number; // The base mathematical relationship (in rem)
  computedValue: number; // Current computed value
  pixelValue: number; // Pixel equivalent for display
}

type TextSizeTarget = 'all' | 'text' | 'leading' | 'tracking';

// Base mathematical relationships for spacing (in rem)
// These define the algebraic function: f(x) = baseValue * multiplier
const spacingVariables = ref<SpacingVariable[]>([
  { name: 'Space 0', variable: '--space-0', baseValue: 0, computedValue: 0 },
  { name: 'Space 1', variable: '--space-1', baseValue: 0.25, computedValue: 0.25 },
  { name: 'Space 2', variable: '--space-2', baseValue: 0.5, computedValue: 0.5 },
  { name: 'Space 3', variable: '--space-3', baseValue: 0.75, computedValue: 0.75 },
  { name: 'Space 4', variable: '--space-4', baseValue: 1, computedValue: 1 },
  { name: 'Space 5', variable: '--space-5', baseValue: 1.25, computedValue: 1.25 },
  { name: 'Space 6', variable: '--space-6', baseValue: 1.5, computedValue: 1.5 },
  { name: 'Space 8', variable: '--space-8', baseValue: 2, computedValue: 2 },
  { name: 'Space 10', variable: '--space-10', baseValue: 2.5, computedValue: 2.5 },
  { name: 'Space 12', variable: '--space-12', baseValue: 3, computedValue: 3 },
  { name: 'Space 16', variable: '--space-16', baseValue: 4, computedValue: 4 },
  { name: 'Space 20', variable: '--space-20', baseValue: 5, computedValue: 5 },
  { name: 'Space 24', variable: '--space-24', baseValue: 6, computedValue: 6 },
]);

// Global spacing multiplier - the single control that affects all spacing
const spacingMultiplier = ref<number>(1);

// Text size variables with base mathematical relationships (in rem)
const textSizeVariables = ref<TextSizeVariable[]>([
  { name: 'Text XS', variable: '--text-xs', baseValue: 0.75, computedValue: 0.75, pixelValue: 12 },
  {
    name: 'Text SM',
    variable: '--text-sm',
    baseValue: 0.875,
    computedValue: 0.875,
    pixelValue: 14,
  },
  { name: 'Text Base', variable: '--text-base', baseValue: 1, computedValue: 1, pixelValue: 16 },
  {
    name: 'Text LG',
    variable: '--text-lg',
    baseValue: 1.125,
    computedValue: 1.125,
    pixelValue: 18,
  },
  { name: 'Text XL', variable: '--text-xl', baseValue: 1.25, computedValue: 1.25, pixelValue: 20 },
  { name: 'Text 2XL', variable: '--text-2xl', baseValue: 1.5, computedValue: 1.5, pixelValue: 24 },
  {
    name: 'Text 3XL',
    variable: '--text-3xl',
    baseValue: 1.875,
    computedValue: 1.875,
    pixelValue: 30,
  },
  {
    name: 'Text 4XL',
    variable: '--text-4xl',
    baseValue: 2.25,
    computedValue: 2.25,
    pixelValue: 36,
  },
  { name: 'Text 5XL', variable: '--text-5xl', baseValue: 3, computedValue: 3, pixelValue: 48 },
  {
    name: 'Text 6XL',
    variable: '--text-6xl',
    baseValue: 3.75,
    computedValue: 3.75,
    pixelValue: 60,
  },
]);

// Global text size multiplier
const textSizeMultiplier = ref<number>(1);

// Text size target selection
const textSizeTarget = ref<TextSizeTarget>('all');

// Color variables with base theme values
const colorVariables = ref<ColorVariable[]>([
  // Primary colors
  {
    name: 'Primary',
    variable: '--primary',
    baseValue: 'hsl(221.2 83.2% 53.3%)',
    computedValue: 'hsl(221.2 83.2% 53.3%)',
    category: 'primary',
  },
  {
    name: 'Primary Foreground',
    variable: '--primary-foreground',
    baseValue: 'hsl(210 40% 98%)',
    computedValue: 'hsl(210 40% 98%)',
    category: 'primary',
  },

  // Secondary colors
  {
    name: 'Secondary',
    variable: '--secondary',
    baseValue: 'hsl(210 40% 96%)',
    computedValue: 'hsl(210 40% 96%)',
    category: 'secondary',
  },
  {
    name: 'Secondary Foreground',
    variable: '--secondary-foreground',
    baseValue: 'hsl(222.2 84% 4.9%)',
    computedValue: 'hsl(222.2 84% 4.9%)',
    category: 'secondary',
  },

  // Background colors
  {
    name: 'Background',
    variable: '--background',
    baseValue: 'hsl(0 0% 100%)',
    computedValue: 'hsl(0 0% 100%)',
    category: 'background',
  },
  {
    name: 'Foreground',
    variable: '--foreground',
    baseValue: 'hsl(222.2 84% 4.9%)',
    computedValue: 'hsl(222.2 84% 4.9%)',
    category: 'background',
  },
  {
    name: 'Card',
    variable: '--card',
    baseValue: 'hsl(0 0% 100%)',
    computedValue: 'hsl(0 0% 100%)',
    category: 'background',
  },
  {
    name: 'Card Foreground',
    variable: '--card-foreground',
    baseValue: 'hsl(222.2 84% 4.9%)',
    computedValue: 'hsl(222.2 84% 4.9%)',
    category: 'background',
  },

  // Accent colors
  {
    name: 'Accent',
    variable: '--accent',
    baseValue: 'hsl(210 40% 96%)',
    computedValue: 'hsl(210 40% 96%)',
    category: 'accent',
  },
  {
    name: 'Accent Foreground',
    variable: '--accent-foreground',
    baseValue: 'hsl(222.2 84% 4.9%)',
    computedValue: 'hsl(222.2 84% 4.9%)',
    category: 'accent',
  },
  {
    name: 'Muted',
    variable: '--muted',
    baseValue: 'hsl(210 40% 96%)',
    computedValue: 'hsl(210 40% 96%)',
    category: 'accent',
  },
  {
    name: 'Muted Foreground',
    variable: '--muted-foreground',
    baseValue: 'hsl(215.4 16.3% 46.9%)',
    computedValue: 'hsl(215.4 16.3% 46.9%)',
    category: 'accent',
  },

  // Destructive colors
  {
    name: 'Destructive',
    variable: '--destructive',
    baseValue: 'hsl(0 84.2% 60.2%)',
    computedValue: 'hsl(0 84.2% 60.2%)',
    category: 'destructive',
  },
  {
    name: 'Destructive Foreground',
    variable: '--destructive-foreground',
    baseValue: 'hsl(210 40% 98%)',
    computedValue: 'hsl(210 40% 98%)',
    category: 'destructive',
  },

  // Sidebar colors
  {
    name: 'Sidebar',
    variable: '--sidebar',
    baseValue: 'hsl(222.2 84% 4.9%)',
    computedValue: 'hsl(222.2 84% 4.9%)',
    category: 'background',
  },
  {
    name: 'Sidebar Foreground',
    variable: '--sidebar-foreground',
    baseValue: 'hsl(210 40% 98%)',
    computedValue: 'hsl(210 40% 98%)',
    category: 'background',
  },
]);

// Color target selection
const colorTarget = ref<ColorTarget>('all');

// Color pairs for the colors view
const colorPairs = ref([
  {
    name: 'Background',
    background: 'bg-background',
    foreground: 'text-foreground',
    backgroundVar: '--background',
    foregroundVar: '--foreground',
    description: 'Main page background and text',
  },
  {
    name: 'Primary',
    background: 'bg-primary',
    foreground: 'text-primary-foreground',
    backgroundVar: '--primary',
    foregroundVar: '--primary-foreground',
    description: 'Main brand color for buttons and links',
  },
  {
    name: 'Secondary',
    background: 'bg-secondary',
    foreground: 'text-secondary-foreground',
    backgroundVar: '--secondary',
    foregroundVar: '--secondary-foreground',
    description: 'Secondary actions and subtle elements',
  },
  {
    name: 'Accent',
    background: 'bg-accent',
    foreground: 'text-accent-foreground',
    backgroundVar: '--accent',
    foregroundVar: '--accent-foreground',
    description: 'Accent color for highlights and emphasis',
  },
  {
    name: 'Destructive',
    background: 'bg-destructive',
    foreground: 'text-destructive-foreground',
    backgroundVar: '--destructive',
    foregroundVar: '--destructive-foreground',
    description: 'Error states and destructive actions',
  },
  {
    name: 'Muted',
    background: 'bg-muted',
    foreground: 'text-muted-foreground',
    backgroundVar: '--muted',
    foregroundVar: '--muted-foreground',
    description: 'Muted backgrounds and subtle text',
  },
  {
    name: 'Card',
    background: 'bg-card',
    foreground: 'text-card-foreground',
    backgroundVar: '--card',
    foregroundVar: '--card-foreground',
    description: 'Card backgrounds and content',
  },
  {
    name: 'Sidebar',
    background: 'bg-sidebar',
    foreground: 'text-sidebar-foreground',
    backgroundVar: '--sidebar',
    foregroundVar: '--sidebar-foreground',
    description: 'Sidebar background and navigation text',
  },
]);

// Variable editor view selector
type VariableEditorView = 'spacing' | 'text' | 'color';
const currentVariableEditor = ref<VariableEditorView>('spacing');

// Color Variables Management
interface ColorVariable {
  name: string;
  variable: string;
  baseValue: string; // The base color value (hex, hsl, etc.)
  computedValue: string; // Current computed value
  category: 'primary' | 'secondary' | 'background' | 'accent' | 'destructive';
}

type ColorTarget = 'all' | 'primary' | 'secondary' | 'background' | 'accent' | 'destructive';

// Usage examples for margins and paddings
const marginExamples = [
  { class: 'm-1', description: 'margin: 0.25rem' },
  { class: 'm-2', description: 'margin: 0.5rem' },
  { class: 'm-4', description: 'margin: 1rem' },
  { class: 'mx-6', description: 'margin-left & right: 1.5rem' },
  { class: 'my-8', description: 'margin-top & bottom: 2rem' },
];

const paddingExamples = [
  { class: 'p-1', description: 'padding: 0.25rem' },
  { class: 'p-2', description: 'padding: 0.5rem' },
  { class: 'p-4', description: 'padding: 1rem' },
  { class: 'px-6', description: 'padding-left & right: 1.5rem' },
  { class: 'py-8', description: 'padding-top & bottom: 2rem' },
];

const gapExamples = [
  { class: 'gap-1', description: 'gap: 0.25rem' },
  { class: 'gap-2', description: 'gap: 0.5rem' },
  { class: 'gap-4', description: 'gap: 1rem' },
  { class: 'gap-x-6', description: 'column-gap: 1.5rem' },
  { class: 'gap-y-8', description: 'row-gap: 2rem' },
];

// Text size examples
const textSizeExamples = [
  { class: 'text-xs', description: 'font-size: 0.75rem' },
  { class: 'text-sm', description: 'font-size: 0.875rem' },
  { class: 'text-base', description: 'font-size: 1rem' },
  { class: 'text-lg', description: 'font-size: 1.125rem' },
  { class: 'text-xl', description: 'font-size: 1.25rem' },
  { class: 'text-2xl', description: 'font-size: 1.5rem' },
];

const lineHeightExamples = [
  { class: 'leading-3', description: 'line-height: 0.75rem' },
  { class: 'leading-4', description: 'line-height: 1rem' },
  { class: 'leading-5', description: 'line-height: 1.25rem' },
  { class: 'leading-6', description: 'line-height: 1.5rem' },
  { class: 'leading-7', description: 'line-height: 1.75rem' },
];

// Color examples
const colorExamples = [
  {
    class: 'bg-primary text-primary-foreground',
    description: 'Primary background with foreground',
  },
  {
    class: 'bg-secondary text-secondary-foreground',
    description: 'Secondary background with foreground',
  },
  { class: 'bg-accent text-accent-foreground', description: 'Accent background with foreground' },
  {
    class: 'bg-destructive text-destructive-foreground',
    description: 'Destructive background with foreground',
  },
  { class: 'bg-card text-card-foreground', description: 'Card background with foreground' },
  { class: 'bg-muted text-muted-foreground', description: 'Muted background with foreground' },
];

// Variable mapping for spacing numbers to match main.css variables
const spacingMap: { [key: string]: string } = {
  '--space-0': '0',
  '--space-1': '1',
  '--space-2': '2',
  '--space-3': '3',
  '--space-4': '4',
  '--space-5': '5',
  '--space-6': '6',
  '--space-8': '8',
  '--space-10': '10',
  '--space-12': '12',
  '--space-16': '16',
  '--space-20': '20',
  '--space-24': '24',
};

// Compute all spacing values using algebraic function: f(x) = baseValue * multiplier
const computeSpacingValues = () => {
  spacingVariables.value.forEach(spacing => {
    // Apply algebraic function: computedValue = baseValue * multiplier
    spacing.computedValue = spacing.baseValue * spacingMultiplier.value;
  });
};

// Update CSS custom properties for all spacing variables
const updateAllSpacingVariables = () => {
  if (componentPreview.value) {
    spacingVariables.value.forEach(spacing => {
      const remValue = `${spacing.computedValue}rem`;
      // Apply to the base spacing variable
      componentPreview.value?.style.setProperty(spacing.variable, remValue);
      // Get the spacing number for this variable
      const spaceNum = spacingMap[spacing.variable];
      if (spaceNum) {
        // Apply to the actual CSS variables used in main.css based on selection
        if (spacingTarget.value === 'margin' || spacingTarget.value === 'all') {
          componentPreview.value?.style.setProperty(`--margin-${spaceNum}`, remValue);
        }
        if (spacingTarget.value === 'padding' || spacingTarget.value === 'all') {
          componentPreview.value?.style.setProperty(`--padding-${spaceNum}`, remValue);
        }
        if (spacingTarget.value === 'gap' || spacingTarget.value === 'all') {
          componentPreview.value?.style.setProperty(`--gap-${spaceNum}`, remValue);
        }
      }
    });
  }
};

// Update individual spacing variable (for manual overrides)
const updateIndividualSpacing = (index: number, value: number) => {
  if (spacingVariables.value[index]) {
    spacingVariables.value[index].computedValue = value;
  }
  updateAllSpacingVariables();
};

// Handle multiplier change
const onMultiplierChange = () => {
  computeSpacingValues();
  updateAllSpacingVariables();
};

// Reset spacing multiplier to default
const resetSpacingMultiplier = () => {
  spacingMultiplier.value = 1;
  onMultiplierChange();
};

// Reset all individual values to computed values
const resetToComputedValues = () => {
  computeSpacingValues();
  updateAllSpacingVariables();
};

// Update all spacing variables when target changes
const onSpacingTargetChange = () => {
  updateAllSpacingVariables();
};

// Text Size Functions
// Compute all text size values using algebraic function: f(x) = baseValue * multiplier
const computeTextSizeValues = () => {
  textSizeVariables.value.forEach(textSize => {
    textSize.computedValue = textSize.baseValue * textSizeMultiplier.value;
    textSize.pixelValue = Math.round(textSize.computedValue * 16); // Convert rem to px (16px = 1rem)
  });
};

// Update CSS custom properties for all text size variables
const updateAllTextSizeVariables = () => {
  if (componentPreview.value) {
    textSizeVariables.value.forEach(textSize => {
      const remValue = `${textSize.computedValue}rem`;
      // Apply to the base text size variable
      componentPreview.value?.style.setProperty(textSize.variable, remValue);
      // Apply to actual CSS variables based on selection
      const sizeClass = textSize.variable.replace('--text-', '');
      if (textSizeTarget.value === 'text' || textSizeTarget.value === 'all') {
        componentPreview.value?.style.setProperty(`--font-size-${sizeClass}`, remValue);
      }
      if (textSizeTarget.value === 'leading' || textSizeTarget.value === 'all') {
        // Line height typically 1.2-1.5x the font size
        const lineHeightValue = `${textSize.computedValue * 1.4}rem`;
        componentPreview.value?.style.setProperty(`--line-height-${sizeClass}`, lineHeightValue);
      }
    });
  }
};

// Update individual text size variable
const updateIndividualTextSize = (index: number, value: number) => {
  if (textSizeVariables.value[index]) {
    textSizeVariables.value[index].computedValue = value;
    textSizeVariables.value[index].pixelValue = Math.round(value * 16);
  }
  updateAllTextSizeVariables();
};

// Handle text size multiplier change
const onTextSizeMultiplierChange = () => {
  computeTextSizeValues();
  updateAllTextSizeVariables();
};

// Reset text size multiplier to default
const resetTextSizeMultiplier = () => {
  textSizeMultiplier.value = 1;
  onTextSizeMultiplierChange();
};

// Reset all individual text size values to computed values
const resetTextSizesToComputedValues = () => {
  computeTextSizeValues();
  updateAllTextSizeVariables();
};

// Update all text size variables when target changes
const onTextSizeTargetChange = () => {
  updateAllTextSizeVariables();
};

// Color Functions
// Update CSS custom properties for all color variables
const updateAllColorVariables = () => {
  if (componentPreview.value) {
    colorVariables.value.forEach(color => {
      // Apply to the base color variable
      componentPreview.value?.style.setProperty(color.variable, color.computedValue);
      // Apply based on target selection
      if (colorTarget.value === 'all' || colorTarget.value === color.category) {
        componentPreview.value?.style.setProperty(color.variable, color.computedValue);
      }
    });
  }
};

// Update individual color variable
const updateIndividualColor = (index: number, value: string) => {
  if (colorVariables.value[index]) {
    colorVariables.value[index].computedValue = value;
  }
  updateAllColorVariables();
};

// Reset all color values to base values
const resetColorsToBaseValues = () => {
  colorVariables.value.forEach(color => {
    color.computedValue = color.baseValue;
  });
  updateAllColorVariables();
};

// Update all color variables when target changes
const onColorTargetChange = () => {
  updateAllColorVariables();
};

// Helper function to convert color to hex for color picker
const colorToHex = (color: string): string => {
  // Simple conversion for HSL to hex (basic implementation)
  if (color.startsWith('hsl')) {
    // For now, return a default hex color - in a real app you'd want proper HSL to hex conversion
    return '#3b82f6';
  }
  return color.startsWith('#') ? color : '#3b82f6';
};

// Helper function to convert hex to HSL (dummy implementation)
function hexToHsl(hex: string): string {
  // TODO: Implement real conversion if needed
  return hex;
}

// Letter spacing examples for usage and preview
const letterSpacingExamples = [
  { class: 'tracking-tighter', description: 'letter-spacing: -0.05em' },
  { class: 'tracking-tight', description: 'letter-spacing: -0.025em' },
  { class: 'tracking-normal', description: 'letter-spacing: 0em' },
  { class: 'tracking-wide', description: 'letter-spacing: 0.025em' },
  { class: 'tracking-wider', description: 'letter-spacing: 0.05em' },
  { class: 'tracking-widest', description: 'letter-spacing: 0.1em' },
];

// Initialize spacing, text size, and color variables when component mounts
onMounted(() => {
  // Wait for next tick to ensure component preview is rendered
  nextTick(() => {
    computeSpacingValues();
    updateAllSpacingVariables();
    computeTextSizeValues();
    updateAllTextSizeVariables();
    updateAllColorVariables();
  });
});
</script>

<template>
  <div class="min-h-screen">
    <StandardHeader
      title="UI Byggstenar"
      :breadcrumbs="[
        { label: 'Dashboard', to: '/overview' },
        { label: 'Utveckling', to: '/development' },
        { label: 'UI Byggstenar', isCurrentPage: true },
      ]"
      :show-stats="true"
      :stats="[
        { label: 'Komponenter', value: componentCount, color: 'text-blue-600' },
        { label: 'Sidor', value: pageCount, color: 'text-green-600' },
        { label: 'UI Bibliotek', value: uiComponentCount, color: 'text-purple-600' },
        { label: 'Viewports', value: 3, color: 'text-orange-600' },
      ]"
    />

    <div class="pb-6">
      <!-- Toggle Section -->
      <div class="flex gap-2 m-4">
        <Button
          :variant="currentView === 'components' ? 'default' : 'outline'"
          class="gap-2"
          @click="currentView = 'components'"
        >
          <FileText class="h-4 w-4" />
          Komponenter
        </Button>
        <Button
          :variant="currentView === 'colors' ? 'default' : 'outline'"
          class="gap-2"
          @click="currentView = 'colors'"
        >
          🎨 Colors
        </Button>
        <Button
          :variant="currentView === 'toasts' ? 'default' : 'outline'"
          class="gap-2"
          @click="currentView = 'toasts'"
        >
          🍞 Toast Exempel
        </Button>
      </div>

      <!-- Content Area -->
      <ToastExample v-if="currentView === 'toasts'" class="m-4" />

      <!-- Colors View -->
      <div v-else-if="currentView === 'colors'" class="p-6">
        <div class="mb-6">
          <h2 class="text-2xl font-bold text-gray-900 mb-2">Color Pairs</h2>
          <p class="text-gray-600">
            Preview of background and foreground color combinations used throughout the application.
          </p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          <div
            v-for="pair in colorPairs"
            :key="pair.name"
            :class="[pair.background, pair.foreground]"
            class="p-6 rounded-lg border shadow-sm transition-transform hover:scale-105"
          >
            <div class="space-y-3">
              <div>
                <h3 class="text-lg font-semibold">{{ pair.name }}</h3>
                <p class="text-sm opacity-80">{{ pair.description }}</p>
              </div>

              <div class="space-y-2 text-xs">
                <div class="flex justify-between">
                  <span class="opacity-70">Background:</span>
                  <code class="font-mono">{{ pair.backgroundVar }}</code>
                </div>
                <div class="flex justify-between">
                  <span class="opacity-70">Foreground:</span>
                  <code class="font-mono">{{ pair.foregroundVar }}</code>
                </div>
              </div>

              <div class="mt-2 border-t border-current border-opacity-20">
                <div class="flex items-center justify-between text-sm">
                  <span>Different Opacity 60/40/20:</span>
                  <div class="flex gap-1">
                    <div class="w-2 h-2 rounded-full bg-current opacity-60"></div>
                    <div class="w-2 h-2 rounded-full bg-current opacity-40"></div>
                    <div class="w-2 h-2 rounded-full bg-current opacity-20"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Usage Examples -->
        <div class="mt-12 bg-white rounded-lg border p-6">
          <h3 class="text-lg font-semibold text-gray-900 mb-4">Usage Examples</h3>
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <h4 class="text-sm font-medium text-gray-700 mb-3">Button Examples</h4>
              <div class="space-y-3">
                <button
                  class="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:opacity-90 transition-opacity"
                >
                  Primary Button
                </button>
                <button
                  class="px-4 py-2 bg-secondary text-secondary-foreground rounded-md hover:opacity-90 transition-opacity"
                >
                  Secondary Button
                </button>
                <button
                  class="px-4 py-2 bg-destructive text-destructive-foreground rounded-md hover:opacity-90 transition-opacity"
                >
                  Destructive Button
                </button>
              </div>
            </div>

            <div>
              <h4 class="text-sm font-medium text-gray-700 mb-3">Card Examples</h4>
              <div class="space-y-3">
                <div class="p-4 bg-card text-card-foreground rounded-md border">
                  <h5 class="font-medium">Card Title</h5>
                  <p class="text-sm opacity-80">Card content with proper contrast</p>
                </div>
                <div class="p-4 bg-muted text-muted-foreground rounded-md">
                  <h5 class="font-medium">Muted Section</h5>
                  <p class="text-sm opacity-80">Subtle background for secondary content</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div v-else class="flex h-[calc(100vh-200px)]">
        <!-- File Tree Sidebar -->
        <div class="w-80 bg-white border-r border-gray-200 overflow-y-auto">
          <div class="p-4">
            <!-- Viewport Controls -->
            <div class="mb-6">
              <h3 class="text-sm font-semibold text-gray-900 mb-3">Viewport</h3>
              <div class="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  :class="[
                    'flex items-center gap-2',
                    currentViewport === 'desktop' ? 'bg-blue-100 border-blue-300' : '',
                  ]"
                  @click="setViewport('desktop')"
                >
                  <Monitor class="w-4 h-4" />
                  Desktop
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  :class="[
                    'flex items-center gap-2',
                    currentViewport === 'laptop' ? 'bg-blue-100 border-blue-300' : '',
                  ]"
                  @click="setViewport('laptop')"
                >
                  <Laptop class="w-4 h-4" />
                  Laptop
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  :class="[
                    'flex items-center gap-2',
                    currentViewport === 'phone' ? 'bg-blue-100 border-blue-300' : '',
                  ]"
                  @click="setViewport('phone')"
                >
                  <Smartphone class="w-4 h-4" />
                  Phone
                </Button>
              </div>
            </div>

            <h3 class="text-sm font-semibold text-gray-900 mb-3">pages</h3>

            <!-- Pages Section -->
            <div class="mb-6">
              <template v-for="node in fileTree.filter(n => n.name === 'pages')" :key="node.path">
                <!-- Folder -->
                <div v-if="node.type === 'folder'">
                  <button
                    class="flex items-center w-full px-2 py-1 text-sm text-left text-gray-700 hover:bg-gray-100 rounded"
                    @click="toggleFolder(node.path)"
                  >
                    <ChevronRight
                      v-if="!isExpanded(node.path)"
                      class="w-4 h-4 mr-1 text-gray-400"
                    />
                    <ChevronDown v-else class="w-4 h-4 mr-1 text-gray-400" />
                    <Folder v-if="!isExpanded(node.path)" class="w-4 h-4 mr-2 text-blue-500" />
                    <FolderOpen v-else class="w-4 h-4 mr-2 text-blue-500" />
                    {{ node.name }}
                  </button>

                  <!-- Children -->
                  <div v-if="isExpanded(node.path)" class="ml-4 mt-1 space-y-1">
                    <template v-for="child in node.children" :key="child.path">
                      <button
                        :class="[
                          'flex items-center w-full px-2 py-1 text-sm text-left rounded',
                          selectedComponent?.path === child.path
                            ? 'bg-blue-100 text-blue-700'
                            : 'text-gray-600 hover:bg-gray-100',
                        ]"
                        @click="selectComponent(child)"
                      >
                        <FileText class="w-4 h-4 mr-2 text-gray-400" />
                        {{ child.name }}
                      </button>
                    </template>
                  </div>
                </div>
              </template>
            </div>

            <h3 class="text-sm font-semibold text-gray-900 mb-3">@/components</h3>

            <!-- Recursive Tree Component -->
            <div class="space-y-1">
              <template v-for="node in fileTree.filter(n => n.name !== 'pages')" :key="node.path">
                <!-- Folder -->
                <div v-if="node.type === 'folder'">
                  <button
                    class="flex items-center w-full px-2 py-1 text-sm text-left text-gray-700 hover:bg-gray-100 rounded"
                    @click="toggleFolder(node.path)"
                  >
                    <ChevronRight
                      v-if="!isExpanded(node.path)"
                      class="w-4 h-4 mr-1 text-gray-400"
                    />
                    <ChevronDown v-else class="w-4 h-4 mr-1 text-gray-400" />
                    <Folder v-if="!isExpanded(node.path)" class="w-4 h-4 mr-2 text-blue-500" />
                    <FolderOpen v-else class="w-4 h-4 mr-2 text-blue-500" />
                    {{ node.name }}
                  </button>

                  <!-- Children -->
                  <div v-if="isExpanded(node.path)" class="ml-4 mt-1 space-y-1">
                    <template v-for="child in node.children" :key="child.path">
                      <!-- Nested Folder -->
                      <div v-if="child.type === 'folder'">
                        <button
                          class="flex items-center w-full px-2 py-1 text-sm text-left text-gray-700 hover:bg-gray-100 rounded"
                          @click="toggleFolder(child.path)"
                        >
                          <ChevronRight
                            v-if="!isExpanded(child.path)"
                            class="w-4 h-4 mr-1 text-gray-400"
                          />
                          <ChevronDown v-else class="w-4 h-4 mr-1 text-gray-400" />
                          <Folder
                            v-if="!isExpanded(child.path)"
                            class="w-4 h-4 mr-2 text-blue-500"
                          />
                          <FolderOpen v-else class="w-4 h-4 mr-2 text-blue-500" />
                          {{ child.name }}
                        </button>

                        <!-- Nested Children -->
                        <div v-if="isExpanded(child.path)" class="ml-4 mt-1 space-y-1">
                          <button
                            v-for="grandchild in child.children"
                            :key="grandchild.path"
                            :class="[
                              'flex items-center w-full px-2 py-1 text-sm text-left rounded',
                              selectedComponent?.path === grandchild.path
                                ? 'bg-blue-100 text-blue-700'
                                : 'text-gray-600 hover:bg-gray-100',
                            ]"
                            @click="selectComponent(grandchild)"
                          >
                            <FileText class="w-4 h-4 mr-2 text-gray-400" />
                            {{ grandchild.name }}
                          </button>
                        </div>
                      </div>

                      <!-- Direct File -->
                      <button
                        v-else
                        :class="[
                          'flex items-center w-full px-2 py-1 text-sm text-left rounded',
                          selectedComponent?.path === child.path
                            ? 'bg-blue-100 text-blue-700'
                            : 'text-gray-600 hover:bg-gray-100',
                        ]"
                        @click="selectComponent(child)"
                      >
                        <FileText class="w-4 h-4 mr-2 text-gray-400" />
                        {{ child.name }}
                      </button>
                    </template>
                  </div>
                </div>

                <!-- Root Level File -->
                <button
                  v-else
                  :class="[
                    'flex items-center w-full px-2 py-1 text-sm text-left rounded',
                    selectedComponent?.path === node.path
                      ? 'bg-blue-100 text-blue-700'
                      : 'text-gray-600 hover:bg-gray-100',
                  ]"
                  @click="selectComponent(node)"
                >
                  <FileText class="w-4 h-4 mr-2 text-gray-400" />
                  {{ node.name }}
                </button>
              </template>
            </div>
          </div>
        </div>

        <!-- Component Renderer -->
        <div class="flex-1 overflow-y-auto">
          <div v-if="selectedComponent" class="p-6">
            <div class="mb-4">
              <h2 class="text-xl font-semibold text-gray-900">{{ selectedComponent.name }}</h2>
              <p class="text-sm text-gray-500">
                {{ selectedComponent.path.startsWith('pages/') ? '@/views/' : '@/components/'
                }}{{ selectedComponent.path }}
              </p>
              <p class="text-xs text-gray-400 mt-1">
                {{ currentViewport.charAt(0).toUpperCase() + currentViewport.slice(1) }} View
              </p>
            </div>

            <!-- Component Preview with Viewport Styling -->
            <div class="flex justify-center">
              <div
                ref="componentPreview"
                :style="viewportStyles"
                class="bg-white border border-gray-300 shadow-lg overflow-auto"
              >
                <!-- Special handling for DataTable to show action buttons -->
                <DataTable
                  v-if="selectedComponent.name === 'DataTable.vue'"
                  v-bind="selectedComponent.props || {}"
                >
                  <template #row-actions="{ row }">
                    <div class="flex items-center gap-0.5">
                      <Button
                        variant="ghost"
                        size="sm"
                        title="Visa användare"
                        class="h-6 w-6 p-0 text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                        @click="
                          (event: MouseEvent) => {
                            event.stopPropagation();
                            console.log('View user:', row);
                          }
                        "
                      >
                        <User class="h-3.5 w-3.5" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        title="Redigera"
                        class="h-6 w-6 p-0 text-gray-600 hover:text-gray-700 hover:bg-gray-50"
                        @click="
                          (event: MouseEvent) => {
                            event.stopPropagation();
                            console.log('Edit user:', row);
                          }
                        "
                      >
                        <Edit class="h-3.5 w-3.5" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        title="Radera"
                        class="h-6 w-6 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
                        @click="
                          (event: MouseEvent) => {
                            event.stopPropagation();
                            console.log('Delete user:', row);
                          }
                        "
                      >
                        <Trash2 class="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </template>
                </DataTable>

                <!-- Special handling for ComplexDetailPage to enable field editing -->
                <ComplexDetailPage
                  v-else-if="selectedComponent.name === 'ComplexDetailPage.vue'"
                  v-bind="selectedComponent.props || {}"
                  @field-change="handleFieldChange"
                  @save="handleSave"
                  @delete="handleDelete"
                  @back="handleBack"
                  @discard-changes="handleDiscardChanges"
                  @add-sub-item="handleAddSubItem"
                  @edit-sub-item="handleEditSubItem"
                  @delete-sub-item="handleDeleteSubItem"
                  @sub-item-click="handleSubItemClick"
                />

                <!-- Special handling for ListPage to show custom slots -->
                <ListPage
                  v-else-if="selectedComponent.name === 'ListPage.vue'"
                  v-bind="selectedComponent.props || {}"
                >
                  <template #cell-status="{ row }">
                    <span
                      :class="[
                        'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
                        row.status === 'active'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-gray-100 text-gray-800',
                      ]"
                    >
                      {{ row.status === 'active' ? 'Aktiv' : 'Inaktiv' }}
                    </span>
                  </template>
                  <template #row-actions="{ row }">
                    <div class="flex items-center gap-0.5">
                      <Button
                        variant="ghost"
                        size="sm"
                        title="Visa objekt"
                        class="h-6 w-6 p-0 text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                        @click="
                          event => {
                            event.stopPropagation();
                            console.log('View object:', row);
                          }
                        "
                      >
                        <User class="h-3.5 w-3.5" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        title="Redigera"
                        class="h-6 w-6 p-0 text-gray-600 hover:text-gray-700 hover:bg-gray-50"
                        @click="
                          event => {
                            event.stopPropagation();
                            console.log('Edit object:', row);
                          }
                        "
                      >
                        <Edit class="h-3.5 w-3.5" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        title="Radera"
                        class="h-6 w-6 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
                        @click="
                          event => {
                            event.stopPropagation();
                            console.log('Delete object:', row);
                          }
                        "
                      >
                        <Trash2 class="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </template>
                </ListPage>

                <!-- Default component rendering for all other components -->
                <component
                  :is="selectedComponent.component"
                  v-else
                  v-bind="selectedComponent.props || {}"
                />
              </div>
            </div>

            <!-- Variables Editor -->
            <div class="mt-8 bg-white border border-gray-300 rounded-lg shadow-sm">
              <div class="border-b border-gray-200 px-6 py-4">
                <!-- Editor Type Selector -->
                <div class="flex items-center justify-center mb-4">
                  <div class="flex bg-gray-100 rounded-lg p-1">
                    <button
                      :class="[
                        'px-4 py-2 text-sm font-medium rounded-md transition-colors',
                        currentVariableEditor === 'spacing'
                          ? 'bg-white text-blue-700 shadow-sm'
                          : 'text-gray-500 hover:text-gray-700',
                      ]"
                      @click="currentVariableEditor = 'spacing'"
                    >
                      Spacing
                    </button>
                    <button
                      :class="[
                        'px-4 py-2 text-sm font-medium rounded-md transition-colors',
                        currentVariableEditor === 'text'
                          ? 'bg-white text-purple-700 shadow-sm'
                          : 'text-gray-500 hover:text-gray-700',
                      ]"
                      @click="currentVariableEditor = 'text'"
                    >
                      Text Size
                    </button>
                    <button
                      :class="[
                        'px-4 py-2 text-sm font-medium rounded-md transition-colors',
                        currentVariableEditor === 'color'
                          ? 'bg-white text-green-700 shadow-sm'
                          : 'text-gray-500 hover:text-gray-700',
                      ]"
                      @click="currentVariableEditor = 'color'"
                    >
                      Colour
                    </button>
                  </div>
                </div>

                <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                  <h3 class="text-lg font-semibold text-gray-900">
                    {{
                      currentVariableEditor === 'spacing'
                        ? 'Spacing Variables Editor'
                        : currentVariableEditor === 'text'
                          ? 'Text Size Variables Editor'
                          : 'Color Variables Editor'
                    }}
                  </h3>
                  <!-- Spacing Controls -->
                  <div v-if="currentVariableEditor === 'spacing'" class="flex items-center gap-2">
                    <h3 class="text-m font-semibold text-blue-900 mb-2">Spacing Multiplier</h3>
                    <input
                      v-model="spacingMultiplier"
                      type="number"
                      step="0.1"
                      min="0"
                      max="5"
                      class="w-20 px-3 py-2 border border-blue-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                      @input="onMultiplierChange"
                    />
                  </div>

                  <!-- Text Size Controls -->
                  <div v-if="currentVariableEditor === 'text'" class="flex items-center gap-2">
                    <h3 class="text-m font-semibold text-purple-900 mb-2">Text Size Multiplier</h3>
                    <input
                      v-model="textSizeMultiplier"
                      type="number"
                      step="0.1"
                      min="0"
                      max="3"
                      class="w-20 px-3 py-2 border border-purple-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 bg-white"
                      @input="onTextSizeMultiplierChange"
                    />
                  </div>

                  <!-- Spacing Target Selector -->
                  <div v-if="currentVariableEditor === 'spacing'" class="mt-4 sm:mt-0">
                    <label class="block text-sm font-medium text-gray-700 mb-2">Apply to:</label>
                    <select
                      v-model="spacingTarget"
                      class="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      @change="onSpacingTargetChange"
                    >
                      <option value="all">All (Margin, Padding & Gap)</option>
                      <option value="margin">Margin Only</option>
                      <option value="padding">Padding Only</option>
                      <option value="gap">Gap Only</option>
                    </select>
                  </div>

                  <!-- Text Size Target Selector -->
                  <div v-if="currentVariableEditor === 'text'" class="mt-4 sm:mt-0">
                    <label class="block text-sm font-medium text-gray-700 mb-2">Apply to:</label>
                    <select
                      v-model="textSizeTarget"
                      class="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
                      @change="onTextSizeTargetChange"
                    >
                      <option value="all">All (Text, Line Height & Letter Spacing)</option>
                      <option value="text">Text Size Only</option>
                      <option value="leading">Line Height Only</option>
                      <option value="tracking">Letter Spacing Only</option>
                    </select>
                  </div>

                  <!-- Color Target Selector -->
                  <div v-if="currentVariableEditor === 'color'" class="mt-4 sm:mt-0">
                    <label class="block text-sm font-medium text-gray-700 mb-2">Apply to:</label>
                    <select
                      v-model="colorTarget"
                      class="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 sm:text-sm"
                      @change="onColorTargetChange"
                    >
                      <option value="all">All Color Categories</option>
                      <option value="primary">Primary Colors</option>
                      <option value="secondary">Secondary Colors</option>
                      <option value="background">Background Colors</option>
                      <option value="accent">Accent Colors</option>
                      <option value="destructive">Destructive Colors</option>
                    </select>
                  </div>
                </div>
              </div>

              <div class="p-6">
                <!-- Spacing Individual Controls Section -->
                <div v-if="currentVariableEditor === 'spacing'">
                  <div class="flex items-center justify-between mb-4">
                    <div>
                      <h4 class="text-md font-semibold text-gray-900">
                        Individual Spacing Controls
                      </h4>
                      <p class="text-sm text-gray-600 mt-1">
                        Fine-tune individual spacing values. Changes override the algebraic
                        multiplier for specific values.
                      </p>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      class="flex items-center gap-2"
                      @click="resetToComputedValues"
                    >
                      <Settings class="h-3 w-3" />
                      Reset to Computed
                    </Button>
                  </div>

                  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    <div
                      v-for="(spacing, index) in spacingVariables"
                      :key="spacing.name"
                      class="space-y-2"
                    >
                      <label class="block text-sm font-medium text-gray-700">
                        {{ spacing.name }} ({{ spacing.variable }})
                      </label>
                      <div class="flex items-center space-x-2">
                        <input
                          :value="spacing.computedValue"
                          type="number"
                          step="0.25"
                          min="0"
                          max="20"
                          class="w-20 px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          @input="
                            updateIndividualSpacing(index, parseFloat($event.target.value) || 0)
                          "
                        />
                        <span class="text-sm text-gray-500">rem</span>
                        <div class="flex-1">
                          <div
                            class="h-4 bg-blue-500 rounded"
                            :style="{
                              width: `${spacing.computedValue * 20 > 100 ? 100 : spacing.computedValue * 20}%`,
                            }"
                          ></div>
                        </div>
                      </div>
                      <div class="text-xs text-gray-500">
                        {{ Math.round(spacing.computedValue * 16) }}px
                      </div>
                      <div class="text-xs text-blue-600">
                        Base: {{ spacing.baseValue }}rem × {{ spacingMultiplier }} =
                        {{ (spacing.baseValue * spacingMultiplier).toFixed(2) }}rem
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Text Size Individual Controls Section -->
                <div v-if="currentVariableEditor === 'text'">
                  <div class="flex items-center justify-between mb-4">
                    <div>
                      <h4 class="text-md font-semibold text-gray-900">
                        Individual Text Size Controls
                      </h4>
                      <p class="text-sm text-gray-600 mt-1">
                        Fine-tune individual text size values. Changes override the algebraic
                        multiplier for specific values.
                      </p>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      class="flex items-center gap-2"
                      @click="resetTextSizesToComputedValues"
                    >
                      <Settings class="h-3 w-3" />
                      Reset to Computed
                    </Button>
                  </div>

                  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    <div
                      v-for="(textSize, index) in textSizeVariables"
                      :key="textSize.name"
                      class="space-y-2"
                    >
                      <label class="block text-sm font-medium text-gray-700">
                        {{ textSize.name }} ({{ textSize.variable }})
                      </label>
                      <div class="flex items-center space-x-2">
                        <input
                          :value="textSize.computedValue"
                          type="number"
                          step="0.125"
                          min="0"
                          max="10"
                          class="w-20 px-3 py-2 border border-purple-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                          @input="
                            updateIndividualTextSize(index, parseFloat($event.target.value) || 0)
                          "
                        />
                        <span class="text-sm text-gray-500">rem</span>
                        <div class="flex-1">
                          <div
                            class="h-4 bg-purple-500 rounded"
                            :style="{
                              width: `${textSize.computedValue * 25 > 100 ? 100 : textSize.computedValue * 25}%`,
                            }"
                          ></div>
                        </div>
                      </div>
                      <div class="text-xs text-gray-500">{{ textSize.pixelValue }}px</div>
                      <div class="text-xs text-purple-600">
                        Base: {{ textSize.baseValue }}rem × {{ textSizeMultiplier }} =
                        {{ (textSize.baseValue * textSizeMultiplier).toFixed(3) }}rem
                      </div>
                      <!-- Preview text -->
                      <div
                        class="text-gray-700 border border-gray-200 rounded p-2 bg-gray-50"
                        :style="{ fontSize: `${textSize.computedValue}rem` }"
                      >
                        Sample Text
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Color Individual Controls Section -->
                <div v-if="currentVariableEditor === 'color'">
                  <div class="flex items-center justify-between mb-4">
                    <div>
                      <h4 class="text-md font-semibold text-gray-900">Individual Color Controls</h4>
                      <p class="text-sm text-gray-600 mt-1">
                        Customize individual color values. Colors are organized by category for
                        better theme management.
                      </p>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      class="flex items-center gap-2"
                      @click="resetColorsToBaseValues"
                    >
                      <Settings class="h-3 w-3" />
                      Reset to Base
                    </Button>
                  </div>

                  <!-- Color variables grouped by category -->
                  <div class="space-y-8">
                    <div
                      v-for="category in [
                        'primary',
                        'secondary',
                        'background',
                        'accent',
                        'destructive',
                      ]"
                      :key="category"
                    >
                      <h5 class="text-sm font-medium text-gray-700 mb-4 capitalize">
                        {{ category }} Colors
                      </h5>
                      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        <div
                          v-for="(color, index) in colorVariables.filter(
                            c => c.category === category
                          )"
                          :key="color.name"
                          class="space-y-2"
                        >
                          <label class="block text-sm font-medium text-gray-700">
                            {{ color.name }} ({{ color.variable }})
                          </label>
                          <div class="flex items-center space-x-2">
                            <input
                              :value="colorToHex(color.computedValue)"
                              type="color"
                              class="w-12 h-8 border border-gray-300 rounded cursor-pointer"
                              @input="
                                updateIndividualColor(
                                  colorVariables.findIndex(c => c === color),
                                  hexToHsl($event.target.value)
                                )
                              "
                            />
                            <input
                              :value="color.computedValue"
                              type="text"
                              class="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                              @input="
                                updateIndividualColor(
                                  colorVariables.findIndex(c => c === color),
                                  $event.target.value
                                )
                              "
                            />
                          </div>
                          <!-- Color preview -->
                          <div
                            class="h-8 border border-gray-200 rounded"
                            :style="{ backgroundColor: color.computedValue }"
                          ></div>
                          <div class="text-xs text-gray-500">Base: {{ color.baseValue }}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Spacing Usage Examples -->
                <div
                  v-if="currentVariableEditor === 'spacing'"
                  class="mt-8 border-t border-gray-200 pt-6"
                >
                  <h4 class="text-md font-semibold text-gray-900 mb-4">Usage Examples</h4>
                  <div class="mb-4 p-3 bg-blue-50 rounded-lg">
                    <p class="text-sm text-blue-800">
                      <strong>Current Target:</strong>
                      <span v-if="spacingTarget === 'all'">
                        All margin, padding, and gap utilities will be affected
                      </span>
                      <span v-else-if="spacingTarget === 'margin'">
                        Only margin utilities (m-, mx-, my-, mt-, mr-, mb-, ml-) will be affected
                      </span>
                      <span v-else-if="spacingTarget === 'padding'">
                        Only padding utilities (p-, px-, py-, pt-, pr-, pb-, pl-) will be affected
                      </span>
                      <span v-else>Only gap utilities (gap-, gap-x-, gap-y-) will be affected</span>
                    </p>
                  </div>

                  <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <!-- Margin Examples -->
                    <div
                      v-if="spacingTarget === 'all' || spacingTarget === 'margin'"
                      class="space-y-4"
                    >
                      <h5 class="text-sm font-medium text-gray-700">Margin Examples</h5>
                      <div class="space-y-3">
                        <div
                          v-for="example in marginExamples"
                          :key="example.class"
                          class="flex items-center space-x-3"
                        >
                          <code class="text-sm bg-gray-100 px-2 py-1 rounded font-mono">
                            {{ example.class }}
                          </code>
                          <div class="flex-1">
                            <div class="bg-gray-200 p-1 rounded">
                              <div :class="example.class" class="bg-blue-500 w-8 h-8 rounded"></div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <!-- Padding Examples -->
                    <div
                      v-if="spacingTarget === 'all' || spacingTarget === 'padding'"
                      class="space-y-4"
                    >
                      <h5 class="text-sm font-medium text-gray-700">Padding Examples</h5>
                      <div class="space-y-3">
                        <div
                          v-for="example in paddingExamples"
                          :key="example.class"
                          class="flex items-center space-x-3"
                        >
                          <code class="text-sm bg-gray-100 px-2 py-1 rounded font-mono">
                            {{ example.class }}
                          </code>
                          <div class="flex-1">
                            <div :class="example.class" class="bg-blue-500 rounded">
                              <div class="bg-white w-8 h-8 rounded"></div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <!-- Gap Examples -->
                    <div
                      v-if="spacingTarget === 'all' || spacingTarget === 'gap'"
                      class="space-y-4"
                    >
                      <h5 class="text-sm font-medium text-gray-700">Gap Examples</h5>
                      <div class="space-y-3">
                        <div
                          v-for="example in gapExamples"
                          :key="example.class"
                          class="flex items-center space-x-3"
                        >
                          <code class="text-sm bg-gray-100 px-2 py-1 rounded font-mono">
                            {{ example.class }}
                          </code>
                          <div class="flex-1">
                            <div :class="['flex', example.class]" class="bg-gray-200 p-1 rounded">
                              <div class="bg-blue-500 w-4 h-4 rounded"></div>
                              <div class="bg-blue-500 w-4 h-4 rounded"></div>
                              <div class="bg-blue-500 w-4 h-4 rounded"></div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Text Size Usage Examples -->
                <div
                  v-if="currentVariableEditor === 'text'"
                  class="mt-8 border-t border-gray-200 pt-6"
                >
                  <h4 class="text-md font-semibold text-gray-900 mb-4">Usage Examples</h4>
                  <div class="mb-4 p-3 bg-purple-50 rounded-lg">
                    <p class="text-sm text-purple-800">
                      <strong>Current Target:</strong>
                      <span v-if="textSizeTarget === 'all'">
                        All text size, line height, and letter spacing utilities will be affected
                      </span>
                      <span v-else-if="textSizeTarget === 'text'">
                        Only text size utilities (text-xs, text-sm, text-base, etc.) will be
                        affected
                      </span>
                      <span v-else-if="textSizeTarget === 'leading'">
                        Only line height utilities (leading-3, leading-4, etc.) will be affected
                      </span>
                      <span v-else>
                        Only letter spacing utilities (tracking-tight, tracking-wide, etc.) will be
                        affected
                      </span>
                    </p>
                  </div>

                  <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <!-- Text Size Examples -->
                    <div
                      v-if="textSizeTarget === 'all' || textSizeTarget === 'text'"
                      class="space-y-4"
                    >
                      <h5 class="text-sm font-medium text-gray-700">Text Size Examples</h5>
                      <div class="space-y-3">
                        <div
                          v-for="example in textSizeExamples"
                          :key="example.class"
                          class="flex items-center space-x-3"
                        >
                          <code class="text-sm bg-gray-100 px-2 py-1 rounded font-mono">
                            {{ example.class }}
                          </code>
                          <div class="flex-1">
                            <div :class="example.class" class="text-gray-700">
                              Sample text with {{ example.class }}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <!-- Line Height Examples -->
                    <div
                      v-if="textSizeTarget === 'all' || textSizeTarget === 'leading'"
                      class="space-y-4"
                    >
                      <h5 class="text-sm font-medium text-gray-700">Line Height Examples</h5>
                      <div class="space-y-3">
                        <div
                          v-for="example in lineHeightExamples"
                          :key="example.class"
                          class="flex items-center space-x-3"
                        >
                          <code class="text-sm bg-gray-100 px-2 py-1 rounded font-mono">
                            {{ example.class }}
                          </code>
                          <div class="flex-1">
                            <div :class="example.class" class="text-gray-700 text-sm">
                              Multiple lines of text
                              <br />
                              to show line height
                              <br />
                              spacing effect
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <!-- Letter Spacing Examples -->
                    <div
                      v-if="textSizeTarget === 'all' || textSizeTarget === 'tracking'"
                      class="space-y-4"
                    >
                      <h5 class="text-sm font-medium text-gray-700">Letter Spacing Examples</h5>
                      <div class="space-y-3">
                        <div
                          v-for="example in letterSpacingExamples"
                          :key="example.class"
                          class="flex items-center space-x-3"
                        >
                          <code class="text-sm bg-gray-100 px-2 py-1 rounded font-mono">
                            {{ example.class }}
                          </code>
                          <div class="flex-1">
                            <div :class="example.class" class="text-gray-700 text-sm">
                              Letter spacing sample
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Color Usage Examples -->
                <div
                  v-if="currentVariableEditor === 'color'"
                  class="mt-8 border-t border-gray-200 pt-6"
                >
                  <h4 class="text-md font-semibold text-gray-900 mb-4">Usage Examples</h4>
                  <div class="mb-4 p-3 bg-green-50 rounded-lg">
                    <p class="text-sm text-green-800">
                      <strong>Current Target:</strong>
                      <span v-if="colorTarget === 'all'">
                        All color categories will be affected
                      </span>
                      <span v-else>Only {{ colorTarget }} colors will be affected</span>
                    </p>
                  </div>

                  <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <!-- Color Examples -->
                    <div class="space-y-4">
                      <h5 class="text-sm font-medium text-gray-700">Color Examples</h5>
                      <div class="space-y-3">
                        <div
                          v-for="example in colorExamples"
                          :key="example.class"
                          class="flex items-center space-x-3"
                        >
                          <code class="text-sm bg-gray-100 px-2 py-1 rounded font-mono">
                            {{ example.class }}
                          </code>
                          <div class="flex-1">
                            <div :class="example.class" class="px-3 py-2 rounded text-sm">
                              {{ example.description }}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <!-- Color Palette Preview -->
                    <div class="space-y-4">
                      <h5 class="text-sm font-medium text-gray-700 mb-4">Current Color Palette</h5>
                      <div class="grid grid-cols-2 gap-2">
                        <div
                          v-for="color in colorVariables.slice(0, 8)"
                          :key="color.name"
                          class="flex items-center space-x-2"
                        >
                          <div
                            class="w-6 h-6 rounded border border-gray-300"
                            :style="{ backgroundColor: color.computedValue }"
                          ></div>
                          <span class="text-xs text-gray-600">{{ color.name }}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Reset Button -->
                <div class="mt-6 flex justify-end">
                  <Button
                    v-if="currentVariableEditor === 'spacing'"
                    variant="outline"
                    class="flex items-center gap-2"
                    @click="resetSpacingMultiplier"
                  >
                    <Settings class="h-4 w-4" />
                    Reset Multiplier (1×)
                  </Button>
                  <Button
                    v-if="currentVariableEditor === 'text'"
                    variant="outline"
                    class="flex items-center gap-2"
                    @click="resetTextSizeMultiplier"
                  >
                    <Settings class="h-4 w-4" />
                    Reset Multiplier (1×)
                  </Button>
                  <Button
                    v-if="currentVariableEditor === 'color'"
                    variant="outline"
                    class="flex items-center gap-2"
                    @click="resetColorsToBaseValues"
                  >
                    <Settings class="h-4 w-4" />
                    Reset Colors
                  </Button>
                </div>
              </div>
            </div>
          </div>

          <div v-else class="flex items-center justify-center h-full">
            <div class="text-center">
              <FileText class="w-12 h-12 mx-auto text-gray-400 mb-4" />
              <h3 class="text-lg font-medium text-gray-900 mb-2">Select a Component</h3>
              <p class="text-gray-500">Choose a component from the file tree to preview it here.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
/* Custom styles if needed */
</style>
