#!/usr/bin/env python3
"""Three original Csound single hits: mono bass and two hats. No pads/chords."""
from pathlib import Path
import subprocess,json,hashlib
root=Path(__file__).resolve().parents[2]
out=root/"site/interludes/kino/assets/groove"
out.mkdir(parents=True,exist_ok=True)
orchestra=r"""
sr=44100
ksmps=64
nchnls=2
0dbfs=1

instr 1
  ; Dark, short mono pulse bass D2: gently snapped pitch and a decaying filter.
  kHz expseg p4*1.035,.048,p4,p3-.048,p4*.996
  aSaw vco2 .24,kHz,0
  aSub oscili .28,kHz*.5
  kCut expseg 1350,.075,480,p3-.075,165
  aBody moogladder aSaw+aSub,kCut,.12
  aEnv linseg 0,.007,1,.08,.83,p3-.10,.0001
  aOut = (aBody*aEnv)*.67
  outs aOut,aOut
endin
instr 2
  aNoise rand .56
  aHi butterhp aNoise,6500
  aTone butterlp aHi,15500
  aEnv expseg .001,.003,1,p3-.003,.0001
  aSig = aTone*aEnv*.55
  outs aSig*.87,aSig
endin
instr 3
  aNoise rand .58
  aHi butterhp aNoise,5500
  aTone butterlp aHi,14700
  aEnv expseg .001,.004,1,p3-.004,.0001
  aSig = aTone*aEnv*.57
  outs aSig*.82,aSig
endin
"""
sounds=[
 ("bass-d2",1,.43,73.416),
 ("hat-closed",2,.092,0),
 ("hat-open",3,.245,0)
]
manifest={"kind":"Csound-original-mono-bass-and-hat-one-shots","tempo":"externally scheduled at 112 BPM","notes":"no chords or pads; audio scheduled with swing and fed into existing Ear/UMP band echo","sounds":[]}
for name,inst,dur,pitch in sounds:
 score=f"i {inst} 0 {dur:.5f} {pitch:.4f}\nf0 {dur+.07:.5f}\ne\n"
 csd=f"<CsoundSynthesizer>\n<CsOptions>\n-d -W\n</CsOptions>\n<CsInstruments>\n{orchestra}\n</CsInstruments>\n<CsScore>\n{score}\n</CsScore>\n</CsoundSynthesizer>\n"
 src=root/"scripts/kino-interlude"/(name+".csd")
 src.write_text(csd)
 wav=out/(name+".wav")
 result=subprocess.run(["csound","-d","-W","-o",str(wav),str(src)],capture_output=True,text=True)
 log=(result.stdout or "")+(result.stderr or "")
 if result.returncode or "0 errors in performance" not in log:
   print(log[-2500:]);raise RuntimeError("Csound failed: "+name)
 digest=hashlib.sha256(wav.read_bytes()).hexdigest()
 manifest["sounds"].append({"name":name,"file":"assets/groove/"+name+".wav","durationSeconds":dur,"sha256":digest,"bytes":wav.stat().st_size})
 print("CSOUND_OK",name,wav.stat().st_size,digest[:16])
(out/"sources.json").write_text(json.dumps(manifest,indent=2)+"\n")
