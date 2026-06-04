# AROSOFT Innovations Platform Plan

## Sprint 0 Review

### Current Stack

- Workspace: pnpm monorepo using `pnpm-workspace.yaml`.
- Language: TypeScript.
- Frontend: React 19, Vite, Wouter routing, TanStack Query, Tailwind CSS 4, Radix UI primitives, lucide-react.
- Backend: Express 5 API server with CORS, JSON/urlencoded parsing, and pino HTTP logging.
- Database: PostgreSQL planned through Drizzle ORM in `lib/db`.
- API contracts: OpenAPI in `lib/api-spec/openapi.yaml`, generated Zod schemas in `lib/api-zod`, generated React client in `lib/api-client-react`.

### Current Folder Structure

- `artifacts/arosoft-web`: public React/Vite website.
- `artifacts/api-server`: Express API server.
- `lib/db`: PostgreSQL/Drizzle database package.
- `lib/api-spec`: OpenAPI source contract.
- `lib/api-zod`: generated Zod validation package.
- `lib/api-client-react`: generated API client package for React.
- `scripts`: workspace scripts package.
- `attached_assets`: prompt/reference assets.

Recommended working structure:

- Keep frontend pages, layout, styling, and UI components in `artifacts/arosoft-web/src`.
- Keep backend routes and middleware in `artifacts/api-server/src`.
- Keep shared database schema in `lib/db/src/schema`.
- Keep API contracts in `lib/api-spec/openapi.yaml`.
- Keep local or user-provided uploads in ignored `uploads/` folders until a storage strategy is chosen.

### Frontend Pages

Current routed pages:

- `/`: Home.
- `/systems`: Systems.
- `/scripts`: Scripts.
- `/academy`: Academy.
- `/portfolio`: Portfolio.
- `/contact`: Contact.
- `/about`: About.
- `/privacy`: Privacy.
- `/admin/inbox`: Admin Inbox mock/internal page.
- `/login`: Login.
- `/dashboard-preview`: Dashboard Preview.
- fallback: Not Found.

Observed but not publicly routed:

- `Workflows.tsx` exists, but it is not wired into `App.tsx` and is not in the public navbar.

### Navigation

Current main public navigation:

- Home
- Systems
- Scripts
- Academy
- Portfolio
- Contact

Current action links:

- Login
- Get Started

Current utility links:

- About
- Privacy
- Contact Us

Sprint rule:

- Do not add Workflows to public navigation. Workflows must remain internal admin/staff functionality.

### Components and Styling

Existing shared layout components:

- `Navbar`
- `Footer`
- `CTASection`
- `SectionHeader`

Existing domain UI components:

- `FeatureCard`
- `SystemCard`

Existing UI primitives:

- Radix/shadcn-style primitives live under `artifacts/arosoft-web/src/components/ui`.

Styling:

- Tailwind CSS 4 is configured through CSS imports.
- Global theme lives in `artifacts/arosoft-web/src/index.css`.
- Current theme is mostly white with slate text, blue primary color, and minimal card-based sections.

### Backend Setup

The API server currently:

- Creates an Express app in `artifacts/api-server/src/app.ts`.
- Adds pino HTTP logging.
- Enables CORS.
- Parses JSON and urlencoded request bodies.
- Mounts routes under `/api`.
- Starts from `artifacts/api-server/src/index.ts`.
- Requires `PORT` at runtime.

Current routes:

- `GET /api/healthz`: returns `{ "status": "ok" }` after validation through `HealthCheckResponse`.

### Database and ORM

Current setup:

- Drizzle ORM is configured in `lib/db`.
- Database connection uses `pg` and `DATABASE_URL`.
- `lib/db/drizzle.config.ts` is configured for PostgreSQL.

Current schema status:

- No real tables are defined yet.
- `lib/db/src/schema/index.ts` contains starter guidance and exports an empty schema.

### Package Scripts

Root scripts:

- `pnpm run typecheck`: runs TypeScript project checks and artifact/script typechecks.
- `pnpm run build`: runs typecheck, then package builds.
- `pnpm run typecheck:libs`: runs `tsc --build`.

Frontend scripts:

- `pnpm --filter @workspace/arosoft-web run dev`
- `pnpm --filter @workspace/arosoft-web run typecheck`
- `pnpm --filter @workspace/arosoft-web run build`
- `pnpm --filter @workspace/arosoft-web run serve`

Backend scripts:

- `pnpm --filter @workspace/api-server run dev`
- `pnpm --filter @workspace/api-server run typecheck`
- `pnpm --filter @workspace/api-server run build`
- `pnpm --filter @workspace/api-server run start`

Database scripts:

- `pnpm --filter @workspace/db run push`
- `pnpm --filter @workspace/db run push-force`

### Build and Typecheck Status

Attempted commands:

- `pnpm install`
- `node -v`
- `npm -v`
- `corepack --version`

Current result:

- Verification is blocked in this environment because Node, npm, corepack, and pnpm are not available on PATH.
- `node_modules` is not present, so build/typecheck cannot be run until Node and pnpm are installed or made available.

Commands to run when tooling is available:

- `pnpm install`
- `pnpm run typecheck`
- `pnpm run build`

## What Exists

- Public marketing website with core pages for systems, scripts, academy, portfolio, contact, login, and supporting legal/about pages.
- Internal/mock admin pages for inbox and dashboard preview.
- Express API server with health endpoint.
- OpenAPI contract and generated client/schema packages.
- Drizzle/PostgreSQL package scaffold.
- Tailwind/Radix component system.

## What Is Missing

- Real database tables.
- Authentication and session handling.
- Real contact form persistence or email delivery.
- Admin/staff access control for internal pages.
- Production storage strategy for uploads/files.
- Complete API endpoints beyond health check.
- Automated tests.
- Working local Node/pnpm toolchain in this environment.

## Recommended Next Steps

1. Install or expose Node.js and pnpm in the development environment.
2. Run `pnpm install`, `pnpm run typecheck`, and `pnpm run build`.
3. Fix any typecheck/build errors before starting feature work.
4. Define authentication and admin/staff route protection.
5. Add first database tables in small increments, starting with contact messages or users.
6. Keep Workflows internal and avoid adding it to public navigation.
7. Add focused tests once real API and persistence behavior is introduced.
