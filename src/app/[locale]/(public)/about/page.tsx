"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { ChevronRight, Target, Eye, History } from "lucide-react";
import { cn } from "@/lib/utils";

export default function AboutPage() {
  const t = useTranslations("About");

  const breadcrumbs = [
    { name: t("hero.breadcrumbs.home"), href: "/" },
    { name: t("hero.breadcrumbs.about"), href: "/about" },
  ];

  const universities = [
    {
      name: t("institutions.unimap.name"),
      short: "UniMAP",
      description: t("institutions.unimap.desc"),
      logo_url: "https://www.unimap.edu.my/images/logoRasmi/unimap_logo_2025.png",
    },
    {
      name: t("institutions.utem.name"),
      short: "UTeM",
      description: t("institutions.utem.desc"),
      logo_url: "https://www.utem.edu.my/templates/yootheme/cache/5b/LogoUTeM-5b80a51b.png",
    },
    {
      name: t("institutions.umpsa.name"),
      short: "UMPSA",
      description: t("institutions.umpsa.desc"),
      logo_url: "https://brand.umpsa.edu.my/images/logo-umpsa-full-color2.png",
    },
    {
      name: t("institutions.uthm.name"),
      short: "UTHM",
      description: t("institutions.uthm.desc"),
      logo_url: "https://www.uthm.edu.my/templates/yootheme/cache/88/topouthm-888c52f2.webp",
    },
  ];

  return (
    <div className="bg-slate-50 min-h-screen font-sans">
      
      {/* Header (Hero) - Glass Banner */}
      <section className="w-full py-24 bg-white/60 backdrop-blur-xl border-b border-slate-200 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_-20%,#E0F2FE,transparent)] opacity-40" />
        <div className="container mx-auto px-6 max-w-7xl relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-4"
          >
            <nav className="flex items-center text-xs font-bold uppercase tracking-widest text-slate-400">
              {breadcrumbs.map((item, index) => (
                <span key={item.href} className="flex items-center">
                  <Link href={item.href} className="hover:text-blue-600 transition-colors">
                    {item.name}
                  </Link>
                  {index < breadcrumbs.length - 1 && (
                    <ChevronRight className="h-3 w-3 mx-2" />
                  )}
                </span>
              ))}
            </nav>
            <h1 className="text-5xl md:text-6xl font-black text-blue-950 tracking-tighter">
              {t("hero.title")} <span className="text-blue-600">MTUN</span>
            </h1>
            <p className="text-lg text-slate-600 font-medium max-w-2xl leading-relaxed">
              {t("hero.description")}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-6 py-20 space-y-24">
        
        {/* Section 1: Vision & Mission (Glass Cards) */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="bg-white rounded-[2.5rem] p-12 shadow-sm border border-slate-100 hover:shadow-md transition-all group"
          >
            <div className="w-14 h-14 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-600 mb-8 group-hover:scale-110 transition-transform">
              <Eye className="w-7 h-7" />
            </div>
            <h2 className="text-3xl font-black text-blue-950 mb-6 tracking-tight">{t("vision.title")}</h2>
            <p className="text-slate-600 text-lg leading-relaxed font-medium">
              {t("vision.description")}
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="bg-white rounded-[2.5rem] p-12 shadow-sm border border-slate-100 hover:shadow-md transition-all group"
          >
            <div className="w-14 h-14 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-600 mb-8 group-hover:scale-110 transition-transform">
              <Target className="w-7 h-7" />
            </div>
            <h2 className="text-3xl font-black text-blue-950 mb-6 tracking-tight">{t("mission.title")}</h2>
            <p className="text-slate-600 text-lg leading-relaxed font-medium">
              {t("mission.description")}
            </p>
          </motion.div>
        </section>

        {/* Section 2: History (Timeline) */}
        <section className="space-y-12">
          <div className="text-center space-y-4">
            <h2 className="text-sm font-black text-blue-600 uppercase tracking-[0.3em]">{t("journey.badge")}</h2>
            <h3 className="text-4xl font-black text-blue-950 tracking-tight">{t("journey.title")}</h3>
          </div>

          <div className="relative max-w-4xl mx-auto">
            {/* Vertical Line */}
            <div className="absolute left-1/2 -translate-x-1/2 top-0 bottom-0 w-px bg-slate-200 hidden md:block" />
            
            <div className="space-y-16">
              {[
                { year: "2007", title: t("journey.timeline.2007.title"), desc: t("journey.timeline.2007.desc") },
                { year: "2012", title: t("journey.timeline.2012.title"), desc: t("journey.timeline.2012.desc") },
                { year: "2018", title: t("journey.timeline.2018.title"), desc: t("journey.timeline.2018.desc") },
                { year: "2025", title: t("journey.timeline.2025.title"), desc: t("journey.timeline.2025.desc") }
              ].map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className={cn(
                    "relative flex flex-col md:flex-row items-center gap-8",
                    i % 2 === 0 ? "md:flex-row-reverse" : ""
                  )}
                >
                  <div className="flex-1 md:text-right text-center">
                    <div className={cn("space-y-2", i % 2 === 0 ? "md:text-left" : "md:text-right")}>
                      <span className="text-2xl font-black text-blue-600">{item.year}</span>
                      <h4 className="text-xl font-bold text-blue-950">{item.title}</h4>
                      <p className="text-slate-500 font-medium">{item.desc}</p>
                    </div>
                  </div>
                  <div className="w-4 h-4 rounded-full bg-blue-600 border-4 border-white shadow-md relative z-10 shrink-0" />
                  <div className="flex-1 hidden md:block" />
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Member Universities Grid */}
        <section className="space-y-12">
          <h2 className="text-3xl font-black text-blue-950 text-center tracking-tight">{t("institutions.title")}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {universities.map((uni, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-slate-100 hover:shadow-md transition-all flex items-start gap-6 group"
              >
                <div className="w-20 h-20 rounded-2xl bg-slate-50 p-4 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform shadow-sm">
                  <img src={uni.logo_url} alt={uni.short} className="max-w-full max-h-full object-contain" />
                </div>
                <div className="space-y-2">
                  <h4 className="text-xl font-bold text-blue-950">{uni.name}</h4>
                  <p className="text-sm text-slate-500 leading-relaxed font-medium">{uni.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

      </main>
    </div>
  );
}
