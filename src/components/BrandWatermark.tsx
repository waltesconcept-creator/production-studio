import React from "react";
import { poppins } from "../mixedStyles";

export const BrandWatermark: React.FC<{ lightBackground?: boolean }> = ({
  lightBackground = false,
}) => {
  return (
    <div
      style={{
        position: "absolute",
        top: 84,
        left: 0,
        right: 0,
        display: "flex",
        justifyContent: "center",
        pointerEvents: "none",
        zIndex: 100,
      }}
    >
      <div
        style={{
          fontFamily: poppins.fontFamily,
          fontWeight: 800,
          fontSize: 38,
          letterSpacing: "-0.03em",
          color: lightBackground ? "rgba(15, 17, 21, 0.86)" : "rgba(255, 255, 255, 0.90)",
          textShadow: lightBackground ? "none" : "0 4px 18px rgba(0, 0, 0, 0.45)",
        }}
      >
        ajirenike.
      </div>
    </div>
  );
};
