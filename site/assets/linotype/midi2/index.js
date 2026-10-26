// src/clock.ts
function createBrowserClock() {
  const perf = typeof performance !== "undefined" ? performance : { now: () => Date.now() };
  return {
    now: () => perf.now(),
    setTimer: (at, cb) => {
      const delay = Math.max(0, at - perf.now());
      return setTimeout(cb, delay);
    },
    cancelTimer: (id) => clearTimeout(id)
  };
}
function createAudioContextClock(ctx) {
  return {
    now: () => ctx.currentTime * 1e3,
    setTimer: (at, cb) => {
      const delayMs = Math.max(0, at - ctx.currentTime * 1e3);
      return setTimeout(cb, delayMs);
    },
    cancelTimer: (id) => clearTimeout(id)
  };
}
function createWorkerClock() {
  if (typeof Worker === "undefined" || typeof URL === "undefined" || typeof Blob === "undefined") {
    throw new Error("Worker clock is unavailable in this environment.");
  }
  const workerSource = `
    const timers = new Map();
    self.onmessage = evt => {
      const { type, id, delay } = evt.data || {};
      if (type === "set") {
        const handle = setTimeout(() => {
          timers.delete(id);
          self.postMessage({ type: "fire", id });
        }, Math.max(0, delay));
        timers.set(id, handle);
      } else if (type === "cancel") {
        const handle = timers.get(id);
        if (handle !== undefined) {
          clearTimeout(handle);
          timers.delete(id);
        }
      }
    };
  `;
  const blob = new Blob([workerSource], { type: "application/javascript" });
  const worker = new Worker(URL.createObjectURL(blob), { name: "midi2-clock" });
  const perf = typeof performance !== "undefined" ? performance : { now: () => Date.now() };
  const callbacks = /* @__PURE__ */ new Map();
  let nextId = 1;
  worker.onmessage = (evt) => {
    if (!evt.data || evt.data.type !== "fire") {
      return;
    }
    const cb = callbacks.get(evt.data.id);
    if (cb) {
      callbacks.delete(evt.data.id);
      cb();
    }
  };
  return {
    now: () => perf.now(),
    setTimer: (at, cb) => {
      const id = nextId++;
      callbacks.set(id, cb);
      const delay = Math.max(0, at - perf.now());
      worker.postMessage({ type: "set", id, delay });
      return id;
    },
    cancelTimer: (id) => {
      callbacks.delete(id);
      worker.postMessage({ type: "cancel", id });
    }
  };
}

// src/scheduler.ts
var Midi2Scheduler = class {
  constructor(clock, options) {
    this.handlers = /* @__PURE__ */ new Set();
    this.queue = [];
    this.timer = null;
    this.nextId = 1;
    this.clock = clock;
    this.jitterToleranceMs = options?.jitterToleranceMs ?? 0.5;
    this.jitterReduction = options?.jitterReduction;
  }
  onEvent(handler) {
    this.handlers.add(handler);
    return () => this.handlers.delete(handler);
  }
  schedule(event, at) {
    const id = this.nextId++;
    let timestamp = event.timestamp ?? at;
    if (this.jitterReduction) {
      if (event.kind === "utility" && (event.status === "jrClock" || event.status === "jrTimestamp")) {
        const abs = this.jitterReduction.handle(event, at);
        if (abs !== null) timestamp = abs;
      } else {
        const projected = this.jitterReduction.toAbsoluteTime(event.group ?? 0);
        if (projected !== null) timestamp = projected;
      }
    }
    const payload = { ...event, timestamp };
    const item = { id, time: at, event: payload };
    this.insert(item);
    this.armNext();
    return id;
  }
  cancel(id) {
    const idx = this.queue.findIndex((item) => item.id === id);
    if (idx === -1) {
      return false;
    }
    const removedHead = idx === 0;
    this.queue.splice(idx, 1);
    if (removedHead) {
      this.armNext();
    }
    return true;
  }
  clear() {
    this.queue = [];
    if (this.timer !== null) {
      this.clock.cancelTimer(this.timer);
      this.timer = null;
    }
  }
  dispatchDue() {
    const now = this.clock.now();
    const cutoff = now + this.jitterToleranceMs;
    while (this.queue.length && this.queue[0].time <= cutoff) {
      const { event } = this.queue.shift();
      this.emit(event);
    }
    this.armNext();
  }
  emit(event) {
    for (const handler of this.handlers) {
      try {
        handler(event);
      } catch (err) {
        console.error("midi2: handler threw", err);
      }
    }
  }
  insert(item) {
    if (!this.queue.length || item.time >= this.queue[this.queue.length - 1].time) {
      this.queue.push(item);
      return;
    }
    const idx = this.queue.findIndex((q) => item.time < q.time);
    if (idx === -1) {
      this.queue.push(item);
    } else {
      this.queue.splice(idx, 0, item);
    }
  }
  armNext() {
    if (this.timer !== null) {
      this.clock.cancelTimer(this.timer);
      this.timer = null;
    }
    if (!this.queue.length) {
      return;
    }
    const next = this.queue[0];
    const now = this.clock.now();
    if (next.time <= now + this.jitterToleranceMs) {
      this.dispatchDue();
      return;
    }
    this.timer = this.clock.setTimer(next.time, () => {
      this.timer = null;
      this.dispatchDue();
    });
  }
};

// src/sysex.ts
var SYSEX7_MT = 3;
var SYSEX8_MT = 5;
var SYSEX7_MAX_CHUNK = 6;
var SYSEX8_MAX_CHUNK = 14;
var MAX_PAYLOAD_LENGTH = 65535;
function assertManufacturerId(id) {
  if (id.length === 1) {
    if (id[0] === 0) throw new RangeError("1-byte manufacturer ID cannot be 0x00.");
  } else if (id.length === 3) {
    if (id[0] !== 0) throw new RangeError("3-byte manufacturer ID must start with 0x00.");
  } else {
    throw new RangeError("Manufacturer ID must be length 1 or 3 bytes.");
  }
}
function toUint8Array(data) {
  return data instanceof Uint8Array ? data : Uint8Array.from(data);
}
function bytesToWords(bytes) {
  if (bytes.byteLength % 4 !== 0) {
    throw new RangeError("UMP packets must be a multiple of 4 bytes.");
  }
  const view = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
  const words = new Uint32Array(bytes.byteLength / 4);
  for (let i = 0; i < words.length; i++) {
    words[i] = view.getUint32(i * 4, false);
  }
  return words;
}
function wordsToBytes(words) {
  if (words instanceof Uint8Array) {
    return words;
  }
  const out = new Uint8Array(words.length * 4);
  const view = new DataView(out.buffer);
  Array.from(words).forEach((word, idx) => view.setUint32(idx * 4, Number(word) >>> 0, false));
  return out;
}
function fragmentSysex(kind, manufacturerId, payload, group = 0) {
  assertManufacturerId(manufacturerId);
  const data = toUint8Array(payload);
  if (data.length > MAX_PAYLOAD_LENGTH) {
    throw new RangeError("SysEx payload too long.");
  }
  if (!Number.isInteger(group) || group < 0 || group > 15) {
    throw new RangeError("Invalid group for SysEx fragmentation.");
  }
  const header = Uint8Array.from(manufacturerId);
  const message = new Uint8Array(header.length + data.length);
  message.set(header, 0);
  message.set(data, header.length);
  const packets = [];
  const maxChunk = kind === "sysex7" ? SYSEX7_MAX_CHUNK : SYSEX8_MAX_CHUNK;
  const mt = kind === "sysex7" ? SYSEX7_MT : SYSEX8_MT;
  let index = 0;
  let packetIndex = 0;
  const totalChunks = Math.ceil(message.length / maxChunk);
  while (index < message.length) {
    const remaining = message.length - index;
    const chunkSize = Math.min(maxChunk, remaining);
    const chunk = message.slice(index, index + chunkSize);
    let status;
    if (totalChunks === 1) status = 0;
    else if (packetIndex === 0) status = 1;
    else if (remaining <= maxChunk) status = 3;
    else status = 2;
    const payloadBytes = kind === "sysex7" ? 8 : 16;
    const packet = new Uint8Array(payloadBytes);
    packet[0] = mt << 4 | group & 15;
    packet[1] = status << 4 | chunk.length;
    packet.set(chunk, 2);
    packets.push(bytesToWords(packet));
    index += chunkSize;
    packetIndex += 1;
  }
  return packets;
}
function reassembleSysex(kind, packets) {
  if (!packets.length) {
    throw new RangeError("SysEx sequence is empty.");
  }
  if (packets.length > 65535) {
    throw new RangeError("SysEx sequence too long.");
  }
  const mt = kind === "sysex7" ? SYSEX7_MT : SYSEX8_MT;
  const maxChunk = kind === "sysex7" ? SYSEX7_MAX_CHUNK : SYSEX8_MAX_CHUNK;
  const bytesPerPacket = kind === "sysex7" ? 8 : 16;
  let group;
  const collected = [];
  packets.forEach((packetWords, idx) => {
    const bytes = wordsToBytes(packetWords);
    if (bytes.length !== bytesPerPacket) {
      throw new RangeError(`Expected ${bytesPerPacket} bytes per packet.`);
    }
    const mtField = bytes[0] >> 4;
    if (mtField !== mt) {
      throw new RangeError(`Unexpected message type 0x${mtField.toString(16)} in SysEx stream.`);
    }
    const packetGroup = bytes[0] & 15;
    group = group ?? packetGroup;
    if (group !== packetGroup) {
      throw new RangeError("Mixed groups in SysEx sequence.");
    }
    const status = bytes[1] >> 4;
    const count = bytes[1] & 15;
    if (count > maxChunk) {
      throw new RangeError("Invalid chunk length in SysEx packet.");
    }
    if (status === 0 && packets.length !== 1) {
      throw new RangeError("Complete SysEx7/8 must be a single packet.");
    }
    const data = Array.from(bytes.slice(2, 2 + maxChunk)).slice(0, count);
    collected.push(...data);
    switch (status) {
      case 0:
        if (packets.length !== 1) throw new RangeError("Unexpected packet count for complete SysEx.");
        break;
      case 1:
        if (idx !== 0) throw new RangeError("Start packet not first in sequence.");
        break;
      case 2:
        if (idx === 0 || idx === packets.length - 1) throw new RangeError("Continue packet in invalid position.");
        break;
      case 3:
        if (idx !== packets.length - 1) throw new RangeError("End packet not last in sequence.");
        break;
      default:
        throw new RangeError("Invalid SysEx packet status.");
    }
  });
  if (!collected.length) {
    throw new RangeError("SysEx message payload is empty.");
  }
  const manufacturerId = collected[0] === 0 ? collected.slice(0, 3) : [collected[0]];
  assertManufacturerId(manufacturerId);
  const payload = collected.slice(manufacturerId.length);
  return { manufacturerId, payload: Uint8Array.from(payload), group: group ?? 0 };
}
function fragmentSysEx7(manufacturerId, payload, group = 0) {
  return fragmentSysex("sysex7", manufacturerId, payload, group);
}
function reassembleSysEx7(packets) {
  return reassembleSysex("sysex7", packets);
}
function fragmentSysEx8(manufacturerId, payload, group = 0) {
  return fragmentSysex("sysex8", manufacturerId, payload, group);
}
function reassembleSysEx8(packets) {
  return reassembleSysex("sysex8", packets);
}
function wordsToUMPBytes(words) {
  return wordsToBytes(words);
}
function umpBytesToWords(bytes) {
  return bytesToWords(bytes);
}

// src/midici.ts
var MIDI_CI_SUB_ID1 = 13;
function scopeByte(scope) {
  return scope === "realtime" ? 127 : 126;
}
function encodeMidiCiEvent(event) {
  const scope = scopeByte(event.scope);
  const header = event.format === "sysex7" ? Uint8Array.from([scope, MIDI_CI_SUB_ID1, event.subId2 & 127, event.version & 127]) : Uint8Array.from([scope, MIDI_CI_SUB_ID1, event.subId2, event.version]);
  const payload = new Uint8Array(header.length + event.payload.length);
  payload.set(header, 0);
  payload.set(event.payload, header.length);
  return event.format === "sysex7" ? fragmentSysEx7([scope], payload, event.group) : fragmentSysEx8([scope], payload, event.group);
}
function decodeMidiCiFromSysEx(event) {
  if (event.manufacturerId.length !== 1) {
    return null;
  }
  const mfg = event.manufacturerId[0];
  if (mfg !== 126 && mfg !== 127) {
    return null;
  }
  const data = event.payload;
  if (data.length < 4) {
    return null;
  }
  if (data[0] !== mfg || data[1] !== MIDI_CI_SUB_ID1) {
    return null;
  }
  const scope = mfg === 127 ? "realtime" : "nonRealtime";
  const format = event.kind === "sysex7" ? "sysex7" : "sysex8";
  const subId2 = format === "sysex7" ? data[2] & 127 : data[2];
  const version = format === "sysex7" ? data[3] & 127 : data[3];
  const payload = data.slice(4);
  if (payload.length === 0) return null;
  if (subId2 === 6) {
    try {
      const obj = JSON.parse(new TextDecoder().decode(payload));
      if (obj && typeof obj === "object") {
        const vals = Object.values(obj);
        const invalid = vals.some((v) => typeof v !== "number" || v < 0 || v > 1);
        if (invalid) return null;
        if ("messageDataControl" in obj) {
          const mdc = obj["messageDataControl"];
          if (mdc !== 0 && mdc !== 1 && mdc !== 127) return null;
        }
      }
    } catch {
      return null;
    }
  }
  if (subId2 === 9 && payload.length >= 2) {
    const chanCount = payload[1];
    if (chanCount > 16) return null;
    if (payload.length < 2 + chanCount) return null;
  }
  return {
    kind: "midiCi",
    group: event.group,
    scope,
    subId2,
    version,
    payload,
    format,
    timestamp: event.timestamp
  };
}

