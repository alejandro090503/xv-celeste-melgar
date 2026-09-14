"use client";
import { useEffect, useRef, useState } from "react";
import { useLang } from "@/lib/i18n";

const BASE = "https://bsjoelxktbvlavfoozhk.supabase.co/storage/v1/object/public/fotos-clientes/img/xv-celeste-melgar";

const SRCS = [
  `${BASE}/carrusel-01.jpg`,
  `${BASE}/hero.jpg`,
  `${BASE}/carrusel-02.jpg`,
  `${BASE}/framed-arco.jpg`,
  `${BASE}/framed-jardin.jpg`,
  `${BASE}/closing.jpg`,
];
const POS = ["center 25%", "center 30%", "center 20%", "center 35%", "center 30%", "center 30%"];

const N = SRCS.length;
const STEP = 360 / N;

// Ancho de tarjeta como fracción del contenedor (55-60% en móvil), con límites
// razonables para no verse absurda en pantallas más anchas.
const CARD_RATIO = 0.57;
const CARD_MIN = 140;
const CARD_MAX = 236;
const CARD_ASPECT = 3 / 4; // ancho:alto

export default function Carrusel() {
  const { t } = useLang();
  const FOTOS = SRCS.map((src, i) => ({ src, alt: t.carrusel.alts[i], pos: POS[i] }));
  const sectionRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const [lightbox, setLightbox] = useState<number | null>(null);

  // ───── Rueda 3D: geometría responsiva + auto-rotación + drag con inercia ─────
  useEffect(() => {
    const scene = sceneRef.current;
    const ring = ringRef.current;
    if (!scene || !ring) return;

    const cards = Array.from(ring.querySelectorAll<HTMLElement>(".wheel-card"));
    if (!cards.length) return;

    const reduceMotion =
      typeof window !== "undefined" &&
      window.matchMedia &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let cardW = 200;
    let cardH = 200 / CARD_ASPECT;
    let radius = 360;

    // Coloca cada tarjeta en su posición fija sobre el círculo. Se ejecuta
    // de forma síncrona (sin depender de rAF) para que, aunque el rAF esté
    // congelado (p. ej. en el preview), la rueda ya se vea correcta y estática.
    function layout() {
      const w = scene!.clientWidth || 360; // fallback si el contenedor mide 0
      cardW = Math.min(CARD_MAX, Math.max(CARD_MIN, w * CARD_RATIO));
      cardH = cardW / CARD_ASPECT;
      // Radio: la cuerda entre dos tarjetas vecinas iguala ~ el ancho de tarjeta,
      // para que queden pegadas sin traslaparse en la rueda de 6 caras.
      radius = Math.round((cardW + 14) / (2 * Math.sin(Math.PI / N)));

      scene!.style.height = `${Math.round(cardH + 150)}px`;

      cards.forEach((card, i) => {
        card.style.width = `${cardW}px`;
        card.style.height = `${cardH}px`;
        card.style.marginLeft = `${-cardW / 2}px`;
        card.style.marginTop = `${-cardH / 2}px`;
        card.style.transform = `rotateY(${STEP * i}deg) translateZ(${radius}px)`;
      });
    }

    layout();

    let ro: ResizeObserver | undefined;
    if (typeof ResizeObserver !== "undefined") {
      ro = new ResizeObserver(() => layout());
      ro.observe(scene);
    }
    const onResize = () => layout();
    window.addEventListener("resize", onResize);

    // ───── Estado de rotación del anillo completo ─────
    let rot = 0;
    let vel = 0;
    let mode: "auto" | "idle" | "inertia" | "tween" = reduceMotion ? "idle" : "auto";
    let tweenFrom = 0;
    let tweenTo = 0;
    let tweenStart = 0;
    const TWEEN_MS = 520;

    let isDrag = false;
    let startX = 0;
    let lastX = 0;
    let startRot = 0;
    let moved = 0;
    let resumeTimer: ReturnType<typeof setTimeout> | undefined;

    function setRot(deg: number) {
      rot = deg;
      ring!.style.transform = `rotateY(${rot}deg)`;
    }
    setRot(0);

    function scheduleResume() {
      if (reduceMotion) return;
      if (resumeTimer) clearTimeout(resumeTimer);
      resumeTimer = setTimeout(() => {
        if (!isDrag) mode = "auto";
      }, 1800);
    }

    function easeOutCubic(t: number) {
      return 1 - Math.pow(1 - t, 3);
    }

    let raf = 0;
    let last = performance.now();
    function frame(now: number) {
      const dt = now - last;
      last = now;
      if (mode === "auto") {
        // una vuelta completa cada ~140s, lenta y elegante.
        setRot(rot + dt * 0.02861);
      } else if (mode === "inertia") {
        setRot(rot + vel * (dt / 16.7));
        vel *= 0.94;
        if (Math.abs(vel) < 0.02) {
          mode = "idle";
          scheduleResume();
        }
      } else if (mode === "tween") {
        const t = Math.min(1, (now - tweenStart) / TWEEN_MS);
        setRot(tweenFrom + (tweenTo - tweenFrom) * easeOutCubic(t));
        if (t >= 1) {
          mode = "idle";
          scheduleResume();
        }
      }
      raf = requestAnimationFrame(frame);
    }
    raf = requestAnimationFrame(frame);

    function pointerDown(x: number) {
      isDrag = true;
      moved = 0;
      mode = "idle";
      if (resumeTimer) clearTimeout(resumeTimer);
      ring!.classList.add("dragging");
      startX = x;
      lastX = x;
      startRot = rot;
      vel = 0;
    }
    function pointerMove(x: number) {
      if (!isDrag) return;
      moved = Math.max(moved, Math.abs(x - startX));
      const next = startRot + (x - startX) * 0.4;
      vel = (x - lastX) * 0.5;
      lastX = x;
      setRot(next);
    }
    function pointerUp() {
      if (!isDrag) return;
      isDrag = false;
      ring!.classList.remove("dragging");
      if (Math.abs(vel) > 0.05) {
        mode = "inertia";
      } else {
        mode = "idle";
        scheduleResume();
      }
    }

    const onMouseDown = (e: MouseEvent) => {
      e.preventDefault();
      pointerDown(e.clientX);
    };
    const onMouseMove = (e: MouseEvent) => pointerMove(e.clientX);
    const onMouseUp = () => pointerUp();
    const onTouchStart = (e: TouchEvent) => pointerDown(e.touches[0].clientX);
    const onTouchMove = (e: TouchEvent) => pointerMove(e.touches[0].clientX);
    const onTouchEnd = () => pointerUp();

    ring.addEventListener("mousedown", onMouseDown);
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);
    ring.addEventListener("touchstart", onTouchStart, { passive: true });
    ring.addEventListener("touchmove", onTouchMove, { passive: true });
    ring.addEventListener("touchend", onTouchEnd);

    // Clic (sin arrastre) sobre una tarjeta abre el lightbox.
    const clickHandlers: Array<[HTMLElement, (e: Event) => void]> = [];
    cards.forEach((card, i) => {
      const handler = () => {
        if (moved > 8) return;
        setLightbox(i);
      };
      card.addEventListener("click", handler);
      clickHandlers.push([card, handler]);
    });

    // Botones prev/next: avanzan una tarjeta con una animación suave.
    function step(dir: 1 | -1) {
      isDrag = false;
      if (resumeTimer) clearTimeout(resumeTimer);
      if (reduceMotion) {
        setRot(rot + dir * STEP);
        mode = "idle";
        return;
      }
      tweenFrom = rot;
      tweenTo = rot + dir * STEP;
      tweenStart = performance.now();
      mode = "tween";
    }
    (ring as HTMLDivElement & { __wheelStep?: (dir: 1 | -1) => void }).__wheelStep = step;

    return () => {
      cancelAnimationFrame(raf);
      if (resumeTimer) clearTimeout(resumeTimer);
      ro?.disconnect();
      window.removeEventListener("resize", onResize);
      ring.removeEventListener("mousedown", onMouseDown);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
      ring.removeEventListener("touchstart", onTouchStart);
      ring.removeEventListener("touchmove", onTouchMove);
      ring.removeEventListener("touchend", onTouchEnd);
      clickHandlers.forEach(([card, handler]) => card.removeEventListener("click", handler));
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (lightbox === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setLightbox(null);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [lightbox]);

  function goStep(dir: 1 | -1) {
    const ring = ringRef.current as (HTMLDivElement & { __wheelStep?: (dir: 1 | -1) => void }) | null;
    ring?.__wheelStep?.(dir);
  }

  return (
    <section ref={sectionRef} style={{ padding: "64px 0 56px", overflowX: "hidden" }}>
      <style>{`
        .wheel-scene{ position:relative; width:100%; perspective:1000px; margin:0 auto; }
        .wheel-ring{ position:absolute; inset:0; width:100%; height:100%; transform-style:preserve-3d; cursor:grab; }
        .wheel-ring.dragging{ cursor:grabbing; }
        .wheel-card{
          position:absolute; left:50%; top:50%;
          border-radius:6px; overflow:hidden;
          background:#1a2c0a;
          box-shadow:0 14px 34px rgba(0,0,0,0.45), 0 2px 6px rgba(0,0,0,0.25);
          cursor:pointer; user-select:none; -webkit-user-select:none;
          padding:0; border:none;
        }
        .wheel-card img{ width:100%; height:100%; object-fit:cover; display:block; pointer-events:none; }
        .wheel-nav-btn{
          width:38px; height:38px; border-radius:50%;
          background:rgba(255,255,255,0.06); border:1px solid rgba(212,162,76,0.45);
          color:#e9c77b; font-size:17px; cursor:pointer;
          display:flex; align-items:center; justify-content:center;
          -webkit-tap-highlight-color:transparent;
        }
        .wheel-nav-btn:active{ background:rgba(212,162,76,0.18); }
        @media (prefers-reduced-motion: reduce) {
          .wheel-ring{ transition:none !important; }
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
          {t.carrusel.eyebrow}
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
          {t.carrusel.title}
        </h2>
      </div>

      {/* Rueda 3D */}
      <div style={{ overflow: "visible", padding: "0 2px" }}>
        <div ref={sceneRef} className="wheel-scene">
          <div ref={ringRef} className="wheel-ring">
            {FOTOS.map((foto, i) => (
              <div key={i} className="wheel-card" style={{ position: "absolute" }}>
                <span className="gold-border gold-border--thin" aria-hidden="true" />
                <img
                  src={foto.src}
                  alt={foto.alt}
                  loading="eager"
                  decoding="async"
                  style={{ objectPosition: foto.pos }}
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Controles discretos */}
      <div style={{ display: "flex", justifyContent: "center", gap: 22, marginTop: 18 }}>
        <button className="wheel-nav-btn" onClick={() => goStep(-1)} aria-label={t.carrusel.prev}>‹</button>
        <button className="wheel-nav-btn" onClick={() => goStep(1)} aria-label={t.carrusel.next}>›</button>
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
          {t.carrusel.footer}
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
            aria-label={t.carrusel.close}
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
