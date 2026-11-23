import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';

export interface KineticTextProps {
  text: string;
  mode?: 'staggered-slide' | 'typewriter' | 'spring-pop' | 'blur-reveal';
  highlightWords?: string[];
  highlightColor?: string;
  textColor?: string;
  fontSize?: number | string;
  fontWeight?: number | string;
  fontFamily?: string;
  textAlign?: 'left' | 'center' | 'right';
  staggerDelay?: number; // frames between words
  className?: string;
  style?: React.CSSProperties;
}

export const KineticText: React.FC<KineticTextProps> = ({
  text,
  mode = 'staggered-slide',
  highlightWords = [],
  highlightColor = '#ffdd00',
  textColor = '#ffffff',
  fontSize = 64,
  fontWeight = 800,
  fontFamily = 'Impact, "Montserrat", "Arial Black", sans-serif',
  textAlign = 'center',
  staggerDelay = 3,
  className = '',
  style = {},
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const words = text.split(' ');

  // Clean word for matching against highlightWords list
  const isHighlighted = (word: string) => {
    const clean = word.toLowerCase().replace(/[^a-z0-9]/g, '');
    return highlightWords.some((hw) => hw.toLowerCase().replace(/[^a-z0-9]/g, '') === clean);
  };

  if (mode === 'typewriter') {
    // Character by character typewriter with blinking cursor
    const charsPerFrame = 0.8;
    const currentLength = Math.min(text.length, Math.floor(frame * charsPerFrame));
    const visibleText = text.slice(0, currentLength);
    const showCursor = Math.floor(frame / 6) % 2 === 0;

    return (
      <div
        className={className}
        style={{
          fontFamily,
          fontSize,
          fontWeight,
          color: textColor,
          textAlign,
          lineHeight: 1.15,
          letterSpacing: '-0.02em',
          textTransform: 'uppercase',
          ...style,
        }}
      >
        <span>{visibleText}</span>
        <span
          style={{
            display: 'inline-block',
            width: '0.55em',
            height: '1em',
            backgroundColor: highlightColor,
            marginLeft: '4px',
            verticalAlign: 'middle',
            opacity: showCursor ? 1 : 0,
          }}
        />
      </div>
    );
  }

  return (
    <div
      className={className}
      style={{
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: textAlign === 'center' ? 'center' : textAlign === 'right' ? 'flex-end' : 'flex-start',
        gap: '0.28em',
        fontFamily,
        fontSize,
        fontWeight,
        color: textColor,
        lineHeight: 1.15,
        letterSpacing: '-0.02em',
        ...style,
      }}
    >
      {words.map((word, index) => {
        const delay = index * staggerDelay;
        const highlighted = isHighlighted(word);

        if (mode === 'staggered-slide') {
          const spr = spring({
            frame: frame - delay,
            fps,
            config: { damping: 14, stiffness: 180, mass: 0.6 },
          });

          const translateY = interpolate(spr, [0, 1], [110, 0]);
          const opacity = interpolate(spr, [0, 0.4], [0, 1], { extrapolateRight: 'clamp' });
          const rotate = interpolate(spr, [0, 1], [8, 0]);

          return (
            <span
              key={index}
              style={{
                display: 'inline-block',
                overflow: 'hidden',
                padding: '0.04em 0.08em',
                verticalAlign: 'bottom',
              }}
            >
              <span
                style={{
                  display: 'inline-block',
                  transform: `translateY(${translateY}%) rotate(${rotate}deg)`,
                  opacity,
                  color: highlighted ? highlightColor : textColor,
                  textShadow: highlighted ? `0 0 20px ${highlightColor}66` : '0 4px 12px rgba(0,0,0,0.4)',
                }}
              >
                {word}
              </span>
            </span>
          );
        }

        if (mode === 'spring-pop') {
          const spr = spring({
            frame: frame - delay,
            fps,
            config: { damping: 11, stiffness: 220, mass: 0.5 },
          });

          const scale = interpolate(spr, [0, 1], [0.1, 1]);
          const opacity = interpolate(spr, [0, 0.3], [0, 1], { extrapolateRight: 'clamp' });
          const rotateZ = interpolate(spr, [0, 1], [index % 2 === 0 ? -12 : 12, 0]);

          return (
            <span
              key={index}
              style={{
                display: 'inline-block',
                transform: `scale(${scale}) rotate(${rotateZ}deg)`,
                opacity,
                color: highlighted ? '#000000' : textColor,
                backgroundColor: highlighted ? highlightColor : 'transparent',
                padding: highlighted ? '0.05em 0.25em' : '0 0.05em',
                borderRadius: highlighted ? '4px' : '0',
                boxShadow: highlighted ? '0 8px 16px rgba(0,0,0,0.35)' : 'none',
              }}
            >
              {word}
            </span>
          );
        }

        if (mode === 'blur-reveal') {
          const spr = spring({
            frame: frame - delay,
            fps,
            config: { damping: 18, stiffness: 140 },
          });

          const blur = interpolate(spr, [0, 1], [18, 0]);
          const opacity = interpolate(spr, [0, 0.7], [0, 1], { extrapolateRight: 'clamp' });

          return (
            <span
              key={index}
              style={{
                display: 'inline-block',
                filter: `blur(${blur}px)`,
                opacity,
                color: highlighted ? highlightColor : textColor,
              }}
            >
              {word}
            </span>
          );
        }

        return <span key={index}>{word}</span>;
      })}
    </div>
  );
};
