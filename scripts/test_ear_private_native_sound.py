#!/usr/bin/env python3
"""Native SoundAnalysis is a vocal-EVIDENCE check, never phone confidence."""
from __future__ import annotations

import inspect
import json
from pathlib import Path
import subprocess
import tempfile
import unittest

from ear_private_native_sound_eval import verify


SOURCE = "/tmp/ear-apple-native-novel-report.json"
ORDINARY = "/tmp/ear-human-speechocean-20261024/manifest.json"
CHALLENGE = "/tmp/ear-human-pronunciation-challenge-20261024/challenge.json"
SUNG = "/tmp/ear-sung-human-timed-20261024/manifest.json"
NOVEL = "/tmp/ear-sound-novel-nonspeech-20261024/manifest.json"
SPOKEN = "/tmp/sing-speech-macos.wav"
SING = "/tmp/sing-speech-hybrid.wav"
NOISE = "/tmp/ear-negative-noise.wav"
CHIRP = "/tmp/ear-activity-controls-20261024/witness-chirp.wav"
ALLPHONE = "/tmp/ear-activity-heldout-with-phone.json"


def evaluate(path: str = SOURCE):
    return verify(path, ORDINARY, CHALLENGE, SUNG, NOVEL,
                  SPOKEN, SING, NOISE, CHIRP, ALLPHONE)


class NativeVocalEvidenceTests(unittest.TestCase):
    def fixture(self):
        if not Path(SOURCE).is_file():
            self.skipTest("Private macOS SoundAnalysis receipt unavailable")
        return json.loads(Path(SOURCE).read_text())

    def altered(self, data: dict):
        with tempfile.TemporaryDirectory(dir="/tmp", prefix="ear-native-test-") as d:
            file = Path(d) / "modified.json"
            file.write_text(json.dumps(data))
            return evaluate(str(file))

    def test_real_voice_references_and_novel_negatives(self):
        self.fixture()
        result = evaluate()
        self.assertEqual(result["knownHumanOrSpokenPositiveCount"], 19)
        self.assertEqual(result["knownVocalEvidenceRetained"], 19)
        self.assertEqual(result["novelNegativeFalseVocalEvidence"], 0)
        self.assertEqual(result["allNegativeFalseVocalEvidence"], 0)
        self.assertEqual(result["verifiedSources"], 31)
        self.assertFalse(result["singDerivedSyntheticHasIndependentVocalEvidence"])

    def test_real_allphone_chirp_remains_raw_failure(self):
        self.fixture()
        result = evaluate()
        self.assertEqual(result["oldChirpRawAllphoneFalsePhones"], 1)
        self.assertEqual(result["oldChirpAfterWebRTCScreenFalsePhones"], 1)
        self.assertEqual(result["oldChirpAfterNativeVocalScreenCandidatePhones"], 0)
        self.assertEqual(result["phonemeIdentityRecognition"], "NOT_QUALIFIED")
        self.assertFalse(result["independentSecondSinger"])

    def test_phoneme_overclaim_rejected(self):
        j = self.fixture()
        j["phonemeRecognitionQualified"] = True
        with self.assertRaisesRegex(ValueError, "overclaim"):
            self.altered(j)

    def test_source_hash_forgery_rejected(self):
        j = self.fixture()
        j["observations"][0]["sha256"] = "0" * 64
        with self.assertRaisesRegex(ValueError, "source SHA"):
            self.altered(j)

    def test_false_positive_remains_visible_without_promotion(self):
        j = self.fixture()
        row = next(x for x in j["observations"] if x["source"] == "rising-gliss.wav")
        row["vocalEvidenceWindows"] = 5
        row["vocalEvidenceFraction"] = 5 / row["windows"]
        row["voiceEvidencePass"] = True
        report = self.altered(j)
        self.assertEqual(report["status"], "native-vocal-evidence-not-qualified")
        self.assertEqual(report["novelNegativeFalseVocalEvidence"], 1)
        self.assertEqual(report["phonemeIdentityRecognition"], "NOT_QUALIFIED")

    def test_stale_threshold_drift_rejected(self):
        j = self.fixture()
        j["minimumWindowScore"] = .2
        with self.assertRaisesRegex(ValueError, "overclaim"):
            self.altered(j)

    def test_wrong_source_role_rejected(self):
        j = self.fixture()
        j["observations"][0]["expectedTestRole"] = "negative"
        with self.assertRaisesRegex(ValueError, "Source role"):
            self.altered(j)

    def test_native_sound_does_not_consume_score_or_phone_labels(self):
        source = Path("scripts/ear_private_apple_sound_gate.swift").read_text()
        native_inference = source.split("func analyze(_ path: String)")[1].split("var sources:")[0].lower()
        self.assertNotIn("midi", native_inference)
        self.assertNotIn("lyrics", native_inference)
        self.assertNotIn("expectedphoneme", native_inference)
        self.assertNotIn("phoneme", inspect.signature(verify).parameters)
        self.assertNotIn("lyrics", inspect.signature(verify).parameters)
        self.assertNotIn("score", inspect.signature(verify).parameters)

    def test_private_native_tool_order_independent(self):
        exe = Path("/tmp/ear-private-apple-sound-gate")
        if not exe.exists():
            self.skipTest("macOS SoundAnalysis executable not yet compiled")
        samples = [
            ("--candidate",SING),
            ("--negative",CHIRP),
            ("--candidate",SUNG.replace("manifest.json","Spectrum.wav"))
        ]
        def execute(items):
            result = subprocess.run([str(exe),*[arg for pair in items for arg in pair]],
                                    capture_output=True,text=True,timeout=35,check=True)
            return {x["sha256"]:x for x in json.loads(result.stdout)["observations"]}
        first = execute(samples)
        other = execute(list(reversed(samples)))
        self.assertEqual(first, other)

    def test_apple_model_absent_verifiable_weights_hash_and_no_publication(self):
        j = self.fixture()
        self.assertFalse(j["modelWeightsHashAvailable"])
        self.assertTrue(j["classEvidenceIsNotPhonemeConfidence"])
        self.assertFalse(j["mediaPublished"])
        self.assertTrue(j["noExpectedLyricsOrScoreAtInference"])
        self.assertTrue(j["macOSBuild"].startswith("Version "))


if __name__=="__main__":
    unittest.main()
