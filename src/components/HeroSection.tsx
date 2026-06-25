"use client";
import { useRef, useState, useEffect, useCallback, useMemo, memo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { heroContent } from "@/data/content";
import Button from "@/components/Button";
import GradientText from "@/components/GradientText";
import TypewriterText from "@/components/TypewriterText";
import ParticleField from "@/components/ParticleField";
import AnimatedBlobs, { defaultPalettes } from "@/components/AnimatedBlobs";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { useMousePosition } from "@/hooks/useMousePosition";

const MemoizedParticleField = memo(ParticleField);
const MemoizedAnimatedBlobs = memo(AnimatedBlobs);

const FloatingShapes = memo(function FloatingShapes({ reduced }: { reduced: boolean }) {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
      {/* Wireframe cube */}
      <motion.div
        className="absolute top-[15%] right-[10%] w-16 h-16 md:w-24 md:h-24"
        style={{ transformStyle: "preserve-3d", perspective: "600px" }}
        animate={reduced ? {} : { rotateX: [0, 360], rotateY: [0, 360] }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
      >
        <div className="absolute inset-0 border border-sage-light/20 rounded-sm" style={{ transform: "translateZ(24px)" }} />
        <div className="absolute inset-0 border border-sage-light/15 rounded-sm" style={{ transform: "translateZ(-24px)" }} />
        <div className="absolute inset-0 border border-sage-light/20 rounded-sm" style={{ transform: "rotateY(90deg) translateZ(24px)" }} />
        <div className="absolute inset-0 border border-sage-light/15 rounded-sm" style={{ transform: "rotateY(90deg) translateZ(-24px)" }} />
        <div className="absolute inset-0 border border-sage-light/20 rounded-sm" style={{ transform: "rotateX(90deg) translateZ(24px)" }} />
        <div className="absolute inset-0 border border-sage-light/15 rounded-sm" style={{ transform: "rotateX(90deg) translateZ(-24px)" }} />
      </motion.div>

      {/* Floating ring */}
      <motion.div
        className="absolute bottom-[20%] left-[8%] w-12 h-12 md:w-20 md:h-20 rounded-full border border-sage/25"
        animate={reduced ? {} : { y: [0, -25, 0], rotateX: [0, 45, 0], rotateZ: [0, 180, 360] }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
        style={{ transformStyle: "preserve-3d" }}
      />

      {/* Small floating diamond */}
      <motion.div
        className="absolute top-[45%] left-[5%] w-6 h-6 md:w-8 md:h-8 border border-sage-light/20 rotate-45"
        animate={reduced ? {} : { y: [0, -15], rotate: [45, 135], scale: [1, 1.2] }}
        transition={{ duration: 4, repeat: Infinity, repeatType: "reverse", ease: "easeInOut", delay: 2 }}
      />

      {/* Floating triangle wireframe */}
      <motion.div
        className="absolute top-[25%] left-[20%] w-10 h-10 md:w-14 md:h-14"
        animate={reduced ? {} : { y: [0, -20, 0], rotateZ: [0, 120, 0] }}
        transition={{ duration: 15, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        style={{ transformStyle: "preserve-3d" }}
      >
        <svg viewBox="0 0 40 40" fill="none" className="w-full h-full">
          <path d="M20 4L36 36H4L20 4Z" stroke="rgba(156,184,172,0.2)" strokeWidth="1" />
        </svg>
      </motion.div>
    </div>
  );
});

export default function HeroSection() {
  const prefersReduced = useReducedMotion();
  const mouse = useMousePosition();
  const heroRef = useRef<HTMLDivElement>(null);
  const [tickerIndex, setTickerIndex] = useState(0);

  useEffect(() => {
    if (prefersReduced) return;
    const interval = setInterval(() => {
      setTickerIndex((prev) => (prev + 1) % heroContent.tickerStats.length);
    }, 3500);
    return () => clearInterval(interval);
  }, [prefersReduced]);

  const parallax = useMemo(() => {
    if (prefersReduced || !mouse) {
      return { tiltX: 0, tiltY: 0, layer1X: 0, layer1Y: 0, layer2X: 0, layer2Y: 0, layer3X: 0, layer3Y: 0 };
    }
    const mx = mouse.x / window.innerWidth - 0.5;
    const my = mouse.y / window.innerHeight - 0.5;
    return {
      tiltX: my * 6,
      tiltY: mx * 6,
      layer1X: mx * -15,
      layer1Y: my * -15,
      layer2X: mx * -8,
      layer2Y: my * -8,
      layer3X: mx * -20,
      layer3Y: my * -20,
    };
  }, [prefersReduced, mouse]);

  const handleCtaClick = useCallback(() => {
    document.getElementById("stats")?.scrollIntoView({ behavior: "smooth" });
  }, []);

  const ticker = heroContent.tickerStats[tickerIndex];

  return (
    <section
      ref={heroRef}
      id="hero"
      className="relative min-h-screen flex items-center justify-center bg-mesh-sage animate-gradient-rotate bg-ink overflow-hidden"
    >
      {/* Aurora background layer */}
      <div className="absolute inset-0 bg-aurora opacity-40" aria-hidden="true" />

      {/* Depth layer 3: far background blobs */}
      <motion.div style={{ x: parallax.layer3X, y: parallax.layer3Y }} transition={{ type: "spring", stiffness: 30, damping: 20 }}>
        <MemoizedAnimatedBlobs colors={defaultPalettes.hero} count={5} />
      </motion.div>

      {/* Depth layer 2: mid-ground particles */}
      <motion.div className="absolute inset-0" style={{ x: parallax.layer2X, y: parallax.layer2Y }} transition={{ type: "spring", stiffness: 40, damping: 20 }}>
        <MemoizedParticleField count={80} color="rgba(156,184,172," />
      </motion.div>

      {/* Depth layer 1: foreground grain */}
      <div className="absolute inset-0 animate-grain" />

      {/* Parallax blur orbs */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          style={{ x: parallax.layer2X, y: parallax.layer2Y }}
          transition={{ type: "spring", stiffness: 50, damping: 20 }}
          className="absolute -top-20 -left-20 w-96 h-96 rounded-full bg-sage/8 blur-3xl parallax-layer-2"
        />
        <motion.div
          style={{ x: parallax.layer1X, y: parallax.layer1Y }}
          transition={{ type: "spring", stiffness: 50, damping: 20 }}
          className="absolute top-1/3 right-10 w-72 h-72 rounded-full bg-sage-light/6 blur-3xl parallax-layer-1"
        />
        <motion.div
          style={{ x: parallax.layer2X, y: parallax.layer2Y }}
          transition={{ type: "spring", stiffness: 50, damping: 20 }}
          className="absolute bottom-20 left-1/4 w-64 h-64 rounded-full bg-primary/8 blur-3xl parallax-layer-2"
        />
      </div>

      {/* CSS orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="cs-orb cs-orb-lg cs-orb-sage absolute -top-20 -left-20 opacity-25 motion-reduce:cs-orb-slow animate-orb-float" />
        <div className="cs-orb cs-orb-md cs-orb-cream absolute top-1/3 right-10 opacity-15 motion-reduce:cs-orb-slow animate-orb-float" style={{ animationDelay: "-4s" }} />
        <div className="cs-orb cs-orb-sm cs-orb-sage-light absolute bottom-20 left-1/4 opacity-20 motion-reduce:cs-orb-slow animate-orb-float" style={{ animationDelay: "-8s" }} />
      </div>

      {/* 3D floating shapes */}
      <FloatingShapes reduced={prefersReduced} />

      {/* Main content card */}
      <motion.div
        style={
          prefersReduced ? {} : { perspective: "1200px", rotateX: parallax.tiltX, rotateY: parallax.tiltY }
        }
        transition={{ type: "spring", stiffness: 120, damping: 15 }}
        className="relative z-10 text-center px-6 max-w-4xl mx-auto"
      >
        <motion.div
          initial={{ opacity: 0, y: 40, scale: 0.95, rotateX: 8 }}
          animate={{ opacity: 1, y: 0, scale: 1, rotateX: 0 }}
          transition={{ duration: 0.9, ease: [0.21, 1.02, 0.73, 1] }}
          className="cs-glass cs-glass-strong cs-glass-rounded-2xl p-8 md:p-12 lg:p-16 backdrop-glow"
          style={{ transformStyle: "preserve-3d" }}
        >
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="flex items-center justify-center gap-2 mb-6"
          >
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-sage/15 border border-sage/25 text-sage-light text-xs font-medium">
              <motion.span
                className="w-2 h-2 rounded-full bg-sage-light"
                animate={{ scale: [1, 1.5], opacity: [0.7, 1] }}
                transition={{ duration: 1, repeat: Infinity, repeatType: "reverse" }}
              />
              Oxford Word of the Year 2024
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.15, ease: [0.21, 1.02, 0.73, 1] }}
            className="font-display text-5xl md:text-7xl lg:text-8xl font-bold mb-4 text-glow"
          >
            <GradientText
              from="#9CB8AC"
              via="#F5F1E8"
              to="#3D5A50"
              className="text-5xl md:text-7xl lg:text-8xl"
            >
              {heroContent.title}
            </GradientText>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3, ease: [0.21, 1.02, 0.73, 1] }}
            className="font-serif text-2xl md:text-3xl text-sage-light mb-4 text-glow"
          >
            {heroContent.subtitle}
          </motion.p>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.45 }}
            className="text-lg md:text-xl text-cream/75 mb-8 max-w-2xl mx-auto h-8"
          >
            <TypewriterText
              text={heroContent.tagline}
              speed={35}
              delay={1200}
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6, ease: [0.21, 1.02, 0.73, 1] }}
            className="flex flex-col items-center gap-4"
          >
            <Button size="lg" onClick={handleCtaClick} magnetic>
              {heroContent.ctaText}
            </Button>

            <div className="h-8 flex items-center">
              <AnimatePresence mode="wait">
                <motion.div
                  key={tickerIndex}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.4, ease: [0.21, 1.02, 0.73, 1] }}
                  className="text-cream/55 text-sm flex items-center gap-1.5"
                >
                  <span className="inline-flex items-center gap-1">
                    <motion.span
                      className="font-bold text-sage-light"
                      initial={{ scale: 0.5 }}
                      animate={{ scale: 1 }}
                      key={`val-${tickerIndex}`}
                    >
                      {ticker.value}{ticker.suffix}
                    </motion.span>
                    <span>{ticker.label}</span>
                  </span>
                </motion.div>
              </AnimatePresence>
            </div>
          </motion.div>
        </motion.div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        animate={prefersReduced ? {} : { y: [0, 10, 0] }}
        transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 z-10"
      >
        <motion.div
          className="w-7 h-11 border-2 border-cream/30 rounded-full flex justify-center pt-2"
          animate={{ borderColor: ["rgba(245,241,232,0.3)", "rgba(156,184,172,0.5)", "rgba(245,241,232,0.3)"] }}
          transition={{ duration: 3, repeat: Infinity }}
        >
          <motion.div
            animate={prefersReduced ? {} : { y: [0, 14, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
            className="w-1.5 h-1.5 bg-cream rounded-full"
          />
        </motion.div>
        <motion.span
          className="block text-center text-[10px] text-cream/30 mt-2 tracking-widest uppercase"
          animate={{ opacity: [0.3, 0.6] }}
          transition={{ duration: 1.5, repeat: Infinity, repeatType: "reverse" }}
        >
          Scroll
        </motion.span>
      </motion.div>
    </section>
  );
}
