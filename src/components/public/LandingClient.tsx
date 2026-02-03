"use client";

import React from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { useTranslations } from "next-intl";
import { 
  Users, 
  FlaskConical, 
  Building2, 
  University, 
  Newspaper, 
  CalendarDays, 
  GraduationCap,
  ArrowRight,
  ShieldCheck,
  Zap,
  Globe,
  BarChart3,
  ChevronRight,
  ArrowUpRight,
  MousePointer2,
  Network,
  Cpu,
  Rocket
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/utils";
import LogoMarquee from "./LogoMarquee";

interface LandingClientProps {
  stats: {
    staffCount: number;
    researchCount: number;
    facilityCount: number;
    universitiesCount: number;
  };
  activities: any[];
  marqueeLogos: { src: string; alt: string }[];
}

export default function LandingClient({ stats, activities, marqueeLogos }: LandingClientProps) {
  const t = useTranslations("Landing");
  const { scrollY } = useScroll();
  
  // Parallax and Fade effects for Hero
  const heroY = useTransform(scrollY, [0, 500], [0, 200]);
  const heroOpacity = useTransform(scrollY, [0, 400], [1, 0]);
  const heroScale = useTransform(scrollY, [0, 500], [1, 1.05]);

  return (
    <div className="min-h-screen bg-slate-50 selection:bg-blue-100 selection:text-blue-900 overflow-x-hidden">
      
      {/* 1. HERO SECTION (Immersive) */}
      <section className="relative h-screen w-full flex items-center justify-center overflow-hidden">
        {/* Background with Parallax Effect */}
        <motion.div style={{ y: heroY, scale: heroScale }} className="absolute inset-0 z-0">
          <Image
            src="https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?q=80&w=2070&auto=format&fit=crop"
            alt="High-Tech Academic Background"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-[1px]" />
        </motion.div>

        {/* Animated Background Elements */}
        <div className="absolute inset-0 z-0 pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-600/20 rounded-full blur-[120px] animate-pulse" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-indigo-600/20 rounded-full blur-[120px] animate-pulse delay-700" />
        </div>

        {/* Hero Content */}
        <div className="container relative z-10 px-4 mx-auto text-center">
          <motion.div 
            style={{ opacity: heroOpacity }}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="max-w-5xl mx-auto space-y-8"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-400/20 backdrop-blur-md text-blue-400 text-xs font-black uppercase tracking-[0.3em]">
              <Zap className="w-3 h-3 fill-current" />
              {t("hero.badge")}
            </div>
            
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-black text-white tracking-tighter leading-[0.9]">
              {t("hero.title")}
            </h1>

            <p className="text-lg md:text-xl text-slate-300 font-medium max-w-2xl mx-auto leading-relaxed">
              {t("hero.description")}
            </p>

            {/* Glassmorphism CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-8">
              <Button asChild size="lg" className="h-16 px-10 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-lg shadow-2xl shadow-blue-500/40 transition-all hover:scale-105 active:scale-95">
                <Link href="/login">
                  {t("hero.ctaLogin")}
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="h-16 px-10 rounded-2xl bg-white/5 hover:bg-white/10 border-white/20 backdrop-blur-xl text-white font-bold text-lg transition-all hover:scale-105 active:scale-95">
                <Link href="/research">
                  {t("hero.ctaResearch")}
                </Link>
              </Button>
            </div>
          </motion.div>
        </div>

        {/* Scroll Indicator */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5, duration: 1 }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 text-white/30 flex flex-col items-center gap-2"
        >
          <span className="text-[10px] font-black uppercase tracking-[0.2em]">{t("hero.scroll")}</span>
          <div className="w-6 h-10 rounded-full border-2 border-current flex justify-center p-1">
            <motion.div 
              animate={{ y: [0, 12, 0] }}
              transition={{ repeat: Infinity, duration: 1.5 }}
              className="w-1.5 h-1.5 bg-current rounded-full" 
            />
          </div>
        </motion.div>
      </section>

      {/* 2. KEY HIGHLIGHTS (Bento Grid) */}
      <section className="py-32 bg-white relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/grid-me.png')]" />
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-2xl mb-20 text-center md:text-left">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="space-y-4"
            >
              <h2 className="text-sm font-black text-blue-600 uppercase tracking-[0.3em]">{t("impact.badge")}</h2>
              <p className="text-4xl md:text-6xl font-black text-slate-900 tracking-tight leading-none">{t("impact.title")}</p>
            </motion.div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 auto-rows-[320px]">
            {/* Card 1: Strategic Partnerships (Large, span-2) */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="md:col-span-2 md:row-span-1 group relative rounded-[2.5rem] overflow-hidden bg-slate-900 border border-slate-800 shadow-2xl transition-all duration-500 hover:scale-[1.02]"
            >
              <Image
                src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=2070&auto=format&fit=crop"
                alt="Partnerships"
                fill
                className="object-cover opacity-40 group-hover:scale-110 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />
              <div className="absolute bottom-0 left-0 p-8 md:p-10 space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-blue-500/20 border border-blue-400/30 backdrop-blur-xl flex items-center justify-center text-blue-400">
                  <Globe className="w-6 h-6" />
                </div>
                <h3 className="text-3xl font-black text-white tracking-tight">{t("impact.partners.title")}</h3>
                <p className="text-slate-300 font-medium max-w-md">
                  {t("impact.partners.description")}
                </p>
              </div>
              <div className="absolute top-8 right-8 opacity-0 group-hover:opacity-100 transition-opacity">
                <ArrowUpRight className="w-8 h-8 text-white/50" />
              </div>
            </motion.div>

            {/* Card 2: Total Research (Square) */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="md:col-span-1 md:row-span-1 group relative rounded-[2.5rem] bg-blue-600 p-8 md:p-10 flex flex-col justify-between shadow-xl shadow-blue-500/20 transition-all duration-500 hover:scale-[1.02]"
            >
              <div className="w-12 h-12 rounded-2xl bg-white/10 border border-white/20 backdrop-blur-xl flex items-center justify-center text-white">
                <FlaskConical className="w-6 h-6" />
              </div>
              <div>
                <p className="text-white/70 text-xs font-black uppercase tracking-widest mb-2">{t("impact.research.badge")}</p>
                <h3 className="text-5xl md:text-6xl font-black text-white tracking-tighter">{stats.researchCount}+</h3>
                <p className="text-blue-100 text-[10px] font-bold mt-4 flex items-center gap-1">
                  {t("impact.research.label")} <ChevronRight className="w-3 h-3" />
                </p>
              </div>
            </motion.div>

            {/* Card 4: Latest News/Events (Tall, span-row-2) */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="md:col-span-1 md:row-span-2 group relative rounded-[2.5rem] bg-white/80 backdrop-blur-md border border-slate-200/60 p-8 shadow-xl shadow-slate-200/50 transition-all duration-500 hover:scale-[1.02] overflow-hidden"
            >
              <div className="relative z-10 h-full flex flex-col">
                <div className="flex items-center justify-between mb-8">
                  <h3 className="text-xl font-black text-slate-900 tracking-tight">{t("impact.news.title")}</h3>
                  <Link href="/news" className="text-[10px] font-black text-blue-600 uppercase tracking-widest hover:underline">{t("impact.news.viewAll")}</Link>
                </div>
                <div className="space-y-6 flex-1 overflow-y-auto scrollbar-hide">
                  {activities.map((activity: any) => (
                    <div key={activity.id} className="flex items-start gap-4 group/item">
                      <div className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-400 group-hover/item:text-blue-600 group-hover/item:border-blue-200 transition-all shrink-0">
                        <Newspaper className="w-5 h-5" />
                      </div>
                      <div className="space-y-1">
                        <h4 className="text-xs font-bold text-slate-800 line-clamp-2 group-hover/item:text-blue-600 transition-colors">{activity.project_name}</h4>
                        <p className="text-[9px] text-slate-400 font-black uppercase tracking-widest">
                          {new Date(activity.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })} • {activity.university?.short_code || 'MTUN'}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="absolute -right-20 -bottom-20 w-64 h-64 bg-blue-500/5 rounded-full blur-3xl" />
            </motion.div>

            {/* Card 5: Academic Leadership (Large, span-2) */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="md:col-span-2 md:row-span-1 group relative rounded-[2.5rem] bg-slate-900 p-8 md:p-10 flex flex-col justify-between shadow-2xl transition-all duration-500 hover:scale-[1.02] overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 to-transparent opacity-50" />
              <div className="relative z-10 flex items-center justify-between">
                <div className="w-12 h-12 rounded-2xl bg-white/10 border border-white/20 backdrop-blur-xl flex items-center justify-center text-white">
                  <Users className="w-6 h-6" />
                </div>
                <div className="flex -space-x-4">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="w-10 h-10 rounded-full border-2 border-slate-900 bg-slate-800 overflow-hidden">
                      <img src={`https://i.pravatar.cc/100?img=${i+10}`} alt="Expert" className="w-full h-full object-cover" />
                    </div>
                  ))}
                </div>
              </div>
              <div className="relative z-10">
                <h3 className="text-3xl font-black text-white tracking-tight">{t("impact.staff.title")}</h3>
                <p className="text-slate-400 text-sm md:text-base font-medium mt-2 max-w-md">
                  {t("impact.staff.description", { count: stats.staffCount })}
                </p>
                <Link href="/experts" className="mt-6 inline-flex items-center gap-2 text-xs font-black text-blue-400 uppercase tracking-[0.2em] group/link">
                  {t("impact.staff.link")} <ArrowRight className="w-4 h-4 group-hover/link:translate-x-1 transition-transform" />
                </Link>
              </div>
            </motion.div>

            {/* Card 3: Faculties (Square) */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
              className="md:col-span-1 md:row-span-1 group relative rounded-[2.5rem] bg-slate-50 border border-slate-100 p-8 md:p-10 flex flex-col justify-between shadow-inner transition-all duration-500 hover:scale-[1.02]"
            >
              <div className="w-12 h-12 rounded-2xl bg-white border border-slate-200 flex items-center justify-center text-blue-600 shadow-sm">
                <Building2 className="w-6 h-6" />
              </div>
              <div>
                <p className="text-slate-400 text-xs font-black uppercase tracking-widest mb-2">{t("impact.faculties.badge")}</p>
                <h3 className="text-5xl md:text-6xl font-black text-slate-900 tracking-tighter">{stats.facilityCount}+</h3>
                <p className="text-slate-500 text-[10px] font-bold mt-4">{t("impact.faculties.label")}</p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* 3. FEATURES SECTION (Clean & Modern) */}
      <section className="py-32 bg-slate-50 relative">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center mb-24 space-y-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-sm font-black text-blue-600 uppercase tracking-[0.3em]">{t("features.badge")}</h2>
              <p className="text-4xl md:text-6xl font-black text-slate-900 tracking-tight">{t("features.title")}</p>
              <p className="text-slate-500 font-medium text-lg md:text-xl mt-6">
                {t("features.description")}
              </p>
            </motion.div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
            {[
              {
                title: t("features.research.title"),
                description: t("features.research.description"),
                icon: Rocket,
                color: "text-blue-600",
                bgColor: "bg-blue-50"
              },
              {
                title: t("features.meetings.title"),
                description: t("features.meetings.description"),
                icon: Network,
                color: "text-emerald-600",
                bgColor: "bg-emerald-50"
              },
              {
                title: t("features.kpi.title"),
                description: t("features.kpi.description"),
                icon: Cpu,
                color: "text-indigo-600",
                bgColor: "bg-indigo-50"
              }
            ].map((feature, i) => (
              <motion.div 
                key={i} 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="group p-10 rounded-[3rem] bg-white border border-slate-100 shadow-sm hover:shadow-2xl transition-all duration-500"
              >
                <div className={cn("w-16 h-16 rounded-2xl flex items-center justify-center mb-8 transition-all duration-500 group-hover:scale-110 group-hover:rotate-3", feature.bgColor, feature.color)}>
                  <feature.icon className="w-8 h-8" />
                </div>
                <h3 className="text-2xl font-black text-slate-900 mb-4 tracking-tight">{feature.title}</h3>
                <p className="text-slate-500 font-medium leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. LOGO MARQUEE */}
      <section className="py-24 bg-white border-t border-slate-100">
        <div className="container mx-auto px-4">
          <p className="text-center text-[10px] font-black text-slate-400 uppercase tracking-[0.4em] mb-16">{t("marquee.badge")}</p>
          <LogoMarquee logos={marqueeLogos} />
        </div>
      </section>

      {/* 5. FINAL CTA */}
      <section className="py-32 bg-slate-900 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]" />
        </div>
        <div className="container mx-auto px-4 relative z-10 text-center">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="max-w-4xl mx-auto space-y-10"
          >
            <h2 className="text-5xl md:text-7xl font-black text-white tracking-tighter leading-none">{t("cta.title")}</h2>
            <p className="text-xl md:text-2xl text-slate-400 font-medium">
              {t("cta.description")}
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6 pt-4">
              <Button asChild size="lg" className="h-16 px-12 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xl shadow-2xl shadow-blue-500/40 transition-all hover:scale-105">
                <Link href="/login">{t("cta.button")}</Link>
              </Button>
              <Button asChild variant="link" className="text-white font-bold text-lg hover:text-blue-400 transition-colors">
                <Link href="/about">{t("cta.link")}</Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
