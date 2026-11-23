const express = require('express');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { execSync } = require('child_process');

const { extractVideoFrames } = require('./videoExtractor');
const PromptEngine = require('./promptEngine');
const MovieAssembler = require('./movieAssembler');
const GoogleAIBridge = require('./googleAiBridge');
const AIMediaEngine = require('./aiMediaEngine');
const JobManager = require('./jobManager');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3030;

// Enable CORS and JSON parsing
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Static file hosting (No-cache headers to ensure instant mobile updates)
app.use(express.static(path.resolve(__dirname, 'public'), {
  setHeaders: (res, filePath) => {
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');
  }
}));
app.use('/assets', express.static(path.resolve(__dirname, '../public/assets')));
app.use('/audio', express.static(path.resolve(__dirname, '../public/audio')));
app.use('/out', express.static(path.resolve(__dirname, '../out')));

// Storage configuration for uploads
const uploadDir = path.resolve(__dirname, '../public/assets/uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const cleanName = path.basename(file.originalname, ext).replace(/[^a-zA-Z0-9_-]/g, '_');
    cb(null, `${cleanName}_${Date.now()}${ext}`);
  }
});
const upload = multer({ storage });

// Project state file path
const PROJECT_FILE = path.resolve(__dirname, '../public/assets/project_manifest.json');

function loadProjectState() {
  if (fs.existsSync(PROJECT_FILE)) {
    try {
      return JSON.parse(fs.readFileSync(PROJECT_FILE, 'utf8'));
    } catch (e) {
      console.warn('Could not parse project file, using default');
    }
  }

  return {
    id: 'studio-project-01',
    story: {
      title: 'The Silent Architect',
      synopsis: 'A visionary designer discovers a hidden frequency in urban architecture that can reconstruct abandoned cityscapes overnight.',
      genre: 'Cinematic Sci-Fi Documentary',
      aspectRatio: '16:9',
      stylePreset: 'vox',
      beats: [
        {
          id: 'beat-1',
          title: 'The Blueprint Mystery',
          description: 'Dr. Elena Voss uncovers an encoded signal hidden inside 1920s skyscraper blueprints.',
          narration: 'Deep beneath the archives of Manhattan, Dr. Elena Voss uncovered an acoustic signature that defied modern physics.',
          durationSec: 4
        },
        {
          id: 'beat-2',
          title: 'The Resonance Test',
          description: 'Elena activates the frequency transmitter at midnight amidst the concrete canyons of the city.',
          narration: 'At midnight, she calibrated the resonance transmitter. If her calculations were correct, the steel frames would begin to sing.',
          durationSec: 5
        },
        {
          id: 'beat-3',
          title: 'The City Awakens',
          description: 'Luminous harmonic patterns ripple across the glass facades, realigning the urban grid into a living organism.',
          narration: 'Within seconds, golden harmonic waves pulsed across the skyline, proving the city was never just steel and stone — it was alive.',
          durationSec: 5
        }
      ]
    },
    characters: [
      {
        id: 'char-1',
        name: 'Dr. Elena Voss',
        role: 'Visionary Acoustic Architect',
        traits: 'Focused sharp gaze, dark hair tied back, intense expression, subtle silver earring',
        clothing: 'Tailored dark charcoal trench coat with high collar and technical brass compass pin',
        refImage: '/assets/frances_cutout.png',
        sheetPath: '/assets/characters/frances_test_sheet.png'
      }
    ],
    scenes: [
      {
        id: 'scene-1',
        location: 'Neo-Manhattan Archives',
        timeOfDay: 'Midnight Amber & Moonlight Cyan',
        atmosphere: 'Dense volumetric dust motes, dramatic warm lamp spotlights, towering brass filing cabinets',
        architecture: 'Art Deco Retro-Futurism',
        refImage: '/assets/manhattan_1940s.jpg',
        sheetPath: '/assets/scenes/madison_ave_test_sheet.png'
      }
    ],
    shots: [],
    assembledCut: null
  };
}

function saveProjectState(state) {
  fs.writeFileSync(PROJECT_FILE, JSON.stringify(state, null, 2), 'utf8');
}

