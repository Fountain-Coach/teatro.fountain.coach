#!/usr/bin/env python3
"""Verbatim book+sound provenance verification for Teatro's first book."""
from html.parser import HTMLParser
from pathlib import Path
import hashlib,json,re

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
  assert book.count('id="satzfunk-hear"')==1
  assert book.count('id="satzfunk-hearing-rail"')==1
  assert 'data-edition-id="teatro-first-hearing"' in book
  assert 'id="book-viewport"' in book and 'id="book-page-atlas"' in book
  assert 'https://fountain.coach/essays/'+SLUG+'/' in book
  assert 'href="#book-live-stage" data-teatro-scene-link' in book
  assert book.count('data-teatro-book-stage')==1
  assert book.count('class="book-art-leaf"')==1
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
 stage=(SITE/"editions/stage/index.html").read_text()
 assert 'src="/assets/index-CY5_5ULO.js"' in stage and 'id="root"' in stage
 assert 'data-teatro-stage-return' in stage
 assert 'href="/editions/first-hearing/"' in stage
 assert 'data-legal-role="company-status"' in stage
 embed=(SITE/"editions/stage/embed/index.html").read_text()
 assert 'src="/assets/index-CY5_5ULO.js"' in embed
 assert '<div id="root"></div>' in embed
 assert '.teatro-sidebar-disclosure{display:none!important}' in embed
 assert "createElement('iframe')" in (SITE/"assets/linotype/teatro-stage-page.js").read_text()
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
