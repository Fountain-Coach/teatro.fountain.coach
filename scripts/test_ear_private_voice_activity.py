#!/usr/bin/env python3
"""No-network tests of Ear's independent *unqualified* activity detector."""
from __future__ import annotations

import hashlib
import inspect
import json
import pathlib
import struct
import subprocess
import tempfile
import unittest
import wave

from ear_private_voice_activity import (
    analyze_pcm16, MODE, FRAME_MS, MIN_LONGEST_RUN_MS, MIN_VOICED_FRACTION)


def read_pcm16(path: pathlib.Path) -> bytes:
    with tempfile.TemporaryDirectory(dir="/tmp",prefix="ear-vad-test-") as d:
        dest = pathlib.Path(d) / "pcm.wav"
        subprocess.run([
            "/usr/bin/afconvert", "-f", "WAVE", "-d", "LEI16@16000",
            "-c", "1", str(path), str(dest)
        ],check=True,capture_output=True,timeout=25)
        with wave.open(str(dest),"rb") as wav:
            assert wav.getframerate() == 16000
            assert wav.getnchannels() == 1
            return wav.readframes(wav.getnframes())


class IndependentActivityTests(unittest.TestCase):
    def test_no_score_lyrics_labels_or_expected_phones(self):
        args = inspect.signature(analyze_pcm16).parameters
        for key in ("lyrics","labels","text","phone","phoneme","speaker",
                    "score","pitch","midi","expected"):
            self.assertNotIn(key,args)

    def test_preset_frozen_before_holdout(self):
        self.assertEqual(MODE,3)
        self.assertEqual(FRAME_MS,20)
        self.assertEqual(MIN_LONGEST_RUN_MS,200)
        self.assertEqual(MIN_VOICED_FRACTION,.15)

    def test_pure_silence_abstains(self):
        r=analyze_pcm16(bytes(2*16000*4))
        self.assertEqual(r["voiceActivityFrames"],0)
        self.assertFalse(r["passesActivityScreen"])
        self.assertFalse(r["confidenceCalibrated"])

    def test_noise_at_original_false_phone_level_is_vetoed(self):
        p=pathlib.Path("/tmp/ear-negative-noise.wav")
        if not p.exists():self.skipTest("Original private negative unavailable")
        r=analyze_pcm16(read_pcm16(p))
        self.assertFalse(r["passesActivityScreen"])

    def test_current_spoken_and_sung_positive_not_suppressed(self):
        for path in ("/tmp/sing-speech-macos.wav",
                     "/tmp/sing-speech-hybrid.wav",
                     "/tmp/ear-sung-human-timed-20261024/Spectrum.wav",
                     "/tmp/ear-sung-human-timed-20261024/Enjoy_the_Silence.wav"):
            p=pathlib.Path(path)
            if not p.exists():self.skipTest("Private positive unavailable")
            r=analyze_pcm16(read_pcm16(p))
            self.assertTrue(r["passesActivityScreen"],p.name)

    def test_musical_tone_false_voice_activity_is_exposed(self):
        p=pathlib.Path("/tmp/ear-negative-musical-pure.wav")
        if not p.exists():self.skipTest("Private pitched tone unavailable")
        r=analyze_pcm16(read_pcm16(p))
        self.assertTrue(r["passesActivityScreen"])
        self.assertFalse(r["speechOrSingingIdentified"])

    def test_unseen_chirp_is_misclassified_as_voice_activity(self):
        p=pathlib.Path("/tmp/ear-activity-controls-20261024/witness-chirp.wav")
        if not p.exists():self.skipTest("Private adversarial fixture unavailable")
        r=analyze_pcm16(read_pcm16(p))
        self.assertTrue(r["passesActivityScreen"])
        self.assertFalse(r["phonemeIdentityInferred"])

    def test_unseen_strong_noise_exposes_limit(self):
        p=pathlib.Path("/tmp/ear-activity-controls-20261024/witness-uniform-high.wav")
        if not p.exists():self.skipTest("Private adversarial fixture unavailable")
        r=analyze_pcm16(read_pcm16(p))
        self.assertTrue(r["passesActivityScreen"])
        self.assertFalse(r["confidenceCalibrated"])

    def test_unseen_impulses_are_rejected(self):
        p=pathlib.Path("/tmp/ear-activity-controls-20261024/witness-impulses.wav")
        if not p.exists():self.skipTest("Private adversarial fixture unavailable")
        r=analyze_pcm16(read_pcm16(p))
        self.assertFalse(r["passesActivityScreen"])

    def test_unseen_control_manifest_source_integrity(self):
        p=pathlib.Path("/tmp/ear-activity-controls-20261024/manifest.json")
        if not p.exists():self.skipTest("Private controls unavailable")
        m=json.loads(p.read_text())
        self.assertEqual(m["entryCount"],11)
        self.assertTrue(m["thresholdsFrozenBeforeCreation"])
        self.assertEqual({r["partition"] for r in m["entries"]},{"calibration","witness"})
        self.assertEqual(sum(r["partition"]=="witness" for r in m["entries"]),7)
        for entry in m["entries"]:
            actual=pathlib.Path(entry["path"])
            self.assertEqual(hashlib.sha256(actual.read_bytes()).hexdigest(),
                             entry["sourceSHA256"])

    def test_source_bytes_must_be_bounded_and_pcm16(self):
        with self.assertRaisesRegex(ValueError,"bounded"):
            analyze_pcm16(b"odd")
        with self.assertRaisesRegex(ValueError,"Unsupported local"):
            analyze_pcm16(bytes(16000*2), sample_rate=48000)


if __name__ == "__main__":
    unittest.main()
