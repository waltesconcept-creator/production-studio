#!/usr/bin/env node
/**
 * Assembles the full narrative and activeStory.ts for "The Fall of WeWork"
 */

const fs = require('fs');
const path = require('path');

const manifestPath = path.resolve(__dirname, '../public/audio/wework-voiceover-manifest.json');
const manifestData = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
const caps = manifestData.captions;

function offsetCaptions(captionIndices, offset) {
  return captionIndices.map(idx => {
    const c = caps[idx];
    return {
      id: c.id,
      startFrame: Math.max(0, c.startFrame - offset),
      endFrame: Math.max(1, c.endFrame - offset),
      text: c.text,
      words: c.words ? c.words.map(w => ({
        word: w.word,
        startFrame: Math.max(0, w.startFrame - offset),
        endFrame: Math.max(1, w.endFrame - offset)
      })) : undefined
    };
  });
}

const scenes = [
  // Scene 1: The Cold Open Hook ($47B Unicorn)
  {
    id: 'scene-1',
    title: 'The $47B Valuation Peak',
    durationInFrames: 320,
    background: {
      type: 'dots',
      color: '#08080a',
      showCoordinates: true,
      showGrain: true,
    },
    tornHeader: {
      title: 'THE FALL OF WEWORK',
      subtitle: 'UNAUTHORIZED CHRONICLE',
      color: '#ff5500',
      height: '26%',
    },
    camera: {
      zoom: [1.0, 1.12],
      tilt: [2, -1],
      shakeIntensity: 1.2,
    },
    headline: {
      text: 'HOW A $47B TECH UNICORN CRASHED',
      highlightWords: ['$47B', 'CRASHED'],
      animation: 'staggered-slide',
    },
    cutouts: [
      {
        src: '/assets/downloads/adam-neumann-1.jpg',
        pin: true,
        tape: false,
        rotation: -2,
        x: 50,
        y: 64,
        scale: 1.1,
      },
    ],
    captions: offsetCaptions([0, 1], 0),
    soundEffects: [
      { id: 's1-1', frame: 2, type: 'whoosh' },
      { id: 's1-2', frame: 30, type: 'pop' },
    ],
  },

  // Scene 2: SoftBank & Charisma (2.5D Social Media Pop-Out Card)
  {
    id: 'scene-2',
    title: 'The Charisma & SoftBank Mirage',
    durationInFrames: 200,
    background: {
      type: 'dots',
      color: '#08080a',
      showCoordinates: true,
      showGrain: true,
    },
    camera: {
      zoom: [1.0, 1.10],
      tilt: [-1, 1],
      shakeIntensity: 1.1,
    },
    headline: {
      text: 'THE HOLLYWOOD TECH CHARISMA',
      highlightWords: ['HOLLYWOOD', 'CHARISMA'],
      animation: 'spring-pop',
    },
    socialCard: {
      handle: 'adamneumann',
      location: 'WeWork Global HQ • New York',
      postImageSrc: '/assets/downloads/wework-1.jpg',
      cutoutSrc: '/assets/downloads/adam-neumann-3.jpg',
      likes: '47,000,000,000',
      comments: '9,420',
      rotation: -3.5,
      width: 480,
    },
    captions: offsetCaptions([2], 320),
    soundEffects: [
      { id: 's2-1', frame: 10, type: 'camera-shutter' },
      { id: 's2-2', frame: 35, type: 'paper-crinkle' },
    ],
  },

  // Scene 3: The S-1 Filing Exposé & Media Crash (Wall Street Journal Newspaper)
  {
    id: 'scene-3',
    title: 'The Catastrophic S-1 Filing',
    durationInFrames: 325,
    background: {
      type: 'paper-dark',
      color: '#08080a',
      showCoordinates: true,
      showGrain: true,
    },
    camera: {
      zoom: [1.0, 1.14],
      tilt: [0, -1],
      shakeIntensity: 1.0,
    },
    chapterSticker: {
      text: 'Six weeks later',
      color: '#ff5500',
      textColor: '#ffffff',
      rotation: -4,
    },
    newspaper: {
      masthead: 'THE WALL STREET JOURNAL',
      date: 'AUGUST 2019 INVESTIGATION',
      headline: 'WEWORK S-1 REVEALS BILLION-DOLLAR CASH BURN',
      subheadline: 'Company burned $219,000 every single hour as IPO dreams collapse',
      columns: [
        'Investors were stunned as SEC filings revealed billions in operational losses alongside bizarre personal loans to founder Adam Neumann.',
        'Corporate governance experts labeled the dual-class voting structure and trademark licensing deals as unprecedented warning signs.',
      ],
      highlightPhrase: 'burned $219,000 every single hour',
      redactedPhrase: 'CONFIDENTIAL SOFTBANK BAILOUT MEMO',
    },
    captions: offsetCaptions([3, 4], 520),
    soundEffects: [
      { id: 's3-1', frame: 5, type: 'paper-crinkle' },
      { id: 's3-2', frame: 45, type: 'stamp' },
      { id: 's3-3', frame: 80, type: 'marker' },
    ],
  },

  // Scene 4: The Historic Valuation Collapse (Animated Bar Chart)
  {
    id: 'scene-4',
    title: 'The $40B Collapse',
    durationInFrames: 325,
    background: {
      type: 'dots',
      color: '#08080a',
      showCoordinates: true,
      showGrain: true,
    },
    camera: {
      zoom: [1.0, 1.12],
      tilt: [1, -1],
      shakeIntensity: 1.2,
    },
    headline: {
      text: 'FORTY BILLION DOLLARS EVAPORATED',
      highlightWords: ['FORTY', 'BILLION', 'EVAPORATED'],
      animation: 'spring-pop',
    },
    diagram: {
      type: 'barchart',
      items: [
        { label: '2018', value: 20 },
        { label: 'Jan 2019', value: 47, detail: 'Peak ($47B)', color: '#ffffff' },
        { label: 'Sep 2019', value: 10, detail: 'Crash ($10B)', color: '#94a3b8' },
        { label: 'Nov 2023', value: 1, detail: 'Chapter 11 ($0B)', color: '#ff5500' },
      ],
    },
    captions: offsetCaptions([5, 6], 845),
    soundEffects: [
      { id: 's4-1', frame: 3, type: 'whoosh' },
      { id: 's4-2', frame: 50, type: 'bell' },
    ],
  },
];

