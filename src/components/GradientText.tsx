"use client";
import { memo } from "react";
import { motion } from "framer-motion";

interface GradientTextProps {
  children: React.ReactNode;
  className?: string;
  as?: "h1" | "h2" | "h3" | "span" | "p";
  from?: string;
  via?: string;
  to?: string;
  animate?: boolean;
}

export default memo(function GradientText({
  children,
  className = "",
  as: Tag = "span",
  from = "var(--color-sage-light)",
  via = "var(--color-cream)",
  to = "var(--color-sage)",
  animate = true,
}: GradientTextProps) {
  return (
    <Tag
      className={`bg-clip-text text-transparent ${className}`}
      style={{
        backgroundImage: `linear-gradient(135deg, ${from}, ${via}, ${to})`,
        backgroundSize: animate ? "200% 200%" : undefined,
      }}
    >
      {animate ? (
        <motion.span
          className="inline-block"
          animate={{ backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          style={{
            backgroundImage: `linear-gradient(135deg, ${from}, ${via}, ${to})`,
            backgroundSize: "200% 200%",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
          }}
        >
          {children}
        </motion.span>
      ) : (
        children
      )}
    </Tag>
  );
});
