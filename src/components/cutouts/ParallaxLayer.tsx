import React from 'react';
import { interpolate, useCurrentFrame } from 'remotion';

export interface ParallaxLayerProps {
  depth: number; // 0 (far background) to 1 (near foreground)
  speedX?: number;
  speedY?: number;
  children: React.ReactNode;
  style?: React.CSSProperties;
}

export const ParallaxLayer: React.FC<ParallaxLayerProps> = ({
  depth = 0.5,
  speedX = 0.5,
  speedY = 0.2,
  children,
  style = {},
}) => {
  const frame = useCurrentFrame();

  const translateX = Math.sin(frame * 0.02) * 20 * depth * speedX;
  const translateY = Math.cos(frame * 0.025) * 15 * depth * speedY;

  return (
    <div
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        transform: `translate3d(${translateX}px, ${translateY}px, 0)`,
        pointerEvents: 'none',
        ...style,
      }}
    >
      {children}
    </div>
  );
};
