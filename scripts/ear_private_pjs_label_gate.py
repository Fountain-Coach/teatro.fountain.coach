#!/usr/bin/env python3
"""Ear: compare ORIGINAL PJS phoneme times to INDEPENDENT HUMAN revision.

Neither label version enters acoustic inference. The interval comparison is
only version disagreement, NOT a measured phone recognizer score, cannot
make the original automatic alignment "ground truth", and never supports
English PocketSphinx decoding of Japanese phonemes.

This can enrich Ear's source/label provenance for a *second corpus singer*,
without claiming speaker-disjoint, same-inventory phone recognition.
"""
from __future__ import annotations

import argparse
import hashlib
import json
from pathlib import Path
import statistics

from ear_private_pjs_manual_source import ROOT,EXPECTED,import_reference,private,sha
from ear_private_phone_boundary_gate import sequence_alignment
from ear_private_sung_alignment import EXPECTED_SHA256

TICKS_PER_SECOND=10000000
SILENCE_OR_BREATH={"pau","SP","AP"}
SCHEMA="ear.private-pjs-independent-manual-timed-label-evidence.v1"
SOURCE_SCHEMA="ear.private-pjs-independent-timed-singing.v1"


def parse_labels(data:bytes,which:str,duration:float)->list[dict]:
    try:lines=data.decode("utf-8").splitlines()
    except UnicodeDecodeError as e:raise ValueError("HTK labels not text") from e
    if not 20<=len(lines)<=500:
        raise ValueError("Unexpected number of PJS HTK phone intervals")
    parsed=[]
    previous=0
    for idx,line in enumerate(lines):
        parts=line.split()
        if len(parts)!=3 or not all(x.isdigit() for x in parts[:2]):
            raise ValueError("Invalid PJS HTK row "+str(idx))
        start,end=(int(x) for x in parts[:2])
        sym=parts[2]
        # Case matters: Japanese nasal N and n need NOT be equivalent!
        if (start!=previous or end<=start or end/TICKS_PER_SECOND>duration+.005
            or not 1<=len(sym)<=8 or not sym.isascii()
            or any(not x.isalpha() for x in sym)):
            raise ValueError("PJS source label noncontiguous or outside WAV")
        parsed.append({"symbol":sym,"startTick100ns":start,"endTick100ns":end,
                       "startMs":start/10000,"endMs":end/10000,
                       "sourceLabelIndex":idx})
        previous=end
    if which=="manual":
        if abs(previous/TICKS_PER_SECOND-duration)>.005:
            raise ValueError("Human-edited label does not cover full original WAV")
        if not (parsed[0]["symbol"]=="SP"
                and parsed[-1]["symbol"]=="SP"):
            raise ValueError("Manual breath/silence labels changed")
    else:
        if not duration-1.0 <= previous/TICKS_PER_SECOND<=duration:
            raise ValueError("Original label unexpectedly truncated")
        if parsed[0]["symbol"]!="pau":
            raise ValueError("Original PJS label start drift")
    return parsed


def phone_sequence(rows:list[dict])->list[dict]:
    return [x for x in rows if x["symbol"] not in SILENCE_OR_BREATH]


