"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { ResetSchema } from "@/lib/validators";
import { resetPassword } from "@/actions/reset-password";
import { useState, useTransition } from "react";
import { cn } from "@/lib/utils";
import { Mail, ArrowRight, ArrowLeft, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import { useTranslations } from "next-intl";

type ResetFormInputs = z.infer<typeof ResetSchema>;

export default function ForgotPasswordPage() {
  const t = useTranslations("Auth.forgotPassword");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetFormInputs>({
    resolver: zodResolver(ResetSchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = (data: ResetFormInputs) => {
    setError(null);
    setSuccess(null);

    startTransition(async () => {
      const result = await resetPassword(data);
      if (result?.error) {
        setError(result.error);
        toast.error(result.error);
      } else {
        setSuccess(data.email);
        toast.success(t("toastSuccess"));
      }
    });
  };

  return (
    <div className="min-h-screen flex relative overflow-hidden bg-slate-50">
      {/* Animated Background Blobs */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{
            x: [0, 100, 0],
            y: [0, 50, 0],
            scale: [1, 1.2, 1],
            rotate: [0, 180, 360],
          }}
          transition={{
            duration: 30,
            repeat: Infinity,
            ease: "linear",
          }}
          className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] bg-blue-400/20 rounded-full blur-[120px]"
        />
        <motion.div
          animate={{
            x: [0, -80, 0],
            y: [0, 100, 0],
            scale: [1, 1.1, 1],
            rotate: [360, 180, 0],
          }}
          transition={{
            duration: 40,
            repeat: Infinity,
            ease: "linear",
          }}
          className="absolute top-[20%] -right-[5%] w-[35%] h-[35%] bg-indigo-400/20 rounded-full blur-[100px]"
        />
        <motion.div
          animate={{
            x: [0, 50, 0],
            y: [0, -100, 0],
            scale: [1, 1.3, 1],
            rotate: [0, -180, -360],
          }}
          transition={{
            duration: 35,
            repeat: Infinity,
            ease: "linear",
          }}
          className="absolute -bottom-[10%] left-[20%] w-[45%] h-[45%] bg-blue-600/10 rounded-full blur-[130px]"
        />
      </div>

      <div className="flex w-full z-10">
        {/* Left Panel (Branding Side) */}
        <div className="hidden lg:flex w-1/2 relative items-center justify-center">
          <div className="text-center px-12 max-w-xl">
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="mb-10"
            >
              <div className="w-24 h-24 bg-white/10 backdrop-blur-xl rounded-[2rem] flex items-center justify-center mx-auto border border-white/20 shadow-2xl">
                <Mail className="w-12 h-12 text-blue-600" />
              </div>
            </motion.div>
            
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-6xl font-black mb-6 leading-tight tracking-tighter text-slate-900"
            >
              {t("title")} <span className="text-blue-600">{t("titleAccent")}</span>
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

        {/* Right Panel (Form Side) */}
        <div className="w-full lg:w-1/2 flex items-center justify-center px-6 relative">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            className="w-full max-w-md"
          >
            <div className="bg-white/70 backdrop-blur-xl border border-white/40 rounded-[2.5rem] p-10 shadow-2xl shadow-blue-900/10">
              <div className="mb-10">
                <Link 
                  href="/login" 
                  className="inline-flex items-center text-sm font-bold text-blue-600 hover:text-blue-700 transition-colors mb-6 group"
                >
                  <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
                  {t("backToLogin")}
                </Link>
                <h2 className="text-3xl font-black text-slate-900 tracking-tight mb-2">{t("formTitle")}</h2>
                <p className="text-slate-500 font-medium">{t("formDescription")}</p>
              </div>

              {success ? (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center py-4"
                >
                  <div className="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-6">
                    <CheckCircle2 className="w-10 h-10 text-emerald-500" />
                  </div>
                  <h3 className="text-2xl font-black text-slate-900 mb-2">{t("successTitle")}</h3>
                  <p className="text-slate-500 font-medium mb-10">
                    {t("successDescription", { email: success })}
                  </p>
                  <Link 
                    href="/login"
                    className="flex w-full justify-center rounded-xl bg-slate-900 px-4 py-4 text-lg font-bold text-white shadow-lg hover:bg-slate-800 transition-all duration-200"
                  >
                    {t("returnToLogin")}
                  </Link>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
                  <div className="space-y-2">
                    <label htmlFor="email" className="text-sm font-bold text-slate-700 ml-1">
                      {t("emailLabel")}
                    </label>
                    <div className="relative group">
                      <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
                        <Mail className="h-5 w-5 text-slate-400 group-focus-within:text-blue-600 transition-colors" />
                      </div>
                      <input
                        id="email"
                        type="email"
                        {...register("email")}
                        className={cn(
                          "block w-full rounded-xl border-slate-200 bg-white/50 pl-12 pr-4 py-3.5 text-slate-900 placeholder-slate-400 shadow-sm transition-all duration-200",
                          "focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none focus:bg-white",
                          "hover:border-slate-300",
                          errors.email && "border-red-500 focus:border-red-500 focus:ring-red-500/20"
                        )}
                        placeholder={t("emailPlaceholder")}
                        disabled={isPending}
                        required
                      />
                    </div>
                    {errors.email && (
                      <p className="mt-1 text-xs text-red-500 ml-1 font-medium">{errors.email.message}</p>
                    )}
                  </div>

                  {error && (
                    <motion.div 
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="rounded-xl bg-red-50 border border-red-100 p-4 text-sm text-red-600 flex items-center gap-3 font-medium"
                    >
                      <div className="h-1.5 w-1.5 rounded-full bg-red-600 shrink-0" />
                      {error}
                    </motion.div>
                  )}

                  <motion.div
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                  >
                    <button
                      type="submit"
                      disabled={isPending}
                      className="group relative flex w-full justify-center rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-4 py-4 text-lg font-bold text-white shadow-xl shadow-blue-500/25 hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 transition-all duration-200"
                    >
                      {isPending ? (
                        <span className="h-7 w-7 animate-spin rounded-full border-2 border-white/30 border-t-white"></span>
                      ) : (
                        <span className="flex items-center gap-2">
                          {t("submit")}
                          <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        </span>
                      )}
                    </button>
                  </motion.div>
                </form>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
