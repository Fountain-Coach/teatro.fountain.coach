"""Score-first Teatro projection. Does not rewrite authored prose or Score art."""
from pathlib import Path
from hashlib import sha256
from html import escape
import json
import re

from integrate_interactive_plate import ANCHOR_ID, SOURCE_SENTENCE

ROOT = Path(__file__).resolve().parents[1]
SCORE = "teatro-score-memory-vector-human-condition.svg"


def admit_score_first(document, source_digest, score_bytes):
    admitted = json.loads((ROOT/"scripts/score-navigation.json").read_text())
    assert admitted["schema"] == "fountain.press.score-trace.v1"
    assert admitted["entry"] == "score" and admitted["scoreId"] == "teatro-score"
    assert admitted["sourceSHA256"] == source_digest
    assert admitted["scoreAsset"] == SCORE
    assert sha256(score_bytes).hexdigest() == admitted["scoreSHA256"]
    assert len(admitted["traces"]) == 1
    trace = admitted["traces"][0]
    assert trace["status"] == "admitted" and trace["id"] == ANCHOR_ID
    assert trace["movement"] == "06" and trace["movementLabel"] == "ATTENTION / AUTHORITY"
    assert trace["sourceParagraphSHA256"] == sha256(SOURCE_SENTENCE.encode()).hexdigest()
    assert sorted(admitted["unmappedMovements"]) == ["01", "02", "03", "04", "05", "07"]

    # The authored SVG is extracted from its former illustrated chapter opener:
    # moved once, never copied, edited, regenerated, or layered over a fake cover.
    pattern = r'<div class="book-opener-art">(?P<figure><figure[^>]*>.*?</figure>)</div>'
    found = re.search(pattern, document, flags=re.S)
    if not found or len(re.findall(pattern, document, flags=re.S)) != 1:
        raise ValueError("Expected one authentic Score figure in source chapter")
    figure = found.group("figure")
    assert figure.count('src="/assets/edition/'+SCORE+'"') == 1
    document = document[:found.start()] + document[found.end():]
    cover = re.search(r'<section class="book-cover"[^>]*>.*?</section>', document, flags=re.S)
    if not cover or document.count('class="book-cover"') != 1:
        raise ValueError("Unexpected conventional cover structure")
    document = document[:cover.start()] + document[cover.end():]
    assert 'class="book-cover"' not in document

    # Movement six is the only navigation region admitted; the other six
    # graphic movements remain quiet and noninteractive.
    trace_id = escape(trace["id"], quote=True)
    score = (
      '<section class="book-score" id="teatro-score" data-score-id="teatro-score" '
      'data-score-source-sha256="'+admitted["scoreSHA256"]+'" '
      'aria-label="Teatro Score — editorial navigation origin">'
      '<div class="teatro-score-original">'+figure
      +'<a class="teatro-score-hotspot" data-score-trace-link '
      'href="#'+trace_id+'" aria-label="Follow Score movement 06: Attention and Authority to the empty-chair passage">'
      '<span class="score-hotspot-mark" aria-hidden="true">↗</span></a></div>'
      '<nav class="teatro-score-navigation" aria-label="Admitted Score trace">'
      '<a data-score-trace-link href="#'+trace_id+'">06 · ATTENTION / AUTHORITY ↗</a>'
      '</nav>'
      '<p class="teatro-navigation-status" id="book-navigation-status" role="status" aria-live="polite"></p>'
      '</section>'
    )
    opening = '<div id="book-flow" class="book-flow">'
    assert document.count(opening) == 1
    document = document.replace(opening, opening+'\n'+score, 1)

    # Bind the already documented source paragraph without touching its text.
    paragraph = '<p>'+SOURCE_SENTENCE+'</p>'
    anchored = ('<p id="'+trace_id+'" data-score-trace-id="'+trace_id+'">'
                +SOURCE_SENTENCE+'</p>')
    assert document.count(paragraph)==1
    document = document.replace(paragraph, anchored, 1)
    # This return is part of publisher navigation furniture, not of the essay.
    original_caption = '<figcaption>TEATRO · SPATIAL SCORE 01 · TOUCH TO EXPLORE</figcaption>'
    replacement_caption = ('<figcaption>TEATRO · SPATIAL SCORE 01 · TOUCH TO EXPLORE '
                           '<a href="#teatro-score" data-score-return aria-label="Return to Teatro Score">← SCORE</a></figcaption>')
    assert document.count(original_caption)==1
    document = document.replace(original_caption, replacement_caption,1)
    # The table of contents must name the actual first leaf.
    old_toc = 'data-book-toc-target="cover" href="#book-cover"'
    assert document.count(old_toc) == 1
    document = document.replace(old_toc,'data-book-toc-target="score" href="#teatro-score"',1)
    document = document.replace('<span class="toc-title">Cover</span>',
                                '<span class="toc-title">Teatro Score</span>',1)
    assert document.count('data-book-toc-target="score"')==1
    assert 'href="#book-cover"' not in document
    body = '<body class="book-app" data-edition-id="teatro-first-hearing"'
    assert document.count(body)==1
    document=document.replace(body, '<body class="book-app" data-edition-entry-anchor="teatro-score" data-edition-id="teatro-first-hearing"',1)

    assert document.count('src="/assets/edition/'+SCORE+'"')==1
    assert document.count('data-score-trace-id="'+trace_id+'"')==1
    assert document.count('data-score-trace-link')==2
    assert document.count('data-score-return')==1
    return document, admitted