def compare_versions(original:list[dict],manual:list[dict])->dict:
    before=phone_sequence(original)
    after=phone_sequence(manual)
    pairs=sequence_alignment(before,after)
    matched=[]
    for i,j in pairs:
        a,b=before[i],after[j]
        assert a["symbol"]==b["symbol"]
        matched.append({
            "sourceSymbol":a["symbol"],
            "originalStartMs":a["startMs"],
            "revisedStartMs":b["startMs"],
            "originalEndMs":a["endMs"],
            "revisedEndMs":b["endMs"],
            "startShiftMs":round(b["startMs"]-a["startMs"],3),
            "endShiftMs":round(b["endMs"]-a["endMs"],3),
            "originalSourceLabelIndex":a["sourceLabelIndex"],
            "revisedSourceLabelIndex":b["sourceLabelIndex"],
        })
    start_shifts=[abs(x["startShiftMs"])for x in matched]
    end_shifts=[abs(x["endShiftMs"])for x in matched]
    change_count=sum(abs(x["startShiftMs"])>50 or abs(x["endShiftMs"])>50
                     for x in matched)
    return {
        "originalIntervalCount":len(original),
        "manualReannotatedIntervalCount":len(manual),
        "originalPhoneCount":len(before),
        "manualReannotatedPhoneCount":len(after),
        "phoneIdentityAlignedPairsBetweenTwoLabelVersions":len(pairs),
        "unmatchedOriginalPhoneCount":len(before)-len(pairs),
        "unmatchedManualPhoneCount":len(after)-len(pairs),
        "originalAndRevisedPhonemeInventoryIdentical":
            {x["symbol"] for x in before}=={x["symbol"] for x in after},
        "medianAbsoluteStartChangeMsOnIdenticalPhonePairs":(
            round(statistics.median(start_shifts),3) if matched else None),
        "medianAbsoluteEndChangeMsOnIdenticalPhonePairs":(
            round(statistics.median(end_shifts),3) if matched else None),
        "matchingPhonePairsWithEitherBoundaryMovedOver50ms":change_count,
        "timeChangesAreAnnotatorDisagreementNotRecognizerErrors":True,
        "referenceUsedDuringPhonemeInference":False,
        "identityMappingReordersPhonesForBetterTimeAgreement":False,
        "sampleChanges":matched[:8],
    }


def get_private_json(path:str)->tuple[dict,str]:
    file=private(Path(path))
    if not file.is_file():raise ValueError("Missing private PJS acoustic inference")
    raw=file.read_bytes()
    if len(raw)>160000:raise ValueError("Unbounded acoustic inference record")
    return json.loads(raw),sha(raw)


