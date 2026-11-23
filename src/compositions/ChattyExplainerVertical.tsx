import React from 'react';
import {
  AbsoluteFill,
  Audio,
  interpolate,
  Sequence,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';
import {
  NeoSticker,
  PhoneKeypadOverlay,
  WhatsAppPhoneMockup,
} from '../components/chatty';
import { SoundDirector } from '../audio/SoundEffect';
import { SoundEffectTrigger } from '../types/story';

export const ChattyExplainerVertical: React.FC = () => {
  // Gentle, soft UI sound effects (light pops, gentle clicks, sweet chimes - NO fighting sounds)
  const gentleSfx: SoundEffectTrigger[] = [
    { id: 'p1', frame: 12, type: 'pop', volume: 0.3 },
    { id: 'p2', frame: 32, type: 'pop', volume: 0.35 },
    { id: 'c1', frame: 180, type: 'pop', volume: 0.25 },
    { id: 'c2', frame: 230, type: 'pop', volume: 0.25 },
    { id: 'c3', frame: 280, type: 'pop', volume: 0.25 },
    { id: 'ph-send', frame: 490, type: 'pop', volume: 0.3 },
    { id: 'ph-recv', frame: 540, type: 'chime', volume: 0.3 },
    { id: 'kp-1', frame: 792, type: 'click', volume: 0.25 },
    { id: 'kp-2', frame: 804, type: 'click', volume: 0.25 },
    { id: 'kp-3', frame: 816, type: 'click', volume: 0.25 },
    { id: 'kp-4', frame: 828, type: 'click', volume: 0.25 },
    { id: 'kp-done', frame: 840, type: 'chime', volume: 0.35 },
    { id: 'r1', frame: 1060, type: 'pop', volume: 0.25 },
    { id: 'r2', frame: 1120, type: 'pop', volume: 0.3 },
    { id: 'r3', frame: 1180, type: 'pop', volume: 0.25 },
    { id: 'r4', frame: 1230, type: 'chime', volume: 0.35 },
    { id: 'outro', frame: 1290, type: 'chime', volume: 0.4 },
  ];

  return (
    <AbsoluteFill
      style={{
        backgroundColor: '#F5F1FA', // Soft lilac / pastel canvas exactly like reference
        overflow: 'hidden',
        fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      }}
    >
      {/* 1. Background Music: Upbeat, Cheerful & Soft */}
      <Audio
        src={staticFile('audio/music/upbeat-tech.mp3')}
        volume={0.14}
        loop
      />

      {/* 2. Soft, Gentle UI Sound Effects */}
      <SoundDirector effects={gentleSfx} />

      {/* 3. SCENE 1: Welcome to Chatty (Frames 0 - 160, ~5.3s) */}
      <Sequence from={0} durationInFrames={160}>
        <Audio src={staticFile('audio/chatty/s1_welcome.mp3')} volume={1.0} />
        <Scene1Welcome />
      </Sequence>

      {/* 4. SCENE 2: 3 Core Capability Pills (Frames 160 - 460, ~10s) */}
      <Sequence from={160} durationInFrames={300}>
        <Audio src={staticFile('audio/chatty/s2_features.mp3')} volume={1.0} />
        <Scene2Pills />
      </Sequence>

      {/* 5. SCENE 3: Feature 1 Demo - Finding an Apartment (Frames 460 - 780, ~10.6s) */}
      <Sequence from={460} durationInFrames={320}>
        <Audio src={staticFile('audio/chatty/s3_apartments.mp3')} volume={1.0} />
        <Scene3ApartmentDemo />
      </Sequence>

      {/* 6. SCENE 4: Feature 2 Demo - Pin Keypad & Escrow Booking (Frames 780 - 1030, ~8.3s) */}
      <Sequence from={780} durationInFrames={250}>
        <Audio src={staticFile('audio/chatty/s4_roommates.mp3')} volume={1.0} />
        <Scene4KeypadEscrow />
      </Sequence>

      {/* 7. SCENE 5: Feature 3 Demo - Roommate & Chat Interaction (Frames 1030 - 1270, ~8s) */}
      <Sequence from={1030} durationInFrames={240}>
        <Audio src={staticFile('audio/chatty/s5_inspections.mp3')} volume={1.0} />
        <Scene5RoomieChat />
      </Sequence>

      {/* 8. SCENE 6: Outro & Call to Action (Frames 1270 - 1500, ~7.7s) */}
      <Sequence from={1270} durationInFrames={230}>
        <Audio src={staticFile('audio/chatty/s6_outro.mp3')} volume={1.0} />
        <Scene6CleanOutro />
      </Sequence>
    </AbsoluteFill>
  );
};

/* =========================================================================
   SCENE 1: WELCOME TO CHATTY (Mirroring the reference video opening)
   ========================================================================= */
const Scene1Welcome: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const bubble1Entrance = spring({
    frame: frame - 10,
    fps,
    config: { damping: 12, mass: 0.6, stiffness: 130 },
  });

  const bubble2Entrance = spring({
    frame: frame - 28,
    fps,
    config: { damping: 12, mass: 0.6, stiffness: 130 },
  });

  const subtitleEntrance = spring({
    frame: frame - 45,
    fps,
    config: { damping: 14, mass: 0.8, stiffness: 110 },
  });

  return (
    <AbsoluteFill
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#F3EEF9', // Pastel lavender
      }}
    >
      {/* Floating Decorative Elements around center */}
      <NeoSticker type="flower" color="#FF80BF" size={70} style={{ top: 520, left: 160 }} rotation={15} delay={8} />
      <NeoSticker type="star" color="#FACC15" size={68} style={{ top: 500, right: 180 }} rotation={-12} delay={14} />
      <div
        style={{
          position: 'absolute',
          bottom: 580,
          left: 170,
          width: 32,
          height: 32,
          borderRadius: '50%',
          backgroundColor: '#22C55E',
          border: '3px solid #09090B',
          boxShadow: '3px 3px 0px #09090B',
        }}
      />
      {/* Double Chevron Arrows on the right */}
      <div
        style={{
          position: 'absolute',
          bottom: 590,
          right: 170,
          display: 'flex',
          gap: 4,
          fontSize: 44,
          fontWeight: 900,
          color: '#2563EB',
        }}
      >
        <span>»</span>
      </div>

      {/* Main Centered Speech Bubbles */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'relative' }}>
        {/* Bubble 1: "Welcome" */}
        <div
          style={{
            transform: `scale(${bubble1Entrance}) translateY(${interpolate(bubble1Entrance, [0, 1], [40, 0])}px)`,
            backgroundColor: '#FFFFFF',
            border: '4px solid #09090B',
            borderRadius: '44px 44px 44px 10px',
            boxShadow: '8px 8px 0px #09090B',
            padding: '24px 60px',
            fontSize: 72,
            fontWeight: 900,
            color: '#09090B',
            letterSpacing: '-0.02em',
            zIndex: 10,
          }}
        >
          Welcome
        </div>

        {/* Bubble 2: "to Chatty" */}
        <div
          style={{
            transform: `scale(${bubble2Entrance}) translateY(${interpolate(bubble2Entrance, [0, 1], [40, 0])}px)`,
            backgroundColor: '#F59E0B', // Locari Amber / Golden Yellow
            border: '4px solid #09090B',
            borderRadius: '10px 44px 44px 44px',
            boxShadow: '8px 8px 0px #09090B',
            padding: '24px 64px',
            fontSize: 72,
            fontWeight: 900,
            color: '#FFFFFF',
            letterSpacing: '-0.02em',
            marginTop: -16,
            zIndex: 15,
          }}
        >
          to Chatty
        </div>

        {/* Subtitle */}
        <div
          style={{
            transform: `scale(${subtitleEntrance})`,
            fontSize: 32,
            fontWeight: 800,
            color: '#09090B',
            marginTop: 48,
            textAlign: 'center',
            maxWidth: 720,
            lineHeight: 1.3,
          }}
        >
          Your all-in-one property assistant on WhatsApp.
        </div>
      </div>
    </AbsoluteFill>
  );
};

