/* Teatro/First Hearing: book-wide MIDI2 transport, live audio + Ear witness.
   No automatic microphone, hardware MIDI, author-approved narration or Store.
   Fountain Press owns the shell; Csound and Ear belong to Teatro. */
import { createBookMidi2 } from '/assets/linotype/book-midi2.mjs';
const control=document.getElementById('book-media-control');
const toggle=document.getElementById('book-media-toggle');
const disclose=document.getElementById('book-media-settings');
const details=document.getElementById('book-media-details');
const message=document.getElementById('book-media-status');
const earText=document.getElementById('book-ear-status');
const earIcon=document.querySelector('.book-ear-icon');
const sourceText=document.getElementById('book-audio-source');
const midiText=document.getElementById('book-midi-debug');
const sourceDigest=document.querySelector('meta[name="satzfunk-source-sha256"]')?.content;
if(!control||!toggle||!sourceDigest)throw Error('Book player requires exact edition identity');
const bus=createBookMidi2('teatro:first-hearing:'+sourceDigest.slice(0,32));
window.FountainBookMidi2=bus; // read-only typed in-browser UMP ingress/egress
const parameters={wind:1,turbulence:.55,head:.4,voice:.2};
const names={wind:'wind_mix',turbulence:'turbulence_mix',head:'head_mix',voice:'voice_mix'};
let mode='stopped',audio=null,csound=null,raf=0,lastEar=0,lastMotion=0;
const bound=v=>Math.max(0,Math.min(1,Number(v)||0));
const report=text=>{message.textContent=text};
const changeMode=next=>{
 mode=next; control.dataset.player=next; toggle.setAttribute('aria-pressed',String(next!=='stopped'));
 toggle.textContent=next==='stopped'?'▶':'Ⅱ';
 toggle.setAttribute('aria-label',next==='stopped'?'Play book sound':'Pause book sound');
 // One transport authority for the book and any currently visible Teatro score.
 window.dispatchEvent(new CustomEvent('fountain:book:transport',{
   detail:{playing:next!=='stopped',source:'book:player'}
 }));
};
disclose.addEventListener('click',()=>{
 details.hidden=!details.hidden;
 disclose.setAttribute('aria-expanded',String(!details.hidden));
});
document.addEventListener('pointerdown',event=>{
 if(!details.hidden&&!control.contains(event.target)){details.hidden=true;disclose.setAttribute('aria-expanded','false')}
});
const sliderNodes=Object.fromEntries([...document.querySelectorAll('[data-book-sound-parameter]')]
 .map(input=>[input.dataset.bookSoundParameter,input]));
function adjust(key,value,{emit=true}={}){
 if(!(key in parameters))return;
 value=bound(value);parameters[key]=value;
 const slider=sliderNodes[key];if(slider){slider.value=String(value);slider.parentElement.querySelector('output').textContent=Math.round(value*100)+'%'}
 if(mode==='csound'&&csound)void csound.setParameter(names[key],value).catch(e=>report('Csound control unavailable: '+e.message));
 if(mode==='preview'&&audio)applyPreview();
 if(emit)bus.publish(bus.controllers[key],value,'book:parameter');
}
for(const [key,slider] of Object.entries(sliderNodes))
 slider.addEventListener('input',()=>adjust(key,slider.value));
