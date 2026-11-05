import {encodeNoteOn,encodeNoteOff,decodeUmp} from "./midi2-ump.mjs";
import {createEarBandEcho} from "./ear-band-echo.mjs";

// Exact Fountain Coach MIDI 2.0 UMP encoding, routed to this page's local sample instrument.
// This does not claim a hardware port, MIDI-CI negotiation or native Teatro Scenario admission.
const $=id=>document.getElementById(id);
const BPM=112,STEP=60/BPM/2,COUNT=16;
const original=[1,0,0,0,1,0,1,0,1,0,0,1,1,0,1,0];
const state={
 ctx:null,buf:null,reverseBuf:null,master:null,inputBus:null,echo:null,echoPromise:null,playing:false,timer:null,
 next:0,step:0,pattern:original.map((on,i)=>({on:!!on,slice:(i%8),velocity:i%4===0?0.98:0.78})),
 index:1,grains:new Set(),scratch:null,lastScrub:0,assign:false,sampleName:"SHADERS · TRACK 04",
 activePointers:new Set()
};
const colors={active:"#e5bc7e",dim:"#44695a"};
function status(head,body){$("status").replaceChildren();const strong=document.createElement("strong");strong.textContent=head;$("status").append(strong,document.createTextNode(body));}
function currentSlice(){return Number($("slice").value)-1}
function number(v){return String(v+1).padStart(2,"0")}
function makeWindow(i){
 const b=document.createElement("button");b.type="button";b.className="window-step";
 b.dataset.index=String(i);b.innerHTML='<span class="slice-mark"></span><span class="step-number"></span>';
 b.querySelector(".step-number").textContent=number(i);
 b.addEventListener("click",()=>{
  const step=state.pattern[i];
  if(state.assign){step.slice=currentSlice();step.on=true;state.assign=false;$("assign").setAttribute("aria-pressed","false");}
  else step.on=!step.on;
  renderWindows();
  ensureAudio().then(()=>audition(i)).catch(e=>status("Sample unavailable",e.message));
 });
 return b;
}
for(let i=0;i<COUNT;i++){$("kino-windows").append(makeWindow(i));$("mobile-windows").append(makeWindow(i))}
function renderWindows(playhead=-1){
 for(const b of document.querySelectorAll(".window-step")){
  const i=Number(b.dataset.index),st=state.pattern[i];
  b.setAttribute("aria-pressed",String(st.on));
  b.setAttribute("aria-label",`Step ${number(i)}, ${st.on?"on":"off"}, slice ${st.slice+1}. Touch to ${state.assign?"assign a slice":"toggle and audition"}`);
  b.querySelector(".slice-mark").textContent=String(st.slice+1);
  b.classList.toggle("current",i===playhead);
 }
}
function random32(){const data=new Uint32Array(1);crypto.getRandomValues(data);return data[0]||1}
function seeded(seed){let x=seed>>>0;return()=>{x^=x<<13;x^=x>>>17;x^=x<<5;return (x>>>0)/4294967296}}
function randomize(){
 const seed=random32(),rand=seeded(seed),density=Number($("density").value)/100;
 state.pattern=Array.from({length:COUNT},(_,i)=>({
  on:rand()<(i%4===0?Math.min(.98,density+.33):density*.9),
  slice:Math.floor(rand()*8),
  velocity:.65+rand()*.35
 }));
 // Keep a deliberate first pulse even at very low density.
 state.pattern[0].on=true;
 state.index++;$("pattern-id").textContent="SEED "+seed.toString(16).padStart(8,"0").toUpperCase();
 renderWindows();
 status("Randomized 16 windows","Sample slices and note velocities changed");
}
$("randomize").addEventListener("click",randomize);
$("reset").addEventListener("click",()=>{
 state.pattern=original.map((on,i)=>({on:!!on,slice:i%8,velocity:i%4===0?.98:.78}));
 $("density").value="48";$("density-value").textContent="48%";$("pattern-id").textContent="PATTERN 001";renderWindows();
 status("Original pattern restored","16 windows / single sample / 112 BPM");
});
$("density").addEventListener("input",()=>{$("density-value").textContent=$("density").value+"%"});
$("slice").addEventListener("input",()=>{$("slice-value").textContent=number(currentSlice())+" / 08"});
$("grain").addEventListener("input",()=>{$("grain-value").textContent=$("grain").value+" ms"});
$("speed").addEventListener("input",()=>{$("speed-value").textContent=(Number($("speed").value)/100).toFixed(2)+"×"});
$("echo-wet").addEventListener("input",()=>{
 const value=Number($("echo-wet").value)/100;
 $("echo-wet-val").textContent=$("echo-wet").value+"%";
 state.echo?.setMix(value);
});
$("echo-tone").addEventListener("input",()=>{
 const tone=Number($("echo-tone").value)/100;
 $("echo-tone-val").textContent=$("echo-tone").value+"%";
 state.echo?.setTone(tone);
});
$("level").addEventListener("input",()=>{
 $("level-value").textContent=$("level").value+"%";
 if(state.master&&state.ctx)state.master.gain.setTargetAtTime(Number($("level").value)/100,state.ctx.currentTime,.025);
});
$("assign").addEventListener("click",()=>{
 state.assign=!state.assign;$("assign").setAttribute("aria-pressed",String(state.assign));
 status(state.assign?"Assign mode":"Assign off",state.assign?"Touch a window to place your selected slice":"Windows toggle steps and audition");
 renderWindows();
});
$("reverse").addEventListener("click",()=>{
 const pressed=$("reverse").getAttribute("aria-pressed")==="true";
 $("reverse").setAttribute("aria-pressed",String(!pressed));$("reverse").textContent=pressed?"Reverse":"Forward ✓";
});
const isReverse=()=>$("reverse").getAttribute("aria-pressed")==="true";

