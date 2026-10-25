/* Composing by Ear / private scenario 01.
 * Exact native Sing PCM -> shipped Teatro Ear AudioWorklet -> existing
 * Fountain Book MIDI2 64-bit UMP event plane -> Csound Teatro wind_mix.
 * This is LOCAL browser transport, not a physical/native MIDI2 port.
 * This scenario does NOT use Ear's constant note 48 as detected pitch.
 */
import {BookCsoundHost} from '/assets/book-csound-host.js';
import {createBookMidi2,unpackControlChange} from '/assets/linotype/book-midi2.mjs';

const WAV_SHA='1d285c6b0a9dd2f7b7be58aac1509b5f55bcac5e3636c530cbec25f20db8f505';
const SOURCE='sing:articulated:'+WAV_SHA.slice(0,16);
const ID='composing-by-ear:'+WAV_SHA.slice(0,16);
const MAP=Object.freeze({
  source:'Ear.rms',sourceUnit:'normalized linear amplitude (RMS)',
  sourceDomain:[0,0.20],controller:74,group:0,channel:0,
  target:'CsoundTeatro.wind_mix',targetDomain:[0.25,1.0],
  clamp:true,transfer:'linear',update:'event',minIntervalSeconds:0.075,
  instrument:'Teatro BookCsoundHost (shipped browser AudioWorklet)',
  operation:'private-rehearsal',noFeedback:true
});
const status=document.querySelector('#status');
const evidence=document.querySelector('#evidence');
const showStatus=message=>{if(status)status.textContent=message};
const pause=ms=>new Promise(resolve=>setTimeout(resolve,ms));
const digest=async buffer=>[...new Uint8Array(await crypto.subtle.digest('SHA-256',buffer))]
  .map(byte=>byte.toString(16).padStart(2,'0')).join('');
