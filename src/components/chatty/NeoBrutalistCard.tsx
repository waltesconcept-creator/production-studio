import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';

export interface NeoBrutalistCardProps {
  children?: React.ReactNode;
  bg?: string;
  borderColor?: string;
  shadowColor?: string;
  shadowOffset?: number;
  borderRadius?: number;
  rotation?: number;
  delay?: number;
  width?: number | string;
  padding?: number | string;
  style?: React.CSSProperties;
  className?: string;
}

export const NeoBrutalistCard: React.FC<NeoBrutalistCardProps> = ({
  children,
  bg = '#FFFFFF',
  borderColor = '#09090B',
  shadowColor = '#09090B',
  shadowOffset = 6,
  borderRadius = 20,
  rotation = 0,
  delay = 0,
  width = 'auto',
  padding = '24px',
  style = {},
  className = '',
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const entrance = spring({
    frame: frame - delay,
    fps,
    config: {
      damping: 12,
      mass: 0.7,
      stiffness: 120,
    },
  });

  const translateY = interpolate(entrance, [0, 1], [60, 0]);
  const scale = interpolate(entrance, [0, 1], [0.85, 1]);
  const opacity = interpolate(entrance, [0, 0.4, 1], [0, 1, 1]);

  if (frame < delay) return null;

  return (
    <div
      className={className}
      style={{
        backgroundColor: bg,
        border: `3.5px solid ${borderColor}`,
        borderRadius,
        boxShadow: `${shadowOffset}px ${shadowOffset}px 0px ${shadowColor}`,
        width,
        padding,
        opacity,
        transform: `translateY(${translateY}px) scale(${scale}) rotate(${rotation}deg)`,
        transformOrigin: 'center center',
        boxSizing: 'border-box',
        ...style,
      }}
    >
      {children}
    </div>
  );
};
