import { staticFile } from 'remotion';

export const CHIP_SVG = `data:image/svg+xml;utf8,${encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400" width="400" height="400">
  <defs>
    <linearGradient id="chipGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#1e293b"/>
      <stop offset="50%" stop-color="#0f172a"/>
      <stop offset="100%" stop-color="#020617"/>
    </linearGradient>
    <linearGradient id="goldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#fbbf24"/>
      <stop offset="100%" stop-color="#d97706"/>
    </linearGradient>
    <linearGradient id="greenGlow" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#76b900"/>
      <stop offset="100%" stop-color="#4c7800"/>
    </linearGradient>
  </defs>
  <rect x="30" y="30" width="340" height="340" rx="16" fill="url(#chipGrad)" stroke="#334155" stroke-width="4"/>
  <g fill="url(#goldGrad)">
    <rect x="70" y="15" width="12" height="15" rx="2"/>
    <rect x="110" y="15" width="12" height="15" rx="2"/>
    <rect x="150" y="15" width="12" height="15" rx="2"/>
    <rect x="190" y="15" width="12" height="15" rx="2"/>
    <rect x="230" y="15" width="12" height="15" rx="2"/>
    <rect x="270" y="15" width="12" height="15" rx="2"/>
    <rect x="310" y="15" width="12" height="15" rx="2"/>
    <rect x="70" y="370" width="12" height="15" rx="2"/>
    <rect x="110" y="370" width="12" height="15" rx="2"/>
    <rect x="150" y="370" width="12" height="15" rx="2"/>
    <rect x="190" y="370" width="12" height="15" rx="2"/>
    <rect x="230" y="370" width="12" height="15" rx="2"/>
    <rect x="270" y="370" width="12" height="15" rx="2"/>
    <rect x="310" y="370" width="12" height="15" rx="2"/>
    <rect x="15" y="70" width="15" height="12" rx="2"/>
    <rect x="15" y="110" width="15" height="12" rx="2"/>
    <rect x="15" y="150" width="15" height="12" rx="2"/>
    <rect x="15" y="190" width="15" height="12" rx="2"/>
    <rect x="15" y="230" width="15" height="12" rx="2"/>
    <rect x="15" y="270" width="15" height="12" rx="2"/>
    <rect x="15" y="310" width="15" height="12" rx="2"/>
    <rect x="370" y="70" width="15" height="12" rx="2"/>
    <rect x="370" y="110" width="15" height="12" rx="2"/>
    <rect x="370" y="150" width="15" height="12" rx="2"/>
    <rect x="370" y="190" width="15" height="12" rx="2"/>
    <rect x="370" y="230" width="15" height="12" rx="2"/>
    <rect x="370" y="270" width="15" height="12" rx="2"/>
    <rect x="370" y="310" width="15" height="12" rx="2"/>
  </g>
  <rect x="80" y="80" width="240" height="240" rx="8" fill="#18181b" stroke="url(#greenGlow)" stroke-width="3"/>
  <g stroke="#76b900" stroke-width="2" stroke-linecap="round" opacity="0.6">
    <path d="M 120 120 L 150 150 L 250 150 L 280 120"/>
    <path d="M 120 280 L 150 250 L 250 250 L 280 280"/>
    <path d="M 100 200 L 140 200"/>
    <path d="M 260 200 L 300 200"/>
    <circle cx="150" cy="150" r="4" fill="#76b900"/>
    <circle cx="250" cy="150" r="4" fill="#76b900"/>
    <circle cx="150" cy="250" r="4" fill="#76b900"/>
    <circle cx="250" cy="250" r="4" fill="#76b900"/>
  </g>
  <rect x="140" y="140" width="120" height="120" rx="6" fill="#09090b" stroke="#76b900" stroke-width="2"/>
  <text x="200" y="190" font-family="Arial Black, Impact, sans-serif" font-size="20" fill="#ffffff" text-anchor="middle" font-weight="900" letter-spacing="2">H100</text>
  <text x="200" y="215" font-family="monospace" font-size="12" fill="#76b900" text-anchor="middle" font-weight="700">TENSOR CORE</text>
  <text x="200" y="235" font-family="monospace" font-size="9" fill="#94a3b8" text-anchor="middle">4nm TSMC FINFET</text>
</svg>
`)}`;

export const FOUNDER_PORTRAIT_SVG = `data:image/svg+xml;utf8,${encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 480" width="400" height="480">
  <defs>
    <linearGradient id="leatherGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#2a2a2a"/>
      <stop offset="50%" stop-color="#141414"/>
      <stop offset="100%" stop-color="#0a0a0a"/>
    </linearGradient>
    <linearGradient id="skinGrad" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#f5d0b5"/>
      <stop offset="100%" stop-color="#dfaa87"/>
    </linearGradient>
    <linearGradient id="hairGrad" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#333333"/>
      <stop offset="30%" stop-color="#cccccc"/>
      <stop offset="70%" stop-color="#aaaaaa"/>
      <stop offset="100%" stop-color="#444444"/>
    </linearGradient>
  </defs>
  <path d="M 100 480 L 110 320 L 170 300 L 230 300 L 290 320 L 300 480 Z" fill="url(#leatherGrad)" stroke="#3a3a3a" stroke-width="3"/>
  <path d="M 150 300 L 200 370 L 170 300 Z" fill="#222" stroke="#444"/>
  <path d="M 250 300 L 200 370 L 230 300 Z" fill="#222" stroke="#444"/>
  <line x1="200" y1="370" x2="200" y2="480" stroke="#777" stroke-width="3" stroke-dasharray="4,2"/>
  <rect x="180" y="250" width="40" height="60" rx="6" fill="url(#skinGrad)"/>
  <ellipse cx="200" cy="200" rx="60" ry="75" fill="url(#skinGrad)"/>
  <path d="M 135 180 C 130 110, 270 110, 265 180 C 255 130, 145 130, 135 180 Z" fill="url(#hairGrad)"/>
  <path d="M 135 170 C 140 120, 190 110, 200 135 C 210 110, 260 120, 265 170 C 240 130, 160 130, 135 170 Z" fill="#ffffff" opacity="0.4"/>
  <rect x="150" y="180" width="38" height="28" rx="6" fill="none" stroke="#111" stroke-width="4"/>
  <rect x="212" y="180" width="38" height="28" rx="6" fill="none" stroke="#111" stroke-width="4"/>
  <line x1="188" y1="192" x2="212" y2="192" stroke="#111" stroke-width="4"/>
  <line x1="150" y1="190" x2="135" y2="185" stroke="#111" stroke-width="3"/>
  <line x1="250" y1="190" x2="265" y2="185" stroke="#111" stroke-width="3"/>
  <path d="M 185 240 Q 200 252 215 240" fill="none" stroke="#8c4e36" stroke-width="3" stroke-linecap="round"/>
</svg>
`)}`;

export const VINTAGE_PHOTO_SVG = `data:image/svg+xml;utf8,${encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 350" width="500" height="350">
  <rect width="100%" height="100%" fill="#2b2823"/>
  <rect x="30" y="40" width="100" height="260" fill="#44423d" stroke="#1a1917" stroke-width="2"/>
  <rect x="150" y="40" width="100" height="260" fill="#524f49" stroke="#1a1917" stroke-width="2"/>
  <rect x="270" y="40" width="100" height="260" fill="#44423d" stroke="#1a1917" stroke-width="2"/>
  <circle cx="80" cy="90" r="30" fill="#ddd7cb"/>
  <circle cx="80" cy="90" r="12" fill="#2b2823"/>
  <circle cx="80" cy="160" r="30" fill="#ddd7cb"/>
  <circle cx="80" cy="160" r="12" fill="#2b2823"/>
  <circle cx="200" cy="90" r="30" fill="#ddd7cb"/>
  <circle cx="200" cy="90" r="12" fill="#2b2823"/>
  <circle cx="200" cy="160" r="30" fill="#ddd7cb"/>
  <circle cx="200" cy="160" r="12" fill="#2b2823"/>
  <text x="250" y="320" font-family="Courier New, monospace" font-size="14" fill="#88857d" font-weight="bold" letter-spacing="3">ARCHIVE REC #440-B</text>
</svg>
`)}`;

export function resolveAsset(src: string): string {
  if (!src) return '';
  if (src.startsWith('data:') || src.startsWith('http://') || src.startsWith('https://')) {
    return src;
  }
  if (src === 'founder' || src.includes('founder-portrait')) {
    return FOUNDER_PORTRAIT_SVG;
  }
  if (src === 'chip' || src.includes('ai-chip')) {
    return CHIP_SVG;
  }
  if (src === 'vintage' || src.includes('vintage-photo')) {
    return VINTAGE_PHOTO_SVG;
  }
  // Fallback to staticFile
  try {
    const clean = src.startsWith('/') ? src.slice(1) : src;
    return staticFile(clean);
  } catch {
    return src;
  }
}
