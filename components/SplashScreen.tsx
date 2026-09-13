"use client";
import { useEffect, useRef, useState } from "react";

interface Props {
  onStart?: () => void; // se llama al tocar (gesto) — arranca música
  onOpen: () => void;   // se llama al terminar el video — revela invitación
}

const POSTER = "https://bsjoelxktbvlavfoozhk.supabase.co/storage/v1/object/public/fotos-clientes/img/xv-julia-sofia/sobre-poster.jpg";
const VIDEO = "https://bsjoelxktbvlavfoozhk.supabase.co/storage/v1/object/public/fotos-clientes/video/xv-julia-sofia/sobre.mp4";

export default function SplashScreen({ onStart, onOpen }: Props) {
  const screenRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const captionRef = useRef<HTMLDivElement>(null);
  const hintRef = useRef<HTMLButtonElement>(null);
  const [phase, setPhase] = useState<"idle" | "opening">("idle");
  const revealedRef = useRef(false);

  /* Entrada */
  useEffect(() => {
    const el = screenRef.current;
    if (!el) return;
    requestAnimationFrame(() => { if (el) el.style.opacity = "1"; });
    const t1 = setTimeout(() => { if (captionRef.current) captionRef.current.style.opacity = "1"; }, 500);
    const t2 = setTimeout(() => { if (hintRef.current) hintRef.current.style.opacity = "1"; }, 1000);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, []);

  /* Revela la invitación (fade out del splash) */
  const reveal = () => {
    if (revealedRef.current) return;
    revealedRef.current = true;
    const el = screenRef.current;
    if (el) {
      el.style.transition = "opacity 0.8s ease";
      el.style.opacity = "0";
    }
    onOpen();
  };

  /* Toca para abrir → reproduce el video del sobre */
  const handleTap = () => {
    if (phase !== "idle") return;
    setPhase("opening");
    onStart?.(); // música dentro del gesto

    const v = videoRef.current;
    if (v) {
      v.play().then(() => {
        // seguridad: si 'ended' no dispara, revela tras la duración
        const ms = (isFinite(v.duration) && v.duration > 0 ? v.duration : 7) * 1000 + 400;
        setTimeout(reveal, ms);
      }).catch(() => {
        // si no puede reproducir, revela directo
        setTimeout(reveal, 300);
      });
    } else {
      setTimeout(reveal, 300);
    }
  };

  return (
    <div
      ref={screenRef}
      onClick={handleTap}
      role="button"
      aria-label="Toca para abrir la invitación"
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 10000,
        overflow: "hidden",
        cursor: phase === "idle" ? "pointer" : "default",
        background: "#1a2c0a",
        opacity: 0,
        transition: "opacity 0.6s ease",
      }}
    >
      {/* Video del sobre (poster = foto del sobre cerrado) */}
      <video
        ref={videoRef}
        src={VIDEO}
        poster={POSTER}
        muted
        playsInline
        preload="auto"
        onEnded={reveal}
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          objectFit: "cover",
        }}
      />

      {/* Scrim inferior para legibilidad del texto */}
      <div style={{
        position: "absolute", left: 0, right: 0, bottom: 0, height: "42%",
        background: "linear-gradient(to top, rgba(26,44,10,0.88) 0%, rgba(26,44,10,0.45) 45%, transparent 100%)",
        opacity: phase === "idle" ? 1 : 0,
        transition: "opacity 0.6s ease",
        pointerEvents: "none",
      }} />

      {/* Caption + botón (solo en idle) */}
      <div style={{
        position: "absolute", left: 0, right: 0, bottom: "8%",
        display: "flex", flexDirection: "column", alignItems: "center",
        opacity: phase === "idle" ? 1 : 0,
        transition: "opacity 0.5s ease",
        pointerEvents: phase === "idle" ? "auto" : "none",
      }}>
        <div
          ref={captionRef}
          style={{
            fontFamily: "var(--font-great-vibes), cursive",
            fontSize: "clamp(40px, 13vw, 60px)",
            lineHeight: 1.1,
            color: "#d4a24c",
            textShadow: "0 2px 16px rgba(0,0,0,0.7)",
            opacity: 0,
            transition: "opacity 0.8s ease",
            marginBottom: 4,
          }}
        >
          Celeste
        </div>
        <div style={{
          fontFamily: "var(--font-cormorant), serif",
          fontStyle: "italic",
          fontSize: 14,
          letterSpacing: 4,
          textTransform: "uppercase",
          color: "rgba(255,255,255,0.9)",
          textShadow: "0 1px 8px rgba(0,0,0,0.7)",
          marginBottom: 22,
        }}>
          Mis XV Años
        </div>

        <button
          ref={hintRef}
          style={{
            fontFamily: "var(--font-cormorant), serif",
            fontSize: 13,
            letterSpacing: 6,
            textTransform: "uppercase",
            color: "#1a2c0a",
            opacity: 0,
            cursor: "pointer",
            whiteSpace: "nowrap",
            padding: "14px 42px",
            background: "linear-gradient(135deg, #d4a24c, #996515)",
            border: "none",
            borderRadius: 40,
            animation: "hintFloat 3.2s ease-in-out infinite",
            transition: "opacity 0.7s ease",
            fontWeight: 700,
            textIndent: 6,
            boxShadow: "0 6px 22px rgba(0,0,0,0.4)",
          }}
        >
          Toca para abrir
        </button>
      </div>
    </div>
  );
}
