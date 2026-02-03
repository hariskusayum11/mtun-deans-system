"use client";

import React from "react";
import { format } from "date-fns";
import { 
  Users, 
  Handshake, 
  FlaskConical, 
  CheckCircle2, 
  Printer, 
  ShieldAlert,
  TrendingUp,
  Calendar,
  Building2,
  FileText,
  PieChart as PieChartIcon,
  Activity,
  Download,
  ArrowRight
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import Link from "next/link";
import IndustryChart from "./IndustryChart";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import {
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from "recharts";

interface ReportsClientProps {
  universityName: string;
  selectedYear: number;
  stats: {
    staffCount: number;
    industryCount: number;
    activeResearchCount: number;
    completedMeetingsCount: number;
  };
  researchHighlights: any[];
  recentMeetings: any[];
  newestPartners: any[];
  chartData: {
    sectorData: { name: string; value: number }[];
    industryStatusData: { name: string; value: number }[];
    statusData: { name: string; value: number }[];
    monthlyData: { name: string; value: number }[];
  };
}

export default function ReportsClient({
  universityName,
  selectedYear,
  stats,
  researchHighlights,
  recentMeetings,
  newestPartners,
  chartData,
}: ReportsClientProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const today = format(new Date(), "MMMM dd, yyyy");

  const handleYearChange = (year: string) => {
    const params = new URLSearchParams(searchParams);
    params.set("year", year);
    router.push(`${pathname}?${params.toString()}`);
  };

  const years = [2024, 2025, 2026];

  const exportToCSV = () => {
    const summaryRows = [
      ["Report Date", today],
      ["University", universityName],
      ["Report Year", selectedYear.toString()],
      [],
      ["--- Summary Metrics ---"],
      ["Metric", "Value"],
      ["Total Staff", stats.staffCount.toString()],
      ["Industry Partners", stats.industryCount.toString()],
      ["Active Research", stats.activeResearchCount.toString()],
      ["Meetings Held", stats.completedMeetingsCount.toString()],
      [],
      ["--- Monthly Activity ---"],
      ["Month", "Meetings Count"],
      ...chartData.monthlyData.map(m => [m.name, m.value.toString()])
    ];

    const csvContent = summaryRows.map(row => row.join(",")).join("\n");
    
    // Add UTF-8 BOM for Excel Thai character support
    const BOM = "\uFEFF";
    const blob = new Blob([BOM + csvContent], { type: "text/csv;charset=utf-8;" });
    
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `Executive_Report_${selectedYear}_${universityName.replace(/\s+/g, '_')}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen bg-slate-100/50 py-4 md:py-8 px-2 sm:px-6 lg:px-8">
      {/* Floating Print Button */}
      <div className="fixed bottom-6 right-6 md:bottom-8 md:right-8 no-print z-50">
        <Button
          onClick={() => window.print()}
          className="h-12 w-12 md:h-14 md:w-14 rounded-full bg-blue-600 hover:bg-blue-700 text-white shadow-2xl shadow-blue-500/40 flex items-center justify-center transition-all active:scale-90"
        >
          <Printer className="h-5 w-5 md:h-6 md:w-6" />
        </Button>
      </div>

      {/* Report Controls Toolbar */}
      <div className="w-full mb-6 md:mb-8 no-print flex flex-col sm:flex-row items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
        <div className="flex items-center gap-4 w-full sm:w-auto">
          <div className="flex flex-col w-full sm:w-auto">
            <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-1 ml-1">Filter by Year</span>
            <Select value={selectedYear.toString()} onValueChange={handleYearChange}>
              <SelectTrigger className="w-full sm:w-[180px] rounded-xl border-slate-200 font-bold text-slate-700">
                <SelectValue placeholder="Select Year" />
              </SelectTrigger>
              <SelectContent className="rounded-xl border-slate-200">
                {years.map((y) => (
                  <SelectItem key={y} value={y.toString()} className="font-medium">
                    Academic Year {y}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <Button
            variant="outline"
            onClick={exportToCSV}
            className="flex-1 sm:flex-none border-slate-200 hover:bg-slate-50 text-slate-600 rounded-xl font-bold flex items-center justify-center gap-2 px-4 md:px-6 text-xs md:text-sm"
          >
            <Download className="h-4 w-4" />
            Export CSV
          </Button>
          <Button
            onClick={() => window.print()}
            className="flex-1 sm:flex-none bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-bold flex items-center justify-center gap-2 px-4 md:px-6 text-xs md:text-sm"
          >
            <Printer className="h-4 w-4" />
            Print Report
          </Button>
        </div>
      </div>

      {/* Main Report Container */}
      <div id="report-content" className="print-container bg-white p-4 md:p-8 w-full space-y-6 md:space-y-8 relative overflow-hidden rounded-2xl border border-slate-200 shadow-sm print:shadow-none print:border-none print:p-0 print:rounded-none">
        
        {/* Print-Only Header */}
        <div className="hidden print:flex items-center justify-between border-b-2 border-black pb-6 mb-8">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-slate-900 rounded-xl flex items-center justify-center">
              <Building2 className="h-10 w-10 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-black text-slate-900">{universityName}</h1>
              <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">MTUN Deans' System - Executive Report</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Generated On</p>
            <p className="text-sm font-bold text-slate-700">{today}</p>
          </div>
        </div>

        {/* Confidential Watermark/Badge */}
        <div className="absolute top-4 right-4 md:top-8 md:right-8">
          <Badge variant="outline" className="border-rose-200 text-rose-500 bg-rose-50/50 px-3 md:px-4 py-1 rounded-full font-black text-[8px] md:text-[10px] uppercase tracking-[0.2em] flex items-center gap-1.5 md:gap-2">
            <ShieldAlert className="h-2.5 w-2.5 md:h-3 md:w-3" />
            Confidential
          </Badge>
        </div>

        {/* Formal Header (Screen Only) */}
        <header className="border-b-4 border-slate-900 pb-6 md:pb-8 mb-8 md:mb-12 print:hidden">
          <div className="flex flex-col md:flex-row md:items-center gap-4 mb-6">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 md:w-12 md:h-12 bg-slate-900 rounded-xl flex items-center justify-center shrink-0">
                <Building2 className="h-6 w-6 md:h-7 md:w-7 text-white" />
              </div>
              <div>
                <h2 className="text-[10px] md:text-sm font-black text-slate-400 uppercase tracking-[0.3em] leading-none mb-1">
                  Institutional Report
                </h2>
                <h1 className="text-xl md:text-3xl font-black text-slate-900 tracking-tight line-clamp-1">
                  {universityName}
                </h1>
              </div>
            </div>
          </div>
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
            <div>
              <p className="text-3xl md:text-5xl font-black text-slate-900 tracking-tighter">
                Executive <span className="text-blue-600">Summary</span>
              </p>
            </div>
            <div className="text-left md:text-right">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Report Generated On</p>
              <p className="text-sm font-bold text-slate-700">{today}</p>
            </div>
          </div>
        </header>

        {/* Section 1: KPIs */}
        <section className="mb-8 md:mb-12">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            {[
              { label: "Total Staff", value: stats.staffCount, icon: Users, color: "#2563eb" },
              { label: "Industry Partners", value: stats.industryCount, icon: Handshake, color: "#10b981" },
              { label: "Active Research", value: stats.activeResearchCount, icon: FlaskConical, color: "#6366f1" },
              { label: "Meetings Held", value: stats.completedMeetingsCount, icon: CheckCircle2, color: "#f59e0b" },
            ].map((kpi, i) => (
              <div key={i} className="print-bg-force bg-slate-50 p-4 md:p-6 rounded-2xl md:rounded-3xl border border-slate-100 flex flex-col items-center text-center">
                <div 
                  className="w-8 h-8 md:w-10 md:h-10 rounded-xl md:rounded-2xl bg-white shadow-sm flex items-center justify-center mb-3 md:mb-4 shrink-0"
                  style={{ color: kpi.color }}
                >
                  <kpi.icon className="h-4 w-4 md:h-5 md:w-5" />
                </div>
                <p className="text-[8px] md:text-[10px] font-black uppercase text-slate-400 tracking-widest mb-1">{kpi.label}</p>
                <p className="text-xl md:text-3xl font-black text-slate-900">{kpi.value}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Section 2: Analytics Charts */}
        <section className="mb-8 md:mb-12 space-y-6 md:space-y-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
            {/* Industry Partners Chart with Toggle */}
            <IndustryChart 
              dataBySector={chartData.sectorData} 
              dataByStatus={chartData.industryStatusData} 
            />

            {/* Research Status Pie Chart */}
            <Card className="border-none shadow-lg rounded-[2rem] overflow-hidden bg-slate-50/50 border border-slate-100 print-card">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-black uppercase tracking-widest text-slate-400 flex items-center gap-2">
                  <PieChartIcon className="h-4 w-4 text-indigo-600" />
                  Research Status ({selectedYear})
                </CardTitle>
              </CardHeader>
              <CardContent className="h-[250px] md:h-[300px] pt-4">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={chartData.statusData.length > 0 ? chartData.statusData : [
                        { name: 'No Data', value: 1 }
                      ]}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {chartData.statusData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={['#6366f1', '#10b981', '#f59e0b', '#ef4444'][index % 4]} />
                      ))}
                      {chartData.statusData.length === 0 && <Cell fill="#e2e8f0" />}
                    </Pie>
                    <Tooltip 
                      contentStyle={{ borderRadius: '1rem', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                    />
                    <Legend verticalAlign="bottom" height={36} iconType="circle" />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          {/* Yearly Activity Area Chart */}
          <Card className="border-none shadow-lg rounded-[2rem] overflow-hidden bg-slate-50/50 border border-slate-100 print-card">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-black uppercase tracking-widest text-slate-400 flex items-center gap-2">
                <Activity className="h-4 w-4 text-amber-600" />
                Activity Trend ({selectedYear})
              </CardTitle>
            </CardHeader>
            <CardContent className="h-[250px] md:h-[300px] pt-4">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData.monthlyData}>
                  <defs>
                    <linearGradient id="colorAct" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#f59e0b" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 700, fill: '#94a3b8' }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 700, fill: '#94a3b8' }} />
                  <Tooltip 
                    contentStyle={{ borderRadius: '1rem', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                  />
                  <Area type="monotone" dataKey="value" stroke="#f59e0b" strokeWidth={3} fillOpacity={1} fill="url(#colorAct)" />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </section>

        {/* Section 3: Split View */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 mb-8 md:mb-12">
          {/* Left: Research */}
          <section className="space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div className="flex items-center gap-3">
                <TrendingUp className="h-5 w-5 text-blue-600" />
                <h3 className="text-lg font-black text-slate-900 uppercase tracking-tight">Research & Innovation</h3>
              </div>
            </div>
            <div className="space-y-6">
              {researchHighlights.length > 0 ? researchHighlights.slice(0, 5).map((project) => (
                <div key={project.id} className="space-y-3 group">
                  <div className="flex justify-between items-start gap-4">
                    <div className="flex-1">
                      <h4 className="text-sm font-bold text-slate-800 leading-tight group-hover:text-blue-600 transition-colors">
                        {project.title}
                      </h4>
                      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-1">
                        Lead: {project.staff?.name || "N/A"}
                      </p>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <Badge variant="outline" className="text-[9px] font-black uppercase tracking-widest shrink-0">
                        {project.status}
                      </Badge>
                      <Button variant="ghost" size="icon" asChild className="h-6 w-6 no-print">
                        <Link href={`/dashboard/research`}>
                          <ArrowRight className="h-3 w-3" />
                        </Link>
                      </Button>
                    </div>
                  </div>
                  <div className="space-y-1">
                    <div className="flex justify-between text-[9px] font-black uppercase tracking-widest text-slate-400">
                      <span>Progress</span>
                      <span className="text-blue-600">{project.progress || 0}%</span>
                    </div>
                    <Progress value={project.progress || 0} className="h-1.5" />
                  </div>
                </div>
              )) : (
                <p className="text-sm text-slate-400 italic">No ongoing research projects recorded.</p>
              )}
            </div>
          </section>

          {/* Right: Meeting Resolutions */}
          <section className="space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div className="flex items-center gap-3">
                <FileText className="h-5 w-5 text-emerald-600" />
                <h3 className="text-lg font-black text-slate-900 uppercase tracking-tight">Meeting Resolutions</h3>
              </div>
            </div>
            <div className="space-y-4">
              {recentMeetings.length > 0 ? recentMeetings.slice(0, 5).map((meeting) => (
                <div key={meeting.id} className="print-bg-force bg-slate-50/50 p-5 rounded-2xl border border-slate-100 group hover:bg-white hover:shadow-md transition-all duration-300">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2 text-[9px] font-black text-slate-400 uppercase tracking-widest">
                      <Calendar className="h-3 w-3" />
                      {format(new Date(meeting.date), "MMM dd, yyyy")}
                    </div>
                    <Button variant="ghost" size="icon" asChild className="h-6 w-6 no-print">
                      <Link href={`/dashboard/meetings/${meeting.id}`}>
                        <ArrowRight className="h-3 w-3" />
                      </Link>
                    </Button>
                  </div>
                  <h4 className="text-sm font-bold text-slate-800 mb-2 group-hover:text-blue-600 transition-colors">{meeting.title}</h4>
                  <p className="text-[11px] text-slate-500 leading-relaxed line-clamp-2 font-medium">
                    {meeting.minutes_details?.replace(/<[^>]*>/g, '') || "No summary available."}
                  </p>
                </div>
              )) : (
                <p className="text-sm text-slate-400 italic">No recent meeting minutes found.</p>
              )}
            </div>
          </section>
        </div>

        {/* Section 3: Industry Partners */}
        <section className="pt-8 border-t border-slate-100">
          <div className="flex items-center gap-3 mb-6">
            <Handshake className="h-5 w-5 text-indigo-600" />
            <h3 className="text-lg font-black text-slate-900 uppercase tracking-tight">Strategic Industry Partners</h3>
          </div>
          <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-3 gap-4">
            {newestPartners.length > 0 ? newestPartners.map((partner) => (
              <div key={partner.id} className="print-bg-force bg-slate-50 p-4 rounded-2xl border border-slate-100 flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-white shadow-sm flex items-center justify-center text-slate-400">
                  <Building2 className="h-4 w-4" />
                </div>
                <div className="overflow-hidden">
                  <p className="text-xs font-bold text-slate-800 truncate">{partner.name}</p>
                  <p className="text-[9px] text-slate-400 font-black uppercase tracking-widest truncate">{partner.sector || "Industry"}</p>
                </div>
              </div>
            )) : (
              <p className="text-sm text-slate-400 italic col-span-full">No industry partners listed.</p>
            )}
          </div>
        </section>

        {/* Footer */}
        <footer className="mt-20 pt-8 border-t border-slate-100 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-slate-900 rounded flex items-center justify-center">
              <span className="text-[8px] font-black text-white">MTUN</span>
            </div>
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Deans' System Portal</span>
          </div>
          <p className="text-[10px] font-bold text-slate-300 uppercase tracking-widest">
            Page 1 of 1
          </p>
        </footer>
      </div>
    </div>
  );
}
