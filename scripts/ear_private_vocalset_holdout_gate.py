#!/usr/bin/env python3
"""Ear: post-inference, source-addressed independent-singer VOCAL diagnostic.

Two fixed VocalSet CC BY 4.0 singer-ID sources + original timed one-singer
reference + two unchanged Sing WORLD outputs were already classified by
Apple SoundAnalysis using only audio PCM, no expected label/score/lyrics.

The dataset supplies vowel TASK labels, NOT human-audited phone boundaries.
This gate CANNOT admit singer-disjoint phoneme identity/timing or a voicebank.
"""
from __future__ import annotations

import argparse
import hashlib
import json
from pathlib import Path

from ear_private_sung_alignment import EXPECTED_SHA256
from ear_private_vocalset_holdout import (
    ROOT,PREDECLARED,LICENSE,DOI,ATTRIBUTION,ZIP_BYTES,ZIP_MD5,
    validate_audio,sha,
)

# Exact WAV identities frozen after predeclared selection and *before*
# evaluating the native classifier; do not swap difficult male evidence.
EXPECTED_WAV_SHA256={
    "female9":"d82ce344ad264b91924b823b046e6ec2779c8e5dcc7d26b89f5cddeadb0d3e7f",
    "male2":"c18627d88576898b6b3a4f54a57b87a51a466e0382fc3e58ba4ccc69f16aaf7e",
}
PREVIOUS_SING_WAVS={
    "sing-karen240-world-frozen.wav":
        "0c5165c32bead7a571022e63555f377cfb307229c35c176488404056e0ff6012",
    "sing-karen240-world-evolving.wav":
        "02a7af1dbefbd0e8e8447af6c88f00af02fec62ed4b4d226028f208c71773a78",
}
ORIGINAL_SINGER_WAV="Spectrum.wav"
NATIVE_OS_MODEL="Apple SoundAnalysis SNClassifierIdentifier.version1"
SCHEMA="ear.private-vocalset-two-singer-vocal-witness.v1"


def private_json(path:str)->tuple[dict,str]:
    p=Path(path).expanduser().resolve()
    if not p.is_file() or not str(p).startswith("/private/tmp/"):
        raise ValueError("Evidence JSON must be a real private file under /tmp")
    raw=p.read_bytes()
    if len(raw)>150000:
        raise ValueError("Unbounded private witness metadata")
    return json.loads(raw),sha(raw)


def verified_sources(manifest_path:str)->tuple[dict,list[dict]]:
    m,manifest_sha=private_json(manifest_path)
    if (m.get("schema")!="ear.private-vocalset-two-singer-acoustic-holdout.v1"
        or m.get("sourceDOI")!=DOI or m.get("license")!=LICENSE
        or m.get("creatorAttribution")!=ATTRIBUTION
        or m.get("rights",{}).get("doi")!=DOI
        or m.get("rights",{}).get("license")!=LICENSE
        or m.get("rights",{}).get("zenodoRecord")!=1203819
        or m.get("rights",{}).get("archiveBytes")!=ZIP_BYTES
        or m.get("rights",{}).get("archivePublishedMD5")!=ZIP_MD5
        or m.get("rights",{}).get("wholeArchiveDownloadedOrMD5Verified") is not False
        or m.get("speakerCountAccordingToDataset")!=2
        or m.get("speakerIDsPreselectedBeforeAcousticInference") is not True
        or m.get("claimedIndependentRealPersonIdentityVerification") is not False
        or m.get("vowelTaskFromFileName")!="a"
        or m.get("phonemeSequenceReference")!="NOT_SUPPLIED"
        or m.get("independentlyAuditedPhoneIdentities") is not False
        or m.get("independentlyTimedPhoneBoundaries") is not False
        or m.get("speakerDisjointTimedPhonemeEvaluation")!="NOT_AVAILABLE"
        or m.get("trainingOrVoicebankAuthorizationByThisImporter") is not False
        or m.get("sourceLyricsSuppliedToInference") is not False
        or m.get("sourceLabelSuppliedToInference") is not False
        or m.get("acousticPositiveTestOnly") is not True
        or m.get("allWavZIPMemberCRCsVerified") is not True
        or m.get("originalZipFullChecksumVerified") is not False
        or m.get("mediaPublished") is not False):
        raise ValueError("VocalSet rights, timing or identity falsely promoted")
    rows=m.get("records")
    if not isinstance(rows,list) or len(rows)!=2:
        raise ValueError("Expected exactly two predeclared singer references")
    verified=[]
    for row,(speaker,member) in zip(rows,PREDECLARED):
        path=Path(row.get("audioPath","")).expanduser().resolve()
        if (row.get("speakerID")!=speaker
            or row.get("archiveMember")!=member
            or path!=ROOT.resolve()/(speaker+"-straight-a.wav")
            or not path.is_file()
            or row.get("vowelTaskLabel")!="a"
            or row.get("phonemeBoundaries")!="NOT_SUPPLIED"
            or row.get("phonemeIdentityIndependentlyVerified") is not False
            or row.get("publicVoiceOrSingerModelAuthorized") is not False
            or row.get("audioSHA256")!=EXPECTED_WAV_SHA256[speaker]
            or row.get("sampleRate")!=44100
            or row.get("channels")!=1):
            raise ValueError("Predeclared singer audio or identity drift")
        raw=path.read_bytes()
        if (sha(raw)!=EXPECTED_WAV_SHA256[speaker]
            or row.get("audioBytes")!=len(raw)
            or abs(validate_audio(raw)[0]-row["durationSeconds"])>.001
            or len(row.get("memberZipCRC32",""))!=8):
            raise ValueError("VocalSet selected WAV checksum/format mismatch")
        verified.append(row)
    if len({r["speakerID"] for r in verified})!=2:
        raise ValueError("Two different VocalSet source identities required")
    return {"manifestSHA256":manifest_sha,"manifest":m},verified


