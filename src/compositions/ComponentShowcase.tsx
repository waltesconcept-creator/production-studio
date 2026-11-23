import React from 'react';
import { Series, useCurrentFrame } from 'remotion';
import { StudioBackground } from '../components/backgrounds/StudioBackground';
import { GridOverlay } from '../components/backgrounds/GridOverlay';
import { FilmGrainOverlay } from '../components/backgrounds/FilmGrainOverlay';
import { KineticText } from '../components/typography/KineticText';
import { TextHighlighter } from '../components/typography/TextHighlighter';
import { RedactedText } from '../components/typography/RedactedText';
import { AnimatedCounter } from '../components/typography/AnimatedCounter';
import { WordHighlight } from '../components/typography/WordHighlight';
import { CutoutImage } from '../components/cutouts/CutoutImage';
import { PhotoCollage } from '../components/cutouts/PhotoCollage';
import { NewspaperLayout } from '../components/layouts/NewspaperLayout';
import { DocumentViewer } from '../components/layouts/DocumentViewer';
import { MagazineCover } from '../components/layouts/MagazineCover';
import { AnimatedArrow } from '../components/shapes/AnimatedArrow';
import { HandDrawnCircle } from '../components/shapes/HandDrawnCircle';
import { AnimatedBarChart } from '../components/shapes/AnimatedBarChart';
import { RoadmapTimeline } from '../components/shapes/RoadmapTimeline';
import { CameraRig } from '../components/camera/CameraRig';
import { AnimatedCaptions } from '../components/captions/AnimatedCaptions';
import { CaptionPill } from '../components/captions/CaptionPill';
import { SoundDirector } from '../audio/SoundEffect';

