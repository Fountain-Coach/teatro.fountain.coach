// Node uses the exact pinned dependency symlink created by build:midi2.
// The same-origin browser host preloads this owner library on window before
// importing the instrument package.
const codec = globalThis.FountainCoachMidi2 ??
  await import("@fountain-coach/midi2");

if (typeof codec.encodeControlChange !== "function" ||
    typeof codec.decodeUmp !== "function") {
  throw new TypeError("Pinned MIDI 2.0 UMP codec is unavailable");
}
export const encodeControlChange = codec.encodeControlChange;
export const decodeUmp = codec.decodeUmp;