function observe(level,source){
 if(mode==='stopped')return;
 const raw=Number(level);
 if(!Number.isFinite(raw)||raw<0)return;
 // RMS ranges differ greatly between the genuine Csound worklet and the
 // HTTP-only Web Audio preview. Calibrate each known source instead of
 // saturating every preview sample at 100 percent.
 const ceiling=source==='teatro-web-audio-preview'?0.30:0.025;
 const value=bound(raw/ceiling);
 const witnessed=raw>0.0001;
 // Bounded 0.84–1.22; the square root makes quiet Csound audible visually
 // without flattening the louder preview into a permanent maximum.
 const intensity=Math.sqrt(value);
 earIcon?.style.setProperty('--ear-scale',(0.84+intensity*.38).toFixed(3));
 earIcon?.setAttribute('aria-label',witnessed?
   'Ear: measured audio output, intensity '+Math.round(intensity*100)+' percent':
   'Ear: listening, no measured output');
 control.dataset.ear=witnessed?'witnessed':'silent';
 control.dataset.earRms=raw.toFixed(6);
 control.dataset.earSource=source;
 if(witnessed&&source==='teatro-csound-ear-worklet')
  control.dataset.earWorkletWitnesses=String(1+Number(control.dataset.earWorkletWitnesses||0));
 earText.textContent=witnessed?('Ear · signal witnessed · RMS '+raw.toFixed(4)):'Ear · listening';
 const now=performance.now();
 if(now-lastEar>180){
  lastEar=now;
  bus.publish(bus.controllers.earLevel,value,'ear:'+source);
  window.dispatchEvent(new CustomEvent('fountain:ear:observation',{detail:{
   sourceIdentity:source,timestamp:now,level:value,state:witnessed?'witnessed':'silent'}}));
 }
}
function applyPreview(){
 if(!audio)return;
 audio.wind.gain.setTargetAtTime(.024*(parameters.wind+.1),audio.context.currentTime,.09);
 audio.filter.frequency.setTargetAtTime(170+parameters.turbulence*2400,audio.context.currentTime,.08);
 audio.voice.gain.setTargetAtTime(.012*parameters.voice,audio.context.currentTime,.07);
 audio.osc.frequency.setTargetAtTime(92+parameters.head*195,audio.context.currentTime,.08);
}
function watchEar(){
 cancelAnimationFrame(raf);
 const analyser=audio?.analyser;
 const samples=analyser?new Float32Array(analyser.fftSize):null;
 const tick=async()=>{
  if(mode==='stopped')return;
  if(mode==='preview'&&analyser){
   analyser.getFloatTimeDomainData(samples);
   let sum=0;for(const v of samples)sum+=v*v;
   observe(Math.sqrt(sum/samples.length),'teatro-web-audio-preview');
  }else if(mode==='csound'&&csound&&performance.now()-lastEar>250){
   try{const result=await csound.level();observe(result.rms,'teatro-csound-worklet')}catch{}
  }
  raf=requestAnimationFrame(tick);
 };
 raf=requestAnimationFrame(tick);
}
function createPreview(){
 const C=window.AudioContext||window.webkitAudioContext;
 if(!C)throw Error('No Web Audio output is available');
 const context=new C({latencyHint:'interactive'});
 const buffer=context.createBuffer(1,context.sampleRate*2,context.sampleRate);
 const samples=buffer.getChannelData(0);
 // Deterministic signal source; no artificial spoken recording.
 let seed=0x41f0a92;for(let i=0;i<samples.length;i++){
   seed=(Math.imul(seed,1664525)+1013904223)>>>0;
   samples[i]=(seed/0xffffffff)*2-1;
 }
 const noise=context.createBufferSource();noise.buffer=buffer;noise.loop=true;
 const filter=context.createBiquadFilter();filter.type='lowpass';
 const wind=context.createGain();
 const osc=context.createOscillator();osc.type='sine';
 const voice=context.createGain();
 const merge=context.createGain();merge.gain.value=.8;
 const analyser=context.createAnalyser();analyser.fftSize=1024;
 noise.connect(filter);filter.connect(wind);wind.connect(merge);
 osc.connect(voice);voice.connect(merge);
 merge.connect(analyser);analyser.connect(context.destination);
 audio={context,noise,osc,filter,wind,voice,analyser};
 applyPreview();noise.start();osc.start();
 return context.resume();
}
async function play(){
 toggle.disabled=true;
 let csoundFailure='';
 try{
  // Official Csound is meaningful only in a browser secure context.
  if(window.isSecureContext){
   try{
    const {BookCsoundHost}=await import('/assets/book-csound-host.js');
    csound=new BookCsoundHost();
    await csound.start(evt=>{
      if(evt?.type==='ear.ump'&&evt.event?.measurement)observe(evt.event.measurement.rms,'teatro-csound-ear-worklet');
    });
    changeMode('csound');
    for(const [key,value] of Object.entries(parameters))await csound.setParameter(names[key],value);
    sourceText.textContent='Csound · AudioWorklet';
    report('Teatro instrument active');
   }catch(e){
    await csound?.stop().catch(()=>{});csound=null;
    csoundFailure=String(e.message);
    control.dataset.csoundFailure=csoundFailure;
   }
  }
  if(mode!=='csound'){
    await createPreview();
    changeMode('preview');
    sourceText.textContent='Local Web Audio preview';
    report(window.isSecureContext?('Local audible preview · Csound: '+(csoundFailure||'unavailable')):'Local audible preview · Csound needs HTTPS');
  }
  watchEar();
  bus.publish(bus.controllers.transport,1,'book:player');
 }catch(e){changeMode('stopped');report('Audio unavailable: '+e.message)}
 finally{toggle.disabled=false}
}
async function stop(){
 changeMode('stopped');cancelAnimationFrame(raf);control.dataset.ear='idle';
 earIcon?.style.setProperty('--ear-scale','.84');
 earIcon?.setAttribute('aria-label','Ear idle — no audio output');
 bus.publish(bus.controllers.transport,0,'book:player');
 if(csound){const host=csound;csound=null;await host.stop().catch(e=>report(e.message))}
 if(audio){
  const instance=audio;audio=null;instance.noise.stop();instance.osc.stop();
  await instance.context.close().catch(()=>{});
 }
 report('Ready to listen');earText.textContent='Ear · idle';
}
// Page score and global transport address precisely the same instrument.
window.addEventListener('fountain:book:play-request',event=>{
 if(event.detail?.source!=='teatro:spatial-score'||mode!=='stopped'||toggle.disabled)return;
 void play();
});
toggle.addEventListener('click',()=>{if(mode==='stopped')void play();else void stop()});
window.addEventListener('pagehide',()=>{void stop();bus.dispose()});
window.addEventListener('fountain:book:position',event=>{
 const {page,total,anchor}=event.detail||{};
 if(!Number.isInteger(page)||!Number.isInteger(total)||total<1)return;
 bus.publish(bus.controllers.position,Math.min(1,Math.max(0,page/Math.max(1,total-1))),'book:page');
 const symbol=[...String(anchor||'')].reduce((n,c)=>(n*33+c.charCodeAt(0))>>>0,5381);
 bus.publish(bus.controllers.focus,(symbol>>>0)/0xffffffff,'book:anchor');
 midiText.textContent='MIDI 2.0 · book page '+(page+1)+' / '+total;
});
bus.subscribe(packet=>{
 const {controller,value}=packet;
 if(controller===bus.controllers.position){
  window.dispatchEvent(new CustomEvent('fountain:book:seek',{detail:{normalized:value}}));
 }else if(controller===bus.controllers.transport){
  if(value>.5&&mode==='stopped')void play();
  else if(value<=.5&&mode!=='stopped')void stop();
 }else{
  const key=Object.keys(parameters).find(k=>bus.controllers[k]===controller);
  if(key)adjust(key,value,{emit:false});
 }
});
window.addEventListener('message',event=>{
 if(event.origin!==location.origin||event.data?.schema!=='teatro.book.motion.v1')return;
 const frame=document.querySelector('iframe[data-teatro-live-frame]');
 if(!frame||event.source!==frame.contentWindow)return;
 const now=performance.now();
 if(now-lastMotion<180)return;
 lastMotion=now;
 bus.publish(75,bound(event.data.motion),'teatro:rig-motion');
});
