/**
 * Gentle, polished UI sound effects synthesized programmatically.
 * Soft pops, light clicks, and sweet chimes — zero fighting thuds or harsh impacts.
 */

function generateWav(sampleRate: number, durationSec: number, sampleGenerator: (t: number) => number): string {
  const numSamples = Math.floor(sampleRate * durationSec);
  const buffer = new ArrayBuffer(44 + numSamples * 2);
  const view = new DataView(buffer);

  /* RIFF identifier */
  writeString(view, 0, 'RIFF');
  /* file length */
  view.setUint32(4, 36 + numSamples * 2, true);
  /* RIFF type */
  writeString(view, 8, 'WAVE');
  /* format chunk identifier */
  writeString(view, 12, 'fmt ');
  /* format chunk length */
  view.setUint32(16, 16, true);
  /* sample format (raw PCM) */
  view.setUint16(20, 1, true);
  /* channel count (1 = mono) */
  view.setUint16(22, 1, true);
  /* sample rate */
  view.setUint32(24, sampleRate, true);
  /* byte rate (sampleRate * 2) */
  view.setUint32(28, sampleRate * 2, true);
  /* block align */
  view.setUint16(32, 2, true);
  /* bits per sample */
  view.setUint16(34, 16, true);
  /* data chunk identifier */
  writeString(view, 36, 'data');
  /* data chunk length */
  view.setUint32(40, numSamples * 2, true);

  for (let i = 0; i < numSamples; i++) {
    const t = i / sampleRate;
    let s = sampleGenerator(t);
    s = Math.max(-1, Math.min(1, s));
    view.setInt16(44 + i * 2, s < 0 ? s * 0x8000 : s * 0x7fff, true);
  }

  let binary = '';
  const bytes = new Uint8Array(buffer);
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return 'data:audio/wav;base64,' + (typeof btoa !== 'undefined' ? btoa(binary) : Buffer.from(binary, 'binary').toString('base64'));
}

function writeString(view: DataView, offset: number, string: string) {
  for (let i = 0; i < string.length; i++) {
    view.setUint8(offset + i, string.charCodeAt(i));
  }
}

export const BUILTIN_SFX: Record<string, string> = {
  // Gentle, soft bubble pop (delicate UI pop)
  pop: generateWav(22050, 0.08, (t) => {
    const env = Math.exp(-t * 70);
    const freq = 1200 - t * 4000;
    return Math.sin(2 * Math.PI * Math.max(200, freq) * t) * env * 0.4;
  }),

  // Soft keypad click / tap
  click: generateWav(22050, 0.04, (t) => {
    const env = Math.exp(-t * 120);
    return Math.sin(2 * Math.PI * 2200 * t) * env * 0.35;
  }),

  // Sweet gentle notification chime
  chime: generateWav(22050, 0.35, (t) => {
    const env = Math.exp(-t * 12);
    const tone1 = Math.sin(2 * Math.PI * 1318.51 * t); // E6
    const tone2 = Math.sin(2 * Math.PI * 1760 * t);    // A6
    return (tone1 * 0.6 + tone2 * 0.4) * env * 0.35;
  }),

  // Light, airy soft swoosh
  softSwoosh: generateWav(22050, 0.22, (t) => {
    const env = Math.sin((t / 0.22) * Math.PI);
    const freq = 300 + (t / 0.22) * 600;
    return Math.sin(2 * Math.PI * freq * t) * Math.pow(env, 2) * 0.25;
  }),
  whoosh: generateWav(22050, 0.22, (t) => {
    const env = Math.sin((t / 0.22) * Math.PI);
    const freq = 300 + (t / 0.22) * 600;
    return Math.sin(2 * Math.PI * freq * t) * Math.pow(env, 2) * 0.25;
  }),
  bell: generateWav(22050, 0.35, (t) => {
    const env = Math.exp(-t * 12);
    const tone1 = Math.sin(2 * Math.PI * 1318.51 * t);
    const tone2 = Math.sin(2 * Math.PI * 1760 * t);
    return (tone1 * 0.6 + tone2 * 0.4) * env * 0.35;
  }),
  stamp: generateWav(22050, 0.08, (t) => {
    const env = Math.exp(-t * 70);
    const freq = 1200 - t * 4000;
    return Math.sin(2 * Math.PI * Math.max(200, freq) * t) * env * 0.4;
  }),
  typewriter: generateWav(22050, 0.04, (t) => {
    const env = Math.exp(-t * 120);
    return Math.sin(2 * Math.PI * 2200 * t) * env * 0.35;
  }),
};

export function getSoundEffectUri(type: string, customUri?: string): string {
  if (customUri) return customUri;
  return BUILTIN_SFX[type] || BUILTIN_SFX.pop;
}
