/**
 * Sound effects, synthesised with the Web Audio API so the site ships no audio files and no
 * audio library. Every sound lives here, so swapping one for a recorded file touches only
 * this module.
 *
 * Browsers only let audio start from a user gesture (a click or key press), so call these
 * from an event handler; a call during page load stays silent.
 */

let context: AudioContext | null = null;
let noise: AudioBuffer | null = null;
let grit: Float32Array<ArrayBuffer> | null = null;

const getContext = (): AudioContext | null => {
  if (typeof window === "undefined" || !("AudioContext" in window)) return null;
  context ??= new AudioContext();
  if (context.state === "suspended") void context.resume();
  return context;
};

/** One second of white noise, built once and reused for every burst. */
const getNoise = (audio: AudioContext) => {
  if (noise) return noise;
  noise = audio.createBuffer(1, audio.sampleRate, audio.sampleRate);
  const channel = noise.getChannelData(0);
  for (let i = 0; i < channel.length; i++) channel[i] = Math.random() * 2 - 1;
  return noise;
};

/** A soft-clipping curve: drives a clean tone into the dense, gritty edge of a machine. */
const getGrit = () => {
  if (grit) return grit;
  grit = new Float32Array(1024);
  for (let i = 0; i < grit.length; i++) {
    const x = (i / (grit.length - 1)) * 2 - 1;
    grit[i] = Math.tanh(x * 3.5);
  }
  return grit;
};

const distortion = (audio: AudioContext) => {
  const shaper = audio.createWaveShaper();
  shaper.curve = getGrit();
  shaper.oversample = "4x";
  return shaper;
};

/** An envelope that hits `peak` instantly and decays to silence over `length` seconds. */
const strike = (
  audio: AudioContext,
  at: number,
  peak: number,
  length: number,
) => {
  const level = audio.createGain();
  level.gain.setValueAtTime(peak, at);
  level.gain.exponentialRampToValueAtTime(0.0001, at + length);
  return level;
};

/** A filtered slice of noise: the crack of metal meeting metal, or a hiss of air. */
const burst = (
  audio: AudioContext,
  out: AudioNode,
  at: number,
  {
    length,
    gain,
    filter,
    frequency,
  }: {
    length: number;
    gain: number;
    filter: BiquadFilterType;
    frequency: number;
  },
) => {
  const source = audio.createBufferSource();
  source.buffer = getNoise(audio);
  const shape = audio.createBiquadFilter();
  shape.type = filter;
  shape.frequency.value = frequency;
  source
    .connect(shape)
    .connect(strike(audio, at, gain, length))
    .connect(out);
  source.start(at, Math.random() * 0.5);
  source.stop(at + length + 0.02);
};

/** A falling sine: the weight behind an impact, felt more than heard. */
const thump = (
  audio: AudioContext,
  out: AudioNode,
  at: number,
  {
    from,
    to,
    length,
    gain,
  }: { from: number; to: number; length: number; gain: number },
) => {
  const osc = audio.createOscillator();
  osc.type = "sine";
  osc.frequency.setValueAtTime(from, at);
  osc.frequency.exponentialRampToValueAtTime(to, at + length * 0.6);
  osc.connect(strike(audio, at, gain, length)).connect(out);
  osc.start(at);
  osc.stop(at + length + 0.02);
};

/** Ringing steel: inharmonic partials, the high ones dying first. */
const ring = (
  audio: AudioContext,
  out: AudioNode,
  at: number,
  { pitch, length, gain }: { pitch: number; length: number; gain: number },
) => {
  for (const [ratio, weight] of [
    [1, 1],
    [2.32, 0.6],
    [4.25, 0.35],
    [6.8, 0.2],
  ] as const) {
    const osc = audio.createOscillator();
    osc.type = "triangle";
    osc.frequency.value = pitch * ratio;
    osc
      .connect(strike(audio, at, gain * weight, length / ratio + 0.04))
      .connect(out);
    osc.start(at);
    osc.stop(at + length + 0.05);
  }
};

/**
 * A piece snapping into its slot: a very short, bright crack over a small, tight knock, like
 * a latch clicking shut. Kept short so a fast run of them stays a crisp rattle of separate
 * clicks. Pitches vary a little per hit so the run does not sound like one sample on repeat.
 */
