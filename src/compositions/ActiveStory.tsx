import React from 'react';
import { Series } from 'remotion';
import { StoryManifest } from '../types/story';
import { ACTIVE_STORY } from './sampleStories/activeStory';
import { SceneRenderer } from './SceneRenderer';
import { AudioDucking } from '../audio/AudioDucking';

interface ActiveStoryProps {
  manifest?: StoryManifest;
}

export const ActiveStory: React.FC<ActiveStoryProps> = ({
  manifest = ACTIVE_STORY,
}) => {
  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        backgroundColor: manifest.theme.primaryColor,
      }}
    >
      {/* Dynamic Background Music with Ducking */}
      <AudioDucking
        musicSrc={manifest.musicTrack?.src}
        voiceoverSrc={manifest.voiceoverTrack?.src}
        baseMusicVolume={manifest.musicTrack?.volume ?? 0.35}
        duckedMusicVolume={manifest.musicTrack?.duckVolume ?? 0.08}
      />

      {/* Sequenced Scenes */}
      <Series>
        {manifest.scenes.map((scene) => (
          <Series.Sequence
            key={scene.id}
            durationInFrames={scene.durationInFrames}
          >
            <SceneRenderer
              scene={scene}
              aspectRatio={manifest.aspectRatio}
              theme={manifest.theme}
            />
          </Series.Sequence>
        ))}
      </Series>
    </div>
  );
};
