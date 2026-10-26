/** Bounded source authoring check for the documented Csound Teatro grammar 0.1.
 * Governance chapter 151 remains the grammar authority. This module neither
 * defines a second predicate vocabulary nor grants native Scenario admission.
 *
 * A draft can be valid even when no authorized runtime is present. Validity is
 * NOT a license to start effects. Only the owning Scenario runner, MIDI2 and
 * Csound/Ear/Sing adapters may produce execution evidence.
 */
const GRAMMAR='0.1';
const PREDICATES=new Set([
  'PRODUCES','RECEIVES','EXCITES','CONTROLS','MODULATES','MAPS_TO',
  'TRIGGERS','FOLLOWS','CONTAINS','OBSERVES','LISTENS_TO','AFFECTS',
  'ABOVE','BELOW','NEAR','INSIDE','OUTSIDE','TOUCHING',
  'MOVING_TOWARD','MOVING_AWAY'
]);
const ENTITY_KINDS=new Set(['BODY','INSTRUMENT','EAR','FIELD']);
const MAPPINGS=new Set(['linear']);
const UPDATES=new Set(['event']);

const requireTrue=(expr,message)=>{if(!expr)throw new TypeError('Csound Teatro 0.1: '+message)};
const finiteRange=value=>Array.isArray(value)&&value.length===2&&
  value.every(x=>typeof x==='number'&&Number.isFinite(x))&&value[0]<value[1];
const nonBlank=x=>typeof x==='string'&&x.trim().length>0;
const unique=items=>new Set(items).size===items.length;

function normalizedPort(s,id){
  const p=s.GIVEN.ports.find(x=>x.id===id);
  requireTrue(p, 'undeclared port '+id);
  return p;
}
const sortIDs=a=>a.map(x=>x.id).sort();

