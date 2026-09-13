"use client";
import { useEffect, useRef, useState, useCallback } from "react";

const BASE = "https://bsjoelxktbvlavfoozhk.supabase.co/storage/v1/object/public/fotos-clientes/img/xv-celeste-melgar";

const FOTOS = [
  { src: `${BASE}/carrusel-01.jpg`, alt: "Celeste sonriendo", pos: "center 25%" },
  { src: `${BASE}/carrusel-02.jpg`, alt: "Celeste de niña", pos: "center 20%" },
];

const AUTO_MS = 4200;

export default function Carrusel() {
  const [idx, setIdx] = useState(0);
  const [prev, setPrev] = useState<number | null>(null);
  const [dir, setDir] = useState<"next" | "prev">("next");
  const [transitioning, setTransitioning] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const touchXRef = useRef<number | null>(null);

  const goTo = useCallback((next: number, direction: "next" | "prev") => {
    if (transitioning) return;
    setDir(direction);
    setPrev(idx);
    setIdx(next);
    setTransitioning(true);
    clearTimeout(timerRef.current);
  }, [idx, transitioning]);

  const goNext = useCallback(() => {
    goTo((idx + 1) % FOTOS.length, "next");
  }, [goTo, idx]);

  const goPrev = useCallback(() => {
    goTo((idx - 1 + FOTOS.length) % FOTOS.length, "prev");
  }, [goTo, idx]);

  // Auto-advance
  useEffect(() => {
    if (transitioning) return;
    timerRef.current = setTimeout(goNext, AUTO_MS);
    return () => clearTimeout(timerRef.current);
  }, [idx, transitioning, goNext]);

  // After transition ends
  const handleTransitionEnd = () => {
    setTransitioning(false);
    setPrev(null);
  };

  // Touch swipe
  const onTouchStart = (e: React.TouchEvent) => {
    touchXRef.current = e.touches[0].clientX;
  };
  const onTouchEnd = (e: React.TouchEvent) => {
    if (touchXRef.current === null) return;
    const dx = e.changedTouches[0].clientX - touchXRef.current;
    touchXRef.current = null;
    if (Math.abs(dx) > 40) dx < 0 ? goNext() : goPrev();
  };

  const slideIn: React.CSSProperties = {
    position: "absolute",
    inset: 0,
    transform: transitioning ? "translateX(0)" : "translateX(0)",
    animation: transitioning
      ? `carruselIn${dir === "next" ? "Right" : "Left"} 0.55s cubic-bezier(.4,0,.2,1) forwards`
      : "none",
  };

  const slideOut: React.CSSProperties = {
    position: "absolute",
    inset: 0,
    animation: transitioning
      ? `carruselOut${dir === "next" ? "Right" : "Left"} 0.55s cubic-bezier(.4,0,.2,1) forwards`
      : "none",
    zIndex: 1,
  };

  return (
    <section style={{ padding: "64px 0 0" }}>
      {/* Keyframes inyectados inline */}
      <style>{`
        @keyframes carruselInRight  { from { transform:translateX( 100%); opacity:.5 } to { transform:translateX(0); opacity:1 } }
        @keyframes carruselInLeft   { from { transform:translateX(-100%); opacity:.5 } to { transform:translateX(0); opacity:1 } }
        @keyframes carruselOutRight { from { transform:translateX(0); opacity:1 } to { transform:translateX(-100%); opacity:.3 } }
        @keyframes carruselOutLeft  { from { transform:translateX(0); opacity:1 } to { transform:translateX( 100%); opacity:.3 } }
      `}</style>

      {/* Título */}
      <div style={{ textAlign: "center", padding: "0 24px 28px" }}>
        <p style={{
          fontFamily: "var(--font-cormorant), serif",
          fontStyle: "italic",
          fontWeight: 600,
          fontSize: 13,
          letterSpacing: 5,
          textTransform: "uppercase",
          color: "#d4a24c",
          marginBottom: 8,
          opacity: 0.85,
        }}>
          Creciendo
        </p>
        <h2 style={{
          fontFamily: "var(--font-great-vibes), cursive",
          fontSize: 48,
          lineHeight: 1.1,
          background: "linear-gradient(135deg,#996515 0%,#d4a24c 50%,#996515 100%)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          backgroundClip: "text",
        }}>
          Mis Momentos
        </h2>
      </div>

      {/* Marco de la foto con efecto deckle */}
      <div
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
        style={{
          position: "relative",
          margin: "0 auto",
          width: "min(340px, 88vw)",
        }}
      >
        {/* Sombra decorativa detrás */}
        <div style={{
          position: "absolute",
          inset: 0,
          transform: "rotate(-2deg) translate(6px, 8px)",
          background: "rgba(12,28,18,0.55)",
          borderRadius: 18,
          filter: "blur(8px)",
        }} />

        {/* Marco principal */}
        <div style={{
          position: "relative",
          borderRadius: 18,
          overflow: "hidden",
          background: "#1a2c0a",
          boxShadow: "0 16px 48px rgba(0,0,0,0.50), 0 0 0 3px rgba(212,162,76,0.30)",
          aspectRatio: "3/4",
          userSelect: "none",
        }}>
          {/* Imagen anterior (saliendo) */}
          {prev !== null && transitioning && (
            <div style={slideOut} onAnimationEnd={handleTransitionEnd}>
              <img
                src={FOTOS[prev].src}
                alt={FOTOS[prev].alt}
                style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: FOTOS[prev].pos }}
              />
            </div>
          )}

          {/* Imagen actual (entrando) */}
          <div style={slideIn}>
            <img
              src={FOTOS[idx].src}
              alt={FOTOS[idx].alt}
              loading="lazy"
              style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: FOTOS[idx].pos }}
            />
            {/* Vignette */}
            <div style={{
              position: "absolute", inset: 0,
              background: "radial-gradient(ellipse at center, transparent 55%, rgba(9,20,12,0.55) 100%)",
              pointerEvents: "none",
            }} />
          </div>

          {/* Overlay dorado top */}
          <div style={{
            position: "absolute", top: 0, left: 0, right: 0, height: 60,
            background: "linear-gradient(to bottom, rgba(9,22,14,0.45), transparent)",
            pointerEvents: "none",
          }} />

          {/* Flechas */}
          <button
            onClick={goPrev}
            aria-label="Foto anterior"
            style={{
              position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)",
              width: 36, height: 36, borderRadius: "50%",
              background: "rgba(26,44,10,0.65)", border: "1px solid rgba(212,162,76,0.35)",
              backdropFilter: "blur(8px)",
              display: "flex", alignItems: "center", justifyContent: "center",
              cursor: "pointer", color: "#d4a24c", fontSize: 18,
              zIndex: 10,
            }}
          >
            ‹
          </button>
          <button
            onClick={goNext}
            aria-label="Siguiente foto"
            style={{
              position: "absolute", right: 10, top: "50%", transform: "translateY(-50%)",
              width: 36, height: 36, borderRadius: "50%",
              background: "rgba(26,44,10,0.65)", border: "1px solid rgba(212,162,76,0.35)",
              backdropFilter: "blur(8px)",
              display: "flex", alignItems: "center", justifyContent: "center",
              cursor: "pointer", color: "#d4a24c", fontSize: 18,
              zIndex: 10,
            }}
          >
            ›
          </button>

          {/* Número de foto */}
          <div style={{
            position: "absolute", bottom: 46, right: 14,
            fontFamily: "var(--font-cormorant), serif",
            fontSize: 12, letterSpacing: 2,
            color: "rgba(212,162,76,0.85)",
            zIndex: 10,
          }}>
            {idx + 1} / {FOTOS.length}
          </div>
        </div>

        {/* Puntos indicadores */}
        <div style={{ display: "flex", justifyContent: "center", gap: 8, marginTop: 18 }}>
          {FOTOS.map((_, i) => (
            <button
              key={i}
              onClick={() => goTo(i, i > idx ? "next" : "prev")}
              aria-label={`Ir a foto ${i + 1}`}
              style={{
                width: i === idx ? 22 : 8,
                height: 8,
                borderRadius: 4,
                background: i === idx
                  ? "linear-gradient(90deg, #996515, #d4a24c)"
                  : "rgba(212,162,76,0.30)",
                border: "none",
                cursor: "pointer",
                transition: "width 0.35s ease, background 0.35s ease",
                padding: 0,
              }}
            />
          ))}
        </div>
      </div>

      {/* Pie decorativo */}
      <div style={{ textAlign: "center", padding: "22px 24px 0" }}>
        <p style={{
          fontFamily: "var(--font-cormorant), serif",
          fontStyle: "italic",
          fontSize: 17,
          color: "var(--text-soft)",
          lineHeight: 1.65,
          fontWeight: 600,
          maxWidth: 320,
          margin: "0 auto",
        }}>
          Cada foto guarda un instante irrepetible de este camino hacia los quince.
        </p>
      </div>
    </section>
  );
}
