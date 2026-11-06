#!/usr/bin/env python3
"""Two 16-second source-authentic editorial reconstructions from Kino's prior Csound stem renders.

Not a capture of a past running browser patch. No outside sample, no native scenario claim.
"""
from pathlib import Path
import wave, array, math, hashlib, json, subprocess
ROOT=Path(__file__).resolve().parents[2]
SRC=ROOT/'scripts/kino-interlude/source-renders'
OUT=ROOT/'site/interludes/kino/assets/editorial-history'
OUT.mkdir(parents=True,exist_ok=True)
SR=44100
FRAMES=16*SR

def pcm(name):
    p=SRC/(name+'.wav')
    with wave.open(str(p),'rb') as w:
        assert (w.getframerate(),w.getnchannels(),w.getsampwidth())==(SR,2,2),name
        data=array.array('h');data.frombytes(w.readframes(w.getnframes()))
    return p,data

def mix(events):
    dst=array.array('f',[0.0])*(FRAMES*2)
    for name,start,gain,rate in events:
        _,src=pcm(name)
        position=int(start*SR)
        count=min((len(src)//2),FRAMES-position)
        if count<=0:continue
        for i in range(count):
            j=position+i
            env=min(1.0,i/1400,max(0.0,(count-i)/2800))
            dst[2*j]+=gain*env*src[2*i]/32768
            dst[2*j+1]+=gain*env*src[2*i+1]/32768
    mx=max(abs(x) for x in dst)
    norm=min(1.0,0.7/max(mx,.0001))
    samples=array.array('h',(round(max(-1,min(1,v*norm))*32760) for v in dst))
    return samples,mx

beat=60/112
groove=[]
for i in range(16*2):
    t=i*beat/2
    if i%2==0:groove.append(('bass-d2',t,0.64,1))
    groove.append(('hat-open' if i%8==7 else 'hat-closed',t+(beat/4 if i%2 else 0),0.16 if i%2 else 0.11,1))
ambient=[('cinema-air',0,.40,1),('film-dust',0,.31,1),('midnight-cylinder',3.1,.20,1)]
outputs=[]
for label,ev,description in [
 ('kino-history-groove',groove,'Editorial reconstruction of first fixed-bass/hat approach from original source Csound PCM stems; not a captured original browser-mix recording'),
 ('kino-history-memory',ambient,'Editorial reconstruction of revised atmospheric approach from original Csound cinema-air, film-dust and Midnight Cylinder PCM stems; not a captured original browser-mix recording')]:
    samples,peak=mix(ev)
    wav=OUT/(label+'.wav')
    with wave.open(str(wav),'wb') as w:
        w.setnchannels(2);w.setsampwidth(2);w.setframerate(SR);w.writeframes(samples.tobytes())
    m4a=OUT/(label+'.m4a')
    subprocess.run(['/usr/bin/afconvert','-f','m4af','-d','aac','-b','128000',str(wav),str(m4a)],check=True)
    wav.unlink()
    digest=hashlib.sha256(m4a.read_bytes()).hexdigest()
    outputs.append({'id':label,'sourceOwner':'Fountain-Coach/teatro.fountain.coach','description':description,'durationSeconds':16,'mediaFile':m4a.relative_to(ROOT).as_posix(),'mediaSHA256':digest,'sourceStems':[{'file':(SRC/(n+'.wav')).relative_to(ROOT).as_posix(),'sha256':hashlib.sha256((SRC/(n+'.wav')).read_bytes()).hexdigest()} for n in dict.fromkeys(e[0] for e in ev)],'events':[{'stem':n,'atSeconds':round(t,4),'gain':g} for n,t,g,_ in ev]})
manifest={'schema':'fountain.teatro.kino-editorial-historical-reconstruction.v1','originalCapture':False,'sourceStemsCsoundRendered':True,'borrowedSamples':False,'editorialAudioReconstructionOnly':True,'sampleRate':SR,'twoHistoricalApproachesNotSameScore':True,'files':outputs}
(OUT/'sources.json').write_text(json.dumps(manifest,indent=2,ensure_ascii=False)+'\n')
print(json.dumps({'output':[{'id':x['id'],'sha256':x['mediaSHA256']} for x in outputs],'manifest':str(OUT/'sources.json')},indent=2))
