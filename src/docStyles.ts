import { ensureLocalFontsLoaded } from "./localFonts";

ensureLocalFontsLoaded();

export const playfair = { fontFamily: "'Playfair Display', Georgia, serif" };
export const playfairItalic = { fontFamily: "'Playfair Display Italic', 'Playfair Display', Georgia, serif" };
export const inter = { fontFamily: "'Inter', system-ui, sans-serif" };
export const anton = { fontFamily: "'Anton', Impact, sans-serif" };
export const oswald = { fontFamily: "'Oswald', sans-serif" };
export const courier = { fontFamily: "'JetBrains Mono', 'Courier New', monospace" };

export const FPS = 30;
export const WIDTH = 1080;
export const HEIGHT = 1920;

export const COLORS = {
  crimson: "#E1261C",
  crimsonGlow: "rgba(225, 38, 28, 0.72)",
  warmCream: "#F7F1E5",
  gold: "#E8C37A",
  tapeYellow: "#F5DA55",
  wallBase: "#4F3F32",
  wallDark: "#1B130E",
  cuttingMat: "#134B34",
  slateBlue: "#172A3A",
  inkBlack: "#0A0B0D",
};

export const secToFrame = (sec: number) => Math.round(sec * FPS);

export const SPRING_SNAPPY = {
  damping: 16,
  mass: 0.7,
  stiffness: 180,
};

export const SPRING_SMOOTH = {
  damping: 22,
  mass: 1.0,
  stiffness: 110,
};

export const SPRING_HEAVY = {
  damping: 14,
  mass: 1.3,
  stiffness: 90,
};
