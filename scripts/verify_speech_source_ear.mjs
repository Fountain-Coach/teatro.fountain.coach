// SHA-bound, real-browser Ear witness for private speech-derived Sing output.
// Requires explicit local HTTP + headless Chrome debugging endpoints.
// Not a phoneme recognizer, not editorial publication, not a second MIDI plane.
import {readFileSync} from 'node:fs';
const stage=process.argv[2];
if(!stage?.startsWith('/tmp/')&&!stage?.startsWith('/private/tmp/'))
  throw Error('usage: node scripts/verify_speech_source_ear.mjs /tmp/sing-ear-speech-comparison');
const config=JSON.parse(readFileSync(stage+'/config.json','utf8'));
if(config.recognizesPhonemes!==false||config.publicRelease!=='not-admitted')
  throw Error('Private Ear comparison is not a recognizer or release');
const originalSHA='4f1d800fd5518975c0bc98a5fb0ace93eaa726d8731bf330a8eff59a9d115427';
if(config.workletSha256!==originalSHA)throw Error('Shipped Ear worklet SHA changed');
const port=(key,fallback)=>{const n=Number(process.env[key]||fallback);if(!Number.isInteger(n)||n<1024||n>65535)throw Error('Invalid port '+key);return n};
const httpPort=port('EAR_HTTP_PORT',8198);
const cdpPort=port('EAR_CDP_PORT',9237);
const response=await fetch('http://127.0.0.1:'+cdpPort+'/json/new?about:blank',{method:'PUT'});
if(!response.ok)throw Error('Browser CDP tab unavailable '+response.status);
const page=await response.json();
const ws=new WebSocket(page.webSocketDebuggerUrl);
await new Promise((ok,fail)=>{
  ws.addEventListener('open',ok,{once:true});
  ws.addEventListener('error',fail,{once:true});
});
let serial=0;
const pending=new Map();
ws.onmessage=ev=>{
  const msg=JSON.parse(ev.data);
  if(msg.id&&pending.has(msg.id)){
    const job=pending.get(msg.id);
    pending.delete(msg.id);clearTimeout(job.timer);job.resolve(msg);
  }
};
function call(method,params={}){
  return new Promise((resolve,reject)=>{
    const id=++serial;
    const timer=setTimeout(()=>{
      if(pending.has(id)){pending.delete(id);reject(Error(method+' timed out'))}
    },25000);
    pending.set(id,{resolve,reject,timer});
    ws.send(JSON.stringify({id,method,params}));
  });
}
function requireTruth(condition,description){
  if(!condition)throw Error('EAR_SPEECH_COMPARISON_REJECTED '+description);
}
try{
  await call('Runtime.enable');await call('Page.enable');
  await call('Page.navigate',{url:'http://127.0.0.1:'+httpPort+'/'});
  await new Promise(ok=>setTimeout(ok,900));
  await call('Runtime.evaluate',{
    expression:"window.runEarAudition().catch(e=>{window.earResult={status:'error',reason:String(e)}}); 'started'",
    returnByValue:true
  });
  let observed=null;
  for(let attempt=0;attempt<11;attempt++){
    await new Promise(ok=>setTimeout(ok,1400));
    const report=await call('Runtime.evaluate',{
      expression:"JSON.stringify({status:window.earResult?.status,reason:window.earResult?.reason})",
      returnByValue:true
    });
    const state=JSON.parse(report.result?.result?.value||'{}');
    if(state.status==='error')throw Error('Real Ear worklet: '+state.reason);
    if(state.status==='finished'){
      const done=await call('Runtime.evaluate',{
        expression:'window.earResult',returnByValue:true
      });
      observed=done.result?.result?.value;
      break;
    }
  }
  requireTruth(observed?.status==='finished','no completed browser audio graph');
  requireTruth(observed.audioContextStateAfterClose==='closed','AudioContext not closed');
  requireTruth(observed.recognizesPhonemes===false,'missing phoneme implementation misrepresented');
  for(const [name,sha] of Object.entries(config.sources)){
    const entry=observed.results[name];
    requireTruth(entry?.sha256===sha,'wrong private SHA for '+name);
    requireTruth(entry.sourceId==='sing:'+name+':'+sha.slice(0,16),'missing source identity '+name);
    requireTruth(entry.observedCount>430,'actual shipped Ear samples insufficient '+name);
    requireTruth(entry.featureWindows>=480,'feature processor samples insufficient '+name);
    requireTruth(entry.fixedNoteCount===entry.observedCount,
                 'shipped fixed-note 48 placeholder changed '+name);
  }
  const report={
    status:'passed',scope:'actual-chrome-original-shipped-ear-and-parallel-test-only-features',
    workletSha256:originalSHA,
    audioContextStateAfterClose:observed.audioContextStateAfterClose,
    phonemeRecognition:'NOT_AVAILABLE',
    publicRelease:'not-admitted',
    results:observed.results
  };
  console.log(JSON.stringify(report,null,2));
}catch(error){
  console.error('EAR_PRIVATE_SPEECH_FAILED',String(error));
  process.exitCode=1;
}finally{
  ws.close();
  await fetch('http://127.0.0.1:'+cdpPort+'/json/close/'+page.id).catch(()=>{});
}
