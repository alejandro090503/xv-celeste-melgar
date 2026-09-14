"use client";
import { useEffect, useRef, useState } from "react";
import { useLang } from "@/lib/i18n";

const TARGET = new Date("2026-10-17T16:00:00-07:00");

function getRemainingTime() {
  const now = new Date();
  const diff = TARGET.getTime() - now.getTime();
  if (diff <= 0) return { days: "000", hours: "00", minutes: "00", seconds: "00" };
  return {
    days: String(Math.floor(diff / 86400000)).padStart(3, "0"),
    hours: String(Math.floor((diff % 86400000) / 3600000)).padStart(2, "0"),
    minutes: String(Math.floor((diff % 3600000) / 60000)).padStart(2, "0"),
    seconds: String(Math.floor((diff % 60000) / 1000)).padStart(2, "0"),
  };
}

/* Tarjeta tipo calendario con flip (la hoja cae hacia atrás al cambiar) */
function FlipUnit({ value, label }: { value: string; label: string }) {
  const [display, setDisplay] = useState(value);
  const [style, setStyle] = useState<React.CSSProperties>({ transform: "rotateX(0deg)" });
  const prev = useRef(value);
  const raf = useRef<number | undefined>(undefined);

  useEffect(() => {
    if (value === prev.current) return;
    prev.current = value;
    // Fase 1: la hoja vieja gira hacia atrás (0 → -90)
    setStyle({ transform: "rotateX(-90deg)", transition: "transform .26s cubic-bezier(.45,0,.9,.6)" });
    const t1 = setTimeout(() => {
      setDisplay(value);
      // Fase 2: la hoja nueva entra desde +90 → 0
      setStyle({ transform: "rotateX(90deg)", transition: "none" });
      raf.current = requestAnimationFrame(() => {
        raf.current = requestAnimationFrame(() => {
          setStyle({ transform: "rotateX(0deg)", transition: "transform .38s cubic-bezier(.1,.55,.2,1)" });
        });
      });
    }, 260);
    return () => { clearTimeout(t1); if (raf.current) cancelAnimationFrame(raf.current); };
  }, [value]);

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", flex: 1, minWidth: 0 }}>
      <div style={{
        position: "relative",
        width: "100%",
        aspectRatio: "0.86",
        borderRadius: 12,
        background: "linear-gradient(180deg, rgba(22,50,33,0.92) 0%, rgba(26,44,10,0.92) 49.6%, rgba(12,32,20,0.96) 50.4%, rgba(9,26,16,0.96) 100%)",
        border: "1px solid rgba(212,162,76,0.38)",
        boxShadow: "0 10px 30px rgba(0,0,0,0.35), inset 0 1px 0 rgba(212,162,76,0.12)",
        overflow: "hidden",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        perspective: 360,
      }}>
        <span className="gold-border gold-border--thin" aria-hidden="true" />
        {/* Línea de pliegue central */}
        <div style={{
          position: "absolute", top: "50%", left: 0, right: 0,
          height: 1, transform: "translateY(-0.5px)",
          background: "linear-gradient(90deg, transparent, rgba(212,162,76,0.45) 30%, rgba(212,162,76,0.6) 50%, rgba(212,162,76,0.45) 70%, transparent)",
          zIndex: 2,
        }} />
        {/* Brillo superior */}
        <div style={{
          position: "absolute", inset: 0,
          background: "radial-gradient(ellipse at 50% 0%, rgba(212,162,76,0.10), transparent 65%)",
          pointerEvents: "none",
        }} />
        {/* Número con flip */}
        <span style={{
          fontFamily: "var(--font-cormorant), serif",
          fontStyle: "italic",
          fontWeight: 700,
          fontSize: "clamp(30px, 9vw, 46px)",
          lineHeight: 1,
          letterSpacing: "-1px",
          fontVariantNumeric: "tabular-nums",
          background: "var(--gold-metal-gradient)",
          backgroundSize: "400% 100%",
          animation: "goldSweep 10s ease-in-out infinite",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          backgroundClip: "text",
          transformOrigin: "center center",
          backfaceVisibility: "hidden",
          willChange: "transform",
          ...style,
        }}>
          {display}
        </span>
      </div>
      <span style={{
        fontFamily: "var(--font-cormorant), serif",
        fontStyle: "italic",
        fontSize: 11,
        letterSpacing: "2.5px",
        textTransform: "uppercase",
        color: "#e9c77b",
        marginTop: 12,
        opacity: 0.9,
      }}>
        {label}
      </span>
    </div>
  );
}

export default function CountdownTimer() {
  const { t } = useLang();
  const [time, setTime] = useState(getRemainingTime());

  useEffect(() => {
    const id = setInterval(() => setTime(getRemainingTime()), 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <section style={{ padding: "64px 26px" }}>
      <h2 style={{
        fontFamily: "var(--font-great-vibes), cursive",
        fontSize: 50, textAlign: "center", lineHeight: 1.25, marginBottom: 8, padding: "6px 24px 10px", display: "inline-block", width: "100%",
        background: "var(--gold-metal-gradient)", backgroundSize: "400% 100%", animation: "goldSweep 10s ease-in-out infinite",
        WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text",
      }}>
        {t.countdown.title}
      </h2>
      <p style={{
        fontFamily: "var(--font-cormorant), serif",
        fontStyle: "italic", fontSize: 16, color: "var(--text-soft)",
        textAlign: "center", letterSpacing: 1, marginBottom: 34, fontWeight: 600,
      }}>
        {t.countdown.subtitle}
      </p>

      <div style={{
        display: "flex",
        justifyContent: "center",
        gap: "clamp(8px, 2.5vw, 16px)",
        maxWidth: 380,
        margin: "0 auto",
      }}>
        <FlipUnit value={time.days} label={t.countdown.days} />
        <FlipUnit value={time.hours} label={t.countdown.hours} />
        <FlipUnit value={time.minutes} label={t.countdown.minutes} />
        <FlipUnit value={time.seconds} label={t.countdown.seconds} />
      </div>

      <p style={{
        fontFamily: "var(--font-cormorant), serif",
        fontStyle: "italic", fontSize: 16, color: "var(--text-soft)",
        textAlign: "center", letterSpacing: 1, lineHeight: 1.6,
        marginTop: 34, fontWeight: 500, opacity: 0.85,
      }}>
        {t.countdown.footer}
      </p>
    </section>
  );
}
