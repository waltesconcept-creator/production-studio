import { ensureLocalFontsLoaded } from "./localFonts";

ensureLocalFontsLoaded();

export const poppins = { fontFamily: "'Poppins', system-ui, sans-serif" };
export const playfair = { fontFamily: "'Playfair Display', Georgia, serif" };
export const playfairItalic = { fontFamily: "'Playfair Display Italic', 'Playfair Display', Georgia, serif" };
export const caveat = { fontFamily: "'Caveat', cursive" };
export const jetbrains = { fontFamily: "'JetBrains Mono', monospace" };
export const inter = { fontFamily: "'Poppins', 'Inter', system-ui, sans-serif" };
export const anton = { fontFamily: "'Anton', Impact, sans-serif" };
export const oswald = { fontFamily: "'Oswald', sans-serif" };

export const MIXED_COLORS = {
  creamPaper: "#F4EFE4",
  paperGridLine: "rgba(92, 78, 60, 0.11)",
  inkDark: "#141413",
  accentOrange: "#F25C19",
  accentOrangeGlow: "rgba(242, 92, 25, 0.45)",
  pitchBlack: "#060608",

  techCanvas: "#F7F8FA",
  techDot: "rgba(17, 24, 39, 0.14)",
  techBlack: "#0F1115",
  techMuted: "#7E8494",
  techBorder: "rgba(15, 17, 21, 0.09)",
  techBlue: "#2563EB",
  techGreen: "#10B981",
  techAmber: "#F59E0B",
};

export const SPRING_POP = {
  damping: 14,
  mass: 0.65,
  stiffness: 220,
};

export const SPRING_APPLE = {
  damping: 22,
  mass: 0.9,
  stiffness: 140,
};

export const SPRING_WHIP = {
  damping: 18,
  mass: 0.55,
  stiffness: 260,
};
