import type { Metadata } from "next";
import { Great_Vibes, Cormorant_Garamond, Lato } from "next/font/google";
import "./globals.css";

const greatVibes = Great_Vibes({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-great-vibes",
  display: "swap",
});

const cormorant = Cormorant_Garamond({
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
  subsets: ["latin"],
  variable: "--font-cormorant",
  display: "swap",
});

const lato = Lato({
  weight: ["400", "700", "900"],
  subsets: ["latin"],
  variable: "--font-lato",
  display: "swap",
});

export const metadata: Metadata = {
  title: "XV Años · Celeste Melgar",
  description:
    "Invitación digital a los XV Años de Celeste Melgar · Servicio de Acción de Gracias · 17 de octubre de 2026 · Oakland, CA",
  openGraph: {
    title: "XV Años · Celeste Melgar",
    description: "17 de octubre de 2026 · Oakland, CA",
    type: "website",
    images: ["/og.jpg"],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body
        className={`${greatVibes.variable} ${cormorant.variable} ${lato.variable}`}
      >
        {children}
      </body>
    </html>
  );
}
