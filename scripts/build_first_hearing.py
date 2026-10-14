#!/usr/bin/env python3
"""Build Teatro's first book and retain the original Csound stage as a sub-edition.

Canonical authorial source: Fountain-Coach/fountain.coach published Teatro essay.
Pagination source: admitted Fountain Press/First Reading Linotype runtime.
Audio UX: source-bound Satzfunk hearing rail, with NO invented speech/media.
"""
from pathlib import Path
import argparse
import hashlib
import json
import re
import shutil
import subprocess
from integrate_interactive_plate import integrate

ROOT=Path(__file__).resolve().parents[1]
SITE=ROOT/"site"
SLUG="teatro-an-unfinished-composition"
BOOK="editions/first-hearing/"
CANON="https://teatro.fountain.coach/"+BOOK
SCORE="teatro-score-memory-vector-human-condition.svg"
def sha(data):return hashlib.sha256(data).hexdigest()
def git_sha(path):return subprocess.check_output(["git","-C",str(path),"rev-parse","HEAD"],text=True).strip()

def main(fountain,satzfunk,press,stage_source):
 fountain=fountain.resolve()
 satzfunk=satzfunk.resolve()
 press=press.resolve()
 stage_source=stage_source.resolve()
 upstream=fountain/"site/editions/essays"/SLUG/"index.html"
 prose=fountain/"site/essays"/SLUG/"index.html"
 edition_meta=json.loads((fountain/"site/essays/edition-manifest.json").read_text())
 manuscript=next(x for x in edition_meta["essays"] if x["id"]==SLUG)
 assert sha(prose.read_bytes())==manuscript["sourceSHA256"],"Author essay content changed"
 art=prose.parent/"assets"/SCORE
 assert sha(art.read_bytes())==manuscript["images"][0]["sha256"]
 source=upstream.read_bytes()
 document=source.decode("utf-8")
 assert document.count('data-book-chapter=')==1
 assert document.count('src="/essays/')==1
 assert 'id="book-viewport"' in document
 assert 'class="edition-rail"' in document

 # Preserve the entire original interactive Csound stage as a nested Stage
 # edition. Never edit the minified renderer or supply fixture sound.
 stage=SITE/"editions/stage";stage.mkdir(parents=True,exist_ok=True)
 current_stage=SITE/"index.html"
 if (stage/"index.html").exists():
  original=(stage/"index.html").read_text()
 else:
  original=current_stage.read_text()
 assert 'src="/assets/index-CY5_5ULO.js"' in original
 assert 'id="root"' in original
 if 'data-teatro-stage-return' not in original:
  original=original.replace('<main id="main"',
    '<nav class="teatro-stage-return" data-teatro-stage-return aria-label="Return to reading"><a href="/editions/first-hearing/">← Return to the Teatro book</a><span>LIVE CSOUND STAGE · USER-ACTIVATED SOUND</span></nav>\n  <main id="main"')
  original=original.replace('</head>','<style>.teatro-stage-return{display:flex;justify-content:space-between;gap:12px;flex-wrap:wrap;padding:8px 5vw;border-bottom:1px solid #c6bbaa;font:600 10px/1.5 ui-monospace,monospace;letter-spacing:.05em}.teatro-stage-return a{color:inherit;text-decoration:underline;text-underline-offset:3px}</style>\n</head>')
  original=original.replace('<link rel="canonical" href="https://teatro.fountain.coach/">',
                            '<link rel="canonical" href="https://teatro.fountain.coach/editions/stage/">')
 (stage/"index.html").write_text(original)

 # Source image bytes are pinned; only its local path changes.
 asset=SITE/"assets/edition";asset.mkdir(parents=True,exist_ok=True)
 shutil.copyfile(art,asset/SCORE)
 document=document.replace('/essays/'+SLUG+'/assets/'+SCORE,'/assets/edition/'+SCORE)
 document=document.replace('https://fountain.coach/editions/essays/'+SLUG+'/',CANON)
 document=document.replace('Fountain Coach — Teatro — An Unfinished Composition',
                           'Teatro — An Unfinished Composition · First Hearing')
 document=document.replace('Three complete essays by Benedikt Eickhoff, in the measured Linotype reader.',
                           'Teatro. The original essay opens as a Linotype book; performance and sound follow by invitation.')
 document=document.replace('<body class="book-app" data-edition-id="essays-'+SLUG+'">',
                           '<body class="book-app" data-edition-id="teatro-first-hearing">')
 document=document.replace('href="/editions/essays/" aria-label="Back to Essays"',
                           'href="/editions/" aria-label="Teatro editions"')
 document=document.replace('<span>Essays</span></a>','<span>Teatro Editions</span></a>')
 document=document.replace('href="/editions/essays/"','href="/editions/"')
 document=document.replace('href="/editions/" aria-current="page" title="Fountain Coach essays"',
                           'href="https://fountain.coach/editions/essays/" title="Fountain Coach essays"')
 document=document.replace('href="https://teatro.fountain.coach/" title="Teatro"',
                           'href="'+CANON+'" aria-current="page" title="Teatro first hearing"')
 document=document.replace('data-estate-id="estate" href="https://fountain.coach/editions/essays/" aria-current="page"',
                           'data-estate-id="estate" href="https://fountain.coach/editions/essays/"')
 document=document.replace('<span>FOUNTAIN COACH · THE CONDITION</span>',
                           '<span>TEATRO · FIRST HEARING</span>')
 document=document.replace('<span>FOUNTAIN COACH · ESSAYS</span>',
                           '<span>TEATRO · FIRST HEARING</span>')
 document=document.replace('<span>FOUNTAIN COACH</span><span>ESSAYS · SUB-EDITION 01</span>',
                           '<span>TEATRO</span><span>FIRST HEARING · EDITION 01</span>')
 document=document.replace('<p class="book-imprint">THE CONDITION</p>',
                           '<p class="book-imprint">A SCORE FOR WRITING AND HEARING</p>')
 document=document.replace('<p class="book-cover-subtitle">Benedikt Eickhoff</p>',
                           '<p class="book-cover-subtitle">Benedikt Eickhoff · Teatro</p>')
 document=document.replace('COMPLETE ORIGINAL ESSAY · 1 ORIGINAL PLATE<br><a href="/editions/">All essays →</a>',
                           'COMPLETE ORIGINAL ESSAY · ONE ORIGINAL TEATRO SCORE<br><a href="/editions/stage/">Enter the sounding stage →</a>')
 document=document.replace('href="/editions/">All three essays →',
                           'href="/editions/">Teatro editions →')
 document=document.replace('<a href="/editions/">All essays →</a>',
                           '<a href="/editions/">Teatro editions →</a>')
 assert document.count('data-book-chapter=')==1
 assert document.count('src="/assets/edition/')==1
 assert document.count('aria-current="page"')==1, "Teatro should be the active rail"
 assert document.count('data-book-toc-target=')==2
 assert 'href="'+CANON+'"' in document

 # Use exactly the currently accepted source Linotype runtime plus the
 # actual, reviewed Satzfunk listening adapter (not a second audio app).
 source_assets=fountain/"site/assets/linotype"
 output_assets=SITE/"assets/linotype";output_assets.mkdir(parents=True,exist_ok=True)
 runtime=[]
 for name in ["book.css","book.js","book-boot.js","reading-layout-policy.js",
              "linotype-engine.js","mobile-page-navigation.js",
              "mobile-page-navigation.css","essays.css"]:
  raw=((press/"runtime/linotype-engine.js") if name=="linotype-engine.js"
       else source_assets/name).read_bytes()
  (output_assets/name).write_bytes(raw)
  runtime.append({"name":name,"sha256":sha(raw)})
 (output_assets/"teatro.css").write_text(
   '/* Teatro is a book before it is a stage; preserve Linotype geometry. */\n'
   '.teatro-stage-link{align-self:center;font:600 11px/1.3 ui-monospace,Menlo,monospace;text-decoration:none;white-space:nowrap;border-bottom:1px solid var(--book-rule);padding:8px 6px}\n'
   '.teatro-stage-link:hover{border-bottom-color:var(--book-accent)}\n'
   '.book-tools{align-items:center}\n'
   '.book-cover .subedition-title{font-size:clamp(28px,5vw,50px)}\n'
   '@media(max-width:700px){.teatro-stage-link{font-size:9px;padding:6px 4px}.book-tools button{padding:5px!important}}\n')
 # Fountain Press: deterministic UMP and compact player shell.
 for media_name in ('book-midi2.mjs','book-player.css'):
  shutil.copyfile(press/'runtime'/media_name,output_assets/media_name)
 shutil.copyfile(ROOT/'scripts/book-player.mjs',output_assets/'book-player.mjs')
 csound_host=stage_source/'dist-book-csound/book-csound-host.js'
 assert csound_host.stat().st_size>100_000, 'Compile source-owned Csound book host'
 shutil.copyfile(csound_host,SITE/'assets/book-csound-host.js')
 adapter=satzfunk/"station/satzfunk-book.mjs"
 adapter_css=satzfunk/"station/satzfunk-book.css"
 audio=SITE/"assets/satzfunk";audio.mkdir(parents=True,exist_ok=True)
 shutil.copyfile(adapter,audio/"satzfunk-book.mjs")
 shutil.copyfile(adapter_css,audio/"satzfunk-book.css")

 # A hearing manifest would need an author-reviewed, source-matched released
 # recording. Its absence is intentional and shown truthfully in the rail.
 # The actual live Csound scene is separate and playable only on activation.
 bare_document=document
 bare_sha=sha(bare_document.encode())
 document=document.replace("style-src 'self'; img-src 'self'; script-src 'self';",
                           "style-src 'self'; img-src 'self'; script-src 'self'; connect-src 'self'; media-src 'self';")
 document=document.replace('</head>',
     '<link rel="stylesheet" href="/assets/linotype/teatro.css">\n'
     '<link rel="stylesheet" href="/assets/satzfunk/satzfunk-book.css">\n'
     '<meta name="satzfunk-edition-url" content="'+CANON+'">\n'
     '<meta name="satzfunk-source-sha256" content="'+bare_sha+'">\n'
     '<script type="module" src="/assets/satzfunk/satzfunk-book.mjs"></script>\n</head>')
 document=document.replace('<div class="book-tools">',
     '<div class="book-tools"><a class="teatro-stage-link" href="/editions/stage/" aria-label="Open the live Teatro stage, where interactive sound can be activated">Stage ↗</a>')
 document=document.replace('<button type="button" id="book-toc-button"',
     '<button type="button" id="satzfunk-hear" aria-controls="satzfunk-hearing-rail" aria-expanded="false">Hear</button>\n    <button type="button" id="book-toc-button"')
 hearing='<aside id="satzfunk-hearing-rail" class="satzfunk-hearing" aria-label="Satzfunk first hearing" hidden data-satzfunk-controls>\n' + (
   '<div class="satzfunk-hearing-head"><span>SATZFUNK · FIRST HEARING</span><button type="button" id="satzfunk-close" aria-label="Return to reading">×</button></div>\n'
   '<div id="satzfunk-hearing-status" class="satzfunk-hearing-status" role="status">Checking for an approved listening edition…</div>\n'
   '<div id="satzfunk-hearing-tracks"></div>\n'
   '<p class="satzfunk-stage-note">The interactive <a href="/editions/stage/">Teatro stage</a> has live browser-Csound sound, activated by the visitor. It is not a recorded narration of this text.</p>\n'
   '</aside>\n')
 document=document.replace('<footer class="book-pagination"',hearing+'<footer class="book-pagination"')
 assert document.count('id="satzfunk-hear"')==1
 assert document.count('id="satzfunk-hearing-rail"')==1
 assert 'src="/assets/satzfunk/satzfunk-book.mjs"' in document
 with (output_assets/"teatro.css").open("a") as css:
  css.write('.satzfunk-stage-note{font:12px/1.5 Iowan Old Style,Georgia,serif;text-align:center;color:var(--book-muted)}.satzfunk-stage-note a{text-underline-offset:3px}\n')

 # Compile the fallback in the stage's original source owner; never invent
 # a second puppet in this HTML publisher. Copy exactly its existing build.
 fallback=stage_source/"dist-book-fallback/book-puppet-fallback.js"
 assert fallback.is_file() and fallback.stat().st_size>1000, "Build canonical StageEngine fallback first"
 shutil.copyfile(fallback,SITE/"assets/book-puppet-fallback.js")
 document=integrate(document,output_assets,press/"runtime/mixed-media.css",manuscript["sourceSHA256"])
 assert document.count('data-teatro-book-stage')==1

 # Domain root is *the edition*, not the app. An actual book remains
 # directly addressable even when its main landing changes later.
 edition_dir=SITE/BOOK;edition_dir.mkdir(parents=True,exist_ok=True)
 (edition_dir/"index.html").write_text(document)
 (SITE/"index.html").write_text(document)
 index=SITE/"editions/index.html"
 index.parent.mkdir(parents=True,exist_ok=True)
 index.write_text('<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width"><meta name="robots" content="noindex,nofollow"><title>Teatro Editions</title><link rel="stylesheet" href="/assets/linotype/essays.css"></head><body style="background:#f4f0e8;color:#29251d;font:18px/1.5 Georgia,serif;max-width:45rem;margin:0 auto;padding:3rem 1.5rem"><small>TEATRO · THE EDITIONS</small><h1>Teatro.</h1><p><a href="/editions/first-hearing/">First Hearing · The authored book</a></p><p><a href="/editions/stage/">Stage · A sounding, executable space</a></p><p>The book is the entrance; stage and sound follow by invitation.</p><footer class="catalogue-footer"><nav class="footer-legals" aria-label="Legal and company information"><a href="https://status.fountain.coach/" data-legal-role="company-status">Company status &amp; transparency</a> · <a href="https://governance.fountain.coach/legal/">Legal notices</a></nav></footer></body></html>\n')

 receipt={
  "schema":"teatro.fountain.press.first-hearing.v1",
  "edition":"Teatro — An Unfinished Composition · First Hearing",
  "publicationRole":"book-first-with-page-embedded-interactive-WebGL-stage",
  "canonical":CANON,"stageEdition":"editions/stage/",
  "owningRepository":"Fountain-Coach/teatro.fountain.coach",
  "authoredSourceRepository":"Fountain-Coach/fountain.coach",
  "authoredSourceCommit":git_sha(fountain),
  "authoredSourceURL":manuscript["publishedSource"],
  "authoredSourceSHA256":manuscript["sourceSHA256"],
  "paragraphsSHA256":manuscript["paragraphsSHA256"],
  "originalParagraphs":manuscript["originalParagraphs"],
  "originalScorePlateSHA256":manuscript["images"][0]["sha256"],
  "readerSourceHTMLSHA256":sha(source),
  "bookHTMLBeforeSatzfunkSHA256":bare_sha,
  "runtimeFiles":runtime,
  "fountainPressCommit":git_sha(press),
  "sceneAnchorId":"teatro:unfinished-composition:empty-chair-attention",
  "sceneElementId":"teatro:unfinished-composition:spatial-relation-01",
  "scenePlacement":"inside-authored-prose",
  "bookMidi2Implementation":"Fountain Press UMP local event plane",
  "bookAudioModes":["csound-worklet-on-secure-origin","web-audio-local-preview"],
  "bookEarBoundary":"real output samples and typed observations only",
  "bookCsoundHostSHA256":sha(csound_host.read_bytes()),
  "puppetFallbackRuntimeSHA256":sha(fallback.read_bytes()),
  "puppetFallbackSource":"midi2-gpu-fabric/apps/teatro-stage-web/src/embedded/book-puppet-fallback.tsx",
  "puppetFallbackSourceCommit":git_sha(stage_source),
  "satzfunkSourceRepository":"Fountain-Coach/Satzfunk",
  "satzfunkCommit":git_sha(satzfunk),
  "satzfunkAdapterSHA256":sha(adapter.read_bytes()),
  "hearingStatus":"not-yet-released","approvedNarration":False,
  "stageAudio":"interactive-browser-csound-user-activated; not a spoken book",
  "releaseStatus":"Git source candidate, public Teatro homepage unchanged",
  "bookPath":BOOK,"rootLanding":"book-mirrors-first-hearing",
  "sourceMutation":False
 }
 (edition_dir/"edition.json").write_text(json.dumps(receipt,indent=2,ensure_ascii=False)+"\n")
 assetpaths=sorted(p for p in SITE.rglob("*") if p.is_file())
 inventory=''.join(sha(p.read_bytes())+'  '+p.relative_to(SITE).as_posix()+'\n' for p in assetpaths)
 (ROOT/"publication-files.sha256").write_text(inventory)
 edit=ROOT/"edition.json";manifest=json.loads(edit.read_text())
 manifest.update({
  "publicationState":"source-candidate-book-first-teatro-first-hearing-not-publicly-deployed",
  "editorialLanding":"editions/first-hearing/",
  "firstAudioSurface":"editions/first-hearing/#book-live-stage",
  "sceneComposition":"authored-paragraph-anchored-mixed-media",
  "embeddedInteractiveScene":"editions/stage/embed/",
  "stageAudioClaim":"browser-Csound on explicit interaction, not released narration",
  "sourceAuthority":"Fountain-Coach/teatro.fountain.coach (book); Fountain-Coach/fountain.coach (verbatim manuscript); Fountain-Coach/Satzfunk (hearing rail)",
  "fileCount":len(assetpaths),
  "indexPages":sum(p.name=="index.html" for p in assetpaths),
  "sourceSha256Inventory":sha(inventory.encode()),
 })
 edit.write_text(json.dumps(manifest,indent=2,ensure_ascii=False)+"\n")
 print("TEATRO_BOOK_FIRST",len(assetpaths),"site files",manuscript["originalParagraphs"],"original paragraphs",CANON)
 print("SOUND_STAGE",stage/"index.html","no invented or released speech")
if __name__=="__main__":
 p=argparse.ArgumentParser()
 p.add_argument("--fountain-source",type=Path,required=True)
 p.add_argument("--satzfunk-source",type=Path,required=True)
 p.add_argument("--press-source",type=Path,required=True)
 p.add_argument("--stage-source",type=Path,required=True)
 a=p.parse_args()
 main(a.fountain_source,a.satzfunk_source,a.press_source,a.stage_source)
