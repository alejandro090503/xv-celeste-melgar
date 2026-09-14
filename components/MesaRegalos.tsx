"use client";
import { useEffect, useRef, useState } from "react";
import { useLang } from "@/lib/i18n";

function EnvelopeRainItem({ style }: { style: React.CSSProperties }) {
  return (
    <svg viewBox="0 0 34 24" style={style} aria-hidden="true">
      <rect x="1" y="1" width="32" height="22" rx="2.5" fill="#f5efe0" stroke="#996515" strokeWidth="1.2" />
      <path d="M1 1 L17 13 L33 1" fill="none" stroke="#996515" strokeWidth="1.2" strokeLinejoin="round" />
    </svg>
  );
}

export default function MesaRegalos() {
  const { t } = useLang();
  const [open, setOpen] = useState(false);
  const [raining, setRaining] = useState(true);
  const [landed, setLanded] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);
  const [drops, setDrops] = useState<Array<{ id: number; left: number; dur: number; delay: number; size: number; sway: number }>>([]);
  const idRef = useRef(0);

  // Genera gotas de sobres mientras llueve
  useEffect(() => {
    if (!raining) return;
    const spawn = () => {
      idRef.current += 1;
      const drop = {
        id: idRef.current,
        left: Math.random() * 100,
        dur: 5 + Math.random() * 4,
        delay: 0,
        size: 16 + Math.random() * 16,
        sway: (Math.random() - 0.5) * 60,
      };
      setDrops((d) => (d.length > 22 ? [...d.slice(-18), drop] : [...d, drop]));
    };
    const initial = [0, 0.26, 0.52, 0.78, 1.04, 1.3, 1.56].map((t) => setTimeout(spawn, t * 1000));
    const interval = setInterval(spawn, 520);
    return () => {
      initial.forEach(clearTimeout);
      clearInterval(interval);
    };
  }, [raining]);

  // Aterriza el sobre cuando la sección entra al centro de la vista
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    let done = false;
    const trigger = () => {
      if (done) return;
      done = true;
      setRaining(false);
      setTimeout(() => setLanded(true), 350);
    };
    const fallbackTimer = setTimeout(trigger, 3200);
    let observer: IntersectionObserver | undefined;
    try {
      observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            trigger();
            observer?.disconnect();
          }
        },
        { threshold: 0.5 }
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

  return (
    <section ref={sectionRef} style={{ padding: "64px 0", textAlign: "center", position: "relative", overflow: "hidden" }}>
      <style>{`
        @keyframes envRainFall {
          0%   { transform: translate(0, -46px) rotate(var(--rr0)); opacity: 0; }
          12%  { opacity: .75; }
          85%  { opacity: .75; }
          100% { transform: translate(var(--rx), var(--rh)) rotate(var(--rr1)); opacity: 0; }
        }
        .env-rain-item {
          position: absolute;
          top: 0;
          will-change: transform, opacity;
          animation: envRainFall var(--rdur) linear forwards;
        }
        @media (prefers-reduced-motion: reduce) {
          .env-rain-item { display: none; }
        }
      `}</style>

      {/* Lluvia de sobres */}
      <div aria-hidden="true" style={{ position: "absolute", inset: 0, pointerEvents: "none", zIndex: 0, opacity: raining ? 1 : 0, transition: "opacity 1s ease" }}>
        {drops.map((d) => {
          const rot0 = (Math.random() - 0.5) * 50;
          const rot1 = rot0 + (Math.random() - 0.5) * 160;
          return (
            <EnvelopeRainItem
              key={d.id}
              style={{
                left: `${d.left}%`,
                width: d.size,
                height: (d.size * 24) / 34,
                "--rdur": `${d.dur}s`,
                "--rx": `${d.sway}px`,
                "--rh": "520px",
                "--rr0": `${rot0}deg`,
                "--rr1": `${rot1}deg`,
              } as React.CSSProperties}
            />
          );
        })}
      </div>

      <div style={{ position: "relative", zIndex: 1, padding: "0 26px" }}>
        <p style={{
          fontFamily: "var(--font-cormorant), serif",
          fontStyle: "italic",
          fontWeight: 600,
          fontSize: 14,
          letterSpacing: 5,
          textTransform: "uppercase",
          color: "#e9c77b",
          marginBottom: 8,
          opacity: 0.9,
        }}>
          {t.regalos.eyebrow}
        </p>
        <h2 style={{
          fontFamily: "var(--font-great-vibes), cursive",
          fontSize: 50,
          lineHeight: 1.25,
          marginBottom: 14,
          padding: "6px 24px 10px",
          background: "var(--gold-metal-gradient)", backgroundSize: "400% 100%", animation: "goldSweep 11.3s ease-in-out infinite .5s",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          backgroundClip: "text",
          display: "inline-block",
        }}>
          {t.regalos.title}
        </h2>

        <p style={{
          fontFamily: "var(--font-cormorant), serif",
          fontStyle: "italic",
          fontWeight: 600,
          fontSize: 18,
          color: "var(--text-soft)",
          lineHeight: 1.65,
          letterSpacing: 0.4,
          maxWidth: 360,
          margin: "0 auto 24px",
        }}>
          {t.regalos.body}
        </p>

        {/* Sobre interactivo — aterriza cuando termina la lluvia */}
        <div style={{
          display: "flex", flexDirection: "column", alignItems: "center", gap: 0,
          minHeight: 220,
          justifyContent: "center",
          opacity: landed ? 1 : 0,
          transform: landed ? "translateY(0) rotate(0deg) scale(1)" : "translateY(-140px) rotate(-12deg) scale(0.82)",
          transition: "opacity .5s ease, transform 1.1s cubic-bezier(.34,1.56,.64,1)",
        }}>
          <button
            onClick={() => setOpen((o) => !o)}
            aria-label={t.regalos.ariaSobre}
            aria-expanded={open}
            style={{
              display: "flex", flexDirection: "column", alignItems: "center",
              cursor: "pointer", border: "none", background: "none", padding: 0,
              WebkitTapHighlightColor: "transparent", outline: "none",
            }}
          >
            <div style={{
              perspective: 700,
              position: "relative",
              width: 260,
              height: 200,
              animation: landed ? "envBreathe 3.6s ease-in-out infinite" : "none",
              filter: "drop-shadow(0 10px 26px rgba(30,20,4,0.35))",
            }}>
              {/* Cuerpo del sobre — textura hueso igual a la card de RSVP */}
              <svg viewBox="0 0 260 200" preserveAspectRatio="none" style={{ width: "100%", height: "100%" }} aria-hidden="true">
                <defs>
                  <linearGradient id="js-env-fill" x1="0" y1="1" x2="1" y2="0">
                    <stop offset="0%" stopColor="#f6f2ea" />
                    <stop offset="100%" stopColor="#efe7d6" />
                  </linearGradient>
                </defs>
                <rect x="18" y="52" width="224" height="132" rx="10" fill="url(#js-env-fill)" stroke="rgba(153,101,21,0.55)" strokeWidth="1.4" />
                <path d="M18 184 L130 110 L242 184" stroke="rgba(153,101,21,0.35)" strokeWidth="1" fill="none" />
                {/* Líneas decorativas (lluvia) */}
                <line x1="90"  y1="30" x2="90"  y2="20" stroke="#c8913a" strokeWidth="1.3" strokeLinecap="round" opacity=".55" />
                <line x1="130" y1="24" x2="130" y2="14" stroke="#c8913a" strokeWidth="1.3" strokeLinecap="round" opacity=".7" />
                <line x1="170" y1="30" x2="170" y2="20" stroke="#c8913a" strokeWidth="1.3" strokeLinecap="round" opacity=".55" />
                <line x1="110" y1="18" x2="110" y2="10" stroke="#996515" strokeWidth="1"   strokeLinecap="round" opacity=".5" />
                <line x1="150" y1="18" x2="150" y2="10" stroke="#996515" strokeWidth="1"   strokeLinecap="round" opacity=".5" />
                {/* Sello CM */}
                <circle cx="130" cy="118" r="16" fill="rgba(153,101,21,0.14)" stroke="rgba(153,101,21,0.55)" strokeWidth="1" />
                <text x="130" y="123" textAnchor="middle" fontFamily="Georgia,serif" fontSize="11" fill="#7d5720" opacity=".95">CM</text>
                {/* Esquinas ornamentales (mismo lenguaje visual que RSVP) */}
                <path d="M22 56 L22 62 M22 56 L28 56" stroke="rgba(153,101,21,0.5)" strokeWidth=".8" />
                <path d="M238 56 L238 62 M238 56 L232 56" stroke="rgba(153,101,21,0.5)" strokeWidth=".8" />
                <path d="M22 180 L22 174 M22 180 L28 180" stroke="rgba(153,101,21,0.5)" strokeWidth=".8" />
                <path d="M238 180 L238 174 M238 180 L232 180" stroke="rgba(153,101,21,0.5)" strokeWidth=".8" />
              </svg>

              {/* Solapa animable */}
              <div style={{
                position: "absolute",
                top: 46, left: 18,
                width: 224, height: 86,
                transformOrigin: "top center",
                transformStyle: "preserve-3d",
                backfaceVisibility: "hidden",
                WebkitBackfaceVisibility: "hidden",
                transition: "transform .65s cubic-bezier(.4,0,.2,1)",
                transform: open ? "rotateX(-175deg)" : "rotateX(0deg)",
                pointerEvents: "none",
                zIndex: 2,
              }}>
                <svg viewBox="0 0 224 86" preserveAspectRatio="none" style={{ width: "100%", height: "100%" }}>
                  <defs>
                    <linearGradient id="js-flap-fill" x1="0" y1="1" x2="1" y2="0">
                      <stop offset="0%" stopColor="#efe7d6" />
                      <stop offset="100%" stopColor="#f6f2ea" />
                    </linearGradient>
                  </defs>
                  <path d="M0 0 L112 86 L224 0 Z" fill="url(#js-flap-fill)" stroke="rgba(153,101,21,0.55)" strokeWidth="1.5" strokeLinejoin="round" />
                </svg>
              </div>
            </div>

            {/* Contenido revelado */}
            <div style={{
              overflow: "hidden",
              maxHeight: open ? 240 : 0,
              opacity: open ? 1 : 0,
              transition: "max-height .55s .3s ease, opacity .4s .38s ease",
              display: "flex", flexDirection: "column", alignItems: "center", gap: 8,
              padding: "0 20px",
              pointerEvents: open ? "auto" : "none",
            }}>
              <svg width="40" height="40" viewBox="0 0 52 52" fill="none" stroke="#e0b866" strokeWidth="1.5" style={{ marginTop: 12 }} aria-hidden="true">
                <rect x="8" y="22" width="36" height="24" rx="5" />
                <path d="M8 30 Q26 38 44 30" />
                <rect x="18" y="8" width="16" height="16" rx="2" />
                <path d="M18 8 Q26 3 34 8" />
              </svg>
              <p style={{
                fontFamily: "var(--font-great-vibes), cursive",
                fontSize: 34,
                color: "#e9c77b",
                lineHeight: 1.2,
              }}>
                {t.regalos.lluvia}
              </p>
              <p style={{
                fontFamily: "var(--font-cormorant), serif",
                fontSize: 16,
                fontStyle: "italic",
                fontWeight: 600,
                color: "var(--text-soft)",
                lineHeight: 1.7,
              }}>
                {t.regalos.lluviaBody}
              </p>
            </div>
          </button>

          <p style={{
            fontFamily: "var(--font-lato), sans-serif",
            fontSize: 11,
            letterSpacing: 3,
            textTransform: "uppercase",
            color: "#e9c77b",
            opacity: open ? 0 : (landed ? 0.9 : 0),
            transition: "opacity .3s",
            marginTop: 8,
          }}>
            {t.regalos.tocaSobre}
          </p>
        </div>
      </div>
    </section>
  );
}
