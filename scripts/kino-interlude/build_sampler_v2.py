#!/usr/bin/env python3
"""Transform the existing Kino plate into a tactile MIDI2 UMP sample sequencer."""
from pathlib import Path
import json,re
root=Path(__file__).resolve().parents[2]
route=root/"site/interludes/kino"
page=route/"index.html"
html=page.read_text()
assert html.count('  <div class="rail">')==1
assert html.count('<script type="module">')==1
html=html.replace("</style>","</style>\n<link rel=\"stylesheet\" href=\"./assets/sampler-v2.css\">",1)
html=html.replace('Kino <em>After Dark</em>','Kino <em>After Dark</em>',1)
html=html.replace('A smooth Csound dance interlude · between readings','MIDI 2.0 window sequencer · touch sampler · no chords',1)
html=html.replace('BPM / 4 × 4 / D MINOR','BPM / 16 WINDOWS / UMP',1)
html=html.replace('   </svg>\n  </div>\n  <div class="rail">',
'''   </svg>
   <div id="kino-windows" class="kino-window-grid" role="group" aria-label="Sixteen touch-sensitive Kino International sequencer windows"></div>
  </div>
  <div class="rail">''',1)
i=html.index('  <div class="rail">')
j=html.index('</main>',i)
html=html[:i]+'''  <div class="rail">
    <div class="transport">
      <button id="toggle" class="round" type="button" aria-label="Play MIDI 2.0 sequence" aria-pressed="false">▶</button>
      <button id="stop" class="small" type="button">Stop</button>
      <button id="randomize" class="small random" type="button">↝ Randomize</button>
      <button id="reset" class="small" type="button">Reset</button>
    </div>
    <div class="status" id="status" role="status" aria-live="polite"><strong>Touch the cinema windows</strong>Sixteen steps · one source sample · no chords</div>
  </div>
  <section class="sequence-meta" aria-label="Sequencer controls">
    <span class="chapterline">KINO INTERNATIONAL / 16-STEP MIDI 2.0</span>
    <label class="density-control">Density <input id="density" type="range" min="15" max="90" value="48"><output id="density-value">48%</output></label>
    <output id="pattern-id" class="seed" aria-label="Pattern identity">PATTERN 001</output>
  </section>
  <div id="mobile-windows" class="mobile-window-grid" role="group" aria-label="Sixteen large touch-friendly sequencer steps"></div>
  <section class="sampler" aria-label="Playable source sample">
    <div class="sampler-heading">
      <div><p class="kicker">02 / Source instrument</p><h2>Touch the sound.</h2><p>Drag across the waveform to play, scan and scratch the source directly.</p></div>
      <span class="source-label">SAMPLER / 09.00 S</span>
    </div>
    <div id="wave-area" class="wave-area" role="group" aria-label="Touch and drag on the waveform to play and scan the sample">
       <canvas id="waveform" role="img" aria-label="Waveform of the imported source sample"></canvas>
       <div id="wave-cursor" class="wave-cursor" aria-hidden="true"></div>
       <div class="wave-guide" aria-hidden="true"><span>00:00</span><span>DRAG TO PLAY</span><span id="wave-duration">00:09</span></div>
    </div>
    <div class="sample-tools">
      <label>Slice <input id="slice" type="range" min="1" max="8" step="1" value="1"><output id="slice-value">01 / 08</output></label>
      <button type="button" id="assign" class="small" aria-pressed="false">Assign slice to window</button>
      <label>Grain <input id="grain" type="range" min="100" max="1100" step="20" value="360"><output id="grain-value">360 ms</output></label>
      <label>Speed <input id="speed" type="range" min="45" max="180" step="5" value="100"><output id="speed-value">1.00×</output></label>
      <label>Level <input id="level" type="range" min="0" max="100" step="1" value="80"><output id="level-value">80%</output></label>
      <button type="button" class="small" id="reverse" aria-pressed="false">Reverse</button>
      <label class="file-label">Open local audio<input type="file" id="file" accept="audio/*"></label>
    </div>
    <div class="source-credit"><span id="sample-name">SHADERS · TRACK 04</span><span>Published source: Benedikt Eickhoff · Satzfunk</span><a href="https://satzfunk.fountain.coach/" target="_blank" rel="noopener">Original edition</a></div>
  </section>
  <div class="protocol-line"><span>SOFTWARE MIDI 2.0 UMP → LOCAL SAMPLE INSTRUMENT</span><output id="ump" aria-live="off">NOTE ON / 2 × 32-bit words / ready</output></div>
  <p class="note">The cinema windows are the score. The randomizer changes their rhythm and slice assignments, not a chord progression. Every playing step emits encoded and decoded MIDI 2.0 UMP Note On/Off using Fountain Coach’s own protocol library. This private preview uses a short, attributed excerpt of a published Satzfunk recording; no new public remix is authorized. Touch the waveform or load your own sample locally.</p>
  <div class="closing"><span>Teatro · Kino After Dark · an interlude between readings</span><a href="/estate/#/read/first-readings">Return to the readings →</a></div>
'''+html[j:]
html=re.sub(r'<script type="module">.*?</script>','<script type="module" src="./assets/sampler-v2.mjs"></script>',html,count=1,flags=re.S)
assert html.count('id="kino-windows"')==1
assert html.count('<script type="module" src="./assets/sampler-v2.mjs">')==1
page.write_text(html)
manifest={"id":"teatro-kino-interlude-02","kind":"source-bound-UMP-sample-sequencer","bpm":112,"steps":16,"midi2":{"codec":"@fountain-coach/midi2@0.12.8","messages":["noteOn","noteOff"],"group":0,"channel":9,"peer":"local browser sample engine","hardwareTransport":False,"nativeScenarioAdmitted":False},"sourceSample":{"asset":"assets/shaders-40479-extract.m4a","metadata":"assets/sample-provenance.json","duration":9.0},"scope":"private owner-WLAN audition; no public derivative release","originalReaderSourceUnchanged":True,"noChords":True,"noPads":True}
(route/"manifest.json").write_text(json.dumps(manifest,indent=2)+"\n")
for name in ("kick","hat","bass","pad","spark"):
    (route/"assets"/(name+".m4a")).unlink()
print("BUILT_KINO_MIDI2_SAMPLER_02",len(html))
