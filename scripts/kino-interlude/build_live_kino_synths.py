#!/usr/bin/env python3
"""Source-preserving Csound AudioWorklet projections of the actual Kino instrument CSDs.

The original offline source stays owned by Teatro. The live browser host compiles
these Csound orchestras on a user gesture. Neither prerecorded stems nor a new
Linotype reader are used as the sound source for the live instrument.
"""
from pathlib import Path
import json,re,hashlib
ROOT=Path(__file__).resolve().parents[2]
BASE=ROOT/'scripts/kino-interlude'
OUT=ROOT/'site/interludes/kino/live-csound'
OUT.mkdir(parents=True,exist_ok=True)
def sha(p):return hashlib.sha256(p.read_bytes()).hexdigest()
def src(name):
    p=BASE/name;s=p.read_text();m=re.search(r'<CsInstruments>(.*?)</CsInstruments>',s,re.S);score=re.search(r'<CsScore>(.*?)</CsScore>',s,re.S)
    if not m or not score:raise ValueError(name)
    return p,m.group(1),score.group(1)
def orch(body,mapping,tables={}):
    body=re.sub(r'(?m)^\s*(sr|ksmps|nchnls|0dbfs)\s*=.*$', '',body)
    for a,b in mapping.items():
        body=re.sub(r'(?m)^(\s*instr\s+)'+str(a)+r'(\s*)$',lambda m:m.group(1)+str(b)+m.group(2),body)
    for a,b in tables.items():
        body=re.sub(r'(?m)(\bftgen\s+)'+str(a)+r'(?=,)',lambda m:m.group(1)+str(b),body)
        body=re.sub(r'(?m)(\b(?:oscili|oscil|poscil)\s+[^\n]+?,)'+str(a)+r'(?=\s*(?:;.*)?$)',lambda m:m.group(1)+str(b),body)
    return body.strip()+'\n'
def score(txt,mapping,shift=0):
    lines=[]
    for raw in txt.splitlines():
        line=raw.strip()
        if not line or line[0]==';' or line.startswith('f0 ') or line=='e':continue
        match=re.match(r'i\s+(\d+)\s+([\d.]+)\s+(\S+)(.*)',line)
        if match:
            i,t,d,rest=match.groups()
            if int(i) not in mapping:raise ValueError('score instrument identity '+i)
            lines.append(f'i {mapping[int(i)]} {float(t)+shift:.5f} {d}{rest}')
        else:raise ValueError('Unrecognized score '+line)
    return lines
bpath,borch,_=src('bass-d2.csd')
cp,corch,cscore=src('cinema-air.csd')
mp,morch,mscore=src('midnight-cylinder.csd')
ap,ao,asc=src('sound-craft-contrast/a-literal.csd')
bp,bo,bsc=src('sound-craft-contrast/b-directed.csd')
groove=[];beat=60/112
for step in range(30):
    t=step*beat/2
    if t>=16:break
    if step%2==0:groove.append(f'i 801 {t:.5f} .43000 73.416')
    ht=t+(beat/4 if step%2 else 0)
    if ht<16:groove.append(f'i {803 if step%8==7 else 802} {ht:.5f} {".245" if step%8==7 else ".092"}')
programs={
 'history-groove':{
  'source':[(bpath,'Instrument orchestra and original beat scheduling')],
  'orchestra':orch(borch,{1:801,2:802,3:803}),
  'score':groove,
  'label':'Original bass/hat synthesizer — live original Csound voices',
  'identity':'teatro.kino.history.groove',
  'fidelity':'Live synthesis of original Csound bass/hat instruments; reconstructed 16-second grid from the original groove scheduling, not a recorded historical browser session'
 },
 'history-memory':{
  'source':[(cp,'Original atmosphere and film-dust instruments'),(mp,'Original Midnight Cylinder instruments and score')],
  'orchestra':orch(corch,{1:811,2:812})+'\n'+orch(morch,{1:821,2:822,3:823,4:824,5:825},{1:8201,2:8202}),
  'score':score(cscore,{1:811,2:812})+score(mscore,{1:821,2:822,3:823,4:824,5:825},shift=3),
  'label':'Cinematic memory synthesizer — live original Csound voices',
  'identity':'teatro.kino.history.memory',
  'fidelity':'Live synthesis of original Kino air, film-dust and Midnight Cylinder; instrument voices preserved, score assembled for this audition'
 },
 'literal':{
  'source':[(ap,'Original native Csound score and orchestra')],
  'orchestra':orch(ao,{1:901,2:902,3:903,99:999},{1:9001}),
  'score':score(asc,{1:901,2:902,3:903,99:999}),
  'label':'Literal patch — live Csound, same score',
  'identity':'teatro.kino.soundcraft.a',
  'fidelity':'Native Csound source with unique host instrument identity; score timing preserved'
 },
 'directed':{
  'source':[(bp,'Original native Csound score and orchestra')],
  'orchestra':orch(bo,{1:911,2:912,3:913,99:919},{1:9101}),
  'score':score(bsc,{1:911,2:912,3:913,99:919}),
  'label':'Directed patch — live Csound, same score',
  'identity':'teatro.kino.soundcraft.b',
  'fidelity':'Native Csound source with unique host instrument identity; score timing preserved'
 }
}
for key,detail in programs.items():
    for p,_ in detail['source']:
        if not p.is_file():raise ValueError(p)
    entry={k:v for k,v in detail.items() if k!='source'}
    entry['owner']='Fountain-Coach/teatro.fountain.coach'
    entry['sources']=[{'path':p.relative_to(ROOT).as_posix(),'sha256':sha(p),'role':role} for p,role in detail['source']]
    entry['durationSeconds']=16
    entry['engine']='@csound/browser AudioWorklet via Teatro-owned BookCsoundHost'
    entry['originalBrowserCapture']=False
    f=OUT/(key+'.json');f.write_text(json.dumps(entry,indent=2,ensure_ascii=False)+'\n')
    print(key,'score events',len(entry['score']),'sha',sha(f))
