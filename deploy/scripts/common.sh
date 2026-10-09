#!/usr/bin/env bash
set -euo pipefail
ROOT=$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")/../.." && pwd)
STACK_ENV=${STACK_ENV:-"$ROOT/deploy/stack.env"}
test -f "$STACK_ENV" || { echo 'Configure deploy/stack.env primeiro.' >&2; exit 1; }
compose() {
  docker compose --project-name "${COMPOSE_PROJECT_NAME:-menuzap}" --env-file "$STACK_ENV" -f "$ROOT/compose.yaml" "$@"
}
lock_operations() {
  exec 9>"$ROOT/deploy/.operations.lock"
  flock -n 9 || { echo 'Outro backup ou restauração está em andamento.' >&2; exit 1; }
}
