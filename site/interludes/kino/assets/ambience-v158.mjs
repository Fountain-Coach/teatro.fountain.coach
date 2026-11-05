import {createEarBandEcho} from "./ear-band-echo.mjs";

// Kino After Dark: a nonmetric acoustic room after the film.
// Sources are original Csound atmospheric PCM; the Satzfunk excerpt is optional
// and OFF by default. Ear measures dry PCM and returns MIDI2 UMP CC74 to the echo.
const $=id=>document.getElementById(id);
const state={
 context:null,echo:null,master:null,filter:null,sourceGain:null,
 buffers:new Map(),voices:new Set(),timer:null,playing:false,starting:false,
 nextAt:0,lastWindow:-1,events:0,seed:1,
 distance:72,trace:0,earMessages:0
};
let random=()=>Math.random();
const clamp=(v,min,max)=>Math.max(min,Math.min(max,v));
function rng(seed){let x=seed||1;return()=>{x^=x<<13;x^=x>>>17;x^=x<<5;return(x>>>0)/4294967296}}
function newSeed(){
 const a=new Uint32Array(1);crypto.getRandomValues(a);
 state.seed=a[0]||1;random=rng(state.seed);
}
function status(head,body=""){
 const target=$("status");target.replaceChildren();
 const strong=document.createElement("strong");strong.textContent=head;
 target.append(strong,document.createTextNode(body));
}
for(let i=0;i<16;i++){
 const window=document.createElement("span");
 window.className="memory-window";
 window.style.setProperty("--window-level",String((i*5%9)/60));
 $("kino-windows").append(window);
}
function illuminate(){
 const windows=[...document.querySelectorAll(".memory-window")];
 if(!windows.length)return;
 const index=Math.floor(random()*windows.length);
 const el=windows[index];
 el.style.setProperty("--window-level",(0.12+random()*.27).toFixed(2));
 state.lastWindow=index;
 setTimeout(()=>{el.style.setProperty("--window-level","0.08")},Math.round(1400+random()*3100));
}
async function prepare(){
 if(state.context)return;
 const context=new (window.AudioContext||window.webkitAudioContext)();
 state.context=context;
 const comp=context.createDynamicsCompressor();
 comp.threshold.value=-17;comp.ratio.value=2;comp.attack.value=.035;comp.release.value=.4;
 state.master=context.createGain();state.master.gain.value=.72;
 state.master.connect(comp);comp.connect(context.destination);
 const echo=await createEarBandEcho({
   context,output:state.master,
   onReport:event=>{
     if(event.state==="following"){
       state.earMessages=event.sequence;
       $("ear-summary").textContent="Ear → MIDI 2.0 → faint echoes · "+Math.round(event.frequencyHz)+" Hz";
     }else if(event.state==="stopped"){
       $("ear-summary").textContent="The echo is resting";
     }
   }
 });
 state.echo=echo;
 state.sourceGain=context.createGain();
 state.filter=context.createBiquadFilter();state.filter.type="lowpass";state.filter.Q.value=.6;
 state.sourceGain.connect(state.filter);state.filter.connect(echo.input);
 applyDistance();
 echo.setMix(.14);echo.setTone(.73);
 const names=[["air","cinema-air"],["dust","film-dust"],["trace","../shaders-40479-extract"]];
 for(const [name,asset] of names){
   const path=name==="trace"?"./assets/shaders-40479-extract.m4a":"./assets/atmosphere/"+asset+".m4a";
   const response=await fetch(path,{cache:"no-store"});
   if(!response.ok)throw Error("Audio source "+name+" HTTP "+response.status);
   state.buffers.set(name,await context.decodeAudioData(await response.arrayBuffer()));
 }
}
function applyDistance(){
 if(!state.context||!state.filter)return;
 const at=state.context.currentTime;
 state.filter.frequency.setTargetAtTime(3800-Math.pow(state.distance/100,1.24)*2850,at,.22);
 state.sourceGain.gain.setTargetAtTime(.80-state.distance/100*.26,at,.22);
 state.echo?.setMix(.105+state.distance/100*.095);
}
function grain(name,{length,level,rate=1,pan=0,offset=null}){
 if(!state.playing||!state.context)return;
 const buffer=state.buffers.get(name);if(!buffer)return;
 const context=state.context,at=context.currentTime+.025;
 const duration=clamp(length,.2,Math.min(6,buffer.duration/rate-.02));
 if(duration<=.2)return;
 const maxOffset=Math.max(.01,buffer.duration-duration*rate-.015);
 const selected=offset===null?random()*maxOffset:clamp(offset,0,maxOffset);
 const src=context.createBufferSource(),envelope=context.createGain(),stereo=context.createStereoPanner();
 src.buffer=buffer;src.playbackRate.value=rate;
 stereo.pan.value=clamp(pan,-.8,.8);
 const attack=Math.min(duration*.4,.85),release=Math.min(duration*.47,1.5);
 const end=at+duration;
 envelope.gain.setValueAtTime(0,at);
 envelope.gain.linearRampToValueAtTime(level,at+attack);
 envelope.gain.setValueAtTime(level,Math.max(at+attack,end-release));
 envelope.gain.linearRampToValueAtTime(0,end);
 src.connect(envelope);envelope.connect(stereo);stereo.connect(state.sourceGain);
 const voice={src,envelope,stereo};state.voices.add(voice);
 src.onended=()=>{
   state.voices.delete(voice);
   try{src.disconnect();envelope.disconnect();stereo.disconnect()}catch{}
 };
 src.start(at,selected,duration*rate);
 src.stop(end+.01);
 state.events++;
}
function emit(){
 const n=random();
 if(n<.66){
   grain("air",{length:2.8+random()*3.0,level:.29+random()*.13,
      rate:.76+random()*.22,pan:(random()-.5)*1.1});
 }else if(n<.94){
   grain("dust",{length:.75+random()*2.8,level:.065+random()*.06,
      rate:.73+random()*.24,pan:(random()-.5)*1.5});
 }else if(state.trace>0){
   grain("trace",{length:1.3+random()*1.6,level:state.trace/100*.075,
      rate:.67+random()*.17,pan:(random()-.5)*1.2});
 }
 illuminate();
 $("room-count").textContent=String(state.events).padStart(2,"0")+" passing sounds";
}
function tick(){
 if(!state.playing||!state.context)return;
 if(state.context.currentTime>=state.nextAt){
  emit();
  const gap=.65+random()*1.9; // no clock, groove, accents or pattern
  state.nextAt=state.context.currentTime+gap;
 }
}
async function start(){
 if(state.playing||state.starting)return;
 state.starting=true;$("toggle").disabled=true;
 try{
   newSeed();
   await prepare();
   await state.context.resume();
   state.playing=true;state.events=0;
   state.echo.resume();
   state.nextAt=state.context.currentTime;
   tick();state.timer=setInterval(tick,120);
   $("toggle").textContent="Ⅱ";
   $("toggle").setAttribute("aria-label","Pause the cinema sound environment");
   $("toggle").setAttribute("aria-pressed","true");
   $("cinema-room").dataset.active="true";
   status("The room is listening","Slow movements, no pulse");
 }catch(e){status("Audio could not begin",e.message);await stop();}
 finally{$("toggle").disabled=false;state.starting=false}
}
async function stop(){
 state.playing=false;
 if(state.timer){clearInterval(state.timer);state.timer=null}
 for(const voice of state.voices){try{voice.src.stop()}catch{}}
 state.voices.clear();
 if(state.echo)state.echo.reset();
 $("cinema-room").dataset.active="false";
 $("toggle").textContent="▶";
 $("toggle").setAttribute("aria-label","Listen to the cinema sound environment");
 $("toggle").setAttribute("aria-pressed","false");
 status("The room is still","No voices remain");
 if(state.echo){state.echo.dispose();state.echo=null}
 if(state.context){try{await state.context.close()}catch{}}
 state.context=null;state.filter=null;state.sourceGain=null;state.master=null;
 state.buffers.clear();state.events=0;
}
$("toggle").addEventListener("click",()=>state.playing?stop():start());
$("stop").addEventListener("click",()=>stop());
$("distance").addEventListener("input",()=>{
 state.distance=Number($("distance").value);
 $("distance-value").textContent=state.distance+"%";
 applyDistance();
});
$("traces").addEventListener("input",()=>{
 state.trace=Number($("traces").value);
 $("traces-value").textContent=state.trace===0?"None":state.trace+"%";
});
$("another").addEventListener("click",()=>{
 newSeed();state.nextAt=(state.context?.currentTime||0)+1;
 status(state.playing?"Another memory of the room":"Another room, when you're ready",
        "No repeated pattern");
});
window.addEventListener("pagehide",()=>{stop()});
status("After the film","Listen when you wish");
