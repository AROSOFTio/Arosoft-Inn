#!/bin/sh
set -eu

export PORT=5000
export FRONTEND_URL="${FRONTEND_URL:-https://arosoftlabs.com}"
export API_URL="${API_URL:-https://arosoftlabs.com/api}"
export VITE_API_URL="${VITE_API_URL:-/api}"
export CORS_ORIGINS="${CORS_ORIGINS:-https://arosoftlabs.com}"

cleanup() {
  if [ -n "${api_pid:-}" ]; then
    kill "$api_pid" 2>/dev/null || true
  fi
}

trap cleanup INT TERM EXIT

pnpm --filter @workspace/db run push
pnpm --filter @workspace/api-server run seed:users
pnpm --filter @workspace/api-server run start &
api_pid="$!"

nginx -g "daemon off;" &
nginx_pid="$!"

while :; do
  if ! kill -0 "$api_pid" 2>/dev/null; then
    wait "$api_pid"
    exit $?
  fi

  if ! kill -0 "$nginx_pid" 2>/dev/null; then
    wait "$nginx_pid"
    exit $?
  fi

  sleep 2
done
