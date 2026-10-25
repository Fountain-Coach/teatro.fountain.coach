/* One isolated browser document owns one original Ear and Csound execution.
 * Nothing here creates an alternate transport: compose.mjs owns the existing
 * repository MIDI2 UMP identity, source checks and typed Csound port mapping.
 */
import {runComposition} from './compose.mjs';
const ORIGIN=location.origin;
const SCHEMA='fountain.composing-by-ear.private.v1';
const token=new URL(location.href).searchParams.get('token');
if(!token||token.length>80)throw Error('Runner needs a bounded session token');
const send=(data,transfer=[])=>parent.postMessage({schema:SCHEMA,token,...data},ORIGIN,transfer);
window.addEventListener('message',async event=>{
 if(event.origin!==ORIGIN||event.source!==parent||
    event.data?.schema!==SCHEMA||event.data?.token!==token||event.data?.action!=='run')return;
 const driven=event.data.mode==='composed';
 if(!driven&&event.data.mode!=='control')return send({status:'failed',reason:'unknown mode'});
 try{
  const result=await runComposition({driven});
  const recording=await fetch(result.audioURL).then(x=>x.arrayBuffer());
  if(recording.byteLength<100000)throw Error('Captured WAV unavailable');
  const metadata={...result,audioURL:undefined};
  send({status:'finished',mode:event.data.mode,metadata,recording},[recording]);
 }catch(error){
  const trace=window.composingByEarLastRun;
  send({status:'failed',mode:event.data.mode,reason:String(error.message),
    stage:trace?.stage,sourceEar:trace?.sourceEarWindows,csoundEar:trace?.csoundEarWindows});
 }
},{once:true});
send({status:'ready'});
