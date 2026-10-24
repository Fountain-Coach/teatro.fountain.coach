#!/usr/bin/env python3
"""Ear-owned independent spectral-envelope PROXY on private source-bound WAVs.

This measures broad, gain-normalized vowel spectra against a spoken source.
It is NOT formant tracking, speaker verification, independent phoneme ASR,
naturalness assessment, an audio renderer, or a publication decision.
"""
from __future__ import annotations

import argparse
import cmath
import hashlib
import json
import math
import struct
import wave
from pathlib import Path

SAMPLE_RATE = 48000
WINDOW_FRAMES = 2048
HOP = 1024
CENTERS_HZ = tuple(250 + 130 * i for i in range(25))
HANN = tuple(.5 - .5 * math.cos(2 * math.pi * i / (WINDOW_FRAMES - 1))
             for i in range(WINDOW_FRAMES))


def read_private_wav(filename: str) -> tuple[list[float], str]:
    path = Path(filename).expanduser().resolve()
    if not str(path).startswith("/private/tmp/"):
        raise ValueError("Only private PCM /tmp sources may be analyzed")
    blob = path.read_bytes()
    if len(blob) < 44 or len(blob) > 20_000_000:
        raise ValueError("Invalid bounded WAV length")
    digest = hashlib.sha256(blob).hexdigest()
    with wave.open(str(path), "rb") as source:
        if (source.getframerate(), source.getnchannels(),
            source.getsampwidth(), source.getcomptype()) != (SAMPLE_RATE, 1, 2, "NONE"):
            raise ValueError("Expected 48kHz mono PCM16 audio")
        samples = source.readframes(source.getnframes())
    data = struct.unpack("<" + "h" * (len(samples) // 2), samples)
    return [float(s) / 32768 for s in data], digest


def transform(values: list[float]) -> list[complex]:
    """Tiny radix-2 FFT for reproducible offline evidence without downloads."""
    n = len(values)
    if n != WINDOW_FRAMES:
        raise ValueError("FFT window changed; refresh reference acceptance")
    bits = n.bit_length() - 1
    result = [0j] * n
    for index, value in enumerate(values):
        reverse = int(f"{index:0{bits}b}"[::-1], 2)
        result[reverse] = complex(value)
    stride = 2
    while stride <= n:
        twiddle = cmath.exp(-2j * math.pi / stride)
        for start in range(0, n, stride):
            weight = 1 + 0j
            for i in range(stride // 2):
                first = result[start + i]
                second = result[start + i + stride // 2] * weight
                result[start + i] = first + second
                result[start + i + stride // 2] = first - second
                weight *= twiddle
        stride *= 2
    return result


def envelope(signal: list[float], start_seconds: float,
             end_seconds: float) -> list[float]:
    start = int(start_seconds * SAMPLE_RATE)
    end = int(end_seconds * SAMPLE_RATE)
    if start < 0 or end > len(signal) or end - start < 2 * WINDOW_FRAMES:
        raise ValueError("Spectral analysis interval too short / outside source")
    magnitudes = [0.0] * (WINDOW_FRAMES // 2 + 1)
    count = 0
    for position in range(start, end - WINDOW_FRAMES + 1, HOP):
        frame = signal[position:position + WINDOW_FRAMES]
        mean = sum(frame) / WINDOW_FRAMES
        spectrum = transform([(v - mean) * HANN[i] for i, v in enumerate(frame)])
        for index in range(len(magnitudes)):
            magnitudes[index] += abs(spectrum[index])
        count += 1
    if count < 2:
        raise ValueError("Not enough spectral frames for vowel proxy")
    magnitudes = [v / count for v in magnitudes]
    # Broad ~170 Hz Gaussian smoothing suppresses dependence on individual
    # note harmonics. This is a *coarse* envelope, not LPC/formant estimation.
    values = []
    for center in CENTERS_HZ:
        energy = 0.0
        total_weight = 0.0
        for k in range(4, min(190, len(magnitudes))):
            frequency = k * SAMPLE_RATE / WINDOW_FRAMES
            weight = math.exp(-.5 * ((frequency - center) / 170) ** 2)
            if weight < .00001:
                continue
            energy += weight * magnitudes[k]
            total_weight += weight
        values.append(math.log10(energy / max(1e-10, total_weight) + .0001))
    mean = sum(values) / len(values)
    return [x - mean for x in values]


def similarity(a: list[float], b: list[float]) -> float:
    if len(a) != len(b) or not a:
        raise ValueError("Envelope vectors differ in length")
    aa = sum(x * x for x in a)
    bb = sum(x * x for x in b)
    if aa <= 1e-14 or bb <= 1e-14:
        raise ValueError("No analyzable spectrum")
    return sum(x * y for x, y in zip(a, b)) / math.sqrt(aa * bb)


def witness(score_path: str, manifest_path: str,
            spoken_path: str, procedural_path: str,
            sampled_path: str) -> dict:
    score = json.loads(Path(score_path).read_text())
    manifest = json.loads(Path(manifest_path).read_text())
    spoken, spoken_sha = read_private_wav(spoken_path)
    baseline, baseline_sha = read_private_wav(procedural_path)
    sampled, sampled_sha = read_private_wav(sampled_path)
    if manifest.get("sourceWavSHA256") != spoken_sha or manifest.get("sampleRate") != SAMPLE_RATE:
        raise ValueError("Spoken sample does not match the source manifest's immutable digest")
    if score.get("schema") != "sing.phrase.v1" or manifest.get("release") != "not-admitted":
        raise ValueError("Not an admitted bounded private source/score")
    source_by_id = {r["syllableId"]: r for r in manifest["regions"]}
    phonemes = {s["id"]: s["phonemes"][1]["symbol"] for s in score["phrase"]["syllables"]}
    if len(source_by_id) != len(phonemes):
        raise ValueError("Unmatched source syllables")
    refs = {}
    for sid, region in source_by_id.items():
        start = (region["vowelStartFrame"] + 30 * SAMPLE_RATE // 1000) / SAMPLE_RATE
        end = min(region["vowelEndFrame"],
                  region["vowelStartFrame"] + 180 * SAMPLE_RATE // 1000) / SAMPLE_RATE
        refs[sid] = envelope(spoken, start, end)
    observations = []
    for n in score["performance"]["notes"]:
        sid = n["syllableId"]
        on = n["onMs"]
        off = n["offMs"]
        center = (on + .42 * (off - on)) / 1000
        start, end = center - .09, center + .09
        performed = envelope(sampled, start, end)
        original = envelope(baseline, start, end)
        unrelated = [similarity(ref, performed) for other, ref in refs.items()
                     if phonemes[other] != phonemes[sid]]
        observations.append({
            "noteId": n["id"],
            "syllableId": sid,
            "sourceVowelSymbol": phonemes[sid],
            "expectedMIDINote": n["pitch"],
            "sampledToSource": round(similarity(refs[sid], performed), 4),
            "proceduralToSource": round(similarity(refs[sid], original), 4),
            "maxDifferentVowelToSampled": round(max(unrelated), 4)
            if unrelated else None,
            "analysisWindowSeconds": [round(start, 4), round(end, 4)],
        })
    return {
        "schema": "ear.private-vowel-envelope.v1",
        "status": "measured-proxy-only",
        "sourceSHA256": spoken_sha,
        "proceduralSHA256": baseline_sha,
        "speechDerivedSHA256": sampled_sha,
        "scoreSHA256": hashlib.sha256(Path(score_path).read_bytes()).hexdigest(),
        "manifestSHA256": hashlib.sha256(Path(manifest_path).read_bytes()).hexdigest(),
        "sampleRate": SAMPLE_RATE,
        "spectralWindows": "2048 frame Hann / 1024 hop / 170Hz smoothing / 25 bands",
        "noteObservations": observations,
        "vocalIdentityRecognized": False,
        "formantsMeasured": False,
        "phonemesRecognized": False,
        "perceptualNaturalness": "unverified",
        "publication": "not-admitted"
    }


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--score", required=True)
    parser.add_argument("--source-manifest", required=True)
    parser.add_argument("--spoken", required=True)
    parser.add_argument("--procedural", required=True)
    parser.add_argument("--speech-derived", required=True)
    args = parser.parse_args()
    report = witness(args.score, args.source_manifest, args.spoken,
                     args.procedural, args.speech_derived)
    print(json.dumps(report, indent=2, sort_keys=True))


if __name__ == "__main__":
    main()
