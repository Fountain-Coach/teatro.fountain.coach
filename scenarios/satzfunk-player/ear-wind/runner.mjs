const track = Object.freeze({
  id: "satzfunk:shaders:40479",
  title: "Shaders · Track 4",
  source: "https://benedikteickhoff1.bandcamp.com/album/shaders",
  videoId: "40479",
  media: "/media/bandcamp-20261024/shaders/40479.mp4",
  sha256: "24abb318154118c6e0bd182fdb1e9ea0260d4c207e51e878efa2143181b670f9",
  bytes: 5813335,
  publicReleaseAuthorized: true,
  publishedCopy: "recovered-as-published-bandcamp-rendition",
  owner: "Fountain-Coach/Satzfunk"
});

const statusNode = document.querySelector("#scenario-status");
const evidenceNode = document.querySelector("#scenario-evidence");
const prepareButton = document.querySelector("#scenario-prepare");
const startButton = document.querySelector("#scenario-start");
const stopButton = document.querySelector("#scenario-stop");
const player = document.querySelector("satzfunk-player");
const stageMount = location.pathname.startsWith("/teatro/");
const assetBase = stageMount ? "/teatro/first-hearing-assets" : "/assets";
const mediaBasePrefix = stageMount ? "/teatro/" : "/";
const sourceIdentity = `satzfunk-player:${track.id}:${track.sha256.slice(0, 16)}`;
let runtime = null;
let earContext = null;
let csoundHost = null;
let csoundInput = null;
let updateTimer = null;
let stopping = false;
let outputEarWindows = 0;

function status(value) { statusNode.textContent = value; }

function report() {
  const state = runtime?.state ?? { state: "not-admitted", observations: 0, writes: 0, umpOperations: 0, rejected: 0 };
  const evidence = csoundInput?.evidence ?? [];
  const latest = evidence.at(-1) ?? null;
  if (runtime) {
    document.querySelector("#scenario-stage")?.contentWindow?.postMessage({
      type: "fountain.teatro.scenario-projection.v1",
      source: "Fountain-Coach/SatzfunkPlayer",
      scenarioID: "teatro.satzfunk-player-ear-wind.01",
      runID: runtime.receipt.run.runID,
      state: state.state,
      sourceIdentity,
      sourceSHA256: track.sha256,
      exactPublicAssetBytesVerified: true,
      windMix: latest?.value ?? null,
      acceptedSoftwareUmpOperations: state.umpOperations,
      hardwareInteroperability: false,
      midiCiStatus: "envelope-codec-only; no live discovery or negotiation"
    }, location.origin);
  }
  evidenceNode.textContent = JSON.stringify({
    scenarioID: "teatro.satzfunk-player-ear-wind.01",
    grammarVersion: "0.1",
    state,
    source: { trackID: track.id, sha256: track.sha256, exactPublicAssetBytesVerified: true },
    run: runtime?.receipt?.run ?? null,
    midi2: {
      acceptedSoftwareUmpOperations: state.umpOperations,
      latestDecodedAndAppliedOperation: latest && {
        group: latest.group, channel: latest.channel, controller: latest.controller,
        value: latest.value, sequence: latest.sequence, runID: latest.runID
      },
      transport: "same-origin in-process software UMP peer",
      hardwareInteroperability: false,
      midiCi: "envelope codec available; no live discovery or negotiation"
    },
    csound: { outputEarRmsWindows: outputEarWindows, parameter: "wind_mix" }
  }, null, 2);
}

