"""Project the original Teatro renderer as an anchored mixed-media essay element.

This is a book projection. Source remains exact; Fountain Press owns measure,
and the Teatro compiled renderer owns the actual animation and audio capability.
"""
from pathlib import Path
from hashlib import sha256
from html import unescape
import re

ROOT=Path(__file__).resolve().parents[1]
SITE=ROOT/"site"
STAGE_SCRIPT="/assets/index-CY5_5ULO.js"
ANCHOR_ID="teatro:unfinished-composition:empty-chair-attention"
SCENE_ID="teatro:unfinished-composition:spatial-relation-01"
SOURCE_SENTENCE="This is an old knowledge of theatre. Put an empty chair on a stage and wait long enough. It ceases to be furniture. Attention changes it."

EMBED="""<!doctype html><html lang="en"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">
<title>Teatro · Spatial element</title>
<style>
html,body,#root{width:100%;height:100%;min-height:0;margin:0;overflow:hidden;background:transparent}
#root>div{height:100%!important;min-height:0;background:transparent!important}
#root main,#root main>div,#teatro-stage-scene{
  height:100%!important;min-height:0!important;max-height:100%!important;
  overflow:hidden!important;
}
.teatro-sidebar-disclosure{display:none!important}
#teatro-stage-scene canvas,#teatro-stage-scene svg{width:100%!important;height:100%!important;display:block}
/* Book ink contrast for the fallback only; the WebGL implementation is unchanged. */
#teatro-stage-scene svg > g:nth-of-type(1){stroke:#777065}
#teatro-stage-scene svg > g:nth-of-type(2){stroke:#937756}
#root [role="status"]{position:absolute!important;width:1px!important;height:1px!important;
  padding:0!important;overflow:hidden!important;clip-path:inset(50%)!important;white-space:nowrap!important}
@media(prefers-reduced-motion:reduce){*{animation-duration:.01ms!important;animation-iteration-count:1!important}}
</style>
<script type="module" src="/assets/index-CY5_5ULO.js"></script>
<script>
document.addEventListener('DOMContentLoaded', () => {
  const root=document.getElementById('root');
  // Source SVG fallback extends past its own 600-unit viewBox (to y=652).
  // Correct only the presentation viewport, not its source paths or animation.
  const view=new MutationObserver(() => {
    const svg=root.querySelector('#teatro-stage-scene > svg');
    if(svg && svg.getAttribute('viewBox')==='0 0 800 600')
      svg.setAttribute('viewBox','0 0 800 710');
  });
  view.observe(root,{subtree:true,childList:true});
});
</script></head>
<body><div id="root"></div></body></html>
"""

LIFECYCLE=r"""/* R12: release Teatro renderer whenever the anchored paper element is not
   visible. The source-addressed figure is typeset before this script runs.
   This JS does not authorize sound, editorial mutation or narration. */
(() => {
'use strict';
const viewport=document.querySelector('#book-viewport');
const stage=viewport?.querySelector('.linotype-stage');
if(!viewport||!stage)return;
let mounted=null, lastWindow=null, pending=false;
const activeLeaf=()=>[...stage.children].find(sheet=>sheet.matches?.('.linotype-sheet')&&sheet.querySelector('[data-teatro-book-stage]'));
function release(){
 if(mounted){mounted.removeAttribute('src');mounted.remove();mounted=null;}
 if(lastWindow){const poster=lastWindow.querySelector('img');if(poster)poster.hidden=false;lastWindow=null;}
 document.body.dataset.teatroScene='inactive';
}
function sync(){
 pending=false;
 const leaf=activeLeaf();
 if(!leaf||document.body.dataset.bookReady!=='true'||['active','drag','rebound','finishing'].includes(document.body.dataset.turnMotion)){
  release();return;
 }
 const windowEl=leaf.querySelector('.press-media-stage');
 if(!windowEl)return;
 if(mounted&&lastWindow===windowEl&&mounted.isConnected)return;
 release();
 const frame=document.createElement('iframe');
 frame.title='Interactive Teatro spatial score. Move inside the scene to orbit; press Enter for an explicitly user-activated cue.';
 frame.dataset.teatroLiveFrame='true';
 frame.loading='eager';
 // Intentionally no iframe autoplay permission. Sound requires a gesture.
 frame.setAttribute('aria-label','Animated spatial score within this book passage');
 frame.src='/editions/stage/embed/';
 windowEl.append(frame);
 const poster=windowEl.querySelector('img');if(poster)poster.hidden=true;
 mounted=frame;lastWindow=windowEl;
 document.body.dataset.teatroScene='active';
}
function schedule(){
 if(pending)return;
 pending=true;
 requestAnimationFrame(sync);
}
const observer=new MutationObserver(schedule);
observer.observe(stage,{childList:true,subtree:false});
observer.observe(document.body,{attributes:true,attributeFilter:['data-book-ready','data-turn-motion']});
window.addEventListener('pagehide',release);
window.addEventListener('resize',schedule);
schedule();
})();"""

