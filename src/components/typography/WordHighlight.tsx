import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';

export interface WordHighlightProps {
  children: React.ReactNode;
  delay?: number;
  bgColor?: string;
  textColor?: string;
  rotation?: number;
  scale?: number;
  style?: React.CSSProperties;
}

export const WordHighlight: React.FC<WordHighlightProps> = ({
  children,
  delay = 5,
  bgColor = '#ff3366',
  textColor = '#ffffff',
  rotation = -2.5,
  scale = 1.05,
  style = {},
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const spr = spring({
    frame: frame - delay,
    fps,
    config: { damping: 12, stiffness: 220 },
  });

  const animatedScale = interpolate(spr, [0, 1], [0.8, scale]);
  const animatedRot = interpolate(spr, [0, 1], [0, rotation]);

  return (
    <span
      style={{
        display: 'inline-block',
        backgroundColor: bgColor,
        color: textColor,
        padding: '0.1em 0.35em',
        borderRadius: '6px',
        transform: `scale(${animatedScale}) rotate(${animatedRot}deg)`,
        boxShadow: '0 6px 18px rgba(0,0,0,0.3)',
        margin: '0 0.1em',
        verticalAlign: 'baseline',
        ...style,
      }}
    >
      {children}
    </span>
  );
};
