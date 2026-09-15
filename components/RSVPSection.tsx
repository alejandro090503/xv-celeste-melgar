"use client";
import { useState, useEffect } from "react";
import { useLang, pasesLabel, type Dict } from "@/lib/i18n";

const PANEL_API = "https://panel-invitados.vercel.app/api/confirmar";
const RSVP_URL = "https://xv-celeste-melgar.vercel.app";
const DEADLINE = new Date(2026, 9, 3, 23, 59, 59, 999);

// Mensajes que dependen del idioma: se guardan como función del diccionario
// para que cambien al instante si el invitado cambia ES|EN después.
type Status = { msg: (r: Dict["rsvp"]) => string; err: boolean } | null;

// WhatsApp y Messenger cortan la URL en el primer espacio o "&". El panel manda
// un token base64url en ?i= con "nombre|pases|menores" que llega intacto.
// Se conserva ?para= por compatibilidad.
function leerInvitacion(): string {
  const params = new URLSearchParams(window.location.search);
  const token = params.get("i");
  if (token) {
    try {
      let b64 = token.replace(/-/g, "+").replace(/_/g, "/");
      while (b64.length % 4) b64 += "=";
      const bin = atob(b64);
      const bytes = Uint8Array.from(bin, (c) => c.charCodeAt(0));
      const [nombre] = new TextDecoder().decode(bytes).split("|");
      if (nombre && nombre.trim()) return nombre.trim();
    } catch {
      /* token dañado: se intenta con ?para= */
    }
  }
  return (params.get("para") || "").trim();
}

