#!/usr/bin/env python3
"""Ear: independently sourced, speaker-held-out vowel-NUCLEUS probe.

Recognizes a tiny intended vowel group (/ɑ/, /i/, /oʊ/) from waveform ONLY.
Does not recognize word/syllable/consonant or validate a phoneme transcript.
Reference utterances are system TTS, not human-verified IPA labels.
Training, calibration, reserved witness are disjoint speakers; Sing is not
used to train/calibrate. Unknown/nonspeech must trigger abstention.
"""
from __future__ import annotations

import argparse
import hashlib
import json
import math
import statistics
import wave
from pathlib import Path

from ear_private_envelope import SAMPLE_RATE, envelope, similarity
from ear_private_cv_probe import read_wave, region

VOWELS = ("ɑ", "i", "oʊ")


def vocal_regions(signal: list[float]) -> list[tuple[int, int]]:
    """Find isolated acoustic islands by RMS, not MIDI notes or source lyrics."""
    hop = 480
    levels = [
        math.sqrt(sum(v * v for v in signal[i:i + hop]) /
                  max(1, len(signal[i:i + hop])))
        for i in range(0, len(signal), hop)]
    if not levels or max(levels) < .008:
        return []
    gate = max(.006, max(levels) * .065)
    ranges = []
    begin = None
    for index, active in enumerate([level >= gate for level in levels] + [False]):
        if active and begin is None:
            begin = index
        if not active and begin is not None:
            if index - begin >= 8:
                ranges.append((max(0, begin * hop - 240),
                               min(len(signal), index * hop + 240)))
            begin = None
    # Join breath-level small interruptions (<25ms), but preserve 50ms Sing
    # syllable gaps even when notes within one syllable share one vowel.
    joined = []
    for start, end in ranges:
        if joined and start - joined[-1][1] < .025 * SAMPLE_RATE:
            joined[-1] = (joined[-1][0], end)
        else:
            joined.append((start, end))
    return joined


def nucleus(signal: list[float], bounds: tuple[int, int]) -> list[float] | None:
    start, end = bounds
    duration = end - start
    if duration < .125 * SAMPLE_RATE:
        return None
    # Extremely short TTS realizations (e.g. Australian "mah") still
    # need >=2 full 2048-sample windows; move start earlier, never use
    # the intended phoneme or score to decide an alignment.
    lo = (start + min(.46 * duration, duration - .12 * SAMPLE_RATE)) / SAMPLE_RATE
    hi = min(end / SAMPLE_RATE,
             max(lo + .102, (start + .89 * duration) / SAMPLE_RATE))
    if hi - lo < .09:
        return None
    return envelope(signal, lo, hi)


def rank(vector: list[float] | None, templates: dict[str, list[list[float]]]) -> list[tuple[str, float]] | None:
    if vector is None:
        return None
    return sorted([
        (vowel, statistics.mean(sorted(similarity(vector, r) for r in records)[-4:]))
        for vowel, records in templates.items()], key=lambda x: -x[1])


def decide(ranks: list[tuple[str, float]] | None, similarity_floor: float,
           margin_floor: float) -> dict:
    if ranks is None:
        return {"nucleusHypothesis": "unknown", "reason": "no-voiced-nucleus",
                "similarity": None, "margin": None}
    top, second = ranks[0], ranks[1]
    margin = top[1] - second[1]
    pass_gate = top[1] >= similarity_floor and margin >= margin_floor
    return {
        "nucleusHypothesis": top[0] if pass_gate else "unknown",
        "rawBest": top[0],
        "similarity": round(top[1], 5), "margin": round(margin, 5),
        "reason": "synthetic-vowel-reference-proxy" if pass_gate else "abstained",
        "confidence": "NOT_A_CALIBRATED_PROBABILITY",
        "humanValidatedPhoneme": False,
    }


