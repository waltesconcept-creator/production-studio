import React from 'react';
import { interpolate, spring, staticFile, useCurrentFrame, useVideoConfig } from 'remotion';

export interface RoomieMatchCardProps {
  name?: string;
  avatarSrc?: string;
  profession?: string;
  matchScore?: number;
  totalRent?: string;
  splitRent?: string;
  delay?: number;
}

export const RoomieMatchCard: React.FC<RoomieMatchCardProps> = ({
  name = 'Tunde O.',
  avatarSrc = 'assets/downloads/roommate-avatar.jpg',
  profession = 'Software Engineer • Verified ID 🛡️',
  matchScore = 96,
  totalRent = '₦1,000,000 / yr',
  splitRent = '₦500,000 / yr',
  delay = 0,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const entrance = spring({
    frame: frame - delay,
    fps,
    config: {
      damping: 12,
      mass: 0.6,
      stiffness: 130,
    },
  });

  const pulse = Math.sin(frame * 0.15) * 0.03 + 1;

  if (frame < delay) return null;

  return (
    <div
      style={{
        marginTop: 10,
        backgroundColor: '#FFFFFF',
        border: '3px solid #09090B',
        borderRadius: 16,
        boxShadow: '4px 4px 0px #09090B',
        padding: 16,
        transform: `scale(${entrance})`,
        transformOrigin: 'top center',
      }}
    >
      {/* Profile Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
        <div
          style={{
            width: 60,
            height: 60,
            borderRadius: '50%',
            overflow: 'hidden',
            border: '2.5px solid #09090B',
            boxShadow: '2px 2px 0px #09090B',
            flexShrink: 0,
          }}
        >
          <img
            src={staticFile(avatarSrc)}
            alt={name}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
        </div>

        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ fontSize: 17, fontWeight: 800, color: '#09090B' }}>{name}</div>
            <div
              style={{
                backgroundColor: '#DCFCE7',
                color: '#166534',
                border: '1.5px solid #09090B',
                borderRadius: 8,
                padding: '2px 8px',
                fontSize: 12,
                fontWeight: 900,
              }}
            >
              🔥 {matchScore}% MATCH
            </div>
          </div>
          <div style={{ fontSize: 13, fontWeight: 600, color: '#4B5563', marginTop: 2 }}>
            {profession}
          </div>
        </div>
      </div>

      {/* Habits / Compatibility Tags */}
      <div style={{ display: 'flex', gap: 6, marginBottom: 12, flexWrap: 'wrap' }}>
        {['Clean & Quiet', 'Non-Smoker', 'Work from Home'].map((tag, idx) => (
          <span
            key={idx}
            style={{
              backgroundColor: '#F3F4F6',
              border: '1.5px solid #09090B',
              borderRadius: 6,
              padding: '2px 8px',
              fontSize: 11,
              fontWeight: 700,
              color: '#374151',
            }}
          >
            ✓ {tag}
          </span>
        ))}
      </div>

      {/* Rent Split Calculator Card */}
      <div
        style={{
          backgroundColor: '#FEF3C7',
          border: '2.5px dashed #09090B',
          borderRadius: 12,
          padding: '10px 14px',
          marginBottom: 14,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <div>
          <div style={{ fontSize: 11, fontWeight: 700, color: '#78350F', textTransform: 'uppercase' }}>
            Original Rent: {totalRent}
          </div>
          <div style={{ fontSize: 18, fontWeight: 900, color: '#09090B' }}>
            Your Share: <span style={{ color: '#059669' }}>{splitRent}</span>
          </div>
        </div>
        <div
          style={{
            backgroundColor: '#059669',
            color: '#FFFFFF',
            border: '2px solid #09090B',
            borderRadius: 8,
            padding: '4px 8px',
            fontSize: 12,
            fontWeight: 900,
            boxShadow: '2px 2px 0px #09090B',
          }}
        >
          SAVE 50%
        </div>
      </div>

      {/* CTA Button */}
      <div
        style={{
          backgroundColor: '#25D366',
          color: '#09090B',
          border: '2.5px solid #09090B',
          borderRadius: 12,
          padding: '12px 14px',
          textAlign: 'center',
          fontSize: 15,
          fontWeight: 900,
          boxShadow: '3px 3px 0px #09090B',
          transform: `scale(${pulse})`,
        }}
      >
        🤝 CONNECT & RENT APARTMENT TOGETHER
      </div>
    </div>
  );
};
