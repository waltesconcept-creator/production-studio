import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';

export interface LocariChatBubbleProps {
  message?: string;
  sender?: 'chatty' | 'user';
  time?: string;
  delay?: number;
  isTyping?: boolean;
  children?: React.ReactNode;
  style?: React.CSSProperties;
}

export const LocariChatBubble: React.FC<LocariChatBubbleProps> = ({
  message,
  sender = 'chatty',
  time = '10:14 AM',
  delay = 0,
  isTyping = false,
  children,
  style = {},
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const entrance = spring({
    frame: frame - delay,
    fps,
    config: {
      damping: 12,
      mass: 0.6,
      stiffness: 130,
    },
  });

  const scale = entrance;
  const translateY = interpolate(entrance, [0, 1], [30, 0]);
  const isChatty = sender === 'chatty';

  if (frame < delay) return null;

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: isChatty ? 'flex-start' : 'flex-end',
        width: '100%',
        margin: '12px 0',
        transform: `translateY(${translateY}px) scale(${scale})`,
        transformOrigin: isChatty ? 'bottom left' : 'bottom right',
        ...style,
      }}
    >
      <div
        style={{
          maxWidth: '85%',
          backgroundColor: isChatty ? '#FFFFFF' : '#DCF8C6',
          border: '2.5px solid #09090B',
          boxShadow: '4px 4px 0px #09090B',
          borderRadius: 18,
          borderBottomLeftRadius: isChatty ? 4 : 18,
          borderBottomRightRadius: isChatty ? 18 : 4,
          padding: '14px 18px',
          color: '#09090B',
          fontFamily: 'system-ui, -apple-system, sans-serif',
          position: 'relative',
        }}
      >
        {isChatty && (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              marginBottom: 6,
              fontSize: 13,
              fontWeight: 800,
              color: '#B45309',
            }}
          >
            <span>💬 Chatty by Locari</span>
            <span
              style={{
                backgroundColor: '#F59E0B',
                color: '#000',
                fontSize: 10,
                fontWeight: 900,
                padding: '2px 6px',
                borderRadius: 6,
                border: '1px solid #09090B',
              }}
            >
              AI ASSISTANT
            </span>
          </div>
        )}

        {isTyping ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '6px 4px' }}>
            {[0, 1, 2].map((dotIndex) => {
              const dotWave = Math.sin((frame * 0.25) + dotIndex * 1.2);
              const dotScale = interpolate(dotWave, [-1, 1], [0.7, 1.3]);
              const dotOpacity = interpolate(dotWave, [-1, 1], [0.4, 1]);
              return (
                <div
                  key={dotIndex}
                  style={{
                    width: 10,
                    height: 10,
                    borderRadius: '50%',
                    backgroundColor: '#09090B',
                    transform: `scale(${dotScale})`,
                    opacity: dotOpacity,
                  }}
                />
              );
            })}
          </div>
        ) : (
          <>
            {message && (
              <div
                style={{
                  fontSize: 19,
                  fontWeight: 600,
                  lineHeight: 1.38,
                  wordBreak: 'break-word',
                }}
              >
                {message}
              </div>
            )}
            {children}
            <div
              style={{
                display: 'flex',
                justifyContent: 'flex-end',
                alignItems: 'center',
                gap: 4,
                marginTop: 6,
                fontSize: 12,
                fontWeight: 600,
                color: '#6B7280',
              }}
            >
              <span>{time}</span>
              {!isChatty && (
                <span style={{ color: '#34B7F1', fontWeight: 900, fontSize: 13 }}>✓✓</span>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};