// src/ump.ts
var MIDI2_CHANNEL_VOICE_MT = 4;
var MIDI1_CHANNEL_VOICE_MT = 2;
var MIDI2_SYSTEM_MT = 1;
var UTILITY_MT = 0;
var STREAM_MT = 15;
var STREAM_OPCODE_ENDPOINT_DISCOVERY = 0;
var STREAM_OPCODE_ENDPOINT_INFO = 1;
var STREAM_OPCODE_DEVICE_IDENTITY = 2;
var STREAM_OPCODE_ENDPOINT_NAME = 3;
var STREAM_OPCODE_PRODUCT_INSTANCE_ID = 4;
var STREAM_OPCODE_STREAM_CONFIG_REQUEST = 5;
var STREAM_OPCODE_STREAM_CONFIG_NOTIFICATION = 6;
var STREAM_OPCODE_FUNCTION_BLOCK_DISCOVERY = 16;
var STREAM_OPCODE_FUNCTION_BLOCK_INFO = 17;
var STREAM_OPCODE_FUNCTION_BLOCK_NAME = 18;
var STREAM_OPCODE_START_OF_CLIP = 32;
var STREAM_OPCODE_END_OF_CLIP = 33;
var STREAM_OPCODE_PROCESS_INQUIRY = 3;
var DATA_STATUS_MDS_HEADER = 8;
var DATA_STATUS_MDS_PAYLOAD = 9;
var STATUS_RPN = 2;
var STATUS_NRPN = 3;
var STATUS_RPN_RELATIVE = 4;
var STATUS_NRPN_RELATIVE = 5;
var STATUS_NOTE_OFF = 8;
var STATUS_NOTE_ON = 9;
var STATUS_POLY_PRESSURE = 10;
var STATUS_CONTROL_CHANGE = 11;
var STATUS_PROGRAM_CHANGE = 12;
var STATUS_CHANNEL_PRESSURE = 13;
var STATUS_PITCH_BEND = 14;
var STATUS_PER_NOTE = 15;
var STATUS_PER_NOTE_PITCH = 0;
var FLEX_STATUS_CLASS = 16;
var FLEX_STATUS_TEMPO = 1;
var FLEX_STATUS_TIMESIG = 2;
var FLEX_STATUS_KEY = 4;
var FLEX_STATUS_METRONOME = 3;
var FLEX_STATUS_CHORD = 5;
var FLEX_CLASS_LYRIC = 17;
var FLEX_STATUS_LYRIC = 2;
var FLEX_CLASS_TEXT = 17;
var FLEX_STATUS_TEXT = 1;
var FLEX_CLASS_RUBY = 17;
var FLEX_STATUS_RUBY = 3;
var FLEX_TEMPO_SCALE = 65536;
var FLEX_TEMPO_MAX_BPM = 4294967295 / FLEX_TEMPO_SCALE;
function assertRange(name, value, min, max) {
  if (!Number.isInteger(value) || value < min || value > max) {
    throw new RangeError(`${name} must be an integer in [${min}, ${max}], got ${value}`);
  }
}
function assertInt32(name, value) {
  if (!Number.isInteger(value) || value < -2147483648 || value > 2147483647) {
    throw new RangeError(`${name} must be a 32-bit signed integer, got ${value}`);
  }
}
function assertUint32(name, value) {
  if (!Number.isInteger(value) || value < 0 || value > 4294967295) {
    throw new RangeError(`${name} must be an integer in [0, 0xFFFFFFFF], got ${value}`);
  }
}
function assertDecodeRange(name, value, min, max) {
  if (value < min || value > max) {
    throw new RangeError(`Invalid ${name}: ${value} (expected [${min}, ${max}])`);
  }
}
function assertTextFits(field, text, maxBytes) {
  const encoded = new TextEncoder().encode(text);
  if (encoded.length > maxBytes) {
    throw new RangeError(`${field} must be <= ${maxBytes} UTF-8 bytes, got ${encoded.length}`);
  }
  return encoded;
}
function toUint32Array(words) {
  return words instanceof Uint32Array ? words : Uint32Array.from(words);
}
function encodeSystemEvent(event) {
  assertRange("group", event.group, 0, 15);
  assertRange("status", event.status, 240, 255);
  const needsData2 = event.status === 242;
  const needsData1 = needsData2 || event.status === 241 || event.status === 243;
  if (needsData1) {
    assertRange("data1", event.data1 ?? 0, 0, 127);
  }
  if (needsData2) {
    assertRange("data2", event.data2 ?? 0, 0, 127);
  }
  const byte0 = MIDI2_SYSTEM_MT << 4 | event.group & 15;
  const byte1 = event.status & 255;
  const byte2 = needsData1 ? (event.data1 ?? 0) & 127 : 0;
  const byte3 = needsData2 ? (event.data2 ?? 0) & 127 : 0;
  const word0 = byte0 << 24 | byte1 << 16 | byte2 << 8 | byte3;
  return new Uint32Array([word0 >>> 0]);
}
function encodeMidi1ChannelVoice(event) {
  assertRange("group", event.group, 0, 15);
  assertRange("status", event.status, 128, 239);
  const status = event.status & 255;
  const hasData2 = status >= 128 && status !== 192 && status !== 208;
  const hasData1 = status >= 128;
  if (hasData1) assertRange("data1", event.data1 ?? 0, 0, 127);
  if (hasData2) assertRange("data2", event.data2 ?? 0, 0, 127);
  const word0 = MIDI1_CHANNEL_VOICE_MT << 28 | event.group << 24 | status << 16 | (event.data1 ?? 0) << 8 | (hasData2 ? event.data2 ?? 0 : 0);
  return new Uint32Array([word0 >>> 0]);
}
function encodeUtility(event) {
  let opcode = 0;
  let data = event.value ?? 0;
  switch (event.status) {
    case "noop":
      if (data !== 0) {
        throw new RangeError("Utility noop must have zero value.");
      }
      opcode = 0;
      break;
    case "jrClock":
      opcode = 1;
      break;
    case "jrTimestamp":
      opcode = 2;
      break;
    case "dctpq":
      opcode = 3;
      assertRange("value", data, 0, 65535);
      break;
    case "deltaClockstamp":
      opcode = 4;
      break;
    default:
      throw new Error(`Unknown utility status ${event.status}`);
  }
  assertRange("value", data, 0, 1048575);
  const word = UTILITY_MT << 28 | opcode << 20 | data & 1048575;
  return new Uint32Array([word >>> 0]);
}
function encodeStreamFlags(cfg, isNotification) {
  let flags = 0;
  if ((cfg.protocol ?? "midi1") === "midi2") flags |= 32;
  if (cfg.jrTimestampsTx) flags |= 2;
  if (cfg.jrTimestampsRx && !isNotification) flags |= 4;
  return flags;
}
function encodeStream(event) {
  assertRange("group", event.group, 0, 15);
  switch (event.opcode) {
    case "endpointDiscovery": {
      const info = event.endpointDiscovery ?? {};
      const major = info.majorVersion ?? 0;
      const minor = info.minorVersion ?? 0;
      const maxGroups = info.maxGroups ?? 0;
      assertRange("majorVersion", major, 0, 15);
      assertRange("minorVersion", minor, 0, 15);
      assertRange("maxGroups", maxGroups, 0, 15);
      const byte2 = (major & 15) << 4 | minor & 15;
      const byte3 = maxGroups & 15;
      const word0 = STREAM_MT << 28 | event.group << 24 | STREAM_OPCODE_ENDPOINT_DISCOVERY << 16 | byte2 << 8 | byte3;
      return new Uint32Array([word0 >>> 0]);
    }
    case "endpointInfoNotification": {
      const info = event.endpointInfoNotification ?? {};
      const s = info.staticFunctionBlocks ? 128 : 0;
      const nfb = info.numberOfFunctionBlocks ?? 0;
      assertRange("numberOfFunctionBlocks", nfb, 0, 32);
      const byte2 = s | nfb & 63;
      let byte3 = 0;
      if (info.midi1Supported) byte3 |= 1;
      if (info.midi2Supported) byte3 |= 2;
      if (info.jrTimestampsRx) byte3 |= 4;
      if (info.jrTimestampsTx) byte3 |= 8;
      const word0 = STREAM_MT << 28 | event.group << 24 | STREAM_OPCODE_ENDPOINT_INFO << 16 | byte2 << 8 | byte3;
      return new Uint32Array([word0 >>> 0]);
    }
    case "deviceIdentityNotification": {
      const id = event.deviceIdentityNotification ?? {};
      const mId = id.manufacturerId ?? [];
      const family = id.deviceFamily ?? 0;
      const model = id.deviceModel ?? 0;
      const sw = id.softwareRevision ?? 0;
      const word0 = STREAM_MT << 28 | event.group << 24 | STREAM_OPCODE_DEVICE_IDENTITY << 16;
      const word1 = ((mId[0] ?? 0) & 255) << 24 | ((mId[1] ?? 0) & 255) << 16 | ((mId[2] ?? 0) & 255) << 8 | family >> 8 & 255;
      const word2 = (family & 255) << 24 | (model >> 8 & 255) << 16 | (model & 255) << 8 | sw >> 24 & 255;
      const word3 = (sw >> 16 & 255) << 24 | (sw >> 8 & 255) << 16 | (sw & 255) << 8;
      return new Uint32Array([word0 >>> 0, word1 >>> 0, word2 >>> 0, word3 >>> 0]);
    }
    case "endpointNameNotification": {
      const name = event.endpointNameNotification?.name ?? "";
      const bytes = Array.from(new TextEncoder().encode(name)).slice(0, 98);
      const words = [];
      for (let i = 0; i < bytes.length; i += 4) {
        const w = (bytes[i] ?? 0) << 24 | (bytes[i + 1] ?? 0) << 16 | (bytes[i + 2] ?? 0) << 8 | (bytes[i + 3] ?? 0);
        words.push(w >>> 0);
      }
      const word0 = STREAM_MT << 28 | event.group << 24 | STREAM_OPCODE_ENDPOINT_NAME << 16;
      return new Uint32Array([word0 >>> 0, ...words]);
    }
    case "productInstanceIdNotification": {
      const id = event.productInstanceIdNotification?.productInstanceId ?? "";
      const bytes = Array.from(new TextEncoder().encode(id)).slice(0, 42);
      const words = [];
      for (let i = 0; i < bytes.length; i += 4) {
        const w = (bytes[i] ?? 0) << 24 | (bytes[i + 1] ?? 0) << 16 | (bytes[i + 2] ?? 0) << 8 | (bytes[i + 3] ?? 0);
        words.push(w >>> 0);
      }
      const word0 = STREAM_MT << 28 | event.group << 24 | STREAM_OPCODE_PRODUCT_INSTANCE_ID << 16;
      return new Uint32Array([word0 >>> 0, ...words]);
    }
    case "streamConfigRequest":
    case "streamConfigNotification": {
      const isNotification = event.opcode === "streamConfigNotification";
      const cfg = event.streamConfigRequest ?? event.streamConfigNotification ?? {};
      const flags = encodeStreamFlags(cfg, isNotification);
      const opcode = isNotification ? STREAM_OPCODE_STREAM_CONFIG_NOTIFICATION : STREAM_OPCODE_STREAM_CONFIG_REQUEST;
      const word0 = STREAM_MT << 28 | event.group << 24 | opcode << 16 | flags << 8;
      return new Uint32Array([word0 >>> 0]);
    }
    case "functionBlockInfoNotification": {
      const info = event.functionBlockInfoNotification ?? {};
      assertRange("index", info.index ?? 0, 0, 255);
      assertRange("firstGroup", info.firstGroup ?? 0, 0, 15);
      assertRange("groupCount", info.groupCount ?? 0, 0, 15);
      assertRange("direction", info.direction ?? 0, 0, 3);
      assertRange("midi1Bandwidth", info.midi1Bandwidth ?? 0, 0, 2);
      if (info.uiHints !== void 0) assertRange("uiHints", info.uiHints, 0, 255);
      const active = info.active ? 128 : 0;
      const direction = (info.direction ?? 0) & 3;
      const midi1Bandwidth = (info.midi1Bandwidth ?? 0) & 3;
      const uiHints = info.uiHints ?? 0;
      const word0 = STREAM_MT << 28 | event.group << 24 | STREAM_OPCODE_FUNCTION_BLOCK_INFO << 16 | (info.index ?? 0) << 8 | ((info.firstGroup ?? 0) & 15) << 4 | (info.groupCount ?? 0) & 15;
      const word1 = active << 24 | direction << 16 | midi1Bandwidth << 8 | uiHints & 255;
      return new Uint32Array([word0 >>> 0, word1 >>> 0]);
    }
    case "functionBlockNameNotification": {
      const word0 = STREAM_MT << 28 | event.group << 24 | STREAM_OPCODE_FUNCTION_BLOCK_NAME << 16;
      return new Uint32Array([word0 >>> 0]);
    }
    case "startOfClip": {
      const word0 = STREAM_MT << 28 | event.group << 24 | STREAM_OPCODE_START_OF_CLIP << 16;
      return new Uint32Array([word0 >>> 0]);
    }
    case "endOfClip": {
      const word0 = STREAM_MT << 28 | event.group << 24 | STREAM_OPCODE_END_OF_CLIP << 16;
      return new Uint32Array([word0 >>> 0]);
    }
    case "functionBlockDiscovery": {
      const filter = (event.functionBlockDiscovery?.filterBitmap ?? 0) & 65535;
      const word0 = STREAM_MT << 28 | event.group << 24 | STREAM_OPCODE_FUNCTION_BLOCK_DISCOVERY << 16 | (filter >> 8 & 255) << 8 | filter & 255;
      return new Uint32Array([word0 >>> 0]);
    }
    case "processInquiry": {
      const fb = event.processInquiry?.functionBlock ?? 0;
      const part = event.processInquiry?.part ?? 0;
      assertRange("functionBlock", fb, 0, 127);
      assertRange("part", part, 0, 15);
      const word0 = STREAM_MT << 28 | event.group << 24 | STREAM_OPCODE_PROCESS_INQUIRY << 16 | fb << 8 | part;
      return new Uint32Array([word0 >>> 0]);
    }
    case "processInquiryReply": {
      const fb = event.processInquiryReply?.functionBlock ?? 0;
      const part = event.processInquiryReply?.part ?? 0;
      assertRange("functionBlock", fb, 0, 127);
      assertRange("part", part, 0, 15);
      const word0 = STREAM_MT << 28 | event.group << 24 | STREAM_OPCODE_PROCESS_INQUIRY << 16 | fb << 8 | part | 128;
      return new Uint32Array([word0 >>> 0]);
    }
    default:
      throw new Error(`Unsupported stream opcode ${event.opcode}`);
  }
}
function decodeStream(words, timestamp) {
  const word0 = words[0];
  if ((word0 & 8) !== 0) {
    throw new RangeError("Stream packet has reserved bit set.");
  }
  const mt = word0 >>> 28 & 15;
  if (mt !== STREAM_MT) {
    throw new RangeError("Not a stream packet.");
  }
  const group = word0 >>> 24 & 15;
  const opcodeByte = word0 >>> 16 & 255;
  const byte2 = word0 >>> 8 & 255;
  const byte3 = word0 & 255;
  if (opcodeByte === STREAM_OPCODE_ENDPOINT_DISCOVERY) {
    const majorVersion = byte2 >> 4 & 15;
    const minorVersion = byte2 & 15;
    const maxGroups = byte3 & 15;
    if ((byte3 & 240) !== 0) {
      throw new RangeError("Stream endpoint discovery contains reserved data.");
    }
    return { kind: "stream", group, opcode: "endpointDiscovery", endpointDiscovery: { majorVersion, minorVersion, maxGroups }, timestamp };
  }
  if (opcodeByte === STREAM_OPCODE_ENDPOINT_INFO) {
    const staticFunctionBlocks = (byte2 & 128) !== 0;
    if ((byte2 & 64) !== 0) {
      throw new RangeError("Endpoint info has reserved bit set.");
    }
    const numberOfFunctionBlocks = byte2 & 63;
    if (numberOfFunctionBlocks > 32) {
      throw new RangeError("Endpoint info uses reserved numberOfFunctionBlocks value.");
    }
    const midi1Supported = (byte3 & 1) !== 0;
    const midi2Supported = (byte3 & 2) !== 0;
    const jrTimestampsRx = (byte3 & 4) !== 0;
    const jrTimestampsTx = (byte3 & 8) !== 0;
    if ((byte3 & 240) !== 0) {
      throw new RangeError("Endpoint info has reserved capability bits set.");
    }
    return {
      kind: "stream",
      group,
      opcode: "endpointInfoNotification",
      endpointInfoNotification: { staticFunctionBlocks, numberOfFunctionBlocks, midi1Supported, midi2Supported, jrTimestampsRx, jrTimestampsTx },
      timestamp
    };
  }
  if (opcodeByte === STREAM_OPCODE_DEVICE_IDENTITY) {
    if (words.length >= 4) {
      const w1 = words[1];
      const w2 = words[2];
      const w3 = words[3];
      const manufacturerIdRaw = [w1 >>> 24 & 255, w1 >>> 16 & 255, w1 >>> 8 & 255].filter((b, idx) => idx === 0 || b !== 0);
      const manufacturerId = manufacturerIdRaw.length === 1 ? [manufacturerIdRaw[0]] : manufacturerIdRaw;
      const family = (w1 & 255) << 8 | w2 >>> 24 & 255;
      const model = (w2 >>> 16 & 255) << 8 | w2 >>> 8 & 255;
      const sw = (w2 & 255) << 24 | (w3 >>> 24 & 255) << 16 | (w3 >>> 16 & 255) << 8 | w3 >>> 8 & 255;
      return { kind: "stream", group, opcode: "deviceIdentityNotification", deviceIdentityNotification: { manufacturerId, deviceFamily: family, deviceModel: model, softwareRevision: sw }, timestamp };
    }
    return { kind: "stream", group, opcode: "deviceIdentityNotification", deviceIdentityNotification: {}, timestamp };
  }
  if (opcodeByte === STREAM_OPCODE_ENDPOINT_NAME) {
    const bytes = [];
    for (let i = 1; i < words.length; i++) {
      const w = words[i];
      bytes.push(w >>> 24 & 255, w >>> 16 & 255, w >>> 8 & 255, w & 255);
    }
    const name = new TextDecoder().decode(Uint8Array.from(bytes.filter((b) => b !== 0)));
    return { kind: "stream", group, opcode: "endpointNameNotification", endpointNameNotification: { name }, timestamp };
  }
  if (opcodeByte === STREAM_OPCODE_PRODUCT_INSTANCE_ID) {
    const bytes = [];
    for (let i = 1; i < words.length; i++) {
      const w = words[i];
      bytes.push(w >>> 24 & 255, w >>> 16 & 255, w >>> 8 & 255, w & 255);
    }
    const productInstanceId = new TextDecoder().decode(Uint8Array.from(bytes.filter((b) => b !== 0)));
    return { kind: "stream", group, opcode: "productInstanceIdNotification", productInstanceIdNotification: { productInstanceId }, timestamp };
  }
  if (opcodeByte === STREAM_OPCODE_STREAM_CONFIG_REQUEST || opcodeByte === STREAM_OPCODE_STREAM_CONFIG_NOTIFICATION) {
    if ((byte2 & 217) !== 0) {
      throw new RangeError("Stream config flags have reserved bits set.");
    }
    const protocol = (byte2 & 32) !== 0 ? "midi2" : "midi1";
    const jrTx = (byte2 & 2) !== 0;
    const jrRx = (byte2 & 4) !== 0;
    const cfg = { protocol, jrTimestampsTx: jrTx, jrTimestampsRx: jrRx };
    const isNotification = opcodeByte === STREAM_OPCODE_STREAM_CONFIG_NOTIFICATION;
    return isNotification ? { kind: "stream", group, opcode: "streamConfigNotification", streamConfigNotification: cfg, timestamp } : { kind: "stream", group, opcode: "streamConfigRequest", streamConfigRequest: cfg, timestamp };
  }
  if (opcodeByte === STREAM_OPCODE_FUNCTION_BLOCK_DISCOVERY) {
    const filterBitmap = byte2 << 8 | byte3;
    return {
      kind: "stream",
      group,
      opcode: "functionBlockDiscovery",
      functionBlockDiscovery: { filterBitmap },
      timestamp
    };
  }
  if (opcodeByte === STREAM_OPCODE_FUNCTION_BLOCK_INFO) {
    if (words.length < 2) {
      throw new RangeError("Function block info must contain two words.");
    }
    const index = byte2;
    const firstGroup = byte3 >> 4 & 15;
    const groupCount = byte3 & 15;
    const word1 = words[1];
    const active = (word1 & 2147483648) !== 0;
    const direction = word1 >>> 16 & 3;
    const midi1Bandwidth = word1 >>> 8 & 3;
    const uiHints = word1 & 255;
    const reservedMask = ~(2147681279 >>> 0);
    if ((word1 & reservedMask) !== 0) {
      throw new RangeError("Function block info has reserved bits set.");
    }
    if (midi1Bandwidth > 2) {
      throw new RangeError("Function block info has reserved midi1Bandwidth value.");
    }
    return {
      kind: "stream",
      group,
      opcode: "functionBlockInfoNotification",
      functionBlockInfoNotification: { index, firstGroup, groupCount, active, direction, midi1Bandwidth, uiHints },
      timestamp
    };
  }
  if (opcodeByte === STREAM_OPCODE_FUNCTION_BLOCK_NAME) {
    return { kind: "stream", group, opcode: "functionBlockNameNotification", functionBlockNameNotification: { functionBlock: 0, name: "" }, timestamp };
  }
  if (opcodeByte === STREAM_OPCODE_START_OF_CLIP) {
    return { kind: "stream", group, opcode: "startOfClip", timestamp };
  }
  if (opcodeByte === STREAM_OPCODE_END_OF_CLIP) {
    return { kind: "stream", group, opcode: "endOfClip", timestamp };
  }
  if (opcodeByte === STREAM_OPCODE_PROCESS_INQUIRY) {
    const fb = byte2 & 127;
    const part = byte3 & 15;
    const isReply = (byte3 & 128) !== 0;
    if (isReply) {
      return { kind: "stream", group, opcode: "processInquiryReply", processInquiryReply: { functionBlock: fb, part }, timestamp };
    }
    return { kind: "stream", group, opcode: "processInquiry", processInquiry: { functionBlock: fb, part }, timestamp };
  }
  throw new RangeError(`Unsupported stream opcode 0x${opcodeByte.toString(16)}`);
}
function encodeFlexTempo(event) {
  assertRange("group", event.group, 0, 15);
  if (!Number.isFinite(event.bpm) || event.bpm < 1 || event.bpm > FLEX_TEMPO_MAX_BPM) {
    throw new RangeError(`bpm must be in [1, ${FLEX_TEMPO_MAX_BPM.toFixed(3)}]`);
  }
  const fixed = Math.round(event.bpm * FLEX_TEMPO_SCALE);
  if (fixed > 4294967295) {
    throw new RangeError("bpm exceeds 16.16 fixed-point capacity");
  }
  const word0 = 13 << 28 | event.group << 24 | FLEX_STATUS_CLASS << 16 | FLEX_STATUS_TEMPO << 8;
  return new Uint32Array([word0 >>> 0, fixed >>> 0, 0, 0]);
}
function encodeFlexTimeSignature(event) {
  assertRange("group", event.group, 0, 15);
  assertRange("numerator", event.numerator, 1, 255);
  assertRange("denominatorPow2", event.denominatorPow2, 0, 31);
  let addrByte = 0;
  if (event.channel !== void 0) {
    assertRange("channel", event.channel, 0, 15);
    addrByte = 16 | event.channel & 15;
  }
  const word0 = 13 << 28 | event.group << 24 | FLEX_STATUS_CLASS << 16 | FLEX_STATUS_TIMESIG << 8 | addrByte;
  const word1 = event.numerator << 24 | event.denominatorPow2 << 16;
  return new Uint32Array([word0 >>> 0, word1 >>> 0, 0, 0]);
}
function packText12(text, field = "text") {
  const bytes = Array.from(assertTextFits(field, text, 12));
  while (bytes.length < 12) bytes.push(0);
  const word1 = bytes[0] << 24 | bytes[1] << 16 | bytes[2] << 8 | bytes[3];
  const word2 = bytes[4] << 24 | bytes[5] << 16 | bytes[6] << 8 | bytes[7];
  const word3 = bytes[8] << 24 | bytes[9] << 16 | bytes[10] << 8 | bytes[11];
  return [word1 >>> 0, word2 >>> 0, word3 >>> 0];
}
function packBytes12(bytes, field = "payload") {
  if (bytes.length > 12) {
    throw new RangeError(`${field} must be <= 12 bytes, got ${bytes.length}`);
  }
  const arr = bytes.slice();
  while (arr.length < 12) arr.push(0);
  const word1 = arr[0] << 24 | arr[1] << 16 | arr[2] << 8 | arr[3];
  const word2 = arr[4] << 24 | arr[5] << 16 | arr[6] << 8 | arr[7];
  const word3 = arr[8] << 24 | arr[9] << 16 | arr[10] << 8 | arr[11];
  return [word1 >>> 0, word2 >>> 0, word3 >>> 0];
}
function encodeFlexKeySignature(event) {
  assertRange("group", event.group, 0, 15);
  let addrByte = 0;
  if (event.channel !== void 0) {
    assertRange("channel", event.channel, 0, 15);
    addrByte = 16 | event.channel & 15;
  }
  const word0 = 13 << 28 | event.group << 24 | FLEX_STATUS_CLASS << 16 | FLEX_STATUS_KEY << 8 | addrByte;
  const [w1, w2, w3] = packText12(event.key, "keySignature");
  return new Uint32Array([word0 >>> 0, w1, w2, w3]);
}
function encodeFlexLyric(event) {
  assertRange("group", event.group, 0, 15);
  let addrByte = 0;
  if (event.channel !== void 0) {
    assertRange("channel", event.channel, 0, 15);
    addrByte = 16 | event.channel & 15;
  }
  const word0 = 13 << 28 | event.group << 24 | FLEX_CLASS_LYRIC << 16 | FLEX_STATUS_LYRIC << 8 | addrByte;
  const [w1, w2, w3] = packText12(event.text, "lyric");
  return new Uint32Array([word0 >>> 0, w1, w2, w3]);
}
function encodeFlexText(event) {
  assertRange("group", event.group, 0, 15);
  let addrByte = 0;
  if (event.channel !== void 0) {
    assertRange("channel", event.channel, 0, 15);
    addrByte = 16 | event.channel & 15;
  }
  const word0 = 13 << 28 | event.group << 24 | FLEX_CLASS_TEXT << 16 | FLEX_STATUS_TEXT << 8 | addrByte;
  const [w1, w2, w3] = packText12(event.text, "text");
  return new Uint32Array([word0 >>> 0, w1, w2, w3]);
}
function encodeFlexRuby(event) {
  assertRange("group", event.group, 0, 15);
  let addrByte = 0;
  if (event.channel !== void 0) {
    assertRange("channel", event.channel, 0, 15);
    addrByte = 16 | event.channel & 15;
  }
  const word0 = 13 << 28 | event.group << 24 | FLEX_CLASS_RUBY << 16 | FLEX_STATUS_RUBY << 8 | addrByte;
  const [w1, w2, w3] = packText12(event.ruby, "ruby");
  return new Uint32Array([word0 >>> 0, w1, w2, w3]);
}
function encodeFlexChordName(event) {
  assertRange("group", event.group, 0, 15);
  let addrByte = 0;
  if (event.channel !== void 0) {
    assertRange("channel", event.channel, 0, 15);
    addrByte = 16 | event.channel & 15;
  }
  const word0 = 13 << 28 | event.group << 24 | FLEX_STATUS_CLASS << 16 | FLEX_STATUS_CHORD << 8 | addrByte;
  const [w1, w2, w3] = packText12(event.chord, "chord");
  return new Uint32Array([word0 >>> 0, w1, w2, w3]);
}
function encodeFlexMetronome(event) {
  assertRange("group", event.group, 0, 15);
  if (!Number.isInteger(event.clicksPerBeat) || event.clicksPerBeat < 1 || event.clicksPerBeat > 65535) {
    throw new RangeError("clicksPerBeat must be an integer in [1, 65535]");
  }
  let addrByte = 0;
  if (event.channel !== void 0) {
    assertRange("channel", event.channel, 0, 15);
    addrByte = 16 | event.channel & 15;
  }
  const accentBytesRaw = Array.from(new TextEncoder().encode(event.accentPattern));
  if (accentBytesRaw.length > 10) {
    throw new RangeError("accentPattern must be <= 10 UTF-8 bytes");
  }
  const accentBytes = accentBytesRaw.slice(0, 10);
  while (accentBytes.length < 10) accentBytes.push(0);
  const [w1, w2, w3] = packBytes12([
    event.clicksPerBeat >> 8 & 255,
    event.clicksPerBeat & 255,
    ...accentBytes
  ], "accentPattern");
  const word0 = 13 << 28 | event.group << 24 | FLEX_STATUS_CLASS << 16 | FLEX_STATUS_METRONOME << 8 | addrByte;
  return new Uint32Array([word0 >>> 0, w1, w2, w3]);
}
function encodeChannelVoiceWord0(group, status, channel, dataMsb, dataLsb = 0) {
  return MIDI2_CHANNEL_VOICE_MT << 28 | group << 24 | status << 20 | channel << 16 | dataMsb << 8 | dataLsb;
}
function encodeNoteOn(event) {
  assertRange("group", event.group, 0, 15);
  assertRange("channel", event.channel, 0, 15);
  assertRange("note", event.note, 0, 127);
  const velocity = event.velocity;
  assertRange("velocity", velocity, 0, 65535);
  const attributeType = event.attributeType ?? 0;
  assertRange("attributeType", attributeType, 0, 255);
  const attributeData = event.attributeData ?? 0;
  assertRange("attributeData", attributeData, 0, 65535);
  const word0 = encodeChannelVoiceWord0(event.group, STATUS_NOTE_ON, event.channel, event.note, attributeType);
  const word1 = velocity << 16 | attributeData;
  return new Uint32Array([word0 >>> 0, word1 >>> 0]);
}
function encodeNoteOff(event) {
  assertRange("group", event.group, 0, 15);
  assertRange("channel", event.channel, 0, 15);
  assertRange("note", event.note, 0, 127);
  const velocity = event.velocity ?? 0;
  assertRange("velocity", velocity, 0, 65535);
  const attributeType = event.attributeType ?? 0;
  assertRange("attributeType", attributeType, 0, 255);
  const attributeData = event.attributeData ?? 0;
  assertRange("attributeData", attributeData, 0, 65535);
  const word0 = encodeChannelVoiceWord0(event.group, STATUS_NOTE_OFF, event.channel, event.note, attributeType);
  const word1 = velocity << 16 | attributeData;
  return new Uint32Array([word0 >>> 0, word1 >>> 0]);
}
function encodeRpn(event) {
  assertRange("group", event.group, 0, 15);
  assertRange("channel", event.channel, 0, 15);
  assertRange("bank", event.bank, 0, 127);
  assertRange("index", event.index, 0, 127);
  assertUint32("value", event.value);
  const word0 = encodeChannelVoiceWord0(event.group, STATUS_RPN, event.channel, event.bank, event.index);
  return new Uint32Array([word0 >>> 0, event.value >>> 0]);
}
function encodeNrpn(event) {
  assertRange("group", event.group, 0, 15);
  assertRange("channel", event.channel, 0, 15);
  assertRange("bank", event.bank, 0, 127);
  assertRange("index", event.index, 0, 127);
  assertUint32("value", event.value);
  const word0 = encodeChannelVoiceWord0(event.group, STATUS_NRPN, event.channel, event.bank, event.index);
  return new Uint32Array([word0 >>> 0, event.value >>> 0]);
}
function encodeRpnRelative(event) {
  assertRange("group", event.group, 0, 15);
  assertRange("channel", event.channel, 0, 15);
  assertRange("bank", event.bank, 0, 127);
  assertRange("index", event.index, 0, 127);
  assertInt32("delta", event.delta);
  const word0 = encodeChannelVoiceWord0(event.group, STATUS_RPN_RELATIVE, event.channel, event.bank, event.index);
  return new Uint32Array([word0 >>> 0, event.delta >>> 0 & 4294967295]);
}
function encodeNrpnRelative(event) {
  assertRange("group", event.group, 0, 15);
  assertRange("channel", event.channel, 0, 15);
  assertRange("bank", event.bank, 0, 127);
  assertRange("index", event.index, 0, 127);
  assertInt32("delta", event.delta);
  const word0 = encodeChannelVoiceWord0(event.group, STATUS_NRPN_RELATIVE, event.channel, event.bank, event.index);
  return new Uint32Array([word0 >>> 0, event.delta >>> 0 & 4294967295]);
}
function encodePerNoteManagement(event) {
  assertRange("group", event.group, 0, 15);
  assertRange("channel", event.channel, 0, 15);
  assertRange("note", event.note, 0, 127);
  const flags = (event.detach ? 2 : 0) | (event.reset ? 1 : 0);
  const word0 = encodeChannelVoiceWord0(event.group, STATUS_PER_NOTE, event.channel, event.note, flags);
  return new Uint32Array([word0 >>> 0, 0]);
}
function encodePerNoteRegisteredController(event) {
  assertRange("group", event.group, 0, 15);
  assertRange("channel", event.channel, 0, 15);
  assertRange("note", event.note, 0, 127);
  assertRange("controller", event.controller, 0, 127);
  assertUint32("value", event.value);
  const word0 = encodeChannelVoiceWord0(event.group, STATUS_PER_NOTE, event.channel, event.note, event.controller);
  return new Uint32Array([word0 >>> 0, event.value >>> 0]);
}
function encodePerNoteAssignableController(event) {
  assertRange("group", event.group, 0, 15);
  assertRange("channel", event.channel, 0, 15);
  assertRange("note", event.note, 0, 127);
  assertRange("controller", event.controller, 128, 255);
  assertUint32("value", event.value);
  const word0 = encodeChannelVoiceWord0(event.group, STATUS_PER_NOTE, event.channel, event.note, event.controller);
  return new Uint32Array([word0 >>> 0, event.value >>> 0]);
}
function encodePerNotePitchBend(event) {
  assertRange("group", event.group, 0, 15);
  assertRange("channel", event.channel, 0, 15);
  assertRange("note", event.note, 0, 127);
  assertUint32("value", event.value);
  const word0 = MIDI2_CHANNEL_VOICE_MT << 28 | event.group << 24 | STATUS_PER_NOTE_PITCH << 20 | event.channel << 16 | event.note << 8;
  return new Uint32Array([word0 >>> 0, event.value >>> 0]);
}
function encodePolyPressure(event) {
  assertRange("group", event.group, 0, 15);
  assertRange("channel", event.channel, 0, 15);
  assertRange("note", event.note, 0, 127);
  assertUint32("pressure", event.pressure);
  const word0 = encodeChannelVoiceWord0(event.group, STATUS_POLY_PRESSURE, event.channel, event.note);
  return new Uint32Array([word0 >>> 0, event.pressure >>> 0]);
}
function encodeControlChange(event) {
  assertRange("group", event.group, 0, 15);
  assertRange("channel", event.channel, 0, 15);
  assertRange("controller", event.controller, 0, 127);
  assertUint32("value", event.value);
  const word0 = encodeChannelVoiceWord0(event.group, STATUS_CONTROL_CHANGE, event.channel, event.controller);
  return new Uint32Array([word0 >>> 0, event.value >>> 0]);
}
function encodeProgramChange(event) {
  assertRange("group", event.group, 0, 15);
  assertRange("channel", event.channel, 0, 15);
  assertRange("program", event.program, 0, 127);
  const bankValid = event.bankMsb !== void 0 || event.bankLsb !== void 0;
  if (event.bankMsb !== void 0) {
    assertRange("bankMsb", event.bankMsb, 0, 127);
  }
  if (event.bankLsb !== void 0) {
    assertRange("bankLsb", event.bankLsb, 0, 127);
  }
  const word0 = encodeChannelVoiceWord0(event.group, STATUS_PROGRAM_CHANGE, event.channel, event.program, bankValid ? 128 : 0);
  const word1 = (event.bankMsb ?? 0) << 24 | (event.bankLsb ?? 0) << 16;
  return new Uint32Array([word0 >>> 0, word1 >>> 0]);
}
function encodeChannelPressure(event) {
  assertRange("group", event.group, 0, 15);
  assertRange("channel", event.channel, 0, 15);
  assertUint32("pressure", event.pressure);
  const word0 = encodeChannelVoiceWord0(event.group, STATUS_CHANNEL_PRESSURE, event.channel, 0, 0);
  return new Uint32Array([word0 >>> 0, event.pressure >>> 0]);
}
function encodePitchBend(event) {
  assertRange("group", event.group, 0, 15);
  assertRange("channel", event.channel, 0, 15);
  assertUint32("value", event.value);
  const word0 = encodeChannelVoiceWord0(event.group, STATUS_PITCH_BEND, event.channel, 0, 0);
  return new Uint32Array([word0 >>> 0, event.value >>> 0]);
}
function encodeMds(event) {
  const packets = [];
  const chunks = event.chunks.length ? event.chunks : [{ messageId: event.messageId, totalChunks: event.totalChunks, index: 0, validByteCount: 0, payload: new Uint8Array() }];
  for (const chunk of chunks) {
    const messageId = chunk.messageId ?? event.messageId;
    const totalChunks = chunk.totalChunks ?? event.totalChunks;
    const validByteCount = chunk.validByteCount ?? (chunk.payload?.length ?? 0);
    const word0 = 5 << 28 | (event.group & 15) << 24 | DATA_STATUS_MDS_HEADER << 20 | (messageId & 255) << 8 | validByteCount & 255;
    const word1 = (totalChunks & 65535) << 16 | chunk.index & 65535;
    const word2 = (chunk.manufacturerId ?? 0) << 16 | (chunk.deviceId ?? 0) & 65535;
    const word3 = (chunk.subId1 ?? 0) << 16 | (chunk.subId2 ?? 0) & 65535;
    packets.push(new Uint32Array([word0 >>> 0, word1 >>> 0, word2 >>> 0, word3 >>> 0]));
    const payload = chunk.payload ?? new Uint8Array();
    for (let offset = 0; offset < payload.length; offset += 12) {
      const slice = payload.slice(offset, offset + 12);
      const byteCount = slice.length === 12 ? 0 : slice.length;
      const header = 5 << 28 | (event.group & 15) << 24 | DATA_STATUS_MDS_PAYLOAD << 20 | (byteCount & 15) << 16 | (messageId & 255) << 8;
      const padded = new Uint8Array(12);
      padded.set(slice);
      const dv = new DataView(padded.buffer);
      const w1 = dv.getUint32(0, false);
      const w2 = dv.getUint32(4, false);
      const w3 = dv.getUint32(8, false);
      packets.push(new Uint32Array([header >>> 0, w1 >>> 0, w2 >>> 0, w3 >>> 0]));
    }
  }
  return packets;
}
function encodeUmp(event) {
  switch (event.kind) {
    case "utility":
      return encodeUtility(event);
    case "stream":
      return encodeStream(event);
    case "flexTempo":
      return encodeFlexTempo(event);
    case "flexTimeSignature":
      return encodeFlexTimeSignature(event);
    case "flexKeySignature":
      return encodeFlexKeySignature(event);
    case "flexLyric":
      return encodeFlexLyric(event);
    case "flexText":
      return encodeFlexText(event);
    case "flexChordName":
      return encodeFlexChordName(event);
    case "flexRuby":
      return encodeFlexRuby(event);
    case "flexMetronome":
      return encodeFlexMetronome(event);
    case "midi1ChannelVoice":
      return encodeMidi1ChannelVoice(event);
    case "system":
      return encodeSystemEvent(event);
    case "noteOn":
      return encodeNoteOn(event);
    case "noteOff":
      return encodeNoteOff(event);
    case "rpn":
      return encodeRpn(event);
    case "nrpn":
      return encodeNrpn(event);
    case "rpnRelative":
      return encodeRpnRelative(event);
    case "nrpnRelative":
      return encodeNrpnRelative(event);
    case "perNoteManagement":
      return encodePerNoteManagement(event);
    case "perNoteRegisteredController":
      return encodePerNoteRegisteredController(event);
    case "perNoteAssignableController":
      return encodePerNoteAssignableController(event);
    case "perNotePitchBend":
      return encodePerNotePitchBend(event);
    case "polyPressure":
      return encodePolyPressure(event);
    case "controlChange":
      return encodeControlChange(event);
    case "programChange":
      return encodeProgramChange(event);
    case "channelPressure":
      return encodeChannelPressure(event);
    case "pitchBend":
      return encodePitchBend(event);
    case "rawUMP":
      return toUint32Array(event.words);
    default:
      throw new Error(`Cannot encode event of kind ${event.kind}`);
  }
}
function encodeEventPackets(event) {
  switch (event.kind) {
    case "sysex7": {
      return fragmentSysEx7(event.manufacturerId, event.payload, event.group);
    }
    case "sysex8": {
      return fragmentSysEx8(event.manufacturerId, event.payload, event.group);
    }
    case "midiCi":
      return encodeMidiCiEvent(event);
    case "mds":
      return encodeMds(event);
    case "rawUMP": {
      decodeUmp(event.words);
      return [toUint32Array(event.words)];
    }
    default:
      return [encodeUmp(event)];
  }
}
function decodeUmp(words, timestamp) {
  if (!words || words.length < 1) {
    return null;
  }
  const packet = toUint32Array(words);
  const word0 = packet[0];
  const mt = word0 >>> 28 & 15;
  const supportedMt = /* @__PURE__ */ new Set([UTILITY_MT, MIDI2_SYSTEM_MT, MIDI1_CHANNEL_VOICE_MT, 3, MIDI2_CHANNEL_VOICE_MT, 5, 13, STREAM_MT]);
  if (!supportedMt.has(mt)) {
    throw new RangeError(`Unsupported UMP message type 0x${mt.toString(16)}`);
  }
  if (mt === STREAM_MT) {
    return decodeStream(packet, timestamp);
  }
  if (mt === 3) {
    if (packet.length % 2 !== 0) {
      return { kind: "rawUMP", words: packet, timestamp };
    }
    const packets = [];
    for (let i = 0; i < packet.length; i += 2) {
      packets.push(packet.subarray(i, i + 2));
    }
    try {
      const syx = reassembleSysEx7(packets);
      const evt = {
        kind: "sysex7",
        group: syx.group,
        manufacturerId: syx.manufacturerId,
        payload: syx.payload,
        timestamp
      };
      const maybeCi = decodeMidiCiFromSysEx(evt);
      return maybeCi ?? evt;
    } catch {
      return { kind: "rawUMP", words: packet, timestamp };
    }
  }
  if (mt === 5) {
    if (packet.length % 4 !== 0) {
      return { kind: "rawUMP", words: packet, timestamp };
    }
    const statusNibble = word0 >>> 20 & 15;
    if (statusNibble === DATA_STATUS_MDS_HEADER || statusNibble === DATA_STATUS_MDS_PAYLOAD) {
      if (packet.length < 4) return null;
      const headerStatus = packet[0] >>> 20 & 15;
      if (headerStatus !== DATA_STATUS_MDS_HEADER) {
        return { kind: "rawUMP", words: packet, timestamp };
      }
      const group2 = packet[0] >>> 24 & 15;
      const mdsId = packet[0] >>> 8 & 255;
      const headerValidBytes = packet[0] & 255;
      const totalChunks = packet[1] >>> 16 & 65535;
      const chunkIndex = packet[1] & 65535;
      const manufacturerId = packet[2] >>> 16 & 65535;
      const deviceId = packet[2] & 65535;
      const subId1 = packet[3] >>> 16 & 65535;
      const subId2 = packet[3] & 65535;
      const payloadParts = [];
      for (let i = 4; i + 3 < packet.length; i += 4) {
        const w0 = packet[i] >>> 0;
        const status2 = w0 >>> 20 & 15;
        if (status2 !== DATA_STATUS_MDS_PAYLOAD) continue;
        const payloadMdsId = w0 >>> 8 & 255;
        if (payloadMdsId !== mdsId) continue;
        const byteCount = w0 >>> 16 & 15;
        const payloadBytes = new Uint8Array(12);
        const dv = new DataView(payloadBytes.buffer);
        dv.setUint32(0, packet[i + 1] >>> 0, false);
        dv.setUint32(4, packet[i + 2] >>> 0, false);
        dv.setUint32(8, packet[i + 3] >>> 0, false);
        const bytesToTake = byteCount > 0 ? Math.min(byteCount, payloadBytes.length) : payloadBytes.length;
        payloadParts.push(...payloadBytes.slice(0, bytesToTake));
      }
      const validByteCount = headerValidBytes || payloadParts.length;
      const chunkPayload = Uint8Array.from(payloadParts).slice(0, validByteCount);
      const chunk = {
        messageId: mdsId,
        totalChunks,
        index: chunkIndex,
        validByteCount,
        payload: chunkPayload,
        manufacturerId,
        deviceId,
        subId1,
        subId2
      };
      const evt = { kind: "mds", group: group2, messageId: mdsId, totalChunks, chunks: [chunk], timestamp };
      return evt;
    }
    const packets = [];
    for (let i = 0; i < packet.length; i += 4) {
      packets.push(packet.subarray(i, i + 4));
    }
    try {
      const syx = reassembleSysEx8(packets);
      const evt = {
        kind: "sysex8",
        group: syx.group,
        manufacturerId: syx.manufacturerId,
        payload: syx.payload,
        timestamp
      };
      const maybeCi = decodeMidiCiFromSysEx(evt);
      return maybeCi ?? evt;
    } catch {
      return { kind: "rawUMP", words: packet, timestamp };
    }
  }
  if (mt === 13) {
    if (packet.length < 4) return null;
    const statusClass = word0 >>> 16 & 255;
    if (statusClass !== 16 && statusClass !== 17) {
      throw new RangeError("Invalid flex status class");
    }
    const status2 = word0 >>> 8 & 255;
    const group2 = word0 >>> 24 & 15;
    const addrByte = word0 & 255;
    if ((addrByte & 224) !== 0) {
      throw new RangeError("Invalid flex address byte");
    }
    const channel2 = (addrByte & 16) !== 0 ? addrByte & 15 : void 0;
    const textBytes = [
      packet[1] >>> 24 & 255,
      packet[1] >>> 16 & 255,
      packet[1] >>> 8 & 255,
      packet[1] & 255,
      packet[2] >>> 24 & 255,
      packet[2] >>> 16 & 255,
      packet[2] >>> 8 & 255,
      packet[2] & 255,
      packet[3] >>> 24 & 255,
      packet[3] >>> 16 & 255,
      packet[3] >>> 8 & 255,
      packet[3] & 255
    ];
    const decodedText = new TextDecoder().decode(Uint8Array.from(textBytes.filter((b) => b !== 0)));
    if (statusClass === FLEX_CLASS_TEXT) {
      if (status2 === FLEX_STATUS_TEXT) {
        const event = { kind: "flexText", group: group2, channel: channel2, text: decodedText, timestamp };
        return event;
      }
      if (status2 === FLEX_STATUS_LYRIC) {
        const event = { kind: "flexLyric", group: group2, channel: channel2, text: decodedText, timestamp };
        return event;
      }
      if (status2 === FLEX_STATUS_RUBY) {
        const event = { kind: "flexRuby", group: group2, channel: channel2, ruby: decodedText, timestamp };
        return event;
      }
      throw new RangeError("Unsupported flex text status");
    }
    if (statusClass !== FLEX_STATUS_CLASS) {
      throw new RangeError("Unsupported flex data status class");
    }
    switch (status2) {
      case FLEX_STATUS_TEMPO: {
        const fixed = packet[1] >>> 0;
        const bpm = fixed / FLEX_TEMPO_SCALE;
        if (bpm < 1 || bpm > FLEX_TEMPO_MAX_BPM) {
          throw new RangeError("Invalid flex tempo payload");
        }
        const event = {
          kind: "flexTempo",
          group: group2,
          bpm,
          timestamp
        };
        return event;
      }
      case FLEX_STATUS_TIMESIG: {
        const numerator = packet[1] >>> 24 & 255;
        const denominatorPow2 = packet[1] >>> 16 & 255;
        if (numerator < 1 || denominatorPow2 > 31) {
          throw new RangeError("Invalid flex time signature payload");
        }
        const event = {
          kind: "flexTimeSignature",
          group: group2,
          channel: channel2,
          numerator,
          denominatorPow2,
          timestamp
        };
        return event;
      }
      case FLEX_STATUS_KEY: {
        const event = {
          kind: "flexKeySignature",
          group: group2,
          channel: channel2,
          key: decodedText,
          timestamp
        };
        return event;
      }
      case FLEX_STATUS_METRONOME: {
        const clicksPerBeat = (packet[1] >>> 24 & 255) << 8 | packet[1] >>> 16 & 255;
        if (clicksPerBeat < 1) throw new RangeError("Invalid flex metronome clicksPerBeat");
        const accentBytes = textBytes.slice(2);
        const accentPattern = new TextDecoder().decode(Uint8Array.from(accentBytes.filter((b) => b !== 0)));
        const event = {
          kind: "flexMetronome",
          group: group2,
          channel: channel2,
          clicksPerBeat,
          accentPattern,
          timestamp
        };
        return event;
      }
      case FLEX_STATUS_CHORD: {
        const event = {
          kind: "flexChordName",
          group: group2,
          channel: channel2,
          chord: decodedText,
          timestamp
        };
        return event;
      }
      default:
        throw new RangeError("Unsupported flex data status");
    }
  }
  if (mt === UTILITY_MT) {
    const groupNibble = word0 >>> 24 & 15;
    if (groupNibble !== 0) {
      throw new RangeError("Utility packet must use groupless encoding (group=0).");
    }
    const opcode = word0 >>> 20 & 15;
    const value = word0 & 1048575;
    let status2;
    if (opcode === 0) status2 = "noop";
    else if (opcode === 1) status2 = "jrClock";
    else if (opcode === 2) status2 = "jrTimestamp";
    else if (opcode === 3) status2 = "dctpq";
    else if (opcode === 4) status2 = "deltaClockstamp";
    else throw new RangeError("Unsupported utility status");
    if (status2 === "noop" && value !== 0) {
      throw new RangeError("Utility noop must have zero payload.");
    }
    if (status2 === "dctpq" && value > 65535) {
      throw new RangeError("Utility dctpq must be 16-bit.");
    }
    const event = {
      kind: "utility",
      status: status2,
      value,
      timestamp
    };
    return event;
  }
  if (mt === MIDI1_CHANNEL_VOICE_MT) {
    const group2 = word0 >>> 24 & 15;
    const status2 = word0 >>> 16 & 255;
    if (status2 < 128 || status2 > 239) {
      throw new RangeError("Invalid MIDI 1.0 channel voice status");
    }
    const data1 = word0 >>> 8 & 255;
    const data2 = word0 & 255;
    const statusNibble = status2 >> 4;
    const oneDataByte = statusNibble === 12 || statusNibble === 13;
    if (data1 > 127 || !oneDataByte && data2 > 127) {
      throw new RangeError("MIDI 1.0 channel voice data out of range");
    }
    const event = {
      kind: "midi1ChannelVoice",
      group: group2,
      status: status2,
      data1: data1 || void 0,
      data2: data2 || void 0,
      timestamp
    };
    return event;
  }
  if (mt === MIDI2_SYSTEM_MT) {
    const group2 = word0 >>> 24 & 15;
    const statusByte = word0 >>> 16 & 255;
    const allowedStatuses = [241, 242, 243, 246, 248, 250, 251, 252, 254, 255];
    if (!allowedStatuses.includes(statusByte)) {
      throw new RangeError("Unsupported MIDI 2.0 system status");
    }
    const status2 = statusByte;
    const data1 = word0 >>> 8 & 255;
    const data2 = word0 & 255;
    const needsData2 = status2 === 242;
    const needsData1 = needsData2 || status2 === 241 || status2 === 243;
    if (needsData1 && data1 > 127) {
      throw new RangeError("System data1 out of range");
    }
    if (needsData2 && data2 > 127) {
      throw new RangeError("System data2 out of range");
    }
    const event = {
      kind: "system",
      group: group2,
      status: status2,
      data1: needsData1 ? data1 & 127 : void 0,
      data2: needsData2 ? data2 & 127 : void 0,
      timestamp
    };
    return event;
  }
  if (mt !== MIDI2_CHANNEL_VOICE_MT) {
    return {
      kind: "rawUMP",
      words: packet,
      timestamp
    };
  }
  if (packet.length < 2) {
    return null;
  }
  const status = word0 >>> 20 & 15;
  const group = word0 >>> 24 & 15;
  const channel = word0 >>> 16 & 15;
  const dataMsb = word0 >>> 8 & 255;
  const dataLsb = word0 & 255;
  const dataWord = packet[1] >>> 0;
  switch (status) {
    case STATUS_RPN: {
      assertDecodeRange("rpn bank", dataMsb, 0, 127);
      assertDecodeRange("rpn index", dataLsb, 0, 127);
      const event = {
        kind: "rpn",
        group,
        channel,
        bank: dataMsb,
        index: dataLsb,
        value: dataWord,
        timestamp
      };
      return event;
    }
    case STATUS_NRPN: {
      assertDecodeRange("nrpn bank", dataMsb, 0, 127);
      assertDecodeRange("nrpn index", dataLsb, 0, 127);
      const event = {
        kind: "nrpn",
        group,
        channel,
        bank: dataMsb,
        index: dataLsb,
        value: dataWord,
        timestamp
      };
      return event;
    }
    case STATUS_RPN_RELATIVE: {
      assertDecodeRange("rpn bank", dataMsb, 0, 127);
      assertDecodeRange("rpn index", dataLsb, 0, 127);
      const event = {
        kind: "rpnRelative",
        group,
        channel,
        bank: dataMsb,
        index: dataLsb,
        delta: dataWord << 0 >> 0,
        // force signed int32
        timestamp
      };
      return event;
    }
    case STATUS_NRPN_RELATIVE: {
      assertDecodeRange("nrpn bank", dataMsb, 0, 127);
      assertDecodeRange("nrpn index", dataLsb, 0, 127);
      const event = {
        kind: "nrpnRelative",
        group,
        channel,
        bank: dataMsb,
        index: dataLsb,
        delta: dataWord << 0 >> 0,
        timestamp
      };
      return event;
    }
    case STATUS_NOTE_ON: {
      assertDecodeRange("note", dataMsb, 0, 127);
      const velocity = dataWord >>> 16 & 65535;
      const attributeData = dataWord & 65535;
      const event = {
        kind: "noteOn",
        group,
        channel,
        note: dataMsb,
        velocity,
        attributeType: dataLsb,
        attributeData,
        timestamp
      };
      return event;
    }
    case STATUS_NOTE_OFF: {
      assertDecodeRange("note", dataMsb, 0, 127);
      const velocity = dataWord >>> 16 & 65535;
      const attributeData = dataWord & 65535;
      const event = {
        kind: "noteOff",
        group,
        channel,
        note: dataMsb,
        velocity,
        attributeType: dataLsb,
        attributeData,
        timestamp
      };
      return event;
    }
    case STATUS_POLY_PRESSURE: {
      assertDecodeRange("note", dataMsb, 0, 127);
      const event = {
        kind: "polyPressure",
        group,
        channel,
        note: dataMsb,
        pressure: dataWord,
        timestamp
      };
      return event;
    }
    case STATUS_CONTROL_CHANGE: {
      assertDecodeRange("controller", dataMsb, 0, 127);
      const event = {
        kind: "controlChange",
        group,
        channel,
        controller: dataMsb,
        value: dataWord,
        timestamp
      };
      return event;
    }
    case STATUS_PROGRAM_CHANGE: {
      assertDecodeRange("program", dataMsb, 0, 127);
      const bankValid = (dataLsb & 128) !== 0;
      const bankMsb = bankValid ? dataWord >>> 24 & 255 : void 0;
      const bankLsb = bankValid ? dataWord >>> 16 & 255 : void 0;
      const event = {
        kind: "programChange",
        group,
        channel,
        program: dataMsb,
        bankMsb,
        bankLsb,
        timestamp
      };
      return event;
    }
    case STATUS_CHANNEL_PRESSURE: {
      const event = {
        kind: "channelPressure",
        group,
        channel,
        pressure: dataWord,
        timestamp
      };
      return event;
    }
    case STATUS_PITCH_BEND: {
      const event = {
        kind: "pitchBend",
        group,
        channel,
        value: dataWord,
        timestamp
      };
      return event;
    }
    case STATUS_PER_NOTE: {
      if (packet.length < 2) {
        return null;
      }
      assertDecodeRange("note", dataMsb, 0, 127);
      if (dataWord === 0) {
        const event2 = {
          kind: "perNoteManagement",
          group,
          channel,
          note: dataMsb,
          detach: (dataLsb & 2) !== 0,
          reset: (dataLsb & 1) !== 0,
          timestamp
        };
        return event2;
      }
      if (dataLsb < 128) {
        const event2 = {
          kind: "perNoteRegisteredController",
          group,
          channel,
          note: dataMsb,
          controller: dataLsb,
          value: dataWord,
          timestamp
        };
        return event2;
      }
      const event = {
        kind: "perNoteAssignableController",
        group,
        channel,
        note: dataMsb,
        controller: dataLsb,
        value: dataWord,
        timestamp
      };
      return event;
    }
    case STATUS_PER_NOTE_PITCH: {
      assertDecodeRange("note", dataMsb, 0, 127);
      const event = {
        kind: "perNotePitchBend",
        group,
        channel,
        note: dataMsb,
        value: dataWord,
        timestamp
      };
      return event;
    }
    default:
      throw new RangeError(`Unsupported MIDI 2.0 channel voice status 0x${status.toString(16)}`);
  }
}

