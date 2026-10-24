#!/usr/bin/env python3
"""Pure unit tests for the Ear lexical gate (no audio, no cloud)."""
import unittest

from ear_private_lexical_gate import NEGATIVE_NAMES, evaluate, normalized


class LexicalGateTests(unittest.TestCase):
    def rows(self, candidate="Love", spoken="La, me, nah."):
        names = ["sing-speech-macos.wav", "sing-speech-hybrid.wav",
                 "sing-speech-procedural.wav", *NEGATIVE_NAMES]
        transcripts = [spoken, candidate, "", "La nami.", "Mamina.", "", ""]
        return {name: {"audioSHA256": "%064x" % idx, "recognizedText": text}
                for idx, (name, text) in enumerate(zip(names, transcripts), 1)}

    def evaluate(self, rows):
        return evaluate(rows, "sing-speech-macos.wav", "sing-speech-hybrid.wav",
                        "sing-speech-procedural.wav")

    def test_actual_transcript_fails_singing(self):
        result = self.evaluate(self.rows())
        self.assertEqual(result["status"], "blocked")
        self.assertTrue(result["sourceReferencePassed"])
        self.assertTrue(result["negativeControlsPassed"])
        self.assertFalse(result["candidateLexicallyMatched"])
        self.assertEqual(result["phonemeRecognition"], "NOT_IMPLEMENTED")

    def test_independent_alias_accepted_only_after_inference(self):
        result = self.evaluate(self.rows(candidate="La me nah."))
        self.assertEqual(result["status"], "candidate-accepted")
        self.assertTrue(result["candidateLexicallyMatched"])
        self.assertTrue(result["speechDerivedImprovesOverProcedural"])
        self.assertEqual(result["humanIntelligibility"], "unverified")

    def test_negative_confusable_cannot_be_promoted(self):
        rows = self.rows(candidate="la mi na")
        rows["ear-negative-consonant.wav"]["recognizedText"] = "la mi na"
        result = self.evaluate(rows)
        self.assertEqual(result["status"], "blocked")
        self.assertFalse(result["negativeControlsPassed"])

    def test_missing_reference_refuses_to_grade(self):
        rows = self.rows()
        del rows["ear-negative-noise.wav"]
        with self.assertRaisesRegex(ValueError, "Missing independently observed controls"):
            self.evaluate(rows)

    def test_spoken_source_must_pass(self):
        result = self.evaluate(self.rows(candidate="la mi na", spoken="Good morning"))
        self.assertEqual(result["status"], "blocked")
        self.assertFalse(result["sourceReferencePassed"])

    def test_normalization_does_not_guess_phonemes(self):
        self.assertEqual(normalized("LA, me, nah."), "la me nah")
        self.assertNotEqual(normalized("La nami."), "la mi na")
        self.assertNotEqual(normalized("Love."), "la me nah")


if __name__ == "__main__":
    unittest.main()
