/* Browser-pointer/visual geometry regression. Fail v31's inherited paper leaf. */
import fs from 'node:fs';
const chrome='http://127.0.0.1:9237';
const root=process.env.ESTATE_BASE_URL||'http://127.0.0.1:8298/';
const readerOrigin=process.env.TEATRO_BASE_URL||'http://127.0.0.1:8298/';
const trace='teatro:unfinished-composition:empty-chair-attention';
const sleep=n=>new Promise(r=>setTimeout(r,n));
async function session(label,width,height) {
 const tab=await (await fetch(chrome+'/json/new?about:blank',{method:'PUT'})).json();
 const ws=new WebSocket(tab.webSocketDebuggerUrl);await new Promise((resolve,reject)=>{ws.addEventListener('open',resolve,{once:true});ws.addEventListener('error',reject,{once:true})});
 let serial=0;const awaiters=new Map(),exceptions=[];
 ws.addEventListener('message',e=>{const m=JSON.parse(e.data);if(m.method==='Runtime.exceptionThrown')exceptions.push(m.params.exceptionDetails?.text);if(awaiters.has(m.id)){awaiters.get(m.id)(m);awaiters.delete(m.id)}});
 const cmd=(method,params={})=>new Promise(done=>{const id=++serial;awaiters.set(id,done);ws.send(JSON.stringify({id,method,params}))});
 const js=async expression=>{const m=await cmd('Runtime.evaluate',{expression,awaitPromise:true,returnByValue:true});if(m.result.exceptionDetails)throw Error(JSON.stringify(m.result.exceptionDetails));return m.result.result.value};
 const wait=async expression=>{for(let i=0;i<70;i++){if(await js(expression))return;await sleep(140)}throw Error('Timeout '+expression)};
 const shot=async filename=>{const m=await cmd('Page.captureScreenshot',{format:'png',captureBeyondViewport:false});fs.writeFileSync(filename,Buffer.from(m.result.data,'base64'))};
 const click=async selector=>{const rect=await js('document.querySelector('+JSON.stringify(selector)+')?.getBoundingClientRect().toJSON()');if(!rect||rect.width<10||rect.height<10)throw Error('No clickable '+selector+' '+JSON.stringify(rect)+' '+await js('({body:document.body.className,html:document.querySelector("[data-preview-host=teatro]")?.outerHTML})')); let x=rect.x+rect.width*.5,y=rect.y+rect.height*.5;await cmd('Input.dispatchMouseEvent',{type:'mousePressed',x,y,button:'left',clickCount:1});await cmd('Input.dispatchMouseEvent',{type:'mouseReleased',x,y,button:'left',clickCount:1})};
 const portrait=width<900;
 try {
  await cmd('Runtime.enable');await cmd('Page.enable');await cmd('Network.setCacheDisabled',{cacheDisabled:true});await cmd('Emulation.setDeviceMetricsOverride',{width,height,deviceScaleFactor:1,mobile:width<600});
  await cmd('Page.navigate',{url:root});await wait('document.querySelectorAll(".shelf-book").length===3');
  await wait('document.querySelector("[data-preview-host=teatro]")?.getBoundingClientRect().width>20');await js('document.querySelector("[data-preview-host=teatro]").scrollIntoView({block:"center"})');await sleep(420);
  await click('[data-preview-host=teatro]');
  await wait('location.pathname==="/editions/first-hearing/" && document.body?.dataset.bookReady==="true"');await sleep(120);
  const visual=await js(`(()=>{const entry=document.querySelector('#teatro-score'),photo=entry?.querySelector('img'),p=photo?.getBoundingClientRect(),r=entry?.getBoundingClientRect(),page=document.querySelector('.linotype-stage .linotype-sheet'),f=document.querySelector('.book-pagination'),viewport=document.querySelector('.book-viewport');return {state:document.body.dataset.editorialState||null,entryParent:entry?.parentElement?.id||null,entryDisplay:entry?getComputedStyle(entry).display:null,scoreWidth:p?.width||0,scoreHeight:p?.height||0,scoreRatio:p?Number((p.width/innerWidth).toFixed(2)):0,scoreArea:r?.toJSON()||null,sheetVisible:!!page&&page.getClientRects().length>0,folioVisible:!!f&&f.getClientRects().length>0,photoLoaded:photo?.complete&&photo.naturalWidth>0,chosenArtwork:photo?.getAttribute('src')||null,visibleScoreCount:[...document.querySelectorAll('img[src*="teatro-score-memory-vector"]')].filter(x=>!!x.getClientRects().length).length,overflowX:document.documentElement.scrollWidth>innerWidth+1,overflowY:document.documentElement.scrollHeight>innerHeight+1,hash:decodeURIComponent(location.hash.slice(1))}})()`);
  await shot('/tmp/teatro-'+(process.env.SNAPSHOT_TAG||'candidate')+'-'+label.replaceAll(' ','-')+'.png');
  console.log('SCORE_VISUAL_METRICS',label,JSON.stringify(visual));
  if(visual.state!=='score'||visual.entryParent!=='book-pages'||!visual.photoLoaded||visual.scoreRatio<(portrait?.72:.54)||visual.sheetVisible||visual.folioVisible||visual.overflowX||visual.hash||visual.visibleScoreCount!==1)throw Error('INHERITED_BOOK_PAGE_NOT_SEMANTIC_ENTRY '+JSON.stringify(visual));
  const hot=await js(`(()=>{const a=document.querySelector('#teatro-score .teatro-score-hotspot'),i=document.querySelector('#teatro-score img'),r=a.getBoundingClientRect(),p=i.getBoundingClientRect();return {ratio:(r.left+r.width/2-p.left)/p.width,height:r.height,accessible:a.getAttribute('aria-label'),tabIndex:a.tabIndex}})()`);
  if(hot.ratio<.67||hot.ratio>.85||hot.height<44||!hot.accessible?.includes('Attention')||hot.tabIndex!==0)throw Error('SCORE_HOTSPOT_UNTRUSTWORTHY '+JSON.stringify(hot));
  await click('#teatro-score .teatro-score-hotspot');await wait('document.body.dataset.editorialState==="reading" && decodeURIComponent(location.hash.slice(1)).includes("empty-chair-attention")');
  let moved=await js(`(()=>{const source=document.querySelector('.linotype-stage [data-score-trace-id]'),returnLink=document.querySelector('.linotype-stage [data-score-return]'),reader=document.querySelector('.book-viewport');return {source:source?.textContent,hasReturn:!!returnLink,readerVisible:getComputedStyle(reader).display!=='none',portalHidden:document.getElementById('teatro-score').getClientRects().length===0,url:decodeURIComponent(location.hash.slice(1))}})()`);
  if(!moved.readerVisible||!moved.portalHidden||!moved.hasReturn||!moved.source?.includes('Put an empty chair'))throw Error('TRACE_NOT_IN_READER '+JSON.stringify(moved));
  await click('.linotype-stage [data-score-return]');await wait('document.body.dataset.editorialState==="score" && location.hash==="#teatro-score"');
  await js("document.querySelector('#teatro-score .teatro-score-navigation [data-score-trace-link]').focus()");
  if(!(await js("document.activeElement?.hasAttribute('data-score-trace-link')")))throw Error('SCORE_LINK_KEYBOARD_FOCUS_MISSING');
  await cmd('Input.dispatchKeyEvent',{type:'keyDown',key:'Enter',code:'Enter',windowsVirtualKeyCode:13,nativeVirtualKeyCode:13});
  await cmd('Input.dispatchKeyEvent',{type:'keyUp',key:'Enter',code:'Enter',windowsVirtualKeyCode:13,nativeVirtualKeyCode:13});
  await wait('document.body.dataset.editorialState==="reading" && decodeURIComponent(location.hash.slice(1)).includes("empty-chair-attention")');
  await js('history.back()');await wait('document.body.dataset.editorialState==="score" && location.hash==="#teatro-score"');
  await cmd('Page.navigate',{url:new URL('/editions/first-hearing/#'+encodeURIComponent(trace),readerOrigin).href});await wait('document.body?.dataset.bookReady==="true"');
  if(await js('document.body.dataset.editorialState')!=='reading')throw Error('DIRECT_TRACE_LINK_INVALID');
  await cmd('Page.navigate',{url:new URL('/editions/first-hearing/#teatro:unmapped',readerOrigin).href});await wait('document.body?.dataset.bookReady==="true"');
  if(await js('document.body.dataset.editorialState')!=='score'||await js('document.body.dataset.navigationFailure')!=='unresolved-trace')throw Error('MISSING_TRACE_NOT_REFUSED');
  console.log('SCORE_IDENTITY_E2E',label,'PASS',JSON.stringify({scoreWidth:visual.scoreWidth,scoreRatio:visual.scoreRatio,physicalPage:false,folio:false,region:hot.ratio,focus:true,keyboard:true,history:true,return:true,deepLink:true,missingDenied:true}));
 }finally{ws.close();await fetch(chrome+'/json/close/'+tab.id).catch(()=>{})}
}
for(const v of [['iPad portrait',820,1180],['iPad landscape',1180,820],['desktop',1366,768],['phone',390,844]])await session(...v);
