#!/usr/bin/env python3
"""Ear: independent, SOURCE-BLIND, locally executable English phone decoder.

PocketSphinx allphone search consumes PCM only. No forced alignment, score,
lyrics, reference phone labels or timing enter decoding. After ALL inference
finishes, a separately owned evaluator compares against human-sung HTK
reference labels. Model and input SHA receipts are recorded privately.

Research only. A decoded phone is a raw hypothesis, NOT calibrated confidence
or evidence that a person recognized sung words. False positives/abstention
are explicit and qualification remains BLOCKED without singer-disjoint,
human-reviewed phone references and calibrated confidence.
"""
from __future__ import annotations

import argparse
import collections
import hashlib
import importlib.metadata
import json
import pathlib
import subprocess
import sys
import tempfile
import wave

import pocketsphinx

from ear_private_sung_alignment import (
    EXPECTED_SHA256, REFERENCE, TICKS_PER_SECOND, parse_lab, private_path,
)

PACKAGE_VERSION = "5.1.1"
PHONE_LM_SHA256 = "c57e0fa4191b096b1279cfe3a77927f52568fdecfc6624ddb5cec9527c763a54"
EXPECTED_ACOUSTIC_SHA256 = {
    "README": "8b88de980568509c646d0527b8414beef136964391903b40996d32f737bf752e",
    "feat.params": "c982c5f75e2a30c34d2c9ef1f6b129a5a00e67e3e927565076b58664cc2404c9",
    "mdef": "2360f9a86889c1cfee8bd618a0269387911e5fb2920a594f506b18b8c79683b0",
    "means": "832019e32cac12eb318964f96f469034acb12d0348eeddc3831831a100cb4dd4",
    "noisedict": "7295b07df2c204c4f87c6782b6be1a3859d7006d4e3864181c955d6dab105a33",
    "sendump": "8c9564c0d5bef69ca9d9bf1014abe162f071644cf02cf1fa8a483c3dc165a7a8",
    "transition_matrices": "c1f7f28ea43177be734be1f88bd7f1b9a853d0e660f8599c67c6eaeca8bb539a",
    "variances": "b00d696f85e96834fc10f8e5f06428d8c4db6bffdbe5845b6f69bf6efbc48fa5",
}
SRC_RATE = 16000
NOISE_SYMBOLS = frozenset(("SIL", "+SPN+", "<SIL>", "<UNK>", "SP"))
REFERENCE_NONPHONES = frozenset(("SP", "AP", "EP", "GS", "VF"))
# These are deliberately approximate, exposed separately from STRICT error.
# A tapped DX is not universally D; schwa AX not universally AH.
APPROXIMATE_PHONES = {"AX": "AH", "DX": "D", "EN": "N"}
MAX_SOURCE_BYTES = 12_000_000
MAX_DURATION = 70


def digest(data: bytes) -> str:
    return hashlib.sha256(data).hexdigest()


def model_metadata() -> tuple[pathlib.Path, pathlib.Path, dict]:
    observed_version = importlib.metadata.version("pocketsphinx")
    if observed_version != PACKAGE_VERSION:
        raise ValueError("Different phoneme decoder package version: " + observed_version)
    model = pathlib.Path(pocketsphinx.get_model_path()) / "en-us"
    acoustic = model / "en-us"
    phone_lm = model / "en-us-phone.lm.bin"
    if digest(phone_lm.read_bytes()) != PHONE_LM_SHA256:
        raise ValueError("Phoneme language model digest changed")
    files = sorted(p for p in acoustic.iterdir() if p.is_file())
    if not files:
        raise ValueError("Missing external acoustic model")
    manifest = {p.name: digest(p.read_bytes()) for p in files}
    if manifest != EXPECTED_ACOUSTIC_SHA256:
        raise ValueError("Pinned acoustic model file content changed")
    return acoustic, phone_lm, {
        "decoder": "PocketSphinx (third-party, independent of Sing)",
        "version": observed_version,
        "phonemeLanguageModelSHA256": PHONE_LM_SHA256,
        "acousticModelFileSHA256": manifest,
        "search": "allphone; no supplied text, dictionary, expected phones, or score",
        "sampleRate": SRC_RATE,
        "frameMilliseconds": 10,
        "confidence": "NOT_CALIBRATED",
    }