/* =========================================================================
   SCENE 2: 3 CAPABILITY PILLS (Exactly mirroring Xara's 3 pill rows)
   ========================================================================= */
const Scene2Pills: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const makeRowSpring = (delay: number) =>
    spring({
      frame: frame - delay,
      fps,
      config: { damping: 13, mass: 0.6, stiffness: 120 },
    });

  const row1 = makeRowSpring(10);
  const row2 = makeRowSpring(45);
  const row3 = makeRowSpring(80);

  return (
    <AbsoluteFill
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#F3EEF9',
        gap: 36,
      }}
    >
      {/* Row 1: Left Circle Icon + Right Pink Pill */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 24,
          transform: `scale(${row1})`,
        }}
      >
        {/* Circle Icon */}
        <div
          style={{
            width: 100,
            height: 100,
            borderRadius: '50%',
            backgroundColor: '#60A5FA',
            border: '4px solid #09090B',
            boxShadow: '6px 6px 0px #09090B',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 48,
          }}
        >
          🏠
        </div>
        {/* Pill */}
        <div
          style={{
            backgroundColor: '#FBCFE8', // Soft pink/lavender like reference
            border: '4px solid #09090B',
            borderRadius: 36,
            boxShadow: '6px 6px 0px #09090B',
            padding: '24px 38px',
            fontSize: 34,
            fontWeight: 800,
            color: '#09090B',
            width: 480,
          }}
        >
          Find apartments & short-lets
        </div>
      </div>

      {/* Row 2: Left Pink Pill + Right Circle Icon */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 24,
          transform: `scale(${row2})`,
        }}
      >
        {/* Pill */}
        <div
          style={{
            backgroundColor: '#FBCFE8',
            border: '4px solid #09090B',
            borderRadius: 36,
            boxShadow: '6px 6px 0px #09090B',
            padding: '24px 38px',
            fontSize: 34,
            fontWeight: 800,
            color: '#09090B',
            width: 480,
          }}
        >
          Match roommates & split rent
        </div>
        {/* Circle Icon */}
        <div
          style={{
            width: 100,
            height: 100,
            borderRadius: '50%',
            backgroundColor: '#60A5FA',
            border: '4px solid #09090B',
            boxShadow: '6px 6px 0px #09090B',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 48,
          }}
        >
          🤝
        </div>
      </div>

      {/* Row 3: Left Circle Icon + Right Pink Pill */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 24,
          transform: `scale(${row3})`,
        }}
      >
        {/* Circle Icon */}
        <div
          style={{
            width: 100,
            height: 100,
            borderRadius: '50%',
            backgroundColor: '#60A5FA',
            border: '4px solid #09090B',
            boxShadow: '6px 6px 0px #09090B',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 48,
          }}
        >
          🛡️
        </div>
        {/* Pill */}
        <div
          style={{
            backgroundColor: '#FBCFE8',
            border: '4px solid #09090B',
            borderRadius: 36,
            boxShadow: '6px 6px 0px #09090B',
            padding: '24px 38px',
            fontSize: 34,
            fontWeight: 800,
            color: '#09090B',
            width: 480,
          }}
        >
          Book inspections with Escrow
        </div>
      </div>
    </AbsoluteFill>
  );
};

