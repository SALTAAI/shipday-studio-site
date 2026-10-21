#!/usr/bin/env bash
# Mirror the project (minus deps/build output) to the persistent agent store so
# work survives a box rollback. The store FS rejects chgrp/mkstemp, hence
# --inplace, checksum compare (times cannot be set) and no owner/group/perm syncing. Git history is saved as a single
# bundle file (restore: git clone shipday.bundle shipday).
set -euo pipefail
cd "$(dirname "$0")/.."
DEST=/cursor/stores/store-2fd77a4e-f94a-4123-a4aa-b5d86f45d7b1/shipday-backup
mkdir -p "$DEST"
rsync -r --checksum --inplace --no-perms --no-owner --no-group --delete \
  --exclude node_modules --exclude .next --exclude .git --exclude '*.tsbuildinfo' --exclude shipday.bundle \
  ./ "$DEST/" || { rc=$?; [ $rc -eq 23 ] || exit $rc; echo "(rsync: attribute-only warnings ignored; contents copied)"; }
if git rev-parse HEAD >/dev/null 2>&1; then
  git bundle create /tmp/shipday.bundle --all >/dev/null 2>&1
  cp /tmp/shipday.bundle "$DEST/shipday.bundle"
fi
echo "backed up to $DEST ($(du -sh "$DEST" | cut -f1)), HEAD $(git rev-parse --short HEAD 2>/dev/null || echo none)"
