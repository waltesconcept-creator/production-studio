import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';

export interface AnimatedArrowProps {
  startX?: number;
  startY?: number;
  endX?: number;
  endY?: number;
  curvature?: number; // positive bends right/down, negative bends left/up
  color?: string;
  strokeWidth?: number;
  delay?: number;
  durationInFrames?: number;
  dashed?: boolean;
  style?: React.CSSProperties;
}

export const AnimatedArrow: React.FC<AnimatedArrowProps> = ({
  startX = 50,
  startY = 150,
  endX = 350,
  endY = 50,
  curvature = -60,
  color = '#ff3366',
  strokeWidth = 4,
  delay = 5,
  durationInFrames = 25,
  dashed = false,
  style = {},
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const progress = interpolate(
    frame - delay,
    [0, durationInFrames],
    [0, 1],
    {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
      easing: (t) => Math.sin((t * Math.PI) / 2),
    }
  );

  // Arrowhead pop-in spring at the end
  const headSpring = spring({
    frame: frame - (delay + durationInFrames - 5),
    fps,
    config: { damping: 12, stiffness: 200 },
  });
  const headScale = interpolate(headSpring, [0, 1], [0, 1]);

  // Quadratic bezier control point
  const midX = (startX + endX) / 2;
  const midY = (startY + endY) / 2 + curvature;
  const pathD = `M ${startX} ${startY} Q ${midX} ${midY} ${endX} ${endY}`;

  // Approximate arc length for strokeDashoffset
  const dx = endX - startX;
  const dy = endY - startY;
  const pathLength = Math.sqrt(dx * dx + dy * dy) * 1.35;
  const strokeOffset = pathLength * (1 - progress);

  // Arrowhead angle calculation
  const angleRad = Math.atan2(endY - midY, endX - midX);
  const angleDeg = (angleRad * 180) / Math.PI;

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
      <path
        d={pathD}
        fill="none"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeDasharray={dashed ? '8,8' : pathLength}
        strokeDashoffset={strokeOffset}
        style={{
          filter: `drop-shadow(0 2px 8px ${color}66)`,
        }}
      />

      {/* Arrowhead polygon */}
      {progress > 0.85 && (
        <g
          transform={`translate(${endX}, ${endY}) rotate(${angleDeg}) scale(${headScale})`}
        >
          <polygon
            points={`0,0 -${strokeWidth * 3.5},-${strokeWidth * 2} -${strokeWidth * 2.5},0 -${strokeWidth * 3.5},${strokeWidth * 2}`}
            fill={color}
          />
        </g>
      )}
    </svg>
  );
};
