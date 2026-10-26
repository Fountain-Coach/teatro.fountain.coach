/* Linotype host seam for the canonical SatzfunkPlayer package.
   Bootstrap the pinned, same-origin MIDI2 codec before loading the runtime. */
await import("/assets/linotype/midi2-bootstrap.mjs");
const { registerSatzfunkPlayer } = await import("/assets/linotype/satzfunk-player/index.mjs");
registerSatzfunkPlayer();
