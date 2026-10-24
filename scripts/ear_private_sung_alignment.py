#!/usr/bin/env python3
"""Ear-owned private, real HUMAN SINGING + 100ns phoneme time-reference pack.

Pinned upstream Project AI-dol: one singer, CC BY-SA 4.0 with creator-specific
model/voice-use restrictions. Only privately evaluate phoneme timestamps.
Neither WAV nor labels may enter Sing, a training set, voice bank, estate,
published assets or public Git. No permission to clone or publish this voice.
Recordings may contain copyrighted songs beyond the performer's own rights.
"""
from __future__ import annotations

import argparse
import hashlib
import json
import re
import urllib.request
import wave
from pathlib import Path

UPSTREAM_REPO = "lottev1991/Project-AIdol-Public-English-Dataset"
UPSTREAM_COMMIT = "517c98a02f95c1b4c371a9cc9678ab3a974222a9"
REFERENCE = (("Spectrum", "development"),
             ("Enjoy_the_Silence", "track-witness-same-singer"))
# Independently observed, pinned upstream commit media and HTK label hashes.
# Do not accept pre-staged private media with different content, even on
# first execution when no prior manifest is present.
EXPECTED_SHA256 = {
    "Spectrum": {
        "wav": "b69c4a7e547b84ffb7d9849299264e0d47afabb16f6e2e9ed856bd75ff656648",
        "lab": "4e796a5f1b946428c7342fde592d9db8aff4d6602e5b5969b81dec26054a0e7b",
    },
    "Enjoy_the_Silence": {
        "wav": "5135007f7b964324b1fc19bb36ecf1000173b4f86bde6ea5d02ebdd183f1d269",
        "lab": "681ed91d5d69a07b6fe581ecfb9d9da9217ab1f874c513abc6aaaa047ec51123",
    },
}
MAX_WAV_BYTES = 11_000_000
MAX_LAB_BYTES = 120_000
TICKS_PER_SECOND = 10_000_000
PHONE = re.compile(r"^[a-zA-Z][a-zA-Z0-9_-]*$")


def sha(blob: bytes) -> str:
    return hashlib.sha256(blob).hexdigest()


def private_path(root: str) -> Path:
    path = Path(root).expanduser().resolve()
    if not str(path).startswith("/private/tmp/"):
        raise ValueError("Human singer audio and labels must remain under /tmp")
    return path


def fetch(name: str, file_type: str, bound: int) -> bytes:
    if name not in {x[0] for x in REFERENCE} or file_type not in ("lab", "wav"):
        raise ValueError("Source outside pinned human singing reference selection")
    url = (f"https://raw.githubusercontent.com/{UPSTREAM_REPO}/{UPSTREAM_COMMIT}"
           f"/{file_type}/{name}.{file_type}")
    request = urllib.request.Request(
        url, headers={"User-Agent": "FountainCoachEarPrivateReference/1.0"})
    with urllib.request.urlopen(request, timeout=45) as response:
        if response.status != 200:
            raise ValueError("Reference source unavailable")
        content = response.read(bound + 1)
    if not content or len(content) > bound:
        raise ValueError("Reference source exceeds predeclared size / empty")
    return content


def parse_lab(text: str) -> list[dict]:
    result = []
    last_end = 0
    for i, raw_line in enumerate(text.splitlines(), 1):
        line = raw_line.strip()
        if not line:
            continue
        fields = line.split()
        if len(fields) != 3:
            raise ValueError(f"Unrecognized HTK label line {i}")
        begin_s, end_s, phone = fields
        if not (begin_s.isdecimal() and end_s.isdecimal() and PHONE.fullmatch(phone)):
            raise ValueError(f"Malformed phone label line {i}")
        begin, end = int(begin_s), int(end_s)
        if begin != last_end or end <= begin:
            raise ValueError(f"Noncontiguous or invalid positive phoneme interval line {i}")
        if end > 10_000_000 * 3600:
            raise ValueError("Implausible timing range")
        result.append({"startTick100ns": begin, "endTick100ns": end,
                       "phone": phone})
        last_end = end
    if len(result) < 50 or last_end < 5 * TICKS_PER_SECOND:
        raise ValueError("Insufficient human singing phoneme intervals")
    return result


def label_stats(phones: list[dict]) -> dict:
    nonspeech = {"SP", "AP", "EP", "GS", "vf"}
    voiced_vowels = {
        "aa", "ae", "ah", "ao", "aw", "ax", "ay", "eh", "er", "ey",
        "ih", "iy", "ow", "oy", "uh", "uw", "en",
    }
    speech = [p for p in phones if p["phone"] not in nonspeech]
    vowels = [p for p in speech if p["phone"].lower() in voiced_vowels]
    return {"intervals": len(phones), "speechIntervals": len(speech),
            "vowelIntervals": len(vowels),
            "uniquePhoneSymbols": len(set(p["phone"] for p in phones)),
            "durationSeconds": round(phones[-1]["endTick100ns"] / TICKS_PER_SECOND, 4)}


