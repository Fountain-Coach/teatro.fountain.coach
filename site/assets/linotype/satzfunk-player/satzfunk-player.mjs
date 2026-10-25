import { playbackBinding } from "./player-media.mjs";
import { createTeatroScenarioRuntime } from "./teatro-scenario-runtime.mjs";

const ELEMENT_NAME = "satzfunk-player";
const MAX_TRACKS = 256;
const EVENT_PREFIX = "satzfunkplayer:";

const fire = (target, name, detail) => target.dispatchEvent(new CustomEvent(EVENT_PREFIX + name, {
  bubbles: true,
  composed: true,
  detail: Object.freeze(detail)
}));

function validTrack(track) {
  return track && typeof track === "object" &&
    typeof track.id === "string" && track.id.trim().length > 0 &&
    typeof track.title === "string" && track.title.trim().length > 0;
}

function customElementBase() {
  return globalThis.HTMLElement ?? class {};
}

/**
 * A reusable, same-origin edition player.
 *
 * The parent supplies edition metadata and explicitly admitted track records.
 * This component presents only media accepted by playbackBinding. It does not
 * decide rights, create publication routes, fetch private media, or implement
 * a MIDI2 transport.
 */
export class SatzfunkPlayerElement extends customElementBase() {
  #tracks = new Map();
  #origin = null;
  #editionPoster = null;
  #activeTrack = null;
  #media = null;
  #audioSourceNode = null;
  #audioGraphDestinations = new Set();
  #root = null;
  #select = null;
  #title = null;
  #status = null;
  #disposed = false;

  static get observedAttributes() { return ["label"]; }

