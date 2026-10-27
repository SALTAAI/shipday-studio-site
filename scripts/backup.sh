#!/usr/bin/env bash
# Snapshot the project (minus deps/build output/secrets) to the persistent agent store
# so work survives a box rollback.
# Why tar-then-copy: the store FS rejects chmod/chgrp/utimes and fails writes of a single
# file above ~100 MB, and rsync of thousands of files (incl. out/ and venvs) hit the 600 s
# watchdog. So: build one .tar.gz locally in /tmp, split it into 95 MB parts, write each
# part with plain `cat >` (no metadata), then verify every part hash read back from the store.
# Git history goes inside the archive as _checkpoint_meta/shipday.git.bundle.
# Restore (only dirs with COMPLETE): cat <stamp>/shipday-<stamp>.tar.gz.part-* | tar -xzf - --no-same-owner -C <dir>
#          then: git clone <dir>/_checkpoint_meta/shipday.git.bundle repo-history
set -euo pipefail
cd "$(dirname "$0")/.."
STORE="${SHIPDAY_STORE:-$(python3 tools/account_config.py store_path)}/shipday-backups/daily"  # per account: config/accounts.json
case "$STORE" in /cursor/stores/store-*|/cursor/stores/user/*) ;; *) echo "ABORT store unresolved: $STORE" >&2; exit 1;; esac
# Retention is OFF by default (KEEP_ALL=1): no backup history is deleted while snapshot
# uniqueness is unresolved (decision 25 Oct 2026). Pruning only runs with KEEP_ALL=0.
KEEP_ALL=${KEEP_ALL:-1}
KEEP=${BACKUP_KEEP:-3}
STAMP=$(date +%Y%m%dT%H%M%S)
NAME=shipday-$STAMP.tar.gz
WORK=$(mktemp -d /tmp/shipday-backup.XXXXXX)
trap 'rm -rf "$WORK"' EXIT

# 1. File list (deterministic), excluding deps, build output, venvs, caches, secrets.
find . \( -path ./.git -o -path ./node_modules -o -path ./out -o -path ./.next -o -path ./.secrets \
          -o -name .venv -o -name venv -o -name __pycache__ -o -name node_modules \) -prune -o \
       \( -type f ! -name '.env' ! -name '.env.*' ! -name '*.env' ! -name '*.tsbuildinfo' -print \) \
  | sed 's|^\./||' | LC_ALL=C sort > "$WORK/filelist.txt"

# 2. Git bundle + manifest (relative path + sha256, no contents).
mkdir -p "$WORK/meta"
if git rev-parse HEAD >/dev/null 2>&1; then
  git bundle create "$WORK/meta/shipday.git.bundle" --all >/dev/null 2>&1
  git rev-parse HEAD > "$WORK/meta/HEAD.txt"
fi
tr '\n' '\0' < "$WORK/filelist.txt" | xargs -0 sha256sum > "$WORK/meta/manifest.sha256"

# 3. One local archive (no owner/acl/xattr), then split.
tar --create --gzip --file "$WORK/$NAME" --owner=0 --group=0 --numeric-owner \
    --no-acls --no-xattrs --no-selinux --verbatim-files-from --files-from "$WORK/filelist.txt" \
    -C "$WORK" --transform 's|^meta|_checkpoint_meta|' meta
FULL=$(sha256sum "$WORK/$NAME" | cut -d' ' -f1)
mkdir -p "$WORK/parts"
(cd "$WORK/parts" && split -b 95M -d -a 2 "../$NAME" "$NAME.part-" && sha256sum "$NAME".part-* > "$NAME.parts.sha256")
echo "$FULL  $NAME" > "$WORK/parts/$NAME.sha256"
cp "$WORK/meta/manifest.sha256" "$WORK/parts/shipday-$STAMP.manifest.sha256"

# 4. Copy with plain cat (store rejects perms/times and rename), verify from the store,
#    then mark the snapshot COMPLETE. A dir without COMPLETE is an unverified/partial run.
DEST="$STORE/$STAMP"
mkdir -p "$DEST"
for f in "$WORK"/parts/*; do cat "$f" > "$DEST/$(basename "$f")"; done
(cd "$DEST" && sha256sum -c --quiet "$NAME.parts.sha256")
[ "$(cat "$DEST/$NAME".part-* | sha256sum | cut -d' ' -f1)" = "$FULL" ] || { echo "store readback hash mismatch" >&2; exit 1; }
echo "$FULL  $NAME  verified $(date -Iseconds)" > "$DEST/COMPLETE"

# 5. Retention (disabled unless KEEP_ALL=0): keep the newest $KEEP COMPLETE snapshots (daily/ only).
if [ "$KEEP_ALL" = "0" ]; then
  ls -1d "$STORE"/[0-9]*T[0-9]*/COMPLETE 2>/dev/null | xargs -r -n1 dirname | LC_ALL=C sort | head -n -"$KEEP" | while read -r old; do echo "pruned $old" >&2; rm -rf -- "$old"; done
else
  echo "retention disabled (KEEP_ALL=$KEEP_ALL): nothing deleted" >&2
fi

echo "backed up to $DEST ($(wc -l < "$WORK/filelist.txt") files, $(du -sh "$WORK/$NAME" | cut -f1), sha256 $FULL), HEAD $(git rev-parse --short HEAD 2>/dev/null || echo none)"