// src/midi1.ts
function isChannelVoiceStatus(status) {
  return status >= 128 && status <= 239;
}
function channelDataLength(status) {
  const upper = status & 240;
  if (upper === 192 || upper === 208) return 1;
  return 2;
}
function isRealtimeStatus(status) {
  return status >= 248 && status <= 255 && status !== 249 && status !== 253;
}
function assertDataByte(value) {
  if (!Number.isInteger(value) || value < 0 || value > 127) {
    throw new RangeError(`Invalid MIDI 1.0 data byte: ${value}`);
  }
}
function assertSystemStatus(status) {
  const valid = [241, 242, 243, 246];
  if (!valid.includes(status)) {
    throw new RangeError(`Unsupported system common status 0x${status.toString(16)}`);
  }
}
function systemCommonLength(status) {
  switch (status) {
    case 241:
      return 1;
    case 242:
      return 2;
    case 243:
      return 1;
    case 246:
      return 0;
    default:
      throw new RangeError(`Unsupported system common status 0x${status.toString(16)}`);
  }
}
var SYSTEM_STATUSES = [241, 242, 243, 246, 248, 250, 251, 252, 254, 255];
function toSystemStatus(value) {
  const status = value & 255;
  const typed = status;
  if (!SYSTEM_STATUSES.includes(typed)) {
    throw new RangeError(`Unsupported system status 0x${status.toString(16)}`);
  }
  return typed;
}
function parseSysEx(data, start, group, out) {
  const payload = [];
  for (let i = start + 1; i < data.length; i++) {
    const b = data[i];
    if (b === 247) {
      if (payload.length === 0) {
        throw new RangeError("SysEx payload is empty.");
      }
      const manufacturerId = payload[0] === 0 ? payload.slice(0, 3) : [payload[0]];
      if (manufacturerId.length !== 1 && manufacturerId.length !== 3) {
        throw new RangeError("SysEx manufacturer ID must be 1 or 3 bytes.");
      }
      const message = payload.slice(manufacturerId.length);
      out.push(...fragmentSysEx7(manufacturerId, message, group));
      return i + 1;
    }
    if (isRealtimeStatus(b)) {
      out.push(encodeUmp({ kind: "system", group, status: toSystemStatus(b) }));
      continue;
    }
    payload.push(b);
  }
  throw new RangeError("Unterminated SysEx message (missing 0xF7).");
}
function scale16To7(value) {
  return Math.max(0, Math.min(127, Math.round(value / 65535 * 127)));
}
function scale32To14(value) {
  const clamped = Math.max(0, Math.min(4294967295, value >>> 0));
  return Math.round(clamped / 4294967295 * 16383);
}
function midi1BytesToUmp(bytes, group = 0) {
  const data = Array.from(bytes, (b) => b & 255);
  const out = [];
  let runningStatus = null;
  let i = 0;
  while (i < data.length) {
    const byte = data[i];
    if (byte & 128) {
      if (isRealtimeStatus(byte)) {
        const evt3 = { kind: "system", group, status: toSystemStatus(byte) };
        out.push(encodeUmp(evt3));
        i += 1;
        continue;
      }
      if (isChannelVoiceStatus(byte)) {
        const len3 = channelDataLength(byte);
        if (i + len3 >= data.length) throw new RangeError("Incomplete MIDI 1.0 channel voice message.");
        const d13 = data[i + 1];
        assertDataByte(d13);
        const d23 = len3 === 2 ? data[i + 2] : void 0;
        if (len3 === 2) assertDataByte(d23);
        const evt3 = { kind: "midi1ChannelVoice", group, status: byte, data1: d13, data2: d23 };
        out.push(encodeUmp(evt3));
        runningStatus = byte;
        i += 1 + len3;
        continue;
      }
      if (byte === 240) {
        runningStatus = null;
        i = parseSysEx(data, i, group, out);
        continue;
      }
      if (byte === 247) {
        throw new RangeError("Unexpected SysEx end (0xF7) without start.");
      }
      assertSystemStatus(byte);
      const len2 = systemCommonLength(byte);
      if (i + len2 >= data.length) throw new RangeError("Incomplete MIDI 1.0 system common message.");
      const d12 = len2 >= 1 ? data[i + 1] : void 0;
      const d22 = len2 === 2 ? data[i + 2] : void 0;
      if (d12 !== void 0) assertDataByte(d12);
      if (d22 !== void 0) assertDataByte(d22);
      const evt2 = { kind: "system", group, status: toSystemStatus(byte), data1: d12, data2: d22 };
      out.push(encodeUmp(evt2));
      runningStatus = null;
      i += 1 + len2;
      continue;
    }
    if (runningStatus === null) {
      throw new RangeError("Data byte encountered without running status.");
    }
    const len = channelDataLength(runningStatus);
    if (len === 1) {
      assertDataByte(byte);
      const evt2 = { kind: "midi1ChannelVoice", group, status: runningStatus, data1: byte };
      out.push(encodeUmp(evt2));
      i += 1;
      continue;
    }
    if (i + 1 >= data.length) {
      throw new RangeError("Incomplete running-status message.");
    }
    const d1 = byte;
    const d2 = data[i + 1];
    assertDataByte(d1);
    assertDataByte(d2);
    const evt = { kind: "midi1ChannelVoice", group, status: runningStatus, data1: d1, data2: d2 };
    out.push(encodeUmp(evt));
    i += 2;
  }
  return out;
}
function midi2ChannelVoiceToMidi1Bytes(event) {
  switch (event.kind) {
    case "noteOn": {
      const e = event;
      const status = 144 | e.channel & 15;
      const velocity = scale16To7(e.velocity);
      return [status, e.note & 127, velocity];
    }
    case "noteOff": {
      const e = event;
      const status = 128 | e.channel & 15;
      const velocity = scale16To7(e.velocity ?? 0);
      return [status, e.note & 127, velocity];
    }
    case "controlChange": {
      const status = 176 | event.channel & 15;
      const value = scale32To14(event.value) & 127;
      return [status, event.controller & 127, value];
    }
    case "programChange": {
      const e = event;
      const status = 192 | e.channel & 15;
      const bytes = [];
      if (e.bankMsb !== void 0) {
        bytes.push(176 | e.channel & 15, 0, e.bankMsb & 127);
      }
      if (e.bankLsb !== void 0) {
        bytes.push(176 | e.channel & 15, 32, e.bankLsb & 127);
      }
      bytes.push(status, e.program & 127);
      return bytes;
    }
    case "channelPressure": {
      const status = 208 | event.channel & 15;
      const value = scale32To14(event.pressure) & 127;
      return [status, value];
    }
    case "pitchBend": {
      const e = event;
      const status = 224 | e.channel & 15;
      const bend14 = scale32To14(e.value);
      const lsb = bend14 & 127;
      const msb = bend14 >> 7 & 127;
      return [status, lsb, msb];
    }
    default:
      throw new RangeError(`Unsupported MIDI 2.0 event kind for down-conversion: ${event.kind}`);
  }
}
function sysexBytesFromEvent(evt) {
  const header = evt.manufacturerId.map((b) => b & 127);
  const payload = Array.from(evt.payload, (b) => b & 127);
  return [240, ...header, ...payload, 247];
}
function sysexFromMidiCi(event) {
  const scopeByte2 = event.scope === "realtime" ? 127 : 126;
  const subId2 = event.format === "sysex7" ? event.subId2 & 127 : event.subId2;
  const version = event.format === "sysex7" ? event.version & 127 : event.version;
  const payload = [13, subId2, version, ...Array.from(event.payload, (b) => b & 127)];
  if (payload.length > 65535) {
    throw new RangeError("MIDI-CI SysEx payload too long for MIDI 1.0 framing.");
  }
  const sysEx = {
    kind: "sysex7",
    group: event.group,
    manufacturerId: [scopeByte2],
    payload: Uint8Array.from(payload)
  };
  return sysexBytesFromEvent(sysEx);
}
function midi2EventsToMidi1Bytes(events, opts) {
  const running = opts?.runningStatus ?? true;
  let lastStatus = null;
  const out = [];
  const emitStatusData = (status, data) => {
    if (running && lastStatus === status && (status & 240) !== 192 && (status & 240) !== 208) {
      out.push(...data);
    } else {
      out.push(status, ...data);
      if (status >= 128 && status <= 239) {
        lastStatus = status;
      }
    }
  };
  for (const evt of events) {
    switch (evt.kind) {
      case "midi1ChannelVoice": {
        const status = evt.status & 255;
        const d1 = evt.data1 ?? 0;
        const d2 = evt.data2;
        if (status >= 192 && status <= 223) {
          emitStatusData(status, [d1 & 127]);
        } else {
          emitStatusData(status, [d1 & 127, (d2 ?? 0) & 127]);
        }
        break;
      }
      case "noteOn":
      case "noteOff":
      case "controlChange":
      case "programChange":
      case "channelPressure":
      case "pitchBend": {
        const bytes = midi2ChannelVoiceToMidi1Bytes(evt);
        const status = bytes[0];
        emitStatusData(status, bytes.slice(1));
        break;
      }
      case "system": {
        const status = evt.status & 255;
        const parts = [status];
        if (evt.data1 !== void 0) parts.push(evt.data1 & 127);
        if (evt.data2 !== void 0) parts.push(evt.data2 & 127);
        out.push(...parts);
        lastStatus = null;
        break;
      }
      case "sysex7": {
        const sys = evt;
        out.push(240, ...sys.manufacturerId, ...sys.payload, 247);
        lastStatus = null;
        break;
      }
      case "sysex8": {
        const bytes = sysexBytesFromEvent({
          kind: "sysex7",
          group: evt.group,
          manufacturerId: evt.manufacturerId,
          payload: Uint8Array.from(evt.payload, (b) => b & 127)
        });
        out.push(...bytes);
        lastStatus = null;
        break;
      }
      case "midiCi": {
        const bytes = sysexFromMidiCi(evt);
        out.push(...bytes);
        lastStatus = null;
        break;
      }
      default:
        lastStatus = null;
        break;
    }
  }
  return out;
}

// src/jitter.ts
var JitterReductionSynchronizer = class {
  constructor(clock, unitMs = 1) {
    this.groups = /* @__PURE__ */ new Map();
    this.clock = clock;
    this.unitMs = unitMs;
  }
  /**
    * Handle a utility event (jrClock or jrTimestamp) and update internal state.
    * Returns an absolute host time (ms) when a jrTimestamp is processed and a base clock is known; otherwise null.
    */
  handle(event, receivedAtMs = this.clock.now()) {
    if (event.kind !== "utility") return null;
    const group = event.group ?? event.timestampGroup ?? 0;
    if (event.status === "jrClock") {
      const state = {
        baseMs: receivedAtMs - (event.value ?? 0) * this.unitMs,
        clockValue: event.value ?? 0,
        lastTimestamp: void 0
      };
      this.groups.set(group, state);
      return null;
    }
    if (event.status === "jrTimestamp") {
      const state = this.groups.get(group);
      if (!state) return null;
      state.lastTimestamp = event.value ?? 0;
      return state.baseMs + (event.value ?? 0) * this.unitMs;
    }
    return null;
  }
  /**
   * Convert a JR timestamp value into an absolute host time (ms) for the given group.
   * Returns null if no JR clock has been observed for the group.
   */
  toAbsoluteTime(group, jrTimestampValue) {
    const state = this.groups.get(group);
    if (!state) return null;
    const value = jrTimestampValue ?? state.lastTimestamp;
    if (value === void 0) return null;
    return state.baseMs + value * this.unitMs;
  }
};
function applyJitterReduction(events, jr, receivedAtMs) {
  const out = [];
  const now = receivedAtMs ?? jr["clock"]?.now?.() ?? 0;
  for (const evt of events) {
    if (evt.kind === "utility" && (evt.status === "jrClock" || evt.status === "jrTimestamp")) {
      const ts = jr.handle(evt, now);
      out.push(ts !== null ? { ...evt, timestamp: ts } : evt);
      continue;
    }
    const abs = evt.timestamp ?? jr.toAbsoluteTime(evt.group ?? 0);
    out.push(abs !== null ? { ...evt, timestamp: abs } : evt);
  }
  return out;
}

// src/pe-subscriptions.ts
var PeSubscriptionManager = class {
  constructor(opts) {
    this.subs = /* @__PURE__ */ new Map();
    this.supportsFlowControl = opts?.supportsFlowControl ?? true;
    this.maxNakRetries = opts?.maxNakRetries ?? 3;
  }
  /**
   * Convenience that wraps {@link handle} and returns zero or more outbound
   * `PropertyExchangeEvent`s to emit (subscribe replies, ACK/NAK, errors).
   */
  process(event) {
    const action = this.handle(event);
    if (!action) return [];
    if (action.kind === "reply") return [action.event];
    return [
      {
        kind: "propertyExchange",
        group: event.group,
        command: "notify",
        header: { status: action.status, message: action.message }
      }
    ];
  }
  /**
   * Process an incoming Property Exchange event and return any action
   * (subscribe reply, flow-control ACK/NAK, or error) to emit.
   */
  handle(event) {
    if (event.subscriptionCommand) {
      return this.handleLifecycle(event);
    }
    if (event.command === "subscribe") {
      if (!event.subscriptionId) {
        return { kind: "error", status: 400, message: "missing subscriptionId" };
      }
      const wantsFlowControl = Boolean(event.header?.flowControl);
      if (wantsFlowControl && !this.supportsFlowControl) {
        return {
          kind: "reply",
          event: {
            kind: "propertyExchange",
            group: event.group,
            command: "subscribeReply",
            subscriptionId: event.subscriptionId,
            header: { status: 406 }
          }
        };
      }
      const resource = event.header?.resource ?? event.header?.res;
      const state = {
        subscriptionId: event.subscriptionId,
        requestId: event.requestId,
        flowControl: wantsFlowControl,
        stage: "start",
        lastChunkNumber: -1,
        resource,
        lastActivityMs: Date.now(),
        nakCount: 0
      };
      this.subs.set(event.subscriptionId, state);
      return {
        kind: "reply",
        event: {
          kind: "propertyExchange",
          group: event.group,
          command: "subscribeReply",
          subscriptionId: event.subscriptionId,
          header: { status: 200, flowControl: wantsFlowControl }
        }
      };
    }
    if (event.command === "notify") {
      if (!event.subscriptionId) {
        return { kind: "error", status: 400, message: "missing subscriptionId" };
      }
      const sub = this.subs.get(event.subscriptionId);
      if (!sub) {
        return { kind: "reply", event: { kind: "propertyExchange", group: event.group, command: "notify", header: { status: 404 } } };
      }
      if (sub.stage !== "active") {
        return { kind: "reply", event: { kind: "propertyExchange", group: event.group, command: "notify", header: { status: 409 } } };
      }
      if (sub.flowControl && event.header?.flowControl) {
        return {
          kind: "reply",
          event: {
            kind: "propertyExchange",
            group: event.group,
            command: "notify",
            flowControlAck: {
              status: 17,
              requestId: event.header?.requestId ?? 0,
              chunkNumber: event.header?.chunkNumber ?? 0,
              messageLength: event.data instanceof Uint8Array ? event.data.byteLength : 0
            }
          }
        };
      }
      return null;
    }
    if (event.command === "terminate") {
      if (event.subscriptionId) {
        this.subs.delete(event.subscriptionId);
      }
      return null;
    }
    return null;
  }
  handleLifecycle(event) {
    const id = event.subscriptionId;
    if (!id) {
      return { kind: "error", status: 400, message: "missing subscriptionId" };
    }
    const sub = this.subs.get(id);
    const resource = event.header?.resource ?? event.header?.res;
    switch (event.subscriptionCommand) {
      case "start": {
        const state = {
          subscriptionId: id,
          requestId: event.requestId,
          flowControl: Boolean(event.header?.flowControl),
          stage: "start",
          lastChunkNumber: -1,
          resource,
          lastActivityMs: Date.now(),
          nakCount: 0
        };
        this.subs.set(id, state);
        return {
          kind: "reply",
          event: {
            kind: "propertyExchange",
            group: event.group,
            command: "subscribeReply",
            subscriptionId: id,
            subscriptionCommand: "start",
            header: { status: 200, flowControl: state.flowControl }
          }
        };
      }
      case "partial": {
        if (!sub) return { kind: "error", status: 404, message: "subscription not found" };
        sub.stage = "partial";
        sub.lastActivityMs = Date.now();
        this.subs.set(id, sub);
        return null;
      }
      case "full": {
        if (!sub) return { kind: "error", status: 404, message: "subscription not found" };
        sub.stage = "full";
        sub.lastActivityMs = Date.now();
        this.subs.set(id, sub);
        return {
          kind: "reply",
          event: {
            kind: "propertyExchange",
            group: event.group,
            command: "subscribeReply",
            subscriptionId: id,
            subscriptionCommand: "full",
            header: { status: 200 }
          }
        };
      }
      case "notify": {
        if (!sub) {
          return { kind: "reply", event: { kind: "propertyExchange", group: event.group, command: "notify", header: { status: 404 } } };
        }
        if (sub.resource && resource && sub.resource !== resource) {
          return { kind: "reply", event: { kind: "propertyExchange", group: event.group, command: "notify", header: { status: 409 } } };
        }
        if (sub.stage !== "full" && sub.stage !== "active") {
          return { kind: "reply", event: { kind: "propertyExchange", group: event.group, command: "notify", header: { status: 409 } } };
        }
        sub.stage = "active";
        const chunkNumber = typeof event.header?.chunkNumber === "number" ? event.header.chunkNumber : sub.lastChunkNumber + 1;
        if (sub.flowControl && event.header?.flowControl) {
          if (chunkNumber !== sub.lastChunkNumber + 1) {
            sub.lastChunkNumber = chunkNumber;
            sub.lastActivityMs = Date.now();
            sub.nakCount = (sub.nakCount ?? 0) + 1;
            this.subs.set(id, sub);
            return {
              kind: "reply",
              event: {
                kind: "propertyExchange",
                group: event.group,
                command: "notify",
                flowControlNak: {
                  status: 18,
                  chunkNumber
                }
              }
            };
          }
          sub.lastChunkNumber = chunkNumber;
          sub.nakCount = 0;
        }
        sub.lastActivityMs = Date.now();
        this.subs.set(id, sub);
        if (sub.flowControl && event.header?.flowControl) {
          return {
            kind: "reply",
            event: {
              kind: "propertyExchange",
              group: event.group,
              command: "notify",
              flowControlAck: {
                status: 17,
                requestId: event.header?.requestId ?? 0,
                chunkNumber: event.header?.chunkNumber ?? 0,
                messageLength: event.data instanceof Uint8Array ? event.data.byteLength : 0
              }
            }
          };
        }
        return null;
      }
      case "end": {
        this.subs.delete(id);
        return {
          kind: "reply",
          event: {
            kind: "propertyExchange",
            group: event.group,
            command: "subscribeReply",
            subscriptionId: id,
            subscriptionCommand: "end",
            header: { status: 200 }
          }
        };
      }
      default:
        return { kind: "error", status: 400, message: "unknown subscriptionCommand" };
    }
  }
  /**
   * Emit NAKs for subscriptions whose flow-control ACK window has timed out.
   * Returns PropertyExchangeEvents to send; caller controls timing.
   */
  collectTimeouts(nowMs = Date.now(), timeoutMs = 1e3) {
    const out = [];
    for (const [id, sub] of this.subs) {
      if (!sub.flowControl || sub.stage !== "active") continue;
      if (nowMs - sub.lastActivityMs >= timeoutMs) {
        const expectedChunk = sub.lastChunkNumber + 1;
        const nakCount = (sub.nakCount ?? 0) + 1;
        if (nakCount > this.maxNakRetries) {
          out.push({
            kind: "propertyExchange",
            group: 0,
            command: "notify",
            subscriptionId: id,
            header: { status: 408 }
          });
          this.subs.delete(id);
          continue;
        }
        const retryAfterMs = Math.min(4e3, timeoutMs * Math.pow(2, nakCount - 1));
        out.push({
          kind: "propertyExchange",
          group: 0,
          command: "notify",
          subscriptionId: id,
          flowControlNak: { status: 18, chunkNumber: expectedChunk },
          header: { retryAfterMs }
        });
        this.subs.set(id, { ...sub, lastActivityMs: nowMs, nakCount });
      }
    }
    return out;
  }
};

// src/profile-session.ts
var ProfileSession = class {
  constructor(supportedProfiles = [], psdCapableProfiles) {
    this.supported = /* @__PURE__ */ new Set();
    this.psdCapable = /* @__PURE__ */ new Set();
    this.enabled = /* @__PURE__ */ new Map();
    this.details = /* @__PURE__ */ new Map();
    this.supported = new Set(supportedProfiles);
    this.psdCapable = new Set(psdCapableProfiles ?? this.supported);
  }
  key(target, channels) {
    const scope = target ?? "none";
    const channelScope = channels?.length ? [...channels].sort((a, b) => a - b).join(",") : "*";
    return `${scope}|${channelScope}`;
  }
  mask(channels) {
    let mask = 0;
    for (const channel of channels ?? []) {
      if (Number.isInteger(channel) && channel >= 0 && channel <= 15) mask |= 1 << channel;
    }
    return { cmL: mask & 255, cmH: mask >>> 8 & 255 };
  }
  event(base, group) {
    return { kind: "profile", group, ...base };
  }
  updateSupportedProfiles(profiles, target, channels) {
    const next = new Set(profiles);
    const added = [...next].filter((profile) => !this.supported.has(profile)).sort();
    const removed = [...this.supported].filter((profile) => !next.has(profile)).sort();
    this.supported = next;
    for (const profile of removed) this.psdCapable.delete(profile);
    for (const profile of added) this.psdCapable.add(profile);
    for (const set of this.enabled.values()) for (const profile of removed) set.delete(profile);
    const scope = this.mask(channels);
    return [
      ...added.map((profile) => this.event({ command: "addedReport", profileId: profile, target, channels, details: { ok: 1, ...scope } }, 0)),
      ...removed.map((profile) => this.event({ command: "removedReport", profileId: profile, target, channels, details: { ok: 1, ...scope } }, 0))
    ];
  }
  lastDetails(target, channels) {
    return this.details.get(this.key(target, channels));
  }
  handle(request) {
    if (!request.profileId) return [];
    const key = this.key(request.target, request.channels);
    const scope = this.mask(request.channels);
    switch (request.command) {
      case "inquiry": {
        const reply = this.event({
          command: "reply",
          profileId: request.profileId,
          target: request.target,
          channels: request.channels,
          details: {
            ver: 1,
            supported: this.supported.has(request.profileId) ? 1 : 0,
            enabled: this.enabled.get(key)?.has(request.profileId) ? 1 : 0,
            cmL: scope.cmL,
            cmH: scope.cmH
          }
        }, request.group);
        this.details.set(key, reply);
        return [reply];
      }
      case "setOn": {
        if (!request.target) return [];
        const set = this.enabled.get(key) ?? /* @__PURE__ */ new Set();
        if (!this.supported.has(request.profileId)) {
          return [this.event({ command: "disabledReport", profileId: request.profileId, target: request.target, channels: request.channels, details: { ok: 0, ...scope } }, request.group)];
        }
        set.add(request.profileId);
        this.enabled.set(key, set);
        return [this.event({ command: "enabledReport", profileId: request.profileId, target: request.target, channels: request.channels, details: { ok: 1, ...scope } }, request.group)];
      }
      case "setOff": {
        if (!request.target) return [];
        this.enabled.get(key)?.delete(request.profileId);
        return [this.event({ command: "disabledReport", profileId: request.profileId, target: request.target, channels: request.channels, details: { ok: 1, ...scope } }, request.group)];
      }
      case "detailsInquiry": {
        if (!request.target) return [];
        const reply = this.event({
          command: "detailsReply",
          profileId: request.profileId,
          target: request.target,
          channels: request.channels,
          details: {
            ver: 1,
            supported: this.supported.has(request.profileId) ? 1 : 0,
            enabled: this.enabled.get(key)?.has(request.profileId) ? 1 : 0,
            psd: this.psdCapable.has(request.profileId) ? 1 : 0,
            ...scope
          }
        }, request.group);
        this.details.set(key, reply);
        return [reply];
      }
      case "detailsReply":
        this.details.set(key, request);
        return [];
      default:
        return [];
    }
  }
};

