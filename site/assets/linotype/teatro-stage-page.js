/* Load the original Teatro WebGL runtime ONLY on its visible book leaf.
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
})();