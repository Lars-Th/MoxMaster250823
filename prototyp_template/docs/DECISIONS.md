### Beslutslogg (ADR-light)

Enkla, korta beslut för spårbarhet. Skapa nya poster högst upp.

#### [ADR-000] Mallstruktur och regler (YYYY-MM-DD)
- Kontext: Initial template och utvecklingsregler sattes.
- Beslut: Använd `RULES.md`, `PROCESS.md`, `SUMMARY.md`, `TRACEABILITY.md`, `EXAMPLES.md`.
- Konsekvenser: Bättre onboarding, tydlig spårbarhet.
- Alternativ: Fördela på fler filer — bedömdes överdrivet initialt.

#### [ADR-XXX] <Titel> (YYYY-MM-DD)

#### [ADR-001] Säker hantering av företagsinställningar och browser-API (2025-08-14)
- Kontext: Ett fel uppstod när `localStorage` lästes i `NavigationSidebar.vue` utan guard. Även en ny sida (`CompanySettings.vue`) duplicerade inputmarkup och saknade shadcn-importer, vilket gav inkonsekvent UI.
- Beslut: Införa composable `useCompanySettings` som enda källa för läs/skriv av företagsinställningar. All åtkomst till webbläsar-API sker bakom `typeof window !== 'undefined'` och via composables. Sidor som baseras på `DetailPage.vue` ska återanvända standardrenderingen eller importera shadcn-komponenter explicit och använda `form-xs`/`label-xs`.
- Konsekvenser: Stabilare klient, inga SSR-relaterade fel, konsekvent UI. Dokumentation uppdaterad i `RULES.md` och kontrakt i `API_CONTRACT.md`.
- Alternativ: Fortsätta direktanropa `localStorage` i komponenter — förkastat p.g.a. risk och duplicerad logik.
- Kontext:
- Beslut:
- Konsekvenser:
- Alternativ:
