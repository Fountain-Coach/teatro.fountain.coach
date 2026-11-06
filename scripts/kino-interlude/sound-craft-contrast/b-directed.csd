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
