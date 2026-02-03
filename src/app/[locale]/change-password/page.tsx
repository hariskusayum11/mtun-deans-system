"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { ChangePasswordSchema } from "@/lib/validators";
import { updatePassword } from "@/actions/update-password";
import { useState, useTransition } from "react";
import { cn } from "@/lib/utils";
import { Lock, ShieldCheck, ArrowRight, CheckCircle2, Mail } from "lucide-react";
import Image from "next/image";
import toast from "react-hot-toast";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { PasswordInput } from "@/components/auth/PasswordInput";

type ChangePasswordInputs = z.infer<typeof ChangePasswordSchema>;

export default function ChangePasswordPage() {
  const t = useTranslations("Auth.changePassword");
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ChangePasswordInputs>({
    resolver: zodResolver(ChangePasswordSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = (data: ChangePasswordInputs) => {
    setError(null);
    startTransition(async () => {
      const result = await updatePassword(data);
      if (result?.error) {
        setError(result.error);
        toast.error(result.error);
      } else {
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
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, type: "spring" }}
              className="mb-10"
            >
              <div className="w-24 h-24 bg-white/10 backdrop-blur-xl rounded-[2rem] flex items-center justify-center mx-auto border border-white/20 shadow-2xl">
                <ShieldCheck className="w-12 h-12 text-blue-600" />
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

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="mt-12 flex flex-col items-center gap-4"
            >
              <div className="flex items-center gap-3 text-sm font-bold text-slate-500">
                <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                <span>{t("feature1")}</span>
              </div>
              <div className="flex items-center gap-3 text-sm font-bold text-slate-500">
                <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                <span>{t("feature2")}</span>
              </div>
            </motion.div>
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
                <h2 className="text-3xl font-black text-slate-900 tracking-tight mb-2">{t("formTitle")}</h2>
                <p className="text-slate-500 font-medium">{t("formDescription")}</p>
              </div>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
                <div className="space-y-5">
                  {/* New Password Input */}
                  <PasswordInput
                    label={t("passwordLabel")}
                    register={register("password")}
                    error={errors.password?.message}
                    placeholder={t("passwordPlaceholder")}
                    disabled={isPending}
                  />

                  {/* Confirm Password Input */}
                  <PasswordInput
                    label={t("confirmPasswordLabel")}
                    register={register("confirmPassword")}
                    error={errors.confirmPassword?.message}
                    placeholder={t("confirmPasswordPlaceholder")}
                    disabled={isPending}
                  />
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

                {/* Submit Button */}
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
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
