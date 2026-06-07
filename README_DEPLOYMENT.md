# AROSOFT Coolify Deployment

Production domain:

```text
https://arosoftlabs.com
```

Coolify should deploy this repository as a single Dockerfile application. The final image runs nginx and the Express API in the same container:

- Public container port: `80`
- Frontend: static files served by nginx
- API: Node process bound to `127.0.0.1:5000` inside the container
- nginx routes `/api/` and `/uploads/` to the local API process

## Coolify Settings

Use these settings in the Coolify application:

```text
Build Pack: Dockerfile
Dockerfile: ./Dockerfile
Docker target: coolify, or leave target empty so Docker builds the final stage
Port: 80
Health Check Path: /api/healthz
Domain: https://arosoftlabs.com
```

Provision PostgreSQL separately in Coolify, then set `DATABASE_URL` on this application.

## Environment

Use `coolify.env.example` as the template for Coolify environment variables.

Required values:

```text
DATABASE_URL=...
JWT_SECRET=...
SEED_USER_PASSWORD=...
FRONTEND_URL=https://arosoftlabs.com
API_URL=https://arosoftlabs.com/api
VITE_API_URL=/api
CORS_ORIGINS=https://arosoftlabs.com
```

Optional SMTP values:

```text
SMTP_HOST=
SMTP_PORT=587
SMTP_USER=
SMTP_PASS=
SMTP_FROM_EMAIL=
SMTP_FROM_NAME=AROSOFT Innovations
```

If SMTP is empty, notification emails are skipped safely and API requests still complete.

## Startup

The single Coolify container runs:

```sh
pnpm --filter @workspace/db run push
pnpm --filter @workspace/api-server run seed:users
pnpm --filter @workspace/api-server run start
nginx -g "daemon off;"
```

The API must stay on internal port `5000` because `docker/nginx.conf` proxies to `127.0.0.1:5000`.

## Cloudflare

Use Cloudflare in normal proxied mode with SSL/TLS set to Full or Full Strict. Coolify should terminate HTTPS and forward HTTP to the container on port `80`; nginx forwards `X-Forwarded-*` headers to Express.

## Checks

```sh
curl https://arosoftlabs.com
curl https://arosoftlabs.com/api/healthz
```

Expected API health response:

```json
{"status":"ok"}
```
