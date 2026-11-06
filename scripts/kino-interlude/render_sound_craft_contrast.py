#!/usr/bin/env python3
"""Two real Csound interpretations of one original Kino After Dark source score.

A: bare, dry, literal construction. B: articulated material, room, decay.
Both use the SAME score events, source composition, duration and renderer.
These are private artistic audition candidates, not an accepted quality rating.
"""
from pathlib import Path
import hashlib
import json
import math
import subprocess
import wave

ROOT = Path(__file__).resolve().parents[2]
TARGET = ROOT / "scripts/kino-interlude/sound-craft-contrast"
RENDER = TARGET / "source-renders"
AAC = TARGET / "media"
for p in (TARGET,RENDER,AAC):p.mkdir(parents=True,exist_ok=True)
OPTIONS = """<CsoundSynthesizer>
<CsOptions>
-d -W
</CsOptions>
<CsInstruments>
sr=48000
ksmps=64
nchnls=2
0dbfs=1
giSine ftgen 1,0,16384,10,1
"""
SCORE = """
</CsInstruments>
<CsScore>
; one original score; no loop, no historic sample, no periodized groove
i 99 0 16
i 3 0 16
i 1 1.00 2.80 41 .74
i 2 3.28 2.25 67 .57
i 1 6.18 3.15 39 .61
i 2 8.42 2.90 63 .51
i 1 10.82 3.10 44 .56
f0 16
e
</CsScore>
</CsoundSynthesizer>
"""
# Stage A intentionally exposes common defects: repeated uniform envelope,
# unrelated static noise, mono image, no depth or response to the material.
A = """
instr 1
  iHz cpsmidinn p4
  aTone oscili .32*p5,iHz,1
  aEnv linen 1,.004,p3,.04
  aOut=aTone*aEnv
  outs aOut*.70,aOut*.70
endin
instr 2
  iHz cpsmidinn p4
  aTone oscili .21*p5,iHz*2,1
  aEnv linen 1,.004,p3,.05
  outs aTone*aEnv*.70,aTone*aEnv*.70
endin
instr 3
  aNoise rand .055
  aNoise butterhp aNoise,2200
  aNoise butterlp aNoise,5700
  outs aNoise*.42*.70,aNoise*.42*.70
endin
instr 99
  ; no room model
endin
"""
# Stage B is a proposed better-directed sonic *attempt*, not declared high-end.
# The same events gain articulated resonant materials and situated room tails.
B = """
gaBusL init 0
gaBusR init 0
instr 1
  iHz cpsmidinn p4
  iVel=p5
  aEnv linseg 0,.028,1,.20,.74,p3-.88,.58,.652,0
  aCore oscili .19,iHz,1
  aUpper oscili .09,iHz*2.007,1
  aWood oscili .043,iHz*3.021,1
  aSub oscili .07,iHz*.5,1
  aBreath rand .008
  aAttack expseg .0001,.008,1,.065,.0001,p3-.073,.0001
  aTransient butterlp aBreath*aAttack,1100
  aBody butterlp (aCore+aUpper+aWood+aSub)*aEnv+aTransient,1700
  kDrift lfo .035,.12,0
  aOut=aBody*iVel
  gaBusL=gaBusL+aOut*(.86+kDrift)
  gaBusR=gaBusR+aOut*(.81-kDrift)
endin
instr 2
  iHz cpsmidinn p4
  iVel=p5
  aEnv expseg .0001,.019,1,p3-.019,.0001
  aA oscili .14,iHz,1
  aB oscili .095,iHz*2.017,1
  aC oscili .054,iHz*3.92,1
  aD oscili .021,iHz*5.11,1
  aNoise rand .011
  aClick butterhp aNoise,2600
  aClick linen aClick,.002,p3,.18
  aTone butterlp (aA+aB+aC+aD)*aEnv+aClick,5500
  kMove lfo .18,.071,0
  gaBusL=gaBusL+aTone*iVel*(.75+kMove)
  gaBusR=gaBusR+aTone*iVel*(.82-kMove)
endin
instr 3
  aAir rand .18
  aAir butterlp aAir,1800
  aAir butterhp aAir,95
  aHiss rand .03
  aHiss butterhp aHiss,3500
  kEnv linseg 0,1.6,1,p3-3.8,.9,2.2,0
  kMove lfo .23,.061,0
  aMix=(aAir*.34+aHiss*.055)*kEnv
  gaBusL=gaBusL+aMix*(.72+kMove)
  gaBusR=gaBusR+aMix*(.70-kMove)
endin
instr 99
  aSpaceL,aSpaceR reverbsc gaBusL,gaBusR,.79,5900
  aOutL=(gaBusL*.64+aSpaceL*.35)*.83*3.60
  aOutR=(gaBusR*.64+aSpaceR*.35)*.83*3.60
  aOutL butterlp aOutL,11000
  aOutR butterlp aOutR,11000
  outs aOutL,aOutR
  clear gaBusL,gaBusR
endin
"""
def sha(p):return hashlib.sha256(p.read_bytes()).hexdigest()
def check_wave(path):
    with wave.open(str(path),"rb") as f:
        assert f.getnchannels()==2 and f.getframerate()==48000 and f.getsampwidth()==2
        n=f.getnframes()
        raw=f.readframes(n)
    from array import array
    v=array("h")
    v.frombytes(raw)
    assert len(v)==2*n
    sqsum=sum(float(x)*x for x in v)
    peak=max(abs(x) for x in v)/32768
    rms=math.sqrt(sqsum/len(v))/32768
    assert 15.9 < n/48000 < 16.2
    assert .001<rms<.45 and .02<peak<.98
    stereo_difference=sum(abs(v[2*i]-v[2*i+1]) for i in range(0,n,31))
    return {"durationSeconds":n/48000,"peakLinear":round(peak,5),"rmsLinear":round(rms,5),
            "stereoDifferenceSum":stereo_difference}
