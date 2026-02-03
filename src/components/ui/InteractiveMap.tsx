"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Network } from "lucide-react";
import { cn } from "@/lib/utils";

const universities = [
  {
    id: "unimap",
    name: "UniMAP",
    fullName: "Universiti Malaysia Perlis",
    x: "15%",
    y: "10%",
    color: "blue",
  },
  {
    id: "umpsa",
    name: "UMPSA",
    fullName: "Universiti Malaysia Pahang Al-Sultan Abdullah",
    x: "75%",
    y: "45%",
    color: "cyan",
  },
  {
    id: "utem",
    name: "UTeM",
    fullName: "Universiti Teknikal Malaysia Melaka",
    x: "35%",
    y: "80%",
    color: "indigo",
  },
  {
    id: "uthm",
    name: "UTHM",
    fullName: "Universiti Tun Hussein Onn Malaysia",
    x: "65%",
    y: "85%",
    color: "royal",
  },
];

const centerNode = { x: "50%", y: "50%" };

export const InteractiveMap = () => {
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  return (
    <div className="relative w-full aspect-[4/3] bg-slate-50/50 rounded-[3rem] border border-slate-100 overflow-hidden shadow-inner">
      {/* Stylized Malaysia Map Background (Abstract) */}
      <svg className="absolute inset-0 w-full h-full opacity-10 pointer-events-none" viewBox="0 0 400 300">
        <path
          d="M50,20 L100,10 L150,40 L180,80 L200,150 L180,220 L150,260 L80,280 L40,250 L20,180 L30,100 Z"
          fill="currentColor"
          className="text-blue-200"
        />
      </svg>

      {/* Connection Lines */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none">
        {universities.map((uni) => (
          <motion.line
            key={`line-${uni.id}`}
            x1={uni.x}
            y1={uni.y}
            x2={centerNode.x}
            y2={centerNode.y}
            stroke="currentColor"
            strokeWidth="1.5"
            strokeDasharray="4 4"
            className={cn(
              "transition-colors duration-500",
              hoveredId === uni.id ? "text-blue-500" : "text-slate-200"
            )}
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{ duration: 1.5, ease: "easeInOut" }}
          />
        ))}
      </svg>

      {/* Center Node (MTUN) */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20"
        style={{ left: centerNode.x, top: centerNode.y }}
      >
        <motion.div
          animate={{
            boxShadow: [
              "0 0 0 0px rgba(59, 130, 246, 0.2)",
              "0 0 0 20px rgba(59, 130, 246, 0)",
            ],
          }}
          transition={{ duration: 2, repeat: Infinity }}
          className="w-16 h-16 rounded-2xl bg-blue-600 flex items-center justify-center text-white shadow-xl"
        >
          <Network className="w-8 h-8" />
        </motion.div>
      </div>

      {/* University Nodes */}
      {universities.map((uni) => (
        <div
          key={uni.id}
          className="absolute z-30"
          style={{ left: uni.x, top: uni.y }}
          onMouseEnter={() => setHoveredId(uni.id)}
          onMouseLeave={() => setHoveredId(null)}
        >
          <motion.div
            whileHover={{ scale: 1.2 }}
            className="relative cursor-pointer group"
          >
            {/* Pulse Effect */}
            <motion.div
              animate={{ scale: [1, 1.5, 1], opacity: [0.5, 0, 0.5] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="absolute inset-0 rounded-full bg-blue-400"
            />
            <div className="relative w-6 h-6 rounded-full bg-white border-4 border-blue-500 shadow-md transition-colors group-hover:bg-blue-500" />

            {/* Tooltip */}
            <AnimatePresence>
              {hoveredId === uni.id && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.9 }}
                  animate={{ opacity: 1, y: -10, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.9 }}
                  className="absolute bottom-full left-1/2 -translate-x-1/2 mb-4 w-48 p-4 bg-white/80 backdrop-blur-xl border border-white/50 rounded-2xl shadow-2xl z-50 pointer-events-none"
                >
                  <p className="text-xs font-black text-blue-600 uppercase tracking-widest mb-1">
                    {uni.name}
                  </p>
                  <p className="text-sm font-bold text-slate-900 leading-tight">
                    {uni.fullName}
                  </p>
                  <div className="mt-2 h-1 w-full bg-blue-100 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: "100%" }}
                      className="h-full bg-blue-500"
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      ))}
    </div>
  );
};