/* =========================================================================
   SCENE 3: APARTMENT DEMO (Mirroring the Moniepoint snap receipt in Xara)
   ========================================================================= */
const Scene3ApartmentDemo: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const phoneIn = spring({
    frame,
    fps,
    config: { damping: 14, mass: 0.8, stiffness: 110 },
  });

  const cardEntrance = spring({
    frame: frame - 25,
    fps,
    config: { damping: 12, mass: 0.6, stiffness: 130 },
  });

  const responseEntrance = spring({
    frame: frame - 80,
    fps,
    config: { damping: 12, mass: 0.6, stiffness: 130 },
  });

  return (
    <AbsoluteFill
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#C5D6E8', // Light slate blue like Xara phone scene
      }}
    >
      <WhatsAppPhoneMockup phoneScale={1.12} phoneTranslateY={0}>
        {/* User Snap Request Card (Exactly like Moniepoint snap card) */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'flex-end',
            margin: '20px 0 16px',
            transform: `scale(${cardEntrance})`,
            transformOrigin: 'top right',
          }}
        >
          <div
            style={{
              backgroundColor: '#DCF8C6',
              border: '3px solid #09090B',
              borderRadius: 20,
              boxShadow: '4px 4px 0px #09090B',
              padding: 12,
              maxWidth: 380,
            }}
          >
            {/* Apartment Photo */}
            <div
              style={{
                width: 350,
                height: 220,
                borderRadius: 12,
                overflow: 'hidden',
                border: '2px solid #09090B',
                backgroundColor: '#E5E7EB',
              }}
            >
              <img
                src={staticFile('assets/downloads/apartment-modern.jpg')}
                alt="Apartment"
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            </div>
            {/* User Caption */}
            <div
              style={{
                fontSize: 26,
                fontWeight: 900,
                color: '#09090B',
                padding: '10px 4px 4px',
              }}
            >
              Find 2-bed in Bodija
            </div>
            <div style={{ textAlign: 'right', fontSize: 13, color: '#4B5563', fontWeight: 600 }}>
              10:14 AM <span style={{ color: '#34B7F1' }}>✓✓</span>
            </div>
          </div>
        </div>

        {/* Chatty Instant Confirmation Bubble */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'flex-start',
            transform: `scale(${responseEntrance})`,
            transformOrigin: 'top left',
          }}
        >
          <div
            style={{
              backgroundColor: '#FFFFFF',
              border: '3px solid #09090B',
              borderRadius: 20,
              boxShadow: '4px 4px 0px #09090B',
              padding: '20px 24px',
              maxWidth: 440,
            }}
          >
            <div style={{ fontSize: 28, fontWeight: 900, color: '#09090B', lineHeight: 1.3 }}>
              Verified 2-Bed Serviced Flat ready for inspection.
            </div>
            <div
              style={{
                display: 'inline-block',
                backgroundColor: '#F59E0B',
                color: '#09090B',
                border: '2px solid #09090B',
                borderRadius: 8,
                padding: '4px 12px',
                fontSize: 20,
                fontWeight: 900,
                marginTop: 10,
              }}
            >
              ₦1,000,000 / yr
            </div>
            <div style={{ textAlign: 'right', fontSize: 13, color: '#9CA3AF', marginTop: 8 }}>
              10:14 AM
            </div>
          </div>
        </div>
      </WhatsAppPhoneMockup>
    </AbsoluteFill>
  );
};

