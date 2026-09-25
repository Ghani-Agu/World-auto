#!/usr/bin/env bash
# Optimise a downloaded Sketchfab glTF/GLB for the web studio.
# Usage: scripts/optimize-model.sh <input.gltf|glb> <output.glb>
# Result: ~150k triangles max, Draco geometry, WebP textures ≤ 1024px (typically 2–6 MB).
set -euo pipefail
IN="$1"; OUT="$2"; TMP="$(mktemp -d)"
npx @gltf-transform/cli@4 dedup "$IN" "$TMP/a.glb"
npx @gltf-transform/cli@4 weld "$TMP/a.glb" "$TMP/b.glb"
npx @gltf-transform/cli@4 simplify "$TMP/b.glb" "$TMP/c.glb" --ratio 0.15 --error 0.001
npx @gltf-transform/cli@4 resize "$TMP/c.glb" "$TMP/d.glb" --width 1024 --height 1024
npx @gltf-transform/cli@4 webp "$TMP/d.glb" "$TMP/e.glb"
npx @gltf-transform/cli@4 draco "$TMP/e.glb" "$OUT"
rm -rf "$TMP"
ls -lh "$OUT"
