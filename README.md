# AROSOFT Innovations Platform

Production app for the AROSOFT Innovations website, internal dashboards, academy, support, requests, portfolio, scripts, systems, and notification flows.

## Stack

- Web: React, TypeScript, Vite
- API: Express, TypeScript
- Database: PostgreSQL with Drizzle
- Deployment: Docker Compose, aaPanel/OpenResty Nginx reverse proxy

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

Run from the VPS project directory:

```sh
cd /www/wwwroot/new.arosoft.io
git pull origin main
sudo docker compose build
sudo docker compose up -d
sudo docker compose ps
sudo docker compose logs api --tail=80
```

The API container runs database schema push and seed users before startup.

## Ports

- Web: `127.0.0.1:4020` to container port `80`
- API: `127.0.0.1:5001` to container port `5000`
- PostgreSQL: internal Docker network only

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
curl http://127.0.0.1:4020
curl http://127.0.0.1:5001/api/healthz
curl https://new.arosoft.io/api/healthz
```
