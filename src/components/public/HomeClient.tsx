"use client";

import React, { useRef } from "react";
import { motion, HTMLMotionProps } from "framer-motion";
import { useTranslations } from "next-intl";
import { 
  ArrowRight, 
  ChevronRight, 
  FlaskConical, 
  Mail,
  MapPin,
  Newspaper
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { FloatingGeometry } from "@/components/ui/tech-backgrounds";
import dynamic from "next/dynamic";

// Dynamically import MtunMap to avoid SSR issues with Leaflet and improve initial load
const MtunMap = dynamic(() => import("@/components/ui/MtunMap"), { 
  ssr: false,
  loading: () => (
    <div className="w-full h-[600px] bg-slate-50 rounded-[3rem] flex items-center justify-center border border-slate-200 shadow-inner">
      <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
    </div>
  )
});

interface HomeClientProps {
  data: {
    stats: { staff: number; research: number; partners: number };
    featuredStaff: any[];
    partners: any[];
    latestNews: any[];
    researchAreas: { title: string; icon: string }[];
  };
}

const fadeIn: HTMLMotionProps<"div"> = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.6, ease: "easeOut" }
};

const universityLogos = [
  { name: "UniMAP", url: "/images/logos/unimap.webp" },
  { name: "UMPSA", url: "/images/logos/umpsa.webp" },
  { name: "UTeM", url: "/images/logos/utem.webp" },
  { name: "UTHM", url: "/images/logos/uthm.webp" },
];

