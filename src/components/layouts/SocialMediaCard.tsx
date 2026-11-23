import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { resolveAsset } from '../../assets/svgAssets';

export interface SocialMediaCardProps {
  handle?: string;
  verified?: boolean;
  location?: string;
  avatarSrc?: string;
  postImageSrc: string;
  cutoutSrc?: string; // Subject that pops OUT of the frame
  likes?: number | string;
  comments?: number | string;
  rotation?: number; // 3D card tilt
  delay?: number;
  width?: number;
  style?: React.CSSProperties;
}

export const SocialMediaCard: React.FC<SocialMediaCardProps> = ({
  handle = 'georgeheaton',
  verified = true,
  location = 'Death Valley',
  avatarSrc,
  postImageSrc,
  cutoutSrc,
  likes = '8,956',
  comments = '57',
  rotation = -4,
  delay = 5,
  width = 460,
  style = {},
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const spr = spring({
    frame: frame - delay,
    fps,
    config: { damping: 13, stiffness: 140 },
  });

  const scale = interpolate(spr, [0, 1], [0.8, 1]);
  const rot = interpolate(spr, [0, 1], [rotation * 2, rotation]);

  return (
    <div
      style={{
        position: 'relative',
        width: `${width}px`,
        transform: `scale(${scale}) rotate(${rot}deg)`,
        transformOrigin: 'center center',
        margin: '0 auto',
        ...style,
      }}
    >
      {/* Main Instagram Card Container */}
      <div
        style={{
          backgroundColor: '#ffffff',
          borderRadius: '16px',
          overflow: 'hidden',
          boxShadow: '0 25px 60px rgba(0,0,0,0.5), 0 0 0 1px rgba(0,0,0,0.08)',
          color: '#1a1a1a',
          fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        }}
      >
        {/* Header */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '12px 16px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            {/* Avatar circle */}
            <div
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '50%',
                backgroundColor: '#e5e7eb',
                overflow: 'hidden',
                border: '1.5px solid #ff5500',
              }}
            >
              {avatarSrc ? (
                <img src={resolveAsset(avatarSrc)} alt={handle} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              ) : (
                <div style={{ width: '100%', height: '100%', backgroundColor: '#d1d5db' }} />
              )}
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '13px', fontWeight: 700 }}>
                <span>{handle}</span>
                {verified && (
                  <span style={{ color: '#38bdf8', fontSize: '12px' }}>●</span>
                )}
              </div>
              {location && (
                <div style={{ fontSize: '10px', color: '#6b7280' }}>{location}</div>
              )}
            </div>
          </div>
          <div style={{ fontSize: '18px', letterSpacing: '2px', color: '#6b7280' }}>•••</div>
        </div>

        {/* Post Image Container */}
        <div style={{ position: 'relative', width: '100%', height: '380px', backgroundColor: '#f3f4f6', overflow: 'hidden' }}>
          <img
            src={resolveAsset(postImageSrc)}
            alt="Post content"
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
        </div>

        {/* Footer Actions & Stats */}
        <div style={{ padding: '12px 16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '18px' }}>
            <div style={{ display: 'flex', gap: '14px', alignItems: 'center' }}>
              <span>♡ {likes}</span>
              <span>💬 {comments}</span>
              <span>✈ 143</span>
            </div>
            <span>⚑</span>
          </div>
        </div>
      </div>

      {/* 3D Pop-out Cutout breaking OUT of the card */}
      {cutoutSrc && (
        <div
          style={{
            position: 'absolute',
            bottom: '45px',
            left: '50%',
            transform: 'translateX(-50%)',
            width: '90%',
            zIndex: 10,
            pointerEvents: 'none',
          }}
        >
          <img
            src={resolveAsset(cutoutSrc)}
            alt="Pop out cutout"
            style={{
              width: '100%',
              display: 'block',
              filter: 'drop-shadow(0 0 0 3px #ffffff) drop-shadow(0 15px 25px rgba(0,0,0,0.6))',
            }}
          />
        </div>
      )}
    </div>
  );
};