function validatePlayerScenario(s){
  requireTrue(s.kind==='CsoundTeatroScenario'&&s.grammarVersion===GRAMMAR&&
    s.schemaVersion===GRAMMAR,'version mismatch; incompatible grammar requires explicit versioned extension');
  requireTrue(s.scenarioID==='teatro.satzfunk-player-ear-wind.01'&&
    s.status==='candidate-unadmitted'&&s.mode==='live-rehearsal',
    'unrecognized Player Scenario identity or status');
  for(const key of ['GIVEN','TRANSFORM','CONSTRAINTS','EXPECT','VERIFY'])
    requireTrue(s[key]&&typeof s[key]==='object'&&!Array.isArray(s[key]),key+' required');
  const entities=s.GIVEN.entities,ports=s.GIVEN.ports;
  const relations=s.TRANSFORM.relations,mappings=s.TRANSFORM.mappings;
  requireTrue(Array.isArray(entities)&&entities.length===4&&unique(entities.map(x=>x.id)),
    'four unique Player/Ear/Csound entities are required');
  const byID=new Map(entities.map(x=>[x.id,x]));
  for(const [id,kind] of [['SatzfunkPlayer.01','INSTRUMENT'],['Ear.Player.01','EAR'],
    ['Wind.Field.01','FIELD'],['Ear.Wind.01','EAR']])
    requireTrue(byID.get(id)?.kind===kind,'unrecognized or missing entity '+id);
  requireTrue(byID.get('SatzfunkPlayer.01').owner==='Fountain-Coach/SatzfunkPlayer'&&
    byID.get('SatzfunkPlayer.01').capability==='SatzfunkPlayerElement.teatroScenarioRuntime',
    'Player must retain source ownership');
  requireTrue(byID.get('Wind.Field.01').runtime==='@csound/browser'&&
    byID.get('Wind.Field.01').binding==='BookCsoundHost',
    'Csound must remain the bound FIELD engine');
  requireTrue(Array.isArray(ports)&&ports.length===8&&unique(ports.map(p=>p.id)),
    'all eight unique typed Player/Ear/Csound ports are required');
  for(const port of ports){
    requireTrue(byID.has(port.owner)&&port.id.startsWith(port.owner+'.'),
      'invalid port owner '+port.id);
    requireTrue(['in','out'].includes(port.direction)&&nonBlank(port.unit)&&
      nonBlank(port.capability),'invalid port declaration '+port.id);
    if(port.valueType==='number')requireTrue(finiteRange(port.domain),
      'invalid numeric domain '+port.id);
  }
  const expectedPorts={
    'SatzfunkPlayer.01.audio':['out','audio'],
    'SatzfunkPlayer.01.midi2.ump':['out','midi2-ump'],
    'Wind.Field.01.midi2.ump':['in','midi2-ump'],
    'Ear.Player.01.audio':['in','audio'],
    'Ear.Player.01.rms':['out','number'],
    'Wind.Field.01.wind_mix':['in','number'],
    'Wind.Field.01.audio':['out','audio'],
    'Ear.Wind.01.audio':['in','audio']};
  for(const [id,[direction,type]] of Object.entries(expectedPorts)){
    const port=normalizedPort(s,id);
    requireTrue(port.direction===direction&&port.valueType===type,
      'invalid type or direction '+id);
  }
  const signatures=[
    ['LISTENS_TO','Ear.Player.01','SatzfunkPlayer.01','SatzfunkPlayer.01.audio','Ear.Player.01.audio'],
    ['LISTENS_TO','Ear.Wind.01','Wind.Field.01','Wind.Field.01.audio','Ear.Wind.01.audio'],
    ['MODULATES','Ear.Player.01','SatzfunkPlayer.01','Ear.Player.01.rms','SatzfunkPlayer.01.midi2.ump'],
    ['MODULATES','SatzfunkPlayer.01','Wind.Field.01','SatzfunkPlayer.01.midi2.ump','Wind.Field.01.midi2.ump']];
  requireTrue(Array.isArray(relations)&&relations.length===signatures.length&&
    unique(relations.map(r=>r.id)),'four explicit Player/Ear/Csound relations are required');
  for(const [predicate,subject,object,fromPort,toPort] of signatures){
    requireTrue(relations.some(r=>r.predicate===predicate&&r.subject===subject&&
      r.object===object&&r.fromPort===fromPort&&r.toPort===toPort),
      'required relation missing: '+subject+' '+predicate+' '+object);
    requireTrue(PREDICATES.has(predicate)&&byID.has(subject)&&byID.has(object),
      'unknown relation predicate or endpoint');
  }
  const listen=relations.filter(r=>r.predicate==='LISTENS_TO');
  for(const r of listen){
    const from=normalizedPort(s,r.fromPort),to=normalizedPort(s,r.toPort);
    requireTrue(from.direction==='out'&&to.direction==='in'&&from.valueType===to.valueType,
      'LISTENS_TO must connect typed sound output to input');
  }
  const rms=normalizedPort(s,'Ear.Player.01.rms');
  const playerUMP=normalizedPort(s,'SatzfunkPlayer.01.midi2.ump');
  const csoundUMP=normalizedPort(s,'Wind.Field.01.midi2.ump');
  requireTrue(rms.unit==='normalized-linear-rms'&&finiteRange(rms.domain)&&
    playerUMP.unit==='UMP MIDI 2.0 Channel Voice'&&csoundUMP.unit===playerUMP.unit,
    'typed RMS-to-MIDI2 operation path is invalid');
  requireTrue(Array.isArray(mappings)&&mappings.length===1,'one explicit bounded mapping is required');
  const mapping=mappings[0],target=normalizedPort(s,'Wind.Field.01.wind_mix');
  requireTrue(mapping.id==='map.player-rms-to-wind-mix'&&mapping.predicate==='MAPS_TO'&&
    mapping.sourcePort===rms.id&&mapping.targetPort===target.id&&
    mapping.sourceUnit===rms.unit&&mapping.targetUnit===target.unit&&
    JSON.stringify(mapping.sourceDomain)===JSON.stringify(rms.domain)&&
    JSON.stringify(mapping.targetDomain)===JSON.stringify(target.domain)&&
    finiteRange(mapping.sourceDomain)&&finiteRange(mapping.targetDomain)&&
    mapping.transfer==='linear'&&mapping.interpolation==='linear'&&
    mapping.updateMode==='event'&&mapping.clamp===true&&
    Number.isInteger(mapping.minimumIntervalMilliseconds)&&
    mapping.minimumIntervalMilliseconds>=75,
    'invalid, unbounded or unsupported RMS mapping');
  const carrier=s.TRANSFORM.midi2,op=carrier?.umpOperation;
  requireTrue(carrier.authority==='Fountain-Coach/midi2'&&carrier.plane==='local-UMP'&&
    carrier.status==='software-ump-cc74'&&carrier.ownerLibrary==='@fountain-coach/midi2'&&
    carrier.ownerPackageVersion==='0.12.8'&&op?.kind==='controlChange'&&
    op.valueEncoding==='unsigned-32-bit'&&op.group===0&&op.channel===0&&op.controller===74&&
    carrier.softwarePeer==='in-process; no native MIDI endpoint'&&
    carrier.hardwareInteroperabilityClaim===false&&
    carrier.midiCiStatus==='envelope-codec-only; no live CI transaction'&&
    carrier.midiCiTransportImplemented===false,
    'MIDI2 must be the pinned typed software UMP CC74 path with no hardware or CI claim');
  const source=s.GIVEN.source,rules=s.CONSTRAINTS;
  requireTrue(source.kind==='live-instrument-output'&&source.entityID==='SatzfunkPlayer.01'&&
    source.portID==='SatzfunkPlayer.01.audio'&&source.recordedFile===null&&source.required===true,
    'pre-recorded audio cannot satisfy the Player live source');
  requireTrue(rules.sourceOwnedBySatzfunkPlayer===true&&rules.playerMustUseHostAdmittedEdition===true&&
    rules.requiresAdmissionBeforeEffects===true&&rules.liveSourceRequired===true&&
    rules.recordingAsSourceForbidden===true&&rules.csoundEngineNotAnFCISInstrument===true&&
    rules.patchIsNotAnInstrument===true&&rules.midi1FallbackForbidden===true&&
    rules.uncontrolledFeedbackForbidden===true&&rules.autoplayForbidden===true&&
    rules.publicPublicationAuthorized===false&&rules.termination==='writer-controlled-stop'&&
    rules.timingClock==='browser-audio-clock'&&rules.maxGestureUpdatesPerSecond<=14,
    'one or more Player Scenario constraints were removed');
  requireTrue(s.EXPECT.liveSource==='SatzfunkPlayer.01.audio'&&
    s.EXPECT.mappedCsoundPort===target.id&&s.EXPECT.outputObservableBy==='Ear.Wind.01'&&
    s.EXPECT.csoundChangesAudibleWithoutPreRender===true&&
    s.EXPECT.audioRecordsOptionalEvidenceOnly===true&&s.EXPECT.midi2EventsCorrelated===true,
    'Player Scenario expected live behavior was substituted');
  requireTrue(Array.isArray(s.VERIFY.requiredEvidence)&&s.VERIFY.requiredEvidence.length>=6&&
    s.VERIFY.noOfflinePlaybackAsLiveProof===true&&s.VERIFY.noPresentationOnlyAcceptance===true&&
    s.VERIFY.hardwareMIDI2InteroperabilityClaim===false,
    'independent Player Scenario evidence requirements are missing');
  return Object.freeze({scenarioID:s.scenarioID,grammarVersion:GRAMMAR,
    status:'valid-candidate-not-admitted',legalPredicates:['LISTENS_TO','MODULATES','MAPS_TO'],
    bindings:{player:'FCIS instrument',ear:'FCIS observing instrument',csound:'engine',
      scenario:'Csound Teatro Scenario'},
    mapping:{source:mapping.sourcePort,target:mapping.targetPort,controller:op.controller,
      group:op.group,channel:op.channel,sourceDomain:mapping.sourceDomain,targetDomain:mapping.targetDomain},
    admissible:false,execution:'refused',
    blockers:['No native Csound Teatro Scenario admission and MIDI2 operation receipt']});
}

