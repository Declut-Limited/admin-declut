# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

- `npm run dev` — start the Vite dev server
- `npm run build` — type-check (`tsc -b`) then production build
- `npm run lint` — run ESLint over the whole repo
- `npm run preview` — preview the production build

There is no test runner configured in this project (no test script, no test files).

## Architecture

Declut Admin is a React 19 + TypeScript + Vite SPA (admin console for a marketplace: users, listings, escrows, transactions, disputes, etc.), styled with Tailwind CSS v4 and TanStack Query/Table.

### Feature-based structure

Code lives under `src/features/<domain>/`, each with the same shape:
- `types.ts` — domain types
- `api.ts` — axios calls
- `queries.ts` — TanStack Query hooks (`useQuery`/`useMutation`) that call `api.ts`
- `hooks.ts` — other feature-local hooks
- `components/` — `<Domain>Page.tsx` (list view), `<Domain>DetailPage.tsx`, `columns.tsx` (TanStack Table `ColumnDef` factories, usually `createXColumns(callbacks)`), and modals

**Most features are still UI scaffolding, not wired to the backend.** In most domains (`users`, `listings`, `categories`, `reviews`, `dashboard`, etc.) `api.ts`/`queries.ts`/`hooks.ts` are empty placeholder files, and the `Page` component instead holds a hardcoded mock data array with inline `console.log`/`TODO` stubs for mutations. `auth` is the domain currently being wired to the real API — use it as the reference pattern (`api.ts` calling axios → `queries.ts` wrapping it in `useMutation`/`useQuery` → component consuming the hook) when connecting another feature for real.

Shared UI lives in `src/components/generic/` (e.g. `DataTable`, `PageHeader`, `TabFilter`, `TableToolbar`, `Pagination`, `FiltersButton`, `CustomSelect`, `RowActionsMenu`, `BaseModal`, form inputs). New list/detail pages should compose from these rather than rebuilding table/filter/pagination chrome. `src/components/layout/DashboardLayout.tsx` (`Sidebar` + `TopNav` + `<Outlet/>`) wraps all authenticated routes.

### Routing

`react-router-dom` v7 (`BrowserRouter`) is the router in use — set up in [src/main.tsx](src/main.tsx) with all routes declared in one place in [src/App.tsx](src/App.tsx). `@tanstack/react-router` is also listed in `package.json` but is not actually used anywhere; don't use it for new routes. Auth pages (`/sign-in`, `/forgot-password`, etc.) are unprotected top-level routes; everything else nests under the `DashboardLayout` route element. Routes are not currently auth-guarded (noted with a `// protect the routes later` comment in `App.tsx`).

### API clients — two in parallel during migration

There are currently two axios instances:
- [src/lib/api/client.ts](src/lib/api/client.ts) (`export const api`) — the current one. Reads `VITE_BASE_URL`, sends `access_token` from `localStorage` as a bearer token, and auto-refreshes on 401 via `refresh_token` (queues concurrent requests during refresh, redirects to `/login` on refresh failure). New/updated features (e.g. `auth`) import from `@/lib/api/client`.
- [src/lib/api-client.ts](src/lib/api-client.ts) (`export const apiClient`) — legacy, reads `VITE_API_URL`, uses a single `token` key, no refresh logic. Not currently imported anywhere; treat as superseded rather than extending it.

When adding real API calls to a feature, use `@/lib/api/client`.

### Styling & theming

Tailwind v4 with CSS-first config in [src/index.css](src/index.css) (`@theme` for brand tokens like `--color-brand-blue`, `--font-standerd`). Dark mode is class-based (`@custom-variant dark (&:where(.dark, .dark *))`), driven by `src/lib/theme/ThemeProvider.tsx` + `useTheme.ts`. Rather than inlining long utility strings per component, recurring per-feature UI (auth screens, dashboard cards/charts, detail pages, settings panels) has named component classes defined via `@apply` under grouped `@layer components` blocks in `index.css` (e.g. `.stats-card`, `.detail-stat-card`, `.settings-panel`) — prefer extending these blocks over duplicating utility strings when a pattern repeats across a feature.

### Path alias

`@/*` resolves to `src/*` (configured in both `vite.config.ts` and `tsconfig.app.json`).

### Env vars

Defined in `.env`: `VITE_BASE_URL` (current API base, used by `lib/api/client.ts`), `VITE_APP_VERSION`. `VITE_API_URL` is read by the legacy `lib/api-client.ts` but not set in `.env`.
