# Teatro — First Hearing

## Author-acknowledged beta — First Hearing v16

**On 14 October 2026 the author called the running Teatro / Linotype
reader “a great beta state” and requested that milestone be documented.**
This is positive beta UX acceptance for the current **book/listening
experience** after multiple real iPad screenshot-based revisions. It is
not full Safari audio interoperability certification or public release.

The **frozen v16 reference** is Teatro source
`69656eb5934bc076fd589391ed7061c37287e194`, Fountain Press
`45e28c7f2d235147aa1c21623083e6e89b3bee2a`, WLAN release
`20261014-teatro-r16-play-ring-calibrated-v16`
(`http://192.168.8.249:8182/editions/first-hearing/`, same WLAN),
with v15 available for rollback. The essay's 22 original paragraphs,
its original score and exact source digests remain unchanged.

**Beta UX now has a reference standard:** enter a composed book rather
than a site, use fixed authorial typography, meaningful page atlas,
adjacent Contents, only Play/disclosure on the left and Contents on
the right, and a restrained Play circle responding to witnessed sound.
The Ear symbol and measured state belong inside the sound-parameter
panel. In-page Teatro Play and top Play use one instrument and activate
the canonical moving score; Stop disposes it. Responsive browser tests
and the original Csound/Ear+MIDI2 loopback proofs support this beta.

