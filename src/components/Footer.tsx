"use client";
import { motion } from "framer-motion";
import { footerContent } from "@/data/content";
import AnimatedBlobs, { defaultPalettes } from "@/components/AnimatedBlobs";
import { useScrollReveal } from "@/hooks/useScrollReveal";

export default function Footer() {
  const { ref, isVisible } = useScrollReveal({ threshold: 0.1 });

  return (
    <footer className="bg-mesh-sage animate-gradient-rotate bg-ink py-12 md:py-16 border-t border-sage/10 relative overflow-hidden">
      <AnimatedBlobs colors={defaultPalettes.dark} count={3} />
      <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-20 relative z-10">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 20 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
        >
          {/* Top section */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            {/* Brand */}
            <div className="text-center md:text-left">
              <motion.span
                className="font-display text-xl font-bold text-cream inline-block"
                whileHover={{ scale: 1.05 }}
              >
                Mindful<span className="text-sage-light">Digital</span>
              </motion.span>
              <p className="text-cream/70 text-sm mt-2">{footerContent.credits}</p>
            </div>

            {/* Sources */}
            <div className="text-center">
              <p className="text-cream/60 text-xs mb-2">{footerContent.videoSource}</p>
              <p className="text-cream/60 text-xs">{footerContent.audioSource}</p>
            </div>

            {/* Social */}
            <div className="flex items-center justify-center md:justify-end gap-3">
              {footerContent.socialLinks.map((link, i) => (
                <motion.a
                  key={i}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 rounded-full bg-sage/10 border border-sage/15 flex items-center justify-center text-cream/65 hover:text-cream hover:bg-sage/20 hover:border-sage/30 transition-all"
                  whileHover={{ scale: 1.15, y: -2 }}
                  whileTap={{ scale: 0.9 }}
                  aria-label={link.label}
                >
                  {link.icon === "youtube" && (
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zM9 16V8l8 4-8 4z" />
                    </svg>
                  )}
                  {link.icon === "instagram" && (
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
                    </svg>
                  )}
                  {link.icon === "web" && (
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z" />
                    </svg>
                  )}
                </motion.a>
              ))}
            </div>
          </div>

          {/* Divider */}
          <div className="w-16 h-px bg-sage/20 mx-auto mb-6" />

          <p className="text-cream/50 text-xs text-center">
            Dibuat untuk kesehatan mental yang lebih baik
          </p>
        </motion.div>
      </div>
    </footer>
  );
}
