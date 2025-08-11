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
  (pg.Permissions || []).forEach(permissionLabel => {
    const key = permissionMap[permissionLabel];
    if (key) {
      const baseKey = key;
      base[baseKey] = true;
    }
  });
  const detailed: DetailedPermissionGroup = {
    id: pg.PermissionGroupID,
    name: pg.GroupName,
    administreraInloggningskonton: base.administreraInloggningskonton,
    hanteraAnvandare: base.hanteraAnvandare,
    laddaUppOchRedigera: base.laddaUppOchRedigera,
    visaOchLaddaNer: base.visaOchLaddaNer,
    lasaPubliceradeNyheter: base.lasaPubliceradeNyheter,
    publiceranyheter: base.publiceranyheter,
    administreraKategorier: base.administreraKategorier,
    redigeraVerksamheter: base.redigeraVerksamheter,
    skapaVerksamheter: base.skapaVerksamheter,
  };
  return detailed;
}
