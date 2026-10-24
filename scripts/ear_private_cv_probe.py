#!/usr/bin/env python3
"""Research-only, source-blind CV acoustic probe (NOT general phoneme ASR).

Reference: disjoint system-TTS voices, NEVER Sing-generated audio.
Inference: PCM only (no target lyrics or MIDI score). Classes: tiny nine-CV
inventory; labels are intended utterances, NOT human-verified IPA.
An independently calibrated confidence threshold governs ABSTENTION.
Results must not be called verified phoneme recognition or intelligibility.
"""
from __future__ import annotations

import argparse
import hashlib
import json
import math
import statistics
import struct
import wave
from pathlib import Path

from ear_private_envelope import SAMPLE_RATE, WINDOW_FRAMES, HANN, transform


def read_wave(filename: str, expected_sha: str | None = None) -> tuple[list[float], str]:
    path = Path(filename).expanduser().resolve()
    if not str(path).startswith("/private/tmp/") or path.suffix.lower() != ".wav":
        raise ValueError("Ear CV probe accepts only /tmp private WAV")
    raw = path.read_bytes()
    if len(raw) < 44 or len(raw) > 20_000_000:
        raise ValueError("bounded audio size violated")
    digest = hashlib.sha256(raw).hexdigest()
    if expected_sha is not None and digest != expected_sha:
        raise ValueError("source WAV SHA256 mismatch")
    with wave.open(str(path), "rb") as source:
        if (source.getframerate(), source.getnchannels(),
            source.getsampwidth(), source.getcomptype()) != (SAMPLE_RATE, 1, 2, "NONE"):
            raise ValueError("expected mono PCM16 48 kHz")
        frames = source.readframes(source.getnframes())
    audio = struct.unpack("<" + "h" * (len(frames) // 2), frames)
    return [s / 32768 for s in audio], digest


def region(samples: list[float]) -> tuple[int, int] | None:
    """Independent 10-ms RMS activity gate; no score or text as input."""
    hop = 480
    levels = []
    for offset in range(0, len(samples), hop):
        v = samples[offset:offset + hop]
        if v:
            levels.append(math.sqrt(sum(x * x for x in v) / len(v)))
    if not levels or max(levels) < .004:
        return None
    threshold = max(.003, max(levels) * .065)
    active = [i for i, x in enumerate(levels) if x > threshold]
    if not active:
        return None
    start = max(0, active[0] * hop - 480)
    end = min(len(samples), (active[-1] + 1) * hop + 480)
    if end - start < SAMPLE_RATE // 12:
        return None
    return start, end


def spectrum(audio: list[float], center: int) -> tuple[list[float], float, float]:
    left = max(0, min(len(audio) - WINDOW_FRAMES, center - WINDOW_FRAMES // 2))
    frame = audio[left:left + WINDOW_FRAMES]
    if len(frame) != WINDOW_FRAMES:
        raise ValueError("PCM shorter than analysis window")
    dc = sum(frame) / WINDOW_FRAMES
    centered = [v - dc for v in frame]
    rms = math.sqrt(sum(v * v for v in centered) / len(centered))
    zcr = sum(1 for a, b in zip(centered, centered[1:]) if a * b < 0) / WINDOW_FRAMES
    bins = transform([(x * HANN[i]) for i, x in enumerate(centered)])
    magnitudes = [abs(x) for x in bins[:WINDOW_FRAMES // 2]]
    # Low-resolution mel-like log bands to reduce pitch/harmonic sensitivity.
    centers = (210, 350, 500, 700, 950, 1250, 1600, 2050, 2600, 3300, 4100)
    bands = []
    for frequency in centers:
        width = max(140, frequency * .24)
        lo = max(2, int((frequency - 2 * width) * WINDOW_FRAMES / SAMPLE_RATE))
        hi = min(len(magnitudes) - 1, int((frequency + 2 * width) * WINDOW_FRAMES / SAMPLE_RATE))
        total = 0.0
        weight_sum = 0.0
        for i in range(lo, hi + 1):
            hz = i * SAMPLE_RATE / WINDOW_FRAMES
            w = math.exp(-.5 * ((hz - frequency) / width) ** 2)
            total += w * magnitudes[i]
            weight_sum += w
        bands.append(math.log(max(total / max(1e-6, weight_sum), 1e-5)))
    mean = statistics.mean(bands)
    return [x - mean for x in bands], rms, zcr


def extract(audio: list[float]) -> list[float] | None:
    bounds = region(audio)
    if bounds is None:
        return None
    start, end = bounds
    if end - start < WINDOW_FRAMES:
        return None
    # Input onset matters most; vowel is sampled later but BEFORE using score.
    # Fixed wall-clock early positions can sample a *long sustained sung syllable*
    # without needing its intended note/syllable label.
    timestamps = (.04, .075, .125, .195, .295)
    profiles = []
    for seconds in timestamps:
        middle = start + int(seconds * SAMPLE_RATE)
        middle = min(middle, end - WINDOW_FRAMES // 2)
        middle = max(start + WINDOW_FRAMES // 2, middle)
        shape, level, crossings = spectrum(audio, middle)
        profiles.append((shape, level, crossings))
    vowel = profiles[-1][0]
    output = []
    for index, (shape, level, zcr) in enumerate(profiles):
        weight = (1.2, 1.35, 1.1, 1.0, 1.0)[index]
        output.extend(weight * v for v in shape)
    for index in (0, 1, 2):
        # Consonant-to-vowel spectral transitions are explicit features.
        output.extend(.9 * (x - y) for x, y in zip(profiles[index][0], vowel))
    high_level = max(p[1] for p in profiles)
    for _, level, zcr in profiles:
        output.extend((3.0 * math.log(max(.005, level) / max(.005, high_level)),
                       6.0 * zcr))
    return output


def distance(a: list[float], b: list[float]) -> float:
    if len(a) != len(b):
        raise ValueError("feature dimensions differ")
    return math.sqrt(sum((x - y) ** 2 for x, y in zip(a, b)) / len(a))


def create_templates(manifest: dict) -> tuple[dict[str, list[list[float]]], list[dict]]:
    if manifest.get("schema") != "ear.private-phonetic-cv.v1" or manifest.get("mediaRelease") != "not-admitted":
        raise ValueError("unrecognized reference manifest")
    reference = {}
    records = []
    for entry in manifest["recordings"]:
        if entry["partition"] != "train":
            continue
        audio, digest = read_wave(entry["path"], entry["wavSHA256"])
        features = extract(audio)
        if features is None:
            raise ValueError("training speech unexpectedly silent: " + entry["id"])
        reference.setdefault(entry["target"], []).append(features)
        records.append({"id": entry["id"], "sha256": digest, "class": entry["target"]})
    if len(reference) != 9 or any(len(v) != 4 for v in reference.values()):
        raise ValueError("required nine classes x four independent reference voices")
    return reference, records


def scores(feature: list[float], templates: dict[str, list[list[float]]]) -> dict[str, float]:
    # Mean of the two best matching DIFFERENT reference speakers avoids
    # a one-template nearest-neighbor claim of confidence.
    return {k: statistics.mean(sorted(distance(feature, prototype)
                                      for prototype in group)[:2])
            for k, group in templates.items()}


def decide(ranked: list[tuple[str, float]] | None,
           max_distance: float, min_margin: float) -> dict:
    if ranked is None:
        return {"hypothesis": "unknown", "reason": "no-isolated-voiced-region",
                "bestDistance": None, "distanceMargin": None}
    label, closest = ranked[0]
    second = ranked[1][1]
    margin = second - closest
    accepted = closest <= max_distance and margin >= min_margin
    return {"hypothesis": label if accepted else "unknown",
            "rawBest": label, "bestDistance": round(closest, 5),
            "distanceMargin": round(margin, 5),
            "reason": "bounded-acoustic-match" if accepted else "abstained-uncertain",
            "confidence": "NOT_CALIBRATED_PROBABILITY",
            "isPhonemeVerified": False}


def infer(samples: list[float], templates: dict[str, list[list[float]]],
          max_distance: float, min_margin: float) -> dict:
    """Critically NO labels, score, syllable ids, speaker or target in inputs."""
    features = extract(samples)
    ranked = (sorted(scores(features, templates).items(), key=lambda item: item[1])
              if features is not None else None)
    return decide(ranked, max_distance, min_margin)


def cache_partition(manifest: dict, partition_id: str, templates: dict) -> dict:
    cached = {}
    for entry in manifest["recordings"]:
        if entry["partition"] != partition_id:
            continue
        audio, digest = read_wave(entry["path"], entry["wavSHA256"])
        features = extract(audio)
        ranked = (sorted(scores(features, templates).items(), key=lambda item: item[1])
                  if features is not None else None)
        cached[entry["id"]] = (digest, ranked)
    return cached


def partition(manifest: dict, partition_id: str, templates: dict,
              max_distance: float, min_margin: float, cached=None) -> list[dict]:
    results = []
    for entry in manifest["recordings"]:
        if entry["partition"] != partition_id:
            continue
        if cached is not None:
            digest, ranked = cached[entry["id"]]
            result = decide(ranked, max_distance, min_margin)
        else:
            audio, digest = read_wave(entry["path"], entry["wavSHA256"])
            result = infer(audio, templates, max_distance, min_margin)
        results.append({
            "sourceId": entry["id"], "sourceSHA256": digest,
            "speaker": entry["speaker"], "targetIntent": entry["target"],
            "inference": result, "correct": result["hypothesis"] == entry["target"],
        })
    return results


def metrics(results: list[dict]) -> dict:
    positive = [r for r in results if r["targetIntent"] != "unknown"]
    negative = [r for r in results if r["targetIntent"] == "unknown"]
    unknown = sum(x["inference"]["hypothesis"] == "unknown" for x in positive)
    exact = sum(x["correct"] for x in positive)
    negatives = sum(x["correct"] for x in negative)
    return {
        "positiveCount": len(positive), "negativeCount": len(negative),
        "correctPositive": exact,
        "positiveRecall": round(exact / len(positive), 4) if positive else None,
        "falseNegativeOrAbstention": len(positive) - exact,
        "positiveAbstention": unknown,
        "negativesRejected": negatives,
        "negativeRejectionRate": round(negatives / len(negative), 4) if negative else None,
        "falsePositiveUnknowns": len(negative) - negatives
    }


def calibrate(manifest: dict, templates: dict) -> tuple[float, float, list[dict], dict]:
    # Tune exclusively on calibration voices. Witness/Sing sources excluded.
    # Require perfect negative rejection in this small calibration set.
    best = None
    cached = cache_partition(manifest, "calibration", templates)
    for max_distance in (.35, .45, .55, .65, .75, .9, 1.05, 1.2, 1.5, 1.9):
        for margin in (.025, .05, .075, .1, .15, .2, .3):
            result = partition(manifest, "calibration", templates, max_distance, margin, cached=cached)
            m = metrics(result)
            if m["falsePositiveUnknowns"] != 0:
                continue
            candidate = (m["correctPositive"], -m["falseNegativeOrAbstention"],
                         -max_distance, margin)
            if best is None or candidate > best[0]:
                best = (candidate, max_distance, margin, result, m)
    if best is None:
        # Conservatively fail CLOSED; no accepted guesses if calibration
        # cannot demonstrate rejection of independently unseen CV negatives.
        result = partition(manifest, "calibration", templates, .0, 1e9, cached=cached)
        return .0, 1e9, result, metrics(result)
    return best[1], best[2], best[3], best[4]


def evaluate(manifest_path: str) -> dict:
    path = Path(manifest_path).expanduser().resolve()
    if not str(path).startswith("/private/tmp/"):
        raise ValueError("only private CV manifests")
    raw = path.read_bytes()
    manifest = json.loads(raw)
    training, identities = create_templates(manifest)
    max_distance, min_margin, calibration, calibration_m = calibrate(manifest, training)
    witness = partition(manifest, "witness", training, max_distance, min_margin)
    witness_m = metrics(witness)
    # Held-out synthetic witness is only advisory; real phoneme qualification
    # requires independent human-labelled examples, not available here.
    qualified = (calibration_m["positiveRecall"] is not None and
                 calibration_m["positiveRecall"] >= .8 and
                 calibration_m["negativeRejectionRate"] == 1 and
                 witness_m["positiveRecall"] >= .8 and
                 witness_m["negativeRejectionRate"] == 1)
    return {
        "schema": "ear.private-bounded-cv-probe.v1",
        "status": "synthetic-probe-qualified" if qualified else "synthetic-probe-not-qualified",
        "trainingSources": identities,
        "referenceManifestSHA256": hashlib.sha256(raw).hexdigest(),
        "sourceType": manifest["source"],
        "inventory": sorted(training),
        "scoreInjectedIntoRecognizer": False,
        "calibration": {"maxDistance": max_distance, "minimumMargin": min_margin,
                        "metrics": calibration_m, "observations": calibration},
        "heldOutWitness": {"metrics": witness_m, "observations": witness},
        "humanVerifiedPhonemeRecognition": False,
        "phonemeSequenceRecognition": "NOT_QUALIFIED",
        "voiceIdentity": "not-measured",
        "mediaRelease": "not-admitted",
    }


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--reference", required=True)
    parser.add_argument("--candidate", action="append", default=[])
    parser.add_argument("--report", default="/tmp/ear-bounded-cv-report.json")
    args = parser.parse_args()
    report = evaluate(args.reference)
    raw = json.loads(Path(args.reference).read_text())
    templates, _ = create_templates(raw)
    params = report["calibration"]
    report["privateCandidates"] = []
    for name in args.candidate:
        audio, digest = read_wave(name)
        report["privateCandidates"].append({
            "source": Path(name).name, "sha256": digest,
            "inference": infer(audio, templates,
                               params["maxDistance"], params["minimumMargin"]),
        })
    output = Path(args.report).expanduser().resolve()
    if not str(output).startswith("/private/tmp/"):
        parser.error("report must stay in /tmp")
    output.write_text(json.dumps(report, indent=2, sort_keys=True) + "\n")
    print(json.dumps({
        "status": report["status"],
        "calibrationMetrics": report["calibration"]["metrics"],
        "heldOutMetrics": report["heldOutWitness"]["metrics"],
        "candidateHypotheses": report["privateCandidates"],
        "report": str(output),
        "mediaPublished": False}, indent=2))


if __name__ == "__main__":
    main()
