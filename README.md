# AROSOFT Innovations Platform

Production app for the AROSOFT Innovations website, internal dashboards, academy, support, requests, portfolio, scripts, systems, and notification flows.

## Stack

- Web: React, TypeScript, Vite
- API: Express, TypeScript
- Database: PostgreSQL with Drizzle
- Deployment: Coolify single Dockerfile app, nginx, Node API, PostgreSQL

## Environment

Copy the production example and set real secrets:

```sh
cp .env.production.example .env
nano .env
```

Required values:

- `POSTGRES_PASSWORD`
- `JWT_SECRET`
- `SEED_USER_PASSWORD`
- `FRONTEND_URL`
- `CORS_ORIGINS`

Optional email values:

- `SMTP_HOST`
- `SMTP_PORT`
- `SMTP_USER`
- `SMTP_PASS`
- `SMTP_FROM_EMAIL`
- `SMTP_FROM_NAME`

If SMTP is not configured, email actions are skipped safely and the API does not crash.

## Local Development

This workspace expects `pnpm`.

```sh
pnpm install
pnpm run typecheck
pnpm run build
```

## Production Deploy

Deploy on Coolify as a single Dockerfile application. Use port `80`, health check path `/api/healthz`, and domain `https://arosoftlabs.com`.

The single container runs nginx and the API server together. nginx serves the frontend and proxies `/api/` plus `/uploads/` to the local API process on port `5000`.

## Ports

- Public web/API entrypoint: container port `80`
- API: internal container port `5000`
- PostgreSQL: provisioned separately in Coolify or via compose for legacy deployments

## Security Notes

- `.env` and `.env.*` are ignored except example files.
- API uses Helmet, CORS allow-listing, JSON/body size limits, and route rate limits.
- Auth, contact, and assistant endpoints are rate limited.
- Uploads validate file extension and MIME type.
- Admin, staff, client, and student APIs are protected with RBAC middleware.
- Password hashes are not returned by auth responses or admin user list endpoints.
- Important actions are logged as audit events.

## Health Checks

```sh
curl https://arosoftlabs.com
curl https://arosoftlabs.com/api/healthz
```
