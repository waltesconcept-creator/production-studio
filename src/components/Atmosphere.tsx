import React from "react";
import { AbsoluteFill, interpolate, staticFile, useCurrentFrame } from "remotion";

export const FilmGrain: React.FC<{ opacity?: number }> = ({ opacity = 0.085 }) => {
  const frame = useCurrentFrame();
  // Deterministic 15fps film-grain tile offset (100x faster than live SVG feTurbulence)
  const tick = Math.floor(frame / 2);
  const ox = (tick * 73) % 256;
  const oy = (tick * 139) % 256;
  return (
    <AbsoluteFill
      style={{
        pointerEvents: "none",
        mixBlendMode: "overlay",
        opacity,
        backgroundImage: `url(${staticFile("assets/film_grain_tile.png")})`,
        backgroundRepeat: "repeat",
        backgroundSize: "256px 256px",
        backgroundPosition: `${ox}px ${oy}px`,
      }}
    />
  );
};

export const CinemaVignette: React.FC<{ strength?: number }> = ({ strength = 0.55 }) => {
  return (
    <AbsoluteFill
      style={{
        pointerEvents: "none",
        background: `radial-gradient(ellipse at 50% 48%, rgba(0,0,0,0) 44%, rgba(0,0,0,${strength}) 100%)`,
      }}
    />
  );
};

export const SmokeLayer: React.FC<{
  opacity?: number;
  tint?: string;
  speed?: number;
  yOffset?: number;
}> = ({ opacity = 0.42, tint = "255, 250, 244", speed = 1, yOffset = -40 }) => {
  const frame = useCurrentFrame();
  const drift1 = frame * 1.4 * speed;
  const drift2 = frame * -0.9 * speed;
  const breathe = 0.88 + 0.12 * Math.sin(frame * 0.05);

  return (
    <AbsoluteFill style={{ pointerEvents: "none", overflow: "hidden" }}>
      <div
        style={{
          position: "absolute",
          top: yOffset,
          left: -260 + (drift1 % 420),
          width: 1400,
          height: 540,
          opacity: opacity * breathe,
          filter: "blur(48px)",
          background: `radial-gradient(ellipse at 35% 45%, rgba(${tint}, 0.65) 0%, rgba(${tint}, 0.28) 38%, rgba(${tint}, 0) 72%),
                       radial-gradient(ellipse at 72% 35%, rgba(${tint}, 0.55) 0%, rgba(${tint}, 0.2) 40%, rgba(${tint}, 0) 70%)`,
          transform: `scale(${1 + Math.sin(frame * 0.03) * 0.06}) rotate(${Math.sin(frame * 0.02) * 3}deg)`,
        }}
      />
      <div
        style={{
          position: "absolute",
          top: yOffset + 90,
          left: -120 + (drift2 % 340),
          width: 1300,
          height: 460,
          opacity: opacity * 0.7,
          filter: "blur(64px)",
          background: `radial-gradient(ellipse at 55% 40%, rgba(${tint}, 0.5) 0%, rgba(${tint}, 0.16) 45%, rgba(${tint}, 0) 75%)`,
        }}
      />
    </AbsoluteFill>
  );
};

