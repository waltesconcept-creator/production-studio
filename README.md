# 🎬 Motion Graphics Production Studio

> An AI-assisted motion graphics and documentary video production studio built on **Remotion**, **React**, and **TypeScript**. Designed for high-velocity creation of business storytelling, founder profiles, historical investigations, and social media videos (Vox, Johnny Harris, MagnatesMedia, ColdFusion style).

---

## ⚡ Quick Start

```bash
# 1. Start the interactive Remotion Studio UI
npm run dev

# 2. Render Full 16:9 Landscape Documentary (1920x1080)
npm run render

# 3. Render Vertical 9:16 Shorts / Reels Story (1080x1920)
npm run render:vertical

# 4. Generate FREE Broadcast Voiceovers + Synchronized Captions
python scripts/generate-voiceover.py --text "In 1993, three engineers met at a Denny's diner..."

# 5. Fetch Archival Imagery & Transparent Cutouts Automatically
python scripts/fetch-assets.py "Steve Jobs" --mode all --limit 3

# 6. Generate a full story with the AI Director
node scripts/generate-story.js "The Secret History of the Microchip" --aspect 16:9 --style vox
```

---

## 🏛️ System Architecture & 10 Core Capabilities

```
Production Studio/
├── public/                      # Static assets & audio
│   └── assets/                  # Vector cutouts, SVG dies, portraits
├── scripts/
│   └── generate-story.js        # AI Script-to-Storyboard Director CLI
├── src/
│   ├── Root.tsx                 # Remotion composition registry
│   ├── index.ts                 # Studio entrypoint
│   ├── types/
│   │   └── story.ts             # Complete Storyboard & Scene schema
│   ├── audio/
│   │   ├── SoundEffect.tsx      # Frame-accurate SFX triggers & Director
│   │   ├── AudioDucking.tsx     # Voiceover-aware background music ducking
│   │   └── sfxLibrary.ts        # Built-in programmatic 16-bit PCM WAV synthesizers
│   ├── components/
│   │   ├── typography/          # Kinetic text, typewriter, highlighters, counters
│   │   ├── cutouts/             # Polaroids, 3D pins, scotch tape, collages, parallax
│   │   ├── layouts/             # Vintage newspapers, classified dossiers, magazines
│   │   ├── backgrounds/         # Technical grids, blueprints, dot matrices, film grain
│   │   ├── shapes/              # Hand-drawn arrows, highlighter loops, charts, timelines
│   │   ├── camera/              # 2.5D virtual camera rig with pan, zoom, tilt, & shake
│   │   ├── captions/            # Word-by-word karaoke captions, lower-third pills
│   │   └── transitions/         # Whip pans, paper tears, lens flashes
│   └── compositions/
│       ├── LandscapeStory.tsx   # 16:9 Documentary composition (1920x1080)
│       ├── VerticalStory.tsx    # 9:16 Social shorts composition (1080x1920)
│       └── ComponentShowcase.tsx# Tour of all 10 feature suites
```

---

## 📦 Component Library Guide

### 1. Animated Typography & Kinetic Text
```tsx
import { KineticText, TextHighlighter, RedactedText, AnimatedCounter, WordHighlight } from '@/components';

// Spring physics slide-up with masked words
<KineticText
  text="IN 1993, THREE ENGINEERS MADE A $100 BILLION BET"
  mode="staggered-slide" // 'staggered-slide' | 'typewriter' | 'spring-pop' | 'blur-reveal'
  highlightWords={['1993', '$100', 'BILLION']}
  highlightColor="#76b900"
  fontSize={56}
/>

// Animated highlighter pen sweep over text
<TextHighlighter delay={15} color="#ffe600">
  With payroll running out in thirty days
</TextHighlighter>

// CIA-style black marker redaction bar
<RedactedText delay={20}>
  CONFIDENTIAL MERGER TERMS
</RedactedText>

// Numeric counter with tabular easing
<AnimatedCounter value={3200000000000} prefix="$" suffix=" USD" fontSize={64} />
```

### 2. PNG Cutouts, Collages & 2.5D Parallax
```tsx
import { CutoutImage, PhotoCollage, ParallaxLayer } from '@/components';

<CutoutImage
  src="/assets/founder-portrait.svg"
  pin={true}               // Red 3D push pin
  tape={false}             // Scotch tape strip
  polaroid={true}          // Aged white polaroid border
  polaroidLabel="Jensen Huang"
  rotation={-4}
  depth={2}
  wobble={true}            // Subtle breathing wiggle
/>
```

### 3. Newspaper & Magazine Layouts
```tsx
import { NewspaperLayout, DocumentViewer, MagazineCover } from '@/components';

<NewspaperLayout
  masthead="THE FINANCIAL CHRONICLE"
  issueDate="JUNE 14, 1996"
  headline="GRAPHICS STARTUP ON BRINK OF BANKRUPTCY"
  subheadline="Cash reserves dwindle as early chip fails to win market"
  columns={[
    "Founders faced an existential crisis today as initial design contracts were cancelled...",
    "Jensen Huang made a daring gamble: scrap existing microcode and bet everything on CUDA..."
  ]}
  highlightText="scrap existing microcode and bet everything"
  redactedText="EMERGENCY CAPITAL INJECTION"
/>
```

### 4. Backgrounds & Textures
```tsx
import { StudioBackground, GridOverlay, FilmGrainOverlay } from '@/components';

<StudioBackground type="blueprint" /> {/* 'grid' | 'blueprint' | 'dots' | 'paper-warm' | 'paper-dark' */}
<GridOverlay label="SYS_RECORDING // 24FPS" />
<FilmGrainOverlay opacity={0.08} />
```

