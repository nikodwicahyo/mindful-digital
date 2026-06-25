const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  name: "MindfulDigital - Bijak Berteknologi & Jaga Kesehatan Mental",
  description:
    "Iklan Layanan Masyarakat interaktif tentang brain rot, dampak screen time berlebih, dan ajakan bijak digital. Dilengkapi video dari Psikolog UGM × TVRI, podcast Liputan6, kuis, dan komitmen digital detox.",
  url: "https://mindful-digital.vercel.app",
  inLanguage: "id-ID",
  about: {
    "@type": "Thing",
    name: "Kesehatan Mental di Era Digital",
  },
};

export default function JsonLd() {
  return (
    <script
      type="application/ld+json"
      suppressHydrationWarning
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}