def reference(manifest: dict) -> dict[str, list[list[float]]]:
    templates: dict[str, list[list[float]]] = {v: [] for v in VOWELS}
    for sample in manifest["recordings"]:
        if sample["partition"] != "train":
            continue
        data, _ = read_wave(sample["path"], sample["wavSHA256"])
        ranges = vocal_regions(data)
        if len(ranges) != 1:
            raise ValueError("Training prompt did not produce one isolated CV " + sample["id"])
        feature = nucleus(data, ranges[0])
        if feature is None:
            raise ValueError("Cannot find training vowel nucleus " + sample["id"])
        templates[sample["nucleusIntent"]].append(feature)
    if any(len(group) != 12 for group in templates.values()):
        raise ValueError("Requires 4 train speakers x 3 examples each per nucleus")
    return templates


def prepared(manifest: dict, part: str, templates: dict) -> list[dict]:
    rows = []
    for rec in manifest["recordings"]:
        if rec["partition"] != part:
            continue
        data, digest = read_wave(rec["path"], rec["wavSHA256"])
        ranges = vocal_regions(data)
        if rec["target"] == "unknown":
            token = rec.get("unknownToken", "")
            # Even untrained /pɑ/, /kɑ/, /sɑ/ HAVE /ɑ/ nuclei.
            # The unheard onset is unknown, but their VOWEL is not negative!
            truth = ("i" if token == "i" else "ɑ" if token in
                     ("pa", "ka", "ta", "sa", "a") else "unknown")
        else:
            truth = rec["nucleusIntent"]
        vector = nucleus(data, ranges[0]) if len(ranges) == 1 else None
        rows.append({
            "sourceId": rec["id"],
            "speaker": rec["speaker"], "partition": part,
            "sourceSHA256": digest,
            "expectedNucleusIntent": truth,
            "detectedRegions": len(ranges),
            "ranks": rank(vector, templates),
        })
    return rows


def metric(rows: list[dict], threshold: float, margin: float) -> tuple[dict, list[dict]]:
    receipt = []
    positives = 0
    correct = 0
    negatives = 0
    rejected = 0
    for row in rows:
        result = decide(row["ranks"], threshold, margin)
        truth = row["expectedNucleusIntent"]
        if truth == "unknown":
            negatives += 1
            rejected += result["nucleusHypothesis"] == "unknown"
        else:
            positives += 1
            correct += result["nucleusHypothesis"] == truth
        receipt.append({key: val for key, val in row.items() if key != "ranks"} |
                       {"inference": result, "match": result["nucleusHypothesis"] == truth})
    return ({
        "positives": positives, "positiveCorrect": correct,
        "positiveRecall": round(correct / positives, 4) if positives else None,
        "negativeCount": negatives, "negativeRejected": rejected,
        "negativeRejection": round(rejected / negatives, 4) if negatives else None,
    }, receipt)


def calibrate(rows: list[dict]) -> tuple[float, float, dict, list[dict]]:
    # A threshold is chosen exclusively using independent calibration speakers.
    best = None
    for similarity_floor in (.5, .55, .6, .65, .7, .75, .8, .84, .88, .91, .93, .95, .97, .985):
        for margin_floor in (.0, .005, .01, .02, .03, .05, .075, .1, .15):
            metrics, receipt = metric(rows, similarity_floor, margin_floor)
            if metrics["negativeCount"] and metrics["negativeRejection"] < 1:
                continue
            candidate = (metrics["positiveCorrect"], similarity_floor, margin_floor)
            if best is None or candidate > best[0]:
                best = (candidate, similarity_floor, margin_floor, metrics, receipt)
    if best is None:
        m, r = metric(rows, 1.001, 1.0)
        return 1.001, 1.0, m, r
    return best[1], best[2], best[3], best[4]


