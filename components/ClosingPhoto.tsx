"use client";
import { PHOTOS } from "./photos";

/* Foto 3 — cierre, bosque encantado, con frase y monograma */
export default function ClosingPhoto() {
  const hasPhoto = !!PHOTOS.closing;

  return (
    <section style={{
      position: "relative",
      width: "100%",
      minHeight: "78vh",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "flex-end",
      overflow: "hidden",
      background: hasPhoto ? "#1a2c0a" : "linear-gradient(180deg, #263e0f 0%, #1a2c0a 100%)",
      padding: "80px 28px 64px",
    }}>
      {hasPhoto && (
        <div style={{
          position: "absolute", inset: 0,
          backgroundImage: `url("${PHOTOS.closing}")`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          pointerEvents: "none",
        }} />
      )}
      <div style={{
        position: "absolute", inset: 0,
        background: "linear-gradient(180deg, rgba(26,44,10,0.45) 0%, rgba(26,44,10,0.25) 40%, rgba(26,44,10,0.85) 100%)",
        pointerEvents: "none",
      }} />

      <p style={{
        position: "relative",
        maxWidth: 360,
        textAlign: "center",
        fontFamily: "var(--font-great-vibes), cursive",
        fontSize: "clamp(26px, 8vw, 36px)",
        lineHeight: 1.5,
        color: "#FFFFFF",
        textShadow: "0 2px 12px rgba(0,0,0,0.6)",
        marginBottom: 30,
      }}>
        Este día ha vivido en mis sueños, y su verdadera magia será estar rodeada de quienes han caminado conmigo.
      </p>

      <div style={{
        position: "relative",
        fontFamily: "var(--font-great-vibes), cursive",
        fontSize: 72,
        lineHeight: 1.25,
        padding: "0 30px",
        overflow: "visible",
        background: "var(--gold-metal-gradient)", backgroundSize: "300% 100%", animation: "goldSweep 6s linear infinite",
        WebkitBackgroundClip: "text",
        WebkitTextFillColor: "transparent",
        backgroundClip: "text",
        filter: "drop-shadow(0 3px 14px rgba(0,0,0,0.5))",
      }}>
        CM
      </div>
      <div style={{
        position: "relative",
        fontFamily: "var(--font-cormorant), serif",
        fontStyle: "italic",
        fontWeight: 600,
        fontSize: 15,
        letterSpacing: 6,
        textTransform: "uppercase",
        color: "#e9c77b",
        marginTop: 6,
        textShadow: "0 1px 8px rgba(0,0,0,0.5)",
      }}>
        Celeste
      </div>
    </section>
  );
}
