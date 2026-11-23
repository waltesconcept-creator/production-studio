import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { CaptionSegment, WordTiming } from '../../types/story';

export interface AnimatedCaptionsProps {
  captions: CaptionSegment[];
  highlightColor?: string;
  textColor?: string;
  fontSize?: number | string;
  fontFamily?: string;
  pillBackground?: boolean;
  positionBottom?: number | string;
  style?: React.CSSProperties;
}

export const AnimatedCaptions: React.FC<AnimatedCaptionsProps> = ({
  captions,
  highlightColor = '#fffc00',
  textColor = '#ffffff',
  fontSize = 38,
  fontFamily = 'Impact, "Montserrat Black", "Arial Black", sans-serif',
  pillBackground = true,
  positionBottom = '12%',
  style = {},
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Find active caption segment for current frame
  const activeSegment = captions.find(
    (c) => frame >= c.startFrame && frame <= c.endFrame
  );

  if (!activeSegment) return null;

  // Compute word timings if not explicitly given
  const words: WordTiming[] = activeSegment.words || (() => {
    const rawWords = activeSegment.text.split(' ');
    const segDuration = activeSegment.endFrame - activeSegment.startFrame;
    const perWord = segDuration / rawWords.length;
    return rawWords.map((w, i) => ({
      word: w,
      startFrame: Math.floor(activeSegment.startFrame + i * perWord),
      endFrame: Math.floor(activeSegment.startFrame + (i + 1) * perWord),
    }));
  })();

  return (
    <div
      style={{
        position: 'absolute',
        bottom: positionBottom,
        left: '50%',
        transform: 'translateX(-50%)',
        textAlign: 'center',
        zIndex: 50,
        pointerEvents: 'none',
        maxWidth: '85%',
        ...style,
      }}
    >
      <div
        style={{
          display: 'inline-flex',
          flexWrap: 'wrap',
          justifyContent: 'center',
          alignItems: 'center',
          gap: '0.22em',
          backgroundColor: pillBackground ? 'rgba(0, 0, 0, 0.75)' : 'transparent',
          backdropFilter: pillBackground ? 'blur(8px)' : 'none',
          padding: pillBackground ? '10px 22px' : '0',
          borderRadius: '12px',
          boxShadow: pillBackground ? '0 8px 24px rgba(0,0,0,0.5)' : 'none',
          border: pillBackground ? '1px solid rgba(255,255,255,0.1)' : 'none',
        }}
      >
        {words.map((item, index) => {
          const isActive = frame >= item.startFrame && frame <= item.endFrame;

          // Spring bounce for active word
          const spr = spring({
            frame: frame - item.startFrame,
            fps,
            config: { damping: 10, stiffness: 240 },
          });

          const scale = isActive ? interpolate(spr, [0, 1], [0.95, 1.14]) : 1;
          const wordColor = isActive ? highlightColor : textColor;

          return (
            <span
              key={index}
              style={{
                fontFamily,
                fontSize,
                fontWeight: 900,
                color: wordColor,
                textTransform: 'uppercase',
                transform: `scale(${scale})`,
                transition: 'color 0.08s ease',
                textShadow: isActive
                  ? `0 0 16px ${highlightColor}88, 0 2px 4px rgba(0,0,0,0.9)`
                  : '0 2px 4px rgba(0,0,0,0.8)',
                letterSpacing: '-0.01em',
                display: 'inline-block',
                margin: '0 0.04em',
              }}
            >
              {item.word}
            </span>
          );
        })}
      </div>
    </div>
  );
};
