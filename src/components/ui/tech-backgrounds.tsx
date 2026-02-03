"use client";

import React, { useMemo, useState, useEffect } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

/**
 * Custom hook to handle hydration by ensuring components only render on the client.
 */
const useMounted = () => {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  return mounted;
};

/**
 * AmbientGlow: Large, heavily blurred blobs that pulse and move slowly.
 * Vibe: Energy, Modern Tech.
 */
export const AmbientGlow = ({ 
  className, 
  color = "blue" 
}: { 
  className?: string, 
  color?: "blue" | "purple" | "cyan" | "royal" 
}) => {
  const mounted = useMounted();

  if (!mounted) return null;

  const colors = {
    blue: "bg-blue-400/20",
    purple: "bg-purple-500/20",
    cyan: "bg-cyan-400/20",
    royal: "bg-indigo-600/20",
  };

  return (
    <motion.div
      animate={{
        scale: [1, 1.1, 1],
        opacity: [0.3, 0.5, 0.3],
        x: [0, 30, 0],
        y: [0, -30, 0],
      }}
      transition={{
        duration: 10,
        repeat: Infinity,
        ease: "easeInOut",
      }}
      className={cn(
        "absolute rounded-full blur-[100px] md:blur-[150px] pointer-events-none -z-10", 
        colors[color], 
        className
      )}
    />
  );
};

/**
 * FloatingGeometry: Wireframe shapes (Hexagons or Cubes) that rotate and float.
 * Vibe: Engineering, Structure.
 */
export const FloatingGeometry = ({ className }: { className?: string }) => {
  const mounted = useMounted();

  const shapes = useMemo(() => {
    if (!mounted) return [];
    return [...Array(8)].map((_, i) => ({
      id: i,
      size: Math.random() * 100 + 50,
      x: Math.random() * 100,
      y: Math.random() * 100,
      duration: Math.random() * 20 + 20,
      delay: Math.random() * 10,
      type: i % 2 === 0 ? "hexagon" : "cube",
    }));
  }, [mounted]);

  if (!mounted) return null;

  return (
    <div className={cn("absolute inset-0 overflow-hidden pointer-events-none -z-10", className)}>
      {shapes.map((shape) => (
        <motion.div
          key={shape.id}
          initial={{ 
            left: `${shape.x}%`, 
            top: `${shape.y}%`,
            rotate: 0,
            opacity: 0 
          }}
          animate={{ 
            top: [`${shape.y}%`, `${shape.y - 20}%`],
            rotate: 360,
            opacity: [0, 0.15, 0]
          }}
          transition={{
            duration: shape.duration,
            repeat: Infinity,
            ease: "linear",
            delay: shape.delay
          }}
          className="absolute"
          style={{ width: shape.size, height: shape.size }}
        >
          {shape.type === "hexagon" ? (
            <svg width="100%" height="100%" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="0.5" className="text-blue-400/40">
              <path d="M50 5 L90 25 L90 75 L50 95 L10 75 L10 25 Z" />
            </svg>
          ) : (
            <svg width="100%" height="100%" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="0.5" className="text-cyan-400/40">
              <path d="M30 20 L70 20 L80 30 L80 70 L70 80 L30 80 L20 70 L20 30 Z" />
              <path d="M30 20 L30 80 M70 20 L70 80 M20 30 L80 30 M20 70 L80 70" strokeOpacity="0.2" />
            </svg>
          )}
        </motion.div>
      ))}
    </div>
  );
};

/**
 * BackgroundNetwork: Small dots connected by thin lines drifting slowly.
 * Vibe: Data connectivity, Network.
 */
export const BackgroundNetwork = ({ className }: { className?: string }) => {
  const mounted = useMounted();

  if (!mounted) return null;

  return (
    <div className={cn("absolute inset-0 overflow-hidden pointer-events-none -z-10", className)}>
      <svg width="100%" height="100%" className="absolute inset-0">
        <defs>
          <pattern id="network-grid" x="0" y="0" width="150" height="150" patternUnits="userSpaceOnUse">
            {/* Dots */}
            <circle cx="10" cy="10" r="1" fill="currentColor" className="text-slate-300" />
            <circle cx="80" cy="70" r="1" fill="currentColor" className="text-blue-300" />
            <circle cx="140" cy="130" r="1" fill="currentColor" className="text-slate-300" />
            
            {/* Lines */}
            <line x1="10" y1="10" x2="80" y2="70" stroke="currentColor" strokeWidth="0.3" className="text-slate-200" />
            <line x1="80" y1="70" x2="140" y2="130" stroke="currentColor" strokeWidth="0.3" className="text-slate-200" />
            <line x1="140" y1="130" x2="200" y2="100" stroke="currentColor" strokeWidth="0.3" className="text-slate-200" />
            <line x1="10" y1="10" x2="-50" y2="50" stroke="currentColor" strokeWidth="0.3" className="text-slate-200" />
          </pattern>
        </defs>
        <motion.rect 
          width="200%" 
          height="200%" 
          fill="url(#network-grid)"
          animate={{
            x: ["0%", "-25%"],
            y: ["0%", "-25%"],
          }}
          transition={{
            duration: 40,
            repeat: Infinity,
            ease: "linear"
          }}
        />
      </svg>
    </div>
  );
};
