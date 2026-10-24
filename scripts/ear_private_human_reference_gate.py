#!/usr/bin/env python3
"""Independent human-rated corpus evidence and audio-only lexical ASR witness.

The five human experts scored canonical phoneme *pronunciation goodness*, not
manual start/end phone boundaries. Apple word ASR is not phoneme recognition.
No target transcript/phone labels are supplied during ASR. Afterwards, an
explicit post-inference lexical comparison is computed, source hashes checked,
and any phone recognizer claim is BLOCKED until an independently validated
phone-time recognizer exists.

Audio/labels/transcript receipt remain /tmp, never copied to instrument packs.
"""
from __future__ import annotations

import argparse
import hashlib
import json
import re
import statistics
import wave
from pathlib import Path


def private_file(location: str) -> Path:
    file = Path(location).expanduser().resolve()
    if not str(file).startswith("/private/tmp/") or not file.is_file():
        raise ValueError("Human reference must exist privately in /tmp")
    return file


def normalize_words(text: str) -> list[str]:
    return re.findall(r"[a-z0-9]+", text.casefold().replace("’", "'"))


def edit_distance(a: list[str], b: list[str]) -> int:
    prev = list(range(len(b) + 1))
    for i, item in enumerate(a, start=1):
        row = [i]
        for j, other in enumerate(b, start=1):
            row.append(min(prev[j] + 1, row[j-1] + 1,
                           prev[j-1] + int(item != other)))
        prev = row
    return prev[-1]


def validated_reference(manifest_path: str) -> dict:
    manifest = json.loads(private_file(manifest_path).read_text())
    if (manifest.get("schema") != "ear.human-rated-pronunciation-reference.v1"
            or manifest.get("license") !=
            "CC BY 4.0 original corpus; citation and attribution required"
            or not manifest.get("splitsDisjointBySpeaker")
            or not manifest.get("admittedAsHumanRatedSpeechEvidence")
            or manifest.get("admittedAsAnnotatedSingingReference")
            or manifest.get("voiceCloningAuthorized") is not False
            or manifest.get("mediaRelease") != "not-admitted"):
        raise ValueError("Not an admitted, rights-scoped human reference")
    rows = manifest.get("records", [])
    variant = manifest.get("sourceVariant", "standard")
    if variant == "standard":
        expected = 12
    elif (variant == "independent-pronunciation-challenge" and
          manifest.get("selectionCriterion") ==
          "expertPhoneScoreBelow1.5OrAnnotatedMispronunciation"):
        expected = 4
    else:
        raise ValueError("Unknown human pronunciation reference variant")
    if len(rows) != expected:
        raise ValueError("Incorrect count in locked human reference pack")
    speakers = {"train": set(), "test": set()}
    identities = set()
    for row in rows:
        split = row.get("partition")
        if split not in speakers:
            raise ValueError("Invalid source partition")
        speakers[split].add(row["speakerPseudonym"])
        if row["sourceId"] in identities:
            raise ValueError("Repeated corpus source ID")
        identities.add(row["sourceId"])
        path = private_file(row["file"])
        digest = hashlib.sha256(path.read_bytes()).hexdigest()
        if digest != row["audioSHA256"]:
            raise ValueError("Source audio checksum mismatch: " + row["sourceId"])
        with wave.open(str(path), "rb") as wav:
            duration = wav.getnframes() / wav.getframerate()
            if wav.getnchannels() != 1 or wav.getsampwidth() != 2:
                raise ValueError("Unsupported source audio channels/sample width")
            if duration < .25 or duration > 30:
                raise ValueError("Human utterance duration outside bounds")
        if row.get("phoneTemporalBoundaries") != "NOT_SUPPLIED":
            raise ValueError("Claimed phone timing not actually witnessed")
        if not isinstance(row.get("transcriptReference"), str):
            raise ValueError("Transcript reference is missing")
        count = 0
        for word in row["wordPhoneJudgments"]:
            phones = word["canonicalPhones"]
            ratings = word["expertPhoneAccuracyMean"]
            if len(phones) != len(ratings) or not phones:
                raise ValueError("Phone/score count mismatch")
            if any(not isinstance(phone, str) or not phone for phone in phones):
                raise ValueError("Malformed phone labels")
            if any(not isinstance(v, (int, float)) or not 0 <= v <= 2
                   for v in ratings):
                raise ValueError("Invalid human phone goodness score")
            count += len(phones)
        if count != row["canonicalPhonesTotal"]:
            raise ValueError("Unbalanced phonetic reference annotations")
        if variant == "independent-pronunciation-challenge":
            if (row.get("humanRatedLowAccuracyPhones", 0) < 2 or
                    row.get("annotatedPhoneSubstitutions", 0) < 1):
                raise ValueError("Human challenge missing annotated hard negatives")
    if len(speakers["train"]) != 2 or len(speakers["test"]) != 2:
        raise ValueError("Reference speakers not disjoint and balanced")
    if speakers["train"] & speakers["test"]:
        raise ValueError("Reference speaker used in both partitions")
    return manifest


