import React from 'react';
import { interpolate, spring, staticFile, useCurrentFrame, useVideoConfig } from 'remotion';

export interface PropertyListingCardProps {
  title?: string;
  location?: string;
  price?: string;
  features?: string[];
  imageSrc?: string;
  delay?: number;
  highlightAction?: boolean;
}

export const PropertyListingCard: React.FC<PropertyListingCardProps> = ({
  title = 'Serviced 2-Bedroom Apartment',
  location = 'Bodija, Ibadan',
  price = '₦1,000,000 / yr',
  features = ['⚡ 24/7 Power', '🛡️ Gated Security', '🚗 Dedicated Parking'],
  imageSrc = 'assets/downloads/apartment-modern.jpg',
  delay = 0,
  highlightAction = false,
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

  const buttonPulse = highlightAction
    ? Math.sin(frame * 0.2) * 0.05 + 1
    : 1;

  if (frame < delay) return null;

  return (
    <div
      style={{
        marginTop: 10,
        backgroundColor: '#FFFFFF',
        border: '3px solid #09090B',
        borderRadius: 16,
        boxShadow: '4px 4px 0px #09090B',
        overflow: 'hidden',
        transform: `scale(${entrance})`,
        transformOrigin: 'top center',
      }}
    >
      {/* Property Photo with Verified Tag */}
      <div style={{ position: 'relative', width: '100%', height: 190, backgroundColor: '#E5E7EB' }}>
        <img
          src={staticFile(imageSrc)}
          alt={title}
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
        <div
          style={{
            position: 'absolute',
            top: 10,
            left: 10,
            backgroundColor: '#10B981',
            color: '#FFFFFF',
            border: '2px solid #09090B',
            borderRadius: 8,
            padding: '4px 10px',
            fontSize: 12,
            fontWeight: 800,
            boxShadow: '2px 2px 0px #09090B',
            display: 'flex',
            alignItems: 'center',
            gap: 4,
          }}
        >
          <span>✓ VERIFIED PROPERTY</span>
        </div>
        <div
          style={{
            position: 'absolute',
            bottom: 10,
            right: 10,
            backgroundColor: '#F59E0B',
            color: '#09090B',
            border: '2.5px solid #09090B',
            borderRadius: 8,
            padding: '6px 12px',
            fontSize: 16,
            fontWeight: 900,
            boxShadow: '3px 3px 0px #09090B',
          }}
        >
          {price}
        </div>
      </div>

      {/* Details Body */}
      <div style={{ padding: '14px 16px' }}>
        <div style={{ fontSize: 18, fontWeight: 800, color: '#09090B', marginBottom: 4 }}>
          {title}
        </div>
        <div style={{ fontSize: 14, fontWeight: 600, color: '#4B5563', marginBottom: 10 }}>
          📍 {location}
        </div>

        {/* Feature Badges */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 14 }}>
          {features.map((feat, idx) => (
            <span
              key={idx}
              style={{
                backgroundColor: '#FEF3C7',
                border: '1.5px solid #09090B',
                borderRadius: 6,
                padding: '3px 8px',
                fontSize: 12,
                fontWeight: 700,
                color: '#09090B',
              }}
            >
              {feat}
            </span>
          ))}
        </div>

        {/* Action Button */}
        <div
          style={{
            backgroundColor: '#09090B',
            color: '#FFFFFF',
            border: '2.5px solid #09090B',
            borderRadius: 12,
            padding: '12px 16px',
            textAlign: 'center',
            fontSize: 15,
            fontWeight: 800,
            letterSpacing: '0.03em',
            boxShadow: '3px 3px 0px #F59E0B',
            transform: `scale(${buttonPulse})`,
            cursor: 'pointer',
          }}
        >
          📅 BOOK INSPECTION (VIRTUAL / PHYSICAL)
        </div>
      </div>
    </div>
  );
};
