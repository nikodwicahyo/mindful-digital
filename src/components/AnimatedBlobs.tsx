"use client";
import { memo } from "react";
import { motion } from "framer-motion";

interface BlobConfig {
  x: string[];
  y: string[];
  z: string[];
  scale: number[];
  size: string;
  color: string;
  duration: number;
}

interface AnimatedBlobsProps {
  className?: string;
  colors?: string[];
  count?: number;
  blendMode?: string;
}

const defaultPalettes: Record<string, string[]> = {
  hero: ["rgba(61,90,80,0.25)", "rgba(156,184,172,0.18)", "rgba(245,241,232,0.12)", "rgba(46,66,56,0.2)", "rgba(255,90,54,0.08)"],
  cream: ["rgba(61,90,80,0.15)", "rgba(156,184,172,0.12)", "rgba(237,232,220,0.2)", "rgba(107,114,128,0.08)", "rgba(61,90,80,0.1)"],
  dark: ["rgba(61,90,80,0.2)", "rgba(156,184,172,0.12)", "rgba(46,66,56,0.18)", "rgba(10,11,14,0.3)", "rgba(156,184,172,0.08)"],
};

const blobAnimations: BlobConfig[] = [
  { x: ["-10%", "30%", "10%", "-10%"], y: ["-10%", "20%", "-15%", "-10%"], z: ["0px", "20px", "-10px", "0px"], scale: [1, 1.2, 0.9, 1], size: "60%", color: "", duration: 18 },
  { x: ["60%", "20%", "50%", "60%"], y: ["10%", "-20%", "30%", "10%"], z: ["10px", "-15px", "5px", "10px"], scale: [1.1, 0.8, 1.15, 1.1], size: "50%", color: "", duration: 22 },
  { x: ["30%", "-10%", "40%", "30%"], y: ["50%", "30%", "10%", "50%"], z: ["-5px", "15px", "-20px", "-5px"], scale: [0.9, 1.3, 1, 0.9], size: "55%", color: "", duration: 20 },
  { x: ["-20%", "50%", "0%", "-20%"], y: ["30%", "60%", "20%", "30%"], z: ["15px", "-10px", "8px", "15px"], scale: [1.2, 0.9, 1.1, 1.2], size: "40%", color: "", duration: 25 },
  { x: ["70%", "40%", "80%", "70%"], y: ["60%", "10%", "40%", "60%"], z: ["-8px", "12px", "-5px", "-8px"], scale: [1, 0.85, 1.2, 1], size: "45%", color: "", duration: 16 },
];

function generateBlobs(count: number, colors: string[]): BlobConfig[] {
  return blobAnimations.slice(0, count).map((blob, i) => ({
    ...blob,
    color: colors[i % colors.length] || colors[0],
  }));
}

const AnimatedBlobs = memo(function AnimatedBlobs({
  className = "",
  colors,
  count = 4,
  blendMode = "normal",
}: AnimatedBlobsProps) {
  const palette = colors || defaultPalettes.hero;
  const blobs = generateBlobs(count, palette);

  return (
    <div
      className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}
      style={{ filter: "blur(80px) saturate(1.5)", mixBlendMode: blendMode as React.CSSProperties["mixBlendMode"] }}
      aria-hidden="true"
    >
      {blobs.map((blob, i) => (
        <motion.div
          key={i}
          animate={{
            x: blob.x,
            y: blob.y,
            z: blob.z,
            scale: blob.scale,
          }}
          transition={{
            duration: blob.duration,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute rounded-full"
          style={{
            width: blob.size,
            height: blob.size,
            background: `radial-gradient(circle, ${blob.color} 0%, transparent 70%)`,
          }}
        />
      ))}
    </div>
  );
});

export default AnimatedBlobs;
export { defaultPalettes };
