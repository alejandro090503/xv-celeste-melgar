"use client";

const COUPLE_IMG = "https://bsjoelxktbvlavfoozhk.supabase.co/storage/v1/object/public/fotos-clientes/img/xv-julia-sofia/dresscode-pareja.png";

export default function DressCode() {
  return (
    <section style={{ padding: "64px 26px", textAlign: "center" }}>
      <p style={{
        fontFamily: "var(--font-cormorant), serif",
        fontStyle: "italic",
        fontWeight: 600,
        fontSize: 14,
        letterSpacing: 6,
        textTransform: "uppercase",
        color: "#d4a24c",
        marginBottom: 4,
        opacity: 0.9,
      }}>
        Código de Vestimenta
      </p>
      <h2 style={{
        fontFamily: "var(--font-great-vibes), cursive",
        fontSize: 52,
        lineHeight: 1.1,
        marginBottom: 18,
        background: "linear-gradient(135deg,#996515 0%,#d4a24c 50%,#996515 100%)",
        WebkitBackgroundClip: "text",
        WebkitTextFillColor: "transparent",
        backgroundClip: "text",
      }}>
        Dress Code
      </h2>

      <div style={{ display: "flex", justifyContent: "center", marginBottom: 16 }}>
        <img
          src={COUPLE_IMG}
          alt="Pareja en código de vestimenta etiqueta — esmoquin y vestido largo"
          loading="lazy"
          style={{
            width: 210,
            height: "auto",
            filter: "drop-shadow(0 12px 26px rgba(0,0,0,0.45))",
          }}
        />
      </div>

      <p style={{
        fontFamily: "var(--font-cormorant), serif",
        fontStyle: "italic",
        fontWeight: 700,
        fontSize: 22,
        letterSpacing: 8,
        textTransform: "uppercase",
        color: "#d4a24c",
        marginBottom: 36,
      }}>
        Formal
      </p>

      {/* Notas — color a evitar */}
      <div style={{
        maxWidth: 360,
        margin: "0 auto",
        padding: "30px 24px",
        background: "rgba(26,44,10,0.45)",
        border: "1px solid rgba(212,162,76,0.30)",
        borderRadius: 22,
      }}>
        <p style={{
          fontFamily: "var(--font-cormorant), serif",
          fontWeight: 500,
          fontSize: 16,
          color: "var(--text)",
          letterSpacing: 0.3,
          lineHeight: 1.6,
          marginBottom: 26,
        }}>
          No sudaderas con capucha.
        </p>

        {/* Evitar verde esmeralda / cualquier tono de verde */}
        <div style={{
          position: "relative",
          padding: "16px 18px",
          border: "1px solid rgba(212,162,76,0.25)",
          borderRadius: 14,
          background: "rgba(26,44,10,0.4)",
        }}>
          <div style={{
            position: "absolute", top: -11, left: "50%",
            transform: "translateX(-50%)",
            width: 22, height: 22, borderRadius: "50%",
            background: "#1a2c0a",
            border: "1.5px solid rgba(212,162,76,0.5)",
            fontSize: 11, lineHeight: "20px", textAlign: "center",
            color: "#d4a24c", fontWeight: 700,
          }}>
            ✕
          </div>
          <p style={{
            fontFamily: "var(--font-cormorant), serif",
            fontSize: 16, fontWeight: 500,
            color: "var(--text)", letterSpacing: 0.3, lineHeight: 1.6,
            marginBottom: 10,
          }}>
            No usar verde esmeralda ni ningún tono de verde.
          </p>
          <div style={{ display: "flex", justifyContent: "center" }}>
            <div style={{
              width: 28, height: 28, borderRadius: "50%",
              background: "radial-gradient(circle at 32% 28%, #3a5c17 0%, #263e0f 55%, #14200a 100%)",
              border: "1px solid rgba(212,162,76,0.4)",
              boxShadow: "0 2px 8px rgba(0,0,0,0.45), inset 0 -2px 4px rgba(0,0,0,0.4), inset 0 2px 4px rgba(255,255,255,0.3)",
            }} />
          </div>
        </div>
      </div>
    </section>
  );
}
