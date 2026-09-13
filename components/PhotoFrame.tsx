"use client";
import { PHOTOS } from "./photos";

interface Props {
  /** Cuál foto mostrar — "framed" (default, arco) o "framed2" (jardín) */
  variant?: "framed" | "framed2";
  /** Seed del ruido del borde rasgado — distinto por variante para que no se vean idénticos */
  seed?: number;
}

/* Foto enmarcada con bordes de papel rasgado (deckle).
   El filtro SVG SOLO afecta a la capa de papel beige, no a la imagen. */
export default function PhotoFrame({ variant = "framed", seed = 7 }: Props) {
  const photo = PHOTOS[variant];
  const hasPhoto = !!photo;
  const filterId = `paper-edge-${variant}`;

  return (
    <section style={{ padding: "56px 26px 40px", display: "flex", justifyContent: "center" }}>
      {/* Filtro SVG aplicado SOLO al papel — no toca la imagen */}
      <svg width="0" height="0" style={{ position: "absolute" }} aria-hidden="true">
        <filter id={filterId}>
          <feTurbulence type="fractalNoise" baseFrequency="0.018" numOctaves="3" seed={seed} result="noise" />
          <feDisplacementMap in="SourceGraphic" in2="noise" scale="14" />
        </filter>
      </svg>

      <div style={{
        position: "relative",
        width: "min(300px, 80vw)",
        filter: "drop-shadow(0 16px 36px rgba(0,0,0,0.45))",
      }}>
        {/* Marco rasgado de fondo — solo color, con el filtro de bordes irregulares */}
        <div
          aria-hidden="true"
          style={{
            position: "absolute",
            inset: 0,
            background: "#f6f2ea",
            filter: `url(#${filterId})`,
          }}
        />

        {/* Imagen encima del papel — SIN filtro, bordes rectos limpios */}
        <div style={{
          position: "relative",
          margin: 14,
          aspectRatio: "9 / 14",
          overflow: "hidden",
          background: hasPhoto
            ? "transparent"
            : "linear-gradient(160deg, #263e0f 0%, #2f4a12 45%, #1a2c0a 100%)",
          backgroundImage: hasPhoto ? `url("${photo}")` : undefined,
          backgroundSize: "cover",
          backgroundPosition: "center",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}>
          {!hasPhoto && (
            <svg width="70" height="70" viewBox="0 0 24 24" fill="none" stroke="rgba(212,162,76,0.55)" strokeWidth="0.8" aria-hidden="true">
              <path d="M12 3 C12 8, 8 10, 6 12 C8 14, 12 16, 12 21 C12 16, 16 14, 18 12 C16 10, 12 8, 12 3 Z" />
              <circle cx="12" cy="12" r="1.6" fill="rgba(212,162,76,0.55)" stroke="none" />
            </svg>
          )}
        </div>
      </div>
    </section>
  );
}
