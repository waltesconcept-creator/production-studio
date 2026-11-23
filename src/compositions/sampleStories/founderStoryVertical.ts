import { StoryManifest } from '../../types/story';

export const FOUNDER_STORY_9X16: StoryManifest = {
  id: 'nvidia-founder-story-vertical',
  title: 'How NVIDIA Won the AI Gold Rush',
  description: 'Vertical 9:16 Shorts/Reels documentary story',
  fps: 30,
  width: 1080,
  height: 1920,
  aspectRatio: '9:16',
  theme: {
    primaryColor: '#070a0f',
    accentColor: '#76b900',
    textColor: '#ffffff',
    paperColor: '#f4ebd0',
    fontFamilyHeading: 'Impact, "Montserrat Black", sans-serif',
    fontFamilyBody: '"Chakra Petch", sans-serif',
  },
  scenes: [
    // Scene 1: The Hook (9:16)
    {
      id: 'vert-1',
      durationInFrames: 90,
      background: {
        type: 'dots',
        color: '#090c15',
        showCoordinates: true,
      },
      camera: {
        zoom: [1.0, 1.15],
      },
      headline: {
        text: 'HE BET EVERYTHING ON THIS CHIP',
        highlightWords: ['EVERYTHING', 'CHIP'],
        animation: 'spring-pop',
      },
      cutouts: [
        {
          src: '/assets/ai-chip.svg',
          pin: true,
          rotation: -4,
          x: 50,
          y: 48,
          scale: 1.1,
        },
      ],
      captions: [
        {
          id: 'vc1',
          startFrame: 5,
          endFrame: 45,
          text: 'He bet the entire company on one single chip.',
        },
        {
          id: 'vc2',
          startFrame: 48,
          endFrame: 85,
          text: 'Now it powers the entire artificial intelligence revolution.',
        },
      ],
      soundEffects: [
        { id: 'vsfx1', frame: 2, type: 'whoosh' },
        { id: 'vsfx2', frame: 25, type: 'pop' },
      ],
    },

    // Scene 2: The Magazine Feature (9:16)
    {
      id: 'vert-2',
      durationInFrames: 100,
      background: {
        type: 'paper-dark',
        color: '#0d0d12',
      },
      camera: {
        zoom: [1.02, 1.18],
        panY: [0, -40],
      },
      headline: {
        text: '30 DAYS FROM GOING BROKE',
        highlightWords: ['30', 'DAYS', 'BROKE'],
        animation: 'staggered-slide',
      },
      cutouts: [
        {
          src: '/assets/founder-portrait.svg',
          tape: true,
          rotation: 3,
          x: 50,
          y: 50,
          scale: 1.15,
        },
      ],
      captions: [
        {
          id: 'vc3',
          startFrame: 5,
          endFrame: 50,
          text: 'In 1996, they were thirty days from going completely broke.',
        },
        {
          id: 'vc4',
          startFrame: 55,
          endFrame: 95,
          text: 'Jensen made the ultimate gamble and rewritten history.',
        },
      ],
      soundEffects: [
        { id: 'vsfx3', frame: 5, type: 'paper-crinkle' },
        { id: 'vsfx4', frame: 35, type: 'marker' },
      ],
    },

    // Scene 3: The 3 Trillion Valuation (9:16)
    {
      id: 'vert-3',
      durationInFrames: 110,
      background: {
        type: 'blueprint',
        color: '#050914',
      },
      camera: {
        zoom: [1.0, 1.1],
      },
      headline: {
        text: 'FROM ZERO TO $3.2 TRILLION',
        highlightWords: ['ZERO', '$3.2', 'TRILLION'],
        animation: 'typewriter',
      },
      diagram: {
        type: 'barchart',
        items: [
          { label: '2016', value: 20 },
          { label: '2020', value: 300 },
          { label: '2024', value: 3200 },
        ],
      },
      captions: [
        {
          id: 'vc5',
          startFrame: 10,
          endFrame: 55,
          text: 'Today Nvidia is worth over three trillion dollars.',
        },
        {
          id: 'vc6',
          startFrame: 60,
          endFrame: 105,
          text: 'The biggest tech empire ever built by one founder.',
        },
      ],
      soundEffects: [
        { id: 'vsfx5', frame: 5, type: 'whoosh' },
        { id: 'vsfx6', frame: 50, type: 'bell' },
      ],
    },
  ],
};
