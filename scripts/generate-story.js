/**
 * AI-Assisted Motion Graphics Storyboard Generator
 * 
 * Usage:
 *   node scripts/generate-story.js "How OpenAI built ChatGPT" --aspect 16:9 --style vox
 *   node scripts/generate-story.js "The Rise of Nvidia" --aspect 9:16 --style founder
 */

const fs = require('fs');
const path = require('path');

// Templates for different storytelling aesthetics
const TEMPLATES = {
  vox: {
    primaryColor: '#0a0d14',
    accentColor: '#38bdf8',
    textColor: '#ffffff',
    paperColor: '#f4ebd0',
    fontFamilyHeading: 'Impact, "Montserrat Black", sans-serif',
    fontFamilyBody: '"Chakra Petch", sans-serif',
    bgType: 'grid',
  },
  founder: {
    primaryColor: '#08090d',
    accentColor: '#eab308',
    textColor: '#ffffff',
    paperColor: '#faf6ea',
    fontFamilyHeading: 'Impact, "Bebas Neue", sans-serif',
    fontFamilyBody: '"Roboto", sans-serif',
    bgType: 'paper-dark',
  },
  investigative: {
    primaryColor: '#0f0f12',
    accentColor: '#f43f5e',
    textColor: '#ffffff',
    paperColor: '#ece5cf',
    fontFamilyHeading: '"Playfair Display", serif',
    fontFamilyBody: '"Courier New", monospace',
    bgType: 'paper-dark',
  },
};

function generateStoryboard(topic, options = {}) {
  const aspect = options.aspect || '16:9';
  const styleKey = options.style || 'vox';
  const theme = TEMPLATES[styleKey] || TEMPLATES.vox;

  console.log(`🎬 Directing story for: "${topic}" (${aspect}, style: ${styleKey})`);

  const manifest = {
    id: `story-${Date.now()}`,
    title: topic,
    description: `Automated motion graphics storyboard for ${topic}`,
    fps: 30,
    width: aspect === '9:16' ? 1080 : 1920,
    height: aspect === '9:16' ? 1920 : 1080,
    aspectRatio: aspect,
    theme,
    scenes: [
      {
        id: 'scene-1-cold-open',
        title: 'The Cold Open Hook',
        durationInFrames: 90,
        background: {
          type: theme.bgType,
          showCoordinates: true,
          showGrain: true,
        },
        camera: {
          zoom: [1.0, 1.12],
          tilt: [0, -1],
          shakeIntensity: 1.2,
        },
        headline: {
          text: topic.toUpperCase(),
          highlightWords: topic.toUpperCase().split(' ').slice(0, 2),
          animation: 'staggered-slide',
        },
        captions: [
          {
            id: 'cap-1',
            startFrame: 5,
            endFrame: 45,
            text: `This is the untold story of ${topic}.`,
          },
          {
            id: 'cap-2',
            startFrame: 50,
            endFrame: 85,
            text: 'And how it fundamentally changed the world forever.',
          },
        ],
        soundEffects: [
          { id: 'sfx-1', frame: 2, type: 'whoosh' },
          { id: 'sfx-2', frame: 25, type: 'pop' },
        ],
      },
      {
        id: 'scene-2-the-crisis',
        title: 'The Investigation / Crisis',
        durationInFrames: 110,
        background: {
          type: 'paper-dark',
          showGrain: true,
        },
        camera: {
          zoom: [1.02, 1.15],
          panY: [0, -15],
        },
        newspaper: {
          masthead: 'THE GLOBAL INQUIRER',
          date: 'SPECIAL REPORT',
          headline: 'THE MOMENT EVERYTHING CHANGED',
          subheadline: 'Inside the high-stakes decision that shocked the market',
          columns: [
            'Industry insiders recalled the tense closed-door meeting where the future hung in the balance. With everything on the line, traditional models were abandoned.',
            'What followed would alter the course of modern business history and spark an international race for technical supremacy.',
          ],
          highlightPhrase: 'With everything on the line, traditional models were abandoned.',
          redactedPhrase: 'CONFIDENTIAL EXECUTIVE ARCHIVE',
        },
        captions: [
          {
            id: 'cap-3',
            startFrame: 5,
            endFrame: 55,
            text: 'Behind closed doors, a critical turning point emerged.',
          },
          {
            id: 'cap-4',
            startFrame: 60,
            endFrame: 105,
            text: 'The stakes could not have been higher.',
          },
        ],
        soundEffects: [
          { id: 'sfx-3', frame: 5, type: 'paper-crinkle' },
          { id: 'sfx-4', frame: 35, type: 'stamp' },
          { id: 'sfx-5', frame: 65, type: 'marker' },
        ],
      },
      {
        id: 'scene-3-data-breakthrough',
        title: 'The Breakthrough',
        durationInFrames: 100,
        background: {
          type: 'blueprint',
        },
        camera: {
          zoom: [1.0, 1.1],
        },
        headline: {
          text: 'THE EXPONENTIAL SURGE',
          highlightWords: ['EXPONENTIAL', 'SURGE'],
          animation: 'spring-pop',
        },
        diagram: {
          type: 'barchart',
          items: [
            { label: 'Phase 1', value: 25 },
            { label: 'Phase 2', value: 120 },
            { label: 'Phase 3', value: 450 },
            { label: 'Phase 4', value: 1800 },
          ],
        },
        captions: [
          {
            id: 'cap-5',
            startFrame: 5,
            endFrame: 50,
            text: 'Then came an unprecedented wave of growth.',
          },
          {
            id: 'cap-6',
            startFrame: 55,
            endFrame: 95,
            text: 'Scaling beyond what anyone thought was possible.',
          },
        ],
        soundEffects: [
          { id: 'sfx-6', frame: 5, type: 'whoosh' },
          { id: 'sfx-7', frame: 45, type: 'bell' },
        ],
      },
    ],
  };

  const outputDir = path.resolve(__dirname, '../generated');
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  const safeFilename = topic.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-');
  const outputPath = path.join(outputDir, `${safeFilename}-${aspect.replace(':', 'x')}.json`);

  fs.writeFileSync(outputPath, JSON.stringify(manifest, null, 2));
  console.log(`✅ Generated Storyboard Manifest written to: ${outputPath}`);
  return manifest;
}

// CLI argument parsing
const args = process.argv.slice(2);
const topicArg = args[0] || 'The Rise and Fall of Tech Giants';
let aspectArg = '16:9';
let styleArg = 'vox';

for (let i = 1; i < args.length; i++) {
  if (args[i] === '--aspect' && args[i + 1]) aspectArg = args[i + 1];
  if (args[i] === '--style' && args[i + 1]) styleArg = args[i + 1];
}

generateStoryboard(topicArg, { aspect: aspectArg, style: styleArg });