// src/generated/openapi-types.ts
function isPlainObject(value) {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}
function hasOnlyKeys(value, keys) {
  return Object.keys(value).every((k) => keys.includes(k));
}
function isMidiCiPropertyExchangeBody(value) {
  return isPlainObject(value) && ("command" in value ? value["command"] === "capInquiry" || value["command"] === "capReply" || value["command"] === "get" || value["command"] === "getReply" || value["command"] === "set" || value["command"] === "setReply" || value["command"] === "subscribe" || value["command"] === "subscribeReply" || value["command"] === "notify" || value["command"] === "terminate" : true) && ("subscriptionId" in value ? typeof value["subscriptionId"] === "string" : true) && ("requestId" in value ? typeof value["requestId"] === "number" && Number.isInteger(value["requestId"]) && value["requestId"] >= 0 && value["requestId"] <= 4294967295 : true) && ("encoding" in value ? value["encoding"] === "json" || value["encoding"] === "binary" || value["encoding"] === "json+zlib" || value["encoding"] === "binary+zlib" || value["encoding"] === "mcoded7" : true) && ("header" in value ? isPlainObject(value["header"]) && ("resource" in value["header"] ? typeof value["header"]["resource"] === "string" : true) && ("resId" in value["header"] ? typeof value["header"]["resId"] === "number" && Number.isInteger(value["header"]["resId"]) && value["header"]["resId"] >= 0 && value["header"]["resId"] <= 4294967295 : true) && ("encoding" in value["header"] ? value["header"]["encoding"] === "json" || value["header"]["encoding"] === "binary" || value["header"]["encoding"] === "json+zlib" || value["header"]["encoding"] === "binary+zlib" || value["header"]["encoding"] === "mcoded7" : true) && ("flowControl" in value["header"] ? typeof value["header"]["flowControl"] === "boolean" : true) && ("status" in value["header"] ? typeof value["header"]["status"] === "number" && Number.isInteger(value["header"]["status"]) && value["header"]["status"] >= 100 && value["header"]["status"] <= 999 : true) && ("message" in value["header"] ? typeof value["header"]["message"] === "string" : true) && ("cacheTime" in value["header"] ? typeof value["header"]["cacheTime"] === "number" && Number.isInteger(value["header"]["cacheTime"]) && value["header"]["cacheTime"] >= 0 && true : true) && ("mediaType" in value["header"] ? typeof value["header"]["mediaType"] === "string" : true) && hasOnlyKeys(value["header"], ["resource", "resId", "encoding", "flowControl", "status", "message", "cacheTime", "mediaType"]) : true) && ("data" in value ? isPlainObject(value["data"]) && hasOnlyKeys(value["data"], []) || Array.isArray(value["data"]) && true && true && value["data"].every((item) => typeof item === "number" && Number.isInteger(item) && item >= 0 && item <= 255) : true) && ("statusCodes" in value ? Array.isArray(value["statusCodes"]) && true && true && value["statusCodes"].every((item) => item === 200 || item === 201 || item === 341 || item === 342 || item === 343 || item === 400 || item === 403 || item === 404 || item === 405 || item === 406 || item === 407 || item === 413 || item === 415 || item === 445 || item === 500) : true) && ("timeoutStatus" in value ? value["timeoutStatus"] === 100 || value["timeoutStatus"] === 408 : true) && ("flowControlError" in value ? value["flowControlError"] === 406 || value["flowControlError"] === 407 : true) && ("deltaClockstampTicksPerQuarterNote" in value ? typeof value["deltaClockstampTicksPerQuarterNote"] === "number" && Number.isInteger(value["deltaClockstampTicksPerQuarterNote"]) && value["deltaClockstampTicksPerQuarterNote"] >= 0 && value["deltaClockstampTicksPerQuarterNote"] <= 65535 : true) && ("cacheTime" in value ? typeof value["cacheTime"] === "number" && Number.isInteger(value["cacheTime"]) && value["cacheTime"] >= 0 && true : true) && ("flowControlAck" in value ? isPlainObject(value["flowControlAck"]) && ("requestId" in value["flowControlAck"] ? typeof value["flowControlAck"]["requestId"] === "number" && Number.isInteger(value["flowControlAck"]["requestId"]) && value["flowControlAck"]["requestId"] >= 0 && value["flowControlAck"]["requestId"] <= 255 : true) && ("chunkNumber" in value["flowControlAck"] ? typeof value["flowControlAck"]["chunkNumber"] === "number" && Number.isInteger(value["flowControlAck"]["chunkNumber"]) && value["flowControlAck"]["chunkNumber"] >= 0 && value["flowControlAck"]["chunkNumber"] <= 65535 : true) && ("messageLength" in value["flowControlAck"] ? typeof value["flowControlAck"]["messageLength"] === "number" && Number.isInteger(value["flowControlAck"]["messageLength"]) && value["flowControlAck"]["messageLength"] >= 0 && value["flowControlAck"]["messageLength"] <= 65535 : true) && ("status" in value["flowControlAck"] ? value["flowControlAck"]["status"] === 17 : true) && hasOnlyKeys(value["flowControlAck"], ["requestId", "chunkNumber", "messageLength", "status"]) : true) && ("flowControlNak" in value ? isPlainObject(value["flowControlNak"]) && ("status" in value["flowControlNak"] ? value["flowControlNak"]["status"] === 18 : true) && ("chunkNumber" in value["flowControlNak"] ? typeof value["flowControlNak"]["chunkNumber"] === "number" && Number.isInteger(value["flowControlNak"]["chunkNumber"]) && value["flowControlNak"]["chunkNumber"] >= 0 && value["flowControlNak"]["chunkNumber"] <= 65535 : true) && hasOnlyKeys(value["flowControlNak"], ["status", "chunkNumber"]) : true) && ("subscriptionCommand" in value ? value["subscriptionCommand"] === "start" || value["subscriptionCommand"] === "partial" || value["subscriptionCommand"] === "full" || value["subscriptionCommand"] === "notify" || value["subscriptionCommand"] === "end" : true) && hasOnlyKeys(value, ["command", "subscriptionId", "requestId", "encoding", "header", "data", "statusCodes", "timeoutStatus", "flowControlError", "deltaClockstampTicksPerQuarterNote", "cacheTime", "flowControlAck", "flowControlNak", "subscriptionCommand"]);
}
function isStreamBody(value) {
  return isPlainObject(value) && ("opcode" in value && (value["opcode"] === 0 || value["opcode"] === 1 || value["opcode"] === 2 || value["opcode"] === 3 || value["opcode"] === 4 || value["opcode"] === 5 || value["opcode"] === 6 || value["opcode"] === 16 || value["opcode"] === 17 || value["opcode"] === 18 || value["opcode"] === 32 || value["opcode"] === 33)) && ("endpointDiscovery" in value ? isPlainObject(value["endpointDiscovery"]) && ("majorVersion" in value["endpointDiscovery"] ? typeof value["endpointDiscovery"]["majorVersion"] === "number" && Number.isInteger(value["endpointDiscovery"]["majorVersion"]) && value["endpointDiscovery"]["majorVersion"] >= 0 && value["endpointDiscovery"]["majorVersion"] <= 255 : true) && ("minorVersion" in value["endpointDiscovery"] ? typeof value["endpointDiscovery"]["minorVersion"] === "number" && Number.isInteger(value["endpointDiscovery"]["minorVersion"]) && value["endpointDiscovery"]["minorVersion"] >= 0 && value["endpointDiscovery"]["minorVersion"] <= 255 : true) && ("maxGroups" in value["endpointDiscovery"] ? typeof value["endpointDiscovery"]["maxGroups"] === "number" && Number.isInteger(value["endpointDiscovery"]["maxGroups"]) && value["endpointDiscovery"]["maxGroups"] >= 0 && value["endpointDiscovery"]["maxGroups"] <= 15 : true) && ("filter" in value["endpointDiscovery"] ? isPlainObject(value["endpointDiscovery"]["filter"]) && ("endpointInfo" in value["endpointDiscovery"]["filter"] ? typeof value["endpointDiscovery"]["filter"]["endpointInfo"] === "boolean" : true) && ("deviceIdentity" in value["endpointDiscovery"]["filter"] ? typeof value["endpointDiscovery"]["filter"]["deviceIdentity"] === "boolean" : true) && ("endpointName" in value["endpointDiscovery"]["filter"] ? typeof value["endpointDiscovery"]["filter"]["endpointName"] === "boolean" : true) && ("productInstanceId" in value["endpointDiscovery"]["filter"] ? typeof value["endpointDiscovery"]["filter"]["productInstanceId"] === "boolean" : true) && ("streamConfig" in value["endpointDiscovery"]["filter"] ? typeof value["endpointDiscovery"]["filter"]["streamConfig"] === "boolean" : true) && hasOnlyKeys(value["endpointDiscovery"]["filter"], ["endpointInfo", "deviceIdentity", "endpointName", "productInstanceId", "streamConfig"]) : true) && hasOnlyKeys(value["endpointDiscovery"], ["majorVersion", "minorVersion", "maxGroups", "filter"]) : true) && ("endpointInfoNotification" in value ? isPlainObject(value["endpointInfoNotification"]) && ("staticFunctionBlocks" in value["endpointInfoNotification"] ? typeof value["endpointInfoNotification"]["staticFunctionBlocks"] === "boolean" : true) && ("numberOfFunctionBlocks" in value["endpointInfoNotification"] ? typeof value["endpointInfoNotification"]["numberOfFunctionBlocks"] === "number" && Number.isInteger(value["endpointInfoNotification"]["numberOfFunctionBlocks"]) && value["endpointInfoNotification"]["numberOfFunctionBlocks"] >= 0 && value["endpointInfoNotification"]["numberOfFunctionBlocks"] <= 32 : true) && ("umpVersionMajor" in value["endpointInfoNotification"] ? typeof value["endpointInfoNotification"]["umpVersionMajor"] === "number" && Number.isInteger(value["endpointInfoNotification"]["umpVersionMajor"]) && value["endpointInfoNotification"]["umpVersionMajor"] >= 0 && value["endpointInfoNotification"]["umpVersionMajor"] <= 255 : true) && ("umpVersionMinor" in value["endpointInfoNotification"] ? typeof value["endpointInfoNotification"]["umpVersionMinor"] === "number" && Number.isInteger(value["endpointInfoNotification"]["umpVersionMinor"]) && value["endpointInfoNotification"]["umpVersionMinor"] >= 0 && value["endpointInfoNotification"]["umpVersionMinor"] <= 255 : true) && ("midi2Supported" in value["endpointInfoNotification"] ? typeof value["endpointInfoNotification"]["midi2Supported"] === "boolean" : true) && ("midi1Supported" in value["endpointInfoNotification"] ? typeof value["endpointInfoNotification"]["midi1Supported"] === "boolean" : true) && ("jrTimestampsRx" in value["endpointInfoNotification"] ? typeof value["endpointInfoNotification"]["jrTimestampsRx"] === "boolean" : true) && ("jrTimestampsTx" in value["endpointInfoNotification"] ? typeof value["endpointInfoNotification"]["jrTimestampsTx"] === "boolean" : true) && hasOnlyKeys(value["endpointInfoNotification"], ["staticFunctionBlocks", "numberOfFunctionBlocks", "umpVersionMajor", "umpVersionMinor", "midi2Supported", "midi1Supported", "jrTimestampsRx", "jrTimestampsTx"]) : true) && ("deviceIdentityNotification" in value ? isPlainObject(value["deviceIdentityNotification"]) && ("manufacturerId" in value["deviceIdentityNotification"] ? Array.isArray(value["deviceIdentityNotification"]["manufacturerId"]) && value["deviceIdentityNotification"]["manufacturerId"].length >= 1 && value["deviceIdentityNotification"]["manufacturerId"].length <= 1 && value["deviceIdentityNotification"]["manufacturerId"].every((item) => typeof item === "number" && Number.isInteger(item) && item >= 0 && item <= 255) || Array.isArray(value["deviceIdentityNotification"]["manufacturerId"]) && value["deviceIdentityNotification"]["manufacturerId"].length >= 3 && value["deviceIdentityNotification"]["manufacturerId"].length <= 3 && value["deviceIdentityNotification"]["manufacturerId"].every((item) => typeof item === "number" && Number.isInteger(item) && item >= 0 && item <= 255) : true) && ("deviceFamily" in value["deviceIdentityNotification"] ? typeof value["deviceIdentityNotification"]["deviceFamily"] === "number" && Number.isInteger(value["deviceIdentityNotification"]["deviceFamily"]) && value["deviceIdentityNotification"]["deviceFamily"] >= 0 && value["deviceIdentityNotification"]["deviceFamily"] <= 65535 : true) && ("deviceModel" in value["deviceIdentityNotification"] ? typeof value["deviceIdentityNotification"]["deviceModel"] === "number" && Number.isInteger(value["deviceIdentityNotification"]["deviceModel"]) && value["deviceIdentityNotification"]["deviceModel"] >= 0 && value["deviceIdentityNotification"]["deviceModel"] <= 65535 : true) && ("softwareRevision" in value["deviceIdentityNotification"] ? typeof value["deviceIdentityNotification"]["softwareRevision"] === "number" && Number.isInteger(value["deviceIdentityNotification"]["softwareRevision"]) && value["deviceIdentityNotification"]["softwareRevision"] >= 0 && value["deviceIdentityNotification"]["softwareRevision"] <= 4294967295 : true) && hasOnlyKeys(value["deviceIdentityNotification"], ["manufacturerId", "deviceFamily", "deviceModel", "softwareRevision"]) : true) && ("endpointNameNotification" in value ? isPlainObject(value["endpointNameNotification"]) && ("name" in value["endpointNameNotification"] && typeof value["endpointNameNotification"]["name"] === "string") && hasOnlyKeys(value["endpointNameNotification"], ["name"]) : true) && ("productInstanceIdNotification" in value ? isPlainObject(value["productInstanceIdNotification"]) && ("productInstanceId" in value["productInstanceIdNotification"] && typeof value["productInstanceIdNotification"]["productInstanceId"] === "string") && hasOnlyKeys(value["productInstanceIdNotification"], ["productInstanceId"]) : true) && ("streamConfigRequest" in value ? isPlainObject(value["streamConfigRequest"]) && ("protocol" in value["streamConfigRequest"] ? value["streamConfigRequest"]["protocol"] === "midi1" || value["streamConfigRequest"]["protocol"] === "midi2" : true) && ("jrTimestampsTx" in value["streamConfigRequest"] ? typeof value["streamConfigRequest"]["jrTimestampsTx"] === "boolean" : true) && ("jrTimestampsRx" in value["streamConfigRequest"] ? typeof value["streamConfigRequest"]["jrTimestampsRx"] === "boolean" : true) && hasOnlyKeys(value["streamConfigRequest"], ["protocol", "jrTimestampsTx", "jrTimestampsRx"]) : true) && ("streamConfigNotification" in value ? isPlainObject(value["streamConfigNotification"]) && ("protocol" in value["streamConfigNotification"] ? value["streamConfigNotification"]["protocol"] === "midi1" || value["streamConfigNotification"]["protocol"] === "midi2" : true) && ("jrTimestampsTx" in value["streamConfigNotification"] ? typeof value["streamConfigNotification"]["jrTimestampsTx"] === "boolean" : true) && ("jrTimestampsRx" in value["streamConfigNotification"] ? typeof value["streamConfigNotification"]["jrTimestampsRx"] === "boolean" : true) && hasOnlyKeys(value["streamConfigNotification"], ["protocol", "jrTimestampsTx", "jrTimestampsRx"]) : true) && ("functionBlockDiscovery" in value ? isPlainObject(value["functionBlockDiscovery"]) && ("filterBitmap" in value["functionBlockDiscovery"] ? typeof value["functionBlockDiscovery"]["filterBitmap"] === "number" && Number.isInteger(value["functionBlockDiscovery"]["filterBitmap"]) && value["functionBlockDiscovery"]["filterBitmap"] >= 0 && value["functionBlockDiscovery"]["filterBitmap"] <= 4294967295 : true) && hasOnlyKeys(value["functionBlockDiscovery"], ["filterBitmap"]) : true) && ("functionBlockInfo" in value ? isPlainObject(value["functionBlockInfo"]) && ("index" in value["functionBlockInfo"] ? typeof value["functionBlockInfo"]["index"] === "number" && Number.isInteger(value["functionBlockInfo"]["index"]) && value["functionBlockInfo"]["index"] >= 0 && value["functionBlockInfo"]["index"] <= 255 : true) && ("firstGroup" in value["functionBlockInfo"] ? typeof value["functionBlockInfo"]["firstGroup"] === "number" && Number.isInteger(value["functionBlockInfo"]["firstGroup"]) && value["functionBlockInfo"]["firstGroup"] >= 0 && value["functionBlockInfo"]["firstGroup"] <= 15 : true) && ("groupCount" in value["functionBlockInfo"] ? typeof value["functionBlockInfo"]["groupCount"] === "number" && Number.isInteger(value["functionBlockInfo"]["groupCount"]) && value["functionBlockInfo"]["groupCount"] >= 0 && value["functionBlockInfo"]["groupCount"] <= 15 : true) && ("active" in value["functionBlockInfo"] ? typeof value["functionBlockInfo"]["active"] === "boolean" : true) && ("direction" in value["functionBlockInfo"] ? value["functionBlockInfo"]["direction"] === 0 || value["functionBlockInfo"]["direction"] === 1 || value["functionBlockInfo"]["direction"] === 2 || value["functionBlockInfo"]["direction"] === 3 : true) && ("midi1Bandwidth" in value["functionBlockInfo"] ? value["functionBlockInfo"]["midi1Bandwidth"] === 0 || value["functionBlockInfo"]["midi1Bandwidth"] === 1 || value["functionBlockInfo"]["midi1Bandwidth"] === 2 : true) && hasOnlyKeys(value["functionBlockInfo"], ["index", "firstGroup", "groupCount", "active", "direction", "midi1Bandwidth"]) : true) && ("processInquiry" in value ? isPlainObject(value["processInquiry"]) && ("functionBlock" in value["processInquiry"] ? typeof value["processInquiry"]["functionBlock"] === "number" && Number.isInteger(value["processInquiry"]["functionBlock"]) && value["processInquiry"]["functionBlock"] >= 0 && value["processInquiry"]["functionBlock"] <= 127 : true) && ("part" in value["processInquiry"] ? typeof value["processInquiry"]["part"] === "number" && Number.isInteger(value["processInquiry"]["part"]) && value["processInquiry"]["part"] >= 0 && value["processInquiry"]["part"] <= 15 : true) && hasOnlyKeys(value["processInquiry"], ["functionBlock", "part"]) : true) && ("processInquiryReply" in value ? isPlainObject(value["processInquiryReply"]) && ("functionBlock" in value["processInquiryReply"] ? typeof value["processInquiryReply"]["functionBlock"] === "number" && Number.isInteger(value["processInquiryReply"]["functionBlock"]) && value["processInquiryReply"]["functionBlock"] >= 0 && value["processInquiryReply"]["functionBlock"] <= 127 : true) && ("part" in value["processInquiryReply"] ? typeof value["processInquiryReply"]["part"] === "number" && Number.isInteger(value["processInquiryReply"]["part"]) && value["processInquiryReply"]["part"] >= 0 && value["processInquiryReply"]["part"] <= 15 : true) && hasOnlyKeys(value["processInquiryReply"], ["functionBlock", "part"]) : true) && hasOnlyKeys(value, ["opcode", "endpointDiscovery", "endpointInfoNotification", "deviceIdentityNotification", "endpointNameNotification", "productInstanceIdNotification", "streamConfigRequest", "streamConfigNotification", "functionBlockDiscovery", "functionBlockInfo", "processInquiry", "processInquiryReply"]);
}
function isUint4(value) {
  return typeof value === "number" && Number.isInteger(value) && value >= 0 && value <= 15;
}
function isUmpPacket(value) {
  return isPlainObject(value) && ("messageType" in value && (value["messageType"] === 0 || value["messageType"] === 1 || value["messageType"] === 2 || value["messageType"] === 3 || value["messageType"] === 15)) && ("group" in value ? isUint4(value["group"]) : true) && ("body" in value && (isPlainObject(value["body"]) && ("opcode" in value["body"] && (value["body"]["opcode"] === 0 || value["body"]["opcode"] === 1 || value["body"]["opcode"] === 2)) && ("jrClock" in value["body"] ? isPlainObject(value["body"]["jrClock"]) && ("timestamp32" in value["body"]["jrClock"] && (typeof value["body"]["jrClock"]["timestamp32"] === "number" && Number.isInteger(value["body"]["jrClock"]["timestamp32"]) && value["body"]["jrClock"]["timestamp32"] >= 0 && value["body"]["jrClock"]["timestamp32"] <= 4294967295)) && hasOnlyKeys(value["body"]["jrClock"], ["timestamp32"]) : true) && ("jrTimestamp" in value["body"] ? isPlainObject(value["body"]["jrTimestamp"]) && ("time15" in value["body"]["jrTimestamp"] && (typeof value["body"]["jrTimestamp"]["time15"] === "number" && Number.isInteger(value["body"]["jrTimestamp"]["time15"]) && value["body"]["jrTimestamp"]["time15"] >= 0 && value["body"]["jrTimestamp"]["time15"] <= 32767)) && hasOnlyKeys(value["body"]["jrTimestamp"], ["time15"]) : true) && hasOnlyKeys(value["body"], ["opcode", "jrClock", "jrTimestamp"]) || isPlainObject(value["body"]) && ("status" in value["body"] && (value["body"]["status"] === 241 || value["body"]["status"] === 242 || value["body"]["status"] === 243 || value["body"]["status"] === 246 || value["body"]["status"] === 248 || value["body"]["status"] === 250 || value["body"]["status"] === 251 || value["body"]["status"] === 252 || value["body"]["status"] === 254 || value["body"]["status"] === 255)) && ("data1" in value["body"] ? typeof value["body"]["data1"] === "number" && Number.isInteger(value["body"]["data1"]) && value["body"]["data1"] >= 0 && value["body"]["data1"] <= 255 : true) && ("data2" in value["body"] ? typeof value["body"]["data2"] === "number" && Number.isInteger(value["body"]["data2"]) && value["body"]["data2"] >= 0 && value["body"]["data2"] <= 255 : true) && hasOnlyKeys(value["body"], ["status", "data1", "data2"]) || isPlainObject(value["body"]) && ("statusNibble" in value["body"] && (value["body"]["statusNibble"] === 8 || value["body"]["statusNibble"] === 9 || value["body"]["statusNibble"] === 10 || value["body"]["statusNibble"] === 11 || value["body"]["statusNibble"] === 12 || value["body"]["statusNibble"] === 13 || value["body"]["statusNibble"] === 14)) && ("channel" in value["body"] && (typeof value["body"]["channel"] === "number" && Number.isInteger(value["body"]["channel"]) && value["body"]["channel"] >= 0 && value["body"]["channel"] <= 15)) && ("noteNumber" in value["body"] ? typeof value["body"]["noteNumber"] === "number" && Number.isInteger(value["body"]["noteNumber"]) && value["body"]["noteNumber"] >= 0 && value["body"]["noteNumber"] <= 127 : true) && ("velocity7" in value["body"] ? typeof value["body"]["velocity7"] === "number" && Number.isInteger(value["body"]["velocity7"]) && value["body"]["velocity7"] >= 0 && value["body"]["velocity7"] <= 127 : true) && ("pressure7" in value["body"] ? typeof value["body"]["pressure7"] === "number" && Number.isInteger(value["body"]["pressure7"]) && value["body"]["pressure7"] >= 0 && value["body"]["pressure7"] <= 127 : true) && ("control" in value["body"] ? typeof value["body"]["control"] === "number" && Number.isInteger(value["body"]["control"]) && value["body"]["control"] >= 0 && value["body"]["control"] <= 127 : true) && ("value7" in value["body"] ? typeof value["body"]["value7"] === "number" && Number.isInteger(value["body"]["value7"]) && value["body"]["value7"] >= 0 && value["body"]["value7"] <= 127 : true) && ("program" in value["body"] ? typeof value["body"]["program"] === "number" && Number.isInteger(value["body"]["program"]) && value["body"]["program"] >= 0 && value["body"]["program"] <= 127 : true) && ("pitchBend14" in value["body"] ? typeof value["body"]["pitchBend14"] === "number" && Number.isInteger(value["body"]["pitchBend14"]) && value["body"]["pitchBend14"] >= 0 && value["body"]["pitchBend14"] <= 16383 : true) && hasOnlyKeys(value["body"], ["statusNibble", "channel", "noteNumber", "velocity7", "pressure7", "control", "value7", "program", "pitchBend14"]) || isPlainObject(value["body"]) && ("manufacturerId" in value["body"] && (Array.isArray(value["body"]["manufacturerId"]) && value["body"]["manufacturerId"].length >= 1 && value["body"]["manufacturerId"].length <= 1 && value["body"]["manufacturerId"].every((item) => typeof item === "number" && Number.isInteger(item) && item >= 0 && item <= 255) || Array.isArray(value["body"]["manufacturerId"]) && value["body"]["manufacturerId"].length >= 3 && value["body"]["manufacturerId"].length <= 3 && value["body"]["manufacturerId"].every((item) => typeof item === "number" && Number.isInteger(item) && item >= 0 && item <= 255))) && ("packets" in value["body"] && (Array.isArray(value["body"]["packets"]) && value["body"]["packets"].length >= 1 && true && value["body"]["packets"].every((item) => isPlainObject(item) && ("streamStatus" in item && (item["streamStatus"] === "single" || item["streamStatus"] === "start" || item["streamStatus"] === "continue" || item["streamStatus"] === "end")) && ("payload" in item && (Array.isArray(item["payload"]) && item["payload"].length >= 0 && item["payload"].length <= 6 && item["payload"].every((item2) => typeof item2 === "number" && Number.isInteger(item2) && item2 >= 0 && item2 <= 255))) && hasOnlyKeys(item, ["streamStatus", "payload"])))) && hasOnlyKeys(value["body"], ["manufacturerId", "packets"]) || isPlainObject(value["body"]) && ("opcode" in value["body"] && (value["body"]["opcode"] === 0 || value["body"]["opcode"] === 1 || value["body"]["opcode"] === 2 || value["body"]["opcode"] === 3 || value["body"]["opcode"] === 4 || value["body"]["opcode"] === 5 || value["body"]["opcode"] === 6 || value["body"]["opcode"] === 16 || value["body"]["opcode"] === 17 || value["body"]["opcode"] === 18 || value["body"]["opcode"] === 32 || value["body"]["opcode"] === 33)) && ("endpointDiscovery" in value["body"] ? isPlainObject(value["body"]["endpointDiscovery"]) && ("majorVersion" in value["body"]["endpointDiscovery"] ? typeof value["body"]["endpointDiscovery"]["majorVersion"] === "number" && Number.isInteger(value["body"]["endpointDiscovery"]["majorVersion"]) && value["body"]["endpointDiscovery"]["majorVersion"] >= 0 && value["body"]["endpointDiscovery"]["majorVersion"] <= 255 : true) && ("minorVersion" in value["body"]["endpointDiscovery"] ? typeof value["body"]["endpointDiscovery"]["minorVersion"] === "number" && Number.isInteger(value["body"]["endpointDiscovery"]["minorVersion"]) && value["body"]["endpointDiscovery"]["minorVersion"] >= 0 && value["body"]["endpointDiscovery"]["minorVersion"] <= 255 : true) && ("maxGroups" in value["body"]["endpointDiscovery"] ? typeof value["body"]["endpointDiscovery"]["maxGroups"] === "number" && Number.isInteger(value["body"]["endpointDiscovery"]["maxGroups"]) && value["body"]["endpointDiscovery"]["maxGroups"] >= 0 && value["body"]["endpointDiscovery"]["maxGroups"] <= 15 : true) && ("filter" in value["body"]["endpointDiscovery"] ? isPlainObject(value["body"]["endpointDiscovery"]["filter"]) && ("endpointInfo" in value["body"]["endpointDiscovery"]["filter"] ? typeof value["body"]["endpointDiscovery"]["filter"]["endpointInfo"] === "boolean" : true) && ("deviceIdentity" in value["body"]["endpointDiscovery"]["filter"] ? typeof value["body"]["endpointDiscovery"]["filter"]["deviceIdentity"] === "boolean" : true) && ("endpointName" in value["body"]["endpointDiscovery"]["filter"] ? typeof value["body"]["endpointDiscovery"]["filter"]["endpointName"] === "boolean" : true) && ("productInstanceId" in value["body"]["endpointDiscovery"]["filter"] ? typeof value["body"]["endpointDiscovery"]["filter"]["productInstanceId"] === "boolean" : true) && ("streamConfig" in value["body"]["endpointDiscovery"]["filter"] ? typeof value["body"]["endpointDiscovery"]["filter"]["streamConfig"] === "boolean" : true) && hasOnlyKeys(value["body"]["endpointDiscovery"]["filter"], ["endpointInfo", "deviceIdentity", "endpointName", "productInstanceId", "streamConfig"]) : true) && hasOnlyKeys(value["body"]["endpointDiscovery"], ["majorVersion", "minorVersion", "maxGroups", "filter"]) : true) && ("endpointInfoNotification" in value["body"] ? isPlainObject(value["body"]["endpointInfoNotification"]) && ("staticFunctionBlocks" in value["body"]["endpointInfoNotification"] ? typeof value["body"]["endpointInfoNotification"]["staticFunctionBlocks"] === "boolean" : true) && ("numberOfFunctionBlocks" in value["body"]["endpointInfoNotification"] ? typeof value["body"]["endpointInfoNotification"]["numberOfFunctionBlocks"] === "number" && Number.isInteger(value["body"]["endpointInfoNotification"]["numberOfFunctionBlocks"]) && value["body"]["endpointInfoNotification"]["numberOfFunctionBlocks"] >= 0 && value["body"]["endpointInfoNotification"]["numberOfFunctionBlocks"] <= 32 : true) && ("umpVersionMajor" in value["body"]["endpointInfoNotification"] ? typeof value["body"]["endpointInfoNotification"]["umpVersionMajor"] === "number" && Number.isInteger(value["body"]["endpointInfoNotification"]["umpVersionMajor"]) && value["body"]["endpointInfoNotification"]["umpVersionMajor"] >= 0 && value["body"]["endpointInfoNotification"]["umpVersionMajor"] <= 255 : true) && ("umpVersionMinor" in value["body"]["endpointInfoNotification"] ? typeof value["body"]["endpointInfoNotification"]["umpVersionMinor"] === "number" && Number.isInteger(value["body"]["endpointInfoNotification"]["umpVersionMinor"]) && value["body"]["endpointInfoNotification"]["umpVersionMinor"] >= 0 && value["body"]["endpointInfoNotification"]["umpVersionMinor"] <= 255 : true) && ("midi2Supported" in value["body"]["endpointInfoNotification"] ? typeof value["body"]["endpointInfoNotification"]["midi2Supported"] === "boolean" : true) && ("midi1Supported" in value["body"]["endpointInfoNotification"] ? typeof value["body"]["endpointInfoNotification"]["midi1Supported"] === "boolean" : true) && ("jrTimestampsRx" in value["body"]["endpointInfoNotification"] ? typeof value["body"]["endpointInfoNotification"]["jrTimestampsRx"] === "boolean" : true) && ("jrTimestampsTx" in value["body"]["endpointInfoNotification"] ? typeof value["body"]["endpointInfoNotification"]["jrTimestampsTx"] === "boolean" : true) && hasOnlyKeys(value["body"]["endpointInfoNotification"], ["staticFunctionBlocks", "numberOfFunctionBlocks", "umpVersionMajor", "umpVersionMinor", "midi2Supported", "midi1Supported", "jrTimestampsRx", "jrTimestampsTx"]) : true) && ("deviceIdentityNotification" in value["body"] ? isPlainObject(value["body"]["deviceIdentityNotification"]) && ("manufacturerId" in value["body"]["deviceIdentityNotification"] ? Array.isArray(value["body"]["deviceIdentityNotification"]["manufacturerId"]) && value["body"]["deviceIdentityNotification"]["manufacturerId"].length >= 1 && value["body"]["deviceIdentityNotification"]["manufacturerId"].length <= 1 && value["body"]["deviceIdentityNotification"]["manufacturerId"].every((item) => typeof item === "number" && Number.isInteger(item) && item >= 0 && item <= 255) || Array.isArray(value["body"]["deviceIdentityNotification"]["manufacturerId"]) && value["body"]["deviceIdentityNotification"]["manufacturerId"].length >= 3 && value["body"]["deviceIdentityNotification"]["manufacturerId"].length <= 3 && value["body"]["deviceIdentityNotification"]["manufacturerId"].every((item) => typeof item === "number" && Number.isInteger(item) && item >= 0 && item <= 255) : true) && ("deviceFamily" in value["body"]["deviceIdentityNotification"] ? typeof value["body"]["deviceIdentityNotification"]["deviceFamily"] === "number" && Number.isInteger(value["body"]["deviceIdentityNotification"]["deviceFamily"]) && value["body"]["deviceIdentityNotification"]["deviceFamily"] >= 0 && value["body"]["deviceIdentityNotification"]["deviceFamily"] <= 65535 : true) && ("deviceModel" in value["body"]["deviceIdentityNotification"] ? typeof value["body"]["deviceIdentityNotification"]["deviceModel"] === "number" && Number.isInteger(value["body"]["deviceIdentityNotification"]["deviceModel"]) && value["body"]["deviceIdentityNotification"]["deviceModel"] >= 0 && value["body"]["deviceIdentityNotification"]["deviceModel"] <= 65535 : true) && ("softwareRevision" in value["body"]["deviceIdentityNotification"] ? typeof value["body"]["deviceIdentityNotification"]["softwareRevision"] === "number" && Number.isInteger(value["body"]["deviceIdentityNotification"]["softwareRevision"]) && value["body"]["deviceIdentityNotification"]["softwareRevision"] >= 0 && value["body"]["deviceIdentityNotification"]["softwareRevision"] <= 4294967295 : true) && hasOnlyKeys(value["body"]["deviceIdentityNotification"], ["manufacturerId", "deviceFamily", "deviceModel", "softwareRevision"]) : true) && ("endpointNameNotification" in value["body"] ? isPlainObject(value["body"]["endpointNameNotification"]) && ("name" in value["body"]["endpointNameNotification"] && typeof value["body"]["endpointNameNotification"]["name"] === "string") && hasOnlyKeys(value["body"]["endpointNameNotification"], ["name"]) : true) && ("productInstanceIdNotification" in value["body"] ? isPlainObject(value["body"]["productInstanceIdNotification"]) && ("productInstanceId" in value["body"]["productInstanceIdNotification"] && typeof value["body"]["productInstanceIdNotification"]["productInstanceId"] === "string") && hasOnlyKeys(value["body"]["productInstanceIdNotification"], ["productInstanceId"]) : true) && ("streamConfigRequest" in value["body"] ? isPlainObject(value["body"]["streamConfigRequest"]) && ("protocol" in value["body"]["streamConfigRequest"] ? value["body"]["streamConfigRequest"]["protocol"] === "midi1" || value["body"]["streamConfigRequest"]["protocol"] === "midi2" : true) && ("jrTimestampsTx" in value["body"]["streamConfigRequest"] ? typeof value["body"]["streamConfigRequest"]["jrTimestampsTx"] === "boolean" : true) && ("jrTimestampsRx" in value["body"]["streamConfigRequest"] ? typeof value["body"]["streamConfigRequest"]["jrTimestampsRx"] === "boolean" : true) && hasOnlyKeys(value["body"]["streamConfigRequest"], ["protocol", "jrTimestampsTx", "jrTimestampsRx"]) : true) && ("streamConfigNotification" in value["body"] ? isPlainObject(value["body"]["streamConfigNotification"]) && ("protocol" in value["body"]["streamConfigNotification"] ? value["body"]["streamConfigNotification"]["protocol"] === "midi1" || value["body"]["streamConfigNotification"]["protocol"] === "midi2" : true) && ("jrTimestampsTx" in value["body"]["streamConfigNotification"] ? typeof value["body"]["streamConfigNotification"]["jrTimestampsTx"] === "boolean" : true) && ("jrTimestampsRx" in value["body"]["streamConfigNotification"] ? typeof value["body"]["streamConfigNotification"]["jrTimestampsRx"] === "boolean" : true) && hasOnlyKeys(value["body"]["streamConfigNotification"], ["protocol", "jrTimestampsTx", "jrTimestampsRx"]) : true) && ("functionBlockDiscovery" in value["body"] ? isPlainObject(value["body"]["functionBlockDiscovery"]) && ("filterBitmap" in value["body"]["functionBlockDiscovery"] ? typeof value["body"]["functionBlockDiscovery"]["filterBitmap"] === "number" && Number.isInteger(value["body"]["functionBlockDiscovery"]["filterBitmap"]) && value["body"]["functionBlockDiscovery"]["filterBitmap"] >= 0 && value["body"]["functionBlockDiscovery"]["filterBitmap"] <= 4294967295 : true) && hasOnlyKeys(value["body"]["functionBlockDiscovery"], ["filterBitmap"]) : true) && ("functionBlockInfo" in value["body"] ? isPlainObject(value["body"]["functionBlockInfo"]) && ("index" in value["body"]["functionBlockInfo"] ? typeof value["body"]["functionBlockInfo"]["index"] === "number" && Number.isInteger(value["body"]["functionBlockInfo"]["index"]) && value["body"]["functionBlockInfo"]["index"] >= 0 && value["body"]["functionBlockInfo"]["index"] <= 255 : true) && ("firstGroup" in value["body"]["functionBlockInfo"] ? typeof value["body"]["functionBlockInfo"]["firstGroup"] === "number" && Number.isInteger(value["body"]["functionBlockInfo"]["firstGroup"]) && value["body"]["functionBlockInfo"]["firstGroup"] >= 0 && value["body"]["functionBlockInfo"]["firstGroup"] <= 15 : true) && ("groupCount" in value["body"]["functionBlockInfo"] ? typeof value["body"]["functionBlockInfo"]["groupCount"] === "number" && Number.isInteger(value["body"]["functionBlockInfo"]["groupCount"]) && value["body"]["functionBlockInfo"]["groupCount"] >= 0 && value["body"]["functionBlockInfo"]["groupCount"] <= 15 : true) && ("active" in value["body"]["functionBlockInfo"] ? typeof value["body"]["functionBlockInfo"]["active"] === "boolean" : true) && ("direction" in value["body"]["functionBlockInfo"] ? value["body"]["functionBlockInfo"]["direction"] === 0 || value["body"]["functionBlockInfo"]["direction"] === 1 || value["body"]["functionBlockInfo"]["direction"] === 2 || value["body"]["functionBlockInfo"]["direction"] === 3 : true) && ("midi1Bandwidth" in value["body"]["functionBlockInfo"] ? value["body"]["functionBlockInfo"]["midi1Bandwidth"] === 0 || value["body"]["functionBlockInfo"]["midi1Bandwidth"] === 1 || value["body"]["functionBlockInfo"]["midi1Bandwidth"] === 2 : true) && hasOnlyKeys(value["body"]["functionBlockInfo"], ["index", "firstGroup", "groupCount", "active", "direction", "midi1Bandwidth"]) : true) && ("processInquiry" in value["body"] ? isPlainObject(value["body"]["processInquiry"]) && ("functionBlock" in value["body"]["processInquiry"] ? typeof value["body"]["processInquiry"]["functionBlock"] === "number" && Number.isInteger(value["body"]["processInquiry"]["functionBlock"]) && value["body"]["processInquiry"]["functionBlock"] >= 0 && value["body"]["processInquiry"]["functionBlock"] <= 127 : true) && ("part" in value["body"]["processInquiry"] ? typeof value["body"]["processInquiry"]["part"] === "number" && Number.isInteger(value["body"]["processInquiry"]["part"]) && value["body"]["processInquiry"]["part"] >= 0 && value["body"]["processInquiry"]["part"] <= 15 : true) && hasOnlyKeys(value["body"]["processInquiry"], ["functionBlock", "part"]) : true) && ("processInquiryReply" in value["body"] ? isPlainObject(value["body"]["processInquiryReply"]) && ("functionBlock" in value["body"]["processInquiryReply"] ? typeof value["body"]["processInquiryReply"]["functionBlock"] === "number" && Number.isInteger(value["body"]["processInquiryReply"]["functionBlock"]) && value["body"]["processInquiryReply"]["functionBlock"] >= 0 && value["body"]["processInquiryReply"]["functionBlock"] <= 127 : true) && ("part" in value["body"]["processInquiryReply"] ? typeof value["body"]["processInquiryReply"]["part"] === "number" && Number.isInteger(value["body"]["processInquiryReply"]["part"]) && value["body"]["processInquiryReply"]["part"] >= 0 && value["body"]["processInquiryReply"]["part"] <= 15 : true) && hasOnlyKeys(value["body"]["processInquiryReply"], ["functionBlock", "part"]) : true) && hasOnlyKeys(value["body"], ["opcode", "endpointDiscovery", "endpointInfoNotification", "deviceIdentityNotification", "endpointNameNotification", "productInstanceIdNotification", "streamConfigRequest", "streamConfigNotification", "functionBlockDiscovery", "functionBlockInfo", "processInquiry", "processInquiryReply"]))) && hasOnlyKeys(value, ["messageType", "group", "body"]) || isPlainObject(value) && ("messageType" in value && value["messageType"] === 4) && ("group" in value && isUint4(value["group"])) && ("statusNibble" in value && (value["statusNibble"] === 8 || value["statusNibble"] === 9 || value["statusNibble"] === 10 || value["statusNibble"] === 11 || value["statusNibble"] === 12 || value["statusNibble"] === 13 || value["statusNibble"] === 14 || value["statusNibble"] === 15)) && ("channel" in value && (typeof value["channel"] === "number" && Number.isInteger(value["channel"]) && value["channel"] >= 0 && value["channel"] <= 15)) && ("body" in value && (isPlainObject(value["body"]) && ("statusNibble" in value["body"] && (value["body"]["statusNibble"] === 8 || value["body"]["statusNibble"] === 9 || value["body"]["statusNibble"] === 10 || value["body"]["statusNibble"] === 11 || value["body"]["statusNibble"] === 12 || value["body"]["statusNibble"] === 13 || value["body"]["statusNibble"] === 14 || value["body"]["statusNibble"] === 15)) && ("channel" in value["body"] && (typeof value["body"]["channel"] === "number" && Number.isInteger(value["body"]["channel"]) && value["body"]["channel"] >= 0 && value["body"]["channel"] <= 15)) && hasOnlyKeys(value["body"], ["statusNibble", "channel", "body"])) && (isPlainObject(value["body"]) && ("statusNibble" in value["body"] ? value["body"]["statusNibble"] === 8 : true) && ("body" in value["body"] ? isPlainObject(value["body"]["body"]) && ("noteNumber" in value["body"]["body"] && (typeof value["body"]["body"]["noteNumber"] === "number" && Number.isInteger(value["body"]["body"]["noteNumber"]) && value["body"]["body"]["noteNumber"] >= 0 && value["body"]["body"]["noteNumber"] <= 127)) && ("velocity16" in value["body"]["body"] && (typeof value["body"]["body"]["velocity16"] === "number" && Number.isInteger(value["body"]["body"]["velocity16"]) && value["body"]["body"]["velocity16"] >= 0 && value["body"]["body"]["velocity16"] <= 65535)) && ("attributeType" in value["body"]["body"] ? typeof value["body"]["body"]["attributeType"] === "number" && Number.isInteger(value["body"]["body"]["attributeType"]) && value["body"]["body"]["attributeType"] >= 0 && value["body"]["body"]["attributeType"] <= 255 : true) && ("attributeData16" in value["body"]["body"] ? typeof value["body"]["body"]["attributeData16"] === "number" && Number.isInteger(value["body"]["body"]["attributeData16"]) && value["body"]["body"]["attributeData16"] >= 0 && value["body"]["body"]["attributeData16"] <= 65535 : true) && hasOnlyKeys(value["body"]["body"], ["noteNumber", "velocity16", "attributeType", "attributeData16"]) : true) || isPlainObject(value["body"]) && ("statusNibble" in value["body"] ? value["body"]["statusNibble"] === 9 : true) && ("body" in value["body"] ? isPlainObject(value["body"]["body"]) && ("noteNumber" in value["body"]["body"] && (typeof value["body"]["body"]["noteNumber"] === "number" && Number.isInteger(value["body"]["body"]["noteNumber"]) && value["body"]["body"]["noteNumber"] >= 0 && value["body"]["body"]["noteNumber"] <= 127)) && ("velocity16" in value["body"]["body"] && (typeof value["body"]["body"]["velocity16"] === "number" && Number.isInteger(value["body"]["body"]["velocity16"]) && value["body"]["body"]["velocity16"] >= 0 && value["body"]["body"]["velocity16"] <= 65535)) && ("attributeType" in value["body"]["body"] ? typeof value["body"]["body"]["attributeType"] === "number" && Number.isInteger(value["body"]["body"]["attributeType"]) && value["body"]["body"]["attributeType"] >= 0 && value["body"]["body"]["attributeType"] <= 255 : true) && ("attributeData16" in value["body"]["body"] ? typeof value["body"]["body"]["attributeData16"] === "number" && Number.isInteger(value["body"]["body"]["attributeData16"]) && value["body"]["body"]["attributeData16"] >= 0 && value["body"]["body"]["attributeData16"] <= 65535 : true) && hasOnlyKeys(value["body"]["body"], ["noteNumber", "velocity16", "attributeType", "attributeData16"]) : true) || isPlainObject(value["body"]) && ("statusNibble" in value["body"] ? value["body"]["statusNibble"] === 10 : true) && ("body" in value["body"] ? isPlainObject(value["body"]["body"]) && ("noteNumber" in value["body"]["body"] && (typeof value["body"]["body"]["noteNumber"] === "number" && Number.isInteger(value["body"]["body"]["noteNumber"]) && value["body"]["body"]["noteNumber"] >= 0 && value["body"]["body"]["noteNumber"] <= 127)) && ("polyPressure32" in value["body"]["body"] && (typeof value["body"]["body"]["polyPressure32"] === "number" && Number.isInteger(value["body"]["body"]["polyPressure32"]) && value["body"]["body"]["polyPressure32"] >= 0 && value["body"]["body"]["polyPressure32"] <= 4294967295)) && hasOnlyKeys(value["body"]["body"], ["noteNumber", "polyPressure32"]) : true) || isPlainObject(value["body"]) && ("statusNibble" in value["body"] ? value["body"]["statusNibble"] === 11 : true) && ("body" in value["body"] ? isPlainObject(value["body"]["body"]) && ("control" in value["body"]["body"] && (typeof value["body"]["body"]["control"] === "number" && Number.isInteger(value["body"]["body"]["control"]) && value["body"]["body"]["control"] >= 0 && value["body"]["body"]["control"] <= 127)) && ("controlValue32" in value["body"]["body"] && (typeof value["body"]["body"]["controlValue32"] === "number" && Number.isInteger(value["body"]["body"]["controlValue32"]) && value["body"]["body"]["controlValue32"] >= 0 && value["body"]["body"]["controlValue32"] <= 4294967295)) && hasOnlyKeys(value["body"]["body"], ["control", "controlValue32"]) : true) || isPlainObject(value["body"]) && ("statusNibble" in value["body"] ? value["body"]["statusNibble"] === 12 : true) && ("body" in value["body"] ? isPlainObject(value["body"]["body"]) && ("program" in value["body"]["body"] && (typeof value["body"]["body"]["program"] === "number" && Number.isInteger(value["body"]["body"]["program"]) && value["body"]["body"]["program"] >= 0 && value["body"]["body"]["program"] <= 127)) && ("bankMsb" in value["body"]["body"] ? typeof value["body"]["body"]["bankMsb"] === "number" && Number.isInteger(value["body"]["body"]["bankMsb"]) && value["body"]["body"]["bankMsb"] >= 0 && value["body"]["body"]["bankMsb"] <= 127 : true) && ("bankLsb" in value["body"]["body"] ? typeof value["body"]["body"]["bankLsb"] === "number" && Number.isInteger(value["body"]["body"]["bankLsb"]) && value["body"]["body"]["bankLsb"] >= 0 && value["body"]["body"]["bankLsb"] <= 127 : true) && ("bankValid" in value["body"]["body"] ? typeof value["body"]["body"]["bankValid"] === "boolean" : true) && hasOnlyKeys(value["body"]["body"], ["program", "bankMsb", "bankLsb", "bankValid"]) : true) || isPlainObject(value["body"]) && ("statusNibble" in value["body"] ? value["body"]["statusNibble"] === 13 : true) && ("body" in value["body"] ? isPlainObject(value["body"]["body"]) && ("channelPressure32" in value["body"]["body"] && (typeof value["body"]["body"]["channelPressure32"] === "number" && Number.isInteger(value["body"]["body"]["channelPressure32"]) && value["body"]["body"]["channelPressure32"] >= 0 && value["body"]["body"]["channelPressure32"] <= 4294967295)) && hasOnlyKeys(value["body"]["body"], ["channelPressure32"]) : true) || isPlainObject(value["body"]) && ("statusNibble" in value["body"] ? value["body"]["statusNibble"] === 14 : true) && ("body" in value["body"] ? isPlainObject(value["body"]["body"]) && ("pitchBend32" in value["body"]["body"] && (typeof value["body"]["body"]["pitchBend32"] === "number" && Number.isInteger(value["body"]["body"]["pitchBend32"]) && value["body"]["body"]["pitchBend32"] >= 0 && value["body"]["body"]["pitchBend32"] <= 4294967295)) && hasOnlyKeys(value["body"]["body"], ["pitchBend32"]) : true) || isPlainObject(value["body"]) && ("statusNibble" in value["body"] ? value["body"]["statusNibble"] === 15 : true) && ("body" in value["body"] ? isPlainObject(value["body"]["body"]) && ("rpnIndexMsb" in value["body"]["body"] && (typeof value["body"]["body"]["rpnIndexMsb"] === "number" && Number.isInteger(value["body"]["body"]["rpnIndexMsb"]) && value["body"]["body"]["rpnIndexMsb"] >= 0 && value["body"]["body"]["rpnIndexMsb"] <= 127)) && ("rpnIndexLsb" in value["body"]["body"] && (typeof value["body"]["body"]["rpnIndexLsb"] === "number" && Number.isInteger(value["body"]["body"]["rpnIndexLsb"]) && value["body"]["body"]["rpnIndexLsb"] >= 0 && value["body"]["body"]["rpnIndexLsb"] <= 127)) && ("rpnData32" in value["body"]["body"] && (typeof value["body"]["body"]["rpnData32"] === "number" && Number.isInteger(value["body"]["body"]["rpnData32"]) && value["body"]["body"]["rpnData32"] >= 0 && value["body"]["body"]["rpnData32"] <= 4294967295)) && hasOnlyKeys(value["body"]["body"], ["rpnIndexMsb", "rpnIndexLsb", "rpnData32"]) || isPlainObject(value["body"]["body"]) && ("nrpnIndexMsb" in value["body"]["body"] && (typeof value["body"]["body"]["nrpnIndexMsb"] === "number" && Number.isInteger(value["body"]["body"]["nrpnIndexMsb"]) && value["body"]["body"]["nrpnIndexMsb"] >= 0 && value["body"]["body"]["nrpnIndexMsb"] <= 127)) && ("nrpnIndexLsb" in value["body"]["body"] && (typeof value["body"]["body"]["nrpnIndexLsb"] === "number" && Number.isInteger(value["body"]["body"]["nrpnIndexLsb"]) && value["body"]["body"]["nrpnIndexLsb"] >= 0 && value["body"]["body"]["nrpnIndexLsb"] <= 127)) && ("nrpnData32" in value["body"]["body"] && (typeof value["body"]["body"]["nrpnData32"] === "number" && Number.isInteger(value["body"]["body"]["nrpnData32"]) && value["body"]["body"]["nrpnData32"] >= 0 && value["body"]["body"]["nrpnData32"] <= 4294967295)) && hasOnlyKeys(value["body"]["body"], ["nrpnIndexMsb", "nrpnIndexLsb", "nrpnData32"]) || isPlainObject(value["body"]["body"]) && ("rpnIndexMsb" in value["body"]["body"] && (typeof value["body"]["body"]["rpnIndexMsb"] === "number" && Number.isInteger(value["body"]["body"]["rpnIndexMsb"]) && value["body"]["body"]["rpnIndexMsb"] >= 0 && value["body"]["body"]["rpnIndexMsb"] <= 127)) && ("rpnIndexLsb" in value["body"]["body"] && (typeof value["body"]["body"]["rpnIndexLsb"] === "number" && Number.isInteger(value["body"]["body"]["rpnIndexLsb"]) && value["body"]["body"]["rpnIndexLsb"] >= 0 && value["body"]["body"]["rpnIndexLsb"] <= 127)) && ("rpnDelta32" in value["body"]["body"] && (typeof value["body"]["body"]["rpnDelta32"] === "number" && Number.isInteger(value["body"]["body"]["rpnDelta32"]) && value["body"]["body"]["rpnDelta32"] >= -2147483648 && value["body"]["body"]["rpnDelta32"] <= 2147483647)) && hasOnlyKeys(value["body"]["body"], ["rpnIndexMsb", "rpnIndexLsb", "rpnDelta32"]) || isPlainObject(value["body"]["body"]) && ("nrpnIndexMsb" in value["body"]["body"] && (typeof value["body"]["body"]["nrpnIndexMsb"] === "number" && Number.isInteger(value["body"]["body"]["nrpnIndexMsb"]) && value["body"]["body"]["nrpnIndexMsb"] >= 0 && value["body"]["body"]["nrpnIndexMsb"] <= 127)) && ("nrpnIndexLsb" in value["body"]["body"] && (typeof value["body"]["body"]["nrpnIndexLsb"] === "number" && Number.isInteger(value["body"]["body"]["nrpnIndexLsb"]) && value["body"]["body"]["nrpnIndexLsb"] >= 0 && value["body"]["body"]["nrpnIndexLsb"] <= 127)) && ("nrpnDelta32" in value["body"]["body"] && (typeof value["body"]["body"]["nrpnDelta32"] === "number" && Number.isInteger(value["body"]["body"]["nrpnDelta32"]) && value["body"]["body"]["nrpnDelta32"] >= -2147483648 && value["body"]["body"]["nrpnDelta32"] <= 2147483647)) && hasOnlyKeys(value["body"]["body"], ["nrpnIndexMsb", "nrpnIndexLsb", "nrpnDelta32"]) || isPlainObject(value["body"]["body"]) && ("noteNumber" in value["body"]["body"] && (typeof value["body"]["body"]["noteNumber"] === "number" && Number.isInteger(value["body"]["body"]["noteNumber"]) && value["body"]["body"]["noteNumber"] >= 0 && value["body"]["body"]["noteNumber"] <= 127)) && ("detach" in value["body"]["body"] && typeof value["body"]["body"]["detach"] === "boolean") && ("reset" in value["body"]["body"] && typeof value["body"]["body"]["reset"] === "boolean") && hasOnlyKeys(value["body"]["body"], ["noteNumber", "detach", "reset"]) || isPlainObject(value["body"]["body"]) && ("noteNumber" in value["body"]["body"] && (typeof value["body"]["body"]["noteNumber"] === "number" && Number.isInteger(value["body"]["body"]["noteNumber"]) && value["body"]["body"]["noteNumber"] >= 0 && value["body"]["body"]["noteNumber"] <= 127)) && ("regPerNoteCtrlIndex" in value["body"]["body"] && (typeof value["body"]["body"]["regPerNoteCtrlIndex"] === "number" && Number.isInteger(value["body"]["body"]["regPerNoteCtrlIndex"]) && value["body"]["body"]["regPerNoteCtrlIndex"] >= 0 && value["body"]["body"]["regPerNoteCtrlIndex"] <= 255)) && ("regPerNoteCtrlValue32" in value["body"]["body"] && (typeof value["body"]["body"]["regPerNoteCtrlValue32"] === "number" && Number.isInteger(value["body"]["body"]["regPerNoteCtrlValue32"]) && value["body"]["body"]["regPerNoteCtrlValue32"] >= 0 && value["body"]["body"]["regPerNoteCtrlValue32"] <= 4294967295)) && hasOnlyKeys(value["body"]["body"], ["noteNumber", "regPerNoteCtrlIndex", "regPerNoteCtrlValue32"]) || isPlainObject(value["body"]["body"]) && ("noteNumber" in value["body"]["body"] && (typeof value["body"]["body"]["noteNumber"] === "number" && Number.isInteger(value["body"]["body"]["noteNumber"]) && value["body"]["body"]["noteNumber"] >= 0 && value["body"]["body"]["noteNumber"] <= 127)) && ("assignPerNoteCtrlIndex" in value["body"]["body"] && (typeof value["body"]["body"]["assignPerNoteCtrlIndex"] === "number" && Number.isInteger(value["body"]["body"]["assignPerNoteCtrlIndex"]) && value["body"]["body"]["assignPerNoteCtrlIndex"] >= 0 && value["body"]["body"]["assignPerNoteCtrlIndex"] <= 255)) && ("assignPerNoteCtrlValue32" in value["body"]["body"] && (typeof value["body"]["body"]["assignPerNoteCtrlValue32"] === "number" && Number.isInteger(value["body"]["body"]["assignPerNoteCtrlValue32"]) && value["body"]["body"]["assignPerNoteCtrlValue32"] >= 0 && value["body"]["body"]["assignPerNoteCtrlValue32"] <= 4294967295)) && hasOnlyKeys(value["body"]["body"], ["noteNumber", "assignPerNoteCtrlIndex", "assignPerNoteCtrlValue32"]) : true))) && hasOnlyKeys(value, ["messageType", "group", "statusNibble", "channel", "body"]) || isPlainObject(value) && ("messageType" in value && (value["messageType"] === 5 || value["messageType"] === 13)) && ("group" in value ? isUint4(value["group"]) : true) && ("body" in value && (isPlainObject(value["body"]) && ("kind" in value["body"] && (value["body"]["kind"] === "sysex8" || value["body"]["kind"] === "mds")) && ("sysex8" in value["body"] ? isPlainObject(value["body"]["sysex8"]) && ("manufacturerId" in value["body"]["sysex8"] && (Array.isArray(value["body"]["sysex8"]["manufacturerId"]) && value["body"]["sysex8"]["manufacturerId"].length >= 1 && value["body"]["sysex8"]["manufacturerId"].length <= 1 && value["body"]["sysex8"]["manufacturerId"].every((item) => typeof item === "number" && Number.isInteger(item) && item >= 0 && item <= 255) || Array.isArray(value["body"]["sysex8"]["manufacturerId"]) && value["body"]["sysex8"]["manufacturerId"].length >= 3 && value["body"]["sysex8"]["manufacturerId"].length <= 3 && value["body"]["sysex8"]["manufacturerId"].every((item) => typeof item === "number" && Number.isInteger(item) && item >= 0 && item <= 255))) && ("length" in value["body"]["sysex8"] && (typeof value["body"]["sysex8"]["length"] === "number" && Number.isInteger(value["body"]["sysex8"]["length"]) && value["body"]["sysex8"]["length"] >= 0 && value["body"]["sysex8"]["length"] <= 268435455)) && ("data" in value["body"]["sysex8"] && (Array.isArray(value["body"]["sysex8"]["data"]) && true && true && value["body"]["sysex8"]["data"].every((item) => typeof item === "number" && Number.isInteger(item) && item >= 0 && item <= 255))) && hasOnlyKeys(value["body"]["sysex8"], ["manufacturerId", "length", "data"]) : true) && ("mds" in value["body"] ? isPlainObject(value["body"]["mds"]) && ("messageId" in value["body"]["mds"] && (typeof value["body"]["mds"]["messageId"] === "number" && Number.isInteger(value["body"]["mds"]["messageId"]) && value["body"]["mds"]["messageId"] >= 0 && value["body"]["mds"]["messageId"] <= 65535)) && ("totalChunks" in value["body"]["mds"] && (typeof value["body"]["mds"]["totalChunks"] === "number" && Number.isInteger(value["body"]["mds"]["totalChunks"]) && value["body"]["mds"]["totalChunks"] >= 0 && value["body"]["mds"]["totalChunks"] <= 65535)) && ("chunks" in value["body"]["mds"] && (Array.isArray(value["body"]["mds"]["chunks"]) && true && true && value["body"]["mds"]["chunks"].every((item) => isPlainObject(item) && ("index" in item && (typeof item["index"] === "number" && Number.isInteger(item["index"]) && item["index"] >= 0 && item["index"] <= 65535)) && ("validByteCount" in item && (typeof item["validByteCount"] === "number" && Number.isInteger(item["validByteCount"]) && item["validByteCount"] >= 0 && item["validByteCount"] <= 255)) && ("payload" in item && (Array.isArray(item["payload"]) && true && item["payload"].length <= 14 && item["payload"].every((item2) => typeof item2 === "number" && Number.isInteger(item2) && item2 >= 0 && item2 <= 255))) && hasOnlyKeys(item, ["index", "validByteCount", "payload"])))) && hasOnlyKeys(value["body"]["mds"], ["messageId", "totalChunks", "chunks"]) : true) && hasOnlyKeys(value["body"], ["kind", "sysex8", "mds"]) || (isPlainObject(value["body"]) && ("statusClass" in value["body"] && value["body"]["statusClass"] === 16) && ("status" in value["body"] && value["body"]["status"] === 1) && ("address" in value["body"] ? isPlainObject(value["body"]["address"]) && ("scope" in value["body"]["address"] ? value["body"]["address"]["scope"] === "group" || value["body"]["address"]["scope"] === "channel" : true) && ("group" in value["body"]["address"] ? typeof value["body"]["address"]["group"] === "number" && Number.isInteger(value["body"]["address"]["group"]) && value["body"]["address"]["group"] >= 0 && value["body"]["address"]["group"] <= 15 : true) && ("channel" in value["body"]["address"] ? typeof value["body"]["address"]["channel"] === "number" && Number.isInteger(value["body"]["address"]["channel"]) && value["body"]["address"]["channel"] >= 0 && value["body"]["address"]["channel"] <= 15 : true) && hasOnlyKeys(value["body"]["address"], ["scope", "group", "channel"]) : true) && ("data" in value["body"] && isPlainObject(value["body"]["data"]) && ("bpm" in value["body"]["data"] && (typeof value["body"]["data"]["bpm"] === "number" && Number.isFinite(value["body"]["data"]["bpm"]) && value["body"]["data"]["bpm"] >= 1 && true)) && hasOnlyKeys(value["body"]["data"], ["bpm"])) && hasOnlyKeys(value["body"], ["statusClass", "status", "address", "data"]) || isPlainObject(value["body"]) && ("statusClass" in value["body"] && value["body"]["statusClass"] === 16) && ("status" in value["body"] && value["body"]["status"] === 2) && ("address" in value["body"] ? isPlainObject(value["body"]["address"]) && ("scope" in value["body"]["address"] ? value["body"]["address"]["scope"] === "group" || value["body"]["address"]["scope"] === "channel" : true) && ("group" in value["body"]["address"] ? typeof value["body"]["address"]["group"] === "number" && Number.isInteger(value["body"]["address"]["group"]) && value["body"]["address"]["group"] >= 0 && value["body"]["address"]["group"] <= 15 : true) && ("channel" in value["body"]["address"] ? typeof value["body"]["address"]["channel"] === "number" && Number.isInteger(value["body"]["address"]["channel"]) && value["body"]["address"]["channel"] >= 0 && value["body"]["address"]["channel"] <= 15 : true) && hasOnlyKeys(value["body"]["address"], ["scope", "group", "channel"]) : true) && ("data" in value["body"] && isPlainObject(value["body"]["data"]) && ("numerator" in value["body"]["data"] && (typeof value["body"]["data"]["numerator"] === "number" && Number.isInteger(value["body"]["data"]["numerator"]) && value["body"]["data"]["numerator"] >= 1 && true)) && ("denominatorPow2" in value["body"]["data"] && (typeof value["body"]["data"]["denominatorPow2"] === "number" && Number.isInteger(value["body"]["data"]["denominatorPow2"]) && value["body"]["data"]["denominatorPow2"] >= 0 && true)) && hasOnlyKeys(value["body"]["data"], ["numerator", "denominatorPow2"])) && hasOnlyKeys(value["body"], ["statusClass", "status", "address", "data"]) || isPlainObject(value["body"]) && ("statusClass" in value["body"] && value["body"]["statusClass"] === 16) && ("status" in value["body"] && value["body"]["status"] === 3) && ("address" in value["body"] ? isPlainObject(value["body"]["address"]) && ("scope" in value["body"]["address"] ? value["body"]["address"]["scope"] === "group" || value["body"]["address"]["scope"] === "channel" : true) && ("group" in value["body"]["address"] ? typeof value["body"]["address"]["group"] === "number" && Number.isInteger(value["body"]["address"]["group"]) && value["body"]["address"]["group"] >= 0 && value["body"]["address"]["group"] <= 15 : true) && ("channel" in value["body"]["address"] ? typeof value["body"]["address"]["channel"] === "number" && Number.isInteger(value["body"]["address"]["channel"]) && value["body"]["address"]["channel"] >= 0 && value["body"]["address"]["channel"] <= 15 : true) && hasOnlyKeys(value["body"]["address"], ["scope", "group", "channel"]) : true) && ("data" in value["body"] && isPlainObject(value["body"]["data"]) && ("clicksPerBeat" in value["body"]["data"] ? typeof value["body"]["data"]["clicksPerBeat"] === "number" && Number.isInteger(value["body"]["data"]["clicksPerBeat"]) && value["body"]["data"]["clicksPerBeat"] >= 1 && true : true) && ("accentPattern" in value["body"]["data"] ? typeof value["body"]["data"]["accentPattern"] === "string" : true) && hasOnlyKeys(value["body"]["data"], ["clicksPerBeat", "accentPattern"])) && hasOnlyKeys(value["body"], ["statusClass", "status", "address", "data"]) || isPlainObject(value["body"]) && ("statusClass" in value["body"] && value["body"]["statusClass"] === 16) && ("status" in value["body"] && value["body"]["status"] === 4) && ("address" in value["body"] ? isPlainObject(value["body"]["address"]) && ("scope" in value["body"]["address"] ? value["body"]["address"]["scope"] === "group" || value["body"]["address"]["scope"] === "channel" : true) && ("group" in value["body"]["address"] ? typeof value["body"]["address"]["group"] === "number" && Number.isInteger(value["body"]["address"]["group"]) && value["body"]["address"]["group"] >= 0 && value["body"]["address"]["group"] <= 15 : true) && ("channel" in value["body"]["address"] ? typeof value["body"]["address"]["channel"] === "number" && Number.isInteger(value["body"]["address"]["channel"]) && value["body"]["address"]["channel"] >= 0 && value["body"]["address"]["channel"] <= 15 : true) && hasOnlyKeys(value["body"]["address"], ["scope", "group", "channel"]) : true) && ("data" in value["body"] && isPlainObject(value["body"]["data"]) && ("key" in value["body"]["data"] && typeof value["body"]["data"]["key"] === "string") && hasOnlyKeys(value["body"]["data"], ["key"])) && hasOnlyKeys(value["body"], ["statusClass", "status", "address", "data"]) || isPlainObject(value["body"]) && ("statusClass" in value["body"] && value["body"]["statusClass"] === 16) && ("status" in value["body"] && value["body"]["status"] === 5) && ("address" in value["body"] ? isPlainObject(value["body"]["address"]) && ("scope" in value["body"]["address"] ? value["body"]["address"]["scope"] === "group" || value["body"]["address"]["scope"] === "channel" : true) && ("group" in value["body"]["address"] ? typeof value["body"]["address"]["group"] === "number" && Number.isInteger(value["body"]["address"]["group"]) && value["body"]["address"]["group"] >= 0 && value["body"]["address"]["group"] <= 15 : true) && ("channel" in value["body"]["address"] ? typeof value["body"]["address"]["channel"] === "number" && Number.isInteger(value["body"]["address"]["channel"]) && value["body"]["address"]["channel"] >= 0 && value["body"]["address"]["channel"] <= 15 : true) && hasOnlyKeys(value["body"]["address"], ["scope", "group", "channel"]) : true) && ("data" in value["body"] && isPlainObject(value["body"]["data"]) && ("chord" in value["body"]["data"] && typeof value["body"]["data"]["chord"] === "string") && hasOnlyKeys(value["body"]["data"], ["chord"])) && hasOnlyKeys(value["body"], ["statusClass", "status", "address", "data"]) || isPlainObject(value["body"]) && ("statusClass" in value["body"] && value["body"]["statusClass"] === 17) && ("status" in value["body"] && value["body"]["status"] === 1) && ("address" in value["body"] ? isPlainObject(value["body"]["address"]) && ("scope" in value["body"]["address"] ? value["body"]["address"]["scope"] === "group" || value["body"]["address"]["scope"] === "channel" : true) && ("group" in value["body"]["address"] ? typeof value["body"]["address"]["group"] === "number" && Number.isInteger(value["body"]["address"]["group"]) && value["body"]["address"]["group"] >= 0 && value["body"]["address"]["group"] <= 15 : true) && ("channel" in value["body"]["address"] ? typeof value["body"]["address"]["channel"] === "number" && Number.isInteger(value["body"]["address"]["channel"]) && value["body"]["address"]["channel"] >= 0 && value["body"]["address"]["channel"] <= 15 : true) && hasOnlyKeys(value["body"]["address"], ["scope", "group", "channel"]) : true) && ("data" in value["body"] && isPlainObject(value["body"]["data"]) && ("text" in value["body"]["data"] && typeof value["body"]["data"]["text"] === "string") && hasOnlyKeys(value["body"]["data"], ["text"])) && hasOnlyKeys(value["body"], ["statusClass", "status", "address", "data"]) || isPlainObject(value["body"]) && ("statusClass" in value["body"] && value["body"]["statusClass"] === 17) && ("status" in value["body"] && value["body"]["status"] === 2) && ("address" in value["body"] ? isPlainObject(value["body"]["address"]) && ("scope" in value["body"]["address"] ? value["body"]["address"]["scope"] === "group" || value["body"]["address"]["scope"] === "channel" : true) && ("group" in value["body"]["address"] ? typeof value["body"]["address"]["group"] === "number" && Number.isInteger(value["body"]["address"]["group"]) && value["body"]["address"]["group"] >= 0 && value["body"]["address"]["group"] <= 15 : true) && ("channel" in value["body"]["address"] ? typeof value["body"]["address"]["channel"] === "number" && Number.isInteger(value["body"]["address"]["channel"]) && value["body"]["address"]["channel"] >= 0 && value["body"]["address"]["channel"] <= 15 : true) && hasOnlyKeys(value["body"]["address"], ["scope", "group", "channel"]) : true) && ("data" in value["body"] && isPlainObject(value["body"]["data"]) && ("lyric" in value["body"]["data"] && typeof value["body"]["data"]["lyric"] === "string") && hasOnlyKeys(value["body"]["data"], ["lyric"])) && hasOnlyKeys(value["body"], ["statusClass", "status", "address", "data"]) || isPlainObject(value["body"]) && ("statusClass" in value["body"] && value["body"]["statusClass"] === 17) && ("status" in value["body"] && value["body"]["status"] === 3) && ("address" in value["body"] ? isPlainObject(value["body"]["address"]) && ("scope" in value["body"]["address"] ? value["body"]["address"]["scope"] === "group" || value["body"]["address"]["scope"] === "channel" : true) && ("group" in value["body"]["address"] ? typeof value["body"]["address"]["group"] === "number" && Number.isInteger(value["body"]["address"]["group"]) && value["body"]["address"]["group"] >= 0 && value["body"]["address"]["group"] <= 15 : true) && ("channel" in value["body"]["address"] ? typeof value["body"]["address"]["channel"] === "number" && Number.isInteger(value["body"]["address"]["channel"]) && value["body"]["address"]["channel"] >= 0 && value["body"]["address"]["channel"] <= 15 : true) && hasOnlyKeys(value["body"]["address"], ["scope", "group", "channel"]) : true) && ("data" in value["body"] && isPlainObject(value["body"]["data"]) && ("ruby" in value["body"]["data"] && typeof value["body"]["data"]["ruby"] === "string") && hasOnlyKeys(value["body"]["data"], ["ruby"])) && hasOnlyKeys(value["body"], ["statusClass", "status", "address", "data"])))) && hasOnlyKeys(value, ["messageType", "group", "body"]);
}
function isUmpPacket128(value) {
  return isPlainObject(value) && ("messageType" in value && (value["messageType"] === 5 || value["messageType"] === 13)) && ("group" in value ? isUint4(value["group"]) : true) && ("body" in value && (isPlainObject(value["body"]) && ("kind" in value["body"] && (value["body"]["kind"] === "sysex8" || value["body"]["kind"] === "mds")) && ("sysex8" in value["body"] ? isPlainObject(value["body"]["sysex8"]) && ("manufacturerId" in value["body"]["sysex8"] && (Array.isArray(value["body"]["sysex8"]["manufacturerId"]) && value["body"]["sysex8"]["manufacturerId"].length >= 1 && value["body"]["sysex8"]["manufacturerId"].length <= 1 && value["body"]["sysex8"]["manufacturerId"].every((item) => typeof item === "number" && Number.isInteger(item) && item >= 0 && item <= 255) || Array.isArray(value["body"]["sysex8"]["manufacturerId"]) && value["body"]["sysex8"]["manufacturerId"].length >= 3 && value["body"]["sysex8"]["manufacturerId"].length <= 3 && value["body"]["sysex8"]["manufacturerId"].every((item) => typeof item === "number" && Number.isInteger(item) && item >= 0 && item <= 255))) && ("length" in value["body"]["sysex8"] && (typeof value["body"]["sysex8"]["length"] === "number" && Number.isInteger(value["body"]["sysex8"]["length"]) && value["body"]["sysex8"]["length"] >= 0 && value["body"]["sysex8"]["length"] <= 268435455)) && ("data" in value["body"]["sysex8"] && (Array.isArray(value["body"]["sysex8"]["data"]) && true && true && value["body"]["sysex8"]["data"].every((item) => typeof item === "number" && Number.isInteger(item) && item >= 0 && item <= 255))) && hasOnlyKeys(value["body"]["sysex8"], ["manufacturerId", "length", "data"]) : true) && ("mds" in value["body"] ? isPlainObject(value["body"]["mds"]) && ("messageId" in value["body"]["mds"] && (typeof value["body"]["mds"]["messageId"] === "number" && Number.isInteger(value["body"]["mds"]["messageId"]) && value["body"]["mds"]["messageId"] >= 0 && value["body"]["mds"]["messageId"] <= 65535)) && ("totalChunks" in value["body"]["mds"] && (typeof value["body"]["mds"]["totalChunks"] === "number" && Number.isInteger(value["body"]["mds"]["totalChunks"]) && value["body"]["mds"]["totalChunks"] >= 0 && value["body"]["mds"]["totalChunks"] <= 65535)) && ("chunks" in value["body"]["mds"] && (Array.isArray(value["body"]["mds"]["chunks"]) && true && true && value["body"]["mds"]["chunks"].every((item) => isPlainObject(item) && ("index" in item && (typeof item["index"] === "number" && Number.isInteger(item["index"]) && item["index"] >= 0 && item["index"] <= 65535)) && ("validByteCount" in item && (typeof item["validByteCount"] === "number" && Number.isInteger(item["validByteCount"]) && item["validByteCount"] >= 0 && item["validByteCount"] <= 255)) && ("payload" in item && (Array.isArray(item["payload"]) && true && item["payload"].length <= 14 && item["payload"].every((item2) => typeof item2 === "number" && Number.isInteger(item2) && item2 >= 0 && item2 <= 255))) && hasOnlyKeys(item, ["index", "validByteCount", "payload"])))) && hasOnlyKeys(value["body"]["mds"], ["messageId", "totalChunks", "chunks"]) : true) && hasOnlyKeys(value["body"], ["kind", "sysex8", "mds"]) || (isPlainObject(value["body"]) && ("statusClass" in value["body"] && value["body"]["statusClass"] === 16) && ("status" in value["body"] && value["body"]["status"] === 1) && ("address" in value["body"] ? isPlainObject(value["body"]["address"]) && ("scope" in value["body"]["address"] ? value["body"]["address"]["scope"] === "group" || value["body"]["address"]["scope"] === "channel" : true) && ("group" in value["body"]["address"] ? typeof value["body"]["address"]["group"] === "number" && Number.isInteger(value["body"]["address"]["group"]) && value["body"]["address"]["group"] >= 0 && value["body"]["address"]["group"] <= 15 : true) && ("channel" in value["body"]["address"] ? typeof value["body"]["address"]["channel"] === "number" && Number.isInteger(value["body"]["address"]["channel"]) && value["body"]["address"]["channel"] >= 0 && value["body"]["address"]["channel"] <= 15 : true) && hasOnlyKeys(value["body"]["address"], ["scope", "group", "channel"]) : true) && ("data" in value["body"] && isPlainObject(value["body"]["data"]) && ("bpm" in value["body"]["data"] && (typeof value["body"]["data"]["bpm"] === "number" && Number.isFinite(value["body"]["data"]["bpm"]) && value["body"]["data"]["bpm"] >= 1 && true)) && hasOnlyKeys(value["body"]["data"], ["bpm"])) && hasOnlyKeys(value["body"], ["statusClass", "status", "address", "data"]) || isPlainObject(value["body"]) && ("statusClass" in value["body"] && value["body"]["statusClass"] === 16) && ("status" in value["body"] && value["body"]["status"] === 2) && ("address" in value["body"] ? isPlainObject(value["body"]["address"]) && ("scope" in value["body"]["address"] ? value["body"]["address"]["scope"] === "group" || value["body"]["address"]["scope"] === "channel" : true) && ("group" in value["body"]["address"] ? typeof value["body"]["address"]["group"] === "number" && Number.isInteger(value["body"]["address"]["group"]) && value["body"]["address"]["group"] >= 0 && value["body"]["address"]["group"] <= 15 : true) && ("channel" in value["body"]["address"] ? typeof value["body"]["address"]["channel"] === "number" && Number.isInteger(value["body"]["address"]["channel"]) && value["body"]["address"]["channel"] >= 0 && value["body"]["address"]["channel"] <= 15 : true) && hasOnlyKeys(value["body"]["address"], ["scope", "group", "channel"]) : true) && ("data" in value["body"] && isPlainObject(value["body"]["data"]) && ("numerator" in value["body"]["data"] && (typeof value["body"]["data"]["numerator"] === "number" && Number.isInteger(value["body"]["data"]["numerator"]) && value["body"]["data"]["numerator"] >= 1 && true)) && ("denominatorPow2" in value["body"]["data"] && (typeof value["body"]["data"]["denominatorPow2"] === "number" && Number.isInteger(value["body"]["data"]["denominatorPow2"]) && value["body"]["data"]["denominatorPow2"] >= 0 && true)) && hasOnlyKeys(value["body"]["data"], ["numerator", "denominatorPow2"])) && hasOnlyKeys(value["body"], ["statusClass", "status", "address", "data"]) || isPlainObject(value["body"]) && ("statusClass" in value["body"] && value["body"]["statusClass"] === 16) && ("status" in value["body"] && value["body"]["status"] === 3) && ("address" in value["body"] ? isPlainObject(value["body"]["address"]) && ("scope" in value["body"]["address"] ? value["body"]["address"]["scope"] === "group" || value["body"]["address"]["scope"] === "channel" : true) && ("group" in value["body"]["address"] ? typeof value["body"]["address"]["group"] === "number" && Number.isInteger(value["body"]["address"]["group"]) && value["body"]["address"]["group"] >= 0 && value["body"]["address"]["group"] <= 15 : true) && ("channel" in value["body"]["address"] ? typeof value["body"]["address"]["channel"] === "number" && Number.isInteger(value["body"]["address"]["channel"]) && value["body"]["address"]["channel"] >= 0 && value["body"]["address"]["channel"] <= 15 : true) && hasOnlyKeys(value["body"]["address"], ["scope", "group", "channel"]) : true) && ("data" in value["body"] && isPlainObject(value["body"]["data"]) && ("clicksPerBeat" in value["body"]["data"] ? typeof value["body"]["data"]["clicksPerBeat"] === "number" && Number.isInteger(value["body"]["data"]["clicksPerBeat"]) && value["body"]["data"]["clicksPerBeat"] >= 1 && true : true) && ("accentPattern" in value["body"]["data"] ? typeof value["body"]["data"]["accentPattern"] === "string" : true) && hasOnlyKeys(value["body"]["data"], ["clicksPerBeat", "accentPattern"])) && hasOnlyKeys(value["body"], ["statusClass", "status", "address", "data"]) || isPlainObject(value["body"]) && ("statusClass" in value["body"] && value["body"]["statusClass"] === 16) && ("status" in value["body"] && value["body"]["status"] === 4) && ("address" in value["body"] ? isPlainObject(value["body"]["address"]) && ("scope" in value["body"]["address"] ? value["body"]["address"]["scope"] === "group" || value["body"]["address"]["scope"] === "channel" : true) && ("group" in value["body"]["address"] ? typeof value["body"]["address"]["group"] === "number" && Number.isInteger(value["body"]["address"]["group"]) && value["body"]["address"]["group"] >= 0 && value["body"]["address"]["group"] <= 15 : true) && ("channel" in value["body"]["address"] ? typeof value["body"]["address"]["channel"] === "number" && Number.isInteger(value["body"]["address"]["channel"]) && value["body"]["address"]["channel"] >= 0 && value["body"]["address"]["channel"] <= 15 : true) && hasOnlyKeys(value["body"]["address"], ["scope", "group", "channel"]) : true) && ("data" in value["body"] && isPlainObject(value["body"]["data"]) && ("key" in value["body"]["data"] && typeof value["body"]["data"]["key"] === "string") && hasOnlyKeys(value["body"]["data"], ["key"])) && hasOnlyKeys(value["body"], ["statusClass", "status", "address", "data"]) || isPlainObject(value["body"]) && ("statusClass" in value["body"] && value["body"]["statusClass"] === 16) && ("status" in value["body"] && value["body"]["status"] === 5) && ("address" in value["body"] ? isPlainObject(value["body"]["address"]) && ("scope" in value["body"]["address"] ? value["body"]["address"]["scope"] === "group" || value["body"]["address"]["scope"] === "channel" : true) && ("group" in value["body"]["address"] ? typeof value["body"]["address"]["group"] === "number" && Number.isInteger(value["body"]["address"]["group"]) && value["body"]["address"]["group"] >= 0 && value["body"]["address"]["group"] <= 15 : true) && ("channel" in value["body"]["address"] ? typeof value["body"]["address"]["channel"] === "number" && Number.isInteger(value["body"]["address"]["channel"]) && value["body"]["address"]["channel"] >= 0 && value["body"]["address"]["channel"] <= 15 : true) && hasOnlyKeys(value["body"]["address"], ["scope", "group", "channel"]) : true) && ("data" in value["body"] && isPlainObject(value["body"]["data"]) && ("chord" in value["body"]["data"] && typeof value["body"]["data"]["chord"] === "string") && hasOnlyKeys(value["body"]["data"], ["chord"])) && hasOnlyKeys(value["body"], ["statusClass", "status", "address", "data"]) || isPlainObject(value["body"]) && ("statusClass" in value["body"] && value["body"]["statusClass"] === 17) && ("status" in value["body"] && value["body"]["status"] === 1) && ("address" in value["body"] ? isPlainObject(value["body"]["address"]) && ("scope" in value["body"]["address"] ? value["body"]["address"]["scope"] === "group" || value["body"]["address"]["scope"] === "channel" : true) && ("group" in value["body"]["address"] ? typeof value["body"]["address"]["group"] === "number" && Number.isInteger(value["body"]["address"]["group"]) && value["body"]["address"]["group"] >= 0 && value["body"]["address"]["group"] <= 15 : true) && ("channel" in value["body"]["address"] ? typeof value["body"]["address"]["channel"] === "number" && Number.isInteger(value["body"]["address"]["channel"]) && value["body"]["address"]["channel"] >= 0 && value["body"]["address"]["channel"] <= 15 : true) && hasOnlyKeys(value["body"]["address"], ["scope", "group", "channel"]) : true) && ("data" in value["body"] && isPlainObject(value["body"]["data"]) && ("text" in value["body"]["data"] && typeof value["body"]["data"]["text"] === "string") && hasOnlyKeys(value["body"]["data"], ["text"])) && hasOnlyKeys(value["body"], ["statusClass", "status", "address", "data"]) || isPlainObject(value["body"]) && ("statusClass" in value["body"] && value["body"]["statusClass"] === 17) && ("status" in value["body"] && value["body"]["status"] === 2) && ("address" in value["body"] ? isPlainObject(value["body"]["address"]) && ("scope" in value["body"]["address"] ? value["body"]["address"]["scope"] === "group" || value["body"]["address"]["scope"] === "channel" : true) && ("group" in value["body"]["address"] ? typeof value["body"]["address"]["group"] === "number" && Number.isInteger(value["body"]["address"]["group"]) && value["body"]["address"]["group"] >= 0 && value["body"]["address"]["group"] <= 15 : true) && ("channel" in value["body"]["address"] ? typeof value["body"]["address"]["channel"] === "number" && Number.isInteger(value["body"]["address"]["channel"]) && value["body"]["address"]["channel"] >= 0 && value["body"]["address"]["channel"] <= 15 : true) && hasOnlyKeys(value["body"]["address"], ["scope", "group", "channel"]) : true) && ("data" in value["body"] && isPlainObject(value["body"]["data"]) && ("lyric" in value["body"]["data"] && typeof value["body"]["data"]["lyric"] === "string") && hasOnlyKeys(value["body"]["data"], ["lyric"])) && hasOnlyKeys(value["body"], ["statusClass", "status", "address", "data"]) || isPlainObject(value["body"]) && ("statusClass" in value["body"] && value["body"]["statusClass"] === 17) && ("status" in value["body"] && value["body"]["status"] === 3) && ("address" in value["body"] ? isPlainObject(value["body"]["address"]) && ("scope" in value["body"]["address"] ? value["body"]["address"]["scope"] === "group" || value["body"]["address"]["scope"] === "channel" : true) && ("group" in value["body"]["address"] ? typeof value["body"]["address"]["group"] === "number" && Number.isInteger(value["body"]["address"]["group"]) && value["body"]["address"]["group"] >= 0 && value["body"]["address"]["group"] <= 15 : true) && ("channel" in value["body"]["address"] ? typeof value["body"]["address"]["channel"] === "number" && Number.isInteger(value["body"]["address"]["channel"]) && value["body"]["address"]["channel"] >= 0 && value["body"]["address"]["channel"] <= 15 : true) && hasOnlyKeys(value["body"]["address"], ["scope", "group", "channel"]) : true) && ("data" in value["body"] && isPlainObject(value["body"]["data"]) && ("ruby" in value["body"]["data"] && typeof value["body"]["data"]["ruby"] === "string") && hasOnlyKeys(value["body"]["data"], ["ruby"])) && hasOnlyKeys(value["body"], ["statusClass", "status", "address", "data"])))) && hasOnlyKeys(value, ["messageType", "group", "body"]);
}
function isUmpPacket64(value) {
  return isPlainObject(value) && ("messageType" in value && value["messageType"] === 4) && ("group" in value && isUint4(value["group"])) && ("statusNibble" in value && (value["statusNibble"] === 8 || value["statusNibble"] === 9 || value["statusNibble"] === 10 || value["statusNibble"] === 11 || value["statusNibble"] === 12 || value["statusNibble"] === 13 || value["statusNibble"] === 14 || value["statusNibble"] === 15)) && ("channel" in value && (typeof value["channel"] === "number" && Number.isInteger(value["channel"]) && value["channel"] >= 0 && value["channel"] <= 15)) && ("body" in value && (isPlainObject(value["body"]) && ("statusNibble" in value["body"] && (value["body"]["statusNibble"] === 8 || value["body"]["statusNibble"] === 9 || value["body"]["statusNibble"] === 10 || value["body"]["statusNibble"] === 11 || value["body"]["statusNibble"] === 12 || value["body"]["statusNibble"] === 13 || value["body"]["statusNibble"] === 14 || value["body"]["statusNibble"] === 15)) && ("channel" in value["body"] && (typeof value["body"]["channel"] === "number" && Number.isInteger(value["body"]["channel"]) && value["body"]["channel"] >= 0 && value["body"]["channel"] <= 15)) && hasOnlyKeys(value["body"], ["statusNibble", "channel", "body"])) && (isPlainObject(value["body"]) && ("statusNibble" in value["body"] ? value["body"]["statusNibble"] === 8 : true) && ("body" in value["body"] ? isPlainObject(value["body"]["body"]) && ("noteNumber" in value["body"]["body"] && (typeof value["body"]["body"]["noteNumber"] === "number" && Number.isInteger(value["body"]["body"]["noteNumber"]) && value["body"]["body"]["noteNumber"] >= 0 && value["body"]["body"]["noteNumber"] <= 127)) && ("velocity16" in value["body"]["body"] && (typeof value["body"]["body"]["velocity16"] === "number" && Number.isInteger(value["body"]["body"]["velocity16"]) && value["body"]["body"]["velocity16"] >= 0 && value["body"]["body"]["velocity16"] <= 65535)) && ("attributeType" in value["body"]["body"] ? typeof value["body"]["body"]["attributeType"] === "number" && Number.isInteger(value["body"]["body"]["attributeType"]) && value["body"]["body"]["attributeType"] >= 0 && value["body"]["body"]["attributeType"] <= 255 : true) && ("attributeData16" in value["body"]["body"] ? typeof value["body"]["body"]["attributeData16"] === "number" && Number.isInteger(value["body"]["body"]["attributeData16"]) && value["body"]["body"]["attributeData16"] >= 0 && value["body"]["body"]["attributeData16"] <= 65535 : true) && hasOnlyKeys(value["body"]["body"], ["noteNumber", "velocity16", "attributeType", "attributeData16"]) : true) || isPlainObject(value["body"]) && ("statusNibble" in value["body"] ? value["body"]["statusNibble"] === 9 : true) && ("body" in value["body"] ? isPlainObject(value["body"]["body"]) && ("noteNumber" in value["body"]["body"] && (typeof value["body"]["body"]["noteNumber"] === "number" && Number.isInteger(value["body"]["body"]["noteNumber"]) && value["body"]["body"]["noteNumber"] >= 0 && value["body"]["body"]["noteNumber"] <= 127)) && ("velocity16" in value["body"]["body"] && (typeof value["body"]["body"]["velocity16"] === "number" && Number.isInteger(value["body"]["body"]["velocity16"]) && value["body"]["body"]["velocity16"] >= 0 && value["body"]["body"]["velocity16"] <= 65535)) && ("attributeType" in value["body"]["body"] ? typeof value["body"]["body"]["attributeType"] === "number" && Number.isInteger(value["body"]["body"]["attributeType"]) && value["body"]["body"]["attributeType"] >= 0 && value["body"]["body"]["attributeType"] <= 255 : true) && ("attributeData16" in value["body"]["body"] ? typeof value["body"]["body"]["attributeData16"] === "number" && Number.isInteger(value["body"]["body"]["attributeData16"]) && value["body"]["body"]["attributeData16"] >= 0 && value["body"]["body"]["attributeData16"] <= 65535 : true) && hasOnlyKeys(value["body"]["body"], ["noteNumber", "velocity16", "attributeType", "attributeData16"]) : true) || isPlainObject(value["body"]) && ("statusNibble" in value["body"] ? value["body"]["statusNibble"] === 10 : true) && ("body" in value["body"] ? isPlainObject(value["body"]["body"]) && ("noteNumber" in value["body"]["body"] && (typeof value["body"]["body"]["noteNumber"] === "number" && Number.isInteger(value["body"]["body"]["noteNumber"]) && value["body"]["body"]["noteNumber"] >= 0 && value["body"]["body"]["noteNumber"] <= 127)) && ("polyPressure32" in value["body"]["body"] && (typeof value["body"]["body"]["polyPressure32"] === "number" && Number.isInteger(value["body"]["body"]["polyPressure32"]) && value["body"]["body"]["polyPressure32"] >= 0 && value["body"]["body"]["polyPressure32"] <= 4294967295)) && hasOnlyKeys(value["body"]["body"], ["noteNumber", "polyPressure32"]) : true) || isPlainObject(value["body"]) && ("statusNibble" in value["body"] ? value["body"]["statusNibble"] === 11 : true) && ("body" in value["body"] ? isPlainObject(value["body"]["body"]) && ("control" in value["body"]["body"] && (typeof value["body"]["body"]["control"] === "number" && Number.isInteger(value["body"]["body"]["control"]) && value["body"]["body"]["control"] >= 0 && value["body"]["body"]["control"] <= 127)) && ("controlValue32" in value["body"]["body"] && (typeof value["body"]["body"]["controlValue32"] === "number" && Number.isInteger(value["body"]["body"]["controlValue32"]) && value["body"]["body"]["controlValue32"] >= 0 && value["body"]["body"]["controlValue32"] <= 4294967295)) && hasOnlyKeys(value["body"]["body"], ["control", "controlValue32"]) : true) || isPlainObject(value["body"]) && ("statusNibble" in value["body"] ? value["body"]["statusNibble"] === 12 : true) && ("body" in value["body"] ? isPlainObject(value["body"]["body"]) && ("program" in value["body"]["body"] && (typeof value["body"]["body"]["program"] === "number" && Number.isInteger(value["body"]["body"]["program"]) && value["body"]["body"]["program"] >= 0 && value["body"]["body"]["program"] <= 127)) && ("bankMsb" in value["body"]["body"] ? typeof value["body"]["body"]["bankMsb"] === "number" && Number.isInteger(value["body"]["body"]["bankMsb"]) && value["body"]["body"]["bankMsb"] >= 0 && value["body"]["body"]["bankMsb"] <= 127 : true) && ("bankLsb" in value["body"]["body"] ? typeof value["body"]["body"]["bankLsb"] === "number" && Number.isInteger(value["body"]["body"]["bankLsb"]) && value["body"]["body"]["bankLsb"] >= 0 && value["body"]["body"]["bankLsb"] <= 127 : true) && ("bankValid" in value["body"]["body"] ? typeof value["body"]["body"]["bankValid"] === "boolean" : true) && hasOnlyKeys(value["body"]["body"], ["program", "bankMsb", "bankLsb", "bankValid"]) : true) || isPlainObject(value["body"]) && ("statusNibble" in value["body"] ? value["body"]["statusNibble"] === 13 : true) && ("body" in value["body"] ? isPlainObject(value["body"]["body"]) && ("channelPressure32" in value["body"]["body"] && (typeof value["body"]["body"]["channelPressure32"] === "number" && Number.isInteger(value["body"]["body"]["channelPressure32"]) && value["body"]["body"]["channelPressure32"] >= 0 && value["body"]["body"]["channelPressure32"] <= 4294967295)) && hasOnlyKeys(value["body"]["body"], ["channelPressure32"]) : true) || isPlainObject(value["body"]) && ("statusNibble" in value["body"] ? value["body"]["statusNibble"] === 14 : true) && ("body" in value["body"] ? isPlainObject(value["body"]["body"]) && ("pitchBend32" in value["body"]["body"] && (typeof value["body"]["body"]["pitchBend32"] === "number" && Number.isInteger(value["body"]["body"]["pitchBend32"]) && value["body"]["body"]["pitchBend32"] >= 0 && value["body"]["body"]["pitchBend32"] <= 4294967295)) && hasOnlyKeys(value["body"]["body"], ["pitchBend32"]) : true) || isPlainObject(value["body"]) && ("statusNibble" in value["body"] ? value["body"]["statusNibble"] === 15 : true) && ("body" in value["body"] ? isPlainObject(value["body"]["body"]) && ("rpnIndexMsb" in value["body"]["body"] && (typeof value["body"]["body"]["rpnIndexMsb"] === "number" && Number.isInteger(value["body"]["body"]["rpnIndexMsb"]) && value["body"]["body"]["rpnIndexMsb"] >= 0 && value["body"]["body"]["rpnIndexMsb"] <= 127)) && ("rpnIndexLsb" in value["body"]["body"] && (typeof value["body"]["body"]["rpnIndexLsb"] === "number" && Number.isInteger(value["body"]["body"]["rpnIndexLsb"]) && value["body"]["body"]["rpnIndexLsb"] >= 0 && value["body"]["body"]["rpnIndexLsb"] <= 127)) && ("rpnData32" in value["body"]["body"] && (typeof value["body"]["body"]["rpnData32"] === "number" && Number.isInteger(value["body"]["body"]["rpnData32"]) && value["body"]["body"]["rpnData32"] >= 0 && value["body"]["body"]["rpnData32"] <= 4294967295)) && hasOnlyKeys(value["body"]["body"], ["rpnIndexMsb", "rpnIndexLsb", "rpnData32"]) || isPlainObject(value["body"]["body"]) && ("nrpnIndexMsb" in value["body"]["body"] && (typeof value["body"]["body"]["nrpnIndexMsb"] === "number" && Number.isInteger(value["body"]["body"]["nrpnIndexMsb"]) && value["body"]["body"]["nrpnIndexMsb"] >= 0 && value["body"]["body"]["nrpnIndexMsb"] <= 127)) && ("nrpnIndexLsb" in value["body"]["body"] && (typeof value["body"]["body"]["nrpnIndexLsb"] === "number" && Number.isInteger(value["body"]["body"]["nrpnIndexLsb"]) && value["body"]["body"]["nrpnIndexLsb"] >= 0 && value["body"]["body"]["nrpnIndexLsb"] <= 127)) && ("nrpnData32" in value["body"]["body"] && (typeof value["body"]["body"]["nrpnData32"] === "number" && Number.isInteger(value["body"]["body"]["nrpnData32"]) && value["body"]["body"]["nrpnData32"] >= 0 && value["body"]["body"]["nrpnData32"] <= 4294967295)) && hasOnlyKeys(value["body"]["body"], ["nrpnIndexMsb", "nrpnIndexLsb", "nrpnData32"]) || isPlainObject(value["body"]["body"]) && ("rpnIndexMsb" in value["body"]["body"] && (typeof value["body"]["body"]["rpnIndexMsb"] === "number" && Number.isInteger(value["body"]["body"]["rpnIndexMsb"]) && value["body"]["body"]["rpnIndexMsb"] >= 0 && value["body"]["body"]["rpnIndexMsb"] <= 127)) && ("rpnIndexLsb" in value["body"]["body"] && (typeof value["body"]["body"]["rpnIndexLsb"] === "number" && Number.isInteger(value["body"]["body"]["rpnIndexLsb"]) && value["body"]["body"]["rpnIndexLsb"] >= 0 && value["body"]["body"]["rpnIndexLsb"] <= 127)) && ("rpnDelta32" in value["body"]["body"] && (typeof value["body"]["body"]["rpnDelta32"] === "number" && Number.isInteger(value["body"]["body"]["rpnDelta32"]) && value["body"]["body"]["rpnDelta32"] >= -2147483648 && value["body"]["body"]["rpnDelta32"] <= 2147483647)) && hasOnlyKeys(value["body"]["body"], ["rpnIndexMsb", "rpnIndexLsb", "rpnDelta32"]) || isPlainObject(value["body"]["body"]) && ("nrpnIndexMsb" in value["body"]["body"] && (typeof value["body"]["body"]["nrpnIndexMsb"] === "number" && Number.isInteger(value["body"]["body"]["nrpnIndexMsb"]) && value["body"]["body"]["nrpnIndexMsb"] >= 0 && value["body"]["body"]["nrpnIndexMsb"] <= 127)) && ("nrpnIndexLsb" in value["body"]["body"] && (typeof value["body"]["body"]["nrpnIndexLsb"] === "number" && Number.isInteger(value["body"]["body"]["nrpnIndexLsb"]) && value["body"]["body"]["nrpnIndexLsb"] >= 0 && value["body"]["body"]["nrpnIndexLsb"] <= 127)) && ("nrpnDelta32" in value["body"]["body"] && (typeof value["body"]["body"]["nrpnDelta32"] === "number" && Number.isInteger(value["body"]["body"]["nrpnDelta32"]) && value["body"]["body"]["nrpnDelta32"] >= -2147483648 && value["body"]["body"]["nrpnDelta32"] <= 2147483647)) && hasOnlyKeys(value["body"]["body"], ["nrpnIndexMsb", "nrpnIndexLsb", "nrpnDelta32"]) || isPlainObject(value["body"]["body"]) && ("noteNumber" in value["body"]["body"] && (typeof value["body"]["body"]["noteNumber"] === "number" && Number.isInteger(value["body"]["body"]["noteNumber"]) && value["body"]["body"]["noteNumber"] >= 0 && value["body"]["body"]["noteNumber"] <= 127)) && ("detach" in value["body"]["body"] && typeof value["body"]["body"]["detach"] === "boolean") && ("reset" in value["body"]["body"] && typeof value["body"]["body"]["reset"] === "boolean") && hasOnlyKeys(value["body"]["body"], ["noteNumber", "detach", "reset"]) || isPlainObject(value["body"]["body"]) && ("noteNumber" in value["body"]["body"] && (typeof value["body"]["body"]["noteNumber"] === "number" && Number.isInteger(value["body"]["body"]["noteNumber"]) && value["body"]["body"]["noteNumber"] >= 0 && value["body"]["body"]["noteNumber"] <= 127)) && ("regPerNoteCtrlIndex" in value["body"]["body"] && (typeof value["body"]["body"]["regPerNoteCtrlIndex"] === "number" && Number.isInteger(value["body"]["body"]["regPerNoteCtrlIndex"]) && value["body"]["body"]["regPerNoteCtrlIndex"] >= 0 && value["body"]["body"]["regPerNoteCtrlIndex"] <= 255)) && ("regPerNoteCtrlValue32" in value["body"]["body"] && (typeof value["body"]["body"]["regPerNoteCtrlValue32"] === "number" && Number.isInteger(value["body"]["body"]["regPerNoteCtrlValue32"]) && value["body"]["body"]["regPerNoteCtrlValue32"] >= 0 && value["body"]["body"]["regPerNoteCtrlValue32"] <= 4294967295)) && hasOnlyKeys(value["body"]["body"], ["noteNumber", "regPerNoteCtrlIndex", "regPerNoteCtrlValue32"]) || isPlainObject(value["body"]["body"]) && ("noteNumber" in value["body"]["body"] && (typeof value["body"]["body"]["noteNumber"] === "number" && Number.isInteger(value["body"]["body"]["noteNumber"]) && value["body"]["body"]["noteNumber"] >= 0 && value["body"]["body"]["noteNumber"] <= 127)) && ("assignPerNoteCtrlIndex" in value["body"]["body"] && (typeof value["body"]["body"]["assignPerNoteCtrlIndex"] === "number" && Number.isInteger(value["body"]["body"]["assignPerNoteCtrlIndex"]) && value["body"]["body"]["assignPerNoteCtrlIndex"] >= 0 && value["body"]["body"]["assignPerNoteCtrlIndex"] <= 255)) && ("assignPerNoteCtrlValue32" in value["body"]["body"] && (typeof value["body"]["body"]["assignPerNoteCtrlValue32"] === "number" && Number.isInteger(value["body"]["body"]["assignPerNoteCtrlValue32"]) && value["body"]["body"]["assignPerNoteCtrlValue32"] >= 0 && value["body"]["body"]["assignPerNoteCtrlValue32"] <= 4294967295)) && hasOnlyKeys(value["body"]["body"], ["noteNumber", "assignPerNoteCtrlIndex", "assignPerNoteCtrlValue32"]) : true))) && hasOnlyKeys(value, ["messageType", "group", "statusNibble", "channel", "body"]);
}

