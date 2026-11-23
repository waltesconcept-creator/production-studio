import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';

export interface BarChartItem {
  label: string;
  value: number;
  color?: string;
  sublabel?: string;
}

export interface AnimatedBarChartProps {
  items: BarChartItem[];
  maxValue?: number;
  height?: number;
  width?: number | string;
  delay?: number;
  stagger?: number;
  barColor?: string;
  style?: React.CSSProperties;
}

export const AnimatedBarChart: React.FC<AnimatedBarChartProps> = ({
  items,
  maxValue,
  height = 320,
  width = '100%',
  delay = 5,
  stagger = 8,
  barColor = '#3b82f6',
  style = {},
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const computedMax = maxValue || Math.max(...items.map((i) => i.value)) * 1.15;

  return (
    <div
      style={{
        position: 'relative',
        width,
        height,
        display: 'flex',
        alignItems: 'flex-end',
        justifyContent: 'space-around',
        padding: '20px 40px 50px 40px',
        borderBottom: '2px solid rgba(255,255,255,0.2)',
        ...style,
      }}
    >
      {items.map((item, index) => {
        const itemDelay = delay + index * stagger;
        const spr = spring({
          frame: frame - itemDelay,
          fps,
          config: { damping: 14, stiffness: 120 },
        });

        const barProgress = interpolate(spr, [0, 1], [0, 1]);
        const targetHeightPercent = (item.value / computedMax) * 100;
        const currentHeight = targetHeightPercent * barProgress;
        const itemColor = item.color || barColor;

        return (
          <div
            key={index}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              width: `${Math.min(90 / items.length, 18)}%`,
              height: '100%',
              justifyContent: 'flex-end',
              position: 'relative',
            }}
          >
            {/* Number on top */}
            <div
              style={{
                fontFamily: '"Chakra Petch", monospace',
                fontSize: '18px',
                fontWeight: 700,
                color: itemColor,
                marginBottom: '8px',
                opacity: barProgress > 0.1 ? 1 : 0,
                transform: `translateY(${interpolate(spr, [0, 1], [15, 0])}px)`,
              }}
            >
              {Math.round(item.value * barProgress).toLocaleString()}
            </div>

            {/* Bar */}
            <div
              style={{
                width: '100%',
                height: `${currentHeight}%`,
                backgroundColor: itemColor,
                borderRadius: '6px 6px 0 0',
                boxShadow: `0 0 20px ${itemColor}44`,
                background: `linear-gradient(to top, ${itemColor}aa, ${itemColor})`,
              }}
            />

            {/* Label below axis */}
            <div
              style={{
                position: 'absolute',
                bottom: '-36px',
                textAlign: 'center',
                fontFamily: 'sans-serif',
                fontSize: '13px',
                fontWeight: 600,
                color: '#cccccc',
                whiteSpace: 'nowrap',
              }}
            >
              {item.label}
            </div>
          </div>
        );
      })}
    </div>
  );
};
