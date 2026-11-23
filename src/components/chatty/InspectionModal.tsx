import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';

export interface InspectionModalProps {
  delay?: number;
}

export const InspectionModal: React.FC<InspectionModalProps> = ({ delay = 0 }) => {
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

  const scale = entrance;
  const translateY = interpolate(entrance, [0, 1], [40, 0]);

  if (frame < delay) return null;

  return (
    <div
      style={{
        marginTop: 12,
        backgroundColor: '#FFFFFF',
        border: '3px solid #09090B',
        borderRadius: 18,
        boxShadow: '5px 5px 0px #09090B',
        padding: 16,
        transform: `translateY(${translateY}px) scale(${scale})`,
        transformOrigin: 'top center',
      }}
    >
      <div style={{ fontSize: 13, fontWeight: 800, color: '#B45309', marginBottom: 6 }}>
        ⚡ SELECT INSPECTION TYPE
      </div>
      <div style={{ fontSize: 18, fontWeight: 900, color: '#09090B', marginBottom: 12 }}>
        How would you like to inspect?
      </div>

      {/* Option 1: Live Video Tour */}
      <div
        style={{
          backgroundColor: '#EFF6FF',
          border: '2.5px solid #2563EB',
          borderRadius: 12,
          padding: 12,
          marginBottom: 10,
          boxShadow: '3px 3px 0px #1E40AF',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 }}>
          <div style={{ fontSize: 15, fontWeight: 900, color: '#1E3A8A' }}>
            🎥 Live Virtual Tour
          </div>
          <span
            style={{
              backgroundColor: '#2563EB',
              color: '#FFFFFF',
              fontSize: 10,
              fontWeight: 800,
              padding: '2px 6px',
              borderRadius: 6,
            }}
          >
            POPULAR
          </span>
        </div>
        <div style={{ fontSize: 13, color: '#1E40AF', fontWeight: 600 }}>
          Interactive video walkthrough right in WhatsApp. Pay safely via Escrow.
        </div>
      </div>

      {/* Option 2: Physical Inspection */}
      <div
        style={{
          backgroundColor: '#FDF2F8',
          border: '2.5px solid #DB2777',
          borderRadius: 12,
          padding: 12,
          marginBottom: 12,
          boxShadow: '3px 3px 0px #9D174D',
        }}
      >
        <div style={{ fontSize: 15, fontWeight: 900, color: '#831843', marginBottom: 4 }}>
          📍 Physical Inspection
        </div>
        <div style={{ fontSize: 13, color: '#9D174D', fontWeight: 600 }}>
          Chat directly with the lister to fix a physical meeting time and location.
        </div>
      </div>

      {/* Escrow Guarantee Pill */}
      <div
        style={{
          backgroundColor: '#ECFDF5',
          border: '2px dashed #059669',
          borderRadius: 10,
          padding: '8px 12px',
          display: 'flex',
          alignItems: 'center',
          gap: 8,
        }}
      >
        <span style={{ fontSize: 20 }}>🛡️</span>
        <div style={{ fontSize: 12, fontWeight: 700, color: '#065F46', lineHeight: 1.3 }}>
          <strong>100% Escrow Protection:</strong> Funds remain securely locked until your inspection is completed.
        </div>
      </div>
    </div>
  );
};
