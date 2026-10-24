#!/usr/bin/env python3
"""Fetch a tiny human-rated speech reference without bulk dataset downloads.

speechocean762 original: CC BY 4.0 (OpenSLR 101). Human experts scored the
canonical phone realizations. Scores are NOT time-aligned phoneme boundaries.
Audio is NOT licensed as a Sing voice asset; research reference stays /tmp.
No trained model, no voice imitation, no raw media in Git.
"""
from __future__ import annotations

import argparse
import hashlib
import json
import pathlib
import urllib.parse
import urllib.request
import wave

DATASET = "mispeech/speechocean762"
RECORDS = {"train": (480, 481, 482, 1350, 1351, 1352),
           "test": (480, 481, 482, 900, 901, 902)}
MAX_AUDIO_BYTES = 2_000_000


def fetch(url: str, max_bytes: int) -> bytes:
    parsed = urllib.parse.urlparse(url)
    if parsed.scheme != "https" or parsed.hostname not in (
        "datasets-server.huggingface.co", "huggingface.co", "cdn-lfs.huggingface.co"):
        raise ValueError("Untrusted dataset URL host")
    req = urllib.request.Request(url, headers={"User-Agent": "TeatroEarHumanReference/1.0"})
    with urllib.request.urlopen(req, timeout=25) as response:
        if response.status != 200:
            raise ValueError("Missing external reference source")
        body = response.read(max_bytes + 1)
        if len(body) > max_bytes:
            raise ValueError("Exceeded bounded external reference size")
        return body


def hash_bytes(b: bytes) -> str:
    return hashlib.sha256(b).hexdigest()


def dataset_rows(split: str, start: int):
    query = urllib.parse.urlencode({
        "dataset": DATASET, "config": "default", "split": split,
        "offset": start, "length": 3})
    url = "https://datasets-server.huggingface.co/rows?" + query
    response = json.loads(fetch(url, 3_000_000))
    result = response.get("rows")
    if not isinstance(result, list) or len(result) != 3:
        raise ValueError("Dataset split or requested row count changed")
    return result