def private_audio(path: str) -> tuple[pathlib.Path, bytes, float]:
    actual = private_path(path)
    if actual.suffix.lower() != ".wav" or not actual.is_file():
        raise ValueError("Ear allphone accepts WAV source under /tmp only")
    if not actual.is_relative_to(pathlib.Path("/private/tmp")):
        raise ValueError("Private WAV location not allowed")
    raw = actual.read_bytes()
    if not 44 <= len(raw) <= MAX_SOURCE_BYTES:
        raise ValueError("Audio outside bounded size")
    with wave.open(str(actual), "rb") as wav:
        if (wav.getnchannels(), wav.getsampwidth(), wav.getcomptype()) != (1, 2, "NONE"):
            raise ValueError("Only uncompressed mono PCM16")
        duration = wav.getnframes() / wav.getframerate()
        if wav.getframerate() < 8000 or wav.getframerate() > 96000 or not 0 < duration <= MAX_DURATION:
            raise ValueError("Invalid audio duration / sample rate")
    return actual, raw, duration


def decode_wav(source: str, decoder: pocketsphinx.Decoder) -> dict:
    """The decoder sees audio ONLY. Do not add a target/labels parameter."""
    audio_path, raw, duration = private_audio(source)
    with tempfile.TemporaryDirectory(dir="/tmp", prefix="ear-allphone-resample-") as folder:
        converted = pathlib.Path(folder) / "pcm16-16k.wav"
        subprocess.run([
            "/usr/bin/afconvert", "-f", "WAVE", "-d", "LEI16@16000",
            "-c", "1", str(audio_path), str(converted),
        ], check=True, capture_output=True, timeout=30)
        with wave.open(str(converted), "rb") as wav:
            if (wav.getnchannels(), wav.getsampwidth(), wav.getframerate()) != (1, 2, SRC_RATE):
                raise ValueError("Resample not reproducible as 16 kHz PCM16")
            pcm = wav.readframes(wav.getnframes())
        decoded_audio_sha = digest(pcm)
        decoder.start_utt()
        for start in range(0, len(pcm), SRC_RATE * 2):
            decoder.process_raw(pcm[start:start + SRC_RATE * 2], no_search=False, full_utt=False)
        decoder.end_utt()
        results = []
        prior = -1
        for chunk in decoder.seg():
            start_frame = int(chunk.start_frame)
            end_frame = int(chunk.end_frame)
            if start_frame < 0 or end_frame < start_frame or start_frame < prior:
                raise ValueError("Decoder produced invalid/nonmonotonic phone timestamps")
            prior = start_frame
            results.append({
                "symbol": str(chunk.word),
                "startMs": start_frame * 10,
                "endMs": (end_frame + 1) * 10,
                # Segment.prob frequently reports 1.0: intentionally NOT
                # interpreted or exported as probability/confidence.
            })
    phones = [s for s in results if s["symbol"].upper() not in NOISE_SYMBOLS]
    return {
        "sourceId": audio_path.name,
        "originalAudioSHA256": digest(raw),
        "resampledPCM16SHA256": decoded_audio_sha,
        "sourceDurationSeconds": round(duration, 4),
        "segments": results,
        "rawPhonemeHypotheses": len(phones),
        "nonspeechTokens": len(results) - len(phones),
        "groundTruthSuppliedDuringInference": False,
        "referenceLyricsSuppliedDuringInference": False,
        "hasCalibratedConfidence": False,
    }


