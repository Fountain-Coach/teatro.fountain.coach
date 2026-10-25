#!/usr/bin/env python3
"""Ear owner-runner: reproducible PJS independent manual annotation witness.

No language-model inference, no target phonemes supplied to a recognizer.
The PJS reference is Japanese: the prior English PocketSphinx decoder
CANNOT be used to claim Japanese phone correctness. This run compares
annotation versions and invokes the original sound-event model only.
"""
from __future__ import annotations

import argparse
import json
from pathlib import Path
import platform
import subprocess
import tempfile

from ear_private_pjs_manual_source import ROOT,import_reference
from ear_private_pjs_label_gate import evaluate
from ear_private_sung_alignment import private_path
from ear_private_vocalset_holdout import ROOT as VOCALSET_ROOT

SCRIPTS=Path(__file__).resolve().parent
HUMAN_SUNG=Path("/tmp/ear-sung-human-timed-20261024/Spectrum.wav")


def command(arguments:list[str],timeout:int=115)->str:
    result=subprocess.run(arguments,stdout=subprocess.PIPE,stderr=subprocess.PIPE,
                          text=True,timeout=timeout,check=False)
    if result.returncode:
        raise ValueError("Source-bound private owner command failed: "+
                         (result.stderr or result.stdout)[-800:])
    return result.stdout


def run(manifest:str,raw:str,report:str,fetch:bool=False)->dict:
    if platform.system()!="Darwin":
        raise ValueError("Mac-owned Apple SoundAnalysis source verifier required")
    source=import_reference(download=fetch)
    if source["schema"]!="ear.private-pjs-independent-timed-singing.v1":
        raise ValueError("Private PJS source schema drift")
    files=[
        ROOT/"pjs001-song.wav",
        HUMAN_SUNG,
        VOCALSET_ROOT/"female9-straight-a.wav",
        VOCALSET_ROOT/"male2-straight-a.wav",
    ]
    if len(files)!=4 or len(set(str(x.resolve()) for x in files))!=4:
        raise ValueError("Source-blind acoustic control selection drift")
    for file in files:
        if not file.is_file():raise ValueError("Required original source absent")
    with tempfile.TemporaryDirectory(dir="/tmp",prefix="ear-pjs-manual-owner-") as temp:
        binary=Path(temp)/"original-ear-native-sound"
        command(["/usr/bin/swiftc","-O",str(SCRIPTS/"ear_private_apple_sound_gate.swift"),
                 "-o",str(binary)])
        observed=command([str(binary),*[
            arg for path in files for arg in ("--candidate",str(path))
        ]])
        native=json.loads(observed)
        destination=private_path(raw)
        if destination.exists():
            if json.loads(destination.read_text())!=native:
                raise ValueError("Original Apple vocal classifier replay drift")
        else:
            destination.write_text(json.dumps(native,indent=2,sort_keys=True)+"\n")
    result=evaluate(manifest,raw)
    output=private_path(report)
    if output.exists() and json.loads(output.read_text())!=result:
        raise ValueError("Original Japanese reference audit replay drift")
    output.write_text(json.dumps(result,indent=2,sort_keys=True)+"\n")
    return result


def main():
    p=argparse.ArgumentParser()
    p.add_argument("--fetch",action="store_true")
    p.add_argument("--manifest",default=str(ROOT/"manifest.json"))
    p.add_argument("--raw",default="/tmp/ear-pjs-two-singer-native-20261025.json")
    p.add_argument("--report",default="/tmp/ear-pjs-independent-label-witness-20261025.json")
    args=p.parse_args()
    result=run(args.manifest,args.raw,args.report,args.fetch)
    c=result["manualRevisionTimeReference"]
    print(json.dumps({
        "status":result["status"],
        "originalPhones":c["originalPhoneCount"],
        "externalHumanReannotatedPhones":c["manualReannotatedPhoneCount"],
        "identityMatched":c["phoneIdentityAlignedPairsBetweenTwoLabelVersions"],
        "bothLanguageCompatible":result["twoSingerSameLanguagePhonemeAccuracyAvailable"],
        "PJSVocalEvidence":result["unmodifiedAppleVocalDiagnostic"]["PJS"],
        "phonemeRecognitionQualified":False,
        "mediaPublished":False
    },sort_keys=True,indent=2))


if __name__=="__main__":
    main()
