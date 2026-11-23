import React from 'react';
import { interpolate, useCurrentFrame } from 'remotion';
import { StoryScene, AspectRatio } from '../types/story';
import { StudioBackground } from '../components/backgrounds/StudioBackground';
import { GridOverlay } from '../components/backgrounds/GridOverlay';
import { FilmGrainOverlay } from '../components/backgrounds/FilmGrainOverlay';
import { CameraRig } from '../components/camera/CameraRig';
import { KineticText } from '../components/typography/KineticText';
import { CutoutImage } from '../components/cutouts/CutoutImage';
import { NewspaperLayout } from '../components/layouts/NewspaperLayout';
import { TornPaperHeader } from '../components/layouts/TornPaperHeader';
import { SocialMediaCard } from '../components/layouts/SocialMediaCard';
import { ChapterSticker } from '../components/typography/ChapterSticker';
import { ChromaticAberration } from '../components/effects/ChromaticAberration';
import { HalftoneEffect } from '../components/effects/HalftoneEffect';
import { AnimatedBarChart } from '../components/shapes/AnimatedBarChart';
import { AnimatedCaptions } from '../components/captions/AnimatedCaptions';
import { SoundDirector } from '../audio/SoundEffect';

interface SceneRendererProps {
  scene: StoryScene;
  aspectRatio: AspectRatio;
  theme: {
    primaryColor: string;
    accentColor: string;
    textColor: string;
    paperColor: string;
    fontFamilyHeading: string;
    fontFamilyBody: string;
  };
}

