"use client";

export default function NoNinos() {
  return (
    <section style={{ padding: "40px 26px", textAlign: "center" }}>
      <div style={{
        maxWidth: 340,
        margin: "0 auto",
        padding: "24px 22px",
        background: "rgba(26,44,10,0.45)",
        border: "1px solid rgba(212,162,76,0.30)",
        borderRadius: 20,
      }}>
        <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="#d4a24c" strokeWidth="1.6"
          style={{ margin: "0 auto 10px" }}>
          <circle cx="12" cy="8" r="4" />
          <path d="M4 21v-1a8 8 0 0 1 16 0v1" />
        </svg>
        <p style={{
          fontFamily: "var(--font-cormorant), serif",
          fontStyle: "italic",
          fontWeight: 600,
          fontSize: 18,
          color: "var(--text)",
          lineHeight: 1.6,
        }}>
          Con cariño te pedimos que este sea un evento solo para adultos.
        </p>
      </div>
    </section>
  );
}
