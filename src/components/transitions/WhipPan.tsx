import React from 'react';
import { interpolate, useCurrentFrame } from 'remotion';

export interface WhipPanProps {
  direction?: 'left' | 'right' | 'up' | 'down';
  durationInFrames?: number;
  children: React.ReactNode;
}

export const WhipPan: React.FC<WhipPanProps> = ({
  direction = 'left',
  durationInFrames = 15,
  children,
}) => {
  const frame = useCurrentFrame();

  const progress = interpolate(frame, [0, durationInFrames], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: (t) => Math.pow(t, 2),
  });

  const blurAmount = Math.sin(progress * Math.PI) * 24;

  let translateX = 0;
  let translateY = 0;

  if (direction === 'left') translateX = -progress * 100;
  if (direction === 'right') translateX = progress * 100;
  if (direction === 'up') translateY = -progress * 100;
  if (direction === 'down') translateY = progress * 100;

  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        transform: `translate(${translateX}%, ${translateY}%)`,
        filter: blurAmount > 1 ? `blur(${blurAmount}px)` : 'none',
      }}
    >
      {children}
    </div>
  );
};
