#!/usr/bin/env bash
set -euo pipefail

npm run build

mkdir -p tmp
SMOKE_PORT="${SMOKE_PORT:-41737}"
SMOKE_URL="http://127.0.0.1:${SMOKE_PORT}/stellar-evolution-simulator/"

npx vite preview --host 127.0.0.1 --port "$SMOKE_PORT" --strictPort >tmp/smoke-vite.log 2>&1 &
server_pid=$!

cleanup() {
  kill "$server_pid" >/dev/null 2>&1 || true
}

trap cleanup EXIT

ready=0
for _ in $(seq 1 60); do
  if curl --fail --silent "$SMOKE_URL" >/dev/null; then
    ready=1
    break
  fi
  sleep 0.5
done

if [ "$ready" -ne 1 ]; then
  echo "Preview server did not become ready at $SMOKE_URL."
  cat tmp/smoke-vite.log
  exit 1
fi

PLAYWRIGHT_BASE_URL="$SMOKE_URL" npx playwright test --config playwright.config.ts
