"use client";

import { Session } from "next-auth";
import { Search, User as UserIcon, ChevronDown } from "lucide-react";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import Link from "next/link";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import NotificationBell from "@/components/layout/NotificationBell"; // Import NotificationBell

interface HeaderProps {
  user: Session["user"];
}

export default function Header({ user }: HeaderProps) {
  const t = useTranslations("Dashboard.header");
  const avatarUrl = user.image || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name || "User")}&background=0D47A1&color=fff&size=128`;

  return (
    <header className="h-16 md:h-20 bg-white/80 backdrop-blur-md border-b border-gray-100 px-4 md:px-8 flex items-center justify-between sticky top-0 z-10 shadow-sm shadow-gray-900/5">
      <div className="flex items-center gap-4 md:gap-8 flex-1">
        <div className="relative max-w-md w-full hidden lg:block">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-4 w-4 text-gray-400" />
          </div>
          <input
            type="text"
            className="block w-full bg-gray-50 border-none rounded-xl pl-10 pr-4 py-2.5 text-sm text-gray-900 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
            placeholder={t("searchPlaceholder")}
            suppressHydrationWarning // Suppress hydration warning for browser-added attributes like fdprocessedid
          />
        </div>
      </div>

      <div className="flex items-center gap-2 md:gap-6">
        <div className="hidden sm:block">
          <LanguageSwitcher />
        </div>

        {/* Notifications */}
        <NotificationBell />

        <div className="h-6 md:h-8 w-px bg-gray-100" />

        {/* User Profile Dropdown Trigger */}
        <Link href="/dashboard/profile">
          <motion.button 
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="flex items-center gap-2 md:gap-3 p-1 md:p-1.5 md:pr-3 rounded-xl md:rounded-2xl hover:bg-gray-50 transition-all border border-transparent hover:border-gray-100"
          >
            <div className="relative">
              <img 
                src={avatarUrl} 
                alt={user.name || "User"} 
                className="w-7 h-7 md:w-9 md:h-9 rounded-lg md:rounded-xl object-cover shadow-sm"
              />
              <div className="absolute -bottom-0.5 -right-0.5 w-2 h-2 md:w-2.5 md:h-2.5 bg-green-500 rounded-full border-2 border-white" />
            </div>
            <div className="flex flex-col items-start hidden sm:flex">
              <span className="text-xs md:text-sm font-bold text-gray-900 leading-none mb-1">
                {user.name || "User Name"}
              </span>
              <span className="text-[8px] md:text-[10px] font-bold text-blue-600 uppercase tracking-wider leading-none">
                {user.role.replace("_", " ")}
              </span>
            </div>
            <ChevronDown className="w-3 h-3 md:w-4 md:h-4 text-gray-400 ml-0.5 md:ml-1" />
          </motion.button>
        </Link>
      </div>
    </header>
  );
}
