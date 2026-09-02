# AGENTS.md

## Project Overview

React 19 + Vite 7 SPA for a ride-booking system. Three role-based dashboards: Admin, Rider, Driver.

## Key Commands

- `bun run dev` -- Vite dev server
- `bun run build` -- runs `tsc -b && vite build` (typecheck must pass before build)
- `bun run lint` -- ESLint flat config
- `bun run preview` -- serve production build locally

No test suite exists. No formatter is configured (no Prettier/Biome).

## Architecture

- **Entry**: `src/main.tsx` -> `src/App.tsx` -> routes
- **Routing**: `src/routes/routes.tsx` uses `react-router` v7 `createBrowserRouter`. Role-based dashboards use `withAuth()` HOC to guard routes by role.
- **State**: Redux Toolkit with RTK Query. API layer is `src/redux/baseApi.ts` backed by a custom axios base query (`src/redux/axiosBaseQuery.ts`), not the default RTK fetch base query.
- **HTTP**: `src/lib/axios.ts` -- shared Axios instance with `withCredentials: true`, automatic JWT refresh on 500 + "jwt expired". Base URL from `VITE_BASE_URL` env var.
- **UI**: shadcn/ui (new-york style, see `components.json`). Components live in `src/components/ui/`. Module-specific components in `src/components/modules/`.
- **Sidebar/Dashboard**: Role-specific sidebar items defined in `src/routes/{admin,rider,driver}SidebarItems.tsx`, flattened into routes via `generateSidebarRoutes()`.

## Path Alias

`@/` maps to `src/` (configured in both `vite.config.ts` and `tsconfig.app.json`).

## Env

`.env` contains `VITE_BASE_URL`. Vite exposes `VITE_*` vars via `import.meta.env`. Backend is at `https://ride-booking-system-backend.vercel.app/api`.

## Code Conventions

- Strict TypeScript: `noUnusedLocals`, `noUnusedParameters`, `noFallthroughCasesInSwitch` are all enabled.
- `verbatimModuleSyntax` is on -- use `import type` for type-only imports.
- API slice files follow pattern: `src/redux/features/{domain}/{domain}.api.ts` plus `src/redux/safetyContact/safetyContact.api.ts`.
- Tag types for cache invalidation: `USER`, `RIDES`, `REPORT`, `DRIVER`, `ALERT`, `SAFETY`.
- Roles are uppercase strings: `"ADMIN" | "RIDER" | "DRIVER"` (see `src/constants/role.ts`).

## Deployment

Deployed on Vercel. `vercel.json` has a catch-all rewrite to `index.html` for SPA routing support.

## Directory Note

The `src/pages/driver/` directory is lowercase while `src/pages/Admin/` and `src/pages/Rider/` are PascalCase -- this is intentional, do not "fix" it.
