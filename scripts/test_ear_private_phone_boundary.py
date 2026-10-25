#!/usr/bin/env python3
"""Tests: raw, source-blind real-singer phones versus published HTK times.

No labels enter any decoder; synthetic "perfect" tests below exercise ONLY
the comparator algorithm and are NOT performance evidence.
"""
from __future__ import annotations

import copy
import hashlib
import inspect
import json
from pathlib import Path
import tempfile
import unittest

from ear_private_phone_boundary_gate import (
    SCHEMA,TOLERANCES_MS,RESEARCH_F1_TARGET,checked_phones,
    published_phone_times,sequence_alignment,score_timing,verify,
)
from ear_private_sung_alignment import EXPECTED_SHA256,private_path

BASE=Path("/tmp/ear-allphone-full-eval.json")
SINGER=Path("/tmp/ear-sung-human-timed-20261024/manifest.json")


def item(symbol,start,end):
    return {"symbol":symbol,"startMs":start,"endMs":end}


class EarPhoneBoundaryTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        if not BASE.is_file() or not SINGER.is_file():
            raise unittest.SkipTest("Pinned human-sung/audio-only private receipt not available")

    def altered(self,location,key,action):
        original=json.loads(Path(location).read_text())
        changed=copy.deepcopy(original)
        action(changed)
        with tempfile.TemporaryDirectory(prefix="ear-phone-boundary-tamper-",dir="/tmp") as folder:
            out=Path(folder)/"forged.json"
            out.write_text(json.dumps(changed))
            return verify(str(out)if key=="allphone" else str(BASE),
                          str(out)if key=="singer" else str(SINGER))

    def test_actual_reference_is_two_tracks_one_singer_not_a_sing_asset(self):
        report=verify(str(BASE),str(SINGER))
        self.assertEqual(report["schema"],SCHEMA)
        self.assertEqual(report["singerCount"],1)
        self.assertEqual(report["tracks"],2)
        self.assertFalse(report["independentSecondSinger"])
        self.assertFalse(report["humanTimedLabelsIndependentlyReaudited"])
        self.assertFalse(report["referenceAudioUsedForTraining"])
        self.assertFalse(report["phonemeIdentityRecognitionQualified"])
        self.assertFalse(report["singVoicebankRightsGranted"])
        self.assertFalse(report["mediaPublished"])
        self.assertEqual(report["singSpeechSourceBoundaryTruth"],"NOT_SUPPLIED")

    def test_source_blind_decoding_happened_before_label_comparison(self):
        from ear_private_allphone import decode_wav
        self.assertEqual(list(inspect.signature(decode_wav).parameters),
                         ["source","decoder"])
        report=verify(str(BASE),str(SINGER))
        self.assertFalse(report["referenceSourcePhoneTimesPassedToInference"])
        self.assertFalse(report["referenceSourceLyricsPassedToInference"])
        self.assertEqual(report["phoneTimeTolerancesMs"],[50,100])
        self.assertEqual(report["exploratoryPhoneAndBoundaryF1Target"],.80)

    def test_real_singing_identity_and_time_f1_stays_unqualified(self):
        report=verify(str(BASE),str(SINGER))
        a,b=report["witnesses"]
        self.assertEqual([x["strictPhoneSequenceErrorRate"]for x in (a,b)],
                         [.6954,.7547])
        self.assertEqual([x["referencePhoneCount"]for x in (a,b)],[197,265])
        self.assertEqual([x["predictedPhoneCount"]for x in (a,b)],[156,257])
        self.assertEqual([x["identityOnlyF1"]for x in (a,b)],[.3569,.3027])
        self.assertEqual(
            [x["sourceBlindPhoneAndBothBoundariesAtMs"]["50"]["phoneAndBothBoundariesCorrect"]
             for x in (a,b)],[42,48])
        self.assertEqual(
            [x["sourceBlindPhoneAndBothBoundariesAtMs"]["50"]["strictF1"]
             for x in (a,b)],[.238,.1839])
        self.assertEqual(
            [x["sourceBlindPhoneAndBothBoundariesAtMs"]["100"]["strictF1"]
             for x in (a,b)],[.2833,.2222])
        self.assertTrue(all(x["sourceBlindPhoneAndBothBoundariesAtMs"]["50"]["strictF1"]
                            <RESEARCH_F1_TARGET for x in (a,b)))

    def test_unit_identity_and_exact_boundaries_math_only(self):
        r=[item("L",0,50),item("AA",50,230),item("N",230,300)]
        p=[dict(x)for x in r]
        s=score_timing(r,p)
        self.assertEqual(s["identityOnlyF1"],1)
        self.assertEqual(s["strictPhoneSequenceErrorRate"],0)
        self.assertEqual(s["sourceBlindPhoneAndBothBoundariesAtMs"]["50"]["strictF1"],1)

    def test_wrong_symbol_must_not_count_as_timed_phone(self):
        r=[item("L",0,50),item("AA",50,230)]
        p=[item("L",0,50),item("AO",50,230)]
        s=score_timing(r,p)
        self.assertEqual(s["sequenceAlignedIdenticalPhones"],1)
        self.assertEqual(s["sourceBlindPhoneAndBothBoundariesAtMs"]["50"]["phoneAndBothBoundariesCorrect"],1)

    def test_only_start_boundary_matching_cannot_claim_a_phone_match(self):
        r=[item("L",0,80)]
        p=[item("L",0,180)]
        s=score_timing(r,p)
        self.assertEqual(s["identityOnlyF1"],1)
        self.assertEqual(s["sourceBlindPhoneAndBothBoundariesAtMs"]["50"]["strictF1"],0)
        self.assertEqual(s["sourceBlindPhoneAndBothBoundariesAtMs"]["100"]["strictF1"],1)

    def test_duplicate_prediction_cannot_score_twice(self):
        r=[item("AA",0,70)]
        p=[item("AA",0,70),item("AA",70,140)]
        s=score_timing(r,p)
        self.assertEqual(s["sequenceAlignedIdenticalPhones"],1)
        self.assertAlmostEqual(s["identityOnlyF1"],.6667,places=4)
        # Ambiguous repeated model phones must NOT use reference times to
        # select the optimistic candidate. A deterministic late match can
        # legitimately yield ZERO temporally correct phones.
        self.assertLessEqual(
            s["sourceBlindPhoneAndBothBoundariesAtMs"]["50"]["phoneAndBothBoundariesCorrect"],1)

    def test_sequential_tie_backtrace_is_deterministic(self):
        r=[item("AA",0,100),item("AA",100,200)]
        p=[item("AA",0,100)]
        a=sequence_alignment(r,p)
        b=sequence_alignment(r,p)
        self.assertEqual(a,b)
        self.assertEqual(len(a),1)

    def test_missing_hypothesis_is_not_recognition(self):
        r=[item("AA",0,100)]
        result=score_timing(r,[])
        self.assertEqual(result["strictPhoneSequenceErrorRate"],1)
        self.assertEqual(result["sourceBlindPhoneAndBothBoundariesAtMs"]["50"]["strictF1"],0)
        self.assertIsNone(result["medianStartErrorMsOnIdentityPairs"])

    def test_overlapping_decoder_phone_intervals_rejected(self):
        with self.assertRaisesRegex(ValueError,"Overlapping"):
            checked_phones([item("L",0,100),item("AA",90,150)],200)

    def test_invalid_or_unbounded_decoder_intervals_rejected(self):
        with self.assertRaisesRegex(ValueError,"unbounded"):
            checked_phones([item("L",0,1000)],200)

    def test_published_phone_time_must_be_contiguous(self):
        labels=[{"startTick100ns":0,"endTick100ns":100000,"phone":"aa"},
                {"startTick100ns":100001,"endTick100ns":200000,"phone":"m"}]
        with self.assertRaisesRegex(ValueError,"structure"):
            published_phone_times(labels)

    def test_forged_singer_wav_hash_rejected(self):
        def corrupt(x):
            x["records"][0]["audioSHA256"]="0"*64
        with self.assertRaises(ValueError):
            self.altered(SINGER,"singer",corrupt)

    def test_forged_label_sha_rejected(self):
        def corrupt(x):
            x["records"][0]["labelSHA256"]="0"*64
        with self.assertRaises(ValueError):
            self.altered(SINGER,"singer",corrupt)

    def test_forged_second_singer_rejected(self):
        def corrupt(x):
            x["speakerDisjointEvaluationAvailable"]=True
        with self.assertRaises(ValueError):
            self.altered(SINGER,"singer",corrupt)

    def test_source_audio_and_reference_labels_both_pinned(self):
        report=verify(str(BASE),str(SINGER))
        for row in report["witnesses"]:
            self.assertEqual(row["sourceSHA256"],EXPECTED_SHA256[row["source"]]["wav"])
            self.assertEqual(row["publishedLabelSHA256"],EXPECTED_SHA256[row["source"]]["lab"])
        self.assertEqual(report["negativeRawFalsePhonesUnchanged"],1)

    def test_reference_lyrics_not_accepted_at_inference(self):
        def leak(x):
            row=next(x for x in x["predictions"] if x["sourceId"]=="Spectrum.wav")
            row["referenceLyricsSuppliedDuringInference"]=True
        with self.assertRaisesRegex(ValueError,"leakage"):
            self.altered(BASE,"allphone",leak)

    def test_model_claim_of_qualified_phones_rejected(self):
        def forge(x):
            x["phonemeRecognitionQualified"]=True
        with self.assertRaisesRegex(ValueError,"overclaim"):
            self.altered(BASE,"allphone",forge)

    def test_changed_model_digest_rejected(self):
        def forge(x):
            x["model"]["phonemeLanguageModelSHA256"]="0"*64
        with self.assertRaisesRegex(ValueError,"overclaim"):
            self.altered(BASE,"allphone",forge)

    def test_audio_sha_swap_rejected(self):
        def forge(x):
            row=next(x for x in x["predictions"] if x["sourceId"]=="Spectrum.wav")
            row["originalAudioSHA256"]="0"*64
        with self.assertRaisesRegex(ValueError,"mismatch"):
            self.altered(BASE,"allphone",forge)

    def test_forged_perfect_phones_cannot_modify_prior_observed_per(self):
        def fake(x):
            row=next(x for x in x["predictions"] if x["sourceId"]=="Spectrum.wav")
            row["segments"]=[{"symbol":"L","startMs":0,"endMs":10}]
            row["rawPhonemeHypotheses"]=1
        with self.assertRaises(ValueError):
            self.altered(BASE,"allphone",fake)

    def test_reordering_receipt_predictions_does_not_change_evaluation(self):
        original=verify(str(BASE),str(SINGER))
        def reorder(x):
            x["predictions"].reverse()
        modified=self.altered(BASE,"allphone",reorder)
        self.assertEqual(original["witnesses"],modified["witnesses"])

    def test_false_phones_from_independent_noise_control_stay_visible(self):
        result=verify(str(BASE),str(SINGER))
        self.assertEqual(result["negativeRawFalsePhonesUnchanged"],1)
        self.assertFalse(result["phonemeIdentityRecognitionQualified"])


if __name__=="__main__":
    unittest.main()
