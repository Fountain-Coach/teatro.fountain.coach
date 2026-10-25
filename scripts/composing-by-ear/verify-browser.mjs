/* Exact real browser acceptance: original Sing file + source-pinned Ear
   + existing repository MIDI2 UMP + actual Csound AudioWorklet + PCM capture.
   The source fixture must be prepared by ./prepare.py on the authorized Mac.
 */
import puppeteer from '/opt/homebrew/lib/node_modules/@wonderwhy-er/desktop-commander/node_modules/puppeteer/lib/puppeteer/puppeteer.js';
import {writeFileSync,mkdirSync} from 'node:fs';
import {createHash} from 'node:crypto';
import path from 'node:path';

const out=process.argv[2]||'/tmp/fc-composing-by-ear/evidence';
const url='http://127.0.0.1:8198/';
const chrome='/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const browser=await puppeteer.launch({executablePath:chrome,headless:true,
  args:['--no-sandbox','--disable-gpu','--disable-extensions',
    '--autoplay-policy=no-user-gesture-required','--no-first-run'],
  userDataDir:'/tmp/fc-composing-by-ear-browser-profile'
});
try {
 const page=await browser.newPage();
 await page.setCacheEnabled(false);
 await page.setViewport({width:1100,height:900,deviceScaleFactor:1});
 const errors=[];
 page.on('pageerror',err=>errors.push('PAGE '+err.message));
 page.on('console',msg=>{
   if(msg.type()==='error') errors.push('CONSOLE '+msg.text().slice(0,450));
 });
 const res=await page.goto(url,{waitUntil:'networkidle2',timeout:35000});
 if(res.status()!==200)throw Error('Private fixture HTTP status '+res.status());
 await page.waitForFunction(()=>typeof window.runComparison==='function',{timeout:15000});
 await page.click('#run');
 await page.waitForFunction(()=>['passed','failed'].includes(window.composingByEarResult?.status),
                             {timeout:105000,polling:350});
 const state=await page.evaluate(()=>{
   const s=window.composingByEarResult;
   return {status:s.status,error:s.error,trace:s.lastRunTrace,source:s.composed?.source,
     control:s.control&&{...s.control,audioURL:undefined},
     composed:s.composed&&{...s.composed,audioURL:undefined},compared:s.compared};
 });
 if(state.status!=='passed')throw Error('Private composition failed: '+JSON.stringify({state,errors}));
 if(errors.length)throw Error('Browser errors: '+JSON.stringify(errors));
 if(state.compared?.acceptedUMP<30||state.compared?.csoundMappingsApplied<15)
   throw Error('MIDI2/Csound mapping did not execute');
 if(state.compared?.controlMappingsApplied!==0||state.compared?.measuredChangeRatio<=1.35)
   throw Error('Control and composition not acoustically distinguishable');
 const readWAV=async(selector)=>{
   const b64=await page.$eval(selector,async element=>{
     if(!element.src.startsWith('blob:'))throw Error('Expected private WAV blob');
     const response=await fetch(element.src);
     const bytes=new Uint8Array(await response.arrayBuffer());
     if(bytes.length<100000||String.fromCharCode(...bytes.slice(0,4))!=='RIFF')
       throw Error('No physical recorded WAV data');
     let result='';
     // Encoded in chunks to avoid call-stack size limits.
     for(let i=0;i<bytes.length;i+=8192)
       result+=String.fromCharCode(...bytes.subarray(i,i+8192));
     return btoa(result);
   });
   return Buffer.from(b64,'base64');
 };
 const control=await readWAV('#control-audio');
 const composed=await readWAV('#composed-audio');
 mkdirSync(out,{recursive:true});
 const controlPath=path.join(out,'csound-control.wav');
 const composedPath=path.join(out,'csound-by-ear.wav');
 writeFileSync(controlPath,control);
 writeFileSync(composedPath,composed);
 const hash=data=>createHash('sha256').update(data).digest('hex');
 const compare={...state,controlSHA256:hash(control),composedSHA256:hash(composed),
   byteDifference:Buffer.compare(control,composed)!==0,
   directSourceSHA256:'1d285c6b0a9dd2f7b7be58aac1509b5f55bcac5e3636c530cbec25f20db8f505',
   claim:'REAL browser Csound AudioWorklet output altered by shipped Ear measurement transmitted as in-browser MIDI2 64-bit UMP controller 74; no native external MIDI2 port',
   humanListeningVerified:false,
   mediaStorage:'Private local WAV outputs, never committed or published',
   testBrowser:'real headless Chrome, secure 127.0.0.1',
   errors};
 if(!compare.byteDifference)throw Error('No change in output PCM');
 writeFileSync(path.join(out,'acceptance.json'),JSON.stringify(compare,null,2)+'\n');
 await page.screenshot({path:path.join(out,'fixture.png'),fullPage:true});
 console.log('COMPOSING_BY_EAR_REAL_ACCEPTED',JSON.stringify({
   ratio:compare.compared.measuredChangeRatio,
   controllerPackets:compare.compared.acceptedUMP,
   csoundChanges:compare.compared.csoundMappingsApplied,
   inputEarWindows:compare.composed.sourceEarWindows,
   outputEarWindows:compare.composed.csoundEarWindows,
   source:compare.source,
   controlSHA256:compare.controlSHA256,
   composedSHA256:compare.composedSHA256,
   bothContextsClosed:compare.compared.bothSourcesClosed,
   output:out,errors}));
}finally{await browser.close()}
