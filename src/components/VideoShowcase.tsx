"use client";
import { useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { videoData } from "@/data/content";
import AnimatedBlobs, { defaultPalettes } from "@/components/AnimatedBlobs";
import Scroll3DWrapper from "@/components/Scroll3DWrapper";
import { useScrollReveal } from "@/hooks/useScrollReveal";

export default function VideoShowcase() {
  const [isPlaying, setIsPlaying] = useState(false);
  const { ref, isVisible } = useScrollReveal({ threshold: 0.1 });

  return (
    <section id="video" className="bg-mesh-sage animate-gradient-rotate bg-ink py-20 md:py-32 relative overflow-hidden">
      <AnimatedBlobs colors={defaultPalettes.dark} count={4} />
      <Scroll3DWrapper className="max-w-6xl mx-auto px-6 md:px-12 lg:px-20 relative z-10">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 40 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-8"
        >
          <motion.span
            initial={{ opacity: 0, scale: 0.9 }}
            animate={isVisible ? { opacity: 1, scale: 1 } : {}}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-sage/15 border border-sage/30 text-sage-light text-xs font-medium mb-4"
          >
            <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z" />
            </svg>
            OPSI — Psikologi UGM × TVRI
          </motion.span>
          <h2 className="font-display text-3xl md:text-5xl font-bold text-cream mb-4 text-glow">
            {videoData.title}
          </h2>
          <p className="text-cream/85 text-lg max-w-3xl mx-auto">
            {videoData.description}
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 30 }}
          animate={isVisible ? { opacity: 1, scale: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="relative rounded-3xl overflow-hidden"
          style={{ border: "2px solid rgba(61,90,80,0.3)" }}
        >
          <div className="cs-glass cs-glass-rounded-3xl p-3 md:p-4">
            <div
              className="relative aspect-video rounded-2xl overflow-hidden shadow-2xl bg-ink"
              role="region"
              aria-label="Video player"
            >
              {!isPlaying ? (
                <button
                  onClick={() => setIsPlaying(true)}
                  className="w-full h-full relative group/btn cursor-pointer"
                  aria-label="Putar video kampanye"
                >
                  <Image
                    src={`https://img.youtube.com/vi/${videoData.youtubeId}/maxresdefault.jpg`}
                    alt={videoData.posterAlt}
                    fill
                    sizes="(max-width: 768px) 100vw, 60vw"
                    className="object-cover transition-transform duration-700 group-hover/btn:scale-105"
                    placeholder="blur"
                    blurDataURL="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTI4MCIgaGVpZ2h0PSI3MjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlbGlnaHQ9IjEwMCUiIGZpbGw9IiMwRTBGMTIiLz48L3N2Zz4="
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-transparent to-transparent" />
                  <div className="absolute inset-0 bg-ink/30 group-hover/btn:bg-ink/20 transition-all duration-300 flex items-center justify-center">
                    <motion.div
                      whileHover={{ scale: 1.15 }}
                      whileTap={{ scale: 0.9 }}
                      className="relative w-20 h-20 md:w-24 md:h-24"
                    >
                      <motion.div
                        className="absolute inset-0 rounded-full bg-sage-light/20"
                        animate={{ scale: [1, 1.3], opacity: [0.3, 0] }}
                        transition={{ duration: 1, repeat: Infinity, repeatType: "reverse" }}
                      />
                      <div className="relative w-full h-full bg-cream/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-2xl">
                        <svg className="w-8 h-8 md:w-10 md:h-10 text-sage ml-2" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M8 5v14l11-7z" />
                        </svg>
                      </div>
                    </motion.div>
                  </div>
                </button>
              ) : (
                <iframe
                  src={`https://www.youtube.com/embed/${videoData.youtubeId}?autoplay=1&rel=0&modestbranding=1`}
                  className="absolute inset-0 w-full h-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  title={videoData.posterAlt}
                  loading="lazy"
                />
              )}
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="mt-10"
        >
          <blockquote className="text-center mb-8 relative">
            <motion.span
              className="absolute -top-4 -left-2 text-6xl text-sage/20 font-serif leading-none"
              animate={{ y: [0, -8], opacity: [0.2, 0.4] }}
              transition={{ duration: 1.5, repeat: Infinity, repeatType: "reverse" }}
            >
              &ldquo;
            </motion.span>
            <p className="font-serif text-xl md:text-2xl text-sage-light italic max-w-3xl mx-auto leading-relaxed px-8">
              {videoData.pullQuote}
            </p>
            <motion.span
              className="absolute -bottom-8 -right-2 text-6xl text-sage/20 font-serif leading-none"
              animate={{ y: [0, 8], opacity: [0.2, 0.4] }}
              transition={{ duration: 1.5, repeat: Infinity, repeatType: "reverse", delay: 0.75 }}
            >
              &rdquo;
            </motion.span>
          </blockquote>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {videoData.keyTakeaways.map((takeaway, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={isVisible ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: 0.5 + index * 0.1, ease: [0.21, 1.02, 0.73, 1] }}
                whileHover={{ y: -6, scale: 1.03 }}
                className="cs-glass cs-glass-strong cs-glass-rounded-2xl p-5 text-left cursor-default backdrop-glow"
                style={{ transformStyle: "preserve-3d" }}
              >
                <div className="flex items-center gap-2 mb-2">
                  <motion.span
                    className="px-2 py-0.5 rounded bg-sage/20 text-sage-light text-xs font-mono"
                    whileHover={{ scale: 1.1, backgroundColor: "rgba(61,90,80,0.4)" }}
                  >
                    {takeaway.time}
                  </motion.span>
                  <span className="text-sm font-semibold text-cream">
                    {takeaway.label}
                  </span>
                </div>
                <p className="text-sm text-cream/80">
                  {takeaway.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </Scroll3DWrapper>
    </section>
  );
}