// Comparación sin acentos ni mayúsculas: quien respondió antes de tener
// nombres asignados pudo escribirlos ligeramente distinto.
const clave = (x: string) =>
  x.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase().replace(/\s+/g, " ").trim();

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
  const [frozen, setFrozen] = useState(() => Date.now() > DEADLINE.getTime());
  const [nombrePara, setNombrePara] = useState("");
  const [linkLeido, setLinkLeido] = useState(false);
  // Nombres que la familia asignó en el panel: una tarjeta por cada uno
  const [asignados, setAsignados] = useState<string[]>([]);
  const [pasesLoaded, setPasesLoaded] = useState(false);
  const [choices, setChoices] = useState<Record<number, "yes" | "no">>({});
  const [status, setStatus] = useState<Status>(null);
  const [loading, setLoading] = useState(false);
  const [yaRespondio, setYaRespondio] = useState(false);
  const [falloEnvio, setFalloEnvio] = useState(false);
  // Bandeja cerrada = se muestra el agradecimiento con el resumen
  const [gracias, setGracias] = useState<{ estado: "confirmado" | "declino"; nombres: string[] } | null>(null);
  const [bloqueado, setBloqueado] = useState(false);

  const cerrado = frozen || bloqueado;
  const sinLink = linkLeido && !nombrePara;
  const sinAsignados = pasesLoaded && !!nombrePara && asignados.length === 0;

  const btnLabel = frozen
    ? t.rsvp.frozenBtn
    : loading
    ? t.rsvp.sendingBtn
    : falloEnvio
    ? t.rsvp.retryBtn
    : yaRespondio
    ? t.rsvp.updateBtn
    : t.rsvp.confirmBtn;

  // Precarga desde el panel (autoritativo). Los controles quedan bloqueados
  // hasta que responde, para no confirmar con datos que aún no conocemos.
  useEffect(() => {
    const para = leerInvitacion();
    setNombrePara(para);
    setLinkLeido(true);

    if (!para) {
      setPasesLoaded(true);
      return;
    }

    fetch(`${PANEL_API}?nombre=${encodeURIComponent(para)}&url_boda=${encodeURIComponent(RSVP_URL)}`)
      .then((r) => r.json())
      .then((resp) => {
        const d = resp?.invitado;
        const lista: string[] = Array.isArray(d?.nombres_asignados)
          ? d.nombres_asignados.filter((x: string) => x && String(x).trim())
          : [];
        setAsignados(lista);
        if (d?.bloqueado) setBloqueado(true);
        if (lista.length && d && (d.estado === "confirmado" || d.estado === "declino")) {
          const conf: string[] = (d.nombres_confirmados || []).map((n: string) => clave(String(n)));
          const previas: Record<number, "yes" | "no"> = {};
          lista.forEach((nm, i) => {
            previas[i] = d.estado === "declino" ? "no" : conf.includes(clave(nm)) ? "yes" : "no";
          });
          setChoices(previas);
          setYaRespondio(true);
          // Ya hay respuesta guardada: la sección arranca cerrada
          setGracias({
            estado: d.estado,
            nombres: d.estado === "confirmado" ? lista.filter((_, i) => previas[i] === "yes") : [],
          });
        }
        setPasesLoaded(true);
      })
      .catch(() => {
        setStatus({ msg: (r) => r.errLoad, err: true });
        setPasesLoaded(true);
      });
  }, []);

  function elegir(idx: number, c: "yes" | "no") {
    if (cerrado) return;
    setChoices((prev) => ({ ...prev, [idx]: c }));
    setStatus(null);
  }

  async function handleConfirm() {
    if (cerrado || loading) return;
    if (!nombrePara) {
      setStatus({ msg: (r) => r.errNoLink, err: true });
      return;
    }
    if (!asignados.length) {
      setStatus({ msg: (r) => r.errNoAssigned, err: true });
      return;
    }
    const faltan = asignados.filter((_, i) => !choices[i]).length;
    if (faltan > 0) {
      setStatus({ msg: (r) => r.errPending(faltan), err: true });
      return;
    }
    const lista = asignados.filter((_, i) => choices[i] === "yes");
    const estado = lista.length > 0 ? "confirmado" : "declino";
    setLoading(true);
    setStatus(null);
    try {
      const res = await fetch(PANEL_API, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nombre: nombrePara,
          url_boda: RSVP_URL,
          estado,
          pases_confirmados: lista.length,
          nombres_confirmados: lista,
        }),
      });
      const d = await res.json().catch(() => null);
      // Solo se da por registrada si el panel la guardó de verdad
      if (res.ok && d?.ok === true) {
        setFalloEnvio(false);
        setYaRespondio(true);
        setGracias({ estado, nombres: lista });
        return;
      }
      setFalloEnvio(true);
      const err = d?.error;
      if (err === "respuestas_cerradas") {
        setBloqueado(true);
        setStatus({ msg: (r) => r.errClosed, err: true });
      } else if (err === "no_match") {
        setStatus({ msg: (r) => r.errNoMatch, err: true });
      } else if (err === "invitacion_borrada") {
        setStatus({ msg: (r) => r.errDeleted, err: true });
      } else {
        setStatus({ msg: (r) => r.errGeneric, err: true });
      }
    } catch {
      setFalloEnvio(true);
      setStatus({ msg: (r) => r.errConnection, err: true });
    } finally {
      setLoading(false);
    }
  }

  // Si la fecha límite pasa con la página abierta, se congela sin recargar
  useEffect(() => {
    if (frozen) return;
    const ms = DEADLINE.getTime() - Date.now();
    if (ms > 2147483647) return;
    const id = setTimeout(() => setFrozen(true), Math.max(0, ms));
    return () => clearTimeout(id);
  }, [frozen]);

  const miniBtn = (activo: boolean, tono: "yes" | "no"): React.CSSProperties => ({
    flex: 1,
    padding: "11px 8px",
    minHeight: 46,
    borderRadius: 10,
    border: `1.5px solid ${activo ? (tono === "yes" ? "#263e0f" : "#7d5720") : "rgba(194,143,69,0.4)"}`,
    background: activo ? (tono === "yes" ? "rgba(28,64,44,0.15)" : "rgba(125,87,32,0.12)") : "rgba(255,255,255,0.6)",
    color: activo ? (tono === "yes" ? "#263e0f" : "#7d5720") : "#3a3a3a",
    fontFamily: "var(--font-cormorant), serif",
    fontStyle: "italic",
    fontSize: 17,
    fontWeight: 700,
    cursor: cerrado ? "not-allowed" : "pointer",
    opacity: cerrado ? 0.45 : 1,
    transition: "all .25s",
  });

  const msgStyle = (color: string): React.CSSProperties => ({
    fontFamily: "var(--font-cormorant), serif",
    fontStyle: "italic",
    fontWeight: 600,
    fontSize: 17,
    color,
    marginTop: 18,
    maxWidth: 380,
    marginLeft: "auto",
    marginRight: "auto",
    lineHeight: 1.55,
  });

  const btnDisabled = loading || cerrado || !pasesLoaded || sinLink || sinAsignados;

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

          {gracias ? (
            /* Bandeja cerrada: agradecimiento + opción de modificar */
            <div style={{ padding: "8px 0 4px" }}>
              <h3 style={{
                fontFamily: "var(--font-great-vibes), cursive",
                fontWeight: 400,
                fontSize: "clamp(38px, 10vw, 48px)",
                color: "#263e0f",
                lineHeight: 1.15,
                marginBottom: 10,
              }}>
                {gracias.estado === "confirmado" ? t.rsvp.thanksYesTitle : t.rsvp.thanksNoTitle}
              </h3>
              <p style={{
                fontFamily: "var(--font-cormorant), serif",
                fontWeight: 600,
                fontSize: 19,
                lineHeight: 1.7,
                color: "#3a3a3a",
                maxWidth: 400,
                margin: "0 auto 24px",
              }}>
                {gracias.estado === "declino"
                  ? t.rsvp.thanksNoSub
                  : gracias.nombres.length === 1
                  ? t.rsvp.thanksYesOne(gracias.nombres[0])
                  : t.rsvp.thanksYesMany(gracias.nombres)}
              </p>
              {!bloqueado && (
                <button
                  type="button"
                  disabled={frozen}
                  onClick={() => { if (!frozen) { setGracias(null); setStatus(null); } }}
                  style={{
                    padding: "14px 32px",
                    minHeight: 50,
                    borderRadius: 50,
                    border: "1.5px solid rgba(153,101,21,0.55)",
                    background: "rgba(255,255,255,0.7)",
                    color: "#263e0f",
                    fontFamily: "var(--font-cormorant), serif",
                    fontWeight: 700,
                    fontSize: 17,
                    cursor: frozen ? "not-allowed" : "pointer",
                    opacity: frozen ? 0.5 : 1,
                  }}
                >
                  {t.rsvp.editBtn}
                </button>
              )}
            </div>
          ) : (
            <>
              {/* Sin link personalizado no hay invitación que registrar */}
              {sinLink && (
                <p style={{ ...msgStyle("#7d5720"), marginTop: 0, marginBottom: 20 }}>
                  {t.rsvp.errNoLink}
                </p>
              )}
              {sinAsignados && !status && (
                <p style={{ ...msgStyle("#7d5720"), marginTop: 0, marginBottom: 20 }}>
                  {t.rsvp.errNoAssigned}
                </p>
              )}

              {/* Display pases */}
              {nombrePara && !sinAsignados && (
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
                  }}>{pasesLoaded ? pasesLabel(asignados.length, lang) : t.rsvp.pasesLabel}</span>
                  <span style={{
                    fontFamily: "var(--font-great-vibes), cursive",
                    fontSize: 42,
                    color: "#263e0f",
                    lineHeight: 1,
                  }}>{pasesLoaded ? asignados.length : "…"}</span>
                </div>
              )}

              {/* Una tarjeta por invitado asignado, con su propio Asistiré / No asistiré */}
              {asignados.length > 0 && (
                <div style={{ display: "flex", flexDirection: "column", gap: 12, maxWidth: 380, margin: "0 auto 20px" }}>
                  {asignados.map((nm, i) => (
                    <div key={i} style={{
                      padding: "14px 14px 12px",
                      borderRadius: 12,
                      background: choices[i] === "yes"
                        ? "rgba(28,64,44,0.07)"
                        : choices[i] === "no"
                        ? "rgba(125,87,32,0.06)"
                        : "rgba(255,255,255,0.7)",
                      border: "1px solid rgba(194,143,69,0.35)",
                    }}>
                      <p style={{
                        fontFamily: "var(--font-cormorant), serif",
                        fontWeight: 700,
                        fontSize: 19,
                        color: "#263e0f",
                        lineHeight: 1.3,
                        marginBottom: 10,
                      }}>{nm}</p>
                      <div style={{ display: "flex", gap: 8 }}>
                        <button type="button" disabled={cerrado} aria-pressed={choices[i] === "yes"}
                          onClick={() => elegir(i, "yes")} style={miniBtn(choices[i] === "yes", "yes")}>
                          {t.rsvp.yes}
                        </button>
                        <button type="button" disabled={cerrado} aria-pressed={choices[i] === "no"}
                          onClick={() => elegir(i, "no")} style={miniBtn(choices[i] === "no", "no")}>
                          {t.rsvp.no}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              <button
                onClick={handleConfirm}
                disabled={btnDisabled}
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
                  cursor: btnDisabled ? "not-allowed" : "pointer",
                  fontFamily: "var(--font-lato), sans-serif",
                  fontSize: 15,
                  fontWeight: 700,
                  textTransform: "uppercase",
                  letterSpacing: 3,
                  boxShadow: "0 8px 26px rgba(28,64,44,0.30)",
                  opacity: btnDisabled ? 0.6 : 1,
                }}
              >
                {btnLabel}
              </button>

              {status && (
                <p role={status.err ? "alert" : undefined} style={msgStyle(status.err ? "#a04a2a" : "#263e0f")}>
                  {status.msg(t.rsvp)}
                </p>
              )}
            </>
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
