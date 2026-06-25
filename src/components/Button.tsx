"use client";
import { useRef, useState, useCallback } from "react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost";
  size?: "sm" | "md" | "lg";
  children: React.ReactNode;
  magnetic?: boolean;
  loading?: boolean;
}

let buttonRippleId = 0;

export default function Button({
  variant = "primary",
  size = "md",
  className,
  children,
  magnetic = false,
  loading = false,
  disabled,
  onClick,
  ...props
}: ButtonProps) {
  const ref = useRef<HTMLButtonElement>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);
  const [ripples, setRipples] = useState<{ x: number; y: number; id: number }[]>([]);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!ref.current || !magnetic) return;
    const rect = ref.current.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    setMousePos({ x: x * 0.3, y: y * 0.3 });
  }, [magnetic]);

  const handleMouseLeave = useCallback(() => {
    setIsHovered(false);
    setMousePos({ x: 0, y: 0 });
  }, []);

  const handleClick = useCallback((e: React.MouseEvent<HTMLButtonElement>) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const id = ++buttonRippleId;
    setRipples((prev) => [...prev, { x: e.clientX - rect.left, y: e.clientY - rect.top, id }]);
    setTimeout(() => setRipples((prev) => prev.filter((r) => r.id !== id)), 600);
    onClick?.(e);
  }, [onClick]);

  return (
    <motion.button
      ref={ref}
      whileHover={{ scale: 1.03, y: -2 }}
      whileTap={{ scale: 0.97 }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      onClick={handleClick}
      animate={
        magnetic && isHovered
          ? { x: mousePos.x, y: mousePos.y }
          : { x: 0, y: 0 }
      }
      transition={{ type: "spring", stiffness: 150, damping: 15, mass: 0.1 }}
      disabled={disabled || loading}
      className={cn(
        "font-semibold rounded-xl transition-all duration-200 cursor-pointer relative overflow-hidden focus-ring",
        {
          "bg-sage text-cream hover:bg-sage-light": variant === "primary",
          "bg-cream text-ink border-2 border-sage hover:bg-sage-light hover:text-cream": variant === "secondary",
          "bg-transparent text-sage-light hover:bg-sage/10": variant === "ghost",
        },
        {
          "px-4 py-2 text-sm": size === "sm",
          "px-6 py-3 text-base": size === "md",
          "px-8 py-4 text-lg": size === "lg",
        },
        {
          "opacity-50 cursor-not-allowed": disabled || loading,
        },
        className
      )}
      {...(props as React.ComponentPropsWithoutRef<typeof motion.button>)}
    >
      {/* Ripple effects */}
      {ripples.map((ripple) => (
        <motion.span
          key={ripple.id}
          className="absolute w-4 h-4 rounded-full bg-white/20 pointer-events-none"
          style={{ left: ripple.x, top: ripple.y }}
          initial={{ scale: 0, opacity: 0.5 }}
          animate={{ scale: 15, opacity: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        />
      ))}
      <span className={cn("relative z-10 flex items-center justify-center gap-2", loading && "opacity-0")}>
        {children}
      </span>
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin" />
        </div>
      )}
    </motion.button>
  );
}