/* =========================================================================
   SCENE 4: PIN KEYPAD & ESCROW (Mirroring Xara's PIN keypad overlay)
   ========================================================================= */
const Scene4KeypadEscrow: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const confirmEntrance = spring({
    frame: frame - 60,
    fps,
    config: { damping: 12, mass: 0.6, stiffness: 130 },
  });

  return (
    <AbsoluteFill
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#C5D6E8',
      }}
    >
      <WhatsAppPhoneMockup phoneScale={1.12} phoneTranslateY={0}>
        {/* Animated Keypad Overlay */}
        <PhoneKeypadOverlay title="CONFIRM ESCROW PAYMENT" delay={5} />

        {/* Success Banner below Keypad */}
        <div
          style={{
            position: 'absolute',
            top: 790,
            left: 24,
            right: 24,
            backgroundColor: '#DCFCE7',
            border: '3px solid #09090B',
            borderRadius: 18,
            boxShadow: '5px 5px 0px #09090B',
            padding: '16px 20px',
            transform: `scale(${confirmEntrance})`,
            zIndex: 60,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ fontSize: 28 }}>🛡️</span>
            <div>
              <div style={{ fontSize: 18, fontWeight: 900, color: '#166534' }}>
                100% Escrow Protection
              </div>
              <div style={{ fontSize: 14, fontWeight: 700, color: '#15803D' }}>
                Payment held safely until inspection completes.
              </div>
            </div>
          </div>
        </div>
      </WhatsAppPhoneMockup>
    </AbsoluteFill>
  );
};

/* =========================================================================
   SCENE 5: ROOMMATE & CHAT (Mirroring Xara's chat bubble questions)
   ========================================================================= */
