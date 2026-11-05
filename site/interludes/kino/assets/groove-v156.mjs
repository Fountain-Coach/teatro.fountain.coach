/**
 * Owner-rendered Csound one-shots, browser MIDI 2.0 clock and Ear echo bus.
 * Notes are sequential monophonic bass events. No generated chords or pad voice.
 * Software UMP peer only; never a hardware MIDI-CI claim.
 */
const BASE="./assets/groove/";
const bassNotes=[38,null,38,41,null,null,38,null,38,null,38,41,null,null,36,36];
const hats=Array.from({length:16},(_,i)=>i===7||i===15?"open":"closed");
const clamp=(n,lo,hi)=>Math.max(lo,Math.min(hi,n));
const bassRoot=38;

export function createKinoGroove({context,output,sendUMP,onState=()=>{}}){
  if(!context||!output||typeof sendUMP!=="function")throw Error("Kino groove requires live audio/UMP ports");
  const voices=new Set();
  const buffers=new Map(),channels={bass:{vol:.75,mute:false},hat:{vol:.52,mute:false}};
  const gains={bass:context.createGain(),hat:context.createGain()};
  gains.bass.gain.value=channels.bass.vol;
  gains.hat.gain.value=channels.hat.vol;
  gains.bass.connect(output);
  gains.hat.connect(output);
  let loading=null,loaded=false,steps=0;
  const stats={bassNotes:0,hatNotes:0,offbeatEvents:0,umpOn:0,umpOff:0,allVoicesStopped:false,firstOffbeatShift:0};
  async function load(){
    if(loaded)return;
    if(!loading){
      loading=Promise.all(["bass-d2","hat-closed","hat-open"].map(async name=>{
        const r=await fetch(BASE+name+".wav");
        if(!r.ok)throw Error("Csound "+name+" HTTP "+r.status);
        const buffer=await context.decodeAudioData(await r.arrayBuffer());
        if(buffer.duration<.05)throw Error("Bad Csound hit: "+name);
        buffers.set(name,buffer);
      })).then(()=>{loaded=true;onState({loaded:true});}).catch(e=>{loading=null;throw e});
    }
    await loading;
  }
  function setVolume(part,value){
    if(!(part in channels))throw Error("Unknown groove channel");
    const amount=clamp(value,0,1);
    channels[part].vol=amount;
    gains[part].gain.setTargetAtTime(channels[part].mute?0:amount,context.currentTime,.018);
  }
  function setMute(part,muted){
    if(!(part in channels))throw Error("Unknown groove channel");
    channels[part].mute=!!muted;
    gains[part].gain.setTargetAtTime(channels[part].mute?0:channels[part].vol,context.currentTime,.018);
  }
  function hit(part,name,note,velocity,when,rate=1){
    const buf=buffers.get(name);if(!buf)return;
    const at=Math.max(context.currentTime+.005,when);
    const src=context.createBufferSource();
    src.buffer=buf;src.playbackRate.value=rate;
    const accent=context.createGain();
    accent.gain.value=clamp(velocity,0,1);
    src.connect(accent);accent.connect(gains[part]);
    const voice={src,accent};
    voices.add(voice);
    src.onended=()=>{voices.delete(voice);src.disconnect();accent.disconnect()};
    const channel=part==="bass"?1:9; // 1=musical bass, 9=percussion hat
    sendUMP("noteOn",note,Math.round(clamp(velocity,0,1)*65535),at,channel);
    stats.umpOn++;
    src.start(at);
    // The hit's release is explicitly encoded on the same MIDI2 software route.
    const duration=buf.duration/rate;
    sendUMP("noteOff",note,0,at+duration,channel);
    stats.umpOff++;
    return voice;
  }
  function playStep(i,when,{shift=0}={}){
    if(!loaded)throw Error("Kino Csound groove is not loaded");
    if(i<0||i>=16)throw Error("Invalid groove step");
    const at=when+shift;
    if(i%2&&shift>0){stats.offbeatEvents++;if(!stats.firstOffbeatShift)stats.firstOffbeatShift=shift}
    const note=bassNotes[i];
    if(note!==null){
      // Transpose a single Csound bass hit rather than layering pitched voices.
      hit("bass","bass-d2",note,i%4===0?.86:.63,at,Math.pow(2,(note-bassRoot)/12));
      stats.bassNotes++;
    }
    const open=hats[i]==="open";
    const velocity=i%2?.7:.36;
    hit("hat",open?"hat-open":"hat-closed",open?46:42,velocity,at);
    stats.hatNotes++;
    steps++;
    onState({loaded,steps,bassNotes:stats.bassNotes,hatNotes:stats.hatNotes,offbeatEvents:stats.offbeatEvents});
  }
  function stop(){
    for(const voice of voices){try{voice.src.stop()}catch{}}
    voices.clear();
    stats.allVoicesStopped=true;
  }
  function dispose(){
    stop();
    gains.bass.disconnect();
    gains.hat.disconnect();
  }
  return Object.freeze({
    load,playStep,stop,dispose,setVolume,setMute,
    get evidence(){return Object.freeze({loaded,steps,activeVoices:voices.size,channels:{
      bass:{...channels.bass},hat:{...channels.hat}},...stats})}
  });
}
