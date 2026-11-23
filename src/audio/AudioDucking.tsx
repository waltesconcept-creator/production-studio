import React from 'react';
import { Audio, staticFile, useCurrentFrame } from 'remotion';
import { CaptionSegment } from '../types/story';

function resolveAudioSrc(src?: string): string | undefined {
  if (!src) return undefined;
  if (src.startsWith('http://') || src.startsWith('https://') || src.startsWith('data:')) {
    return src;
  }
  const clean = src.startsWith('/') ? src.slice(1) : src;
  try {
    return staticFile(clean);
  } catch {
    return src;
  }
}

export interface AudioDuckingProps {
  musicSrc?: string;
  voiceoverSrc?: string;
  captions?: CaptionSegment[];
  baseMusicVolume?: number;
  duckedMusicVolume?: number;
  voiceoverVolume?: number;
}

export const AudioDucking: React.FC<AudioDuckingProps> = ({
  musicSrc,
  voiceoverSrc,
  captions = [],
  baseMusicVolume = 0.35,
  duckedMusicVolume = 0.08,
  voiceoverVolume = 1.0,
}) => {
  const resolvedMusic = resolveAudioSrc(musicSrc);
  const resolvedVoice = resolveAudioSrc(voiceoverSrc);

  return (
    <>
      {resolvedMusic && (
        <Audio
          src={resolvedMusic}
          loop
          volume={(f) => {
            let narratingNow = false;
            for (const cap of captions) {
              if (f >= cap.startFrame - 10 && f <= cap.endFrame + 10) {
                narratingNow = true;
                break;
              }
            }
            return narratingNow ? duckedMusicVolume : baseMusicVolume;
          }}
        />
      )}
      {resolvedVoice && (
        <Audio
          src={resolvedVoice}
          volume={voiceoverVolume}
        />
      )}
    </>
  );
};