const totalFrames = scenes.reduce((sum, s) => sum + s.durationInFrames, 0);

const activeStoryCode = `import { StoryManifest } from '../../types/story';

export const ACTIVE_STORY: StoryManifest = {
  id: 'the-fall-of-wework',
  title: 'The Fall of WeWork',
  description: 'AI-assisted documentary storytelling on how WeWork collapsed from $47B to bankruptcy',
  fps: 30,
  width: 1080,
  height: 1920,
  aspectRatio: '9:16',
  musicTrack: {
    src: '/audio/music/documentary-pulse.wav',
    volume: 0.35,
    duckVolume: 0.08,
  },
  voiceoverTrack: {
    src: '/audio/wework-voiceover.mp3',
    volume: 1.0,
  },
  theme: {
    primaryColor: '#08080a',    // Matte Cinema Black
    accentColor: '#ff5500',     // Electric Signature Orange
    textColor: '#ffffff',       // Pure White
    paperColor: '#faf8f2',
    fontFamilyHeading: 'Impact, "Montserrat Black", sans-serif',
    fontFamilyBody: '"Chakra Petch", sans-serif',
  },
  scenes: ${JSON.stringify(scenes, null, 2)}
};
`;

const activeStoryPath = path.resolve(__dirname, '../src/compositions/sampleStories/activeStory.ts');
fs.writeFileSync(activeStoryPath, activeStoryCode, 'utf8');
console.log(`✅ Updated active story composition: ${activeStoryPath}`);
console.log(`⏱️ Total Runtime: ${(totalFrames / 30).toFixed(1)}s (${totalFrames} frames)`);
