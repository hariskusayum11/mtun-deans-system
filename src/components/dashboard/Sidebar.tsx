"use client";

import { Link, useRouter } from "@/navigation";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import { useTranslations } from "next-intl";
import {
  LayoutDashboard,
  University,
  Users,
  Settings,
  ClipboardCheck,
  FlaskConical,
  Briefcase,
  Building,
  Newspaper,
  LogOut,
  Calendar,
  UserCircle,
  ChevronRight,
  FileClock,
  FileText,
  Handshake, // Added for Industry Activities
} from "lucide-react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { User } from "next-auth";
import { Role } from "@prisma/client";
import ConfirmModal from "@/components/ui/ConfirmModal";
import { useState } from "react";

interface SidebarProps {
  user: User;
}

type MenuGroup = "main" | "system" | "management";

interface MenuItem {
  labelKey: string;
  href: string;
  icon: React.ElementType;
  allowedRoles: Role[];
  group: MenuGroup;
}

const MENU_ITEMS: MenuItem[] = [
  // Main Menu Group
  { labelKey: "dashboard", href: "/dashboard", icon: LayoutDashboard, allowedRoles: [Role.super_admin, Role.dean, Role.data_entry], group: "main" },
  { labelKey: "approvals", href: "/dashboard/approvals", icon: ClipboardCheck, allowedRoles: [Role.dean], group: "main" },
  { labelKey: "myUniversity", href: "/dashboard/my-university", icon: University, allowedRoles: [Role.dean], group: "main" },
  { labelKey: "reports", href: "/dashboard/reports", icon: Newspaper, allowedRoles: [Role.dean], group: "main" },

  // Data Entry / Management Group
  { labelKey: "meetings", href: "/dashboard/meetings", icon: Calendar, allowedRoles: [Role.dean, Role.data_entry], group: "main" },
  { labelKey: "minutes", href: "/dashboard/minutes", icon: FileText, allowedRoles: [Role.super_admin, Role.dean, Role.data_entry], group: "main" },
  { labelKey: "staff", href: "/dashboard/staff", icon: Users, allowedRoles: [Role.data_entry], group: "main" },
  { labelKey: "research", href: "/dashboard/research", icon: FlaskConical, allowedRoles: [Role.data_entry], group: "main" },
  { labelKey: "industry", href: "/dashboard/industry", icon: Briefcase, allowedRoles: [Role.data_entry], group: "main" },
  { labelKey: "activities", href: "/dashboard/industry/activities", icon: Handshake, allowedRoles: [Role.data_entry], group: "main" }, // Ensure this link is correct
  { labelKey: "facilities", href: "/dashboard/facilities", icon: Building, allowedRoles: [Role.data_entry], group: "main" },
  // { labelKey: "news", href: "/dashboard/news", icon: Newspaper, allowedRoles: [Role.data_entry], group: "main" },

  // System Group
  { labelKey: "universities", href: "/dashboard/universities", icon: University, allowedRoles: [Role.super_admin], group: "main" },
  { labelKey: "users", href: "/dashboard/users", icon: Users, allowedRoles: [Role.super_admin], group: "main" },
  { labelKey: "logs", href: "/dashboard/logs", icon: FileClock, allowedRoles: [Role.super_admin], group: "system" },
  { labelKey: "settings", href: "/dashboard/settings", icon: Settings, allowedRoles: [Role.super_admin], group: "system" },

  // User Group
  { labelKey: "profile", href: "/dashboard/profile", icon: UserCircle, allowedRoles: [Role.super_admin, Role.dean, Role.data_entry], group: "management" },
];

