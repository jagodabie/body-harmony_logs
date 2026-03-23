# Body Harmony Logs — Status

_Last updated: 2026-03-23_

---

## 1. Implemented

### Infrastructure
- PWA project (Vite + vite-plugin-pwa, React 19 + TypeScript strict)
- Router (`react-router-dom 7`) with separated router config
- Global CSS variable system (color, spacing, shadow, breakpoint tokens)
- API layer (`src/api/`): `meals.api.ts`, `products.api.ts`, `weightLogs.api.ts`, error handling (`errorHandling.ts`)
- Zustand stores: `useMealLogsStore`, `useWeightLogsStore`, `useUIStore`, helpers (`storeHelpers.ts`)
- Global error handling with user feedback (Snackbar)
- `OverlayLoader` — loading indicator

### Views
- **Home** — start screen
- **MealLogs** — meal log view with day section (`DayOfEating`), macros display
- **WeightLogs** — body weight log view
- **AddProduct** — adding a product to a meal:
  - EAN barcode scanning via camera (`EANCodeScanner`, `@zxing/browser`)
  - Product search by name
  - Product confirmation before saving
  - `ProductCard` — product card with macros
  - Save product to meal (full e2e flow working)

### Reusable components
- `Button`, `InputBase`, `SelectBase`, `FormBase`, `GenericLogModal`
- `EANCodeScanner` (with torch support)
- `ProductCard`
- `Snackbar`

### Hooks
- `useAddProductToMeal` — add product logic
- `useDateUtils` — date helpers
- `useWeightCalculation` — weight calculations

---

## 2. In progress

- Style refinements (last commit: `feat(): style changes`) — UI is functional, visual polish ongoing
- BE/FE contract alignment (product response types, product IDs)
- Product search by name (`AddProduct`) — implemented

---

## 3. Next planned steps

Based on the roadmap in `CLAUDE.md`:

1. **Authentication** — currently single-user with no auth; add login/registration
2. **FE tests** — intentionally skipped for now; test agent planned as a next step
3. **General** — style and UX stabilisation, potential WeightLogs view extension (charts/history)
