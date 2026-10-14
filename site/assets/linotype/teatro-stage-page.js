/* R12: release Teatro renderer whenever the anchored paper element is not
   visible. The source-addressed figure is typeset before this script runs.
   This JS does not authorize sound, editorial mutation or narration. */
(() => {
'use strict';
const viewport=document.querySelector('#book-viewport');
const stage=viewport?.querySelector('.linotype-stage');
if(!viewport||!stage)return;
let mounted=null, lastWindow=null, pending=false, requested=false;
const activeLeaf=()=>[...stage.children].find(sheet=>sheet.matches?.('.linotype-sheet')&&sheet.querySelector('[data-teatro-book-stage]'));
function release(){
 if(mounted){mounted.removeAttribute('src');mounted.remove();mounted=null;}
 if(lastWindow){const play=lastWindow.querySelector('[data-teatro-scene-play]');if(play)play.hidden=false;lastWindow=null;}
 requested=false;
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
 if(!requested && document.getElementById('book-media-control')?.dataset.player!=='stopped')
   requested=true;
 if(!requested){
   document.body.dataset.teatroScene='ready';
   return; // paper carries an actionable player triangle, never a room poster
 }
 if(mounted&&lastWindow===windowEl&&mounted.isConnected)return;
 const frame=document.createElement('iframe');
 frame.title='Interactive Teatro spatial score. Move inside the scene to orbit; press Enter for an explicitly user-activated cue.';
 frame.dataset.teatroLiveFrame='true';
 frame.loading='eager';
 // Intentionally no iframe autoplay permission. Sound requires a gesture.
 frame.setAttribute('aria-label','Animated spatial score within this book passage');
 frame.src='/editions/stage/embed/';
 windowEl.append(frame);
 const play=windowEl.querySelector('[data-teatro-scene-play]');if(play)play.hidden=true;
 mounted=frame;lastWindow=windowEl;
 document.body.dataset.teatroScene='active';
}
function schedule(){
 if(pending)return;
 pending=true;
 requestAnimationFrame(sync);
}
stage.addEventListener('click',event=>{
 const button=event.target.closest?.('[data-teatro-scene-play]');
 if(!button)return;
 const active=activeLeaf();
 if(!active?.contains(button))return;
 requested=true;
 schedule();
 // This synchronous gesture must also request audible output; on an
 // ordinary HTTP WLAN the explicit Web Audio preview is disclosed.
 window.dispatchEvent(new CustomEvent('fountain:book:play-request',{
   detail:{source:'teatro:spatial-score'}
 }));
});
window.addEventListener('fountain:book:transport',event=>{
 if(event.detail?.source!=='book:player')return;
 if(event.detail.playing){
   if(activeLeaf())requested=true;
   schedule();
 }else{
   release();
 }
});
const observer=new MutationObserver(schedule);
observer.observe(stage,{childList:true,subtree:false});
observer.observe(document.body,{attributes:true,attributeFilter:['data-book-ready','data-turn-motion']});
window.addEventListener('pagehide',release);
window.addEventListener('resize',schedule);
schedule();
})();