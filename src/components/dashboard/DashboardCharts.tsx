"use client";

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend
} from 'recharts';
import { MoreHorizontal, RefreshCw, Download } from 'lucide-react';
import { motion } from 'framer-motion';
import { useRouter } from "next/navigation";
import { useTranslations } from 'next-intl';
import { cn } from "@/lib/utils";

interface DashboardChartsProps {
  staffByUni: { name: string; staff: number }[];
  roleDistribution: { name: string; value: number; color: string }[];
}

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1 }
};

const ChartActions = ({ onRefresh, onExport, data, filename }: { onRefresh: () => void, onExport: (data: any[], filename: string) => void, data: any[], filename: string }) => {
  const t = useTranslations("Dashboard.charts.actions");
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  return (
    <div className="relative" ref={menuRef}>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="p-3 hover:bg-slate-50 rounded-2xl transition-colors"
      >
        <MoreHorizontal className="h-5 w-5 text-slate-400" />
      </button>
      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-xl border border-gray-100 py-2 z-50 animate-in fade-in zoom-in duration-200 origin-top-right">
          <button
            onClick={() => {
              onRefresh();
              setIsOpen(false);
            }}
            className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
          >
            <RefreshCw className="h-4 w-4 text-gray-400" />
            {t("refresh")}
          </button>
          <button
            onClick={() => {
              onExport(data, filename);
              setIsOpen(false);
            }}
            className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
          >
            <Download className="h-4 w-4 text-gray-400" />
            {t("export")}
          </button>
        </div>
      )}
    </div>
  );
};

const DashboardCharts = ({ staffByUni, roleDistribution }: DashboardChartsProps) => {
  const t = useTranslations("Dashboard.charts");
  const router = useRouter();
  const [barSize, setBarSize] = useState(45); // Default for desktop
  const [pieRadius, setPieRadius] = useState({ inner: 80, outer: 120 }); // Default for desktop

  const updateChartSizes = useCallback(() => {
    if (typeof window !== 'undefined') {
      setBarSize(window.innerWidth < 768 ? 25 : 45);
      setPieRadius({
        inner: window.innerWidth < 768 ? 50 : 80,
        outer: window.innerWidth < 768 ? 80 : 120,
      });
    }
  }, []);

  useEffect(() => {
    updateChartSizes(); // Set initial size on mount
    window.addEventListener('resize', updateChartSizes);
    return () => window.removeEventListener('resize', updateChartSizes);
  }, [updateChartSizes]);

  const handleRefresh = () => {
    router.refresh();
  };

  const handleExport = (data: any[], filename: string) => {
    if (data.length === 0) return;
    const headers = Object.keys(data[0]).join(",");
    const rows = data.map(item => Object.values(item).join(",")).join("\n");
    const csvContent = `${headers}\n${rows}`;
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `${filename}_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
      {/* Bar Chart */}
      <motion.div variants={itemVariants} className="bg-white p-5 md:p-8 rounded-2xl md:rounded-[2.5rem] border border-slate-100 shadow-sm">
        <div className="flex items-center justify-between mb-6 md:mb-10">
          <div>
            <h3 className="text-lg md:text-xl font-black text-slate-900 tracking-tight">{t("staffDist")}</h3>
            <p className="text-xs md:text-sm text-slate-400 font-medium">{t("staffDistDesc")}</p>
          </div>
          <ChartActions 
            onRefresh={handleRefresh} 
            onExport={handleExport} 
            data={staffByUni} 
            filename="staff_distribution" 
          />
        </div>
        <div className="h-[250px] md:h-[350px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={staffByUni}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
              <XAxis 
                dataKey="name" 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: '#94A3B8', fontSize: 10, fontWeight: 700 }}
                dy={10}
              />
              <YAxis 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: '#94A3B8', fontSize: 10, fontWeight: 700 }}
              />
              <Tooltip 
                cursor={{ fill: '#F8FAFC', radius: 8 }}
                contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)', padding: '12px' }}
              />
              <Bar dataKey="staff" fill="#3B82F6" radius={[6, 6, 0, 0]} barSize={barSize} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </motion.div>

      {/* Pie Chart */}
      <motion.div variants={itemVariants} className="bg-white p-5 md:p-8 rounded-2xl md:rounded-[2.5rem] border border-slate-100 shadow-sm">
        <div className="flex items-center justify-between mb-6 md:mb-10">
          <div>
            <h3 className="text-lg md:text-xl font-black text-slate-900 tracking-tight">{t("userRoles")}</h3>
            <p className="text-xs md:text-sm text-slate-400 font-medium">{t("userRolesDesc")}</p>
          </div>
          <ChartActions 
            onRefresh={handleRefresh} 
            onExport={handleExport} 
            data={roleDistribution.map(({name, value}) => ({name, value}))} 
            filename="role_distribution" 
          />
        </div>
        <div className="h-[250px] md:h-[350px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={roleDistribution}
                cx="50%"
                cy="50%"
                innerRadius={pieRadius.inner}
                outerRadius={pieRadius.outer}
                paddingAngle={8}
                dataKey="value"
                stroke="none"
              >
                {roleDistribution.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)', padding: '12px' }}
              />
              <Legend 
                verticalAlign="bottom" 
                height={36} 
                iconType="circle"
                formatter={(value) => <span className="text-slate-600 font-bold text-[10px] md:text-xs ml-1 md:ml-2">{value}</span>}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </motion.div>
    </div>
  );
};

export default DashboardCharts;