Remaining unverified: trusted iPad Safari HTTPS Csound, physical
MIDI2 host transport, approved spoken narration, persistent Reframe
writer/model editorial operations, and public publishing admission.
The complete Reframe R12 writer journey remains blocked. The
[author decision and full evidence](https://github.com/Fountain-Coach/Reframe/blob/main/docs/milestones/2026-10-14-teatro-linotype-beta-v16.md)
are owned by Reframe; this repository owns the actual Teatro edition.

#!/usr/bin/env python3
"""Verbatim book+sound provenance verification for Teatro's first book."""
from html.parser import HTMLParser
from pathlib import Path
import hashlib,json,re
from integrate_interactive_plate import SOURCE_SENTENCE

ROOT=Path(__file__).resolve().parents[1]
SITE=ROOT/"site"
SLUG="teatro-an-unfinished-composition"
def sha(raw):return hashlib.sha256(raw).hexdigest()
class Text(HTMLParser):
 def __init__(self,body):super().__init__(convert_charrefs=True);self.data=[];self.feed(body)
 def handle_data(self,data):self.data.append(data)
 def get(self):return "".join(self.data)
def paragraphs(section):
 return [Text(x).get() for x in re.findall(r'<p\b[^>]*>.*?</p>',section,re.S)]
def main():
 manifest=json.loads((SITE/"editions/first-hearing/edition.json").read_text())
 assert manifest["owningRepository"]=="Fountain-Coach/teatro.fountain.coach"
 assert manifest["authoredSourceRepository"]=="Fountain-Coach/fountain.coach"
 assert manifest["originalParagraphs"]==22
 assert manifest["approvedNarration"] is False
 assert manifest["hearingStatus"]=="not-yet-released"
 assert manifest["sourceMutation"] is False
 assert sha((SITE/"assets/edition/teatro-score-memory-vector-human-condition.svg").read_bytes())==manifest["originalScorePlateSHA256"]
 for path in ["index.html","editions/first-hearing/index.html"]:
  book=(SITE/path).read_text()
  assert 'id="book-flow" class="book-flow"' in book
  assert book.count('data-book-chapter=')==1
  assert book.count('data-book-toc-target=')==2
  assert book.count('src="/assets/edition/')==1
  assert book.count('aria-current="page"')==1
  assert book.count('id="book-media-toggle"')==1
  assert book.count('id="book-media-settings"')==1
  assert book.count('id="book-ear-status"')==1
  assert book.count('data-book-sound-parameter=')==4
  assert 'id="satzfunk-hearing-rail"' not in book
  assert 'id="satzfunk-hear"' not in book
  assert '>Scene ↓<' not in book
  assert 'src="/assets/linotype/book-player.mjs"' in book
  assert "script-src 'self' blob: 'wasm-unsafe-eval'" in book
  assert "worker-src 'self' blob:" in book
  assert 'href="/assets/linotype/book-player.css"' in book
  assert 'data-edition-id="teatro-first-hearing"' in book
  assert 'id="book-viewport"' in book and 'id="book-page-atlas"' in book
  assert 'https://fountain.coach/essays/'+SLUG+'/' in book
  assert 'id="book-live-stage"' in book
  assert book.count('data-teatro-book-stage')==1
  assert book.count('class="book-art-leaf"')==0
  assert 'data-press-media="spatial-scene"' in book
  assert 'data-keep-with-anchor="previous"' in book
  assert 'data-edition-imprint="TEATRO · FOUNTAIN COACH"' in book
  assert 'data-edition-running-title="TEATRO · FIRST HEARING"' in book
  assert 'href="/assets/linotype/mixed-media.css"' in book
  assert manifest["sceneAnchorId"] in book and manifest["sceneElementId"] in book
  assert 'data-source-paragraph-sha256="'+sha(SOURCE_SENTENCE.encode())+'"' in book
  assert 'data-source-revision-sha256="'+manifest["authoredSourceSHA256"]+'"' in book
  assert 'This is an old knowledge of theatre.' in book
  anchor_pos=book.index('This is an old knowledge of theatre.')
  media_pos=book.index('data-press-media="spatial-scene"')
  next_section=book.index('A score instead of an answer')
  assert anchor_pos<media_pos<next_section

  assert "frame-src 'self'" in book
  assert 'src="/assets/linotype/teatro-stage-page.js"' in book
  assert 'data-legal-role="company-status"' in book
  assert 'https://teatro.fountain.coach/editions/first-hearing/' in book
  assert book.count('data-estate-id=')==3
  assert book.count('data-book-chapter="'+SLUG+'"')==1
  assert 'meta name="satzfunk-source-sha256"' in book
  assert manifest["bookHTMLBeforeSatzfunkSHA256"] in book
  chapter=book.split('<section class="book-chapter"')[1].split('<section class="book-end"')[0]
  selected=[x for block in re.findall(r'<article class="book-prose">(.*?)</article>',chapter,re.S) for x in paragraphs(block)]
  # The source SHA-256 was established in the Fountain Coach owner. Its
  # paragraph stream is exactly the unmodified Linotype prose, not a recap.
  assert len(selected)==22
  assert sha(json.dumps(selected,ensure_ascii=False).encode())==manifest["paragraphsSHA256"],"Edited original Teatro text"
  print("TEATRO_FULL_BOOK_VERIFIED",path,len(selected),"complete source paragraphs")
 assert (SITE/"index.html").read_bytes()==(SITE/"editions/first-hearing/index.html").read_bytes()
 assert manifest["scenePlacement"]=="inside-authored-prose"
 assert "mediaWithAnchor(" in (SITE/"assets/linotype/linotype-engine.js").read_text()
 assert (SITE/"assets/linotype/mixed-media.css").is_file()
 stage=(SITE/"editions/stage/index.html").read_text()
 assert 'src="/assets/index-CY5_5ULO.js"' in stage and 'id="root"' in stage
 assert 'data-teatro-stage-return' in stage
 assert 'href="/editions/first-hearing/"' in stage
 assert 'data-legal-role="company-status"' in stage
 embed=(SITE/"editions/stage/embed/index.html").read_text()
 assert 'src="/assets/index-CY5_5ULO.js"' in embed
 assert 'src="/assets/book-puppet-fallback.js"' in embed
 fallback=(SITE/"assets/book-puppet-fallback.js")
 assert fallback.stat().st_size>100_000
 assert sha(fallback.read_bytes())==manifest["puppetFallbackRuntimeSHA256"]
 assert '<div id="root"></div>' in embed
 assert '.teatro-sidebar-disclosure{display:none!important}' in embed
 assert "createElement('iframe')" in (SITE/"assets/linotype/teatro-stage-page.js").read_text()
 assert (SITE/'assets/linotype/book-midi2.mjs').is_file()
 assert (SITE/'assets/linotype/book-player.mjs').is_file()
 assert 'fountain:book:position' in (SITE/'assets/linotype/book.js').read_text()
 assert 'fountain:book:seek' in (SITE/'assets/linotype/book.js').read_text()
 assert sha((SITE/'assets/book-csound-host.js').read_bytes())==manifest['bookCsoundHostSHA256']
 assert not (SITE/"editions/first-hearing/hearings.json").exists()
 assert not (SITE/"hearings.json").exists()
 js=(SITE/"assets/satzfunk/satzfunk-book.mjs").read_text()
 assert 'meta[name="satzfunk-edition-url"]' in js
 assert "manifest.status!=='released'" in js
 assert "url.origin !== location.origin" in js
 assert "status.textContent='The book is available to read. No author-approved spoken edition has been released yet.'" in js
 print("SATZFUNK_RELEASE_BOUNDARY_ACCEPTED",manifest["satzfunkCommit"],"no invented media")
 original=(SITE/"assets/index-CY5_5ULO.js")
 assert original.is_file() and original.stat().st_size>1000
 print("LIVE_STAGE_PRESERVED",original.stat().st_size,"javascript bytes")
 files={str(p.relative_to(SITE)):sha(p.read_bytes()) for p in SITE.rglob("*") if p.is_file()}
 inventory={}
 for line in (ROOT/"publication-files.sha256").read_text().splitlines():
  digest,sep,path=line.partition('  ')
  assert sep and path not in inventory
  inventory[path]=digest
 assert files==inventory,"Git owner source inventory diverged"
 obj=json.loads((ROOT/"edition.json").read_text())
 assert obj["sourceSha256Inventory"]==sha((ROOT/"publication-files.sha256").read_bytes())
 assert len(files)==obj["fileCount"]
 print("TEATRO_EDITION_ACCEPTED",len(files),"source files, book first, stage secondary")
if __name__=="__main__":main()

## R13 — mobile atlas identity and semantic Play default

Phone thumbnail navigation is a **compact source-addressed page map**,
not a clone of the entire Linotype sheet with a giant text title overlay.
Fountain Press `mobile-page-navigation.js` derives a bounded page mark
from the actually composed leaf: source plate imagery when present,
an interactive-score triangle when present, otherwise measured paper
lines and a stable folio. Every button retains its complete source
title via an accessible label. Neither full prose, iframe, arbitrary
representative photo nor miniature scripts are duplicated into the atlas.

The Teatro spatial score now shows a canonical right-facing **Play**
triangle until its reader deliberately activates the real animated
Teatro renderer inside that very page. The former static cube poster
has been removed entirely. Leaving the page releases the original
stage runtime, and returning restores the Play affordance. The normal
top-rail media player remains the book-wide Csound/Ear instrument;
the per-page triangle enters the authored spatial score, not a second
narration rail. This remains a visual candidate pending actual phone
Safari writer acceptance; the R12 Csound/MIDI2 gates are independent.

## R14 — Linotype is a book, not a website

The author's iPad portrait screenshot showed a grossly overscaled Play
image and website-like header/footer navigation. The editor has rejected
that furniture. The Teatro book now consumes Fountain Press fixed
typography and adjacent Contents rail `4012388`. No Aa, percentage
resizing, modal Contents, estate edition links, edition-directory
header or company/legal footer links. The Play affordance inside the
authored spatial-score block is scaled as a small book control (roughly
26–36 CSS px before paper fitting), not as a giant poster.

The visible book furniture is centered: the live book media transport,
Ear, a contents icon, and previous/progress/next at the bottom.
Contents opens as a reflowing column next to the live page, never
covering it; the current source anchor and leaf offset survive.
The book-end and source provenance furniture are neutral publication
notes instead of external navigation links. The original 22-paragraph
essay, score, its provenance SHA and Csound/MIDI2/Ear authorities are
unchanged. Actual iPad writer acceptance is still required.


## R15 — split player, Contents and one transport authority

The author rejected the centered set of unrelated top icons. Fountain
Press now positions a **Play/Pause + parameter-disclosure triangle +
live Ear glyph at the top-left**, with the separate Contents side-rail
icon at the **top-right**. The expanded Csound control panel remains
inside viewport bounds. Its Ear icon replaces volume-like bars and
scales subtly and proportionally with real RMS observations. On
silence/Stop it returns to a stable resting size, and reduced-motion
preferences are honored.

The author also requires reciprocity: activating the **source-anchored
Teatro Play** on the book page both mounts the original live puppet
*and* requests the same audible book player; activating the global
book Play while the Teatro leaf is visible mounts the original
scene. The top Pause stops the actual sound and releases the
embedded renderer. Only one transport state and one Ear/MIDI2 source
plane exist; the score does not create an independent playback
engine. The HTTP WLAN continues to disclose Web Audio preview,
while the secure-origin test witnesses original Csound/Ear.
No new narration, physical MIDI2 port or publishing authority is implied.

### R15 Ear calibration follow-up

WLAN Web Audio preview and the actual Csound AudioWorklet have different
RMS magnitude ranges. Ear's small 0.84–1.22 proportional logo-scale
maps source-declared RMS against bounded per-source ceilings
(0.60 Web Audio preview, 0.025 Csound), then takes a square root. This
preserves actual signal dynamics in both modes without falsely showing
the preview at maximum volume all the time. The same normalized,
bounded level is emitted on the local MIDI2 UMP Ear channel, and its
witnessed/silent state agrees with the genuine measured RMS threshold.
The canonical unmodified Csound/Teatro stage is retained. The book
fallback viewport is allowed to complete its async initialization
before release acceptance is measured; no mock visual is substituted.

## R16 — measured Play ring and Ear inside parameter disclosure

The author's iPad screenshot showed an extra Ear glyph in the top
toolbar and the word “Ear” repeated inside the large disclosure.
The author requests a quieter, more coherent instrument:

- Top-left retains only Play/Pause and the small parameter disclosure;
  top-right Contents continues to open the adjacent rail.
- The Play/Pause **circle** gains a modest measured output-driven
  color fill/ring. The source's existing normalized, witnessed RMS
  controls the bounded color and halo variables. No fake meter or
  ungoverned decorative timer is involved.
- The Ear SVG moves **inside** the parameter disclosure, in the
  measured-listening status line, replacing the spelled-out “Ear”.
  The live text is “idle”, “listening” or “signal witnessed · RMS …”,
  so the symbol supplies the visual identity while the status remains
  intelligible and accessible.
- Stop resets the Play circle and leaves the Ear signal mark idle.
  Reduced-motion preferences disable the easing transition.
- The original page-score Play, same shared instrument,
  Csound/Ear worklet and MIDI2 UMP observations remain unchanged.

The regression confirms the actual Play circle computed color
changes in response to audio (not merely a CSS variable changing),
reduced-motion computes to `0s`, Ear has no top-toolbar instance,
and the full R12–R15 source and browser tests still pass.

## R17 — Bookshelf landing, real Teatro book within

Fountain Press owns a reusable **Linotype Bookshelf state**
(`runtime/bookshelf.py` plus `runtime/bookshelf.css`). Teatro now
uses that state for **both** `/` and `/editions/`, while its actual
author-acknowledged v16 reader remains directly addressable at
`/editions/first-hearing/`. These are one reading system's two
states: bookshelf and open book; the landing is not a marketing
website or an independent catalogue frontend.

The single admitted book is **Teatro — An Unfinished Composition**.
Its cover object is represented simultaneously by a small folio/page
thumbnail and a larger paper cover showing the **original source
Teatro Score: Memory Vector — Human Condition**. Both representations
are derived from the same SHA-verified `/assets/edition/` image.
Selecting either representation via the encompassing book link enters
the complete literary book, not a dummy reading fixture.
`/editions/stage/` is a performance sub-edition and remains outside
the book catalogue, since it is not a separate admitted book.

R17 is deliberately a new landing candidate based on the v16 beta,
**not** another acceptance of the complete Reframe editor. The
original essay, synchronized Teatro scene/CSound/Ear, browser-local
MIDI2 UMP and approved beta book-control layout remain in the
unchanged first-hearing reader route. The shelf has its own accessible
book identity, natural responsive paper measure and readable mobile
thumbnail; no external book sources, invented cover, public
domain release or native MIDI2 capability is implied.
