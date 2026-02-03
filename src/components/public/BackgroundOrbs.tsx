"use client";

export default function BackgroundOrbs() {
  return (
    <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
      <div className="relative w-full h-full">
        {/* Orb 1 - Blue-800 */}
        <div className="absolute top-0 -left-4 w-96 h-96 bg-blue-600 rounded-full mix-blend-multiply filter blur-3xl opacity-40 animate-blob" />
        
        {/* Orb 2 - Cyan-400 */}
        <div className="absolute top-0 -right-4 w-96 h-96 bg-cyan-400 rounded-full mix-blend-multiply filter blur-3xl opacity-40 animate-blob [animation-delay:2000ms]" />
        
        {/* Orb 3 - Purple-300 */}
        <div className="absolute -bottom-8 left-20 w-96 h-96 bg-purple-400 rounded-full mix-blend-multiply filter blur-3xl opacity-40 animate-blob [animation-delay:4000ms]" />
        
        {/* Orb 4 - Indigo-500 */}
        <div className="absolute -bottom-8 right-20 w-96 h-96 bg-indigo-500 rounded-full mix-blend-multiply filter blur-3xl opacity-40 animate-blob [animation-delay:6000ms]" />

        {/* Global Glass Overlay */}
        <div className="absolute inset-0 backdrop-blur-3xl bg-slate-50/20" />
      </div>
    </div>
  );
}
