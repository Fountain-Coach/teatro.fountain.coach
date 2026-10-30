/** Source-only literary/temporal regression checks for two UNADMITTED Teatro 0.1 candidates.
 * Deliberately does NOT substitute for Teatro's native grammar, admission, Stage,
 * Csound, Ear, MIDI2 or FountainStore witnesses. The established Sing fixture
 * validator remains authoritative for that fixture alone.
 */
import {readFileSync} from 'node:fs';
import {pathToFileURL} from 'node:url';
import {resolve} from 'node:path';

const SECOND='teatro.first-readings.the-second-cup.01';
const HOOK='teatro.first-readings.the-empty-hook.transfer.01';
const SOURCE='af2b33cd978a71c621c0ce042743dc2720ed3e01';
const EXCERPT='Put an empty chair on a stage and wait long enough. It ceases to be furniture. Attention changes it.';
function requireThat(test, message){ if(!test)throw new Error('SECOND_CUP_SOURCE_CHECK: '+message); }
const uniq=a=>new Set(a).size===a.length;
export function checkCandidate(s){
  requireThat(s&&s.kind==='CsoundTeatroScenario','CsoundTeatroScenario kind');
  requireThat([SECOND,HOOK].includes(s.scenarioID),'bounded scenario identity');
  requireThat(s.grammarVersion==='0.1'&&s.schemaVersion==='0.1','grammar version 0.1');
  requireThat(s.status==='candidate-unadmitted','not a live-run claim');
  for(const k of ['GIVEN','TRANSFORM','CONSTRAINTS','EXPECT','VERIFY'])
    requireThat(s[k]&&typeof s[k]==='object',k+' exists');
  requireThat(s.GIVEN.source.commit===SOURCE&&s.GIVEN.source.exactExcerpt===EXCERPT,'First Readings pinned source and precise premise');
  requireThat(s.GIVEN.source.repository==='Fountain-Coach/fountain.coach','original source owner');
  const ent=s.GIVEN.entities;
  requireThat(Array.isArray(ent)&&ent.length>=5&&uniq(ent.map(x=>x.id)),'stable distinct entities');
  const by=new Map(ent.map(e=>[e.id,e]));
  requireThat(ent.filter(e=>e.kind==='BODY'&&e.id.startsWith('Actor.')).length===1,'one and only one present actor');
  requireThat(ent.filter(e=>e.kind==='EAR').length===1&&ent.filter(e=>e.kind==='FIELD').length===1,'separate Ear and Csound field');
  requireThat(ent.every(e=>['BODY','EAR','FIELD','INSTRUMENT'].includes(e.kind)),'declared Teatro entity kinds');
  requireThat(ent.filter(e=>e.kind==='FIELD').every(e=>e.runtime==='Csound'&&e.binding===null),'Csound binding not invented');
  requireThat(ent.filter(e=>e.kind==='EAR').every(e=>e.binding===null),'Ear binding not invented');
  const ports=s.GIVEN.ports;
  requireThat(Array.isArray(ports)&&ports.length===3&&uniq(ports.map(p=>p.id)),'three declared typed source/Ear ports');
  requireThat(ports.every(p=>by.has(p.owner)&&p.id.startsWith(p.owner+'.')),'ports reference declared owners');
  const rel=s.TRANSFORM.relations;
  requireThat(Array.isArray(rel)&&rel.length===2&&uniq(rel.map(r=>r.id)),'stable two relations');
  requireThat(rel.every(r=>['NEAR','LISTENS_TO'].includes(r.predicate)),'only used Chapter 151 predicates');
  requireThat(rel.every(r=>by.has(r.subject)&&by.has(r.object)),'relations reference declared identities');
  const earRel=rel.find(r=>r.predicate==='LISTENS_TO');
  requireThat(by.get(earRel.subject).kind==='EAR'&&by.get(earRel.object).kind==='FIELD','Ear listens to FIELD');
  requireThat(ports.some(p=>p.id===earRel.fromPort&&p.owner===earRel.object&&p.direction==='out'&&p.valueType==='audio'),'audio source port');
  requireThat(ports.some(p=>p.id===earRel.toPort&&p.owner===earRel.subject&&p.direction==='in'&&p.valueType==='audio'),'Ear input port');
  requireThat(Array.isArray(s.TRANSFORM.mappings)&&s.TRANSFORM.mappings.length===0,'no invented numeric mapping');
  const beats=s.GIVEN.beats,duration=s.GIVEN.scene.durationSeconds;
  requireThat(beats.length===4&&beats[0].startSeconds===0&&beats.at(-1).endSeconds===duration,'four contiguous movements within duration');
  requireThat(beats.every((b,i)=>b.endSeconds>b.startSeconds&&(i===0||b.startSeconds===beats[i-1].endSeconds)),'movement gaps/overlap');
  const events=s.TRANSFORM.events;
  requireThat(events.length>4&&uniq(events.map(e=>e.id)),'event IDs unique');
  requireThat(events.every((e,i)=>e.atSeconds>=0&&e.atSeconds<=duration&&(i===0||e.atSeconds>events[i-1].atSeconds)),'events ordered and bounded');
  requireThat(events.every(e=>e.actor===null||by.has(e.actor)),'events reference declared actors or fields');
  requireThat(events.every(e=>e.target===null||by.has(e.target)),'events reference declared targets');
  requireThat(events.at(-1).kind==='stop'&&events.at(-1).atSeconds===duration,'bounded Stop at terminal');
  requireThat(events.some(e=>e.kind==='withheld-action'&&e.mode==='withheld'&&!e.audioCue),'absence is not a fabricated acoustic event');
  const c=s.CONSTRAINTS;
  for(const k of ['requiresAdmissionBeforeEffects','boundedStop','noAbsentPersonIdentity','noSecondCharacter','noNarrator','noSentimentalMusic','noInventedBackstoryOrReason','autoplayForbidden'])
    requireThat(c[k]===true,k+' retained');
  requireThat(c.publicPublicationAuthorized===false&&c.maxDurationSeconds===duration,'candidate not published or unbounded');
  requireThat(s.VERIFY.noSourceCheckAsAdmission===true,'source-only check never claims native admission');
  return {scenarioID:s.scenarioID,source:'SOURCE_CHECK_PASSED_NOT_ADMITTED',durationSeconds:duration,events:events.length,beats:beats.length};
}
export function checkPair(second,hook){
  const a=checkCandidate(second),b=checkCandidate(hook);
  requireThat(a.scenarioID===SECOND&&b.scenarioID===HOOK,'original and transfer identities');
  requireThat(second.GIVEN.scene.durationSeconds===80&&hook.GIVEN.scene.durationSeconds===60,'80s scene and 60s distinct transfer');
  requireThat(second.TRANSFORM.events.some(e=>e.id==='second-pour-withheld'&&e.mode==='withheld'),'withheld pour');
  requireThat(!second.TRANSFORM.events.some(e=>e.id==='second-cup-filled'||e.id==='second-person-arrives'),'no invented action/person');
  requireThat(second.TRANSFORM.events.some(e=>e.id==='second-cup-left'&&e.target==='Cup.Second.01'),'second cup remains');
  requireThat(second.GIVEN.entities.find(e=>e.id==='Chair.Empty.01')?.occupied===false,'chair stays unoccupied');
  requireThat(second.EXPECT.secondCupFilled===false&&second.EXPECT.emptyChairOccupied===false,'explicit negative expectations');
  requireThat(hook.TRANSFORM.events.some(e=>e.id==='second-coat-withheld'&&e.mode==='withheld'),'transfer withheld coat');
  requireThat(hook.GIVEN.entities.find(e=>e.id==='Hook.Empty.01')?.occupied===false,'unused hook stays empty');
  requireThat(hook.EXPECT.secondCoatHung===false&&hook.EXPECT.emptyHookOccupied===false,'transfer explicit negative expectations');
  requireThat(hook.GIVEN.source.transferOrigin===SECOND,'transfer provenance');
  const soundsSecond=new Set(second.TRANSFORM.events.map(x=>x.audioCue).filter(Boolean));
  const soundsHook=hook.TRANSFORM.events.map(x=>x.audioCue).filter(Boolean);
  requireThat(soundsHook.every(x=>!soundsSecond.has(x)),'new Foley vocabulary, not copied kitchen');
  requireThat(!second.EXPECT.soundSources.some(x=>soundsHook.includes(x)),'no kitchen cues in transfer');
  return {sourceCheck:'PASS',scenario:a,transfer:b,learning:'NOT_ADMITTED',nativeRuntime:'NOT_OBSERVED'};
}
export const readPair=(root=process.cwd())=>{
 const dir=resolve(root,'scenarios/csound-teatro');
 const second=JSON.parse(readFileSync(resolve(dir,'the-second-cup.candidate.json'),'utf8'));
 const hook=JSON.parse(readFileSync(resolve(dir,'the-empty-hook.transfer.candidate.json'),'utf8'));
 return {second,hook};
};
if(process.argv[1]&&import.meta.url===pathToFileURL(resolve(process.argv[1])).href){
 console.log(JSON.stringify(checkPair(...Object.values(readPair())),null,2));
}
