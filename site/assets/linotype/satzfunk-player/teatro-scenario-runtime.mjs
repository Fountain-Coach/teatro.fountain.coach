import { playbackBinding } from "./player-media.mjs";

const clamp = value => Math.max(0, Math.min(1, value));
const EXPECTED_SCENARIO_ID = "teatro.satzfunk-player-ear-wind.01";
const nonBlank = value => typeof value === "string" && value.trim().length > 0;
const validRange = range => Array.isArray(range) && range.length === 2 &&
  range.every(Number.isFinite) && range[0] < range[1];

function requireThat(value, message) {
  if (!value) throw new TypeError("SatzfunkPlayer Teatro admission: " + message);
}

/**
 * Admit and execute the bounded Teatro 0.1 Player → Ear → Csound scenario.
 * The Player owns this runtime. Teatro authors the semantic scenario; the
 * host supplies the exact admitted source record, Ear AudioWorklet input and
 * Csound control endpoint. Admission is effect-free; start() is explicit.
 */
export function createTeatroScenarioRuntime({
  scenario, player, track, origin, audioContext, earInput, csound,
  sourceIdentity, now = () => globalThis.performance.now()
} = {}) {
  requireThat(scenario?.kind === "CsoundTeatroScenario" &&
    scenario.grammarVersion === "0.1" && scenario.schemaVersion === "0.1",
    "Csound Teatro grammar 0.1 is required");
  requireThat(scenario.scenarioID === EXPECTED_SCENARIO_ID &&
    scenario.status === "candidate-unadmitted" &&
    scenario.mode === "live-rehearsal",
    "unrecognized or already-mutated source candidate");
  requireThat(player && typeof player.connectAudioGraph === "function" &&
    typeof player.disconnectAudioGraph === "function" &&
    typeof player.play === "function" && typeof player.pause === "function" &&
    player.state?.state === "ready" && player.state.paused === true,
    "a selected, host-admitted SatzfunkPlayer track is required");
  requireThat(track?.id === player.state.trackID &&
    track.publicReleaseAuthorized === true &&
    /^[a-f0-9]{64}$/i.test(track.sha256 || ""),
    "source identity must be a digest-pinned released track");
  requireThat(playbackBinding(track, origin).state === "ready",
    "track must be a same-origin released media record");
  requireThat(audioContext && typeof audioContext.resume === "function" &&
    Number.isFinite(audioContext.sampleRate),
    "host AudioContext is unavailable");
  requireThat(earInput?.port && typeof earInput.connect === "function",
    "owner-supplied Ear AudioWorklet input is unavailable");
  requireThat(csound && typeof csound.start === "function" &&
    typeof csound.setParameter === "function" &&
    typeof csound.stop === "function",
    "owner-supplied Csound control endpoint is unavailable");
  requireThat(sourceIdentity === "satzfunk-player:" + track.id + ":" + track.sha256.slice(0, 16),
    "Ear identity must bind to the exact admitted source");

  const entities = new Map((scenario.GIVEN?.entities || []).map(entity => [entity.id, entity]));
  const ports = new Map((scenario.GIVEN?.ports || []).map(port => [port.id, port]));
  const mapping = scenario.TRANSFORM?.mappings?.[0];
  const source = scenario.GIVEN?.source;
  requireThat(entities.get("SatzfunkPlayer.01")?.owner === "Fountain-Coach/SatzfunkPlayer" &&
    entities.get("SatzfunkPlayer.01")?.capability === "SatzfunkPlayerElement.sameOriginPlayback",
    "Player must retain source ownership");
  requireThat(entities.get("Ear.Player.01")?.kind === "EAR" &&
    entities.get("Wind.Field.01")?.kind === "FIELD" &&
    entities.get("Ear.Wind.01")?.kind === "EAR",
    "Ear and Csound FIELD identities do not match the declared topology");
  requireThat(source?.kind === "live-instrument-output" &&
    source.entityID === "SatzfunkPlayer.01" &&
    source.portID === "SatzfunkPlayer.01.audio" &&
    source.recordedFile === null && source.required === true,
    "recorded audio cannot replace Player live PCM");
  requireThat(scenario.TRANSFORM?.relations?.some(relation =>
    relation.predicate === "LISTENS_TO" &&
    relation.subject === "Ear.Player.01" &&
    relation.object === "SatzfunkPlayer.01" &&
    relation.fromPort === "SatzfunkPlayer.01.audio" &&
    relation.toPort === "Ear.Player.01.audio"),
    "live Player PCM → Ear edge is missing");
  requireThat(scenario.TRANSFORM?.relations?.some(relation =>
    relation.predicate === "MODULATES" &&
    relation.subject === "Ear.Player.01" &&
    relation.object === "Wind.Field.01" &&
    relation.fromPort === "Ear.Player.01.rms" &&
    relation.toPort === "Wind.Field.01.wind_mix"),
    "Ear RMS → Csound FIELD edge is missing");
  requireThat(ports.get("Ear.Player.01.rms")?.unit === "normalized-linear-rms" &&
    validRange(ports.get("Ear.Player.01.rms")?.domain) &&
    ports.get("Wind.Field.01.wind_mix")?.unit === "normalized" &&
    validRange(ports.get("Wind.Field.01.wind_mix")?.domain),
    "numeric port units or domains are invalid");
  requireThat(mapping?.predicate === "MAPS_TO" &&
    mapping.sourcePort === "Ear.Player.01.rms" &&
    mapping.targetPort === "Wind.Field.01.wind_mix" &&
    mapping.transfer === "linear" && mapping.interpolation === "linear" &&
    mapping.updateMode === "event" && mapping.clamp === true &&
    Number.isInteger(mapping.minimumIntervalMilliseconds) &&
    mapping.minimumIntervalMilliseconds >= 75 &&
    JSON.stringify(mapping.sourceDomain) === JSON.stringify(ports.get("Ear.Player.01.rms").domain) &&
    JSON.stringify(mapping.targetDomain) === JSON.stringify(ports.get("Wind.Field.01.wind_mix").domain),
    "unsupported or unbounded RMS mapping");
  requireThat(scenario.CONSTRAINTS?.requiresAdmissionBeforeEffects === true &&
    scenario.CONSTRAINTS?.liveSourceRequired === true &&
    scenario.CONSTRAINTS?.recordingAsSourceForbidden === true &&
    scenario.CONSTRAINTS?.autoplayForbidden === true &&
    scenario.CONSTRAINTS?.uncontrolledFeedbackForbidden === true &&
    scenario.CONSTRAINTS?.publicPublicationAuthorized === false,
    "required safety or release boundaries were removed");
  requireThat(scenario.TRANSFORM?.midi2?.status?.startsWith("not-used;") &&
    scenario.EXPECT?.midi2EventsCorrelated === false &&
    scenario.VERIFY?.noMIDI2AdmissionClaimFromThisCandidate === true,
    "this audio path must not claim a MIDI 2.0 Player operation");

  const receipt = Object.freeze({
    schema: "fountaincoach.satzfunk-player.teatro-admission.v0.1",
    authority: "Fountain-Coach/SatzfunkPlayer",
    scenarioID: scenario.scenarioID,
    grammarVersion: scenario.grammarVersion,
    source: Object.freeze({ trackID: track.id, sha256: track.sha256 }),
    bindings: Object.freeze({
      player: "SatzfunkPlayerElement.sameOriginPlayback",
      earInput: sourceIdentity,
      csoundControl: "BookCsoundHost.setParameter:wind_mix"
    }),
    mapping: Object.freeze({
      source: mapping.sourcePort,
      target: mapping.targetPort,
      sourceDomain: Object.freeze([...mapping.sourceDomain]),
      targetDomain: Object.freeze([...mapping.targetDomain]),
      minimumIntervalMilliseconds: mapping.minimumIntervalMilliseconds
    }),
    admittedAt: now()
  });

  let started = false;
  let stopped = false;
  let csoundStarted = false;
  let lastObservationAt = -Infinity;
  let writes = 0;
  let rejected = 0;
  let inFlight = false;
  const observations = [];
  const measurementHandler = event => {
    const message = event?.data;
    if (message?.type !== "ear.ump" ||
        message.event?.sourceIdentity !== sourceIdentity) return;
    const rms = message.event?.measurement?.rms;
    const observedAt = now();
    if (!Number.isFinite(rms) || rms < 0 ||
        observedAt - lastObservationAt < mapping.minimumIntervalMilliseconds) return;
    lastObservationAt = observedAt;
    const value = clamp(rms / mapping.sourceDomain[1]);
    const target = mapping.targetDomain[0] +
      value * (mapping.targetDomain[1] - mapping.targetDomain[0]);
    if (inFlight) { rejected++; return; }
    inFlight = true;
    void csound.setParameter("wind_mix", target).then(() => {
      writes++;
      if (observations.length < 128) observations.push(Object.freeze({
        sourceIdentity, rms, normalized: value, windMix: target, observedAt
      }));
    }).catch(() => { rejected++; }).finally(() => { inFlight = false; });
  };

  return Object.freeze({
    receipt,
    get state() {
      return Object.freeze({
        state: stopped ? "stopped" : started ? "running" : "admitted",
        observations: observations.length,
        writes,
        rejected
      });
    },
    async start() {
      if (stopped) throw new Error("Scenario runtime is stopped");
      if (started) return this.state;
      // Receipt and all topology checks exist before any effect is enabled.
      try {
        await audioContext.resume();
        await csound.start(() => {});
        csoundStarted = true;
        await csound.setParameter("wind_mix", mapping.targetDomain[0]);
        const sourceNode = player.connectAudioGraph(audioContext, earInput);
        sourceNode.connect(audioContext.destination);
        earInput.port.addEventListener?.("message", measurementHandler);
        if (!earInput.port.addEventListener) earInput.port.onmessage = measurementHandler;
        earInput.port.start?.();
        started = true;
        await player.play(); // Called only by the host's explicit user gesture.
        return this.state;
      } catch (error) {
        await this.stop();
        throw error;
      }
    },
    async stop() {
      if (stopped) return this.state;
      stopped = true;
      earInput.port.removeEventListener?.("message", measurementHandler);
      if (!earInput.port.removeEventListener && earInput.port.onmessage === measurementHandler) {
        earInput.port.onmessage = null;
      }
      player.pause();
      player.disconnectAudioGraph();
      if (csoundStarted) {
        await csound.setParameter("wind_mix", mapping.targetDomain[0]).catch(() => {});
        await csound.stop();
        csoundStarted = false;
      }
      return this.state;
    }
  });
}