function makeReverse(b){
 const reversed=state.ctx.createBuffer(b.numberOfChannels,b.length,b.sampleRate);
 for(let ch=0;ch<b.numberOfChannels;ch++){
  const src=b.getChannelData(ch),dst=reversed.getChannelData(ch);
  for(let i=0;i<b.length;i++)dst[i]=src[b.length-i-1];
 }
 return reversed;
}
async function ensureAudio(){
 if(!state.ctx){
  state.ctx=new (window.AudioContext||window.webkitAudioContext)();
  const comp=state.ctx.createDynamicsCompressor();comp.threshold.value=-12;comp.ratio.value=3;
  const master=state.ctx.createGain();master.gain.value=.8;
  master.connect(comp);comp.connect(state.ctx.destination);state.master=master;
  state.echoPromise=createEarBandEcho({
   context:state.ctx,output:master,
   onReport:m=>{
     const root=document.querySelector(".ear-loop");
     if(root)root.dataset.active=String(m.state==="following"||m.state==="armed");
     const indicator=$("ear-meter");
     if(indicator)indicator.textContent=m.state==="stopped"?"EAR STOPPED · CC74 loop closed"
       :m.state==="armed"?"EAR ARMED · listening for source PCM"
       :`EAR RMS ${m.rms.toFixed(4)} · CC74 #${m.sequence} · ${m.frequencyHz} Hz · feedback ${Math.round(m.feedback*100)}%`;
   }
  }).then(echo=>{state.echo=echo;state.inputBus=echo.input;return echo});
 }
 const ctx=state.ctx;await ctx.resume();
 if(state.echoPromise)(await state.echoPromise).resume();
 if(!state.buf){
  if(!state.loading){
   state.loading=(async()=>{
    const r=await fetch("./assets/shaders-40479-extract.m4a",{cache:"no-store"});
    if(!r.ok)throw Error("Source sample HTTP "+r.status);
    state.buf=await ctx.decodeAudioData(await r.arrayBuffer());
    state.reverseBuf=makeReverse(state.buf);drawWaveform();
    status("Sample ready","Touch the waveform, the windows, or Play");
   })().catch(e=>{state.loading=null;throw e});
  }
  await state.loading;
 }
 return ctx;
}
function umpToInstrument(kind,note,velocity,at){
 const packet=kind==="noteOn"
  ?encodeNoteOn({kind:"noteOn",group:0,channel:9,note,velocity})
  :encodeNoteOff({kind:"noteOff",group:0,channel:9,note,velocity:0});
 const decoded=decodeUmp(packet);
 if(!decoded||decoded.kind!==kind||decoded.note!==note)throw Error("UMP validation failed");
 const words=[...packet].map(x=>x.toString(16).padStart(8,"0").toUpperCase());
 $("ump").textContent=`${kind.toUpperCase()} / ${words.join(" ")} / T+${at.toFixed(3)}`;
 return decoded;
}
function playGrain(offset,seconds,vel,when){
 const ctx=state.ctx;if(!ctx||!state.buf)return null;
 const rate=Number($("speed").value)/100;
 const reverse=isReverse();
 const buf=reverse?state.reverseBuf:state.buf;
 const playedAt=Math.max(ctx.currentTime+.003,when);
 const sampleOffset=reverse?Math.max(.003,buf.duration-offset-seconds*rate):offset;
 const sourceOffset=Math.min(Math.max(0,sampleOffset),buf.duration-.015);
 const sampleDuration=Math.min(seconds*rate,buf.duration-sourceOffset-.005);
 if(sampleDuration<=.01)return null;
 const actual=sampleDuration/rate;
 const source=ctx.createBufferSource();source.buffer=buf;source.playbackRate.value=rate;
 const gain=ctx.createGain();const amp=Math.min(.95,Math.max(.02,vel));
 gain.gain.setValueAtTime(0,playedAt);
 gain.gain.linearRampToValueAtTime(amp,playedAt+.008);
 gain.gain.setValueAtTime(amp,playedAt+Math.max(.009,actual-.045));
 gain.gain.linearRampToValueAtTime(.0001,playedAt+actual);
 source.connect(gain);gain.connect(state.inputBus);
 source.start(playedAt,sourceOffset,sampleDuration);
 const grain={source,gain};state.grains.add(grain);
 source.onended=()=>{state.grains.delete(grain);source.disconnect();gain.disconnect()};
 return grain;
}
function slicePosition(slice){
 if(!state.buf)return 0;
 return slice*state.buf.duration/8+.007;
}
function playSlice(slice,velocity,when=state.ctx.currentTime){
 const sliceStart=slicePosition(slice);
 const maxLength=Math.max(.03,state.buf.duration/8-.015);
 const grain=Math.min(Number($("grain").value)/1000,maxLength);
 return playGrain(sliceStart,grain,velocity,when);
}
function audition(i){
 if(!state.buf)return;
 const step=state.pattern[i];const ctx=state.ctx;
 umpToInstrument("noteOn",36+i,Math.round(step.velocity*65535),ctx.currentTime);
 playSlice(step.slice,step.velocity,ctx.currentTime);
 renderWindows(i);
}
function clock(){
 if(!state.playing||!state.ctx)return;
 const ctx=state.ctx;
 while(state.next<ctx.currentTime+.12){
  const i=state.step,step=state.pattern[i],when=state.next;
  if(step.on){
   const note=36+i,vel=Math.round(step.velocity*65535);
   umpToInstrument("noteOn",note,vel,when);
   playSlice(step.slice,step.velocity,when);
   // The software instrument's note-release is addressable separately in UMP.
   umpToInstrument("noteOff",note,0,when+Number($("grain").value)/1000);
  }
  const displayDelay=Math.max(0,(when-ctx.currentTime)*1000);
  setTimeout(()=>{if(state.playing)renderWindows(i)},displayDelay);
  state.step=(i+1)%COUNT;state.next+=STEP;
 }
}
function stop(fully){
 if(state.timer){clearInterval(state.timer);state.timer=null}
 state.playing=false;
 for(const grain of state.grains){try{grain.source.stop()}catch{}}
 state.grains.clear();state.echo?.reset();state.step=0;renderWindows();
 $("toggle").textContent="▶";$("toggle").setAttribute("aria-label","Play MIDI 2.0 sequence");$("toggle").setAttribute("aria-pressed","false");
 status(fully?"Stopped":"Paused",fully?"The 16 windows are ready":"Touch Play to restart the sequence");
}
$("stop").addEventListener("click",()=>stop(true));
$("toggle").addEventListener("click",async()=>{
 if(state.playing){stop(false);return}
 const button=$("toggle");button.disabled=true;
 try{
  await ensureAudio();state.step=0;state.next=state.ctx.currentTime+.06;
  state.playing=true;clock();state.timer=setInterval(clock,25);
  button.textContent="Ⅱ";button.setAttribute("aria-label","Pause MIDI 2.0 sequence");button.setAttribute("aria-pressed","true");
  status("Playing 112 BPM","Kino MIDI 2.0 / Ear feedback modulates band echo");
 }catch(e){status("Could not start audio",e.message)}
 finally{button.disabled=false}
});
function drawWaveform(){
 const canvas=$("waveform"),rect=canvas.getBoundingClientRect(),ratio=Math.min(2,devicePixelRatio||1);
 const width=Math.max(1,Math.floor(rect.width*ratio)),height=Math.max(1,Math.floor(rect.height*ratio));
 canvas.width=width;canvas.height=height;
 const g=canvas.getContext("2d");g.clearRect(0,0,width,height);
 g.strokeStyle="#486e59";g.lineWidth=1;
 for(let n=0;n<=8;n++){const x=n*width/8;g.beginPath();g.moveTo(x,0);g.lineTo(x,height);g.stroke()}
 for(let n=1;n<=4;n++){const y=n*height/5;g.beginPath();g.moveTo(0,y);g.lineTo(width,y);g.stroke()}
 if(!state.buf){g.fillStyle="#c3dbbb";g.font="13px system-ui";g.fillText("TOUCH TO LOAD THE SAMPLE",24,height/2);return}
 const pcm=state.buf.getChannelData(0),center=height*.5;g.beginPath();
 for(let x=0;x<width;x++){
  const from=Math.floor(x*pcm.length/width),to=Math.max(from+1,Math.floor((x+1)*pcm.length/width)),stride=Math.max(1,Math.floor((to-from)/20));
  let min=1,max=-1;for(let j=from;j<to;j+=stride){min=Math.min(min,pcm[j]);max=Math.max(max,pcm[j])}
  const spread=.84*height/2;g.moveTo(x,center+min*spread);g.lineTo(x,center+max*spread);
 }
 g.strokeStyle="#b5e4b9";g.lineWidth=Math.max(1,ratio);g.stroke();
 g.fillStyle="#e5ac76";for(let n=1;n<8;n++){const x=n*width/8;g.fillRect(x-1,0,2,Math.min(10,height*.05))}
}
function waveformFraction(event){
 const r=$("wave-area").getBoundingClientRect();
 return Math.max(0,Math.min(.995,(event.clientX-r.left)/r.width));
}
function scrub(event){
 if(!state.buf||!state.ctx)return;
 const fraction=waveformFraction(event),now=performance.now();
 $("wave-cursor").style.left=(fraction*100).toFixed(2)+"%";
 if(now-state.lastScrub<43)return;
 state.lastScrub=now;
 if(state.scratch){try{state.scratch.source.stop()}catch{}}
 state.scratch=playGrain(fraction*state.buf.duration,.45,.78,state.ctx.currentTime);
}
$("wave-area").addEventListener("pointerdown",async event=>{
 event.preventDefault();$("wave-area").setPointerCapture(event.pointerId);
 state.activePointers.add(event.pointerId);
 try{await ensureAudio();if(state.activePointers.has(event.pointerId))scrub(event)}
 catch(e){status("Sample unavailable",e.message)}
});
$("wave-area").addEventListener("pointermove",event=>{if(state.activePointers.has(event.pointerId))scrub(event)});
for(const name of ["pointerup","pointercancel","lostpointercapture"]){
 $("wave-area").addEventListener(name,event=>{
  state.activePointers.delete(event.pointerId);
  if(!state.activePointers.size&&state.scratch){try{state.scratch.source.stop()}catch{}state.scratch=null}
 });
}
$("file").addEventListener("change",async event=>{
 const file=event.target.files?.[0];if(!file)return;
 if(file.size>30*1024*1024){status("File too large","Use an audio file under 30 MB");return}
 try{
  const ctx=await ensureAudio(),buffer=await ctx.decodeAudioData(await file.arrayBuffer());
  stop(true);state.buf=buffer;state.reverseBuf=makeReverse(buffer);state.sampleName=file.name;
  $("sample-name").textContent="LOCAL · "+file.name;$("wave-duration").textContent=buffer.duration.toFixed(2)+" S";
  drawWaveform();status("Local audio loaded","Only your device holds this file");
 }catch(e){status("Could not read audio",e.message)}
});
window.addEventListener("resize",drawWaveform);
window.addEventListener("pagehide",()=>{stop(true);state.echo?.dispose();state.ctx?.close()});
renderWindows();drawWaveform();
