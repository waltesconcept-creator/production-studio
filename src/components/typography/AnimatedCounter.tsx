import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';

export interface AnimatedCounterProps {
  value: number;
  startValue?: number;
  prefix?: string;
  suffix?: string;
  decimals?: number;
  durationInFrames?: number;
  delay?: number;
  formatter?: (val: number) => string;
  fontSize?: number | string;
  color?: string;
  fontFamily?: string;
  style?: React.CSSProperties;
}

export const AnimatedCounter: React.FC<AnimatedCounterProps> = ({
  value,
  startValue = 0,
  prefix = '',
  suffix = '',
  decimals = 0,
  durationInFrames = 45,
  delay = 0,
  formatter,
  fontSize = 72,
  color = '#ffffff',
  fontFamily = '"Chakra Petch", "Roboto Mono", "Courier New", monospace',
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
      // smooth easeOutExpo
      easing: (t) => (t === 1 ? 1 : 1 - Math.pow(2, -10 * t)),
    }
  );

  const currentValue = startValue + (value - startValue) * progress;

  const formattedNumber = formatter
    ? formatter(currentValue)
    : decimals > 0
    ? currentValue.toFixed(decimals)
    : Math.floor(currentValue).toLocaleString('en-US');

  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'baseline',
        fontFamily,
        fontSize,
        fontWeight: 800,
        color,
        fontVariantNumeric: 'tabular-nums',
        letterSpacing: '-0.02em',
        ...style,
      }}
    >
      {prefix && <span style={{ opacity: 0.85, marginRight: '0.08em' }}>{prefix}</span>}
      <span>{formattedNumber}</span>
      {suffix && <span style={{ opacity: 0.85, marginLeft: '0.08em' }}>{suffix}</span>}
    </span>
  );
};