def synthetic_tone(path: Path, mode: str) -> None:
    """Pure non-speech candidate, never trained or consulted as score."""
    import struct
    with wave.open(str(path), "wb") as out:
        out.setnchannels(1); out.setsampwidth(2); out.setframerate(SAMPLE_RATE)
        for i in range(int(.8 * SAMPLE_RATE)):
            t = i / SAMPLE_RATE
            if mode == "pure":
                value = .15 * math.sin(2 * math.pi * 261.63 * t)
            else:
                value = .08 * math.sin(2 * math.pi * 261.63 * t) + .07 * math.sin(2 * math.pi * 523.26 * t)
            out.writeframesraw(struct.pack("<h", int(value * 32767)))


def evaluation(manifest_path: str, candidates: list[str]) -> dict:
    path = Path(manifest_path).expanduser().resolve()
    if not str(path).startswith("/private/tmp/"):
        raise ValueError("private corpus required")
    raw = path.read_bytes()
    manifest = json.loads(raw)
    if manifest.get("schema") != "ear.private-phonetic-cv.v1":
        raise ValueError("unknown synthetic manifest")
    templates = reference(manifest)
    cal = prepared(manifest, "calibration", templates)
    threshold, margin, cm, cr = calibrate(cal)
    final_rows = prepared(manifest, "witness", templates)
    wm, wr = metric(final_rows, threshold, margin)
    # Three classes under a synthetic-only, speaker-held-out probe.
    eligible = cm["positiveRecall"] is not None and cm["positiveRecall"] >= .85 and wm["positiveRecall"] >= .85 and cm["negativeRejection"] == 1 and wm["negativeRejection"] == 1
    sung = []
    for candidate in candidates:
        audio, digest = read_wave(candidate)
        segments = []
        for start, end in vocal_regions(audio):
            v = nucleus(audio, (start, end))
            segments.append({
                "startMs": round(start / SAMPLE_RATE * 1000, 2),
                "endMs": round(end / SAMPLE_RATE * 1000, 2),
                "inference": decide(rank(v, templates), threshold, margin)})
        sung.append({
            "wavSHA256": digest, "filename": Path(candidate).name,
            "scoreWasNotSupplied": True, "segments": segments,
            "qualifiedToClaimVowels": bool(eligible),
            "recognizedVowels": [
                x["inference"]["nucleusHypothesis"] if eligible else "unknown"
                for x in segments],
        })
    return {
        "schema": "ear.private-vowel-nucleus-probe.v1",
        "status": "synthetic-speaker-validation-passed" if eligible else "not-qualified",
        "sourceManifestSHA256": hashlib.sha256(raw).hexdigest(),
        "reference": "Mac system TTS prompts, not independently IPA-audited",
        "calibrated": {"similarityFloor": threshold, "marginFloor": margin,
                       "metrics": cm, "observations": cr},
        "unseenSpeakerWitness": {"metrics": wm, "observations": wr},
        "soundInputs": sung,
        "phonemeSequenceRecognition": "NOT_IMPLEMENTED",
        "consonantRecognition": "NOT_QUALIFIED",
        "naturalisticSpeakerIdentity": "NOT_MEASURED",
        "humanIntelligibility": "NOT_QUALIFIED",
        "mediaPublished": False,
    }


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--reference", required=True)
    parser.add_argument("--candidate", action="append", default=[])
    parser.add_argument("--report", default="/tmp/ear-vowel-witness.json")
    args = parser.parse_args()
    receipt = evaluation(args.reference, args.candidate)
    report = Path(args.report).expanduser().resolve()
    if not str(report).startswith("/private/tmp/"):
        parser.error("receipt must stay in /tmp")
    report.write_text(json.dumps(receipt, indent=2, sort_keys=True) + "\n")
    print(json.dumps({
        "status": receipt["status"],
        "calibrationMetrics": receipt["calibrated"]["metrics"],
        "unseenMetrics": receipt["unseenSpeakerWitness"]["metrics"],
        "candidateVowels": receipt["soundInputs"],
        "report": str(report),
        "mediaPublished": False,
    }, indent=2))


if __name__ == "__main__":
    main()
