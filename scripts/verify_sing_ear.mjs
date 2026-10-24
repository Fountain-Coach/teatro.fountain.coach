const host='http://127.0.0.1:9237';
const pageUrl='http://127.0.0.1:8198/';
const response=await fetch(host+'/json/new?about:blank',{method:'PUT'});
if(!response.ok)throw Error('CDP tab failed: '+response.status);
const page=await response.json();
const ws=new WebSocket(page.webSocketDebuggerUrl);
await new Promise((resolve,reject)=>{ws.addEventListener('open',resolve,{once:true});ws.addEventListener('error',reject,{once:true})});
let nextId=0;const pending=new Map();
ws.onmessage=evt=>{const packet=JSON.parse(evt.data);if(packet.id&&pending.has(packet.id)){pending.get(packet.id)(packet);pending.delete(packet.id)}};
function call(method,params={}){return new Promise((resolve,reject)=>{const id=++nextId;pending.set(id,resolve);ws.send(JSON.stringify({id,method,params}));setTimeout(()=>{if(pending.has(id)){pending.delete(id);reject(Error('CDP '+method+' timeout'))}},18000)})}
try{
 await call('Runtime.enable');
 await call('Page.enable');
 await call('Page.navigate',{url:pageUrl});
 await new Promise(x=>setTimeout(x,950));
 const result=await call('Runtime.evaluate',{expression:'window.runEarAudition()',awaitPromise:true,returnByValue:true});
 if(result.result?.exceptionDetails)throw Error(JSON.stringify(result.result.exceptionDetails).slice(0,3000));
 const observed=result.result?.result?.value;
 if(!observed||observed.status!=='finished')throw Error('No finished Ear witness '+JSON.stringify(result).slice(0,2000));
 function assert(check,reason){if(!check)throw Error('EAR_ACCEPTANCE_FAILED '+reason)}
 assert(observed.audioContextStateAfterClose==='closed','AudioContext not released');
 assert(observed.recognizesPhonemes===false,'Ear cannot claim unimplemented phoneme recognition');
 const {plain,articulated,expressive}=observed.results;
 for(const [name,entry] of Object.entries(observed.results)){
   assert(entry.sourceId.startsWith('sing:'+name+':'),'Source identity missing '+name);
   assert(entry.observedCount>=450 && entry.featureWindows>=480,'Insufficient worklet audio '+name);
   assert(entry.silentWindows>=1,'Missing typed silence '+name);
   assert(entry.fixedNoteCount===entry.observedCount,'Shipped Ear fixed-note audit mismatch '+name);
 }
 const segments=plain.acousticFeatures;
 for(const [part,expected] of Object.entries({laVowel:261.63,laMelisma:329.63,miVowel:392.0,naVowel:329.63})){
   assert(Math.abs(segments[part].pitchHz-expected)<14,'Wrong diagnostic pitch '+part);
 }
 const p=plain.acousticFeatures,a=articulated.acousticFeatures,e=expressive.acousticFeatures;
 // A feature-based DEVELOPMENT choice, not an intelligibility/ASR verdict.
 const articulatedMoreNasal =
   a.mOnset.high<p.mOnset.high*0.50 &&
   a.nOnset.high<p.nOnset.high*0.75;
 const stableVowels =
   Math.abs(a.miVowel.high-p.miVowel.high)<0.0005 &&
   Math.abs(a.naVowel.high-p.naVowel.high)<0.0005;
 const expressiveAddsGestures =
   expressive.spectralOnsetCandidates>articulated.spectralOnsetCandidates &&
   e.laMelisma.high>a.laMelisma.high;
 assert(articulatedMoreNasal,'Articulated onsets lack a measured nasal-band contrast');
 assert(stableVowels,'Articulation unintentionally changed sustained vowel');
 assert(expressiveAddsGestures,'Expressive take lacks distinguishable acoustic gestures');
 observed.earDevelopmentSelection={
   baseline:'articulated',
   criterion:'stronger nasal onset high-band attenuation, unchanged sustained vowels',
   humanIntelligibility:'unsupported-not-measured',
   songAcceptance:'pending-independent-recognizer',
   expressiveTake:'retain as independent performance option',
   fixedMIDI2Note48IsNotPitch:true
 };
 console.log(JSON.stringify(observed,null,2));
}catch(err){console.error('EAR_AUDITION_FAILED',String(err));process.exitCode=1}
finally{ws.close();await fetch(host+'/json/close/'+page.id).catch(()=>{})}