export function validateScenario(s){
  requireTrue(s&&typeof s==='object'&&!Array.isArray(s),'scenario object required');
  requireTrue(s.kind==='CsoundTeatroScenario','scenario is not an instrument');
  if(s.scenarioID==='teatro.satzfunk-player-ear-wind.01')return validatePlayerScenario(s);
  requireTrue(s.grammarVersion===GRAMMAR&&s.schemaVersion===GRAMMAR,
    'version mismatch; incompatible grammar requires explicit versioned extension');
  requireTrue(nonBlank(s.scenarioID)&&s.scenarioID==='teatro.composing-by-ear.live.01',
    'wrong Scenario identity');
  requireTrue(s.status==='candidate-unadmitted',
    'authoring fixture must not assert runtime admission');
  requireTrue(s.mode==='live-rehearsal','only live rehearsal is intended');
  for(const k of ['GIVEN','TRANSFORM','CONSTRAINTS','EXPECT','VERIFY'])
    requireTrue(s[k]&&typeof s[k]==='object'&&!Array.isArray(s[k]),k+' required');

  const entities=s.GIVEN.entities;
  const ports=s.GIVEN.ports;
  const relations=s.TRANSFORM.relations;
  const mappings=s.TRANSFORM.mappings;
  requireTrue(Array.isArray(entities)&&entities.length===4,
    'the four distinct declared entities are required');
  requireTrue(unique(entities.map(x=>x.id)),'duplicate entity identity');
  requireTrue(sortIDs(entities).join('|')===
    ['Ear.Sing.01','Ear.Wind.01','Sing.01','Wind.Field.01'].join('|'),
    'unrecognized or missing entity');
  for(const e of entities){
    requireTrue(ENTITY_KINDS.has(e.kind),'unknown entity kind '+e.kind);
    requireTrue(nonBlank(e.owner)&&nonBlank(e.capability)&&nonBlank(e.runtime),
      'incomplete owner/capability for '+e.id);
  }
  const byID=new Map(entities.map(x=>[x.id,x]));
  requireTrue(byID.get('Sing.01').kind==='INSTRUMENT'&&
    byID.get('Sing.01').owner==='Fountain-Coach/sing'&&
    byID.get('Sing.01').capability==='SingVoice.RealtimeSinger',
    'Sing must be the real source-owned FCIS instrument');
  requireTrue(byID.get('Ear.Sing.01').kind==='EAR'&&
    byID.get('Ear.Wind.01').kind==='EAR','Ear is an observing FCIS instrument');
  requireTrue(byID.get('Wind.Field.01').kind==='FIELD'&&
    byID.get('Wind.Field.01').runtime==='@csound/browser'&&
    byID.get('Wind.Field.01').binding==='BookCsoundHost',
    'Csound is an engine binding to a FIELD, not Sing or the Scenario instrument');

  requireTrue(Array.isArray(ports)&&ports.length===6,
    'all six typed scenario ports must be declared');
  requireTrue(unique(ports.map(p=>p.id)),'duplicate port identity');
  for(const p of ports){
    requireTrue(p.id.startsWith(p.owner+'.')&&byID.has(p.owner),
      'invalid owner for '+p.id);
    requireTrue(['in','out'].includes(p.direction),'invalid direction for '+p.id);
    requireTrue(['number','audio'].includes(p.valueType),'invalid port type '+p.id);
    requireTrue(nonBlank(p.unit)&&nonBlank(p.capability),
      'unit/capability required for '+p.id);
    if(p.valueType==='number')requireTrue(finiteRange(p.domain),
      'numeric port domain missing or invalid '+p.id);
  }
  requireTrue(normalizedPort(s,'Sing.01.audio').direction==='out'&&
    normalizedPort(s,'Sing.01.audio').valueType==='audio'&&
    normalizedPort(s,'Ear.Sing.01.audio').direction==='in',
    'Sing PCM must enter the live listening input');
  requireTrue(normalizedPort(s,'Ear.Sing.01.rms').valueType==='number'&&
    normalizedPort(s,'Ear.Sing.01.rms').direction==='out',
    'Ear RMS must be an observation output');
  requireTrue(normalizedPort(s,'Wind.Field.01.wind_mix').valueType==='number'&&
    normalizedPort(s,'Wind.Field.01.wind_mix').direction==='in',
    'Csound wind mix must be an admitted input');
  requireTrue(normalizedPort(s,'Wind.Field.01.audio').direction==='out'&&
    normalizedPort(s,'Ear.Wind.01.audio').direction==='in',
    'Csound sound must be observable without feedback');

  requireTrue(Array.isArray(relations)&&relations.length===3,
    'exactly three declared distinct audible relations');
  requireTrue(unique(relations.map(r=>r.id)),'duplicate relation identity');
  for(const r of relations){
    requireTrue(PREDICATES.has(r.predicate),'unknown predicate '+r.predicate);
    requireTrue(byID.has(r.subject)&&byID.has(r.object),
      'unknown relation endpoint '+r.id);
    const from=normalizedPort(s,r.fromPort),to=normalizedPort(s,r.toPort);
    requireTrue(from.direction==='out'&&to.direction==='in'&&
      from.valueType===to.valueType&&
      (r.predicate==='MODULATES'||from.unit===to.unit),
      'type/unit/direction mismatch '+r.id);
    requireTrue(from.owner===r.object&&to.owner===r.subject||
      from.owner===r.subject&&to.owner===r.object,
      'relation subject/object do not match ports '+r.id);
    if(r.predicate==='LISTENS_TO')
      requireTrue(byID.get(r.subject).kind==='EAR'&&
        ['INSTRUMENT','FIELD'].includes(byID.get(r.object).kind),
        'LISTENS_TO requires observing EAR and sound source');
    if(r.predicate==='MODULATES')
      requireTrue(byID.get(r.subject).kind==='EAR'&&
        byID.get(r.object).kind==='FIELD'&&
        from.valueType==='number','MODULATES requires observed numeric value');
  }
  requireTrue(relations.filter(r=>r.predicate==='LISTENS_TO').length===2&&
    relations.some(r=>r.predicate==='MODULATES'),
    'live Sing→Ear and Csound→Ear observation relations required');

  requireTrue(Array.isArray(mappings)&&mappings.length===1,'one explicit mapping');
  const mapping=mappings[0];
  requireTrue(mapping.predicate==='MAPS_TO'&&PREDICATES.has(mapping.predicate),
    'invalid mapping predicate');
  requireTrue(mapping.id==='map.sing-rms-to-wind-mix','unknown mapping identity');
  requireTrue(mapping.sourcePort==='Ear.Sing.01.rms'&&
    mapping.targetPort==='Wind.Field.01.wind_mix',
    'mapping may not silently replace source with target or recorded audio');
  const source=normalizedPort(s,mapping.sourcePort),
        target=normalizedPort(s,mapping.targetPort);
  requireTrue(source.valueType==='number'&&target.valueType==='number'&&
    source.direction==='out'&&target.direction==='in',
    'numeric output to numeric input only');
  requireTrue(finiteRange(mapping.sourceDomain)&&finiteRange(mapping.targetDomain),
    'invalid numeric mapping domains');
  requireTrue(JSON.stringify(mapping.sourceDomain)===JSON.stringify(source.domain)&&
    JSON.stringify(mapping.targetDomain)===JSON.stringify(target.domain),
    'mapping and declared port domains must match');
  requireTrue(mapping.sourceUnit===source.unit&&mapping.targetUnit===target.unit,
    'mapping unit mismatch');
  requireTrue(MAPPINGS.has(mapping.transfer)&&
    MAPPINGS.has(mapping.interpolation)&&
    UPDATES.has(mapping.updateMode)&&
    mapping.clamp===true&&
    Number.isInteger(mapping.minimumIntervalMilliseconds)&&
    mapping.minimumIntervalMilliseconds>=75,
    'unsupported mapping policy or rate (requires a grammar version change)');

  const carrier=s.TRANSFORM.midi2;
  requireTrue(carrier.authority==='Fountain-Coach/midi2'&&
    carrier.plane==='local-UMP'&&
    carrier.messageType==='midi2-channel-voice-control-change-64'&&
    carrier.valueBits===32&&
    carrier.controller===74&&carrier.group===0&&carrier.channel===0&&
    carrier.routing==='same-scenario-identity-and-sequence',
    'event carrier is not the original typed 64-bit MIDI2 CC74 path');

  const input=s.GIVEN.source;
  requireTrue(input.kind==='live-instrument-output'&&
    input.entityID==='Sing.01'&&
    input.portID==='Sing.01.audio'&&
    input.recordedFile===null&&input.required===true,
    'pre-recorded Sing WAV cannot satisfy a live source');
  const rules=s.CONSTRAINTS;
  requireTrue(JSON.stringify(rules.mutationScope)==='["Wind.Field.01.wind_mix"]'&&
    rules.requiresAdmissionBeforeEffects===true&&
    rules.liveSourceRequired===true&&
    rules.recordingAsSourceForbidden===true&&
    rules.sourceOwnedBySing===true&&
    rules.csoundEngineNotAnFCISInstrument===true&&
    rules.patchIsNotAnInstrument===true&&
    rules.earPlaceholderNoteForbidden===true&&
    rules.midi1FallbackForbidden===true&&
    rules.uncontrolledFeedbackForbidden===true&&
    rules.autoplayForbidden===true&&
    rules.publicPublicationAuthorized===false&&
    rules.termination==='writer-controlled-stop'&&
    rules.timingClock==='browser-audio-clock'&&
    Number.isInteger(rules.maxGestureUpdatesPerSecond)&&
    rules.maxGestureUpdatesPerSecond>0&&rules.maxGestureUpdatesPerSecond<=14,
    'one or more bounded live-scenario rules removed');
  requireTrue(s.EXPECT.liveSource==='Sing.01.audio'&&
    s.EXPECT.mappedCsoundPort===mapping.targetPort&&
    s.EXPECT.outputObservableBy==='Ear.Wind.01'&&
    s.EXPECT.csoundChangesAudibleWithoutPreRender===true&&
    s.EXPECT.audioRecordsOptionalEvidenceOnly===true,
    'live expected effects have been substituted');
  requireTrue(Array.isArray(s.VERIFY.requiredEvidence)&&
    s.VERIFY.requiredEvidence.length>=6&&
    s.VERIFY.noOfflinePlaybackAsLiveProof===true&&
    s.VERIFY.noPresentationOnlyAcceptance===true,
    'independent live verification missing');

  const blockers=[];
  if(byID.get('Sing.01').binding===null)
    blockers.push('Sing.01 real-time PCM output is not bound to Ear.Sing.01.audio');
  if(input.transport===null)
    blockers.push('No admitted live Sing PCM-to-Ear transport/clock binding');
  blockers.push('No native Csound Teatro Scenario admission and MIDI2 operation receipt');
  return Object.freeze({
    scenarioID:s.scenarioID,
    grammarVersion:s.grammarVersion,
    status:'valid-candidate-not-admitted',
    legalPredicates:[...new Set([...relations.map(r=>r.predicate),mapping.predicate])],
    bindings:{sing:'FCIS instrument',ear:'FCIS observing instrument',
      csound:'engine',scenario:'Csound Teatro Scenario'},
    mapping:{source:mapping.sourcePort,target:mapping.targetPort,
      controller:carrier.controller,group:carrier.group,channel:carrier.channel,
      sourceDomain:mapping.sourceDomain,targetDomain:mapping.targetDomain},
    admissible:false,
    execution:'refused',
    blockers
  });
}

/** Display ONLY accepted grammar-0.1 relation words and explicit ports. This
 * is a projection, not an independently authored or alternate grammar. */
export function projectRelations(s){
  validateScenario(s);
  const lines=[];
  for(const r of s.TRANSFORM.relations)
    lines.push(r.subject+' '+r.predicate+' '+r.object);
  for(const m of s.TRANSFORM.mappings)
    lines.push(m.sourcePort+' '+m.sourceDomain.join('..')+' '+m.sourceUnit+
      ' MAPS_TO '+m.targetPort+' '+m.targetDomain.join('..')+' '+m.targetUnit+
      ' [linear, clamp, event, '+m.minimumIntervalMilliseconds+' ms]');
  return lines.join('\n');
}

export function refuseUnadmittedLiveRun(s){
  const checked=validateScenario(s);
  throw new Error('Csound Teatro Scenario not admitted: '+checked.blockers.join('; '));
}
