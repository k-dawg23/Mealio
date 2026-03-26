#!/usr/bin/env bash

set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"

echo "Mealio cPanel preflight"
echo "Project root: ${ROOT_DIR}"
echo

if command -v node >/dev/null 2>&1; then
  NODE_VERSION="$(node -v)"
  echo "Node: ${NODE_VERSION}"
else
  echo "Node: not found"
fi

if command -v npm >/dev/null 2>&1; then
  NPM_VERSION="$(npm -v)"
  echo "npm: ${NPM_VERSION}"
else
  echo "npm: not found"
fi

echo
echo "Writable path check:"

mkdir -p "${ROOT_DIR}/server/data/generated-images"

for path in \
  "${ROOT_DIR}/server/data" \
  "${ROOT_DIR}/server/data/generated-images"; do
  if [ -w "${path}" ]; then
    echo "  OK  ${path}"
  else
    echo "  NO  ${path}"
  fi
done

echo
echo "Network check:"
if command -v curl >/dev/null 2>&1; then
  if curl -fsS --max-time 10 https://api.openai.com >/dev/null 2>&1; then
    echo "  OK  Outbound HTTPS to api.openai.com"
  else
    echo "  NO  Could not reach api.openai.com"
  fi
else
  echo "  SKIP curl not available"
fi

echo
echo "Next checks to run manually if available:"
echo "  npm install"
echo "  npm run build"
echo "  npm start"
