"use client";
import { memo } from "react";
import { motion } from "framer-motion";

interface DetoxIconProps {
  className?: string;
  animated?: boolean;
}

export default memo(function DetoxIcon({ className = "w-16 h-16", animated = true }: DetoxIconProps) {
  return (
    <motion.svg
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      animate={animated ? { rotate: [0, 5, 0, -5, 0] } : {}}
      transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
    >
      <motion.path
        d="M50 88c-2 0-4-1-5-3-4-8-18-30-18-42 0-12.7 10.3-23 23-23s23 10.3 23 23c0 12-14 34-18 42-1 2-3 3-5 3z"
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
        d="M30 48c0-11 9-20 20-20s20 9 20 20"
        className="stroke-sage-light"
        strokeWidth={2}
        strokeLinecap="round"
        fill="none"
        initial={{ pathLength: 0 }}
        animate={animated ? { pathLength: 1 } : { pathLength: 1 }}
        transition={{ duration: 1.5, delay: 0.5, ease: "easeInOut" }}
      />
      <motion.path
        d="M38 48c0-6.6 5.4-12 12-12s12 5.4 12 12"
        className="stroke-sage"
        strokeWidth={1.5}
        strokeLinecap="round"
        fill="none"
        initial={{ pathLength: 0 }}
        animate={animated ? { pathLength: 1 } : { pathLength: 1 }}
        transition={{ duration: 1.2, delay: 1, ease: "easeInOut" }}
      />
      <motion.path
        d="M50 36v6M47 39h6"
        className="stroke-sage-light"
        strokeWidth={2}
        strokeLinecap="round"
        initial={{ opacity: 0 }}
        animate={animated ? { opacity: 1 } : { opacity: 1 }}
        transition={{ duration: 0.3, delay: 1.5 }}
      />
      <motion.path
        d="M44 56c0-3.3 2.7-6 6-6s6 2.7 6 6"
        className="stroke-sage-light"
        strokeWidth={1.5}
        strokeLinecap="round"
        fill="none"
        initial={{ pathLength: 0 }}
        animate={animated ? { pathLength: 1 } : { pathLength: 1 }}
        transition={{ duration: 1, delay: 1.8, ease: "easeInOut" }}
      />
      <motion.circle
        cx={50}
        cy={64}
        r={2}
        className="fill-sage-light"
        animate={animated ? { opacity: [0.4, 1], scale: [0.8, 1.2] } : {}}
        transition={{ duration: 1.25, repeat: Infinity, repeatType: "reverse", delay: 2 }}
      />
      <motion.path
        d="M40 82c3-2 7-3 10-3s7 1 10 3"
        className="stroke-sage-light"
        strokeWidth={1.5}
        strokeLinecap="round"
        fill="none"
        initial={{ pathLength: 0 }}
        animate={animated ? { pathLength: 1 } : { pathLength: 1 }}
        transition={{ duration: 1, delay: 2.2, ease: "easeInOut" }}
      />
    </motion.svg>
  );
});
