#!/usr/bin/env python3
"""Ear: rights-scoped, exact WAV+dataset witness, two acoustic singers only.

Mock ZIP/metadata tests are test math and transport, not a source-rights
grant, source phone timings or a qualified sung phoneme recognizer.
"""
from __future__ import annotations

import copy
import inspect
import io
import json
from pathlib import Path
import tempfile
import unittest
import wave
import zlib

from ear_private_vocalset_holdout import (
    ROOT,RECORD_ID,LICENSE,DOI,META,ZIP_URL,ZIP_BYTES,ZIP_MD5,
    MAX_MEMBER_SIZE,TOTAL_REMOTE_BUDGET,BLOCK_BYTES,PREDECLARED,
    HTTPRangeArchive,get_json,verify_license,validate_audio
)
from ear_private_vocalset_holdout_gate import (
    EXPECTED_WAV_SHA256,PREVIOUS_SING_WAVS,
    evaluate,verified_sources
)

NATIVE=Path("/tmp/ear-vocalset-two-singer-native-events.json")
MANIFEST=ROOT/"manifest.json"


def official_metadata():
    return {
        "id":RECORD_ID,"metadata":{
            "doi":DOI,"license":{"id":LICENSE},
        },
        "files":[{
            "key":"VocalSet11.zip","size":ZIP_BYTES,
            "checksum":ZIP_MD5,
            "links":{"self":ZIP_URL}
        }]
    }


