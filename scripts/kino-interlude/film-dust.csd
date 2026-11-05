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

</CsInstruments>
<CsScore>
i 2 0 16
f0 16.1
e
</CsScore>
</CsoundSynthesizer>
