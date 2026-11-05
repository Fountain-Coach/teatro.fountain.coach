#!/usr/bin/env python3
"""An ORIGINAL slow soul-jazz audio object, not a transcription or record sample.

Makes a new resonant phrase: brushed shell, rounded low tone, dissonant
metallic notes and air.  No audio from Lou Donaldson or other copyrighted
recordings is incorporated or re-created note-for-note.
"""
from pathlib import Path
import subprocess,json,hashlib
root=Path(__file__).resolve().parents[2]
src=root/"scripts/kino-interlude"
renders=src/"source-renders"
assets=root/"site/interludes/kino/assets/midnight"
renders.mkdir(parents=True,exist_ok=True)
assets.mkdir(parents=True,exist_ok=True)
# Csound implements original timbre and original, deliberately non-quoting phrase.
orchestra=r"""
sr=44100
ksmps=64
nchnls=2
0dbfs=1

giwave ftgen 1,0,16384,10,1,.18,.06,.017
gisine ftgen 2,0,16384,10,1

instr 1
  ; A soft struck bar with jazz-like shimmer and nonharmonic partials.
  iHz cpsmidinn p4
  iAmp=p5
  aEnv expseg .001,.009,1,p3-.009,.0005
  a1 oscili .24,iHz,1
  a2 oscili .075,iHz*2.008,2
  a3 oscili .034,iHz*3.937,2
  a4 oscili .017,iHz*.503,2
  kSway lfo .007,.62
  aMix=(a1+a2+a3+a4)*aEnv*iAmp
  aMix butterlp aMix,2800
  outs aMix*(.92+kSway), aMix*(.85-kSway)
endin

instr 2
  ; Muted single low string: a few breaths, not a repeating bassline.
  iHz cpsmidinn p4
  iAmp=p5
  aBody oscili .20,iHz,1
  aOct oscili .09,iHz*.5,2
  aEnv linseg 0,.025,1,.13,.67,p3-.155,0
  aLow butterlp (aBody+aOct)*aEnv,520
  outs aLow*iAmp,aLow*iAmp
endin

instr 3
  ; Finger-brush texture (not a backbeat): short high colored noise.
  aNoise rand .13
  aNoise butterhp aNoise,2700
  aNoise butterlp aNoise,7400
  aEnv linen 1,.03,p3,.22
  outs aNoise*aEnv*p4*.78,aNoise*aEnv*p4*.61
endin

instr 4
  ; Exhaled hollow tone with tiny analogue detuning.
  iHz cpsmidinn p4
  aA oscili .09,iHz,1
  aB oscili .045,iHz*1.004,2
  aNoise rand .004
  aEnv linseg 0,.18,.8,p3-.85,.65,.67,0
  aTone butterlp (aA+aB+aNoise)*aEnv,1450
  outs aTone*p5*.82,aTone*p5*.90
endin

instr 5
  ; Deliberate end-to-end fade so repeated excerpts never click.
  ; The main recording envelope is rendered here, not in the authoring source.
  aInL,aInR monitor
endin
"""
# Original note sequence: avoids the iconic record's actual recorded phrase.
# p4=midinote, p5=intensity; one muted low note supports short melodic scraps.
events=[
 ("i 1 .38 2.50 67 .54"),
 ("i 1 1.92 1.80 64 .45"),
 ("i 1 3.85 2.40 70 .43"),
 ("i 1 5.67 2.10 65 .43"),
 ("i 1 7.43 2.25 69 .35"),
 ("i 2 .22 2.00 41 .37"),
 ("i 2 4.55 1.88 46 .31"),
 ("i 3 1.12 .25 .29"),
 ("i 3 3.42 .34 .23"),
 ("i 3 6.12 .31 .21"),
 ("i 3 8.12 .29 .16"),
 ("i 4 2.57 3.50 53 .31"),
 ("i 4 6.60 2.70 56 .23"),
]
duration=10.3
score="\n".join(events)+f"\nf0 {duration:.5f}\ne\n"
csd=src/"midnight-cylinder.csd"
csd.write_text("<CsoundSynthesizer>\n<CsOptions>\n-d -W\n</CsOptions>\n<CsInstruments>\n"+orchestra+"\n</CsInstruments>\n<CsScore>\n"+score+"\n</CsScore>\n</CsoundSynthesizer>\n")
wav=renders/"midnight-cylinder.wav"
result=subprocess.run(["csound","-d","-W","-o",str(wav),str(csd)],capture_output=True,text=True)
log=result.stdout+result.stderr
if result.returncode or "0 errors in performance" not in log:
    print(log[-5000:]);raise RuntimeError("Original Csound instrument render failed")
aac=assets/"midnight-cylinder.m4a"
subprocess.run(["afconvert","-f","m4af","-d","aac","-b","128000",str(wav),str(aac)],check=True)
def sha(p):return hashlib.sha256(p.read_bytes()).hexdigest()
manifest={
 "schema":"fountain.teatro.original-acoustic-cinema-phrase.v1",
 "title":"Midnight Cylinder",
 "kind":"original-csound-jazz-memory",
 "sourceRecordingUsed":False,
 "reference":"General 1960s soul-jazz timbral sensibility, not the Lou Donaldson recording",
 "composition":"Original non-quoting resonant notes, muted isolated bass, brush grains and hollow breath",
 "noTranscribedMelody":True,
 "noChords":True,
 "tempo":"non-metric",
 "durationSeconds":duration,
 "aac":"assets/midnight/midnight-cylinder.m4a",
 "sha256":sha(aac),
 "sourceWAV":"scripts/kino-interlude/source-renders/midnight-cylinder.wav",
 "sourceWAVSHA256":sha(wav),
 "publicRights":"Original sound synthesis; no copyrighted source audio",
 "maxIntendedRoomLevel":0.15
}
(assets/"sources.json").write_text(json.dumps(manifest,indent=2)+"\n")
print("ORIGINAL_MIDNIGHT_CYLINDER_OK",aac.stat().st_size,sha(aac),"duration",duration)
