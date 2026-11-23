import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';

export interface CaptionPillProps {
  speaker?: string;
  role?: string;
  delay?: number;
  durationInFrames?: number;
  style?: React.CSSProperties;
}

export const CaptionPill: React.FC<CaptionPillProps> = ({
  speaker = 'Jensen Huang',
  role = 'Founder & CEO, NVIDIA',
  delay = 10,
  durationInFrames = 75,
  style = {},
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const spr = spring({
    frame: frame - delay,
    fps,
    config: { damping: 14, stiffness: 180 },
  });

  const translateX = interpolate(spr, [0, 1], [-100, 0]);
  const opacity = interpolate(spr, [0, 0.4], [0, 1], { extrapolateRight: 'clamp' });

  // Exit animation at end of duration
  const exitFrame = delay + durationInFrames;
  const exitProgress = interpolate(frame, [exitFrame - 10, exitFrame], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const exitOpacity = 1 - exitProgress;

  if (frame < delay || frame > exitFrame) return null;

  return (
    <div
      style={{
        position: 'absolute',
        bottom: '10%',
        left: '6%',
        transform: `translateX(${translateX}px)`,
        opacity: opacity * exitOpacity,
        zIndex: 40,
        backgroundColor: 'rgba(15, 17, 23, 0.92)',
        borderLeft: '4px solid #38bdf8',
        padding: '12px 24px',
        borderRadius: '0 8px 8px 0',
        backdropFilter: 'blur(10px)',
        boxShadow: '0 15px 35px rgba(0,0,0,0.5)',
        pointerEvents: 'none',
        ...style,
      }}
    >
      <div
        style={{
          fontFamily: 'sans-serif',
          fontSize: '18px',
          fontWeight: 800,
          color: '#ffffff',
          letterSpacing: '-0.01em',
        }}
      >
        {speaker}
      </div>
      {role && (
        <div
          style={{
            fontFamily: 'sans-serif',
            fontSize: '12px',
            fontWeight: 500,
            color: '#94a3b8',
            marginTop: '2px',
            textTransform: 'uppercase',
            letterSpacing: '0.08em',
          }}
        >
          {role}
        </div>
      )}
    </div>
  );
};
