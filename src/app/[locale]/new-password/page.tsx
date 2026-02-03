"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { NewPasswordSchema } from "@/lib/validators";
import { newPassword } from "@/actions/new-password";
import { useState, useTransition, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { cn } from "@/lib/utils";
import { Lock, ShieldCheck, ArrowRight, ArrowLeft, CheckCircle2, AlertCircle } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import { useTranslations } from "next-intl";
import { PasswordInput } from "@/components/auth/PasswordInput";

type NewPasswordFormInputs = z.infer<typeof NewPasswordSchema>;

function NewPasswordForm() {
  const t = useTranslations("Auth.newPassword");
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<NewPasswordFormInputs>({
    resolver: zodResolver(NewPasswordSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = (data: NewPasswordFormInputs) => {
    setError(null);
    setSuccess(null);

    startTransition(async () => {
      const result = await newPassword(data, token);
      if (result?.error) {
        setError(result.error);
        toast.error(result.error);
      } else {
        setSuccess(result.success || t("toastSuccess"));
        toast.success(t("toastSuccess"));
      }
    });
  };

  return (
    <motion.div 
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.6 }}
      className="w-full max-w-md"
    >
      <div className="mb-12">
        <Link 
          href="/login" 
          className="inline-flex items-center text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors mb-8 group"
        >
          <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
          {t("backToLogin")}
        </Link>
        <h2 className="text-4xl font-extrabold text-gray-900 mb-3 tracking-tight">{t("formTitle")}</h2>
        <p className="text-gray-500 text-lg">{t("formDescription")}</p>
      </div>

      {success ? (
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white border border-gray-100 rounded-3xl p-8 shadow-xl shadow-blue-500/5 text-center"
        >
          <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="w-8 h-8 text-green-500" />
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-2">{t("successTitle")}</h3>
          <p className="text-gray-500 mb-8">
            {t("successDescription")}
          </p>
          <Link 
            href="/login"
            className="flex w-full justify-center rounded-xl bg-blue-600 px-4 py-3.5 text-lg font-bold text-white shadow-lg shadow-blue-500/25 hover:bg-blue-700 transition-all duration-200"
          >
            {t("goToLogin")}
          </Link>
        </motion.div>
      ) : (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          <div className="space-y-5">
            <PasswordInput
              label={t("passwordLabel")}
              register={register("password")}
              error={errors.password?.message}
              placeholder={t("passwordPlaceholder")}
              disabled={isPending}
            />

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
              className="rounded-xl bg-red-50 border border-red-100 p-4 text-sm text-red-600 flex items-center gap-3"
            >
              <AlertCircle className="w-5 h-5 shrink-0" />
              {error}
            </motion.div>
          )}

          {!token && (
            <div className="rounded-xl bg-amber-50 border border-amber-100 p-4 text-sm text-amber-700 flex items-center gap-3">
              <AlertCircle className="w-5 h-5 shrink-0" />
              {t("errorToken")}
            </div>
          )}

          <motion.div
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
          >
            <button
              type="submit"
              disabled={isPending || !token}
              className="group relative flex w-full justify-center rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-4 py-3.5 text-lg font-bold text-white shadow-lg shadow-blue-500/25 hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 transition-all duration-200"
            >
              {isPending ? (
                <span className="h-6 w-6 animate-spin rounded-full border-2 border-white/30 border-t-white"></span>
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
    </motion.div>
  );
}

export default function NewPasswordPage() {
  const t = useTranslations("Auth.newPassword");

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
          </div>
        </div>

        {/* Right Panel (Form Side) */}
        <div className="w-full lg:w-1/2 flex items-center justify-center px-6 relative">
          <div className="w-full max-w-md">
            <div className="bg-white/70 backdrop-blur-xl border border-white/40 rounded-[2.5rem] p-10 shadow-2xl shadow-blue-900/10">
              <Suspense fallback={
                <div className="flex items-center justify-center py-10">
                  <div className="h-10 w-10 animate-spin rounded-full border-4 border-blue-600 border-t-transparent"></div>
                </div>
              }>
                <NewPasswordForm />
              </Suspense>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
