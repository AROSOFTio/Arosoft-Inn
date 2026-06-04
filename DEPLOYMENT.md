# Docker Deployment for new.arosoft.io

This repository includes a Docker Compose setup for `new.arosoft.io`.

## First Deploy

1. Copy `.env.example` to `.env`.
2. Replace all placeholder secrets in `.env`.
3. Point DNS for `new.arosoft.io` to the server.
4. Run:

```sh
docker compose up -d --build
```

The API container runs the database schema push and seed users before starting:

```sh
pnpm --filter @workspace/db run push
pnpm --filter @workspace/api-server run seed:users
pnpm --filter @workspace/api-server run start
```

## Services

- `web`: Nginx static web server and `/api` reverse proxy for `new.arosoft.io`.
- `api`: Express API server.
- `postgres`: PostgreSQL database with persistent Docker volume.

## Seed Users

Seed user emails are defined in `artifacts/api-server/src/seed-users.ts`.
All seed users use `SEED_USER_PASSWORD` from `.env`.

## Notes

- Keep `.env` private.
- For HTTPS, place this compose stack behind a TLS reverse proxy, or add a Certbot/Traefik/Caddy layer on the host.
- The current Drizzle setup uses `drizzle-kit push` as the schema migration step because no migration files exist yet.
