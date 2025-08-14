### Översikt: Prototyp-template och hur den hänger ihop

Denna template är byggd för snabb prototypframtagning där frontenden drivs av JSON-data och tydliga tjänstelager. Den är anpassad för att senare kopplas mot ett backendramverk via väldefinierade endpoints och scheman.

- **Byggverktyg**: Vite + Vue 3 (Composition API, TypeScript)
- **Stil/UI**: Tailwind + shadcn/ui-komponenter under `src/components/ui/` och delade mallar under `src/components/shared/`
- **Data**: JSON-filer under `src/assets/data/` i tidig prototypfas
- **Typer**: Delade typer/kontrakt i `src/types/`
- **API**: HTTP-klient och tjänster i `src/api/` (kopplas först mot mock/data, sedan backend)
- **Routing**: `src/router/` med modulära route-grupper

### Viktiga kataloger och filer

- `src/assets/data/` — JSON-källa för prototypens data (ex: `users.json`, `permissionGroups.json`).
- `src/api/client/http-client.ts` — Generisk `HttpClient` med timeout, headers, retries, felhantering.
- `src/api/config/api-config.ts` — Skapar och exponerar tjänster (ex: `users`, `auth`) utifrån `HttpClient` och bas-URL.
- `src/api/services/` — Domänspecifika tjänster som följer REST-kontrakt. `BaseService<T>` ger `getAll`, `getById`, `create`, `update`, `delete` och möjlighet till egna endpoints.
- `src/pages/` — Alla vyer ska läggas under `@/pages/` och nyttjar shared- och ui-komponenter.
- `src/components/shared/` — Sidmallar (ex: `ListPage.vue`, `DetailPage.vue`) och tabell-/paginering-/view-kontroller.
- `src/components/ui/` — shadcn/ui-biblioteket för konsistenta UI-komponenter.
- `src/types/` — Centrala typer (API, entities, auth, table, validation m.m.).
- `src/router/routes.ts` — Samlade rutter (auth, settings, home, development, utility).

### Från prototyp till backend

1) Definiera och synka schema i `src/types/` med JSON-struktur i `src/assets/data/`.
2) Säkerställ att tjänster i `src/api/services/` använder REST-endpoints som kan mappas 1:1 mot backend.
3) Sätt `VITE_API_BASE_URL` och peka `HttpClient` mot backend när det är redo.
4) Ersätt/mocka data via `src/api/mocks/` vid behov under utveckling.

### Komma igång med en ny prototyp (exempel: kundregister)

Följ dessa steg om du är ovan och vill skapa t.ex. ett kundregister (kunder och kontaktpersoner):

1) Krav och mål
- Öppna `docs/REQUIREMENTS.md` och lägg till krav (t.ex. REQ-101 Lista kunder, REQ-102 Hantera kontaktpersoner, REQ-103 Sök/filtrera på namn/ort m.m.).
- Skriv kort vad listan ska visa (kolumner) och vad detaljsidan ska innehålla.

2) Typer och data
- Definiera typer för `Customer` och `ContactPerson` i `src/types/` (entiteter och relationer).
- Under prototyp: skapa JSON-filer i `src/assets/data/` (ex. `customers.json`, `customerContacts.json`) och håll dem i synk med typerna.

3) API-kontrakt
- Öppna `docs/API_CONTRACT.md` och lägg till endpoints (ex. `/customers`, `/customers/:id`, `/customers/:id/contacts`).
- Beskriv request/response så att backend kan implementera samma kontrakt.

4) Sidor i `@/pages/`
- Skapa vyer under `@/pages/`: t.ex. `CustomerList.vue` och `CustomerDetail.vue`.
- Använd `@/components/layout/StandardHeader.vue` överst på varje vy och vänsternavigationen via `NavigationSidebar` (redan i `App.vue`).
- Bygg layout utifrån `@/components/shared/` (t.ex. `ListPage.vue` + `DataTable.vue` för listan och `DetailPage.vue` för detaljer).

