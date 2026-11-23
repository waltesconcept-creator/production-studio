export type AspectRatio = '16:9' | '9:16';

export type AnimationType =
  | 'typewriter'
  | 'staggered-slide'
  | 'spring-pop'
  | 'blur-reveal';

export type BackgroundStyle =
  | 'grid'
  | 'blueprint'
  | 'dots'
  | 'paper-warm'
  | 'paper-dark'
  | 'gradient'
  | 'solid';

export interface SoundEffectTrigger {
  id: string;
  frame: number;
  type:
    | 'whoosh'
    | 'paper-crinkle'
    | 'typewriter'
    | 'camera-shutter'
    | 'pop'
    | 'tape-snap'
    | 'marker'
    | 'bell'
    | 'chime'
    | 'click'
    | 'softSwoosh'
    | 'stamp';
  volume?: number;
}

export interface WordTiming {
  word: string;
  startFrame: number;
  endFrame: number;
}

export interface CaptionSegment {
  id: string;
  startFrame: number;
  endFrame: number;
  startMs?: number;
  endMs?: number;
  text: string;
  words?: WordTiming[];
  speaker?: string;
}

export interface StatHighlight {
  label: string;
  value: number;
  prefix?: string;
  suffix?: string;
  durationInFrames?: number;
}

export interface StoryScene {
  id: string;
  title?: string;
  durationInFrames: number;
  transition?: 'whip-pan' | 'paper-tear' | 'film-flash' | 'slide' | 'fade' | 'none';
  transitionDuration?: number;
  background: {
    type: BackgroundStyle;
    color?: string;
    showGrain?: boolean;
    showCoordinates?: boolean;
  };
  camera?: {
    panX?: [number, number];
    panY?: [number, number];
    zoom?: [number, number];
    tilt?: [number, number];
    rotateX?: [number, number];
    rotateY?: [number, number];
    shakeIntensity?: number;
  };
  headline?: {
    text: string;
    highlightWords?: string[];
    animation?: AnimationType;
    subtitle?: string;
  };
  cutouts?: Array<{
    src: string;
    caption?: string;
    tape?: boolean;
    pin?: boolean;
    polaroid?: boolean;
    rotation?: number;
    depth?: number; // 1 = background, 2 = midground, 3 = foreground
    x?: number; // percentage
    y?: number;
    scale?: number;
  }>;
  newspaper?: {
    masthead: string;
    date: string;
    headline: string;
    subheadline?: string;
    columns: string[];
    highlightPhrase?: string;
    redactedPhrase?: string;
  };
  diagram?: {
    type: 'barchart' | 'timeline' | 'arrows' | 'flow';
    items: Array<{ label: string; value: number | string; detail?: string; color?: string }>;
  };
  tornHeader?: {
    title: string;
    subtitle?: string;
    color?: string;
    height?: string;
  };
  socialCard?: {
    handle: string;
    location?: string;
    postImageSrc: string;
    cutoutSrc: string;
    likes?: string;
    comments?: string;
    rotation?: number;
    width?: number;
  };
  chapterSticker?: {
    text: string;
    color?: string;
    textColor?: string;
    rotation?: number;
  };
  chromaticGlitch?: boolean;
  halftoneEffect?: boolean;
  captions?: CaptionSegment[];
  soundEffects?: SoundEffectTrigger[];
}

export interface StoryManifest {
  id: string;
  title: string;
  description: string;
  fps: number;
  width: number;
  height: number;
  aspectRatio: AspectRatio;
  musicTrack?: {
    src?: string;
    volume: number;
    duckVolume: number;
  };
  voiceoverTrack?: {
    src?: string;
    volume: number;
  };
  theme: {
    primaryColor: string;
    accentColor: string;
    textColor: string;
    paperColor: string;
    fontFamilyHeading: string;
    fontFamilyBody: string;
  };
  scenes: StoryScene[];
}
