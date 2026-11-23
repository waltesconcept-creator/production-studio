import React from 'react';
import { Composition } from 'remotion';
import { AdedibuStory } from './compositions/AdedibuStory';
import { ChattyExplainerVertical } from './compositions/ChattyExplainerVertical';
import { ActiveStory } from './compositions/ActiveStory';
import { ACTIVE_STORY } from './compositions/sampleStories/activeStory';
import { RefStyleShowcase } from './compositions/RefStyleShowcase';
import { LandscapeStory } from './compositions/LandscapeStory';
import { VerticalStory } from './compositions/VerticalStory';
import { ComponentShowcase } from './compositions/ComponentShowcase';
import { NewspaperLayout } from './components/layouts/NewspaperLayout';
import { MagazineCover } from './components/layouts/MagazineCover';
import { DocumentViewer } from './components/layouts/DocumentViewer';

export const RemotionRoot: React.FC = () => {
  const activeDuration = ACTIVE_STORY.scenes.reduce((acc, s) => acc + s.durationInFrames, 0);

  return (
    <>
      {/* 0.0 Chatty by Locari: 2D Motion Graphics & WhatsApp UI Explainer (9:16 Vertical) */}
      <Composition
        id="ChattyExplainerVertical"
        component={ChattyExplainerVertical}
        durationInFrames={1500}
        fps={30}
        width={1080}
        height={1920}
        defaultProps={{}}
      />

      {/* 0. Alex Hormozi Format Master Story: Chief Lamidi Adedibu (9:16 Vertical) */}
      <Composition
        id="AdedibuStory"
        component={AdedibuStory}
        durationInFrames={2022}
        fps={30}
        width={1080}
        height={1920}
        defaultProps={{}}
      />

      {/* 0.1 Active Studio Story (Black, Orange & White Brand Pipeline) */}
      <Composition
        id="ActiveStory"
        component={ActiveStory}
        durationInFrames={activeDuration || 390}
        fps={ACTIVE_STORY.fps || 30}
        width={ACTIVE_STORY.width || 1920}
        height={ACTIVE_STORY.height || 1080}
        defaultProps={{}}
      />

      {/* 0.5. Reference Style Showcase (9:16 Vertical: Rami.visualz / Mohi.visuals / Documentary) */}
      <Composition
        id="RefStyleShowcase"
        component={RefStyleShowcase}
        durationInFrames={270}
        fps={30}
        width={1080}
        height={1920}
        defaultProps={{}}
      />

      {/* 1. Full 16:9 Documentary / Founder Story */}
      <Composition
        id="LandscapeStory"
        component={LandscapeStory}
        durationInFrames={620}
        fps={30}
        width={1920}
        height={1080}
        defaultProps={{}}
      />

      {/* 2. Full 9:16 Vertical Story (Shorts / Reels / TikTok) */}
      <Composition
        id="VerticalStory"
        component={VerticalStory}
        durationInFrames={300}
        fps={30}
        width={1080}
        height={1920}
        defaultProps={{}}
      />

      {/* 3. Reusable Component Suite Showcase */}
      <Composition
        id="ComponentShowcase"
        component={ComponentShowcase}
        durationInFrames={460}
        fps={30}
        width={1920}
        height={1080}
        defaultProps={{}}
      />

      {/* 4. Standalone Newspaper Layout Still / Sequence */}
      <Composition
        id="NewspaperScene"
        component={() => (
          <div
            style={{
              width: '100%',
              height: '100%',
              backgroundColor: '#121214',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '40px',
            }}
          >
            <NewspaperLayout
              headline="VENTURE UNVEILS NEXT-GEN MOTION GRAPHICS ENGINE"
              subheadline="AI-assisted storytelling produces broadcast documentary videos in minutes"
              columns={[
                'Engineers announced the production-ready motion graphics studio today, leveraging React, Remotion, and vector cutout compositing.',
                'The system allows instant transition between landscape 16:9 cinematic formats and vertical 9:16 mobile feeds with synchronized sound design.',
              ]}
              highlightText="leveraging React, Remotion, and vector cutout compositing"
              redactedText="PROPRIETARY PARALLAX ALGORITHMS"
            />
          </div>
        )}
        durationInFrames={120}
        fps={30}
        width={1920}
        height={1080}
      />

      {/* 5. Standalone Magazine Cover Still / Sequence */}
      <Composition
        id="MagazineScene"
        component={() => (
          <div
            style={{
              width: '100%',
              height: '100%',
              backgroundColor: '#0a0a0d',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <MagazineCover
              headline="THE ARCHITECT OF MODERN AI"
              publication="FOUNDERS"
              subjectName="JENSEN HUANG"
              subjectImageSrc="/assets/founder-portrait.svg"
            />
          </div>
        )}
        durationInFrames={120}
        fps={30}
        width={1080}
        height={1920}
      />
    </>
  );
};
