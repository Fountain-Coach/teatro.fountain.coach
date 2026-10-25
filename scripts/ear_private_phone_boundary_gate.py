#!/usr/bin/env python3
"""Ear: source-blind phone *identity plus boundary* evidence on real singing.

The pinned PocketSphinx all-phone decoder already ran on actual PCM with no
lyrics, phone labels, score, speaker ID or source timing. We verify its
original raw receipt and the separately owned, hashed published human-
curated HTK intervals, then calculate conservative one-to-one sequence-
aligned exact-phone AND temporal-boundary agreement. Labels are NEVER
provided to the decoder; this is post-inference evaluation only.

The reference annotations have NOT undergone an independent second human
audit, are ONE singer, and are not authorized as a Sing training bank.
A high metric on these fixtures can NEVER authorize the singer, voice,
publication or broad phoneme-recognition claim.
"""
from __future__ import annotations

import argparse
import hashlib
import json
import statistics
from pathlib import Path

from ear_private_allphone import (
    EXPECTED_ACOUSTIC_SHA256, PHONE_LM_SHA256,
    NOISE_SYMBOLS, REFERENCE_NONPHONES, error_counts, model_metadata,
)
from ear_private_sung_alignment import (
    TICKS_PER_SECOND, EXPECTED_SHA256, UPSTREAM_COMMIT,
    sha, private_path,
)
from ear_private_sung_timing_gate import verify_manifest

SCHEMA="ear.private-phone-boundary-witness.v1"
SOURCE_SCHEMA="ear.private-source-blind-allphone.v1"
TOLERANCES_MS=(50,100)
RESEARCH_F1_TARGET=.80  # declared BEFORE examining target boundary results


def private_file(path: str) -> Path:
    p=private_path(path)
    if not p.is_file():
        raise ValueError("Missing private Ear research receipt")
    return p


def read_report(path: str) -> tuple[dict,str]:
    raw=private_file(path).read_bytes()
    return json.loads(raw),sha(raw)


def checked_phones(segments: list[dict], duration_ms: float) -> list[dict]:
    if not isinstance(segments,list) or len(segments)>10000:
        raise ValueError("Unbounded phoneme decoder segmentation")
    out=[]
    previous_end=0
    for row in segments:
        if not isinstance(row,dict):
            raise ValueError("Malformed source-blind segment")
        start=row.get("startMs")
        end=row.get("endMs")
        symbol=row.get("symbol")
        if (type(start) is not int or type(end) is not int
            or start<previous_end or end<=start or end>duration_ms+80
            or not isinstance(symbol,str) or not symbol
            or len(symbol)>20):
            raise ValueError("Overlapping, invalid or unbounded raw phone interval")
        previous_end=end
        if symbol.upper() not in NOISE_SYMBOLS:
            out.append({"symbol":symbol.upper(),"startMs":start,"endMs":end})
    return out


def published_phone_times(intervals: list[dict]) -> list[dict]:
    """Published label timing, NOT independent phoneme identity truth."""
    out=[]
    previous_end=0
    for row in intervals:
        start=row["startTick100ns"]
        end=row["endTick100ns"]
        symbol=row["phone"].upper()
        if (type(start) is not int or type(end) is not int
            or start!=previous_end or end<=start):
            raise ValueError("Published HTK interval structure changed")
        previous_end=end
        if symbol not in REFERENCE_NONPHONES:
            out.append({
                "symbol":symbol,
                "startMs":start/(TICKS_PER_SECOND/1000),
                "endMs":end/(TICKS_PER_SECOND/1000),
            })
    if len(out)<50:
        raise ValueError("Singing source missing published reference phones")
    return out


def sequence_alignment(reference: list[dict], predicted: list[dict]) -> list[tuple[int,int]]:
    """Deterministic minimum-edit one-to-one matches; NO forced audio alignment.

    Phone labels are used only here after source-blind decoding. Exact
    diagonal preference removes arbitrary tie drift. Never align a model to
    reference times or change phone identities to improve a result.
    """
    n,m=len(reference),len(predicted)
    if n>1500 or m>1500:
        raise ValueError("Unexpectedly large evaluation phone sequence")
    dp=[list(range(m+1))]
    for i in range(1,n+1):
        row=[i]+[0]*m
        for j in range(1,m+1):
            cost=int(reference[i-1]["symbol"]!=predicted[j-1]["symbol"])
            row[j]=min(dp[i-1][j]+1,row[j-1]+1,dp[i-1][j-1]+cost)
        dp.append(row)
    i,j=n,m
    exact=[]
    while i or j:
        if (i and j and reference[i-1]["symbol"]==predicted[j-1]["symbol"]
            and dp[i][j]==dp[i-1][j-1]):
            exact.append((i-1,j-1))
            i-=1
            j-=1
        elif i and j and dp[i][j]==dp[i-1][j-1]+1:
            i-=1
            j-=1
        elif i and dp[i][j]==dp[i-1][j]+1:
            i-=1
        elif j and dp[i][j]==dp[i][j-1]+1:
            j-=1
        else:
            raise ValueError("Internal deterministic sequence alignment failure")
    exact.reverse()
    if (len(set(i for i,_ in exact))!=len(exact)
        or len(set(j for _,j in exact))!=len(exact)):
        raise ValueError("A reference phone was assigned more than once")
    return exact


