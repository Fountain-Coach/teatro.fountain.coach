/* R12: release Teatro renderer whenever the anchored paper element is not
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
})();