const clamp=v=>Math.max(0,Math.min(1,v));
// Deliberate equal playback gain, applied AFTER measuring the raw Csound PCM.
// The actual engine runs quietly; without this both audio previews are tiny.
const AUDITION_GAIN=120;
const meanRms=blocks=>{
  let sum=0,frames=0,peak=0;
  // The first 0.55 s is the Csound control/settling region in either take.
  let skip=26000;
  for(const part of blocks){
    const left=part.left;
    for(let i=0;i<left.length;i++){
      if(skip>0){skip--;continue}
      const x=left[i];sum+=x*x;frames++;peak=Math.max(peak,Math.abs(x));
    }
  }
  return {rms:Math.sqrt(sum/Math.max(1,frames)),peak,frames};
};
function writeText(view,offset,value){
  for(let i=0;i<value.length;i++)view.setUint8(offset+i,value.charCodeAt(i));
}
function wavBlob(blocks,rate){
  const frames=blocks.reduce((n,b)=>n+b.frames,0);
  if(!frames)throw Error('No PCM recorded from Csound');
  const bytes=new ArrayBuffer(44+frames*4);
  const view=new DataView(bytes);
  writeText(view,0,'RIFF');view.setUint32(4,36+frames*4,true);
  writeText(view,8,'WAVE');writeText(view,12,'fmt ');
  view.setUint32(16,16,true);view.setUint16(20,1,true);
  view.setUint16(22,2,true);view.setUint32(24,rate,true);
  view.setUint32(28,rate*4,true);view.setUint16(32,4,true);
  view.setUint16(34,16,true);writeText(view,36,'data');
  view.setUint32(40,frames*4,true);
  let at=44;
  for(const block of blocks){
    for(let i=0;i<block.frames;i++){
      view.setInt16(at,Math.round(Math.max(-1,Math.min(1,block.left[i]*AUDITION_GAIN))*32767),true);
      view.setInt16(at+2,Math.round(Math.max(-1,Math.min(1,block.right[i]*AUDITION_GAIN))*32767),true);
      at+=4;
    }
  }
  if(at!==bytes.byteLength)throw Error('WAV frame count mismatch');
  return new Blob([bytes],{type:'audio/wav'});
}
let running=false;
let runSerial=0;
let lastURLs=[];
export async function runComposition({driven=true}={}){
  if(running)throw Error('A composition is already in progress');
  running=true;
  const runNumber=++runSerial;
  const workletQuery='?fixture='+performance.timeOrigin+'-'+runNumber;
  const targetMode=driven?'composed':'control';
  const report={mode:targetMode,source:SOURCE,sourceSHA256:WAV_SHA,
    mapping:MAP,umpPackets:0,midi2Accepted:0,applied:0,backpressureDrops:0,
    sourceEarWindows:0,sourceSilentWindows:0,csoundEarWindows:0,
    rejected:0,observations:[],route:'browser-local UMP, not external MIDI2',
    recognizedPitch:false,recognizedPhonemes:false};
  let source=null,sourceEar=null,sourceSink=null,recorder=null,recorderSink=null;
  let context=null,csound=null,csoundContext=null,bus=null;
  let pending=null;
  const blocks=[];
  window.composingByEarLastRun=report;
  report.stage='begin';
  try {
    if(!window.isSecureContext||location.hostname!=='127.0.0.1')
      throw Error('This private experiment requires secure localhost; no LAN HTTP Csound fallback');
    report.stage='fetch-source';
    const response=await fetch('./articulated.wav',{cache:'no-store'});
    if(!response.ok)throw Error('Original Sing WAV unavailable: '+response.status);
    const bytes=await response.arrayBuffer();
    const actual=await digest(bytes);
    if(actual!==WAV_SHA)throw Error('Sing source digest mismatch: '+actual);
    context=new AudioContext({sampleRate:48000,latencyHint:'interactive'});
    report.stage='source-ear-worklet-loading';
    await context.audioWorklet.addModule('./ear-original.js'+workletQuery);
    report.stage='source-ear-worklet-loaded';
    await context.resume();
    const audio=await context.decodeAudioData(bytes.slice(0));
    if(audio.numberOfChannels!==1||audio.sampleRate!==48000||
       Math.abs(audio.duration-5.2)>0.001)
      throw Error('Sing PCM sample format changed');
    report.inputFrames=audio.length;
    report.inputSampleRate=audio.sampleRate;
    // Csound runtime and its independent Ear are the exact committed Teatro
    // browser implementation, not a stand-in oscillator or fake sound.
    showStatus('Preparing original Csound Teatro and Ear…');
    report.stage='csound-host-start';
    csound=new BookCsoundHost();
    await csound.start(event=>{
      report.csoundCallbackTypes??={};
      report.csoundCallbackTypes[event?.type||'unknown']=(report.csoundCallbackTypes[event?.type||'unknown']||0)+1;
      if(!report.firstCsoundCallback)report.firstCsoundCallback={
        type:event?.type,source:event?.event?.sourceIdentity,
        keys:Object.keys(event||{}),
        measurementKeys:Object.keys(event?.event?.measurement||{})
      };
      if(event?.type==='ear.ump'&&Number.isFinite(event.event?.measurement?.rms)){
        if(!report.firstCsoundEar)report.firstCsoundEar={source:event?.event?.sourceIdentity,measurement:event?.event?.measurement};
        report.csoundEarWindows++;
        if(!report.csoundEarSource)report.csoundEarSource=event.event?.sourceIdentity;
      }
    });
    report.stage='csound-host-started';
    if(!csound.runtime?.instance||!csound.runtime?.csoundNode)
      throw Error('Real Csound AudioWorklet did not start');
    csoundContext=csound.runtime.context;
    report.csoundImplementation='@csound/browser AudioWorklet';
    report.csoundSampleRate=csoundContext.sampleRate;
    // Silence the live loudspeaker monitor. The author auditions the captured
    // real Csound audio deliberately using the controls after the run.
    await csound.runtime.setOutputEnabled(false);
    for(const [name,value] of Object.entries({
      wind_mix:0.25,turbulence_mix:0,head_mix:0,voice_mix:0
    }))await csound.setParameter(name,value);
    report.stage='csound-recorder-module-loading';
    await csoundContext.audioWorklet.addModule('./audio-recorder.worklet.js'+workletQuery);
    report.stage='csound-recorder-module-loaded';
    recorder=new AudioWorkletNode(csoundContext,'csound-evidence-recorder',{
      numberOfInputs:1,numberOfOutputs:1,outputChannelCount:[2]
    });
    recorder.port.onmessage=event=>{
      const obj=event.data;
      if(obj?.type==='csound.pcm'&&obj.frames>0&&
         obj.left?.length===obj.frames&&obj.right?.length===obj.frames)
        blocks.push(obj);
    };
    recorderSink=csoundContext.createGain();
    recorderSink.gain.value=0;
    csound.runtime.analyser.connect(recorder);
    recorder.connect(recorderSink);
    recorderSink.connect(csoundContext.destination);

    bus=createBookMidi2(ID);
    let lastSequence=0,updateBusy=false;
    const update=async (value,seq)=>{
      updateBusy=true;
      try {
        await csound.setParameter('wind_mix',value);
        report.applied++;
        if(report.observations.length<12)report.observations.push({
          kind:'csound.wind_mix',sequence:seq,value:+value.toFixed(5)
        });
      } catch(error) {
        report.rejected++;
        report.lastError=error.message;
      } finally {updateBusy=false}
    };
    // Existing book bus is in-browser UMP. publish() dispatches the UMP
    // envelope; receive() is an explicit loopback to the admitted local port.
    // No claim of physical MIDI2 transfer is made by this wiring.
    const unsubscribe=bus.subscribe(packet=>{
      if(packet.controller!==MAP.controller||packet.group!==MAP.group||
         packet.channel!==MAP.channel||
         packet.source!=='ear:'+SOURCE||packet.sequence<=lastSequence){
        report.rejected++;return;
      }
      lastSequence=packet.sequence;report.midi2Accepted++;
      if(!driven)return;
      if(updateBusy){report.backpressureDrops++;return}
      const parameter=MAP.targetDomain[0]+
        packet.value*(MAP.targetDomain[1]-MAP.targetDomain[0]);
      void update(parameter,packet.sequence);
    });
    source=context.createBufferSource();source.buffer=audio;
    sourceEar=new AudioWorkletNode(context,'ear-analysis',{
      numberOfInputs:1,numberOfOutputs:1,outputChannelCount:[1],
      processorOptions:{sourceId:SOURCE,sourceKind:'AudioBuffer',
        sampleRate:context.sampleRate,windowSamples:1024,hopSamples:512}
    });
    sourceSink=context.createGain();sourceSink.gain.value=1e-6;
    source.connect(sourceEar);sourceEar.connect(sourceSink);
    sourceSink.connect(context.destination);
    let lastObservation=-Infinity;
    sourceEar.port.onmessage=event=>{
      const message=event.data;
      if(message?.type==='ear.silence'){report.sourceSilentWindows++;return}
      if(message?.type!=='ear.ump'||message.event?.sourceIdentity!==SOURCE)return;
      const observation=message.event;
      if(!Number.isFinite(observation.timestamp)||
         !Number.isFinite(observation.measurement?.rms))return;
      report.sourceEarWindows++;
      if(observation.timestamp-lastObservation<MAP.minIntervalSeconds)return;
      lastObservation=observation.timestamp;
      // Ear's .note is currently a fixed placeholder 48. It is deliberately
      // excluded from this composition; only measured RMS maps to CC74.
      const normalized=clamp(observation.measurement.rms/MAP.sourceDomain[1]);
      const ump=bus.publish(MAP.controller,normalized,'ear:'+SOURCE);
      const decoded=unpackControlChange(ump.words);
      if(!decoded||decoded.controller!==74||decoded.group!==0||
         decoded.channel!==0||ump.words.length!==2||
         ((ump.words[0]>>>28)!==4)){
        report.rejected++;return;
      }
      report.umpPackets++;
      if(!report.firstUMP)report.firstUMP={
        words:ump.words,source:ump.source,sequence:ump.sequence,
        originalEarTimestamp:observation.timestamp};
      report.lastUMP={words:ump.words,source:ump.source,
        sequence:ump.sequence,originalEarTimestamp:observation.timestamp};
      if(!bus.receive(ump))report.rejected++;
    };
    showStatus((driven?'Composing':'Capturing control')+
      ': original Sing → Ear → MIDI2 → Csound…');
    report.stage='source-playing';
    source.start(context.currentTime+0.2);
    await new Promise(resolve=>source.addEventListener('ended',resolve,{once:true}));
    await pause(470);
    // All reported audio blocks are from a real Csound AudioWorklet tap.
    recorder.port.postMessage({type:'flush'});
    await pause(150);
    report.stage='verify-captured-audio';
    report.audioContextStateBeforeClose=csoundContext.state;
    report.capturedFrames=blocks.reduce((n,x)=>n+x.frames,0);
    report.capturedSeconds=report.capturedFrames/csoundContext.sampleRate;
    report.output=meanRms(blocks);
    report.auditionGainLinear=AUDITION_GAIN;
    if(report.output.peak*AUDITION_GAIN>=0.9)
      throw Error('Would clip audition: preserve raw Csound and refuse output');
    if(report.capturedSeconds<5||report.sourceEarWindows<150||
       report.csoundEarWindows<10||report.umpPackets<30||
       report.midi2Accepted!==report.umpPackets||
       report.rejected!==0||!(report.output.rms>0.00001))
      throw Error('Incomplete acoustic / MIDI2 / Csound witness: '+
        JSON.stringify({source:report.sourceEarWindows,csound:report.csoundEarWindows,
          ump:report.umpPackets,accepted:report.midi2Accepted,
          rms:report.output.rms,rejected:report.rejected,csoundCallback:report.firstCsoundCallback,csoundTypes:report.csoundCallbackTypes,firstEar:report.firstCsoundEar}));
    if(driven&&report.applied<15)
      throw Error('Csound did not receive sufficient governed parameter updates');
    const wav=wavBlob(blocks,csoundContext.sampleRate);
    report.outputWAVBytes=wav.size;
    const url=URL.createObjectURL(wav);
    const player=document.getElementById(driven?'composed-audio':'control-audio');
    if(player){player.src=url;player.load();}
    lastURLs.push(url);
    report.audioURL=url;
    delete report.observations;
    report.stage='accepted';
    if(evidence)evidence.textContent=JSON.stringify({...report,audioURL:'private local blob'},null,2);
    unsubscribe();
    return report;
  } finally {
    try{source?.stop()}catch{}
    try{source?.disconnect();sourceEar?.port.close();sourceEar?.disconnect();
      sourceSink?.disconnect();}catch{}
    try{recorder?.port.close();recorder?.disconnect();recorderSink?.disconnect()}catch{}
    try{bus?.dispose()}catch{}
    try{await csound?.stop()}catch{}
    try{if(csoundContext&&csoundContext.state!=='closed')await csoundContext.close()}catch{}
    try{if(context&&context.state!=='closed')await context.close()}catch{}
    report.closed=(!context||context.state==='closed')&&
                  (!csoundContext||csoundContext.state==='closed');
    running=false;
  }
}
export async function runComparison(){
  const button=document.querySelector('#run');
  if(button)button.disabled=true;
  document.querySelector('#outputs').hidden=true;
  while(lastURLs.length)URL.revokeObjectURL(lastURLs.pop());
  try {
    const control=await runComposition({driven:false});
    const composed=await runComposition({driven:true});
    const ratio=composed.output.rms/control.output.rms;
    const compared={sourceSHA256:WAV_SHA,csound:'real @csound/browser',
      mode:'private UMP loopback',baselineRMS:control.output.rms,
      composedRMS:composed.output.rms,measuredChangeRatio:ratio,
      acceptedUMP:composed.midi2Accepted,csoundMappingsApplied:composed.applied,
      droppedDueToBackpressure:composed.backpressureDrops,
      controlUMP:control.umpPackets,controlMappingsApplied:control.applied,
      controlCsoundEar:control.csoundEarWindows,
      composedCsoundEar:composed.csoundEarWindows,
      bothSourcesClosed:control.closed&&composed.closed};
    if(!(ratio>1.35)||control.applied!==0||!compared.bothSourcesClosed)
      throw Error('Unmodulated control did not establish audible difference: '+
                  JSON.stringify(compared));
    document.querySelector('#outputs').hidden=false;
    if(evidence)evidence.textContent=JSON.stringify(compared,null,2);
    showStatus('Composed and verified: Ear MIDI2 changed actual Csound audio. Listen to both recordings.');
    window.composingByEarResult={status:'passed',control,composed,compared};
    return window.composingByEarResult;
  }catch(err){
    showStatus('Composition not accepted: '+String(err.message));
    window.composingByEarResult={status:'failed',error:String(err.message),lastRunTrace:{mode:window.composingByEarLastRun?.mode,stage:window.composingByEarLastRun?.stage,csoundTypes:window.composingByEarLastRun?.csoundCallbackTypes,firstCsound:window.composingByEarLastRun?.firstCsoundCallback}};
    throw err;
  }finally{if(button)button.disabled=false}
}
window.runComposition=runComposition;
window.runComparison=runComparison;
document.querySelector('#run')?.addEventListener('click',()=>{
  void runComparison().catch(e=>console.error('COMPOSING_BY_EAR',e));
});
