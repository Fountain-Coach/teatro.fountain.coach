"""The Teatro interactive plate: generated from the original stage runtime."""
from pathlib import Path
import re

ROOT = Path(__file__).resolve().parents[1]
SITE = ROOT / "site"
STAGE_SCRIPT = "/assets/index-CY5_5ULO.js"
PLATE = """<section class="book-art-leaf" id="book-live-stage" aria-label="The interactive Teatro plate">
<figure class="teatro-book-scene" data-teatro-book-stage aria-label="Interactive Teatro stage plate">
<div class="teatro-scene-window" data-teatro-scene-window>
<img src="/assets/teatro-stage-poster.svg" width="800" height="600" alt="An empty isometric Teatro space, waiting to be entered">
</div>
<figcaption>TEATRO · PLATE 02 · AN EXECUTABLE SPACE · SOUND REQUIRES YOUR GESTURE</figcaption>
</figure></section>"""

EMBED = """<!doctype html><html lang="en"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">
<title>Teatro · Embedded animated page</title>
<style>
html,body,#root{width:100%;height:100%;min-height:0;margin:0;overflow:hidden;background:#f3efe7}
#root>div{height:100%!important;min-height:0}
#root main{height:100%;min-height:0}
#teatro-stage-scene{height:100%!important;min-height:0!important}
.teatro-sidebar-disclosure{display:none!important}
#teatro-stage-scene canvas,#teatro-stage-scene svg{width:100%!important;height:100%!important;display:block}
@media(prefers-reduced-motion:reduce){*{animation-duration:.01ms!important;animation-iteration-count:1!important}}
</style>
<script type="module" src="/assets/index-CY5_5ULO.js"></script></head>
<body><div id="root"></div></body></html>
"""

CSS = """
/* The executable illustration is a bound, paginated leaf, not a site exit. */
.linotype-plate[data-source-id="work-teatro-an-unfinished-composition"]:has([data-teatro-book-stage]) .linotype-area {
  display:flex;flex-direction:column;min-height:0;
}
.linotype-plate:has([data-teatro-book-stage]) .linotype-image-frame{width:100%;height:100%;min-height:0;flex:1;}
.linotype-plate:has([data-teatro-book-stage]) .linotype-image-frame figure{
  width:100%!important;height:100%!important;max-width:100%!important;max-height:100%!important;
  min-height:0;aspect-ratio:auto!important;display:flex;flex-direction:column;padding:12px;gap:10px;
}
.linotype-plate .teatro-scene-window{position:relative;min-height:0;min-width:0;flex:1 1 auto;width:100%;overflow:hidden;background:#f3efe7}
.linotype-plate .teatro-scene-window img{width:100%!important;height:100%!important;max-width:100%!important;max-height:100%!important;object-fit:contain}
.linotype-plate .teatro-scene-window iframe{position:absolute;inset:0;border:0;width:100%;height:100%;background:#f3efe7;}
.linotype-plate [data-teatro-book-stage] figcaption{flex:0 0 auto;font-size:9px;line-height:1.45;letter-spacing:.035em}
.book-flow .teatro-book-scene{margin:1.6rem auto;border:1px solid #c6bbaa;padding:1rem}
.book-flow .teatro-scene-window{min-height:60vh;display:flex;justify-content:center;}
.book-flow .teatro-scene-window img{width:100%;height:auto;max-height:70vh;object-fit:contain}
@media print {.teatro-scene-window iframe{display:none!important}}
"""

