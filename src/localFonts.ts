import { continueRender, delayRender, staticFile } from "remotion";

const FONT_SPECS = [
  // Primary Brand Font: Poppins (ExtraLight/Thin -> Black + Italics)
  { family: "Poppins", file: "fonts/poppins-normal-200.woff2", weight: "200", style: "normal" },
  { family: "Poppins", file: "fonts/poppins-normal-300.woff2", weight: "300", style: "normal" },
  { family: "Poppins", file: "fonts/poppins-normal-400.woff2", weight: "400", style: "normal" },
  { family: "Poppins", file: "fonts/poppins-normal-600.woff2", weight: "600", style: "normal" },
  { family: "Poppins", file: "fonts/poppins-normal-700.woff2", weight: "700", style: "normal" },
  { family: "Poppins", file: "fonts/poppins-normal-800.woff2", weight: "800", style: "normal" },
  { family: "Poppins", file: "fonts/poppins-normal-900.woff2", weight: "900", style: "normal" },
  { family: "Poppins", file: "fonts/poppins-italic-300.woff2", weight: "300", style: "italic" },
  { family: "Poppins", file: "fonts/poppins-italic-700.woff2", weight: "700", style: "italic" },

  // Supporting Editorial & Mono Fonts
  { family: "Playfair Display", file: "fonts/playfair-normal.woff2", weight: "100 900", style: "normal" },
  { family: "Playfair Display Italic", file: "fonts/playfair-italic.woff2", weight: "100 900", style: "italic" },
  { family: "Inter", file: "fonts/inter.woff2", weight: "100 900", style: "normal" },
  { family: "Anton", file: "fonts/anton.woff2", weight: "400", style: "normal" },
  { family: "Oswald", file: "fonts/oswald.woff2", weight: "200 700", style: "normal" },
  { family: "Caveat", file: "fonts/caveat.woff2", weight: "400 700", style: "normal" },
  { family: "JetBrains Mono", file: "fonts/jetbrains.woff2", weight: "100 800", style: "normal" },
];

let initialized = false;

export function ensureLocalFontsLoaded() {
  if (initialized || typeof window === "undefined" || typeof FontFace === "undefined") {
    return;
  }
  initialized = true;
  const handle = delayRender("Loading local cached fonts");
  Promise.all(
    FONT_SPECS.map(async (spec) => {
      const face = new FontFace(spec.family, `url(${staticFile(spec.file)}) format('woff2')`, {
        weight: spec.weight,
        style: spec.style,
      });
      const loaded = await face.load();
      document.fonts.add(loaded);
    })
  )
    .catch((err) => {
      console.warn("Font load warning:", err);
    })
    .finally(() => {
      continueRender(handle);
    });
}
