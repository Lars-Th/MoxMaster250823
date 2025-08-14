### Återkommande mönster (PATTERNS)

Praktiska, återanvändbara mönster för UI, dataflöden och arkitektur. Använd tillsammans med `RULES.md`.

#### 1) Sidlayout i @/pages/ (obligatoriskt)
- Alltid `StandardHeader.vue` överst i varje vy.
- Vänster navigation via `NavigationSidebar` (hanteras i `App.vue`).
- Bygg sidor med shared-mallar:
  - Listvyer: `ListPage.vue` + `DataTable.vue` + `ViewControls.vue` + `PaginationControls.vue`
  - Detaljvyer: `DetailPage.vue` eller `ComplexDetailPage.vue`
  - Om en sida i `@/pages/` används som referens, säkerställ att den själv följer dessa mallar. Annars refaktorera den först.

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

#### 11) Formulär i sidor som använder `DetailPage.vue`
- Återanvänd standardrendering via `mainFields`/`sidebarFields` när det går.
- Om `#main-content`-slot överstyr layouten, importera shadcn-komponenter (`Input`, `Select`, `Label`, `Textarea`) och applicera klasserna `form-xs` på inputs/selects och `label-xs` på labels.
- Undvik att blanda egna element (`<input>`) med shadcn-styling — använd alltid shadcn-komponenterna för konsistens.

#### 12) ListPage och filter
- Använd `ViewControls` för sök/filters/åtgärder. Bindningar sker med `@update:modelValue` (camelCase).
- Select/Input i kontrollerna ska spegla lokalt UI-tillstånd för omedelbar återkoppling och samtidigt emit:a uppåt.
- `DataTable` använder `text-xs`; actions och paginering följer knappriktlinjer.

#### 13) Beskrivningskolumn i detaljsidor
- Rubrik: “Beskrivning”. Innehåll: 1..N avsnitt med ram (`border`), rubrik `text-xs font-medium text-gray-600` och brödtext `text-xs text-gray-700`.
- Passa in via `descriptionSections`-prop eller slot, men följ samma typografi.

#### 9) Validering
- Följ `src/validation/` och `src/types/validation.ts` mönster för schema eller regler.
- Visa fel nära fält + toast med sammanfattning vid submit.

#### 10) Återanvändbarhet och DRY
- Flytta delad logik till `src/composables/` eller `src/utils/`.
- Håll komponenter små, med en uppgift.