export const GalleryWall: React.FC<{
  lampType?: "cone" | "bar";
  lightIntensity?: number;
  darkMood?: boolean;
  children?: React.ReactNode;
}> = ({ lampType = "cone", lightIntensity = 1, darkMood = false, children }) => {
  const baseBg = darkMood ? "#1D1612" : "#3E3024";
  const midBg = darkMood ? "#120D0A" : "#241B14";

  return (
    <AbsoluteFill
      style={{
        background: `linear-gradient(180deg, ${midBg} 0%, ${baseBg} 38%, ${midBg} 100%)`,
        overflow: "hidden",
      }}
    >
      {/* Woven linen / canvas wall micro-texture */}
      <AbsoluteFill
        style={{
          opacity: 0.22,
          backgroundImage: `
            repeating-linear-gradient(0deg, rgba(255,235,210,0.06) 0px, rgba(255,235,210,0.06) 1px, transparent 1px, transparent 4px),
            repeating-linear-gradient(90deg, rgba(0,0,0,0.12) 0px, rgba(0,0,0,0.12) 1px, transparent 1px, transparent 4px)
          `,
        }}
      />

      {/* Architectural Wainscot Wall Paneling */}
      <div
        style={{
          position: "absolute",
          top: 90,
          left: 84,
          right: 84,
          height: 1120,
          border: "4px solid rgba(20, 14, 10, 0.55)",
          boxShadow:
            "inset 0 0 0 2px rgba(255, 224, 185, 0.08), 0 0 0 2px rgba(255, 224, 185, 0.06)",
          pointerEvents: "none",
        }}
      />
      {/* Chair rail */}
      <div
        style={{
          position: "absolute",
          top: 1260,
          left: 0,
          right: 0,
          height: 22,
          background:
            "linear-gradient(180deg, rgba(255,225,190,0.12) 0%, rgba(18,12,8,0.65) 55%, rgba(255,220,180,0.06) 100%)",
          boxShadow: "0 8px 18px rgba(0,0,0,0.45)",
          pointerEvents: "none",
        }}
      />
      {/* Lower wainscot panel */}
      <div
        style={{
          position: "absolute",
          top: 1320,
          left: 84,
          right: 84,
          height: 410,
          border: "4px solid rgba(20, 14, 10, 0.5)",
          boxShadow: "inset 0 0 0 2px rgba(255, 224, 185, 0.07)",
          pointerEvents: "none",
        }}
      />
      {/* Floor shadow */}
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          height: 170,
          background: "linear-gradient(180deg, rgba(12,8,6,0.85) 0%, #090706 100%)",
          pointerEvents: "none",
        }}
      />

      {/* Volumetric overhead spotlight cone */}
      <AbsoluteFill
        style={{
          opacity: lightIntensity,
          pointerEvents: "none",
          background:
            lampType === "cone"
              ? `radial-gradient(ellipse 52% 48% at 50% 24%, rgba(255, 218, 165, 0.55) 0%, rgba(255, 190, 120, 0.22) 38%, rgba(0,0,0,0) 76%)`
              : `radial-gradient(ellipse 58% 42% at 50% 34%, rgba(255, 200, 130, 0.62) 0%, rgba(255, 165, 85, 0.22) 45%, rgba(0,0,0,0) 78%)`,
          mixBlendMode: "screen",
        }}
      />

      {/* Practical overhead museum lamp fixture */}
      {lampType === "cone" ? (
        <div
          style={{
            position: "absolute",
            top: 230,
            left: "50%",
            transform: "translateX(-50%)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            pointerEvents: "none",
            zIndex: 5,
          }}
        >
          {/* Wall mount arm */}
          <div
            style={{
              width: 14,
              height: 42,
              background: "linear-gradient(90deg, #1A1715, #4B433C, #151210)",
              borderRadius: 4,
            }}
          />
          {/* Lamp dome */}
          <div
            style={{
              width: 96,
              height: 48,
              borderRadius: "48px 48px 10px 10px",
              background: "linear-gradient(180deg, #2D2622 0%, #120F0D 85%)",
              boxShadow: "0 6px 14px rgba(0,0,0,0.7)",
              position: "relative",
              marginTop: -6,
            }}
          >
            {/* Glowing bulb rim */}
            <div
              style={{
                position: "absolute",
                bottom: -6,
                left: 10,
                right: 10,
                height: 14,
                borderRadius: "50%",
                background: "#FFF4D6",
                boxShadow: `0 0 42px 18px rgba(255, 224, 168, ${0.75 * lightIntensity})`,
                opacity: lightIntensity,
              }}
            />
          </div>
        </div>
      ) : (
        /* Sleek brass picture light bar (matching Video 1's 00:13–00:17 shot!) */
        <div
          style={{
            position: "absolute",
            top: 430,
            left: "50%",
            transform: "translateX(-50%)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            pointerEvents: "none",
            zIndex: 6,
          }}
        >
          <div
            style={{
              width: 44,
              height: 22,
              background: "linear-gradient(180deg, #A37A48, #583F22)",
              borderRadius: 4,
              boxShadow: "0 4px 10px rgba(0,0,0,0.6)",
            }}
          />
          <div
            style={{
              width: 12,
              height: 28,
              background: "linear-gradient(90deg, #6B4D29, #C99D62, #5A3E1D)",
              marginTop: -2,
            }}
          />
          <div
            style={{
              width: 340,
              height: 18,
              borderRadius: 9,
              background: "linear-gradient(180deg, #E2B87D 0%, #7C582D 70%, #FFF1D0 100%)",
              boxShadow: `0 8px 46px 14px rgba(255, 198, 120, ${0.72 * lightIntensity})`,
              marginTop: -2,
            }}
          />
        </div>
      )}

      {children}
    </AbsoluteFill>
  );
};

export const OrnateFrame: React.FC<{
  src: string;
  width: number;
  height: number;
  variant?: "gold" | "wood";
  sheenProgress?: number; // 0..1 diagonal specular reflection
  style?: React.CSSProperties;
}> = ({ src, width, height, variant = "gold", sheenProgress = -1, style }) => {
  const borderWidth = variant === "gold" ? 26 : 16;
  const frameBg =
    variant === "gold"
      ? "linear-gradient(135deg, #F0D28C 0%, #A97A32 22%, #684617 48%, #E5C170 72%, #7D561E 100%)"
      : "linear-gradient(135deg, #D29A63 0%, #9E6837 45%, #734822 100%)";

  const sheenX = interpolate(sheenProgress, [0, 1], [-width * 1.4, width * 1.8]);

  return (
    <div
      style={{
        width,
        height,
        padding: borderWidth,
        background: frameBg,
        borderRadius: 4,
        boxShadow:
          "0 34px 72px rgba(0,0,0,0.72), 0 12px 26px rgba(0,0,0,0.5), inset 0 2px 3px rgba(255,245,215,0.6), inset 0 -3px 6px rgba(35,20,6,0.7)",
        position: "relative",
        boxSizing: "border-box",
        ...style,
      }}
    >
      <div
        style={{
          width: "100%",
          height: "100%",
          position: "relative",
          overflow: "hidden",
          boxShadow: "inset 0 0 0 3px rgba(35,22,10,0.65), inset 0 8px 18px rgba(0,0,0,0.45)",
          background: "#120E0B",
        }}
      >
        <img
          src={src}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            display: "block",
          }}
        />
        {sheenProgress >= 0 && sheenProgress <= 1 && (
          <div
            style={{
              position: "absolute",
              inset: -80,
              background:
                "linear-gradient(115deg, rgba(255,255,255,0) 35%, rgba(255,252,240,0.42) 50%, rgba(255,255,255,0) 65%)",
              transform: `translateX(${sheenX}px)`,
              pointerEvents: "none",
            }}
          />
        )}
      </div>
    </div>
  );
};
