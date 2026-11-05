#!/usr/bin/env python3
"""Render two original, non-rhythmic Csound cinema atmospheres; never stage WAV."""
from pathlib import Path
import subprocess,json,hashlib
root=Path(__file__).resolve().parents[2]
scores=root/"scripts/kino-interlude"
sources=scores/"source-renders"
assets=root/"site/interludes/kino/assets/atmosphere"
sources.mkdir(exist_ok=True);assets.mkdir(exist_ok=True)
orc=r"""
sr=44100
ksmps=64
nchnls=2
0dbfs=1

instr 1
  ; Cinema air: ventilation, room distance, a tiny, unpitched electrical memory.
  aNoise rand .27
  aBand butterlp aNoise,1000
  aBand butterhp aBand,63
  aHiss rand .12
  aHiss butterhp aHiss,3100
  aHiss butterlp aHiss,7800
  kBreath lfo .19,.083,0
  kFade linseg 0,1,1,14,1,1,0
  aLeft = (aBand*(.43+kBreath)+aHiss*.06)*kFade*.58
  aRight = (aBand*(.38-kBreath*.5)+aHiss*.052)*kFade*.58
  outs aLeft,aRight
endin
instr 2
  ; Soft film dust: irregular colored broadband texture, no cadence or tones.
  aCrackle rand .24
  aCrackle butterhp aCrackle,550
  aCrackle butterlp aCrackle,5200
  kSway lfo .15,.071,0
  kFade linseg 0,1.5,1,13,1,1.5,0
  outs aCrackle*(.31+kSway)*kFade*.45,aCrackle*(.29-kSway)*kFade*.44
endin
"""
manifest={"schema":"fountain.teatro.cinema-ambience-csound.v1","noChords":True,"noBeat":True,"rights":"original Csound synthesis","files":[]}
for name,instr in [("cinema-air",1),("film-dust",2)]:
    csd=scores/(name+".csd")
    csd.write_text("<CsoundSynthesizer>\n<CsOptions>\n-d -W\n</CsOptions>\n<CsInstruments>\n"+orc+"\n</CsInstruments>\n<CsScore>\ni "+str(instr)+" 0 16\nf0 16.1\ne\n</CsScore>\n</CsoundSynthesizer>\n")
    wav=sources/(name+".wav")
    r=subprocess.run(["csound","-d","-W","-o",str(wav),str(csd)],capture_output=True,text=True)
    if r.returncode or "0 errors in performance" not in (r.stdout+r.stderr):
        print((r.stdout+r.stderr)[-2500:]);raise RuntimeError("Csound failed "+name)
    aac=assets/(name+".m4a")
    subprocess.run(["afconvert","-f","m4af","-d","aac","-b","128000",str(wav),str(aac)],check=True)
    sha=lambda p:hashlib.sha256(p.read_bytes()).hexdigest()
    manifest["files"].append({"name":name,"path":"assets/atmosphere/"+name+".m4a","sha256":sha(aac),"sourceWavSHA256":sha(wav),"bytes":aac.stat().st_size})
    print("ORIGINAL_CSOUND_CINEMA",name,sha(aac),aac.stat().st_size)
(assets/"sources.json").write_text(json.dumps(manifest,indent=2)+"\n")
