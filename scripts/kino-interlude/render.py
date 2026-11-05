#!/usr/bin/env python3
"""Original five-stem 112 BPM Teatro/Csound dance interlude."""
from pathlib import Path
import json, subprocess

ROOT=Path(__file__).resolve().parents[2]
OUT=ROOT/"site/interludes/kino/assets"
OUT.mkdir(parents=True,exist_ok=True)
BPM=112
BEAT=60/BPM
BARS=32
LENGTH=BARS*4*BEAT
ORCH=r"""
sr=44100
ksmps=64
nchnls=2
0dbfs=1

instr 1
 kHz expseg 155, .09, 51, p3-.09, 45
 aEnv expseg 1, .10, .2, p3-.10, .001
 aBody oscili .68, kHz
 aKick = aBody*aEnv
 outs aKick, aKick
endin

instr 2
 aN rand .62
 aN butterhp aN, 6300
 aEnv linseg 0, .005, 1, .095, .0, p3-.10, 0
 aHat=aN*aEnv*p4
 outs aHat*.64,aHat
endin

instr 3
 iHz cpsmidinn p4
 aSaw vco2 .18,iHz,0
 aSub oscili .17,iHz*.5
 aFilt moogladder aSaw+aSub, 800,.12
 aEnv linseg 0,.015,1,p3-.13,.8,.115,0
 aOut=aFilt*aEnv*.70
 outs aOut,aOut
endin

instr 4
 iHz cpsmidinn p4
 a1 vco2 .08,iHz,0
 a2 vco2 .08,iHz*1.005,0
 aTone butterlp a1+a2,1900
 aEnv linen 1,.055,p3,.36
 aOut=aTone*aEnv
 outs aOut*.70,aOut
endin

instr 5
 iHz cpsmidinn p4
 a1 oscili .12,iHz
 a2 oscili .07,iHz*2.006
 aEnv linen 1,.009,p3,.31
 aSig=(a1+a2)*aEnv
 aDel delay aSig,.17
 aOut=aSig+aDel*.28
 outs aOut*.72,aOut
endin
"""
events={k:[] for k in ("kick","hat","bass","pad","spark")}
def add(name,ins,t,dur,*extra):
  events[name].append(f"i {ins} {t:.6f} {dur:.6f} "+" ".join(str(x) for x in extra))
for bar in range(BARS):
  b=bar*BEAT*4
  for step in range(4):
    add("kick",1,b+step*BEAT,.29)
    add("hat",2,b+step*BEAT+BEAT*.5,.16,.45 if step%2 else .37)
  for step in range(8):
    if step in (0,2,3,4,6,7):
      add("hat",2,b+step*BEAT*.5,.11,.16 if step%2==0 else .23)
  roots=(38,34,41,36,38,34,43,36)
  root=roots[(bar//4)%len(roots)]
  for step in (0,2,3,5,6):
    note=root+(12 if step==5 else 0)
    add("bass",3,b+step*BEAT*.5,BEAT*.54,note)
  if bar%2==0:
    chord=(50,53,57) if (bar//4)%2==0 else (48,52,55)
    for n in chord:
      add("pad",4,b,BEAT*7.55,n)
  if bar>=4:
    lead=(74,76,77,81,79,76,74,72)
    for step in (1,5):
      nn=lead[(bar+step)%len(lead)]
      add("spark",5,b+BEAT*step*.5,BEAT*.85,nn)
def run(command):
  subprocess.run(command,check=True)
manifest={"id":"teatro-kino-interlude-01","kind":"Csound-source-rendered-stems","tempoBPM":BPM,"bars":BARS,
          "durationSeconds":round(LENGTH,3),"tracks":[],"provenance":"Original Csound instruments and score; browser mix is a projection, not native Scenario admission."}
for name,ev in events.items():
  score="\n".join(ev)+f"\nf0 {LENGTH+1:.6f}\ne\n"
  csd=f'<CsoundSynthesizer>\n<CsOptions>\n-d -W\n</CsOptions>\n<CsInstruments>\n{ORCH}\n</CsInstruments>\n<CsScore>\n{score}\n</CsScore>\n</CsoundSynthesizer>\n'
  src=ROOT/"scripts/kino-interlude"/f"{name}.csd"
  src.write_text(csd)
  wav=OUT/f"{name}.wav"
  m4a=OUT/f"{name}.m4a"
  run(["csound","-d","-W","-o",str(wav),str(src)])
  run(["afconvert","-f","m4af","-d","aac","-b","128000",str(wav),str(m4a)])
  wav.unlink()
  manifest["tracks"].append({"id":name,"file":"assets/"+name+".m4a","bytes":m4a.stat().st_size})
(OUT.parent/"manifest.json").write_text(json.dumps(manifest,indent=2)+"\n")
print(json.dumps(manifest,indent=2))
