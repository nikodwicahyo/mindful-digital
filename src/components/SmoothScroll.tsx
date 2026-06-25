"use client";
import { ReactLenis } from "lenis/react";
import type { LenisRef } from "lenis/react";
import { cancelFrame, frame } from "framer-motion";
import { useEffect, useRef, useMemo } from "react";

export default function SmoothScroll({
  children,
}: {
  children: React.ReactNode;
}) {
  const lenisRef = useRef<LenisRef>(null);

  useEffect(() => {
    function update(data: { timestamp: number }) {
      lenisRef.current?.lenis?.raf(data.timestamp);
    }
    frame.update(update, true);
    return () => cancelFrame(update);
  }, []);

  const options = useMemo(() => ({
    autoRaf: false,
    lerp: 0.08,
    duration: 1.4,
    smoothWheel: true,
  }), []);

  return (
    <ReactLenis
      ref={lenisRef}
      root
      options={options}
    >
      {children}
    </ReactLenis>
  );
}
