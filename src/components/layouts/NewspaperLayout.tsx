import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { TextHighlighter } from '../typography/TextHighlighter';
import { RedactedText } from '../typography/RedactedText';
import { resolveAsset } from '../../assets/svgAssets';

export interface NewspaperLayoutProps {
  masthead?: string;
  issueDate?: string;
  price?: string;
  edition?: string;
  headline: string;
  subheadline?: string;
  imageSrc?: string;
  imageCaption?: string;
  columns?: string[];
  highlightText?: string;
  redactedText?: string;
  zoomTarget?: 'headline' | 'image' | 'article' | 'full';
  style?: React.CSSProperties;
}

export const NewspaperLayout: React.FC<NewspaperLayoutProps> = ({
  masthead = 'THE CHRONICLE DISPATCH',
  issueDate = 'OCTOBER 29, 1929',
  price = 'THREE CENTS',
  edition = 'LATE CITY EDITION',
  headline,
  subheadline,
  imageSrc,
  imageCaption,
  columns = [
    'Markets experienced unprecedented turbulence in early morning trading today as panic selling triggered massive liquidation across all major institutional desks.',
    'Senior officials convened an emergency closed-door meeting at noon to address liquidity concerns. Witnesses reported intense deliberations as market volatility escalated to historic highs.',
    'Analysts warn that structural shifts will reverberate throughout global supply chains for the foreseeable future, reshaping monetary policies across international borders.',
  ],
  highlightText,
  redactedText,
  zoomTarget = 'headline',
  style = {},
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Entrance spring for newspaper drop onto the desk
  const dropSpring = spring({
    frame,
    fps,
    config: { damping: 14, stiffness: 120, mass: 0.9 },
  });

  const baseScale = interpolate(dropSpring, [0, 1], [1.35, 1]);
  const rotation = interpolate(dropSpring, [0, 1], [-4, -0.5]);

  // Subtle slow push-in camera effect
  const slowPush = interpolate(frame, [0, 150], [1, 1.08]);

  return (
    <div
      style={{
        position: 'relative',
        width: '100%',
        maxWidth: '1100px',
        margin: '0 auto',
        backgroundColor: '#f5edd6', // aged yellowed newsprint
        backgroundImage: 'radial-gradient(circle at 50% 50%, rgba(255,255,255,0.2) 0%, rgba(0,0,0,0.06) 100%)',
        color: '#1a1917',
        fontFamily: '"Times New Roman", Times, Georgia, serif',
        padding: '36px 48px',
        boxShadow: '0 25px 60px rgba(0,0,0,0.45), 0 0 0 1px rgba(0,0,0,0.1)',
        transform: `scale(${baseScale * slowPush}) rotate(${rotation}deg)`,
        transformOrigin: zoomTarget === 'headline' ? 'center 30%' : 'center center',
        ...style,
      }}
    >
      {/* Paper fold line crease in center */}
      <div
        style={{
          position: 'absolute',
          top: '50%',
          left: 0,
          right: 0,
          height: '2px',
          background: 'linear-gradient(to bottom, rgba(0,0,0,0.12), rgba(255,255,255,0.4))',
          pointerEvents: 'none',
        }}
      />

      {/* Top Header metadata */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          fontSize: '12px',
          fontWeight: 700,
          letterSpacing: '0.15em',
          borderBottom: '2px solid #1a1917',
          paddingBottom: '4px',
          textTransform: 'uppercase',
        }}
      >
        <span>{edition}</span>
        <span>{issueDate}</span>
        <span>{price}</span>
      </div>

      {/* Masthead */}
      <div
        style={{
          textAlign: 'center',
          padding: '16px 0 10px 0',
          borderBottom: '4px double #1a1917',
        }}
      >
        <h1
          style={{
            fontFamily: '"Playfair Display", "Times New Roman", serif',
            fontSize: '56px',
            fontWeight: 900,
            letterSpacing: '0.06em',
            margin: 0,
            textTransform: 'uppercase',
            lineHeight: 1,
          }}
        >
          {masthead}
        </h1>
        <div
          style={{
            fontSize: '11px',
            letterSpacing: '0.3em',
            marginTop: '6px',
            textTransform: 'uppercase',
            fontWeight: 600,
          }}
        >
          The Voice of Authority Since 1888
        </div>
      </div>

      {/* Main Headline */}
      <div
        style={{
          textAlign: 'center',
          padding: '20px 0 14px 0',
          borderBottom: '1px solid #1a1917',
        }}
      >
        <h2
          style={{
            fontSize: '44px',
            fontWeight: 900,
            lineHeight: 1.05,
            margin: 0,
            letterSpacing: '-0.02em',
            textTransform: 'uppercase',
          }}
        >
          {headline}
        </h2>
        {subheadline && (
          <p
            style={{
              fontSize: '18px',
              fontStyle: 'italic',
              margin: '8px 0 0 0',
              fontWeight: 500,
              color: '#333',
            }}
          >
            {subheadline}
          </p>
        )}
      </div>

      {/* Article Columns & Photo layout */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: imageSrc ? '1fr 1.2fr 1fr' : '1fr 1fr 1fr',
          gap: '24px',
          paddingTop: '18px',
          fontSize: '13px',
          lineHeight: 1.5,
          textAlign: 'justify',
        }}
      >
        {/* Column 1 */}
        <div style={{ borderRight: '1px solid rgba(0,0,0,0.15)', paddingRight: '20px' }}>
          <p style={{ margin: 0 }}>
            <span
              style={{
                float: 'left',
                fontSize: '42px',
                lineHeight: 0.8,
                paddingRight: '6px',
                paddingTop: '4px',
                fontWeight: 900,
                fontFamily: 'serif',
              }}
            >
              {columns[0]?.[0] || 'M'}
            </span>
            {columns[0]?.slice(1)}
          </p>
          {highlightText && (
            <div style={{ marginTop: '12px' }}>
              <TextHighlighter delay={25} durationInFrames={30}>
                {highlightText}
              </TextHighlighter>
            </div>
          )}
        </div>

        {/* Column 2 (or Image Feature) */}
        {imageSrc ? (
          <div style={{ textAlign: 'center' }}>
            <div
              style={{
                backgroundColor: '#ffffff',
                padding: '6px',
                border: '1px solid #1a1917',
                boxShadow: '0 4px 10px rgba(0,0,0,0.12)',
              }}
            >
              <img
                src={resolveAsset(imageSrc)}
                alt="Article illustration"
                style={{
                  width: '100%',
                  height: '180px',
                  objectFit: 'cover',
                  filter: 'grayscale(100%) contrast(140%)',
                  display: 'block',
                }}
              />
              {imageCaption && (
                <div
                  style={{
                    fontSize: '10px',
                    fontStyle: 'italic',
                    marginTop: '6px',
                    color: '#444',
                  }}
                >
                  {imageCaption}
                </div>
              )}
            </div>
            {columns[1] && (
              <p style={{ marginTop: '12px', fontSize: '12px', lineHeight: 1.45 }}>
                {columns[1]}
              </p>
            )}
          </div>
        ) : (
          <div style={{ borderRight: '1px solid rgba(0,0,0,0.15)', paddingRight: '20px' }}>
            <p style={{ margin: 0 }}>{columns[1]}</p>
          </div>
        )}

        {/* Column 3 */}
        <div>
          <p style={{ margin: 0 }}>
            {columns[2] || columns[0]}
          </p>
          {redactedText && (
            <div style={{ marginTop: '14px', fontWeight: 600 }}>
              Classified intelligence excerpt:{' '}
              <RedactedText delay={35} durationInFrames={20}>
                {redactedText}
              </RedactedText>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
