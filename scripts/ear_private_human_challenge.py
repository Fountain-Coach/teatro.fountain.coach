#!/usr/bin/env python3
"""Prespecified expert-rated mispronunciation challenge, isolated from tuning.

Original human-rated speechocean762, CC BY 4.0, adult speakers only.
Selects four explicitly listed offsets where the ORIGINAL experts reported
pronunciation difficulties. Selection is based on human labels, NOT model
output or predicted recognition mistakes. No audio/labels committed to Git.
"""
from __future__ import annotations

import argparse
import hashlib
import json
import pathlib
import wave

from ear_private_human_corpus import (
    MAX_AUDIO_BYTES, dataset_rows, fetch, hash_bytes, structured_labels)

OFFSETS = {"train": (337, 599), "test": (354, 368)}


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--out", default="/tmp/ear-human-pronunciation-challenge-20261024")
    args = parser.parse_args()
    root = pathlib.Path(args.out).expanduser().resolve()
    if not str(root).startswith("/private/tmp/"):
        parser.error("Private speech challenge must be under /tmp")
    root.mkdir(parents=True, exist_ok=True)
    items = []
    speakers = {"train": set(), "test": set()}
    for split, indices in OFFSETS.items():
        for index in indices:
            options = dataset_rows(split, index)
            matching = [x["row"] for x in options if x["row_idx"] == index]
            if len(matching) != 1:
                raise ValueError("External source index changed")
            row = matching[0]
            if row.get("age") is None or int(row["age"]) < 18:
                raise ValueError("This bounded corpus uses adult recording sources only")
            labels, count = structured_labels(row)
            low_scores = sum(
                float(s) < 1.5 for word in labels
                for s in word["expertPhoneAccuracyMean"])
            corrections = sum(len(w["reportedMispronunciations"])
                              for w in labels)
            if low_scores < 2 or corrections < 1:
                raise ValueError("Human-rated pronunciation challenge lacks annotated errors")
            speaker = str(row["speaker"])
            speakers[split].add(speaker)
            path = root / f"{split}-{index}.wav"
            if not path.exists():
                srcs = row.get("audio", [])
                if len(srcs) != 1 or "src" not in srcs[0]:
                    raise ValueError("No unique original audio source")
                audio = fetch(srcs[0]["src"], MAX_AUDIO_BYTES)
                if audio[:4] != b"RIFF" or audio[8:12] != b"WAVE":
                    raise ValueError("Not RIFF/WAVE")
                path.write_bytes(audio)
            data = path.read_bytes()
            if len(data) > MAX_AUDIO_BYTES:
                raise ValueError("Source audio too large")
            with wave.open(str(path), "rb") as wav:
                duration = wav.getnframes() / wav.getframerate()
                if ((wav.getnchannels(), wav.getsampwidth(), wav.getframerate())
                    != (1, 2, 16000) or not .25 <= duration <= 30):
                    raise ValueError("Unsupported human recorded audio")
            items.append({
                "sourceId": f"{split}-{index}", "partition": split,
                "sourceRowIndex": index,
                "file": str(path), "audioSHA256": hash_bytes(data),
                "humanRecording": True,
                "speakerPseudonym": hash_bytes(("ear-speechocean762-" + speaker).encode())[:16],
                "transcriptReference": row["text"],
                "wordPhoneJudgments": labels, "canonicalPhonesTotal": count,
                "humanRatedLowAccuracyPhones": low_scores,
                "annotatedPhoneSubstitutions": corrections,
                "phoneTemporalBoundaries": "NOT_SUPPLIED",
                "independentHumanExpertScoring": True,
                "sourceRate": 16000,
                "durationSeconds": round(duration, 3)
            })
    if len(items) != 4 or any(len(speakers[s]) != 2 for s in OFFSETS):
        raise ValueError("Incomplete challenge or speaker split leakage")
    if speakers["train"] & speakers["test"]:
        raise ValueError("Speaker leakage in challenge")
    manifest = {
        "schema": "ear.human-rated-pronunciation-reference.v1",
        "sourceVariant": "independent-pronunciation-challenge",
        "selectionCriterion": "expertPhoneScoreBelow1.5OrAnnotatedMispronunciation",
        "source": "OpenSLR SLR101 / mispeech/speechocean762 Hugging Face viewer",
        "sourceURL": "https://openslr.org/101/",
        "datasetURL": "https://huggingface.co/datasets/mispeech/speechocean762",
        "license": "CC BY 4.0 original corpus; citation and attribution required",
        "credit": "Zhang et al., speechocean762, Interspeech 2021",
        "sourceAnnotationSemantics": "Human-rated canonical phone pronunciation goodness; no independent time alignment",
        "splitsDisjointBySpeaker": True,
        "referenceIsNotASingVoiceAsset": True,
        "voiceCloningAuthorized": False,
        "admittedAsHumanRatedSpeechEvidence": True,
        "admittedAsAnnotatedSingingReference": False,
        "records": items,
        "mediaRelease": "not-admitted",
    }
    target = root / "challenge.json"
    if target.exists():
        if json.loads(target.read_text()) != manifest:
            raise ValueError("Previously witnessed challenge identity changed; refuse overwrite")
    else:
        target.write_text(json.dumps(manifest, indent=2, sort_keys=True) + "\n")
    print(json.dumps({
        "manifest": str(target),
        "recordings": len(items),
        "independentSpeakers": sum(len(s) for s in speakers.values()),
        "expertPhoneRatings": sum(r["canonicalPhonesTotal"] for r in items),
        "lowAccuracyPhoneJudgments": sum(r["humanRatedLowAccuracyPhones"] for r in items),
        "reportedPhoneMispronunciations": sum(r["annotatedPhoneSubstitutions"] for r in items),
        "mediaMB": round(sum(pathlib.Path(r["file"]).stat().st_size
                             for r in items) / 1_000_000, 2),
        "mediaPublished": False}, indent=2))


if __name__ == "__main__":
    main()
