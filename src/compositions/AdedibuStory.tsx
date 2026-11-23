import React from 'react';
import { interpolate, spring, staticFile, useCurrentFrame, useVideoConfig } from 'remotion';
import { AudioDucking } from '../audio/AudioDucking';
import { SoundDirector } from '../audio/SoundEffect';
import { FilmGrain, CinemaVignette } from '../components/Atmosphere';
import { BrandWatermark } from '../components/BrandWatermark';
import { WordByWordCaptions } from '../components/captions/WordByWordCaptions';
import { anton, oswald, playfairItalic, poppins } from '../mixedStyles';

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

export const AdedibuStory: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  // Subtle smooth 2D camera push (NO 3D perspective slant!)
  const camScale = interpolate(frame, [0, durationInFrames], [1.0, 1.05], {
    extrapolateRight: 'clamp',
  });

  // Determine current narrative beat
  // Beat 1: 0 - 245
  // Beat 2: 246 - 489
  // Beat 3: 490 - 840
  // Beat 4: 841 - 1135
  // Beat 5: 1136 - 1620 (light paper background)
  // Beat 6: 1621 - 2022 (cinematic climax)
  const isBeat1 = frame <= 245;
  const isBeat2 = frame > 245 && frame <= 489;
  const isBeat3 = frame > 489 && frame <= 840;
  const isBeat4 = frame > 840 && frame <= 1135;
  const isBeat5 = frame > 1135 && frame <= 1620;
  const isBeat6 = frame > 1620;

  const isLightBg = isBeat5;

  // Spring animations for beat elements
  const beat2Spring = spring({ frame: frame - 250, fps, config: { damping: 14, stiffness: 140 } });
  const wait5HoursSpring = spring({ frame: frame - 355, fps, config: { damping: 12, stiffness: 220 } });

  // Beat 3 strikethrough springs
  const strike1Spring = spring({ frame: frame - 570, fps, config: { damping: 14, stiffness: 220 } });
  const strike2Spring = spring({ frame: frame - 640, fps, config: { damping: 14, stiffness: 220 } });
  const strike3Spring = spring({ frame: frame - 700, fps, config: { damping: 14, stiffness: 220 } });

  // Beat 5 badge springs
  const badgeHospital = spring({ frame: frame - 1320, fps, config: { damping: 14, stiffness: 220 } });
  const badgeDisputes = spring({ frame: frame - 1375, fps, config: { damping: 14, stiffness: 220 } });
  const badgeFood = spring({ frame: frame - 1425, fps, config: { damping: 14, stiffness: 220 } });

  // Hero cutout float
  const floatY = Math.sin(frame * 0.08) * 6;

  return (
    <div
      style={{
        position: 'relative',
        width: 1080,
        height: 1920,
        backgroundColor: isLightBg ? '#F4EFE4' : '#07080A',
        overflow: 'hidden',
      }}
    >
      {/* ========================================================================= */}
      {/* 1. AUDIO & SOUND DESIGN (FAST 195 WPM CADENCE + SOUND EFFECTS)            */}
      {/* ========================================================================= */}
      <AudioDucking
        musicSrc="/audio/music/documentary-pulse.wav"
        voiceoverSrc="/audio/adedibu_fast_voice.mp3"
        baseMusicVolume={0.28}
        duckedMusicVolume={0.06}
      />

      <SoundDirector
        effects={[
          { id: 's1-jet', frame: 50, type: 'whoosh' },
          { id: 's1-amala', frame: 180, type: 'pop' },
          { id: 's2-adedibu', frame: 252, type: 'whoosh' },
          { id: 's2-hours', frame: 355, type: 'stamp' },
          { id: 's3-strike1', frame: 570, type: 'stamp' },
          { id: 's3-strike2', frame: 640, type: 'stamp' },
          { id: 's3-strike3', frame: 700, type: 'stamp' },
          { id: 's4-street', frame: 1040, type: 'whoosh' },
          { id: 's5-b1', frame: 1320, type: 'pop' },
          { id: 's5-b2', frame: 1375, type: 'pop' },
          { id: 's5-b3', frame: 1425, type: 'pop' },
          { id: 's6-climax', frame: 1980, type: 'bell' },
        ]}
      />

      {/* ========================================================================= */}
      {/* 2. DYNAMIC FULL-BLEED BACKGROUND LAYER (ZERO BOXES, ZERO SLANTS)          */}
      {/* ========================================================================= */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          transform: `scale(${camScale})`,
          transformOrigin: 'center center',
        }}
      >
        {/* BEAT 1 BACKGROUND: Archival Ibadan Cityscape */}
        {isBeat1 && (
          <>
            <img
              src={resolveSrc('/assets/downloads/ibadan-1.jpg')}
              alt="Archival Ibadan"
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                filter: 'brightness(0.32) contrast(1.18) saturate(1.1)',
              }}
            />
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

        {/* BEAT 2 BACKGROUND: Dark Blueprint Grid with Warm Orange Glow */}
        {isBeat2 && (
          <div
            style={{
              position: 'absolute',
              inset: 0,
              backgroundColor: '#0C0908',
              backgroundImage: `
                linear-gradient(to right, rgba(255, 85, 0, 0.14) 1.5px, transparent 1.5px),
                linear-gradient(to bottom, rgba(255, 85, 0, 0.14) 1.5px, transparent 1.5px),
                radial-gradient(ellipse 70% 55% at 50% 40%, rgba(255, 85, 0, 0.24) 0%, rgba(7,8,10,0.95) 80%)
              `,
              backgroundSize: '64px 64px, 64px 64px, 100% 100%',
            }}
          />
        )}

        {/* BEAT 3 BACKGROUND: Dark Cinema Grid */}
        {isBeat3 && (
          <div
            style={{
              position: 'absolute',
              inset: 0,
              backgroundColor: '#07080A',
              backgroundImage: `
                radial-gradient(rgba(255,255,255,0.08) 1.5px, transparent 1.5px),
                radial-gradient(ellipse 70% 55% at 50% 42%, rgba(255, 85, 0, 0.15) 0%, rgba(7,8,10,0.95) 75%)
              `,
              backgroundSize: '40px 40px, 100% 100%',
            }}
          />
        )}

        {/* BEAT 4 BACKGROUND: Full-Bleed 2000s Campaign Billboard */}
        {isBeat4 && (
          <>
            <img
              src={resolveSrc('/assets/ibadan_campaign_billboard.jpg')}
              alt="Campaign Billboard"
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                filter: 'brightness(0.28) contrast(1.2) saturate(1.15)',
              }}
            />
            <div
              style={{
                position: 'absolute',
                inset: 0,
                background:
                  'radial-gradient(ellipse 75% 60% at 50% 45%, rgba(255, 85, 0, 0.2) 0%, rgba(7,8,10,0.92) 80%)',
              }}
            />
          </>
        )}

        {/* BEAT 5 BACKGROUND: Cream Documentary Paper Grid */}
        {isBeat5 && (
          <div
            style={{
              position: 'absolute',
              inset: 0,
              backgroundColor: '#F4EFE4',
              backgroundImage: `
                linear-gradient(to right, rgba(92, 78, 60, 0.12) 1.5px, transparent 1.5px),
                linear-gradient(to bottom, rgba(92, 78, 60, 0.12) 1.5px, transparent 1.5px),
                radial-gradient(ellipse at 50% 45%, rgba(255,255,255,0.65) 0%, rgba(190,174,148,0.3) 100%)
              `,
              backgroundSize: '52px 52px, 52px 52px, 100% 100%',
            }}
          />
        )}

        {/* BEAT 6 BACKGROUND: Golden Cinematic Climax Spotlight */}
        {isBeat6 && (
          <div
            style={{
              position: 'absolute',
              inset: 0,
              backgroundColor: '#07080A',
              backgroundImage: `
                radial-gradient(ellipse 65% 55% at 50% 36%, rgba(255, 110, 0, 0.35) 0%, rgba(7,8,10,0.98) 78%)
              `,
            }}
          />
        )}
      </div>

      {/* Atmospheric Overlays */}
      <FilmGrain opacity={0.07} />
      <CinemaVignette strength={isLightBg ? 0.35 : 0.65} />
      <BrandWatermark lightBackground={isLightBg} />

      {/* ========================================================================= */}
      {/* 3. DYNAMIC VISUAL CUTOUTS & BADGES (FRAMING THE CENTER)                   */}
      {/* ========================================================================= */}

      {/* BEAT 1 CUTOUTS: Private Jet & Steaming Amala Bowl */}
      {isBeat1 && (
        <>
          {/* Top Eyebrow */}
          <div
            style={{
              position: 'absolute',
              top: 130,
              width: '100%',
              textAlign: 'center',
              fontFamily: playfairItalic.fontFamily,
              fontStyle: 'italic',
              fontSize: 44,
              color: 'rgba(255, 244, 230, 0.85)',
              letterSpacing: '0.02em',
              textShadow: '0 4px 14px rgba(0,0,0,0.85)',
            }}
          >
            The Kingmaker of Ibadan
          </div>

          {/* Private Jet Cutout (Frames 45 - 150) */}
          {frame >= 45 && frame < 155 && (
            <div
              style={{
                position: 'absolute',
                top: 250,
                left: '50%',
                transform: `translateX(-50%) translateY(${floatY}px)`,
                zIndex: 20,
              }}
            >
              <img
                src={resolveSrc('/assets/private_jet_cutout.svg')}
                alt="Private Jet"
                style={{
                  width: 760,
                  height: 400,
                  objectFit: 'contain',
                  filter: 'drop-shadow(0 24px 45px rgba(0,0,0,0.95))',
                }}
              />
            </div>
          )}

          {/* Steaming Amala Bowl Cutout (Frames 160 - 245) */}
          {frame >= 160 && (
            <div
              style={{
                position: 'absolute',
                top: 240,
                left: '50%',
                transform: `translateX(-50%) translateY(${floatY}px)`,
                zIndex: 20,
              }}
            >
              {/* Warm Orange Glow behind Amala */}
              <div
                style={{
                  position: 'absolute',
                  inset: -20,
                  borderRadius: '50%',
                  background: 'radial-gradient(circle, rgba(255, 85, 0, 0.35) 0%, transparent 70%)',
                  pointerEvents: 'none',
                }}
              />
              <img
                src={resolveSrc('/assets/amala_bowl_cutout.png')}
                alt="Steaming Amala Bowl"
                style={{
                  maxHeight: 420,
                  maxWidth: 800,
                  objectFit: 'contain',
                  filter: 'drop-shadow(0 24px 45px rgba(0,0,0,0.95))',
                }}
              />
            </div>
          )}
        </>
      )}

      {/* BEAT 2 CUTOUTS: Chief Adedibu Arch Portrait & Wait 5 Hours Stamp */}
      {isBeat2 && (
        <>
          <div
            style={{
              position: 'absolute',
              top: 130,
              width: '100%',
              textAlign: 'center',
              fontFamily: playfairItalic.fontFamily,
              fontStyle: 'italic',
              fontSize: 44,
              color: 'rgba(255, 244, 230, 0.85)',
              letterSpacing: '0.02em',
              textShadow: '0 4px 14px rgba(0,0,0,0.85)',
            }}
          >
            Molete, Ibadan · 2003
          </div>

          <div
            style={{
              position: 'absolute',
              top: 220,
              left: '50%',
              transform: `translateX(-50%) scale(${interpolate(beat2Spring, [0, 1], [0.8, 1])}) translateY(${floatY}px)`,
              opacity: beat2Spring,
              zIndex: 20,
            }}
          >
            {/* Circular Orange Halo */}
            <div
              style={{
                position: 'absolute',
                inset: -30,
                borderRadius: '50%',
                background: 'radial-gradient(circle, rgba(255, 85, 0, 0.32) 0%, transparent 70%)',
                pointerEvents: 'none',
              }}
            />
            <img
              src={resolveSrc('/assets/adedibu_arch_portrait.png')}
              alt="Chief Lamidi Adedibu"
              style={{
                maxHeight: 520,
                maxWidth: 820,
                objectFit: 'contain',
                filter: 'drop-shadow(0 26px 50px rgba(0,0,0,0.95))',
              }}
            />
          </div>

          {/* "WAIT 5 HOURS" Badge (Frames 355 - 489) */}
          {frame >= 355 && (
            <div
              style={{
                position: 'absolute',
                top: 760,
                left: '50%',
                transform: `translateX(-50%) scale(${interpolate(wait5HoursSpring, [0, 1], [0.5, 1])}) rotate(-2.5deg)`,
                opacity: wait5HoursSpring,
                backgroundColor: '#FF5500',
                color: '#FFFFFF',
                fontFamily: anton.fontFamily,
                fontSize: 44,
                letterSpacing: '0.06em',
                textTransform: 'uppercase',
                padding: '10px 28px',
                borderRadius: 12,
                boxShadow: '0 12px 30px rgba(255, 85, 0, 0.6), 0 2px 4px rgba(0,0,0,0.4)',
                zIndex: 25,
              }}
            >
              ⏱️ WAITING 5 HOURS IN MOLETE
            </div>
          )}
        </>
      )}

      {/* BEAT 3 CUTOUTS: Ballot Box & Dynamic Red Strikethroughs */}
      {isBeat3 && (
        <>
          <div
            style={{
              position: 'absolute',
              top: 130,
              width: '100%',
              textAlign: 'center',
              fontFamily: playfairItalic.fontFamily,
              fontStyle: 'italic',
              fontSize: 44,
              color: 'rgba(255, 244, 230, 0.85)',
              letterSpacing: '0.02em',
              textShadow: '0 4px 14px rgba(0,0,0,0.85)',
            }}
          >
            The Paradox of Power
          </div>

          {/* Chief Adedibu Arch Portrait behind Strikethroughs */}
          <div
            style={{
              position: 'absolute',
              top: 220,
              left: '50%',
              transform: `translateX(-50%) translateY(${floatY}px)`,
              zIndex: 20,
            }}
          >
            <div
              style={{
                position: 'absolute',
                inset: -25,
                borderRadius: '50%',
                background: 'radial-gradient(circle, rgba(255, 85, 0, 0.28) 0%, transparent 70%)',
                pointerEvents: 'none',
              }}
            />
            <img
              src={resolveSrc('/assets/adedibu_arch_portrait.png')}
              alt="Chief Lamidi Adedibu"
              style={{
                maxHeight: 520,
                maxWidth: 820,
                objectFit: 'contain',
                filter: 'drop-shadow(0 26px 50px rgba(0,0,0,0.95))',
              }}
            />
          </div>

          {/* Strikethrough Badges */}
          <div
            style={{
              position: 'absolute',
              top: 620,
              width: '100%',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 12,
              zIndex: 25,
            }}
          >
            {frame >= 570 && (
              <div
                style={{
                  position: 'relative',
                  display: 'inline-block',
                  padding: '6px 24px',
                  backgroundColor: 'rgba(255,255,255,0.08)',
                  borderRadius: 8,
                  border: '1.5px solid rgba(255,255,255,0.16)',
                  opacity: strike1Spring,
                  transform: `scale(${interpolate(strike1Spring, [0, 1], [0.8, 1])})`,
                }}
              >
                <span
                  style={{
                    fontFamily: oswald.fontFamily,
                    fontWeight: 700,
                    fontSize: 40,
                    letterSpacing: '0.06em',
                    color: '#FFFFFF',
                    textTransform: 'uppercase',
                  }}
                >
                  NOT A GOVERNOR
                </span>
                <div
                  style={{
                    position: 'absolute',
                    top: '50%',
                    left: -10,
                    right: -10,
                    height: 7,
                    backgroundColor: '#E1261C',
                    borderRadius: 4,
                    boxShadow: '0 4px 12px rgba(225, 38, 28, 0.7)',
                    transform: 'translateY(-50%) rotate(-2deg)',
                  }}
                />
              </div>
            )}

            {frame >= 640 && (
              <div
                style={{
                  position: 'relative',
                  display: 'inline-block',
                  padding: '6px 24px',
                  backgroundColor: 'rgba(255,255,255,0.08)',
                  borderRadius: 8,
                  border: '1.5px solid rgba(255,255,255,0.16)',
                  opacity: strike2Spring,
                  transform: `scale(${interpolate(strike2Spring, [0, 1], [0.8, 1])})`,
                }}
              >
                <span
                  style={{
                    fontFamily: oswald.fontFamily,
                    fontWeight: 700,
                    fontSize: 40,
                    letterSpacing: '0.06em',
                    color: '#FFFFFF',
                    textTransform: 'uppercase',
                  }}
                >
                  NOT A SENATOR
                </span>
                <div
                  style={{
                    position: 'absolute',
                    top: '50%',
                    left: -10,
                    right: -10,
                    height: 7,
                    backgroundColor: '#E1261C',
                    borderRadius: 4,
                    boxShadow: '0 4px 12px rgba(225, 38, 28, 0.7)',
                    transform: 'translateY(-50%) rotate(-2deg)',
                  }}
                />
              </div>
            )}

            {frame >= 700 && (
              <div
                style={{
                  position: 'relative',
                  display: 'inline-block',
                  padding: '6px 24px',
                  backgroundColor: 'rgba(255,255,255,0.08)',
                  borderRadius: 8,
                  border: '1.5px solid rgba(255,255,255,0.16)',
                  opacity: strike3Spring,
                  transform: `scale(${interpolate(strike3Spring, [0, 1], [0.8, 1])})`,
                }}
              >
                <span
                  style={{
                    fontFamily: oswald.fontFamily,
                    fontWeight: 700,
                    fontSize: 40,
                    letterSpacing: '0.06em',
                    color: '#FFFFFF',
                    textTransform: 'uppercase',
                  }}
                >
                  NO OFFICIAL TITLE
                </span>
                <div
                  style={{
                    position: 'absolute',
                    top: '50%',
                    left: -10,
                    right: -10,
                    height: 7,
                    backgroundColor: '#E1261C',
                    borderRadius: 4,
                    boxShadow: '0 4px 12px rgba(225, 38, 28, 0.7)',
                    transform: 'translateY(-50%) rotate(-2deg)',
                  }}
                />
              </div>
            )}
          </div>
        </>
      )}

      {/* BEAT 4 CUTOUTS: Chief Adedibu Arch Portrait in front of Billboard */}
      {isBeat4 && (
        <>
          <div
            style={{
              position: 'absolute',
              top: 130,
              width: '100%',
              textAlign: 'center',
              fontFamily: playfairItalic.fontFamily,
              fontStyle: 'italic',
              fontSize: 44,
              color: 'rgba(255, 244, 230, 0.85)',
              letterSpacing: '0.02em',
              textShadow: '0 4px 14px rgba(0,0,0,0.85)',
            }}
          >
            The Brutal Truth
          </div>

          <div
            style={{
              position: 'absolute',
              top: 220,
              left: '50%',
              transform: `translateX(-50%) translateY(${floatY}px)`,
              zIndex: 20,
            }}
          >
            <div
              style={{
                position: 'absolute',
                inset: -20,
                borderRadius: '50%',
                background: 'radial-gradient(circle, rgba(255, 85, 0, 0.35) 0%, transparent 70%)',
                pointerEvents: 'none',
              }}
            />
            <img
              src={resolveSrc('/assets/adedibu_arch_portrait.png')}
              alt="Chief Lamidi Adedibu"
              style={{
                maxHeight: 520,
                maxWidth: 820,
                objectFit: 'contain',
                filter: 'drop-shadow(0 26px 50px rgba(0,0,0,0.95))',
              }}
            />
          </div>
        </>
      )}

      {/* BEAT 5 CUTOUTS: Paper Grid + 3 Community Welfare Badges */}
      {isBeat5 && (
        <>
          <div
            style={{
              position: 'absolute',
              top: 130,
              width: '100%',
              textAlign: 'center',
              fontFamily: playfairItalic.fontFamily,
              fontStyle: 'italic',
              fontSize: 44,
              color: '#4A4036',
              letterSpacing: '0.02em',
            }}
          >
            The Molete Welfare Machine
          </div>

          <div
            style={{
              position: 'absolute',
              top: 220,
              left: '50%',
              transform: `translateX(-50%) translateY(${floatY}px)`,
              zIndex: 20,
            }}
          >
            <img
              src={resolveSrc('/assets/adedibu_arch_portrait.png')}
              alt="Chief Lamidi Adedibu"
              style={{
                maxHeight: 480,
                maxWidth: 780,
                objectFit: 'contain',
                filter: 'drop-shadow(0 22px 35px rgba(35, 28, 22, 0.35))',
              }}
            />
          </div>

          {/* 3 Welfare Badges (Hospital, Disputes, Hot Food) */}
          <div
            style={{
              position: 'absolute',
              top: 730,
              width: '100%',
              display: 'flex',
              flexWrap: 'wrap',
              justifyContent: 'center',
              gap: 16,
              zIndex: 25,
              padding: '0 40px',
            }}
          >
            {frame >= 1320 && (
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10,
                  padding: '10px 22px',
                  backgroundColor: '#1E1914',
                  borderRadius: 999,
                  boxShadow: '0 8px 20px rgba(0,0,0,0.3)',
                  opacity: badgeHospital,
                  transform: `scale(${interpolate(badgeHospital, [0, 1], [0.7, 1])})`,
                }}
              >
                <span style={{ fontSize: 28 }}>🏥</span>
                <span style={{ fontFamily: poppins.fontFamily, fontWeight: 800, fontSize: 30, color: '#FFFFFF' }}>
                  HOSPITAL BILLS
                </span>
              </div>
            )}

            {frame >= 1375 && (
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10,
                  padding: '10px 22px',
                  backgroundColor: '#1E1914',
                  borderRadius: 999,
                  boxShadow: '0 8px 20px rgba(0,0,0,0.3)',
                  opacity: badgeDisputes,
                  transform: `scale(${interpolate(badgeDisputes, [0, 1], [0.7, 1])})`,
                }}
              >
                <span style={{ fontSize: 28 }}>⚖️</span>
                <span style={{ fontFamily: poppins.fontFamily, fontWeight: 800, fontSize: 30, color: '#FFFFFF' }}>
                  SETTLED DISPUTES
                </span>
              </div>
            )}

            {frame >= 1425 && (
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10,
                  padding: '10px 22px',
                  backgroundColor: '#FF5500',
                  borderRadius: 999,
                  boxShadow: '0 8px 20px rgba(255,85,0,0.4)',
                  opacity: badgeFood,
                  transform: `scale(${interpolate(badgeFood, [0, 1], [0.7, 1])})`,
                }}
              >
                <span style={{ fontSize: 28 }}>🍲</span>
                <span style={{ fontFamily: poppins.fontFamily, fontWeight: 800, fontSize: 30, color: '#FFFFFF' }}>
                  STEAMING HOT FOOD
                </span>
              </div>
            )}
          </div>
        </>
      )}

      {/* BEAT 6 CUTOUTS: Chief Adedibu Arch Portrait in Golden Halo */}
      {isBeat6 && (
        <>
          <div
            style={{
              position: 'absolute',
              top: 130,
              width: '100%',
              textAlign: 'center',
              fontFamily: playfairItalic.fontFamily,
              fontStyle: 'italic',
              fontSize: 44,
              color: 'rgba(255, 244, 230, 0.85)',
              letterSpacing: '0.02em',
              textShadow: '0 4px 14px rgba(0,0,0,0.85)',
            }}
          >
            The Moral Truth
          </div>

          <div
            style={{
              position: 'absolute',
              top: 220,
              left: '50%',
              transform: `translateX(-50%) translateY(${floatY}px)`,
              zIndex: 20,
            }}
          >
            {/* Rich Golden Spotlight Aura */}
            <div
              style={{
                position: 'absolute',
                inset: -35,
                borderRadius: '50%',
                background: 'radial-gradient(circle, rgba(255, 120, 0, 0.45) 0%, transparent 72%)',
                pointerEvents: 'none',
              }}
            />
            <img
              src={resolveSrc('/assets/adedibu_arch_portrait.png')}
              alt="Chief Lamidi Adedibu"
              style={{
                maxHeight: 540,
                maxWidth: 820,
                objectFit: 'contain',
                filter: 'drop-shadow(0 28px 55px rgba(0,0,0,0.98))',
              }}
            />
          </div>
        </>
      )}

      {/* ========================================================================= */}
      {/* 4. MASTER WORD-BY-WORD KINETIC CAPTIONS (OPTICAL CENTER SAFE ZONE)       */}
      {/* ========================================================================= */}
      <WordByWordCaptions
        accentColor="#FF5500"
        lightBackground={isLightBg}
        fontSize={isLightBg ? 72 : 78}
        style={{
          top: isBeat5 ? '58%' : '56%',
        }}
      />
    </div>
  );
};
