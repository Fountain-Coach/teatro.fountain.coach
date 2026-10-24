#!/usr/bin/env python3
"""Pure no-network/no-media unit tests for Ear's bounded CV research gates."""
from __future__ import annotations

import inspect
import math
import tempfile
import unittest
import wave
from pathlib import Path

from ear_private_cv_probe import (decide as decide_cv, extract, infer,
                                  distance, read_wave)
from ear_private_vowel_probe import (decide as decide_vowel, vocal_regions,
                                     nucleus)
from ear_private_i_vowel_gate import infer_i, metrics as i_metrics, quality_ready


class SourceBlindGateTests(unittest.TestCase):
    def test_cv_abstains_when_no_acoustic_evidence(self):
        self.assertEqual(decide_cv(None, 0.6, 0.1)["hypothesis"], "unknown")
        self.assertIsNone(extract([0.0] * 48000))

    def test_cv_distance_is_identity_and_symmetric(self):
        x, y = [1.0, 2.0, 3.0], [2.0, 3.0, 4.0]
        self.assertEqual(distance(x, x), 0)
        self.assertEqual(distance(x, y), distance(y, x))
        self.assertGreater(distance(x, y), 0)

    def test_cv_cannot_be_forced_to_target(self):
        ranked = [("na", .41), ("ma", .67), ("la", .78)]
        self.assertEqual(decide_cv(ranked, .55, .05)["hypothesis"], "na")
        self.assertEqual(decide_cv(ranked, .3, .05)["hypothesis"], "unknown")
        self.assertNotIn("lyrics", inspect.signature(infer).parameters)
        self.assertNotIn("expected", inspect.signature(infer).parameters)
        self.assertNotIn("score", inspect.signature(infer).parameters)

    def test_vowel_detection_no_spurious_phoneme(self):
        self.assertEqual(decide_vowel(None, .84, .075)["nucleusHypothesis"], "unknown")
        self.assertEqual(decide_vowel([
            ("ɑ", .90), ("oʊ", .899), ("i", .3)], .84, .075)["nucleusHypothesis"], "unknown")

    def test_i_nucleus_only_after_margin_and_similarity(self):
        self.assertFalse(infer_i(None)["iNucleusDetected"])
        self.assertTrue(infer_i([("i", .92), ("ɑ", .67), ("oʊ", .5)])["iNucleusDetected"])
        self.assertFalse(infer_i([("i", .82), ("ɑ", .5), ("oʊ", .2)])["iNucleusDetected"])
        self.assertFalse(infer_i([("i", .9), ("ɑ", .85), ("oʊ", .2)])["iNucleusDetected"])
        self.assertFalse(infer_i([("ɑ", .99), ("i", .5), ("oʊ", .4)])["iNucleusDetected"])

    def test_silence_separated_from_three_sustained_islands_without_score(self):
        signal = [0.0] * (48000 * 5)
        for start, end in ((0, 2.1), (2.15, 3.3), (3.35, 4.8)):
            for frame in range(int(start * 48000), int(end * 48000)):
                signal[frame] = .14 * math.sin(2 * math.pi * 260 * frame / 48000)
        groups = vocal_regions(signal)
        self.assertEqual(len(groups), 3)
        self.assertEqual(groups[0][0], 0)
        self.assertEqual(groups[1][0] // 480, 214)
        self.assertIsNotNone(nucleus(signal, groups[1]))

    def test_silence_has_no_islands(self):
        self.assertEqual(vocal_regions([0.0] * 96000), [])
        self.assertIsNone(nucleus([0.0] * 4800, (0, 4800)))

    def test_i_metrics_are_binary_not_a_word_transcript(self):
        sources = [
            {"sourceId": "a", "speaker": "V1", "sourceSHA256": "0"*64,
             "expectedNucleusIntent": "i", "ranks": [("i", .95), ("ɑ", .7), ("oʊ", .5)]},
            {"sourceId": "b", "speaker": "V2", "sourceSHA256": "1"*64,
             "expectedNucleusIntent": "ɑ", "ranks": [("ɑ", .95), ("i", .7), ("oʊ", .5)]},
            {"sourceId": "c", "speaker": "synthetic", "sourceSHA256": "2"*64,
             "expectedNucleusIntent": "unknown", "ranks": None},
        ]
        result = i_metrics(sources)
        self.assertEqual(result["iRecall"], 1)
        self.assertEqual(result["specificity"], 1)
        self.assertNotIn("recognizedText", result)

    def test_final_new_voice_witness_blocks_promotion_even_if_score_matches(self):
        perfect = {"iRecall": 1.0, "specificity": 1.0}
        missed = {"iRecall": .8333, "specificity": 1.0}
        self.assertFalse(quality_ready(perfect, perfect, None))
        self.assertFalse(quality_ready(perfect, perfect, missed))
        self.assertTrue(quality_ready(perfect, perfect, perfect))

    def test_sha_mismatch_rejected_before_analysis(self):
        with tempfile.TemporaryDirectory(prefix="ear-test-", dir="/tmp") as folder:
            p = Path(folder) / "empty.wav"
            with wave.open(str(p), "wb") as output:
                output.setnchannels(1); output.setsampwidth(2); output.setframerate(48000)
                output.writeframes(b"\0" * 9600)
            with self.assertRaisesRegex(ValueError, "SHA256 mismatch"):
                read_wave(str(p), expected_sha="0"*64)

    def test_private_source_boundary(self):
        with self.assertRaisesRegex(ValueError, "private WAV"):
            read_wave("/Users/unknown/unauthorized.wav")


if __name__ == "__main__":
    unittest.main()
