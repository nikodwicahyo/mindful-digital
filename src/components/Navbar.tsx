"use client";
import { useEffect, useState, useRef, useCallback } from "react";
import { motion } from "framer-motion";
import { useLenis } from "lenis/react";

const navLinks = [
  { label: "Tentang", href: "#stats" },
  { label: "Video", href: "#video" },
  { label: "Audio", href: "#audio" },
  { label: "Quiz", href: "#quiz" },
  { label: "Aksi", href: "#action" },
];

export default function Navbar() {
  const lenis = useLenis();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("");
  const menuRef = useRef<HTMLDivElement>(null);
  const [menuHeight, setMenuHeight] = useState<number | null>(null);
  const navRef = useRef<HTMLElement>(null);

  const measureMenu = useCallback(() => {
    if (menuRef.current) {
      setMenuHeight(menuRef.current.scrollHeight);
    }
  }, []);

  useEffect(() => {
    measureMenu();
    window.addEventListener("resize", measureMenu);
    return () => window.removeEventListener("resize", measureMenu);
  }, [measureMenu]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const id = `#${entry.target.id}`;
            const found = navLinks.find((link) => link.href === id);
            if (found) {
              setActiveSection(found.href);
            }
          }
        });
      },
      { threshold: 0.3, rootMargin: "-80px 0px 0px 0px" }
    );

    navLinks.forEach((link) => {
      const el = document.querySelector(link.href);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  const handleClick = (href: string) => {
    setMobileOpen(false);
    const el = document.querySelector(href) as HTMLElement | null;
    if (el && lenis) {
      lenis.scrollTo(el, { offset: -80, duration: 1.2 });
    }
  };

  useEffect(() => {
    if (!mobileOpen) return;
    const handleClickOutside = (e: MouseEvent) => {
      if (navRef.current && !navRef.current.contains(e.target as Node)) {
        setMobileOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [mobileOpen]);

  return (
    <nav
      ref={navRef}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? "bg-ink/75 backdrop-blur-xl shadow-lg backdrop-glow border-b border-sage/8"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-20 flex items-center justify-between h-16 md:h-20">
        <a
          href="#"
          onClick={(e) => {
            e.preventDefault();
            if (lenis) {
              lenis.scrollTo(0, { duration: 1.2 });
            }
          }}
          className="font-display text-xl font-bold text-cream tracking-tight hover:text-sage-light transition-colors"
        >
          Mindful<span className="text-sage-light">Digital</span>
        </a>

        <div className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => {
            const isActive = activeSection === link.href;
            return (
              <button
                key={link.href}
                onClick={() => handleClick(link.href)}
                className={`px-4 py-2 text-sm transition-colors rounded-lg relative cursor-pointer ${
                  isActive
                    ? "text-cream"
                    : "text-cream/80 hover:text-cream hover:bg-white/5"
                }`}
              >
                {link.label}
                {isActive && (
                  <motion.span
                    layoutId="activeNav"
                    className="absolute inset-0 bg-white/8 rounded-lg border border-white/5"
                    transition={{ type: "spring", stiffness: 350, damping: 30 }}
                  />
                )}
              </button>
            );
          })}
        </div>

        <button
          onClick={(e) => {
            e.stopPropagation();
            setMobileOpen((prev) => !prev);
          }}
          className="md:hidden relative w-8 h-8 flex items-center justify-center text-cream cursor-pointer z-50"
          aria-label={mobileOpen ? "Tutup menu" : "Buka menu"}
          aria-expanded={mobileOpen}
        >
          <div className="flex flex-col gap-1.5">
            <motion.span
              animate={mobileOpen ? { rotate: 45, y: 6 } : { rotate: 0, y: 0 }}
              className="block w-6 h-0.5 bg-cream rounded-full"
              transition={{ duration: 0.25 }}
            />
            <motion.span
              animate={mobileOpen ? { opacity: 0, scaleX: 0 } : { opacity: 1, scaleX: 1 }}
              className="block w-6 h-0.5 bg-cream rounded-full"
              transition={{ duration: 0.2 }}
            />
            <motion.span
              animate={mobileOpen ? { rotate: -45, y: -6 } : { rotate: 0, y: 0 }}
              className="block w-6 h-0.5 bg-cream rounded-full"
              transition={{ duration: 0.25 }}
            />
          </div>
        </button>
      </div>

      <div
        ref={menuRef}
        className="md:hidden bg-ink/90 backdrop-blur-xl border-t border-sage/10 overflow-hidden transition-[max-height,opacity] duration-300 ease-out"
        style={{
          maxHeight: mobileOpen
            ? menuHeight !== null
              ? `${menuHeight}px`
              : "500px"
            : "0px",
          opacity: mobileOpen ? 1 : 0,
        }}
      >
        <div className="px-6 py-4 flex flex-col gap-1">
          {navLinks.map((link, i) => {
            const isActive = activeSection === link.href;
            return (
              <button
                key={link.href}
                onClick={() => handleClick(link.href)}
                className={`w-full text-left px-4 py-3 rounded-xl transition-all cursor-pointer ${
                  isActive
                    ? "text-cream bg-white/8"
                    : "text-cream/80 hover:text-cream hover:bg-white/5"
                }`}
                style={{
                  opacity: mobileOpen ? 1 : 0,
                  transform: mobileOpen ? "translateX(0)" : "translateX(-10px)",
                  transition: `opacity 0.3s ease ${i * 0.05}s, transform 0.3s ease ${i * 0.05}s`,
                }}
              >
                {link.label}
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
