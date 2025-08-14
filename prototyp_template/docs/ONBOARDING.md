### Onboarding (snabbstart för ny AI/användare)

1) Läs igenom
- `README.md` — översikt och var saker ligger
- `RULES.md` — hur vi bygger: common/layout/shared, toasts/tooltips, filter/sök
- `PROCESS.md` — arbetsflöde per iteration

2) När du startar ett nytt projekt
- Fyll i `REQUIREMENTS.md` (krav med REQ-ID)
- Skissa kontrakt i `API_CONTRACT.md`
- Lägg plan i `PROJECT_PLAN.md`; bryt ner i `TASKS.md`
- Använd `@/pages/` för vyer med `StandardHeader.vue` överst
- Återanvänd shared-mallar. För formulär: använd shadcn-komponenter (`Input`, `Select`, `Label`, `Textarea`) och klasserna `form-xs`/`label-xs`. Undvik egna `<input>` utan shadcn.
- Åtkomst till `localStorage`/`window` ska ske via composables (se `useCompanySettings`) och alltid med guards enligt `RULES.md`.
 - När en sida i `@/pages/` används som referens, säkerställ designparitet mot `ListPage.vue`, `DetailPage.vue` eller `ComplexDetailPage.vue`. Kopiera inte avvikelser.

3) Vid varje iteration
- Uppdatera `SUMMARY.md` (status, ändringar, öppna frågor)
- Lägg beslut i `DECISIONS.md`
- Håll `TRACEABILITY.md` i synk (REQ ↔ kod ↔ kontrakt ↔ tasks)

4) Exempel
- Se `EXAMPLES.md` för illustrativa exempel. Byt ut innan implementation.