// src/schema-bridge.ts
var STREAM_MT2 = 15;
function toAddress(group, channel) {
  if (channel === void 0) return { scope: "group", group };
  return { scope: "channel", channel };
}
function asUmpPacket64(event) {
  switch (event.kind) {
    case "sysex7":
    case "sysex8":
    case "midiCi":
      return null;
    // handled in 32/128-bit paths
    case "noteOn": {
      const body = event;
      return {
        messageType: 4,
        group: body.group,
        statusNibble: 9,
        channel: body.channel,
        body: {
          statusNibble: 9,
          channel: body.channel,
          body: {
            noteNumber: body.note,
            velocity16: body.velocity,
            attributeType: body.attributeType ?? 0,
            attributeData16: body.attributeData ?? 0
          }
        }
      };
    }
    case "noteOff": {
      const body = event;
      return {
        messageType: 4,
        group: body.group,
        statusNibble: 8,
        channel: body.channel,
        body: {
          statusNibble: 8,
          channel: body.channel,
          body: {
            noteNumber: body.note,
            velocity16: body.velocity ?? 0,
            attributeType: body.attributeType ?? 0,
            attributeData16: body.attributeData ?? 0
          }
        }
      };
    }
    case "polyPressure": {
      const body = event;
      return {
        messageType: 4,
        group: body.group,
        statusNibble: 10,
        channel: body.channel,
        body: {
          statusNibble: 10,
          channel: body.channel,
          body: {
            noteNumber: body.note,
            polyPressure32: body.pressure
          }
        }
      };
    }
    case "controlChange": {
      const body = event;
      return {
        messageType: 4,
        group: body.group,
        statusNibble: 11,
        channel: body.channel,
        body: {
          statusNibble: 11,
          channel: body.channel,
          body: {
            control: body.controller,
            controlValue32: body.value
          }
        }
      };
    }
    case "programChange": {
      const body = event;
      const bankValid = body.bankLsb !== void 0 || body.bankMsb !== void 0;
      return {
        messageType: 4,
        group: body.group,
        statusNibble: 12,
        channel: body.channel,
        body: {
          statusNibble: 12,
          channel: body.channel,
          body: {
            program: body.program,
            bankMsb: body.bankMsb,
            bankLsb: body.bankLsb,
            bankValid
          }
        }
      };
    }
    case "channelPressure": {
      const body = event;
      return {
        messageType: 4,
        group: body.group,
        statusNibble: 13,
        channel: body.channel,
        body: {
          statusNibble: 13,
          channel: body.channel,
          body: {
            channelPressure32: body.pressure
          }
        }
      };
    }
    case "pitchBend": {
      const body = event;
      return {
        messageType: 4,
        group: body.group,
        statusNibble: 14,
        channel: body.channel,
        body: {
          statusNibble: 14,
          channel: body.channel,
          body: {
            pitchBend32: body.value
          }
        }
      };
    }
    case "rpn": {
      const body = event;
      return {
        messageType: 4,
        group: body.group,
        statusNibble: 15,
        channel: body.channel,
        body: {
          statusNibble: 15,
          channel: body.channel,
          body: {
            rpnIndexMsb: body.bank,
            rpnIndexLsb: body.index,
            rpnData32: body.value
          }
        }
      };
    }
    case "nrpn": {
      const body = event;
      return {
        messageType: 4,
        group: body.group,
        statusNibble: 15,
        channel: body.channel,
        body: {
          statusNibble: 15,
          channel: body.channel,
          body: {
            nrpnIndexMsb: body.bank,
            nrpnIndexLsb: body.index,
            nrpnData32: body.value
          }
        }
      };
    }
    case "rpnRelative": {
      const body = event;
      return {
        messageType: 4,
        group: body.group,
        statusNibble: 15,
        channel: body.channel,
        body: {
          statusNibble: 15,
          channel: body.channel,
          body: {
            rpnIndexMsb: body.bank,
            rpnIndexLsb: body.index,
            rpnDelta32: body.delta
          }
        }
      };
    }
    case "nrpnRelative": {
      const body = event;
      return {
        messageType: 4,
        group: body.group,
        statusNibble: 15,
        channel: body.channel,
        body: {
          statusNibble: 15,
          channel: body.channel,
          body: {
            nrpnIndexMsb: body.bank,
            nrpnIndexLsb: body.index,
            nrpnDelta32: body.delta
          }
        }
      };
    }
    case "perNoteManagement": {
      const body = event;
      return {
        messageType: 4,
        group: body.group,
        statusNibble: 15,
        channel: body.channel,
        body: {
          statusNibble: 15,
          channel: body.channel,
          body: {
            noteNumber: body.note,
            detach: body.detach,
            reset: body.reset
          }
        }
      };
    }
    case "perNoteRegisteredController": {
      const body = event;
      return {
        messageType: 4,
        group: body.group,
        statusNibble: 15,
        channel: body.channel,
        body: {
          statusNibble: 15,
          channel: body.channel,
          body: {
            noteNumber: body.note,
            regPerNoteCtrlIndex: body.controller,
            regPerNoteCtrlValue32: body.value
          }
        }
      };
    }
    case "perNoteAssignableController": {
      const body = event;
      return {
        messageType: 4,
        group: body.group,
        statusNibble: 15,
        channel: body.channel,
        body: {
          statusNibble: 15,
          channel: body.channel,
          body: {
            noteNumber: body.note,
            assignPerNoteCtrlIndex: body.controller,
            assignPerNoteCtrlValue32: body.value
          }
        }
      };
    }
    default:
      return null;
  }
}
function asUmpPacket128(event) {
  switch (event.kind) {
    case "sysex8": {
      const syx = event;
      const body = {
        kind: "sysex8",
        sysex8: {
          manufacturerId: syx.manufacturerId,
          length: syx.payload.length,
          data: Array.from(syx.payload)
        }
      };
      return { messageType: 5, group: syx.group, body };
    }
    case "midiCi": {
      if (event.format !== "sysex8") return null;
      const scope = event.scope === "realtime" ? 127 : 126;
      const header = [scope, 13, event.subId2, event.version];
      const syx = {
        kind: "sysex8",
        group: event.group,
        manufacturerId: [scope],
        payload: Uint8Array.from([...header, ...event.payload])
      };
      return asUmpPacket128(syx);
    }
    case "flexTempo": {
      const flex = event;
      const body = {
        statusClass: 16,
        status: 1,
        address: toAddress(flex.group, flex.channel),
        data: { bpm: flex.bpm }
      };
      return { messageType: 13, group: flex.group, body };
    }
    case "flexTimeSignature": {
      const flex = event;
      const body = {
        statusClass: 16,
        status: 2,
        address: toAddress(flex.group, flex.channel),
        data: { numerator: flex.numerator, denominatorPow2: flex.denominatorPow2 }
      };
      return { messageType: 13, group: flex.group, body };
    }
    case "flexKeySignature": {
      const flex = event;
      const body = {
        statusClass: 16,
        status: 4,
        address: toAddress(flex.group, flex.channel),
        data: { key: flex.key }
      };
      return { messageType: 13, group: flex.group, body };
    }
    case "flexLyric": {
      const flex = event;
      const body = {
        statusClass: 17,
        status: 2,
        address: toAddress(flex.group, flex.channel),
        data: { lyric: flex.text }
      };
      return { messageType: 13, group: flex.group, body };
    }
    case "flexText": {
      const flex = event;
      const body = {
        statusClass: 17,
        status: 1,
        address: toAddress(flex.group, flex.channel),
        data: { text: flex.text }
      };
      return { messageType: 13, group: flex.group, body };
    }
    case "flexChordName": {
      const flex = event;
      const body = {
        statusClass: 16,
        status: 5,
        address: toAddress(flex.group, flex.channel),
        data: { chord: flex.chord }
      };
      return { messageType: 13, group: flex.group, body };
    }
    case "flexRuby": {
      const flex = event;
      const body = {
        statusClass: 17,
        status: 3,
        address: toAddress(flex.group, flex.channel),
        data: { ruby: flex.ruby }
      };
      return { messageType: 13, group: flex.group, body };
    }
    case "flexMetronome": {
      const flex = event;
      const body = {
        statusClass: 16,
        status: 3,
        address: toAddress(flex.group, flex.channel),
        data: { clicksPerBeat: flex.clicksPerBeat, accentPattern: flex.accentPattern }
      };
      return { messageType: 13, group: flex.group, body };
    }
    case "mds": {
      const mds = event;
      const body = {
        kind: "mds",
        mds: {
          messageId: mds.messageId,
          totalChunks: mds.totalChunks,
          chunks: mds.chunks.map((chunk) => ({
            index: chunk.index,
            validByteCount: chunk.validByteCount,
            payload: Array.from(chunk.payload ?? [])
          }))
        }
      };
      return { messageType: 5, group: mds.group, body };
    }
    default:
      return null;
  }
}
function asUmpPacket32(event) {
  switch (event.kind) {
    case "sysex7": {
      const syx = event;
      const packets = sysex7ToPackets(Array.from(syx.payload));
      return { messageType: 3, group: syx.group, body: { manufacturerId: syx.manufacturerId, packets } };
    }
    case "stream": {
      const stream = event;
      const body = streamBodyFromEvent(stream);
      return { messageType: STREAM_MT2, group: stream.group, body };
    }
    case "midiCi": {
      if (event.format === "sysex8") return null;
      const scope = event.scope === "realtime" ? 127 : 126;
      const header = [scope, 13, event.subId2 & 127, event.version & 127];
      const body = sysEx7BodyFromPayload([scope], Uint8Array.from([...header, ...event.payload]));
      return { messageType: 3, group: event.group, body };
    }
    case "profile": {
      const p = event;
      const body = profileToBody(p);
      const scope = 126;
      const header = [scope, 13, 32, 1];
      const syxBody = sysEx7BodyFromPayload([scope], Uint8Array.from([...header, ...body]));
      return { messageType: 3, group: p.group, body: syxBody };
    }
    case "processInquiry": {
      const pi = event;
      const body = processInquiryToBody(pi);
      const scope = 126;
      const header = [scope, 13, 34, 1];
      const syxBody = sysEx7BodyFromPayload([scope], Uint8Array.from([...header, ...body]));
      return { messageType: 3, group: pi.group, body: syxBody };
    }
    case "propertyExchange": {
      const pe = event;
      const body = propertyExchangeToBody(pe);
      const scope = 126;
      const header = [scope, 13, 33, 1];
      const syxBody = sysEx7BodyFromPayload([scope], Uint8Array.from([...header, ...body]));
      return { messageType: 3, group: pe.group, body: syxBody };
    }
    case "utility": {
      const utility = event;
      const opcode = utility.status === "jrClock" ? 1 : utility.status === "jrTimestamp" ? 2 : 0;
      const body = {
        opcode,
        jrClock: utility.status === "jrClock" ? { timestamp32: utility.value ?? 0 } : void 0,
        jrTimestamp: utility.status === "jrTimestamp" ? { time15: utility.value ?? 0 } : void 0
      };
      return { messageType: 0, group: 0, body };
    }
    case "system": {
      const sys = event;
      const body = {
        status: sys.status,
        data1: sys.data1,
        data2: sys.data2
      };
      return { messageType: 1, group: sys.group, body };
    }
    case "midi1ChannelVoice": {
      const m1 = event;
      const statusNibble = m1.status >> 4 & 15;
      const channel = m1.status & 15;
      const body = { statusNibble, channel };
      if (statusNibble === 8 || statusNibble === 9) {
        body.noteNumber = m1.data1 ?? 0;
        body.velocity7 = m1.data2 ?? 0;
      } else if (statusNibble === 10) {
        body.noteNumber = m1.data1 ?? 0;
        body.pressure7 = m1.data2 ?? 0;
      } else if (statusNibble === 11) {
        body.control = m1.data1 ?? 0;
        body.value7 = m1.data2 ?? 0;
      } else if (statusNibble === 12) {
        body.program = m1.data1 ?? 0;
      } else if (statusNibble === 13) {
        body.pressure7 = m1.data1 ?? 0;
      } else if (statusNibble === 14) {
        const lsb = m1.data1 ?? 0;
        const msb = m1.data2 ?? 0;
        body.pitchBend14 = msb << 7 | lsb;
      }
      return { messageType: 2, group: m1.group, body };
    }
    default:
      return null;
  }
}
function eventToSchemaPacket(event) {
  if (event.kind === "rawUMP" && event.words?.length) {
    const mt = event.words[0] >>> 28 & 15;
    if (mt === STREAM_MT2) {
      const stream = decodeStreamWord(event.words[0]);
      if (stream) {
        const body = streamBodyFromEvent(stream);
        return { messageType: STREAM_MT2, group: stream.group, body };
      }
    }
  }
  const pkt64 = asUmpPacket64(event);
  if (pkt64) return pkt64;
  const pkt128 = asUmpPacket128(event);
  if (pkt128) return pkt128;
  return asUmpPacket32(event);
}
function schemaPacketToEventInternal(packet) {
  if (isUmpPacket64(packet)) {
    const body = packet.body;
    const status = body?.statusNibble;
    const channel = body?.channel;
    const cv = body?.body ?? {};
    switch (status) {
      case 8:
        return {
          kind: "noteOff",
          group: packet.group ?? 0,
          channel: channel ?? 0,
          note: cv.noteNumber ?? 0,
          velocity: cv.velocity16 ?? 0,
          attributeType: cv.attributeType,
          attributeData: cv.attributeData16
        };
      case 9:
        return {
          kind: "noteOn",
          group: packet.group ?? 0,
          channel: channel ?? 0,
          note: cv.noteNumber ?? 0,
          velocity: cv.velocity16 ?? 0,
          attributeType: cv.attributeType,
          attributeData: cv.attributeData16
        };
      case 10:
        return {
          kind: "polyPressure",
          group: packet.group ?? 0,
          channel: channel ?? 0,
          note: cv.noteNumber ?? 0,
          pressure: cv.polyPressure32 ?? 0
        };
      case 11:
        return {
          kind: "controlChange",
          group: packet.group ?? 0,
          channel: channel ?? 0,
          controller: cv.control ?? 0,
          value: cv.controlValue32 ?? 0
        };
      case 12:
        return {
          kind: "programChange",
          group: packet.group ?? 0,
          channel: channel ?? 0,
          program: cv.program ?? 0,
          bankMsb: cv.bankMsb,
          bankLsb: cv.bankLsb
        };
      case 13:
        return {
          kind: "channelPressure",
          group: packet.group ?? 0,
          channel: channel ?? 0,
          pressure: cv.channelPressure32 ?? 0
        };
      case 14:
        return {
          kind: "pitchBend",
          group: packet.group ?? 0,
          channel: channel ?? 0,
          value: cv.pitchBend32 ?? 0
        };
      case 15: {
        if (cv.rpnIndexMsb !== void 0 && cv.rpnIndexLsb !== void 0 && cv.rpnData32 !== void 0) {
          return {
            kind: "rpn",
            group: packet.group ?? 0,
            channel: channel ?? 0,
            bank: cv.rpnIndexMsb,
            index: cv.rpnIndexLsb,
            value: cv.rpnData32
          };
        }
        if (cv.nrpnIndexMsb !== void 0 && cv.nrpnIndexLsb !== void 0 && cv.nrpnData32 !== void 0) {
          return {
            kind: "nrpn",
            group: packet.group ?? 0,
            channel: channel ?? 0,
            bank: cv.nrpnIndexMsb,
            index: cv.nrpnIndexLsb,
            value: cv.nrpnData32
          };
        }
        if (cv.rpnIndexMsb !== void 0 && cv.rpnIndexLsb !== void 0 && cv.rpnDelta32 !== void 0) {
          return {
            kind: "rpnRelative",
            group: packet.group ?? 0,
            channel: channel ?? 0,
            bank: cv.rpnIndexMsb,
            index: cv.rpnIndexLsb,
            delta: cv.rpnDelta32
          };
        }
        if (cv.nrpnIndexMsb !== void 0 && cv.nrpnIndexLsb !== void 0 && cv.nrpnDelta32 !== void 0) {
          return {
            kind: "nrpnRelative",
            group: packet.group ?? 0,
            channel: channel ?? 0,
            bank: cv.nrpnIndexMsb,
            index: cv.nrpnIndexLsb,
            delta: cv.nrpnDelta32
          };
        }
        if (cv.noteNumber !== void 0 && (cv.detach !== void 0 || cv.reset !== void 0)) {
          return {
            kind: "perNoteManagement",
            group: packet.group ?? 0,
            channel: channel ?? 0,
            note: cv.noteNumber ?? 0,
            detach: Boolean(cv.detach),
            reset: Boolean(cv.reset)
          };
        }
        if (cv.regPerNoteCtrlIndex !== void 0 && cv.regPerNoteCtrlValue32 !== void 0) {
          return {
            kind: "perNoteRegisteredController",
            group: packet.group ?? 0,
            channel: channel ?? 0,
            note: cv.noteNumber ?? 0,
            controller: cv.regPerNoteCtrlIndex,
            value: cv.regPerNoteCtrlValue32
          };
        }
        if (cv.assignPerNoteCtrlIndex !== void 0 && cv.assignPerNoteCtrlValue32 !== void 0) {
          return {
            kind: "perNoteAssignableController",
            group: packet.group ?? 0,
            channel: channel ?? 0,
            note: cv.noteNumber ?? 0,
            controller: cv.assignPerNoteCtrlIndex,
            value: cv.assignPerNoteCtrlValue32
          };
        }
        return null;
      }
      default:
        return null;
    }
  }
  if (isUmpPacket128(packet)) {
    if (packet.messageType === 5) {
      const body = packet.body;
      if (body.kind === "mds" && body.mds) {
        return {
          kind: "mds",
          group: packet.group ?? 0,
          messageId: body.mds.messageId ?? 0,
          totalChunks: body.mds.totalChunks ?? 0,
          chunks: (body.mds.chunks ?? []).map((c, idx) => ({
            messageId: body.mds.messageId ?? 0,
            totalChunks: body.mds.totalChunks ?? 0,
            index: c.index ?? idx,
            validByteCount: c.validByteCount ?? (c.payload?.length ?? 0),
            payload: Uint8Array.from(c.payload ?? [])
          }))
        };
      }
      if (body.kind === "sysex8" && body.sysex8) {
        const syx = {
          kind: "sysex8",
          group: packet.group ?? 0,
          manufacturerId: body.sysex8.manufacturerId ?? [],
          payload: Uint8Array.from(body.sysex8.data ?? [])
        };
        const maybeCi = decodeMidiCiFromSysEx(syx);
        if (maybeCi) return midiCiToEvent(maybeCi);
        return syx;
      }
      return null;
    }
    if (packet.messageType === 13) {
      const body = packet.body;
      const channel = body.address?.scope === "channel" ? body.address.channel : void 0;
      switch (`${body.statusClass}-${body.status}`) {
        case "16-1":
          return { kind: "flexTempo", group: packet.group ?? 0, channel, bpm: body.data?.bpm ?? 0 };
        case "16-2":
          return {
            kind: "flexTimeSignature",
            group: packet.group ?? 0,
            channel,
            numerator: body.data?.numerator ?? 0,
            denominatorPow2: body.data?.denominatorPow2 ?? 0
          };
        case "16-3":
          return {
            kind: "flexMetronome",
            group: packet.group ?? 0,
            channel,
            clicksPerBeat: body.data?.clicksPerBeat ?? 0,
            accentPattern: body.data?.accentPattern ?? ""
          };
        case "16-4":
          return { kind: "flexKeySignature", group: packet.group ?? 0, channel, key: body.data?.key ?? "" };
        case "16-5":
          return { kind: "flexChordName", group: packet.group ?? 0, channel, chord: body.data?.chord ?? "" };
        case "17-1":
          return { kind: "flexText", group: packet.group ?? 0, channel, text: body.data?.text ?? "" };
        case "17-2":
          return { kind: "flexLyric", group: packet.group ?? 0, channel, text: body.data?.lyric ?? "" };
        case "17-3":
          return { kind: "flexRuby", group: packet.group ?? 0, channel, ruby: body.data?.ruby ?? "" };
        default:
          return null;
      }
    }
  }
  if (typeof packet === "object" && packet && packet.messageType === STREAM_MT2) {
    const p = packet;
    const body = p.body;
    if (isStreamBody(body)) {
      const evt = streamBodyToEvent(p.group ?? 0, body);
      if (evt) return evt;
    }
    const words = packGeneric32(p);
    const stream = decodeStreamWord(words[0]);
    if (stream) return stream;
    return { kind: "rawUMP", words, timestamp: void 0 };
  }
  if (!isUmpPacket(packet)) {
    if (typeof packet === "object" && packet && "messageType" in packet) {
      const mt = packet.messageType;
      if (mt === 3 || mt === STREAM_MT2) {
        const body = packet.body;
        if (isStreamBody(body)) {
          const evt = streamBodyToEvent(packet.group ?? 0, body);
          if (evt) return evt;
        }
        if (body && typeof body === "object" && "opcode" in body) {
          const evt = streamBodyToEvent(packet.group ?? 0, {
            opcode: body.opcode ?? 0,
            endpointDiscovery: body.endpointDiscovery,
            streamConfigRequest: body.streamConfigRequest,
            streamConfigNotification: body.streamConfigNotification,
            functionBlockDiscovery: body.functionBlockDiscovery,
            functionBlockInfo: body.functionBlockInfo
          });
          if (evt) return evt;
        }
        const words = packGeneric32(packet);
        const stream = decodeStreamWord(words[0]);
        if (stream) return stream;
        return { kind: "rawUMP", words, timestamp: void 0 };
      }
    }
    return null;
  }
  if (packet.messageType === 3) {
    const p = packet;
    const body = p.body;
    if (body?.manufacturerId && body?.packets) {
      const { manufacturerId, payload } = reassembleSysEx7FromPackets(body.manufacturerId ?? [], body.packets);
      const syx = {
        kind: "sysex7",
        group: p.group ?? 0,
        manufacturerId,
        payload: Uint8Array.from(payload)
      };
      const maybeCi = decodeMidiCiFromSysEx(syx);
      if (maybeCi) return midiCiToEvent(maybeCi);
      return syx;
    }
    if (isStreamBody(body)) {
      const evt = streamBodyToEvent(p.group ?? 0, body);
      if (evt) return evt;
    }
    const words = packGeneric32(p);
    return { kind: "rawUMP", words, timestamp: void 0 };
  }
  if (packet.messageType === 1) {
    const sys = packet.body;
    return {
      kind: "system",
      group: packet.group ?? 0,
      status: sys.status,
      data1: sys.data1,
      data2: sys.data2
    };
  }
  if (packet.messageType === 2) {
    const body = packet.body;
    const status = (body.statusNibble ?? 0) << 4 | (body.channel ?? 0);
    const event = {
      kind: "midi1ChannelVoice",
      group: packet.group ?? 0,
      status
    };
    if ("noteNumber" in body) event.data1 = body.noteNumber;
    if ("velocity7" in body) event.data2 = body.velocity7;
    if ("pressure7" in body && body.statusNibble === 10) event.data2 = body.pressure7;
    if ("control" in body) event.data1 = body.control;
    if ("value7" in body) event.data2 = body.value7;
    if ("program" in body) event.data1 = body.program;
    if ("pressure7" in body && body.statusNibble === 13) event.data1 = body.pressure7;
    if ("pitchBend14" in body) {
      const val = body.pitchBend14 ?? 0;
      event.data1 = val & 127;
      event.data2 = val >> 7 & 127;
    }
    return event;
  }
  if (packet.messageType === 0) {
    const body = packet.body;
    const opcode = body.opcode ?? 0;
    const status = opcode === 1 ? "jrClock" : opcode === 2 ? "jrTimestamp" : "noop";
    const value = opcode === 1 ? body.jrClock?.timestamp32 : opcode === 2 ? body.jrTimestamp?.time15 : void 0;
    return { kind: "utility", status, value };
  }
  return null;
}
function schemaPacketToEvent(packet, opts) {
  return schemaPacketToEventWithResponses(packet, opts).event;
}
function schemaPacketToEventWithResponses(packet, opts) {
  const event = schemaPacketToEventInternal(packet);
  const outboundEvents = [];
  const outboundWords = [];
  if (event && opts?.peSubscriptionManager && event.kind === "propertyExchange") {
    const replies = opts.peSubscriptionManager.process(event);
    outboundEvents.push(...replies);
    opts.peOutboundEvents?.push(...replies);
    for (const reply of replies) {
      const words = eventToSchemaPacketWords(reply);
      if (words) {
        outboundWords.push(...words);
        opts.peOutboundWords?.push(...words);
      }
    }
  }
  return { event, outboundEvents, outboundWords };
}
function schemaPacketToWords(packet) {
  const event = schemaPacketToEvent(packet);
  if (!event) return null;
  if (event.kind === "stream") {
    return [packStream(event)];
  }
  if (event.kind === "rawUMP") {
    return [event.words instanceof Uint32Array ? event.words : Uint32Array.from(event.words)];
  }
  if (event.kind === "propertyExchange") {
    const scope = 126;
    const body = propertyExchangeToBody(event);
    const payload = Uint8Array.from([scope, 13, 33, 1, ...body]);
    return fragmentSysEx7([scope], payload, event.group);
  }
  if (event.kind === "sysex7") {
    return fragmentSysEx7(event.manufacturerId, event.payload, event.group);
  }
  if (event.kind === "sysex8") {
    return fragmentSysEx8(event.manufacturerId, event.payload, event.group);
  }
  return encodeEventPackets(event);
}
function eventToSchemaPacketWords(event) {
  if (event.kind === "propertyExchange") {
    const scope = 126;
    const body = propertyExchangeToBody(event);
    const payload = Uint8Array.from([scope, 13, 33, 1, ...body]);
    return fragmentSysEx7([scope], payload, event.group);
  }
  const packet = eventToSchemaPacket(event);
  if (!packet) return null;
  return schemaPacketToWords(packet);
}
function sysex7ToPackets(payload) {
  if (payload.length <= 6) {
    return [{ streamStatus: "single", payload }];
  }
  const packets = [];
  let remaining = payload.slice();
  packets.push({ streamStatus: "start", payload: remaining.splice(0, 6) });
  while (remaining.length > 6) {
    packets.push({ streamStatus: "continue", payload: remaining.splice(0, 6) });
  }
  packets.push({ streamStatus: "end", payload: remaining });
  return packets;
}
function reassembleSysEx7FromPackets(manufacturerId, packets) {
  const payload = [];
  for (const p of packets) {
    payload.push(...p.payload);
  }
  return { manufacturerId, payload };
}
function sysEx7BodyFromPayload(manufacturerId, payload) {
  return {
    manufacturerId,
    packets: sysex7ToPackets(Array.from(payload))
  };
}
function packGeneric32(packet) {
  const mt = packet.messageType ?? 0;
  if (mt === STREAM_MT2) {
    return packStreamFromBody(packet);
  }
  const group = packet.group ?? 0;
  const opcode = packet.body?.opcode ?? 0;
  const word0 = (mt & 15) << 28 | (group & 15) << 24 | (opcode & 255) << 16;
  return new Uint32Array([word0 >>> 0]);
}
function opcodeNumber(opcode) {
  switch (opcode) {
    case "endpointDiscovery":
      return 0;
    case "endpointInfoNotification":
      return 1;
    case "deviceIdentityNotification":
      return 2;
    case "endpointNameNotification":
      return 3;
    case "productInstanceIdNotification":
      return 4;
    case "streamConfigRequest":
      return 5;
    case "streamConfigNotification":
      return 6;
    case "functionBlockDiscovery":
      return 16;
    case "functionBlockInfoNotification":
      return 17;
    case "functionBlockNameNotification":
      return 18;
    case "startOfClip":
      return 32;
    case "endOfClip":
      return 33;
    case "processInquiry":
    case "processInquiryReply":
      return 3;
    default:
      return 0;
  }
}
function streamBodyToEvent(group, body) {
  const opcode = body.opcode;
  if (opcode === 0) {
    return {
      kind: "stream",
      group,
      opcode: "endpointDiscovery",
      endpointDiscovery: body.endpointDiscovery
    };
  }
  if (opcode === 1) {
    return { kind: "stream", group, opcode: "endpointInfoNotification", endpointInfoNotification: body.endpointInfoNotification };
  }
  if (opcode === 2) {
    return { kind: "stream", group, opcode: "deviceIdentityNotification", deviceIdentityNotification: body.deviceIdentityNotification };
  }
  if (opcode === 3) {
    return { kind: "stream", group, opcode: "endpointNameNotification", endpointNameNotification: body.endpointNameNotification ?? { name: "" } };
  }
  if (opcode === 4) {
    return { kind: "stream", group, opcode: "productInstanceIdNotification", productInstanceIdNotification: body.productInstanceIdNotification ?? { productInstanceId: "" } };
  }
  if (opcode === 5) {
    return {
      kind: "stream",
      group,
      opcode: "streamConfigRequest",
      streamConfigRequest: body.streamConfigRequest
    };
  }
  if (opcode === 6) {
    return {
      kind: "stream",
      group,
      opcode: "streamConfigNotification",
      streamConfigNotification: body.streamConfigNotification
    };
  }
  if (opcode === 16) {
    return { kind: "stream", group, opcode: "functionBlockDiscovery", functionBlockDiscovery: body.functionBlockDiscovery };
  }
  if (opcode === 17) {
    const info = body.functionBlockInfo ?? {};
    return { kind: "stream", group, opcode: "functionBlockInfoNotification", functionBlockInfoNotification: { ...body.functionBlockInfo, uiHints: info.uiHints } };
  }
  if (opcode === 18) {
    const fbName = body.functionBlockNameNotification;
    return { kind: "stream", group, opcode: "functionBlockNameNotification", functionBlockNameNotification: fbName ?? { functionBlock: 0, name: "" } };
  }
  if (opcode === 32) {
    return { kind: "stream", group, opcode: "startOfClip" };
  }
  if (opcode === 33) {
    return { kind: "stream", group, opcode: "endOfClip" };
  }
  if (opcode === 3) {
    if (body.processInquiryReply) {
      return {
        kind: "stream",
        group,
        opcode: "processInquiryReply",
        processInquiryReply: body.processInquiryReply
      };
    }
    return {
      kind: "stream",
      group,
      opcode: "processInquiry",
      processInquiry: body.processInquiry
    };
  }
  return null;
}
function streamBodyFromEvent(stream) {
  const fb = stream.functionBlockInfoNotification;
  const functionBlockInfo = fb ? {
    index: fb.index,
    firstGroup: fb.firstGroup,
    groupCount: fb.groupCount,
    active: fb.active,
    direction: fb.direction,
    midi1Bandwidth: fb.midi1Bandwidth
  } : void 0;
  const body = { opcode: opcodeNumber(stream.opcode) };
  if (stream.endpointDiscovery) body.endpointDiscovery = stream.endpointDiscovery;
  if (stream.endpointInfoNotification) body.endpointInfoNotification = stream.endpointInfoNotification;
  if (stream.deviceIdentityNotification) body.deviceIdentityNotification = stream.deviceIdentityNotification;
  if (stream.endpointNameNotification) body.endpointNameNotification = stream.endpointNameNotification;
  if (stream.productInstanceIdNotification) body.productInstanceIdNotification = stream.productInstanceIdNotification;
  if (stream.streamConfigRequest) body.streamConfigRequest = stream.streamConfigRequest;
  if (stream.streamConfigNotification) body.streamConfigNotification = stream.streamConfigNotification;
  if (stream.functionBlockDiscovery) body.functionBlockDiscovery = stream.functionBlockDiscovery;
  if (functionBlockInfo) body.functionBlockInfo = functionBlockInfo;
  if (stream.processInquiry) body.processInquiry = stream.processInquiry;
  if (stream.processInquiryReply) body.processInquiryReply = stream.processInquiryReply;
  return body;
}
function profileToBody(evt) {
  const base = {
    command: evt.command
  };
  if (evt.profileId) base.profileId = evt.profileId;
  if (evt.target) base.target = evt.target;
  if (evt.channels) base.channels = evt.channels;
  if (evt.details) base.details = evt.details;
  const bytes = new TextEncoder().encode(JSON.stringify(base));
  return Uint8Array.from(bytes);
}
function propertyExchangeToBody(evt) {
  const cleanHeader = () => {
    if (!evt.header) return void 0;
    const allowed = ["resource", "resId", "encoding", "flowControl", "status", "message", "cacheTime", "mediaType"];
    const sanitized = {};
    for (const key of allowed) {
      if (!Object.prototype.hasOwnProperty.call(evt.header, key)) continue;
      if (key === "status") {
        const status = Number(evt.header[key]);
        if (Number.isInteger(status) && status >= 100 && status <= 999) {
          sanitized.status = status;
        }
        continue;
      }
      if (key === "flowControl") {
        sanitized.flowControl = Boolean(evt.header[key]);
        continue;
      }
      sanitized[key] = evt.header[key];
    }
    return Object.keys(sanitized).length ? sanitized : void 0;
  };
  const base = {
    command: evt.command,
    requestId: evt.requestId,
    encoding: evt.encoding,
    header: cleanHeader()
  };
  if (evt.subscriptionId) base.subscriptionId = evt.subscriptionId;
  if (evt.subscriptionCommand) base.subscriptionCommand = evt.subscriptionCommand;
  if (evt.flowControlAck) {
    const { requestId, chunkNumber, messageLength } = evt.flowControlAck;
    base.flowControlAck = { status: 17, requestId, chunkNumber, messageLength };
  }
  if (evt.flowControlNak) {
    const { chunkNumber } = evt.flowControlNak;
    base.flowControlNak = { status: 18, chunkNumber };
  }
  if (evt.data instanceof Uint8Array) {
    base.data = Array.from(evt.data);
  } else if (evt.data) {
    base.data = evt.data;
  }
  if (evt.ack) {
    base.ack = evt.ack.ack;
    base.statusCode = evt.ack.statusCode;
    base.message = evt.ack.message;
  }
  if (!base.header && evt.data instanceof Uint8Array) {
    base.header = { mediaType: "application/octet-stream", cacheTime: 0 };
  }
  const bytes = new TextEncoder().encode(JSON.stringify(base));
  return Uint8Array.from(bytes);
}
function midiCiToEvent(env) {
  switch (env.subId2) {
    case 32:
      return sanitizeProfileEvent(
        {
          kind: "profile",
          group: env.group,
          ...decodeProfileBody(env.payload)
        },
        env.group
      );
    case 33:
      return sanitizePeEvent(
        {
          kind: "propertyExchange",
          group: env.group,
          ...decodePropertyExchangeBody(env.payload)
        },
        env.group
      );
    case 34:
      return {
        kind: "processInquiry",
        group: env.group,
        ...decodeProcessInquiryBody(env.payload)
      };
    default:
      return env;
  }
}
function decodeProfileBody(payload) {
  try {
    const text = new TextDecoder().decode(payload);
    const obj = JSON.parse(text);
    const valid = /* @__PURE__ */ new Set([
      "inquiry",
      "reply",
      "addedReport",
      "removedReport",
      "setOn",
      "setOff",
      "enabledReport",
      "disabledReport",
      "detailsInquiry",
      "detailsReply",
      "profileSpecificData"
    ]);
    if (!obj.command || !valid.has(obj.command)) return { command: "reply", details: { payload: Array.from(payload) } };
    const evt = {
      command: obj.command,
      profileId: obj.profileId,
      target: obj.target,
      channels: obj.channels,
      details: obj.details
    };
    return evt;
  } catch {
    return { command: "reply", details: { payload: Array.from(payload) } };
  }
}
function hexStringToBytes(hex) {
  const clean = hex.startsWith("0x") ? hex.slice(2) : hex;
  if (clean.length % 2 !== 0) {
    throw new Error("Hex string length must be even.");
  }
  const out = new Uint8Array(clean.length / 2);
  for (let i = 0; i < clean.length; i += 2) {
    out[i / 2] = parseInt(clean.slice(i, i + 2), 16);
  }
  return out;
}
function decodePropertyExchangeBody(payload) {
  try {
    const text = new TextDecoder().decode(payload);
    const obj = JSON.parse(text);
    const candidate = { ...obj };
    if (candidate.flowControlAck && typeof candidate.flowControlAck === "object" && !("status" in candidate.flowControlAck)) {
      candidate.flowControlAck = { ...candidate.flowControlAck, status: 17 };
    }
    if (candidate.flowControlNak && typeof candidate.flowControlNak === "object" && !("status" in candidate.flowControlNak)) {
      candidate.flowControlNak = { ...candidate.flowControlNak, status: 18 };
    }
    delete candidate.ack;
    delete candidate.statusCode;
    delete candidate.message;
    if (!isMidiCiPropertyExchangeBody(candidate)) return { command: "notify", data: payload };
    const valid = /* @__PURE__ */ new Set([
      "capInquiry",
      "capReply",
      "get",
      "getReply",
      "set",
      "setReply",
      "subscribe",
      "subscribeReply",
      "notify",
      "terminate"
    ]);
    if (!obj.command || !valid.has(obj.command)) return { command: "notify", data: payload };
    const parsedData = obj.encoding && typeof obj.data === "string" && obj.data.startsWith("0x") ? hexStringToBytes(obj.data) : obj.data;
    const evt = {
      command: obj.command,
      requestId: obj.requestId,
      encoding: obj.encoding,
      header: obj.header,
      subscriptionId: obj.subscriptionId,
      subscriptionCommand: obj.subscriptionCommand,
      flowControlAck: obj.flowControlAck ? { status: 17, ...obj.flowControlAck } : void 0,
      flowControlNak: obj.flowControlNak ? { status: 18, ...obj.flowControlNak } : void 0,
      data: parsedData,
      ack: obj.ack !== void 0 ? { ack: !!obj.ack, statusCode: obj.statusCode, message: obj.message } : void 0
    };
    return evt;
  } catch {
    return { command: "notify", data: payload };
  }
}
function sanitizeProfileEvent(evt, group) {
  const requiresProfileId = /* @__PURE__ */ new Set(["setOn", "setOff", "addedReport", "removedReport", "enabledReport", "disabledReport", "detailsInquiry", "detailsReply", "profileSpecificData"]);
  if (requiresProfileId.has(evt.command) && !evt.profileId) {
    return { command: "reply", kind: "profile", group, details: { payload: [] } };
  }
  if ((evt.command === "setOn" || evt.command === "setOff" || evt.command === "detailsInquiry") && !evt.target) {
    return { command: "reply", kind: "profile", group, details: { payload: [] } };
  }
  if (evt.target === "channel" && (!Array.isArray(evt.channels) || evt.channels.length === 0)) {
    return { command: "reply", kind: "profile", group, details: { payload: [] } };
  }
  if (evt.target && !["channel", "group", "functionBlock"].includes(evt.target)) {
    return { command: "reply", kind: "profile", group, details: { payload: [] } };
  }
  if (evt.details && typeof evt.details !== "object") {
    return { command: "reply", kind: "profile", group, details: { payload: [] } };
  }
  return { ...evt, group, kind: "profile" };
}
function sanitizePeEvent(evt, group) {
  const needsRequestId = /* @__PURE__ */ new Set(["get", "getReply", "set", "setReply", "subscribe", "subscribeReply", "notify", "terminate"]);
  if (needsRequestId.has(evt.command) && evt.requestId === void 0) {
    return { kind: "propertyExchange", group, command: "notify", data: evt.data, header: evt.header };
  }
  if (evt.encoding && !["json", "binary", "json+zlib", "binary+zlib", "mcoded7"].includes(evt.encoding)) {
    return { kind: "propertyExchange", group, command: "notify", data: evt.data, header: evt.header };
  }
  const allowedHeaderKeys = /* @__PURE__ */ new Set(["resource", "resId", "encoding", "flowControl", "status", "message", "cacheTime", "mediaType"]);
  if (evt.header) {
    if (typeof evt.header !== "object") {
      return { kind: "propertyExchange", group, command: "notify", data: evt.data };
    }
    const sanitizedHeader = {};
    for (const key of Object.keys(evt.header)) {
      if (allowedHeaderKeys.has(key)) {
        sanitizedHeader[key] = evt.header[key];
      }
    }
    if (sanitizedHeader.status !== void 0) {
      const status = Number(sanitizedHeader.status);
      const allowedStatusCodes = [200, 201, 341, 342, 343, 400, 403, 404, 405, 406, 407, 413, 415, 445, 500];
      if (!Number.isInteger(status) || !allowedStatusCodes.includes(status)) {
        delete sanitizedHeader.status;
      } else {
        sanitizedHeader.status = status;
      }
    }
    evt.header = Object.keys(sanitizedHeader).length ? sanitizedHeader : void 0;
  }
  if (evt.data && !(evt.data instanceof Uint8Array) && typeof evt.data !== "object") {
    return { kind: "propertyExchange", group, command: "notify", data: void 0 };
  }
  if (evt.header && typeof evt.header.offset !== "undefined" && typeof evt.header.length !== "undefined") {
    const offset = Number(evt.header.offset);
    const length = Number(evt.header.length);
    if (!Number.isFinite(offset) || !Number.isFinite(length) || offset < 0 || length < 0) {
      return { kind: "propertyExchange", group, command: "notify", data: void 0 };
    }
  }
  const flowControlAck = evt.flowControlAck ? {
    status: 17,
    requestId: evt.flowControlAck.requestId,
    chunkNumber: evt.flowControlAck.chunkNumber,
    messageLength: evt.flowControlAck.messageLength
  } : void 0;
  const flowControlNak = evt.flowControlNak ? {
    status: 18,
    chunkNumber: evt.flowControlNak.chunkNumber
  } : void 0;
  return { ...evt, group, kind: "propertyExchange", flowControlAck, flowControlNak };
}
function processInquiryToBody(evt) {
  const base = {
    command: evt.command,
    filters: evt.filters
  };
  const bytes = new TextEncoder().encode(JSON.stringify(base));
  return Uint8Array.from(bytes);
}
function decodeProcessInquiryBody(payload) {
  try {
    const obj = JSON.parse(new TextDecoder().decode(payload));
    const valid = /* @__PURE__ */ new Set(["capInquiry", "capReply", "messageReport", "messageReportReply", "endReport"]);
    if (!obj.command || !valid.has(obj.command)) {
      return { command: "endReport" };
    }
    return {
      command: obj.command,
      filters: typeof obj.filters === "object" ? obj.filters : void 0
    };
  } catch {
    return { command: "endReport" };
  }
}
function packStream(stream) {
  const mt = STREAM_MT2 << 28;
  const group = (stream.group & 15) << 24;
  const opcodeByte = opcodeNumber(stream.opcode);
  if (stream.opcode === "endpointDiscovery") {
    const major = stream.endpointDiscovery?.majorVersion ?? 0;
    const minor = stream.endpointDiscovery?.minorVersion ?? 0;
    const maxGroups = stream.endpointDiscovery?.maxGroups ?? 0;
    const word02 = mt | group | STREAM_OPCODE_ENDPOINT_DISCOVERY << 16 | (major & 15) << 12 | (minor & 15) << 8 | maxGroups & 15;
    return new Uint32Array([word02 >>> 0]);
  }
  if (stream.opcode === "streamConfigRequest" || stream.opcode === "streamConfigNotification") {
    const flags = encodeStreamFlags2(stream.streamConfigRequest ?? stream.streamConfigNotification ?? {}, stream.opcode === "streamConfigNotification");
    const opcode = stream.opcode === "streamConfigNotification" ? STREAM_OPCODE_STREAM_CONFIG_NOTIFICATION : STREAM_OPCODE_STREAM_CONFIG_REQUEST;
    const word02 = mt | group | opcode << 16 | flags << 8;
    return new Uint32Array([word02 >>> 0]);
  }
  if (stream.opcode === "deviceIdentityNotification" && stream.deviceIdentityNotification) {
    const id = stream.deviceIdentityNotification;
    const mId = id.manufacturerId ?? [];
    const family = id.deviceFamily ?? 0;
    const model = id.deviceModel ?? 0;
    const sw = id.softwareRevision ?? 0;
    const word02 = mt | group | STREAM_OPCODE_DEVICE_IDENTITY << 16;
    const word1 = ((mId[0] ?? 0) & 255) << 24 | ((mId[1] ?? 0) & 255) << 16 | ((mId[2] ?? 0) & 255) << 8 | family >> 8 & 255;
    const word2 = (family & 255) << 24 | (model >> 8 & 255) << 16 | (model & 255) << 8 | sw >> 24 & 255;
    const word3 = (sw >> 16 & 255) << 24 | (sw >> 8 & 255) << 16 | (sw & 255) << 8;
    return new Uint32Array([word02 >>> 0, word1 >>> 0, word2 >>> 0, word3 >>> 0]);
  }
  if (stream.opcode === "endpointNameNotification") {
    const name = stream.endpointNameNotification?.name ?? "";
    const bytes = Array.from(new TextEncoder().encode(name)).slice(0, 98);
    const words = [];
    for (let i = 0; i < bytes.length; i += 4) {
      const w = (bytes[i] ?? 0) << 24 | (bytes[i + 1] ?? 0) << 16 | (bytes[i + 2] ?? 0) << 8 | (bytes[i + 3] ?? 0);
      words.push(w >>> 0);
    }
    const word02 = mt | group | STREAM_OPCODE_ENDPOINT_NAME << 16;
    return new Uint32Array([word02 >>> 0, ...words]);
  }
  if (stream.opcode === "productInstanceIdNotification") {
    const id = stream.productInstanceIdNotification?.productInstanceId ?? "";
    const bytes = Array.from(new TextEncoder().encode(id)).slice(0, 42);
    const words = [];
    for (let i = 0; i < bytes.length; i += 4) {
      const w = (bytes[i] ?? 0) << 24 | (bytes[i + 1] ?? 0) << 16 | (bytes[i + 2] ?? 0) << 8 | (bytes[i + 3] ?? 0);
      words.push(w >>> 0);
    }
    const word02 = mt | group | STREAM_OPCODE_PRODUCT_INSTANCE_ID << 16;
    return new Uint32Array([word02 >>> 0, ...words]);
  }
  if (stream.opcode === "functionBlockInfoNotification" && stream.functionBlockInfoNotification) {
    const idx = stream.functionBlockInfoNotification.index ?? 0;
    const firstGroup = stream.functionBlockInfoNotification.firstGroup ?? 0;
    const groupCount = stream.functionBlockInfoNotification.groupCount ?? 0;
    const active = stream.functionBlockInfoNotification.active ? 128 : 0;
    const direction = (stream.functionBlockInfoNotification.direction ?? 0) & 3;
    const midi1Bandwidth = (stream.functionBlockInfoNotification.midi1Bandwidth ?? 0) & 3;
    const uiHints = stream.functionBlockInfoNotification.uiHints ?? 0;
    const byte2 = idx & 255;
    const byte3 = (firstGroup & 15) << 4 | groupCount & 15;
    const word02 = mt | group | STREAM_OPCODE_FUNCTION_BLOCK_INFO << 16 | byte2 << 8 | byte3;
    const word1 = active << 24 | direction << 16 | midi1Bandwidth << 8 | uiHints & 255;
    return new Uint32Array([word02 >>> 0, word1 >>> 0]);
  }
  if (stream.opcode === "functionBlockDiscovery" && stream.functionBlockDiscovery) {
    const filter = stream.functionBlockDiscovery.filterBitmap ?? 0;
    const byte2 = filter >> 8 & 255;
    const byte3 = filter & 255;
    const word02 = mt | group | STREAM_OPCODE_FUNCTION_BLOCK_DISCOVERY << 16 | byte2 << 8 | byte3;
    return new Uint32Array([word02 >>> 0]);
  }
  if (stream.opcode === "processInquiry" && stream.processInquiry) {
    const fb = stream.processInquiry.functionBlock ?? 0;
    const part = stream.processInquiry.part ?? 0;
    const word02 = mt | group | STREAM_OPCODE_PROCESS_INQUIRY << 16 | (fb & 127) << 8 | part & 15;
    return new Uint32Array([word02 >>> 0]);
  }
  if (stream.opcode === "processInquiryReply" && stream.processInquiryReply) {
    const fb = stream.processInquiryReply.functionBlock ?? 0;
    const part = stream.processInquiryReply.part ?? 0;
    const word02 = mt | group | STREAM_OPCODE_PROCESS_INQUIRY << 16 | (fb & 127) << 8 | (part & 15 | 128);
    return new Uint32Array([word02 >>> 0]);
  }
  const word0 = mt | group | opcodeByte << 16;
  return new Uint32Array([word0 >>> 0]);
}
function packStreamFromBody(packet) {
  const body = packet.body;
  const group = packet.group ?? 0;
  const opcodeByte = body?.opcode ?? 0;
  let byte2 = 0;
  let byte3 = 0;
  if (body?.endpointDiscovery) {
    const major = body.endpointDiscovery.majorVersion ?? 0;
    const minor = body.endpointDiscovery.minorVersion ?? 0;
    const maxGroups = body.endpointDiscovery.maxGroups ?? 0;
    byte2 = (major & 15) << 4 | minor & 15;
    byte3 = maxGroups & 15;
  } else if (body?.streamConfigRequest) {
    byte2 = encodeStreamFlags2(body.streamConfigRequest, false);
  } else if (body?.streamConfigNotification) {
    byte2 = encodeStreamFlags2(body.streamConfigNotification, true);
  } else if (body?.functionBlockDiscovery) {
    const filter = body.functionBlockDiscovery.filterBitmap ?? 0;
    byte2 = filter >> 8 & 255;
    byte3 = filter & 255;
  } else if (body?.functionBlockInfo) {
    byte2 = body.functionBlockInfo.index ?? 0;
    byte3 = (body.functionBlockInfo.firstGroup ?? 0) << 4 | (body.functionBlockInfo.groupCount ?? 0);
  } else if (body?.processInquiry) {
    byte2 = (body.processInquiry.functionBlock ?? 0) & 127;
    byte3 = (body.processInquiry.part ?? 0) & 15;
  } else if (body?.processInquiryReply) {
    byte2 = (body.processInquiryReply.functionBlock ?? 0) & 127;
    byte3 = (body.processInquiryReply.part ?? 0) & 15 | 128;
  }
  const word0 = STREAM_MT2 << 28 | (group & 15) << 24 | (opcodeByte & 255) << 16 | (byte2 & 255) << 8 | byte3 & 255;
  return new Uint32Array([word0 >>> 0]);
}
function encodeStreamFlags2(cfg, isNotification) {
  let flags = 0;
  if ((cfg.protocol ?? "midi1") === "midi2") flags |= 32;
  if (cfg.jrTimestampsTx) flags |= 2;
  if (cfg.jrTimestampsRx && !isNotification) flags |= 4;
  return flags;
}
function decodeStreamWord(word) {
  const mt = word >>> 28 & 15;
  if (mt !== STREAM_MT2) return null;
  if ((word & 8) !== 0) return null;
  const group = word >>> 24 & 15;
  const opcodeByte = word >>> 16 & 255;
  const byte2 = word >>> 8 & 255;
  const byte3 = word & 255;
  if (opcodeByte === STREAM_OPCODE_ENDPOINT_DISCOVERY) {
    if ((byte3 & 240) !== 0) return null;
    const majorVersion = byte2 >> 4 & 15;
    const minorVersion = byte2 & 15;
    const maxGroups = byte3 & 15;
    return { kind: "stream", group, opcode: "endpointDiscovery", endpointDiscovery: { majorVersion, minorVersion, maxGroups } };
  }
  if (opcodeByte === STREAM_OPCODE_ENDPOINT_INFO) {
    const staticFunctionBlocks = (byte2 & 128) !== 0;
    const numberOfFunctionBlocks = byte2 & 63;
    const midi1Supported = (byte3 & 1) !== 0;
    const midi2Supported = (byte3 & 2) !== 0;
    const jrTimestampsRx = (byte3 & 4) !== 0;
    const jrTimestampsTx = (byte3 & 8) !== 0;
    return {
      kind: "stream",
      group,
      opcode: "endpointInfoNotification",
      endpointInfoNotification: { staticFunctionBlocks, numberOfFunctionBlocks, midi1Supported, midi2Supported, jrTimestampsRx, jrTimestampsTx }
    };
  }
  if (opcodeByte === STREAM_OPCODE_DEVICE_IDENTITY) {
    return { kind: "stream", group, opcode: "deviceIdentityNotification" };
  }
  if (opcodeByte === STREAM_OPCODE_ENDPOINT_NAME) {
    return { kind: "stream", group, opcode: "endpointNameNotification" };
  }
  if (opcodeByte === STREAM_OPCODE_PRODUCT_INSTANCE_ID) {
    return { kind: "stream", group, opcode: "productInstanceIdNotification" };
  }
  if (opcodeByte === STREAM_OPCODE_STREAM_CONFIG_REQUEST || opcodeByte === STREAM_OPCODE_STREAM_CONFIG_NOTIFICATION) {
    if ((byte2 & 217) !== 0) return null;
    const protocol = (byte2 & 32) !== 0 ? "midi2" : "midi1";
    const jrTx = (byte2 & 2) !== 0;
    const jrRx = (byte2 & 4) !== 0;
    const isNotification = opcodeByte === STREAM_OPCODE_STREAM_CONFIG_NOTIFICATION;
    return {
      kind: "stream",
      group,
      opcode: isNotification ? "streamConfigNotification" : "streamConfigRequest",
      streamConfigRequest: isNotification ? void 0 : { protocol, jrTimestampsTx: jrTx, jrTimestampsRx: jrRx },
      streamConfigNotification: isNotification ? { protocol, jrTimestampsTx: jrTx, jrTimestampsRx: jrRx } : void 0
    };
  }
  if (opcodeByte === STREAM_OPCODE_FUNCTION_BLOCK_DISCOVERY) {
    const filterBitmap = byte2 << 8 | byte3;
    return { kind: "stream", group, opcode: "functionBlockDiscovery", functionBlockDiscovery: { filterBitmap } };
  }
  if (opcodeByte === STREAM_OPCODE_FUNCTION_BLOCK_INFO) {
    const index = byte2;
    const firstGroup = byte3 >> 4 & 15;
    const groupCount = byte3 & 15;
    return {
      kind: "stream",
      group,
      opcode: "functionBlockInfoNotification",
      functionBlockInfoNotification: { index, firstGroup, groupCount }
    };
  }
  if (opcodeByte === STREAM_OPCODE_FUNCTION_BLOCK_NAME) {
    return { kind: "stream", group, opcode: "functionBlockNameNotification", functionBlockNameNotification: { functionBlock: 0, name: "" } };
  }
  if (opcodeByte === STREAM_OPCODE_START_OF_CLIP) {
    return { kind: "stream", group, opcode: "startOfClip" };
  }
  if (opcodeByte === STREAM_OPCODE_END_OF_CLIP) {
    return { kind: "stream", group, opcode: "endOfClip" };
  }
  if (opcodeByte === STREAM_OPCODE_PROCESS_INQUIRY) {
    const fb = byte2 & 127;
    const part = byte3 & 15;
    const isReply = (byte3 & 128) !== 0;
    if (isReply) {
      return {
        kind: "stream",
        group,
        opcode: "processInquiryReply",
        processInquiryReply: { functionBlock: fb, part }
      };
    }
    return {
      kind: "stream",
      group,
      opcode: "processInquiry",
      processInquiry: { functionBlock: fb, part }
    };
  }
  return null;
}

