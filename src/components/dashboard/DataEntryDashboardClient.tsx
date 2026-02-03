"use client";

import React from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/navigation";
import Image from "next/image";
import Lottie from "lottie-react"; // Import Lottie
import heroAnimation from "../../../public/animations/hero-animation.json"; // Import the animation JSON
import {
  FileText,
  Clock,
  CheckCircle2,
  AlertCircle,
  PlusCircle,
  UploadCloud,
  UserCog,
  ArrowRight,
  CalendarDays,
  BellRing,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface DataEntryDashboardProps {
  user: {
    name: string;
    image?: string | null;
    university: {
      name: string;
      logo: string | null;
      short_code: string;
      coverImage?: string | null;
    } | null;
  };
  stats: {
    myTotalSubmissions: number;
    myPendingApproval: number;
    myApproved: number;
    myNeedsRevision: number;
  };
  recentActivity: any[];
}

export default function DataEntryDashboardClient({
  user,
  stats,
  recentActivity,
}: DataEntryDashboardProps) {
  const t = useTranslations("Dashboard.dataEntry");
  const tCommon = useTranslations("Common");

  const StatCard = ({ title, value, icon: Icon, colorClass, bgClass, borderClass }: {
    title: string;
    value: number;
    icon: React.ElementType;
    colorClass: string;
    bgClass: string;
    borderClass: string;
  }) => (
    <div className={`group relative overflow-hidden rounded-2xl border ${borderClass} bg-white p-4 shadow-[0_2px_10px_rgba(0,0,0,0.03)] transition-all hover:-translate-y-1 hover:shadow-lg`}>
      <div className="flex items-center justify-between">
        <div className="relative z-10">
          <p className="text-xs font-bold uppercase tracking-wider text-slate-500">{title}</p>
          <h3 className="mt-1 text-2xl font-black text-slate-800 tracking-tight">{value}</h3>
        </div>
        <div className={`rounded-xl ${bgClass} p-2 ${colorClass} shadow-sm group-hover:scale-110 transition-transform`}>
          <Icon className="h-5 w-5" />
        </div>
      </div>
      <div className={`absolute -right-4 -top-4 h-20 w-20 rounded-full ${bgClass} opacity-20 blur-2xl group-hover:opacity-40 transition-opacity`} />
    </div>
  );

  const recentSubmissionsData = [
    { id: "1", title: t("recentSubmissions.table.mock1Title"), type: t("recentSubmissions.table.mock1Type"), date: "Jan 28, 2026", status: "Approved" },
    { id: "2", title: t("recentSubmissions.table.mock2Title"), type: t("recentSubmissions.table.mock2Type"), date: "Jan 25, 2026", status: "Pending" },
    { id: "3", title: t("recentSubmissions.table.mock3Title"), type: t("recentSubmissions.table.mock3Type"), date: "Jan 20, 2026", status: "Needs Revision" },
    { id: "4", title: t("recentSubmissions.table.mock4Title"), type: t("recentSubmissions.table.mock4Type"), date: "Jan 15, 2026", status: "Approved" },
  ];

  const upcomingDeadlinesData = [
    { id: "1", title: t("upcomingDeadlines.submitAnnualReportData"), date: "Feb 15, 2026", daysRemaining: 10 },
    { id: "2", title: t("upcomingDeadlines.annualPerformanceReview"), date: "Mar 15, 2026", daysRemaining: 40 },
    { id: "3", title: t("upcomingDeadlines.researchGrantProposal"), date: "Apr 01, 2026", daysRemaining: 57 },
  ];

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case "Approved":
        return "success";
      case "Pending":
        return "warning";
      case "Needs Revision":
        return "destructive";
      default:
        return "default";
    }
  };

  return (
    <div className="min-h-screen bg-[#F6F8FC] p-6 space-y-8 w-full max-w-full">

      {/* 1. Hero Section: Compact & Slim (V3 Design) */}
      <div className="relative overflow-hidden rounded-3xl bg-white p-0 shadow-xl shadow-blue-900/5 border border-slate-100 min-h-[220px]"> {/* Added min-h */}
        <div className="absolute inset-0 bg-gradient-to-r from-blue-700 to-indigo-600 opacity-95"></div>
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>

        <div className="relative z-10 flex flex-col-reverse lg:flex-row items-center justify-between p-6 md:px-8 md:py-6"> {/* Adjusted padding */}
          <div className="relative z-10 flex-1 space-y-3 text-center lg:text-left lg:max-w-[60%]"> {/* Added relative z-10 and lg:max-w-[60%] */}
            <div>
              <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-medium text-blue-100 backdrop-blur-sm border border-white/10 mb-2">
                <BellRing className="h-3 w-3" />
                <span>{t("systemUpdatedNotification")}</span>
              </div>
              <h1 className="text-2xl font-extrabold tracking-tight text-white md:text-3xl"> {/* Adjusted text size */}
                {t("welcome", { name: user.name })}
              </h1>
              <p className="mt-2 text-sm text-blue-100/90 font-light max-w-xl"> {/* Adjusted text margin */}
                {t("heroDescription")}
              </p>
            </div>

            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3 pt-1">
              {/* Primary CTA Button */}
              <Link
                href="/dashboard/meetings/create"
                className="group flex items-center gap-2 rounded-xl bg-white px-5 py-2.5 font-bold text-blue-700 shadow-xl shadow-blue-900/20 transition-all hover:bg-blue-50 hover:-translate-y-1 active:scale-95"
              >
                <PlusCircle className="h-4 w-4 transition-transform group-hover:rotate-90" />
                <span>{t("submitNewMeeting")}</span>
              </Link>

              {/* Secondary Button */}
              <Link
                href="/dashboard/minutes"
                className="flex items-center gap-2 px-5 py-2.5 font-semibold text-white/80 hover:text-white hover:bg-white/10 rounded-xl transition-all"
              >
                <UploadCloud className="h-4 w-4" />
                <span>{t("uploadMinutesButton")}</span>
              </Link>
            </div>
          </div>

          {/* 🖼️ Illustration Section (Lottie Animation) */}
          <div className="hidden lg:block absolute bottom-[-50px] right-4 w-[300px] h-[250px] lg:w-[380px] lg:h-[320px]"> {/* Adjusted bottom position further down */}
            <Lottie
              animationData={heroAnimation}
              loop={true}
              autoplay={true}
              className="w-full h-full"
            />
          </div>
        </div>
      </div>

      {/* 2. Stats Grid: 4 Cards (Floating Effect) */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title={t("stats.totalSubmissions.title")}
          value={stats.myTotalSubmissions || 0}
          icon={FileText}
          colorClass="text-blue-600" bgClass="bg-blue-50" borderClass="border-blue-100"
        />
        <StatCard
          title={t("stats.pendingApproval.title")}
          value={stats.myPendingApproval || 0}
          icon={Clock}
          colorClass="text-amber-600" bgClass="bg-amber-50" borderClass="border-amber-100"
        />
        <StatCard
          title={t("stats.approved.title")}
          value={stats.myApproved || 0}
          icon={CheckCircle2}
          colorClass="text-emerald-600" bgClass="bg-emerald-50" borderClass="border-emerald-100"
        />
        <StatCard
          title={t("stats.needsRevision.title")}
          value={stats.myNeedsRevision || 0}
          icon={AlertCircle}
          colorClass="text-rose-600" bgClass="bg-rose-50" borderClass="border-rose-100"
        />
      </div>

      {/* 3. Main Content Layout: Grid 2 sections (Left table / Right Quick Info) */}
      <div className="grid gap-4 lg:grid-cols-3">

        {/* Left Section: Recent Submissions Table (takes 2/3 space) */}
        <div className="lg:col-span-2 space-y-6">
          <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
            <div className="flex items-center justify-between border-b border-slate-100 px-6 py-5 bg-slate-50/50">
              <div className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-slate-400" />
                <h3 className="text-lg font-bold text-slate-800">{t("recentSubmissions.title")}</h3>
              </div>
              <Link href="/dashboard/submissions" className="text-sm font-semibold text-blue-600 hover:text-blue-700 hover:underline">
                {t("recentSubmissions.viewAll")}
              </Link>
            </div>

            {/* Table */}
            <div className="p-0 overflow-x-auto">
              {recentSubmissionsData.length > 0 ? (
                <table className="w-full text-left text-sm">
                  <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-100">
                    <tr>
                      <th className="px-6 py-4 whitespace-nowrap">{t("recentSubmissions.table.title")}</th>
                      <th className="px-6 py-4 whitespace-nowrap">{t("recentSubmissions.table.type")}</th>
                      <th className="px-6 py-4 whitespace-nowrap">{t("recentSubmissions.table.date")}</th>
                      <th className="px-6 py-4 text-right whitespace-nowrap">{t("recentSubmissions.table.status")}</th>
                      <th className="px-6 py-4 text-right whitespace-nowrap">{t("recentSubmissions.table.action")}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {recentSubmissionsData.map((submission) => (
                      <tr key={submission.id} className="group hover:bg-slate-50/80 transition-colors">
                        <td className="px-6 py-4 font-medium text-slate-800">{submission.title}</td>
                        <td className="px-6 py-4 text-slate-500">{submission.type}</td>
                        <td className="px-6 py-4 text-slate-500">{submission.date}</td>
                        <td className="px-6 py-4 text-right">
                          <Badge variant={getStatusBadgeVariant(submission.status)}>
                            {tCommon(submission.status.toLowerCase().replace(/\s/g, ''))}
                          </Badge>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <Link href={`/dashboard/submissions/${submission.id}`} className="text-blue-600 font-medium hover:underline cursor-pointer">
                            {tCommon("details")}
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <div className="text-center text-slate-500 py-8">
                  <FileText className="h-16 w-16 text-slate-200 mx-auto mb-4" />
                  <div className="text-lg font-bold">{t("recentSubmissions.empty")}</div>
                  <div className="text-sm mt-2">{t("recentSubmissions.emptyDesc")}</div>
                </div>
              )}
            </div>

            {/* Table Footer */}
            <div className="bg-slate-50 px-6 py-3 border-t border-slate-100 text-xs text-slate-400 text-center">
              {t("recentSubmissions.footer")}
            </div>
          </div>
        </div>

        {/* Right Section: Quick Widgets (takes 1/3 space) */}
        <div className="space-y-6">

          {/* Calendar / Reminder Widget */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
                <CalendarDays className="h-5 w-5" />
              </div>
              <h3 className="font-bold text-slate-800">{t("upcomingDeadlines.title")}</h3>
            </div>
            <div className="space-y-4">
              {upcomingDeadlinesData.length > 0 ? (
                upcomingDeadlinesData.map((deadline) => (
                  <div key={deadline.id} className="flex gap-3 items-start p-3 rounded-xl bg-slate-50 border border-slate-100 hover:border-blue-200 transition-colors">
                    <div className="bg-white p-2 rounded-lg border border-slate-200 text-center min-w-[50px]">
                      <span className="block text-xs text-slate-400 uppercase font-bold">{new Date(deadline.date).toLocaleString('en-US', { month: 'short' }).toUpperCase()}</span>
                      <span className="block text-lg font-black text-slate-800">{new Date(deadline.date).getDate()}</span>
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-700 leading-tight">{deadline.title}</p>
                      <p className="text-xs text-slate-400 mt-1">{t("upcomingDeadlines.daysRemaining", { days: deadline.daysRemaining })}</p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center text-slate-500 py-4">
                  <div className="text-sm">{t("upcomingDeadlines.empty")}</div>
                </div>
              )}
            </div>
          </div>

          {/* Quick Tools (New Design) */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h3 className="mb-4 font-bold text-slate-800">{t("quickTools.title")}</h3>
            <div className="space-y-3">
              <Link href="/dashboard/profile" className="flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 border border-transparent hover:border-slate-200 transition-all group">
                <div className="flex items-center gap-3">
                  <UserCog className="h-5 w-5 text-slate-400 group-hover:text-blue-600" />
                  <span className="text-sm font-medium text-slate-600 group-hover:text-slate-900">{t("quickTools.editProfile")}</span>
                </div>
                <ArrowRight className="h-4 w-4 text-slate-300 group-hover:text-blue-600" />
              </Link>
              <Link href="/dashboard/minutes" className="flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 border border-transparent hover:border-slate-200 transition-all group">
                <div className="flex items-center gap-3">
                  <UploadCloud className="h-5 w-5 text-slate-400 group-hover:text-blue-600" />
                  <span className="text-sm font-medium text-slate-600 group-hover:text-slate-900">{t("quickTools.uploadMinutes")}</span>
                </div>
                <ArrowRight className="h-4 w-4 text-slate-300 group-hover:text-blue-600" />
              </Link>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
