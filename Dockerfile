FROM node:24-bookworm-slim AS base

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"

RUN corepack enable

WORKDIR /app

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml .npmrc tsconfig.json tsconfig.base.json ./
COPY artifacts ./artifacts
COPY lib ./lib
COPY scripts ./scripts

RUN pnpm install --no-frozen-lockfile

FROM base AS build

ENV NODE_ENV=production
ENV PORT=3000
ENV BASE_PATH=/
ENV VITE_API_URL=/api

RUN pnpm run build

FROM base AS api

ENV NODE_ENV=production
ENV PORT=5000

COPY --from=build /app/artifacts/api-server/dist ./artifacts/api-server/dist
COPY --from=build /app/artifacts/arosoft-web/dist ./artifacts/arosoft-web/dist

EXPOSE 5000

CMD ["sh", "-c", "pnpm --filter @workspace/db run push && pnpm --filter @workspace/api-server run seed:users && pnpm --filter @workspace/api-server run start"]

FROM nginx:1.27-alpine AS web

COPY docker/nginx.compose.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/artifacts/arosoft-web/dist/public /usr/share/nginx/html

EXPOSE 80

FROM base AS coolify

RUN apt-get update \
  && apt-get install -y --no-install-recommends nginx ca-certificates \
  && rm -rf /var/lib/apt/lists/* \
  && rm -f /etc/nginx/sites-enabled/default \
  && mkdir -p /run/nginx /usr/share/nginx/html /app/uploads

ENV NODE_ENV=production
ENV PORT=5000
ENV FRONTEND_URL=https://arosoftlabs.com
ENV API_URL=https://arosoftlabs.com/api
ENV VITE_API_URL=/api
ENV CORS_ORIGINS=https://arosoftlabs.com

COPY docker/nginx.conf /etc/nginx/conf.d/default.conf
COPY docker/start-coolify.sh /app/docker/start-coolify.sh
COPY --from=build /app/artifacts/arosoft-web/dist/public /usr/share/nginx/html
COPY --from=build /app/artifacts/api-server/dist ./artifacts/api-server/dist

EXPOSE 80

HEALTHCHECK --interval=30s --timeout=5s --start-period=30s --retries=3 \
  CMD node -e "fetch('http://127.0.0.1/api/healthz').then(r => process.exit(r.ok ? 0 : 1)).catch(() => process.exit(1))"

CMD ["sh", "/app/docker/start-coolify.sh"]
