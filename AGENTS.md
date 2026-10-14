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
  assert book.count('aria-current="page"')==0
  assert 'class="book-toolbar book-reading-controls"' in book
  assert 'class="book-pagination book-reading-pagination"' in book
  assert 'class="book-back"' not in book
  assert 'class="edition-rail"' not in book
  assert 'class="book-legal"' not in book
  assert '<a href="/editions/">' not in book
  assert book.count('id="book-media-toggle"')==1
  assert book.count('class="book-ear-icon"')==1
  assert 'class="book-ear-meter"' not in book
  assert book.index('id="book-media-toggle"')<book.index('id="book-media-settings"')<book.index('class="book-ear-icon"')
  assert book.count('id="book-toc-button"')==1
  assert 'aria-haspopup="dialog">Contents</button>' not in book
  assert '<svg viewBox="0 0 24 24"' in book
  assert 'id="book-type-button"' not in book
  assert 'id="book-appearance"' not in book
  assert 'id="book-font-larger"' not in book
  assert 'id="book-font-smaller"' not in book
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
  assert 'PUBLISHED SOURCE · FOUNTAIN.COACH / TEATRO' in book
  assert 'id="book-live-stage"' in book
  assert book.count('data-teatro-book-stage')==1
  assert book.count('data-teatro-scene-play')==1
  assert 'src="/assets/teatro-play.svg"' in book
  assert 'src="/assets/teatro-stage-poster.svg"' not in book
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
  assert 'data-legal-role="company-status"' not in book
  assert 'https://teatro.fountain.coach/editions/first-hearing/' in book
  assert book.count('data-estate-id=')==0
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
 assert (SITE/"assets/teatro-play.svg").is_file()
 assert 'book-atlas-title' not in (SITE/"assets/linotype/mobile-page-navigation.js").read_text()
 assert 'cloneNode(true)' not in (SITE/"assets/linotype/mobile-page-navigation.js").read_text()
 assert 'book-atlas-identity' in (SITE/"assets/linotype/mobile-page-navigation.js").read_text()
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

## R16 — Ear nested under Csound controls

Do not restore a separate top-row Ear icon or meter. Keep Play/Pause
and disclosure top-left; the measured output now colors the Play
circle subtly. Ear's real logo belongs inside the progressive
parameter panel, replacing only its redundant word label while
preserving explicit accessible measured-state text. The halo is
driven by source-calibrated Ear RMS and resets on Stop. Honor reduced
motion, keep the original stage and MIDI2 event sources unchanged,
and verify all five responsive layouts plus actual Csound/Ear.
