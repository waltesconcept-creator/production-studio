import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { RedactedText } from '../typography/RedactedText';
import { TextHighlighter } from '../typography/TextHighlighter';

export interface DocumentViewerProps {
  classification?: 'TOP SECRET' | 'CONFIDENTIAL' | 'DECLASSIFIED' | 'INTERNAL ONLY' | 'EXHIBIT A';
  docNumber?: string;
  date?: string;
  recipient?: string;
  sender?: string;
  subject?: string;
  bodyParagraphs?: string[];
  stampDelay?: number;
  highlightPhrase?: string;
  redactedPhrase?: string;
  style?: React.CSSProperties;
}

export const DocumentViewer: React.FC<DocumentViewerProps> = ({
  classification = 'DECLASSIFIED',
  docNumber = 'MEMO-1984-SEC-092',
  date = 'NOVEMBER 12, 1984',
  recipient = 'BOARD OF DIRECTORS',
  sender = 'OFFICE OF THE CTO',
  subject = 'PROJECT HYPERION: ANOMALOUS SYSTEM OBSERVATIONS',
  bodyParagraphs = [
    'Preliminary tests conducted across the distributed cluster revealed unexpected emergent properties in the network routing tables.',
    'Access protocols were temporarily compromised before automatic failover mechanisms were deployed by cybersecurity response units.',
    'Immediate compartmentalization is advised until forensic analysis confirms system containment.',
  ],
  stampDelay = 20,
  highlightPhrase,
  redactedPhrase,
  style = {},
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Rubber stamp entrance spring slam
  const stampSpring = spring({
    frame: frame - stampDelay,
    fps,
    config: { damping: 10, stiffness: 220, mass: 0.6 },
  });

  const stampScale = interpolate(stampSpring, [0, 1], [2.2, 1]);
  const stampOpacity = interpolate(stampSpring, [0, 0.2], [0, 0.9], { extrapolateRight: 'clamp' });

  return (
    <div
      style={{
        position: 'relative',
        width: '100%',
        maxWidth: '900px',
        margin: '0 auto',
        backgroundColor: '#faf6ea',
        padding: '50px 60px',
        fontFamily: '"Courier New", Courier, monospace',
        color: '#222222',
        boxShadow: '0 20px 50px rgba(0,0,0,0.5), inset 0 0 40px rgba(180,150,100,0.15)',
        border: '1px solid #dcd4b8',
        borderRadius: '2px',
        ...style,
      }}
    >
      {/* Top classification banner */}
      <div
        style={{
          textAlign: 'center',
          fontWeight: 800,
          letterSpacing: '0.25em',
          fontSize: '14px',
          color: '#aa2222',
          borderBottom: '2px dashed #aa2222',
          paddingBottom: '8px',
          marginBottom: '28px',
        }}
      >
        --- {classification} DOCUMENT ---
      </div>

      {/* Memo metadata fields */}
      <div style={{ fontSize: '14px', lineHeight: 1.8, marginBottom: '24px' }}>
        <div><strong>FILE ID:</strong> {docNumber}</div>
        <div><strong>DATE:</strong> {date}</div>
        <div><strong>TO:</strong> {recipient}</div>
        <div><strong>FROM:</strong> {sender}</div>
        <div><strong>SUBJECT:</strong> {subject}</div>
      </div>

      <div style={{ height: '1px', backgroundColor: '#333333', marginBottom: '24px' }} />

      {/* Body text with typewriter styling */}
      <div style={{ fontSize: '15px', lineHeight: 1.7, textAlign: 'justify' }}>
        {bodyParagraphs.map((para, i) => (
          <p key={i} style={{ marginBottom: '16px' }}>
            {para}
          </p>
        ))}

        {highlightPhrase && (
          <div style={{ marginTop: '14px' }}>
            <TextHighlighter delay={stampDelay + 10} color="#fffd38">
              {highlightPhrase}
            </TextHighlighter>
          </div>
        )}

        {redactedPhrase && (
          <div style={{ marginTop: '14px' }}>
            CONFIDENTIAL WITNESS IDENTIFIER:{' '}
            <RedactedText delay={stampDelay + 15}>
              {redactedPhrase}
            </RedactedText>
          </div>
        )}
      </div>

      {/* Red Rubber Stamp slammed on the page */}
      <div
        style={{
          position: 'absolute',
          top: '35px',
          right: '50px',
          transform: `scale(${stampScale}) rotate(-12deg)`,
          opacity: stampOpacity,
          border: '4px solid #cc2222',
          padding: '6px 16px',
          borderRadius: '4px',
          color: '#cc2222',
          fontFamily: 'Impact, Arial Black, sans-serif',
          fontSize: '32px',
          letterSpacing: '0.12em',
          textTransform: 'uppercase',
          pointerEvents: 'none',
          boxShadow: '0 0 10px rgba(204,34,34,0.3)',
          transformOrigin: 'center center',
        }}
      >
        {classification}
      </div>
    </div>
  );
};