def evaluate(manifest_path: str, asr_path: str) -> dict:
    source = validated_reference(manifest_path)
    receipt = json.loads(private_file(asr_path).read_text())
    if receipt.get("schema") != "ear.private-transcript.v1" or receipt.get("status") != "finished":
        raise ValueError("Independent ASR witness invalid")
    reference_rows = {Path(row["file"]).name: row for row in source["records"]}
    results = receipt.get("results", [])
    if len(results) != len(reference_rows):
        raise ValueError("Independent ASR did not observe every reference audio")
    measured = []
    seen = set()
    for result in results:
        name = result["sourceId"]
        if name in seen or name not in reference_rows:
            raise ValueError("Unexpected or repeated source in independent ASR")
        seen.add(name)
        ref = reference_rows[name]
        if (result["audioSHA256"] != ref["audioSHA256"]
                or result["publication"] != "not-admitted"
                or result["resultType"] != "independent-lexical-transcription"
                or result["phonemeRecognition"] != "NOT_IMPLEMENTED"):
            raise ValueError("Source SHA mismatch or phonetic ASR overclaim")
        target = normalize_words(ref["transcriptReference"])
        hypothesis = normalize_words(result["recognizedText"])
        if not target:
            raise ValueError("No reference text")
        incorrect = edit_distance(target, hypothesis)
        scores = [
            score for word in ref["wordPhoneJudgments"]
            for score in word["expertPhoneAccuracyMean"]
        ]
        measured.append({
            "sourceId": ref["sourceId"],
            "partition": ref["partition"],
            "sourceSHA256": ref["audioSHA256"],
            "referenceWordCount": len(target),
            "hypothesisWordCount": len(hypothesis),
            "wordEditDistance": incorrect,
            "wordErrorRate": round(incorrect / len(target), 5),
            "exactNormalizedWords": target == hypothesis,
            "humanRatedPhoneCount": len(scores),
            "meanHumanPhoneGoodness": round(statistics.mean(scores), 4),
            "phonemeSequenceRecognized": False,
            "phonemeTimingPresent": False,
        })
    aggregate = {}
    for group in ("train", "test"):
        selected = [r for r in measured if r["partition"] == group]
        total = sum(r["referenceWordCount"] for r in selected)
        errors = sum(r["wordEditDistance"] for r in selected)
        aggregate[group] = {
            "recordings": len(selected),
            "referenceWords": total,
            "wordEdits": errors,
            "wordErrorRate": round(errors / total, 5),
            "exactSentences": sum(r["exactNormalizedWords"] for r in selected),
            "humanPhoneRatings": sum(r["humanRatedPhoneCount"] for r in selected),
        }
    return {
        "schema": "ear.human-rated-speech-evaluation.v1",
        "status": "human-speech-reference-admitted-phoneme-recognizer-blocked",
        "source": source["source"], "license": source["license"],
        "sourceVariant": source.get("sourceVariant", "standard"),
        "sourceManifestSHA256": hashlib.sha256(private_file(manifest_path).read_bytes()).hexdigest(),
        "asrReceiptSHA256": hashlib.sha256(private_file(asr_path).read_bytes()).hexdigest(),
        "sourceBlindedAtInference": True,
        "speakerDisjoint": True,
        "results": measured,
        "aggregates": aggregate,
        "humanRatedPhoneGoodnessAvailable": True,
        "phoneBoundaryTimes": "NOT_SUPPLIED",
        "automaticPhonemeRecognition": "NOT_IMPLEMENTED",
        "referenceSingingAudio": "NOT_ADMITTED",
        "humanSungPhonemeRecognizer": "NOT_QUALIFIED",
        "voiceAssetReuse": "PROHIBITED_BY_THIS_EVIDENCE_SCOPE",
        "publicRelease": "not-admitted"
    }


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--reference", required=True)
    parser.add_argument("--asr", required=True)
    parser.add_argument("--report", default="/tmp/ear-human-reference-gate.json")
    args = parser.parse_args()
    report = evaluate(args.reference, args.asr)
    dest = Path(args.report).expanduser().resolve()
    if not str(dest).startswith("/private/tmp/"):
        parser.error("Private receipt must stay in /tmp")
    dest.write_text(json.dumps(report, indent=2, sort_keys=True) + "\n")
    print(json.dumps({
        "status": report["status"],
        "speakerDisjoint": report["speakerDisjoint"],
        "aggregates": report["aggregates"],
        "humanRatedPhoneGoodnessAvailable": True,
        "phonemeRecognition": report["automaticPhonemeRecognition"],
        "phonemeBoundaryTimes": report["phoneBoundaryTimes"],
        "report": str(dest),
        "mediaPublished": False,
    }, indent=2))


if __name__ == "__main__":
    main()
