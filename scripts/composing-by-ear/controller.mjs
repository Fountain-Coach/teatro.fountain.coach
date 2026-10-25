/* Private browser audition orchestrator. Two independent browsing documents
 * prevent @csound/browser's terminated worklet realm from becoming the next
 * audition's Ear realm. Original media is only loaded from local SHA-pinned
 * fixture; exact WAV recordings return over same-origin postMessage.
 */
const SCHEMA='fountain.composing-by-ear.private.v1';
const BUTTON=document.querySelector('#run');
const STATUS=document.querySelector('#status');
const EVIDENCE=document.querySelector('#evidence');
const OUTPUTS=document.querySelector('#outputs');
const sourceSHA='1d285c6b0a9dd2f7b7be58aac1509b5f55bcac5e3636c530cbec25f20db8f505';
const report=message=>{STATUS.textContent=message};
const publishedURLs=[];
let busy=false;
function runTake(mode){
 return new Promise((resolve,reject)=>{
  const token=crypto.randomUUID();
  const frame=document.createElement('iframe');
  frame.title='Isolated '+mode+' Ear / Csound recording context';
  frame.style.cssText='position:absolute;width:1px;height:1px;clip-path:inset(50%);border:0';
  frame.allow='autoplay';
  let done=false;
  const timer=setTimeout(()=>stop(Error('No terminal '+mode+' worklet receipt')),45000);
  function stop(error,value){
   if(done)return;done=true;
   clearTimeout(timer);window.removeEventListener('message',onMessage);
   frame.remove();
   if(error)reject(error);else resolve(value);
  }
  function onMessage(event){
   if(event.origin!==location.origin||event.source!==frame.contentWindow)return;
   const data=event.data;
   if(data?.schema!==SCHEMA||data?.token!==token)return;
   if(data.status==='ready'){
     report((mode==='control'?'Capturing unmodulated Csound':'Composing through Ear MIDI2')+'…');
     frame.contentWindow.postMessage({schema:SCHEMA,token,action:'run',mode},location.origin);
   }else if(data.status==='failed'){
     stop(Error(mode+': '+data.reason+' at '+data.stage));
   }else if(data.status==='finished'){
     if(data.mode!==mode||data.metadata?.sourceSHA256!==sourceSHA||
        data.recording?.byteLength<100000)
       return stop(Error('Untrusted or incomplete private '+mode+' result'));
     const blob=new Blob([data.recording],{type:'audio/wav'});
     const objectURL=URL.createObjectURL(blob);
     publishedURLs.push(objectURL);
     const audio=document.getElementById(mode+'-audio');
     audio.src=objectURL;audio.load();
     stop(null,{...data.metadata,blobSize:blob.size,audioURL:objectURL});
   }
  }
  window.addEventListener('message',onMessage);
  frame.src='./runner.html?mode='+mode+'&token='+encodeURIComponent(token);
  document.body.appendChild(frame);
 });
}
export async function runComparison(){
 if(busy)throw Error('One experiment at a time');
 busy=true;BUTTON.disabled=true;OUTPUTS.hidden=true;
 while(publishedURLs.length)URL.revokeObjectURL(publishedURLs.pop());
 try {
  if(!window.isSecureContext||location.hostname!=='127.0.0.1')
   throw Error('Original Ear/Csound AudioWorklets require localhost secure context');
  const control=await runTake('control');
  const composed=await runTake('composed');
  const ratio=composed.output.rms/control.output.rms;
  const compared={
    sourceSHA256:sourceSHA,
    realCsound:'@csound/browser AudioWorklet (owned Teatro bundle)',
    shippedEar:'actual source-pinned Ear worklet',
    route:'existing local MIDI2 64-bit UMP CC74 bus; NOT external hardware MIDI2',
    controlRMS:control.output.rms,
    composedRMS:composed.output.rms,
    measuredChangeRatio:ratio,
    controllerPackets:composed.umpPackets,
    acceptedUMP:composed.midi2Accepted,
    csoundMappingsApplied:composed.applied,
    backpressureDrops:composed.backpressureDrops,
    controlMappingsApplied:control.applied,
    csoundEarControlWindows:control.csoundEarWindows,
    csoundEarComposedWindows:composed.csoundEarWindows,
    bothContextsClosed:control.closed&&composed.closed
  };
  if(composed.applied<15||control.applied!==0||ratio<=1.35||
     !compared.bothContextsClosed||composed.rejected||control.rejected)
    throw Error('Real audio control/mapping witness rejected: '+JSON.stringify(compared));
  OUTPUTS.hidden=false;
  report('Completed: Ear changed the Csound sound. Listen to control and composition.');
  EVIDENCE.textContent=JSON.stringify(compared,null,2);
  window.composingByEarResult={status:'passed',control,composed,compared};
  return window.composingByEarResult;
 }catch(error){
  report('Composition refused: '+error.message);
  EVIDENCE.textContent=String(error.stack||error);
  window.composingByEarResult={status:'failed',error:String(error.message)};
  throw error;
 }finally{busy=false;BUTTON.disabled=false}
}
window.runComparison=runComparison;
BUTTON.addEventListener('click',()=>void runComparison().catch(console.error));
window.addEventListener('pagehide',()=>{
 while(publishedURLs.length)URL.revokeObjectURL(publishedURLs.pop());
});
