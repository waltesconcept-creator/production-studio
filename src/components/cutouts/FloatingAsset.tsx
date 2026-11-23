import React from 'react';
import { useCurrentFrame } from 'remotion';

export interface FloatingAssetProps {
  children: React.ReactNode;
  frequency?: number;
  amplitudeY?: number;
  amplitudeX?: number;
  rotationAmplitude?: number;
  delayOffset?: number;
  style?: React.CSSProperties;
}

export const FloatingAsset: React.FC<FloatingAssetProps> = ({
  children,
  frequency = 0.04,
  amplitudeY = 12,
  amplitudeX = 5,
  rotationAmplitude = 1.5,
  delayOffset = 0,
  style = {},
}) => {
  const frame = useCurrentFrame();
  const t = (frame + delayOffset) * frequency;

  const y = Math.sin(t) * amplitudeY;
  const x = Math.cos(t * 0.7) * amplitudeX;
  const rot = Math.sin(t * 0.5) * rotationAmplitude;

  return (
    <div
      style={{
        display: 'inline-block',
        transform: `translate3d(${x}px, ${y}px, 0) rotate(${rot}deg)`,
        willChange: 'transform',
        ...style,
      }}
    >
      {children}
    </div>
  );
};
