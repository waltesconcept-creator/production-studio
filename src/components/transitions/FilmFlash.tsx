import React from 'react';
import { interpolate, useCurrentFrame } from 'remotion';

export interface FilmFlashProps {
  durationInFrames?: number;
  color?: string; // '#ffffff' or '#ffeedd' (warm lens flare)
}

export const FilmFlash: React.FC<FilmFlashProps> = ({
  durationInFrames = 12,
  color = '#fff6e5',
}) => {
  const frame = useCurrentFrame();

  const opacity = interpolate(
    frame,
    [0, Math.floor(durationInFrames * 0.3), durationInFrames],
    [0, 0.95, 0],
    {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
    }
  );

  if (opacity <= 0.01) return null;

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        backgroundColor: color,
        opacity,
        pointerEvents: 'none',
        zIndex: 100,
        mixBlendMode: 'screen',
      }}
    />
  );
};
