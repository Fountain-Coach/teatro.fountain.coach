<CsoundSynthesizer>
<CsOptions>
-d -W
</CsOptions>
<CsInstruments>

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

</CsInstruments>
<CsScore>
i 3 0 0.24500 0.0000
f0 0.31500
e

</CsScore>
</CsoundSynthesizer>
