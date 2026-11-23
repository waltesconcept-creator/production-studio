import React from 'react';
import { interpolate, useCurrentFrame } from 'remotion';

export interface HandDrawnCircleProps {
  cx?: number;
  cy?: number;
  rx?: number;
  ry?: number;
  color?: string;
  strokeWidth?: number;
  delay?: number;
  durationInFrames?: number;
  rotation?: number;
  style?: React.CSSProperties;
}

export const HandDrawnCircle: React.FC<HandDrawnCircleProps> = ({
  cx = 200,
  cy = 150,
  rx = 90,
  ry = 55,
  color = '#ff3366',
  strokeWidth = 4,
  delay = 5,
  durationInFrames = 25,
  rotation = -3,
  style = {},
}) => {
  const frame = useCurrentFrame();

  const progress = interpolate(
    frame - delay,
    [0, durationInFrames],
    [0, 1],
    {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
    }
  );

  // An organic hand-drawn path with slight overlap
  const perimeter = 2 * Math.PI * Math.sqrt((rx * rx + ry * ry) / 2) * 1.15;
  const strokeDashoffset = perimeter * (1 - progress);

  return (
    <svg
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        overflow: 'visible',
        pointerEvents: 'none',
        ...style,
      }}
    >
      <g transform={`rotate(${rotation} ${cx} ${cy})`}>
        <ellipse
          cx={cx}
          cy={cy}
          rx={rx}
          ry={ry}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={perimeter}
          strokeDashoffset={strokeDashoffset}
          style={{
            filter: `drop-shadow(0 0 8px ${color}66)`,
          }}
        />
      </g>
    </svg>
  );
};
