#!/usr/bin/env node
/**
 * Master One-Click Production Studio Orchestrator
 * 
 * Takes a topic or script -> generates voiceover -> fetches archival photos & cutouts
 * -> assembles Remotion composition in Black, Orange, and White -> ready to preview or render!
 * 
 * Usage:
 *   node scripts/produce.js "How Stripe Beat PayPal" --aspect 16:9
 *   node scripts/produce.js "The Rise of Nvidia" --aspect 9:16 --render
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Parse CLI flags robustly
let rawTokens = [];
for (const raw of process.argv.slice(2)) {
  const parts = raw.match(/(?:[^\s"']+|"[^"]*"|'[^']*')+/g) || [raw];
  rawTokens.push(...parts);
}

let topic = 'How Stripe Revolutionized Online Payments';
let aspect = '16:9';
let voicePreset = 'documentary-deep';
let style = 'mohi'; // 'mohi', 'rami', 'documentary', 'vox'
let doRender = false;

const nonFlagTokens = [];
for (let i = 0; i < rawTokens.length; i++) {
  const arg = rawTokens[i].replace(/^["']|["']$/g, '').trim();
  if (arg === '--aspect' && rawTokens[i + 1]) {
    aspect = rawTokens[++i].replace(/^["']|["']$/g, '').trim();
  } else if (arg === '--voice' && rawTokens[i + 1]) {
    voicePreset = rawTokens[++i].replace(/^["']|["']$/g, '').trim();
  } else if (arg === '--style' && rawTokens[i + 1]) {
    style = rawTokens[++i].replace(/^["']|["']$/g, '').trim().toLowerCase();
  } else if (arg === '--render') {
    doRender = true;
  } else if (!arg.startsWith('--') && arg.length > 0) {
    nonFlagTokens.push(arg);
  }
}

if (nonFlagTokens.length > 0) {
  topic = nonFlagTokens.join(' ');
}

const isVertical = aspect === '9:16';
const width = isVertical ? 1080 : 1920;
const height = isVertical ? 1920 : 1080;

console.log('\n================================================================');
console.log(`🎬 MASTER PRODUCTION ENGINE: "${topic}"`);
console.log(`🎨 Brand Identity: Matte Black (#08080a) | Electric Orange (#ff5500) | Pure White (#ffffff)`);
console.log(`📐 Aspect Ratio: ${aspect} (${width}x${height}) | 🎙️ Voice: ${voicePreset} | 🎭 Style: ${style.toUpperCase()}`);
console.log('================================================================\n');

// Step 1: Generate Script & Narration Sentences
console.log('📝 STEP 1: Directing documentary script & scene breakdown...');

const scenesContent = [
  {
    title: 'The Cold Open Hook',
    headline: topic.toUpperCase(),
    speech: `This is the untold story of ${topic}. A daring high-stakes gamble that rewritten the rules of modern business.`,
    bgType: isVertical ? 'dots' : 'grid',
    duration: 110,
    sfx: [{ frame: 2, type: 'whoosh' }, { frame: 30, type: 'pop' }]
  },
  {
    title: 'The Crisis & Conflict',
    headline: 'THE MOMENT EVERYTHING HUNG IN THE BALANCE',
    speech: `Before the breakthrough, the founders were running out of time and capital. Traditional gatekeepers said it was impossible.`,
    bgType: 'paper-dark',
    newspaperHeadline: 'STARTUP DISRUPTS LEGACY MONOPOLY',
    duration: 130,
    sfx: [{ frame: 5, type: 'paper-crinkle' }, { frame: 35, type: 'stamp' }, { frame: 70, type: 'marker' }]
  },
  {
    title: 'The Technological Breakthrough',
    headline: 'THE ARCHITECTURAL SHIFT',
    speech: `Then came a radical architectural pivot. An elegant solution that cut through decades of legacy complexity.`,
    bgType: 'blueprint',
    duration: 120,
    sfx: [{ frame: 5, type: 'whoosh' }, { frame: 40, type: 'bell' }]
  },
  {
    title: 'The Trillion Dollar Climax',
    headline: 'EXPONENTIAL DOMINANCE',
    speech: `Today, the company powers the foundation of the modern digital economy, scaling beyond what anyone thought was possible.`,
    bgType: isVertical ? 'dots' : 'grid',
    duration: 130,
    chart: [
      { label: 'Phase 1', value: 20 },
      { label: 'Phase 2', value: 180 },
      { label: 'Phase 3', value: 550 },
      { label: 'Phase 4', value: 1400, color: '#ff5500' }
    ],
    sfx: [{ frame: 5, type: 'whoosh' }, { frame: 50, type: 'bell' }]
  }
];

const fullScript = scenesContent.map(s => s.speech).join(' ');

// Step 2: Generate Free Neural Voiceover
console.log('\n🎙️ STEP 2: Synthesizing neural voiceover & word timestamps...');
const voiceOutput = path.resolve(__dirname, '../public/audio/active-voiceover.mp3');
const voiceManifestPath = path.resolve(__dirname, '../public/audio/active-voiceover-manifest.json');

try {
  execSync(
    `python scripts/generate-voiceover.py --text "${fullScript.replace(/"/g, '\\"')}" --preset ${voicePreset} --output "public/audio/active-voiceover.mp3"`,
    { stdio: 'inherit' }
  );
} catch (e) {
  console.log('⚠️ Notice: Proceeding with default timing fallback.');
}

let timedCaptions = [];
if (fs.existsSync(voiceManifestPath)) {
  try {
    const vData = JSON.parse(fs.readFileSync(voiceManifestPath, 'utf8'));
    timedCaptions = vData.captions || [];
  } catch (err) {
    console.log('⚠️ Could not parse voice manifest:', err.message);
  }
}

// Step 3: Automatically Fetch Archival Assets & Cutouts
console.log('\n🔍 STEP 3: Sourcing archival imagery & transparent PNG cutouts...');
let entityQuery = topic.replace(/how|why|the|of|beat|saved|revolutionized|invented|rise|fall/gi, ' ').replace(/[^a-zA-Z0-9\s]/g, '').trim();
entityQuery = entityQuery.split(/\s+/)[0] || 'Business';
try {
  execSync(`python scripts/fetch-assets.py "${entityQuery}" --limit 3`, { stdio: 'inherit' });
} catch (e) {
  console.log('⚠️ Asset fetcher note: continuing with vector defaults.');
}

// Check downloaded assets
const downloadsDir = path.resolve(__dirname, '../public/assets/downloads');
let assetList = [];
if (fs.existsSync(downloadsDir)) {
  const files = fs.readdirSync(downloadsDir).filter(f => f.endsWith('.jpg') || f.endsWith('.png'));
  assetList = files.map(f => `/assets/downloads/${f}`);
}
if (assetList.length === 0) {
  assetList = ['/assets/founder-portrait.svg', '/assets/ai-chip.svg', '/assets/vintage-photo.svg'];
}

// Step 4: Assemble Remotion StoryManifest with Black, Orange & White Palette
console.log('\n⚡ STEP 4: Assembling Remotion composition in Black, Orange, and White...');

const finalScenes = scenesContent.map((sc, i) => {
  const cap = timedCaptions[i] || {
    id: `c-${i}`,
    startFrame: 5,
    endFrame: sc.duration - 15,
    text: sc.speech
  };

  const sceneObj = {
    id: `scene-${i + 1}`,
    title: sc.title,
    durationInFrames: sc.duration,
    background: {
      type: sc.bgType,
      color: '#08080a', // Signature Black
      showCoordinates: true,
      showGrain: true
    },
    camera: {
      zoom: [1.0, 1.12],
      tilt: [0, i % 2 === 0 ? -1 : 1],
      shakeIntensity: 1.2
    },
    headline: {
      text: sc.headline,
      highlightWords: sc.headline.split(' ').slice(0, 2),
      animation: i % 2 === 0 ? 'staggered-slide' : 'spring-pop'
    },
    cutouts: [
      {
        src: assetList[i % assetList.length],
        pin: i === 0,
        tape: i > 0,
        rotation: i % 2 === 0 ? -3 : 4,
        x: 50,
        y: isVertical ? 50 : 62,
        scale: isVertical ? 1.05 : 0.95
      }
    ],
    captions: [cap],
    soundEffects: sc.sfx.map((s, sIdx) => ({ id: `sfx-${i}-${sIdx}`, frame: s.frame, type: s.type }))
  };

  if (sc.newspaperHeadline) {
    sceneObj.newspaper = {
      masthead: 'THE GLOBAL FINANCIAL INQUIRER',
      date: 'SPECIAL REPORT EDITION',
      headline: sc.newspaperHeadline,
      subheadline: 'How an agile challenger outpaced legacy institutions in record time',
      columns: [
        'Traditional institutional operators watched with growing concern today as adoption curves shifted rapidly toward the new platform.',
        'Industry analysts cite frictionless integration and ruthless customer focus as the primary drivers of this historic transformation.'
      ],
      highlightPhrase: 'frictionless integration and ruthless customer focus',
      redactedPhrase: 'EMERGENCY BOARD TRANSCRIPTS RESTRICTED'
    };
  }

  if (sc.chart) {
    sceneObj.diagram = {
      type: 'barchart',
      items: sc.chart
    };
  }

  return sceneObj;
});

// Style-Specific Polish & Archetype Customization
if (style === 'mohi') {
  // Style 1: @mohi.visuals (Torn Paper Header + 2.5D Social Media Card Pop-out)
  if (finalScenes[0]) {
    finalScenes[0].tornHeader = {
      title: topic.toUpperCase(),
      subtitle: 'UNAUTHORIZED CHRONICLE',
      color: '#ff5500',
      height: isVertical ? '26%' : '20%'
    };
    finalScenes[0].background.type = 'dots';
  }
  if (finalScenes[1]) {
    finalScenes[1].socialCard = {
      handle: entityQuery.toLowerCase(),
      location: 'Silicon Valley, CA',
      postImageSrc: assetList[1] || assetList[0],
      cutoutSrc: assetList[0],
      likes: '48,950',
      comments: '632',
      rotation: -3.5,
      width: isVertical ? 480 : 420
    };
    delete finalScenes[1].newspaper;
  }
  if (finalScenes[2]) {
    finalScenes[2].chapterSticker = {
      text: 'Three years later',
      color: '#ff5500',
      textColor: '#ffffff',
      rotation: -4
    };
  }
} else if (style === 'rami') {
  // Style 2: @rami.visualz (Chromatic Glitch + Halftone Raster + 3D Paper Perspective)
  if (finalScenes[0]) {
    finalScenes[0].chromaticGlitch = true;
    finalScenes[0].halftoneEffect = true;
    finalScenes[0].background.type = 'paper-warm';
    finalScenes[0].camera = {
      zoom: [1.0, 1.14],
      tilt: [4, -2],
      rotateX: [12, 4],
      rotateY: [-8, 2],
      shakeIntensity: 1.5
    };
  }
  if (finalScenes[1]) {
    finalScenes[1].chromaticGlitch = true;
  }
  if (finalScenes[2]) {
    finalScenes[2].chapterSticker = {
      text: 'The Turning Point',
      color: '#ff5500',
      textColor: '#ffffff',
      rotation: -3
    };
  }
} else if (style === 'documentary') {
  // Style 3: Archival History & Netflix Framing
  if (finalScenes[0]) {
    finalScenes[0].background.type = 'paper-dark';
  }
  if (finalScenes[2]) {
    finalScenes[2].chapterSticker = {
      text: 'Three years later',
      color: '#c59b27',
      textColor: '#ffffff',
      rotation: -4.5
    };
  }
}

const totalFrames = finalScenes.reduce((sum, s) => sum + s.durationInFrames, 0);

const activeStoryCode = `import { StoryManifest } from '../../types/story';

export const ACTIVE_STORY: StoryManifest = {
  id: 'active-production-story',
  title: ${JSON.stringify(topic)},
  description: 'AI-assisted documentary storytelling using Black, Orange, and White brand palette',
  fps: 30,
  width: ${width},
  height: ${height},
  aspectRatio: '${aspect}',
  musicTrack: {
    src: '/audio/music/documentary-pulse.wav',
    volume: 0.35,
    duckVolume: 0.08,
  },
  voiceoverTrack: {
    src: '/audio/active-voiceover.mp3',
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
  scenes: ${JSON.stringify(finalScenes, null, 2)}
};
`;

const activeStoryPath = path.resolve(__dirname, '../src/compositions/sampleStories/activeStory.ts');
fs.writeFileSync(activeStoryPath, activeStoryCode, 'utf8');
console.log(`✅ Updated active story composition: ${activeStoryPath}`);
console.log(`⏱️ Total Runtime: ${(totalFrames / 30).toFixed(1)}s (${totalFrames} frames)`);

// Step 5: Optional Direct Render or Preview Instructions
if (doRender) {
  console.log('\n🚀 STEP 5: Rendering MP4 video directly with Remotion CLI...');
  const outVideo = path.resolve(__dirname, '../out/active-story.mp4');
  execSync(`npx remotion render src/index.ts ActiveStory "${outVideo}"`, { stdio: 'inherit' });
  console.log(`\n🎉 RENDER COMPLETE! Output video: ${outVideo}`);
} else {
  console.log('\n================================================================');
  console.log('🎉 PRODUCTION PIPELINE COMPLETE!');
  console.log('👉 To preview live in browser:  npm run dev');
  console.log('👉 To render final MP4 video:   npm run render:active');
  console.log('================================================================\n');
}
