/* R12 audio gate: actual Csound AudioWorklet and Ear RMS, never the Web Audio
   fallback. Loopback is a secure context for Chromium; this does NOT prove
   Safari's trust in LAN HTTP, an actual MIDI2 host port or author acceptance. */
const localhost='http://127.0.0.1:8198/editions/first-hearing/';
const chrome='http://127.0.0.1:9237';
const created=await fetch(chrome+'/json/new?about:blank',{method:'PUT'});
if(!created.ok)throw Error('Chrome debugging endpoint is unavailable');
const tab=await created.json();
const ws=new WebSocket(tab.webSocketDebuggerUrl);
await new Promise((resolve,reject)=>{ws.onopen=resolve;ws.onerror=reject});
const pending=new Map();let next=0;
ws.onmessage=e=>{const m=JSON.parse(e.data);if(pending.has(m.id)){pending.get(m.id)(m);pending.delete(m.id)}};
const call=(method,params={})=>new Promise(resolve=>{const id=++next;pending.set(id,resolve);ws.send(JSON.stringify({id,method,params}))});
const evaluate=async expression=>{
 const result=await call('Runtime.evaluate',{expression,returnByValue:true});
 if(result.result?.exceptionDetails)throw Error(result.result.exceptionDetails.text);
 return result.result?.result?.value;
};
const wait=ms=>new Promise(resolve=>setTimeout(resolve,ms));
try{
 await call('Runtime.enable');await call('Page.enable');
 await call('Emulation.setDeviceMetricsOverride',{width:820,height:1180,deviceScaleFactor:1,mobile:false});
 await call('Page.navigate',{url:localhost});
 let ready=false;
 for(let i=0;i<70;i++){
  await wait(130);
  ready=await evaluate("document.body.dataset.bookReady==='true' && !!window.FountainBookMidi2");
  if(ready)break;
 }
 if(!ready)throw Error('Original book never reached readable/midi2-ready state');
 const context=await evaluate('({secure:window.isSecureContext,origin:location.origin})');
 if(!context.secure||context.origin!=='http://127.0.0.1:8198')
  throw Error('Not the intended secure loopback context '+JSON.stringify(context));
 const rect=await evaluate("document.getElementById('book-media-toggle').getBoundingClientRect().toJSON()");
 const x=rect.x+rect.width/2,y=rect.y+rect.height/2;
 // A real pointer gesture is required for the browser audio permission.
 await call('Input.dispatchMouseEvent',{type:'mousePressed',x,y,button:'left',clickCount:1});
 await call('Input.dispatchMouseEvent',{type:'mouseReleased',x,y,button:'left',clickCount:1});
 let state=null;
 for(let i=0;i<70;i++){
  await wait(150);
  state=await evaluate("(()=>{const c=document.getElementById('book-media-control');return {mode:c.dataset.player,ear:c.dataset.ear,rms:Number(c.dataset.earRms),earWorkletWitnesses:Number(c.dataset.earWorkletWitnesses||0),sourceIdentity:c.dataset.earSource,status:document.getElementById('book-media-status').textContent,source:document.getElementById('book-audio-source').textContent,pressed:document.getElementById('book-media-toggle').getAttribute('aria-pressed')}})()");
  if(state.mode==='csound'&&state.ear==='witnessed')break;
  if(state.mode==='preview')throw Error('Csound unexpectedly fell back '+JSON.stringify(state));
 }
 if(state?.mode!=='csound'||state.ear!=='witnessed'||!(state.rms>0.0001)||
     state.source!=='Csound · AudioWorklet'||state.pressed!=='true')
  throw Error('No actual Csound / Ear sound witness '+JSON.stringify(state));
 // Its control channel is operated by the same physical reader widget.
 await evaluate("(()=>{const input=document.getElementById('player-wind');input.value='.34';input.dispatchEvent(new Event('input',{bubbles:true}));return input.value})()");
 await wait(550);
 const earWorkletWitnesses=await evaluate('Number(document.getElementById("book-media-control").dataset.earWorkletWitnesses||0)');
 if(earWorkletWitnesses<1)
  throw Error('Csound Ear AudioWorklet did not witness any signal');
 console.log('EAR_WORKLET_WITNESSES',earWorkletWitnesses);
 const parameter=await evaluate("({value:document.getElementById('player-wind').value,output:document.querySelector('#player-wind + output').textContent})");
 if(parameter.value!=='0.34'||parameter.output!=='34%')throw Error('No physical parameter update '+JSON.stringify(parameter));
 // Verify the MIDI2 UMP channel mapping independently of a hardware port.
 const ump=await evaluate("(()=>{let evt=null;window.addEventListener('fountain:book:midi2',e=>{if(e.detail.source==='book:parameter')evt=e.detail},{once:true});document.getElementById('player-head').value='.45';document.getElementById('player-head').dispatchEvent(new Event('input',{bubbles:true}));return evt})()");
 if(ump?.schema!=='fountain.book-midi2.ump.v1'||!Array.isArray(ump.words)||
     ump.words.length!==2||((ump.words[0]>>>8)&127)!==72)
  throw Error('Player did not publish MIDI2 64-bit CC '+JSON.stringify(ump));
 await evaluate("document.getElementById('book-media-toggle').click()");
 await wait(450);
 const stopped=await evaluate("document.getElementById('book-media-control').dataset.player");
 if(stopped!=='stopped')throw Error('Audio did not stop on reader gesture');
 console.log('PASS SECURE_BOOK_CSOUND_EAR',JSON.stringify({origin:context.origin,earRms:state.rms,parameter,umpController:72,stopped}));
}finally{
 ws.close();
 await fetch(chrome+'/json/close/'+tab.id).catch(()=>{});
}
