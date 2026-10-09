#!/usr/bin/env bash
set -euo pipefail
source "$(dirname -- "${BASH_SOURCE[0]}")/common.sh"
source "${BACKUP_ENV:-"$ROOT/deploy/backup.env"}"
BACKUP_DIRECTORY=${BACKUP_DIRECTORY:-"$ROOT/backups"}
latest=$(find "$BACKUP_DIRECTORY" -maxdepth 1 -type f -name 'menuzap-*.tar.gpg' -printf '%f\n' | LC_ALL=C sort | tail -n 1)
test -n "$latest" || { echo 'Nenhum backup disponível para o ensaio.' >&2; exit 1; }
# This hard-coded project has different networks/volumes and publishes no ports.
export COMPOSE_PROJECT_NAME=menuzap-restore-check
cleanup() { compose down --volumes; }
trap cleanup EXIT
compose build backend
bash "$ROOT/deploy/scripts/restore.sh" "$BACKUP_DIRECTORY/$latest" --replace-data
compose exec -T backend node src/verify-restore.js
