"use client";

import React, { useEffect, useState } from "react";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import { useTranslations } from "next-intl";
import { 
  Users, 
  FlaskConical, 
  Building2, 
  Globe, 
  ArrowRight, 
  ChevronRight,
  Zap,
  Network,
  Newspaper,
  ArrowUpRight,
  Rocket
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/utils";

interface LandingPageClientProps {
  totalResearch: number;
  totalStaff: number;
  partners: number;
  latestActivities: any[];
}

const CountUp = ({ value, duration = 2 }: { value: number; duration?: number }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let start = 0;
    const end = value;
    if (start === end) return;

    let totalMiliseconds = duration * 1000;
    let incrementTime = (totalMiliseconds / end) > 10 ? (totalMiliseconds / end) : 10;
    if (isNaN(incrementTime)) incrementTime = 10;

    let timer = setInterval(() => {
      start += Math.ceil(end / (totalMiliseconds / incrementTime));
      if (start >= end) {
        setCount(end);
        clearInterval(timer);
      } else {
        setCount(start);
      }
    }, incrementTime);

    return () => clearInterval(timer);
  }, [value, duration]);

  return <span>{count.toLocaleString()}</span>;
};

export default function LandingPageClient({ 
  totalResearch, 
  totalStaff, 
  partners,
  latestActivities 
}: LandingPageClientProps) {
  const t = useTranslations("LandingPage");
  const { scrollY } = useScroll();
  const heroOpacity = useTransform(scrollY, [0, 400], [1, 0]);

  return (
    <div className="relative min-h-screen w-full overflow-x-hidden">
      {/* 1. VIDEO BACKGROUND & ORBS */}
      <div className="fixed inset-0 -z-50 overflow-hidden">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover brightness-[0.3]"
        >
          <source src="/hero-bg.mp4" type="video/mp4" />
          {/* Fallback image if video fails */}
          <img 
            src="https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=2072&auto=format&fit=crop" 
            className="w-full h-full object-cover"
            alt="Background"
          />
        </video>
        
        {/* Floating Orbs */}
        <motion.div
          animate={{
            x: [0, 100, -50, 0],
            y: [0, -50, 100, 0],
            scale: [1, 1.2, 0.9, 1],
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-cyan-500/20 rounded-full blur-[120px]"
        />
        <motion.div
          animate={{
            x: [0, -120, 80, 0],
            y: [0, 100, -60, 0],
            scale: [1, 1.1, 1.3, 1],
          }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
          className="absolute bottom-1/4 right-1/4 w-[600px] h-[600px] bg-violet-600/20 rounded-full blur-[140px]"
        />
        
        <div className="absolute inset-0 backdrop-blur-3xl bg-slate-950/40" />
      </div>

      {/* 2. HERO SECTION */}
      <section className="relative h-screen flex items-center justify-center px-4">
        <div className="max-w-5xl mx-auto text-center space-y-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-md text-blue-400 text-xs font-black uppercase tracking-[0.3em]"
          >
            <Zap className="w-3 h-3 fill-current" />
            {t("hero.badge")}
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-5xl md:text-7xl lg:text-8xl font-black text-white tracking-tighter leading-[0.9]"
          >
            {t("hero.title").split('\n').map((line, i) => (
              <React.Fragment key={i}>
                {i === 1 ? (
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-cyan-400 to-indigo-400">
                    {line}
                  </span>
                ) : (
                  <>
                    {line}
                    <br />
                  </>
                )}
              </React.Fragment>
            ))}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-lg md:text-xl text-slate-300 font-medium max-w-2xl mx-auto leading-relaxed"
          >
            {t("hero.description")}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4"
          >
            <Button asChild size="lg" className="h-16 px-10 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-lg shadow-2xl shadow-blue-500/40 transition-all hover:scale-105 active:scale-95 group relative overflow-hidden">
              <Link href="/research">
                <span className="relative z-10 flex items-center gap-2">
                  {t("hero.ctaExplore")}
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="h-16 px-10 rounded-2xl bg-white/5 hover:bg-white/10 border-white/20 backdrop-blur-xl text-white font-bold text-lg transition-all hover:scale-105 active:scale-95">
              <Link href="/login">{t("hero.ctaPortal")}</Link>
            </Button>
          </motion.div>
        </div>
      </section>

      {/* 3. BENTO GRID SECTION */}
      <section className="py-32 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 auto-rows-[300px]">
            
            {/* Block 1: Hero - Span 2x2 */}
            <motion.div 
              whileHover={{ y: -5, scale: 1.01 }}
              className="md:col-span-2 md:row-span-2 rounded-[2.5rem] p-10 flex flex-col justify-end relative overflow-hidden glass-panel"
            >
              <div className="absolute inset-0 -z-10">
                <Image 
                  src="https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?q=80&w=2070&auto=format&fit=crop"
                  alt="Innovation"
                  fill
                  className="object-cover opacity-40"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />
              </div>
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-blue-500/20 border border-blue-400/30 backdrop-blur-xl flex items-center justify-center text-blue-400">
                  <Rocket className="w-6 h-6" />
                </div>
                <h3 className="text-4xl font-black text-white tracking-tight">{t("network.title")}</h3>
                <p className="text-slate-300 font-medium max-w-md">
                  {t("network.description")}
                </p>
                <Link href="/about" className="inline-flex items-center gap-2 text-blue-400 font-bold hover:underline">
                  {t("network.link")} <ChevronRight className="w-4 h-4" />
                </Link>
              </div>
            </motion.div>

            {/* Block 2: Total Research (Square) */}
            <motion.div 
              whileHover={{ y: -5, scale: 1.02 }}
              className="md:col-span-1 md:row-span-1 rounded-[2.5rem] p-8 flex flex-col justify-between glass-panel"
            >
              <div className="w-12 h-12 rounded-2xl bg-cyan-500/20 border border-cyan-400/30 backdrop-blur-xl flex items-center justify-center text-cyan-400 shadow-[0_0_20px_rgba(34,211,238,0.2)]">
                <FlaskConical className="w-6 h-6" />
              </div>
              <div>
                <p className="text-slate-400 text-xs font-black uppercase tracking-widest mb-1">{t("stats.research.badge")}</p>
                <h3 className="text-5xl font-black text-white tracking-tighter">
                  <CountUp value={totalResearch} />+
                </h3>
                <p className="text-slate-500 text-[10px] font-bold mt-2">{t("stats.research.label")}</p>
              </div>
            </motion.div>

            {/* Block 3: Total Staff (Square) */}
            <motion.div 
              whileHover={{ y: -5, scale: 1.02 }}
              className="md:col-span-1 md:row-span-1 rounded-[2.5rem] p-8 flex flex-col justify-between glass-panel"
            >
              <div className="w-12 h-12 rounded-2xl bg-violet-500/20 border border-violet-400/30 backdrop-blur-xl flex items-center justify-center text-violet-400 shadow-[0_0_20px_rgba(167,139,250,0.2)]">
                <Users className="w-6 h-6" />
              </div>
              <div>
                <p className="text-slate-400 text-xs font-black uppercase tracking-widest mb-1">{t("stats.staff.badge")}</p>
                <h3 className="text-5xl font-black text-white tracking-tighter">
                  <CountUp value={totalStaff} />+
                </h3>
                <p className="text-slate-500 text-[10px] font-bold mt-2">{t("stats.staff.label")}</p>
              </div>
            </motion.div>

            {/* Block 5: News Ticker (Tall) */}
            <motion.div 
              whileHover={{ y: -5, scale: 1.01 }}
              className="md:col-span-2 md:row-span-1 rounded-[2.5rem] p-8 glass-panel relative overflow-hidden"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-black text-white tracking-tight flex items-center gap-2">
                  <Newspaper className="w-5 h-5 text-blue-400" />
                  {t("updates.title")}
                </h3>
                <Link href="/news" className="text-[10px] font-black text-blue-600 uppercase tracking-widest hover:underline">{t("updates.viewAll")}</Link>
              </div>
              <div className="space-y-4 overflow-hidden h-[160px]">
                <motion.div
                  animate={{ y: [0, -200] }}
                  transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                  className="space-y-4"
                >
                  {[...latestActivities, ...latestActivities].map((activity, i) => (
                    <div key={i} className="flex items-center gap-4 p-3 rounded-2xl bg-white/5 border border-white/5 hover:bg-white/10 transition-colors">
                      <div className="w-10 h-10 rounded-xl bg-blue-500/20 flex items-center justify-center text-blue-400 shrink-0">
                        <Zap className="w-4 h-4" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-bold text-white truncate">{activity.project_name}</p>
                        <p className="text-[10px] text-slate-500 font-medium">{activity.university?.name}</p>
                      </div>
                    </div>
                  ))}
                </motion.div>
              </div>
              <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-slate-950/50 to-transparent pointer-events-none" />
            </motion.div>
          </div>
        </div>
      </section>

      {/* 4. NETWORK MAP SECTION */}
      <section className="py-24 px-4 bg-slate-950/20">
        <div className="container mx-auto max-w-6xl">
          <div className="glass-panel rounded-[3rem] p-12 flex flex-col md:flex-row items-center gap-12">
            <div className="flex-1 space-y-6">
              <h2 className="text-sm font-black text-blue-400 uppercase tracking-[0.3em]">{t("map.badge")}</h2>
              <h3 className="text-4xl font-black text-white tracking-tight">{t("map.title")}</h3>
              <p className="text-slate-400 font-medium text-lg leading-relaxed">
                {t("map.description")}
              </p>
              <div className="grid grid-cols-2 gap-4 pt-4">
                {['UniMAP', 'UTeM', 'UMPSA', 'UTHM'].map((uni) => (
                  <div key={uni} className="flex items-center gap-2 text-white font-bold">
                    <div className="w-2 h-2 rounded-full bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.8)]" />
                    {uni}
                  </div>
                ))}
              </div>
            </div>
            <div className="flex-1 relative w-full aspect-square max-w-md">
              {/* Stylized Map Graphic Placeholder */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-full h-full rounded-full border border-white/5 animate-spin-slow" />
                <div className="absolute w-3/4 h-3/4 rounded-full border border-blue-500/10 animate-reverse-spin-slow" />
                <Network className="w-32 h-32 text-blue-500/20" />
                
                {/* University Points */}
                {[
                  { top: '20%', left: '30%', name: 'UniMAP' },
                  { top: '60%', left: '20%', name: 'UTeM' },
                  { top: '40%', left: '80%', name: 'UMPSA' },
                  { top: '80%', left: '70%', name: 'UTHM' },
                ].map((point, i) => (
                  <motion.div
                    key={i}
                    initial={{ scale: 0 }}
                    whileInView={{ scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.2 }}
                    className="absolute group cursor-pointer"
                    style={{ top: point.top, left: point.left }}
                  >
                    <div className="w-4 h-4 rounded-full bg-blue-500 shadow-[0_0_15px_rgba(59,130,246,1)]" />
                    <div className="absolute top-full mt-2 left-1/2 -translate-x-1/2 px-3 py-1 rounded-lg bg-white text-slate-900 text-[10px] font-black opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap shadow-xl">
                      {point.name}
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
