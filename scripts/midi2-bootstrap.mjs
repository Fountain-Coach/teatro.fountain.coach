/* Same-origin ESM bootstrap for the immutable Fountain-Coach/midi2 source build. */
import * as FountainCoachMidi2 from "./midi2/index.js";

if (typeof FountainCoachMidi2.encodeControlChange !== "function" ||
    typeof FountainCoachMidi2.decodeUmp !== "function") {
  throw new TypeError("The pinned Fountain-Coach MIDI2 UMP codec failed to load");
}
globalThis.FountainCoachMidi2 = Object.freeze({ ...FountainCoachMidi2 });
