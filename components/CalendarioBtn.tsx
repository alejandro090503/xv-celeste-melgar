"use client";

const GCAL_URL = (() => {
  const base = "https://calendar.google.com/calendar/render?action=TEMPLATE";
  const title = encodeURIComponent("XV Años de Celeste");
  const details = encodeURIComponent(
    "Celebración de XV Años de Celeste Melgar · Oakland, CA"
  );
  const location = encodeURIComponent("Oakland, California, USA");
  const dates = "20261017T230000Z/20261018T060000Z";
  return `${base}&text=${title}&dates=${dates}&details=${details}&location=${location}`;
})();

export default function CalendarioBtn() {
  return (
    <section style={{ padding: "40px 26px 64px", textAlign: "center" }}>
      <p style={{
        fontFamily: "var(--font-cormorant), serif",
        fontStyle: "italic", fontSize: 14, letterSpacing: 5,
        textTransform: "uppercase", color: "#e9c77b",
        marginBottom: 8, opacity: 0.85, fontWeight: 600,
      }}>
        No lo olvides
      </p>
      <h2 style={{
        fontFamily: "var(--font-great-vibes), cursive",
        fontSize: 48, lineHeight: 1.25, marginBottom: 16, padding: "4px 20px 8px",
        background: "var(--gold-metal-gradient)", backgroundSize: "300% 100%", animation: "goldSweep 6s linear infinite",
        WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text",
        display: "inline-block",
      }}>
        Guárdalo
      </h2>
      <p style={{
        fontFamily: "var(--font-cormorant), serif",
        fontStyle: "italic", fontWeight: 600, fontSize: 17,
        color: "var(--text-soft)", marginBottom: 20,
      }}>
        Agrega el evento a tu calendario
      </p>
      <a href={GCAL_URL} target="_blank" rel="noopener noreferrer"
        style={{
          display: "inline-block", padding: "14px 32px",
          background: "var(--gold-metal-gradient)", backgroundSize: "300% 100%", animation: "goldSweep 6s linear infinite",
          color: "#1a2c0a", borderRadius: 30,
          fontFamily: "var(--font-lato), sans-serif",
          fontSize: 14, fontWeight: 800, textTransform: "uppercase",
          letterSpacing: 3, textDecoration: "none",
          boxShadow: "0 4px 16px rgba(0,0,0,0.3)",
        }}>
        Añadir a Google Calendar
      </a>
    </section>
  );
}
