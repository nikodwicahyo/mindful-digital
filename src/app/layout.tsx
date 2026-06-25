import type { Metadata } from "next";
import { Inter, Space_Grotesk, Lora } from "next/font/google";
import JsonLd from "@/components/JsonLd";
import SmoothScroll from "@/components/SmoothScroll";
import LoadingScreen from "@/components/LoadingScreen";
import { ToastProvider } from "@/components/Toast";
import CursorGlow from "@/components/CursorGlow";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  display: "swap",
});

const lora = Lora({
  variable: "--font-lora",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "MindfulDigital - Bijak Berteknologi & Jaga Kesehatan Mental",
  description:
    "Iklan Layanan Masyarakat interaktif tentang fenomena brain rot dan dampak screen time berlebih. Dilengkapi video edukasi dari Psikolog UGM × TVRI, podcast Liputan6, kuis interaktif, dan komitmen digital detox.",
  keywords: [
    "brain rot",
    "kesehatan mental",
    "digital detox",
    "screen time",
    "bijak berteknologi",
    "ilm",
    "remaja indonesia",
    "kecanduan gadget",
    "mental health",
    "oxford word of the year",
  ],
  openGraph: {
    title: "MindfulDigital - Bijak Berteknologi & Jaga Kesehatan Mental",
    description:
      "Website interaktif tentang brain rot dan dampak screen time berlebih. Yuk kurangi screen time dan tingkatkan kualitas hidup!",
    url: "https://mindful-digital.vercel.app",
    siteName: "MindfulDigital",
    locale: "id_ID",
    type: "website",
    images: [
      {
        url: "https://img.youtube.com/vi/DuVuCaptICE/maxresdefault.jpg",
        width: 1280,
        height: 720,
        alt: "MindfulDigital - Bijak Berteknologi",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "MindfulDigital - Bijak Berteknologi",
    description:
      "Kurangi screen time, tingkatkan kesehatan mental. Website interaktif dengan video brain rot, kuis, dan komitmen digital detox.",
  },
  robots: {
    index: true,
    follow: true,
  },
  icons: {
    icon: "/favicon.ico",
  },
};

export const viewport = {
  themeColor: "#0E0F12",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="id"
      className={`${inter.variable} ${spaceGrotesk.variable} ${lora.variable} antialiased`}
      suppressHydrationWarning
    >
      <body
        className="bg-background text-foreground min-h-screen flex flex-col"
        suppressHydrationWarning
      >
        <JsonLd />
        <LoadingScreen />
        <a href="#hero" className="skip-nav">
          Lewati ke konten utama
        </a>
        <CursorGlow />
        <SmoothScroll>
          <ToastProvider>{children}</ToastProvider>
        </SmoothScroll>
      </body>
    </html>
  );
}
