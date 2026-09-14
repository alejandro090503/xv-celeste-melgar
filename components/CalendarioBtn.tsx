"use client";
import { useLang } from "@/lib/i18n";

export default function CalendarioBtn() {
  const { t } = useLang();

  const gcalUrl = (() => {
    const base = "https://calendar.google.com/calendar/render?action=TEMPLATE";
    const title = encodeURIComponent(t.calendario.gcalTitle);
    const details = encodeURIComponent(t.calendario.gcalDetails);
    const location = encodeURIComponent("Oakland, California, USA");
    const dates = "20261017T230000Z/20261018T060000Z";
    return `${base}&text=${title}&dates=${dates}&details=${details}&location=${location}`;
  })();

  return (
    <section style={{ padding: "40px 26px 64px", textAlign: "center" }}>
      <p style={{
        fontFamily: "var(--font-cormorant), serif",
        fontStyle: "italic", fontSize: 14, letterSpacing: 5,
        textTransform: "uppercase", color: "#e9c77b",
        marginBottom: 8, opacity: 0.85, fontWeight: 600,
      }}>
        {t.calendario.eyebrow}
      </p>
      <h2 style={{
        fontFamily: "var(--font-great-vibes), cursive",
        fontSize: 48, lineHeight: 1.25, marginBottom: 16, padding: "4px 20px 8px",
        background: "var(--gold-metal-gradient)", backgroundSize: "400% 100%", animation: "goldSweep 12s ease-in-out infinite",
        WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text",
        display: "inline-block",
      }}>
        {t.calendario.title}
      </h2>
      <p style={{
        fontFamily: "var(--font-cormorant), serif",
        fontStyle: "italic", fontWeight: 600, fontSize: 17,
        color: "var(--text-soft)", marginBottom: 20,
      }}>
        {t.calendario.subtitle}
      </p>
      <a href={gcalUrl} target="_blank" rel="noopener noreferrer"
        style={{
          display: "inline-block", padding: "14px 32px",
          background: "var(--gold-metal-gradient)", backgroundSize: "400% 100%", animation: "goldSweep 12s ease-in-out infinite",
          color: "#1a2c0a", borderRadius: 30,
          fontFamily: "var(--font-lato), sans-serif",
          fontSize: 14, fontWeight: 800, textTransform: "uppercase",
          letterSpacing: 3, textDecoration: "none",
          boxShadow: "0 4px 16px rgba(0,0,0,0.3)",
        }}>
        {t.calendario.cta}
      </a>
    </section>
  );
}