def score_timing(reference: list[dict], predicted: list[dict]) -> dict:
    """Calculate strict phone+two-boundary F1 at frozen 50ms and 100ms."""
    exact_pairs=sequence_alignment(reference,predicted)
    baseline=error_counts([p["symbol"]for p in reference],
                          [p["symbol"]for p in predicted])
    if baseline["exactMatchesInBestEditPath"]!=len(exact_pairs):
        raise ValueError("Exact edit-path identities differ from baseline")
    errors=[]
    for i,j in exact_pairs:
        r,p=reference[i],predicted[j]
        errors.append({
            "startMs":p["startMs"]-r["startMs"],
            "endMs":p["endMs"]-r["endMs"],
        })
    n,m=len(reference),len(predicted)
    def stats(hits):
        return {
            "phoneAndBothBoundariesCorrect":hits,
            "strictReferenceRecall":round(hits/n,4)if n else 0.,
            "strictPredictedPrecision":round(hits/m,4)if m else 0.,
            "strictF1":round(2*hits/(n+m),4)if n+m else 0.,
        }
    by_tolerance={}
    for ms in TOLERANCES_MS:
        hits=sum(abs(x["startMs"])<=ms and abs(x["endMs"])<=ms
                 for x in errors)
        by_tolerance[str(ms)]=stats(hits)
    absolute_starts=[abs(x["startMs"])for x in errors]
    absolute_ends=[abs(x["endMs"])for x in errors]
    return {
        "referencePhoneCount":n,
        "predictedPhoneCount":m,
        "strictPhoneSequenceErrorRate":baseline["phoneErrorRate"],
        "strictPhoneSequenceEditCount":baseline["edits"],
        "sequenceAlignedIdenticalPhones":len(exact_pairs),
        "identityOnlyF1":stats(len(exact_pairs))["strictF1"],
        "sourceBlindPhoneAndBothBoundariesAtMs":by_tolerance,
        "medianStartErrorMsOnIdentityPairs":(
            round(statistics.median(absolute_starts),2)
            if absolute_starts else None),
        "medianEndErrorMsOnIdentityPairs":(
            round(statistics.median(absolute_ends),2)
            if absolute_ends else None),
        "timeToleranceFrozenBeforeWitness":True,
        "referenceTimesUsedByInference":False,
        "notIndependentlyAuditedPhoneGroundTruth":True,
    }


