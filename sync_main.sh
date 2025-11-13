#!/usr/bin/env bash
set -euo pipefail
ROOT_DIR="$(cd "$(dirname "$0")" && pwd)"
DEST="$ROOT_DIR/Main"
mkdir -p "$DEST"
cp "$ROOT_DIR/index.html" "$DEST/index.html"
cp "$ROOT_DIR/style.css" "$DEST/style.css"
cp "$ROOT_DIR/script.js" "$DEST/script.js"
echo "Main directory updated at $DEST"
