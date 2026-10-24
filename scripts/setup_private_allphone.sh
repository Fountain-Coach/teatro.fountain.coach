#!/bin/sh
# Ear's private, reproducible phone recognizer dependency.
# Local macOS developer only; no GitHub CI, server or publish step.
set -eu
PYTHON_BIN="${EAR_PYTHON313:-python3.13}"
VENV="/tmp/ear-phoneme-venv"
if ! command -v "$PYTHON_BIN" >/dev/null 2>&1; then
  echo "Ear requires local Python 3.13 with a macOS wheel; no automatic system installation" >&2
  exit 2
fi
if [ ! -x "$VENV/bin/python" ]; then
  "$PYTHON_BIN" -m venv "$VENV"
fi
"$VENV/bin/python" -m pip install --disable-pip-version-check --no-cache-dir --only-binary=:all: 'pocketsphinx==5.1.1'
"$VENV/bin/python" - <<'PY'
import sys
sys.path.insert(0, "scripts")
from ear_private_allphone import model_metadata
_,_,model=model_metadata()
assert model["confidence"] == "NOT_CALIBRATED"
print("Ear allphone 5.1.1 private acoustic model and phone language model digest verified")
print("Research only: no phone-recognition qualification or published audio")
PY
