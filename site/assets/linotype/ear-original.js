class EarAnalysisProcessor extends AudioWorkletProcessor {
  constructor(options) {
    super(options);
    const config = options?.processorOptions ?? {};
    this.sourceId = config.sourceId ?? "unknown-source";
    this.sourceKind = config.sourceKind ?? "AudioWorklet";
    this.sampleRate = config.sampleRate ?? 48000;
    this.windowSamples = config.windowSamples ?? 1024;
    this.hopSamples = config.hopSamples ?? 512;
    this.buffer = [];
    this.sampleCursor = 0;
    this.timeOrigin = null;
    this.wasSilent = true;
  }

  process(inputs) {
    const channel = inputs[0]?.[0];
    if (!channel) return true;
    if (this.timeOrigin === null) this.timeOrigin = currentTime;
    for (const sample of channel) this.buffer.push(sample);
    while (this.buffer.length >= this.windowSamples) {
      const samples = this.buffer.slice(0, this.windowSamples);
      let sumSquares = 0;
      let peak = 0;
      for (const sample of samples) {
        const value = Math.abs(sample);
        sumSquares += value * value;
        peak = Math.max(peak, value);
      }
      const rms = samples.length === 0 ? 0 : Math.sqrt(sumSquares / samples.length);
      const state = peak >= 0.99 ? "clipping" : rms <= 0.0001 ? "silent" : "running";
      const measurement = { rms, peak, frames: samples.length, state, witness: state === "running" ? "pass" : "fail" };
      const windowStart = this.timeOrigin + this.sampleCursor / this.sampleRate;
      if (state !== "silent") {
        this.port.postMessage({
          type: "ear.ump",
          sourceKind: this.sourceKind,
          event: {
            sourceIdentity: this.sourceId,
            timestamp: windowStart + this.windowSamples / this.sampleRate,
            onset: this.wasSilent,
            group: 0,
            channel: 0,
            note: 48,
            velocity32: Math.round(Math.min(1, rms * 4) * 0xffffffff),
            measurement
          }
        });
      } else {
        this.port.postMessage({ type: "ear.silence", sourceKind: this.sourceKind, measurement });
      }
      this.wasSilent = state === "silent";
      this.buffer = this.buffer.slice(this.hopSamples);
      this.sampleCursor += this.hopSamples;
    }
    return true;
  }
}

registerProcessor("ear-analysis", EarAnalysisProcessor);
