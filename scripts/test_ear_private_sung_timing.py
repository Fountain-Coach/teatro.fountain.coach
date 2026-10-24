#!/usr/bin/env python3
"""Ear private real singing reference and source-blind timing gate tests."""
import inspect
import json
import math
import pathlib
import tempfile
import unittest
from array import array

from ear_private_sung_alignment import parse_lab, label_stats
from ear_private_sung_timing_gate import (
    infer_onsets, match_events, reference_onsets,
    verify_manifest, evaluation
)


def long_test_label():
    # Label parser requires a substantial sequence; 80 contiguous 100ms
    # syllable/pauses are independent synthetic INTERVAL fixtures, not audio.
    lines = []
    cursor = 0
    for index in range(80):
        end = cursor + 1_000_000
        symbol = ("SP", "m", "iy", "n")[index % 4]
        lines.append(f"{cursor} {end} {symbol}")
        cursor = end
    return "\n".join(lines)


class HumanSungTimingTests(unittest.TestCase):
    def test_label_is_100ns_and_contiguous(self):
        intervals = parse_lab(long_test_label())
        self.assertEqual(len(intervals), 80)
        self.assertEqual(intervals[-1]["endTick100ns"], 80_000_000)
        self.assertEqual(intervals[1]["phone"], "m")
        self.assertEqual(label_stats(intervals)["durationSeconds"], 8)

    def test_labeled_gap_and_overlap_refused(self):
        lines = long_test_label().splitlines()
        fields = lines[7].split()
        fields[0] = str(int(fields[0]) + 1)
        lines[7] = " ".join(fields)
        with self.assertRaisesRegex(ValueError, "Noncontiguous"):
            parse_lab("\n".join(lines))

    def test_malformed_phone_rejected(self):
        lines = long_test_label().splitlines()
        lines[4] = lines[4].replace("SP", "SP;" )
        with self.assertRaisesRegex(ValueError, "Malformed"):
            parse_lab("\n".join(lines))

    def test_reference_phrase_onsets_exclude_breath(self):
        source = [
            {"startTick100ns": 0, "endTick100ns": 2_000_000, "phone": "SP"},
            {"startTick100ns": 2_000_000, "endTick100ns": 3_000_000, "phone": "m"},
            {"startTick100ns": 3_000_000, "endTick100ns": 6_000_000, "phone": "iy"},
            {"startTick100ns": 6_000_000, "endTick100ns": 8_000_000, "phone": "AP"},
            {"startTick100ns": 8_000_000, "endTick100ns": 10_000_000, "phone": "n"},
        ]
        self.assertEqual(reference_onsets(source), [.2, .8])

    def test_inference_signature_has_no_expected_text_or_labels(self):
        params = inspect.signature(infer_onsets).parameters
        for forbidden in ("label", "phones", "score", "lyrics", "reference", "model", "singer"):
            self.assertNotIn(forbidden, params)

    def test_audio_only_onset_detects_bounded_signal(self):
        rate = 16000
        silence = array("h", [0] * (rate // 2))
        voice = array("h", [int(10000 * math.sin(2*math.pi*190*i/rate))
                            for i in range(rate // 2)])
        signal = silence + voice + silence + voice + silence
        found = infer_onsets(signal, rate, threshold=.05)
        self.assertEqual(len(found), 2)
        self.assertAlmostEqual(found[0], .5, delta=.035)
        self.assertAlmostEqual(found[1], 1.5, delta=.035)

    def test_silence_and_low_level_noise_no_spurious_phones(self):
        audio = array("h", [0]*48000)
        self.assertEqual(infer_onsets(audio, 48000, .01), [])
        self.assertEqual(match_events([], [.2, .5])["matchedWithinTolerance"], 0)

    def test_matching_is_one_to_one(self):
        matched = match_events([.1, .105, .6], [.1, .6], tolerance_s=.04)
        self.assertEqual(matched["matchedWithinTolerance"], 2)
        self.assertEqual(matched["falsePositives"], 1)
        self.assertEqual(matched["missedReferenceOnsets"], 0)
        self.assertFalse(matched["phoneIdentityRecognized"])

    def test_non_monotonic_predictions_blocked(self):
        with self.assertRaisesRegex(ValueError, "time-monotonic"):
            match_events([.6,.3],[.3,.6])

    def test_real_pinned_singer_fixture_when_authorized(self):
        path = pathlib.Path("/tmp/ear-sung-human-timed-20261024/manifest.json")
        if not path.exists():
            self.skipTest("Authorized private singer reference not downloaded")
        m = verify_manifest(str(path))
        self.assertEqual(len(m["audios"]), 2)
        self.assertEqual(sum(len(x[3]) for x in m["audios"]), 563)
        result = evaluation(str(path))
        self.assertFalse(result["speakerDisjointWitness"])
        self.assertEqual(result["automaticPhoneIdentityRecognition"], "NOT_IMPLEMENTED")
        self.assertEqual(result["humanSungPhonemeRecognition"], "NOT_QUALIFIED")
        self.assertLess(result["witness"]["precision"], .8)
        self.assertGreater(result["witness"]["targetCount"], 10)

    def test_reference_metadata_cannot_claim_multiple_singers(self):
        path = pathlib.Path("/tmp/ear-sung-human-timed-20261024/manifest.json")
        if not path.exists():
            self.skipTest("Private singer source not downloaded")
        data = json.loads(path.read_text())
        data["speakerDisjointEvaluationAvailable"] = True
        with tempfile.TemporaryDirectory(prefix="ear-singer-test-",dir="/tmp") as root:
            fake = pathlib.Path(root) / "bad.json"
            fake.write_text(json.dumps(data))
            with self.assertRaisesRegex(ValueError, "Wrong or untrusted"):
                verify_manifest(str(fake))

    def test_label_sha_mismatch_blocked_before_scoring(self):
        path = pathlib.Path("/tmp/ear-sung-human-timed-20261024/manifest.json")
        if not path.exists():
            self.skipTest("Private singer source not downloaded")
        data = json.loads(path.read_text())
        data["records"][0]["labelSHA256"] = "0" * 64
        with tempfile.TemporaryDirectory(prefix="ear-singer-test-",dir="/tmp") as root:
            fake = pathlib.Path(root) / "bad.json"
            fake.write_text(json.dumps(data))
            with self.assertRaisesRegex(ValueError, "source hash"):
                verify_manifest(str(fake))


if __name__ == "__main__":
    unittest.main()
