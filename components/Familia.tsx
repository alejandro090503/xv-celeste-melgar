"use client";

function Block({ label, names, icon, rounded }: { label: string; names: React.ReactNode; icon: React.ReactNode; rounded: string }) {
  return (
    <div style={{
      position: "relative",
      width: "100%",
      textAlign: "center",
      padding: "30px 26px",
      background: "rgba(26,44,10,0.45)",
      backdropFilter: "blur(10px)",
      WebkitBackdropFilter: "blur(10px)",
      border: "1px solid rgba(212,162,76,0.22)",
      borderRadius: rounded,
    }}>
      <span className="gold-border gold-border--soft" aria-hidden="true" />
      <div style={{
        width: 52, height: 52, borderRadius: "50%",
        margin: "0 auto 14px",
        background: "rgba(212,162,76,0.12)",
        border: "1.5px solid rgba(212,162,76,0.4)",
        display: "flex", alignItems: "center", justifyContent: "center",
      }}>
        {icon}
      </div>
      <p style={{
        fontFamily: "var(--font-cormorant), serif",
        fontStyle: "italic",
        fontWeight: 700,
        fontSize: 15,
        letterSpacing: 6,
        textTransform: "uppercase",
        color: "#e9c77b",
        marginBottom: 14,
      }}>
        {label}
      </p>
      <div style={{
        fontFamily: "var(--font-cormorant), serif",
        fontWeight: 600,
        fontSize: 21,
        color: "var(--text)",
        lineHeight: 1.85,
      }}>
        {names}
      </div>
    </div>
  );
}

const Amp = () => (
  <span style={{ display: "block", fontStyle: "italic", fontSize: 30, color: "#996515", lineHeight: 1.1, margin: "4px 0" }}>&amp;</span>
);

export default function Familia() {
  return (
    <section style={{ padding: "64px 26px" }}>
      <p style={{
        fontFamily: "var(--font-cormorant), serif",
        fontStyle: "italic",
        fontWeight: 600,
        fontSize: 14,
        letterSpacing: 5,
        textTransform: "uppercase",
        color: "#e9c77b",
        textAlign: "center",
        marginBottom: 8,
        opacity: 0.9,
      }}>
        Con la bendición de
      </p>
      <h2 style={{
        fontFamily: "var(--font-great-vibes), cursive",
        fontSize: 50,
        textAlign: "center",
        lineHeight: 1.25,
        marginBottom: 30,
        padding: "6px 24px 10px",
        background: "var(--gold-metal-gradient)", backgroundSize: "400% 100%", animation: "goldSweep 12.8s ease-in-out infinite 1.7s",
        WebkitBackgroundClip: "text",
        WebkitTextFillColor: "transparent",
        backgroundClip: "text",
        display: "block",
      }}>
        Mi Familia
      </h2>

      <div style={{ display: "flex", flexDirection: "column", gap: 14, alignItems: "stretch" }}>
        <Block
          rounded="24px"
          label="Mis Padres"
          icon={
            <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="#e0b866" strokeWidth="1.55" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
          }
          names={<>William Melgar<Amp />Leticia Melgar</>}
        />
        <Block
          rounded="24px"
          label="Mis Padrinos"
          icon={
            <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="#e0b866" strokeWidth="1.55" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 2 L13.7 8.4 L20 9 L15 13.5 L16.5 20 L12 16.5 L7.5 20 L9 13.5 L4 9 L10.3 8.4 Z" />
            </svg>
          }
          names={<>Por confirmar</>}
        />
      </div>
    </section>
  );
}
