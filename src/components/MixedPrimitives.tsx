import React from "react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { MIXED_COLORS, SPRING_APPLE, SPRING_POP, inter, jetbrains } from "../mixedStyles";

/* ============================================================================
   VIDEO 2 PRIMITIVE — Warm Cream Graph-Paper Canvas with Subtle Paper Texture
   ============================================================================ */
export const PaperGridCanvas: React.FC<{ children?: React.ReactNode }> = ({ children }) => {
  return (
    <AbsoluteFill
      style={{
        backgroundColor: MIXED_COLORS.creamPaper,
        backgroundImage: `
          linear-gradient(to right, ${MIXED_COLORS.paperGridLine} 1.5px, transparent 1.5px),
          linear-gradient(to bottom, ${MIXED_COLORS.paperGridLine} 1.5px, transparent 1.5px),
          radial-gradient(ellipse at 50% 45%, rgba(255,255,255,0.45) 0%, rgba(190,174,148,0.22) 100%)
        `,
        backgroundSize: "52px 52px, 52px 52px, 100% 100%",
        overflow: "hidden",
      }}
    >
      {children}
    </AbsoluteFill>
  );
};

/* ============================================================================
   VIDEO 3 PRIMITIVE — Crisp Off-White Dotted Grid Canvas (Apple / Linear feel)
   ============================================================================ */
export const TechDottedCanvas: React.FC<{ children?: React.ReactNode }> = ({ children }) => {
  return (
    <AbsoluteFill
      style={{
        backgroundColor: MIXED_COLORS.techCanvas,
        backgroundImage: `
          radial-gradient(${MIXED_COLORS.techDot} 2px, transparent 2px),
          radial-gradient(ellipse at 50% 35%, rgba(255,255,255,0.92) 0%, rgba(232,236,244,0.45) 100%)
        `,
        backgroundSize: "34px 34px, 100% 100%",
        overflow: "hidden",
      }}
    >
      {children}
    </AbsoluteFill>
  );
};

/* ============================================================================
   VIDEO 3 PRIMITIVE — Word-by-Word Apple Blur + Y-Lift Kinetic Text
   ============================================================================ */
