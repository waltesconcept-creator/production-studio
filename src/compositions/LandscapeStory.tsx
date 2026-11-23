import React from 'react';
import { Series } from 'remotion';
import { StoryManifest } from '../types/story';
import { FOUNDER_STORY_16X9 } from './sampleStories/founderStory';
import { SceneRenderer } from './SceneRenderer';
import { AudioDucking } from '../audio/AudioDucking';

interface LandscapeStoryProps {
  manifest?: StoryManifest;
}

export const LandscapeStory: React.FC<LandscapeStoryProps> = ({
  manifest = FOUNDER_STORY_16X9,
}) => {
  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        backgroundColor: manifest.theme.primaryColor,
      }}
    >
      {/* Audio Ducking & Music / Voiceover track */}
      <AudioDucking
        musicSrc={manifest.musicTrack?.src}
        voiceoverSrc={manifest.voiceoverTrack?.src}
      />

      {/* Sequential Scenes */}
      <Series>
        {manifest.scenes.map((scene) => (
          <Series.Sequence
            key={scene.id}
            durationInFrames={scene.durationInFrames}
          >
            <SceneRenderer
              scene={scene}
              aspectRatio="16:9"
              theme={manifest.theme}
            />
          </Series.Sequence>
        ))}
      </Series>
    </div>
  );
};
