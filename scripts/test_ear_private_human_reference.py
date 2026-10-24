#!/usr/bin/env python3
"""Tests enforce traceable human pronunciation evidence, no word->phone overclaim."""
from __future__ import annotations

import json
import pathlib
import tempfile
import unittest

from ear_private_human_reference_gate import (
    edit_distance, normalize_words, evaluate, validated_reference)


class HumanReferenceTests(unittest.TestCase):
    def test_asr_normalization_is_case_and_punctuation_invariant(self):
        self.assertEqual(normalize_words("WHATEVER, there's a solution."),
                         ["whatever", "there", "s", "a", "solution"])
        self.assertEqual(normalize_words("I’m HERE."), ["i", "m", "here"])

    def test_edit_distance_is_bounded(self):
        target = ["there", "is", "a", "difference"]
        self.assertEqual(edit_distance(target, target), 0)
        self.assertEqual(edit_distance(target, ["there", "a", "difference"]), 1)
        self.assertEqual(edit_distance(target, ["there", "was", "a", "difference"]), 1)
        self.assertEqual(edit_distance([], target), 4)

    def test_voice_asset_permission_is_not_inferred(self):
        with tempfile.TemporaryDirectory(prefix="ear-human-test-", dir="/tmp") as root:
            path = pathlib.Path(root) / "manifest.json"
            path.write_text(json.dumps({
                "schema": "ear.human-rated-pronunciation-reference.v1",
                "license": "CC BY 4.0 original corpus; citation and attribution required",
                "splitsDisjointBySpeaker": True,
                "admittedAsHumanRatedSpeechEvidence": True,
                "admittedAsAnnotatedSingingReference": False,
                "voiceCloningAuthorized": True,
                "mediaRelease": "not-admitted",
                "records": [],
            }))
            with self.assertRaisesRegex(ValueError, "rights-scoped"):
                validated_reference(str(path))

    def test_phone_boundaries_cannot_be_assumed(self):
        with tempfile.TemporaryDirectory(prefix="ear-human-test-", dir="/tmp") as root:
            path = pathlib.Path(root) / "manifest.json"
            path.write_text(json.dumps({
                "schema": "ear.human-rated-pronunciation-reference.v1",
                "license": "CC BY 4.0 original corpus; citation and attribution required",
                "splitsDisjointBySpeaker": True,
                "admittedAsHumanRatedSpeechEvidence": True,
                "admittedAsAnnotatedSingingReference": True,
                "voiceCloningAuthorized": False,
                "mediaRelease": "not-admitted",
                "records": [],
            }))
            with self.assertRaisesRegex(ValueError, "rights-scoped"):
                validated_reference(str(path))

    def test_private_file_missing_raises(self):
        with self.assertRaisesRegex(ValueError, "privately"):
            validated_reference("/tmp/ear-no-such-human-manifest-14159.json")

    def test_real_human_reference_and_transcript_if_present(self):
        path = pathlib.Path("/tmp/ear-human-speechocean-20261024/manifest.json")
        transcript = pathlib.Path("/tmp/ear-human-transcripts.json")
        if not path.is_file() or not transcript.is_file():
            self.skipTest("Authorized private human witness not present")
        result = evaluate(str(path), str(transcript))
        self.assertEqual(result["automaticPhonemeRecognition"], "NOT_IMPLEMENTED")
        self.assertEqual(result["phoneBoundaryTimes"], "NOT_SUPPLIED")
        self.assertEqual(result["humanSungPhonemeRecognizer"], "NOT_QUALIFIED")
        self.assertEqual(sum(v["humanPhoneRatings"]
                             for v in result["aggregates"].values()), 249)
        self.assertEqual(sum(v["recordings"]
                             for v in result["aggregates"].values()), 12)

    def test_real_independent_pronunciation_challenge_if_present(self):
        path = pathlib.Path("/tmp/ear-human-pronunciation-challenge-20261024/challenge.json")
        transcript = pathlib.Path("/tmp/ear-human-challenge-asr.json")
        if not path.is_file() or not transcript.is_file():
            self.skipTest("No private human challenge")
        result = evaluate(str(path), str(transcript))
        self.assertEqual(result["sourceVariant"], "independent-pronunciation-challenge")
        self.assertEqual(result["automaticPhonemeRecognition"], "NOT_IMPLEMENTED")
        self.assertEqual(sum(v["humanPhoneRatings"] for v in result["aggregates"].values()), 92)
        self.assertEqual(sum(v["recordings"] for v in result["aggregates"].values()), 4)
        self.assertGreater(result["aggregates"]["test"]["wordErrorRate"], .20)

    def test_challenge_cannot_launder_unsupported_hard_negatives(self):
        source = pathlib.Path("/tmp/ear-human-pronunciation-challenge-20261024/challenge.json")
        if not source.is_file():
            self.skipTest("No private human challenge")
        data = json.loads(source.read_text())
        data["records"][0]["humanRatedLowAccuracyPhones"] = 0
        with tempfile.TemporaryDirectory(prefix="ear-challenge-test-", dir="/tmp") as folder:
            altered = pathlib.Path(folder) / "altered.json"
            altered.write_text(json.dumps(data))
            with self.assertRaisesRegex(ValueError, "missing annotated hard negatives"):
                validated_reference(str(altered))

    def test_tampered_human_reference_is_rejected_if_present(self):
        source = pathlib.Path("/tmp/ear-human-speechocean-20261024/manifest.json")
        if not source.is_file():
            self.skipTest("No private reference")
        data = json.loads(source.read_text())
        data["records"][0]["audioSHA256"] = "0" * 64
        with tempfile.TemporaryDirectory(prefix="ear-human-test-", dir="/tmp") as folder:
            path = pathlib.Path(folder) / "altered.json"
            path.write_text(json.dumps(data))
            with self.assertRaisesRegex(ValueError, "checksum mismatch"):
                validated_reference(str(path))


if __name__ == "__main__":
    unittest.main()
