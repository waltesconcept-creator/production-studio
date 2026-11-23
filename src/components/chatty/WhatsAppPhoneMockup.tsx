import React from 'react';
import { interpolate, spring, staticFile, useCurrentFrame, useVideoConfig } from 'remotion';

export interface WhatsAppPhoneMockupProps {
  children: React.ReactNode;
  delay?: number;
  scrollY?: number; // smoothly pan down as new messages arrive
  phoneScale?: number;
  phoneTranslateY?: number;
}

export const WhatsAppPhoneMockup: React.FC<WhatsAppPhoneMockupProps> = ({
  children,
  delay = 0,
  scrollY = 0,
  phoneScale = 1.08,
  phoneTranslateY = 0,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const entrance = spring({
    frame: frame - delay,
    fps,
    config: {
      damping: 14,
      mass: 0.8,
      stiffness: 110,
    },
  });

  const translateY = interpolate(entrance, [0, 1], [300, 0]) + phoneTranslateY;
  const scale = entrance * phoneScale;

  if (frame < delay) return null;

  return (
    <div
      style={{
        position: 'relative',
        width: 760,
        height: 1440,
        backgroundColor: '#09090B',
        borderRadius: 56,
        padding: '16px',
        boxShadow: '0 25px 60px -15px rgba(0, 0, 0, 0.45), 10px 10px 0px #09090B',
        border: '4px solid #09090B',
        transform: `translateY(${translateY}px) scale(${scale})`,
        transformOrigin: 'center center',
        boxSizing: 'border-box',
        overflow: 'hidden',
      }}
    >
      {/* Inner Screen */}
      <div
        style={{
          width: '100%',
          height: '100%',
          backgroundColor: '#EFEAE2', // WhatsApp default warm canvas
          borderRadius: 44,
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          position: 'relative',
        }}
      >
        {/* Dynamic Island / Notch */}
        <div
          style={{
            position: 'absolute',
            top: 10,
            left: '50%',
            transform: 'translateX(-50%)',
            width: 140,
            height: 28,
            backgroundColor: '#09090B',
            borderRadius: 20,
            zIndex: 50,
          }}
        />

        {/* Status Bar */}
        <div
          style={{
            height: 48,
            padding: '0 26px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            fontSize: 14,
            fontWeight: 800,
            color: '#09090B',
            zIndex: 40,
          }}
        >
          <span>9:41</span>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <span>5G</span>
            <span>📶</span>
            <span>🔋 100%</span>
          </div>
        </div>

        {/* WhatsApp Chat Header */}
        <div
          style={{
            height: 76,
            backgroundColor: '#075E54', // WhatsApp dark green header or Locari amber
            background: 'linear-gradient(135deg, #075E54 0%, #128C7E 100%)',
            padding: '0 16px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            color: '#FFFFFF',
            zIndex: 30,
            boxShadow: '0 2px 5px rgba(0,0,0,0.15)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            {/* Back Arrow */}
            <span style={{ fontSize: 24, fontWeight: 700, cursor: 'pointer' }}>‹</span>

            {/* Avatar */}
            <div style={{ position: 'relative' }}>
              <div
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: '50%',
                  backgroundColor: '#F59E0B',
                  border: '2px solid #FFFFFF',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 900,
                  fontSize: 20,
                  color: '#09090B',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
                  overflow: 'hidden',
                }}
              >
                <img
                  src={staticFile('assets/downloads/locari_logo.png')}
                  alt="Locari"
                  style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                  onError={(e) => {
                    // Fallback to stylized 'C' if logo is not available
                    (e.target as HTMLElement).style.display = 'none';
                  }}
                />
              </div>
              {/* Online Dot */}
              <div
                style={{
                  position: 'absolute',
                  bottom: 0,
                  right: 0,
                  width: 12,
                  height: 12,
                  borderRadius: '50%',
                  backgroundColor: '#25D366',
                  border: '2px solid #FFFFFF',
                }}
              />
            </div>

            {/* Title & Subtitle */}
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 17, fontWeight: 800 }}>
                <span>Chatty by Locari</span>
                <span style={{ color: '#25D366', fontSize: 14 }}>✓</span>
              </div>
              <div style={{ fontSize: 12, color: '#A7F3D0', fontWeight: 600 }}>
                Official Property Assistant • Online
              </div>
            </div>
          </div>

          {/* Action Icons */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 16, fontSize: 18 }}>
            <span>📹</span>
            <span>📞</span>
            <span>⋮</span>
          </div>
        </div>

        {/* Chat Messages Viewport with Subtle Wallpaper Doodle & Smooth Scrolling */}
        <div
          style={{
            flex: 1,
            position: 'relative',
            overflow: 'hidden',
            backgroundImage: `radial-gradient(#CBD5E1 1px, transparent 1px)`,
            backgroundSize: '24px 24px',
            backgroundColor: '#ECE5DD',
          }}
        >
          <div
            style={{
              padding: '16px 14px',
              transform: `translateY(-${scrollY}px)`,
              transition: 'transform 0.3s ease-out',
            }}
          >
            {/* Encryption Notice */}
            <div
              style={{
                textAlign: 'center',
                margin: '8px auto 16px',
                backgroundColor: '#FFE8A1',
                borderRadius: 8,
                padding: '6px 12px',
                fontSize: 11,
                color: '#5B4E26',
                fontWeight: 600,
                maxWidth: '85%',
                boxShadow: '0 1px 2px rgba(0,0,0,0.06)',
              }}
            >
              🔒 Messages are end-to-end encrypted with Locari Escrow Protection.
            </div>

            {children}
          </div>
        </div>

        {/* WhatsApp Bottom Input Bar */}
        <div
          style={{
            height: 64,
            backgroundColor: '#F0F2F5',
            padding: '0 12px',
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            borderTop: '1px solid #E2E8F0',
            zIndex: 30,
          }}
        >
          <div style={{ fontSize: 22, color: '#54656F', cursor: 'pointer' }}>➕</div>
          <div
            style={{
              flex: 1,
              height: 42,
              backgroundColor: '#FFFFFF',
              borderRadius: 24,
              border: '1.5px solid #CBD5E1',
              padding: '0 16px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              fontSize: 15,
              color: '#94A3B8',
            }}
          >
            <span>Type a message...</span>
            <span>😊</span>
          </div>
          <div
            style={{
              width: 42,
              height: 42,
              borderRadius: '50%',
              backgroundColor: '#00A884',
              color: '#FFFFFF',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 18,
              boxShadow: '0 2px 4px rgba(0,0,0,0.15)',
            }}
          >
            🎙️
          </div>
        </div>
      </div>
    </div>
  );
};
