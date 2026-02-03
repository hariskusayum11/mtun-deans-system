"use client";

import React from 'react';
import { 
  Building2, 
  Users, 
  UserCheck, 
  Activity, 
  TrendingUp,
  Clock,
  Zap,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';
import { cn } from "@/lib/utils";
import DashboardCharts from "./DashboardCharts";
import DownloadReportButton from "./DownloadReportButton";
import Link from "next/link";

interface DashboardAdminClientProps {
  stats: {
    totalUniversities: number;
    totalUsers: number;
    activeStaff: number;
    dbStatus: string;
    dbColor: string;
  };
  staffByUni: { name: string; staff: number }[];
  roleDistribution: { name: string; value: number; color: string }[];
  recentUsers: any[];
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1 }
};

const DashboardAdminClient = ({ 
  stats, 
  staffByUni, 
  roleDistribution, 
  recentUsers 
}: DashboardAdminClientProps) => {
  const t = useTranslations("Dashboard.admin");

  const SUMMARY_STATS = [
    { 
      title: t("stats.totalUniversities"), 
      value: stats.totalUniversities.toString(), 
      trend: t("stats.stable"), 
      trendType: "neutral", 
      icon: Building2, 
      color: "text-blue-600", 
      bgColor: "bg-blue-50",
      description: t("stats.totalUniversitiesDesc")
    },
    { 
      title: t("stats.totalUsers"), 
      value: stats.totalUsers.toString(), 
      trend: t("stats.live"), 
      trendType: "up", 
      icon: Users, 
      color: "text-purple-600", 
      bgColor: "bg-purple-50",
      description: t("stats.totalUsersDesc")
    },
    { 
      title: t("stats.activeStaff"), 
      value: stats.activeStaff.toString(), 
      trend: t("stats.verified"), 
      trendType: "up", 
      icon: UserCheck, 
      color: "text-emerald-600", 
      bgColor: "bg-emerald-50",
      description: t("stats.activeStaffDesc")
    },
    { 
      title: t("stats.systemHealth"), 
      value: stats.dbStatus === 'Operational' ? t("stats.operational") : stats.dbStatus, 
      trend: stats.dbStatus === 'Operational' ? t("stats.optimal") : t("stats.critical"), 
      trendType: stats.dbStatus === 'Operational' ? "up" : "down", 
      icon: stats.dbStatus === 'Operational' ? CheckCircle2 : AlertCircle, 
      color: stats.dbColor, 
      bgColor: stats.dbStatus === 'Operational' ? "bg-emerald-50" : "bg-rose-50",
      description: t("stats.systemHealthDesc")
    },
  ];

  return (
    <motion.div 
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="space-y-6 md:space-y-8 p-4 md:p-6 lg:p-10 bg-slate-50/50 min-h-screen"
    >
      {/* 1. Page Header */}
      <motion.div variants={itemVariants} className="flex flex-col md:flex-row md:items-center justify-between gap-4 md:gap-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-blue-600 font-black text-[10px] md:text-xs uppercase tracking-[0.2em]">
            <Zap className="h-3.5 w-3.5 md:h-4 md:w-4 fill-current" />
            {t("badge")}
          </div>
          <h1 className="text-2xl md:text-4xl font-black text-slate-900 tracking-tight">{t("title")}</h1>
          <p className="text-slate-500 text-xs md:text-base font-medium">{t("welcome")}</p>
        </div>
        <div className="w-full md:w-auto">
          <DownloadReportButton stats={stats} />
        </div>
      </motion.div>

      {/* 2. Summary Cards */}
      <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {SUMMARY_STATS.map((stat, i) => (
          <motion.div 
            key={i} 
            variants={itemVariants}
            whileHover={{ y: -5 }}
            className="relative bg-white p-5 md:p-8 rounded-2xl md:rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-500 group overflow-hidden"
          >
            <div className="absolute -right-4 -bottom-4 opacity-[0.03] group-hover:opacity-[0.08] transition-opacity duration-500">
              <stat.icon className="w-24 h-24 md:w-32 md:h-32" />
            </div>
            <div className="flex items-center justify-between mb-4 md:mb-6">
              <div className={cn("p-3 md:p-4 rounded-xl md:rounded-2xl transition-all duration-500 group-hover:scale-110", stat.bgColor, stat.color)}>
                <stat.icon className="h-5 w-5 md:h-6 md:w-6" />
              </div>
              <div className={cn(
                "flex items-center gap-1 text-[8px] md:text-[10px] font-black px-2 py-0.5 md:px-2.5 md:py-1 rounded-lg uppercase tracking-wider",
                stat.trendType === 'up' ? "text-emerald-600 bg-emerald-50" : "text-slate-500 bg-slate-50"
              )}>
                {stat.trendType === 'up' ? <TrendingUp className="h-2.5 w-2.5 md:h-3 md:w-3" /> : null}
                {stat.trend}
              </div>
            </div>
            <div className="space-y-1">
              <p className="text-slate-400 text-[8px] md:text-[10px] font-black uppercase tracking-[0.15em]">{stat.title}</p>
              <h3 className="text-2xl md:text-4xl font-black text-slate-900 tracking-tight">{stat.value}</h3>
              <p className="text-slate-400 text-[10px] md:text-xs font-medium pt-1">{stat.description}</p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* 3. Analytics Charts */}
      <DashboardCharts staffByUni={staffByUni} roleDistribution={roleDistribution} />

      {/* 4. Recent Activity */}
      <motion.div variants={itemVariants} className="bg-white rounded-2xl md:rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
        <div className="p-6 md:p-10 border-b border-slate-50 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-xl md:text-2xl font-black text-slate-900 tracking-tight">{t("activity.title")}</h3>
            <p className="text-xs md:text-sm text-slate-400 font-medium mt-1">{t("activity.description")}</p>
          </div>
          <Link 
            href="/dashboard/settings"
            className="w-full sm:w-auto text-center px-6 py-2.5 text-[10px] md:text-xs font-black uppercase tracking-widest text-blue-600 bg-blue-50 rounded-xl hover:bg-blue-600 hover:text-white transition-all"
          >
            {t("activity.viewAll")}
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[600px]">
            <thead>
              <tr className="bg-slate-50/50 text-slate-400 text-[10px] uppercase font-black tracking-[0.2em] border-b border-slate-100">
                <th className="px-6 md:px-10 py-4 md:py-5">{t("activity.table.user")}</th>
                <th className="px-6 md:px-10 py-4 md:py-5">{t("activity.table.role")}</th>
                <th className="px-6 md:px-10 py-4 md:py-5">{t("activity.table.university")}</th>
                <th className="px-6 md:px-10 py-4 md:py-5 text-right">{t("activity.table.date")}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {recentUsers.map((u) => (
                <tr key={u.id} className="hover:bg-slate-50/80 transition-all group">
                  <td className="px-6 md:px-10 py-4 md:py-6">
                    <div className="flex items-center gap-3 md:gap-4">
                      <div className="w-8 h-8 md:w-10 md:h-10 rounded-lg md:rounded-xl bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center text-slate-600 font-black text-xs shadow-sm group-hover:scale-110 transition-transform">
                        {u.name?.charAt(0) || "U"}
                      </div>
                      <div>
                        <span className="text-xs md:text-sm font-bold text-slate-900 block">{u.name}</span>
                        <span className="text-[9px] md:text-[10px] text-slate-400 font-medium">{u.email}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 md:px-10 py-4 md:py-6">
                    <span className="inline-flex items-center px-2 py-0.5 md:px-3 md:py-1 rounded-lg text-[8px] md:text-[10px] font-black uppercase tracking-widest border bg-blue-50 text-blue-700 border-blue-100">
                      {u.role.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="px-6 md:px-10 py-4 md:py-6">
                    <span className="text-xs md:text-sm font-bold text-slate-600">{u.university?.name || "MTUN Central"}</span>
                  </td>
                  <td className="px-6 md:px-10 py-4 md:py-6 text-right">
                    <div className="flex items-center justify-end gap-2 text-[10px] md:text-xs font-black text-slate-400">
                      <Clock className="h-3 w-3 md:h-3.5 md:w-3.5" />
                      {new Date(u.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default DashboardAdminClient;
