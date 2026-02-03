"use client";

import React, { useState, useEffect } from "react";
// ⚠️ 1. เปลี่ยน Link และ usePathname ให้มาจากระบบนำทางของเรา
import { Link, usePathname } from "@/navigation";
import { motion, useScroll, useTransform } from "framer-motion";
// ⚠️ 2. Import เครื่องมือแปลภาษา
import { useTranslations } from "next-intl";
import LanguageSwitcher from "@/components/LanguageSwitcher";

import { 
  Menu, 
  GraduationCap, 
  Lock, 
  ChevronRight,
  Home,
  Info,
  Users,
  FlaskConical,
  Building2,
  Briefcase,
  Handshake,
  Newspaper,
  Mail
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";

export default function PublicNavbar() {
  // 3. เรียกใช้ Hook แปลภาษา
  const t = useTranslations('Nav');
  
  const pathname = usePathname();
  const { scrollY } = useScroll();
  
  const navScale = useTransform(scrollY, [0, 100], [1, 0.98]);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const unsubscribe = scrollY.on("change", (latest) => {
      setIsScrolled(latest > 50);
    });
    return () => unsubscribe();
  }, [scrollY]);

  // 4. ปรับ navLinks ให้ใช้ key แทน name (เพื่อให้แปลภาษาได้)
  const navLinks = [
    { key: "home", href: "/", icon: Home },
    { key: "about", href: "/about", icon: Info },
    { key: "staff", href: "/staff", icon: Users },
    { key: "research", href: "/research", icon: FlaskConical },
    { key: "industry", href: "/industry", icon: Briefcase },
    { key: "collaboration", href: "/collaboration", icon: Handshake },
    { key: "facilities", href: "/facilities", icon: Building2 },
    { key: "news", href: "/news", icon: Newspaper },
    { key: "contact", href: "/contact", icon: Mail },
  ];

  return (
    <div className="fixed top-0 left-0 right-0 z-50 flex justify-center pointer-events-none">
      <motion.header
        style={{ scale: navScale }}
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: "circOut" }}
        className={cn(
          "pointer-events-auto mt-6 mx-4 w-full max-w-[95%] transition-all duration-500",
          "bg-white/80 backdrop-blur-md border border-white/20 shadow-lg rounded-full px-6 py-3",
          isScrolled && "bg-white/90 backdrop-blur-md shadow-xl py-2.5"
        )}
      >
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-10 h-10 rounded-full bg-blue-800 flex items-center justify-center shadow-md group-hover:scale-110 transition-transform">
              <GraduationCap className="w-6 h-6 text-white" />
            </div>
            <span className="text-lg font-black text-blue-950 tracking-tighter hidden lg:block">
              MTUN <span className="text-blue-600">Deans</span>
            </span>
          </Link>

          {/* Desktop Menu */}
          <nav className="hidden xl:flex items-center gap-0.5">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.key}
                  href={link.href}
                  className={cn(
                    "relative px-3 py-2 text-[11px] font-black uppercase tracking-wider transition-all duration-300 rounded-full",
                    isActive ? "text-blue-800 bg-blue-50" : "text-slate-600 hover:text-blue-800 hover:bg-slate-50"
                  )}
                >
                  {/* 5. ใช้ t() เพื่อแสดงคำแปล */}
                  {t(link.key)}
                </Link>
              );
            })}
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-2">
            
            {/* 6. แทรกปุ่มเปลี่ยนภาษาตรงนี้ (และปรับสีให้เข้มขึ้นเพราะพื้นหลังขาว) */}
            <div className="[&_select]:text-slate-700 [&_select]:border-slate-200 [&_select]:bg-transparent hover:[&_select]:bg-slate-50">
                <LanguageSwitcher />
            </div>

            <Button asChild variant="ghost" className="hidden sm:flex text-slate-700 hover:text-blue-800 hover:bg-blue-50 rounded-full font-bold text-xs" aria-label="Staff Login">
              <Link href="/login">
                <Lock className="w-3.5 h-3.5 mr-2" aria-hidden="true" />
                {t('staffLogin')}
              </Link>
            </Button>
            
            {/* Mobile Menu Trigger */}
            <div className="xl:hidden">
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon" className="text-slate-700 hover:bg-slate-100 rounded-full">
                    <Menu className="w-6 h-6" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-[300px] bg-white/95 backdrop-blur-2xl border-slate-200 p-0">
                  <div className="flex flex-col h-full">
                    <div className="p-8 border-b border-slate-100">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-blue-800 flex items-center justify-center">
                          <GraduationCap className="w-6 h-6 text-white" />
                        </div>
                        <span className="text-xl font-black text-blue-950 tracking-tighter">MTUN</span>
                      </div>
                    </div>
                    
                    <div className="flex-1 overflow-y-auto py-8 px-4 space-y-1">
                      {navLinks.map((link) => (
                        <Link
                          key={link.key}
                          href={link.href}
                          className={cn(
                            "flex items-center justify-between px-6 py-4 rounded-2xl transition-all group",
                            pathname === link.href ? "bg-blue-50 text-blue-800" : "text-slate-600 hover:bg-slate-50 hover:text-blue-800"
                          )}
                        >
                          <div className="flex items-center gap-4">
                            <link.icon className={cn("w-5 h-5", pathname === link.href ? "text-blue-600" : "text-slate-400")} />
                            {/* 7. แปลภาษาในเมนูมือถือ */}
                            <span className="font-bold">{t(link.key)}</span>
                          </div>
                          <ChevronRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-all" />
                        </Link>
                      ))}
                    </div>

                    <div className="p-8 border-t border-slate-100">
                      <Button asChild className="w-full h-14 rounded-2xl bg-blue-800 hover:bg-blue-900 text-white font-bold shadow-lg">
                        <Link href="/login">
                          <Lock className="w-4 h-4 mr-2" />
                          {t('portalLogin')}
                        </Link>
                      </Button>
                    </div>
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </motion.header>
    </div>
  );
}