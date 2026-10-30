import test from 'node:test';
import assert from 'node:assert/strict';
import {readPair,checkPair,checkCandidate} from './check-second-cup.mjs';
const {second,hook}=readPair();
const clone=x=>structuredClone(x);
test('both source-addressed candidate scenes pass bounded source checks',()=>{
 const r=checkPair(second,hook);
 assert.equal(r.sourceCheck,'PASS');assert.equal(r.learning,'NOT_ADMITTED');
 assert.equal(r.nativeRuntime,'NOT_OBSERVED');
});
test('an invented second actor is refused',()=>{
 const x=clone(second); x.GIVEN.entities.push({...x.GIVEN.entities[0],id:'Actor.Absent.01'});
 assert.throws(()=>checkCandidate(x),/one and only one present actor/);
});
test('deleting the withheld pour is refused',()=>{
 const x=clone(second);x.TRANSFORM.events=x.TRANSFORM.events.filter(e=>e.id!=='second-pour-withheld');
 assert.throws(()=>checkPair(x,hook),/absence is not a fabricated acoustic event|withheld pour/);
});
test('adding a sentimental melody is refused by the score contract',()=>{
 const x=clone(second);x.CONSTRAINTS.noSentimentalMusic=false;
 assert.throws(()=>checkCandidate(x),/noSentimentalMusic/);
});
test('an admitted fiction is refused',()=>{
 const x=clone(second);x.status='admitted';
 assert.throws(()=>checkCandidate(x),/not a live-run claim/);
});
test('a gap between temporal beats is refused',()=>{
 const x=clone(second);x.GIVEN.beats[2].startSeconds+=2;
 assert.throws(()=>checkCandidate(x),/movement gaps\/overlap/);
});
test('unrelated dynamic event beyond end is refused',()=>{
 const x=clone(second);x.TRANSFORM.events[1].atSeconds=100;
 assert.throws(()=>checkCandidate(x),/ordered and bounded/);
});
test('fictitious active audio binding is refused as a proof claim',()=>{
 const x=clone(second);x.GIVEN.entities.find(e=>e.kind==='EAR').binding='unwitnessed';
 assert.throws(()=>checkCandidate(x),/Ear binding not invented/);
});
test('transfer must not recycle coffee Foley',()=>{
 const x=clone(hook);x.TRANSFORM.events.find(e=>e.audioCue).audioCue='coffee_air';
 assert.throws(()=>checkPair(second,x),/new Foley vocabulary/);
});
test('transfer may not assign the missing person',()=>{
 const x=clone(hook);x.CONSTRAINTS.noAbsentPersonIdentity=false;
 assert.throws(()=>checkCandidate(x),/noAbsentPersonIdentity/);
});
test('transfer may not occupy the unused hook',()=>{
 const x=clone(hook);x.GIVEN.entities.find(e=>e.id==='Hook.Empty.01').occupied=true;
 assert.throws(()=>checkPair(second,x),/hook stays empty/);
});
