# Deployment

This repository is configured for Coolify as a single Dockerfile application.

## Coolify

Create one application from this Git repository:

```text
Build Pack: Dockerfile
Dockerfile: ./Dockerfile
Docker target: coolify, or leave target empty so Docker builds the final stage
Port: 80
Health Check Path: /api/healthz
Domain: https://arosoftlabs.com
```

Create a PostgreSQL database in Coolify or attach an external PostgreSQL database, then set `DATABASE_URL` on the application.

Use `coolify.env.example` for the required environment variables:

```text
FRONTEND_URL=https://arosoftlabs.com
API_URL=https://arosoftlabs.com/api
VITE_API_URL=/api
CORS_ORIGINS=https://arosoftlabs.com
```

The final `coolify` Docker image starts the API server on `127.0.0.1:5000` and nginx on port `80`. nginx serves the frontend and proxies `/api/` plus `/uploads/` to the local API process. There is no `api` upstream or separate API container in the Coolify application.

## Legacy Compose

`docker-compose.yml` remains available for non-Coolify deployments that intentionally run separate `postgres`, `api`, and `web` services. Coolify single-Dockerfile deployments should not use compose for this app unless you explicitly convert the Coolify project to a compose-based service stack.
