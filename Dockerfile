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

RUN pnpm run build

FROM base AS api

ENV NODE_ENV=production
ENV PORT=5000

COPY --from=build /app/artifacts/api-server/dist ./artifacts/api-server/dist
COPY --from=build /app/artifacts/arosoft-web/dist ./artifacts/arosoft-web/dist

EXPOSE 5000

CMD ["sh", "-c", "pnpm --filter @workspace/db run push && pnpm --filter @workspace/api-server run seed:users && pnpm --filter @workspace/api-server run start"]

FROM nginx:1.27-alpine AS web

COPY docker/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/artifacts/arosoft-web/dist/public /usr/share/nginx/html

EXPOSE 80
