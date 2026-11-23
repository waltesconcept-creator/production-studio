import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';

export interface TimelineMilestone {
  year: string;
  title: string;
  description?: string;
  badge?: string;
}

export interface RoadmapTimelineProps {
  milestones: TimelineMilestone[];
  width?: number | string;
  color?: string;
  activeColor?: string;
  style?: React.CSSProperties;
}

export const RoadmapTimeline: React.FC<RoadmapTimelineProps> = ({
  milestones,
  width = '100%',
  color = '#4b5563',
  activeColor = '#38bdf8',
  style = {},
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Progress of the connecting line
  const totalFrames = milestones.length * 20;
  const lineProgress = interpolate(frame, [5, totalFrames], [0, 100], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <div
      style={{
        position: 'relative',
        width,
        padding: '30px 20px',
        ...style,
      }}
    >
      {/* Background connector track */}
      <div
        style={{
          position: 'absolute',
          top: '52px',
          left: '5%',
          right: '5%',
          height: '4px',
          backgroundColor: color,
          borderRadius: '2px',
        }}
      />

      {/* Animated active progress line */}
      <div
        style={{
          position: 'absolute',
          top: '52px',
          left: '5%',
          width: `${(lineProgress * 0.9)}%`,
          height: '4px',
          backgroundColor: activeColor,
          borderRadius: '2px',
          boxShadow: `0 0 12px ${activeColor}`,
          transition: 'width 0.05s ease-out',
        }}
      />

      {/* Milestones */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          position: 'relative',
          zIndex: 2,
        }}
      >
        {milestones.map((ms, index) => {
          const itemDelay = 10 + index * 18;
          const spr = spring({
            frame: frame - itemDelay,
            fps,
            config: { damping: 12, stiffness: 180 },
          });

          const scale = interpolate(spr, [0, 1], [0, 1]);
          const isReached = frame >= itemDelay;

          return (
            <div
              key={index}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                textAlign: 'center',
                maxWidth: '180px',
                transform: `scale(${scale})`,
              }}
            >
              {/* Year badge */}
              <div
                style={{
                  fontFamily: '"Chakra Petch", monospace',
                  fontSize: '18px',
                  fontWeight: 800,
                  color: isReached ? activeColor : '#888888',
                  marginBottom: '10px',
                }}
              >
                {ms.year}
              </div>

              {/* Node dot */}
              <div
                style={{
                  width: '20px',
                  height: '20px',
                  borderRadius: '50%',
                  backgroundColor: isReached ? activeColor : '#222226',
                  border: `3px solid ${isReached ? '#ffffff' : color}`,
                  boxShadow: isReached ? `0 0 16px ${activeColor}` : 'none',
                  marginBottom: '14px',
                }}
              />

              {/* Title & description */}
              <div
                style={{
                  fontFamily: 'sans-serif',
                  fontSize: '14px',
                  fontWeight: 700,
                  color: '#ffffff',
                  marginBottom: '4px',
                }}
              >
                {ms.title}
              </div>
              {ms.description && (
                <div
                  style={{
                    fontFamily: 'sans-serif',
                    fontSize: '11px',
                    color: '#aaaaaa',
                    lineHeight: 1.35,
                  }}
                >
                  {ms.description}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