// src/adapters/webaudio.ts
function midiNoteToHz(note) {
  return 440 * Math.pow(2, (note - 69) / 12);
}
function clamp01(value) {
  return Math.min(1, Math.max(0, value));
}
var SimplePolySynth = class {
  constructor(ctx, opts) {
    this.voices = /* @__PURE__ */ new Map();
    this.ctx = ctx;
    this.releaseMs = opts?.releaseMs ?? 40;
    this.pitchBendRange = opts?.pitchBendRange ?? 2;
    this.velocityCurve = opts?.velocityCurve ?? ((v) => Math.pow(v / 65535, 0.35));
    this.master = ctx.createGain();
    this.master.gain.value = 0.6;
    this.master.connect(opts?.destination ?? ctx.destination);
  }
  noteOn(evt) {
    const key = this.voiceKey(evt);
    this.stopVoice(key);
    const gain = this.ctx.createGain();
    const osc = this.ctx.createOscillator();
    osc.type = "sawtooth";
    osc.frequency.value = midiNoteToHz(evt.note);
    const level = clamp01(this.velocityCurve(evt.velocity));
    const now = this.ctx.currentTime;
    gain.gain.setValueAtTime(0, now);
    gain.gain.linearRampToValueAtTime(level, now + 5e-3);
    osc.connect(gain).connect(this.master);
    osc.start(now);
    this.voices.set(key, { osc, gain });
  }
  noteOff(evt) {
    const key = this.voiceKey(evt);
    const voice = this.voices.get(key);
    if (!voice) return;
    const now = this.ctx.currentTime;
    const releaseSeconds = this.releaseMs / 1e3;
    voice.gain.gain.cancelScheduledValues(now);
    voice.gain.gain.setTargetAtTime(0, now, releaseSeconds / 4);
    voice.osc.stop(now + releaseSeconds * 2);
    setTimeout(() => this.stopVoice(key), this.releaseMs * 2);
  }
  polyPressure(evt) {
    const voice = this.voices.get(this.voiceKey(evt));
    if (!voice) return;
    const pressure = clamp01(evt.pressure / 4294967295);
    voice.gain.gain.setTargetAtTime(0.2 + pressure * 0.8, this.ctx.currentTime, 0.01);
  }
  controlChange(evt) {
    const norm = evt.value / 4294967295;
    if (evt.controller === 7) {
      this.master.gain.setTargetAtTime(clamp01(norm), this.ctx.currentTime, 0.01);
    }
  }
  channelPressure(evt) {
    const pressure = clamp01(evt.pressure / 4294967295);
    this.master.gain.setTargetAtTime(0.2 + pressure * 0.8, this.ctx.currentTime, 0.01);
  }
  pitchBend(evt) {
    const bendNorm = (evt.value - 2147483648) / 2147483647;
    const bendCents = bendNorm * this.pitchBendRange * 100;
    const now = this.ctx.currentTime;
    for (const [key, voice] of this.voices) {
      if (!key.startsWith(`${evt.group}:${evt.channel}:`)) continue;
      voice.osc.detune.setTargetAtTime(bendCents, now, 0.01);
    }
  }
  stopVoice(key) {
    const voice = this.voices.get(key);
    if (!voice) return;
    try {
      voice.osc.stop();
    } catch {
    }
    voice.osc.disconnect();
    voice.gain.disconnect();
    this.voices.delete(key);
  }
  voiceKey(evt) {
    return `${evt.group}:${evt.channel}:${evt.note}`;
  }
};
function createWebAudioAdapter(ctx, opts) {
  const synth = new SimplePolySynth(ctx, opts);
  return (evt) => {
    switch (evt.kind) {
      case "noteOn":
        synth.noteOn(evt);
        break;
      case "noteOff":
        synth.noteOff(evt);
        break;
      case "polyPressure":
        synth.polyPressure(evt);
        break;
      case "controlChange":
        synth.controlChange(evt);
        break;
      case "channelPressure":
        synth.channelPressure(evt);
        break;
      case "pitchBend":
        synth.pitchBend(evt);
        break;
      default:
        break;
    }
  };
}

