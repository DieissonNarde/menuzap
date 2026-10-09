#!/usr/bin/env bash
set -euo pipefail
source "$(dirname -- "${BASH_SOURCE[0]}")/common.sh"
source "${BACKUP_ENV:-"$ROOT/deploy/backup.env"}"
: "${BACKUP_KEY_FILE:?Configure BACKUP_KEY_FILE}"
: "${BACKUP_REMOTE_HOST:?Configure BACKUP_REMOTE_HOST}"
: "${BACKUP_REMOTE_DIRECTORY:?Configure BACKUP_REMOTE_DIRECTORY}"
[[ "$BACKUP_REMOTE_HOST" =~ ^[a-zA-Z0-9][a-zA-Z0-9_.@-]*$ ]] || exit 1
[[ "$BACKUP_REMOTE_DIRECTORY" =~ ^/[a-zA-Z0-9_/-]+$ && "$BACKUP_REMOTE_DIRECTORY" != / ]] || exit 1
test -s "$BACKUP_KEY_FILE"
for tool in docker flock gpg rsync ssh sha256sum; do command -v "$tool" >/dev/null; done
lock_operations
umask 077
BACKUP_DIRECTORY=${BACKUP_DIRECTORY:-"$ROOT/backups"}
mkdir -p "$BACKUP_DIRECTORY"
temporary=$(mktemp -d)
stopped=false
cleanup() {
  if "$stopped"; then compose start backend >&2 || true; fi
  rm -rf -- "$temporary"
}
trap cleanup EXIT
archive="$BACKUP_DIRECTORY/menuzap-$(date -u +%Y%m%dT%H%M%SZ).tar.gpg"
# Quiesce API writes so the database and image directory represent one point.
compose stop backend
stopped=true
compose exec -T database pg_dump -U menuzap -d menuzap --format=custom >"$temporary/database.dump"
compose run --rm --no-deps -T --user 0 --entrypoint tar backend -C /app/var/files -cf - . >"$temporary/files.tar"
(cd "$temporary" && sha256sum database.dump files.tar >SHA256SUMS)
printf 'menuzap-backup-v1\ncreated_at=%s\nrevision=%s\n' "$(date -u +%FT%TZ)" "$(git -C "$ROOT" rev-parse HEAD 2>/dev/null || echo unknown)" >"$temporary/metadata.txt"
tar -C "$temporary" -cf - database.dump files.tar SHA256SUMS metadata.txt |
  gpg --batch --yes --pinentry-mode loopback --passphrase-file "$BACKUP_KEY_FILE" --symmetric --cipher-algo AES256 --output "$archive.partial"
mv -- "$archive.partial" "$archive"
compose start backend
stopped=false
ssh -o BatchMode=yes "$BACKUP_REMOTE_HOST" "mkdir -p '$BACKUP_REMOTE_DIRECTORY'"
rsync -e 'ssh -o BatchMode=yes' -- "$archive" "$BACKUP_REMOTE_HOST:$BACKUP_REMOTE_DIRECTORY/"
# Prune only after an encrypted archive was successfully copied off this VPS.
ssh -o BatchMode=yes "$BACKUP_REMOTE_HOST" "find '$BACKUP_REMOTE_DIRECTORY' -maxdepth 1 -type f -name 'menuzap-*.tar.gpg' -mtime +30 -delete"
find "$BACKUP_DIRECTORY" -maxdepth 1 -type f -name 'menuzap-*.tar.gpg' -mtime +30 -delete
echo "Backup concluído: $(basename -- "$archive")"
