#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
BACKEND_DIR="$ROOT_DIR/backend"
FRONTEND_DIR="$ROOT_DIR/frontend"

BACKEND_PORT="${BACKEND_PORT:-3000}"
FRONTEND_PORT="${FRONTEND_PORT:-5173}"

backend_pid=""
frontend_pid=""

cleanup() {
  echo
  echo "Encerrando frontend e backend..."

  if [[ -n "$frontend_pid" ]] && kill -0 "$frontend_pid" 2>/dev/null; then
    kill "$frontend_pid" 2>/dev/null || true
  fi

  if [[ -n "$backend_pid" ]] && kill -0 "$backend_pid" 2>/dev/null; then
    kill "$backend_pid" 2>/dev/null || true
  fi
}

trap cleanup EXIT INT TERM

if [[ ! -d "$BACKEND_DIR/node_modules" ]]; then
  echo "Instalando dependencias do backend..."
  npm install --prefix "$BACKEND_DIR"
fi

if [[ ! -d "$FRONTEND_DIR/node_modules" ]]; then
  echo "Instalando dependencias do frontend..."
  npm install --prefix "$FRONTEND_DIR"
fi

echo "Subindo backend em http://localhost:$BACKEND_PORT"
(cd "$BACKEND_DIR" && PORT="$BACKEND_PORT" npm start) &
backend_pid="$!"

echo "Subindo frontend em http://localhost:$FRONTEND_PORT"
(cd "$FRONTEND_DIR" && VITE_API_URL="http://localhost:$BACKEND_PORT" npm run dev -- --host 127.0.0.1 --port "$FRONTEND_PORT") &
frontend_pid="$!"

echo
echo "Tudo pronto:"
echo "Frontend: http://localhost:$FRONTEND_PORT"
echo "Backend:  http://localhost:$BACKEND_PORT"
echo
echo "Login de teste:"
echo "Email: admin@sistema.com"
echo "Senha: 123456"
echo
echo "Pressione Ctrl+C para parar tudo."

wait "$backend_pid" "$frontend_pid"
