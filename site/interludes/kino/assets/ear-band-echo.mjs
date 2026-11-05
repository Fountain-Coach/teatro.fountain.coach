import {encodeControlChange,decodeUmp} from "./midi2-ump.mjs";

/**
 * Ear-source PCM -> shipped Ear Analysis AudioWorklet -> owner MIDI 2.0 CC74 ->
 * bounded local browser band/tape echo. Control loop only; wet PCM does not feed Ear.
 * This is not a native Csound patch, a hardware port or native Scenario admission.
 */
const SOURCE="teatro.kino.sampler.pcm.01";
const GROUP=0,CHANNEL=0,CONTROLLER=74;
const clamp=(x,lo,hi)=>Math.max(lo,Math.min(hi,x));

export async function createEarBandEcho({context,output,onReport=()=>{}}){
 if(!context||!output)throw Error("Audio engine and output required");
 await context.audioWorklet.addModule("./assets/ear-original.js");
 const input=context.createGain(), dry=context.createGain(),send=context.createGain();
 const high=context.createBiquadFilter(),low=context.createBiquadFilter();
 const delay=context.createDelay(1.5),feedback=context.createGain(),wet=context.createGain();
 const ear=new AudioWorkletNode(context,"ear-analysis",{
  numberOfInputs:1,numberOfOutputs:1,outputChannelCount:[1],
  processorOptions:{sourceId:SOURCE,sourceKind:"KinoSamplePCM",
    sampleRate:context.sampleRate,windowSamples:1024,hopSamples:512}
 });
 const earSink=context.createGain();earSink.gain.value=0;
 const lfo=context.createOscillator(),lfoDepth=context.createGain();
 high.type="highpass";high.frequency.value=240;high.Q.value=.55;
 low.type="lowpass";low.frequency.value=2450;low.Q.value=.6;
 delay.delayTime.value=0.402;
 feedback.gain.value=0;
 wet.gain.value=0;
 dry.gain.value=.83;
 send.gain.value=.62;
 // No audio-to-Ear loop: only original sampler PCM is observed.
 input.connect(dry);dry.connect(output);
 input.connect(send);send.connect(high);high.connect(delay);
 delay.connect(low);low.connect(wet);wet.connect(output);
 low.connect(feedback);feedback.connect(high);
 input.connect(ear);ear.connect(earSink);earSink.connect(context.destination);
 lfo.type="sine";lfo.frequency.value=.37;lfoDepth.gain.value=.0038;
 lfo.connect(lfoDepth);lfoDepth.connect(delay.delayTime);lfo.start();
 let active=true,enabled=false,lastUpdate=-Infinity,sequence=0,accepted=0,rejected=0;
 let observedWindows=0,silenceWindows=0,measuredMax=0;
 let manualWet=.31, manualTone=1, lastNormalized=0, lastPacket=null;
 const applied={feedback:0,cutoff:2450,mix:0,rms:0};
 const setAudio=(name,parameter,value)=>{
   if(!Number.isFinite(value))throw Error("Non-finite echo parameter");
   parameter.cancelScheduledValues(context.currentTime);
   parameter.setTargetAtTime(value,context.currentTime,.045);
   applied[name]=value;
 };
 function acceptPacket(words,correlation){
   if(!active||!enabled||correlation.sourceIdentity!==SOURCE||
      !Number.isInteger(correlation.sequence)||correlation.sequence<=accepted){
     rejected++;return false;
   }
   let message;
   try{message=decodeUmp(words)}
   catch{rejected++;return false}
   if(message?.kind!=="controlChange"||message.group!==GROUP||
      message.channel!==CHANNEL||message.controller!==CONTROLLER||
      !Number.isInteger(message.value)){
     rejected++;return false;
   }
   const n=clamp(message.value/0xffffffff,0,1);
   // CC74 opens the repeat band as the incoming sampled energy rises.
   // Feedback always below .49 so every repeat converges.
   const cutoff=clamp((580+2650*n)*manualTone,440,5600);
   const fb=clamp(.15+.29*n,0,.44);
   const mix=clamp(manualWet*(.52+.48*n),0,.43);
   setAudio("feedback",feedback.gain,fb);
   setAudio("cutoff",low.frequency,cutoff);
   setAudio("mix",wet.gain,mix);
   lastNormalized=n;accepted=correlation.sequence;
   lastPacket=[...words].map(x=>x.toString(16).padStart(8,"0").toUpperCase());
   onReport({state:"following",rms:applied.rms,control:n,sequence:accepted,
      words:lastPacket,frequencyHz:Math.round(cutoff),feedback:fb,wet:mix,observedWindows});
   return true;
 }
 ear.port.onmessage=event=>{
   if(!active||!enabled)return;
   const m=event.data;
   if(m?.type==="ear.silence"){silenceWindows++;return}
   if(m?.type!=="ear.ump"||m.event?.sourceIdentity!==SOURCE)return;
   const rms=m.event?.measurement?.rms,timestamp=m.event?.timestamp;
   if(!Number.isFinite(rms)||rms<0||!Number.isFinite(timestamp))return;
   observedWindows++;
   measuredMax=Math.max(measuredMax,rms);
   if(timestamp-lastUpdate<.075)return;
   lastUpdate=timestamp;
   applied.rms=rms;
   // Ear is measuring actual PCM. Its placeholder note 48 is deliberately ignored.
   const normalized=clamp(Math.sqrt(rms/.035),0,1); // Soft-knee mapping preserves detail in quiet sample grains.
   const packet=encodeControlChange({
      kind:"controlChange",group:GROUP,channel:CHANNEL,
      controller:CONTROLLER,value:Math.round(normalized*0xffffffff)
   });
   const correlation={sourceIdentity:SOURCE,sequence:++sequence};
   acceptPacket(packet,correlation);
 };
 function reset(){
   if(!active)return;
   enabled=false;
   setAudio("feedback",feedback.gain,0);
   setAudio("mix",wet.gain,0);
   setAudio("cutoff",low.frequency,2450);
   applied.rms=0;
   lastUpdate=-Infinity;
   onReport({state:"stopped",rms:0,control:0,sequence:accepted,
     feedback:0,wet:0,frequencyHz:2450,observedWindows});
 }
 function resume(){
   if(!active)return;
   enabled=true;
   // The first actual Ear observation re-admits echo feedback.
   onReport({state:"armed",rms:0,control:0,sequence:accepted,observedWindows});
 }
 function setMix(value){
   manualWet=clamp(value,0,.43);
   if(enabled)setAudio("mix",wet.gain,manualWet*(.52+.48*lastNormalized));
 }
 function setTone(value){
   manualTone=clamp(value,.65,1.6);
   if(enabled)setAudio("cutoff",low.frequency,clamp((580+2650*lastNormalized)*manualTone,440,5600));
 }
 function dispose(){
   if(!active)return;
   reset();active=false;
   ear.port.onmessage=null;ear.port.close();
   try{lfo.stop()}catch{}
   for(const n of [input,dry,send,high,delay,low,feedback,wet,ear,earSink,lfo,lfoDepth])n.disconnect();
 }
 return Object.freeze({
   input,resume,reset,dispose,setMix,setTone,
   get evidence(){return Object.freeze({sourceIdentity:SOURCE,observedWindows,silenceWindows,
      lastSequence:accepted,rejected,measuredMax,feedback:applied.feedback,wet:applied.mix,
      cutoff:applied.cutoff,enabled,lastPacket})}
 });
}
