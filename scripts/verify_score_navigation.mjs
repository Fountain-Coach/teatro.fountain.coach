/* Score -> source trace -> Score. Browser proof over real compiled Linotype pages. */
import fs from 'node:fs';
const BASE=process.env.TEATRO_BASE_URL||'http://127.0.0.1:8298';
const TRACE='teatro:unfinished-composition:empty-chair-attention';
const SCORE='teatro-score';
const CHROME='http://127.0.0.1:9237';
const pause=ms=>new Promise(resolve=>setTimeout(resolve,ms));
const source=JSON.parse(fs.readFileSync(new URL('./score-navigation.json',import.meta.url),'utf8'));
if(source.traces.length!==1||source.traces[0].id!==TRACE)throw Error('No authoritative admitted trace');
async function open(label,w,h){
 const target=await(await fetch(CHROME+'/json/new?about:blank',{method:'PUT'})).json();
 const ws=new WebSocket(target.webSocketDebuggerUrl);
 await new Promise((resolve,reject)=>{ws.addEventListener('open',resolve,{once:true});ws.addEventListener('error',reject,{once:true})});
 let count=0;const pending=new Map();const errors=[];
 ws.addEventListener('message',ev=>{const m=JSON.parse(ev.data);if(m.method==='Runtime.exceptionThrown')errors.push(m.params.exceptionDetails?.text);if(pending.has(m.id)){pending.get(m.id)(m);pending.delete(m.id)}});
 const command=(method,params={})=>new Promise(done=>{const id=++count;pending.set(id,done);ws.send(JSON.stringify({id,method,params}))});
 const evaluate=async expression=>{const m=await command('Runtime.evaluate',{expression,returnByValue:true,awaitPromise:true});if(m.result.exceptionDetails)throw Error('Evaluation exception '+JSON.stringify(m.result.exceptionDetails));return m.result.result.value};
 const awaitReady=async()=>{let state='';for(let i=0;i<50;i++){await pause(120);state=await evaluate("document.body?.dataset.bookReady||'loading'");if(state==='true'||state==='fallback')break}if(state!=='true')throw Error('Pagination '+state+' '+await evaluate('document.body?.dataset.bookError'));};
 const navigate=async path=>{await command('Page.navigate',{url:BASE+path});await awaitReady()};
 const snapshot=()=>evaluate(`(()=>{const active=document.querySelector('.linotype-stage'),sheet=active?.querySelector('.linotype-sheet'),image=active?.querySelector('img[src="/assets/edition/teatro-score-memory-vector-human-condition.svg"]'),traces=[...active?.querySelectorAll('[data-score-trace-id]')||[]];return {firstType:sheet?.className||null,firstSource:sheet?.dataset.sourceId,scoreVisible:!!image,scoreLoaded:!!image?.naturalWidth,scoreNaturalWidth:image?.naturalWidth,scoreCount:document.querySelectorAll('#book-flow .book-score').length,coverCount:document.querySelectorAll('#book-flow .book-cover').length,imageCount:document.querySelectorAll('#book-flow img[src="/assets/edition/teatro-score-memory-vector-human-condition.svg"]').length,traceCount:traces.length,traceText:traces.map(p=>p.textContent),returnLink:!!active?.querySelector('[data-score-return]'),url:decodeURIComponent(location.hash.slice(1)),failure:document.body.dataset.navigationFailure||null,status:document.querySelector('.linotype-stage #book-navigation-status')?.textContent,folio:document.getElementById('book-page-count')?.textContent,loc:document.getElementById('book-location')?.textContent,atlas:document.querySelector('#book-atlas-grid button')?.getAttribute('aria-label')}})()`);
 const click=async selector=>{const rect=await evaluate('document.querySelector('+JSON.stringify(selector)+')?.getBoundingClientRect().toJSON()');if(!rect||rect.width<8||rect.height<8)throw Error('No clickable target '+selector);const x=rect.x+rect.width/2,y=rect.y+rect.height/2;await command('Input.dispatchMouseEvent',{type:'mousePressed',x,y,button:'left',clickCount:1});await command('Input.dispatchMouseEvent',{type:'mouseReleased',x,y,button:'left',clickCount:1});};
 try{
  await command('Runtime.enable');await command('Page.enable');await command('Network.setCacheDisabled',{cacheDisabled:true});
  await command('Emulation.setDeviceMetricsOverride',{width:w,height:h,deviceScaleFactor:1,mobile:w<600});
  await navigate('/editions/first-hearing/');
  let s=await snapshot();
  if(!s.firstType.includes('linotype-score')||s.firstSource!==SCORE||!s.scoreVisible||!s.scoreLoaded||s.scoreNaturalWidth<200||s.scoreCount!==1||s.coverCount!==0||s.imageCount!==1||s.url||s.failure)throw Error('Score not first authored leaf '+label+' '+JSON.stringify(s));
  if(w<600&&s.atlas&&!s.atlas.includes('Teatro Score'))throw Error('Atlas labels Score as unrelated book '+JSON.stringify(s));
  if(label==='iPad portrait'){
    const m=await command('Page.captureScreenshot',{format:'png',captureBeyondViewport:false});
    if(m.result.data)fs.writeFileSync('/tmp/teatro-score-first-ipad.png',Buffer.from(m.result.data,'base64'));
  }
  const selector='.linotype-stage .teatro-score-navigation [data-score-trace-link]';
  await click(selector);await pause(200);
  s=await snapshot();
  if(s.url!==TRACE||!s.traceCount||!s.traceText.some(t=>t.includes('Put an empty chair'))||!s.returnLink||s.failure)throw Error('Trace link did not resolve to source '+label+' '+JSON.stringify(s));
  // The actual return control, not only browser Back, is a reciprocal edge.
  await click('.linotype-stage [data-score-return]');await pause(180);
  s=await snapshot();
  if(s.firstSource!==SCORE||s.url!==SCORE||!s.scoreVisible)throw Error('Return-to-Score control failed '+label+' '+JSON.stringify(s));
  await click(selector);await pause(180);
  s=await snapshot();
  if(s.url!==TRACE||!s.traceCount)throw Error('Revisiting the same trace drifted '+label+' '+JSON.stringify(s));
  const before=s.folio;
  // Forced re-layout across breakpoints must keep the trace, not the folio.
  await command('Emulation.setDeviceMetricsOverride',{width:w<700?820:390,height:w<700?1180:844,deviceScaleFactor:1,mobile:w>=700});
  await pause(670);
  s=await snapshot();
  if(s.url!==TRACE||!s.traceCount||s.failure)throw Error('Trace changed across pagination '+label+' '+JSON.stringify(s));
  await evaluate('history.back()');await pause(320);
  s=await snapshot();
  if(s.firstSource!==SCORE||!s.scoreVisible||s.url!==SCORE)throw Error('Browser Back did not return to Score '+label+' '+JSON.stringify(s));
  await navigate('/editions/first-hearing/#'+encodeURIComponent(TRACE));
  s=await snapshot();
  if(s.url!==TRACE||!s.traceCount||s.failure)throw Error('Direct deep link did not resolve '+label+' '+JSON.stringify(s));
  await navigate('/editions/first-hearing/#'+encodeURIComponent('teatro:unknown-trace'));
  s=await snapshot();
  if(s.firstSource!==SCORE||s.failure!=='unresolved-trace'||!s.status?.includes('unavailable'))throw Error('Unknown trace silently substituted '+label+' '+JSON.stringify(s));
  console.log('SCORE_TRACE_NAVIGATION_ACCEPTED',label,JSON.stringify({score:'first',movement:'06',trace:TRACE,return:'browser-back',deepLink:'resolved',stale:'refused',initialFolio:before,finalFolio:s.folio,sourceSHA256:source.sourceSHA256}));
 }finally{
  ws.close();await fetch(CHROME+'/json/close/'+target.id).catch(()=>{});
 }
}
for(const [label,w,h] of [['iPad portrait',820,1180],['iPad landscape',1180,820],['phone portrait',390,844],['desktop',1366,768]])await open(label,w,h);
