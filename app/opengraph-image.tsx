import { ImageResponse } from "next/og";

export const alt = "sysbase — Révisions certifications IT";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/** Couleurs d'accent des modules, en bas de la carte. */
const ACCENTS = ["#7B6FD4", "#2EB88A", "#E0703F", "#D69A34"];

/** Carte de partage social (Open Graph / Twitter). */
export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          backgroundColor: "#0F0F13",
          color: "#F0F0F5",
          padding: "90px",
          fontFamily: "sans-serif",
        }}
      >
        {/* Logo + nom */}
        <div style={{ display: "flex", alignItems: "center", gap: "28px" }}>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: "10px",
              width: "110px",
              height: "110px",
              borderRadius: "26px",
              backgroundColor: "#7B6FD4",
            }}
          >
            <div style={{ width: "60px", height: "16px", borderRadius: "5px", backgroundColor: "#FFFFFF" }} />
            <div style={{ width: "60px", height: "16px", borderRadius: "5px", backgroundColor: "#FFFFFF" }} />
          </div>
          <div style={{ fontSize: "92px", fontWeight: 700, letterSpacing: "-2px" }}>
            sysbase
          </div>
        </div>

        {/* Tagline */}
        <div style={{ marginTop: "36px", fontSize: "44px", color: "#B7B7CC" }}>
          Révisions certifications IT
        </div>
        <div style={{ marginTop: "14px", fontSize: "30px", color: "#8888AA" }}>
          Fiches · Flashcards · Quiz — TSSR et plus
        </div>

        {/* Pastilles d'accent */}
        <div style={{ display: "flex", gap: "16px", marginTop: "56px" }}>
          {ACCENTS.map((color) => (
            <div
              key={color}
              style={{ width: "26px", height: "26px", borderRadius: "13px", backgroundColor: color }}
            />
          ))}
        </div>
      </div>
    ),
    { ...size },
  );
}
