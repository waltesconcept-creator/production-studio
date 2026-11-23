import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';

export interface NeoStickerProps {
  type: 'star' | 'flower' | 'house' | 'key' | 'handshake' | 'shield' | 'lightning' | 'badge';
  text?: string;
  color?: string;
  size?: number;
  rotation?: number;
  delay?: number;
  float?: boolean;
  style?: React.CSSProperties;
}

export const NeoSticker: React.FC<NeoStickerProps> = ({
  type,
  text,
  color = '#F59E0B',
  size = 64,
  rotation = 0,
  delay = 0,
  float = true,
  style = {},
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const entrance = spring({
    frame: frame - delay,
    fps,
    config: {
      damping: 10,
      mass: 0.6,
      stiffness: 140,
    },
  });

  const floatOffset = float
    ? Math.sin((frame + delay * 5) * 0.08) * 6
    : 0;

  const floatRot = float
    ? Math.cos((frame + delay * 5) * 0.06) * 3
    : 0;

  const scale = entrance;
  const currentRotation = rotation + floatRot;

  if (frame < delay) return null;

  const renderIcon = () => {
    switch (type) {
      case 'star':
        return (
          <svg width={size} height={size} viewBox="0 0 100 100" fill={color} stroke="#09090B" strokeWidth="6" strokeLinejoin="round">
            <path d="M50 5 L63 35 L95 38 L71 60 L78 92 L50 75 L22 92 L29 60 L5 38 L37 35 Z" />
          </svg>
        );
      case 'flower':
        return (
          <svg width={size} height={size} viewBox="0 0 100 100" fill={color} stroke="#09090B" strokeWidth="6">
            <circle cx="50" cy="30" r="18" />
            <circle cx="70" cy="50" r="18" />
            <circle cx="50" cy="70" r="18" />
            <circle cx="30" cy="50" r="18" />
            <circle cx="50" cy="50" r="12" fill="#09090B" />
          </svg>
        );
      case 'house':
        return (
          <svg width={size} height={size} viewBox="0 0 100 100" fill={color} stroke="#09090B" strokeWidth="6" strokeLinejoin="round">
            <path d="M15 45 L50 15 L85 45 L85 85 L15 85 Z" />
            <rect x="40" y="55" width="20" height="30" fill="#09090B" />
          </svg>
        );
      case 'key':
        return (
          <svg width={size} height={size} viewBox="0 0 100 100" fill="none" stroke="#09090B" strokeWidth="7" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="35" cy="35" r="20" fill={color} />
            <circle cx="35" cy="35" r="8" fill="#FFF" />
            <path d="M50 50 L85 85 M70 70 L80 60 M78 78 L88 68" />
          </svg>
        );
      case 'handshake':
        return (
          <svg width={size} height={size} viewBox="0 0 100 100" fill={color} stroke="#09090B" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round">
            <rect x="15" y="35" width="70" height="35" rx="8" />
            <path d="M35 35 L48 52 L62 38" />
            <circle cx="35" cy="52" r="5" fill="#09090B" />
            <circle cx="65" cy="52" r="5" fill="#09090B" />
          </svg>
        );
      case 'shield':
        return (
          <svg width={size} height={size} viewBox="0 0 100 100" fill={color} stroke="#09090B" strokeWidth="6" strokeLinejoin="round">
            <path d="M50 12 L82 25 C82 60 50 88 50 88 C50 88 18 60 18 25 Z" />
            <path d="M38 48 L46 56 L64 38" fill="none" stroke="#09090B" strokeWidth="7" strokeLinecap="round" />
          </svg>
        );
      case 'lightning':
        return (
          <svg width={size} height={size} viewBox="0 0 100 100" fill={color} stroke="#09090B" strokeWidth="6" strokeLinejoin="round">
            <path d="M55 10 L25 55 L48 55 L42 90 L75 42 L52 42 Z" />
          </svg>
        );
      case 'badge':
        return (
          <div
            style={{
              backgroundColor: color,
              border: '3px solid #09090B',
              boxShadow: '4px 4px 0px #09090B',
              borderRadius: 30,
              padding: '6px 16px',
              fontWeight: 800,
              fontSize: size * 0.4,
              color: '#09090B',
              whiteSpace: 'nowrap',
              fontFamily: 'system-ui, sans-serif',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
            }}
          >
            {text}
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div
      style={{
        position: 'absolute',
        transform: `translateY(${floatOffset}px) rotate(${currentRotation}deg) scale(${scale})`,
        transformOrigin: 'center center',
        filter: type !== 'badge' ? 'drop-shadow(4px 4px 0px #09090B)' : undefined,
        zIndex: 20,
        ...style,
      }}
    >
      {renderIcon()}
    </div>
  );
};
