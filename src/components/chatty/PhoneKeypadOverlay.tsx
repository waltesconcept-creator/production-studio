import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';

export interface PhoneKeypadOverlayProps {
  title?: string;
  delay?: number;
}

export const PhoneKeypadOverlay: React.FC<PhoneKeypadOverlayProps> = ({
  title = 'ENTER YOUR PIN',
  delay = 0,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const entrance = spring({
    frame: frame - delay,
    fps,
    config: { damping: 14, mass: 0.6, stiffness: 120 },
  });

  const relativeFrame = Math.max(0, frame - delay);

  // 4 PIN dots fill sequentially
  const dot1Filled = relativeFrame >= 12;
  const dot2Filled = relativeFrame >= 24;
  const dot3Filled = relativeFrame >= 36;
  const dot4Filled = relativeFrame >= 48;

  // Active key highlight
  const activeKey =
    relativeFrame >= 48 ? null :
    relativeFrame >= 36 ? 7 :
    relativeFrame >= 24 ? 4 :
    relativeFrame >= 12 ? 2 :
    relativeFrame >= 4 ? 5 : null;

  if (frame < delay) return null;

  const numbers = [
    [1, 2, 3],
    [4, 5, 6],
    [7, 8, 9],
    [null, 0, null],
  ];

  return (
    <div
      style={{
        position: 'absolute',
        top: 130,
        left: 20,
        right: 20,
        backgroundColor: '#FFFFFF',
        borderRadius: 24,
        border: '3px solid #09090B',
        boxShadow: '6px 6px 0px #09090B',
        padding: '28px 24px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        transform: `scale(${entrance})`,
        transformOrigin: 'center center',
        zIndex: 50,
      }}
    >
      <div style={{ fontSize: 20, fontWeight: 900, color: '#09090B', letterSpacing: '0.04em', marginBottom: 20 }}>
        {title}
      </div>

      {/* 4 PIN Dots */}
      <div style={{ display: 'flex', gap: 18, marginBottom: 30 }}>
        {[dot1Filled, dot2Filled, dot3Filled, dot4Filled].map((filled, idx) => (
          <div
            key={idx}
            style={{
              width: 18,
              height: 18,
              borderRadius: '50%',
              backgroundColor: filled ? '#2563EB' : '#E2E8F0',
              border: '2.5px solid #09090B',
              transform: filled ? 'scale(1.15)' : 'scale(1)',
              transition: 'all 0.15s ease',
            }}
          />
        ))}
      </div>

      {/* Keypad Grid */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14, width: '100%', maxWidth: 360 }}>
        {numbers.map((row, rIdx) => (
          <div key={rIdx} style={{ display: 'flex', justifyContent: 'center', gap: 18 }}>
            {row.map((num, cIdx) => {
              if (num === null) {
                return <div key={cIdx} style={{ width: 68, height: 68 }} />;
              }
              const isPressed = activeKey === num;
              return (
                <div
                  key={cIdx}
                  style={{
                    width: 68,
                    height: 68,
                    borderRadius: '50%',
                    backgroundColor: isPressed ? '#FDE68A' : '#FFFFFF',
                    border: '2.5px solid #09090B',
                    boxShadow: isPressed ? '1px 1px 0px #09090B' : '3px 3px 0px #09090B',
                    transform: isPressed ? 'translate(2px, 2px)' : 'none',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 26,
                    fontWeight: 800,
                    color: '#09090B',
                  }}
                >
                  {num}
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
};
