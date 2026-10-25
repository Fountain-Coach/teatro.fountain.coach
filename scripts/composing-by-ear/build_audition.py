#!/usr/bin/env python3
"""Project one independently witnessed original Sing/Ear/MIDI2/Csound result
onto the EXISTING private WLAN static release. No source media enters Git.
The published HTML body is source owned; evidence is runtime owned.
"""
from pathlib import Path
from hashlib import sha256
from string import Template
import json
import shutil
import subprocess
import sys
import wave

HERE=Path(__file__).resolve().parent
DEFAULT_EVIDENCE=Path("/tmp/fc-composing-by-ear/evidence")
EVIDENCE=Path(sys.argv[1] if len(sys.argv)>1 else DEFAULT_EVIDENCE).resolve()
OUTPUT=Path(sys.argv[2] if len(sys.argv)>2 else "/tmp/fc-composing-by-ear/stage-overlay").resolve()
assert HERE not in OUTPUT.parents and OUTPUT != HERE
DEST=OUTPUT/"teatro/experiments/composing-by-ear"
SHA_SOURCE="1d285c6b0a9dd2f7b7be58aac1509b5f55bcac5e3636c530cbec25f20db8f505"
SHA_EAR="4f1d800fd5518975c0bc98a5fb0ace93eaa726d8731bf330a8eff59a9d115427"
digest=lambda p:sha256(p.read_bytes()).hexdigest()
data=json.loads((EVIDENCE/"acceptance.json").read_text())
assert data["status"]=="passed" and data["directSourceSHA256"]==SHA_SOURCE
assert data["compared"]["route"]=="existing local MIDI2 64-bit UMP CC74 bus; NOT external hardware MIDI2"
assert data["compared"]["acceptedUMP"]>=30 and data["compared"]["csoundMappingsApplied"]>=15
assert data["compared"]["controlMappingsApplied"]==0
assert data["compared"]["bothContextsClosed"] is True
assert data["errors"]==[]
assert data["compared"]["backpressureDrops"]==0
assert 1.35<data["compared"]["measuredChangeRatio"]<10
for mode in ("control","composed"):
    entry=data[mode]
    assert entry["sourceSHA256"]==SHA_SOURCE
    assert entry["closed"] is True
    assert entry["auditionGainLinear"]==120
    assert entry["route"]=="browser-local UMP, not external MIDI2"
    assert entry["recognizedPitch"] is False and entry["recognizedPhonemes"] is False
    assert entry["csoundImplementation"]=="@csound/browser AudioWorklet"
    assert entry["csoundEarSource"]=="teatro-csound-audioworklet"
    assert entry["csoundEarWindows"]>=100 and entry["sourceEarWindows"]>=100
    assert entry["output"]["peak"]*entry["auditionGainLinear"]<0.9
    wav=EVIDENCE/("csound-by-ear.wav" if mode=="composed" else "csound-control.wav")
    assert digest(wav)==data[("composedSHA256" if mode=="composed" else "controlSHA256")]
    with wave.open(str(wav)) as recorded:
        assert (recorded.getnchannels(),recorded.getframerate(),recorded.getsampwidth())==(2,48000,2)
        assert recorded.getnframes()==entry["capturedFrames"]
if OUTPUT.exists():
    assert not any(p.is_file() for p in OUTPUT.rglob("*")), "Do not replace an existing staged proof"
DEST.mkdir(parents=True,exist_ok=True)
recordings={}
for stem in ("csound-control","csound-by-ear"):
    inp=EVIDENCE/(stem+".wav")
    out=DEST/(stem+".m4a")
    subprocess.run(["/usr/bin/afconvert","-f","m4af","-d","aac","-b","128000",str(inp),str(out)],check=True)
    report=subprocess.run(["/usr/bin/afinfo",str(out)],check=True,capture_output=True,text=True).stdout
    assert "2 ch,  48000 Hz, aac" in report and "estimated duration: 5.957333 sec" in report,report
    recordings[stem+".m4a"]={"sha256":digest(out),"bytes":out.stat().st_size,
        "encoding":"AAC 48kHz 2-channel, playback gained 120x from real Csound PCM"}
template=(HERE/"audition-template.html").read_text()
changes={
 "{{UMP_EVENTS}}":str(data["compared"]["acceptedUMP"]),
 "{{APPLIED}}":str(data["compared"]["csoundMappingsApplied"]),
 "{{RATIO}}":f'{data["compared"]["measuredChangeRatio"]:.2f}',
 "{{DROPPED}}":str(data["compared"]["backpressureDrops"]+
                  data["control"]["rejected"]+data["composed"]["rejected"]),
 "{{SOURCE_DIGEST}}":SHA_SOURCE
}
for field,value in changes.items():
    assert template.count(field)>=1,field
    template=template.replace(field,value)
assert "{{" not in template
assert template.count("csound-control.m4a")==1 and template.count("csound-by-ear.m4a")==1
(DEST/"index.html").write_text(template)
report={
 "kind":"fountain.composing-by-ear.private-static-audition.v1",
 "authorPublished":False,"sourceOwner":"Fountain-Coach/teatro.fountain.coach",
 "sourceAudioOwner":"Fountain-Coach/sing","stage":"owner-WLAN-preview-only",
 "inputSourceID":data["source"],"originalSingWAVSHA256":SHA_SOURCE,
 "shippedEarWorkletSHA256":SHA_EAR,
 "sourceEarWindows":data["composed"]["sourceEarWindows"],
 "csoundEarWindows":data["composed"]["csoundEarWindows"],
 "UMP":{"type":"MIDI2 Channel Voice 64-bit CC","controller":74,"group":0,"channel":0,
        "accepted":data["compared"]["acceptedUMP"],"applied":data["compared"]["csoundMappingsApplied"]},
 "controlUnmapped":True,"measurementRaw":{"controlRMS":data["compared"]["controlRMS"],
     "composedRMS":data["compared"]["composedRMS"],"ratio":data["compared"]["measuredChangeRatio"]},
 "feedbackEnabled":False,"nativeMIDI2Port":False,"humanPhonemeRecognition":False,
 "bothAudioContextsClosed":data["compared"]["bothContextsClosed"],
 "stageMedia":recordings,"auditionHTMLSHA256":digest(DEST/"index.html"),
 "privateWAVSourceSHA256":{"csound-control.wav":data["controlSHA256"],
                           "csound-by-ear.wav":data["composedSHA256"]}
}
# Keep private root-lock digest witness independent of served evidence JSON.
Path("/tmp/fc-composing-by-ear/stage-receipt.json").write_text(json.dumps(report,indent=2)+"\n")
assert len([p for p in OUTPUT.rglob("*") if p.is_file()])==3
assert not list(OUTPUT.rglob("*.wav"))
for p in DEST.iterdir():
    print("STAGE_ASSET",p.relative_to(OUTPUT),p.stat().st_size,digest(p))
print("ACCEPTED_PRIVATE_EAR_CSOUND_AUDITION",f"{report['measurementRaw']['ratio']:.3f}x",
      "UMP",report["UMP"]["accepted"],"applied",report["UMP"]["applied"])
