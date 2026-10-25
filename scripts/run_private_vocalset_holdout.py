#!/usr/bin/env python3
"""Ear-owned end-to-end two-singer vocal-sound holdout (not phoneme timing).

Automatically verifies the ORIGINAL rights-scoped, SHA-addressed VocalSet
audio, compiles the existing first-party Apple sound event classifier and
evaluates a fixed, source-blind five-WAV cohort. MacOS 26+ only; no new
model packages, no GitHub CI, no samples or synthesis instruments published.
This is a separate diagnostic scenario, not a change to the canonical
Sing acceptance or to Ear's source-blind phone decoder.
"""
from __future__ import annotations

import argparse
import json
from pathlib import Path
import platform
import subprocess
import sys
import tempfile

from ear_private_vocalset_holdout import ROOT,fetch_selection
from ear_private_vocalset_holdout_gate import (
    PREVIOUS_SING_WAVS,ORIGINAL_SINGER_WAV,
    evaluate,verified_sources
)
from ear_private_sung_alignment import private_path

SCRIPTS=Path(__file__).resolve().parent


def run(command:list[str],timeout:int=120)->str:
    p=subprocess.run(command,stdout=subprocess.PIPE,stderr=subprocess.PIPE,
                     text=True,timeout=timeout,check=False)
    if p.returncode:
        raise RuntimeError(
            f"Owner command failed (exit {p.returncode}) "
            + (p.stderr or p.stdout)[-900:]
        )
    return p.stdout


def execute(source_path:str,raw_path:str,result_path:str)->dict:
    if platform.system()!="Darwin":
        raise RuntimeError("The independent Apple sound-event lane requires macOS")
    for path in (raw_path,result_path):
        p=private_path(path)
        if not p.parent.is_dir():
            raise ValueError("All private result directories must exist")
    _,records=verified_sources(source_path)
    original=Path("/tmp/ear-sung-human-timed-20261024")/ORIGINAL_SINGER_WAV
    candidates=[Path(r["audioPath"]) for r in records]
    candidates.append(original)
    candidates.extend(Path("/tmp")/name for name in PREVIOUS_SING_WAVS)
    if len(candidates)!=5:
        raise RuntimeError("Selected vocal comparison is not frozen")
    with tempfile.TemporaryDirectory(dir="/tmp",prefix="ear-vocalset-owner-") as root:
        executable=Path(root)/"ear-apple-native-sound"
        run(["/usr/bin/swiftc","-O",
             str(SCRIPTS/"ear_private_apple_sound_gate.swift"),
             "-o",str(executable)],timeout=110)
        output=run([str(executable),*[
            arg for file in candidates for arg in ("--candidate",str(file))
        ]],timeout=110)
        native=json.loads(output)
        raw=private_path(raw_path)
        if raw.exists():
            previous=json.loads(raw.read_text())
            if previous!=native:
                raise ValueError("Reproduced macOS classifier result changed: preserve original private witness")
        else:
            raw.write_text(json.dumps(native,indent=2,sort_keys=True)+"\n")
    result=evaluate(source_path,raw_path)
    receipt=private_path(result_path)
    if receipt.exists() and json.loads(receipt.read_text())!=result:
        raise ValueError("Reproduced two-singer acoustic verification drift")
    receipt.write_text(json.dumps(result,indent=2,sort_keys=True)+"\n")
    return result


def main():
    parser=argparse.ArgumentParser()
    parser.add_argument("--source",default=str(ROOT/"manifest.json"))
    parser.add_argument("--raw",default="/tmp/ear-vocalset-two-singer-native-events.json")
    parser.add_argument("--report",default="/tmp/ear-vocalset-two-singer-acoustic-witness-20261025.json")
    parser.add_argument("--refresh-source-license",action="store_true")
    args=parser.parse_args()
    if args.refresh_source_license:
        fetch_selection(ROOT)
    r=execute(args.source,args.raw,args.report)
    print(json.dumps({
        "status":r["status"],
        "macOSBuild":r["nativeOSBuild"],
        "speakerIDs":r["datasetSpeakerIDs"],
        "vocalEvidence":[{
            "speaker":x["speakerID"],"windows":[x["vocalEvidenceWindows"],x["windows"]],
            "passedOriginalThreshold":x["passesOriginalFrozenSoundGate"],
        }for x in r["datasetSingerAcousticWitnesses"]],
        "bothSingersPass":r["allDatasetSingerAcousticChecksPass"],
        "phonemeRecognitionQualified":False,
        "humanListenerIntelligibility":"NOT_MEASURED",
        "mediaPublished":False,
    },indent=2))


if __name__=="__main__":
    main()
