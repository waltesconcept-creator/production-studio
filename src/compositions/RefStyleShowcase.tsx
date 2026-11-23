import React from 'react';
import { Series } from 'remotion';
import { StudioBackground } from '../components/backgrounds/StudioBackground';
import { GridOverlay } from '../components/backgrounds/GridOverlay';
import { FilmGrainOverlay } from '../components/backgrounds/FilmGrainOverlay';
import { CameraRig } from '../components/camera/CameraRig';
import { KineticText } from '../components/typography/KineticText';
import { ChromaticAberration } from '../components/effects/ChromaticAberration';
import { HalftoneEffect } from '../components/effects/HalftoneEffect';
import { CutoutImage } from '../components/cutouts/CutoutImage';
import { SocialMediaCard } from '../components/layouts/SocialMediaCard';
import { TornPaperHeader } from '../components/layouts/TornPaperHeader';
import { ChapterSticker } from '../components/typography/ChapterSticker';
import { WordHighlight } from '../components/typography/WordHighlight';
import { SoundDirector } from '../audio/SoundEffect';

export const RefStyleShowcase: React.FC = () => {
  return (
    <div style={{ width: '100%', height: '100%', backgroundColor: '#08080a', color: '#ffffff', overflow: 'hidden' }}>
      <FilmGrainOverlay opacity={0.07} />

      <Series>
        {/* Style 1: Rami.visualz / Hormozi Hook (Halftone Raster + Chromatic Glitch + 3D Paper Tilt) */}
        <Series.Sequence durationInFrames={90}>
          <div style={{ position: 'relative', width: '100%', height: '100%' }}>
            <StudioBackground type="paper-warm" primaryColor="#f0ede6" />
            <GridOverlay label="STYLE 01 // @RAMI.VISUALZ HORMOZI HOOK" color="#111" opacity={0.2} />

            <CameraRig zoom={[1.0, 1.12]} tilt={[4, -2]} rotateX={[12, 4]} rotateY={[-8, 2]}>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', padding: '60px 40px' }}>
                <ChromaticAberration intensity={4}>
                  <div style={{ fontFamily: 'Georgia, serif', fontStyle: 'italic', fontSize: '56px', color: '#111', marginBottom: '24px' }}>
                    Alex Hormozi's
                  </div>
                </ChromaticAberration>

                {/* Halftone Dot Raster Portrait Cutout */}
                <HalftoneEffect shape="circle" dotSize={4.5} width={420} height={420} style={{ margin: '20px 0' }}>
                  <img
                    src="/assets/founder-portrait.svg"
                    alt="Founder Halftone"
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                </HalftoneEffect>

                <div style={{ marginTop: '30px', textAlign: 'center' }}>
                  <span style={{ fontSize: '52px', fontWeight: 900, color: '#ff5500', fontFamily: 'Impact, sans-serif', letterSpacing: '0.04em' }}>
                    $100 MILLION
                  </span>
                  <span style={{ fontSize: '44px', fontWeight: 700, color: '#1a1a1a', marginLeft: '12px', fontFamily: 'sans-serif' }}>
                    hook
                  </span>
                </div>
              </div>
            </CameraRig>

            <SoundDirector
              effects={[
                { id: 'rs1', frame: 2, type: 'whoosh' },
                { id: 'rs2', frame: 35, type: 'pop' },
              ]}
            />
          </div>
        </Series.Sequence>

        {/* Style 2: Mohi.visuals (Torn Paper Orange Header + 2.5D Social Media Card Pop-out) */}
        <Series.Sequence durationInFrames={90}>
          <div style={{ position: 'relative', width: '100%', height: '100%' }}>
            <StudioBackground type="dots" primaryColor="#090a0f" />

            {/* Orange Torn Paper Header */}
            <TornPaperHeader color="#ff5500" height="28%">
              <div style={{ textAlign: 'center', color: '#ffffff', textTransform: 'uppercase' }}>
                <div style={{ fontSize: '28px', fontWeight: 800, letterSpacing: '0.25em', opacity: 0.9 }}>
                  MULTI
                </div>
                <div style={{ fontSize: '64px', fontWeight: 900, letterSpacing: '0.04em', fontFamily: 'Impact, sans-serif', lineHeight: 0.95 }}>
                  MILLIONAIRE
                </div>
              </div>
            </TornPaperHeader>

            <CameraRig zoom={[1.0, 1.1]} panY={[0, -20]}>
              <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%', paddingTop: '160px' }}>
                <SocialMediaCard
                  handle="georgeheaton"
                  location="Death Valley"
                  postImageSrc="/assets/vintage-photo.svg"
                  cutoutSrc="/assets/founder-portrait.svg"
                  likes="8,956"
                  comments="57"
                  rotation={-3}
                  width={480}
                />
              </div>
            </CameraRig>

            <SoundDirector
              effects={[
                { id: 'rs3', frame: 2, type: 'paper-crinkle' },
                { id: 'rs4', frame: 30, type: 'camera-shutter' },
              ]}
            />
          </div>
        </Series.Sequence>

        {/* Style 3: Netflix Documentary (Vintage Frame + Monochrome CRT + "Three years later" Sticker) */}
        <Series.Sequence durationInFrames={90}>
          <div style={{ position: 'relative', width: '100%', height: '100%' }}>
            <StudioBackground type="paper-dark" primaryColor="#0e0e12" />

            {/* Vintage Golden Museum Frame Border */}
            <div
              style={{
                position: 'absolute',
                inset: '20px',
                border: '14px solid #c59b27',
                boxShadow: 'inset 0 0 30px rgba(0,0,0,0.8), 0 10px 40px rgba(0,0,0,0.9)',
                zIndex: 20,
                pointerEvents: 'none',
              }}
            />

            <CameraRig zoom={[1.02, 1.15]} shake={true} shakeIntensity={1.0}>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', padding: '80px 40px' }}>
                {/* Monochrome archive photo */}
                <div style={{ filter: 'grayscale(100%) contrast(130%)', marginBottom: '40px', width: '85%' }}>
                  <img
                    src="/assets/vintage-photo.svg"
                    alt="Archive Scene"
                    style={{ width: '100%', display: 'block', borderRadius: '4px' }}
                  />
                </div>

                {/* Orange Chapter Sticker */}
                <ChapterSticker
                  topText="Three years"
                  bottomText="later"
                  color="#ff5500"
                  textColor="#ffffff"
                  rotation={-4}
                />
              </div>
            </CameraRig>

            <SoundDirector
              effects={[
                { id: 'rs5', frame: 5, type: 'whoosh' },
                { id: 'rs6', frame: 35, type: 'stamp' },
              ]}
            />
          </div>
        </Series.Sequence>
      </Series>
    </div>
  );
};
