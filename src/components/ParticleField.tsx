"use client";
import { useEffect, useRef, useCallback, memo } from "react";
import { useReducedMotion } from "@/hooks/useReducedMotion";

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  opacity: number;
  magnetism: number;
}

interface ParticleFieldProps {
  className?: string;
  count?: number;
  color?: string;
  maxSpeed?: number;
  mouseMagnetism?: number;
}

function formatParticleColor(color: string, alpha: number): string {
  if (color.startsWith("rgba") && color.endsWith(",")) {
    return `${color}${alpha})`;
  }
  if (color.startsWith("rgba") && color.endsWith(")")) {
    return color.replace(/[\d.]+\)$/, `${alpha})`);
  }
  return color;
}

export default memo(function ParticleField({
  className = "",
  count = 80,
  color = "rgba(156,184,172,",
  maxSpeed = 0.3,
  mouseMagnetism = 0.05,
}: ParticleFieldProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const mouseRef = useRef({ x: -1000, y: -1000 });
  const rafRef = useRef<number>(0);
  const prefersReduced = useReducedMotion();

  const initParticles = useCallback((w: number, h: number) => {
    const p: Particle[] = [];
    for (let i = 0; i < count; i++) {
      p.push({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * maxSpeed * 2,
        vy: (Math.random() - 0.5) * maxSpeed * 2,
        size: Math.random() * 2 + 0.5,
        opacity: Math.random() * 0.4 + 0.1,
        magnetism: Math.random() * 3 + 0.5,
      });
    }
    particlesRef.current = p;
  }, [count, maxSpeed]);

  useEffect(() => {
    if (prefersReduced) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let w = window.innerWidth;
    let h = window.innerHeight;
    let mouseX = -1000;
    let mouseY = -1000;
    let lastMouseUpdate = 0;

    const resize = () => {
      w = window.innerWidth;
      h = window.innerHeight;
      canvas.width = w;
      canvas.height = h;
      initParticles(w, h);
    };

    const onMouse = (e: MouseEvent) => {
      const now = performance.now();
      if (now - lastMouseUpdate < 16) return; // ~60fps throttle
      lastMouseUpdate = now;
      mouseX = e.clientX;
      mouseY = e.clientY;
      mouseRef.current = { x: mouseX, y: mouseY };
    };

    const onLeave = () => {
      mouseRef.current = { x: -1000, y: -1000 };
    };

    resize();
    window.addEventListener("resize", resize);
    window.addEventListener("mousemove", onMouse, { passive: true });
    window.addEventListener("mouseleave", onLeave, { passive: true });

    const animate = () => {
      ctx.clearRect(0, 0, w, h);
      const mouse = mouseRef.current;

      // Draw connection lines first (behind particles)
      ctx.lineWidth = 0.5;
      for (let i = 0; i < particlesRef.current.length; i++) {
        const p1 = particlesRef.current[i];
        for (let j = i + 1; j < particlesRef.current.length; j++) {
          const p2 = particlesRef.current[j];
          const dx = p1.x - p2.x;
          const dy = p1.y - p2.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 120) {
            const alpha = (1 - dist / 120) * 0.12;
            ctx.strokeStyle = formatParticleColor(color, alpha);
            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.stroke();
          }
        }
      }

      // Update and draw particles
      for (const p of particlesRef.current) {
        const dx = mouse.x - p.x;
        const dy = mouse.y - p.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < 200 && dist > 0) {
          const force = ((200 - dist) / 200) * mouseMagnetism / p.magnetism;
          p.vx += (dx / dist) * force;
          p.vy += (dy / dist) * force;
        }

        p.vx += (Math.random() - 0.5) * 0.02;
        p.vy += (Math.random() - 0.5) * 0.02;

        const speed = Math.sqrt(p.vx * p.vx + p.vy * p.vy);
        if (speed > maxSpeed) {
          p.vx = (p.vx / speed) * maxSpeed;
          p.vy = (p.vy / speed) * maxSpeed;
        }

        p.x += p.vx;
        p.y += p.vy;

        const fadeMargin = 50;
        let alpha = p.opacity;
        if (p.x < fadeMargin) alpha *= p.x / fadeMargin;
        if (p.y < fadeMargin) alpha *= p.y / fadeMargin;
        if (p.x > w - fadeMargin) alpha *= (w - p.x) / fadeMargin;
        if (p.y > h - fadeMargin) alpha *= (h - p.y) / fadeMargin;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = formatParticleColor(color, alpha);
        ctx.fill();

        if (p.x < -10 || p.x > w + 10 || p.y < -10 || p.y > h + 10) {
          p.x = Math.random() * w;
          p.y = Math.random() * h;
          p.vx = (Math.random() - 0.5) * maxSpeed * 2;
          p.vy = (Math.random() - 0.5) * maxSpeed * 2;
        }
      }

      rafRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", onMouse);
      window.removeEventListener("mouseleave", onLeave);
    };
  }, [initParticles, maxSpeed, mouseMagnetism, color, prefersReduced]);

  if (prefersReduced) return null;

  return (
    <canvas
      ref={canvasRef}
      className={`absolute inset-0 pointer-events-none ${className}`}
      aria-hidden="true"
    />
  );
});
