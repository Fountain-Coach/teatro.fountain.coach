#!/usr/bin/env python3
"""Ear's real human-singing *acoustic-onset* witness, not phone recognition.

Input to infer_onsets is audio PCM ONLY (no score, lyrics, labels, timing).
Only AFTER independent inference compare broad voice onsets to curator's
pre-published HTK phoneme boundaries. A dev song is used to select a fixed
threshold; a second song by SAME singer tests temporal transfer, NOT
held-out-singer generalization. No model is trained. No audio is published.
"""
from __future__ import annotations

import argparse
from array import array
import hashlib
import json
import math
import statistics
import sys
import wave
from pathlib import Path

from ear_private_sung_alignment import (
    TICKS_PER_SECOND, EXPECTED_SHA256, UPSTREAM_COMMIT,
    REFERENCE, label_stats, parse_lab, private_path, sha)

SILENCE = {"SP", "AP", "EP", "GS", "vf"}
WINDOW_SECONDS = .02
HOP_SECONDS = .01


def read_pcm(path: Path, expected_sha: str) -> tuple[array, int, int]:
    p = private_path(str(path))
    raw = p.read_bytes()
    if sha(raw) != expected_sha:
        raise ValueError("Human singing source audio SHA mismatch")
    with wave.open(str(p), "rb") as audio:
        if (audio.getnchannels(), audio.getsampwidth(),
                audio.getcomptype()) != (1, 2, "NONE"):
            raise ValueError("Only mono PCM16 uncompressed human source WAV")
        samples = array("h")
        frames = audio.readframes(audio.getnframes())
        samples.frombytes(frames)
        if sys.byteorder != "little":
            samples.byteswap()
        return samples, audio.getframerate(), audio.getnframes()


def levels(samples: array, rate: int) -> tuple[list[float], int]:
    """Independent audio-only 20ms RMS, advanced by 10ms."""
    hop = int(rate * HOP_SECONDS)
    window = int(rate * WINDOW_SECONDS)
    if window < 16 or hop < 8 or len(samples) < window:
        raise ValueError("Invalid audio for acoustic timing")
    rms = []
    for pos in range(0, len(samples) - window + 1, hop):
        block = samples[pos:pos + window]
        rms.append(math.sqrt(sum(float(x) * x for x in block) / window) / 32768)
    return rms, hop


def infer_onsets(samples: array, rate: int, threshold: float,
                 min_quiet_ms: int = 60) -> list[float]:
    """Crucial: no label, score, transcript, voice ID or known target input."""
    if not (0 < threshold < 1 and 40 <= min_quiet_ms <= 400):
        raise ValueError("Invalid fixed blind onset configuration")
    rms, hop = levels(samples, rate)
    count_quiet = max(1, int(min_quiet_ms / (HOP_SECONDS * 1000)))
    candidates = []
    quiet_run = count_quiet
    in_voice = False
    for i in range(0, len(rms) - 2):
        # Require 30ms of voiced signal to avoid clicks/noisy breath.
        voice_now = (rms[i] >= threshold and
                     rms[i+1] >= threshold and rms[i+2] >= threshold)
        if not in_voice and voice_now and quiet_run >= count_quiet:
            candidates.append((i * hop) / rate)
            in_voice = True
        if rms[i] < threshold:
            quiet_run += 1
            if quiet_run >= count_quiet:
                in_voice = False
        else:
            quiet_run = 0
    return candidates


def reference_onsets(intervals: list[dict]) -> list[float]:
    """Post-inference use ONLY; exclude effects, breaths and silence."""
    result = []
    prev = "SP"
    for item in intervals:
        current = item["phone"]
        if current not in SILENCE and prev in SILENCE:
            result.append(item["startTick100ns"] / TICKS_PER_SECOND)
        prev = current
    return result


def match_events(candidates: list[float], targets: list[float],
                 tolerance_s: float = .12) -> dict:
    """One-to-one greedy global matching by absolute time error."""
    if not (0 < tolerance_s <= .3):
        raise ValueError("Unsafe onset tolerance")
    if any(b <= a for a, b in zip(candidates, candidates[1:])):
        raise ValueError("Predictions not time-monotonic")
    if any(b < a for a, b in zip(targets, targets[1:])):
        raise ValueError("Reference timings not time-monotonic")
    possibilities = sorted(
        (abs(p - t), i, j, p-t)
        for i, p in enumerate(candidates)
        for j, t in enumerate(targets)
        if abs(p - t) <= tolerance_s
    )
    used_pred, used_target = set(), set()
    errors = []
    for _, pi, ti, signed_delta in possibilities:
        if pi in used_pred or ti in used_target:
            continue
        used_pred.add(pi)
        used_target.add(ti)
        errors.append(signed_delta)
    hits = len(errors)
    precision = hits / len(candidates) if candidates else 0
    recall = hits / len(targets) if targets else 0
    return {
        "targetCount": len(targets),
        "independentDetectedOnsets": len(candidates),
        "matchedWithinTolerance": hits,
        "toleranceMs": round(tolerance_s*1000, 1),
        "precision": round(precision, 4),
        "recall": round(recall, 4),
        "f1": round(2*precision*recall/(precision+recall), 4)
        if precision+recall else 0,
        "medianAbsoluteErrorMs": round(statistics.median(abs(e)for e in errors)*1000, 2)
        if errors else None,
        "falsePositives": len(candidates)-hits,
        "missedReferenceOnsets": len(targets)-hits,
        "phoneIdentityRecognized": False,
    }


