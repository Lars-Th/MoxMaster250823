### Återkommande mönster (PATTERNS)

Praktiska, återanvändbara mönster för UI, dataflöden och arkitektur. Använd tillsammans med `RULES.md`.

#### 1) Sidlayout i @/pages/ (obligatoriskt)
- Alltid `StandardHeader.vue` överst i varje vy.
- Vänster navigation via `NavigationSidebar` (hanteras i `App.vue`).
- Bygg sidor med shared-mallar:
  - Listvyer: `ListPage.vue` + `DataTable.vue` + `ViewControls.vue` + `PaginationControls.vue`
  - Detaljvyer: `DetailPage.vue` eller `ExtendedDetailPage.vue` eller `ComplexDetailPage.vue`

#### 2) Lista + filter/sök/sort (obligatoriskt i listvyer)
- UI: Placera filter/sök i `ViewControls.vue` eller över tabellen.
- Dataflöde:
  - Mappa UI → `RequestParams` (page, pageSize, sort, order, search, filters)
  - Anropa tjänst via `useApiList(() => service.getAll(params))`
  - Visa loading/empty/error-states konsekvent
- Acceptans: Filter/sök/sort ska fungera fullt ut från start och påverka resultatlistan.

#### 3) CRUD + mutationer
- Använd `useApiMutation` för create/update/delete.
- Visa toasts vid success/error.
- Bekräfta destruktiva åtgärder med confirm-toast.

#### 4) Fel och laddning
- Laddning: `LoadingSpinner.vue` på komponentnivå.
- Fel: `ErrorBoundary.vue` runt vyer och kritiska sektioner.

#### 5) Toasts och tooltips (obligatoriskt vid feedback/hjälp)
- Toasts: `useToast` + `ToastContainer` (redan monterad i `App.vue`).
- Tooltips: `@/components/ui/tooltip` runt knappar, ikoner, och fält med hjälpinformation.

#### 6) API-tjänster och kontrakt
- Tjänster: Extenda `BaseService<T>` i `src/api/services/` och använd standard-CRUD.
- Kontrakt: Håll `docs/API_CONTRACT.md` i synk med tjänsternas endpoints och payloads.
- Typer: Håll `src/types/` som single source of truth.

#### 7) Navigering och breadcrumbs
- Använd `StandardHeader`-props för breadcrumbs (`UIBreadcrumbItem[]`).
- Undvik speciallogik i sidorna — isolera navigationsbeslut i router/helpers.

#### 8) Typografi och storlekar
- Följ regler i `RULES.md` (text-xs i tabeller, text-sm för knappar, labels i `text-[10px]`, inputs `h-8`).

#### 9) Validering
- Följ `src/validation/` och `src/types/validation.ts` mönster för schema eller regler.
- Visa fel nära fält + toast med sammanfattning vid submit.

#### 10) Återanvändbarhet och DRY
- Flytta delad logik till `src/composables/` eller `src/utils/`.
- Håll komponenter små, med en uppgift.
