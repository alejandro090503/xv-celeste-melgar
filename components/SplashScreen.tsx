"use client";
import { useEffect, useRef, useState } from "react";
import { useLang } from "@/lib/i18n";

interface Props {
  onStart?: () => void; // se llama al tocar (gesto) — arranca música
  onOpen: () => void;   // se llama al terminar el video — revela invitación
}

const POSTER = "https://bsjoelxktbvlavfoozhk.supabase.co/storage/v1/object/public/fotos-clientes/img/xv-celeste-melgar/sobre-poster.jpg";
const VIDEO = "https://bsjoelxktbvlavfoozhk.supabase.co/storage/v1/object/public/fotos-clientes/video/xv-celeste-melgar/sobre.mp4";

export default function SplashScreen({ onStart, onOpen }: Props) {
  const { lang, setLang, langChosen, ready, t } = useLang();
  const screenRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const captionRef = useRef<HTMLDivElement>(null);
  const hintRef = useRef<HTMLButtonElement>(null);
  const [phase, setPhase] = useState<"lang" | "idle" | "opening">("lang");
  const revealedRef = useRef(false);
  const enteredIdleRef = useRef(false);

  /* Entrada del contenedor */
  useEffect(() => {
    const el = screenRef.current;
    if (!el) return;
    requestAnimationFrame(() => { if (el) el.style.opacity = "1"; });
  }, []);

  /* Una vez sabemos si el idioma ya estaba elegido (localStorage / ?lang=), decide la fase inicial */
  useEffect(() => {
    if (!ready) return;
    if (langChosen) setPhase("idle");
  }, [ready, langChosen]);

  /* Al entrar a la fase "idle" (tras elegir idioma o si ya estaba guardado) — anima caption + botón */
  useEffect(() => {
    if (phase !== "idle" || enteredIdleRef.current) return;
    enteredIdleRef.current = true;
    const t1 = setTimeout(() => { if (captionRef.current) captionRef.current.style.opacity = "1"; }, 260);
    const t2 = setTimeout(() => { if (hintRef.current) hintRef.current.style.opacity = "1"; }, 620);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, [phase]);

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

  /* Elegir idioma → pasa a la fase de "Toca para abrir" (sin arrancar música todavía) */
  const handleChooseLang = (l: "es" | "en") => (e: React.MouseEvent) => {
    e.stopPropagation();
    if (phase !== "lang") return;
    setLang(l);
    setPhase("idle");
  };

  /* Toca para abrir → reproduce el video del sobre (gesto del usuario arranca la música) */
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

  const ariaLabel = phase === "lang" ? t.splash.ariaChoose : t.splash.ariaOpen;

  return (
    <div
      ref={screenRef}
      onClick={phase === "idle" ? handleTap : undefined}
      role="button"
      aria-label={ariaLabel}
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
        position: "absolute", left: 0, right: 0, bottom: 0, height: "48%",
        background: "linear-gradient(to top, rgba(26,44,10,0.88) 0%, rgba(26,44,10,0.45) 45%, transparent 100%)",
        opacity: phase !== "opening" ? 1 : 0,
        transition: "opacity 0.6s ease",
        pointerEvents: "none",
      }} />

      {/* ── Selector de idioma (fase "lang") ── */}
      {phase !== "opening" && (
        <div
          style={{
            position: "absolute", left: 0, right: 0, bottom: "8%",
            display: "flex", flexDirection: "column", alignItems: "center",
            opacity: phase === "lang" ? 1 : 0,
            transition: "opacity 0.5s ease",
            pointerEvents: phase === "lang" ? "auto" : "none",
          }}
        >
          <div style={{
            fontFamily: "var(--font-cormorant), serif",
            fontStyle: "italic",
            fontWeight: 600,
            fontSize: 19,
            color: "#e9c77b",
            textShadow: "0 2px 12px rgba(0,0,0,0.7)",
            marginBottom: 2,
          }}>
            {t.splash.chooseTitle}
          </div>
          <div style={{
            fontFamily: "var(--font-lato), sans-serif",
            fontSize: 12,
            letterSpacing: 2,
            color: "rgba(255,255,255,0.75)",
            textShadow: "0 1px 8px rgba(0,0,0,0.7)",
            marginBottom: 22,
          }}>
            {t.splash.chooseSubtitle}
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 12, width: "min(78vw, 260px)" }}>
            <button
              onClick={handleChooseLang("es")}
              aria-label="Español"
              style={{
                fontFamily: "var(--font-cormorant), serif",
                fontSize: 15,
                letterSpacing: 4,
                textTransform: "uppercase",
                color: "#1a2c0a",
                cursor: "pointer",
                whiteSpace: "nowrap",
                padding: "14px 28px",
                background: "linear-gradient(135deg, #d4a24c, #996515)",
                border: "none",
                borderRadius: 40,
                fontWeight: 700,
                boxShadow: "0 6px 22px rgba(0,0,0,0.4)",
              }}
            >
              {t.splash.langEs}
            </button>
            <button
              onClick={handleChooseLang("en")}
              aria-label="English"
              style={{
                fontFamily: "var(--font-cormorant), serif",
                fontSize: 15,
                letterSpacing: 4,
                textTransform: "uppercase",
                color: "#e9c77b",
                cursor: "pointer",
                whiteSpace: "nowrap",
                padding: "13px 28px",
                background: "rgba(26,44,10,0.35)",
                border: "1.5px solid rgba(212,162,76,0.55)",
                borderRadius: 40,
                fontWeight: 700,
              }}
            >
              {t.splash.langEn}
            </button>
          </div>
        </div>
      )}

      {/* Caption + botón (fase "idle") */}
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
            color: "#e9c77b",
            textShadow: "0 2px 16px rgba(0,0,0,0.7)",
            opacity: 0,
            transition: "opacity 0.8s ease",
            marginBottom: 4,
          }}
        >
          {t.splash.name}
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
          whiteSpace: "nowrap",
        }}>
          {t.splash.subtitle}
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
            textIndent: lang === "es" ? 6 : 0,
            boxShadow: "0 6px 22px rgba(0,0,0,0.4)",
          }}
        >
          {t.splash.cta}
        </button>
      </div>
    </div>
  );
}
