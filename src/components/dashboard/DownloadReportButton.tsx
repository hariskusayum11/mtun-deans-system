"use client";

import React from 'react';
import { Download } from 'lucide-react';
import { useTranslations } from 'next-intl';

interface DownloadReportButtonProps {
  stats: {
    totalUniversities: number;
    totalUsers: number;
    activeStaff: number;
    dbStatus: string;
  };
}

const DownloadReportButton = ({ stats }: DownloadReportButtonProps) => {
  const t = useTranslations("Dashboard.report");

  const handleDownload = () => {
    const csvContent = [
      [t("metrics.metric"), t("metrics.value")],
      [t("metrics.totalUniversities"), stats.totalUniversities],
      [t("metrics.totalUsers"), stats.totalUsers],
      [t("metrics.activeStaff"), stats.activeStaff],
      [t("metrics.dbStatus"), stats.dbStatus],
      [t("metrics.generatedAt"), new Date().toLocaleString()]
    ].map(e => e.join(",")).join("\n");

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `${t("filename")}_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <button 
      onClick={handleDownload}
      className="group flex items-center gap-2 px-6 py-3 text-sm font-bold text-slate-600 bg-white hover:bg-slate-900 hover:text-white border border-slate-200 rounded-2xl shadow-sm transition-all duration-300"
    >
      <Download className="h-4 w-4 group-hover:translate-y-0.5 transition-transform" />
      {t("button")}
    </button>
  );
};

export default DownloadReportButton;
