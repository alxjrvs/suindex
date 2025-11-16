#!/bin/bash
# Copy Netlify functions to root netlify/functions directory
# and fix import paths for monorepo structure

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
APP_DIR="$(dirname "$SCRIPT_DIR")"
ROOT_DIR="$(dirname "$(dirname "$APP_DIR")")"

if [ ! -d "$APP_DIR/.netlify/v1/functions" ]; then
  echo "⚠️  No functions directory found at $APP_DIR/.netlify/v1/functions"
  exit 0  # Don't fail the build if functions don't exist
fi

echo "Copying Netlify functions to root..."
mkdir -p "$ROOT_DIR/netlify/functions"
cp -r "$APP_DIR/.netlify/v1/functions"/* "$ROOT_DIR/netlify/functions/"

# Fix import path in server.mjs (Linux-compatible sed syntax)
SERVER_FILE="$ROOT_DIR/netlify/functions/server.mjs"
if [ -f "$SERVER_FILE" ]; then
  # Update the relative import path from apps/suref-web/.netlify/v1/functions/server.mjs
  # to netlify/functions/server.mjs
  # Old: ../../../dist/server/server.js
  # New: ../../apps/suref-web/dist/server/server.js
  # Use a temporary file approach that works on both Linux and macOS
  OLD_PATH="../../../dist/server/server.js"
  NEW_PATH="../../apps/suref-web/dist/server/server.js"
  
  # Use perl for cross-platform compatibility, or fallback to sed
  if command -v perl >/dev/null 2>&1; then
    perl -pi -e "s|${OLD_PATH}|${NEW_PATH}|g" "$SERVER_FILE"
  else
    # Fallback to sed with platform detection
    if [[ "$OSTYPE" == "darwin"* ]]; then
      sed -i '' "s|${OLD_PATH}|${NEW_PATH}|g" "$SERVER_FILE"
    else
      sed -i "s|${OLD_PATH}|${NEW_PATH}|g" "$SERVER_FILE"
    fi
  fi
  echo "✅ Fixed import paths in server.mjs"
fi

echo "✅ Functions copied to netlify/functions/"

