import React from 'react';
import { Series } from 'remotion';
import { StoryManifest } from '../types/story';
import { FOUNDER_STORY_9X16 } from './sampleStories/founderStoryVertical';
import { SceneRenderer } from './SceneRenderer';
import { AudioDucking } from '../audio/AudioDucking';

interface VerticalStoryProps {
  manifest?: StoryManifest;
}

export const VerticalStory: React.FC<VerticalStoryProps> = ({
  manifest = FOUNDER_STORY_9X16,
}) => {
  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        backgroundColor: manifest.theme.primaryColor,
      }}
    >
      <AudioDucking
        musicSrc={manifest.musicTrack?.src}
        voiceoverSrc={manifest.voiceoverTrack?.src}
      />

      <Series>
        {manifest.scenes.map((scene) => (
          <Series.Sequence
            key={scene.id}
            durationInFrames={scene.durationInFrames}
          >
            <SceneRenderer
              scene={scene}
              aspectRatio="9:16"
              theme={manifest.theme}
            />
          </Series.Sequence>
        ))}
      </Series>
    </div>
  );
};
