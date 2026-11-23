import React from 'react';
import { useCurrentFrame } from 'remotion';

export interface FilmGrainOverlayProps {
  opacity?: number;
  blendMode?: 'overlay' | 'screen' | 'color-dodge' | 'soft-light';
  scanlines?: boolean;
}

export const FilmGrainOverlay: React.FC<FilmGrainOverlayProps> = ({
  opacity = 0.09,
  blendMode = 'overlay',
  scanlines = false,
}) => {
  const frame = useCurrentFrame();

  // Changing seed per frame creates authentic fluttering film grain
  const seed = (frame % 15) * 7 + 13;

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        pointerEvents: 'none',
        zIndex: 99,
        mixBlendMode: blendMode,
        opacity,
      }}
    >
      <svg width="100%" height="100%" style={{ position: 'absolute', inset: 0 }}>
        <filter id={`grain-filter-${seed}`}>
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.85"
            numOctaves="3"
            seed={seed}
            result="noise"
          />
          <feColorMatrix
            type="matrix"
            values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 1 0"
          />
        </filter>
        <rect
          width="100%"
          height="100%"
          filter={`url(#grain-filter-${seed})`}
          fill="#808080"
        />
      </svg>

      {/* Optional CRT / retro scanlines */}
      {scanlines && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backgroundImage: 'repeating-linear-gradient(to bottom, transparent, transparent 2px, rgba(0, 0, 0, 0.25) 2px, rgba(0, 0, 0, 0.25) 4px)',
            opacity: 0.35,
          }}
        />
      )}
    </div>
  );
};
