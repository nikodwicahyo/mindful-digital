"use client";
import { useRef, memo } from "react";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import { useReducedMotion } from "@/hooks/useReducedMotion";

interface Scroll3DWrapperProps {
  children: React.ReactNode;
  className?: string;
  intensityX?: number;
  intensityY?: number;
  opacity?: boolean;
}

export default memo(function Scroll3DWrapper({
  children,
  className = "",
  intensityX = 2,
  intensityY = 1.5,
  opacity = true,
}: Scroll3DWrapperProps) {
  const ref = useRef<HTMLDivElement>(null);
  const prefersReduced = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const rawRotateX = useTransform(
    scrollYProgress,
    [0, 0.5, 1],
    [intensityX, 0, -intensityX]
  );

  const rawRotateY = useTransform(
    scrollYProgress,
    [0, 0.5, 1],
    [-intensityY, 0, intensityY]
  );

  const rawTranslateZ = useTransform(
    scrollYProgress,
    [0, 0.5, 1],
    [-15, 0, -15]
  );

  const rawOpacity = useTransform(
    scrollYProgress,
    [0, 0.15, 0.5, 0.85, 1],
    [0.3, 1, 1, 1, 0.3]
  );

  const rotateX = useSpring(rawRotateX, {
    stiffness: 60,
    damping: 25,
    restDelta: 0.001,
  });

  const rotateY = useSpring(rawRotateY, {
    stiffness: 50,
    damping: 22,
    restDelta: 0.001,
  });

  const translateZ = useSpring(rawTranslateZ, {
    stiffness: 60,
    damping: 25,
    restDelta: 0.001,
  });

  const opacityValue = useSpring(rawOpacity, {
    stiffness: 80,
    damping: 30,
    restDelta: 0.001,
  });

  if (prefersReduced) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      ref={ref}
      style={{
        perspective: "1200px",
        rotateX,
        rotateY,
        z: translateZ,
        opacity: opacity ? opacityValue : undefined,
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
});
