"use client";
import { useLang } from "@/lib/i18n";

export default function LangFab() {
  const { lang, setLang } = useLang();

  return (
    <div
      style={{
        position: "fixed",
        top: 18,
        left: 16,
        zIndex: 998,
        display: "flex",
        alignItems: "center",
        borderRadius: 30,
        background: "rgba(26,44,10,0.55)",
        backdropFilter: "blur(8px)",
        WebkitBackdropFilter: "blur(8px)",
        boxShadow: "0 4px 18px rgba(0,0,0,0.35)",
        overflow: "hidden",
      }}
    >
      <span className="gold-border" aria-hidden="true" style={{ borderRadius: 30 }} />
      <button
        type="button"
        onClick={() => setLang("es")}
        aria-label="Español"
        aria-pressed={lang === "es"}
        style={{
          fontFamily: "var(--font-lato), sans-serif",
          fontSize: 11,
          fontWeight: lang === "es" ? 800 : 600,
          letterSpacing: 1.5,
          padding: "8px 12px",
          border: "none",
          background: lang === "es" ? "var(--gold-metal-gradient)" : "transparent",
          backgroundSize: "400% 100%",
          animation: lang === "es" ? "goldSweep 9s ease-in-out infinite" : "none",
          color: lang === "es" ? "#1a2c0a" : "rgba(255,255,255,0.75)",
          cursor: "pointer",
        }}
      >
        ES
      </button>
      <span style={{ width: 1, height: 14, background: "rgba(212,162,76,0.35)" }} />
      <button
        type="button"
        onClick={() => setLang("en")}
        aria-label="English"
        aria-pressed={lang === "en"}
        style={{
          fontFamily: "var(--font-lato), sans-serif",
          fontSize: 11,
          fontWeight: lang === "en" ? 800 : 600,
          letterSpacing: 1.5,
          padding: "8px 12px",
          border: "none",
          background: lang === "en" ? "var(--gold-metal-gradient)" : "transparent",
          backgroundSize: "400% 100%",
          animation: lang === "en" ? "goldSweep 9s ease-in-out infinite" : "none",
          color: lang === "en" ? "#1a2c0a" : "rgba(255,255,255,0.75)",
          cursor: "pointer",
        }}
      >
        EN
      </button>
    </div>
  );
}