def verify(receipt_path: str, reference_path: str) -> dict:
    report,report_sha=read_report(receipt_path)
    source=verify_manifest(reference_path)
    manifest=source["source"]
    _,_,local_model=model_metadata()
    if (report.get("schema")!=SOURCE_SCHEMA
        or report.get("status")!="raw-phone-hypotheses-unqualified"
        or report.get("model")!=local_model
        or report.get("model",{}).get("phonemeLanguageModelSHA256")!=PHONE_LM_SHA256
        or report.get("model",{}).get("acousticModelFileSHA256")!=EXPECTED_ACOUSTIC_SHA256
        or report.get("confidenceCalibrated") is not False
        or report.get("phonemeRecognitionQualified") is not False
        or report.get("modelTrainedOrTunedOnReference") is not False
        or report.get("independentSingerHeldOut") is not False
        or report.get("mediaPublished") is not False
        or report.get("recognizerPhonemesAreRawHypotheses") is not True
        or manifest.get("sourceCommit")!=UPSTREAM_COMMIT
        or manifest.get("independentEarPhonemeAudit") is not False
        or manifest.get("sourceSingerCount")!=1
        or manifest.get("trainingAuthorizedByThisImporter") is not False
        or manifest.get("copyrightOfSongsClearedByThisTest") is not False):
        raise ValueError("Source-blind model, rights or recognition provenance overclaim")

    predictions=report.get("predictions")
    if not isinstance(predictions,list) or len(predictions)>16:
        raise ValueError("Invalid source-blind allphone receipt")
    seen=set()
    by_digest={}
    for r in predictions:
        digest=r.get("originalAudioSHA256")
        if not isinstance(digest,str) or len(digest)!=64 or digest in seen:
            raise ValueError("Duplicate or foreign source-blind PCM SHA")
        seen.add(digest)
        if (r.get("groundTruthSuppliedDuringInference") is not False
            or r.get("referenceLyricsSuppliedDuringInference") is not False
            or r.get("hasCalibratedConfidence") is not False
            or r.get("rawPhonemeHypotheses") is None
            or r.get("sourceDurationSeconds") is None):
            raise ValueError("Reference timing/lyrics leakage or model confidence overclaim")
        checked=checked_phones(r["segments"],r["sourceDurationSeconds"]*1000)
        if len(checked)!=r["rawPhonemeHypotheses"]:
            raise ValueError("Reported allphone hypothesis count drifted")
        by_digest[digest]=(r,checked)
    if not isinstance(report.get("negativeControls"),list):
        raise ValueError("Missing independent non-speech negatives")
    if sum(x["phonemeFalsePositives"]for x in report["negativeControls"])!=report.get("negativeFalsePositiveCount"):
        raise ValueError("Original false phone negative control changed")

    witnesses=[]
    singers=set()
    for record,audio,rate,intervals in source["audios"]:
        expected=EXPECTED_SHA256[record["id"]]
        if (record["audioSHA256"]!=expected["wav"]
            or record["labelSHA256"]!=expected["lab"]
            or sha(private_file(record["audioPath"]).read_bytes())!=expected["wav"]
            or sha(private_file(record["labelPath"]).read_bytes())!=expected["lab"]
            or record["audioSHA256"] not in by_digest):
            raise ValueError("Publisher source-label pair or decoded source SHA mismatch")
        raw,predicted=by_digest[record["audioSHA256"]]
        if raw["sourceId"]!=Path(record["audioPath"]).name:
            raise ValueError("Sung source name mismatched decoded PCM")
        if abs(raw["sourceDurationSeconds"]-record["frameCount"]/rate)>.01:
            raise ValueError("Sung source duration changed during source-blind inference")
        reference=published_phone_times(intervals)
        temporal=score_timing(reference,predicted)
        prior=[x for x in report["humanSungReference"]["evaluation"]
               if x["source"]==record["id"]]
        if (len(prior)!=1
            or prior[0]["sourceSHA256"]!=record["audioSHA256"]
            or prior[0]["strict"]["phoneErrorRate"]!=temporal["strictPhoneSequenceErrorRate"]
            or prior[0]["strict"]["edits"]!=temporal["strictPhoneSequenceEditCount"]):
            raise ValueError("Original human-sung phone error witness changed")
        singers.add(record["speaker"])
        witnesses.append({
            "source":record["id"],
            "sourceSHA256":record["audioSHA256"],
            "publishedLabelSHA256":record["labelSHA256"],
            "split":record["split"],
            "timedLabelProvenance":record["labelOrigin"],
            **temporal,
        })
    if (len(witnesses)!=2 or len(singers)!=1
        or report["humanSungReference"]["speakerDisjointReference"] is not False
        or report["humanSungReference"]["recognizerAccuracyQualified"] is not False
        or report["humanSungReference"]["publishedPhoneLabelsIndependentlyReaudited"] is not False):
        raise ValueError("A second singer, audited labels or recognition was falsely claimed")

    return {
        "schema":SCHEMA,
        "status":"BOUNDED_PHONE_TIME_DIAGNOSTIC_ONLY_RECOGNITION_BLOCKED",
        "sourceBlindAllphoneReceiptSHA256":report_sha,
        "humanTimedReferenceManifestSHA256":sha(private_file(reference_path).read_bytes()),
        "model":local_model["decoder"],
        "modelVersion":local_model["version"],
        "modelPhoneLMSHA256":local_model["phonemeLanguageModelSHA256"],
        "singerCount":1,
        "tracks":2,
        "independentSecondSinger":False,
        "humanTimedLabelsPublished":True,
        "humanTimedLabelsIndependentlyReaudited":False,
        "phonemeIdentityRecognitionQualified":False,
        "referenceAudioUsedForTraining":False,
        "referenceSourceLyricsPassedToInference":False,
        "referenceSourcePhoneTimesPassedToInference":False,
        "phoneTimeTolerancesMs":list(TOLERANCES_MS),
        "exploratoryPhoneAndBoundaryF1Target":RESEARCH_F1_TARGET,
        "negativeRawFalsePhonesUnchanged":report["negativeFalsePositiveCount"],
        "witnesses":witnesses,
        "singSpeechSourceBoundaryTruth":"NOT_SUPPLIED",
        "singVoicebankRightsGranted":False,
        "copyrightOfSongsCleared":False,
        "humanListenerIntelligibility":"NOT_TESTED",
        "mediaPublished":False,
    }


def main() -> None:
    p=argparse.ArgumentParser()
    p.add_argument("--allphone",required=True)
    p.add_argument("--human-sung-reference",required=True)
    p.add_argument("--report",default="/tmp/ear-phoneme-boundary-witness.json")
    args=p.parse_args()
    output=verify(args.allphone,args.human_sung_reference)
    dest=private_path(args.report)
    if not dest.parent.is_dir():
        p.error("Private output directory does not exist")
    dest.write_text(json.dumps(output,sort_keys=True,indent=2)+"\n")
    print(json.dumps({
        "status":output["status"],
        "model":output["model"],
        "oneSingerOnly":True,
        "sourceBlindInference":True,
        "witnesses":[{
            "source":w["source"],
            "sequencePhoneErrorRate":w["strictPhoneSequenceErrorRate"],
            "identityF1":w["identityOnlyF1"],
            "time50ms":w["sourceBlindPhoneAndBothBoundariesAtMs"]["50"],
            "time100ms":w["sourceBlindPhoneAndBothBoundariesAtMs"]["100"],
        }for w in output["witnesses"]],
        "phonemeRecognitionQualified":False,
        "mediaPublished":False,
        "report":str(dest),
    },indent=2))


if __name__=="__main__":
    main()