def evaluate(manifest_path:str,native_path:str)->dict:
    source,rows=verified_sources(manifest_path)
    native,receipt_sha=private_json(native_path)
    if (native.get("schema")!="ear.private-apple-sound-diagnostic.v1"
        or native.get("model")!=NATIVE_OS_MODEL
        or native.get("modelWeightsHashAvailable") is not False
        or native.get("minimumWindowScore")!=.5
        or native.get("minimumEvidenceWindowFraction")!=.5
        or native.get("minimumWindows")!=2
        or native.get("thresholdFrozenBeforeNovelWitness") is not True
        or sorted(native.get("voiceLabels",[]))!=["humming","singing","speech"]
        or native.get("noExpectedLyricsOrScoreAtInference") is not True
        or native.get("classEvidenceIsNotPhonemeConfidence") is not True
        or native.get("phonemeRecognitionQualified") is not False
        or native.get("mediaPublished") is not False):
        raise ValueError("Source-blind original native classifier contract drift")

    expected={
        r["audioSHA256"]:{"source":Path(r["audioPath"]).name,
                           "family":"vocalset-dataset-speaker",
                           "id":r["speakerID"]}
        for r in rows
    }
    original=Path("/tmp/ear-sung-human-timed-20261024")/ORIGINAL_SINGER_WAV
    if not original.is_file() or sha(original.read_bytes())!=EXPECTED_SHA256["Spectrum"]["wav"]:
        raise ValueError("Original one-singer source changed")
    expected[EXPECTED_SHA256["Spectrum"]["wav"]]={
        "source":ORIGINAL_SINGER_WAV,"family":"previous-one-singer",
        "id":"project-aidol-one-singer"
    }
    for name,digest in PREVIOUS_SING_WAVS.items():
        wav=Path("/tmp")/name
        if not wav.is_file() or sha(wav.read_bytes())!=digest:
            raise ValueError("Existing control Sing source PCM drift")
        expected[digest]={"source":name,"family":"sing-synthetic",
                          "id":name}
    if len(expected)!=5:
        raise ValueError("Duplicate source audio witness")

    observations=native.get("observations",[])
    if not isinstance(observations,list) or len(observations)!=5:
        raise ValueError("Incomplete native source-blind acoustic test")
    actual={}
    for row in observations:
        key=row.get("sha256")
        source_row=expected.get(key)
        if not source_row or key in actual:
            raise ValueError("Foreign, repeated or missing input audio identity")
        if (row.get("source")!=source_row["source"]
            or row.get("expectedTestRole")!="candidate"
            or type(row.get("windows")) is not int or row["windows"]<2
            or type(row.get("vocalEvidenceWindows")) is not int
            or not 0<=row["vocalEvidenceWindows"]<=row["windows"]
            or row.get("voiceEvidencePass") is not
            (row["vocalEvidenceWindows"]/row["windows"]>=.5)
            or row.get("phoneSequenceRecognized") is not False
            or row.get("calibratedVocalProbability") is not False
            or row.get("humanIntelligibilityMeasured") is not False):
            raise ValueError("Model threshold, count or phoneme-overclaim drift")
        actual[key]={
            "source":row["source"],
            "role":source_row["family"],
            "speakerID":source_row["id"],
            "sourceSHA256":key,
            "windows":row["windows"],
            "vocalEvidenceWindows":row["vocalEvidenceWindows"],
            "vocalEvidenceFraction":round(
                row["vocalEvidenceWindows"]/row["windows"],5),
            "passesOriginalFrozenSoundGate":row["voiceEvidencePass"],
            "topLabelsMean":row["topLabelsMean"],
        }
    if set(actual)!=set(expected):
        raise ValueError("Native inference missed predeclared singer")

    dataset_results=[actual[EXPECTED_WAV_SHA256[s]]
                     for s,_ in PREDECLARED]
    original_results=[actual[EXPECTED_SHA256["Spectrum"]["wav"]]]
    synthetic_results=[actual[PREVIOUS_SING_WAVS[n]]
                       for n in PREVIOUS_SING_WAVS]
    all_positive=all(x["passesOriginalFrozenSoundGate"] for x in dataset_results)

    # One dataset singer currently falls below the original SoundAnalysis
    # gate. Preserve it as an actual held-out failure; never drop or swap.
    return {
        "schema":SCHEMA,
        "status":"BOUNDED_TWO_SINGER_ACOUSTIC_REFERENCE_PHONEME_TIMING_BLOCKED",
        "origin":"VocalSet version 1.1 official Zenodo 1203819",
        "attribution":ATTRIBUTION,
        "license":LICENSE,
        "datasetSelectionFrozenBeforeAnyNativeAcousticInference":True,
        "sourceMetadataManifestSHA256":source["manifestSHA256"],
        "nativeSoundBlindReceiptSHA256":receipt_sha,
        "nativeSoundModel":native["model"],
        "nativeOSBuild":native["macOSBuild"],
        "nativeModelWeightsHashAvailable":False,
        "speakersFromDistinctDatasetPseudonymFolders":True,
        "datasetSpeakerIDs":[s for s,_ in PREDECLARED],
        "independentHumanIdentityCrossDatasetConfirmed":False,
        "separateDatasetSingersWithTimedPhoneticAnnotations":False,
        "datasetHumanTimedPhonemesProvided":False,
        "groundTruthVowelTask":"a",
        "groundTruthVowelBoundaries":"NOT_SUPPLIED",
        "originalSoundEvidenceThresholdUnmodified":True,
        "datasetSingerAcousticWitnesses":dataset_results,
        "allDatasetSingerAcousticChecksPass":all_positive,
        "previousOneSingerAcousticControl":original_results,
        "singSyntheticAcousticControls":synthetic_results,
        "originalOneSingerTimedPhoneReferenceStillOwnedSeparately":True,
        "speakerDisjointPhonemeRecognizerQualified":False,
        "humanIntelligibility":"NOT_MEASURED",
        "voiceCloningOrTrainingPermissionGranted":False,
        "mediaPublished":False,
        "singBaselineChanged":False,
    }


def main():
    parser=argparse.ArgumentParser()
    parser.add_argument("--source",default=str(ROOT/"manifest.json"))
    parser.add_argument("--native",required=True)
    parser.add_argument("--report",default="/tmp/ear-vocalset-two-singer-acoustic-witness-20261025.json")
    args=parser.parse_args()
    result=evaluate(args.source,args.native)
    report=Path(args.report).expanduser().resolve()
    if not str(report).startswith("/private/tmp/"):
        parser.error("Private report must stay under /tmp")
    report.write_text(json.dumps(result,indent=2,sort_keys=True)+"\n")
    print(json.dumps({
        "status":result["status"],
        "datasetSingers":[{
            "id":r["speakerID"],
            "vocalPositiveWindows":r["vocalEvidenceWindows"],
            "totalWindows":r["windows"],
            "originalSoundGate":r["passesOriginalFrozenSoundGate"],
        }for r in result["datasetSingerAcousticWitnesses"]],
        "allDatasetSingersPassOriginalGate":result["allDatasetSingerAcousticChecksPass"],
        "phonemeBoundaryQualified":result["speakerDisjointPhonemeRecognizerQualified"],
        "mediaPublished":False,
        "report":str(report)
    },indent=2))


if __name__=="__main__":
    main()
