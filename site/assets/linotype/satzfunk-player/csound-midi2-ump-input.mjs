import { decodeUmp } from "./midi2-codec.mjs";

const clamp = (value, range) => Math.max(range[0], Math.min(range[1], value));

/**
 * Bounded software UMP input adapter for the Csound wind FIELD.
 * It decodes owner-library UMP packets and only then applies channel control.
 * This is an in-process software peer; it is not a native MIDI port/device.
 */
export function createCsoundMidi2UmpInput({
  setControlChannel,
  scenarioID,
  runID,
  sourceIdentity,
  parameter = "wind_mix",
  valueDomain = [0.25, 1.0],
  now = () => globalThis.performance.now()
} = {}) {
  if (typeof setControlChannel !== "function") throw new TypeError("Csound control-channel writer required");
  if (typeof scenarioID !== "string" || !scenarioID.trim() ||
      typeof runID !== "string" || !runID.trim() ||
      typeof sourceIdentity !== "string" || !sourceIdentity.trim()) {
    throw new TypeError("Scenario, run, and source identities are required");
  }
  if (!Array.isArray(valueDomain) || valueDomain.length !== 2 ||
      !valueDomain.every(Number.isFinite) || valueDomain[0] >= valueDomain[1]) {
    throw new TypeError("A finite increasing Csound value domain is required");
  }
  let active = true;
  let lastSequence = 0;
  const accepted = [];

  return Object.freeze({
    async acceptUmp(words, correlation = {}) {
      if (!active) return Object.freeze({ accepted: false, reason: "stopped" });
      if (correlation.scenarioID !== scenarioID || correlation.runID !== runID ||
          correlation.sourceIdentity !== sourceIdentity ||
          !Number.isInteger(correlation.sequence) || correlation.sequence <= lastSequence) {
        return Object.freeze({ accepted: false, reason: "correlation" });
      }
      let event;
      try { event = decodeUmp(words, now()); }
      catch { return Object.freeze({ accepted: false, reason: "invalid-ump" }); }
      if (event?.kind !== "controlChange" || event.group !== 0 ||
          event.channel !== 0 || event.controller !== 74 ||
          !Number.isInteger(event.value) || event.value < 0 || event.value > 0xffffffff) {
        return Object.freeze({ accepted: false, reason: "unsupported-ump-operation" });
      }
      const normalized = event.value / 0xffffffff;
      const value = clamp(valueDomain[0] + normalized * (valueDomain[1] - valueDomain[0]), valueDomain);
      await setControlChannel(parameter, value);
      lastSequence = correlation.sequence;
      const receipt = Object.freeze({
        scenarioID, runID, sourceIdentity, sequence: correlation.sequence,
        kind: event.kind, group: event.group, channel: event.channel,
        controller: event.controller, umpValue: event.value,
        parameter, value, appliedAt: now()
      });
      if (accepted.length < 256) accepted.push(receipt);
      return Object.freeze({ accepted: true, receipt });
    },
    get evidence() { return Object.freeze([...accepted]); },
    stop() { active = false; }
  });
}