export const ComponentShowcase: React.FC = () => {
  return (
    <div style={{ width: '100%', height: '100%', backgroundColor: '#090a0f', color: '#fff' }}>
      <FilmGrainOverlay opacity={0.08} />

      <Series>
        {/* Module 1: Kinetic Typography & Text Reveal */}
        <Series.Sequence durationInFrames={90}>
          <div style={{ position: 'relative', width: '100%', height: '100%' }}>
            <StudioBackground type="grid" primaryColor="#090d16" />
            <GridOverlay label="MODULE 01 // KINETIC TYPOGRAPHY" />
            <CameraRig zoom={[1.0, 1.08]} tilt={[0, -1]}>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
                <KineticText
                  text="DYNAMIC KINETIC TEXT WITH SPRING PHYSICS"
                  mode="staggered-slide"
                  highlightWords={['DYNAMIC', 'SPRING', 'PHYSICS']}
                  highlightColor="#38bdf8"
                  fontSize={64}
                />
                <div style={{ marginTop: '30px', fontSize: '32px', display: 'flex', gap: '20px', alignItems: 'center' }}>
                  <span>Investigating the</span>
                  <TextHighlighter delay={20} color="#facc15">
                    $100,000,000,000
                  </TextHighlighter>
                  <span>clandestine memo</span>
                </div>
              </div>
            </CameraRig>
            <SoundDirector
              effects={[
                { id: 's1', frame: 5, type: 'whoosh' },
                { id: 's2', frame: 25, type: 'marker' },
              ]}
            />
          </div>
        </Series.Sequence>

        {/* Module 2: Newspaper & Classified Dossier Layouts */}
        <Series.Sequence durationInFrames={100}>
          <div style={{ position: 'relative', width: '100%', height: '100%' }}>
            <StudioBackground type="paper-dark" primaryColor="#101114" />
            <GridOverlay label="MODULE 02 // EDITORIAL & NEWSPAPER LAYOUTS" />
            <CameraRig zoom={[1.0, 1.12]} panY={[0, -20]}>
              <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                <NewspaperLayout
                  masthead="THE INVESTIGATIVE GAZETTE"
                  issueDate="NOVEMBER 20, 2026"
                  headline="VENTURE FIRM UNVEILS AUTOMATED MOTION GRAPHICS STUDIO"
                  subheadline="Remotion-powered pipeline revolutionizes documentary video production"
                  columns={[
                    'Producers and filmmakers worldwide can now generate high-velocity motion graphics, animated cutouts, and kinetic layouts programmatically.',
                    'The integration of React code with Remotion enables frame-perfect rendering at scale for 16:9 and vertical 9:16 social storytelling.',
                  ]}
                  highlightText="Producers and filmmakers worldwide can now generate high-velocity motion graphics"
                  redactedText="TOP SECRET CLASSIFIED CODEBASE"
                />
              </div>
            </CameraRig>
            <SoundDirector
              effects={[
                { id: 's3', frame: 2, type: 'paper-crinkle' },
                { id: 's4', frame: 25, type: 'stamp' },
                { id: 's5', frame: 50, type: 'marker' },
              ]}
            />
          </div>
        </Series.Sequence>

        {/* Module 3: Cutouts, Polaroid, Tape & Push Pins */}
        <Series.Sequence durationInFrames={90}>
          <div style={{ position: 'relative', width: '100%', height: '100%' }}>
            <StudioBackground type="blueprint" primaryColor="#020817" />
            <GridOverlay label="MODULE 03 // 2.5D CUTOUTS & COLLAGES" />
            <CameraRig zoom={[1.0, 1.15]} rotateX={[0, 8]}>
              <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%', gap: '80px' }}>
                <CutoutImage
                  src="/assets/founder-portrait.svg"
                  pin
                  rotation={-5}
                  width={340}
                  polaroid
                  polaroidLabel="Founder & Visionary"
                  delay={5}
                />
                <CutoutImage
                  src="/assets/ai-chip.svg"
                  tape
                  rotation={6}
                  width={320}
                  delay={20}
                />
              </div>
            </CameraRig>
            <AnimatedArrow startX={550} startY={450} endX={950} endY={380} color="#f43f5e" delay={30} />
            <HandDrawnCircle cx={650} cy={520} rx={140} ry={80} color="#38bdf8" delay={45} />
            <SoundDirector
              effects={[
                { id: 's6', frame: 5, type: 'whoosh' },
                { id: 's7', frame: 20, type: 'tape-snap' },
                { id: 's8', frame: 45, type: 'pop' },
              ]}
            />
          </div>
        </Series.Sequence>

        {/* Module 4: Data Visualization & Counter */}
        <Series.Sequence durationInFrames={90}>
          <div style={{ position: 'relative', width: '100%', height: '100%' }}>
            <StudioBackground type="dots" primaryColor="#0b0e14" />
            <GridOverlay label="MODULE 04 // DATA DIAGRAMS & COUNTERS" />
            <CameraRig zoom={[1.0, 1.05]}>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
                <div style={{ marginBottom: '20px', textAlign: 'center' }}>
                  <span style={{ fontSize: '28px', color: '#94a3b8', marginRight: '16px' }}>TOTAL REACH:</span>
                  <AnimatedCounter value={285000000} prefix="$" suffix=" USD" fontSize={64} color="#10b981" />
                </div>
                <div style={{ width: '80%', maxWidth: '900px' }}>
                  <AnimatedBarChart
                    items={[
                      { label: 'Q1', value: 45 },
                      { label: 'Q2', value: 85 },
                      { label: 'Q3', value: 160 },
                      { label: 'Q4', value: 320, color: '#10b981' },
                    ]}
                    barColor="#3b82f6"
                  />
                </div>
              </div>
            </CameraRig>
            <SoundDirector
              effects={[
                { id: 's9', frame: 5, type: 'whoosh' },
                { id: 's10', frame: 40, type: 'bell' },
              ]}
            />
          </div>
        </Series.Sequence>

        {/* Module 5: Subtitles & Lower Third Captions */}
        <Series.Sequence durationInFrames={90}>
          <div style={{ position: 'relative', width: '100%', height: '100%' }}>
            <StudioBackground type="gradient" primaryColor="#030712" secondaryColor="#1e1b4b" />
            <GridOverlay label="MODULE 05 // DYNAMIC SUBTITLES & CAPTIONS" />
            <CaptionPill speaker="Antigravity Motion Studio" role="Automated Documentary Engine" delay={5} />
            <AnimatedCaptions
              captions={[
                {
                  id: 'c1',
                  startFrame: 10,
                  endFrame: 50,
                  text: 'Synchronized word by word karaoke captions for viral retention.',
                },
                {
                  id: 'c2',
                  startFrame: 55,
                  endFrame: 85,
                  text: 'Ready for YouTube 16:9 and TikTok 9:16 exports.',
                },
              ]}
              highlightColor="#fde047"
              fontSize={40}
            />
            <SoundDirector
              effects={[
                { id: 's11', frame: 10, type: 'pop' },
                { id: 's12', frame: 55, type: 'whoosh' },
              ]}
            />
          </div>
        </Series.Sequence>
      </Series>
    </div>
  );
};
