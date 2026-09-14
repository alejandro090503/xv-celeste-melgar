"use client";
import { useState, useEffect } from "react";
import { useLang, pasesLabel } from "@/lib/i18n";

const PANEL_API = "https://panel-invitados.vercel.app/api/confirmar";
const RSVP_URL = "https://xv-celeste-melgar.vercel.app";
const DEADLINE = new Date(2026, 9, 3, 23, 59, 59, 999);

function Corner({ pos }: { pos: "tl" | "tr" | "bl" | "br" }) {
  const t = {
    tl: { top: 0, left: 0, transform: "none" },
    tr: { top: 0, right: 0, transform: "scaleX(-1)" },
    bl: { bottom: 0, left: 0, transform: "scaleY(-1)" },
    br: { bottom: 0, right: 0, transform: "scale(-1,-1)" },
  }[pos] as React.CSSProperties;
  return (
    <svg viewBox="0 0 52 52" fill="none" aria-hidden="true"
      style={{ position: "absolute", width: 48, height: 48, pointerEvents: "none", ...t }}>
      <path d="M2 50 L2 2 L50 2" stroke="#996515" strokeWidth=".9" opacity=".7" />
      <circle cx="2" cy="2" r="2.5" fill="#996515" opacity=".6" />
    </svg>
  );
}

