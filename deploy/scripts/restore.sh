#!/usr/bin/env bash
set -euo pipefail
source "$(dirname -- "${BASH_SOURCE[0]}")/common.sh"
if [[ $# != 2 || "$2" != --replace-data ]]; then
  echo 'Uso: restore.sh /caminho/backup.tar.gpg --replace-data' >&2
  echo 'Substitui o banco e todos os arquivos da stack selecionada. Use um projeto isolado para ensaios.' >&2
  exit 1
fi
archive=$(realpath -- "$1")
source "${BACKUP_ENV:-"$ROOT/deploy/backup.env"}"
: "${BACKUP_KEY_FILE:?Configure BACKUP_KEY_FILE}"
test -s "$BACKUP_KEY_FILE"
lock_operations
umask 077
temporary=$(mktemp -d)
trap 'rm -rf -- "$temporary"' EXIT
gpg --batch --pinentry-mode loopback --passphrase-file "$BACKUP_KEY_FILE" --decrypt --output "$temporary/backup.tar" "$archive"
# Only extract the four known members; never extract arbitrary archive paths.
tar -C "$temporary" -xf "$temporary/backup.tar" database.dump files.tar SHA256SUMS metadata.txt
grep -qx 'menuzap-backup-v1' "$temporary/metadata.txt"
(cd "$temporary" && sha256sum --check SHA256SUMS)
compose stop backend
compose up -d --wait database
compose exec -T database dropdb -U menuzap --if-exists --force menuzap
compose exec -T database createdb -U menuzap menuzap
compose exec -T database pg_restore -U menuzap -d menuzap --exit-on-error --no-owner <"$temporary/database.dump"
compose run --rm --no-deps -T --user 0 --entrypoint sh backend -c 'find /app/var/files -mindepth 1 -delete && tar -C /app/var/files -xf - && chown -R node:node /app/var/files' <"$temporary/files.tar"
# If any restoration step fails, leave the backend stopped instead of serving partial data.
compose up -d --wait backend
echo 'Banco e arquivos restaurados; backend saudável.'
