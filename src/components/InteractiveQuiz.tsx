"use client";
import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { quizQuestions, quizResultLevels } from "@/data/content";
import { useQuiz } from "@/hooks/useQuiz";
import Button from "@/components/Button";
import AnimatedBlobs, { defaultPalettes } from "@/components/AnimatedBlobs";
import Scroll3DWrapper from "@/components/Scroll3DWrapper";
import { useScrollReveal } from "@/hooks/useScrollReveal";

async function fireBurst(originX: number, originY: number) {
  const confetti = (await import("canvas-confetti")).default;
  confetti({
    particleCount: 25,
    spread: 45,
    origin: { x: originX, y: originY },
    colors: ["#3D5A50", "#9CB8AC", "#F5F1E8", "#FF5A36"],
    shapes: ["circle", "square"],
    ticks: 80,
  });
}

function CircularProgress({ progress, size = 120 }: { progress: number; size?: number }) {
  const strokeWidth = 7;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - progress * circumference;

  return (
    <svg width={size} height={size} className="transform -rotate-90">
      <defs>
        <linearGradient id="progressGlow" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#3D5A50" />
          <stop offset="100%" stopColor="#9CB8AC" />
        </linearGradient>
        <filter id="glow">
          <feGaussianBlur stdDeviation="2" result="coloredBlur" />
          <feMerge>
            <feMergeNode in="coloredBlur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        stroke="rgba(255,255,255,0.06)"
        strokeWidth={strokeWidth}
        fill="none"
      />
      <motion.circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        stroke="url(#progressGlow)"
        strokeWidth={strokeWidth}
        fill="none"
        strokeLinecap="round"
        filter="url(#glow)"
        initial={{ strokeDashoffset: circumference }}
        animate={{ strokeDashoffset: offset }}
        transition={{ duration: 0.6, ease: [0.21, 1.02, 0.73, 1] }}
      />
    </svg>
  );
}

function FloatingQuestionMarks() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
      {["?", "?", "?", "?"].map((char, i) => (
        <motion.span
          key={i}
          className="absolute text-sage-light/5 font-display font-bold text-4xl"
          style={{ left: `${15 + i * 25}%`, top: `${20 + (i % 2) * 40}%` }}
          animate={{ y: [0, -20], opacity: [0.05, 0.1] }}
          transition={{ duration: 2 + i * 0.75, repeat: Infinity, repeatType: "reverse", delay: i * 0.8, ease: "easeInOut" }}
        >
          {char}
        </motion.span>
      ))}
    </div>
  );
}

const springTransition = {
  type: "spring" as const,
  stiffness: 200,
  damping: 24,
  mass: 0.8,
};

const cardVariants = {
  initial: { opacity: 0, x: 60, rotateY: 8, scale: 0.97 },
  animate: { opacity: 1, x: 0, rotateY: 0, scale: 1 },
  exit: { opacity: 0, x: -60, rotateY: -8, scale: 0.97 },
};

