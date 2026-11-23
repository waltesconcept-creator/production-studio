import React from 'react';
import { BackgroundStyle } from '../../types/story';

export interface StudioBackgroundProps {
  type?: BackgroundStyle;
  primaryColor?: string;
  secondaryColor?: string;
  showVignette?: boolean;
  opacity?: number;
  style?: React.CSSProperties;
}

export const StudioBackground: React.FC<StudioBackgroundProps> = ({
  type = 'grid',
  primaryColor,
  secondaryColor,
  showVignette = true,
  opacity = 1,
  style = {},
}) => {
  let backgroundContent: React.ReactNode = null;

  switch (type) {
    case 'blueprint':
      backgroundContent = (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backgroundColor: primaryColor || '#0a192f',
            backgroundImage: `
              linear-gradient(rgba(255, 255, 255, 0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255, 255, 255, 0.1) 1px, transparent 1px),
              linear-gradient(rgba(255, 255, 255, 0.04) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255, 255, 255, 0.04) 1px, transparent 1px)
            `,
            backgroundSize: '100px 100px, 100px 100px, 20px 20px, 20px 20px',
            backgroundPosition: '-1px -1px',
          }}
        />
      );
      break;

    case 'dots':
      backgroundContent = (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backgroundColor: primaryColor || '#121214',
            backgroundImage: 'radial-gradient(rgba(255, 255, 255, 0.15) 1.5px, transparent 1.5px)',
            backgroundSize: '32px 32px',
          }}
        />
      );
      break;

    case 'paper-warm':
      backgroundContent = (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backgroundColor: primaryColor || '#f4ecd8',
            backgroundImage: `
              radial-gradient(circle at 20% 30%, rgba(240, 225, 200, 0.8) 0%, transparent 60%),
              radial-gradient(circle at 80% 70%, rgba(220, 195, 160, 0.6) 0%, transparent 50%)
            `,
          }}
        />
      );
      break;

    case 'paper-dark':
      backgroundContent = (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backgroundColor: primaryColor || '#141416',
            backgroundImage: `
              radial-gradient(circle at 50% 40%, rgba(30, 30, 35, 0.8) 0%, #0d0d0f 100%)
            `,
          }}
        />
      );
      break;

    case 'gradient':
      backgroundContent = (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: `radial-gradient(circle at 50% 35%, ${secondaryColor || '#1f2937'} 0%, ${primaryColor || '#0b0f19'} 100%)`,
          }}
        />
      );
      break;

    case 'solid':
      backgroundContent = (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backgroundColor: primaryColor || '#0a0a0c',
          }}
        />
      );
      break;

    case 'grid':
    default:
      backgroundContent = (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backgroundColor: primaryColor || '#0f1117',
            backgroundImage: `
              linear-gradient(rgba(255, 255, 255, 0.05) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255, 255, 255, 0.05) 1px, transparent 1px)
            `,
            backgroundSize: '60px 60px',
            backgroundPosition: 'center center',
          }}
        />
      );
      break;
  }

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        overflow: 'hidden',
        pointerEvents: 'none',
        opacity,
        zIndex: 0,
        ...style,
      }}
    >
      {backgroundContent}

      {/* Cinematic Vignette */}
      {showVignette && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'radial-gradient(circle at 50% 50%, transparent 45%, rgba(0, 0, 0, 0.65) 100%)',
            pointerEvents: 'none',
          }}
        />
      )}
    </div>
  );
};
