"use client";
import { useLang } from "@/lib/i18n";

interface VenueProps {
  type: string;
  name: string;
  address: string;
  time: string;
  mapsUrl: string;
  lat: number;
  lng: number;
}

function VenueCard({ type, name, address, time, mapsUrl, lat, lng }: VenueProps) {
  const { lang, t } = useLang();
  return (
    <div style={{
      position: "relative",
      overflow: "hidden",
      background: "rgba(26,44,10,0.5)",
      backdropFilter: "blur(14px)",
      WebkitBackdropFilter: "blur(14px)",
      borderRadius: 28,
      border: "1px solid rgba(212,162,76,0.25)",
      boxShadow: "0 14px 40px rgba(0,0,0,0.28)",
    }}>
      {/* Haz dorado animado que recorre el borde */}
      <div className="venue-beam" aria-hidden="true" />

      <div style={{ padding: "34px 28px 0", textAlign: "center" }}>
        <div style={{
          width: 56, height: 56, borderRadius: "50%",
          margin: "0 auto 16px",
          background: "rgba(212,162,76,0.12)",
          border: "1.5px solid rgba(212,162,76,0.4)",
          display: "flex", alignItems: "center", justifyContent: "center",
        }}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="#e0b866">
            <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
          </svg>
        </div>

        <div style={{
          fontFamily: "var(--font-great-vibes), cursive",
          fontSize: "clamp(28px, 8vw, 42px)", color: "#e9c77b", lineHeight: 1.2, marginBottom: 10,
          padding: "0 6px",
        }}>
          {type}
        </div>

        <div style={{
          fontFamily: "var(--font-cormorant), serif",
          fontWeight: 700, fontSize: 22, color: "var(--text)",
          letterSpacing: 0.5, lineHeight: 1.3, marginBottom: 8,
        }}>
          {name}
        </div>

        <div style={{
          fontFamily: "var(--font-lato), sans-serif",
          fontWeight: 500, fontSize: 16, color: "var(--text-soft)",
          letterSpacing: 0.3, lineHeight: 1.55, marginBottom: 8,
        }}>
          {address}
        </div>

        <div style={{
          fontFamily: "var(--font-lato), sans-serif",
          fontWeight: 700, fontSize: 20, color: "#e9c77b",
          letterSpacing: 3, marginBottom: 4,
        }}>
          {time}
        </div>

        <div style={{ width: 48, height: 1, margin: "18px auto 22px",
          background: "var(--gold-metal-gradient)", backgroundSize: "400% 100%", animation: "goldSweep 12.2s ease-in-out infinite", opacity: 0.4 }} />
      </div>

      {mapsUrl && (
        <div style={{ textAlign: "center", padding: "0 22px 26px" }}>
          <a href={mapsUrl} target="_blank" rel="noopener noreferrer"
            style={{
              display: "inline-block", marginTop: 8, padding: "14px 32px",
              background: "var(--gold-metal-gradient)", backgroundSize: "400% 100%", animation: "goldSweep 12.2s ease-in-out infinite",
              color: "#1a2c0a", borderRadius: 30,
              fontFamily: "var(--font-lato), sans-serif",
              fontSize: 14, fontWeight: 800, textTransform: "uppercase",
              letterSpacing: 3, textDecoration: "none",
              boxShadow: "0 4px 16px rgba(0,0,0,0.3)",
            }}>
            {t.ubicacion.comoLlegar}
          </a>
        </div>
      )}

      {mapsUrl ? (
        <iframe
          style={{ width: "100%", height: 215, border: 0, display: "block",
            borderRadius: "0 0 28px 28px", opacity: 0.92 }}
          src={`https://maps.google.com/maps?q=${lat},${lng}&output=embed&hl=${lang}&z=16`}
          allowFullScreen loading="lazy" referrerPolicy="no-referrer-when-downgrade"
          title={t.ubicacion.tituloIframe(type)}
        />
      ) : (
        <div style={{ height: 26 }} />
      )}
    </div>
  );
}