def error_counts(truth: list[str], predicted: list[str]) -> dict:
    """Deterministic Levenshtein operations. Labels are used ONLY here."""
    n, m = len(truth), len(predicted)
    dp = [[0] * (m + 1) for _ in range(n + 1)]
    for i in range(n + 1):
        dp[i][0] = i
    for j in range(m + 1):
        dp[0][j] = j
    for i in range(1, n + 1):
        for j in range(1, m + 1):
            dp[i][j] = min(
                dp[i-1][j] + 1,
                dp[i][j-1] + 1,
                dp[i-1][j-1] + int(truth[i-1] != predicted[j-1]))
    i, j = n, m
    subs = ins = dels = matches = 0
    while i or j:
        if i and j and truth[i-1] == predicted[j-1] and dp[i][j] == dp[i-1][j-1]:
            matches += 1
            i -= 1
            j -= 1
        elif i and j and dp[i][j] == dp[i-1][j-1] + 1:
            subs += 1
            i -= 1
            j -= 1
        elif i and dp[i][j] == dp[i-1][j] + 1:
            dels += 1
            i -= 1
        elif j:
            ins += 1
            j -= 1
        else:
            raise AssertionError("Broken phone edit backtrace")
    assert subs + ins + dels == dp[n][m]
    return {
        "referencePhonemes": n,
        "recognizedPhonemes": m,
        "exactMatchesInBestEditPath": matches,
        "substitutions": subs,
        "deletions": dels,
        "insertions": ins,
        "edits": dp[n][m],
        "phoneErrorRate": round(dp[n][m] / n, 4) if n else None,
        "metric": "sequence-based phone edit distance; NOT speaker-disjoint",
    }


def reference_phones(label_file: str, expected_sha: str) -> tuple[list[str], dict]:
    # Only called after ALL decoder source processing has returned.
    lab = private_path(label_file)
    if digest(lab.read_bytes()) != expected_sha:
        raise ValueError("Phoneme label SHA drift")
    entries = parse_lab(lab.read_text())
    refs = [v["phone"].upper() for v in entries
            if v["phone"].upper() not in REFERENCE_NONPHONES]
    approximated = collections.Counter(p for p in refs if p in APPROXIMATE_PHONES)
    other_unmodeled = collections.Counter(
        p for p in refs if p.startswith("_") or p in ("MM", "CL", "HX", "MLEM", "AXH"))
    return refs, {
        "originalIntervals": len(entries),
        "omittedBreathAndSilence": len(entries)-len(refs),
        "explicitApproximationCounts": dict(approximated),
        "potentiallyUnmodeledPhoneCounts": dict(other_unmodeled),
        "referenceTimeBase": "HTK-100ns",
    }


def compare_to_human(reference_path: str, predictions: list[dict]) -> dict:
    # A raw prediction is already frozen at this point. Only evaluation
    # receives published human-curated labels.
    manifest = json.loads(private_path(reference_path).read_text())
    if (manifest.get("schema") != "ear.private-human-sung-alignment.v1"
            or manifest.get("speakerDisjointEvaluationAvailable") is not False
            or manifest.get("publicVoiceModelAuthorized") is not False
            or manifest.get("sourceSingerCount") != 1
            or manifest.get("labelUse") != "evaluation-after-inference-only"
            or manifest.get("publicMedia") != "not-admitted"):
        raise ValueError("Human-singing reference rights and source not verified")
    rows = []
    for item in manifest["records"]:
        match = [p for p in predictions if p["originalAudioSHA256"] == item["audioSHA256"]]
        if len(match) != 1:
            raise ValueError("Human sung evaluation audio identity ambiguous")
        if item["labelSHA256"] != EXPECTED_SHA256[item["id"]]["lab"]:
            raise ValueError("Human timed reference label hash unexpected")
        ref, metadata = reference_phones(item["labelPath"], item["labelSHA256"])
        pred = [
            v["symbol"].upper() for v in match[0]["segments"]
            if v["symbol"].upper() not in NOISE_SYMBOLS
        ]
        mapped = [APPROXIMATE_PHONES.get(p, p) for p in ref]
        rows.append({
            "source": item["id"],
            "sourceSHA256": item["audioSHA256"],
            "referenceMetadata": metadata,
            "strict": error_counts(ref, pred),
            "approximateMapping": error_counts(mapped, pred),
            "noScoreOrLabelsDuringInference": True,
        })
    return {
        "source": manifest["sourceURL"],
        "sourceSingerCount": 1,
        "speakerDisjointReference": False,
        "publishedPhoneLabelsIndependentlyReaudited": False,
        "evaluation": rows,
        "recognizerAccuracyQualified": False,
    }


