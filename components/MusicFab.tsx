"use client";
import { useState, useRef, useEffect, forwardRef, useImperativeHandle } from "react";
import { useLang } from "@/lib/i18n";

const AUDIO_URL = "https://bsjoelxktbvlavfoozhk.supabase.co/storage/v1/object/public/fotos-clientes/audio/xv-celeste-melgar/cancion.mp3";

export interface MusicFabHandle {
  play: () => void;
}

const MusicFab = forwardRef<MusicFabHandle>((_, ref) => {
  const { t } = useLang();
  const [playing, setPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    const a = new Audio(AUDIO_URL);
    a.loop = true;
    a.volume = 0.5;
    a.preload = "none";
    audioRef.current = a;
    return () => { a.pause(); };
  }, []);

  useImperativeHandle(ref, () => ({
    play() {
      if (!audioRef.current || playing) return;
      audioRef.current.play().catch(() => {});
      setPlaying(true);
    },
  }));

  const toggle = () => {
    if (!audioRef.current) return;
    if (playing) {
      audioRef.current.pause();
      setPlaying(false);
    } else {
      audioRef.current.play().catch(() => {});
      setPlaying(true);
    }
  };

  return (
    <div style={{
      position: "fixed", bottom: 24, right: 24, zIndex: 998,
      width: 68, height: 68, userSelect: "none",
    }}>
      <div className="gold-glow" style={{
        position: "absolute", inset: -8, borderRadius: "50%",
        border: "1.5px solid rgba(212,162,76,0.30)",
        animation: playing ? "vinylPulse 2.2s ease-in-out infinite" : undefined,
        pointerEvents: "none",
      }} />
      <span className="gold-border" aria-hidden="true" style={{ borderRadius: "50%" }} />

      <div style={{
        position: "absolute", top: -4, right: -2,
        width: 24, height: 36,
        transformOrigin: "top right",
        transform: playing ? "rotate(-14deg)" : "rotate(-30deg)",
        transition: "transform 0.65s cubic-bezier(0.2,0.7,0.2,1)",
        zIndex: 4, pointerEvents: "none",
      }}>
        <div style={{
          position: "absolute", top: 0, right: 0, width: 8, height: 8,
          borderRadius: "50%",
          background: "linear-gradient(135deg, #d4a24c, #996515)",
          boxShadow: "0 1px 5px rgba(0,0,0,0.55)",
        }} />
        <div style={{
          position: "absolute", top: 5, right: 3, width: 2, height: 22,
          background: "linear-gradient(to bottom, #d4a24c 0%, rgba(212,197,178,0.50) 100%)",
          borderRadius: 2, transform: "rotate(18deg)", transformOrigin: "top center",
        }} />
        <div style={{
          position: "absolute", bottom: 0, left: 3, width: 6, height: 5,
          borderRadius: "0 0 2px 2px",
          background: "#d4a24c",
          boxShadow: "0 1px 3px rgba(0,0,0,0.50)",
        }} />
      </div>

      <button
        onClick={toggle}
        aria-label={playing ? t.music.pause : t.music.play}
        style={{
          position: "relative", width: "100%", height: "100%",
          borderRadius: "50%", border: "none", cursor: "pointer",
          padding: 0, outline: "none", background: "transparent",
          overflow: "hidden",
          boxShadow: "0 4px 24px rgba(28,64,44,0.45), 0 0 0 1.5px rgba(212,162,76,0.26)",
        }}
      >
        <div style={{
          position: "absolute", inset: 0, borderRadius: "50%",
          animation: playing ? "vinylSpin 2s linear infinite" : "none",
          background: `
            radial-gradient(circle, #0a0a0a 5%, transparent 5.5%),
            radial-gradient(circle, #f1d58f 0%, #d9a94f 18%, #996515 29%, #5e3d0c 30.5%, transparent 31%),
            repeating-radial-gradient(circle,
              transparent 33%, rgba(224,184,102,0.55) 33.6%, transparent 34.3%,
              transparent 37%, rgba(224,184,102,0.22) 37.6%, transparent 38.3%,
              transparent 41%, rgba(224,184,102,0.22) 41.6%, transparent 42.3%,
              transparent 45%, rgba(224,184,102,0.55) 45.6%, transparent 46.3%,
              transparent 49%, rgba(224,184,102,0.22) 49.6%, transparent 50.3%,
              transparent 53%, rgba(224,184,102,0.22) 53.6%, transparent 54.3%,
              transparent 57%, rgba(224,184,102,0.55) 57.6%, transparent 58.3%,
              transparent 61%, rgba(224,184,102,0.22) 61.6%, transparent 62.3%,
              transparent 65%, rgba(224,184,102,0.22) 65.6%, transparent 66.3%,
              transparent 69%, rgba(224,184,102,0.55) 69.6%, transparent 70.3%,
              transparent 73%, rgba(224,184,102,0.22) 73.6%, transparent 74.3%,
              transparent 77%, rgba(224,184,102,0.22) 77.6%, transparent 78.3%,
              transparent 81%, rgba(224,184,102,0.55) 81.6%, transparent 82.3%,
              transparent 85%, rgba(224,184,102,0.22) 85.6%, transparent 86.3%,
              transparent 89%, rgba(224,184,102,0.22) 89.6%, transparent 90.3%,
              transparent 93%, rgba(224,184,102,0.55) 93.6%, transparent 94.3%
            ),
            conic-gradient(from 20deg, rgba(255,243,207,0.14), transparent 12%, transparent 38%, rgba(255,243,207,0.10) 50%, transparent 62%, transparent 88%, rgba(255,243,207,0.14)),
            radial-gradient(circle, #1c1c1c 0%, #0d0d0d 60%, #050505 96%, #c8913a 97%, #5e3d0c 100%)
          `,
        }}>
          <div style={{
            position: "absolute", inset: 0, borderRadius: "50%",
            background: "linear-gradient(135deg, rgba(255,255,255,0.10) 0%, transparent 50%, rgba(0,0,0,0.15) 100%)",
            pointerEvents: "none",
          }} />
          <div style={{
            position: "absolute", top: "50%", left: "50%",
            transform: "translate(-50%,-50%)",
            width: 6, height: 6, borderRadius: "50%",
            background: "#050505",
            boxShadow: "0 0 0 1px rgba(255,255,255,0.08)",
          }} />
        </div>

        <div style={{
          position: "absolute", inset: 0,
          display: "flex", alignItems: "center", justifyContent: "center",
          opacity: playing ? 0 : 1,
          transition: "opacity 0.35s ease",
          pointerEvents: "none",
        }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="#e0b866">
            <path d="M8 5v14l11-7z" />
          </svg>
        </div>
      </button>
    </div>
  );
});

MusicFab.displayName = "MusicFab";
export default MusicFab;
