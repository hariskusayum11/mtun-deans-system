"use client";

import React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Cpu, Activity, ShieldCheck, Network } from "lucide-react";

const universities = [
  {
    id: "unimap",
    name: "UniMAP",
    fullName: "Universiti Malaysia Perlis",
    x: 15,
    y: 10,
    coords: "6.4604° N, 100.3477° E",
  },
  {
    id: "umpsa",
    name: "UMPSA",
    fullName: "Universiti Malaysia Pahang",
    x: 75,
    y: 45,
    coords: "3.5435° N, 103.4287° E",
  },
  {
    id: "utem",
    name: "UTeM",
    fullName: "Universiti Teknikal Malaysia Melaka",
    x: 35,
    y: 80,
    coords: "2.3138° N, 102.3180° E",
  },
  {
    id: "uthm",
    name: "UTHM",
    fullName: "Universiti Tun Hussein Onn",
    x: 65,
    y: 85,
    coords: "1.8596° N, 103.0858° E",
  },
];

const hub = { x: 50, y: 50 };

/**
 * 3D Isometric Building Component
 */
const TechBuilding = ({ name, hovered }: { name: string; hovered: boolean }) => {
  return (
    <div className="relative w-12 h-12 flex items-center justify-center" style={{ perspective: "1000px" }}>
      <motion.div
        animate={{
          y: [0, -8, 0],
          scale: hovered ? 1.2 : 1,
        }}
        transition={{
          y: { duration: 3, repeat: Infinity, ease: "easeInOut" },
          scale: { duration: 0.3 },
        }}
        className="relative w-8 h-10"
        style={{ transformStyle: "preserve-3d", rotateX: "45deg", rotateZ: "45deg" }}
      >
        {/* 3D Building Sides */}
        <div className={cn(
          "absolute inset-0 bg-slate-900 border border-cyan-500/50 transition-colors duration-300",
          hovered && "border-cyan-400 bg-slate-800 shadow-[0_0_20px_rgba(34,211,238,0.4)]"
        )}>
          {/* Circuit Pattern on Building */}
          <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#22d3ee_0.5px,transparent_0.5px)] bg-[length:4px_4px]" />
        </div>
        
        {/* Top Face */}
        <div className={cn(
          "absolute inset-0 bg-cyan-500/20 border border-cyan-400/50 translate-z-8",
          hovered && "bg-cyan-400/40 border-cyan-300"
        )} style={{ transform: "translateZ(20px)" }}>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-1 h-1 bg-cyan-400 rounded-full animate-ping" />
          </div>
        </div>

        {/* Side Faces (Pseudo-3D) */}
        <div className="absolute top-0 left-0 w-full h-5 bg-slate-950 border border-cyan-500/30 origin-top" 
             style={{ transform: "rotateX(-90deg)" }} />
        <div className="absolute top-0 right-0 w-5 h-full bg-slate-950 border border-cyan-500/30 origin-right" 
             style={{ transform: "rotateY(90deg)" }} />
      </motion.div>
    </div>
  );
};

/**
 * Circuit Path Component
 */
const CircuitPath = ({ from, to }: { from: { x: number; y: number }; to: { x: number; y: number } }) => {
  // Create an angled circuit path (L-shape or Z-shape)
  const midX = from.x + (to.x - from.x) * 0.5;
  const pathData = `M ${from.x} ${from.y} L ${midX} ${from.y} L ${midX} ${to.y} L ${to.x} ${to.y}`;

  return (
    <g>
      {/* Base Path */}
      <path
        d={pathData}
        fill="none"
        stroke="rgba(34, 211, 238, 0.1)"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Animated Data Packets */}
      <motion.path
        d={pathData}
        fill="none"
        stroke="#22d3ee"
        strokeWidth="2"
        strokeDasharray="4, 20"
        initial={{ strokeDashoffset: 0 }}
        animate={{ strokeDashoffset: -100 }}
        transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
        strokeLinecap="round"
        strokeLinejoin="round"
        className="drop-shadow-[0_0_8px_rgba(34,211,238,0.8)]"
      />
    </g>
  );
};

