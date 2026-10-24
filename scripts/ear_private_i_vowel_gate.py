#!/usr/bin/env python3
"""Ear's conservatively scoped acoustic /i/-NUCLEUS candidate, not phoneme ASR.

One binary i-vs-not-i detector from source-independent macOS system-TTS
references. Fixed threshold calibrated only on Moira and Tessa (not Sing).
The reference phoneme labels are synthesis-text INTENT, not human-corrected IPA.
Validation on new voices is advisory and separate. Does not identify /l,m,n/
onsets, /ɑ/, words, phoneme boundaries or listener intelligibility.
"""
from __future__ import annotations

import argparse
import hashlib
import json
from pathlib import Path

from ear_private_vowel_probe import (reference, prepared, rank, nucleus,
                                      vocal_regions, read_wave)

# Explicitly fixed based on training+calibration only; final unknown speakers
# must not modify these constants. These are NOT posterior probabilities.
MIN_I_SIMILARITY = .84
MIN_I_MARGIN = .075


def infer_i(ranks: list[tuple[str, float]] | None) -> dict:
    if not ranks:
        return {"iNucleusDetected": False, "outcome": "abstain",
                "reason": "no-clear-voiced-region", "similarity": None,
                "margin": None}
    first, second = ranks[:2]
    margin = first[1] - second[1]
    detected = first[0] == "i" and first[1] >= MIN_I_SIMILARITY and margin >= MIN_I_MARGIN
    return {
        "iNucleusDetected": detected,
        "outcome": "i-intent-proxy" if detected else "abstain",
        "rawBest": first[0],
        "similarity": round(first[1], 5),
        "margin": round(margin, 5),
        "reason": ("independent-synthetic-vowel-spectral-match"
                   if detected else "no-confident-i-nucleus"),
        "phonemeVerified": False
    }


def metrics(records: list[dict]) -> dict:
    expected_i = sum(r["expectedNucleusIntent"] == "i" for r in records)
    false_positive = 0
    true_positive = 0
    negatives = 0
    report = []
    for row in records:
        result = infer_i(row["ranks"])
        truth = row["expectedNucleusIntent"] == "i"
        if truth:
            true_positive += result["iNucleusDetected"]
        else:
            negatives += 1
            false_positive += result["iNucleusDetected"]
        report.append({
            "sourceId": row["sourceId"],
            "speaker": row["speaker"],
            "sourceSHA256": row["sourceSHA256"],
            "expectedHasIIntent": truth,
            "inference": result,
        })
    return {"iPositiveCount": expected_i, "iPositiveDetected": true_positive,
            "iRecall": round(true_positive / expected_i, 4) if expected_i else None,
            "otherOrNonSpeechCount": negatives, "falsePositives": false_positive,
            "specificity": round((negatives - false_positive) / negatives, 4)
            if negatives else None,
            "observations": report}


def quality_ready(calibration: dict, prior: dict, novel: dict | None) -> bool:
    # The new independent speakers must pass before any research hypothesis
    # can appear in the externally reported "recognized" column.
    return bool(
        novel is not None and
        calibration["iRecall"] >= .95 and calibration["specificity"] >= .95 and
        prior["iRecall"] >= .95 and prior["specificity"] >= .95 and
        novel["iRecall"] >= .95 and novel["specificity"] >= .95
    )


def analyze_corpus(manifest_path: str, candidates: list[str], novel_manifest=None) -> dict:
    p = Path(manifest_path).expanduser().resolve()
    if not str(p).startswith("/private/tmp/"):
        raise ValueError("Only private training manifests")
    raw = p.read_bytes()
    manifest = json.loads(raw)
    if manifest.get("schema") != "ear.private-phonetic-cv.v1":
        raise ValueError("Unknown reference corpus")
    templates = reference(manifest)
    calibration = metrics(prepared(manifest, "calibration", templates))
    witness = metrics(prepared(manifest, "witness", templates))
    # Calibration success does not create a true phoneme reference.
    novelty = None
    if novel_manifest:
        path = Path(novel_manifest).expanduser().resolve()
        if not str(path).startswith("/private/tmp/"):
            raise ValueError("novel witness must remain private")
        novel_corpus = json.loads(path.read_text())
        if novel_corpus.get("schema") != "ear.private-phonetic-cv.v1":
            raise ValueError("invalid novel corpus")
        train = set(manifest["speakers"]["train"])
        cal = set(manifest["speakers"]["calibration"])
        prior = set(manifest["speakers"]["witness"])
        new_voices = set(novel_corpus["speakers"]["witness"])
        if not new_voices or new_voices & (train | cal | prior):
            raise ValueError("Novel speaker overlap; don't reuse training/witness voices")
        novelty = metrics(prepared(novel_corpus, "witness", templates))
    # No claim/promotion when the post-freeze novel-speaker witness fails.
    # The raw acoustic detector may still emit research hypotheses.
    ready = quality_ready(calibration, witness, novelty)
    source_witness = []
    for filename in candidates:
        samples, digest = read_wave(filename)
        chunks = []
        for a, b in vocal_regions(samples):
            hypothesis = infer_i(rank(nucleus(samples, (a, b)), templates))
            chunks.append({"startMs": round(1000 * a / 48000, 1),
                           "endMs": round(1000 * b / 48000, 1),
                           "independentInference": hypothesis})
        source_witness.append({
            "filename": Path(filename).name, "SHA256": digest,
            "scoreProvidedToRecognizer": False,
            "segments": chunks,
            "iHypotheses": [
                "i" if chunk["independentInference"]["iNucleusDetected"] and ready
                else "unknown" for chunk in chunks
            ]
        })
    return {
        "schema": "ear.private-i-nucleus-probe.v1",
        "status": ("limited-synthetic-i-probe-supported"
                   if ready else "NOT_QUALIFIED"),
        "trainingManifestSHA256": hashlib.sha256(raw).hexdigest(),
        "referenceGroundTruth": "TTS prompt intent, NOT human-verified phoneme annotations",
        "frozenThreshold": {"iSimilarityMin": MIN_I_SIMILARITY, "iVsOtherMarginMin": MIN_I_MARGIN},
        "calibration": calibration, "priorWitness": witness,
        "newSpeakerWitness": novelty,
        "privateAudioWitness": source_witness,
        "independentPhonemeRecognition": "NOT_QUALIFIED",
        "onsetConsonantRecognition": "NOT_IMPLEMENTED",
        "lyricRecognition": "NOT_QUALIFIED",
        "humanIntelligibility": "not-measured",
        "publicRelease": "not-admitted"
    }


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--reference", required=True)
    parser.add_argument("--novel-witness")
    parser.add_argument("--candidate", action="append", default=[])
    parser.add_argument("--report", default="/tmp/ear-i-vowel-report.json")
    args = parser.parse_args()
    result = analyze_corpus(args.reference, args.candidate, args.novel_witness)
    dest = Path(args.report).expanduser().resolve()
    if not str(dest).startswith("/private/tmp/"):
        parser.error("Report must be private under /tmp")
    dest.write_text(json.dumps(result, indent=2, sort_keys=True) + "\n")
    def slim(m):
        if m is None: return None
        return {k: v for k, v in m.items() if k != "observations"}
    print(json.dumps({
        "status": result["status"],
        "frozenThreshold": result["frozenThreshold"],
        "calibration": slim(result["calibration"]),
        "priorWitness": slim(result["priorWitness"]),
        "newSpeakerWitness": slim(result["newSpeakerWitness"]),
        "privateAudioWitness": result["privateAudioWitness"],
        "report": str(dest),
    }, indent=2))


if __name__ == "__main__":
    main()