### 5. Animated Shapes & Diagrams
```tsx
import { AnimatedArrow, HandDrawnCircle, AnimatedBarChart, RoadmapTimeline } from '@/components';

// SVG path draw-in curving arrow
<AnimatedArrow startX={100} startY={200} endX={400} endY={100} color="#ff3366" delay={10} />

// Hand-drawn circular highlighter loop
<HandDrawnCircle cx={300} cy={200} rx={120} ry={70} color="#38bdf8" delay={15} />

// Documentary bar chart with animated counters
<AnimatedBarChart
  items={[
    { label: '2016', value: 20 },
    { label: '2020', value: 300 },
    { label: '2024', value: 3200, color: '#76b900' },
  ]}
/>
```

### 6. Smooth Camera Rig
```tsx
import { CameraRig } from '@/components';

<CameraRig
  panX={[0, 40]}
  panY={[0, -20]}
  zoom={[1.0, 1.15]}
  tilt={[-1, 1]}
  shake={true}
  shakeIntensity={1.5}
  durationInFrames={120}
>
  {/* Scene Content */}
</CameraRig>
```

### 7. Sound Design & Ducking
- **Built-in Procedural SFX**: The studio includes pure JavaScript synthesizers (`src/audio/sfxLibrary.ts`) that generate authentic WAV data URIs for whooshes, typewriter clicks, paper crinkles, camera shutters, and marker squeaks with zero external asset dependencies.
- **Audio Ducking (`AudioDucking.tsx`)**: Music volume automatically dips by 80% during narration segments and smoothly recovers during pauses.

---

## 🎙️ Free TTS Voiceover Pipeline (`generate-voiceover.py`)

No API keys, no subscription, and no character quotas required. Built on Microsoft Edge Neural TTS:

```bash
# Generate voiceover with documentary narrator
python scripts/generate-voiceover.py \
  --text "In 1993, three engineers met at a Denny's diner in Silicon Valley." \
  --preset documentary-deep \
  --output public/audio/voiceover.mp3
```

Available Voice Presets:
- `documentary-deep` (`en-US-ChristopherNeural`): Deep authoritative narrator (Vox, PBS Frontline, ColdFusion).
- `documentary-clear` (`en-US-EricNeural`): Modern crisp documentary narrator.
- `documentary-warm` (`en-US-JennyNeural`): Warm, engaging female voice.
- `british-narrator` (`en-GB-RyanNeural`): Authentic BBC-style historical voice.

This script outputs both the high-bitrate `.mp3` track and a `voiceover-manifest.json` containing exact sentence and word-level frame timestamps (`startFrame`, `endFrame`) mapped directly to Remotion's `AnimatedCaptions` for instant word-by-word karaoke synchronization!

---

## 🔍 Automated Archival & Cutout Asset Sourcing (`fetch-assets.py`)

Automatically search and download high-resolution public domain historical photos, newspaper prints, documents, and transparent PNG cutouts from **Wikimedia Commons** and **Wikipedia** with zero API keys:

```bash
# 1. Fetch biographical/historical photos
python scripts/fetch-assets.py "Jensen Huang" --mode archival --limit 3

# 2. Fetch transparent cutouts, logos, and hardware
python scripts/fetch-assets.py "Nvidia logo" --mode cutout --limit 2

# 3. Fetch historical event documents and photos
python scripts/fetch-assets.py "Wall Street Crash 1929" --mode all --limit 4
```

Downloaded images are saved directly to `public/assets/downloads/` with an auto-generated JSON manifest indicating image dimensions and whether alpha transparency is present.

### 8. Subtitles & Animated Captions
```tsx
import { AnimatedCaptions } from '@/components';

<AnimatedCaptions
  captions={[
    {
      id: 'c1',
      startFrame: 0,
      endFrame: 60,
      text: 'He bet the entire company on one single chip.',
    }
  ]}
  highlightColor="#fde047"
  pillBackground={true}
/>
```

---

## 🛠️ Multi-Tool Integration Ecosystem

| Tool | Purpose in Pipeline | How it Integrates |
|------|---------------------|-------------------|
| **Remotion** | **Core Video Engine** | React components, timeline orchestration, determinism, audio sync, MP4 rendering. |
| **Three.js** | 3D Environments | Use `@remotion/three` with `<ThreeCanvas>` inside any Remotion `<Sequence>`. |
| **GSAP** | Complex Easing | Sync GSAP timeline by driving `tl.seek(frame / fps)` inside Remotion. |
| **Blender** | High-end 3D Renders | Export transparent PNG/WebM render sequences; load into Remotion `<CutoutImage>`. |
| **FFmpeg** | Video Compositing | Embedded in `@remotion/renderer`; run `npx remotion ffmpeg` for post-processing. |
| **Manim** | Math/Equations | Render transparent `.mov` or `.png` sequence; drop into `<ParallaxLayer>`. |
| **MoviePy** | Python Scripting | Use Python to generate automated voiceovers / Whisper transcripts for Remotion. |

---

## 🚀 CLI Commands

```bash
# Preview studio in browser
npm run dev

# Export Landscape 16:9 (1920x1080)
npm run render

# Export Vertical 9:16 (1080x1920)
npm run render:vertical

# Export Component Showcase
npm run render:showcase

# Run AI Storyboard Director CLI
node scripts/generate-story.js "The Rise of Nvidia" --aspect 9:16 --style founder
```