export const TechMap = () => {
  const [hoveredUni, setHoveredUni] = React.useState<string | null>(null);

  return (
    <div className="relative w-full aspect-[4/5] md:aspect-[16/10] bg-slate-950 rounded-[3rem] border border-slate-800 overflow-hidden shadow-2xl group/map">
      {/* Engineering Grid Pattern */}
      <div className="absolute inset-0 opacity-10 pointer-events-none" 
           style={{ backgroundImage: 'linear-gradient(#3b82f6 1px, transparent 1px), linear-gradient(90deg, #3b82f6 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
      
      {/* Holographic Blueprint Map Base */}
      <svg className="absolute inset-0 w-full h-full p-12" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid meet">
        {/* Simplified Peninsular Malaysia Path */}
        <motion.path
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{ duration: 2, ease: "easeInOut" }}
          d="M20,10 L35,5 L50,15 L65,10 L80,25 L85,45 L75,65 L60,85 L45,95 L30,85 L15,65 L10,40 L15,20 Z"
          fill="rgba(15, 23, 42, 0.8)"
          stroke="#0ea5e9"
          strokeWidth="0.5"
          className="drop-shadow-[0_0_15px_rgba(14,165,233,0.3)]"
        />

        {/* Circuit Connections */}
        {universities.map((uni) => (
          <CircuitPath key={`path-${uni.id}`} from={uni} to={hub} />
        ))}

        {/* Central Hub Node */}
        <circle cx={hub.x} cy={hub.y} r="1.5" fill="#0ea5e9" className="animate-pulse" />
        <circle cx={hub.x} cy={hub.y} r="4" fill="none" stroke="#0ea5e9" strokeWidth="0.2" strokeDasharray="1, 2" className="animate-spin-slow" />
      </svg>

      {/* University Nodes (HTML Overlay) */}
      <div className="absolute inset-0 p-12 pointer-events-none">
        {universities.map((uni) => (
          <div
            key={uni.id}
            className="absolute pointer-events-auto cursor-pointer"
            style={{ left: `${uni.x}%`, top: `${uni.y}%`, transform: "translate(-50%, -50%)" }}
            onMouseEnter={() => setHoveredUni(uni.id)}
            onMouseLeave={() => setHoveredUni(null)}
          >
            <TechBuilding name={uni.name} hovered={hoveredUni === uni.id} />
            
            {/* Schematic Label */}
            <motion.div
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              className="absolute left-full ml-4 top-0 whitespace-nowrap"
            >
              <div className="flex items-center gap-2">
                <div className="w-4 h-[1px] bg-cyan-500/50" />
                <div className="bg-slate-900/80 backdrop-blur-md border border-cyan-500/30 p-2 rounded-lg">
                  <p className="text-[10px] font-black text-cyan-400 uppercase tracking-widest">{uni.name}</p>
                  <p className="text-[8px] font-mono text-slate-400">{uni.coords}</p>
                  <div className="flex items-center gap-1 mt-1">
                    <div className="w-1 h-1 bg-green-500 rounded-full animate-pulse" />
                    <span className="text-[7px] font-mono text-green-500/80 uppercase">Status: Online</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        ))}

        {/* Central Hub Label */}
        <div className="absolute" style={{ left: `${hub.x}%`, top: `${hub.y}%`, transform: "translate(-50%, -50%)" }}>
          <div className="w-16 h-16 rounded-full bg-blue-600/10 border border-blue-500/20 flex items-center justify-center backdrop-blur-sm">
            <Network className="w-6 h-6 text-blue-400 animate-pulse" />
          </div>
        </div>
      </div>

      {/* HUD Elements (Corners) */}
      <div className="absolute top-8 left-8 font-mono text-[10px] text-cyan-500/40 space-y-1 pointer-events-none">
        <p className="flex items-center gap-2"><Activity className="w-3 h-3" /> SCANNING_NETWORK...</p>
        <p>MTUN_CORE_V2.0</p>
      </div>
      <div className="absolute bottom-8 right-8 font-mono text-[10px] text-cyan-500/40 text-right pointer-events-none">
        <p>ENCRYPTION: ACTIVE</p>
        <p className="flex items-center justify-end gap-2">SECURE_LINK <ShieldCheck className="w-3 h-3" /></p>
      </div>

      {/* Scanning Line Animation */}
      <motion.div
        animate={{ top: ["0%", "100%", "0%"] }}
        transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
        className="absolute left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-cyan-500/20 to-transparent z-50 pointer-events-none"
      />
    </div>
  );
};

export default TechMap;
