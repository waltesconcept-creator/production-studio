const path = require('path');
const fs = require('fs');
const { execSync } = require('child_process');

/**
 * Movie Assembler & Remotion Production Bridge
 */
class MovieAssembler {
  /**
   * Generates neural voiceover narration and word-level timestamps.
   */
  static generateVoiceover(fullScript, voicePreset = 'documentary-deep') {
    const audioOut = path.resolve(__dirname, '../public/audio/studio-active-voiceover.mp3');
    const manifestPath = path.resolve(__dirname, '../public/audio/studio-active-voiceover-manifest.json');

    const sanitizedScript = fullScript.replace(/"/g, '\\"').replace(/\n/g, ' ');
    const cmd = `python scripts/generate-voiceover.py --text "${sanitizedScript}" --preset ${voicePreset} --output "public/audio/studio-active-voiceover.mp3"`;

    try {
      execSync(cmd, { stdio: 'pipe' });
      if (fs.existsSync(manifestPath)) {
        const data = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
        return {
          audioPath: '/audio/studio-active-voiceover.mp3',
          captions: data.captions || [],
          totalDurationFrames: data.totalDurationFrames || 180
        };
      }
    } catch (err) {
      console.warn('[MovieAssembler] Voiceover synthesis note:', err.message);
    }

    return {
      audioPath: '/audio/active-voiceover.mp3',
      captions: [],
      totalDurationFrames: 180
    };
  }

  /**
   * Builds the Remotion StoryManifest from shots, scenes, and narration.
   */
  static buildManifest(projectData, voiceData) {
    const { story = {}, shots = [], theme = {} } = projectData || {};
    const aspect = story?.aspectRatio || '16:9';
    const isVertical = aspect === '9:16';
    const width = isVertical ? 1080 : 1920;
    const height = isVertical ? 1920 : 1080;

    const brandTheme = {
      primaryColor: theme.primaryColor || '#0a0d14',
      accentColor: theme.accentColor || '#ff5500',
      textColor: theme.textColor || '#ffffff',
      paperColor: theme.paperColor || '#f4ebd0',
      fontFamilyHeading: 'Impact, "Montserrat Black", sans-serif',
      fontFamilyBody: '"Chakra Petch", sans-serif'
    };

    // Distribute captions among scenes if available
    const captions = voiceData.captions || [];
    const totalScenes = Math.max(1, shots.length);
    const captionsPerScene = Math.max(1, Math.floor(captions.length / totalScenes));

    const remotionScenes = shots.map((shot, idx) => {
      const sceneDuration = shot.suggestedDurationFrames || 120;
      const sceneCaptions = captions.slice(idx * captionsPerScene, (idx + 1) * captionsPerScene);

      // Transitions
      const transitions = ['whip-pan', 'paper-tear', 'film-flash', 'fade'];
      const chosenTransition = transitions[idx % transitions.length];

      return {
        id: shot.code || `scene-${idx + 1}`,
        title: shot.sceneTitle || `Shot ${idx + 1}`,
        durationInFrames: sceneDuration,
        transition: idx > 0 ? chosenTransition : 'none',
        transitionDuration: 15,
        background: {
          type: (idx % 2 === 0 ? 'grid' : 'dots'),
          showCoordinates: true,
          showGrain: true,
          color: brandTheme.primaryColor
        },
        camera: {
          zoom: [1.0, 1.08],
          tilt: [0, -1],
          panX: [0, 10],
          shakeIntensity: 0.8
        },
        headline: {
          text: (shot.sceneTitle || `SCENE 0${idx + 1}`).toUpperCase(),
          highlightWords: [(shot.character || 'AI').toUpperCase()],
          animation: 'staggered-slide',
          subtitle: shot.framing
        },
        cutouts: (shot.characterSheetRef || shot.sceneSheetRef) ? [
          {
            src: (shot.characterSheetRef || shot.sceneSheetRef).replace(/^public\//, '/'),
            scale: 0.85,
            x: 0,
            y: 0,
            polaroid: true
          }
        ] : [],
        captions: sceneCaptions,
        soundEffects: [
          { id: `sfx-whoosh-${idx}`, frame: 2, type: 'whoosh', volume: 0.7 },
          { id: `sfx-pop-${idx}`, frame: 20, type: 'pop', volume: 0.5 }
        ]
      };
    });

    const manifest = {
      id: `ai-studio-${Date.now()}`,
      title: story.title || 'AI Studio Production',
      description: story.synopsis || 'Automated multi-agent documentary production',
      fps: 30,
      width,
      height,
      aspectRatio: aspect,
      musicTrack: {
        src: '/audio/music/documentary-pulse.wav',
        volume: 0.30,
        duckVolume: 0.08
      },
      voiceoverTrack: {
        src: voiceData.audioPath || '/audio/active-voiceover.mp3',
        volume: 1.0
      },
      theme: brandTheme,
      scenes: remotionScenes
    };

    return manifest;
  }

  /**
   * Writes the manifest to activeStory.ts so Remotion Studio and CLI can render it.
   */
  static writeToRemotion(manifest) {
    const targetFile = path.resolve(__dirname, '../src/compositions/sampleStories/activeStory.ts');
    const content = `import { StoryManifest } from '../../types/story';\n\nexport const ACTIVE_STORY: StoryManifest = ${JSON.stringify(manifest, null, 2)};\n`;
    fs.writeFileSync(targetFile, content, 'utf8');
    return targetFile;
  }

  /**
   * Triggers the Remotion render CLI command to compile the final video.
   */
  static renderFinalVideo(outputPath = 'out/ai-studio-master.mp4') {
    const absOut = path.resolve(__dirname, '..', outputPath);
    const outDir = path.dirname(absOut);
    if (!fs.existsSync(outDir)) {
      fs.mkdirSync(outDir, { recursive: true });
    }

    const cmd = `npx remotion render src/index.ts ActiveStory "${outputPath}"`;
    try {
      execSync(cmd, { stdio: 'pipe' });
      return {
        success: fs.existsSync(absOut),
        outputPath,
        fileSize: fs.existsSync(absOut) ? fs.statSync(absOut).size : 0
      };
    } catch (err) {
      console.error('[MovieAssembler] Render failed:', err.message);
      return {
        success: false,
        error: err.message
      };
    }
  }
}

module.exports = MovieAssembler;
