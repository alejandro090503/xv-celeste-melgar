"use client";
import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";

export type Lang = "es" | "en";

const STORAGE_KEY = "xv-celeste-lang";

const dict = {
  es: {
    splash: {
      ariaOpen: "Toca para abrir la invitación",
      ariaChoose: "Elige tu idioma",
      name: "Celeste",
      subtitle: "Mis XV Años",
      cta: "Toca para abrir",
      chooseTitle: "Elige tu idioma",
      chooseSubtitle: "Choose your language",
      langEs: "Español",
      langEn: "English",
    },
    hero: {
      message:
        "Hoy comienza una nueva etapa llena de sueños, ilusiones y momentos que guardaré por siempre en mi corazón.",
      name: "Celeste",
      xv: "XV",
      years: "Años",
      date: "17 · Octubre · 2026",
    },
    countdown: {
      title: "Faltan",
      subtitle: "Para este día tan especial",
      days: "Días",
      hours: "Horas",
      minutes: "Min",
      seconds: "Seg",
      footer: "Cada segundo más cerca de celebrar juntos",
    },
    familia: {
      eyebrow: "Con la bendición de",
      title: "Mi Familia",
      padres: "Mis Padres",
    },
    ubicacion: {
      eyebrow: "Te esperamos en",
      title: "Lugares",
      servicio: "Servicio de Acción de Gracias",
      recepcion: "Recepción",
      comoLlegar: "Cómo Llegar",
      tituloIframe: (type: string) => `Ubicación — ${type}`,
    },
    calendario: {
      eyebrow: "No lo olvides",
      title: "Guárdalo",
      subtitle: "Agrega el evento a tu calendario",
      cta: "Añadir a Google Calendar",
      gcalTitle: "XV Años de Celeste",
      gcalDetails: "Celebración de XV Años de Celeste Melgar · Oakland, CA",
    },
    dresscode: {
      eyebrow: "Código de Vestimenta",
      title: "Dress Code",
      alt: "Pareja en código de vestimenta etiqueta — esmoquin y vestido largo",
      formal: "Formal",
      noHoodies: "No sudaderas con capucha.",
      noGreen: "No usar verde esmeralda ni ningún tono de verde.",
    },
    album: {
      eyebrow: "Comparte tus fotos",
      title: "Álbum Compartido",
      body: "Escanea el código y súbenos las fotos que tomes durante la celebración.",
      alt: "Código QR del álbum compartido",
    },
    rsvp: {
      eyebrow: "Confirmación de Asistencia",
      presenceBefore: "Tu presencia ",
      presenceHighlight: "lo es",
      presenceAfter: " todo",
      bodyBefore: "Por favor confirma tu asistencia antes del ",
      bodyStrong: "sábado 3 de octubre de 2026",
      bodyAfter: ". Nos encantaría contar contigo en este día tan especial.",
      invitationFor: (name: string) => `Esta invitación es para ${name}`,
      pasesLabel: "Pases",
      yes: "Asistiré",
      no: "No podré asistir",
      namePlaceholderSingle: "Tu nombre completo",
      namePlaceholderMulti: (i: number) => `Invitado ${i}`,
      confirmBtn: "Confirmar",
      updateBtn: "Actualizar respuesta",
      sendingBtn: "Enviando…",
      frozenBtn: "Fecha límite alcanzada",
      errNoChoice: "Por favor selecciona si asistirás o no.",
      errNoNames: "Por favor escribe al menos un nombre.",
      errConnection: "Error de conexión. Intenta de nuevo.",
      alreadyYes: "¡Ya tienes confirmada tu asistencia! Puedes actualizar tu respuesta.",
      alreadyNo: "Ya tienes registrado que no podrás asistir. Puedes cambiar tu respuesta.",
      successYes: "¡Tu asistencia ha sido confirmada! Nos vemos pronto.",
      successNo: "Hemos registrado que no podrás asistir. ¡Gracias por avisarnos!",
      deadlineFooter: "Fecha límite · 3 de octubre 2026",
      pasePase: "Pase",
      pasePases: "Pases",
    },
    footer: {
      date: "XVII · Octubre · MMXXVI",
      credit: "Con mucho cariño por",
    },
    music: {
      play: "Reproducir música",
      pause: "Pausar música",
    },
    carrusel: {
      eyebrow: "Creciendo",
      title: "Mis Momentos",
      footer: "Cada foto guarda un instante irrepetible de este camino hacia los quince.",
      prev: "Foto anterior",
      next: "Foto siguiente",
      close: "Cerrar",
      alts: [
        "Celeste sonriendo",
        "Celeste de espaldas, atardecer",
        "Celeste de niña",
        "Celeste en el arco de piedra",
        "Celeste en el jardín de glicinas",
        "Celeste en el bosque encantado",
      ],
    },
    closing: {
      text: "Este día ha vivido en mis sueños, y su verdadera magia será estar rodeada de quienes han caminado conmigo.",
    },
  },
  en: {
    splash: {
      ariaOpen: "Tap to open the invitation",
      ariaChoose: "Choose your language",
      name: "Celeste",
      subtitle: "My Quinceañera",
      cta: "Tap to open",
      chooseTitle: "Elige tu idioma",
      chooseSubtitle: "Choose your language",
      langEs: "Español",
      langEn: "English",
    },
    hero: {
      message:
        "Today begins a new chapter full of dreams, hopes, and moments I will keep in my heart forever.",
      name: "Celeste",
      xv: "XV",
      years: "Years",
      date: "October · 17 · 2026",
    },
    countdown: {
      title: "Countdown",
      subtitle: "Until this special day",
      days: "Days",
      hours: "Hours",
      minutes: "Min",
      seconds: "Sec",
      footer: "Every second brings us closer to celebrating together",
    },
    familia: {
      eyebrow: "With the blessing of",
      title: "My Family",
      padres: "My Parents",
    },
    ubicacion: {
      eyebrow: "Join us at",
      title: "Venues",
      servicio: "Thanksgiving Service",
      recepcion: "Reception",
      comoLlegar: "Get Directions",
      tituloIframe: (type: string) => `Location — ${type}`,
    },
    calendario: {
      eyebrow: "Don't forget",
      title: "Save the Date",
      subtitle: "Add the event to your calendar",
      cta: "Add to Google Calendar",
      gcalTitle: "Celeste's Quinceañera",
      gcalDetails: "Celebration of Celeste Melgar's XV Años · Oakland, CA",
    },
    dresscode: {
      eyebrow: "Attire",
      title: "Dress Code",
      alt: "Couple in formal attire — tuxedo and evening gown",
      formal: "Formal",
      noHoodies: "No hoodies.",
      noGreen: "Please avoid emerald green or any shade of green.",
    },
    album: {
      eyebrow: "Share your photos",
      title: "Shared Album",
      body: "Scan the code and upload the photos you take during the celebration.",
      alt: "QR code for the shared album",
    },
    rsvp: {
      eyebrow: "Confirm Attendance",
      presenceBefore: "Your presence is ",
      presenceHighlight: "everything",
      presenceAfter: "",
      bodyBefore: "Please confirm your attendance by ",
      bodyStrong: "Saturday, October 3, 2026",
      bodyAfter: ". We would love to have you with us on this special day.",
      invitationFor: (name: string) => `This invitation is for ${name}`,
      pasesLabel: "Passes",
      yes: "I'll Attend",
      no: "Unable to attend",
      namePlaceholderSingle: "Your full name",
      namePlaceholderMulti: (i: number) => `Guest ${i}`,
      confirmBtn: "Confirm",
      updateBtn: "Update response",
      sendingBtn: "Sending…",
      frozenBtn: "Deadline reached",
      errNoChoice: "Please select whether you will attend or not.",
      errNoNames: "Please enter at least one name.",
      errConnection: "Connection error. Please try again.",
      alreadyYes: "You already have your attendance confirmed! You can update your response.",
      alreadyNo: "We have you down as unable to attend. You can change your response.",
      successYes: "Your attendance has been confirmed! See you soon.",
      successNo: "We've noted that you won't be able to attend. Thank you for letting us know!",
      deadlineFooter: "Deadline · October 3, 2026",
      pasePase: "Pass",
      pasePases: "Passes",
    },
    footer: {
      date: "October · XVII · MMXXVI",
      credit: "With love, by",
    },
    music: {
      play: "Play music",
      pause: "Pause music",
    },
    carrusel: {
      eyebrow: "Growing Up",
      title: "My Moments",
      footer: "Every photo holds a unique moment on this journey to my quinceañera.",
      prev: "Previous photo",
      next: "Next photo",
      close: "Close",
      alts: [
        "Celeste smiling",
        "Celeste from behind, at sunset",
        "Celeste as a little girl",
        "Celeste at the stone arch",
        "Celeste in the wisteria garden",
        "Celeste in the enchanted forest",
      ],
    },
    closing: {
      text: "This day has lived in my dreams, and its true magic will be being surrounded by those who have walked this journey with me.",
    },
  },
};