def integrate(document, output_assets, mixed_media_css, source_sha):
    # Pin relation to exactly the observed author's original paragraph.
    paragraph=re.search(r'<p>'+re.escape(SOURCE_SENTENCE)+r'</p>', document)
    if not paragraph or document.count(SOURCE_SENTENCE)!=1:
        raise ValueError("The original empty-chair passage cannot be source-addressed")
    source_digest=sha256(SOURCE_SENTENCE.encode()).hexdigest()
    element=(
        '<figure class="press-anchored-media teatro-spatial-score" id="book-live-stage" '
        'data-press-media="spatial-scene" data-keep-with-anchor="previous" '
        'data-press-interactive="true" data-teatro-book-stage '
        'data-scene-id="'+SCENE_ID+'" '
        'data-source-anchor="'+ANCHOR_ID+'" '
        'data-source-paragraph-sha256="'+source_digest+'" '
        'data-source-revision-sha256="'+source_sha+'" '
        'aria-label="Teatro spatial score bound to the passage on theatrical attention">'
        '<div class="press-media-stage">'
        '<img src="/assets/teatro-stage-poster.svg" width="800" height="600" '
        'alt="An unoccupied isometric theatrical space, held within the text">'
        '</div>'
        '<figcaption>TEATRO · SPATIAL SCORE 01 · TOUCH TO EXPLORE</figcaption></figure>'
    )
    document=document.replace(paragraph.group(0),paragraph.group(0)+'\n'+element)
    assert document.count('data-teatro-book-stage')==1
    assert document.count('<section class="book-art-leaf"')==0
    document=document.replace("media-src 'self';","media-src 'self'; frame-src 'self';")
    assert "frame-src 'self'" in document
    document=document.replace('<body class="book-app" data-edition-id="teatro-first-hearing">',
      '<body class="book-app" data-edition-id="teatro-first-hearing" '
      'data-edition-running-title="TEATRO · FIRST HEARING" '
      'data-edition-imprint="TEATRO · FOUNTAIN COACH">')
    document=document.replace('<div class="book-tools"><a class="teatro-stage-link" href="/editions/stage/" aria-label="Open the live Teatro stage, where interactive sound can be activated">Stage ↗</a>',
       '<div class="book-tools"><a class="teatro-stage-link" href="#book-live-stage" data-teatro-scene-link aria-label="Go to the animated score in the essay">Scene ↓</a>')
    document=document.replace('COMPLETE ORIGINAL ESSAY · ONE ORIGINAL TEATRO SCORE<br><a href="/editions/stage/">Enter the sounding stage →</a>',
      'COMPLETE ORIGINAL ESSAY · ORIGINAL SCORE AND SPATIAL COMPOSITION')
    document=document.replace('The interactive <a href="/editions/stage/">Teatro stage</a> has live browser-Csound sound, activated by the visitor.',
      'The <a href="#book-live-stage" data-teatro-scene-link>spatial element in the essay</a> includes a user-activated Teatro instrument cue.')
    document=document.replace('FOUNTAIN COACH · ESSAYS</small><h2 id="book-contents-title"',
                              'TEATRO · FIRST HEARING</small><h2 id="book-contents-title"')
    document=document.replace('All five original plates are shown in full.',
                              'The original score and spatial element remain part of the book.')
    # The page engine receives the figure *before* pagination, and Press owns its
    # measured size. No Teatro-specific giant framed page overrides.
    (output_assets/'mixed-media.css').write_bytes(mixed_media_css.read_bytes())
    document=document.replace('<link rel="stylesheet" href="/assets/linotype/teatro.css">',
      '<link rel="stylesheet" href="/assets/linotype/teatro.css">\n<link rel="stylesheet" href="/assets/linotype/mixed-media.css">')
    bookjs=output_assets/'book.js'
    contents=bookjs.read_text()
    needle='previous?.addEventListener("click",()=>turn(engine.prev(),{animate:true,velocity:.55}));'
    assert contents.count(needle)==1
    contents=contents.replace(needle,'''document.querySelectorAll('[data-teatro-scene-link]').forEach(link=>link.addEventListener('click',event=>{
 event.preventDefault();
 if(contents.open)contents.close();
 const index=engine.leaves.findIndex(item=>Boolean(item.el.querySelector('[data-teatro-book-stage]')));
 if(index>=0)turn(index,{animate:true,velocity:.45});
}));
''' + needle)
    bookjs.write_text(contents)
    (output_assets/'teatro-stage-page.js').write_text(LIFECYCLE)
    document=document.replace('<script type="module" src="/assets/satzfunk/satzfunk-book.mjs"></script>',
      '<script type="module" src="/assets/satzfunk/satzfunk-book.mjs"></script>\n<script src="/assets/linotype/teatro-stage-page.js" defer></script>')
    embed=SITE/'editions/stage/embed/index.html'
    embed.parent.mkdir(parents=True,exist_ok=True)
    embed.write_text(EMBED)
    assert (SITE/STAGE_SCRIPT.lstrip('/')).exists()
    return document
