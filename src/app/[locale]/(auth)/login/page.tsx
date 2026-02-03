"use client";

import Image from "next/image";
import LoginForm from "./LoginForm";
import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import BackgroundOrbs from "@/components/public/BackgroundOrbs";
import { Link } from "@/navigation";
import { ArrowLeft } from "lucide-react";

export default function LoginPage() {
  const t = useTranslations("Auth.login");

  return (
    <div className="min-h-screen flex relative overflow-hidden bg-slate-50">
      <BackgroundOrbs />

      {/* Back to Home Link */}
      <div className="absolute top-8 left-8 z-20">
        <Link
          href="/"
          className="flex items-center gap-2 text-slate-600 hover:text-blue-600 font-bold transition-colors group"
        >
          <div className="p-2 rounded-full bg-white/40 backdrop-blur-md border border-white/20 group-hover:bg-blue-50 transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </div>
          <span className="hidden sm:inline">{t("backToHome")}</span>
        </Link>
      </div>

      <div className="flex w-full z-10">
        {/* Left branding */}
        <div className="hidden lg:flex w-1/2 relative items-center justify-center">
          <div className="text-center px-12 max-w-xl">
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <Image
                src="/images/logos/mtun.webp"
                alt="MTUN Logo"
                width={180}
                height={180}
                priority
                className="mx-auto mb-10 drop-shadow-2xl"
              />
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-6xl font-black mb-6 tracking-tighter text-slate-900"
            >
              MTUN <span className="text-blue-600">{t("titleAccent")}</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="text-xl text-slate-600 font-medium leading-relaxed"
            >
              {t("description")}
            </motion.p>
          </div>
        </div>

        {/* Right form with Glassmorphism */}
        <div className="w-full lg:w-1/2 flex items-center justify-center px-6 relative">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            className="w-full max-w-md"
          >
            <div className="bg-white/40 backdrop-blur-2xl border border-white/20 rounded-[2.5rem] p-10 shadow-2xl shadow-blue-900/10">
              <div className="mb-10 text-center lg:text-left">
                <h2 className="text-3xl font-black text-slate-900 tracking-tight mb-2">
                  {t("formTitle")}
                </h2>
                <div className="h-1.5 w-12 bg-blue-600 rounded-full hidden lg:block" />
              </div>
              
              <LoginForm />
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
