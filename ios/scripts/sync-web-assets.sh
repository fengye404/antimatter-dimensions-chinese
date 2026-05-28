#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "$SCRIPT_DIR/../.." && pwd)"
DIST_DIR="$REPO_ROOT/dist"
WEB_DIR="$REPO_ROOT/ios/AntimatterDimensionsChinese/Resources/Web"

if [[ ! -f "$DIST_DIR/index.html" ]]; then
  echo "dist/index.html not found. Run npm run build:chinese first." >&2
  exit 1
fi

rm -rf "$WEB_DIR"
mkdir -p "$WEB_DIR"
rsync -a --delete "$DIST_DIR/" "$WEB_DIR/"
touch "$WEB_DIR/.gitkeep"

cat > "$WEB_DIR/ios-build.json" <<JSON
{
  "generatedAt": "$(date -u +"%Y-%m-%dT%H:%M:%SZ")",
  "gitCommit": "$(git -C "$REPO_ROOT" rev-parse --short HEAD 2>/dev/null || echo unknown)"
}
JSON

echo "Synced web assets to $WEB_DIR"