export const TechKineticLine: React.FC<{
  words: Array<{ text: string; muted?: boolean; highlight?: boolean; mono?: boolean }>;
  startFrame?: number;
  stagger?: number;
  fontSize?: number;
  maxWidth?: number;
  align?: "center" | "left";
}> = ({
  words,
  startFrame = 0,
  stagger = 4,
  fontSize = 68,
  maxWidth = 900,
  align = "center",
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  return (
    <div
      style={{
        display: "flex",
        flexWrap: "wrap",
        justifyContent: align === "center" ? "center" : "flex-start",
        gap: "12px 18px",
        maxWidth,
        lineHeight: 1.14,
      }}
    >
      {words.map((w, idx) => {
        const prog = spring({
          frame: frame - (startFrame + idx * stagger),
          fps,
          config: SPRING_APPLE,
        });
        const y = interpolate(prog, [0, 1], [26, 0]);
        const blur = interpolate(prog, [0, 1], [8, 0]);
        return (
          <span
            key={idx}
            style={{
              display: "inline-block",
              fontFamily: w.mono ? jetbrains.fontFamily : inter.fontFamily,
              fontWeight: w.muted ? 500 : 800,
              fontSize: w.mono ? fontSize * 0.78 : fontSize,
              letterSpacing: w.mono ? "-0.02em" : "-0.035em",
              color: w.highlight
                ? "#FFFFFF"
                : w.muted
                ? MIXED_COLORS.techMuted
                : MIXED_COLORS.techBlack,
              backgroundColor: w.highlight
                ? MIXED_COLORS.techBlack
                : w.mono
                ? "rgba(15,17,21,0.06)"
                : "transparent",
              padding: w.highlight ? "4px 20px 8px" : w.mono ? "4px 16px" : "0",
              borderRadius: w.highlight ? 14 : w.mono ? 10 : 0,
              border: w.mono ? "1.5px solid rgba(15,17,21,0.12)" : "none",
              opacity: prog,
              transform: `translateY(${y}px)`,
              filter: blur > 0.3 ? `blur(${blur}px)` : "none",
            }}
          >
            {w.text}
          </span>
        );
      })}
    </div>
  );
};

/* ============================================================================
   VIDEO 2 PRIMITIVE — High-Impact Orange Highlight Pill ("truth", "LISTEN")
   ============================================================================ */
export const OrangePill: React.FC<{
  text: string;
  startFrame?: number;
  fontSize?: number;
  rotate?: number;
}> = ({ text, startFrame = 0, fontSize = 58, rotate = -2 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const prog = spring({ frame: frame - startFrame, fps, config: SPRING_POP });

  return (
    <div
      style={{
        display: "inline-block",
        backgroundColor: MIXED_COLORS.accentOrange,
        color: "#FFFDF9",
        fontFamily: inter.fontFamily,
        fontWeight: 900,
        fontSize,
        letterSpacing: "-0.02em",
        padding: "10px 34px 14px",
        borderRadius: 16,
        boxShadow: `0 16px 38px ${MIXED_COLORS.accentOrangeGlow}, 0 4px 0 rgba(0,0,0,0.18)`,
        opacity: prog,
        transform: `rotate(${rotate}deg) scale(${interpolate(prog, [0, 1], [0.65, 1])})`,
      }}
    >
      {text}
    </div>
  );
};

/* ============================================================================
   VIDEO 3 PRIMITIVE — Glossy Circular Medallion in Grooved Track
   ============================================================================ */
export const GroovedMedallionTrack: React.FC<{
  items: Array<{ label: string; icon: string; accent: string }>;
  activeIndex: number;
  startFrame?: number;
}> = ({ items, activeIndex, startFrame = 0 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const enter = spring({ frame: frame - startFrame, fps, config: SPRING_APPLE });

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        width: 820,
        padding: "18px 26px",
        borderRadius: 999,
        background: "linear-gradient(180deg, #E8EBF1 0%, #F4F6FA 100%)",
        boxShadow:
          "inset 0 4px 12px rgba(15,17,21,0.12), inset 0 -2px 4px rgba(255,255,255,0.9), 0 18px 40px rgba(15,17,21,0.08)",
        border: "1.5px solid rgba(255,255,255,0.85)",
        opacity: enter,
        transform: `scale(${interpolate(enter, [0, 1], [0.9, 1])})`,
      }}
    >
      {items.map((item, idx) => {
        const isActive = idx === activeIndex;
        return (
          <div
            key={item.label}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 14,
              padding: "12px 24px",
              borderRadius: 999,
              background: isActive
                ? "linear-gradient(180deg, #FFFFFF 0%, #F1F4F9 100%)"
                : "transparent",
              boxShadow: isActive
                ? "0 10px 24px rgba(15,17,21,0.14), inset 0 2px 3px rgba(255,255,255,1)"
                : "none",
              transform: isActive ? "scale(1.04)" : "scale(0.96)",
              opacity: isActive ? 1 : 0.48,
            }}
          >
            <div
              style={{
                width: 48,
                height: 48,
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background: isActive
                  ? `radial-gradient(circle at 30% 25%, ${item.accent}, #0F1115)`
                  : "#D4D8E2",
                color: "#FFFFFF",
                fontSize: 22,
                fontWeight: 800,
                boxShadow: isActive ? "0 6px 14px rgba(0,0,0,0.22)" : "none",
              }}
            >
              {item.icon}
            </div>
            <span
              style={{
                fontFamily: inter.fontFamily,
                fontWeight: 700,
                fontSize: 26,
                color: MIXED_COLORS.techBlack,
                letterSpacing: "-0.02em",
              }}
            >
              {item.label}
            </span>
          </div>
        );
      })}
    </div>
  );
};

/* ============================================================================
   VIDEO 2 PRIMITIVE — Torn Paper Divider Edge (SVG Jagged Mask Strip)
   ============================================================================ */
export const TornPaperStrip: React.FC<{
  bg?: string;
  children: React.ReactNode;
  rotate?: number;
}> = ({ bg = "#151517", children, rotate = -1.5 }) => {
  return (
    <div
      style={{
        position: "relative",
        width: 960,
        transform: `rotate(${rotate}deg)`,
        filter: "drop-shadow(0 20px 32px rgba(0,0,0,0.28))",
      }}
    >
      <div
        style={{
          backgroundColor: bg,
          padding: "36px 48px",
          clipPath:
            "polygon(0% 6%, 4% 2%, 9% 7%, 15% 1%, 22% 6%, 29% 2%, 36% 7%, 44% 1%, 52% 6%, 60% 2%, 68% 7%, 76% 2%, 84% 6%, 91% 1%, 96% 6%, 100% 2%, 100% 94%, 95% 98%, 89% 93%, 82% 99%, 75% 94%, 67% 98%, 59% 93%, 51% 99%, 43% 94%, 35% 98%, 27% 93%, 19% 99%, 11% 94%, 5% 98%, 0% 93%)",
        }}
      >
        {children}
      </div>
    </div>
  );
};
