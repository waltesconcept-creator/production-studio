import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { resolveAsset } from '../../assets/svgAssets';

export interface MagazineCoverProps {
  publication?: string;
  issueDate?: string;
  headline: string;
  subheadlines?: string[];
  subjectImageSrc: string;
  subjectName?: string;
  bannerText?: string;
  style?: React.CSSProperties;
}

export const MagazineCover: React.FC<MagazineCoverProps> = ({
  publication = 'VENTURE',
  issueDate = 'SPECIAL EDITION // $14.99',
  headline = 'THE $100B BREAKTHROUGH',
  subheadlines = [
    'How one solitary chipmaker hijacked the future of artificial intelligence',
    'Silicon Valley secret syndicates exposed',
    'The 30 Founders revolutionizing clean energy',
  ],
  subjectImageSrc,
  subjectName = 'JENSEN HUANG',
  bannerText = 'EXCLUSIVE INVESTIGATION',
  style = {},
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const spr = spring({
    frame,
    fps,
    config: { damping: 14, stiffness: 140 },
  });

  const scale = interpolate(spr, [0, 1], [0.85, 1]);
  const rot = interpolate(spr, [0, 1], [5, -1]);

  return (
    <div
      style={{
        position: 'relative',
        width: '480px',
        height: '640px',
        backgroundColor: '#0a0a0a',
        overflow: 'hidden',
        boxShadow: '0 30px 80px rgba(0,0,0,0.7), 0 0 0 1px rgba(255,255,255,0.1)',
        transform: `scale(${scale}) rotate(${rot}deg)`,
        margin: '0 auto',
        borderRadius: '4px',
        ...style,
      }}
    >
      {/* Top Banner */}
      <div
        style={{
          backgroundColor: '#ff2244',
          color: '#ffffff',
          textAlign: 'center',
          fontSize: '11px',
          fontWeight: 900,
          letterSpacing: '0.25em',
          padding: '6px 0',
        }}
      >
        {bannerText}
      </div>

      {/* Publication Masthead Behind Subject */}
      <div
        style={{
          position: 'absolute',
          top: '28px',
          left: 0,
          right: 0,
          textAlign: 'center',
          fontFamily: 'Impact, "Bebas Neue", sans-serif',
          fontSize: '92px',
          fontWeight: 900,
          letterSpacing: '0.08em',
          color: '#ffffff',
          lineHeight: 0.9,
          zIndex: 1,
          textTransform: 'uppercase',
        }}
      >
        {publication}
      </div>

      {/* Date / Price line */}
      <div
        style={{
          position: 'absolute',
          top: '115px',
          left: '20px',
          right: '20px',
          display: 'flex',
          justifyContent: 'space-between',
          fontSize: '10px',
          fontWeight: 700,
          letterSpacing: '0.15em',
          color: '#ffffff',
          zIndex: 1,
          borderTop: '1px solid rgba(255,255,255,0.3)',
          paddingTop: '4px',
        }}
      >
        <span>{issueDate}</span>
        <span>ISSUE 448</span>
      </div>

      {/* Cutout Subject breaking out in front */}
      <div
        style={{
          position: 'absolute',
          bottom: 0,
          left: '50%',
          transform: 'translateX(-50%)',
          width: '95%',
          height: '75%',
          zIndex: 2,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'flex-end',
        }}
      >
        <img
          src={resolveAsset(subjectImageSrc)}
          alt={subjectName}
          style={{
            maxHeight: '100%',
            maxWidth: '100%',
            objectFit: 'contain',
            filter: 'drop-shadow(0 15px 25px rgba(0,0,0,0.8))',
          }}
        />
      </div>

      {/* Front Headlines Overlay */}
      <div
        style={{
          position: 'absolute',
          bottom: '30px',
          left: '24px',
          right: '24px',
          zIndex: 3,
          color: '#ffffff',
        }}
      >
        <div
          style={{
            fontSize: '14px',
            fontWeight: 800,
            color: '#ffe600',
            letterSpacing: '0.15em',
            marginBottom: '4px',
            textTransform: 'uppercase',
          }}
        >
          {subjectName}
        </div>
        <h2
          style={{
            fontSize: '36px',
            fontWeight: 900,
            lineHeight: 0.95,
            letterSpacing: '-0.02em',
            textTransform: 'uppercase',
            margin: '0 0 10px 0',
            fontFamily: 'Impact, sans-serif',
            textShadow: '0 2px 10px rgba(0,0,0,0.9)',
          }}
        >
          {headline}
        </h2>
        <div
          style={{
            fontSize: '12px',
            lineHeight: 1.35,
            color: '#e0e0e0',
            textShadow: '0 1px 4px rgba(0,0,0,0.9)',
            borderLeft: '3px solid #ff2244',
            paddingLeft: '8px',
          }}
        >
          {subheadlines[0]}
        </div>
      </div>
    </div>
  );
};