export default function Ubicacion() {
  const { t } = useLang();
  return (
    <section style={{ padding: "64px 26px" }}>
      <p style={{
        fontFamily: "var(--font-cormorant), serif",
        fontStyle: "italic", fontSize: 14, letterSpacing: 5,
        textTransform: "uppercase", color: "#e9c77b",
        textAlign: "center", marginBottom: 8, opacity: 0.9, fontWeight: 600,
      }}>
        {t.ubicacion.eyebrow}
      </p>
      <h2 style={{
        fontFamily: "var(--font-great-vibes), cursive",
        fontSize: 50, textAlign: "center", lineHeight: 1.25, marginBottom: 30, padding: "6px 24px 10px", display: "inline-block", width: "100%",
        background: "var(--gold-metal-gradient)", backgroundSize: "400% 100%", animation: "goldSweep 12.2s ease-in-out infinite",
        WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text",
      }}>
        {t.ubicacion.title}
      </h2>

      <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
        <VenueCard
          type={t.ubicacion.servicio}
          name="1415 Broadway"
          address="1415 Broadway, Alameda, CA 94501"
          time="4:00 PM"
          mapsUrl="https://www.google.com/maps/search/?api=1&query=1415+Broadway+Alameda+CA+94501"
          lat={37.7681}
          lng={-122.2469}
        />
        <VenueCard
          type={t.ubicacion.recepcion}
          name="1415 Broadway"
          address="1415 Broadway, Alameda, CA 94501"
          time="6:00 PM"
          mapsUrl="https://www.google.com/maps/search/?api=1&query=1415+Broadway+Alameda+CA+94501"
          lat={37.7681}
          lng={-122.2469}
        />
      </div>

      {/* Aviso de estacionamiento */}
      <div style={{
        position: "relative", marginTop: 28, padding: "26px 22px 24px",
        border: "1px solid rgba(212,162,76,0.28)",
        borderRadius: 22, textAlign: "center",
        background: "rgba(26,44,10,0.55)",
        backdropFilter: "blur(12px)", WebkitBackdropFilter: "blur(12px)",
        boxShadow: "0 12px 34px rgba(0,0,0,0.28)",
      }}>
        <span className="gold-border gold-border--soft" aria-hidden="true" />
        <div className="gold-glow" style={{
          width: 58, height: 58, borderRadius: "50%", margin: "0 auto 14px",
          background: "rgba(212,162,76,0.12)", border: "1.5px solid rgba(212,162,76,0.45)",
          display: "flex", alignItems: "center", justifyContent: "center",
        }}>
          <svg width="26" height="26" viewBox="0 0 24 24" fill="#e0b866" aria-hidden="true">
            <path d="M13 3H6v18h4v-6h3c3.31 0 6-2.69 6-6s-2.69-6-6-6zm.2 8H10V7h3.2c1.1 0 2 .9 2 2s-.9 2-2 2z" />
          </svg>
        </div>
        <p style={{
          fontFamily: "var(--font-cormorant), serif", fontStyle: "italic", fontWeight: 700,
          fontSize: 14, letterSpacing: 4, textTransform: "uppercase", color: "#e9c77b", marginBottom: 8,
        }}>
          {t.ubicacion.parkingEyebrow}
        </p>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 10, margin: "0 0 12px" }} aria-hidden="true">
          <span style={{ width: 34, height: 1, background: "linear-gradient(90deg, transparent, rgba(224,184,102,0.7))" }} />
          <svg width="20" height="20" viewBox="0 0 24 24" fill="#e0b866">
            <path d="M18.92 6.01C18.72 5.42 18.16 5 17.5 5h-11c-.66 0-1.21.42-1.42 1.01L3 12v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-5.99zM6.5 16c-.83 0-1.5-.67-1.5-1.5S5.67 13 6.5 13s1.5.67 1.5 1.5S7.33 16 6.5 16zm11 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zM5 11l1.5-4.5h11L19 11H5z" />
          </svg>
          <span style={{ width: 34, height: 1, background: "linear-gradient(90deg, rgba(224,184,102,0.7), transparent)" }} />
        </div>
        <p style={{
          fontFamily: "var(--font-cormorant), serif", fontWeight: 700,
          fontSize: 21, lineHeight: 1.4, color: "#ffffff",
        }}>
          {t.ubicacion.parkingText}
        </p>
      </div>
    </section>
  );
}
