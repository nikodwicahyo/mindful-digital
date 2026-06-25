"use client";
import { motion } from "framer-motion";
import { stats } from "@/data/content";
import AnimatedBlobs, { defaultPalettes } from "@/components/AnimatedBlobs";
import BrainIcon from "@/components/svg/BrainIcon";
import ScreenIcon from "@/components/svg/ScreenIcon";
import DetoxIcon from "@/components/svg/DetoxIcon";
import Scroll3DWrapper from "@/components/Scroll3DWrapper";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { useCountUp } from "@/hooks/useCountUp";

const iconMap = {
  brain: BrainIcon,
  screen: ScreenIcon,
  detox: DetoxIcon,
} as const;

interface StatCardProps {
  number: number;
  suffix: string;
  label: string;
  source: string;
  icon: keyof typeof iconMap;
  index: number;
}

function StatCard({ number, suffix, label, source, icon, index }: StatCardProps) {
  const { ref, isVisible } = useScrollReveal({ threshold: 0.3 });
  const count = useCountUp(number, 1500, isVisible);
  const Icon = iconMap[icon];

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50, rotateY: 15 }}
      animate={isVisible ? { opacity: 1, y: 0, rotateY: 0 } : {}}
      transition={{ duration: 0.7, delay: index * 0.18, ease: [0.21, 1.02, 0.73, 1] }}
      whileHover={{ y: -10, scale: 1.03 }}
      className="relative group"
      style={{ transformStyle: "preserve-3d" }}
    >
      {/* Gradient background */}
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-sage/20 via-sage-dark/15 to-ink/40 opacity-100" />
      <div className="absolute inset-0 rounded-2xl border border-sage/30" />

      {/* Content */}
      <div className="relative p-8 text-center">
        {/* Icon */}
        <motion.div
          className="flex justify-center mb-4"
          animate={isVisible ? { y: [0, -4, 0] } : {}}
          transition={{ duration: 3, repeat: Infinity, delay: index * 0.5, ease: "easeInOut" }}
        >
          <div className="w-16 h-16 rounded-xl bg-sage/20 flex items-center justify-center">
            <Icon className="w-8 h-8 text-sage-light" />
          </div>
        </motion.div>

        {/* Number with progress ring */}
        <motion.div
          className="mb-4"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={isVisible ? { scale: 1, opacity: 1 } : {}}
          transition={{ duration: 0.5, delay: 0.3 + index * 0.18 }}
        >
          <span className="text-5xl md:text-6xl font-display font-bold text-cream">
            {count}
            <span className="text-3xl md:text-4xl text-sage-light">{suffix}</span>
          </span>
        </motion.div>

        {/* Label */}
        <p className="text-cream/90 text-sm md:text-base mb-3 leading-relaxed">{label}</p>

        {/* Source */}
        <div className="flex items-center justify-center gap-1.5">
          <span className="w-1 h-1 rounded-full bg-sage-light/60" />
          <p className="text-xs text-sage-light/80 font-medium">{source}</p>
        </div>
      </div>

      {/* Hover glow effect */}
      <motion.div
        className="absolute -inset-px rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        style={{
          background: "linear-gradient(135deg, rgba(156,184,172,0.15) 0%, transparent 50%, rgba(156,184,172,0.08) 100%)",
        }}
      />
    </motion.div>
  );
}

export default function StatStrip() {
  return (
    <section id="stats" className="bg-mesh-sage animate-gradient-rotate bg-ink py-16 md:py-24 relative overflow-hidden">
      <AnimatedBlobs colors={defaultPalettes.dark} count={3} />
      <Scroll3DWrapper className="max-w-7xl mx-auto px-6 md:px-12 lg:px-20 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <motion.span
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-sage/15 border border-sage/30 text-sage-light text-xs font-medium mb-4"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-sage-light animate-pulse-glow" />
            Data & Fakta Terbaru 2025-2026
          </motion.span>
          <h2 className="font-display text-3xl md:text-4xl font-bold text-cream mb-3 text-glow">
            Indonesia&apos;s Digital Crisis
          </h2>
          <p className="text-cream/85 text-lg max-w-2xl mx-auto">
            Data terbaru menunjukkan urgensi untuk lebih bijak dalam menggunakan teknologi.
          </p>
        </motion.div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {stats.map((stat, index) => (
            <StatCard key={index} {...stat} index={index} />
          ))}
        </div>
      </Scroll3DWrapper>
    </section>
  );
}
