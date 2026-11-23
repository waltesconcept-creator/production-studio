import React from 'react';
import { interpolate, spring, staticFile, useCurrentFrame, useVideoConfig } from 'remotion';
import { ChromaticAberration } from '../effects/ChromaticAberration';
import { FilmGrain, CinemaVignette } from '../Atmosphere';
import { BrandWatermark } from '../BrandWatermark';
import { anton, inter, oswald, playfairItalic, poppins } from '../../mixedStyles';

export interface FlatHormoziSceneProps {
  // Top eyebrow / setup script
  setupText?: string;
  setupItalic?: boolean;

  // Punchline components
  punchlineMain: string;
  highlightWord?: string;
  punchlineSub?: string;

  // Hero visual asset
  heroCutoutSrc?: string;
  heroCutoutMaxHeight?: number;
  heroCutoutStyle?: 'raw' | 'circular' | 'card' | 'stamp';

  // Supporting background
  bgType?: 'dark-cinema' | 'paper-grid' | 'fullbleed-photo' | 'blueprint-grid';
  fullbleedPhotoSrc?: string;

  // Accent and styling
  accentColor?: string; // Default: #FF5500 (Electric Orange)
  paperColor?: string;

  // Optional badge items (e.g. 3 tags popping up)
  badges?: Array<{ text: string; icon?: string; delay?: number }>;

  // Strikethrough tags (e.g. "NOT A GOVERNOR")
  strikethroughs?: Array<{ text: string; delay?: number }>;

  // Frame timing offsets
  textStartFrame?: number;
  cutoutStartFrame?: number;
  highlightStartFrame?: number;
}

const resolveSrc = (s?: string): string => {
  if (!s) return '';
  if (s.startsWith('http://') || s.startsWith('https://') || s.startsWith('data:')) return s;
  const clean = s.startsWith('/') ? s.slice(1) : s;
  try {
    return staticFile(clean);
  } catch {
    return s;
  }
};

