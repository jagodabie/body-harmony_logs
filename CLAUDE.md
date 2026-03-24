# Body Harmony Logs — CLAUDE.md

## Project overview

PWA for logging meals and body weight. Mobile-first standalone PWA, single-user, no authentication. Part of the **Body Harmony** ecosystem (FE + BE as separate repos).

## Stack

- React 19 + TypeScript 5.8 (strict mode)
- Vite 6 + vite-plugin-pwa
- Material UI 7
- Zustand (state management)
- react-hook-form
- react-router-dom 7
- @zxing/browser (EAN barcode scanning)

## Commands

```bash
npm run dev          # dev server on port 3002
npm run build        # tsc -b && vite build
npm run lint         # ESLint
npm run dev:tunnel   # cloudflared tunnel (PWA testing on mobile)
```

## Environment

Single environment variable — backend URL:

```
VITE_API_URL=http://localhost:PORT   # local dev (.env)
VITE_API_URL=https://web-production-e7a84.up.railway.app  # production
```

- `.env` — local dev, ignored by git
- `.env.production` — local production build, ignored by git
- **Vercel** — set `VITE_API_URL` in project Settings → Environment Variables (Vite injects it at build time)

Backend is hosted on Railway in production. FE deployed on Vercel. No staging — dev and production only.

## Backend

Separate repo: `body-harmony-BE` (Node.js / Express / MongoDB). FE communicates through `src/api/`. Product data by EAN and name comes from OpenFoodFacts — the backend fetches and processes it before sending to FE.

## src/ architecture

```
src/
├── api/          # HTTP clients (meals, products, weightLogs)
├── app/          # App.tsx, router, layouts, global styles
├── components/   # reusable components (each in its own folder)
├── constants/    # global constants
├── hooks/        # hooks shared across views
├── stores/       # Zustand stores (mealLogs, weightLogs, UI)
├── types/        # global types (MealLogs, WeightLog, index)
├── utils/        # helpers (dates, macros, barcode)
└── views/        # views: Home, MealLogs, WeightLogs, AddProduct
```

## Code conventions

### Components

- Each component in its own folder: `src/components/ComponentName/ComponentName.tsx`
- Styles in `index.css` in the same folder (plain CSS, BEM)
- Complex logic extracted to `hooks/` subfolder
- Props defined as `type ComponentNameProps = {}`
- Named export only, never `export default`
- Always arrow function, props destructured, `className = ""`

```tsx
type ButtonProps = {
  label: string;
  onClick: () => void;
  className?: string;
};

export const Button = ({ label, onClick, className = "" }: ButtonProps) => {
  return <button className={`button ${className}`} onClick={onClick}>{label}</button>;
};
```

### TypeScript

- `type` over `interface` for component props
- No `any` — use `unknown` if needed
- Events typed explicitly: `React.ChangeEvent<HTMLInputElement>`
- `import React` not required (`jsx: "react-jsx"`)

### CSS

- **Never** hardcoded colors (`#fff`, `white`, `rgba(...)`) — always CSS variables
- Variables defined in `src/index.css`, available globally
- BEM for class names
- No CSS Modules, styled-components, or emotion
- No inline styles

Available tokens: `--color-primary`, `--color-surface`, `--color-text`, `--space-*`, `--radius-*`, `--shadow-*`, `--bp-*`

## Roadmap

1. Authentication (currently none — single-user)
2. Testing agent (no FE tests — intentional for now)

### Proactive Suggestions
- Propose improvements proactively, but **always ask before implementing**.
- Keep suggestions focused — no unsolicited refactors beyond what was asked.