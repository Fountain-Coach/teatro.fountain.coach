// Teatro source-owned live Csound orchestras; no prerecorded audio and no second Reader.
import {BookCsoundHost} from '../../../assets/book-csound-host.js';
const keys=new Set(['history-groove','history-memory','literal','directed']);
const pair=new URLSearchParams(location.search).get('pair')==='controlled'?'controlled':'history';
document.body.dataset.pair=pair;
const status=document.querySelector('#status'),stopButton=document.querySelector('#stop');
const buttons=[...document.querySelectorAll('[data-play]')],cache=new Map();
let current=null,serial=0,closing=Promise.resolve();
function note(t){status.textContent=t}
function reset(){for(const b of buttons){b.setAttribute('aria-pressed','false');b.textContent='Play live synthesis';b.disabled=false}stopButton.disabled=true;for(const e of document.querySelectorAll('.meter span'))e.style.width='0'}
async function stop(){
  ++serial;
  const prior=current;current=null;reset();
  if(!prior){note('Stopped. Choose a live Csound instrument.');return}
  if(prior.timer)clearTimeout(prior.timer);
  if(prior.poll)clearInterval(prior.poll);
  const ctx=prior.host.runtime?.context;
  const end=async()=>{
    try{await prior.host.stop()}
    catch(e){if(!String(e).includes('cleanup is not a function'))throw e}
    finally{if(ctx?.state!=='closed')await ctx?.close()}
  };
  closing=closing.then(end,end);
  try{await closing;note('Stopped. Audio context closed; preparing a fresh Csound host.');setTimeout(()=>location.reload(),80)}
  catch(e){note('Stop error: '+e.message);setTimeout(()=>location.reload(),80)}
}
stopButton.addEventListener('click',()=>void stop());
async function play(key){
  if(!keys.has(key)||current||pair==='history'&&!key.startsWith('history-')||pair==='controlled'&&key.startsWith('history-'))return;
  await stop();
  const generation=++serial,button=buttons.find(b=>b.dataset.play===key);
  button.textContent='Starting Csound…';stopButton.disabled=false;
  note('Starting source-owned Csound AudioWorklet…');
  let host;
  try{
    const config=cache.get(key)||await fetch('./'+key+'.json',{cache:'no-store'}).then(r=>{if(!r.ok)throw Error('Source score unavailable');return r.json()});
    cache.set(key,config);
    if(config.durationSeconds!==16||config.originalBrowserCapture!==false||config.engine!=='@csound/browser AudioWorklet via Teatro-owned BookCsoundHost')throw Error('Unverified score identity');
    host=new BookCsoundHost();
    await host.start(()=>{});
    if(serial!==generation){await host.stop();return}
    await host.runtime.dispatchMidi1(new Uint8Array([128,48,0]));
    await Promise.all(['wind_mix','turbulence_mix','head_mix','voice_mix'].map(p=>host.setParameter(p,0)));
    const compiled=await host.runtime.instance.compileOrc(config.orchestra);
    if(compiled!==0)throw Error('Csound orchestra rejected: '+compiled);
    const accepted=await host.runtime.instance.readScore(config.score.join('\n'));
    if(accepted!==undefined&&accepted!==0)throw Error('Csound score rejected: '+accepted);
    if(serial!==generation){await host.stop();return}
    current={key,host};
    button.textContent='Live synthesizing';button.setAttribute('aria-pressed','true');
    for(const other of buttons)other.disabled=true;
    note(config.label+' · Csound running · Stop available.');
    current.poll=setInterval(async()=>{
      if(current?.host!==host)return;
      try{const m=await host.level();const v=Number(m?.rms??m?.value??0);
       const e=document.querySelector('section[data-synth="'+key+'"] .meter span');
       if(e&&Number.isFinite(v))e.style.width=Math.min(100,Math.max(0,v*450))+'%';
      }catch{}
    },500);
    current.timer=setTimeout(()=>{if(current?.host===host)void stop()},17500);
    window.dispatchEvent(new CustomEvent('kino-live:started',{detail:{key,engine:config.engine,identity:config.identity,sources:config.sources}}));
  }catch(e){
    if(host)try{await host.stop()}catch{}
    if(serial===generation){current=null;reset();note('Live Csound refused: '+e.message)}
    window.dispatchEvent(new CustomEvent('kino-live:error',{detail:{key,error:String(e)}}));
  }
}
for(const b of buttons)b.addEventListener('click',()=>void play(b.dataset.play));
window.addEventListener('pagehide',()=>{if(current)void stop()});
reset();
