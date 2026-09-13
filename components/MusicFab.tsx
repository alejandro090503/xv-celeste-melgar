"use client";
import { useState, useRef, useEffect, forwardRef, useImperativeHandle } from "react";

const AUDIO_URL = "https://bsjoelxktbvlavfoozhk.supabase.co/storage/v1/object/public/fotos-clientes/audio/xv-celeste-melgar/cancion.mp3";

export interface MusicFabHandle {
  play: () => void;
}

const MusicFab = forwardRef<MusicFabHandle>((_, ref) => {
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
      <div style={{
        position: "absolute", inset: -8, borderRadius: "50%",
        border: "1.5px solid rgba(212,162,76,0.30)",
        animation: playing ? "vinylPulse 2.2s ease-in-out infinite" : "none",
        pointerEvents: "none",
      }} />

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
        aria-label={playing ? "Pausar música" : "Reproducir música"}
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
            radial-gradient(circle, #d4a24c 4%, transparent 4.5%),
            radial-gradient(circle, #143322 0%, #1a2c0a 25%, #0a1a10 27%, transparent 27.5%),
            repeating-radial-gradient(circle,
              transparent 21%, rgba(0,0,0,0.12) 21.7%, transparent 22.3%,
              transparent 27%, rgba(0,0,0,0.12) 27.7%, transparent 28.3%,
              transparent 33%, rgba(0,0,0,0.12) 33.7%, transparent 34.3%,
              transparent 39%, rgba(0,0,0,0.12) 39.7%, transparent 40.3%,
              transparent 45%, rgba(0,0,0,0.12) 45.7%, transparent 46.3%,
              transparent 51%, rgba(0,0,0,0.12) 51.7%, transparent 52.3%,
              transparent 57%, rgba(0,0,0,0.12) 57.7%, transparent 58.3%,
              transparent 63%, rgba(0,0,0,0.12) 63.7%, transparent 64.3%,
              transparent 69%, rgba(0,0,0,0.12) 69.7%, transparent 70.3%,
              transparent 75%, rgba(0,0,0,0.12) 75.7%, transparent 76.3%,
              transparent 81%, rgba(0,0,0,0.12) 81.7%, transparent 82.3%,
              transparent 87%, rgba(0,0,0,0.12) 87.7%, transparent 88.3%,
              transparent 93%, rgba(0,0,0,0.12) 93.7%, transparent 94.3%
            ),
            radial-gradient(circle, #f4e1a8 0%, #d4a24c 32%, #996515 72%, #5e3d0c 100%)
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
            background: "#050d08",
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
          <svg width="18" height="18" viewBox="0 0 24 24" fill="#d4a24c">
            <path d="M8 5v14l11-7z" />
          </svg>
        </div>
      </button>
    </div>
  );
});

MusicFab.displayName = "MusicFab";
export default MusicFab;
