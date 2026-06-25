"use client";
import { memo } from "react";
import { motion } from "framer-motion";

interface ScreenIconProps {
  className?: string;
  animated?: boolean;
}

export default memo(function ScreenIcon({ className = "w-16 h-16", animated = true }: ScreenIconProps) {
  return (
    <motion.svg
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      animate={animated ? { y: [0, -3, 0] } : {}}
      transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
    >
      <motion.rect
        x={15}
        y={20}
        width={70}
        height={50}
        rx={6}
        className="stroke-sage-light"
        strokeWidth={2.5}
        fill="rgba(156,184,172,0.08)"
        initial={{ pathLength: 0 }}
        animate={animated ? { pathLength: 1 } : { pathLength: 1 }}
        transition={{ duration: 1.5, ease: "easeInOut" }}
      />
      <motion.line
        x1={30}
        y1={70}
        x2={70}
        y2={70}
        className="stroke-sage-light"
        strokeWidth={2.5}
        strokeLinecap="round"
        initial={{ pathLength: 0 }}
        animate={animated ? { pathLength: 1 } : { pathLength: 1 }}
        transition={{ duration: 1, delay: 0.3, ease: "easeInOut" }}
      />
      <motion.line
        x1={45}
        y1={75}
        x2={55}
        y2={75}
        className="stroke-sage-light"
        strokeWidth={2.5}
        strokeLinecap="round"
        initial={{ pathLength: 0 }}
        animate={animated ? { pathLength: 1 } : { pathLength: 1 }}
        transition={{ duration: 0.8, delay: 0.5, ease: "easeInOut" }}
      />
      <motion.rect
        x={25}
        y={30}
        width={50}
        height={28}
        rx={3}
        className="fill-sage-light/20 stroke-sage-light"
        strokeWidth={1.5}
        initial={{ opacity: 0 }}
        animate={animated ? { opacity: 1 } : { opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.7 }}
      />
      <motion.circle
        cx={50}
        cy={44}
        r={6}
        className="fill-sage-light/30 stroke-sage-light"
        strokeWidth={1.5}
        initial={{ scale: 0 }}
        animate={animated ? { scale: 1 } : { scale: 1 }}
        transition={{ duration: 0.5, delay: 1, type: "spring" }}
      />
      <motion.path
        d="M50 41v6M47 44h6"
        className="stroke-sage-light"
        strokeWidth={2}
        strokeLinecap="round"
        initial={{ opacity: 0 }}
        animate={animated ? { opacity: 1 } : { opacity: 1 }}
        transition={{ duration: 0.3, delay: 1.3 }}
      />
      <motion.circle
        cx={35}
        cy={38}
        r={1.5}
        className="fill-sage-light/50"
        animate={animated ? { opacity: [0.3, 0.8] } : {}}
        transition={{ duration: 1, repeat: Infinity, repeatType: "reverse", delay: 1.5 }}
      />
      <motion.circle
        cx={65}
        cy={38}
        r={1.5}
        className="fill-sage-light/50"
        animate={animated ? { opacity: [0.3, 0.8] } : {}}
        transition={{ duration: 1, repeat: Infinity, repeatType: "reverse", delay: 1.8 }}
      />
    </motion.svg>
  );
});
