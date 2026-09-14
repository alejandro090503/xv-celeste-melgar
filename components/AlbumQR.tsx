"use client";
import { useLang } from "@/lib/i18n";

const ALBUM_URL = "https://photos.app.goo.gl/PENDIENTE";
const QR_IMG = `https://api.qrserver.com/v1/create-qr-code/?size=220x220&color=1a2c0a&bgcolor=FFFFFF&data=${encodeURIComponent(ALBUM_URL)}`;

export default function AlbumQR() {
  const { t } = useLang();
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
        {t.album.eyebrow}
      </p>
      <h2 style={{
        fontFamily: "var(--font-great-vibes), cursive",
        fontSize: 50,
        lineHeight: 1.25,
        marginBottom: 18,
        padding: "6px 24px 10px",
        display: "inline-block",
        background: "var(--gold-metal-gradient)", backgroundSize: "400% 100%", animation: "goldSweep 11s ease-in-out infinite",
        WebkitBackgroundClip: "text",
        WebkitTextFillColor: "transparent",
        backgroundClip: "text",
      }}>
        {t.album.title}
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
        {t.album.body}
      </p>
      <div style={{
        position: "relative",
        display: "inline-block",
        padding: 14,
        background: "#FFFFFF",
        borderRadius: 18,
        boxShadow: "0 12px 32px rgba(0,0,0,0.35)",
      }}>
        <span className="gold-border" aria-hidden="true" style={{ padding: 2, borderRadius: 18 }} />
        <img src={QR_IMG} alt={t.album.alt} width={180} height={180} loading="lazy" style={{ display: "block" }} />
      </div>
    </section>
  );
}
