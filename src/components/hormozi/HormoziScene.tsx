import React from 'react';
import { interpolate, spring, staticFile, useCurrentFrame, useVideoConfig } from 'remotion';
import { ChromaticAberration } from '../effects/ChromaticAberration';
import { HalftoneEffect } from '../effects/HalftoneEffect';

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

export interface HormoziSceneProps {
  topScript: string;
  cutoutSrc: string;
  isHalftone?: boolean;
  highlightWord: string;
  punchlinePrefix?: string;
  punchlineSuffix?: string;
  accentColor?: string; // Electric Orange (#ff5500)
  paperColor?: string;  // Off-white / Cream (#f5f2eb)
  darkTheme?: boolean;
  watermark?: string;
  floatingAssetSrc?: string;
  documentSnippet?: string;
  cameraTilt?: {
    rotateX?: number;
    rotateY?: number;
    rotateZ?: number;
  };
}

export const HormoziScene: React.FC<HormoziSceneProps> = ({
  topScript,
  cutoutSrc,
  isHalftone = true,
  highlightWord,
  punchlinePrefix,
  punchlineSuffix,
  accentColor = '#ff5500',
  paperColor = '#f5f2eb',
  darkTheme = false,
  watermark = '@production.studio',
  floatingAssetSrc,
  documentSnippet = 'Chief Lamidi Adedibu was an influential power broker and traditional aristocrat in Ibadan, Oyo State, widely regarded as the godfather of grassroots politics.',
  cameraTilt = { rotateX: 10, rotateY: -7, rotateZ: 2.5 },
}) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  // 1. Handheld Camera Drift & Perspective Motion
  const camProgress = frame / durationInFrames;
  const currentRotX = interpolate(camProgress, [0, 1], [cameraTilt.rotateX || 10, (cameraTilt.rotateX || 10) - 4]);
  const currentRotY = interpolate(camProgress, [0, 1], [cameraTilt.rotateY || -7, (cameraTilt.rotateY || -7) + 3]);
  const currentRotZ = interpolate(camProgress, [0, 1], [cameraTilt.rotateZ || 2.5, (cameraTilt.rotateZ || 2.5) - 1.5]);
  const currentZoom = interpolate(camProgress, [0, 1], [1.02, 1.10]);
  const handheldWobbleX = Math.sin(frame * 0.08) * 3;
  const handheldWobbleY = Math.cos(frame * 0.06) * 2;

  // 2. Entrance Springs
  const topTextSpr = spring({ frame: frame - 2, fps, config: { damping: 12, stiffness: 140 } });
  const cutoutSpr = spring({ frame: frame - 8, fps, config: { damping: 11, stiffness: 130 } });
  const punchlineSpr = spring({ frame: frame - 16, fps, config: { damping: 12, stiffness: 160 } });
  const floatingSpr = spring({ frame: frame - 24, fps, config: { damping: 10, stiffness: 110 } });

  // Floating prop oscillation
  const floatOffsetY = Math.sin(frame * 0.1) * 8;
  const floatRot = Math.cos(frame * 0.08) * 4;

  const bgCanvasColor = darkTheme ? '#0b0b0e' : paperColor;
  const textColorPrimary = darkTheme ? '#ffffff' : '#141416';
  const gridDotColor = darkTheme ? 'rgba(255,255,255,0.12)' : 'rgba(0,0,0,0.12)';

  return (
    <div
      style={{
        position: 'relative',
        width: '100%',
        height: '100%',
        backgroundColor: '#050507',
        overflow: 'hidden',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        perspective: '1300px',
      }}
    >
      {/* Outer Cinema Vignette */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: 'radial-gradient(circle at center, transparent 40%, rgba(0,0,0,0.85) 100%)',
          zIndex: 30,
          pointerEvents: 'none',
        }}
      />

      {/* Decorative Geometric Wireframe in Top-Right Corner */}
      <div
        style={{
          position: 'absolute',
          top: '-40px',
          right: '-40px',
          width: '320px',
          height: '320px',
          opacity: 0.25,
          zIndex: 2,
          pointerEvents: 'none',
        }}
      >
        <svg viewBox="0 0 100 100" width="100%" height="100%">
          <polygon points="50,5 90,30 90,80 50,95 10,80 10,30" fill="none" stroke="#ffffff" strokeWidth="0.8" />
          <polygon points="50,5 50,95" fill="none" stroke="#ffffff" strokeWidth="0.6" strokeDasharray="2,2" />
          <polygon points="90,30 10,80" fill="none" stroke="#ffffff" strokeWidth="0.6" strokeDasharray="2,2" />
          <polygon points="10,30 90,80" fill="none" stroke="#ffffff" strokeWidth="0.6" strokeDasharray="2,2" />
        </svg>
      </div>

      {/* 3D Tilted Paper Canvas */}
      <div
        style={{
          position: 'relative',
          width: '900px',
          height: '1580px',
          backgroundColor: bgCanvasColor,
          borderRadius: '16px',
          boxShadow: '0 40px 100px rgba(0,0,0,0.9), 0 10px 30px rgba(0,0,0,0.6)',
          transform: `scale(${currentZoom}) rotateX(${currentRotX}deg) rotateY(${currentRotY}deg) rotateZ(${currentRotZ}deg) translate(${handheldWobbleX}px, ${handheldWobbleY}px)`,
          transformOrigin: 'center center',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '60px 48px',
          boxSizing: 'border-box',
          overflow: 'hidden',
          zIndex: 10,
        }}
      >
        {/* Paper Surface Dot-Grid Texture */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backgroundImage: `radial-gradient(${gridDotColor} 1.5px, transparent 1.5px)`,
            backgroundSize: '36px 36px',
            opacity: 0.8,
            pointerEvents: 'none',
          }}
        />

        {/* Paper Corner Border Lines */}
        <div
          style={{
            position: 'absolute',
            inset: '24px',
            border: `1px solid ${darkTheme ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)'}`,
            pointerEvents: 'none',
          }}
        />

        {/* ========================================================================= */}
        {/* CENTER CONCENTRATED STACK (Alex Hormozi Style)                             */}
        {/* ========================================================================= */}
        <div
          style={{
            position: 'relative',
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 15,
            marginTop: '-40px',
          }}
        >
          {/* 1. TOP SCRIPT: Italic Cursive with Chromatic Aberration */}
          <div
            style={{
              opacity: interpolate(topTextSpr, [0, 1], [0, 1]),
              transform: `translateY(${interpolate(topTextSpr, [0, 1], [-20, 0])}px)`,
              textAlign: 'center',
              marginBottom: '20px',
              maxWidth: '820px',
            }}
          >
            <ChromaticAberration intensity={interpolate(topTextSpr, [0, 0.8, 1], [8, 4, 2.5])}>
              <div
                style={{
                  fontFamily: '"Playfair Display", Georgia, "Times New Roman", serif',
                  fontStyle: 'italic',
                  fontWeight: 600,
                  fontSize: '54px',
                  lineHeight: 1.15,
                  color: textColorPrimary,
                  letterSpacing: '0.01em',
                  textShadow: darkTheme
                    ? '0 4px 12px rgba(0,0,0,0.6)'
                    : '0 2px 8px rgba(0,0,0,0.1)',
                }}
              >
                {topScript}
              </div>
            </ChromaticAberration>
          </div>

          {/* 2. CENTER CUTOUT: Halftone Dot Matrix Circular Portrait / Prop */}
          <div
            style={{
              position: 'relative',
              width: '460px',
              height: '460px',
              margin: '16px 0 28px 0',
              opacity: interpolate(cutoutSpr, [0, 1], [0, 1]),
              transform: `scale(${interpolate(cutoutSpr, [0, 1], [0.82, 1])})`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {/* Halftone Dot Aura Ring in background */}
            <div
              style={{
                position: 'absolute',
                width: '520px',
                height: '520px',
                borderRadius: '50%',
                backgroundImage: `radial-gradient(circle, ${darkTheme ? 'rgba(255,255,255,0.18)' : 'rgba(0,0,0,0.14)'} 2.5px, transparent 2.5px)`,
                backgroundSize: '16px 16px',
                opacity: 0.9,
                maskImage: 'radial-gradient(circle at center, black 40%, transparent 70%)',
                WebkitMaskImage: 'radial-gradient(circle at center, black 40%, transparent 70%)',
                pointerEvents: 'none',
              }}
            />

            {isHalftone ? (
              <HalftoneEffect shape="circle" dotSize={4.0} width={440} height={440}>
                <img
                  src={resolveSrc(cutoutSrc)}
                  alt="Subject Cutout"
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    filter: darkTheme ? 'contrast(1.15) brightness(1.05)' : 'contrast(1.15) grayscale(0.2)',
                  }}
                />
              </HalftoneEffect>
            ) : (
              <div
                style={{
                  width: '420px',
                  height: '420px',
                  borderRadius: '24px',
                  overflow: 'hidden',
                  boxShadow: '0 25px 50px rgba(0,0,0,0.45)',
                  border: `4px solid ${darkTheme ? 'rgba(255,255,255,0.15)' : '#ffffff'}`,
                }}
              >
                <img
                  src={resolveSrc(cutoutSrc)}
                  alt="Subject Cutout"
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                  }}
                />
              </div>
            )}

            {/* Optional Floating Asset Prop (e.g. Fanned Cash, Hook, Plane) */}
            {floatingAssetSrc && (
              <div
                style={{
                  position: 'absolute',
                  top: '-30px',
                  right: '-40px',
                  width: '180px',
                  height: '180px',
                  opacity: interpolate(floatingSpr, [0, 1], [0, 1]),
                  transform: `translateY(${floatOffsetY}px) rotate(${floatRot + 12}deg) scale(${interpolate(floatingSpr, [0, 1], [0.6, 1])})`,
                  filter: 'drop-shadow(0 15px 25px rgba(0,0,0,0.5))',
                  zIndex: 20,
                }}
              >
                <img
                  src={resolveSrc(floatingAssetSrc)}
                  alt="Floating Prop"
                  style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                />
              </div>
            )}
          </div>

          {/* 3. BOTTOM PUNCHLINE: Heavy Impact Sans with Solid Orange Highlight Box */}
          <div
            style={{
              opacity: interpolate(punchlineSpr, [0, 1], [0, 1]),
              transform: `translateY(${interpolate(punchlineSpr, [0, 1], [25, 0])}px) scale(${interpolate(punchlineSpr, [0, 1], [0.92, 1])})`,
              textAlign: 'center',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '12px',
              maxWidth: '820px',
            }}
          >
            {punchlinePrefix && (
              <div
                style={{
                  fontFamily: 'Impact, "Montserrat Black", "Arial Black", sans-serif',
                  fontSize: '44px',
                  color: textColorPrimary,
                  letterSpacing: '0.04em',
                  textTransform: 'uppercase',
                }}
              >
                {punchlinePrefix}
              </div>
            )}

            {/* The Signature Hormozi Solid Orange Highlight Box */}
            <div
              style={{
                display: 'inline-block',
                backgroundColor: accentColor,
                color: '#ffffff',
                padding: '10px 24px 14px 24px',
                borderRadius: '6px',
                fontFamily: 'Impact, "Montserrat Black", "Arial Black", sans-serif',
                fontSize: '60px',
                lineHeight: 1,
                letterSpacing: '0.05em',
                textTransform: 'uppercase',
                boxShadow: '0 12px 30px rgba(255, 85, 0, 0.45)',
                transform: 'skewX(-2deg)',
              }}
            >
              {highlightWord}
            </div>

            {punchlineSuffix && (
              <div
                style={{
                  fontFamily: 'Impact, "Montserrat Black", "Arial Black", sans-serif',
                  fontSize: '44px',
                  color: darkTheme ? '#cbd5e1' : '#4b5563',
                  letterSpacing: '0.04em',
                  textTransform: 'uppercase',
                }}
              >
                {punchlineSuffix}
              </div>
            )}
          </div>
        </div>

        {/* Faint Blurred Document Snippet at Bottom of Paper Canvas */}
        <div
          style={{
            position: 'absolute',
            bottom: '45px',
            width: '85%',
            textAlign: 'center',
            opacity: 0.35,
            filter: 'blur(1.2px)',
            pointerEvents: 'none',
          }}
        >
          <div
            style={{
              fontFamily: '"Courier New", Courier, monospace',
              fontSize: '15px',
              lineHeight: 1.4,
              color: textColorPrimary,
              letterSpacing: '0.02em',
            }}
          >
            {documentSnippet}
          </div>
        </div>

        {/* Subtle Creator Handle Watermark */}
        <div
          style={{
            position: 'absolute',
            bottom: '18px',
            textAlign: 'center',
            fontFamily: '"Montserrat", sans-serif',
            fontSize: '16px',
            fontWeight: 700,
            color: darkTheme ? 'rgba(255,255,255,0.25)' : 'rgba(0,0,0,0.3)',
            letterSpacing: '0.1em',
          }}
        >
          {watermark}
        </div>
      </div>
    </div>
  );
};
