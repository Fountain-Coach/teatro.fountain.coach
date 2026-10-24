#!/usr/bin/env python3
"""Source-blind, PINNED local all-phone decoder; fail-closed research tests.

Requires private Python 3.13 venv, pocketsphinx==5.1.1. No media publication,
no source audio from Git, no reference labels passed during inference.
"""
from __future__ import annotations

from array import array
import inspect
import json
import math
import pathlib
import struct
import tempfile
import unittest
import wave

from ear_private_allphone import (
    EXPECTED_ACOUSTIC_SHA256, PHONE_LM_SHA256, compare_to_human,
    decode_wav, error_counts, evaluate, model_metadata, private_audio,
)
from pocketsphinx import Decoder


class AllphoneBoundaryTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.acoustic, cls.lm, cls.model = model_metadata()

    def decoder(self):
        return Decoder(
            hmm=str(self.acoustic), allphone=str(self.lm),
            lm=None, dict=None, samprate=16000, loglevel="ERROR")

    def test_all_models_have_pinned_hashes(self):
        self.assertEqual(self.model["version"], "5.1.1")
        self.assertEqual(self.model["phonemeLanguageModelSHA256"], PHONE_LM_SHA256)
        self.assertEqual(self.model["acousticModelFileSHA256"], EXPECTED_ACOUSTIC_SHA256)

    def test_independent_inference_has_no_lyrics_or_score_parameters(self):
        for key in ("lyrics", "score", "transcript", "phonemes", "reference",
                    "aligned", "expected", "speaker", "note"):
            self.assertNotIn(key, inspect.signature(decode_wav).parameters)
        self.assertNotIn("confidence", self.model["search"])

    def test_simple_phone_error_rate_exact_and_edits(self):
        exact = error_counts(["L", "AA", "M", "IY"], ["L", "AA", "M", "IY"])
        self.assertEqual(exact["edits"], 0)
        self.assertEqual(exact["phoneErrorRate"], 0)
        self.assertEqual(exact["exactMatchesInBestEditPath"], 4)

        substitute = error_counts(["L", "AA", "M"], ["L", "AO", "M"])
        self.assertEqual(substitute["substitutions"], 1)
        self.assertEqual(substitute["edits"], 1)
        self.assertEqual(substitute["phoneErrorRate"], .3333)

        missing = error_counts(["L", "AA", "M"], ["L", "M"])
        self.assertEqual(missing["deletions"], 1)
        self.assertEqual(missing["edits"], 1)

        extra = error_counts(["L", "M"], ["L", "AA", "M"])
        self.assertEqual(extra["insertions"], 1)

    def test_empty_prediction_does_not_make_phone_recognition_claim(self):
        blank = error_counts(["L", "AA"], [])
        self.assertEqual(blank["deletions"], 2)
        self.assertEqual(blank["phoneErrorRate"], 1)
        self.assertIsNone(error_counts([], [])["phoneErrorRate"])

    def test_source_file_outside_private_scope_rejected(self):
        with self.assertRaisesRegex(ValueError, "under /tmp"):
            private_audio("/Users/unknown.wav")

    def test_raw_silence_is_empty_phone_hypothesis(self):
        with tempfile.TemporaryDirectory(dir="/tmp", prefix="ear-phones-unit-") as tmp:
            path = pathlib.Path(tmp) / "silence.wav"
            with wave.open(str(path), "wb") as out:
                out.setnchannels(1); out.setsampwidth(2); out.setframerate(16000)
                out.writeframes(b"\0" * (16000 * 2))
            r = decode_wav(str(path), self.decoder())
            self.assertEqual(r["rawPhonemeHypotheses"], 0)
            self.assertFalse(r["hasCalibratedConfidence"])
            self.assertFalse(r["groundTruthSuppliedDuringInference"])

    def test_reordering_private_audio_sources_cannot_change_phone_hypotheses(self):
        spoken = "/tmp/sing-speech-macos.wav"
        noise = "/tmp/ear-negative-noise.wav"
        if not all(pathlib.Path(x).exists() for x in (spoken, noise)):
            self.skipTest("Private audio order fixtures unavailable")
        a = evaluate([spoken, noise], [], None)
        b = evaluate([noise, spoken], [], None)
        left = {x["originalAudioSHA256"]: x["segments"] for x in a["predictions"]}
        right = {x["originalAudioSHA256"]: x["segments"] for x in b["predictions"]}
        self.assertEqual(left, right, "A decoder must not retain cross-utterance CMN/adaptation state")
        self.assertEqual(len(left), 2)

    def test_deterministic_low_noise_exposes_false_phones(self):
        p = pathlib.Path("/tmp/ear-negative-noise.wav")
        if not p.exists():
            self.skipTest("Private low-level noise control unavailable")
        got = decode_wav(str(p), self.decoder())
        # Evidence: noise can be misclassified by a speech-trained phone LM.
        self.assertGreaterEqual(got["rawPhonemeHypotheses"], 1)

    def test_sung_reference_requires_authentic_source_identity(self):
        source = pathlib.Path("/tmp/ear-sung-human-timed-20261024/manifest.json")
        result = pathlib.Path("/tmp/ear-allphone-full-eval.json")
        if not source.exists() or not result.exists():
            self.skipTest("Original private singing labels and raw decoder receipt absent")
        receipt = json.loads(result.read_text())
        self.assertFalse(receipt["phonemeRecognitionQualified"])
        self.assertFalse(receipt["confidenceCalibrated"])
        self.assertGreater(receipt["negativeFalsePositiveCount"], 0)
        comparison = receipt["humanSungReference"]
        self.assertFalse(comparison["speakerDisjointReference"])
        self.assertEqual(len(comparison["evaluation"]), 2)
        # Fixed source/model hashes: protect stable, input-order-independent
        # reference values, NOT a permanent rule that recognition must be bad.
        self.assertAlmostEqual(comparison["evaluation"][0]["strict"]["phoneErrorRate"],
                               .6954, places=4)
        self.assertAlmostEqual(comparison["evaluation"][1]["strict"]["phoneErrorRate"],
                               .7547, places=4)

    def test_source_labels_cannot_be_swapped_to_forge_a_match(self):
        source = pathlib.Path("/tmp/ear-sung-human-timed-20261024/manifest.json")
        result = pathlib.Path("/tmp/ear-allphone-full-eval.json")
        if not source.exists() or not result.exists():
            self.skipTest("Private human singer fixture not present")
        original = json.loads(source.read_text())
        altered = json.loads(json.dumps(original))
        altered["records"][0]["labelSHA256"] = "0" * 64
        with tempfile.TemporaryDirectory(dir="/tmp",prefix="ear-phone-guard-") as root:
            forged = pathlib.Path(root) / "forged.json"
            forged.write_text(json.dumps(altered))
            preds = json.loads(result.read_text())["predictions"]
            with self.assertRaisesRegex(ValueError, "label hash"):
                compare_to_human(str(forged), preds)

    def test_false_second_singer_claim_blocked(self):
        source = pathlib.Path("/tmp/ear-sung-human-timed-20261024/manifest.json")
        result = pathlib.Path("/tmp/ear-allphone-full-eval.json")
        if not source.exists() or not result.exists():
            self.skipTest("Private human singer fixture not present")
        altered = json.loads(source.read_text())
        altered["speakerDisjointEvaluationAvailable"] = True
        with tempfile.TemporaryDirectory(dir="/tmp",prefix="ear-phone-guard-") as root:
            forged = pathlib.Path(root) / "forged.json"
            forged.write_text(json.dumps(altered))
            preds = json.loads(result.read_text())["predictions"]
            with self.assertRaisesRegex(ValueError, "rights and source"):
                compare_to_human(str(forged), preds)

    def test_private_staged_model_and_sources_not_public(self):
        receipt = pathlib.Path("/tmp/ear-allphone-full-eval.json")
        if not receipt.exists():
            self.skipTest("No private source-blind allphone receipt")
        result = json.loads(receipt.read_text())
        self.assertTrue(result["recognizerPhonemesAreRawHypotheses"])
        self.assertFalse(result["mediaPublished"])
        self.assertFalse(result["modelTrainedOrTunedOnReference"])
        self.assertEqual(result["humanIntelligibility"], "NOT_MEASURED")
        self.assertTrue(all(not row["referenceLyricsSuppliedDuringInference"]
                            for row in result["predictions"]))


if __name__ == "__main__":
    unittest.main()
