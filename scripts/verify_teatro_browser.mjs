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
 const userClick=async selector=>{
  const rect=await evalJS("document.querySelector("+JSON.stringify(selector)+")?.getBoundingClientRect().toJSON()");
  if(!rect||rect.width<5||rect.height<5)throw Error('Cannot activate visible UI '+selector);
  const x=rect.x+rect.width/2,y=rect.y+rect.height/2;
  await cmd('Input.dispatchMouseEvent',{type:'mousePressed',x,y,button:'left',clickCount:1});
  await cmd('Input.dispatchMouseEvent',{type:'mouseReleased',x,y,button:'left',clickCount:1});
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
  const shot="(() => {const sheet=document.querySelector('.linotype-stage .linotype-sheet')?.getBoundingClientRect();return {pages:Number(document.body.dataset.bookPageCount),mode:document.body.dataset.bookMode,folio:document.getElementById('book-page-count').textContent,images:document.querySelectorAll('#book-flow img').length,chapters:document.querySelectorAll('[data-book-chapter]').length,overflowX:document.documentElement.scrollWidth>innerWidth+1,overflowY:document.documentElement.scrollHeight>innerHeight+1,sheet:sheet?.toJSON(),player:!!document.getElementById('book-media-toggle'),oldScene:!!document.querySelector('.teatro-stage-link'),oldHearing:!!document.getElementById('satzfunk-hearing-rail')}})()";
  const first=await evalJS(shot);
  const bookFurniture=await evalJS("(()=>{const header=document.querySelector('.book-toolbar'),footer=document.querySelector('.book-pagination'),tools=document.querySelector('.book-tools'),player=document.querySelector('#book-media-toggle'),scene=document.querySelector('#book-flow [data-teatro-scene-play] img');const h=header?.getBoundingClientRect(),t=tools?.getBoundingClientRect(),f=footer?.getBoundingClientRect();return {header:header?.classList.contains('book-reading-controls'),footer:footer?.classList.contains('book-reading-pagination'),externalHeaderLinks:header?.querySelectorAll('a').length,externalFooterLinks:footer?.querySelectorAll('a').length,websiteLabels:!!document.querySelector('.book-back,.edition-rail,.book-legal'),appearance:!!document.querySelector('#book-type-button,#book-appearance,#book-font-value'),playerLeft:player&&h?player.getBoundingClientRect().left-h.left:999,tocRight:header.querySelector('#book-toc-button')&&h?h.right-header.querySelector('#book-toc-button').getBoundingClientRect().right:999,discloseBeside:!!header.querySelector('#book-media-settings'),earLogo:!!header.querySelector('.book-ear-icon svg'),oldBars:!!header.querySelector('.book-ear-meter'),pagination:!!footer.querySelector('#book-prev,#book-next,#book-page-count'),stageIconSrc:scene?.getAttribute('src'),stageIconCss:scene?getComputedStyle(scene).width:null}})()");
  if(!bookFurniture.header||!bookFurniture.footer||bookFurniture.externalHeaderLinks||
     bookFurniture.externalFooterLinks||bookFurniture.websiteLabels||bookFurniture.appearance||
     bookFurniture.playerLeft<0||bookFurniture.playerLeft>55||
     bookFurniture.tocRight<0||bookFurniture.tocRight>55||
     !bookFurniture.discloseBeside||!bookFurniture.earLogo||bookFurniture.oldBars||
     !bookFurniture.pagination||
     bookFurniture.stageIconSrc!=='/assets/teatro-play.svg')
     throw Error('R14 book-only centered navigation invalid '+JSON.stringify(bookFurniture));
  console.log('PASSED R14 BOOK FURNITURE',label,JSON.stringify(bookFurniture));
  if(first.pages<7||first.pages>100||first.mode!==(width>=900?'spread':'single')||first.images!==2||first.chapters!==1||first.overflowX||first.overflowY||!first.player||first.oldScene||first.oldHearing)
   throw Error('Bad book viewport '+JSON.stringify(first));
  // Mobile atlas shows a bounded source-derived map: never giant wrapping
  // chapter text or an interactive clone of the full authored page.
  if(width<600||(width<=950&&height<=650)){
   const atlas=await evalJS("(()=>{const pages=[...document.querySelectorAll('#book-atlas-grid .book-atlas-page')];return {count:pages.length,titles:document.querySelectorAll('#book-atlas-grid .book-atlas-title').length,clones:document.querySelectorAll('#book-atlas-grid .book-atlas-miniature').length,identities:document.querySelectorAll('#book-atlas-grid .book-atlas-identity').length,kinds:pages.map(p=>p.dataset.atlasKind),labels:pages.map(p=>p.getAttribute('aria-label')),maxOverflow:pages.some(p=>p.scrollWidth>p.clientWidth+2)}})()");
   if(atlas.count<2||atlas.titles||atlas.clones||atlas.identities!==atlas.count||
      atlas.labels.some(label=>!label?.includes('Read page'))||atlas.maxOverflow)
      throw Error('R13 mobile atlas identities invalid '+JSON.stringify(atlas));
   console.log('PASSED R13 MOBILE ATLAS',label,JSON.stringify(atlas));
  }
  // Page turn must reach the real compiled renderer inside the paper.
  await evalJS("window.dispatchEvent(new CustomEvent('fountain:book:seek',{detail:{mediaId:'book-live-stage'}}))");
  for(let n=0;n<20;n++){
    if(await evalJS("document.body.dataset.teatroScene==='ready'"))break;
    await pause(100);
  }
  const playerLoad=await evalJS("({bus:!!window.FountainBookMidi2,transport:document.getElementById('book-media-control')?.dataset.player,ready:document.body.dataset.teatroScene})");
  console.log('R15 PLAYER LOAD',label,playerLoad);
  const idleScene=await evalJS("(()=>{const b=document.querySelector('.linotype-stage [data-teatro-scene-play]');const poster=b?.querySelector('img');return {ready:document.body.dataset.teatroScene,playButton:!!b,visible:b?!b.hidden:false,poster:poster?.getAttribute('src'),iframes:document.querySelectorAll('iframe[data-teatro-live-frame]').length}})()");
  const idleIcon=await evalJS("(()=>{const button=document.querySelector('.linotype-stage [data-teatro-scene-play]'),icon=button?.querySelector('img'),paper=button?.closest('.linotype-sheet');return {iconWidth:icon?.getBoundingClientRect().width,iconHeight:icon?.getBoundingClientRect().height,paperWidth:paper?.getBoundingClientRect().width}})()");
  if(!idleIcon.iconWidth||idleIcon.iconWidth>42||idleIcon.iconWidth<(height<650?12:18)||
      idleIcon.iconWidth>idleIcon.paperWidth*.17)
    throw Error('Play triangle disproportionate to paper '+JSON.stringify(idleIcon));
  console.log('PASSED R14 BALANCED PLAY',label,JSON.stringify(idleIcon));
  if(idleScene.ready!=='ready'||!idleScene.playButton||!idleScene.visible||
     idleScene.poster!=='/assets/teatro-play.svg'||idleScene.iframes)
      throw Error('R13 idle scene must show a real play triangle '+JSON.stringify(idleScene));
  // The page's Play is a real audio request, not a silent stage-entry.
  await userClick('.linotype-stage [data-teatro-scene-play]');
  let audible=null;
  for(let n=0;n<55;n++){
    await pause(120);
    audible=await evalJS("(()=>{const c=document.getElementById('book-media-control'),i=c.querySelector('.book-ear-icon');return {mode:c.dataset.player,ear:c.dataset.ear,rms:Number(c.dataset.earRms||0),scale:parseFloat(i?.style.getPropertyValue('--ear-scale'))||0,aria:i?.getAttribute('aria-label'),pressed:document.getElementById('book-media-toggle')?.getAttribute('aria-pressed')}})()");
    if(['preview','csound'].includes(audible?.mode)&&audible?.ear==='witnessed')break;
  }
  if(!['preview','csound'].includes(audible?.mode)||audible.ear!=='witnessed'||
      audible.rms<=0.0001||audible.scale<=.84||audible.scale>=1.221||
      audible.pressed!=='true')
    throw Error('R15 page Play did not start measured sound/Ear '+JSON.stringify(audible));
  console.log('PASSED R15 PAGE TO AUDIO',label,JSON.stringify(audible));
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
   scene=await evalJS("(()=>{const frame=document.querySelector('iframe[data-teatro-live-frame]');const doc=frame?.contentDocument;return {count:document.querySelectorAll('iframe[data-teatro-live-frame]').length,ready:Boolean(doc?.querySelector('#teatro-stage-scene')),webgl:Boolean(doc?.querySelector('canvas')),animatedFallback:Boolean(doc?.querySelector('svg .wind-line')),parent:frame?.closest('.linotype-sheet')?.dataset.sourceId,width:frame?.getBoundingClientRect().width,height:frame?.getBoundingClientRect().height,svgHeight:doc?.querySelector('#teatro-stage-scene svg')?.getBoundingClientRect().height,svgViewBox:doc?.querySelector('#teatro-stage-scene svg')?.getAttribute('viewBox'),hudClipped:!doc?.querySelector('#root [role=status]')||getComputedStyle(doc.querySelector('#root [role=status]')).clipPath.includes('inset(50%)')}})()");
   if(scene?.ready)break;
  }
  if(!scene?.ready||scene.count!==1||scene.width<100||scene.height<(height<650?95:140)||scene.height>240||(!scene.webgl&&!scene.animatedFallback))
   throw Error('No animated Teatro runtime inside book page '+JSON.stringify(scene));
  const composition=await evalJS("(()=>{const figure=document.querySelector('.linotype-stage [data-press-media]');const para=figure?.previousElementSibling;const leaf=figure?.closest('.linotype-sheet');const rect=figure?.getBoundingClientRect();const paper=leaf?.getBoundingClientRect();const area=figure?.closest('.linotype-area');return {imprint:leaf?.querySelector('.linotype-folio span')?.textContent,sourceText:para?.textContent,sourceDigest:figure?.dataset.sourceParagraphSha256,scene:figure?.dataset.sceneId,elementCount:document.querySelectorAll('.linotype-stage [data-press-media]').length,ratio:rect&&paper?rect.height/paper.height:1,marginLeft:rect&&paper?rect.left-paper.left:null,paperHeight:paper?.height,paragraphSameArea:para?.parentElement===area,overflow:area?area.scrollHeight>area.clientHeight+2:false}})()");
  if(composition.imprint!=='TEATRO · FOUNTAIN COACH'||composition.elementCount!==1||
      composition.paragraphSameArea!==true||!composition.sourceText?.includes('Attention changes it.')||
      composition.ratio>=.45||composition.ratio<=.1||composition.overflow)
      throw Error('R12 mixed media composition invalid '+JSON.stringify(composition));
  console.log('PASSED R12 COMPOSITION',label,JSON.stringify(composition));
  if(scene.animatedFallback){
    // The original SVG initializes at 800×600 and the admitted book
    // projection expands it to 800×710 asynchronously after its first
    // DOM mutation. Wait for that settled viewport, do not sample midway.
    for(let i=0;i<18&&scene.svgViewBox!=='0 0 800 710';i++){
      await pause(80);
      scene.svgViewBox=await evalJS("document.querySelector('iframe[data-teatro-live-frame]')?.contentDocument?.querySelector('#teatro-stage-scene > svg')?.getAttribute('viewBox')");
    }
    if(!scene.hudClipped||scene.svgViewBox!=='0 0 800 710')
      throw Error('R12 fallback diagnostics or geometry leak '+JSON.stringify(scene));
  }
  if(!scene.webgl){
   let puppet=null;
   for(let n=0;n<35;n++){
    await pause(180);
    puppet=await evalJS("(()=>{const d=document.querySelector('iframe[data-teatro-live-frame]')?.contentDocument;const rig=d?.querySelector('svg[data-teatro-puppet-rig=live]');const lines=rig?.querySelectorAll('line');return {active:d?.documentElement.dataset.teatroPuppetFallback,rig:!!rig,stringsAndBar:lines?.length,barX:lines?.[3]?.getAttribute('x1'),headX:rig?.querySelector('circle')?.getAttribute('cx'),visible:rig ? getComputedStyle(rig).display!=='none' : false}})()");
    if(puppet?.rig)break;
   }
   if(!puppet?.visible||puppet.active!=='active'||puppet.stringsAndBar<4)
    throw Error('Teatro fallback omitted real animated puppet '+JSON.stringify(puppet));
   await pause(700);
   const later=await evalJS("(()=>{const svg=document.querySelector('iframe[data-teatro-live-frame]')?.contentDocument?.querySelector('svg[data-teatro-puppet-rig=live]');return svg?.querySelectorAll('line')?.[3]?.getAttribute('x1')})()");
   if(later===null||Math.abs(Number(later)-Number(puppet.barX))<.15)
    throw Error('Puppet physics state did not animate '+JSON.stringify({start:puppet.barX,end:later}));
   const dimensions=await evalJS("(()=>{const d=document.querySelector('iframe[data-teatro-live-frame]')?.contentDocument;const rig=d?.querySelector('svg[data-teatro-puppet-rig=live]');const empty=d?.querySelector('#teatro-stage-scene > svg');const frame=document.querySelector('iframe[data-teatro-live-frame]');return {rigHeight:rig?.getBoundingClientRect().height,rigWidth:rig?.getBoundingClientRect().width,frameHeight:frame?.clientHeight,frameWidth:frame?.clientWidth,oldRoomHidden:empty?getComputedStyle(empty).visibility==='hidden':true}})()");
   if(!dimensions.oldRoomHidden||!dimensions.rigHeight||dimensions.rigHeight>dimensions.frameHeight+3||
      dimensions.rigWidth>dimensions.frameWidth+3)
      throw Error('Mobile spatial score overflow '+JSON.stringify(dimensions));
   console.log('PASSED R12 PUPPET MOTION',label,JSON.stringify({rig:'canonical StageEngine/StageView',stringsAndBar:puppet.stringsAndBar,barFrom:puppet.barX,barTo:later}));
  }
  console.log('PASSED EMBED',label,JSON.stringify(scene));
  // Top-level pause must stop audio and reset the embedded scene/Play.
  await userClick('#book-media-toggle');
  let stopped=null;
  for(let n=0;n<35;n++){
   await pause(100);
   stopped=await evalJS("(()=>{const c=document.getElementById('book-media-control');return {mode:c.dataset.player,scene:document.body.dataset.teatroScene,frames:document.querySelectorAll('iframe[data-teatro-live-frame]').length,iconScale:document.querySelector('.book-ear-icon')?.style.getPropertyValue('--ear-scale'),pagePlay:!!document.querySelector('.linotype-stage [data-teatro-scene-play]:not([hidden])')}})()");
   if(stopped?.mode==='stopped'&&stopped?.frames===0&&stopped.pagePlay)break;
  }
  if(stopped?.mode!=='stopped'||stopped.frames!==0||!stopped.pagePlay||stopped.iconScale!=='.84')
   throw Error('R15 top Pause did not stop audio and release stage '+JSON.stringify(stopped));
  // Vice versa: starting at the header while on the scene leaf mounts the
  // same real puppet and the same actual Ear-analyzed sound.
  await userClick('#book-media-toggle');
  let topStarted=null;
  for(let n=0;n<65;n++){
   await pause(120);
   topStarted=await evalJS("(()=>{const c=document.getElementById('book-media-control');return {mode:c.dataset.player,ear:c.dataset.ear,scene:document.body.dataset.teatroScene,frames:document.querySelectorAll('iframe[data-teatro-live-frame]').length}})()");
   if(topStarted.scene==='active'&&topStarted.frames===1&&topStarted.ear==='witnessed')break;
  }
  if(topStarted?.scene!=='active'||topStarted.frames!==1||topStarted.ear!=='witnessed')
   throw Error('R15 top Play did not activate Teatro media '+JSON.stringify(topStarted));
  console.log('PASSED R15 TOP TO STAGE',label,JSON.stringify(topStarted));
  await evalJS("document.getElementById('book-next').click()");
  let released=null;
  for(let i=0;i<25;i++){
    await pause(150);
    released=await evalJS("({state:document.body.dataset.teatroScene,frames:document.querySelectorAll('iframe[data-teatro-live-frame]').length,motion:document.body.dataset.turnMotion})");
    if(released?.state==='inactive'&&released.frames===0)break;
  }
  if(released?.state!=='inactive'||released.frames!==0)
    throw Error('Teatro runtime leaked after page-turn completion '+JSON.stringify(released));
  // Global audio belongs to the book, independent of which leaf is active.
  const ongoing=await evalJS("document.getElementById('book-media-control').dataset.player");
  if(!['csound','preview'].includes(ongoing))throw Error('Book transport stopped on a page turn');
  await userClick('#book-media-toggle');
  await pause(160);
  const player=await evalJS("(()=>{const btn=document.getElementById('book-media-settings');btn.click();return {detailOpen:!document.getElementById('book-media-details').hidden,inputs:document.querySelectorAll('[data-book-sound-parameter]').length,bus:!!window.FountainBookMidi2,ear:!!document.getElementById('book-ear-status')}})()");
  if(!player.detailOpen||player.inputs!==4||!player.bus||!player.ear)throw Error('Book media/player not mounted '+JSON.stringify(player));
  await evalJS("document.getElementById('player-wind').value='.25';document.getElementById('player-wind').dispatchEvent(new Event('input',{bubbles:true}))");
  const midi=await evalJS("(()=>{const b=window.FountainBookMidi2;let cc=null;const u=b.subscribe(e=>cc=e);b.receive({schema:'fountain.book-midi2.ump.v1',source:'test-inbound',target:b.id,sequence:23,words:[0x40b04600,0x80000000]});u();return {controller:cc?.controller,value:cc?.value,slider:document.getElementById('player-wind').value}})()");
  if(midi.controller!==70||Math.abs(midi.value-.5)>.01||Math.abs(Number(midi.slider)-.5)>.01)
    throw Error('MIDI2 UMP receive or parameter mapping failed '+JSON.stringify(midi));
  if(await evalJS("Boolean(document.querySelector('#satzfunk-hearing-rail, #satzfunk-hear, .teatro-stage-link'))"))
    throw Error('Old scene/hearing navigation leaked');
  await evalJS("document.getElementById('book-media-settings').click()");
  const before=await evalJS("document.getElementById('book-page-count').textContent");
  await evalJS("(document.getElementById('book-next').disabled?document.getElementById('book-prev'):document.getElementById('book-next')).click()");
  await pause(150);
  const after=await evalJS("document.getElementById('book-page-count').textContent");
  if(before===after)throw Error('Page turn did not advance');
  const positionBefore=await evalJS("({anchor:document.querySelector('.linotype-stage .linotype-sheet')?.dataset.sourceId,page:document.getElementById('book-page-count').textContent})");
  await evalJS("document.getElementById('book-toc-button').click()");
  await pause(600);
  const rail=await evalJS("(()=>{const r=document.getElementById('book-contents-rail'),m=document.getElementById('book-pages'),shell=m?.parentElement,b=document.getElementById('book-toc-button'),v=document.getElementById('book-viewport'),h=document.querySelector('.linotype-stage .linotype-sheet');let a=m?.getBoundingClientRect(),c=r?.getBoundingClientRect();return {visible:!r?.hidden,isModal:!!document.querySelector('dialog[open]'),expanded:b?.getAttribute('aria-expanded'),icon:!!b?.querySelector('svg'),text:b?.textContent.trim(),appearance:!!document.getElementById('book-appearance'),fontControls:document.querySelectorAll('#book-font-smaller,#book-font-larger,#book-type-button').length,sideBySide:a&&c?a.right<=c.left+2:false,railWidth:c?.width,readingWidth:a?.width,source:h?.dataset.sourceId,paperWidth:h?.getBoundingClientRect().width,viewportWidth:v?.clientWidth,overflow:document.documentElement.scrollWidth>innerWidth+2,grid:shell?.classList.contains('has-contents')}})()");
  if(!rail.visible||rail.isModal||rail.expanded!=='true'||!rail.icon||rail.text||rail.appearance||
     rail.fontControls||!rail.sideBySide||!rail.grid||rail.railWidth<125||rail.readingWidth<110||rail.overflow)
    throw Error('R14 non-overlay contents rail invalid '+JSON.stringify(rail));
  console.log('PASSED R14 CONTENTS RAIL',label,JSON.stringify(rail));
  await evalJS("document.getElementById('book-toc-button').click()");
  await pause(420);
  const closed=await evalJS("(()=>{const r=document.getElementById('book-contents-rail');return {hidden:r.hidden,expanded:document.getElementById('book-toc-button').getAttribute('aria-expanded'),flex:document.querySelector('.book-reading-shell').classList.contains('has-contents')}})()");
  if(!closed.hidden||closed.expanded!=='false'||closed.flex)
    throw Error('Contents rail did not close '+JSON.stringify(closed));
  if(errors.length)throw Error('JS errors: '+errors.join(';'));
  console.log('PASSED BOOK',label,first.pages+' pages',first.mode,'compact player, MIDI2 ingress, page turn and Contents');
 }finally{ws.close();await fetch(chrome+'/json/close/'+target.id).catch(()=>{})}
}
for(const [label,width,height] of [['iPad landscape',1180,820],['iPad portrait',820,1180],['phone portrait',390,844],['phone landscape',844,390],['desktop',1366,900]]){
 if(process.env.R15_PROFILE&&label!==process.env.R15_PROFILE)continue;
 try{await open('/',width,height,label)}catch(e){console.error('FAILED',label,String(e));process.exitCode=1}
}
try{await open('/editions/stage/',820,1180,'iPad portrait')}catch(e){console.error('FAILED STAGE',String(e));process.exitCode=1}