export default function RSVPSection() {
  const { lang, t } = useLang();
  const frozen = Date.now() > DEADLINE.getTime();
  const [nombrePara, setNombrePara] = useState("");
  const [pasesAsignados, setPasesAsignados] = useState(1);
  const [pasesLoaded, setPasesLoaded] = useState(false);
  const [choice, setChoice] = useState<"yes" | "no" | null>(null);
  const [nombres, setNombres] = useState<string[]>([""]);
  type FeedbackKind =
    | "errNoChoice"
    | "errNoNames"
    | "errConnection"
    | "alreadyYes"
    | "alreadyNo"
    | "successYes"
    | "successNo"
    | null;
  const [feedbackKind, setFeedbackKind] = useState<FeedbackKind>(null);
  const feedback = feedbackKind ? t.rsvp[feedbackKind] : "";
  const [feedbackColor, setFeedbackColor] = useState<string>("#263e0f");
  const [loading, setLoading] = useState(false);
  const [btnState, setBtnState] = useState<"confirm" | "update" | "sending">("confirm");
  const btnLabel = frozen
    ? t.rsvp.frozenBtn
    : btnState === "sending"
    ? t.rsvp.sendingBtn
    : btnState === "update"
    ? t.rsvp.updateBtn
    : t.rsvp.confirmBtn;

  // Lee parámetros del URL + guard silencioso (autoritativo desde el panel)
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const para = (params.get("para") || "").trim();
    const rawP = parseInt(params.get("pases") || "1", 10);
    const urlP = (isNaN(rawP) || rawP < 1 || rawP > 20) ? 1 : rawP;
    setNombrePara(para);
    setPasesAsignados(urlP);

    if (!para) {
      // Sin nombre no podemos consultar al panel — usamos URL como fallback
      setPasesLoaded(true);
      return;
    }

    fetch(`${PANEL_API}?nombre=${encodeURIComponent(para)}&url_boda=${encodeURIComponent(RSVP_URL)}`)
      .then((r) => r.json())
      .then((resp) => {
        const d = resp.invitado;
        let pasesReal = urlP;
        if (d && typeof d.pases === "number" && d.pases > 0 && d.pases <= 20) {
          pasesReal = d.pases;
          setPasesAsignados(pasesReal);
        }
        if (d && (d.estado === "confirmado" || d.estado === "declino")) {
          const c = d.estado === "confirmado" ? "yes" : "no";
          if (d.nombres_confirmados?.length) {
            setNombres(Array(pasesReal).fill("").map((_, i) => d.nombres_confirmados[i] || ""));
          } else {
            setNombres(Array(pasesReal).fill(""));
          }
          setChoice(c);
          setBtnState("update");
          setFeedbackKind(c === "yes" ? "alreadyYes" : "alreadyNo");
        } else {
          setNombres(Array(pasesReal).fill(""));
        }
        setPasesLoaded(true);
      })
      .catch(() => setPasesLoaded(true));
  }, []);

  function handleSelect(c: "yes" | "no") {
    setChoice(c);
    setFeedbackKind(null);
  }

  async function handleConfirm() {
    if (frozen || loading) return;
    if (!choice) {
      setFeedbackColor("#a04a2a");
      setFeedbackKind("errNoChoice");
      return;
    }
    const nombresFilled = choice === "yes" ? nombres.filter((n) => n.trim()) : [];
    if (choice === "yes" && nombresFilled.length === 0) {
      setFeedbackColor("#a04a2a");
      setFeedbackKind("errNoNames");
      return;
    }
    setLoading(true);
    setBtnState("sending");
    setFeedbackKind(null);
    try {
      await fetch(PANEL_API, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nombre: nombrePara || "Invitado",
          url_boda: RSVP_URL,
          estado: choice === "yes" ? "confirmado" : "declino",
          pases_confirmados: choice === "yes" ? nombresFilled.length : 0,
          nombres_confirmados: choice === "yes" ? nombresFilled : [],
        }),
      });
      setBtnState("update");
      setFeedbackColor(choice === "yes" ? "#263e0f" : "#7d5720");
      setFeedbackKind(choice === "yes" ? "successYes" : "successNo");
    } catch {
      setFeedbackColor("#a04a2a");
      setFeedbackKind("errConnection");
      setBtnState("confirm");
    } finally {
      setLoading(false);
    }
  }

  const togglePillBase: React.CSSProperties = {
    flex: 1,
    padding: "13px 8px",
    border: "1.5px solid rgba(194,143,69,0.4)",
    background: "rgba(255,255,255,0.5)",
    cursor: frozen ? "not-allowed" : "pointer",
    fontFamily: "var(--font-cormorant), serif",
    fontStyle: "italic",
    fontSize: 17,
    fontWeight: 600,
    color: "#3a3a3a",
    borderRadius: 10,
    transition: "all .25s",
    opacity: frozen ? 0.45 : 1,
  };

  return (
    <section style={{ padding: "64px 24px" }}>
      <div style={{
        position: "relative",
        maxWidth: 520,
        margin: "0 auto",
        background: "rgba(246,242,234,0.96)",
        backdropFilter: "blur(18px)",
        WebkitBackdropFilter: "blur(18px)",
        border: "1px solid rgba(194,143,69,0.45)",
        padding: "52px 28px 44px",
        boxShadow: "0 24px 64px rgba(0,0,0,0.28)",
      }}>
        <span className="gold-border gold-border--soft" aria-hidden="true" />
        <div style={{ position: "absolute", inset: 10, border: "1px solid rgba(194,143,69,0.22)", pointerEvents: "none" }} />
        <Corner pos="tl" /><Corner pos="tr" /><Corner pos="bl" /><Corner pos="br" />

        <div style={{ textAlign: "center", position: "relative" }}>
          {/* Ornamento superior */}
          <svg viewBox="0 0 320 56" fill="none" aria-hidden="true" style={{ display: "block", margin: "0 auto 22px", width: "min(260px,70vw)", height: "auto" }}>
            <g stroke="#996515" strokeWidth=".9" opacity=".85" fill="none">
              <path d="M18 28 Q50 10 82 28 Q106 42 130 28" />
              <path d="M190 28 Q214 42 238 28 Q270 10 302 28" />
              <circle cx="160" cy="28" r="5.5" />
              <circle cx="160" cy="28" r="2" fill="#996515" stroke="none" />
              <path d="M154 20 Q160 13 166 20" opacity=".55" />
              <path d="M154 36 Q160 43 166 36" opacity=".55" />
            </g>
          </svg>

          <p style={{
            fontFamily: "var(--font-cormorant), serif",
            fontStyle: "italic",
            fontWeight: 600,
            fontSize: 13,
            letterSpacing: 5,
            textTransform: "uppercase",
            color: "#7d5720",
            marginBottom: 6,
          }}>
            {t.rsvp.eyebrow}
          </p>

          <h2 style={{
            fontFamily: "var(--font-great-vibes), cursive",
            fontSize: "clamp(40px, 11vw, 56px)",
            lineHeight: 1.1,
            color: "#263e0f",
            marginBottom: 18,
          }}>
            {t.rsvp.presenceBefore}<span style={{ color: "#996515" }}>{t.rsvp.presenceHighlight}</span>{t.rsvp.presenceAfter}
          </h2>

          <p style={{
            fontFamily: "var(--font-cormorant), serif",
            fontWeight: 600,
            fontSize: 18,
            color: "#3a3a3a",
            lineHeight: 1.8,
            maxWidth: 380,
            margin: "0 auto 28px",
          }}>
            {t.rsvp.bodyBefore}<strong style={{ color: "#263e0f" }}>{t.rsvp.bodyStrong}</strong>{t.rsvp.bodyAfter}
          </p>

          {/* Divisor con corazón */}
          <div style={{ display: "flex", alignItems: "center", gap: 14, maxWidth: 300, margin: "0 auto 24px" }}>
            <div style={{ flex: 1, height: 1, background: "linear-gradient(to right,transparent,rgba(194,143,69,0.5),transparent)" }} />
            <svg width="16" height="16" viewBox="0 0 24 24" fill="#996515" style={{ flexShrink: 0, opacity: 0.85 }}>
              <path d="M12 21.593c-5.63-5.539-11-10.297-11-14.402 0-3.791 3.068-5.191 5.281-5.191 1.312 0 4.151.501 5.719 4.457 1.59-3.968 4.464-4.447 5.726-4.447 2.54 0 5.274 1.621 5.274 5.181 0 4.069-5.136 8.625-11 14.402z" />
            </svg>
            <div style={{ flex: 1, height: 1, background: "linear-gradient(to right,transparent,rgba(194,143,69,0.5),transparent)" }} />
          </div>

          {/* Personalización */}
          {nombrePara && (
            <p style={{
              fontFamily: "var(--font-cormorant), serif",
              fontStyle: "italic",
              fontSize: 17,
              color: "#7d5720",
              marginBottom: 18,
              lineHeight: 1.5,
            }}>
              {t.rsvp.invitationFor(nombrePara)}
            </p>
          )}

          {/* Display pases */}
          {nombrePara && (
            <div style={{
              maxWidth: 340,
              margin: "0 auto 22px",
              padding: "14px 26px",
              background: "rgba(194,143,69,0.10)",
              border: "1px solid rgba(194,143,69,0.30)",
              borderRadius: 12,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 14,
            }}>
              <span style={{
                fontFamily: "var(--font-lato), sans-serif",
                fontSize: 11,
                letterSpacing: 3,
                textTransform: "uppercase",
                color: "#7d5720",
                fontWeight: 600,
              }}>{pasesLoaded ? pasesLabel(pasesAsignados, lang) : t.rsvp.pasesLabel}</span>
              <span style={{
                fontFamily: "var(--font-great-vibes), cursive",
                fontSize: 42,
                color: "#263e0f",
                lineHeight: 1,
              }}>{pasesLoaded ? pasesAsignados : "…"}</span>
            </div>
          )}

          {/* Toggle */}
          <div style={{ display: "flex", gap: 10, maxWidth: 380, margin: "0 auto 18px" }}>
            <button
              type="button"
              disabled={!pasesLoaded || frozen}
              onClick={() => handleSelect("yes")}
              style={{
                ...togglePillBase,
                background: choice === "yes" ? "rgba(28,64,44,0.15)" : "rgba(255,255,255,0.5)",
                borderColor: choice === "yes" ? "#263e0f" : "rgba(194,143,69,0.4)",
                color: choice === "yes" ? "#263e0f" : "#3a3a3a",
              }}
            >
              {t.rsvp.yes}
            </button>
            <button
              type="button"
              disabled={!pasesLoaded || frozen}
              onClick={() => handleSelect("no")}
              style={{
                ...togglePillBase,
                background: choice === "no" ? "rgba(125,87,32,0.12)" : "rgba(255,255,255,0.5)",
                borderColor: choice === "no" ? "#7d5720" : "rgba(194,143,69,0.4)",
                color: choice === "no" ? "#7d5720" : "#3a3a3a",
              }}
            >
              {t.rsvp.no}
            </button>
          </div>

          {/* Name fields */}
          {choice === "yes" && (
            <div style={{ display: "flex", flexDirection: "column", gap: 10, maxWidth: 380, margin: "0 auto 18px" }}>
              {nombres.map((n, i) => (
                <input
                  key={i}
                  type="text"
                  value={n}
                  placeholder={pasesAsignados === 1 ? t.rsvp.namePlaceholderSingle : t.rsvp.namePlaceholderMulti(i + 1)}
                  maxLength={60}
                  autoComplete="off"
                  onChange={(e) => {
                    const copy = [...nombres];
                    copy[i] = e.target.value;
                    setNombres(copy);
                  }}
                  style={{
                    width: "100%",
                    padding: "14px 18px",
                    border: "1.5px solid rgba(194,143,69,0.3)",
                    borderRadius: 10,
                    background: "rgba(255,255,255,0.85)",
                    fontFamily: "var(--font-cormorant), serif",
                    fontSize: 16,
                    color: "#3a3a3a",
                    outline: "none",
                    minHeight: 50,
                    WebkitAppearance: "none",
                  }}
                />
              ))}
            </div>
          )}

          <button
            onClick={handleConfirm}
            disabled={loading || frozen || !pasesLoaded}
            style={{
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              padding: "16px 48px",
              minHeight: 54,
              background: "linear-gradient(135deg, #263e0f, #1a2c0a)",
              color: "#FFFFFF",
              borderRadius: 50,
              border: "1px solid rgba(194,143,69,0.45)",
              cursor: loading || frozen || !pasesLoaded ? "not-allowed" : "pointer",
              fontFamily: "var(--font-lato), sans-serif",
              fontSize: 15,
              fontWeight: 700,
              textTransform: "uppercase",
              letterSpacing: 3,
              boxShadow: "0 8px 26px rgba(28,64,44,0.30)",
              opacity: loading || frozen || !pasesLoaded ? 0.6 : 1,
            }}
          >
            {btnLabel}
          </button>

          {feedback && (
            <p style={{
              fontFamily: "var(--font-cormorant), serif",
              fontStyle: "italic",
              fontSize: 16,
              color: feedbackColor,
              marginTop: 18,
              maxWidth: 380,
              marginLeft: "auto",
              marginRight: "auto",
              lineHeight: 1.5,
            }}>
              {feedback}
            </p>
          )}

          <div style={{
            display: "inline-flex", alignItems: "center", gap: 8,
            marginTop: 26,
            fontFamily: "var(--font-lato), sans-serif",
            fontSize: 11,
            letterSpacing: 3,
            textTransform: "uppercase",
            color: "#7d5720",
            fontWeight: 600,
            width: "100%",
            justifyContent: "center",
          }}>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2zm.5 5v5.25l4.5 2.67-.75 1.23L11 13V7h1.5z" />
            </svg>
            {t.rsvp.deadlineFooter}
          </div>
        </div>
      </div>
    </section>
  );
}
