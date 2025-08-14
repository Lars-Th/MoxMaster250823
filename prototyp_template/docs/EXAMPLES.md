### EXEMPEL (illustrativa) – Använd inte som krav i skarpt projekt

Underhåll
- Statusetiketter per exempel: `[status: draft|adopted|archived]`
- Metadata: Domän, Senast uppdaterad, Relaterade REQ-ID
- Vid iterationens slut: uppdatera länkar till `SUMMARY.md` och flytta mönster till `RULES.md`/`PATTERNS.md` vid behov

Exemplen nedan visar hur du kan fylla i mallarna. De är avsedda att guida användare och AI, men ska alltid ersättas av projektets verkliga behov innan implementation.

---

### Komma igång – exempel: kundregister

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

---

### Kravspec – exempel: kundregister (utkast att granska)

0. Sammanfattning
- Syfte: Möjliggöra registrering och hantering av kunder och deras kontaktpersoner.
- Primära användare: Administratörer, sälj/handläggare.
- Viktigaste målen: Snabb översikt, effektiv sök/filter, enkel CRUD, tydliga detaljer.

1. Affärsmål
- REQ-001: Användare ska snabbt kunna hitta rätt kund via sök/filter.
- REQ-002: Minimera inmatningstid för handläggare (förval, validering, toasts/feedback).

2. Funktionella krav
- REQ-101: Lista kunder med kolumner: Kundnr, Namn, Ort, Status, Senast uppdaterad.
  - [ ] Paginering, sortering, sök (namn, kundnr) och filter (ort, status)
- REQ-102: Visa kunddetaljer (basinfo, adress, kontaktpersoner, metadata)
  - [ ] Redigera basfält; toasts vid sparande; tooltips på fält med hjälptext
- REQ-103: CRUD för kund (skapa, uppdatera, ta bort) med validering
  - [ ] Bekräfta borttagning (confirm-toast)
- REQ-104: Hantera kontaktpersoner kopplade till kund
  - [ ] Lägg till/uppdatera/ta bort kontaktperson; markera primär
- REQ-105: Export av kundlista (CSV) — omfång att bekräfta

3. Icke-funktionella krav
- REQ-201: Prestanda — lista 50 kunder under 300 ms (mockdata), sort/sök < 200 ms på klient
- REQ-202: Tillgänglighet — stöd för tangentbordsnavigering, tooltips och aria-labels

4. Data och domän (förslag)
- Entitet `Customer`:
  - id:number, customerNumber?:string, name:string, orgNumber?:string
  - address?:{ street?:string; zip?:string; city?:string; country?:string }
  - email?:string, phone?:string
  - status?:'Aktiv'|'Inaktiv'
  - tags?:string[]
  - createdAt?:string, updatedAt?:string
- Entitet `ContactPerson`:
  - id:number, customerId:number, name:string, role?:string
  - email?:string, phone?:string, isPrimary?:boolean

5. API-behov (översikt)
- `/customers`, `/customers/:id`, `/customers/:id/contacts` (GET/POST/PUT/DELETE)

6. UI/UX
- Navigationsflöden: Lista → Detalj → Redigera; kontakthantering i detaljvy
- Komponenter: `ListPage.vue`, `DataTable.vue`, `DetailPage.vue`, tooltips, toasts

7. Risker och antaganden
- Antaganden: 1 kund → N kontaktpersoner; unik identifikation via kundnr eller id
- Risker: Datakvalitet (dubbletter), personuppgifter (GDPR) — kräver riktlinjer

---

### API-kontrakt – exempel: kundregister

Typer (förslag)

Customer
```
{
  id: number,
  customerNumber?: string,
  name: string,
  orgNumber?: string,
  address?: { street?: string; zip?: string; city?: string; country?: string },
  email?: string,
  phone?: string,
  status?: 'Aktiv' | 'Inaktiv',
  tags?: string[],
  createdAt?: string,
  updatedAt?: string
}
```

ContactPerson
```
{
  id: number,
  customerId: number,
  name: string,
  role?: string,
  email?: string,
  phone?: string,
  isPrimary?: boolean
}
```

Endpoints

- GET `/customers`
  - query: `page?, pageSize?, sort?, order?, search?, city?, status?, tag?`
  - response: `Customer[]`

- GET `/customers/:id`
  - response: `Customer | null`

- POST `/customers`
  - body: `Partial<Customer>`
  - response: `Customer`

- PUT `/customers/:id`
  - body: `Partial<Customer>`
  - response: `Customer`

- DELETE `/customers/:id`
  - response: `boolean`

- GET `/customers/:id/contacts`
  - response: `ContactPerson[]`

- POST `/customers/:id/contacts`
  - body: `Partial<ContactPerson>`
  - response: `ContactPerson`

- PUT `/customers/:id/contacts/:contactId`
  - body: `Partial<ContactPerson>`
  - response: `ContactPerson`

- DELETE `/customers/:id/contacts/:contactId`
  - response: `boolean`

---

### Projektplan och Tasks – exempel: kundregister

Plan (exempel)

- M1: Kundlista (datum)
  - Leverabler: `Customer`-typ, mockdata, `/customers`-endpoint i kontrakt, `CustomerList`-vy, sök/filter/sort, toasts/tooltips
- M2: Kunddetalj och kontaktpersoner (datum)
  - Leverabler: `ContactPerson`-typ, endpoints för kontakter, `CustomerDetail`-vy med kontakthantering, validering, confirm-toast vid borttagning
- M3: Stabilisering och export (datum)
  - Leverabler: CSV-export, förbättrade filter, dokumentation och tester

Tasks (exempel)

- [ ] Definiera `Customer` och `ContactPerson` i `src/types/`
- [ ] Uppdatera `API_CONTRACT.md` med `/customers` och kontakter
- [ ] Skapa `CustomerList.vue` i `@/pages/` med `ListPage.vue` + `DataTable.vue`
- [ ] Implementera sök/filter/sort via tjänstelagret och `useApiList`
- [ ] Använd `StandardHeader.vue`, tooltips och toasts
- [ ] Skapa `CustomerDetail.vue` med kontaktpersoner
- [ ] CRUD för kund och kontakter inkl. confirm-toast
- [ ] CSV-export