// ==========================================
// API ROUTES
// ==========================================

// 0. API Key Settings & Status
app.get('/api/settings/api-key', (req, res) => {
  const key = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY || '';
  const isConfigured = Boolean(key && key.trim().length > 5);
  const masked = isConfigured ? `${key.substring(0, 6)}...${key.substring(key.length - 4)}` : '';
  const providers = AIMediaEngine.getProviders();

  res.json({
    success: true,
    isConfigured,
    maskedKey: masked,
    providers: {
      google: {
        name: 'Google Gemini & Nano Banana 2',
        configured: providers.google.configured,
        masked: providers.google.configured ? `${providers.google.key.substring(0, 6)}...${providers.google.key.slice(-4)}` : null,
        capabilities: ['Story Brain Screenplay', 'Nano Banana 2 (Pay-As-You-Go)']
      },
      fal: {
        name: 'Fal.ai (Flux Pro & Kling Video)',
        configured: providers.fal.configured,
        masked: providers.fal.configured ? `${providers.fal.key.substring(0, 6)}...${providers.fal.key.slice(-4)}` : null,
        capabilities: ['Flux 1.1 Pro InstantID', 'Kling 1.5 Video', 'Luma Ray 2']
      },
      replicate: {
        name: 'Replicate (Flux & Minimax Video)',
        configured: providers.replicate.configured,
        masked: providers.replicate.configured ? `${providers.replicate.key.substring(0, 6)}...${providers.replicate.key.slice(-4)}` : null,
        capabilities: ['Flux 1.1 Pro', 'Minimax Hailuo Video', 'Wan 2.1 Video']
      }
    }
  });
});

app.post('/api/settings/api-key', (req, res) => {
  const { apiKey, provider = 'gemini' } = req.body;
  if (!apiKey || apiKey.trim().length === 0) {
    return res.status(400).json({ success: false, error: 'API key cannot be empty' });
  }

  const cleanKey = apiKey.trim();
  const envVarName = provider === 'fal' ? 'FAL_KEY' : provider === 'replicate' ? 'REPLICATE_API_TOKEN' : 'GEMINI_API_KEY';
  process.env[envVarName] = cleanKey;

  // Persist to .env file in workspace root
  const envPath = path.resolve(__dirname, '../.env');
  let envContent = '';
  if (fs.existsSync(envPath)) {
    envContent = fs.readFileSync(envPath, 'utf8');
  }
  const regex = new RegExp(`^${envVarName}=.*$`, 'm');
  if (regex.test(envContent)) {
    envContent = envContent.replace(regex, `${envVarName}=${cleanKey}`);
  } else {
    envContent += `\n${envVarName}=${cleanKey}\n`;
  }
  fs.writeFileSync(envPath, envContent.trim() + '\n', 'utf8');

  res.json({ success: true, message: `${envVarName} configured and saved to .env!` });
});

// 0b. Async Job Queue Engine Endpoints
app.get('/api/jobs/:id', (req, res) => {
  const job = JobManager.getJob(req.params.id);
  if (!job) return res.status(404).json({ success: false, error: 'Job not found' });
  res.json({ success: true, job });
});