def evaluate(manifest_path:str=str(ROOT/"manifest.json"),
             native_path:str="/tmp/ear-pjs-two-singer-native-20261025.json")->dict:
    m,_=get_private_json(manifest_path)
    if (m.get("schema")!=SOURCE_SCHEMA
        or m.get("originalLicense")!="CC BY-SA 4.0"
        or m.get("manualLabelLicense")!="CC BY-SA 4.0"
        or m.get("manualLabelCommit")!="022d09bffeda9ca122d59a9e5ebfcedd98f5709a"
        or m.get("sourcePerformerCount")!=1
        or m.get("independentManualReannotationPresent") is not True
        or m.get("manualReannotationIsThirdIndependentAdjudication") is not False
        or m.get("englishPocketSphinxPhoneInventoryCompatible") is not False
        or m.get("recognitionModelApplied") is not False
        or m.get("sourceSingerVerifiedIndependentFromAIDolByIdentity") is not False
        or m.get("publicMediaReleased") is not False
        or m.get("trainingAuthorizedByThisImporter") is not False):
        raise ValueError("PJS source, rights or phoneme qualification falsely promoted")
    files=import_reference(download=False)["files"]
    if sorted((x["name"],x["sha256"])for x in m["files"])!=sorted(
        (x["name"],x["sha256"])for x in files):
        raise ValueError("PJS manifest to original WAV/label content drift")
    original=(ROOT/"pjs001-original.lab").read_bytes()
    manual=(ROOT/"pjs001-independent-manual-v2.lab").read_bytes()
    before=parse_labels(original,"original",16.0)
    after=parse_labels(manual,"manual",16.0)
    comparison=compare_versions(before,after)

    native,native_sha=get_private_json(native_path)
    if (native.get("schema")!="ear.private-apple-sound-diagnostic.v1"
        or native.get("model")!="Apple SoundAnalysis SNClassifierIdentifier.version1"
        or native.get("minimumWindowScore")!=.5
        or native.get("minimumEvidenceWindowFraction")!=.5
        or native.get("minimumWindows")!=2
        or native.get("noExpectedLyricsOrScoreAtInference") is not True
        or native.get("classEvidenceIsNotPhonemeConfidence") is not True
        or native.get("phonemeRecognitionQualified") is not False
        or native.get("mediaPublished") is not False):
        raise ValueError("Independent acoustic classifier contract drift")
    obs=native.get("observations",[])
    if len(obs)!=4 or len({x["sha256"]for x in obs})!=4:
        raise ValueError("Unbounded or duplicated acoustic witnesses")
    by_sha={x["sha256"]:x for x in obs}
    original_singer=EXPECTED_SHA256["Spectrum"]["wav"]
    pjs=EXPECTED["pjs001-song.wav"]
    female="d82ce344ad264b91924b823b046e6ec2779c8e5dcc7d26b89f5cddeadb0d3e7f"
    male="c18627d88576898b6b3a4f54a57b87a51a466e0382fc3e58ba4ccc69f16aaf7e"
    expected={
        pjs:("pjs001-song.wav",24,31,True),
        original_singer:("Spectrum.wav",80,85,True),
        female:("female9-straight-a.wav",11,14,True),
        male:("male2-straight-a.wav",9,20,False),
    }
    if set(by_sha)!=set(expected):
        raise ValueError("PJS independent acoustic input audio SHA mismatch")
    for digest,(filename,positives,total,passes) in expected.items():
        row=by_sha[digest]
        if (row.get("source")!=filename
            or row.get("expectedTestRole")!="candidate"
            or row.get("vocalEvidenceWindows")!=positives
            or row.get("windows")!=total
            or row.get("voiceEvidencePass") is not passes
            or row.get("phoneSequenceRecognized") is not False
            or row.get("humanIntelligibilityMeasured") is not False
            or row.get("calibratedVocalProbability") is not False):
            raise ValueError("Original vocal acoustic witness drift")
    return {
        "schema":SCHEMA,
        "status":"SECOND_SOURCED_SINGER_WITH_INDEPENDENT_MANUAL_REFERENCE_NOT_YET_CROSS_LANGUAGE_PHONE_QUALIFIED",
        "sourceManifestSHA256":sha(private(Path(manifest_path)).read_bytes()),
        "sourceWAVSHA256":pjs,
        "originalLabelSHA256":sha(original),
        "independentReannotationSHA256":sha(manual),
        "originalLabelHumanSecondAudit":False,
        "differentHumanReannotatorFromOriginalCorpusCreatorsDeclared":True,
        "independentManualRevisionIsNotThirdPartyAdjudicated":True,
        "manualRevisionTimeReference":comparison,
        "sourceJapanesePhonemeInventory":True,
        "originalEarEnglishPocketSphinxCanScoreJapanesePhones":False,
        "previousEnglishSingerHumanTimingReferenceStillOneSinger":True,
        "firstSingerAndSecondSingerDifferentSourceCorpus":True,
        "independentRealWorldPerformerIdentitiesNotAttested":True,
        "twoSingerSameLanguagePhonemeAccuracyAvailable":False,
        "newJapaneseSourceBlindPhonemeModel":"NOT_INSTALLED_OR_APPLIED",
        "unmodifiedAppleVocalDiagnostic":{
            "PJS": {"vocalPositiveWindows":24,"windows":31,"passed":True},
            "previousAIDol":{"vocalPositiveWindows":80,"windows":85,"passed":True},
            "vocalsetFemale9":{"vocalPositiveWindows":11,"windows":14,"passed":True},
            "vocalsetMale2":{"vocalPositiveWindows":9,"windows":20,"passed":False},
        },
        "nativeReceiptSHA256":native_sha,
        "humanIntelligibilityVerified":False,
        "phonemeRecognitionQualified":False,
        "trainingAuthorized":False,
        "voiceCloningOrBankAuthorized":False,
        "mediaPublished":False,
    }


def main():
    p=argparse.ArgumentParser()
    p.add_argument("--report",default="/tmp/ear-pjs-independent-label-witness-20261025.json")
    args=p.parse_args()
    r=evaluate()
    file=private(Path(args.report))
    file.write_text(json.dumps(r,indent=2,sort_keys=True)+"\n")
    c=r["manualRevisionTimeReference"]
    print(json.dumps({
        "status":r["status"],
        "originalPhones":c["originalPhoneCount"],
        "independentlyReannotatedPhones":c["manualReannotatedPhoneCount"],
        "identicalPhonePairs":c["phoneIdentityAlignedPairsBetweenTwoLabelVersions"],
        "eitherBoundaryChangedOver50ms":c["matchingPhonePairsWithEitherBoundaryMovedOver50ms"],
        "medianStartShiftMs":c["medianAbsoluteStartChangeMsOnIdenticalPhonePairs"],
        "medianEndShiftMs":c["medianAbsoluteEndChangeMsOnIdenticalPhonePairs"],
        "sourceBlindJapanesePhoneRecognitionQualified":False,
        "mediaPublished":False,
    },indent=2))


if __name__=="__main__":
    main()
