"use client";

import { useState } from "react";
import { signOut } from "next-auth/react";
import { LogOut } from "lucide-react";
import { useTranslations } from "next-intl";
import ConfirmModal from "@/components/ui/ConfirmModal";

export default function LogoutButton() {
  const t = useTranslations("Dashboard.sidebar"); // Using sidebar translations for signOut
  const tCommon = useTranslations("Common"); // Using common translations for modal
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);

  const handleLogoutConfirm = async () => {
    await signOut({ callbackUrl: "/" }); // Redirect strictly to the Homepage
    setIsLogoutModalOpen(false);
  };

  return (
    <>
      <button
        onClick={() => setIsLogoutModalOpen(true)}
        suppressHydrationWarning
        className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white transition-all duration-300 text-xs font-bold group"
      >
        <LogOut className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
        {t("signOut")}
      </button>

      <ConfirmModal
        isOpen={isLogoutModalOpen}
        onClose={() => setIsLogoutModalOpen(false)}
        onConfirm={handleLogoutConfirm}
        title={tCommon("logoutTitle")}
        description={tCommon("logoutDesc")}
        variant="danger"
        icon={LogOut}
      />
    </>
  );
}