// src/adapters/three.ts
function defaultMeshFactory(evt) {
  const maybeThree = globalThis.THREE;
  if (!maybeThree) return null;
  const size = 0.3 + evt.velocity / 65535 * 0.7;
  const geometry = new maybeThree.SphereGeometry(size, 16, 16);
  const material = new maybeThree.MeshStandardMaterial({
    color: new maybeThree.Color(`hsl(${evt.note % 24 * 15}, 70%, 55%)`),
    emissiveIntensity: 0.6
  });
  const mesh = new maybeThree.Mesh(geometry, material);
  mesh.position.set((evt.note - 60) * 0.15, 0, 0);
  mesh.userData.midi2Key = `${evt.group}:${evt.channel}:${evt.note}`;
  return mesh;
}
function createThreeAdapter(scene, opts) {
  const decayMs = opts?.decayMs ?? 250;
  const factory = opts?.createObject ?? defaultMeshFactory;
  const active = /* @__PURE__ */ new Map();
  return (evt) => {
    switch (evt.kind) {
      case "noteOn": {
        const key = `${evt.group}:${evt.channel}:${evt.note}`;
        const obj = factory(evt);
        if (!obj) return;
        active.set(key, obj);
        scene.add(obj);
        break;
      }
      case "noteOff": {
        const key = `${evt.group}:${evt.channel}:${evt.note}`;
        const obj = active.get(key);
        if (!obj) return;
        setTimeout(() => {
          scene.remove(obj);
          active.delete(key);
        }, decayMs);
        break;
      }
      case "controlChange":
        opts?.onControlChange?.(evt);
        break;
      case "pitchBend":
        opts?.onPitchBend?.(evt);
        break;
      default:
        break;
    }
  };
}

