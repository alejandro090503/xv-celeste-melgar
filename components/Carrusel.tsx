"use client";
import { useEffect, useRef, useState } from "react";

const BASE = "https://bsjoelxktbvlavfoozhk.supabase.co/storage/v1/object/public/fotos-clientes/img/xv-celeste-melgar";

const FOTOS = [
  { src: `${BASE}/carrusel-01.jpg`, alt: "Celeste sonriendo", pos: "center 25%", rot: -6 },
  { src: `${BASE}/hero.jpg`, alt: "Celeste de espaldas, atardecer", pos: "center 30%", rot: 5 },
  { src: `${BASE}/carrusel-02.jpg`, alt: "Celeste de niña", pos: "center 20%", rot: 7 },
  { src: `${BASE}/framed-arco.jpg`, alt: "Celeste en el arco de piedra", pos: "center 35%", rot: -8 },
  { src: `${BASE}/framed-jardin.jpg`, alt: "Celeste en el jardín de glicinas", pos: "center 30%", rot: 4 },
  { src: `${BASE}/closing.jpg`, alt: "Celeste en el bosque encantado", pos: "center 30%", rot: -4 },
];

export default function Carrusel() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [fallen, setFallen] = useState(false);
  const [lightbox, setLightbox] = useState<number | null>(null);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    let done = false;
    const trigger = () => {
      if (done) return;
      done = true;
      setFallen(true);
    };
    // Fallback seguro: si el IntersectionObserver no dispara (preview / navegador raro),
    // las polaroids se muestran de todas formas tras un tiempo.
    const fallbackTimer = setTimeout(trigger, 2600);
    let observer: IntersectionObserver | undefined;
    try {
      observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            trigger();
            observer?.disconnect();
          }
        },
        { threshold: 0.15 }
      );
      observer.observe(el);
    } catch {
      trigger();
    }
    return () => {
      clearTimeout(fallbackTimer);
      observer?.disconnect();
    };
  }, []);

  useEffect(() => {
    if (lightbox === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setLightbox(null);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [lightbox]);

  return (
    <section ref={sectionRef} style={{ padding: "64px 0 56px" }}>
      <style>{`
        @keyframes polaFall {
          0%   { opacity: 0; transform: translateY(-140px) rotate(0deg) scale(0.92); }
          62%  { opacity: 1; transform: translateY(14px) rotate(var(--pr)) scale(1.02); }
          80%  { transform: translateY(-4px) rotate(var(--pr)) scale(1); }
          100% { opacity: 1; transform: translateY(0) rotate(var(--pr)) scale(1); }
        }
        .pola-card {
          opacity: 0;
          transform: translateY(-140px) rotate(0deg);
        }
        .pola-card.fallen {
          animation: polaFall 0.95s cubic-bezier(.22,.85,.4,1.1) forwards;
          animation-delay: var(--pd);
        }
        @media (prefers-reduced-motion: reduce) {
          .pola-card { opacity: 1 !important; transform: rotate(var(--pr)) !important; animation: none !important; }
        }
      `}</style>

      {/* Título */}
      <div style={{ textAlign: "center", padding: "0 24px 34px" }}>
        <p style={{
          fontFamily: "var(--font-cormorant), serif",
          fontStyle: "italic",
          fontWeight: 600,
          fontSize: 13,
          letterSpacing: 5,
          textTransform: "uppercase",
          color: "#e9c77b",
          marginBottom: 8,
          opacity: 0.85,
        }}>
          Creciendo
        </p>
        <h2 style={{
          fontFamily: "var(--font-great-vibes), cursive",
          fontSize: 48,
          lineHeight: 1.25,
          padding: "6px 24px 10px",
          display: "inline-block",
          background: "var(--gold-metal-gradient)", backgroundSize: "400% 100%", animation: "goldSweep 12.5s ease-in-out infinite 1.3s",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          backgroundClip: "text",
        }}>
          Mis Momentos
        </h2>
      </div>

      {/* Grid de polaroids apiladas / escalonadas */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gap: "10px 6px",
        padding: "0 22px",
        maxWidth: 420,
        margin: "0 auto",
      }}>
        {FOTOS.map((foto, i) => (
          <button
            key={i}
            onClick={() => setLightbox(i)}
            aria-label={`Ver foto ${i + 1} en grande`}
            className={`pola-card${fallen ? " fallen" : ""}`}
            style={{
              "--pr": `${foto.rot}deg`,
              "--pd": `${i * 0.14}s`,
              position: "relative",
              marginTop: i % 2 === 1 ? 26 : 0,
              padding: 0,
              border: "none",
              background: "none",
              cursor: "pointer",
              WebkitTapHighlightColor: "transparent",
            } as React.CSSProperties}
          >
            <div style={{
              background: "#f5efe0",
              backgroundImage: "radial-gradient(rgba(150,120,70,0.05) 1px, transparent 1px)",
              backgroundSize: "6px 6px",
              padding: "8px 8px 26px",
              borderRadius: 3,
              boxShadow: "0 10px 22px rgba(0,0,0,0.42), 0 2px 4px rgba(0,0,0,0.2)",
              position: "relative",
            }}>
              <div style={{ position: "relative", aspectRatio: "1 / 1", overflow: "hidden", background: "#1a2c0a" }}>
                <img
                  src={foto.src}
                  alt={foto.alt}
                  style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: foto.pos, display: "block" }}
                />
                <div style={{
                  position: "absolute", inset: 0,
                  boxShadow: "inset 0 0 0 1px rgba(153,101,21,0.35)",
                  pointerEvents: "none",
                }} />
              </div>
              <div style={{
                position: "absolute", bottom: 7, left: 0, right: 0,
                textAlign: "center",
                fontFamily: "var(--font-cormorant), serif",
                fontStyle: "italic",
                fontSize: 11,
                letterSpacing: 1,
                color: "#5e3d0c",
                opacity: 0.7,
              }}>
                XV · Celeste
              </div>
            </div>
          </button>
        ))}
      </div>

      {/* Pie decorativo */}
      <div style={{ textAlign: "center", padding: "30px 24px 0" }}>
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

      {/* Lightbox */}
      {lightbox !== null && (
        <div
          onClick={() => setLightbox(null)}
          role="dialog"
          aria-modal="true"
          style={{
            position: "fixed", inset: 0, zIndex: 2000,
            background: "rgba(9,16,7,0.92)",
            display: "flex", alignItems: "center", justifyContent: "center",
            padding: 24,
            backdropFilter: "blur(4px)",
          }}
        >
          <button
            onClick={() => setLightbox(null)}
            aria-label="Cerrar"
            style={{
              position: "absolute", top: 22, right: 22,
              width: 40, height: 40, borderRadius: "50%",
              background: "rgba(255,255,255,0.08)", border: "1px solid rgba(212,162,76,0.4)",
              color: "#e9c77b", fontSize: 20, cursor: "pointer",
              display: "flex", alignItems: "center", justifyContent: "center",
            }}
          >
            ×
          </button>
          <img
            src={FOTOS[lightbox].src}
            alt={FOTOS[lightbox].alt}
            onClick={(e) => e.stopPropagation()}
            style={{
              maxWidth: "92vw", maxHeight: "82vh",
              objectFit: "contain",
              borderRadius: 4,
              boxShadow: "0 20px 60px rgba(0,0,0,0.6), 0 0 0 6px #f5efe0",
            }}
          />
        </div>
      )}
    </section>
  );
}