export const FlatHormoziScene: React.FC<FlatHormoziSceneProps> = ({
  setupText,
  setupItalic = true,
  punchlineMain,
  highlightWord,
  punchlineSub,
  heroCutoutSrc,
  heroCutoutMaxHeight = 520,
  heroCutoutStyle = 'raw',
  bgType = 'dark-cinema',
  fullbleedPhotoSrc,
  accentColor = '#FF5500',
  paperColor = '#F4EFE4',
  badges,
  strikethroughs,
  textStartFrame = 2,
  cutoutStartFrame = 8,
  highlightStartFrame = 16,
}) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  // Subtle natural 2D camera push (NO 3D slant!)
  const camScale = interpolate(frame, [0, durationInFrames], [1.0, 1.05], {
    extrapolateRight: 'clamp',
  });
  const camY = interpolate(frame, [0, durationInFrames], [0, -10], {
    extrapolateRight: 'clamp',
  });

  // Entrance spring animations
  const setupSpring = spring({
    frame: frame - textStartFrame,
    fps,
    config: { damping: 16, stiffness: 140 },
  });

  const cutoutSpring = spring({
    frame: frame - cutoutStartFrame,
    fps,
    config: { damping: 14, stiffness: 130 },
  });

  const highlightSpring = spring({
    frame: frame - highlightStartFrame,
    fps,
    config: { damping: 12, stiffness: 180 },
  });

  const subSpring = spring({
    frame: frame - (highlightStartFrame + 8),
    fps,
    config: { damping: 15, stiffness: 150 },
  });

  // Gentle float for hero cutout
  const floatY = Math.sin(frame * 0.08) * 6;

  const isLightBg = bgType === 'paper-grid';

  return (
    <div
      style={{
        position: 'relative',
        width: 1080,
        height: 1920,
        backgroundColor: isLightBg ? paperColor : '#07080A',
        overflow: 'hidden',
      }}
    >
      {/* ========================================================================= */}
      {/* 1. FULL-BLEED BACKGROUND LAYER (ZERO BOXES, ZERO SLANTS)                  */}
      {/* ========================================================================= */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          transform: `scale(${camScale}) translateY(${camY}px)`,
          transformOrigin: 'center center',
        }}
      >
        {bgType === 'fullbleed-photo' && fullbleedPhotoSrc && (
          <>
            <img
              src={resolveSrc(fullbleedPhotoSrc)}
              alt="Background"
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                filter: 'brightness(0.35) contrast(1.15) saturate(1.1)',
              }}
            />
            {/* Top & bottom subtle gradient for contrast */}
            <div
              style={{
                position: 'absolute',
                inset: 0,
                background:
                  'linear-gradient(180deg, rgba(7,8,10,0.85) 0%, rgba(7,8,10,0.2) 35%, rgba(7,8,10,0.4) 65%, rgba(7,8,10,0.92) 100%)',
              }}
            />
          </>
        )}

        {bgType === 'paper-grid' && (
          <div
            style={{
              position: 'absolute',
              inset: 0,
              backgroundColor: paperColor,
              backgroundImage: `
                linear-gradient(to right, rgba(92, 78, 60, 0.12) 1.5px, transparent 1.5px),
                linear-gradient(to bottom, rgba(92, 78, 60, 0.12) 1.5px, transparent 1.5px),
                radial-gradient(ellipse at 50% 45%, rgba(255,255,255,0.6) 0%, rgba(190,174,148,0.25) 100%)
              `,
              backgroundSize: '52px 52px, 52px 52px, 100% 100%',
            }}
          />
        )}

        {bgType === 'blueprint-grid' && (
          <div
            style={{
              position: 'absolute',
              inset: 0,
              backgroundColor: '#0C0908',
              backgroundImage: `
                linear-gradient(to right, rgba(255, 85, 0, 0.15) 1.5px, transparent 1.5px),
                linear-gradient(to bottom, rgba(255, 85, 0, 0.15) 1.5px, transparent 1.5px)
              `,
              backgroundSize: '64px 64px',
            }}
          >
            {/* Sweeping warm radial glow */}
            <div
              style={{
                position: 'absolute',
                inset: 0,
                background:
                  'radial-gradient(ellipse 65% 50% at 50% 45%, rgba(255, 85, 0, 0.22) 0%, rgba(0,0,0,0.88) 80%)',
              }}
            />
          </div>
        )}

        {bgType === 'dark-cinema' && (
          <div
            style={{
              position: 'absolute',
              inset: 0,
              backgroundColor: '#07080A',
              backgroundImage: `
                radial-gradient(rgba(255,255,255,0.08) 1.5px, transparent 1.5px),
                radial-gradient(ellipse 70% 55% at 50% 42%, rgba(255, 85, 0, 0.14) 0%, rgba(7,8,10,0.95) 75%)
              `,
              backgroundSize: '40px 40px, 100% 100%',
            }}
          />
        )}
      </div>

      {/* Atmospheric Overlays */}
      <FilmGrain opacity={0.07} />
      <CinemaVignette strength={isLightBg ? 0.35 : 0.65} />
      <BrandWatermark lightBackground={isLightBg} />

      {/* ========================================================================= */}
      {/* 2. CENTER-GRAVITY STACK (GOLDEN MIDDLE SAFE ZONE, OPTICAL BALANCE)       */}
      {/* ========================================================================= */}
      <div
        style={{
          position: 'absolute',
          top: 140,
          bottom: 140,
          left: 60,
          right: 60,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 20,
          gap: 28,
        }}
      >
        {/* SETUP / EYEBROW SCRIPT */}
        {setupText && (
          <div
            style={{
              fontFamily: setupItalic ? playfairItalic.fontFamily : poppins.fontFamily,
              fontStyle: setupItalic ? 'italic' : 'normal',
              fontWeight: setupItalic ? 500 : 600,
              fontSize: 48,
              lineHeight: 1.2,
              color: isLightBg ? '#4A4036' : 'rgba(255, 244, 230, 0.85)',
              textAlign: 'center',
              letterSpacing: '0.01em',
              textShadow: isLightBg ? 'none' : '0 4px 16px rgba(0,0,0,0.8)',
              opacity: setupSpring,
              transform: `translateY(${interpolate(setupSpring, [0, 1], [24, 0])}px)`,
              maxWidth: 900,
            }}
          >
            {setupText}
          </div>
        )}

        {/* HERO CUTOUT (FRONT-FACING, NATURAL SPRING POP, RICH DROP SHADOW) */}
        {heroCutoutSrc && (
          <div
            style={{
              position: 'relative',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              opacity: cutoutSpring,
              transform: `scale(${interpolate(cutoutSpring, [0, 1], [0.75, 1])}) translateY(${
                interpolate(cutoutSpring, [0, 1], [60, 0]) + floatY
              }px)`,
              zIndex: 10,
            }}
          >
            {/* Halftone Circular Aura behind cutout */}
            <div
              style={{
                position: 'absolute',
                width: heroCutoutMaxHeight * 1.05,
                height: heroCutoutMaxHeight * 1.05,
                borderRadius: '50%',
                background: isLightBg
                  ? 'radial-gradient(circle, rgba(242, 92, 25, 0.18) 0%, rgba(242, 92, 25, 0) 70%)'
                  : 'radial-gradient(circle, rgba(255, 85, 0, 0.28) 0%, rgba(255, 85, 0, 0) 70%)',
                zIndex: -1,
                pointerEvents: 'none',
              }}
            />

            <img
              src={resolveSrc(heroCutoutSrc)}
              alt="Hero Cutout"
              style={{
                maxHeight: heroCutoutMaxHeight,
                maxWidth: 880,
                objectFit: 'contain',
                filter: isLightBg
                  ? 'drop-shadow(0 20px 32px rgba(30, 24, 18, 0.35))'
                  : 'drop-shadow(0 26px 50px rgba(0,0,0,0.92))',
              }}
            />
          </div>
        )}

        {/* STRIKETHROUGH BADGES (For Scene 3 / "Not a Governor", "Not a Senator") */}
        {strikethroughs && strikethroughs.length > 0 && (
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: 14,
              alignItems: 'center',
              width: '100%',
              maxWidth: 820,
            }}
          >
            {strikethroughs.map((st, idx) => {
              const delay = st.delay ?? 10 + idx * 8;
              const spr = spring({ frame: frame - delay, fps, config: { damping: 14, stiffness: 200 } });
              return (
                <div
                  key={idx}
                  style={{
                    position: 'relative',
                    display: 'inline-block',
                    padding: '8px 24px',
                    backgroundColor: isLightBg ? '#E6E0D3' : 'rgba(255,255,255,0.08)',
                    borderRadius: 8,
                    border: isLightBg ? '1.5px solid rgba(0,0,0,0.1)' : '1.5px solid rgba(255,255,255,0.14)',
                    opacity: spr,
                    transform: `scale(${interpolate(spr, [0, 1], [0.8, 1])})`,
                  }}
                >
                  <span
                    style={{
                      fontFamily: oswald.fontFamily,
                      fontWeight: 700,
                      fontSize: 42,
                      letterSpacing: '0.06em',
                      color: isLightBg ? '#2B2620' : '#FFFFFF',
                      textTransform: 'uppercase',
                    }}
                  >
                    {st.text}
                  </span>
                  {/* Aggressive Red Strikethrough Bar */}
                  <div
                    style={{
                      position: 'absolute',
                      top: '50%',
                      left: -12,
                      right: -12,
                      height: 8,
                      backgroundColor: '#E1261C',
                      borderRadius: 4,
                      boxShadow: '0 4px 12px rgba(225, 38, 28, 0.6)',
                      transformOrigin: 'left center',
                      transform: `translateY(-50%) rotate(-2deg) scaleX(${spr})`,
                    }}
                  />
                </div>
              );
            })}
          </div>
        )}

        {/* SUPPORTING BADGES (e.g. Hospital Bills, Settled Fights, Hot Food) */}
        {badges && badges.length > 0 && (
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              justifyContent: 'center',
              gap: 16,
              maxWidth: 880,
            }}
          >
            {badges.map((b, idx) => {
              const delay = b.delay ?? 10 + idx * 6;
              const spr = spring({ frame: frame - delay, fps, config: { damping: 14, stiffness: 220 } });
              return (
                <div
                  key={idx}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 10,
                    padding: '12px 26px',
                    backgroundColor: isLightBg ? '#1D1914' : 'rgba(255,255,255,0.12)',
                    borderRadius: 999,
                    border: '1.5px solid rgba(255,255,255,0.15)',
                    boxShadow: '0 12px 24px rgba(0,0,0,0.35)',
                    opacity: spr,
                    transform: `scale(${interpolate(spr, [0, 1], [0.65, 1])}) translateY(${interpolate(
                      spr,
                      [0, 1],
                      [20, 0]
                    )}px)`,
                  }}
                >
                  {b.icon && <span style={{ fontSize: 32 }}>{b.icon}</span>}
                  <span
                    style={{
                      fontFamily: poppins.fontFamily,
                      fontWeight: 800,
                      fontSize: 34,
                      color: '#FFFDF9',
                      letterSpacing: '-0.01em',
                    }}
                  >
                    {b.text}
                  </span>
                </div>
              );
            })}
          </div>
        )}

        {/* PUNCHLINE MAIN & HIGHLIGHT PILL */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            textAlign: 'center',
            width: '100%',
          }}
        >
          {/* Main Punchline Text */}
          {punchlineMain && (
            <div
              style={{
                fontFamily: anton.fontFamily,
                fontSize: 88,
                lineHeight: 0.98,
                letterSpacing: '0.03em',
                color: isLightBg ? '#161412' : '#FFFFFF',
                textTransform: 'uppercase',
                textShadow: isLightBg ? 'none' : '0 10px 30px rgba(0,0,0,0.9)',
                opacity: highlightSpring,
                transform: `scale(${interpolate(highlightSpring, [0, 1], [0.85, 1])}) translateY(${interpolate(
                  highlightSpring,
                  [0, 1],
                  [20, 0]
                )}px)`,
              }}
            >
              {punchlineMain}
            </div>
          )}

          {/* SOLID ELECTRIC ORANGE HIGHLIGHT PILL / BOX */}
          {highlightWord && (
            <div
              style={{
                marginTop: 16,
                display: 'inline-block',
                backgroundColor: accentColor,
                color: '#FFFFFF',
                fontFamily: anton.fontFamily,
                fontSize: 84,
                lineHeight: 1.05,
                letterSpacing: '0.04em',
                textTransform: 'uppercase',
                padding: '12px 38px 16px',
                borderRadius: 16,
                boxShadow: `0 18px 45px rgba(255, 85, 0, 0.55), 0 4px 0 rgba(0,0,0,0.2)`,
                opacity: highlightSpring,
                transform: `rotate(-1.5deg) scale(${interpolate(highlightSpring, [0, 1], [0.65, 1])})`,
              }}
            >
              <ChromaticAberration intensity={frame % 20 < 4 ? 3 : 0}>
                {highlightWord}
              </ChromaticAberration>
            </div>
          )}

          {/* Punchline Sub / Tag */}
          {punchlineSub && (
            <div
              style={{
                marginTop: 18,
                fontFamily: oswald.fontFamily,
                fontWeight: 700,
                fontSize: 44,
                letterSpacing: '0.08em',
                color: isLightBg ? '#5C5042' : 'rgba(255, 255, 255, 0.78)',
                textTransform: 'uppercase',
                opacity: subSpring,
                transform: `translateY(${interpolate(subSpring, [0, 1], [16, 0])}px)`,
              }}
            >
              {punchlineSub}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