export type Dict = typeof dict.es;

export function pasesLabel(n: number, lang: Lang): string {
  const t = dict[lang].rsvp;
  return n === 1 ? t.pasePase : t.pasePases;
}

interface LangContextValue {
  lang: Lang;
  setLang: (l: Lang) => void;
  langChosen: boolean;
  ready: boolean;
  t: Dict;
}

const LangContext = createContext<LangContextValue | null>(null);

function readInitial(): { lang: Lang; chosen: boolean } {
  if (typeof window === "undefined") return { lang: "es", chosen: false };
  try {
    const params = new URLSearchParams(window.location.search);
    const q = params.get("lang");
    if (q === "en" || q === "es") return { lang: q, chosen: true };
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (stored === "en" || stored === "es") return { lang: stored, chosen: true };
  } catch {
    /* localStorage puede fallar en modo privado — se ignora */
  }
  return { lang: "es", chosen: false };
}

export function LangProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>("es");
  const [langChosen, setLangChosen] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const initial = readInitial();
    setLangState(initial.lang);
    setLangChosen(initial.chosen);
    setReady(true);
  }, []);

  useEffect(() => {
    if (typeof document !== "undefined") {
      document.documentElement.lang = lang;
    }
  }, [lang]);

  const setLang = (l: Lang) => {
    setLangState(l);
    setLangChosen(true);
    try {
      window.localStorage.setItem(STORAGE_KEY, l);
    } catch {
      /* ignora — solo persistencia opcional */
    }
  };

  const value = useMemo<LangContextValue>(
    () => ({ lang, setLang, langChosen, ready, t: dict[lang] }),
    [lang, langChosen, ready]
  );

  return <LangContext.Provider value={value}>{children}</LangContext.Provider>;
}

export function useLang(): LangContextValue {
  const ctx = useContext(LangContext);
  if (!ctx) throw new Error("useLang debe usarse dentro de LangProvider");
  return ctx;
}
