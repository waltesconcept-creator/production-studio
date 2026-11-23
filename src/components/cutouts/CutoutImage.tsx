import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { resolveAsset } from '../../assets/svgAssets';

export interface CutoutImageProps {
  src: string;
  alt?: string;
  width?: number | string;
  height?: number | string;
  delay?: number;
  rotation?: number; // target resting tilt in degrees
  tape?: boolean; // scotch tape strip on top
  pin?: boolean; // red push pin on top
  stickerBorder?: boolean; // white cutout sticker border
  polaroid?: boolean; // vintage polaroid paper border
  polaroidLabel?: string;
  depth?: number; // 1 = background, 2 = midground, 3 = foreground
  shadowBlur?: number;
  shadowOpacity?: number;
  wobble?: boolean;
  style?: React.CSSProperties;
}

export const CutoutImage: React.FC<CutoutImageProps> = ({
  src,
  alt = 'Cutout element',
  width = 'auto',
  height = 'auto',
  delay = 5,
  rotation = -4,
  tape = false,
  pin = false,
  stickerBorder = true,
  polaroid = false,
  polaroidLabel,
  depth = 2,
  shadowBlur = 30,
  shadowOpacity = 0.45,
  wobble = false,
  style = {},
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Entrance spring animation
  const spr = spring({
    frame: frame - delay,
    fps,
    config: { damping: 13, stiffness: 160, mass: 0.7 },
  });

  const scale = interpolate(spr, [0, 1], [0.2, 1]);
  const currentRotation = interpolate(spr, [0, 1], [rotation * 2.5, rotation]);
  const opacity = interpolate(spr, [0, 0.4], [0, 1], { extrapolateRight: 'clamp' });

  // Optional subtle organic breathing wiggle
  const wiggleAngle = wobble ? Math.sin((frame + delay * 10) * 0.05) * 1.5 : 0;
  const wiggleY = wobble ? Math.cos((frame + delay * 10) * 0.04) * 4 : 0;

  return (
    <div
      style={{
        position: 'relative',
        display: 'inline-block',
        transform: `translateY(${wiggleY}px) scale(${scale}) rotate(${currentRotation + wiggleAngle}deg)`,
        opacity,
        transformOrigin: 'center center',
        zIndex: depth * 10,
        filter: `drop-shadow(0 ${depth * 10}px ${shadowBlur}px rgba(0, 0, 0, ${shadowOpacity}))`,
        ...style,
      }}
    >
      {/* Red push pin */}
      {pin && (
        <div
          style={{
            position: 'absolute',
            top: '-14px',
            left: '50%',
            transform: 'translateX(-50%)',
            width: '24px',
            height: '24px',
            borderRadius: '50%',
            background: 'radial-gradient(circle at 35% 35%, #ff4d4d, #cc0000 65%, #660000 100%)',
            boxShadow: '0 4px 8px rgba(0,0,0,0.5), inset 0 2px 2px rgba(255,255,255,0.6)',
            zIndex: 10,
          }}
        >
          <div
            style={{
              position: 'absolute',
              bottom: '-8px',
              left: '50%',
              transform: 'translateX(-50%)',
              width: '4px',
              height: '8px',
              backgroundColor: '#a0a0a0',
              borderRadius: '1px',
            }}
          />
        </div>
      )}

      {/* Scotch tape strip */}
      {tape && (
        <div
          style={{
            position: 'absolute',
            top: '-16px',
            left: '50%',
            transform: 'translateX(-50%) rotate(-3deg)',
            width: '90px',
            height: '26px',
            backgroundColor: 'rgba(255, 255, 230, 0.65)',
            backdropFilter: 'blur(1px)',
            boxShadow: '0 2px 4px rgba(0,0,0,0.15)',
            borderLeft: '2px dashed rgba(0,0,0,0.1)',
            borderRight: '2px dashed rgba(0,0,0,0.1)',
            zIndex: 9,
          }}
        />
      )}

      {/* Polaroid container or direct cutout */}
      {polaroid ? (
        <div
          style={{
            backgroundColor: '#faf8f2',
            padding: '14px 14px 44px 14px',
            boxShadow: 'inset 0 0 12px rgba(0,0,0,0.06)',
            borderRadius: '2px',
          }}
        >
          <img
            src={resolveAsset(src)}
            alt={alt}
            style={{
              display: 'block',
              width,
              height,
              maxWidth: '100%',
              objectFit: 'cover',
            }}
          />
          {polaroidLabel && (
            <div
              style={{
                marginTop: '10px',
                textAlign: 'center',
                fontFamily: '"Caveat", "Permanent Marker", "Comic Sans MS", cursive',
                fontSize: '20px',
                color: '#2a2a2a',
              }}
            >
              {polaroidLabel}
            </div>
          )}
        </div>
      ) : (
        <img
          src={resolveAsset(src)}
          alt={alt}
          style={{
            display: 'block',
            width,
            height,
            maxWidth: '100%',
            filter: stickerBorder ? 'drop-shadow(0 0 0 4px #ffffff) drop-shadow(0 0 0 5px rgba(0,0,0,0.15))' : 'none',
          }}
        />
      )}
    </div>
  );
};
