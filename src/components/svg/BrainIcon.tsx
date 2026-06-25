"use client";
import { memo } from "react";
import { motion } from "framer-motion";

interface BrainIconProps {
  className?: string;
  animated?: boolean;
}

export default memo(function BrainIcon({ className = "w-16 h-16", animated = true }: BrainIconProps) {
  return (
    <motion.svg
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      animate={animated ? { scale: [1, 1.03], opacity: [0.8, 1] } : {}}
      transition={{ duration: 2, repeat: Infinity, repeatType: "reverse", ease: "easeInOut" }}
    >
      <motion.path
        d="M50 10C32.33 10 18 24.33 18 42c0 8.28 3.14 15.81 8.29 21.45C28.5 65.8 30 68.2 30 71v7c0 3.31 2.69 6 6 6h28c3.31 0 6-2.69 6-6v-7c0-2.8 1.5-5.2 3.71-7.55A29.94 29.94 0 0082 42c0-17.67-14.33-32-32-32z"
        className="stroke-sage-light"
        strokeWidth={2.5}
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="rgba(156,184,172,0.1)"
        initial={{ pathLength: 0 }}
        animate={animated ? { pathLength: 1 } : { pathLength: 1 }}
        transition={{ duration: 2, ease: "easeInOut" }}
      />
      <motion.path
        d="M35 42c0-8.28 6.72-15 15-15s15 6.72 15 15"
        className="stroke-sage-light"
        strokeWidth={2}
        strokeLinecap="round"
        fill="none"
        initial={{ pathLength: 0 }}
        animate={animated ? { pathLength: 1 } : { pathLength: 1 }}
        transition={{ duration: 1.5, delay: 0.5, ease: "easeInOut" }}
      />
      <motion.path
        d="M40 50c0-5.52 4.48-10 10-10s10 4.48 10 10"
        className="stroke-sage-light"
        strokeWidth={1.5}
        strokeLinecap="round"
        fill="none"
        initial={{ pathLength: 0 }}
        animate={animated ? { pathLength: 1 } : { pathLength: 1 }}
        transition={{ duration: 1.2, delay: 1, ease: "easeInOut" }}
      />
      <motion.circle
        cx={50}
        cy={46}
        r={3}
        className="fill-sage-light"
        animate={animated ? { opacity: [0.3, 1], scale: [0.8, 1.1] } : {}}
        transition={{ duration: 1.5, repeat: Infinity, repeatType: "reverse", ease: "easeInOut", delay: 1.5 }}
      />
      <motion.path
        d="M22 30c-4 2-7 5.5-7 10"
        className="stroke-sage-light"
        strokeWidth={2}
        strokeLinecap="round"
        fill="none"
        initial={{ pathLength: 0 }}
        animate={animated ? { pathLength: 1 } : { pathLength: 1 }}
        transition={{ duration: 1, delay: 0.8, ease: "easeInOut" }}
      />
      <motion.path
        d="M78 30c4 2 7 5.5 7 10"
        className="stroke-sage-light"
        strokeWidth={2}
        strokeLinecap="round"
        fill="none"
        initial={{ pathLength: 0 }}
        animate={animated ? { pathLength: 1 } : { pathLength: 1 }}
        transition={{ duration: 1, delay: 0.8, ease: "easeInOut" }}
      />
    </motion.svg>
  );
});
