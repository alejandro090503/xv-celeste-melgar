"use client";
import { useState, useRef } from "react";
import SplashScreen from "./SplashScreen";
import Hero from "./Hero";
import Ornament from "./Ornament";
import CountdownTimer from "./CountdownTimer";
import Ubicacion from "./Ubicacion";
import CalendarioBtn from "./CalendarioBtn";
import DressCode from "./DressCode";
import Familia from "./Familia";
import MesaRegalos from "./MesaRegalos";
import PhotoFrame from "./PhotoFrame";
import RSVPSection from "./RSVPSection";
import Carrusel from "./Carrusel";
import ClosingPhoto from "./ClosingPhoto";
import Footer from "./Footer";
import MusicFab, { type MusicFabHandle } from "./MusicFab";
import GoldDust from "./GoldDust";
import ScrollReveal from "./ScrollReveal";
import NoNinos from "./NoNinos";
import AlbumQR from "./AlbumQR";

export default function InvitacionClient() {
  const [contentVisible, setContentVisible] = useState(false);
  const [splashMounted, setSplashMounted] = useState(true);
  const musicRef = useRef<MusicFabHandle>(null);

  // Al tocar el sobre (gesto del usuario) → arranca la música
  const handleStart = () => {
    musicRef.current?.play();
  };

  // Al terminar el video del sobre → revela la invitación
  const handleReveal = () => {
    setContentVisible(true);
    setTimeout(() => {
      setSplashMounted(false);
      window.scrollTo({ top: 0, behavior: "instant" });
    }, 820);
  };

  return (
    <>
      {splashMounted && <SplashScreen onStart={handleStart} onOpen={handleReveal} />}

      <div
        style={{
          opacity: contentVisible ? 1 : 0,
          transition: "opacity 0.85s ease",
          maxWidth: 430,
          margin: "0 auto",
          position: "relative",
          overflowX: "clip",
          zIndex: 1,
          background: "linear-gradient(180deg, #1a2c0a 0%, #1a2c0a 50%, #1a2c0a 100%)",
        }}
      >
        <Hero />

        {/* Carrusel de momentos — después del hero */}
        <ScrollReveal>
          <Carrusel />
        </ScrollReveal>

        <ScrollReveal>
          <Ornament />
        </ScrollReveal>

        <ScrollReveal>
          <Familia />
        </ScrollReveal>

        {/* Marco rasgado #2 — quinceañera en jardín de glicinas */}
        <ScrollReveal>
          <PhotoFrame variant="framed2" seed={23} />
        </ScrollReveal>

        <ScrollReveal>
          <Ornament />
        </ScrollReveal>

        <ScrollReveal>
          <div style={{ padding: "32px 26px 10px", textAlign: "center" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 18 }}>
              <div style={{ flex: 1, maxWidth: 60, height: 1, background: "var(--gold-metal-gradient)", backgroundSize: "300% 100%", animation: "goldSweep 6s linear infinite", opacity: 0.55 }} />
              <div style={{
                fontFamily: "var(--font-cormorant), serif",
                fontWeight: 700, fontSize: 24, letterSpacing: 8,
                textTransform: "uppercase", color: "#e9c77b", textIndent: 8,
              }}>
                17 · Octubre · 2026
              </div>
              <div style={{ flex: 1, maxWidth: 60, height: 1, background: "var(--gold-metal-gradient)", backgroundSize: "300% 100%", animation: "goldSweep 6s linear infinite", opacity: 0.55 }} />
            </div>
          </div>
        </ScrollReveal>

        <ScrollReveal>
          <CountdownTimer />
        </ScrollReveal>

        <ScrollReveal>
          <Ornament />
        </ScrollReveal>

        <ScrollReveal>
          <Ubicacion />
        </ScrollReveal>

        <ScrollReveal>
          <CalendarioBtn />
        </ScrollReveal>

        <ScrollReveal>
          <Ornament />
        </ScrollReveal>

        <ScrollReveal>
          <DressCode />
        </ScrollReveal>

        <ScrollReveal>
          <Ornament />
        </ScrollReveal>

        <ScrollReveal>
          <MesaRegalos />
        </ScrollReveal>

        {/* Foto 2 — marco rasgado */}
        <ScrollReveal>
          <PhotoFrame />
        </ScrollReveal>

        <ScrollReveal>
          <AlbumQR />
        </ScrollReveal>

        <ScrollReveal>
          <Ornament />
        </ScrollReveal>

        <ScrollReveal>
          <NoNinos />
        </ScrollReveal>

        <ScrollReveal>
          <RSVPSection />
        </ScrollReveal>

        {/* Foto 3 — cierre (full-bleed) */}
        <ClosingPhoto />

        <Footer />
      </div>

      {/* Polvo dorado — aparece tras el header */}
      {contentVisible && <GoldDust />}

      <MusicFab ref={musicRef} />
    </>
  );
}
