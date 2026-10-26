/* Secure localhost browser witness for the staged SatzfunkPlayer Scenario.
 * CDP Input events are user gestures; no browser autoplay override is used. */
const pageURL='http://127.0.0.1:8208/teatro/scenarios/satzfunk-player/ear-wind/';
const chrome='http://127.0.0.1:9237';
const created=await fetch(chrome+'/json/new?about:blank',{method:'PUT'});
if(!created.ok)throw Error('Chrome debugging endpoint unavailable');
const tab=await created.json();
const ws=new WebSocket(tab.webSocketDebuggerUrl);
await new Promise((resolve,reject)=>{ws.onopen=resolve;ws.onerror=reject});
const pending=new Map();let next=0;const consoleErrors=[];
ws.onmessage=e=>{const m=JSON.parse(e.data);if(m.method==='Runtime.exceptionThrown')consoleErrors.push(m.params.exceptionDetails.text||'page exception');if(m.method==='Log.entryAdded'&&m.params.entry.level==='error')consoleErrors.push(m.params.entry.text);if(pending.has(m.id)){pending.get(m.id)(m);pending.delete(m.id)}};
const call=(method,params={})=>new Promise((resolve,reject)=>{const id=++next;pending.set(id,m=>m.error?reject(new Error(m.error.message)):resolve(m));ws.send(JSON.stringify({id,method,params}))});
const evaluate=async expression=>{const m=await call('Runtime.evaluate',{expression,awaitPromise:true,returnByValue:true});if(m.result?.exceptionDetails)throw Error(m.result.exceptionDetails.text);return m.result?.result?.value};
const wait=ms=>new Promise(resolve=>setTimeout(resolve,ms));
const gesture=async selector=>{const r=await evaluate(`(()=>{const e=document.querySelector(${JSON.stringify(selector)});e.scrollIntoView({block:'center',inline:'center'});const x=e.getBoundingClientRect();return {x:x.x+x.width/2,y:x.y+x.height/2,hit:document.elementFromPoint(x.x+x.width/2,x.y+x.height/2)?.id,disabled:e.disabled,innerHeight}})()`);console.log('GESTURE',selector,JSON.stringify(r));if(r.hit!==selector.slice(1)||r.disabled)throw Error('Click target not interactable: '+JSON.stringify(r));await call('Input.dispatchMouseEvent',{type:'mouseMoved',x:r.x,y:r.y});await call('Input.dispatchMouseEvent',{type:'mousePressed',x:r.x,y:r.y,button:'left',clickCount:1});await call('Input.dispatchMouseEvent',{type:'mouseReleased',x:r.x,y:r.y,button:'left',clickCount:1});};
const snapshot=()=>evaluate(`(()=>{const ev=JSON.parse(document.querySelector('#scenario-evidence').textContent);const frame=document.querySelector('#scenario-stage');const stage=frame?.contentDocument?.querySelector('[data-teatro-scenario-projection]');return {secure:isSecureContext,origin:location.origin,startClickSeen:window.__startClickSeen??null,status:document.querySelector('#scenario-status').textContent,prepareDisabled:document.querySelector('#scenario-prepare').disabled,startDisabled:document.querySelector('#scenario-start').disabled,playerState:document.querySelector('satzfunk-player').state,video:(()=>{const v=document.querySelector('satzfunk-player')?.shadowRoot?.querySelector('video');return v?{src:v.src,networkState:v.networkState,readyState:v.readyState,error:v.error?{code:v.error.code,message:v.error.message}:null}:null})(),evidence:ev,stage:stage?{state:stage.dataset.teatroScenarioProjection,runID:stage.dataset.teatroScenarioRunId,ump:stage.textContent}:null}})()`);
try{
 await call('Runtime.enable');await call('Page.enable');await call('Log.enable');
 await call('Emulation.setDeviceMetricsOverride',{width:1280,height:1000,deviceScaleFactor:1,mobile:false});
 await call('Page.navigate',{url:pageURL});
 let initial;
 for(let i=0;i<80;i++){await wait(125);initial=await evaluate(`!!document.querySelector('#scenario-prepare')&&!!document.querySelector('#scenario-stage')?.contentDocument?.querySelector('#root')`);if(initial)break;}
 if(!initial)throw Error('Scenario route or embedded Stage did not load');
 const context=await evaluate('({secure:isSecureContext,origin:location.origin})');
 if(!context.secure||context.origin!=='http://127.0.0.1:8208')throw Error('Scenario did not run on the secure localhost stage origin '+JSON.stringify(context));
 await evaluate(`document.querySelector('#scenario-start').addEventListener('click',e=>window.__startClickSeen=e.isTrusted)`);
 const before=await snapshot();
 await gesture('#scenario-prepare');
 let prepared=null;
 for(let i=0;i<160;i++){await wait(125);prepared=await snapshot();if(!prepared.startDisabled)break;if(prepared.status.startsWith('Prepare failed:'))throw Error(prepared.status+' ' + JSON.stringify(prepared.video));}
 if(prepared.startDisabled||prepared.evidence.run?.runID==null)throw Error('Player Scenario was not admitted '+JSON.stringify(prepared));
 if(prepared.evidence.source?.exactPublicAssetBytesVerified!==true)throw Error('Public source bytes were not verified');
 const runID=prepared.evidence.run.runID;
 await gesture('#scenario-start');
 let running=null;
 for(let i=0;i<160;i++){await wait(125);running=await snapshot();const op=running.evidence.midi2?.latestDecodedAndAppliedOperation;const valid=running.evidence.state?.state==='running'&&running.evidence.midi2?.acceptedSoftwareUmpOperations>0&&running.evidence.csound?.latestOutputEarRms>0&&running.stage?.state==='running'&&running.stage?.runID===runID&&op?.runID===runID&&op?.controller===74&&op?.group===0&&op?.channel===0;if(valid)break;if(running.status.startsWith('Start failed'))throw Error(running.status);}
 const op=running?.evidence?.midi2?.latestDecodedAndAppliedOperation;
 if(running?.evidence?.state?.state!=='running'||!(running.evidence.midi2.acceptedSoftwareUmpOperations>0)||!(running.evidence.csound.latestOutputEarRms>0)||running.stage?.state!=='running'||running.stage?.runID!==runID||op?.runID!==runID||op?.controller!==74||op?.group!==0||op?.channel!==0)throw Error('No correlated live Player/Ear/UMP/Csound/Stage evidence '+JSON.stringify(running));
 if(running.evidence.midi2.hardwareInteroperability!==false||!String(running.evidence.midi2.midiCi).includes('no live discovery'))throw Error('Capability boundary is not truthful');
 await gesture('#scenario-stop');
 let stopped=null;
 for(let i=0;i<600;i++){await wait(100);stopped=await snapshot();if(stopped.evidence.state?.state==='stopped'&&stopped.stage?.state==='stopped'&&stopped.evidence.csound?.outputContextState==='closed')break;if(i>0&&i%100===0)console.log('STOP_WAIT',i/10,JSON.stringify({status:stopped.status,stopDisabled:stopped.stopDisabled,paused:stopped.playerState?.paused}));}
 if(stopped?.evidence?.state?.state!=='stopped'||stopped.stage?.state!=='stopped'||stopped.stage?.runID!==runID||stopped.playerState?.paused!==true||stopped.evidence.csound?.outputContextState!=='closed')throw Error('Correlated Stop did not complete '+JSON.stringify(stopped));
 const stoppedCounts={ump:stopped.evidence.midi2.acceptedSoftwareUmpOperations,ear:stopped.evidence.csound.outputEarRmsWindows};
 await wait(1250);
 const quiet=await snapshot();
 if(quiet.evidence.state?.state!=='stopped'||quiet.evidence.midi2.acceptedSoftwareUmpOperations!==stoppedCounts.ump||quiet.evidence.csound.outputEarRmsWindows!==stoppedCounts.ear||quiet.evidence.csound.outputContextState!=='closed')throw Error('Post-stop UMP or Csound output continued '+JSON.stringify({stoppedCounts,quiet:quiet.evidence}));
 if(consoleErrors.length)throw Error('Browser errors: '+consoleErrors.slice(0,8).join(' | '));
 console.log('PASS_STAGED_SATZFUNKPLAYER_SCENARIO',JSON.stringify({origin:context.origin,runID,sourceSHA256:running.evidence.source.sha256,sourceBytes:running.evidence.source.bytes||5813335,acceptedSoftwareUmpOperations:running.evidence.midi2.acceptedSoftwareUmpOperations,lastOperation:op,csoundOutputEarRmsWindows:running.evidence.csound.outputEarRmsWindows,csoundOutputEarRms:running.evidence.csound.latestOutputEarRms,stage:running.stage,stopped:stopped.stage,postStopCountersStable:true,hardwareInteroperability:false,midiCi:running.evidence.midi2.midiCi,preparationState:before.evidence.state?.state}));
}finally{ws.close();await fetch(chrome+'/json/close/'+tab.id).catch(()=>{});}