entries=[]
for name,orchestra in (("a-literal",A),("b-directed",B)):
    csd=TARGET/(name+".csd")
    csd.write_text(OPTIONS+orchestra+SCORE)
    wav=RENDER/(name+".wav")
    result=subprocess.run(["csound","-d","-W","-o",str(wav),str(csd)],
                          text=True,capture_output=True)
    if result.returncode:
        raise RuntimeError(name+" failed: "+(result.stdout+result.stderr)[-2500:])
    facts=check_wave(wav)
    dest=AAC/(name+".m4a")
    subprocess.run(["afconvert","-f","m4af","-d","aac","-b","192000",str(wav),str(dest)],
                   check=True,capture_output=True)
    entries.append({"id":name,"title":"A — literal, dry first pass" if name.startswith("a") else
                    "B — materially articulated room study",
                    "csoundPatch":csd.relative_to(ROOT).as_posix(),
                    "csoundSHA256":sha(csd),"renderPCM":wav.relative_to(ROOT).as_posix(),
                    "renderPCMSHA256":sha(wav),
                    "previewMedia":dest.relative_to(ROOT).as_posix(),
                    "previewMediaSHA256":sha(dest),
                    "renderFacts":facts})
manifest={
 "schema":"fountain.teatro.sound-craft-comparison.v1",
 "state":"private-editorial-audition-not-artistically-approved",
 "sourceOwner":"Fountain-Coach/teatro.fountain.coach",
 "mediaPlayerOwner":"Fountain-Coach/SatzfunkPlayer",
 "sourceLineage":["scripts/kino-interlude/cinema-air.csd",
                  "scripts/kino-interlude/midnight-cylinder.csd"],
 "composition":"Kino After Dark — original air, low resonances, metallic phrase, no historic recording",
 "sourceScoreSHA256":hashlib.sha256(SCORE.encode()).hexdigest(),
 "comparison":"same original score, 16 seconds, Csound 48k 2ch, A unworked vs B crafted material/room",
 "noOutsideRecordings":True,"noNativeScenarioAdmissionClaim":True,
 "rights":"new original Csound synthesis; staged candidate only",
 "files":entries
}
(TARGET/"manifest.json").write_text(json.dumps(manifest,indent=2,ensure_ascii=False)+"\n")
print("CSOUND_TRUE_A_B_RENDERED",json.dumps(entries,indent=2))