async function prepare() {
  prepareButton.disabled = true;
  status("Checking secure origin and exact public source bytes…");
  if (!globalThis.isSecureContext) throw new Error("Open this staged page through the secure localhost tunnel before preparing audio.");
  const raw = await fetch(`${mediaBasePrefix}media/bandcamp-20261024/shaders/40479.mp4`, { cache: "no-store" });
  if (!raw.ok) throw new Error(`Published source unavailable on this stage (${raw.status}).`);
  const bytes = new Uint8Array(await raw.arrayBuffer());
  const digest = [...new Uint8Array(await crypto.subtle.digest("SHA-256", bytes))].map(value => value.toString(16).padStart(2, "0")).join("");
  if (bytes.byteLength !== track.bytes || digest !== track.sha256) {
    throw new Error("Staged source bytes do not match the authorized Satzfunk catalog identity.");
  }
  await import(new URL(`${assetBase}/linotype/midi2-bootstrap.mjs`, location.origin));
  const {
    createCsoundMidi2UmpInput,
    registerSatzfunkPlayer
  } = await import(new URL(`${assetBase}/linotype/satzfunk-player/index.mjs`, location.origin));
  registerSatzfunkPlayer();
  player.setEdition({
    origin: location.origin,
    mediaBasePrefix,
    tracks: [track],
    activeTrackID: track.id
  });
  if (player.state.state !== "ready") throw new Error("SatzfunkPlayer refused the published source record.");
  const playerReady = new Promise((resolve, reject) => {
    if (player.shadowRoot?.querySelector("video")?.readyState >= 1) return resolve();
    const timeout = setTimeout(() => reject(new Error("Player media metadata did not load.")), 15000);
    player.addEventListener("satzfunkplayer:ready", () => { clearTimeout(timeout); resolve(); }, { once: true });
    player.addEventListener("satzfunkplayer:refused", event => {
      clearTimeout(timeout);
      reject(new Error(`Player refused source: ${event.detail?.reason ?? "unknown"}`));
    }, { once: true });
  });
  await playerReady;
  const C = globalThis.AudioContext ?? globalThis.webkitAudioContext;
  if (!C) throw new Error("Web Audio is unavailable.");
  earContext = new C({ sampleRate: 48000, latencyHint: "interactive" });
  await earContext.audioWorklet.addModule(`${assetBase}/linotype/ear-original.js`);
  const earInput = new AudioWorkletNode(earContext, "ear-analysis", {
    numberOfInputs: 1,
    numberOfOutputs: 1,
    outputChannelCount: [1],
    processorOptions: {
      sourceId: sourceIdentity,
      sourceKind: "HTMLMediaElement",
      sampleRate: earContext.sampleRate,
      windowSamples: 1024,
      hopSamples: 512
    }
  });
  const { BookCsoundHost } = await import(`${assetBase}/book-csound-host.js`);
  csoundHost = new BookCsoundHost();
  const runID = crypto.randomUUID();
  csoundInput = createCsoundMidi2UmpInput({
    setControlChannel: (name, value) => csoundHost.setParameter(name, value),
    scenarioID: "teatro.satzfunk-player-ear-wind.01",
    runID,
    sourceIdentity
  });
  const csound = {
    start: async () => csoundHost.start(event => {
      if (event?.type === "ear.ump" &&
          event.event?.sourceIdentity === "teatro-csound-ear-worklet" &&
          Number.isFinite(event.event?.measurement?.rms)) outputEarWindows++;
    }),
    acceptUmp: (...args) => csoundInput.acceptUmp(...args),
    stop: async () => { csoundInput.stop(); await csoundHost.stop(); }
  };
  const scenarioResponse = await fetch("./scenario.json", { cache: "no-store" });
  if (!scenarioResponse.ok) throw new Error("Canonical Teatro Scenario resource is unavailable.");
  const scenario = await scenarioResponse.json();
  runtime = player.createTeatroScenarioRuntime({
    scenario,
    track,
    origin: location.origin,
    audioContext: earContext,
    earInput,
    csound,
    sourceIdentity,
    runID
  });
  if (runtime.receipt.run.runID !== runID) {
    throw new Error("Scenario admission and Csound input run identities diverged.");
  }
  startButton.disabled = false;
  stopButton.disabled = true;
  status("Admitted. Press Start to route live Player PCM through Ear → typed MIDI 2.0 UMP → Csound.");
  report();
  prepareButton.hidden = true;
}

prepareButton.addEventListener("click", () => {
  void prepare().catch(error => {
    status(`Prepare failed: ${error.message}`);
    prepareButton.disabled = false;
  });
});

startButton.addEventListener("click", () => {
  if (!runtime || runtime.state.state === "running") return;
  startButton.disabled = true;
  status("Starting Player, Ear, and Csound from this explicit user action…");
  void runtime.start().then(() => {
    stopButton.disabled = false;
    status("Live scenario running. Stop remains correlated to this run.");
    updateTimer = setInterval(report, 250);
    report();
  }).catch(error => {
    status(`Start failed and was stopped: ${error.message}`);
    startButton.disabled = false;
    report();
  });
});

async function stopScenario(reason = "Stopped by writer.") {
  if (!runtime || stopping || runtime.state.state === "stopped") return;
  stopping = true;
  clearInterval(updateTimer);
  stopButton.disabled = true;
  await runtime.stop();
  status(reason);
  startButton.disabled = true;
  report();
  stopping = false;
}

stopButton.addEventListener("click", () => { void stopScenario(); });
player.addEventListener("satzfunkplayer:transport", event => {
  if (runtime?.state.state === "running" &&
      ["paused", "ended"].includes(event.detail?.state) && !stopping) {
    void stopScenario("Player playback ended or was paused; scenario stopped.");
  }
});
window.addEventListener("pagehide", () => { void stopScenario("Page closed; scenario stopped."); });
