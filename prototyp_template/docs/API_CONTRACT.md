### API-kontrakt (prototyp → backend)

Detta dokument definierar förväntade endpoints, payloads och svar som frontenden bygger mot. Under prototypfasen hämtas data ofta från `src/assets/data/`, men kontraktet ska vara stabilt så att backend kan implementera samma gränssnitt.

Base URL konfigureras via `VITE_API_BASE_URL`. Standard är `/api`.

### Autentisering (`/auth`)

- POST `/auth/login`
  - body: `{ email: string; password: string }`
  - response: `{ user: { id: number; name: string; email: string; role: string }, token: string, refreshToken?: string, expiresIn?: number }`

- POST `/auth/logout`
  - headers: `Authorization: Bearer <token>` (valfritt)
  - response: `boolean`

- GET `/auth/me`
  - headers: `Authorization: Bearer <token>`
  - response: `{ id: number; name: string; email: string; role: string }` (kan utökas med `permissionGroup`)

- POST `/auth/refresh`
  - body: `{ refreshToken: string }`
  - response: `{ token: string; expiresIn: number }`

- POST `/auth/validate`
  - body: `{ token: string }`
  - response: `boolean`

- POST `/auth/change-password`
  - headers: `Authorization: Bearer <token>`
  - body: `{ oldPassword: string; newPassword: string }`
  - response: `boolean`

- POST `/auth/forgot-password`
  - body: `{ email: string }`
  - response: `boolean`

- POST `/auth/reset-password`
  - body: `{ token: string; newPassword: string }`
  - response: `boolean`

### Användare (`/users`)

- GET `/users`
  - query: `page?, pageSize?, sort?, order?, search?, ...filters`
  - response: `User[]`

- GET `/users/:id`
  - response: `User | null`

- POST `/users`
  - body: `Partial<User>`
  - response: `User`

- PUT `/users/:id`
  - body: `Partial<User>`
  - response: `User`

- DELETE `/users/:id`
  - response: `boolean`

- PUT `/users/:id/password`
  - body: `{ newPassword: string }`
  - response: `boolean`

- PUT `/users/:id/roles`
  - body: `{ roller: string[] }`
  - response: `User`

- PUT `/users/:id/units`
  - body: `{ enheter: string[] }`
  - response: `User`

Typen `User` ska spegla `src/types/entities.ts` och kan utökas med `permissionGroup` som i JSON-exemplet under `src/assets/data/permissionGroups.json`.

### Felformat

Vid fel svarar API:t med HTTP-koder och valfritt JSON-innehåll:

```
{ "message": string }
```

Frontenden mappar typade felkoder internt (se `HttpClient.getErrorCode`).

> Exempel på domänspecifika kontrakt (t.ex. kundregister) finns i `EXAMPLES.md`. Använd dem som referens, inte som krav.

### Företagsinställningar (`/settings/company`)

- GET `/settings/company`
  - response:
    ```
    {
      id: number,
      companyName: string,
      address: { street: string; zip: string; city: string; country: string },
      mainContact: { name: string; email: string; phone: string },
      logoUrl?: string | null,
      createdAt?: string,
      updatedAt?: string
    }
    ```

- PUT `/settings/company`
  - body: `Partial<CompanySettings>` (alla fält ovan valfria)
  - response: `CompanySettings`

- POST `/settings/company/logo`
  - headers: `Content-Type: multipart/form-data`
  - body: `{ file: File }`
  - response: `{ logoUrl: string }`

Notera: Under prototypfas lagras detta via en composable (`useCompanySettings`) som skyddar webbläsar-API:n. Backend ska implementera ovanstående kontrakt vid integration.
