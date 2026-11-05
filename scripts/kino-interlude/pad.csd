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

</CsInstruments>
<CsScore>
i 4 0.000000 4.044643 50
i 4 0.000000 4.044643 53
i 4 0.000000 4.044643 57
i 4 4.285714 4.044643 50
i 4 4.285714 4.044643 53
i 4 4.285714 4.044643 57
i 4 8.571429 4.044643 48
i 4 8.571429 4.044643 52
i 4 8.571429 4.044643 55
i 4 12.857143 4.044643 48
i 4 12.857143 4.044643 52
i 4 12.857143 4.044643 55
i 4 17.142857 4.044643 50
i 4 17.142857 4.044643 53
i 4 17.142857 4.044643 57
i 4 21.428571 4.044643 50
i 4 21.428571 4.044643 53
i 4 21.428571 4.044643 57
i 4 25.714286 4.044643 48
i 4 25.714286 4.044643 52
i 4 25.714286 4.044643 55
i 4 30.000000 4.044643 48
i 4 30.000000 4.044643 52
i 4 30.000000 4.044643 55
i 4 34.285714 4.044643 50
i 4 34.285714 4.044643 53
i 4 34.285714 4.044643 57
i 4 38.571429 4.044643 50
i 4 38.571429 4.044643 53
i 4 38.571429 4.044643 57
i 4 42.857143 4.044643 48
i 4 42.857143 4.044643 52
i 4 42.857143 4.044643 55
i 4 47.142857 4.044643 48
i 4 47.142857 4.044643 52
i 4 47.142857 4.044643 55
i 4 51.428571 4.044643 50
i 4 51.428571 4.044643 53
i 4 51.428571 4.044643 57
i 4 55.714286 4.044643 50
i 4 55.714286 4.044643 53
i 4 55.714286 4.044643 57
i 4 60.000000 4.044643 48
i 4 60.000000 4.044643 52
i 4 60.000000 4.044643 55
i 4 64.285714 4.044643 48
i 4 64.285714 4.044643 52
i 4 64.285714 4.044643 55
f0 69.571429
e

</CsScore>
</CsoundSynthesizer>