const Scene5RoomieChat: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const makeBubble = (delay: number) =>
    spring({
      frame: frame - delay,
      fps,
      config: { damping: 13, mass: 0.6, stiffness: 120 },
    });

  const b1 = makeBubble(5);
  const b2 = makeBubble(45);
  const b3 = makeBubble(90);
  const b4 = makeBubble(140);

  return (
    <AbsoluteFill
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#98AFD1', // Muted periwinkle blue like reference
        padding: '0 60px',
      }}
    >
      {/* Centered Heading */}
      <div
        style={{
          fontSize: 48,
          fontWeight: 900,
          color: '#FFFFFF',
          textAlign: 'center',
          lineHeight: 1.25,
          marginBottom: 48,
          textShadow: '2px 2px 0px #09090B',
          maxWidth: 780,
        }}
      >
        You can also find roommates and split rent directly in chat
      </div>

      {/* Centered Stack of Chat Bubbles */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 20, width: '100%', maxWidth: 720 }}>
        {/* User Question 1 */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', transform: `scale(${b1})` }}>
          <div
            style={{
              backgroundColor: '#16A34A', // Vibrant green user bubble
              color: '#FFFFFF',
              border: '3.5px solid #09090B',
              borderRadius: '26px 26px 4px 26px',
              boxShadow: '5px 5px 0px #09090B',
              padding: '18px 28px',
              fontSize: 30,
              fontWeight: 800,
            }}
          >
            Find a roommate to split rent
          </div>
        </div>

        {/* Chatty Reply 1 */}
        <div style={{ display: 'flex', justifyContent: 'flex-start', transform: `scale(${b2})` }}>
          <div
            style={{
              backgroundColor: '#FFFFFF',
              color: '#09090B',
              border: '3.5px solid #09090B',
              borderRadius: '26px 26px 26px 4px',
              boxShadow: '5px 5px 0px #09090B',
              padding: '18px 28px',
              fontSize: 30,
              fontWeight: 800,
            }}
          >
            Matched with Tunde: Split ₦500k each! 🤝
          </div>
        </div>

        {/* User Question 2 */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', transform: `scale(${b3})` }}>
          <div
            style={{
              backgroundColor: '#16A34A',
              color: '#FFFFFF',
              border: '3.5px solid #09090B',
              borderRadius: '26px 26px 4px 26px',
              boxShadow: '5px 5px 0px #09090B',
              padding: '18px 28px',
              fontSize: 30,
              fontWeight: 800,
            }}
          >
            Book physical inspection with landlord
          </div>
        </div>

        {/* Chatty Reply 2 */}
        <div style={{ display: 'flex', justifyContent: 'flex-start', transform: `scale(${b4})` }}>
          <div
            style={{
              backgroundColor: '#FFFFFF',
              color: '#09090B',
              border: '3.5px solid #09090B',
              borderRadius: '26px 26px 26px 4px',
              boxShadow: '5px 5px 0px #09090B',
              padding: '18px 28px',
              fontSize: 30,
              fontWeight: 800,
            }}
          >
            Meetup confirmed for Saturday 2 PM! 📅
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};

/* =========================================================================
   SCENE 6: CLEAN OUTRO (Mirroring Xara's clean white ending with logo & CTA)
   ========================================================================= */
const Scene6CleanOutro: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const logoEntrance = spring({
    frame,
    fps,
    config: { damping: 12, mass: 0.6, stiffness: 120 },
  });

  const buttonPulse = Math.sin(frame * 0.16) * 0.03 + 1;

  return (
    <AbsoluteFill
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#FFFFFF',
        padding: '0 60px',
      }}
    >
      <div
        style={{
          transform: `scale(${logoEntrance})`,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
        }}
      >
        {/* Brand Logo & Name */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 20 }}>
          <span style={{ fontSize: 72, fontWeight: 900, color: '#2563EB', letterSpacing: '-0.05em' }}>
            »»
          </span>
          <span style={{ fontSize: 72, fontWeight: 900, color: '#09090B', letterSpacing: '-0.02em' }}>
            Chatty
          </span>
        </div>

        <div style={{ fontSize: 24, fontWeight: 800, color: '#F59E0B', textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: 40 }}>
          BY LOCARI
        </div>

        {/* Clean Subtitle */}
        <div style={{ fontSize: 34, fontWeight: 700, color: '#4B5563', marginBottom: 48, maxWidth: 640 }}>
          Finding a home shouldn't be stressful.
        </div>

        {/* Centered WhatsApp CTA Button */}
        <div
          style={{
            backgroundColor: '#25D366',
            color: '#09090B',
            border: '4px solid #09090B',
            borderRadius: 36,
            boxShadow: '8px 8px 0px #09090B',
            padding: '24px 50px',
            fontSize: 32,
            fontWeight: 900,
            transform: `scale(${buttonPulse})`,
            display: 'flex',
            alignItems: 'center',
            gap: 16,
            cursor: 'pointer',
          }}
        >
          <span>💬</span>
          <span>Get started today on WhatsApp</span>
        </div>

        <div style={{ marginTop: 28, fontSize: 20, fontWeight: 800, color: '#6B7280' }}>
          wa.me/locari • locari.africa
        </div>
      </div>
    </AbsoluteFill>
  );
};
