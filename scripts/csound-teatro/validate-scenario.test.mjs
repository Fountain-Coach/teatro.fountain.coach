import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {fileURLToPath} from 'node:url';
import {resolve,dirname} from 'node:path';
import {validateScenario,projectRelations,refuseUnadmittedLiveRun}
  from './validate-scenario.mjs';
const here=dirname(fileURLToPath(import.meta.url));
const source=JSON.parse(readFileSync(resolve(here,
  '../../scenarios/csound-teatro/composing-by-ear.live.json'),'utf8'));
const duplicate=()=>structuredClone(source);
const err=(change,needle)=>{
 const s=duplicate();change(s);
 assert.throws(()=>validateScenario(s),new RegExp(needle,'i'));
};
test('existing 0.1 relations and mapping suffice; status is candidate not admission',()=>{
 const result=validateScenario(source);
 assert.equal(result.grammarVersion,'0.1');
 assert.equal(result.status,'valid-candidate-not-admitted');
 assert.equal(result.admissible,false);
 assert.equal(result.execution,'refused');
 assert.deepEqual(result.legalPredicates,['LISTENS_TO','MODULATES','MAPS_TO']);
 assert.deepEqual(result.mapping.sourceDomain,[0,0.2]);
 assert.deepEqual(result.mapping.targetDomain,[0.25,1]);
 assert.equal(result.mapping.controller,74);
 assert.equal(result.bindings.csound,'engine');
 assert.equal(result.bindings.scenario,'Csound Teatro Scenario');
 assert.equal(result.blockers.length,3);
 const projected=projectRelations(source);
 assert.match(projected,/Ear\.Sing\.01 LISTENS_TO Sing\.01/);
 assert.match(projected,/Ear\.Sing\.01 MODULATES Wind\.Field\.01/);
 assert.match(projected,/Ear\.Wind\.01 LISTENS_TO Wind\.Field\.01/);
 assert.match(projected,/Ear\.Sing\.01\.rms .* MAPS_TO Wind\.Field\.01\.wind_mix/);
 assert.doesNotMatch(projected,/teaching|recorded|instrument Csound/i);
});
test('valid candidate refuses real execution without an authorized live driver',()=>{
 assert.throws(()=>refuseUnadmittedLiveRun(source),/not admitted.*Sing.01 real-time PCM/);
});
test('unknown grammar and predicates must refuse rather than extending silently',()=>{
 err(s=>s.grammarVersion='0.2','version mismatch');
 err(s=>s.TRANSFORM.relations[0].predicate='TEACHES','unknown predicate');
 err(s=>s.TRANSFORM.mappings[0].predicate='INSTRUCTS','invalid mapping predicate');
 err(s=>s.TRANSFORM.mappings[0].transfer='learned','unsupported mapping policy');
});
test('the Scenario is not an FCIS instrument; Sing and Ear retain ownership',()=>{
 err(s=>s.kind='INSTRUMENT','not an instrument');
 err(s=>s.GIVEN.entities[0].owner='Fountain-Coach/teatro.fountain.coach',
     'source-owned FCIS instrument');
 err(s=>s.GIVEN.entities[2].kind='INSTRUMENT',
     'Csound is an engine binding');
 err(s=>s.GIVEN.entities[1].kind='INSTRUMENT','observing FCIS instrument');
});
test('relations require declared entities, sound ports and correct directions',()=>{
 err(s=>s.TRANSFORM.relations[0].object='Wind.Unknown','unknown relation endpoint');
 err(s=>s.TRANSFORM.relations[1].fromPort='Wind.Unknown.rms','undeclared port');
 err(s=>s.GIVEN.ports[0].direction='in','invalid|type/unit/direction|Sing PCM');
 err(s=>s.GIVEN.ports[3].valueType='audio','type/unit/direction|Csound wind');
 err(s=>s.GIVEN.ports[0].unit='Hz','type/unit/direction');
 err(s=>s.GIVEN.entities.push({...s.GIVEN.entities[3]}),'four distinct');
});
test('numeric mappings require declared units, domains, clamp, interpolation and rate',()=>{
 err(s=>s.TRANSFORM.mappings[0].targetPort='Sing.01.audio',
     'mapping may not silently');
 err(s=>s.TRANSFORM.mappings[0].targetDomain=[0.0,2.0],
     'mapping and declared port domains');
 err(s=>s.TRANSFORM.mappings[0].sourceUnit='Hz','mapping unit mismatch');
 err(s=>s.TRANSFORM.mappings[0].clamp=false,'unsupported mapping policy');
 err(s=>s.TRANSFORM.mappings[0].interpolation='improvise','unsupported mapping policy');
 err(s=>s.TRANSFORM.mappings[0].minimumIntervalMilliseconds=1,
     'unsupported mapping policy');
});
test('no MIDI1 downgrade and no alternate event plane can masquerade as MIDI2',()=>{
 err(s=>s.TRANSFORM.midi2.messageType='midi1-control-change-7',
     'typed 64-bit MIDI2');
 err(s=>s.TRANSFORM.midi2.valueBits=7,'typed 64-bit MIDI2');
 err(s=>s.TRANSFORM.midi2.controller=7,'typed 64-bit MIDI2');
 err(s=>s.TRANSFORM.midi2.authority='private-fake-midi2',
     'typed 64-bit MIDI2');
});
test('a pre-recorded Sing phrase cannot satisfy a live instrument source',()=>{
 err(s=>s.GIVEN.source.kind='recorded-WAV','pre-recorded Sing WAV');
 err(s=>s.GIVEN.source.recordedFile='articulated.wav','pre-recorded Sing WAV');
 err(s=>s.GIVEN.source.portID='Wind.Field.01.audio','pre-recorded Sing WAV');
 err(s=>s.CONSTRAINTS.liveSourceRequired=false,'bounded live-scenario rules');
 err(s=>s.CONSTRAINTS.recordingAsSourceForbidden=false,
     'bounded live-scenario rules');
});
test('no unauthorized publication, feedback, fake note recognition or implicit play',()=>{
 err(s=>s.CONSTRAINTS.publicPublicationAuthorized=true,
     'bounded live-scenario rules');
 err(s=>s.CONSTRAINTS.uncontrolledFeedbackForbidden=false,
     'bounded live-scenario rules');
 err(s=>s.CONSTRAINTS.earPlaceholderNoteForbidden=false,
     'bounded live-scenario rules');
 err(s=>s.CONSTRAINTS.autoplayForbidden=false,'bounded live-scenario rules');
 err(s=>s.EXPECT.audioRecordsOptionalEvidenceOnly=false,
     'live expected effects');
});
test('the verifier cannot be replaced by a presentation-only graph',()=>{
 err(s=>s.VERIFY.noPresentationOnlyAcceptance=false,
     'independent live verification');
 err(s=>s.VERIFY.requiredEvidence=[],
     'independent live verification');
});
