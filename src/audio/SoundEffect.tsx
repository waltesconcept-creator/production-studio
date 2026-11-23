import React from 'react';
import { Audio, Sequence } from 'remotion';
import { getSoundEffectUri } from './sfxLibrary';
import { SoundEffectTrigger } from '../types/story';

interface SoundEffectProps {
  trigger: SoundEffectTrigger;
  customSrc?: string;
}

export const SoundEffect: React.FC<SoundEffectProps> = ({ trigger, customSrc }) => {
  const src = getSoundEffectUri(trigger.type, customSrc);

  return (
    <Sequence from={trigger.frame} durationInFrames={30} layout="none">
      <Audio
        src={src}
        volume={trigger.volume ?? 0.7}
      />
    </Sequence>
  );
};

interface SoundDirectorProps {
  effects?: SoundEffectTrigger[];
}

export const SoundDirector: React.FC<SoundDirectorProps> = ({ effects = [] }) => {
  return (
    <>
      {effects.map((fx) => (
        <SoundEffect key={`${fx.id}-${fx.frame}`} trigger={fx} />
      ))}
    </>
  );
};
