"use client";

import React from "react";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { 
  GraduationCap, 
  Mail, 
  Phone, 
  MapPin, 
  Facebook, 
  Twitter, 
  Linkedin, 
  Instagram,
  ChevronRight
} from "lucide-react";

export default function Footer() {
  const t = useTranslations("Footer");

  return (
    <footer className="bg-slate-900 text-slate-400 py-20 border-t border-slate-800 relative z-20">
      <div className="container mx-auto px-6 max-w-7xl">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-24">
          
          {/* Col 1: Brand */}
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-lg">
                <GraduationCap className="w-6 h-6" />
              </div>
              <span className="text-xl font-black text-white tracking-tighter uppercase">MTUN</span>
            </div>
            <p className="text-sm leading-relaxed max-w-xs">
              {t("description")}
            </p>
            <div className="flex gap-4">
              {[Facebook, Twitter, Linkedin, Instagram].map((Icon, i) => (
                <a key={i} href="#" className="w-10 h-10 rounded-lg bg-slate-800 flex items-center justify-center hover:bg-blue-600 hover:text-white transition-all">
                  <Icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </div>

          {/* Col 2: Quick Links */}
          <div className="space-y-6">
            <h4 className="text-white font-bold uppercase tracking-widest text-xs">{t("quickLinks")}</h4>
            <ul className="grid grid-cols-1 gap-4">
              {[
                { name: t("links.academicStaff"), href: "/experts" },
                { name: t("links.researchImpact"), href: "/research" },
                { name: t("links.industryPartners"), href: "/industry" },
                { name: t("links.facilities"), href: "/facilities" }
              ].map((link) => (
                <li key={link.name}>
                  <Link href={link.href} className="text-sm hover:text-blue-400 transition-colors flex items-center gap-2 group">
                    <ChevronRight className="w-4 h-4 text-slate-700 group-hover:text-blue-400 transition-colors" />
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 3: Contact Info */}
          <div className="space-y-6">
            <h4 className="text-white font-bold uppercase tracking-widest text-xs">{t("contactUs")}</h4>
            <ul className="space-y-4">
              <li className="flex gap-4">
                <MapPin className="w-5 h-5 text-blue-500 shrink-0" />
                <span className="text-sm">{t("address")}</span>
              </li>
              <li className="flex gap-4">
                <Mail className="w-5 h-5 text-blue-500 shrink-0" />
                <span className="text-sm">info@mtun.edu.my</span>
              </li>
              <li className="flex gap-4">
                <Phone className="w-5 h-5 text-blue-500 shrink-0" />
                <span className="text-sm">+603-12345678</span>
              </li>
            </ul>
          </div>

        </div>

        <div className="mt-20 pt-8 border-t border-slate-800 flex flex-col md:flex-row justify-between items-center gap-6 text-[10px] font-bold uppercase tracking-widest">
          <p>{t("copyright")}</p>
          <div className="flex gap-8">
            <Link href="#" className="hover:text-white transition-colors">{t("privacyPolicy")}</Link>
            <Link href="#" className="hover:text-white transition-colors">{t("termsOfService")}</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