LIFECYCLE = r"""/* Load the original Teatro WebGL runtime ONLY on its visible book leaf.
   Each page exit destroys the iframe, releasing its WebGL and audio contexts.
   Never interpret interactive stage sound as an authorized spoken edition. */
(() => {
'use strict';
const viewport=document.querySelector('#book-viewport');
const stage=viewport?.querySelector('.linotype-stage');
if(!viewport||!stage)return;
let mounted=null, lastWindow=null;
const activeLeaf=()=>[...stage.children].find(sheet=>sheet.matches?.('.linotype-sheet')&&sheet.querySelector('[data-teatro-book-stage]'));
function release(){
 if(mounted){mounted.removeAttribute('src');mounted.remove();mounted=null;}
 if(lastWindow){const poster=lastWindow.querySelector('img');if(poster)poster.hidden=false;lastWindow=null;}
 document.body.dataset.teatroScene='inactive';
}
function sync(){
 const leaf=activeLeaf();
 if(!leaf||document.body.dataset.bookReady!=='true'||document.body.dataset.turnMotion==='active'){
  release();return;
 }
 const windowEl=leaf.querySelector('[data-teatro-scene-window]');
 if(!windowEl)return;
 if(mounted&&lastWindow===windowEl&&mounted.isConnected)return;
 release();
 const frame=document.createElement('iframe');
 frame.title='Animated Teatro stage inside this book page. Drag to orbit. Press Enter to trigger the user-activated MIDI2 audio cue.';
 frame.dataset.teatroLiveFrame='true';
 frame.loading='eager';
 frame.allow='autoplay; fullscreen';
 frame.setAttribute('aria-label','Animated Teatro stage inside the Linotype book');
 frame.src='/editions/stage/embed/';
 windowEl.append(frame);
 const poster=windowEl.querySelector('img');if(poster)poster.hidden=true;
 mounted=frame;lastWindow=windowEl;
 document.body.dataset.teatroScene='active';
}
const observer=new MutationObserver(()=>requestAnimationFrame(sync));
observer.observe(stage,{childList:true,subtree:false});
observer.observe(document.body,{attributes:true,attributeFilter:['data-book-ready','data-turn-motion']});
window.addEventListener('pagehide',release);
window.addEventListener('resize',()=>requestAnimationFrame(sync));
requestAnimationFrame(sync);
})();"""

def integrate(document, output_assets):
    marker = '<section class="book-chapter-text">'
    assert document.count(marker)==1
    document=document.replace(marker,PLATE+'\n'+marker)
    document=document.replace("media-src 'self';","media-src 'self'; frame-src 'self';")
    assert "frame-src 'self'" in document
    document=document.replace('<div class="book-tools"><a class="teatro-stage-link" href="/editions/stage/" aria-label="Open the live Teatro stage, where interactive sound can be activated">Stage ↗</a>',
       '<div class="book-tools"><a class="teatro-stage-link" href="#book-live-stage" data-teatro-scene-link aria-label="Turn to the live animated Teatro book page">Scene ↓</a>')
    document=document.replace('COMPLETE ORIGINAL ESSAY · ONE ORIGINAL TEATRO SCORE<br><a href="/editions/stage/">Enter the sounding stage →</a>',
      'COMPLETE ORIGINAL ESSAY · SCORE AND LIVE WEBGL PLATE<br>TURN PAGES TO ENTER THE SCENE')
    document=document.replace('The interactive <a href="/editions/stage/">Teatro stage</a> has live browser-Csound sound, activated by the visitor.',
      'The <a href="#book-live-stage" data-teatro-scene-link>animated Teatro page</a> has interactive browser-Csound sound, activated by the visitor.')
    # The book scripts preserve the measured pages and authorial text.
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
    (output_assets/'teatro.css').write_text((output_assets/'teatro.css').read_text()+CSS)
    (output_assets/'teatro-stage-page.js').write_text(LIFECYCLE)
    document=document.replace('<script type="module" src="/assets/satzfunk/satzfunk-book.mjs"></script>',
      '<script type="module" src="/assets/satzfunk/satzfunk-book.mjs"></script>\n<script src="/assets/linotype/teatro-stage-page.js" defer></script>')
    embed=SITE/'editions/stage/embed/index.html'
    embed.parent.mkdir(parents=True,exist_ok=True)
    embed.write_text(EMBED)
    assert (SITE/STAGE_SCRIPT.lstrip('/')).exists()
    return document
