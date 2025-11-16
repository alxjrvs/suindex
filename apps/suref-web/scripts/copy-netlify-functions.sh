#!/bin/bash
# Copy Netlify functions to root netlify/functions directory
# and fix import paths for monorepo structure

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
APP_DIR="$(dirname "$SCRIPT_DIR")"
ROOT_DIR="$(dirname "$(dirname "$APP_DIR")")"

if [ -d "$APP_DIR/.netlify/v1/functions" ]; then
  echo "Copying Netlify functions to root..."
  mkdir -p "$ROOT_DIR/netlify/functions"
  cp -r "$APP_DIR/.netlify/v1/functions"/* "$ROOT_DIR/netlify/functions/"
  
  # Fix import path in server.mjs
  if [ -f "$ROOT_DIR/netlify/functions/server.mjs" ]; then
    # Update the relative import path from apps/suref-web/.netlify/v1/functions/server.mjs
    # to netlify/functions/server.mjs
    # Old: ../../../dist/server/server.js
    # New: ../../apps/suref-web/dist/server/server.js
    sed -i '' 's|../../../dist/server/server.js|../../apps/suref-web/dist/server/server.js|g' "$ROOT_DIR/netlify/functions/server.mjs"
    echo "✅ Fixed import paths in server.mjs"
  fi
  
  echo "✅ Functions copied to netlify/functions/"
else
  echo "⚠️  No functions directory found at $APP_DIR/.netlify/v1/functions"
fi