def structured_labels(row: dict) -> tuple[list[dict], int]:
    words = row.get("words", [])
    if not isinstance(words, list) or not words:
        raise ValueError("Reference has no expert word/phone information")
    phones_total = 0
    labels = []
    for word in words:
        phones = word.get("phones", [])
        ratings = word.get("phones-accuracy", [])
        if not isinstance(phones, list) or len(phones) == 0 or len(phones) != len(ratings):
            raise ValueError("Expert phone score mismatch")
        for phoneme, score in zip(phones, ratings):
            if not isinstance(phoneme, str) or not isinstance(score, (int, float)):
                raise ValueError("Phone/score malformed")
            if not 0 <= float(score) <= 2:
                raise ValueError("Expert phone score outside 0-2")
        phones_total += len(phones)
        labels.append({
            "word": word["text"], "canonicalPhones": phones,
            "expertPhoneAccuracyMean": [float(v) for v in ratings],
            "reportedMispronunciations": word.get("mispronunciations", []),
        })
    return labels, phones_total


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--out", default="/tmp/ear-human-speechocean-20261024")
    args = parser.parse_args()
    root = pathlib.Path(args.out).expanduser().resolve()
    if not str(root).startswith("/private/tmp/"):
        parser.error("Private reference WAVs must remain under /tmp")
    root.mkdir(parents=True, exist_ok=True)
    entries = []
    speakers_by_split = {"train": set(), "test": set()}
    for split, offsets in RECORDS.items():
        for base in (offsets[0], offsets[3]):
            for item in dataset_rows(split, base):
                row = item["row"]
                offset = item["row_idx"]
                if offset not in offsets:
                    raise ValueError("Dataset row order drift")
                labels, phone_count = structured_labels(row)
                if row.get("age") is None or int(row["age"]) < 18:
                    raise ValueError("This bounded human speech fixture requires adult-only voices")
                speaker = str(row["speaker"])
                speakers_by_split[split].add(speaker)
                audio = row.get("audio")
                if not isinstance(audio, list) or len(audio) != 1 or "src" not in audio[0]:
                    raise ValueError("No unique reference audio")
                path = root / f"{split}-{offset}.wav"
                if not path.exists():
                    raw = fetch(audio[0]["src"], MAX_AUDIO_BYTES)
                    if raw[:4] != b"RIFF" or raw[8:12] != b"WAVE":
                        raise ValueError("Not a real WAV")
                    path.write_bytes(raw)
                else:
                    raw = path.read_bytes()
                if len(raw) > MAX_AUDIO_BYTES:
                    raise ValueError("Existing WAV outside byte bound")
                with wave.open(str(path), "rb") as wav:
                    duration = wav.getnframes() / wav.getframerate()
                    if not .25 <= duration <= 30:
                        raise ValueError("Unexpected human recording length")
                    if (wav.getnchannels(), wav.getsampwidth(), wav.getframerate()) != (1, 2, 16000):
                        raise ValueError("Expected source mono PCM16 at 16kHz")
                entries.append({
                    "sourceId": f"{split}-{offset}", "partition": split,
                    "sourceRowIndex": offset,
                    "file": str(path),
                    "audioSHA256": hash_bytes(raw),
                    "humanRecording": True,
                    "speakerPseudonym": hash_bytes(
                        ("ear-speechocean762-" + speaker).encode("utf8"))[:16],
                    "transcriptReference": row["text"],
                    "wordPhoneJudgments": labels,
                    "canonicalPhonesTotal": phone_count,
                    "phoneTemporalBoundaries": "NOT_SUPPLIED",
                    "independentHumanExpertScoring": True,
                    "sourceRate": wav.getframerate(),
                    "durationSeconds": round(duration, 3),
                })
    if len(speakers_by_split["train"]) != 2 or len(speakers_by_split["test"]) != 2:
        raise ValueError("Two independent speakers per split required")
    if speakers_by_split["train"] & speakers_by_split["test"]:
        raise ValueError("Speaker leakage across train/test")
    if len(entries) != 12:
        raise ValueError("Not the prespecified 12-recording fixed fixture")
    manifest = {
        "schema": "ear.human-rated-pronunciation-reference.v1",
        "source": "OpenSLR SLR101 / mispeech/speechocean762 Hugging Face viewer",
        "sourceURL": "https://openslr.org/101/",
        "datasetURL": "https://huggingface.co/datasets/mispeech/speechocean762",
        "license": "CC BY 4.0 original corpus; citation and attribution required",
        "credit": "Zhang et al., speechocean762, Interspeech 2021",
        "sourceAnnotationSemantics": (
            "Canonical phones derived from transcript; human experts judged "
            "per-phone pronunciation goodness, NOT phoneme-timing alignment "
            "or proof of actual produced phoneme identity."),
        "splitsDisjointBySpeaker": True,
        "referenceIsNotASingVoiceAsset": True,
        "voiceCloningAuthorized": False,
        "admittedAsHumanRatedSpeechEvidence": True,
        "admittedAsAnnotatedSingingReference": False,
        "records": entries,
        "mediaRelease": "not-admitted",
    }
    file = root / "manifest.json"
    # A future provider-row edit must not silently relabel private audio
    # from an earlier witness. Protect source + scores as one immutable pack.
    if file.exists():
        previous = json.loads(file.read_text())
        if previous != manifest:
            raise ValueError("Existing source-addressed reference manifest drift; refuse overwrite")
    else:
        file.write_text(json.dumps(manifest, indent=2, sort_keys=True) + "\n")
    print(json.dumps({
        "manifest": str(file),
        "records": len(entries),
        "speakersPerSplit": {k: len(v) for k, v in speakers_by_split.items()},
        "expertPhoneScores": sum(x["canonicalPhonesTotal"] for x in entries),
        "totalAudioMB": round(sum(pathlib.Path(r["file"]).stat().st_size
                                  for r in entries) / 1_000_000, 2),
        "humanRatedPhoneQuality": True,
        "humanTimedPhonemeBoundaries": False,
        "licensedVoiceInstrument": False,
        "mediaPublished": False,
    }, indent=2))


if __name__ == "__main__":
    main()
