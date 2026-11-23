/**
 * Generates an atmospheric cinematic drone / pulse music loop in 16-bit PCM WAV.
 * Warm sub bass, gentle rhythm pulse, minor-key chord pads suitable for documentary storytelling.
 */

const fs = require('fs');
const path = require('path');

function generateCinematicTrack(sampleRate, durationSec) {
  const numSamples = Math.floor(sampleRate * durationSec);
  const buffer = Buffer.alloc(44 + numSamples * 2);

  // WAV Header
  buffer.write('RIFF', 0);
  buffer.writeUInt32LE(36 + numSamples * 2, 4);
  buffer.write('WAVE', 8);
  buffer.write('fmt ', 12);
  buffer.writeUInt32LE(16, 16);
  buffer.writeUInt16LE(1, 20); // PCM Mono
  buffer.writeUInt16LE(1, 22);
  buffer.writeUInt32LE(sampleRate, 24);
  buffer.writeUInt32LE(sampleRate * 2, 28);
  buffer.writeUInt16LE(2, 32);
  buffer.writeUInt16LE(16, 34);
  buffer.write('data', 36);
  buffer.writeUInt32LE(numSamples * 2, 40);

  // Frequencies for a dark, tension-building C-minor ambient bed (C2, G2, Eb3, Bb3)
  const fRoot = 65.41; // C2
  const fFifth = 98.00; // G2
  const fThird = 155.56; // Eb3
  const fSeventh = 233.08; // Bb3

  for (let i = 0; i < numSamples; i++) {
    const t = i / sampleRate;

    // Slow ambient swell
    const swell = 0.5 + 0.4 * Math.sin(2 * Math.PI * (t / 8.0));

    // Warm sub bass
    const bass = Math.sin(2 * Math.PI * fRoot * t) * 0.45;
    const fifth = Math.sin(2 * Math.PI * fFifth * t) * 0.25;

    // Atmospheric pads with slight detuning
    const pad1 = Math.sin(2 * Math.PI * fThird * t) * 0.15;
    const pad2 = Math.sin(2 * Math.PI * (fSeventh + Math.sin(t * 0.5) * 0.8) * t) * 0.12;

    // Ticking heartbeat / pulse every 0.6 seconds (100 BPM)
    const beatPhase = (t % 0.6) / 0.6;
    const kick = Math.exp(-beatPhase * 25) * Math.sin(2 * Math.PI * 55 * beatPhase) * 0.4;
    const tick = Math.exp(-beatPhase * 40) * (Math.random() * 2 - 1) * 0.08;

    let sample = (bass + fifth + pad1 + pad2) * swell + kick + tick;
    sample = Math.max(-1, Math.min(1, sample * 0.7));

    const int16 = sample < 0 ? Math.floor(sample * 0x8000) : Math.floor(sample * 0x7fff);
    buffer.writeInt16LE(int16, 44 + i * 2);
  }

  return buffer;
}

const outDir = path.resolve(__dirname, '../public/audio/music');
fs.mkdirSync(outDir, { recursive: true });

const trackBuffer = generateCinematicTrack(22050, 30.0); // 30-second seamless loop
const outPath = path.join(outDir, 'documentary-pulse.wav');
fs.writeFileSync(outPath, trackBuffer);

console.log(`✅ Generated 30s cinematic documentary soundtrack loop: ${outPath} (${(trackBuffer.length / 1024 / 1024).toFixed(2)} MB)`);
