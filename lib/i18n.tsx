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
      parkingEyebrow: "Aviso importante",
      parkingText: "Estacionamiento en la calle solamente",
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
      no: "No asistiré",
      confirmBtn: "Confirmar",
      updateBtn: "Actualizar respuesta",
      sendingBtn: "Enviando…",
      retryBtn: "Reintentar",
      frozenBtn: "Fecha límite alcanzada",
      errPending: (f: number) => `Por favor responde por cada invitado (${f} pendiente${f === 1 ? "" : "s"}).`,
      errNoAssigned: "No encontramos lugares asignados a esta invitación. Escríbenos para ayudarte.",
      errLoad: "No pudimos cargar tu invitación. Recarga la página e inténtalo de nuevo.",
      errNoLink: "Para confirmar necesitas abrir el enlace personalizado que te enviamos por WhatsApp. Ese enlace lleva los nombres de tu invitación; si lo abres desde un reenvío o escribiendo la dirección a mano, no podemos identificarla.",
      errNoMatch: "No pudimos identificar tu invitación. Abre el enlace personalizado que te enviamos por WhatsApp; ese es el único que registra tu confirmación.",
      errDeleted: "Esta invitación ya no está activa. Por favor contacta a la familia para que te envíen un enlace nuevo.",
      errClosed: "Tu respuesta ya quedó registrada y no se puede modificar. Si necesitas un cambio, contacta a la familia.",
      errGeneric: "Hubo un problema al enviar. Inténtalo de nuevo.",
      errConnection: "Sin conexión. Verifica tu internet e inténtalo de nuevo.",
      thanksYesTitle: "¡Gracias por confirmar!",
      thanksYesOne: (name: string) => `Te esperamos con mucha ilusión, ${name}.`,
      thanksYesMany: (list: string[]) => `Quedan confirmados ${list.length} lugares: ${list.join(", ")}.`,
      thanksNoTitle: "Gracias por avisarnos",
      thanksNoSub: "Lamentamos que no puedas acompañarnos. Te vamos a extrañar.",
      editBtn: "Modificar mi respuesta",
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
      verse: "Para esta hora he llegado",
      verseRef: "Ester 4:14",
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
      parkingEyebrow: "Please note",
      parkingText: "Street parking only",
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
      yes: "I'll attend",
      no: "Won't attend",
      confirmBtn: "Confirm",
      updateBtn: "Update response",
      sendingBtn: "Sending…",
      retryBtn: "Try again",
      frozenBtn: "Deadline reached",
      errPending: (f: number) => `Please answer for each guest (${f} pending).`,
      errNoAssigned: "We couldn't find any guests assigned to this invitation. Please contact us for help.",
      errLoad: "We couldn't load your invitation. Please reload the page and try again.",
      errNoLink: "To confirm, please open the personal link we sent you on WhatsApp. That link carries the names on your invitation; if you open it from a forwarded message or by typing the address, we cannot identify it.",
      errNoMatch: "We could not identify your invitation. Please open the personal link we sent you on WhatsApp; it is the only one that records your reply.",
      errDeleted: "This invitation is no longer active. Please contact the family for a new link.",
      errClosed: "Your reply has already been recorded and can no longer be changed. If you need a change, please contact the family.",
      errGeneric: "There was a problem sending your reply. Please try again.",
      errConnection: "No connection. Check your internet and try again.",
      thanksYesTitle: "Thank you for confirming!",
      thanksYesOne: (name: string) => `We look forward to seeing you, ${name}.`,
      thanksYesMany: (list: string[]) => `${list.length} spots confirmed: ${list.join(", ")}.`,
      thanksNoTitle: "Thank you for letting us know",
      thanksNoSub: "We're sorry you can't join us. You will be missed.",
      editBtn: "Update my answer",
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
      verse: "I have come for such a time as this",
      verseRef: "Esther 4:14",
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
