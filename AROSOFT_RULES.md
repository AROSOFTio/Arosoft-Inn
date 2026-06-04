# AROSOFT Development Rules

## Product Direction

- Keep the public website mostly white, clean, premium, and minimal.
- Do not redesign the UI unless explicitly requested.
- Preserve the public navigation as: Home, Systems, Scripts, Academy, Portfolio, Contact, Login, Get Started.
- Do not add Workflows to public navigation.
- Treat Workflows as internal admin/staff functionality only.
- Build features in small, safe steps with clear scope.

## Codebase Rules

- Prefer the existing pnpm workspace structure and package boundaries.
- Frontend work belongs in `artifacts/arosoft-web`.
- Backend API work belongs in `artifacts/api-server`.
- Shared database schema and database access belong in `lib/db`.
- Shared API contracts belong in `lib/api-spec`, `lib/api-zod`, and `lib/api-client-react`.
- Keep generated API clients and Zod schemas aligned with `lib/api-spec/openapi.yaml`.
- Avoid unrelated refactors while implementing feature work.

## Frontend Rules

- Keep the public site style restrained: white background, slate text, blue primary accents, generous spacing, and minimal decoration.
- Use existing layout components such as `Navbar`, `Footer`, `CTASection`, and `SectionHeader`.
- Use existing UI primitives from `src/components/ui` before adding new component libraries.
- Keep public pages under `artifacts/arosoft-web/src/pages`.
- Keep admin/staff pages behind internal routes and out of public menus.

## Backend Rules

- Keep API routes under `artifacts/api-server/src/routes`.
- Mount public API endpoints under `/api`.
- Validate API responses and request payloads with shared Zod schemas where practical.
- Add database tables in `lib/db/src/schema` and export them through `lib/db/src/schema/index.ts`.
- Require explicit environment variables for runtime services such as `PORT` and `DATABASE_URL`.

## Verification Rules

- Run `pnpm install` when dependencies are missing.
- Run `pnpm run typecheck` after code changes.
- Run `pnpm run build` before considering a sprint complete.
- If verification cannot run, document the exact blocker and the command that failed.
- Do not commit secrets, `.env` files, dependency folders, upload folders, or generated build output.