export default function InteractiveQuiz() {
  const { ref, isVisible } = useScrollReveal({ threshold: 0.1 });
  const { currentQuestion, score, selectAnswer, reset } = useQuiz();
  const [showResult, setShowResult] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [answered, setAnswered] = useState(false);
  const [ripple, setRipple] = useState<{ x: number; y: number } | null>(null);

  const handleAnswer = useCallback((optionIndex: number, e: React.MouseEvent) => {
    if (answered) return;

    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setRipple({ x, y });

    setSelectedIndex(optionIndex);
    setAnswered(true);

    const originX = (rect.left + rect.width * 0.5) / window.innerWidth;
    const originY = (rect.top + rect.height * 0.5) / window.innerHeight;
    fireBurst(originX, originY);

    const isLast = currentQuestion >= quizQuestions.length - 1;

    setTimeout(() => {
      selectAnswer(optionIndex);
      setSelectedIndex(null);
      setAnswered(false);
      setRipple(null);
      if (isLast) {
        setTimeout(async () => {
          setShowResult(true);
          const confetti = (await import("canvas-confetti")).default;
          const end = Date.now() + 2000;
          const frame = () => {
            confetti({
              particleCount: 3, angle: 60, spread: 55, origin: { x: 0, y: 0.6 },
              colors: ["#3D5A50", "#9CB8AC", "#F5F1E8", "#FF5A36"],
            });
            confetti({
              particleCount: 3, angle: 120, spread: 55, origin: { x: 1, y: 0.6 },
              colors: ["#FF5A36", "#9CB8AC", "#F5F1E8", "#3D5A50"],
            });
            if (Date.now() < end) requestAnimationFrame(frame);
          };
          frame();
        }, 400);
      }
    }, 600);
  }, [answered, currentQuestion, selectAnswer]);

  const getResult = () =>
    quizResultLevels.find((l) => score >= l.min && score <= l.max) ||
    quizResultLevels[quizResultLevels.length - 1];

  const handleReset = () => {
    setShowResult(false);
    setSelectedIndex(null);
    setAnswered(false);
    reset();
  };

  const handleShare = () => {
    const result = getResult();
    const text = `Ikutan quiz MindfulDigital — Skorku: ${score}/${quizQuestions.length * 3} (${result.title}). Cek kebiasaan digitalmu di mindful-digital.vercel.app #BijakDigital #BrainRot`;
    if (navigator.share) {
      navigator.share({ title: "MindfulDigital Quiz", text }).catch(() => { });
    } else {
      navigator.clipboard.writeText(text).catch(() => { });
    }
  };

  const progress = showResult ? 1 : currentQuestion / quizQuestions.length;

  return (
    <section id="quiz" className="bg-mesh-sage animate-gradient-rotate bg-ink py-20 md:py-32 relative overflow-hidden">
      <AnimatedBlobs colors={defaultPalettes.dark} count={4} />
      <FloatingQuestionMarks />
      <Scroll3DWrapper className="max-w-3xl mx-auto px-6 md:px-12 lg:px-20 relative z-10">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
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
              <path d="M11 18h2v-2h-2v2zm1-16C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm0-14c-2.21 0-4 1.79-4 4h2c0-1.1.9-2 2-2s2 .9 2 2c0 2-3 1.75-3 5h2c0-2.25 3-2.5 3-5 0-2.21-1.79-4-4-4z" />
            </svg>
            Interaktif Quiz
          </motion.span>
          <h2 className="font-display text-3xl md:text-5xl font-bold text-cream mb-4 text-glow">
            Quiz: Seberapa Bijak Digital Kamu?
          </h2>
          <p className="text-cream/85 text-lg">
            Jawab pertanyaan berikut untuk mengetahui tingkat ketergantungan teknologimu.
          </p>
        </motion.div>

        {/* Progress ring */}
        <div className="flex justify-center mb-8">
          <div className="relative">
            <CircularProgress progress={progress} size={96} />
            <div className="absolute inset-0 flex items-center justify-center">
              <motion.span
                className="text-sm font-semibold text-cream"
                key={Math.round(progress * 100)}
                initial={{ scale: 1.3, opacity: 0.5 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={springTransition}
              >
                {Math.round(progress * 100)}%
              </motion.span>
            </div>
          </div>
        </div>

        <AnimatePresence mode="wait">
          {!showResult ? (
            <motion.div
              key={currentQuestion}
              variants={cardVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={springTransition}
              className="cs-glass cs-glass-strong cs-glass-rounded-3xl p-8 md:p-12"
              style={{ transformStyle: "preserve-3d" }}
            >
              <div className="flex justify-between items-center mb-6">
                <span className="text-sm text-cream/75">
                  Pertanyaan {currentQuestion + 1} / {quizQuestions.length}
                </span>
                <span className="text-sm font-semibold text-sage-light">
                  Skor: {score}
                </span>
              </div>

              <h3 className="text-xl md:text-2xl font-semibold text-cream mb-8">
                {quizQuestions[currentQuestion].question}
              </h3>

              <div className="space-y-3">
                {quizQuestions[currentQuestion].options.map((option, index) => {
                  const isSelected = selectedIndex === index;
                  const bgClass = answered && isSelected
                    ? "border-sage bg-sage/10"
                    : "border-white/10 hover:border-sage/40 hover:bg-white/5";

                  return (
                    <motion.button
                      key={index}
                      layout
                      whileHover={!answered ? { scale: 1.02, x: 6 } : {}}
                      whileTap={!answered ? { scale: 0.98 } : {}}
                      onClick={(e) => handleAnswer(index, e)}
                      className={`w-full text-left p-4 md:p-5 rounded-xl border-2 transition-colors duration-200 cursor-pointer relative overflow-hidden ${bgClass}`}
                      disabled={answered}
                    >
                      <span className="font-medium text-cream/90">
                        {option.text}
                      </span>
                      {ripple && isSelected && (
                        <motion.span
                          className="absolute w-4 h-4 rounded-full bg-white/10"
                          style={{ left: ripple.x, top: ripple.y }}
                          initial={{ scale: 0, opacity: 0.5 }}
                          animate={{ scale: 40, opacity: 0 }}
                          transition={{ duration: 0.6, ease: "easeOut" }}
                        />
                      )}
                    </motion.button>
                  );
                })}
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="result"
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={springTransition}
              className="cs-glass cs-glass-strong cs-glass-rounded-3xl p-8 md:p-12 text-center"
            >
              <div className="flex justify-center mb-6">
                <CircularProgress progress={1} size={120} />
              </div>

              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 200, damping: 15 }}
                className="text-5xl mb-4"
              >
                {getResult().emoji}
              </motion.div>

              <h3 className={`text-3xl md:text-4xl font-bold mb-2 ${getResult().color} text-glow-strong`}>
                {getResult().title}
              </h3>
              <p className="text-xl text-cream/80 mb-2">
                Skor kamu: {score} / {quizQuestions.length * 3}
              </p>
              <p className="text-lg text-cream/85 mb-8 max-w-xl mx-auto">
                {getResult().description}
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button onClick={handleReset} variant="secondary">
                  Ulangi Quiz
                </Button>
                <Button onClick={handleShare} variant="primary">
                  <span className="flex items-center gap-2 justify-center">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7s-.04-.47-.09-.7l7.05-4.11c.54.5 1.25.81 2.04.81 1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3c0 .24.04.47.09.7L8.04 9.81C7.5 9.31 6.79 9 6 9c-1.66 0-3 1.34-3 3s1.34 3 3 3c.79 0 1.5-.31 2.04-.81l7.12 4.16c-.05.21-.08.43-.08.65 0 1.61 1.31 2.92 2.92 2.92 1.61 0 2.92-1.31 2.92-2.92s-1.31-2.92-2.92-2.92z" />
                    </svg>
                    Bagikan Hasil
                  </span>
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </Scroll3DWrapper>
    </section>
  );
}
