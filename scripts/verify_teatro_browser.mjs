const chrome='http://127.0.0.1:9237';
const base=process.env.TEATRO_BASE_URL||'http://127.0.0.1:8198';
const pause=n=>new Promise(r=>setTimeout(r,n));
async function open(path,width,height,label){
 const target=await(await fetch(chrome+'/json/new?about:blank',{method:'PUT'})).json();
 const ws=new WebSocket(target.webSocketDebuggerUrl);
 await new Promise((ok,no)=>{ws.addEventListener('open',ok,{once:true});ws.addEventListener('error',no,{once:true})});
 const awaiting=new Map();let id=0;const errors=[];
 ws.addEventListener('message',ev=>{
  const m=JSON.parse(ev.data);
  if(m.method==='Runtime.exceptionThrown')errors.push(m.params.exceptionDetails?.exception?.description||'JS exception');
  if(awaiting.has(m.id)){awaiting.get(m.id)(m);awaiting.delete(m.id)}
 });
 const cmd=(method,params={})=>new Promise(ok=>{const n=++id;awaiting.set(n,ok);ws.send(JSON.stringify({id:n,method,params}))});
 const evalJS=async expression=>{
  const v=await cmd('Runtime.evaluate',{expression,returnByValue:true,awaitPromise:true});
  if(v.result.exceptionDetails)throw Error(JSON.stringify(v.result.exceptionDetails));
  return v.result.result.value;
 };
 try{
  await cmd('Runtime.enable');await cmd('Page.enable');await cmd('Network.setCacheDisabled',{cacheDisabled:true});
  await cmd('Emulation.setDeviceMetricsOverride',{width,height,deviceScaleFactor:1,mobile:width<600});
  await cmd('Page.navigate',{url:base+path});
  if(path==='/editions/stage/'){
   for(let n=0;n<30;n++){await pause(280);if(await evalJS('document.querySelector("#root")?.children?.length>0'))break}
   const stage=await evalJS('({root:document.querySelector("#root")?.children.length,canvas:document.querySelectorAll("canvas").length,returnLink:document.querySelector("[data-teatro-stage-return] a")?.getAttribute("href"),minHeight:document.documentElement.scrollHeight})');
   if(!stage.root||stage.returnLink!=='/editions/first-hearing/')throw Error('Stage not mounted '+JSON.stringify(stage));
   console.log('PASSED STAGE',label,JSON.stringify(stage),'sound remains user-activated');
   return;
  }
  let state='waiting';
  for(let n=0;n<65;n++){await pause(240);state=await evalJS("document.body?.dataset.bookReady||'waiting'");if(state==='true'||state==='fallback')break}
  if(state!=='true')throw Error('Linotype not ready '+state+': '+await evalJS("document.body?.dataset.bookError||''")+': '+errors.join(';'));
  const shot="(() => {const sheet=document.querySelector('.linotype-stage .linotype-sheet')?.getBoundingClientRect();return {pages:Number(document.body.dataset.bookPageCount),mode:document.body.dataset.bookMode,folio:document.getElementById('book-page-count').textContent,images:document.querySelectorAll('#book-flow img').length,chapters:document.querySelectorAll('[data-book-chapter]').length,overflowX:document.documentElement.scrollWidth>innerWidth+1,overflowY:document.documentElement.scrollHeight>innerHeight+1,sheet:sheet?.toJSON(),stageLink:document.querySelector('.teatro-stage-link')?.getAttribute('href')}})()";
  const first=await evalJS(shot);
  if(first.pages<7||first.pages>100||first.mode!==(width>=900?'spread':'single')||first.images!==2||first.chapters!==1||first.overflowX||first.overflowY||first.stageLink!=='#book-live-stage')
   throw Error('Bad book viewport '+JSON.stringify(first));
  // Page turn must reach the real compiled renderer inside the paper.
  await evalJS("document.querySelector('[data-teatro-scene-link]').click()");
  let interactiveState='inactive';
  for(let n=0;n<40;n++){
   await pause(250);
   interactiveState=await evalJS("document.body.dataset.teatroScene");
   if(interactiveState==='active')break;
  }
  if(interactiveState!=='active')throw Error('Teatro scene leaf did not activate: '+interactiveState);
  let scene=null;
  for(let n=0;n<50;n++){
   await pause(270);
   scene=await evalJS("(()=>{const frame=document.querySelector('iframe[data-teatro-live-frame]');const doc=frame?.contentDocument;return {count:document.querySelectorAll('iframe[data-teatro-live-frame]').length,ready:Boolean(doc?.querySelector('#teatro-stage-scene')),webgl:Boolean(doc?.querySelector('canvas')),animatedFallback:Boolean(doc?.querySelector('svg .wind-line')),parent:frame?.closest('.linotype-sheet')?.dataset.sourceId,width:frame?.getBoundingClientRect().width,height:frame?.getBoundingClientRect().height,svgHeight:doc?.querySelector('#teatro-stage-scene svg')?.getBoundingClientRect().height,svgViewBox:doc?.querySelector('#teatro-stage-scene svg')?.getAttribute('viewBox'),hudClipped:doc?.querySelector('#root [role=status]')?.style ? getComputedStyle(doc.querySelector('#root [role=status]')).clipPath.includes('inset(50%)') : false}})()");
   if(scene?.ready)break;
  }
  if(!scene?.ready||scene.count!==1||scene.width<100||scene.height<140||scene.height>240||(!scene.webgl&&!scene.animatedFallback))
   throw Error('No animated Teatro runtime inside book page '+JSON.stringify(scene));
  const composition=await evalJS("(()=>{const figure=document.querySelector('.linotype-stage [data-press-media]');const para=figure?.previousElementSibling;const leaf=figure?.closest('.linotype-sheet');const rect=figure?.getBoundingClientRect();const paper=leaf?.getBoundingClientRect();const area=figure?.closest('.linotype-area');return {imprint:leaf?.querySelector('.linotype-folio span')?.textContent,sourceText:para?.textContent,sourceDigest:figure?.dataset.sourceParagraphSha256,scene:figure?.dataset.sceneId,elementCount:document.querySelectorAll('.linotype-stage [data-press-media]').length,ratio:rect&&paper?rect.height/paper.height:1,marginLeft:rect&&paper?rect.left-paper.left:null,paperHeight:paper?.height,paragraphSameArea:para?.parentElement===area,overflow:area?area.scrollHeight>area.clientHeight+2:false}})()");
  if(composition.imprint!=='TEATRO · FOUNTAIN COACH'||composition.elementCount!==1||
      composition.paragraphSameArea!==true||!composition.sourceText?.includes('Attention changes it.')||
      composition.ratio>=.45||composition.ratio<=.1||composition.overflow)
      throw Error('R12 mixed media composition invalid '+JSON.stringify(composition));
  console.log('PASSED R12 COMPOSITION',label,JSON.stringify(composition));
  if(scene.animatedFallback&&
      (!scene.hudClipped||Math.abs(scene.svgHeight-scene.height)>2||scene.svgViewBox!=='0 0 800 710'))
      throw Error('R12 fallback diagnostics or geometry leak '+JSON.stringify(scene));
  console.log('PASSED EMBED',label,JSON.stringify(scene));
  await evalJS("document.getElementById('book-next').click()");
  await pause(500);
  const released=await evalJS("({state:document.body.dataset.teatroScene,frames:document.querySelectorAll('iframe[data-teatro-live-frame]').length})");
  if(released.state!=='inactive'||released.frames!==0)throw Error('Teatro runtime leaked past page turn '+JSON.stringify(released));
  const hearing=await evalJS('(()=>{document.getElementById("satzfunk-hear").click();return {hidden:document.getElementById("satzfunk-hearing-rail").hidden,expanded:document.getElementById("satzfunk-hear").getAttribute("aria-expanded")}})()');
  if(hearing.hidden||hearing.expanded!=='true')throw Error('Hearing rail did not open');
  for(let n=0;n<20;n++){await pause(140);if((await evalJS("document.getElementById('satzfunk-hearing-status').textContent")).includes('No author-approved'))break}
  const message=await evalJS("document.getElementById('satzfunk-hearing-status').textContent");
  if(!message.includes('No author-approved spoken edition'))throw Error('Audio falsely released '+message);
  if(await evalJS("document.querySelectorAll('#satzfunk-hearing-tracks audio').length"))throw Error('Unapproved audio mounted');
  await evalJS("document.getElementById('satzfunk-close').click()");
  const before=await evalJS("document.getElementById('book-page-count').textContent");
  await evalJS("(document.getElementById('book-next').disabled?document.getElementById('book-prev'):document.getElementById('book-next')).click()");
  await pause(150);
  const after=await evalJS("document.getElementById('book-page-count').textContent");
  if(before===after)throw Error('Page turn did not advance');
  await evalJS("document.getElementById('book-toc-button').click()");
  if(!await evalJS("document.getElementById('book-contents').open"))throw Error('Contents did not open');
  if(errors.length)throw Error('JS errors: '+errors.join(';'));
  console.log('PASSED BOOK',label,first.pages+' pages',first.mode,'Hear truthful, page turn and Contents');
 }finally{ws.close();await fetch(chrome+'/json/close/'+target.id).catch(()=>{})}
}
for(const [label,width,height] of [['iPad landscape',1180,820],['iPad portrait',820,1180],['phone portrait',390,844],['desktop',1366,900]]){
 try{await open('/',width,height,label)}catch(e){console.error('FAILED',label,String(e));process.exitCode=1}
}
try{await open('/editions/stage/',820,1180,'iPad portrait')}catch(e){console.error('FAILED STAGE',String(e));process.exitCode=1}