def create(out: str) -> dict:
    folder = private_path(out)
    folder.mkdir(parents=True, exist_ok=True)
    selected = []
    for name, partition in REFERENCE:
        audio_file = folder / (name + ".wav")
        label_file = folder / (name + ".lab")
        for type_, path, max_size in (
            ("wav", audio_file, MAX_WAV_BYTES),
            ("lab", label_file, MAX_LAB_BYTES)
        ):
            if not path.exists():
                raw = fetch(name, type_, max_size)
                temp = path.with_suffix(path.suffix + ".part")
                temp.write_bytes(raw)
                temp.replace(path)
        audio_bytes = audio_file.read_bytes()
        label_bytes = label_file.read_bytes()
        if len(audio_bytes) > MAX_WAV_BYTES or len(label_bytes) > MAX_LAB_BYTES:
            raise ValueError("Unexpected existing file size")
        if (sha(audio_bytes) != EXPECTED_SHA256[name]["wav"] or
                sha(label_bytes) != EXPECTED_SHA256[name]["lab"]):
            raise ValueError("Upstream-pinned singer audio/label digest mismatch")
        label = parse_lab(label_bytes.decode("utf-8"))
        with wave.open(str(audio_file), "rb") as audio:
            if (audio.getnchannels(), audio.getsampwidth(),
                audio.getcomptype()) != (1, 2, "NONE"):
                raise ValueError("Expected source mono 16-bit PCM WAV")
            rate = audio.getframerate()
            frames = audio.getnframes()
            duration = frames / rate
        if not 22050 <= rate <= 96000:
            raise ValueError("Unexpected audio sample rate")
        label_end = label[-1]["endTick100ns"] / TICKS_PER_SECOND
        if abs(duration - label_end) > .05:
            raise ValueError(
                f"Human singing WAV and timed labels disagree: {name} "
                f"audio={duration:.4f}s labels={label_end:.4f}s")
        selected.append({
            "id": name, "split": partition, "speaker": "Project-AIdol-LotteV-one-singer",
            "audioPath": str(audio_file), "labelPath": str(label_file),
            "audioSHA256": sha(audio_bytes), "labelSHA256": sha(label_bytes),
            "sampleRate": rate, "frameCount": frames,
            "actualWavDurationSeconds": round(duration, 5),
            "labels": label_stats(label),
            "timeBase": "HTK_100ns",
            "labelOrigin": "human-curated-published-time-alignment-not-independently-audited-by-Ear",
            "audioRelease": "private-evaluation-only",
        })
    manifest = {
        "schema": "ear.private-human-sung-alignment.v1",
        "sourceURL": f"https://github.com/{UPSTREAM_REPO}",
        "sourceCommit": UPSTREAM_COMMIT,
        "creatorAttribution": "Lotte V, Project AI-dol Public English Dataset",
        "upstreamLicense": "CC BY-SA 4.0 with creator's additional use notes",
        "sourceHasHumanSungAudio": True,
        "sourceHasPublishedTimedPhonemeLabels": True,
        "independentEarPhonemeAudit": False,
        "sourceSingerCount": 1,
        "speakerDisjointEvaluationAvailable": False,
        "copyrightOfSongsClearedByThisTest": False,
        "publicVoiceModelAuthorized": False,
        "trainingAuthorizedByThisImporter": False,
        "sourceBlindInferenceRequired": True,
        "labelUse": "evaluation-after-inference-only",
        "records": selected,
        "publicMedia": "not-admitted",
    }
    destination = folder / "manifest.json"
    if destination.exists():
        if json.loads(destination.read_text()) != manifest:
            raise ValueError("Previously evidenced human-sung manifest drift: refuse overwrite")
    else:
        destination.write_text(json.dumps(manifest, sort_keys=True, indent=2) + "\n")
    return {"manifest": str(destination), "sources": len(selected),
            "singers": 1, "sourceBytes": sum(Path(x["audioPath"]).stat().st_size
                                            for x in selected),
            "intervals": sum(x["labels"]["intervals"] for x in selected),
            "durationSeconds": round(sum(x["actualWavDurationSeconds"]
                                         for x in selected), 2),
            "speakerDisjoint": False, "voiceTraining": False, "publicMedia": False}


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--out", default="/tmp/ear-sung-human-timed-20261024")
    args = parser.parse_args()
    print(json.dumps(create(args.out), indent=2))


if __name__ == "__main__":
    main()
