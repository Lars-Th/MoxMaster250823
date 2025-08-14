### Regelstruktur: AI-driven utveckling i denna template

Denna regelstruktur vägleder hur en AI (och teamet) konsekvent utvecklar nya projekt baserat på templaten. Den är avsedd att vara kort, praktisk och möjlig att automatisera.

### 1. Källor och importregler

- Använd alltid typer från `src/types/` och utöka dem vid behov, i stället för att duplicera typer.
- Importer ska vara absolut med `@`-prefix (inte relativa vägar).
- UI-komponenter: använd shadcn/ui från `src/components/ui/` i första hand, shared-komponenter i `src/components/shared/` i andra hand.
- Prototypdata ska initialt hämtas från `src/assets/data/` och sedan migreras till backend-endpoints.

### 2. Arkitektur och ansvar

- `HttpClient` ansvarar för transport (timeouts, retries, headers, felhantering).
- `BaseService<T>` definierar standard-CRUD och gemensam logik för domänspecifika tjänster.
- Domänspecifika tjänster i `src/api/services/` exponerar affärsoperationer och följer REST-kontraktet.
- Sidor i `src/pages/` är tunna och använder composables (`src/composables/`) samt shared/ui-komponenter.
- Typer och kontrakt ligger i `src/types/` och ska vara single source of truth.

### 3. UI och designprinciper

- Följ shadcn/ui-konventioner. Konsistenta textstorlekar enligt shared-komponenterna: `text-xs` för tabeller, `text-sm font-medium` för knappar, `text-[10px] font-medium text-foreground/80` för labels, och `h-8` för kompakta inputs.
- Använd sidmallar från `src/components/shared/` (t.ex. `ListPage.vue`, `DetailPage.vue`, `ExtendedDetailPage.vue`, `ComplexDetailPage.vue`) som layoutreferenser. När en ny vy skapas i `@/pages/` ska layouten följa någon av dessa exempel.
- Alla vyer i `@/pages/` ska alltid ha `StandardHeader.vue` överst (importera från `@/components/layout/StandardHeader.vue`).
- Appens vänsternavigation ska baseras på `@/components/layout/NavigationSidebar.vue` och dess interaktioner.
- Common-komponenter i `@/components/common` (t.ex. `Toast`, `ToastContainer`, `LoadingSpinner`, `ErrorBoundary`) ska användas som första val vid behov.
- Tooltips (mouseover-texter) ska implementeras omedelbart med `@/components/ui/tooltip`. Skjut inte upp införandet.
- Toasts ska användas från start (via `useToast` och `ToastContainer` finns redan monterad i `App.vue`).

### 4. Dataflöde och API-koppling

- Under prototyp: läs från JSON. Vid backend-integration: peka `VITE_API_BASE_URL` och verifiera att endpoints i `src/api/services/` stämmer med `API_CONTRACT.md`.
- Håll `src/types/` i synk med backendens schema. Ändringar kräver uppdatering av både typer och `API_CONTRACT.md`.
- Filter och sök ska vara fullt fungerande från början: koppla UI-filter till query-parametrar (`RequestParams`) och konsumera via tjänstelagret (`BaseService.getAll`). Använd `useApiList` och säkerställ att resultat, tom-lista, loading och error-states hanteras korrekt.

### 5. Felhantering och loading

- Använd `useApi`, `useApiList`, `useApiItem`, `useApiMutation` för standardiserad state-hantering (loading, error, success) och enkel caching.
- Visa fel och laddningsstatus konsekvent med shared/ui-komponenter.

### 6. Kravspec och spårbarhet

- All utveckling drivs av `REQUIREMENTS.md`. Taskar i `TASKS.md` ska referera till krav-IDn.
- Projektplanen i `PROJECT_PLAN.md` styr milstolpar. Varje PR kopplas till tasks och krav.

### 7. Kodkvalitet

- Följ Clean Code och TypeScript-bästa praxis. Undvik `any`, använd explicita typer för publika APIer.
- DRY: extrahera gemensam logik till composables, utils eller bas-klasser.
- Lint-regler i `eslint.config.js` ska passera utan varningar.

### 8. Leverabler per steg (AI-ritualer)

1) Uppdatera `REQUIREMENTS.md` (nya/ändrade krav) och länka ärenden.
2) Uppdatera `API_CONTRACT.md` om kontrakt påverkas (endpoints, payloads, svar).
3) Implementera kod enligt tjänstelager och typer. Skriv tester när det är möjligt.
4) Uppdatera `PROJECT_PLAN.md` milstolpar om scope ändras.
5) Lägg till/uppdatera tasks i `TASKS.md` med tydliga acceptance criteria.