  connectedCallback() {
    if (!this.attachShadow) return;
    if (this.#root) {
      if (this.#activeTrack && !this.#media) this.select(this.#activeTrack.id);
      return;
    }
    this.#root = this.attachShadow({ mode: "open" });
    this.#root.innerHTML = `
      <style>
        :host { display:block; color:inherit; font:inherit; }
        .player { display:grid; gap:.65rem; }
        .heading { display:flex; align-items:baseline; justify-content:space-between; gap:1rem; }
        .title { margin:0; font:inherit; font-weight:600; }
        .status { margin:0; color:currentColor; opacity:.72; font-size:.875em; }
        .sr-only { position:absolute; width:1px; height:1px; padding:0; margin:-1px;
          overflow:hidden; clip:rect(0,0,0,0); white-space:nowrap; border:0; }
        select, audio, video { width:100%; }
        video { max-height:min(70vh, 42rem); background:#111; }
      </style>
      <section class="player" aria-label="SatzfunkPlayer">
        <div class="heading">
          <p class="title" part="title"></p>
          <p class="status" part="status" aria-live="polite">No track selected</p>
        </div>
        <label>
          <span class="sr-only">Track</span>
          <select part="track-select" aria-label="Track"></select>
        </label>
        <div part="media"></div>
      </section>`;
    const label = this.getAttribute?.("label");
    this.#root.querySelector("section").setAttribute("aria-label", label || "SatzfunkPlayer");
    this.#title = this.#root.querySelector(".title");
    this.#status = this.#root.querySelector(".status");
    this.#select = this.#root.querySelector("select");
    this.#select.addEventListener("change", () => this.select(this.#select.value));
    this.#status.textContent = "No track selected";
    if (this.#activeTrack) this.select(this.#activeTrack.id);
  }

  disconnectedCallback() {
    this.#disposeMedia();
  }

  attributeChangedCallback(name, _oldValue, value) {
    if (name === "label" && this.#root) {
      this.#root.querySelector("section").setAttribute("aria-label", value || "SatzfunkPlayer");
    }
  }

  /**
   * Bind a host-owned edition list. Authorization remains a host assertion;
   * the player enforces same-origin URL shape and refuses unadmitted records.
   */
  setEdition({ origin, tracks, editionPoster = null, activeTrackID = null } = {}) {
    if (this.#disposed) throw new Error("SatzfunkPlayer is disposed");
    if (typeof origin !== "string" || !Array.isArray(tracks) || tracks.length > MAX_TRACKS ||
        !tracks.every(validTrack) || new Set(tracks.map(t => t.id)).size !== tracks.length) {
      throw new TypeError("Expected an origin and up to 256 uniquely identified tracks");
    }
    // Validate the origin before storing it.
    let parsedOrigin;
    try {
      const parsed = new URL(origin);
      if (parsed.protocol !== "https:" || parsed.username || parsed.password) {
        throw new TypeError("HTTPS origin without credentials is required");
      }
      parsedOrigin = parsed.origin;
    } catch {
      throw new TypeError("A valid HTTPS origin is required");
    }
    const nextTracks = new Map(tracks.map(track => [track.id, Object.freeze({ ...track })]));
    const initial = activeTrackID ?? tracks[0]?.id ?? null;
    if (initial !== null && !nextTracks.has(initial)) {
      throw new RangeError("Initial track identity is not present in the edition");
    }
    this.#origin = parsedOrigin;
    this.#editionPoster = editionPoster;
    this.#tracks = nextTracks;
    this.#renderOptions();
    if (initial !== null) {
      if (this.#root) return this.select(initial);
      this.#activeTrack = nextTracks.get(initial);
      return Object.freeze({ state: "unmounted", trackID: initial });
    }
    this.#disposeMedia();
    this.#activeTrack = null;
    if (this.#title) this.#title.textContent = "";
    this.#setStatus("No track selected");
    return { state: "empty" };
  }

  get state() {
    if (!this.#activeTrack || !this.#media) return Object.freeze({ state: "empty" });
    return Object.freeze({
      state: "ready",
      trackID: this.#activeTrack.id,
      currentTime: Number.isFinite(this.#media.currentTime) ? this.#media.currentTime : 0,
      duration: Number.isFinite(this.#media.duration) ? this.#media.duration : null,
      paused: this.#media.paused
    });
  }

  /** Select a source-bound track. Does not autoplay. */
  select(trackID) {
    const track = this.#tracks.get(trackID);
    if (!track) throw new RangeError("Unknown track identity");
    const binding = playbackBinding(track, this.#origin, this.#editionPoster);
    this.#disposeMedia();
    this.#activeTrack = track;
    this.#renderOptions();
    if (this.#title) this.#title.textContent = track.title;
    if (binding.state !== "ready") {
      this.#setStatus(binding.state === "unreleased" ? "Not released for public playback" : "Media unavailable");
      fire(this, "refused", { reason: binding.state, trackID });
      return Object.freeze({ state: binding.state, trackID });
    }

    if (!this.#root) return Object.freeze({ state: "unmounted", trackID });
    const media = document.createElement(/\.(mp4|webm)$/i.test(binding.media) ? "video" : "audio");
    media.controls = true;
    media.preload = "metadata";
    media.src = binding.media;
    if (binding.poster && media instanceof HTMLVideoElement) media.poster = binding.poster;
    media.addEventListener("loadedmetadata", () => {
      if (this.#media !== media) return;
      this.#setStatus("Ready");
      fire(this, "ready", { trackID, duration: Number.isFinite(media.duration) ? media.duration : null });
    });
    media.addEventListener("play", () => fire(this, "transport", { trackID, state: "playing" }));
    media.addEventListener("pause", () => fire(this, "transport", { trackID, state: "paused" }));
    media.addEventListener("timeupdate", () => fire(this, "position", {
      trackID, currentTime: media.currentTime, duration: Number.isFinite(media.duration) ? media.duration : null
    }));
    media.addEventListener("ended", () => fire(this, "transport", { trackID, state: "ended" }));
    media.addEventListener("error", () => {
      if (this.#media !== media) return;
      this.#setStatus("Media unavailable");
      fire(this, "refused", { reason: "media-error", trackID });
    });
    this.#media = media;
    this.#root.querySelector('[part="media"]').replaceChildren(media);
    this.#setStatus("Loading");
    fire(this, "track", { trackID, media: binding.media, poster: binding.poster });
    return Object.freeze({ state: "ready", trackID, media: binding.media, poster: binding.poster });
  }

  /**
   * Connect live playback PCM to an owner-supplied Web Audio graph, such as
   * Ear's AudioWorklet input. The host owns the AudioContext and routing.
   */
  connectAudioGraph(audioContext, destination = audioContext?.destination) {
    this.#requireMedia();
    if (!audioContext || typeof audioContext.createMediaElementSource !== "function" ||
        !destination || typeof destination.connect !== "function") {
      throw new TypeError("An AudioContext and destination AudioNode are required");
    }
    if (!this.#audioSourceNode) {
      this.#audioSourceNode = audioContext.createMediaElementSource(this.#media);
    }
    if (!this.#audioGraphDestinations.has(destination)) {
      this.#audioSourceNode.connect(destination);
      this.#audioGraphDestinations.add(destination);
    }
    fire(this, "audio-output", {
      trackID: this.#activeTrack.id,
      sampleRate: Number.isFinite(audioContext.sampleRate) ? audioContext.sampleRate : null
    });
    return this.#audioSourceNode;
  }

  disconnectAudioGraph(destination = null) {
    if (!this.#audioSourceNode) return false;
    if (destination) {
      this.#audioSourceNode.disconnect(destination);
      this.#audioGraphDestinations.delete(destination);
    } else {
      this.#audioSourceNode.disconnect();
      this.#audioGraphDestinations.clear();
    }
    return true;
  }

  /**
   * Admit the authored Teatro scenario against this selected Player source.
   * The returned runtime is effect-free until its explicit start() call.
   */
  createTeatroScenarioRuntime(config = {}) {
    this.#requireMedia();
    return createTeatroScenarioRuntime({ ...config, player: this });
  }

  /** Invoke from an explicit user action or an already-authorized host action. */
  async play() {
    this.#requireMedia();
    await this.#media.play();
    return this.state;
  }

  pause() {
    this.#requireMedia();
    this.#media.pause();
    return this.state;
  }

  seek(seconds) {
    this.#requireMedia();
    if (!Number.isFinite(seconds) || seconds < 0) throw new RangeError("Seek time must be a nonnegative finite number");
    if (Number.isFinite(this.#media.duration) && seconds > this.#media.duration) {
      throw new RangeError("Seek time exceeds the selected media duration");
    }
    this.#media.currentTime = seconds;
    fire(this, "seek", { trackID: this.#activeTrack.id, currentTime: seconds });
    return this.state;
  }

  dispose() {
    this.#disposeMedia();
    this.#tracks.clear();
    this.#origin = null;
    this.#editionPoster = null;
    this.#activeTrack = null;
    this.#disposed = true;
  }

  #requireMedia() {
    if (!this.#media || !this.#activeTrack) throw new Error("No admitted track is selected");
  }

  #setStatus(message) {
    if (this.#status) this.#status.textContent = message;
  }

  #renderOptions() {
    if (!this.#select) return;
    const options = [...this.#tracks.values()].map(track => {
      const option = document.createElement("option");
      option.value = track.id;
      option.textContent = track.title;
      return option;
    });
    this.#select.replaceChildren(...options);
    this.#select.disabled = options.length === 0;
    if (this.#activeTrack) this.#select.value = this.#activeTrack.id;
  }

  #disposeMedia() {
    this.disconnectAudioGraph();
    this.#audioSourceNode = null;
    if (!this.#media) return;
    this.#media.pause();
    this.#media.removeAttribute("src");
    this.#media.load();
    this.#media.remove();
    this.#media = null;
  }
}

/** Register explicitly so import alone has no global browser side effect. */
export function registerSatzfunkPlayer(registry = globalThis.customElements) {
  if (!registry) throw new Error("Custom Elements are unavailable in this runtime");
  if (!registry.get(ELEMENT_NAME)) registry.define(ELEMENT_NAME, SatzfunkPlayerElement);
  return registry.get(ELEMENT_NAME);
}
