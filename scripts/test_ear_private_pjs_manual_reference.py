#!/usr/bin/env python3
"""Source-addressed tests for independently HUMAN-reannotated Japanese PJS.

All model quality claims remain blocked. Mock comparison vectors never
constitute human annotations or evidence of recognized sung words.
"""
from __future__ import annotations

import copy
import json
from pathlib import Path
import tempfile
import unittest

from ear_private_pjs_manual_source import (
    ROOT,EXPECTED,CRC,LICENSE,ZIP_BYTES,TOTAL_BUDGET,BLOCK,
    ORIGINAL_AUDIO_MEMBER,MANUAL_COMMIT,MANUAL_REPO,MANUAL_PATH,
    RangeZIP,verify_rights,verify_files,import_reference,
    fetch_public_text,private,sha
)
from ear_private_pjs_label_gate import (
    SCHEMA,SOURCE_SCHEMA,SILENCE_OR_BREATH,parse_labels,phone_sequence,
    compare_versions,evaluate
)

NATIVE=Path("/tmp/ear-pjs-two-singer-native-20261025.json")
MANIFEST=ROOT/"manifest.json"


class IndependentPJSReferenceTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        if not MANIFEST.exists() or not NATIVE.exists():
            raise unittest.SkipTest("Private original PJS source or acoustic event receipt unavailable")

    def tampered(self,which:str,modify):
        src=MANIFEST if which=="source" else NATIVE
        data=json.loads(src.read_text())
        changed=copy.deepcopy(data)
        modify(changed)
        with tempfile.TemporaryDirectory(dir="/tmp",prefix="ear-pjs-tests-")as root:
            f=Path(root)/"forged.json"
            f.write_text(json.dumps(changed))
            return evaluate(
                str(f) if which=="source" else str(MANIFEST),
                str(f) if which=="native" else str(NATIVE))

    def test_original_pjs_and_second_human_relabel_provenance(self):
        m=import_reference(download=False)
        self.assertEqual(m["schema"],SOURCE_SCHEMA)
        self.assertEqual(m["originalLicense"],"CC BY-SA 4.0")
        self.assertEqual(m["manualLabelLicense"],"CC BY-SA 4.0")
        self.assertEqual(m["manualLabelRepository"],"UtaUtaUtau/pjs-manual-labels")
        self.assertEqual(m["manualLabelCommit"],MANUAL_COMMIT)
        self.assertEqual(m["sourcePerformerCount"],1)
        self.assertTrue(m["independentManualReannotationPresent"])
        self.assertFalse(m["manualReannotationIsThirdIndependentAdjudication"])

    def test_original_source_audio_and_two_annotations_are_pinned(self):
        self.assertEqual(len(verify_files()),4)
        for name,expected in EXPECTED.items():
            self.assertEqual(sha((ROOT/name).read_bytes()),expected)
        self.assertEqual(CRC["pjs001-song.wav"],"65fea510")

    def test_two_original_label_tracks_are_not_phone_recognition(self):
        r=evaluate()
        self.assertEqual(r["schema"],SCHEMA)
        self.assertFalse(r["phonemeRecognitionQualified"])
        self.assertFalse(r["humanIntelligibilityVerified"])
        self.assertFalse(r["mediaPublished"])
        self.assertFalse(r["trainingAuthorized"])
        self.assertFalse(r["voiceCloningOrBankAuthorized"])

    def test_real_phone_interval_counts_and_manual_revision(self):
        r=evaluate()["manualRevisionTimeReference"]
        self.assertEqual(r["originalIntervalCount"],75)
        self.assertEqual(r["manualReannotatedIntervalCount"],78)
        self.assertEqual(r["originalPhoneCount"],71)
        self.assertEqual(r["manualReannotatedPhoneCount"],73)
        self.assertEqual(r["phoneIdentityAlignedPairsBetweenTwoLabelVersions"],71)
        self.assertEqual(r["unmatchedOriginalPhoneCount"],0)
        self.assertEqual(r["unmatchedManualPhoneCount"],2)
        self.assertEqual(r["matchingPhonePairsWithEitherBoundaryMovedOver50ms"],71)
        self.assertGreater(r["medianAbsoluteStartChangeMsOnIdenticalPhonePairs"],200)
        self.assertGreater(r["medianAbsoluteEndChangeMsOnIdenticalPhonePairs"],200)

    def test_actual_original_and_human_source_have_individual_SHA(self):
        r=evaluate()
        self.assertEqual(r["sourceWAVSHA256"],EXPECTED["pjs001-song.wav"])
        self.assertEqual(r["originalLabelSHA256"],EXPECTED["pjs001-original.lab"])
        self.assertEqual(r["independentReannotationSHA256"],
                         EXPECTED["pjs001-independent-manual-v2.lab"])
        self.assertNotEqual(r["originalLabelSHA256"],r["independentReannotationSHA256"])

    def test_no_japanese_phones_from_english_decoder(self):
        r=evaluate()
        self.assertTrue(r["sourceJapanesePhonemeInventory"])
        self.assertFalse(r["originalEarEnglishPocketSphinxCanScoreJapanesePhones"])
        self.assertFalse(r["twoSingerSameLanguagePhonemeAccuracyAvailable"])
        self.assertEqual(r["newJapaneseSourceBlindPhonemeModel"],"NOT_INSTALLED_OR_APPLIED")

    def test_not_a_different_singer_proof_from_folder_names(self):
        r=evaluate()
        self.assertTrue(r["firstSingerAndSecondSingerDifferentSourceCorpus"])
        self.assertTrue(r["independentRealWorldPerformerIdentitiesNotAttested"])
        self.assertFalse(r["humanIntelligibilityVerified"])

    def test_manual_label_timing_matches_exact_16_second_original_wav(self):
        manual=parse_labels((ROOT/"pjs001-independent-manual-v2.lab").read_bytes(),
                            "manual",16)
        self.assertEqual(manual[0]["startTick100ns"],0)
        self.assertEqual(manual[-1]["endTick100ns"],160000000)
        self.assertEqual(manual[0]["symbol"],"SP")
        self.assertEqual(manual[-1]["symbol"],"SP")
        self.assertEqual(len(phone_sequence(manual)),73)

    def test_nonphones_are_distinct_without_phonetic_case_normalization(self):
        original=parse_labels((ROOT/"pjs001-original.lab").read_bytes(),
                              "original",16)
        manual=parse_labels((ROOT/"pjs001-independent-manual-v2.lab").read_bytes(),
                              "manual",16)
        self.assertIn("pau",SILENCE_OR_BREATH)
        self.assertIn("SP",SILENCE_OR_BREATH)
        self.assertIn("AP",SILENCE_OR_BREATH)
        self.assertEqual(len(phone_sequence(original)),71)
        self.assertEqual(len(phone_sequence(manual)),73)

    def test_annotation_comparison_reproducible(self):
        original=parse_labels((ROOT/"pjs001-original.lab").read_bytes(),
                              "original",16)
        manual=parse_labels((ROOT/"pjs001-independent-manual-v2.lab").read_bytes(),
                              "manual",16)
        self.assertEqual(compare_versions(original,manual),
                         compare_versions(original,manual))

    def test_forged_manual_label_noncontiguous_rejected(self):
        altered=(ROOT/"pjs001-independent-manual-v2.lab").read_text().splitlines()
        first=altered[2].split()
        first[0]=str(int(first[0])+2)
        altered[2]=" ".join(first)
        with self.assertRaisesRegex(ValueError,"noncontiguous"):
            parse_labels(("\n".join(altered)+"\n").encode(),"manual",16)

    def test_labels_outside_original_wav_duration_rejected(self):
        lines=(ROOT/"pjs001-independent-manual-v2.lab").read_text().splitlines()
        parts=lines[-1].split()
        parts[1]="160100000"
        lines[-1]=" ".join(parts)
        with self.assertRaisesRegex(ValueError,"outside WAV"):
            parse_labels(("\n".join(lines)+"\n").encode(),"manual",16)

    def test_case_sensitive_phone_symbols_are_not_folded(self):
        a=[{"symbol":"n","startMs":0,"endMs":100,"sourceLabelIndex":0}]
        b=[{"symbol":"N","startMs":0,"endMs":100,"sourceLabelIndex":0}]
        compare=compare_versions(a,b)
        self.assertEqual(compare["phoneIdentityAlignedPairsBetweenTwoLabelVersions"],0)

    def test_fake_third_independent_human_audit_rejected(self):
        def modify(m):m["manualReannotationIsThirdIndependentAdjudication"]=True
        with self.assertRaisesRegex(ValueError,"falsely promoted"):
            self.tampered("source",modify)

    def test_fake_english_phone_model_compatibility_rejected(self):
        def modify(m):m["englishPocketSphinxPhoneInventoryCompatible"]=True
        with self.assertRaisesRegex(ValueError,"falsely promoted"):
            self.tampered("source",modify)

    def test_proposed_voicebank_use_rejected(self):
        def modify(m):m["trainingAuthorizedByThisImporter"]=True
        with self.assertRaisesRegex(ValueError,"falsely promoted"):
            self.tampered("source",modify)

    def test_forged_source_label_sha_rejected(self):
        def modify(m):m["files"][2]["sha256"]="0"*64
        with self.assertRaisesRegex(ValueError,"drift"):
            self.tampered("source",modify)

    def test_forged_source_real_performer_identity_rejected(self):
        def modify(m):m["sourceSingerVerifiedIndependentFromAIDolByIdentity"]=True
        with self.assertRaisesRegex(ValueError,"falsely promoted"):
            self.tampered("source",modify)

    def test_missing_native_classification_rejected(self):
        def modify(m):m["observations"].pop()
        with self.assertRaisesRegex(ValueError,"duplicated acoustic"):
            self.tampered("native",modify)

    def test_source_blind_original_vocal_class_and_failed_male_control_preserved(self):
        r=evaluate()
        self.assertEqual(r["unmodifiedAppleVocalDiagnostic"]["PJS"],
                         {"vocalPositiveWindows":24,"windows":31,"passed":True})
        self.assertEqual(r["unmodifiedAppleVocalDiagnostic"]["vocalsetMale2"],
                         {"vocalPositiveWindows":9,"windows":20,"passed":False})

    def test_forged_positive_vocal_class_rejected(self):
        def modify(m):
            item=next(x for x in m["observations"]if x["source"]=="male2-straight-a.wav")
            item["voiceEvidencePass"]=True
        with self.assertRaisesRegex(ValueError,"drift"):
            self.tampered("native",modify)

    def test_native_classifier_lyrics_not_used_at_inference(self):
        def modify(m):m["noExpectedLyricsOrScoreAtInference"]=False
        with self.assertRaisesRegex(ValueError,"contract drift"):
            self.tampered("native",modify)

    def test_network_source_URL_allowlist_blocks_other_origins(self):
        with self.assertRaisesRegex(ValueError,"allowlist"):
            fetch_public_text("https://example.com/not-the-original-pjs")

    def test_no_download_needed_to_verify_locally(self):
        prior=json.loads(MANIFEST.read_text())
        replay=import_reference(download=False)
        self.assertEqual(replay,prior)
        self.assertGreater(replay["boundedOriginalZIPTransferredBytes"],0)

    def test_rights_must_agree_on_original_and_independent_label_repo(self):
        verify_rights(b"CC BY-SA 4.0; Free for non-commercial and commercial use",
                      b"Manually labeled by a human; HTK mono label format; CC BY-SA 4.0")
        with self.assertRaisesRegex(ValueError,"provenance"):
            verify_rights(b"CC BY-NC-ND 4.0",b"Manually labeled by a human; HTK mono label format; CC BY-SA 4.0")

    def test_sparse_archive_bytes_cannot_be_unbounded(self):
        r=RangeZIP(fetch=lambda start,end:b"x"*(end-start+1))
        self.assertEqual(len(r.read(12)),12)
        with self.assertRaisesRegex(ValueError,"Unbounded"):
            r.read(10*1024*1024)
        with self.assertRaisesRegex(ValueError,"Invalid archive offset"):
            r.seek(ZIP_BYTES+10)


if __name__=="__main__":
    unittest.main()
