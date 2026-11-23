import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';

export interface TextHighlighterProps {
  children: React.ReactNode;
  delay?: number;
  durationInFrames?: number;
  color?: string; // e.g. '#fffc44' (yellow), '#55ff99' (green), '#ff77aa' (pink), '#55ddff' (cyan)
  opacity?: number;
  heightPercent?: number; // how tall the highlight stroke is
  tiltDeg?: number;
  blendMode?: 'multiply' | 'darken' | 'normal' | 'screen';
  style?: React.CSSProperties;
}

export const TextHighlighter: React.FC<TextHighlighterProps> = ({
  children,
  delay = 10,
  durationInFrames = 25,
  color = '#ffe600',
  opacity = 0.85,
  heightPercent = 75,
  tiltDeg = -0.5,
  blendMode = 'multiply',
  style = {},
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const progress = interpolate(
    frame - delay,
    [0, durationInFrames],
    [0, 100],
    {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
    }
  );

  return (
    <span
      style={{
        position: 'relative',
        display: 'inline-block',
        whiteSpace: 'nowrap',
        ...style,
      }}
    >
      {/* The animated highlighter stroke behind the text */}
      <span
        style={{
          position: 'absolute',
          left: '-4px',
          bottom: '10%',
          width: `${progress}%`,
          maxWidth: 'calc(100% + 8px)',
          height: `${heightPercent}%`,
          backgroundColor: color,
          opacity: progress > 0 ? opacity : 0,
          mixBlendMode: blendMode,
          transform: `rotate(${tiltDeg}deg)`,
          transformOrigin: 'left center',
          borderRadius: '3px 8px 5px 2px',
          zIndex: 1,
          pointerEvents: 'none',
          boxShadow: `0 0 6px ${color}88`,
          transition: 'width 0.05s ease-out',
        }}
      />
      {/* The text itself rendered on top */}
      <span style={{ position: 'relative', zIndex: 2 }}>{children}</span>
    </span>
  );
};