def verify_manifest(path: str) -> dict:
    p = private_path(path)
    m = json.loads(p.read_text())
    if (m.get("schema") != "ear.private-human-sung-alignment.v1" or
        m.get("sourceSingerCount") != 1 or
        m.get("speakerDisjointEvaluationAvailable") is not False or
        m.get("publicVoiceModelAuthorized") is not False or
        m.get("sourceBlindInferenceRequired") is not True or
        m.get("labelUse") != "evaluation-after-inference-only" or
        m.get("sourceCommit") != UPSTREAM_COMMIT or
        m.get("sourceHasPublishedTimedPhonemeLabels") is not True or
        m.get("publicMedia") != "not-admitted"):
        raise ValueError("Wrong or untrusted singing reference authority")
    if len(m.get("records", [])) != 2:
        raise ValueError("Expected two bounded source-addressed songs")
    expected_pairs = set(REFERENCE)
    if {(item["id"], item["split"]) for item in m["records"]} != expected_pairs:
        raise ValueError("Wrong source identities or splits")
    checked = []
    for record in m["records"]:
        expected = EXPECTED_SHA256[record["id"]]
        if (record["audioSHA256"] != expected["wav"] or
            record["labelSHA256"] != expected["lab"]):
            raise ValueError("Pinned upstream singing source hash changed")
        wav = private_path(record["audioPath"])
        lab = private_path(record["labelPath"])
        audio, rate, frames = read_pcm(wav, record["audioSHA256"])
        if (rate != record["sampleRate"] or frames != record["frameCount"] or
            sha(lab.read_bytes()) != record["labelSHA256"]):
            raise ValueError("Source / label SHA, sample-rate or frame count drift")
        aligned = parse_lab(lab.read_text())
        if label_stats(aligned) != record["labels"]:
            raise ValueError("Label structure changed since corpus admission")
        if abs(aligned[-1]["endTick100ns"]/TICKS_PER_SECOND - frames/rate) > .05:
            raise ValueError("Phone times outside WAV duration")
        checked.append((record, audio, rate, aligned))
    if len({r["speaker"] for r, *_ in checked}) != 1:
        raise ValueError("Source singer identity drift")
    return {"source": m, "audios": checked}


def evaluation(manifest: str) -> dict:
    payload = verify_manifest(manifest)
    packs = {row[0]["split"]: row for row in payload["audios"]}
    dev, witness = packs["development"], packs["track-witness-same-singer"]
    # Only dev human labels can select a threshold. Second track witness
    # does not influence calibration. Inference itself never sees any label.
    calibration = []
    for threshold in (.004, .006, .008, .01, .012, .015, .02, .025, .03, .04):
        candidates = infer_onsets(dev[1], dev[2], threshold)
        result = match_events(candidates, reference_onsets(dev[3]))
        calibration.append({"threshold": threshold, "metrics": result})
    winner = max(calibration, key=lambda r: (r["metrics"]["f1"],
                                            r["metrics"]["recall"],
                                            -r["threshold"]))
    threshold = winner["threshold"]
    candidate_events = infer_onsets(witness[1], witness[2], threshold)
    reference_events = reference_onsets(witness[3])
    final_metrics = match_events(candidate_events, reference_events)
    good = final_metrics["recall"] >= .8 and final_metrics["precision"] >= .8
    return {
        "schema": "ear.private-human-sung-timing-probe.v1",
        "status": "phrase-onset-proxy-only" if good else "phrase-onset-proxy-below-gate",
        "humanReferenceManifestSHA256": sha(private_path(manifest).read_bytes()),
        "singerCount": 1,
        "sourceBlindedBeforeReferenceComparison": True,
        "inferenceInputContract": "PCM only; label times/score/text excluded",
        "calibrationTrack": dev[0]["id"],
        "witnessTrack": witness[0]["id"],
        "speakerDisjointWitness": False,
        "sameSingerTrackDisjoint": True,
        "configuration": {
            "thresholdRMS": threshold, "minimumQuietMs": 60,
            "minimumVoicedMs": 30, "toleranceMs": 120,
        },
        "development": winner["metrics"],
        "witness": final_metrics,
        "humanTimedPhoneticReference": True,
        "automaticPhoneIdentityRecognition": "NOT_IMPLEMENTED",
        "humanSungPhonemeRecognition": "NOT_QUALIFIED",
        "publicMedia": "not-admitted",
    }


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--reference", required=True)
    parser.add_argument("--report", default="/tmp/ear-real-sung-onset-report.json")
    args = parser.parse_args()
    result = evaluation(args.reference)
    report_path = private_path(args.report)
    report_path.write_text(json.dumps(result, indent=2, sort_keys=True)+"\n")
    print(json.dumps(result, indent=2, sort_keys=True))


if __name__ == "__main__":
    main()