export default function Sidebar({ user }: SidebarProps) {
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const t = useTranslations("Dashboard.sidebar");
  const tCommon = useTranslations("Common");
  const pathname = usePathname();
  const userRole = user?.role as Role;

  const filteredItems = MENU_ITEMS.filter(item => item.allowedRoles.includes(userRole));

  const renderGroup = (group: MenuGroup, titleKey: string) => {
    const groupItems = filteredItems.filter(item => item.group === group);
    if (groupItems.length === 0) return null;

    return (
      <div key={group}>
        <h3 className="text-[10px] font-black uppercase text-white/30 mb-4 px-4 tracking-[0.2em]">{t(titleKey)}</h3>
        <ul className="space-y-1.5">
          {groupItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <li key={item.href + item.labelKey}>
                <Link
                  href={item.href}
                  className={cn(
                    "flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-300 group",
                    isActive
                      ? "relative before:absolute before:left-0 before:top-0 before:h-full before:w-1 before:bg-blue-500 before:rounded-r-lg bg-white/5 text-white"
                      : "text-white/60 hover:bg-white/5 hover:text-white"
                  )}
                >
                  <div className="flex items-center gap-3">
                    <item.icon className={cn("h-5 w-5 transition-transform duration-300 group-hover:scale-110", isActive ? "text-blue-400" : "text-blue-400/60 group-hover:text-blue-400")} />
                    <span className="text-sm font-bold">{t(item.labelKey)}</span>
                  </div>
                  {isActive && <ChevronRight className="w-4 h-4 opacity-50" />}
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    );
  };

  const avatarUrl = user.image || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name || "User")}&background=0D47A1&color=fff&size=128`;

  return (
    <aside className="w-full lg:w-72 bg-[#0a1128] text-white min-h-screen flex flex-col font-sans border-r border-white/5 shadow-2xl relative z-20">
      {/* Logo Section */}
      <div className="p-8 mb-2">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-white/10 backdrop-blur-lg rounded-xl flex items-center justify-center border border-white/10 shadow-inner">
            <Image
              src="https://i0.wp.com/itex.com.my/wp-content/uploads/2023/03/ITEX23-MTUN-LOGO.png?w=879&ssl=1"
              alt="MTUN Logo"
              width={24}
              height={24}
              style={{ objectFit: 'contain' }}
              className="brightness-0 invert"
            />
          </div>
          <div className="flex flex-col">
            <span className="text-xl font-black tracking-tighter leading-none">MTUN</span>
            <span className="text-[10px] font-bold text-blue-400 uppercase tracking-[0.2em]">{t("systemName")}</span>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 overflow-y-auto custom-scrollbar space-y-8">
        {renderGroup("main", "mainMenu")}
        {renderGroup("system", "system")}
        {renderGroup("management", "management")}
      </nav>

      {/* User Profile & Logout Section */}
      <div className="p-4 mt-auto">
        <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-4 border border-white/5 shadow-inner">
          <Link
            href="/dashboard/profile"
            className="flex items-center gap-3 mb-4 group cursor-pointer"
          >
            <div className="relative">
              <img
                src={avatarUrl}
                alt={user.name || "User"}
                className="w-10 h-10 rounded-xl object-cover border border-white/10 group-hover:border-blue-500 transition-colors"
              />
              <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-[#0a1128]" />
            </div>
            <div className="flex flex-col overflow-hidden">
              <span className="text-sm font-bold text-white truncate group-hover:text-blue-400 transition-colors">
                {user.name || "User Name"}
              </span>
              <span className="text-[10px] font-medium text-white/40 uppercase tracking-wider">
                {user.role.replace("_", " ")}
              </span>
            </div>
          </Link>

          <button
            onClick={() => setIsLogoutModalOpen(true)}
            suppressHydrationWarning
            className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white transition-all duration-300 text-xs font-bold group"
          >
            <LogOut className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
            {t("signOut")}
          </button>
        </div>

        <div className="mt-4 text-[10px] font-medium text-white/20 text-center uppercase tracking-widest">
          &copy; {new Date().getFullYear()} MTUN Deans' System
        </div>
      </div>

      <ConfirmModal
        isOpen={isLogoutModalOpen}
        onClose={() => setIsLogoutModalOpen(false)}
        onConfirm={() => signOut({ callbackUrl: "/" })}
        title={tCommon("logoutTitle")}
        description={tCommon("logoutDesc")}
        variant="danger"
        icon={LogOut}
      />
    </aside>
  );
}
