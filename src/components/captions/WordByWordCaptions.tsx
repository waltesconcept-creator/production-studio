import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { anton, oswald, poppins, playfairItalic } from '../../mixedStyles';
import phrasesData from '../../../public/audio/adedibu_phrases.json';

export interface WordItem {
  word: string;
  startFrame: number;
  endFrame: number;
  startSec?: number;
  endSec?: number;
}

export interface PhraseItem {
  id: number;
  text: string;
  startFrame: number;
  endFrame: number;
  words: WordItem[];
}

export interface WordByWordCaptionsProps {
  phrases?: PhraseItem[];
  punchWords?: string[];
  accentColor?: string;
  lightBackground?: boolean;
  fontSize?: number;
  style?: React.CSSProperties;
}

const DEFAULT_PUNCH_WORDS = new Set([
  '2000s', 'private', 'jets', 'thousands', 'police', 'ibadan', 'amala', 'ordinary',
  'billionaire', 'aspiring', 'governor', 'five', 'hours', 'molete', 'agbada',
  'adedibu', 'senator', 'election', 'blessing',
  'brutal', 'truth', 'power', 'billboards', 'street',
  'market', 'women', 'hospital', 'bills', 'fights', 'steaming', 'hot', 'food',
  'votes', 'completely', 'loyal',
  'whisper', 'proof', 'money', 'hearts', 'nothing'
]);

export const WordByWordCaptions: React.FC<WordByWordCaptionsProps> = ({
  phrases = phrasesData.phrases as PhraseItem[],
  punchWords,
  accentColor = '#FF5500',
  lightBackground = false,
  fontSize = 76,
  style = {},
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const punchSet = React.useMemo(() => {
    if (punchWords) {
      return new Set(punchWords.map((w) => w.toLowerCase()));
    }
    return DEFAULT_PUNCH_WORDS;
  }, [punchWords]);

  // Find active phrase
  // We allow a small trailing grace window (+4 frames) so captions don't flicker between adjacent phrases
  const activePhrase = phrases.find(
    (p) => frame >= p.startFrame && frame <= p.endFrame + 3
  );

  if (!activePhrase) return null;

  return (
    <div
      style={{
        position: 'absolute',
        top: '52%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: '92%',
        maxWidth: 960,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 50,
        pointerEvents: 'none',
        ...style,
      }}
    >
      <div
        style={{
          display: 'inline-flex',
          flexWrap: 'wrap',
          justifyContent: 'center',
          alignItems: 'center',
          gap: '14px 20px',
          textAlign: 'center',
        }}
      >
        {activePhrase.words.map((item, idx) => {
          // If word hasn't arrived yet, do not display
          if (frame < item.startFrame) return null;

          const isActive = frame >= item.startFrame && frame <= item.endFrame;
          const cleanWord = item.word.toLowerCase().replace(/[^a-z0-9]/g, '');
          const isPunch = punchSet.has(cleanWord);

          // Snappy spring entrance
          const spr = spring({
            frame: frame - item.startFrame,
            fps,
            config: { damping: 13, stiffness: 240, mass: 0.6 },
          });

          // Hormozi Punch Word: Highlight pill
          if (isPunch) {
            const scale = isActive
              ? interpolate(spr, [0, 1], [0.75, 1.14])
              : 1.0;

            return (
              <span
                key={`${activePhrase.id}-${idx}`}
                style={{
                  display: 'inline-block',
                  backgroundColor: accentColor,
                  color: '#FFFFFF',
                  fontFamily: anton.fontFamily,
                  fontSize: fontSize + 4,
                  lineHeight: 1.05,
                  letterSpacing: '0.04em',
                  textTransform: 'uppercase',
                  padding: '10px 24px 12px',
                  borderRadius: 14,
                  boxShadow: isActive
                    ? '0 14px 35px rgba(255, 85, 0, 0.65), 0 2px 4px rgba(0,0,0,0.5)'
                    : '0 8px 20px rgba(0,0,0,0.3)',
                  transform: `scale(${scale}) rotate(${isActive ? -2 : 0}deg)`,
                  transformOrigin: 'center center',
                }}
              >
                {item.word}
              </span>
            );
          }

          // Regular Word
          const scale = isActive
            ? interpolate(spr, [0, 1], [0.8, 1.12])
            : 1.0;

          const textColor = isActive
            ? accentColor
            : lightBackground
            ? '#1A1815'
            : '#FFFFFF';

          return (
            <span
              key={`${activePhrase.id}-${idx}`}
              style={{
                display: 'inline-block',
                fontFamily: anton.fontFamily,
                fontSize,
                fontWeight: 900,
                color: textColor,
                textTransform: 'uppercase',
                letterSpacing: '0.03em',
                lineHeight: 1.05,
                transform: `scale(${scale})`,
                transformOrigin: 'center center',
                textShadow: lightBackground
                  ? isActive
                    ? '0 0 16px rgba(255, 85, 0, 0.4)'
                    : 'none'
                  : isActive
                  ? '0 0 24px rgba(255, 85, 0, 0.8), 0 4px 12px rgba(0,0,0,0.95)'
                  : '0 4px 12px rgba(0,0,0,0.95), 0 2px 4px rgba(0,0,0,0.8)',
              }}
            >
              {item.word}
            </span>
          );
        })}
      </div>
    </div>
  );
};