def evaluate(source_files: list[str], negative_files: list[str],
             human_reference: str | None) -> dict:
    if len(source_files) > 8 or len(negative_files) > 8:
        raise ValueError("Bounded private audio inputs only")
    paths = source_files + negative_files
    if not paths or len(set(pathlib.Path(p).resolve() for p in paths)) != len(paths):
        raise ValueError("One or more duplicate WAV sources")
    acoustic, lm, model_receipt = model_metadata()
    # No expected lyrics, forced align text, allowed candidate list or score.
    # CRITICAL: make a fresh acoustic-model decoder for EACH WAV. Reusing a
    # decoder retains adaptation state across utterances and changes the
    # result based on file order, violating Ear's independent source witness.
    predictions = []
    for source in paths:
        decoder = pocketsphinx.Decoder(
            hmm=str(acoustic), allphone=str(lm), lm=None, dict=None,
            samprate=SRC_RATE, loglevel="ERROR",
        )
        predictions.append(decode_wav(source, decoder))
    neg_ids = {pathlib.Path(p).resolve().name for p in negative_files}
    negatives = [
        {
            "source": p["sourceId"], "sourceSHA256": p["originalAudioSHA256"],
            "phonemeFalsePositives": p["rawPhonemeHypotheses"],
            "silenceOrNoiseAbstained": p["rawPhonemeHypotheses"] == 0,
        }
        for p in predictions if p["sourceId"] in neg_ids
    ]
    # No reference labels are read until ALL inference is complete.
    human = compare_to_human(human_reference, predictions) if human_reference else None
    return {
        "schema": "ear.private-source-blind-allphone.v1",
        "status": "raw-phone-hypotheses-unqualified",
        "model": model_receipt,
        "predictions": predictions,
        "negativeControls": negatives,
        "negativeFalsePositiveCount": sum(x["phonemeFalsePositives"] for x in negatives),
        "humanSungReference": human,
        "recognizerPhonemesAreRawHypotheses": True,
        "confidenceCalibrated": False,
        "independentSingerHeldOut": False,
        "humanIntelligibility": "NOT_MEASURED",
        "phonemeRecognitionQualified": False,
        "singBaselineChanged": False,
        "modelTrainedOrTunedOnReference": False,
        "mediaPublished": False,
    }


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--candidate", action="append", default=[])
    parser.add_argument("--negative", action="append", default=[])
    parser.add_argument("--human-sung-reference")
    parser.add_argument("--report", default="/tmp/ear-source-blind-allphone.json")
    args = parser.parse_args()
    report = evaluate(args.candidate, args.negative, args.human_sung_reference)
    result_path = private_path(args.report)
    result_path.write_text(json.dumps(report, indent=2, sort_keys=True) + "\n")
    print(json.dumps({
        "status": report["status"],
        "phoneModel": report["model"]["decoder"] + " " + report["model"]["version"],
        "candidatePhonemes": [
            {"source": p["sourceId"], "decoded": p["rawPhonemeHypotheses"]}
            for p in report["predictions"]
        ],
        "negativeControlFalsePhones": report["negativeFalsePositiveCount"],
        "realHumanSingingEvaluation": (
            report["humanSungReference"]["evaluation"]
            if report["humanSungReference"] else None
        ),
        "phonemeRecognitionQualified": False,
        "report": str(result_path),
        "mediaPublished": False,
    }, indent=2))


if __name__ == "__main__":
    main()
