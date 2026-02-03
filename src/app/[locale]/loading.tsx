"use client";

import GearLoader from "@/components/ui/GearLoader";
import { useTranslations } from "next-intl";

export default function Loading() {
  const t = useTranslations("Auth.login"); // Using a translation key from Auth.login for "Loading MTUN System..."

  return (
    <div className="fixed inset-0 z-[100000] flex flex-col items-center justify-center bg-white/80 backdrop-blur-md">
      <GearLoader size="w-32 h-32" className="mb-4" />
      <p className="text-lg font-semibold text-slate-700">{t("loadingSystem")}</p>
    </div>
  );
}