export const SceneRenderer: React.FC<SceneRendererProps> = ({
  scene,
  aspectRatio,
  theme,
}) => {
  const isVertical = aspectRatio === '9:16';

  return (
    <div
      style={{
        position: 'relative',
        width: '100%',
        height: '100%',
        overflow: 'hidden',
        backgroundColor: theme.primaryColor,
      }}
    >
      {/* 1. Background layer */}
      <StudioBackground
        type={scene.background.type}
        primaryColor={scene.background.color || theme.primaryColor}
        showVignette
      />

      {/* 2. Technical Grid Overlay */}
      {scene.background.showCoordinates && (
        <GridOverlay
          label={`SCENE // ${scene.id.toUpperCase()}`}
          color={isVertical ? '#ffffff' : '#94a3b8'}
          opacity={0.3}
        />
      )}

      {/* 2.5 Torn Paper Top Header (Reference Style: @mohi.visuals) */}
      {scene.tornHeader && (
        <TornPaperHeader
          color={scene.tornHeader.color || theme.accentColor}
          height={scene.tornHeader.height || (isVertical ? '26%' : '20%')}
        >
          <div style={{ textAlign: 'center', color: '#ffffff', textTransform: 'uppercase' }}>
            {scene.tornHeader.subtitle && (
              <div style={{ fontSize: '24px', fontWeight: 800, letterSpacing: '0.22em', opacity: 0.9 }}>
                {scene.tornHeader.subtitle}
              </div>
            )}
            <div style={{ fontSize: isVertical ? '56px' : '48px', fontWeight: 900, letterSpacing: '0.04em', fontFamily: 'Impact, sans-serif', lineHeight: 0.95 }}>
              {scene.tornHeader.title}
            </div>
          </div>
        </TornPaperHeader>
      )}

      {/* 3. 2.5D Camera Rig containing the scene subject matter */}
      <CameraRig
        panX={scene.camera?.panX || [0, 0]}
        panY={scene.camera?.panY || [0, 0]}
        zoom={scene.camera?.zoom || [1.0, 1.05]}
        tilt={scene.camera?.tilt || [0, 0]}
        rotateX={scene.camera?.rotateX || [0, 0]}
        rotateY={scene.camera?.rotateY || [0, 0]}
        shake={Boolean(scene.camera?.shakeIntensity)}
        shakeIntensity={scene.camera?.shakeIntensity || 1.5}
        durationInFrames={scene.durationInFrames}
      >
        <div
          style={{
            position: 'relative',
            width: '100%',
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            padding: isVertical ? '80px 40px 140px 40px' : '60px 80px',
          }}
        >
          {/* A. Newspaper Layout Mode */}
          {scene.newspaper && (
            <div style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
              <NewspaperLayout
                masthead={scene.newspaper.masthead}
                issueDate={scene.newspaper.date}
                headline={scene.newspaper.headline}
                subheadline={scene.newspaper.subheadline}
                columns={scene.newspaper.columns}
                highlightText={scene.newspaper.highlightPhrase}
                redactedText={scene.newspaper.redactedPhrase}
              />
            </div>
          )}

          {/* A.5 Chapter Sticker (Reference Style: "Three years later") */}
          {scene.chapterSticker && (
            <div style={{ zIndex: 25, marginBottom: '20px' }}>
              <ChapterSticker
                text={scene.chapterSticker.text}
                color={scene.chapterSticker.color || theme.accentColor}
                textColor={scene.chapterSticker.textColor || '#ffffff'}
                rotation={scene.chapterSticker.rotation ?? -3}
              />
            </div>
          )}

          {/* B. Kinetic Headline */}
          {scene.headline && (
            <div
              style={{
                zIndex: 20,
                marginBottom: isVertical ? '35px' : '30px',
                width: '100%',
                maxWidth: isVertical ? '950px' : '1400px',
              }}
            >
              {scene.chromaticGlitch ? (
                <ChromaticAberration intensity={4}>
                  <KineticText
                    text={scene.headline.text}
                    mode={scene.headline.animation || 'staggered-slide'}
                    highlightWords={scene.headline.highlightWords || []}
                    highlightColor={theme.accentColor}
                    textColor={theme.textColor}
                    fontSize={isVertical ? 56 : 52}
                    fontFamily={theme.fontFamilyHeading}
                  />
                </ChromaticAberration>
              ) : (
                <KineticText
                  text={scene.headline.text}
                  mode={scene.headline.animation || 'staggered-slide'}
                  highlightWords={scene.headline.highlightWords || []}
                  highlightColor={theme.accentColor}
                  textColor={theme.textColor}
                  fontSize={isVertical ? 56 : 52}
                  fontFamily={theme.fontFamilyHeading}
                />
              )}
            </div>
          )}

          {/* B.5 Social Media Card (Reference Style: @mohi.visuals 2.5D popout) */}
          {scene.socialCard && (
            <div style={{ zIndex: 15, margin: '20px 0' }}>
              <SocialMediaCard
                handle={scene.socialCard.handle}
                location={scene.socialCard.location}
                postImageSrc={scene.socialCard.postImageSrc}
                cutoutSrc={scene.socialCard.cutoutSrc}
                likes={scene.socialCard.likes}
                comments={scene.socialCard.comments}
                rotation={scene.socialCard.rotation ?? -3}
                width={scene.socialCard.width || (isVertical ? 480 : 420)}
              />
            </div>
          )}

          {/* C. Cutout Images / Subjects */}
          {scene.cutouts && scene.cutouts.length > 0 && !scene.socialCard && (
            <div
              style={{
                position: 'relative',
                width: '100%',
                flex: 1,
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              {scene.cutouts.map((cutout, idx) => (
                <div
                  key={idx}
                  style={{
                    position: 'absolute',
                    left: `${cutout.x ?? 50}%`,
                    top: `${cutout.y ?? 50}%`,
                    transform: 'translate(-50%, -50%)',
                  }}
                >
                  {scene.halftoneEffect ? (
                    <HalftoneEffect
                      shape="circle"
                      dotSize={4.5}
                      width={isVertical ? 400 : 360}
                      height={isVertical ? 400 : 360}
                    >
                      <CutoutImage
                        src={cutout.src}
                        alt={cutout.caption || 'Scene asset'}
                        tape={cutout.tape}
                        pin={cutout.pin}
                        polaroid={cutout.polaroid}
                        polaroidLabel={cutout.caption}
                        rotation={cutout.rotation ?? -2}
                        depth={cutout.depth ?? 2}
                        width={isVertical ? 400 : 360}
                      />
                    </HalftoneEffect>
                  ) : (
                    <CutoutImage
                      src={cutout.src}
                      alt={cutout.caption || 'Scene asset'}
                      tape={cutout.tape}
                      pin={cutout.pin}
                      polaroid={cutout.polaroid}
                      polaroidLabel={cutout.caption}
                      rotation={cutout.rotation ?? -2}
                      depth={cutout.depth ?? 2}
                      width={isVertical ? 420 : 380}
                    />
                  )}
                </div>
              ))}
            </div>
          )}

          {/* D. Data Visualization / Bar Chart */}
          {scene.diagram && scene.diagram.type === 'barchart' && (
            <div
              style={{
                width: isVertical ? '95%' : '80%',
                maxWidth: '1000px',
                marginTop: '20px',
              }}
            >
              <AnimatedBarChart
                items={scene.diagram.items.map((i) => ({
                  label: i.label,
                  value: Number(i.value),
                  color: i.color,
                }))}
                barColor={theme.accentColor}
                height={isVertical ? 280 : 320}
              />
            </div>
          )}
        </div>
      </CameraRig>

      {/* 4. Film Grain Overlay */}
      {scene.background.showGrain !== false && (
        <FilmGrainOverlay opacity={0.07} />
      )}

      {/* 5. Subtitles & Animated Captions */}
      {scene.captions && scene.captions.length > 0 && (
        <AnimatedCaptions
          captions={scene.captions}
          highlightColor={theme.accentColor}
          fontSize={isVertical ? 48 : 34}
          positionBottom={isVertical ? '15%' : '8%'}
        />
      )}

      {/* 6. Sound Effects Engine */}
      {scene.soundEffects && (
        <SoundDirector effects={scene.soundEffects} />
      )}
    </div>
  );
};