export default function HomeClient({ data }: HomeClientProps) {
  const t = useTranslations("Home");
  const ecosystemRef = useRef<HTMLDivElement>(null);

  const scrollToEcosystem = () => {
    ecosystemRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  if (!data) return null;

  return (
    <div className="min-h-screen font-sans selection:bg-blue-100 selection:text-blue-900 overflow-x-hidden">
      
      {/* SECTION 1: HERO (Full Screen Video) */}
      <section className="relative h-screen w-full overflow-hidden flex items-center">
        {/* Video Background - Optimized with preload and poster */}
        <div className="absolute inset-0 w-full h-full z-0">
          <video 
            autoPlay 
            muted 
            loop 
            playsInline 
            preload="metadata"
            poster="/images/hero-poster.jpg"
            className="object-cover w-full h-full"
          >
            <source src="/hero-bg.mp4" type="video/mp4" />
          </video>
          {/* Official MTUN Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-blue-900/90 via-blue-900/60 to-slate-900/70" />
        </div>

        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-4xl space-y-8 text-left">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white text-xs font-bold uppercase tracking-widest">
                <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse" aria-hidden="true" />
                {t("hero.badge")}
              </div>
            </motion.div>
            
            <motion.h1 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-5xl md:text-7xl font-bold text-white tracking-tight leading-tight whitespace-pre-line drop-shadow-lg"
            >
              {t("hero.title")}
            </motion.h1>
            
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="text-xl md:text-2xl text-blue-50/80 font-medium max-w-2xl leading-relaxed"
            >
              {t("hero.description")}
            </motion.p>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="flex flex-wrap gap-4 pt-4"
            >
              <Button 
                onClick={scrollToEcosystem}
                size="lg" 
                className="h-14 px-8 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold shadow-xl shadow-blue-900/20 transition-all hover:scale-105"
              >
                {t("hero.ctaExplore")}
              </Button>
              <Button asChild variant="outline" size="lg" className="h-14 px-8 rounded-xl border-white/30 bg-white/10 backdrop-blur-md text-white font-bold hover:bg-white hover:text-blue-900 transition-all hover:scale-105">
                <Link href="/about">{t("hero.ctaAbout")}</Link>
              </Button>
            </motion.div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <motion.div 
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 text-white/50"
        >
          <div className="w-6 h-10 rounded-full border-2 border-current flex justify-center p-1">
            <div className="w-1 h-2 bg-current rounded-full" aria-hidden="true" />
          </div>
        </motion.div>
      </section>

      {/* SECTION 2: THE ECOSYSTEM (Two Column Grid) */}
      <section ref={ecosystemRef} className="py-32 relative overflow-hidden">
        <div className="container mx-auto px-6 max-w-7xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            
            {/* Left Column: Context */}
            <motion.div {...fadeIn} className="space-y-10">
              <div className="space-y-6">
                <span className="text-blue-600 font-black uppercase tracking-widest text-sm block">{t("ecosystem.badge")}</span>
                <h2 className="text-5xl font-bold text-blue-950 tracking-tight leading-tight">
                  {t("ecosystem.title")}
                </h2>
                <p className="text-xl text-slate-600 leading-relaxed">
                  {t("ecosystem.description")}
                </p>
              </div>

              {/* University Logos Grid - Optimized with Next.js Image */}
              <div className="grid grid-cols-2 gap-8 pt-4">
                {universityLogos.map((uni, i) => (
                  <div 
                    key={i} 
                    className="group relative aspect-video bg-white/40 backdrop-blur-xl rounded-xl shadow-sm border border-white/20 flex items-center justify-center p-8 transition-all hover:shadow-xl hover:-translate-y-1 duration-300"
                  >
                    <Image 
                      src={uni.url} 
                      alt={`${uni.name} Logo`} 
                      width={180}
                      height={90}
                      className="object-contain transition-all duration-500"
                    />
                  </div>
                ))}
              </div>

              <div className="pt-6">
                <Button asChild variant="link" className="text-blue-600 font-bold p-0 h-auto text-lg group">
                  <Link href="/collaboration" className="flex items-center gap-2" aria-label={t("ecosystem.link")}>
                    {t("ecosystem.link")} <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" aria-hidden="true" />
                  </Link>
                </Button>
              </div>
            </motion.div>

            {/* Right Column: The Map */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1 }}
              className="relative"
            >
              <div className="rounded-[3rem] overflow-hidden shadow-[0_30px_60px_rgba(0,0,0,0.12)] border border-white/20">
                <MtunMap />
              </div>
              
              {/* Decorative background glow */}
              <div className="absolute -z-10 -top-20 -right-20 w-64 h-64 bg-blue-100 rounded-full blur-[100px] opacity-60" aria-hidden="true" />
              <div className="absolute -z-10 -bottom-20 -left-20 w-64 h-64 bg-cyan-100 rounded-full blur-[100px] opacity-60" aria-hidden="true" />
            </motion.div>

          </div>
        </div>
      </section>

      {/* SECTION 3: STAFF (Trust & Depth) */}
      <section className="py-32 relative overflow-hidden">
        <div className="container mx-auto px-6 max-w-7xl space-y-16">
          <motion.div {...fadeIn} className="flex items-end justify-between gap-6">
            <div className="space-y-4">
              <span className="text-blue-600 font-black uppercase tracking-widest text-sm block">{t("staff.badge")}</span>
              <h2 className="text-4xl font-bold text-slate-900 tracking-tight">{t("staff.title")}</h2>
            </div>
            <Link href="/staff" className="text-blue-700 font-bold flex items-center gap-1 hover:underline" aria-label={t("staff.viewAll")}>
              {t("staff.viewAll")} <ChevronRight className="w-4 h-4" aria-hidden="true" />
            </Link>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {(data.featuredStaff || []).slice(0, 4).map((expert, i) => (
              <motion.div 
                key={i}
                whileHover={{ y: -10 }}
                className="bg-white/40 backdrop-blur-xl rounded-3xl p-8 shadow-lg border border-white/20 text-center space-y-6 relative overflow-hidden group h-full"
              >
                <div className="relative w-32 h-32 mx-auto">
                  <Avatar className="w-full h-full border-4 border-white shadow-xl relative z-10">
                    <AvatarImage src={expert.image_url} className="object-cover" alt={expert.name} />
                    <AvatarFallback className="bg-slate-50 text-blue-600 font-black text-3xl">
                      {expert.name[0]}
                    </AvatarFallback>
                  </Avatar>
                </div>

                <div className="space-y-2">
                  <h3 className="text-xl font-bold text-slate-900 leading-tight">{expert.name}</h3>
                  <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">{expert.position}</p>
                </div>

                <Badge variant="secondary" className="bg-blue-50 text-blue-600 border-none font-black px-4 py-1">
                  {expert.university?.short_code}
                </Badge>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 4: RESEARCH (Floating 3D) */}
      <section className="py-32 relative overflow-hidden">
        <FloatingGeometry className="opacity-30" />
        <div className="container mx-auto px-6 max-w-7xl space-y-20 relative z-10">
          <motion.div {...fadeIn} className="text-center space-y-4">
            <span className="text-blue-600 font-black uppercase tracking-widest text-sm block">{t("research.badge")}</span>
            <h2 className="text-5xl font-bold text-slate-900 tracking-tight">{t("research.title")}</h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {(data.researchAreas || []).map((area, i) => {
              return (
                <motion.div
                  key={i}
                  {...fadeIn}
                  transition={{ delay: i * 0.1 }}
                  className="relative group"
                >
                  <div className="h-full p-10 rounded-3xl bg-white/40 backdrop-blur-2xl border border-white/50 shadow-xl transition-all group-hover:shadow-2xl group-hover:bg-white/60 flex flex-col items-center text-center space-y-8">
                    <motion.div
                      animate={{ y: [0, -10, 0] }}
                      transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: i * 0.5 }}
                      className="w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center text-white shadow-2xl shadow-blue-200"
                    >
                      <FlaskConical className="w-10 h-10" aria-hidden="true" />
                    </motion.div>
                    
                    <div className="space-y-3">
                      <h3 className="text-2xl font-bold text-slate-900">{area.title}</h3>
                      <p className="text-sm text-slate-500 font-medium leading-relaxed">
                        {t("research.description", { area: area.title.toLowerCase() })}
                      </p>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* SECTION 5: INDUSTRY (Infinite Flow) */}
      <section className="py-32 bg-slate-900 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(59,130,246,0.1),transparent)]" aria-hidden="true" />
        
        <div className="container mx-auto px-6 max-w-7xl space-y-20 relative z-10">
          <motion.div {...fadeIn} className="text-center space-y-4">
            <span className="text-blue-400 font-black uppercase tracking-widest text-sm block">{t("industry.badge")}</span>
            <h2 className="text-5xl font-bold tracking-tight">{t("industry.title")}</h2>
          </motion.div>

          <div className="relative">
            <div className="absolute inset-y-0 left-0 w-40 bg-gradient-to-r from-slate-900 via-slate-900/80 to-transparent z-20" aria-hidden="true" />
            <div className="absolute inset-y-0 right-0 w-40 bg-gradient-to-l from-slate-900 via-slate-900/80 to-transparent z-20" aria-hidden="true" />

            <div className="flex overflow-hidden py-10 relative z-10">
              <motion.div 
                animate={{ x: [0, -1000] }}
                transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
                className="flex gap-24 items-center whitespace-nowrap"
              >
                {[...data.partners, ...data.partners, ...data.partners].map((partner, i) => (
                  <div key={i} className="flex items-center justify-center h-16 grayscale brightness-200 opacity-40 hover:grayscale-0 hover:brightness-100 hover:opacity-100 transition-all duration-500">
                    {partner.image_url ? (
                      <div className="relative h-16 w-32">
                        <Image 
                          src={partner.image_url} 
                          alt={`${partner.name} Logo`} 
                          fill 
                          className="object-contain"
                        />
                      </div>
                    ) : (
                      <span className="font-black text-2xl tracking-tighter">{partner.name}</span>
                    )}
                  </div>
                ))}
              </motion.div>
            </div>
          </div>

          <motion.div {...fadeIn} className="text-center">
            <Button asChild size="lg" className="h-16 px-12 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-lg shadow-2xl shadow-blue-900/20">
              <Link href="/industry" aria-label={t("industry.cta")}>{t("industry.cta")}</Link>
            </Button>
          </motion.div>
        </div>
      </section>

      {/* SECTION 6: NEWS & EVENTS */}
      <section className="py-32 relative overflow-hidden">
        <div className="container mx-auto px-6 max-w-7xl space-y-16">
          <motion.div {...fadeIn} className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="space-y-4">
              <span className="text-blue-600 font-black uppercase tracking-widest text-sm block">{t("news.badge")}</span>
              <h2 className="text-5xl font-bold text-slate-900 tracking-tight">{t("news.title")}</h2>
            </div>
            <Button asChild variant="outline" className="rounded-2xl border-slate-200 font-bold h-12 px-6">
              <Link href="/news" aria-label={t("news.viewAll")}>{t("news.viewAll")}</Link>
            </Button>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {(data.latestNews || []).map((news, i) => (
              <motion.div
                key={news.id}
                {...fadeIn}
                transition={{ delay: i * 0.1 }}
                className="group cursor-pointer"
              >
                <div className="relative aspect-[16/10] rounded-3xl overflow-hidden bg-slate-100 mb-8 shadow-lg group-hover:shadow-2xl transition-all duration-500">
                  <div className="absolute top-6 left-6 z-10">
                    <Badge className={cn(
                      "px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border-none shadow-lg",
                      news.type === 'research' ? "bg-blue-600 text-white" : "bg-orange-500 text-white"
                    )}>
                      {news.type === 'research' ? t("news.research") : t("news.industry")}
                    </Badge>
                  </div>
                  <div className="w-full h-full bg-white/40 backdrop-blur-xl flex items-center justify-center text-slate-400 group-hover:scale-110 transition-transform duration-700 border border-white/20 rounded-3xl">
                    <Newspaper className="w-16 h-16 opacity-20" aria-hidden="true" />
                  </div>
                </div>
                <div className="space-y-4">
                  <p className="text-xs font-black text-slate-400 uppercase tracking-[0.2em]">
                    {new Date(news.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}
                  </p>
                  <h3 className="text-2xl font-bold text-slate-900 leading-tight group-hover:text-blue-600 transition-colors line-clamp-2">
                    {news.title}
                  </h3>
                  <div className="flex items-center gap-2 text-blue-600 font-bold text-sm opacity-0 group-hover:opacity-100 transition-opacity">
                    {t("news.readArticle")} <ArrowRight className="w-4 h-4" aria-hidden="true" />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 7: CONTACT */}
      <section className="py-32 relative overflow-hidden">
        <div className="container mx-auto px-6 max-w-7xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            <motion.div {...fadeIn} className="rounded-3xl overflow-hidden shadow-2xl aspect-video bg-white/40 backdrop-blur-xl border border-white/20 relative group">
              <div className="absolute inset-0 bg-blue-600/5 group-hover:bg-transparent transition-colors duration-500" aria-hidden="true" />
              <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-400 space-y-4">
                <div className="w-20 h-20 rounded-3xl bg-white shadow-xl flex items-center justify-center text-blue-600">
                  <MapPin className="w-10 h-10" aria-hidden="true" />
                </div>
                <span className="font-black uppercase tracking-[0.3em] text-xs">MTUN Secretariat Location</span>
              </div>
            </motion.div>

            <motion.div {...fadeIn} className="space-y-12">
              <div className="space-y-6">
                <h2 className="text-5xl font-bold text-slate-900 tracking-tight">{t("contact.title")}</h2>
                <p className="text-slate-500 text-xl leading-relaxed">
                  {t("contact.description")}
                </p>
              </div>

              <div className="space-y-8">
                <div className="flex items-start gap-6">
                  <div className="w-14 h-14 rounded-2xl bg-white shadow-md flex items-center justify-center text-blue-600 shrink-0">
                    <MapPin className="w-7 h-7" aria-hidden="true" />
                  </div>
                  <div>
                    <p className="font-black text-slate-900 uppercase text-xs tracking-widest mb-2">{t("contact.addressLabel")}</p>
                    <p className="text-slate-500 font-medium">{t("contact.addressValue")}</p>
                  </div>
                </div>
                <div className="flex items-start gap-6">
                  <div className="w-14 h-14 rounded-2xl bg-white shadow-md flex items-center justify-center text-blue-600 shrink-0">
                    <Mail className="w-7 h-7" aria-hidden="true" />
                  </div>
                  <div>
                    <p className="font-black text-slate-900 uppercase text-xs tracking-widest mb-2">{t("contact.emailLabel")}</p>
                    <p className="text-slate-500 font-medium">{t("contact.emailValue")}</p>
                  </div>
                </div>
              </div>

              <Button asChild size="lg" className="h-16 px-12 rounded-2xl bg-slate-900 hover:bg-black text-white font-bold text-lg shadow-2xl transition-all hover:scale-105">
                <Link href="/contact" aria-label={t("contact.cta")}>{t("contact.cta")}</Link>
              </Button>
            </motion.div>
          </div>
        </div>
      </section>

      <div className="pb-20" />

    </div>
  );
}
