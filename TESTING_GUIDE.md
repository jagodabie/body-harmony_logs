# Testing Guide — Body Harmony Logs

## Narzędzia

| Narzędzie | Cel |
|-----------|-----|
| **Vitest** | Testy jednostkowe i komponentów (izolowane, szybkie) |
| **Playwright** | Testy E2E — pełne flow użytkownika w przeglądarce |

---

## Uruchamianie testów

### Vitest

```bash
npm test              # tryb watch (podczas developmentu)
npm run test:run      # jednorazowe uruchomienie (CI)
npm run test:ui       # interfejs przeglądarkowy Vitest UI
```

### Playwright

```bash
npm run test:e2e          # headless, Chromium, mobile viewport
npm run test:e2e:ui       # Playwright UI — podgląd kroków, trace
```

> Playwright automatycznie startuje `npm run dev` na porcie 3002 przed testami.
> Jeśli dev server już działa, ponownie go nie uruchamia.

---

## Co testujemy czym

### Vitest — komponenty i hooki

Testuj rzeczy **bez przeglądarki** — logikę i renderowanie w izolacji:

- Komponenty prezentacyjne (props → wyrenderowany HTML)
- Hooki: obliczenia makroskładników, formatowanie dat, walidacja formularzy
- Funkcje pomocnicze z `utils/`
- Zustand stores — akcje i stan bez side-effectów UI

**Nie używaj** Vitest do testowania nawigacji między widokami, integracji z prawdziwym API ani przepływów wieloekranowych.

### Playwright — E2E flow użytkownika

Testuj **zachowanie aplikacji jako całości** na mobile viewporcie (Pixel 5):

- Dodawanie posiłku od skanu EAN do zapisu — pełny flow
- Dodawanie wpisu BodyLog (waga, wymiary)
- Widok historii — ładowanie danych, paginacja
- Nawigacja między zakładkami
- Stany błędów (BE niedostępny, brak wyników wyszukiwania)

---

## Konwencje nazewnictwa

### Pliki

```
src/components/Button/Button.test.tsx       ← test komponentu
src/hooks/useMacros/useMacros.test.ts       ← test hooka
src/utils/formatDate.test.ts                ← test funkcji pomocniczej
e2e/addMeal.e2e.ts                          ← test E2E
e2e/bodyLog.e2e.ts                          ← test E2E
```

### Bloki `describe` / `it`

```ts
// Vitest
describe('Button', () => {
  it('renders label', () => { ... })
  it('calls onClick on press', () => { ... })
})

describe('useMacros', () => {
  it('returns correct calories for given macros', () => { ... })
})

// Playwright
test.describe('Add meal flow', () => {
  test('user can search product by name and log it', async ({ page }) => { ... })
})
```

Zasada: `describe` = nazwa komponentu / hooka / flow, `it`/`test` = konkretne zachowanie w czasie teraźniejszym.

---

## Mockowanie API

### Vitest — `vi.mock` / `vi.fn`

```ts
import { vi } from 'vitest'
import * as mealsApi from '@/api/meals'

vi.mock('@/api/meals')

beforeEach(() => {
  vi.mocked(mealsApi.getMeals).mockResolvedValue([
    { id: '1', name: 'Owsianka', calories: 350 }
  ])
})
```

Mocki resetuj w `afterEach` lub używaj `vi.restoreAllMocks()` w konfiguracji.

### Playwright — `page.route`

Mockuj requesty do backendu, żeby testy nie zależały od Railway:

```ts
import { test, expect } from '@playwright/test'

test('shows meal list', async ({ page }) => {
  await page.route('**/api/meal-logs**', route =>
    route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify([
        { id: '1', name: 'Owsianka', calories: 350, date: '2026-03-26' }
      ]),
    })
  )

  await page.goto('/')
  await expect(page.getByText('Owsianka')).toBeVisible()
})
```

Rejestruj route **przed** `page.goto`. Możesz też użyć `page.routeFromHAR` dla bardziej złożonych scenariuszy.

---

## Co NIE wymaga testowania

- **Konfiguracja** — `vite.config.ts`, `playwright.config.ts`, ESLint
- **Typy TypeScript** — kompilator sam je weryfikuje (`tsc --noEmit`)
- **Stałe** — `src/constants/` (chyba że zawierają logikę)
- **CSS / style** — klasy BEM, tokeny kolorów
- **Routing** — sam `react-router-dom` jest już przetestowany przez jego twórców
- **Biblioteki zewnętrzne** — MUI, react-hook-form, Zustand (testuj tylko integrację z nimi, nie ich wewnętrzne działanie)
- **Generowany kod** — PWA service worker, manifest
