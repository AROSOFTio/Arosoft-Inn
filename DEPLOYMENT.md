# Docker Deployment for new.arosoft.io

This is the first deployment setup for the new domain `new.arosoft.io`.

Use a normal Linux user with sudo access. Do not SSH or deploy as `root`.

## First Server Setup

SSH into the server as a non-root sudo user:

```sh
ssh deploy@new.arosoft.io
```

Install Docker and the Compose plugin on the server if they are not already installed. Use `sudo` for system package installation and Docker commands.

Use the existing website directory created in the control panel. Do not create a separate deploy folder.

```sh
cd /www/wwwroot/new.arosoft.io
```

If the deploy user cannot write to this directory, fix ownership with sudo from the normal deploy user:

```sh
sudo chown -R "$USER":"$USER" /www/wwwroot/new.arosoft.io
cd /www/wwwroot/new.arosoft.io
```

Initialize git in the existing empty directory and pull the repository:

```sh
git init
git remote add origin https://github.com/AROSOFTio/Arosoft-Inn.git
git pull origin main
```

Create the environment file:

```sh
cp .env.example .env
nano .env
```

Replace every placeholder secret in `.env` before starting the stack.

Point DNS for `new.arosoft.io` to this server before going live.

## Deploy

From the repo directory:

```sh
cd /www/wwwroot/new.arosoft.io
git pull origin main
sudo docker compose up -d --build
```

The API container runs the database schema push and seed users before starting:

```sh
pnpm --filter @workspace/db run push
pnpm --filter @workspace/api-server run seed:users
pnpm --filter @workspace/api-server run start
```

## Update Existing Deployment

Use this whenever new code is pushed:

```sh
cd /www/wwwroot/new.arosoft.io
git pull origin main
sudo docker compose up -d --build
```

Check logs:

```sh
sudo docker compose logs -f api
sudo docker compose logs -f web
```

## If Docker Build Fails on pnpm Build Approvals

If the build fails with `ERR_PNPM_IGNORED_BUILDS` for `bcrypt` or `esbuild`, pull the latest repo changes and rebuild:

```sh
cd /www/wwwroot/new.arosoft.io
git pull origin main
sudo docker compose up -d --build
```

The workspace explicitly approves required build scripts for `bcrypt` and `esbuild`.

## Services

- `web`: Nginx static web server and `/api` reverse proxy for `new.arosoft.io`.
- `api`: Express API server. It runs schema push and seed before startup.
- `postgres`: PostgreSQL database with persistent Docker volume.

## Seed Users

Seed user emails are defined in `artifacts/api-server/src/seed-users.ts`.
All seed users use `SEED_USER_PASSWORD` from `.env`.

## Rules

- Never deploy as `root`.
- Use `sudo docker compose ...` from the normal deploy user.
- Use the existing `/www/wwwroot/new.arosoft.io` directory from the control panel.
- Do not create a separate deployment directory for this domain.
- Keep `.env` private and never commit it.
- Do not delete the `postgres_data` Docker volume unless you intentionally want to remove production data.
- For HTTPS, place this compose stack behind a TLS reverse proxy, or add a Certbot/Traefik/Caddy layer on the host.
- The current Drizzle setup uses `drizzle-kit push` as the schema migration step because no migration files exist yet.
