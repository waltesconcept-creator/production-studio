import React from 'react';
import { interpolate, useCurrentFrame } from 'remotion';

export interface ChromaticAberrationProps {
  children: React.ReactNode;
  intensity?: number; // pixels of RGB split
  animate?: boolean;
  style?: React.CSSProperties;
}

export const ChromaticAberration: React.FC<ChromaticAberrationProps> = ({
  children,
  intensity = 3,
  animate = true,
  style = {},
}) => {
  const frame = useCurrentFrame();

  const offset = animate
    ? Math.sin(frame * 0.4) * intensity
    : intensity;

  return (
    <div
      style={{
        position: 'relative',
        display: 'inline-block',
        ...style,
      }}
    >
      {/* Cyan channel shift */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: `${-offset}px`,
          width: '100%',
          height: '100%',
          opacity: 0.8,
          mixBlendMode: 'screen',
          filter: 'drop-shadow(0 0 1px #00ffff)',
          pointerEvents: 'none',
          zIndex: 1,
        }}
      >
        {children}
      </div>

      {/* Red channel shift */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: `${offset}px`,
          width: '100%',
          height: '100%',
          opacity: 0.8,
          mixBlendMode: 'screen',
          filter: 'drop-shadow(0 0 1px #ff0055)',
          pointerEvents: 'none',
          zIndex: 2,
        }}
      >
        {children}
      </div>

      {/* Base layer */}
      <div style={{ position: 'relative', zIndex: 3 }}>
        {children}
      </div>
    </div>
  );
};
