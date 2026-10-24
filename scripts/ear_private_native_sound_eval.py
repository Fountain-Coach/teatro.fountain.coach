#!/usr/bin/env python3
"""Ear: evaluate native Apple sound-event evidence AFTER inference, fail closed.

A separate Swift classifier has already processed waveform paths without
receiving any intended labels, lyrics, score or reference phones. This module
validates exact private source identities, source licenses and observed
vocal evidence only. It never upgrades vocal evidence to phoneme confidence,
intelligibility, or permission to distribute a cloned singing voice.
"""
from __future__ import annotations

import argparse
import hashlib
import json
from pathlib import Path


def private(path: str) -> Path:
    p = Path(path).expanduser().resolve()
    if not str(p).startswith("/private/tmp/") or not p.is_file():
        raise ValueError("Native sound evidence requires private /tmp file")
    return p


def sha(raw: bytes) -> str:
    return hashlib.sha256(raw).hexdigest()


def source(path: str, digest: str, role: str, family: str) -> dict:
    p = private(path)
    if sha(p.read_bytes()) != digest:
        raise ValueError("Native sound reference WAV SHA mismatch")
    return {"path": p, "sha256": digest, "role": role, "family": family}


def manifest(path: str, schema: str) -> dict:
    m = json.loads(private(path).read_text())
    if m.get("schema") != schema:
        raise ValueError("Unexpected private source manifest schema")
    return m


def expected_inputs(ordinary: str, challenge: str, sung: str, novel: str,
                    sing_spoken: str, sing_derived: str, old_noise: str,
                    old_chirp: str) -> tuple[list[dict], dict]:
    records = []
    for file, family, amount in (
        (ordinary, "human-rated-ordinary-speech", 12),
        (challenge, "human-rated-difficult-speech", 4),
    ):
        m = manifest(file, "ear.human-rated-pronunciation-reference.v1")
        if (m.get("admittedAsHumanRatedSpeechEvidence") is not True or
            m.get("voiceCloningAuthorized") is not False or
            m.get("admittedAsAnnotatedSingingReference") is not False or
            m.get("mediaRelease") != "not-admitted" or
            len(m["records"]) != amount):
            raise ValueError("Human-rated source rights or count changed")
        for row in m["records"]:
            records.append(source(row["file"], row["audioSHA256"],
                                  "candidate", family))
    s = manifest(sung, "ear.private-human-sung-alignment.v1")
    if (s.get("sourceSingerCount") != 1 or
        s.get("speakerDisjointEvaluationAvailable") is not False or
        s.get("publicVoiceModelAuthorized") is not False or
        s.get("publicMedia") != "not-admitted" or len(s["records"]) != 2):
        raise ValueError("Human-sung evidence falsely grants singer or publication rights")
    for row in s["records"]:
        records.append(source(row["audioPath"], row["audioSHA256"],
                              "candidate", "human-sung-one-singer"))
    for p, family in ((sing_spoken, "sing-spoken-reference"),
                      (sing_derived, "sing-derived-synthetic-candidate")):
        path = private(p)
        records.append(source(str(path), sha(path.read_bytes()), "candidate", family))
    negatives = manifest(novel, "ear.private-native-sound-novel-v1")
    if (negatives.get("generatedAfterNativeThresholdFrozen") is not True or
        negatives.get("negativeOnly") is not True or
        negatives.get("audioPublished") is not False or
        negatives.get("thresholds") != {
            "minimumWindowScore": .5,
            "minimumEvidenceWindowFraction": .5,
            "minimumWindows": 2
        } or len(negatives["records"]) != 9):
        raise ValueError("Novel non-speech witness is not frozen/complete")
    for row in negatives["records"]:
        if (row["role"] != "held-out-adversarial-nonspeech" or
                row["expectedHumanVoice"] is not False):
            raise ValueError("Non-speech source truth changed")
        records.append(source(row["path"], row["sha256"], "negative",
                              "novel-nonspeech"))
    for path, family in ((old_noise, "original-low-noise"),
                         (old_chirp, "previous-adversarial-chirp")):
        p = private(path)
        records.append(source(str(p), sha(p.read_bytes()), "negative", family))
    if len(records) != 31:
        raise ValueError("Native expected source count drifted")
    if len({r["sha256"] for r in records}) != len(records):
        raise ValueError("Duplicate source audio not independent")
    return records, negatives


