#!/usr/bin/env python3
"""No-media unit tests for broad spectral envelope diagnostic."""
import math
import unittest

from ear_private_envelope import SAMPLE_RATE, WINDOW_FRAMES, envelope, similarity, transform


class EnvelopeWitnessTests(unittest.TestCase):
    def synthetic(self, components, gain=1.0):
        return [
            gain * sum(a * math.sin(2 * math.pi * frequency * i / SAMPLE_RATE)
                       for frequency, a in components)
            for i in range(15000)
        ]

    def test_fft_peak_at_expected_frequency_bin(self):
        data = [math.sin(2 * math.pi * 15 * i / WINDOW_FRAMES)
                for i in range(WINDOW_FRAMES)]
        spectrum = transform(data)
        strongest = max(range(WINDOW_FRAMES // 2), key=lambda k: abs(spectrum[k]))
        self.assertEqual(strongest, 15)

    def test_gain_normalization_preserves_envelope(self):
        data = self.synthetic(((240, .3), (720, .5), (1260, .2)))
        louder = [v * 1.6 for v in data]
        a = envelope(data, .01, .27)
        b = envelope(louder, .01, .27)
        self.assertGreater(similarity(a, b), .999)

    def test_spectral_contrast_detects_unrelated_band_content(self):
        source = self.synthetic(((220, .2), (700, .6), (980, .3)))
        unrelated = self.synthetic(((2100, .7), (3100, .5)))
        a = envelope(source, .01, .27)
        b = envelope(unrelated, .01, .27)
        self.assertLess(similarity(a, b), .75)

    def test_bad_window_fails_closed(self):
        with self.assertRaisesRegex(ValueError, "too short"):
            envelope([0.0] * 15000, .01, .03)
        with self.assertRaisesRegex(ValueError, "outside"):
            envelope([0.0] * 15000, .1, .5)

    def test_silent_spectrum_does_not_make_identity_claim(self):
        a = envelope([0.0] * 15000, .01, .27)
        # The pure magnitude floor is constant after centering.
        with self.assertRaisesRegex(ValueError, "No analyzable spectrum"):
            similarity(a, a)


if __name__ == "__main__":
    unittest.main()
