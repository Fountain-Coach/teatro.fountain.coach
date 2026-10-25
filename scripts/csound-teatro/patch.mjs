import {validateScenario,projectRelations} from './validate-scenario.mjs';
const scenarioURL='../../scenarios/csound-teatro/composing-by-ear.live.json';
const container=document.querySelector('#patch');
const nodes=document.querySelector('#patch-nodes');
const cables=document.querySelector('#patch-cables');
const mapping=document.querySelector('#mapping');
const projection=document.querySelector('#relations');
const status=document.querySelector('#status');
const blockers=document.querySelector('#blockers');
const order=['Sing.01','Ear.Sing.01','Wind.Field.01','Ear.Wind.01'];
const publicName={
  'Sing.01':'Sing',
  'Ear.Sing.01':'Ear / Sing',
  'Wind.Field.01':'Csound sound field',
  'Ear.Wind.01':'Ear / Csound'
};
const roleLabel={
  INSTRUMENT:'FCIS instrument',
  EAR:'FCIS observing instrument',
  FIELD:'Csound-engine output'
};
const add=(element,tag,text,className)=>{
 const part=document.createElement(tag);
 if(text!==undefined)part.textContent=text;
 if(className)part.className=className;
 element.appendChild(part);
 return part;
};
const svg=(tag,attributes={})=>{
 const e=document.createElementNS('http://www.w3.org/2000/svg',tag);
 for(const [name,value] of Object.entries(attributes))e.setAttribute(name,String(value));
 return e;
};

function draw(s){
 for(const node of order){
  const entity=s.GIVEN.entities.find(e=>e.id===node);
  const el=add(nodes,'section');
  el.className='patch-node';
  el.dataset.entity=node;
  el.setAttribute('aria-label',publicName[node]+', '+roleLabel[entity.kind]);
  add(el,'div',roleLabel[entity.kind],'kind');
  add(el,'div',publicName[node],'id');
  add(el,'div',entity.binding?'Declared, not running':'Live adapter missing','state');
  const ports=s.GIVEN.ports.filter(p=>p.owner===node).map(p=>p.id.split('.').at(-1));
  add(el,'div',ports.join(' · '),'port');
 }
 const m=s.TRANSFORM.mappings[0];
 const values=[
   ['Source',m.sourcePort],
   ['Destination',m.targetPort],
   ['Carrier','MIDI 2.0 CC'+s.TRANSFORM.midi2.controller+
    ' · 64-bit UMP · group '+s.TRANSFORM.midi2.group],
   ['Mapping',m.sourceDomain.join('–')+' '+m.sourceUnit+' → '+
     m.targetDomain.join('–')+' '+m.targetUnit],
   ['Transfer',m.transfer+' · clamp · '+m.updateMode],
   ['Timing','≥'+m.minimumIntervalMilliseconds+' ms']
 ];
 for(const [key,value] of values){
  const item=add(mapping,'div');
  add(item,'dt',key);
  add(item,'dd',value);
 }
 projection.textContent=projectRelations(s);
}
function wire(s){
 const box=container.getBoundingClientRect();
 const width=box.width;
 const height=box.height;
 cables.setAttribute('viewBox','0 0 '+Math.round(width)+' '+Math.round(height));
 cables.setAttribute('width',Math.round(width));
 cables.setAttribute('height',Math.round(height));
 cables.replaceChildren();
 const defs=svg('defs');
 const arrow=svg('marker',{id:'wire-arrow',markerWidth:10,markerHeight:10,refX:7,
   refY:3,orient:'auto',markerUnits:'strokeWidth'});
 arrow.appendChild(svg('path',{d:'M0,0 L0,6 L8,3 z',fill:'#d5a77c'}));
 defs.appendChild(arrow);cables.appendChild(defs);
 const edges=s.TRANSFORM.relations.map(x=>({
   source:x.predicate==='LISTENS_TO'?x.object:x.subject,
   target:x.predicate==='LISTENS_TO'?x.subject:x.object,
   name:x.predicate==='MODULATES'?'MIDI2 CC74':'audio PCM'
 }));
 edges.forEach((edge,index)=>{
  const from=nodes.querySelector('[data-entity="'+edge.source+'"]');
  const to=nodes.querySelector('[data-entity="'+edge.target+'"]');
  const a=from.getBoundingClientRect(),b=to.getBoundingClientRect();
  const dx=b.left-a.right,dy=b.top-a.bottom;
  let x1,y1,x2,y2,path;
  if(dx>0){
   x1=a.right-box.left;y1=(a.top+a.bottom)/2-box.top;
   x2=b.left-box.left;y2=(b.top+b.bottom)/2-box.top;
   const turn=Math.max(12,(x2-x1)*0.5);
   path='M '+x1+' '+y1+' C '+(x1+turn)+' '+y1+' '+(x2-turn)+' '+y2+' '+x2+' '+y2;
  }else{
   x1=(a.left+a.right)/2-box.left;y1=a.bottom-box.top;
   x2=(b.left+b.right)/2-box.left;y2=b.top-box.top;
   const turn=Math.max(12,(y2-y1)*0.5);
   path='M '+x1+' '+y1+' C '+x1+' '+(y1+turn)+' '+x2+' '+(y2-turn)+' '+x2+' '+y2;
  }
  cables.appendChild(svg('path',{d:path,'marker-end':'url(#wire-arrow)',
    'aria-label':edge.name,'data-wire':index}));
 });
}
async function initialize(){
 try{
  const response=await fetch(scenarioURL,{cache:'no-store'});
  if(!response.ok)throw Error('Scenario source unavailable: '+response.status);
  const scenario=await response.json();
  const inspection=validateScenario(scenario);
  draw(scenario);
  const update=()=>wire(scenario);
  window.addEventListener('resize',update);
  if(typeof ResizeObserver!=='undefined')new ResizeObserver(update).observe(container);
  requestAnimationFrame(update);
  status.textContent='Grammar 0.1 relation model checked; native Scenario admission NOT established.';
  for(const blocker of inspection.blockers)add(blockers,'li',blocker);
  // A visualization cannot upgrade an unadmitted Scenario into an instrument.
  window.csoundTeatroPatch=Object.freeze({
    scenarioID:inspection.scenarioID,
    validatedCandidate:true,
    admitted:false,
    running:false,
    relationCount:scenario.TRANSFORM.relations.length,
    declaredPortCount:scenario.GIVEN.ports.length,
    mapping:inspection.mapping,
    blockers:inspection.blockers
  });
 }catch(error){
  status.textContent='The Scenario is not inspectable: '+error.message;
  console.error('CSOUND_TEATRO_SCENARIO',error);
 }
}
void initialize();
