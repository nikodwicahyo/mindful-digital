import dynamic from "next/dynamic";
import Navbar from "@/components/Navbar";
import ScrollProgress from "@/components/ScrollProgress";
import HeroSection from "@/components/HeroSection";
import Footer from "@/components/Footer";
import BackToTop from "@/components/BackToTop";

const StatStrip = dynamic(() => import("@/components/StatStrip"), {
  loading: () => <div className="py-24 bg-ink min-h-[400px]" />,
});

const VideoShowcase = dynamic(() => import("@/components/VideoShowcase"), {
  loading: () => <div className="py-24 bg-ink min-h-[400px]" />,
});

const AudioHub = dynamic(() => import("@/components/AudioHub"), {
  loading: () => <div className="py-24 bg-ink min-h-[400px]" />,
});

const InteractiveQuiz = dynamic(() => import("@/components/InteractiveQuiz"), {
  loading: () => <div className="py-24 bg-ink min-h-[400px]" />,
});

const ActionSection = dynamic(() => import("@/components/ActionSection"), {
  loading: () => <div className="py-24 bg-ink min-h-[400px]" />,
});

export default function Home() {
  return (
    <main className="min-h-screen">
      <ScrollProgress />
      <Navbar />
      <HeroSection />
      <StatStrip />
      <VideoShowcase />
      <AudioHub />
      <InteractiveQuiz />
      <ActionSection />
      <Footer />
      <BackToTop />
    </main>
  );
}
