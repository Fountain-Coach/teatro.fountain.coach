#!/usr/bin/env python3
"""Project the authentic Kino façade into the live Csound reader insert."""
from pathlib import Path
import re,hashlib,json
root=Path(__file__).resolve().parents[2]
kino=root/'site/interludes/kino'
original=(kino/'index.html').read_text()
matches=re.findall(r'<svg viewBox="0 0 1200 465".*?</svg>',original,re.S)
if len(matches)!=1:raise ValueError('Original source SVG missing')
svg=matches[0]
if 'K I N O   I N T E R N A T I O N A L' not in svg:raise ValueError('Source identity changed')
digest=hashlib.sha256(svg.encode()).hexdigest()
template=(kino/'live-csound/index.template.html').read_text()
for symbol in ('__SOURCE_SHA__','__SOURCE_SVG__','__WINDOWS__'):
 if template.count(symbol)!=1:raise ValueError('Missing source anchor')
windows=''.join('<span class="memory-window" style="--window-level:.04"></span>' for _ in range(16))
page=template.replace('__SOURCE_SHA__',digest).replace('__SOURCE_SVG__',svg).replace('__WINDOWS__',windows)
if page.count('class="memory-window"')!=16 or page.count('data-play=')!=4:raise ValueError('Incomplete score')
target=kino/'live-csound/index.html'
target.write_text(page)
print(json.dumps({'originalKinoSVGsha256':digest,'liveScoreHTMLsha256':hashlib.sha256(page.encode()).hexdigest(),'windowCount':16,'sourceOwner':'Fountain-Coach/teatro.fountain.coach'},indent=2))
