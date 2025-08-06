// Utility to map backend PermissionGroup to frontend DetailedPermissionGroup
import type { PermissionGroup } from '@/types/entities';
import type { DetailedPermissionGroup } from '@/types/enhanced';

// Example: Map Permissions array to boolean fields (adjust as needed)
const permissionMap: Record<string, keyof DetailedPermissionGroup> = {
  'Administrera inloggningskonton': 'administreraInloggningskonton',
  'Hantera användare': 'hanteraAnvandare',
  'Ladda upp och redigera': 'laddaUppOchRedigera',
  'Visa och ladda ner': 'visaOchLaddaNer',
  'Läsa publicerade nyheter': 'lasaPubliceradeNyheter',
  'Publicera nyheter': 'publiceranyheter',
  'Administrera kategorier': 'administreraKategorier',
  'Redigera verksamheter': 'redigeraVerksamheter',
  'Skapa verksamheter': 'skapaVerksamheter',
};

export function mapPermissionGroup(pg: PermissionGroup): DetailedPermissionGroup {
  const base: Omit<DetailedPermissionGroup, 'id' | 'name'> = {
    administreraInloggningskonton: false,
    hanteraAnvandare: false,
    laddaUppOchRedigera: false,
    visaOchLaddaNer: false,
    lasaPubliceradeNyheter: false,
    publiceranyheter: false,
    administreraKategorier: false,
    redigeraVerksamheter: false,
    skapaVerksamheter: false,
  };
  for (const perm of pg.Permissions) {
    const key = permissionMap[perm];
    if (key) (base as any)[key] = true;
  }
  return {
    id: pg.PermissionGroupID,
    name: pg.GroupName,
    ...base,
  };
}
