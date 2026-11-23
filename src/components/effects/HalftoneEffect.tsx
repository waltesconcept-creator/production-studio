import React from 'react';

export interface HalftoneEffectProps {
  children: React.ReactNode;
  dotSize?: number;
  contrast?: number;
  shape?: 'circle' | 'ellipse' | 'none';
  width?: number | string;
  height?: number | string;
  style?: React.CSSProperties;
}

export const HalftoneEffect: React.FC<HalftoneEffectProps> = ({
  children,
  dotSize = 4,
  contrast = 150,
  shape = 'circle',
  width = 'auto',
  height = 'auto',
  style = {},
}) => {
  return (
    <div
      style={{
        position: 'relative',
        display: 'inline-block',
        width,
        height,
        overflow: 'hidden',
        borderRadius: shape === 'circle' ? '50%' : shape === 'ellipse' ? '50% / 40%' : '0',
        boxShadow: shape !== 'none' ? '0 20px 40px rgba(0,0,0,0.45)' : 'none',
        ...style,
      }}
    >
      {/* Base monochrome high-contrast content */}
      <div
        style={{
          filter: `grayscale(100%) contrast(${contrast}%)`,
          display: 'block',
          width: '100%',
          height: '100%',
        }}
      >
        {children}
      </div>

      {/* Halftone dot raster grid overlay */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: `radial-gradient(#000000 1.2px, transparent 1.2px)`,
          backgroundSize: `${dotSize}px ${dotSize}px`,
          mixBlendMode: 'multiply',
          opacity: 0.65,
          pointerEvents: 'none',
        }}
      />

      {/* Subtle vignette boundary */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: 'radial-gradient(circle at 50% 50%, transparent 60%, rgba(0,0,0,0.5) 100%)',
          pointerEvents: 'none',
        }}
      />
    </div>
  );
};
