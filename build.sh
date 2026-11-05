#!/usr/bin/env bash
# Builds dist/chrome, dist/firefox and a zip for each.
set -euo pipefail
cd "$(dirname "$0")"

rm -rf dist
mkdir -p dist/chrome dist/firefox

for target in chrome firefox; do
  cp -r content.js content.css popup.html popup.css popup.js background.js icons "dist/$target/"
done
cp manifest.json dist/chrome/manifest.json
cp manifest.firefox.json dist/firefox/manifest.json

(cd dist/chrome && zip -qr ../claude-top-bar-hover-chrome.zip .)
(cd dist/firefox && zip -qr ../claude-top-bar-hover-firefox.zip .)

echo "Built: dist/chrome  dist/firefox  (+ .zip files)"
