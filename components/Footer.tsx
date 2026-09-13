"use client";

export default function Footer() {
  return (
    <footer style={{ padding: "40px 20px 50px", textAlign: "center" }}>
      <div style={{
        fontFamily: "var(--font-cormorant), serif",
        fontStyle: "italic", fontWeight: 500, fontSize: 15,
        letterSpacing: 4, textTransform: "uppercase",
        color: "#d4a24c", marginBottom: 14, opacity: 0.85,
      }}>
        XVII · Octubre · MMXXVI
      </div>
      <div style={{ width: 48, height: 1, margin: "0 auto 16px",
        background: "linear-gradient(90deg,transparent,#996515,transparent)", opacity: 0.4 }} />
      <p style={{
        fontFamily: "var(--font-cormorant), serif",
        fontStyle: "italic", fontSize: 14, color: "var(--text-soft)", letterSpacing: 1,
      }}>
        Con mucho cariño por{" "}
        <a href="https://www.instagram.com/elysium.invitaciones" target="_blank" rel="noopener noreferrer"
          style={{ color: "#d4a24c", textDecoration: "none" }}>
          @elysium.invitaciones
        </a>
      </p>
    </footer>
  );
}
