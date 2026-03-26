#!/usr/bin/env bash

set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
ARTIFACT_DIR="${ROOT_DIR}/artifacts"
PACKAGE_NAME="mealio-cpanel-deploy.tar.gz"
TEMP_DIR="${ARTIFACT_DIR}/mealio-cpanel-package"

cd "${ROOT_DIR}"

echo "Building Mealio for cPanel packaging..."
npm run build

rm -rf "${TEMP_DIR}"
mkdir -p "${TEMP_DIR}/server/data/generated-images"

cp package.json "${TEMP_DIR}/package.json"
cp package-lock.json "${TEMP_DIR}/package-lock.json"
cp .env.example "${TEMP_DIR}/.env.example"
cp README.md "${TEMP_DIR}/README.md"
cp DEPLOYMENT.md "${TEMP_DIR}/DEPLOYMENT.md"
cp -R dist "${TEMP_DIR}/dist"

mkdir -p "${ARTIFACT_DIR}"
tar -czf "${ARTIFACT_DIR}/${PACKAGE_NAME}" -C "${TEMP_DIR}" .

echo
echo "Created package:"
echo "  ${ARTIFACT_DIR}/${PACKAGE_NAME}"
echo
echo "Upload this archive to your cPanel app root, extract it, run 'npm install --omit=dev' if needed, and point the Node app startup file to 'dist/server/index.js'."
