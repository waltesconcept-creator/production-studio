const fs = require('fs');
const d = JSON.parse(fs.readFileSync('./public/audio/adedibu_word_sync.json', 'utf8'));
const words = d.words;

const punchWords = new Set([
  '2000s', 'private', 'jets', 'thousands', 'police', 'Ibadan', 'amala', 'ordinary',
  'billionaire', 'aspiring', 'governor', 'five', 'hours', 'Molete', 'agbada',
  'Adedibu', 'governor', 'senator', 'election', 'blessing',
  'brutal', 'truth', 'power', 'billboards', 'street',
  'market', 'women', 'hospital', 'bills', 'fights', 'steaming', 'hot', 'food',
  'votes', 'completely', 'loyal',
  'whisper', 'proof', 'money', 'hearts', 'nothing'
]);

const phrases = [];
let cur = [];

for (let i = 0; i < words.length; i++) {
  const w = words[i];
  cur.push(w);
  const next = words[i + 1];
  
  // Natural pause between words in frames
  const pauseAfter = next ? (next.startFrame - w.endFrame) : 30;
  const isPause = pauseAfter >= 5;
  const isLong = cur.length >= 3;
  const isPunctuation = ['.', ',', '?', '!'].some(p => w.word.endsWith(p));
  
  // Break if pause, or 3 words reached, or end of sentence
  if (isPunctuation || isPause || isLong || i === words.length - 1) {
    // Keep endFrame active until next word starts (prevents flicker between words!)
    const holdEnd = next ? (next.startFrame - 1) : (w.endFrame + 20);
    phrases.push({
      id: phrases.length,
      text: cur.map(x => x.word).join(' '),
      startFrame: cur[0].startFrame,
      endFrame: Math.max(w.endFrame, holdEnd),
      words: [...cur]
    });
    cur = [];
  }
}

console.log('Total phrases generated:', phrases.length);
phrases.slice(0, 20).forEach((p, idx) => {
  console.log(`${idx.toString().padStart(2, '0')}: [${p.startFrame.toString().padStart(4, ' ')}-${p.endFrame.toString().padStart(4, ' ')}] (${(p.endFrame - p.startFrame)}f) "${p.text}"`);
});

fs.writeFileSync('./public/audio/adedibu_phrases.json', JSON.stringify({ phrases, punchWords: Array.from(punchWords) }, null, 2));
console.log('Saved to ./public/audio/adedibu_phrases.json');
