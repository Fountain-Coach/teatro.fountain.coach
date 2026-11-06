const {webkit}=require('/Users/benedikteickhoff/Developer/fcis.fountain.coach/node_modules/playwright');
(async()=>{
 const b=await webkit.launch({headless:true,});
 try{
  for(const key of ['literal','directed','history-groove','history-memory']){
   const page=await b.newPage();
   const pair=key.startsWith('history-')?'history':'controlled';
   await page.goto('http://127.0.0.1:8768/interludes/kino/live-csound/?pair='+pair,{waitUntil:'domcontentloaded'});
   await page.locator('[data-play='+key+']').click();
   await page.waitForFunction(()=>/running|refused/i.test(document.querySelector('#status').textContent),{timeout:30000});
   await page.waitForTimeout(1400);
   const result=await page.evaluate(key=>({status:document.querySelector('#status').textContent,meter:document.querySelector('section[data-synth='+key+'] .meter span').style.width}),key);
   console.log('LIVE',key,result);
   if(!result.status.includes('running')||result.meter==='0px'||result.meter==='0%')throw Error('Live sound not proven: '+key);
   await page.locator('#stop').click();
   await page.waitForTimeout(900);
   console.log('STOP',key,await page.locator('#status').textContent());
   await page.close();
  }
 }finally{await b.close()}
})().catch(e=>{console.error(e.stack||String(e));process.exit(1)});
