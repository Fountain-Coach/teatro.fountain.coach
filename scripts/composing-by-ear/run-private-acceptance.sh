#!/bin/sh
# A bounded, localhost-only original Sing/Ear/MIDI2/Csound audition.
# The server is a temporary test fixture and always stops; never a new
# publication or persistent production service.
set -eu
here=$(CDPATH= cd -- "$(dirname -- "$0")" && pwd)
repo=$(CDPATH= cd -- "$here/../.." && pwd)
stage=/tmp/fc-composing-by-ear
port=8198
if lsof -nP -iTCP:$port -sTCP:LISTEN >/dev/null 2>&1; then
  echo "Original private test requires idle localhost port $port" >&2
  exit 1
fi
python3 "$here/prepare.py" "$stage"
python3 -m http.server "$port" --bind 127.0.0.1 --directory "$stage" > "$stage/http-server.log" 2>&1 &
pid=$!
stop() {
  kill "$pid" 2>/dev/null || true
  wait "$pid" 2>/dev/null || true
}
trap stop EXIT INT TERM
# The independent test starts only when the existing media server is ready.
attempt=0
until curl -fsS -o /dev/null "http://127.0.0.1:$port/"; do
  attempt=$((attempt + 1))
  if [ "$attempt" -ge 15 ]; then
    echo "Private fixture did not start" >&2
    exit 1
  fi
  sleep 1
done
node "$here/verify-browser.mjs" "$stage/evidence"
# Regenerate only our three private derived listening files; the original
# Sing input and the WAV evidence are never deleted by this command.
projection="$stage/stage-overlay/teatro/experiments/composing-by-ear"
for name in index.html csound-control.m4a csound-by-ear.m4a; do
  [ ! -f "$projection/$name" ] || rm "$projection/$name"
done
python3 "$here/build_audition.py" "$stage/evidence" "$stage/stage-overlay"
