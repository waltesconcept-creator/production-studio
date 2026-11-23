import { StoryManifest } from '../../types/story';

export const FOUNDER_STORY_16X9: StoryManifest = {
  id: 'nvidia-founder-story',
  title: 'The $100 Billion Bet: How NVIDIA Conquered AI',
  description: 'A Vox/MagnatesMedia style documentary breakdown of Jensen Huang and Nvidia',
  fps: 30,
  width: 1920,
  height: 1080,
  aspectRatio: '16:9',
  theme: {
    primaryColor: '#0a0d14',
    accentColor: '#76b900', // Nvidia Green
    textColor: '#ffffff',
    paperColor: '#f4ebd0',
    fontFamilyHeading: 'Impact, "Montserrat Black", sans-serif',
    fontFamilyBody: '"Chakra Petch", sans-serif',
  },
  scenes: [
    // Scene 1: The Cold Open / Hook
    {
      id: 'scene-1-hook',
      title: 'The Cold Open',
      durationInFrames: 110,
      background: {
        type: 'grid',
        color: '#080a0f',
        showCoordinates: true,
      },
      camera: {
        panX: [0, 0],
        panY: [0, -20],
        zoom: [1.0, 1.12],
        tilt: [0, -1],
        shakeIntensity: 1.5,
      },
      headline: {
        text: 'IN 1993, THREE ENGINEERS MADE A $100 BILLION BET',
        highlightWords: ['1993', '$100', 'BILLION'],
        animation: 'staggered-slide',
      },
      cutouts: [
        {
          src: '/assets/founder-portrait.svg',
          caption: 'Jensen Huang (Founder)',
          pin: true,
          tape: false,
          rotation: -3,
          depth: 2,
          x: 50,
          y: 72,
          scale: 0.85,
        },
      ],
      captions: [
        {
          id: 'c1',
          startFrame: 10,
          endFrame: 55,
          text: 'In 1993, three engineers met at a Denny’s diner.',
        },
        {
          id: 'c2',
          startFrame: 60,
          endFrame: 105,
          text: 'They decided to build the future of computing.',
        },
      ],
      soundEffects: [
        { id: 'sfx1', frame: 2, type: 'whoosh' },
        { id: 'sfx2', frame: 12, type: 'tape-snap' },
        { id: 'sfx3', frame: 50, type: 'camera-shutter' },
      ],
    },

    // Scene 2: The Newspaper Headline & Crisis
    {
      id: 'scene-2-newspaper',
      title: 'The Crisis',
      durationInFrames: 130,
      background: {
        type: 'paper-dark',
        color: '#121214',
        showGrain: true,
      },
      camera: {
        zoom: [1.0, 1.15],
        panX: [0, 15],
        tilt: [-1, 1],
      },
      newspaper: {
        masthead: 'SILICON VALLEY CHRONICLE',
        date: 'JUNE 14, 1996',
        headline: 'GRAPHICS STARTUP ON BRINK OF BANKRUPTCY',
        subheadline: 'Cash reserves dwindle as early chip architecture fails to win market adoption',
        columns: [
          'Founders faced an existential crisis today as initial design contracts were abruptly cancelled. With payroll running out in thirty days, insolvency loomed.',
          'Jensen Huang made a daring gamble: scrap existing microcode, lay off half the company, and bet everything on a revolutionary programmable chip.',
        ],
        highlightPhrase: 'With payroll running out in thirty days, insolvency loomed.',
        redactedPhrase: 'EMERGENCY JAPANESE CAPITAL INFUSION',
      },
      captions: [
        {
          id: 'c3',
          startFrame: 5,
          endFrame: 65,
          text: 'Within three years, the company was thirty days from bankruptcy.',
        },
        {
          id: 'c4',
          startFrame: 70,
          endFrame: 125,
          text: 'Their first two graphics chips were commercial disasters.',
        },
      ],
      soundEffects: [
        { id: 'sfx4', frame: 5, type: 'paper-crinkle' },
        { id: 'sfx5', frame: 35, type: 'stamp' },
        { id: 'sfx6', frame: 65, type: 'marker' },
      ],
    },

    // Scene 3: The Secret AI Revolution / The Microchip
    {
      id: 'scene-3-chip',
      title: 'The CUDA & AI Pivot',
      durationInFrames: 120,
      background: {
        type: 'blueprint',
        color: '#030712',
      },
      camera: {
        zoom: [1.05, 1.25],
        panY: [0, -30],
        rotateX: [5, 12],
      },
      headline: {
        text: 'THEN CAME THE CUDA BREAKTHROUGH',
        highlightWords: ['CUDA', 'BREAKTHROUGH'],
        animation: 'spring-pop',
      },
      cutouts: [
        {
          src: '/assets/ai-chip.svg',
          caption: 'H100 Tensor Core GPU',
          tape: true,
          rotation: 4,
          depth: 3,
          x: 50,
          y: 60,
          scale: 1.1,
        },
      ],
      captions: [
        {
          id: 'c5',
          startFrame: 10,
          endFrame: 60,
          text: 'In 2006, Jensen spent half a billion dollars on CUDA.',
        },
        {
          id: 'c6',
          startFrame: 65,
          endFrame: 115,
          text: 'Wall Street hated it. But AI researchers fell in love.',
        },
      ],
      soundEffects: [
        { id: 'sfx7', frame: 5, type: 'whoosh' },
        { id: 'sfx8', frame: 30, type: 'pop' },
        { id: 'sfx9', frame: 80, type: 'bell' },
      ],
    },

    // Scene 4: The Exploding Market Cap (Bar Chart & Counter)
    {
      id: 'scene-4-data',
      title: 'Market Capitalization Explosion',
      durationInFrames: 140,
      background: {
        type: 'grid',
        color: '#07090e',
      },
      camera: {
        zoom: [1.0, 1.08],
        panX: [-10, 10],
      },
      headline: {
        text: 'MARKET VALUATION: $3,000,000,000,000',
        highlightWords: ['$3,000,000,000,000'],
        animation: 'blur-reveal',
      },
      diagram: {
        type: 'barchart',
        items: [
          { label: '2014', value: 10, detail: '$10 Billion' },
          { label: '2018', value: 140, detail: '$140 Billion' },
          { label: '2022', value: 360, detail: '$360 Billion' },
          { label: '2024', value: 3200, detail: '$3.2 Trillion' },
        ],
      },
      captions: [
        {
          id: 'c7',
          startFrame: 10,
          endFrame: 65,
          text: 'Today, virtually every frontier AI model runs on their hardware.',
        },
        {
          id: 'c8',
          startFrame: 70,
          endFrame: 130,
          text: 'Transforming a gaming card maker into a 3 trillion dollar titan.',
        },
      ],
      soundEffects: [
        { id: 'sfx10', frame: 5, type: 'whoosh' },
        { id: 'sfx11', frame: 45, type: 'pop' },
        { id: 'sfx12', frame: 90, type: 'bell' },
      ],
    },

    // Scene 5: Magazine Finale
    {
      id: 'scene-5-magazine',
      title: 'The Legend',
      durationInFrames: 120,
      background: {
        type: 'paper-dark',
        color: '#09090b',
        showGrain: true,
      },
      camera: {
        zoom: [1.0, 1.1],
        tilt: [-1, 0.5],
      },
      cutouts: [
        {
          src: '/assets/founder-portrait.svg',
          caption: 'Man of the Year',
          pin: true,
          rotation: -2,
          depth: 2,
          x: 50,
          y: 50,
          scale: 1.0,
        },
      ],
      captions: [
        {
          id: 'c9',
          startFrame: 10,
          endFrame: 55,
          text: 'He gambled the company not once, but three times.',
        },
        {
          id: 'c10',
          startFrame: 60,
          endFrame: 110,
          text: 'And every single time, the future agreed with him.',
        },
      ],
      soundEffects: [
        { id: 'sfx13', frame: 5, type: 'paper-crinkle' },
        { id: 'sfx14', frame: 40, type: 'camera-shutter' },
      ],
    },
  ],
};
