import React from 'react';
import { interpolate, useCurrentFrame } from 'remotion';

export interface PaperTearProps {
  progress: number; // 0 to 1
  children: React.ReactNode;
}

export const PaperTear: React.FC<PaperTearProps> = ({ progress, children }) => {
  // SVG clip-path polygon with jagged tear edges
  const clipPercent = progress * 100;

  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        position: 'relative',
        clipPath: `polygon(
          0% 0%,
          ${clipPercent}% 0%,
          ${clipPercent + 2}% 20%,
          ${clipPercent - 1}% 40%,
          ${clipPercent + 3}% 60%,
          ${clipPercent - 2}% 80%,
          ${clipPercent}% 100%,
          0% 100%
        )`,
      }}
    >
      {children}
    </div>
  );
};
