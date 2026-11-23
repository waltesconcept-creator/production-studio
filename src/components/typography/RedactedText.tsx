import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';

export interface RedactedTextProps {
  children: React.ReactNode;
  delay?: number;
  durationInFrames?: number;
  color?: string; // default black marker #111111
  mode?: 'cover' | 'reveal'; // 'cover' draws black bar over; 'reveal' scratches/slides away
  style?: React.CSSProperties;
}

export const RedactedText: React.FC<RedactedTextProps> = ({
  children,
  delay = 15,
  durationInFrames = 20,
  color = '#121212',
  mode = 'cover',
  style = {},
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const spr = spring({
    frame: frame - delay,
    fps,
    config: { damping: 15, stiffness: 180 },
  });

  const width = mode === 'cover'
    ? interpolate(spr, [0, 1], [0, 104])
    : interpolate(spr, [0, 1], [104, 0]);

  return (
    <span
      style={{
        position: 'relative',
        display: 'inline-block',
        ...style,
      }}
    >
      <span style={{ position: 'relative', zIndex: 1 }}>{children}</span>
      <span
        style={{
          position: 'absolute',
          left: '-2%',
          top: '-10%',
          width: `${width}%`,
          height: '120%',
          backgroundColor: color,
          borderRadius: '2px',
          zIndex: 3,
          boxShadow: '0 1px 3px rgba(0,0,0,0.6)',
        }}
      />
    </span>
  );
};
