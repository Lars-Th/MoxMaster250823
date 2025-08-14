### Process: stegvis AI-utveckling

Den här processen är avsedd att köras iterativt. Varje iteration ska lämna systemet i ett körbart, byggbart läge.

### 1. Initiera/uppdatera krav

- Fyll i/uppdatera `REQUIREMENTS.md` (mål, use cases, datatyper, UI-behov).
- Märk varje krav med ett unikt ID (REQ-###).

### 2. Kontraktscheck (API och typer)

- Stäm av att nödvändiga typer finns i `src/types/`.
- Justera och dokumentera endpoints i `API_CONTRACT.md` för nya/ändrade REQ.

### 3. Planera

- Lägg milstolpar/leverabler i `PROJECT_PLAN.md` för berörd iteration.
- Bryt ner arbetet i `TASKS.md` med koppling till krav-ID.

### 4. Implementera

- Skapa/uppdatera tjänster i `src/api/services/` (följ `BaseService<T>`-mönstret).
- Använd composables i `src/composables/` för dataflöde och status.
- Bygg UI med shadcn/ui + shared-komponenter. Följ typografi och höjdregler.
- Säkerställ att sidor som baseras på `DetailPage.vue` återanvänder dess rendering eller importerar shadcn-komponenter med `form-xs`/`label-xs`. Direkt åtkomst till `window`/`localStorage` ska ske via composables med guards.

### 5. Verifiera

- Bygg och kör lint. Validera UI manuellt och med tester där det är möjligt.
- Bekräfta att endpoints svarar enligt `API_CONTRACT.md` (mock eller riktig backend).

### 6. Dokumentera och leverera

- Uppdatera `REQUIREMENTS.md` med eventuella förändringar.
- Bocka av tasks i `TASKS.md`. Uppdatera projektplanens status.
 - Uppdatera `SUMMARY.md` (status), `DECISIONS.md` (nya beslut) och `TRACEABILITY.md` (kopplingar).