const snap = (audio: AudioContext, out: AudioNode, at: number) => {
  const shift = 0.85 + Math.random() * 0.3;
  burst(audio, out, at, {
    length: 0.018,
    gain: 0.75,
    filter: "highpass",
    frequency: 2600,
  });
  thump(audio, out, at, {
    from: 320 * shift,
    to: 110,
    length: 0.06,
    gain: 0.6,
  });
  ring(audio, out, at, { pitch: 780 * shift, length: 0.07, gain: 0.08 });
};

type TransformSound = {
  /** Length of the whole sequence, in seconds. */
  duration: number;
  /** Seconds from now at which pieces snap in, each played as a click. */
  body: number[];
  /** Seconds from now at which the last piece seals, played as the heaviest hit. */
  seal: number;
};

/**
 * A mechanical assembly: a gritty motor that winds up for the whole build, a hiss of
 * pressure, a rapid run of snaps as the pieces lock, and one big seal when the last lands.
 */
export const playTransformSound = ({
  duration,
  body,
  seal,
}: TransformSound) => {
  const audio = getContext();
  if (!audio) return;
  const start = audio.currentTime + 0.02;

  const master = audio.createGain();
  // Loud on laptop speakers without clipping: stacked hits measured 1.26 at 0.8.
  master.gain.value = 0.55;
  const limiter = audio.createDynamicsCompressor();
  limiter.threshold.value = -14;
  limiter.ratio.value = 12;
  // Fast enough to catch the crack at the front of each hit.
  limiter.attack.value = 0.001;
  limiter.knee.value = 0;
  master.connect(limiter).connect(audio.destination);

  // Hydraulic motor: two detuned saws driven into distortion, a low growl winding upward
  // until the seal, with a fast flutter like a gear train.
  const motorEnd = start + seal;
  const motorBus = audio.createGain();
  motorBus.gain.setValueAtTime(0.0001, start);
  motorBus.gain.exponentialRampToValueAtTime(0.2, start + 0.12);
  motorBus.gain.setValueAtTime(0.2, motorEnd - 0.06);
  motorBus.gain.exponentialRampToValueAtTime(0.0001, motorEnd + 0.04);
  const tone = audio.createBiquadFilter();
  tone.type = "lowpass";
  tone.Q.value = 1.2;
  tone.frequency.setValueAtTime(700, start);
  tone.frequency.exponentialRampToValueAtTime(2600, motorEnd);
  const flutter = audio.createGain();
  flutter.gain.value = 0.65;
  const flutterLfo = audio.createOscillator();
  flutterLfo.frequency.value = 17;
  const flutterDepth = audio.createGain();
  flutterDepth.gain.value = 0.35;
  flutterLfo.connect(flutterDepth).connect(flutter.gain);
  const drive = distortion(audio);
  drive.connect(tone).connect(flutter).connect(motorBus).connect(master);
  for (const detune of [0, 9]) {
    const saw = audio.createOscillator();
    saw.type = "sawtooth";
    saw.detune.value = detune;
    saw.frequency.setValueAtTime(48, start);
    saw.frequency.exponentialRampToValueAtTime(150, motorEnd);
    saw.connect(drive);
    saw.start(start);
    saw.stop(motorEnd + 0.06);
  }
  flutterLfo.start(start);
  flutterLfo.stop(motorEnd + 0.06);

  // A hiss of pressure as the first plates launch.
  burst(audio, master, start, {
    length: 0.45,
    gain: 0.18,
    filter: "bandpass",
    frequency: 3000,
  });

  for (const at of body) snap(audio, master, start + at);

  // The seal: a deep drop, a wide crack and a long ring of steel, all through a little grit
  // so it lands harder than any single plate.
  const sealAt = start + seal;
  const sealBus = audio.createGain();
  sealBus.gain.value = 1;
  const sealDrive = distortion(audio);
  sealBus.connect(sealDrive).connect(master);
  thump(audio, sealBus, sealAt, { from: 120, to: 32, length: 0.6, gain: 1 });
  burst(audio, sealBus, sealAt, {
    length: 0.25,
    gain: 0.6,
    filter: "lowpass",
    frequency: 1400,
  });
  burst(audio, master, sealAt, {
    length: 0.05,
    gain: 0.8,
    filter: "highpass",
    frequency: 2500,
  });
  ring(audio, master, sealAt, { pitch: 140, length: 0.9, gain: 0.22 });
  // A last release of air once it has locked.
  burst(audio, master, sealAt + 0.12, {
    length: Math.max(0.3, duration - seal),
    gain: 0.12,
    filter: "bandpass",
    frequency: 4200,
  });
};