// src/adapters/cannon.ts
function defaultBodyFactory(evt) {
  const CANNON = globalThis.CANNON;
  if (!CANNON) return null;
  const radius = 0.2 + evt.velocity / 65535 * 0.4;
  const shape = new CANNON.Sphere(radius);
  const body = new CANNON.Body({
    mass: 1,
    shape,
    position: new CANNON.Vec3((evt.note - 60) * 0.3, 1 + evt.velocity / 65535 * 1.5, 0)
  });
  body.userData = { midi2Key: `${evt.group}:${evt.channel}:${evt.note}` };
  return body;
}
function createCannonAdapter(world, opts) {
  const bodies = /* @__PURE__ */ new Map();
  const impulseScale = opts?.impulseScale ?? 10;
  const factory = opts?.createBody ?? defaultBodyFactory;
  return (evt) => {
    switch (evt.kind) {
      case "noteOn": {
        const key = `${evt.group}:${evt.channel}:${evt.note}`;
        const body = factory(evt);
        if (!body) return;
        bodies.set(key, body);
        world.addBody(body);
        const impulseStrength = evt.velocity / 65535 * impulseScale;
        if (typeof body.applyImpulse === "function") {
          body.applyImpulse({ x: 0, y: impulseStrength, z: 0 }, body.position);
        }
        break;
      }
      case "noteOff": {
        const key = `${evt.group}:${evt.channel}:${evt.note}`;
        const body = bodies.get(key);
        if (!body) return;
        world.removeBody(body);
        bodies.delete(key);
        break;
      }
      case "controlChange":
        opts?.onControlChange?.(evt);
        break;
      case "pitchBend":
        opts?.onPitchBend?.(evt);
        break;
      default:
        break;
    }
  };
}

// src/gtb-context.ts
var gtbAllowedByGroup = /* @__PURE__ */ new Map();
function setGtbAllowedMessageTypes(group, allowed) {
  gtbAllowedByGroup.set(group & 15, new Set(Array.from(allowed).map((n) => n & 15)));
}
function getGtbAllowedMessageTypesForGroup(group) {
  return gtbAllowedByGroup.get(group & 15) ?? null;
}

// src/gtb-validator.ts
function validateFunctionBlockLayouts(events, allowOverlap = false) {
  if (allowOverlap) return;
  const ranges = [];
  for (const evt of events) {
    if (evt.kind === "stream" && evt.opcode === "functionBlockInfoNotification") {
      const fb = evt.functionBlockInfoNotification ?? {};
      const idx = fb.index ?? 0;
      const start = (fb.firstGroup ?? 0) & 15;
      const count = (fb.groupCount ?? 0) & 15;
      const end = start + Math.max(0, count - 1);
      ranges.push({ index: idx, start, end });
    }
  }
  for (let i = 0; i < ranges.length; i++) {
    for (let j = i + 1; j < ranges.length; j++) {
      const a = ranges[i];
      const b = ranges[j];
      if (a.start <= b.end && b.start <= a.end) {
        throw new RangeError(`GTB/function block overlap between index ${a.index} and ${b.index}`);
      }
    }
  }
}
function validateDescriptorGroupsAgainstFunctionBlocks(descriptor, events, allowOverlap = false) {
  validateFunctionBlockLayouts(events, allowOverlap);
  const ranges = [];
  for (const evt of events) {
    if (evt.kind === "stream" && evt.opcode === "functionBlockInfoNotification") {
      const fb = evt.functionBlockInfoNotification ?? {};
      const start = (fb.firstGroup ?? 0) & 15;
      const count = (fb.groupCount ?? 0) & 15;
      const end = start + Math.max(0, count - 1);
      ranges.push({ start, end });
    }
  }
  const groups = descriptor.groups ?? {};
  for (const [groupKey] of Object.entries(groups)) {
    const g = Number(groupKey) & 15;
    const covered = ranges.some((r) => r.start <= g && g <= r.end);
    if (!covered) {
      throw new RangeError(`GTB descriptor group ${groupKey} not covered by any Function Block`);
    }
  }
}
function enforceAllowedMessageType(mt, allowed) {
  const nibble = mt & 15;
  if (!allowed.has(nibble)) {
    throw new RangeError(`GTB disallows message type 0x${nibble.toString(16)}`);
  }
}

// src/gtb-descriptor.ts
function applyGtbDescriptor(desc, opts) {
  if (opts?.functionBlocks) {
    validateDescriptorGroupsAgainstFunctionBlocks(desc, opts.functionBlocks, opts.allowOverlap ?? false);
  }
  for (const [groupKey, mts] of Object.entries(desc.groups ?? {})) {
    const g = Number(groupKey) & 15;
    const allowed = /* @__PURE__ */ new Set();
    for (const mt of mts) {
      const n = typeof mt === "string" ? Number(mt) : mt;
      allowed.add((n ?? 0) & 15);
    }
    setGtbAllowedMessageTypes(g, allowed);
  }
}

// src/gtb-guards.ts
function guardUmpWordsWithGtb(words) {
  const word0 = words[0] ?? 0;
  const group = word0 >>> 24 & 15;
  const mt = word0 >>> 28 & 15;
  const allowed = getGtbAllowedMessageTypesForGroup(group);
  if (allowed) {
    enforceAllowedMessageType(mt, allowed);
  }
}

// src/gtb-negotiation.ts
function negotiateGtbContext(desc, opts) {
  applyGtbDescriptor(desc, { functionBlocks: opts?.functionBlocks, allowOverlap: opts?.allowOverlap });
}
function validateGtbDescriptor(desc, functionBlocks, allowOverlap = false) {
  validateDescriptorGroupsAgainstFunctionBlocks(desc, functionBlocks, allowOverlap);
}
function guardIngress(words) {
  guardUmpWordsWithGtb(words);
}
var guardEgress = guardIngress;

// src/stream-negotiation.ts
function normalizeCaps(caps) {
  return {
    supportsMIDI2: caps?.supportsMIDI2 ?? true,
    jrTx: caps?.jrTx ?? true,
    jrRx: caps?.jrRx ?? true
  };
}
function negotiateStreamConfig(request, caps, opts) {
  const normCaps = normalizeCaps(caps);
  const mismatches = [];
  const selectedProtocol = normCaps.supportsMIDI2 && request.protocol === "midi2" ? "midi2" : "midi1";
  if (selectedProtocol !== request.protocol) {
    mismatches.push({ kind: "protocolDowngraded", requested: request.protocol, selected: selectedProtocol });
  }
  const jrTx = normCaps.jrTx && !!request.jrTimestampsTx;
  const jrRx = normCaps.jrRx && !!request.jrTimestampsRx;
  if (jrTx !== !!request.jrTimestampsTx) {
    mismatches.push({ kind: "jrTxRejected" });
  }
  if (jrRx !== !!request.jrTimestampsRx) {
    mismatches.push({ kind: "jrRxRejected" });
  }
  const notification = {
    protocol: selectedProtocol,
    jrTimestampsTx: jrTx,
    jrTimestampsRx: jrRx
  };
  const previous = opts?.previous;
  const switchedProtocol = previous ? previous.protocol !== selectedProtocol : true;
  const shouldNotifyPeer = !!opts?.forceNotification || mismatches.length > 0 || !previous || switchedProtocol;
  return {
    notification,
    mismatches,
    switchedProtocol,
    shouldNotifyPeer,
    accepted: mismatches.length === 0,
    nextConfiguration: notification
  };
}
var StreamNegotiationSession = class {
  constructor(caps) {
    this.lastMismatchReasons = [];
    this.lastConfigMismatch = false;
    this.responderCaps = caps ?? {};
  }
  negotiate(request, opts) {
    const result = negotiateStreamConfig(request, this.responderCaps, { previous: this.currentConfiguration, forceNotification: opts?.forceNotification });
    this.currentConfiguration = result.nextConfiguration;
    this.lastMismatchReasons = result.mismatches;
    this.lastConfigMismatch = result.mismatches.length > 0;
    return result;
  }
  /**
   * Convenience to produce a `StreamEvent` notification for encoding.
   */
  toStreamEvent(group, cfg) {
    return {
      kind: "stream",
      group,
      opcode: "streamConfigNotification",
      streamConfigNotification: {
        protocol: cfg.protocol,
        jrTimestampsTx: cfg.jrTimestampsTx,
        jrTimestampsRx: cfg.jrTimestampsRx
      }
    };
  }
};

// src/muid-manager.ts
var MuidManager = class {
  constructor(options = {}) {
    this.peers = /* @__PURE__ */ new Map();
    this.ttlMs = options.ttlMs ?? 12e4;
    this.now = options.now ?? (() => Date.now());
    this.localMuid = this.allocateUnique(options.localHint);
  }
  /**
   * Registers or refreshes a peer MUID. Returns true if this registration
   * conflicted with the local MUID and forced a rotation.
   */
  registerPeer(muid, at) {
    if (!this.isUsable(muid)) return false;
    const ts = at ?? this.now();
    this.peers.set(muid >>> 0, ts);
    if (muid === this.localMuid) {
      this.rotateLocal();
      return true;
    }
    return false;
  }
  /** Releases a tracked peer. */
  releasePeer(muid) {
    return this.peers.delete(muid >>> 0);
  }
  /** Removes peers whose lastSeen timestamp is older than the TTL. */
  cleanup(at) {
    const cutoff = (at ?? this.now()) - this.ttlMs;
    const expired = [];
    for (const [muid, lastSeen] of this.peers.entries()) {
      if (lastSeen < cutoff) {
        expired.push(muid);
        this.peers.delete(muid);
      }
    }
    return expired;
  }
  /** Snapshot of tracked peers. */
  get peersSnapshot() {
    return Array.from(this.peers.entries()).map(([muid, lastSeenMs]) => ({ muid, lastSeenMs }));
  }
  /** Forces a new local MUID, avoiding collisions with peers. */
  rotateLocal() {
    this.localMuid = this.allocateUnique();
    return this.localMuid;
  }
  allocateUnique(preferred) {
    const isFree = (candidate2) => this.isUsable(candidate2) && candidate2 !== this.localMuid && !this.peers.has(candidate2 >>> 0);
    if (preferred !== void 0 && isFree(preferred)) {
      return preferred >>> 0;
    }
    for (let i = 0; i < 16; i++) {
      const candidate2 = Math.floor(Math.random() * 4294967295) + 1 >>> 0;
      if (isFree(candidate2)) return candidate2;
    }
    let candidate = 1;
    while (!isFree(candidate)) {
      candidate = candidate + 1 >>> 0;
      if (candidate === 0) candidate = 1;
    }
    return candidate >>> 0;
  }
  isUsable(muid) {
    return Number.isInteger(muid) && muid > 0 && muid <= 4294967295;
  }
};

// src/midi-clip.ts
var MIDI_CLIP_HEADER = new Uint8Array([83, 77, 70, 50, 67, 76, 73, 80]);
var MIDI_CLIP_MAX_DELTA_TICKS = 1048575;
function assertInteger(name, value, min, max) {
  if (!Number.isInteger(value) || value < min || value > max) {
    throw new RangeError(`${name} must be an integer in [${min}, ${max}], got ${value}`);
  }
}
function encodeUtility2(status, value = 0) {
  const words = encodeUmp({ kind: "utility", status, value });
  return words[0] >>> 0;
}
function encodeStream2(opcode, group) {
  const words = encodeUmp({ kind: "stream", opcode, group });
  return words[0] >>> 0;
}
function appendWord(bytes, word) {
  bytes.push(word >>> 24 & 255, word >>> 16 & 255, word >>> 8 & 255, word & 255);
}
function appendEventWords(bytes, words) {
  for (let index = 0; index < words.length; index += 1) {
    const word = words[index];
    if (!Number.isInteger(word) || word < 0 || word > 4294967295) {
      throw new RangeError(`event word must be an unsigned 32-bit integer, got ${word}`);
    }
    appendWord(bytes, word >>> 0);
  }
}
function buildMidiClipFile(dctpq, events, group = 0) {
  assertInteger("dctpq", dctpq, 1, 65535);
  assertInteger("group", group, 0, 15);
  const bytes = Array.from(MIDI_CLIP_HEADER);
  const appendDcs = (value) => appendWord(bytes, encodeUtility2("deltaClockstamp", value));
  appendDcs(0);
  appendWord(bytes, encodeUtility2("dctpq", dctpq));
  appendDcs(0);
  appendWord(bytes, encodeStream2("startOfClip", group));
  const ordered = events.map((event, index) => ({ event, index })).sort((left, right) => {
    if (left.event.ticks === right.event.ticks) return left.index - right.index;
    return left.event.ticks - right.event.ticks;
  });
  let lastTick = 0;
  for (const { event } of ordered) {
    assertInteger("event ticks", event.ticks, 0, 4294967295);
    let delta = event.ticks >= lastTick ? event.ticks - lastTick : 0;
    while (delta > MIDI_CLIP_MAX_DELTA_TICKS) {
      appendDcs(MIDI_CLIP_MAX_DELTA_TICKS);
      appendWord(bytes, encodeUtility2("noop"));
      delta -= MIDI_CLIP_MAX_DELTA_TICKS;
      lastTick += MIDI_CLIP_MAX_DELTA_TICKS;
    }
    appendDcs(delta);
    appendEventWords(bytes, event.words);
    lastTick = event.ticks;
  }
  appendDcs(0);
  appendWord(bytes, encodeStream2("endOfClip", group));
  return Uint8Array.from(bytes);
}
function midiClipTicksForSeconds(seconds, dctpq, tempoMicrosecondsPerQuarterNote) {
  if (!Number.isFinite(seconds) || seconds < 0 || dctpq <= 0 || tempoMicrosecondsPerQuarterNote <= 0) return 0;
  const ticks = seconds * dctpq * 1e6 / tempoMicrosecondsPerQuarterNote;
  return Math.min(Math.round(ticks), 4294967295);
}
function buildMidiClipFileFromSeconds(dctpq, tempoMicrosecondsPerQuarterNote, events, group = 0) {
  return buildMidiClipFile(
    dctpq,
    events.map((event) => ({ ticks: midiClipTicksForSeconds(event.timeSeconds, dctpq, tempoMicrosecondsPerQuarterNote), words: event.words })),
    group
  );
}

// src/modeled-frontiers.ts
function selectCompatibleFeatures(requested, supported) {
  const available = new Set(supported);
  const requestedList = [...new Set(requested)];
  const selected = requestedList.filter((feature) => available.has(feature));
  return { compatible: selected.length === requestedList.length, selected, missing: requestedList.filter((feature) => !available.has(feature)) };
}
var MidiCiTransaction = class {
  constructor() {
    this.state = "idle";
  }
  requireState(...allowed) {
    if (!allowed.includes(this.state)) throw new Error(`invalid MIDI-CI transaction state: ${this.state}`);
  }
  sendRequest() {
    this.requireState("idle");
    this.state = "request-sent";
  }
  acceptRequest() {
    this.requireState("request-sent");
    this.state = "awaiting-response";
  }
  receiveResponse() {
    this.requireState("awaiting-response");
    this.state = "completed";
  }
  timeout() {
    this.requireState("awaiting-response");
    this.state = "timed-out";
    this.failureReason = "timeout";
  }
  reject(reason = "rejected") {
    this.requireState("request-sent", "awaiting-response");
    this.state = "failed";
    this.failureReason = reason;
  }
};
var ProfileChannelAllocation = class {
  constructor(profileId, channels) {
    this.state = "unallocated";
    if (!profileId) throw new RangeError("profileId must not be empty");
    const unique = [...new Set(channels)];
    if (!unique.length || unique.some((channel) => !Number.isInteger(channel) || channel < 0 || channel > 15)) {
      throw new RangeError("channels must contain MIDI channels in [0, 15]");
    }
    this.profileId = profileId;
    this.channels = unique.sort((a, b) => a - b);
  }
  inquire() {
    if (this.state !== "unallocated" && this.state !== "released" && this.state !== "rejected") throw new Error(`invalid allocation state: ${this.state}`);
    this.state = "inquiry";
  }
  beginNegotiation() {
    if (this.state !== "inquiry") throw new Error(`allocation requires inquiry, got ${this.state}`);
    this.state = "negotiating";
  }
  accept() {
    if (this.state !== "negotiating") throw new Error(`allocation requires negotiation, got ${this.state}`);
    this.state = "allocated";
  }
  reject() {
    if (this.state !== "negotiating") throw new Error(`allocation requires negotiation, got ${this.state}`);
    this.state = "rejected";
  }
  release() {
    if (this.state !== "allocated") throw new Error(`only an allocated profile can be released, got ${this.state}`);
    this.state = "released";
  }
};
var PropertyExchangeResourceTransaction = class {
  constructor(resource, requestId) {
    this.state = "idle";
    if (!resource || !Number.isInteger(requestId) || requestId < 0 || requestId > 4294967295) throw new RangeError("resource and requestId are required");
    this.resource = resource;
    this.requestId = requestId;
  }
  request() {
    if (this.state !== "idle") throw new Error(`invalid resource transaction state: ${this.state}`);
    this.state = "requested";
  }
  accept() {
    if (this.state !== "requested") throw new Error(`resource request is not pending: ${this.state}`);
    this.state = "accepted";
  }
  beginResponse() {
    if (this.state !== "accepted" && this.state !== "responding") throw new Error(`resource response is not allowed: ${this.state}`);
    this.state = "responding";
  }
  complete() {
    if (this.state !== "responding") throw new Error(`resource response is not active: ${this.state}`);
    this.state = "completed";
  }
  reject(reason = "rejected") {
    if (this.state !== "requested" && this.state !== "accepted") throw new Error(`resource rejection is not allowed: ${this.state}`);
    this.state = "rejected";
    this.failureReason = reason;
  }
  invalidate(reason = "invalid-resource") {
    if (this.state === "completed") throw new Error("completed resource transaction cannot be invalidated");
    this.state = "invalid";
    this.failureReason = reason;
  }
};
var UmpOrderingValidator = class {
  constructor() {
    this.nextSequence = 0;
  }
  validate(packet, sequence) {
    if (sequence !== this.nextSequence) return { accepted: false, kind: "out-of-order", message: `expected sequence ${this.nextSequence}, got ${sequence}` };
    if (!packet.length || packet.length > 4) return { accepted: false, kind: "invalid", message: "UMP packet must contain one to four words" };
    const first = packet[0] ?? 0;
    if (!Number.isInteger(first) || first < 0 || first > 4294967295) return { accepted: false, kind: "invalid", message: "UMP words must be uint32" };
    const messageType = first >>> 28 & 15;
    if (messageType === 13) return { accepted: false, kind: "reserved", message: "UMP message type 0xD is reserved" };
    this.nextSequence += 1;
    return { accepted: true, sequence };
  }
};
export {
  JitterReductionSynchronizer,
  MIDI_CLIP_HEADER,
  MIDI_CLIP_MAX_DELTA_TICKS,
  Midi2Scheduler,
  MidiCiTransaction,
  MuidManager,
  PeSubscriptionManager,
  ProfileChannelAllocation,
  ProfileSession,
  PropertyExchangeResourceTransaction,
  STREAM_OPCODE_DEVICE_IDENTITY,
  STREAM_OPCODE_ENDPOINT_DISCOVERY,
  STREAM_OPCODE_ENDPOINT_INFO,
  STREAM_OPCODE_ENDPOINT_NAME,
  STREAM_OPCODE_END_OF_CLIP,
  STREAM_OPCODE_FUNCTION_BLOCK_DISCOVERY,
  STREAM_OPCODE_FUNCTION_BLOCK_INFO,
  STREAM_OPCODE_FUNCTION_BLOCK_NAME,
  STREAM_OPCODE_PROCESS_INQUIRY,
  STREAM_OPCODE_PRODUCT_INSTANCE_ID,
  STREAM_OPCODE_START_OF_CLIP,
  STREAM_OPCODE_STREAM_CONFIG_NOTIFICATION,
  STREAM_OPCODE_STREAM_CONFIG_REQUEST,
  StreamNegotiationSession,
  UmpOrderingValidator,
  applyJitterReduction,
  buildMidiClipFile,
  buildMidiClipFileFromSeconds,
  createAudioContextClock,
  createBrowserClock,
  createCannonAdapter,
  createThreeAdapter,
  createWebAudioAdapter,
  createWorkerClock,
  decodeMidiCiFromSysEx,
  decodeUmp,
  encodeChannelPressure,
  encodeControlChange,
  encodeEventPackets,
  encodeMidiCiEvent,
  encodeNoteOff,
  encodeNoteOn,
  encodeNrpn,
  encodeNrpnRelative,
  encodePerNoteAssignableController,
  encodePerNoteManagement,
  encodePerNotePitchBend,
  encodePerNoteRegisteredController,
  encodePitchBend,
  encodePolyPressure,
  encodeProgramChange,
  encodeRpn,
  encodeRpnRelative,
  encodeUmp,
  fragmentSysEx7,
  fragmentSysEx8,
  guardEgress,
  guardIngress,
  midi1BytesToUmp,
  midi2ChannelVoiceToMidi1Bytes,
  midi2EventsToMidi1Bytes,
  midiClipTicksForSeconds,
  negotiateGtbContext,
  negotiateStreamConfig,
  reassembleSysEx7,
  reassembleSysEx8,
  schemaPacketToEventWithResponses,
  selectCompatibleFeatures,
  umpBytesToWords,
  validateGtbDescriptor,
  wordsToUMPBytes
};
//# sourceMappingURL=index.js.map