class VocalSetRightsAndAcoustics(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        if not MANIFEST.exists() or not NATIVE.exists():
            raise unittest.SkipTest("Original private two-singer acoustic witness absent")

    def altered(self,source,key,fn):
        original=json.loads(Path(source).read_text())
        edited=copy.deepcopy(original)
        fn(edited)
        with tempfile.TemporaryDirectory(prefix="ear-vocalset-falsified-",dir="/tmp") as tmp:
            p=Path(tmp)/"altered.json"
            p.write_text(json.dumps(edited))
            return evaluate(str(p) if key=="manifest" else str(MANIFEST),
                            str(p) if key=="native" else str(NATIVE))

    def test_official_metadata_accepts_only_exact_ccby_record(self):
        x=verify_license(official_metadata())
        self.assertEqual(x["license"],"cc-by-4.0")
        self.assertEqual(x["archiveBytes"],ZIP_BYTES)
        self.assertFalse(x["wholeArchiveDownloadedOrMD5Verified"])

    def test_reject_noncommercial_corpus_substitution(self):
        m=official_metadata()
        m["metadata"]["license"]["id"]="cc-by-nc-sa-4.0"
        with self.assertRaisesRegex(ValueError,"license"):
            verify_license(m)

    def test_reject_changed_archival_checksum(self):
        m=official_metadata()
        m["files"][0]["checksum"]="md5:"+"0"*32
        with self.assertRaisesRegex(ValueError,"provenance"):
            verify_license(m)

    def test_remote_metadata_url_is_fixed_no_ssrf(self):
        with self.assertRaisesRegex(ValueError,"official Zenodo"):
            get_json("https://example.com/voice.zip")

    def test_sparse_zip_fetch_rejects_out_of_range_before_network(self):
        with self.assertRaisesRegex(ValueError,"Illegal remote"):
            HTTPRangeArchive.fetch_public(-1,5)
        with self.assertRaisesRegex(ValueError,"Illegal remote"):
            HTTPRangeArchive.fetch_public(0,BLOCK_BYTES+1)
        with self.assertRaisesRegex(ValueError,"Illegal remote"):
            HTTPRangeArchive.fetch_public(ZIP_BYTES-1,ZIP_BYTES)

    def test_sparse_zip_reader_block_cache_and_actual_seek(self):
        requested=[]
        def fake(start,end):
            requested.append((start,end))
            return bytes((i%256 for i in range(start,end+1)))
        r=HTTPRangeArchive(size=2*BLOCK_BYTES,fetch=fake)
        self.assertEqual(r.read(14),bytes(range(14)))
        r.seek(2);self.assertEqual(r.read(4),bytes([2,3,4,5]))
        r.seek(BLOCK_BYTES+7)
        self.assertEqual(r.read(3),bytes([7,8,9]))
        self.assertEqual(len(requested),2)
        self.assertEqual(r.total,2*BLOCK_BYTES)

    def test_sparse_zip_reader_refuses_truncated_remote_blocks(self):
        r=HTTPRangeArchive(size=BLOCK_BYTES,fetch=lambda a,b:b"truncated")
        with self.assertRaisesRegex(ValueError,"Truncated"):
            r.read(1)

    def test_sparse_zip_reader_cannot_exceed_network_budget(self):
        r=HTTPRangeArchive(size=BLOCK_BYTES,fetch=lambda a,b:b"1"*(b-a+1))
        r.total=TOTAL_REMOTE_BUDGET
        with self.assertRaisesRegex(ValueError,"budget"):
            r.read(1)

    def test_two_exact_sources_and_zip_crc_are_pinned(self):
        info,rows=verified_sources(str(MANIFEST))
        self.assertEqual(len(rows),2)
        self.assertEqual([r["speakerID"]for r in rows],["female9","male2"])
        self.assertEqual([r["archiveMember"]for r in rows],
                         [name for _,name in PREDECLARED])
        for r in rows:
            raw=Path(r["audioPath"]).read_bytes()
            self.assertEqual(
                f"{zlib.crc32(raw)&0xffffffff:08x}",
                r["memberZipCRC32"])
            self.assertEqual(r["audioSHA256"],EXPECTED_WAV_SHA256[r["speakerID"]])
        self.assertFalse(info["manifest"]["independentlyTimedPhoneBoundaries"])

    def test_audio_is_original_small_uncompressed_mono_and_not_a_voicebank(self):
        _,rows=verified_sources(str(MANIFEST))
        for r in rows:
            duration,rate,channels=validate_audio(Path(r["audioPath"]).read_bytes())
            self.assertEqual(rate,44100)
            self.assertEqual(channels,1)
            self.assertGreater(duration,5)
            self.assertLess(duration,11)
            self.assertFalse(r["publicVoiceOrSingerModelAuthorized"])
        self.assertLess(sum(r["audioBytes"]for r in rows),2*MAX_MEMBER_SIZE)

    def test_no_second_singer_phoneme_claim_or_performer_identity(self):
        r=evaluate(str(MANIFEST),str(NATIVE))
        self.assertEqual(r["datasetSpeakerIDs"],["female9","male2"])
        self.assertTrue(r["speakersFromDistinctDatasetPseudonymFolders"])
        self.assertFalse(r["independentHumanIdentityCrossDatasetConfirmed"])
        self.assertFalse(r["separateDatasetSingersWithTimedPhoneticAnnotations"])
        self.assertFalse(r["datasetHumanTimedPhonemesProvided"])
        self.assertFalse(r["speakerDisjointPhonemeRecognizerQualified"])
        self.assertFalse(r["voiceCloningOrTrainingPermissionGranted"])
        self.assertFalse(r["mediaPublished"])

    def test_first_real_vocalset_audio_pass_second_fails_without_selecting_winner(self):
        r=evaluate(str(MANIFEST),str(NATIVE))
        first,second=r["datasetSingerAcousticWitnesses"]
        self.assertEqual((first["vocalEvidenceWindows"],first["windows"]),(11,14))
        self.assertTrue(first["passesOriginalFrozenSoundGate"])
        self.assertEqual((second["vocalEvidenceWindows"],second["windows"]),(9,20))
        self.assertFalse(second["passesOriginalFrozenSoundGate"])
        self.assertFalse(r["allDatasetSingerAcousticChecksPass"])

    def test_original_human_control_and_sing_synth_results_unchanged(self):
        r=evaluate(str(MANIFEST),str(NATIVE))
        original=r["previousOneSingerAcousticControl"][0]
        self.assertEqual((original["vocalEvidenceWindows"],original["windows"]),(80,85))
        self.assertTrue(original["passesOriginalFrozenSoundGate"])
        frozen,evolving=r["singSyntheticAcousticControls"]
        self.assertFalse(frozen["passesOriginalFrozenSoundGate"])
        self.assertFalse(evolving["passesOriginalFrozenSoundGate"])
        self.assertEqual((frozen["vocalEvidenceWindows"],evolving["vocalEvidenceWindows"]),(0,2))

    def test_phoneme_target_not_in_inference_or_evaluator(self):
        keys=inspect.signature(evaluate).parameters
        self.assertEqual(list(keys),["manifest_path","native_path"])
        for s in ("lyrics","score","phone","phonemes","expected_singer"):
            self.assertNotIn(s,keys)
        r=evaluate(str(MANIFEST),str(NATIVE))
        self.assertEqual(r["groundTruthVowelTask"],"a")
        self.assertEqual(r["groundTruthVowelBoundaries"],"NOT_SUPPLIED")

    def test_forged_source_pcm_sha_fails(self):
        def change(j):j["records"][0]["audioSHA256"]="0"*64
        with self.assertRaisesRegex(ValueError,"identity"):
            self.altered(MANIFEST,"manifest",change)

    def test_forged_second_singer_directory_fails(self):
        def change(j):j["records"][1]["speakerID"]="female9"
        with self.assertRaisesRegex(ValueError,"identity"):
            self.altered(MANIFEST,"manifest",change)

    def test_claims_of_phone_times_or_voicebank_rights_fail(self):
        for field,value in (("independentlyTimedPhoneBoundaries",True),
                            ("trainingOrVoicebankAuthorizationByThisImporter",True),
                            ("mediaPublished",True)):
            def change(j):j[field]=value
            with self.assertRaisesRegex(ValueError,"falsely promoted"):
                self.altered(MANIFEST,"manifest",change)

    def test_strict_os_sound_model_thresholds_cannot_be_relabelled(self):
        def change(j):j["minimumEvidenceWindowFraction"]=.45
        with self.assertRaisesRegex(ValueError,"contract drift"):
            self.altered(NATIVE,"native",change)

    def test_fake_singer_positive_result_cannot_overrule_audio_counts(self):
        def change(j):
            second=next(x for x in j["observations"]
                        if x["source"]=="male2-straight-a.wav")
            second["voiceEvidencePass"]=True
        with self.assertRaisesRegex(ValueError,"overclaim"):
            self.altered(NATIVE,"native",change)

    def test_sound_role_or_source_identity_swap_rejected(self):
        def change(j):j["observations"][0]["source"]="wrong.wav"
        with self.assertRaisesRegex(ValueError,"drift"):
            self.altered(NATIVE,"native",change)

    def test_sound_model_cannot_claim_recognized_phonemes(self):
        def change(j):j["phonemeRecognitionQualified"]=True
        with self.assertRaisesRegex(ValueError,"contract drift"):
            self.altered(NATIVE,"native",change)

    def test_inference_result_order_is_not_used_as_singer_selection(self):
        expected=evaluate(str(MANIFEST),str(NATIVE))
        def order(j):j["observations"].reverse()
        changed=self.altered(NATIVE,"native",order)
        self.assertEqual(expected["datasetSingerAcousticWitnesses"],
                         changed["datasetSingerAcousticWitnesses"])
        self.assertEqual(expected["singSyntheticAcousticControls"],
                         changed["singSyntheticAcousticControls"])

    def test_duplicate_audio_identity_is_rejected(self):
        def change(j):
            j["observations"][1]["sha256"]=j["observations"][0]["sha256"]
        with self.assertRaisesRegex(ValueError,"repeated"):
            self.altered(NATIVE,"native",change)


if __name__=="__main__":
    unittest.main()
