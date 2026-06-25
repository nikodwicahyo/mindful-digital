"use client";
import { useCallback, useSyncExternalStore } from "react";

function getReducedMotionQuery(): MediaQueryList | null {
  if (typeof window === "undefined") return null;
  return window.matchMedia("(prefers-reduced-motion: reduce)");
}

export function useReducedMotion() {
  const subscribe = useCallback((callback: () => void) => {
    const mediaQuery = getReducedMotionQuery();
    if (!mediaQuery) return () => {};
    mediaQuery.addEventListener("change", callback);
    return () => mediaQuery.removeEventListener("change", callback);
  }, []);

  const getSnapshot = useCallback(() => {
    const mediaQuery = getReducedMotionQuery();
    return mediaQuery?.matches ?? false;
  }, []);

  return useSyncExternalStore(subscribe, getSnapshot, () => false);
}