app.post('/api/jobs/generate-character', async (req, res) => {
  const { id, name, role, traits, clothing, refImage } = req.body;
  const charId = id || `char-${Date.now()}`;
  const outFilename = `${charId}_sheet.png`;
  const outPath = path.resolve(__dirname, `../public/assets/characters/${outFilename}`);

  const sheetSpec = PromptEngine.buildCharacterSheetPrompt({
    name,
    role,
    traits,
    clothing,
    referenceDesc: refImage ? `Visual seed from ${path.basename(refImage)}` : ''
  });

  let absRef = null;
  if (refImage) {
    absRef = path.resolve(__dirname, '..', refImage.replace(/^\//, 'public/'));
    if (!fs.existsSync(absRef)) {
      absRef = path.resolve(__dirname, '../public', refImage.replace(/^\//, ''));
    }
  }

  const job = JobManager.createJob('character_generation', { charId, name, role });

  // Execute asynchronously
  (async () => {
    try {
      JobManager.updateJob(job.id, { status: 'processing', stage: 'Dispatching to Cloud Generative AI Engine...', progress: 20 });
      const genResult = await AIMediaEngine.generateCharacterImage({
        prompt: sheetSpec.prompt,
        outputFilePath: outPath,
        refImagePath: absRef,
        characterMeta: { name, role, traits, clothing }
      });

      JobManager.updateJob(job.id, {
        status: 'completed',
        progress: 100,
        stage: 'Generation Complete',
        result: {
          character: {
            id: charId,
            name,
            role,
            traits,
            clothing,
            refImage,
            generatedVia: genResult.provider,
            sheetPath: `/assets/characters/${outFilename}`,
            nanoBanana2Prompt: sheetSpec
          }
        }
      });
    } catch (err) {
      console.error('[JobManager] Character generation failed:', err.message);
      JobManager.updateJob(job.id, {
        status: 'failed',
        error: err.message,
        stage: 'Generation Failed'
      });
    }
  })();

  res.json({ success: true, jobId: job.id });
});

app.post('/api/jobs/generate-scene', async (req, res) => {
  const { id, location, timeOfDay, atmosphere, architecture, refImage } = req.body;
  const sceneId = id || `scene-${Date.now()}`;
  const outFilename = `${sceneId}_sheet.png`;
  const outPath = path.resolve(__dirname, `../public/assets/scenes/${outFilename}`);

  const sheetSpec = PromptEngine.buildSceneSheetPrompt({
    location,
    timeOfDay,
    atmosphere,
    architecturalStyle: architecture
  });

  let absRef = null;
  if (refImage) {
    absRef = path.resolve(__dirname, '..', refImage.replace(/^\//, 'public/'));
    if (!fs.existsSync(absRef)) {
      absRef = path.resolve(__dirname, '../public', refImage.replace(/^\//, ''));
    }
  }

  const job = JobManager.createJob('scene_generation', { sceneId, location });

  (async () => {
    try {
      JobManager.updateJob(job.id, { status: 'processing', stage: 'Synthesizing scene environment & lighting...', progress: 20 });
      const genResult = await AIMediaEngine.generateSceneImage({
        prompt: sheetSpec.prompt,
        outputFilePath: outPath,
        refImagePath: absRef,
        sceneMeta: { location, timeOfDay, atmosphere, architecture }
      });

      JobManager.updateJob(job.id, {
        status: 'completed',
        progress: 100,
        stage: 'Scene Render Complete',
        result: {
          scene: {
            id: sceneId,
            location,
            timeOfDay,
            atmosphere,
            architecture,
            refImage,
            generatedVia: genResult.provider,
            sheetPath: `/assets/scenes/${outFilename}`,
            nanoBanana2Prompt: sheetSpec
          }
        }
      });
    } catch (err) {
      console.error('[JobManager] Scene generation failed:', err.message);
      JobManager.updateJob(job.id, {
        status: 'failed',
        error: err.message,
        stage: 'Generation Failed'
      });
    }
  })();

  res.json({ success: true, jobId: job.id });
});

app.post('/api/jobs/generate-video/:shotId', async (req, res) => {
  const { shotId } = req.params;
  const { prompt, seedImagePath, durationSec } = req.body;
  const outFilename = `${shotId}.mp4`;
  const outPath = path.resolve(__dirname, `../public/assets/shots/${outFilename}`);

  let absSeed = null;
  if (seedImagePath) {
    absSeed = path.resolve(__dirname, '..', seedImagePath.replace(/^\//, 'public/'));
    if (!fs.existsSync(absSeed)) {
      absSeed = path.resolve(__dirname, '../public', seedImagePath.replace(/^\//, ''));
    }
  }

  const job = JobManager.createJob('video_generation', { shotId, prompt });

  (async () => {
    try {
      JobManager.updateJob(job.id, { status: 'processing', stage: 'Submitting video to Cloud Diffusion GPU...', progress: 15 });
      const genResult = await AIMediaEngine.generateVideoClip({
        prompt,
        outputFilePath: outPath,
        seedImagePath: absSeed,
        durationSec: durationSec || 5,
        onProgress: (status, logs) => {
          JobManager.updateJob(job.id, { stage: `Video Denoising: ${status}`, progress: 50 });
        }
      });

      JobManager.updateJob(job.id, {
        status: 'completed',
        progress: 100,
        stage: 'Video Render Complete',
        result: {
          videoUrl: `/assets/shots/${outFilename}`,
          provider: genResult.provider
        }
      });
    } catch (err) {
      console.error('[JobManager] Video generation failed:', err.message);
      JobManager.updateJob(job.id, {
        status: 'failed',
        error: err.message,
        stage: 'Video Generation Failed'
      });
    }
  })();

  res.json({ success: true, jobId: job.id });
});

// 1. Get Project State
app.get('/api/project', (req, res) => {
  const state = loadProjectState();
  res.json({ success: true, project: state });
});

// 2. Save Project State
app.post('/api/project/save', (req, res) => {
  const state = req.body;
  saveProjectState(state);
  res.json({ success: true, message: 'Project state saved successfully.' });
});

// 3. File Upload Handler (Image or Video)
app.post('/api/upload', upload.single('file'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ success: false, error: 'No file uploaded.' });
  }

  const filename = req.file.filename;
  const filePath = req.file.path;
  const isVideo = /\.(mp4|mov|webm|mkv)$/i.test(filename);
  const relativeUrl = `/assets/uploads/${filename}`;

  let extractedFrames = [];
  if (isVideo) {
    try {
      extractedFrames = extractVideoFrames(filePath, uploadDir, [1.0, 3.0, 5.0, 7.0]);
    } catch (e) {
      console.warn('Video frame extraction note:', e.message);
    }
  }

  res.json({
    success: true,
    file: {
      filename,
      relativeUrl,
      isVideo,
      extractedFrames
    }
  });
});

// 4. Story Brain: Analyze & Deconstruct Story
app.post('/api/story/analyze', async (req, res) => {
  const { title, synopsis, genre, aspectRatio, apiKey } = req.body;
  const activeKey = apiKey || process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY;
  let lastGeminiError = null;

  // 1. If real Gemini API key is available, call Google Gemini 2.5 Flash live!
  if (activeKey) {
    try {
      const geminiResult = await GoogleAIBridge.analyzeStory(title, synopsis, genre, activeKey);
      return res.json({
        success: true,
        source: 'Google Gemini 2.5 Flash (Live API)',
        story: {
          title: geminiResult.title || title || 'Untitled Production',
          synopsis: geminiResult.synopsis || synopsis,
          genre: genre || 'Cinematic Narrative Brand Film',
          aspectRatio: aspectRatio || '16:9',
          beats: geminiResult.beats || []
        }
      });
    } catch (err) {
      console.warn('[Gemini API] Live analysis note, proceeding with built-in director fallback:', err.message);
      lastGeminiError = err.message;
    }
  }

  // 2. Built-in Director & Screenwriter Engine (Offline / Fallback)
  const isBrandFilm = /narrative|brand|movie|craft|jacket|storm|commercial/i.test(genre || '');
  const isNikeSprint = /sprint|olympic|athletic|runner/i.test(genre || '');

  let beats = [];

  if (isBrandFilm && !isNikeSprint) {
    // 4-Act Cinematic Movie Commercial (Craft vs. Cataclysm)
    const brandBeats = [
      {
        id: 'beat-1',
        title: 'Act I // The Obsessive Craft (The Workshop)',
        description: 'Inside a dimly lit industrial design atelier, a quiet, obsessive textile craftsman inspects the taped seams of an engineered waterproof storm jacket. Under a warm 2800K desk lamp, a single droplet of water is tested on the membrane, beading into a perfect sphere.',
        narration: "Perfection isn't engineered for fair weather. It is crafted in silence for the worst conditions on earth.",
        durationSec: 4
      },
      {
        id: 'beat-2',
        title: 'Act II // The Hand-Off (The Departure)',
        description: 'The craftsman zips the finished matte obsidian jacket onto the protagonist. A look of shared purpose. The protagonist turns toward the heavy warehouse doors, stepping out into the shadows.',
        narration: "Every heat-sealed seam. Every hydrophobic fiber. Built to ensure that nothing touches you.",
        durationSec: 3
      },
      {
        id: 'beat-3',
        title: 'Act III // The Deluge (The Cataclysm Impact)',
        description: 'Category-5 hurricane storm. Trees whip violently, debris flying through flooded streets like an apocalyptic disaster film. Torrential downpour crashes against the jacket, shatters into microscopic beads, and effortlessly slides off. The protagonist stands completely dry and calm.',
        narration: "When the sky fractures and the hurricane arrives... you don't seek shelter. You are the shelter.",
        durationSec: 4
      },
      {
        id: 'beat-4',
        title: 'Act IV // The Defiance (Running Through The Tempest)',
        description: 'The protagonist smiles faintly, looks down the flooded avenue, and breaks into an effortless, powerful jog through the torrential rain, splashing through deep puddles with total serenity and freedom.',
        narration: "You don't hide from the storm. You move straight through it.",
        durationSec: 4
      }
    ];

    const sentences = (synopsis || '').split(/(?<=[.!?])\s+/).filter(Boolean);
    if (sentences.length >= 2) {
      brandBeats.forEach((b, idx) => {
        if (sentences[idx]) {
          b.description = sentences[idx];
          b.narration = sentences[idx];
        }
      });
    }
    beats = brandBeats;
  } else if (isNikeSprint) {
    const nikeBeats = [
      {
        id: 'beat-1',
        title: '01 // The 5:00 AM Grind (The Solitary Struggle)',
        description: 'Dark, cold pre-dawn pavement. Athlete tying carbon spikes in driving rain. Steam rising from heaving chest.',
        narration: "They don't see the 5:00 AM alarms. The burning lungs. The doubts whispering in the dark.",
        durationSec: 3
      },
      {
        id: 'beat-2',
        title: '02 // The Wall of Resistance (The Breaking Point)',
        description: 'Extreme macro on dilated eyes and sweat beads. Muscles straining under maximum exertion against the storm.',
        narration: "Every muscle screams to quit. The voice in your head telling you it's impossible. Good.",
        durationSec: 3
      },
      {
        id: 'beat-3',
        title: '03 // The Explosive Surge (Raw Adrenaline)',
        description: 'Explosive acceleration. Water exploding off running spikes in 1000fps phantom slow-motion. Speed ramp into blur.',
        narration: "Because impossible isn't a boundary. It's an invitation.",
        durationSec: 4
      },
      {
        id: 'beat-4',
        title: '04 // The Manifesto Climax (Greatness Decided)',
        description: 'Hero silhouette standing proud under 10,000 watt stadium floodlights. Pouring rain, triumphant posture.',
        narration: "Don't ask if you have what it takes. Decide that nothing on earth can stop you.",
        durationSec: 4
      }
    ];

    const sentences = (synopsis || '').split(/(?<=[.!?])\s+/).filter(Boolean);
    if (sentences.length >= 2) {
      nikeBeats.forEach((b, idx) => {
        if (sentences[idx]) {
          b.description = sentences[idx];
          b.narration = sentences[idx];
        }
      });
    }
    beats = nikeBeats;
  } else {
    // Standard deconstruct
    const sentences = (synopsis || '').split(/(?<=[.!?])\s+/).filter(Boolean);
    const beatTitles = ['The Discovery / Cold Open', 'The Conflict / Turning Point', 'The Climax / Revelation', 'The Legacy'];
    const minBeats = Math.max(3, Math.min(5, sentences.length || 3));

    for (let i = 0; i < minBeats; i++) {
      const text = sentences[i] || `Key narrative sequence showing the progression of ${title || 'the story'}.`;
      beats.push({
        id: `beat-${i + 1}`,
        title: beatTitles[i] || `Beat ${i + 1}`,
        description: text,
        narration: text,
        durationSec: 4 + (i % 2)
      });
    }
  }

  res.json({
    success: true,
    source: 'Built-in Director Engine (Fallback)',
    geminiError: lastGeminiError,
    story: {
      title: title || (isBrandFilm ? 'THE IMPERVIOUS // CRAFT VS CATACLYSM' : 'Untitled Production'),
      synopsis,
      genre: genre || (isBrandFilm ? 'Cinematic Narrative Brand Film' : 'Cinematic Documentary'),
      aspectRatio: aspectRatio || '16:9',
      beats
    }
  });
});

// 5. Character Department: Generate Character Sheet
app.post('/api/character/generate', async (req, res) => {
  const { id, name, role, traits, clothing, refImage, apiKey } = req.body;
  const activeKey = apiKey || process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY;
  const charId = id || `char-${Date.now()}`;
  const outFilename = `${charId}_sheet.png`;
  const outPath = path.resolve(__dirname, `../public/assets/characters/${outFilename}`);

  // Build prompt for Google Nano Banana 2
  const sheetSpec = PromptEngine.buildCharacterSheetPrompt({
    name,
    role,
    traits,
    clothing,
    referenceDesc: refImage ? `Visual seed from ${path.basename(refImage)}` : ''
  });

  // Resolve reference image absolute path
  let absRef = null;
  if (refImage) {
    absRef = path.resolve(__dirname, '..', refImage.replace(/^\//, 'public/'));
    if (!fs.existsSync(absRef)) {
      absRef = path.resolve(__dirname, '../public', refImage.replace(/^\//, ''));
    }
  }

  let generatedVia = 'Google Nano Banana 2 / Imagen 3 (Live API)';

  // Live Gemini/Nano Banana 2 Generation
  if (activeKey) {
    try {
      await GoogleAIBridge.generateCharacterSheet(sheetSpec.prompt, outPath, absRef, activeKey);
    } catch (apiErr) {
      console.warn('[Imagen API] Live image generation failed:', apiErr.message);
      return res.status(400).json({
        success: false,
        error: 'GOOGLE_QUOTA_EXCEEDED',
        message: 'Google Nano Banana 2 API returned Quota Limit 0 (Free Tier). To generate real photorealistic character sheets, enable Pay-As-You-Go on your Google AI Studio account or provide a funded media provider key.',
        details: apiErr.message,
        prompt: sheetSpec.prompt
      });
    }
  } else {
    return res.status(400).json({
      success: false,
      error: 'MISSING_API_KEY',
      message: 'No Google API key configured for live image generation.'
    });
  }

  const character = {
    id: charId,
    name,
    role,
    traits,
    clothing,
    refImage,
    generatedVia,
    sheetPath: `/assets/characters/${outFilename}`,
    nanoBanana2Prompt: sheetSpec
  };

  res.json({
    success: true,
    character
  });
});

// 6. Scene Department: Generate Scene Sheet
app.post('/api/scene/generate', async (req, res) => {
  const { id, location, timeOfDay, atmosphere, architecture, refImage, apiKey } = req.body;
  const activeKey = apiKey || process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY;
  const sceneId = id || `scene-${Date.now()}`;
  const outFilename = `${sceneId}_sheet.png`;
  const outPath = path.resolve(__dirname, `../public/assets/scenes/${outFilename}`);

  const sheetSpec = PromptEngine.buildSceneSheetPrompt({
    location,
    timeOfDay,
    atmosphere,
    architecturalStyle: architecture
  });

  let absRef = null;
  if (refImage) {
    absRef = path.resolve(__dirname, '..', refImage.replace(/^\//, 'public/'));
    if (!fs.existsSync(absRef)) {
      absRef = path.resolve(__dirname, '../public', refImage.replace(/^\//, ''));
    }
  }

  let generatedVia = 'Google Nano Banana 2 / Imagen 3 (Live API)';

  if (activeKey) {
    try {
      await GoogleAIBridge.generateCharacterSheet(sheetSpec.prompt, outPath, absRef, activeKey);
    } catch (apiErr) {
      console.warn('[Scene API] Live scene generation failed:', apiErr.message);
      return res.status(400).json({
        success: false,
        error: 'GOOGLE_QUOTA_EXCEEDED',
        message: 'Google Nano Banana 2 image generation requires Pay-As-You-Go enabled in your Google AI Studio account (current Free Tier quota is 0).',
        details: apiErr.message,
        prompt: sheetSpec.prompt
      });
    }
  } else {
    return res.status(400).json({
      success: false,
      error: 'MISSING_API_KEY',
      message: 'No Google API key configured for live scene generation.'
    });
  }

  const scene = {
    id: sceneId,
    location,
    timeOfDay,
    atmosphere,
    architecture,
    refImage,
    generatedVia,
    sheetPath: `/assets/scenes/${outFilename}`,
    nanoBanana2Prompt: sheetSpec
  };

  res.json({
    success: true,
    scene
  });
});

// 7. Cinematography Desk: Generate Shot List & Google Flow Prompts
app.post('/api/director/shotlist', (req, res) => {
  const { beats, characters, scenes, genre } = req.body;

  const shotList = PromptEngine.generateGoogleFlowPrompts(beats || [], characters || [], scenes || [], genre || '');

  // Check for real rendered or uploaded MP4 footage
  shotList.forEach((shot, idx) => {
    const shotFilename = `shot_${idx + 1}.mp4`;
    const shotOutPath = path.resolve(__dirname, `../public/assets/shots/${shotFilename}`);

    if (fs.existsSync(shotOutPath)) {
      shot.videoClipUrl = `/assets/shots/${shotFilename}`;
      shot.status = 'ready';
    } else {
      shot.videoClipUrl = null;
      shot.status = 'pending_footage';
    }
  });

  res.json({
    success: true,
    shots: shotList
  });
});

// 8. Video Bit Upload / Replacement (e.g. from Google Flow)
app.post('/api/footage/upload/:shotId', upload.single('video'), (req, res) => {
  const { shotId } = req.params;
  if (!req.file) {
    return res.status(400).json({ success: false, error: 'No video uploaded.' });
  }

  const filename = req.file.filename;
  const relativeUrl = `/assets/uploads/${filename}`;

  res.json({
    success: true,
    shotId,
    videoUrl: relativeUrl
  });
});

// 9. Master Assembly: Generate Voiceover, Manifest & Timeline
app.post('/api/production/assemble', (req, res) => {
  const manifestPath = path.join(__dirname, '../public/assets/project_manifest.json');
  let currentProj = req.body?.project;
  if (!currentProj && fs.existsSync(manifestPath)) {
    try {
      currentProj = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
    } catch (e) {
      currentProj = {};
    }
  }
  const voicePreset = req.body?.voicePreset || 'documentary-deep';
  const shots = (currentProj && currentProj.shots) || [];
  const fullNarration = shots.map(s => s.narration || s.sceneTitle).filter(Boolean).join(' ');

  // 1. Generate Voiceover
  const voiceData = MovieAssembler.generateVoiceover(fullNarration, voicePreset);

  // 2. Build Remotion Manifest
  const manifest = MovieAssembler.buildManifest(currentProj || {}, voiceData);

  // 3. Write to activeStory.ts
  MovieAssembler.writeToRemotion(manifest);

  res.json({
    success: true,
    manifest,
    voiceoverUrl: voiceData.audioPath,
    totalDurationFrames: (manifest.scenes || []).reduce((acc, s) => acc + (s.durationInFrames || 90), 0)
  });
});

// 10. Master Render: Render Video via Remotion CLI
app.post('/api/production/render', (req, res) => {
  const renderResult = MovieAssembler.renderFinalVideo('out/ai-studio-master.mp4');

  if (renderResult.success) {
    res.json({
      success: true,
      videoUrl: '/out/ai-studio-master.mp4',
      fileSize: renderResult.fileSize
    });
  } else {
    res.status(500).json({
      success: false,
      error: renderResult.error || 'Render failed'
    });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`\n======================================================`);
  console.log(`🚀 GOOGLE FLOW & NANO BANANA 2 AI VIDEO STUDIO ONLINE`);
  console.log(`📡 Studio Dashboard: http://localhost:${PORT}`);
  console.log(`🎬 Workspace: ${path.resolve(__dirname, '..')}`);
  console.log(`======================================================\n`);
});
