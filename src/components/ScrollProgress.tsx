"use client";
import { motion, useScroll, useSpring } from "framer-motion";

export default function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  return (
    <div className="fixed top-0 left-0 right-0 h-1 z-[60]">
      <motion.div
        style={{ scaleX }}
        className="h-full bg-gradient-to-r from-sage via-sage-light to-cream origin-left"
      />
      {/* Shimmer overlay */}
      <motion.div
        className="absolute inset-0 h-full bg-gradient-to-r from-transparent via-white/25 to-transparent"
        animate={{ x: ["-100%", "200%"] }}
        transition={{ duration: 2.5, repeat: Infinity, ease: "linear", repeatDelay: 1 }}
      />
    </div>
  );
}
