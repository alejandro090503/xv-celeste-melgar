"use client";

const ALBUM_URL = "https://photos.app.goo.gl/PENDIENTE";
const QR_IMG = `https://api.qrserver.com/v1/create-qr-code/?size=220x220&color=1a2c0a&bgcolor=FFFFFF&data=${encodeURIComponent(ALBUM_URL)}`;

export default function AlbumQR() {
  return (
    <section style={{ padding: "64px 26px", textAlign: "center" }}>
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
        Comparte tus fotos
      </p>
      <h2 style={{
        fontFamily: "var(--font-great-vibes), cursive",
        fontSize: 50,
        lineHeight: 1.1,
        marginBottom: 18,
        background: "var(--gold-metal-gradient)", backgroundSize: "300% 100%", animation: "goldSweep 6s linear infinite",
        WebkitBackgroundClip: "text",
        WebkitTextFillColor: "transparent",
        backgroundClip: "text",
      }}>
        Álbum Compartido
      </h2>
      <p style={{
        fontFamily: "var(--font-cormorant), serif",
        fontStyle: "italic",
        fontWeight: 600,
        fontSize: 17,
        color: "var(--text-soft)",
        lineHeight: 1.65,
        maxWidth: 340,
        margin: "0 auto 26px",
      }}>
        Escanea el código y súbenos las fotos que tomes durante la celebración.
      </p>
      <div style={{
        display: "inline-block",
        padding: 14,
        background: "#FFFFFF",
        borderRadius: 18,
        boxShadow: "0 12px 32px rgba(0,0,0,0.35)",
      }}>
        <img src={QR_IMG} alt="Código QR del álbum compartido" width={180} height={180} loading="lazy" style={{ display: "block" }} />
      </div>
    </section>
  );
}