5) Filter, sök, UI-beteenden
- Implementera sök- och filterfält direkt (koppla till query-parametrar via tjänstelagret). Använd `useApiList` för listor.
- Använd toasts (via `useToast` + `ToastContainer`) och tooltips från start för feedback och hjälpinformation.

6) Plan och tasks
- Bryt ner arbetet i `docs/TASKS.md` och koppla varje task till ett krav-ID och (om relevant) milstolpe i `docs/PROJECT_PLAN.md`.

Tips: Följ `docs/PROCESS.md` per iteration för att hålla allt i synk (krav ↔ kontrakt ↔ kod). Alla vyer ska ligga under `@/pages/`.

### Läs vidare

- `RULES.md` — Regelstruktur för hur en AI ska utveckla ett projekt stegvis i denna template.
- `PROCESS.md` — Praktisk process och arbetsflöde (iterativt och spårbart).
- `REQUIREMENTS.md` — Kravspec-mall som fylls på och uppdateras löpande.
- `API_CONTRACT.md` — Förväntade endpoints, payloads och responsformat.
- `PROJECT_PLAN.md` — Projektplaneringsmall (mål, milstolpar, leverabler).
- `TASKS.md` — Tasklista/checklistor kopplade till planen.
 - `ONBOARDING.md` — Snabbstart och var/när dokument uppdateras.
 - `SUMMARY.md` — Levande sammanfattning per iteration.
 - `DECISIONS.md` — Beslutslogg (ADR-light).
 - `TRACEABILITY.md` — Koppling REQ ↔ kod ↔ kontrakt ↔ tasks.
 - `EXAMPLES.md` — Illustrativa exempel (måste ersättas före implementation).
 - `PATTERNS.md` — Återkommande UI/arkitekturmönster att följa.

### Dokumenthierarki och uppdateringsansvar

```
docs/
├─ README.md            (ingång/översikt, länkar till allt)
├─ ONBOARDING.md        (snabbstart; vad som uppdateras när)
├─ RULES.md             (regler: common/layout/shared, toasts/tooltips, filter/sök)
├─ PROCESS.md           (arbetsflöde per iteration)
├─ REQUIREMENTS.md      (kravspec med REQ-ID)
├─ API_CONTRACT.md      (endpoints/payloads/svar; hålls i synk med tjänster)
├─ PROJECT_PLAN.md      (mål, milstolpar, leverabler)
├─ TASKS.md             (tasks kopplade till REQ och milstolpe)
├─ SUMMARY.md           (levande sammanfattning efter varje iteration)
├─ DECISIONS.md         (ADR-light; beslut och konsekvenser)
├─ TRACEABILITY.md      (REQ ↔ sidor ↔ typer ↔ endpoints ↔ tasks)
├─ PATTERNS.md          (återkommande mönster att följa)
└─ EXAMPLES.md          (illustrativa exempel; byt ut innan implementation)
```

Vem uppdaterar vad (och när)
- Användare: initierar/justerar `REQUIREMENTS.md`, godkänner `DECISIONS.md`, sätter scope i `PROJECT_PLAN.md`.
- AI: föreslår/uppdaterar `REQUIREMENTS.md`, `API_CONTRACT.md`, `TASKS.md`, `PATTERNS.md`; håller `SUMMARY.md` och `TRACEABILITY.md` uppdaterade; loggar beslut i `DECISIONS.md`; underhåller `EXAMPLES.md` som referens.
- Båda: `RULES.md` och `PROCESS.md` vid behov; `ONBOARDING.md` när onboarding förändras.

När i processen
- Projektstart: `REQUIREMENTS.md`, `API_CONTRACT.md` (skelett), `PROJECT_PLAN.md`, `TASKS.md`.
- Iterationsstart: revidera `PROJECT_PLAN.md` och `TASKS.md` enligt scope.
- Under implementation: håll `API_CONTRACT.md` och typer i synk; följ `PATTERNS.md` och `RULES.md`.
- Iterationsslut: uppdatera `SUMMARY.md`, `DECISIONS.md`, `TRACEABILITY.md`.
