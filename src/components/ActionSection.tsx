"use client";
import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { actionContent } from "@/data/content";
import Button from "@/components/Button";
import AnimatedBlobs, { defaultPalettes } from "@/components/AnimatedBlobs";
import Scroll3DWrapper from "@/components/Scroll3DWrapper";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { useToast } from "@/components/Toast";

async function fireConfetti() {
  const confetti = (await import("canvas-confetti")).default;
  const duration = 3000;
  const end = Date.now() + duration;

  const frame = () => {
    confetti({
      particleCount: 4, angle: 60, spread: 55, origin: { x: 0, y: 0.7 },
      colors: ["#3D5A50", "#9CB8AC", "#F5F1E8"],
      shapes: ["square", "circle"],
    });
    confetti({
      particleCount: 4, angle: 120, spread: 55, origin: { x: 1, y: 0.7 },
      colors: ["#FF5A36", "#9CB8AC", "#F5F1E8"],
      shapes: ["square", "circle"],
    });
    if (Date.now() < end) requestAnimationFrame(frame);
  };
  frame();
}

const springTransition = {
  type: "spring" as const,
  stiffness: 200,
  damping: 24,
  mass: 0.8,
};

export default function ActionSection() {
  const { ref, isVisible } = useScrollReveal({ threshold: 0.15 });
  const [hasClicked, setHasClicked] = useState(false);
  const [selectedCommitments, setSelectedCommitments] = useState<number[]>([]);
  const [counter, setCounter] = useState(247);
  const { showToast } = useToast();

  const toggleCommitment = useCallback((index: number) => {
    setSelectedCommitments((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
    );
  }, []);

  const handleAction = useCallback(() => {
    if (hasClicked) return;
    setHasClicked(true);
    fireConfetti();
    setCounter((prev) => prev + 1);
    showToast("Kamu sudah berkomitmen! Langkah kecil yang luar biasa.", "success");
  }, [hasClicked, showToast]);

  const handleShare = useCallback(() => {
    const commitments = selectedCommitments.length > 0
      ? selectedCommitments.map((i) => actionContent.commitments[i].text).join(", ")
      : "mengurangi screen time";
    const text = actionContent.shareText.replace("%commitment%", commitments);
    if (navigator.share) {
      navigator.share({ title: "MindfulDigital", text }).catch(() => {});
    } else {
      navigator.clipboard.writeText(text).then(() => {
        showToast("Teks komitmen sudah disalin!", "success");
      }).catch(() => {});
    }
  }, [selectedCommitments, showToast]);

  const selectAll = useCallback(() => {
    setSelectedCommitments(actionContent.commitments.map((_, i) => i));
  }, []);

  return (
    <section id="action" className="bg-mesh-sage animate-gradient-rotate bg-ink py-20 md:py-32 relative overflow-hidden">
      <AnimatedBlobs colors={defaultPalettes.dark} count={4} />
      <Scroll3DWrapper className="max-w-4xl mx-auto px-6 md:px-12 lg:px-20 relative z-10">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center"
        >
          <motion.span
            initial={{ opacity: 0, scale: 0.9 }}
            animate={isVisible ? { opacity: 1, scale: 1 } : {}}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-sage/15 border border-sage/30 text-sage-light text-xs font-medium mb-4"
          >
            <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M9 16.2L4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4L9 16.2z" />
            </svg>
            Ambil Tindakan
          </motion.span>
          <h2 className="font-display text-3xl md:text-5xl font-bold text-cream mb-6 text-glow">
            {actionContent.title}
          </h2>
          <p className="text-lg text-cream/80 mb-4">
            {actionContent.description}
          </p>

          <div className="flex items-center justify-center gap-2 mb-10">
            <motion.div
              className="px-5 py-3 rounded-full bg-sage/15 border border-sage/30 text-sm text-sage-light backdrop-glow"
              whileHover={{ scale: 1.05 }}
            >
              <motion.span
                className="font-bold text-lg"
                key={counter}
                initial={{ scale: 1.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={springTransition}
              >
                {counter}
              </motion.span>
              {" "}orang telah berkomitmen
            </motion.div>
          </div>

          <div className="cs-glass cs-glass-strong cs-glass-rounded-3xl p-8 md:p-12 mb-8 text-left backdrop-glow">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-semibold text-xl text-cream">
                Pilih Komitmenmu Hari Ini:
              </h3>
              <motion.button
                onClick={selectAll}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="text-xs text-sage-light hover:text-cream transition-colors cursor-pointer"
              >
                Pilih Semua
              </motion.button>
            </div>

            <AnimatePresence>
              {counter > 248 && (
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${Math.min((counter - 247) / 10 * 100, 100)}%` }}
                  className="h-1.5 bg-sage/20 rounded-full mb-6 overflow-hidden"
                >
                  <motion.div
                    className="h-full bg-gradient-to-r from-sage to-sage-light rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${Math.min((counter - 247) / 10 * 100, 100)}%` }}
                    transition={{ duration: 0.5, ease: [0.21, 1.02, 0.73, 1] }}
                  />
                </motion.div>
              )}
            </AnimatePresence>

            <ul className="space-y-3">
              {actionContent.commitments.map((commitment, index) => {
                const isSelected = selectedCommitments.includes(index);
                return (
                  <motion.li
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={isVisible ? { opacity: 1, x: 0 } : {}}
                    transition={{ duration: 0.4, delay: 0.2 + index * 0.08, ease: [0.21, 1.02, 0.73, 1] }}
                  >
                    <button
                      onClick={() => toggleCommitment(index)}
                      className={`w-full flex items-start gap-3 p-4 rounded-xl transition-all duration-200 cursor-pointer text-left ${
                        isSelected
                          ? "bg-sage/10 border border-sage/30"
                          : "hover:bg-sage/5 border border-transparent"
                      }`}
                    >
                      <motion.span
                        animate={isSelected ? { scale: [1, 1.3] } : {}}
                        transition={{ type: "spring", stiffness: 200, damping: 15, repeat: isSelected ? 1 : 0, repeatType: "reverse" }}
                        className={`mt-0.5 flex-shrink-0 w-5 h-5 rounded border-2 flex items-center justify-center transition-all duration-200 ${
                          isSelected
                            ? "bg-sage border-sage text-cream"
                            : "border-cream/20"
                        }`}
                      >
                        {isSelected && (
                          <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                            <path
                              fillRule="evenodd"
                              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                              clipRule="evenodd"
                            />
                          </svg>
                        )}
                      </motion.span>
                      <span className="text-cream flex-1">
                        {commitment.text}
                      </span>
                    </button>
                  </motion.li>
                );
              })}
            </ul>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                size="lg"
                onClick={handleAction}
                disabled={hasClicked}
                magnetic
                className={hasClicked ? "bg-sage-light text-cream cursor-default ring-2 ring-sage-light/50" : ""}
              >
                {hasClicked ? "Terima Kasih!" : "Saya Siap Bijak Digital!"}
              </Button>
            </motion.div>

            <AnimatePresence>
              {hasClicked && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={springTransition}
                >
                  <Button size="lg" variant="ghost" onClick={handleShare} magnetic>
                    <span className="flex items-center gap-2">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7s-.04-.47-.09-.7l7.05-4.11c.54.5 1.25.81 2.04.81 1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3c0 .24.04.47.09.7L8.04 9.81C7.5 9.31 6.79 9 6 9c-1.66 0-3 1.34-3 3s1.34 3 3 3c.79 0 1.5-.31 2.04-.81l7.12 4.16c-.05.21-.08.43-.08.65 0 1.61 1.31 2.92 2.92 2.92 1.61 0 2.92-1.31 2.92-2.92s-1.31-2.92-2.92-2.92z" />
                      </svg>
                      Bagikan Komitmen
                    </span>
                  </Button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <AnimatePresence>
            {hasClicked && (
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="text-sage-light mt-6 font-medium"
              >
                Langkah kecil hari ini, perubahan besar untuk masa depan! Mulai
                dari sekarang, kurangi screen time-mu.
              </motion.p>
            )}
          </AnimatePresence>
        </motion.div>
      </Scroll3DWrapper>
    </section>
  );
}
