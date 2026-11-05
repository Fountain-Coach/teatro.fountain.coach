#!/usr/bin/env python3
"""Keep the existing Kino architectural plate; replace intrusive deck with an acoustic room."""
from pathlib import Path
import re,json
route=Path(__file__).resolve().parents[2]/"site/interludes/kino"
page=route/"index.html"
html=page.read_text()
assert html.count('  <div class="rail">')==1
assert html.count('<script type="module" src="./assets/sampler-v2.mjs"></script>')==1
html=html.replace('<title>Kino After Dark · Teatro Interlude 01</title>','<title>Kino After Dark · A Cinematic Sound Environment</title>')
html=html.replace('<link rel="stylesheet" href="./assets/sampler-v2.css">','<link rel="stylesheet" href="./assets/sampler-v2.css">\n<link rel="stylesheet" href="./assets/ambient-v158.css">')
html=html.replace('Night score · dance study','An acoustic interlude')
html=html.replace('MIDI 2.0 window sequencer · touch sampler · no chords','Geräuschumgebung · a cinema after its film')
html=html.replace('<div class="tempo"><strong>112</strong>BPM / 16 WINDOWS / UMP</div>','<div class="tempo"><strong>∞</strong>NO MEASURE / ONLY TIME</div>')
html=html.replace('  <div class="stage">','  <div class="stage" id="cinema-room" data-active="false">')
html=html.replace('a dark street, glowing jade lettering, warm entrance and five music channels.','a dark street, glowing jade lettering, a warm empty foyer and light from distant windows.')
html=html.replace('Sixteen touch-sensitive Kino International sequencer windows','Sixteen gently illuminated cinema windows indicating an evolving quiet sound environment')
i=html.index('  <div class="rail">')
j=html.index('</main>',i)
body='''  <section class="listen-room" aria-label="An acoustic room after the film">
    <div class="rail">
      <div class="transport">
        <button id="toggle" type="button" class="round" aria-label="Listen to the cinema sound environment" aria-pressed="false">▶</button>
        <button id="stop" type="button" class="small">Stop</button>
      </div>
      <div class="status" id="status" role="status" aria-live="polite"><strong>After the film</strong>Listen when you wish</div>
    </div>
    <div class="room-leaf">
      <p class="leaf-kicker">After the last scene</p>
      <p class="leaf-text">The film is over. The room retains something of it: an almost-kiss, a hand withdrawn, the silence before tears.</p>
      <p class="leaf-subtext">No rhythm insists on being heard. The air moves, the old projector leaves a little dust, and fragments appear only at a distance.</p>
    </div>
    <div class="acoustic-controls">
      <label>Distance <input id="distance" type="range" min="0" max="100" value="72" aria-label="Sound distance"><output id="distance-value">72%</output></label>
      <label>Traces <input id="traces" type="range" min="0" max="45" value="0" aria-label="Optional faint archive traces"><output id="traces-value">None</output></label>
      <button class="small scene-change" id="another" type="button">Another memory</button>
    </div>
    <div class="acoustic-footnotes"><span id="room-count">No passing sounds</span><span id="ear-summary">Ear observes the room · MIDI 2.0 carries the echo</span></div>
    <p class="note">Original Csound cinema air and film dust, recomposed as slow non-periodic grains. Optional quiet traces from the attributed Satzfunk archive are off by default. Ear measures the dry sound and returns MIDI 2.0 CC74 to a bounded echo. No bass sequence, drums, pads, chords or borrowed film voices. The public edition has not changed.</p>
  </section>
  <div class="closing"><span>Teatro · Kino After Dark · between First and Second Readings</span><a href="/estate/#/read/first-readings">Return to the readings</a></div>
'''
html=html[:i]+body+html[j:]
html=html.replace('<script type="module" src="./assets/sampler-v2.mjs"></script>','<script type="module" src="./assets/ambience-v158.mjs"></script>')
assert html.count('id="cinema-room"')==1 and '<section class="sampler"' not in html
page.write_text(html)
manifest={
 "id":"teatro-kino-after-dark-05",
 "kind":"nonmetric-cinematic-geraeuschumgebung",
 "sourceOwner":"Fountain-Coach/teatro.fountain.coach",
 "design":"Cinematic sound environment: quiet original Csound textures, slow grains, no groove or intrusive slice player",
 "sources":{"Csound":"assets/atmosphere/sources.json","optionalArchivedSatzfunk":"assets/shaders-40479-extract.m4a","archiveIsOptIn":True},
 "runtime":"assets/ambience-v158.mjs",
 "ear":{"worklet":"assets/ear-original.js","effect":"assets/ear-band-echo.mjs","control":"MIDI2 CC74 group0 channel0 from original Ear PCM RMS","echoFeedbackBound":0.44},
 "notes":["no bass","no hi-hat","no beat grid","no chords","no pads","no copyrighted movie-dialogue excerpts"],
 "scope":"owner WLAN staging only; original Linotype reader unchanged; public original-media derivative not authorized"
}
(route/"manifest.json").write_text(json.dumps(manifest,indent=2)+"\n")
print("KINO_AMBIENT_COMPOSITION_READY",len(html))
