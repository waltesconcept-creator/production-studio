import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';

export interface ChapterStickerProps {
  text?: string;
  topText?: string;   // e.g. "Three years"
  bottomText?: string; // e.g. "later"
  color?: string;     // sticker background color e.g. '#eab308' or '#ff5500'
  textColor?: string;
  rotation?: number;  // tilt angle e.g. -4 deg
  delay?: number;
  style?: React.CSSProperties;
}

export const ChapterSticker: React.FC<ChapterStickerProps> = ({
  text,
  topText,
  bottomText,
  color = '#eab308',
  textColor = '#ffffff',
  rotation = -4.5,
  delay = 5,
  style = {},
}) => {
  let displayTop = topText;
  let displayBottom = bottomText;

  if (text && !topText && !bottomText) {
    const parts = text.trim().split(' ');
    if (parts.length > 1) {
      displayTop = parts.slice(0, parts.length - 1).join(' ');
      displayBottom = parts[parts.length - 1];
    } else {
      displayTop = text;
      displayBottom = '';
    }
  }

  displayTop = displayTop || 'Three years';
  displayBottom = displayBottom !== undefined ? displayBottom : 'later';
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const spr = spring({
    frame: frame - delay,
    fps,
    config: { damping: 11, stiffness: 180 },
  });

  const scale = interpolate(spr, [0, 1], [0.6, 1]);
  const rot = interpolate(spr, [0, 1], [rotation * 2, rotation]);

  return (
    <div
      style={{
        position: 'relative',
        display: 'inline-block',
        backgroundColor: color,
        color: textColor,
        padding: '12px 32px 16px 32px',
        transform: `scale(${scale}) rotate(${rot}deg)`,
        transformOrigin: 'center center',
        clipPath: 'polygon(2% 0%, 98% 3%, 100% 96%, 1% 98%)',
        boxShadow: '0 12px 28px rgba(0,0,0,0.5), inset 0 0 10px rgba(0,0,0,0.15)',
        textAlign: 'center',
        margin: '0 auto',
        ...style,
      }}
    >
      {/* Top serif text */}
      {displayTop && (
        <div
          style={{
            fontFamily: '"Playfair Display", Georgia, serif',
            fontStyle: 'italic',
            fontSize: '32px',
            lineHeight: 1,
            letterSpacing: '0.02em',
            textShadow: '0 2px 4px rgba(0,0,0,0.3)',
          }}
        >
          {displayTop}
        </div>
      )}

      {/* Bottom script / bold text */}
      {displayBottom && (
        <div
          style={{
            fontFamily: '"Times New Roman", Georgia, serif',
            fontStyle: 'italic',
            fontWeight: 900,
            fontSize: '56px',
            lineHeight: 0.9,
            letterSpacing: '-0.02em',
            textShadow: '0 2px 6px rgba(0,0,0,0.4)',
          }}
        >
          {displayBottom}
        </div>
      )}
    </div>
  );
};