def verify(native_report: str, ordinary: str, challenge: str, sung: str,
           novel: str, sing_spoken: str, sing_derived: str,
           old_noise: str, old_chirp: str, allphone_holdout: str | None = None) -> dict:
    native = json.loads(private(native_report).read_text())
    if (native.get("schema") != "ear.private-apple-sound-diagnostic.v1" or
        native.get("model") != "Apple SoundAnalysis SNClassifierIdentifier.version1" or
        native.get("minimumWindowScore") != .5 or
        native.get("minimumEvidenceWindowFraction") != .5 or
        native.get("minimumWindows") != 2 or
        native.get("thresholdFrozenBeforeNovelWitness") is not True or
        native.get("modelWeightsHashAvailable") is not False or
        native.get("classEvidenceIsNotPhonemeConfidence") is not True or
        native.get("noExpectedLyricsOrScoreAtInference") is not True or
        native.get("phonemeRecognitionQualified") is not False or
        native.get("mediaPublished") is not False or
        sorted(native.get("voiceLabels", [])) != ["humming", "singing", "speech"]):
        raise ValueError("Apple native evidence overclaim or classifier configuration drift")
    expected, _ = expected_inputs(
        ordinary, challenge, sung, novel, sing_spoken, sing_derived, old_noise, old_chirp)
    known = {item["sha256"]: item for item in expected}
    actual = {}
    for row in native.get("observations", []):
        sha_id = row.get("sha256")
        if not isinstance(sha_id, str) or sha_id not in known or sha_id in actual:
            raise ValueError("Missing, foreign or duplicated source SHA in sound witness")
        reference = known[sha_id]
        if row.get("expectedTestRole") != reference["role"] or row.get("source") != reference["path"].name:
            raise ValueError("Source role/path identity drift after native inference")
        if row.get("phoneSequenceRecognized") is not False or row.get("calibratedVocalProbability") is not False:
            raise ValueError("Sound activity cannot become a phone or a confidence")
        if not isinstance(row.get("windows"), int) or row["windows"] < 0:
            raise ValueError("Invalid sound analysis window count")
        voiced = row.get("vocalEvidenceWindows")
        if not isinstance(voiced, int) or not 0 <= voiced <= row["windows"]:
            raise ValueError("Invalid vocal window count")
        fraction = row.get("vocalEvidenceFraction")
        if not isinstance(fraction, (int, float)) or not 0 <= fraction <= 1:
            raise ValueError("Invalid vocal evidence fraction")
        if row["windows"] and abs(fraction - voiced / row["windows"]) > 1e-8:
            raise ValueError("Vocal fraction does not match frame count")
        derived_pass = row["windows"] >= 2 and fraction >= .5
        if row.get("voiceEvidencePass") is not derived_pass:
            raise ValueError("Native vocal evidence threshold calculation drift")
        actual[sha_id] = row
    if set(actual) != set(known):
        raise ValueError("Expected reference sources not all classified")
    positives = [
        (item, actual[item["sha256"]]) for item in expected if item["family"] in (
            "human-rated-ordinary-speech", "human-rated-difficult-speech",
            "human-sung-one-singer", "sing-spoken-reference")
    ]
    novel_negatives = [
        (item, actual[item["sha256"]]) for item in expected
        if item["family"] == "novel-nonspeech"
    ]
    prior_negatives = [
        (item, actual[item["sha256"]]) for item in expected if item["role"] == "negative"
    ]
    sing = next(actual[item["sha256"]] for item in expected
                if item["family"] == "sing-derived-synthetic-candidate")
    if len(positives) != 19 or len(novel_negatives) != 9 or len(prior_negatives) != 11:
        raise ValueError("Vocal evaluation cohort sizes drifted")
    retained = sum(row["voiceEvidencePass"] for _, row in positives)
    novel_false = sum(row["voiceEvidencePass"] for _, row in novel_negatives)
    all_false = sum(row["voiceEvidencePass"] for _, row in prior_negatives)
    old_chirp_sha = next(item["sha256"] for item in expected
                         if item["family"] == "previous-adversarial-chirp")
    old_chirp_voice = actual[old_chirp_sha]["voiceEvidencePass"]
    raw_chirp = None
    after_activity = None
    if allphone_holdout:
        phones = json.loads(private(allphone_holdout).read_text())
        if (phones.get("schema") != "ear.private-source-blind-allphone.v1" or
            phones.get("phonemeRecognitionQualified") is not False or
            phones.get("activityScreenIsPhonemeConfidence") is not False):
            raise ValueError("Untrusted independent phoneme evidence")
        hits = [x for x in phones.get("predictions", [])
                if x.get("originalAudioSHA256") == old_chirp_sha]
        if len(hits) != 1:
            raise ValueError("Allphone did not observe same chirp PCM")
        raw_chirp = hits[0]["rawPhonemeHypotheses"]
        after_activity = hits[0]["activityScreenedPhoneCandidates"]
    status = ("bounded-native-vocal-evidence-supported"
              if retained == 19 and novel_false == 0 else
              "native-vocal-evidence-not-qualified")
    return {
        "schema": "ear.private-native-sound-reference-verification.v1",
        "status": status,
        "sourceBlindWaveformInference": True,
        "appleModel": native["model"],
        "osBuild": native["macOSBuild"],
        "osSuppliedModelWeightsHash": False,
        "verifiedSources": len(actual),
        "knownHumanOrSpokenPositiveCount": len(positives),
        "knownVocalEvidenceRetained": retained,
        "novelNegativeCount": len(novel_negatives),
        "novelNegativeFalseVocalEvidence": novel_false,
        "allNegativeCount": len(prior_negatives),
        "allNegativeFalseVocalEvidence": all_false,
        "singDerivedSyntheticHasIndependentVocalEvidence": sing["voiceEvidencePass"],
        "singDerivedSyntheticVocalEvidenceFraction": sing["vocalEvidenceFraction"],
        "oldChirpRawAllphoneFalsePhones": raw_chirp,
        "oldChirpAfterWebRTCScreenFalsePhones": after_activity,
        "oldChirpAfterNativeVocalScreenCandidatePhones": (
            after_activity if old_chirp_voice else 0)
            if after_activity is not None else None,
        "phonemeIdentityRecognition": "NOT_QUALIFIED",
        "singingNaturalnessHumanRated": False,
        "humanIntelligibility": "NOT_TESTED",
        "independentSecondSinger": False,
        "voiceAssetsAuthorizedForTraining": False,
        "publicMedia": False,
    }


def main() -> None:
    parser = argparse.ArgumentParser()
    for arg in ("native-report","ordinary","challenge","sung","novel",
                "sing-spoken","sing-derived","old-noise","old-chirp"):
        parser.add_argument("--"+arg, required=True)
    parser.add_argument("--allphone-holdout")
    parser.add_argument("--report", default="/tmp/ear-native-sound-gate.json")
    a = parser.parse_args()
    result = verify(
        a.native_report, a.ordinary, a.challenge, a.sung, a.novel,
        a.sing_spoken, a.sing_derived, a.old_noise, a.old_chirp,
        a.allphone_holdout)
    output = private(a.report) if Path(a.report).exists() else Path(a.report).expanduser().resolve()
    if not str(output).startswith("/private/tmp/"):
        parser.error("Native vocal receipt must remain under /tmp")
    output.write_text(json.dumps(result,indent=2,sort_keys=True)+"\n")
    print(json.dumps(result,indent=2,sort_keys=True))


if __name__ == "__main__":
    main()
