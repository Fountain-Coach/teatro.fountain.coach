<CsoundSynthesizer>
<CsOptions>
-d -W
</CsOptions>
<CsInstruments>
sr=48000
ksmps=64
nchnls=2
0dbfs=1
giSine ftgen 1,0,16384,10,1

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
