"use client";
import { motion } from "framer-motion";

interface CheckmarkCelebrationProps {
  className?: string;
  animated?: boolean;
}

export default function CheckmarkCelebration({ className = "w-12 h-12", animated = true }: CheckmarkCelebrationProps) {
  return (
    <motion.svg
      viewBox="0 0 60 60"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      animate={animated ? { scale: [1, 1.1] } : {}}
      transition={{ duration: 1, repeat: Infinity, repeatType: "reverse", ease: "easeInOut" }}
    >
      <motion.circle
        cx={30}
        cy={30}
        r={28}
        className="stroke-emerald-400"
        strokeWidth={2.5}
        fill="rgba(52,211,153,0.1)"
        initial={{ pathLength: 0 }}
        animate={animated ? { pathLength: 1 } : { pathLength: 1 }}
        transition={{ duration: 0.8, ease: "easeInOut" }}
      />
      <motion.path
        d="M18 30l8 8 16-16"
        className="stroke-emerald-400"
        strokeWidth={3}
        strokeLinecap="round"
        strokeLinejoin="round"
        initial={{ pathLength: 0 }}
        animate={animated ? { pathLength: 1 } : { pathLength: 1 }}
        transition={{ duration: 0.6, delay: 0.3, ease: "easeInOut" }}
      />
      {animated && [0, 1, 2, 3, 4, 5].map((i) => {
        const angle = (i / 6) * 360;
        const rad = (angle * Math.PI) / 180;
        const r = 20;
        return (
          <motion.circle
            key={i}
            cx={30 + r * Math.cos(rad)}
            cy={30 + r * Math.sin(rad)}
            r={2}
            className="fill-emerald-400/60"
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: [0, 1], scale: [0, 1] }}
            transition={{
              duration: 0.75,
              repeat: Infinity,
              repeatType: "reverse",
              delay: 0.6 + i * 0.15,
              ease: "easeInOut",
            }}
          />
        );
      })}
    </motion.svg>
  );
}
