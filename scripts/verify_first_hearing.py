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
 scenario_receipt=manifest["teatroScenario"]
 assert scenario_receipt["scenarioID"]=="teatro.satzfunk-player-ear-wind.01"
 assert scenario_receipt["grammarVersion"]=="0.1"
 assert scenario_receipt["status"]=="candidate-unadmitted"
 assert scenario_receipt["liveAccepted"] is False
 assert scenario_receipt["midi2PlayerOperation"]=="typed-32-bit-UMP-CC74-software-peer; no native hardware connection"
 assert scenario_receipt["midiCiStatus"]=="envelope-codec-only; no live discovery or negotiation"
 scenario_path=SITE/"scenarios/satzfunk-player/ear-wind/scenario.json"
 scenario=json.loads(scenario_path.read_text())
 assert scenario["scenarioID"]==scenario_receipt["scenarioID"]
 assert scenario["status"]==scenario_receipt["status"]
 assert sha(scenario_path.read_bytes())==scenario_receipt["resourceSHA256"]
 assert scenario_path.read_bytes()==(ROOT/"scenarios/satzfunk-player/ear-wind.candidate.json").read_bytes()
 route=(SITE/"scenarios/satzfunk-player/ear-wind/index.html").read_text()
 assert sha(route.encode())==scenario_receipt["routeHTMLSHA256"]
 assert 'id="scenario-prepare"' in route and 'id="scenario-start"' in route and 'id="scenario-stop"' in route
 assert 'src="./runner.mjs"' in route and (scenario_path.parent/"runner.mjs").is_file()
 assert "does not claim a physical MIDI 2.0 port" in route
 assert "no live discovery or profile negotiation" in route
 runtime_entry=next(row for row in manifest["runtimeFiles"] if row["name"]=="satzfunk-player/teatro-scenario-runtime.mjs")
 assert sha((SITE/"assets/linotype/satzfunk-player/teatro-scenario-runtime.mjs").read_bytes())==runtime_entry["sha256"]
 assert manifest["satzfunkPlayerSourceCommit"]=="24024c0348e58491e1fabb37856ded167593fcfb"
 assert manifest["sourceMutation"] is False
 ear_entry=next(row for row in manifest["runtimeFiles"] if row["name"]=="ear-original.js")
 assert sha((SITE/"assets/linotype/ear-original.js").read_bytes())==ear_entry["sha256"]=="4f1d800fd5518975c0bc98a5fb0ace93eaa726d8731bf330a8eff59a9d115427"
 assert sha((SITE/"assets/edition/teatro-score-memory-vector-human-condition.svg").read_bytes())==manifest["originalScorePlateSHA256"]
 mapping=manifest["scoreNavigation"]
 assert mapping==json.loads((ROOT/'scripts/score-navigation.json').read_text())
 assert mapping["sourceSHA256"]==manifest["authoredSourceSHA256"]
 assert mapping["scoreSHA256"]==manifest["originalScorePlateSHA256"]
 assert manifest["openingIdentity"]==mapping["scoreId"]=="teatro-score"
 assert manifest["semanticEntryPolicy"]=="score-first-not-implicit-resume"
 assert len(mapping["traces"])==1 and mapping["traces"][0]["status"]=="admitted"
 assert sorted(mapping["unmappedMovements"])==["01","02","03","04","05","07"]
 assert mapping["traces"][0]["sourceParagraphSHA256"]==sha(SOURCE_SENTENCE.encode())
 for path in ["editions/first-hearing/index.html"]:
  book=(SITE/path).read_text()
  assert 'id="book-flow" class="book-flow"' in book
  assert book.count('data-book-chapter=')==1
  assert book.count('data-book-toc-target=')==2
  assert book.count('src="/assets/edition/')==1
  entry=book.split('<main id="book-pages"',1)[1].split('<div id="book-flow"',1)[0]
  assert '<section class="book-score" id="teatro-score"' in entry
  assert 'src="/assets/edition/teatro-score-memory-vector-human-condition.svg"' in entry
  opening=book.split('<div id="book-flow" class="book-flow">',1)[1].lstrip()
  assert opening.startswith('<section class="book-chapter"')
  assert 'class="book-score"' not in opening
  assert 'class="book-cover"' not in book
  assert book.count(' id="teatro-score"')==1 and book.count('data-score-id="teatro-score"')==1
  assert 'data-edition-entry-anchor="teatro-score"' in book
  assert 'data-book-toc-target="score"' in book and '>Teatro Score</span>' in book
  assert book.count('data-score-trace-link')==2 and book.count('data-score-return')==1
  trace_id=mapping['traces'][0]['id']
  assert book.count('data-score-trace-id="'+trace_id+'"')==1
  assert book.count('href="#'+trace_id+'"')==2
  assert book.count('data-source-anchor="'+trace_id+'"')==1
  assert 'id="'+trace_id+'"' in book
  assert 'id="book-navigation-status" role="status"' in book
  assert 'id="book-cover"' not in book
  assert '.teatro-score-hotspot {' in (SITE/'assets/linotype/teatro.css').read_text()
  engine=(SITE/'assets/linotype/linotype-engine.js').read_text()
  controller=(SITE/'assets/linotype/book.js').read_text()
  assert 'book-score' in engine and 'data-score-trace-id' in engine
  assert 'editionEntryAnchor' in controller and 'data-score-trace-link' in controller
  assert 'history.pushState' in controller and 'popstate' in controller
  assert book.count('aria-current="page"')==0
  assert 'class="book-toolbar book-reading-controls"' in book
  assert 'class="book-pagination book-reading-pagination"' in book
  assert 'class="book-back"' not in book
  assert 'class="edition-rail"' not in book
  assert 'class="book-legal"' not in book
  assert '<a href="/editions/">' not in book
  assert book.count('class="fc-identity-circle" id="book-media-toggle"')==1
  assert book.count('class="book-ear-icon"')==1
  assert 'id="book-ear-reading"' in book
  assert 'class="book-player-status book-ear-status" id="book-ear-status"' in book
  assert book.index('id="book-media-details"') < book.index('class="book-ear-icon"')
  assert book.count('id="book-ear-status"')==1
  assert '<p class="book-player-status" id="book-ear-status">Ear · idle</p>' not in book
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
  assert 'href="/scenarios/satzfunk-player/ear-wind/"' in book
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
 root=(SITE/"index.html").read_text()
 assert root==(SITE/"editions/index.html").read_text()
 assert root!=(SITE/"editions/first-hearing/index.html").read_text()
 assert 'data-linotype-state="bookshelf"' in root
 assert 'data-book-count="3"' in root
 assert 'id="book-viewport"' not in root
 assert root.count('class="shelf-book"')==3
 assert root.count('class="shelf-cover"')==3
 assert 'class="shelf-miniature"' not in root
 assert 'href="/editions/first-hearing/"' in root
 assert 'https://fountain.coach/editions/essays/' in root
 assert 'https://works.benedikt-eickhoff.de/solstice/editions/first-reading/' in root
 assert root.count('data-preview-host="fountain"')==1
 assert root.count('data-preview-host="solstice"')==1
 assert root.count('data-preview-host="teatro"')==1
 assert 'src="/assets/edition/teatro-score-memory-vector-human-condition.svg"' in root
 assert root.count('class="bookshelf-brand fc-identity-circle"')==1
 identity_asset=next(row for row in manifest["runtimeFiles"] if row["name"]=="identity-circle.css")
 assert sha((SITE/"assets/linotype/identity-circle.css").read_bytes())==identity_asset["sha256"]
 assert '@import url("./identity-circle.css")' in (SITE/'assets/linotype/book-player.css').read_text()
 assert 'class="bookshelf-wordmark"' not in root
 assert 'FOUNTAIN COACH</span>' not in root
 assert root.count('src="/assets/bookshelf/fountain-coach-logo-transparent.png"')==1
 assert 'class="bookshelf-toolbar"' not in root
 assert 'class="bookshelf-pagination"' not in root
 assert 'class="bookshelf-paper-head"' not in root
 assert 'class="bookshelf-paper-foot"' not in root
 assert 'class="shelf-cover-kicker"' not in root
 assert 'class="shelf-cover-title"' not in root
 assert '<h1' not in root
 assert 'BOOKSHELF</span>' not in root
 assert '06 / 06' not in root
 assert root.count('class="shelf-cover"')==3
 assert root.count('class="shelf-book"')==3
 assert root.count('class="shelf-cover"')==root.count('<span class="shelf-cover"')
 assert not any(x in root for x in ['EDITION 01</span>','SOURCE 31','3 BOOKS','30 WORKS</span>'])
 assert sha((SITE/"assets/bookshelf/fountain-coach-logo-transparent.png").read_bytes())=="8c5fad1c3db56138d5959da75991dc8034a0be537ce46da6ffcc0d9655e7f729"

 assert 'teatro-stage' not in root
 assert 'governance-constitution' not in root and 'book-of-reframe' not in root
 assert root.count('data-release-status="wlan-proof"')==2
 assert root.count('data-release-status="public-live"')==1
 assert 'class="shelf-item-caption"' not in root
 assert 'class="shelf-item-detail"' not in root
 assert 'class="shelf-item-revision"' not in root
 assert 'class="bookshelf-intro"' not in root
 assert root.count('class="shelf-book"')==root.count('class="shelf-cover"')==3
 manifest_all=json.loads((ROOT/"edition.json").read_text())
 assert len(manifest_all["bookshelfBooks"])==3
 assert [b["id"] for b in manifest_all["bookshelfBooks"]]==["fountain-coach","first-reading","teatro-first-hearing"]
 for row in manifest_all["bookshelfBooks"]:
  assert (SITE/row["art"].lstrip("/")).is_file(),row["id"]
 shelf_css=(SITE/"assets/linotype/bookshelf.css").read_text()
 assert 'background:transparent;' in shelf_css
 assert 'box-shadow:none;' in shelf_css
 assert 'background:var(--paper);' not in shelf_css
 ink=SITE/"assets/bookshelf/first-reading-ink.png"
 assert ink.is_file() and sha(ink.read_bytes())=="274dab8c594e399585fa5238364f25e95fc7ffa3808eaef872de406ec79f745f"
 assert ink.read_bytes()[25] in (4,6),"First Reading artwork must have real PNG alpha"
 assert 'src="/assets/bookshelf/first-reading-ink.png"' in root
 assert '.bookshelf-paper{width:100%;display:grid' in shelf_css
 assert 'grid-template-columns:repeat(6,minmax(0,1fr))' in shelf_css
 assert 'grid-template-columns:repeat(4,minmax(0,1fr))' in shelf_css
 assert 'grid-template-columns:repeat(2,minmax(0,1fr))' in shelf_css
 assert root.count('class="bookshelf-empty" aria-hidden="true"')==20
 assert '.bookshelf-books{display:contents' in shelf_css
 assert 'bookshelf-books::after' not in shelf_css
 assert '.shelf-item:last-child' not in shelf_css
 assert '.bookshelf-empty{border:1px dashed var(--vacant)' in shelf_css
 assert (SITE/"assets/linotype/bookshelf.css").is_file()
 assert (SITE/"editions/first-hearing/index.html").is_file()
 assert manifest["scenePlacement"]=="inside-authored-prose"
 assert "mediaWithAnchor(" in (SITE/"assets/linotype/linotype-engine.js").read_text()
 assert (SITE/"assets/linotype/mixed-media.css").is_file()
 assert (SITE/"assets/teatro-play.svg").is_file()
 assert 'book-atlas-title' not in (SITE/"assets/linotype/mobile-page-navigation.js").read_text()
 assert 'cloneNode(true)' not in (SITE/"assets/linotype/mobile-page-navigation.js").read_text()
 assert 'book-atlas-identity' in (SITE/"assets/linotype/mobile-page-navigation.js").read_text()
 stage=(SITE/"editions/stage/index.html").read_text()
 assert 'src="/assets/index-BYTRORXG.js"' in stage and 'id="root"' in stage
 assert 'data-teatro-stage-return' in stage
 assert 'href="/editions/first-hearing/"' in stage
 assert 'data-legal-role="company-status"' in stage
 embed=(SITE/"editions/stage/embed/index.html").read_text()
 assert 'src="/assets/index-BYTRORXG.js"' in embed
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
 projected=(SITE/"assets/index-BYTRORXG.js")
 assert projected.is_file() and sha(projected.read_bytes())==manifest["teatroStageWebBundleSHA256"]
 assert manifest["teatroStageWebSourceCommit"]=="a1d2ec578181c3916627834d56d739e582cd7880"
 projection_source=projected.read_text()
 assert "fountain.teatro.scenario-projection.v1" in projection_source
 print("STAGE_WEB_SCENARIO_PROJECTION",manifest["teatroStageWebSourceCommit"],projected.stat().st_size,"javascript bytes")
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
