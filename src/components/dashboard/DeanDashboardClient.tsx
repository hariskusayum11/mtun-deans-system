"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { format, isSameDay } from "date-fns";
import { 
  Users, 
  FlaskConical, 
  Handshake, 
  Calendar as CalendarIcon, 
  ArrowRight, 
  Clock, 
  MapPin,
  Check,
  ChevronRight,
  TrendingUp,
  Building2,
  ExternalLink,
  CheckCircle2,
  Coffee,
  Eye,
  XCircle,
  FileSignature
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "@/components/ui/calendar";
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from "recharts";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { useTranslations } from "next-intl";
import ApproveMeetingButton from "@/components/meetings/ApproveMeetingButton";
import RejectMeetingButton from "@/components/meetings/RejectMeetingButton";

interface DeanDashboardClientProps {
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
    staffCount: number; 
    researchCount: number; 
    partnerCount: number; 
    meetingCount: number 
  };
  pendingApprovals: any[];
  monthlyStats: { name: string; value: number }[];
  upcomingMeetings: any[];
  recentActivity: any[];
  calendarMeetings: { id: string; date: Date; title: string; start_time: Date; location: string | null; agenda_details?: string | null }[];
}

export default function DeanDashboardClient({
  user,
  stats,
  pendingApprovals,
  monthlyStats,
  upcomingMeetings,
  recentActivity,
  calendarMeetings,
}: DeanDashboardClientProps) {
  const t = useTranslations("Dashboard.dean");
  const today = format(new Date(), "EEEE, MMMM dd, yyyy");
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [selectedMeeting, setSelectedMeeting] = useState<any>(null);

  // Extract dates for calendar highlighting
  const isMeetingDay = (date: Date) => calendarMeetings.some(m => isSameDay(new Date(m.date), date));

  // Filter meetings for the selected date
  const selectedDateMeetings = calendarMeetings.filter(m => 
    selectedDate && isSameDay(new Date(m.date), selectedDate)
  ).sort((a, b) => new Date(a.start_time).getTime() - new Date(b.start_time).getTime());

  return (
    <div className="min-h-screen bg-slate-50/50 p-0 md:p-2 lg:p-4">
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Main Content Area */}
        <div className="flex-1 space-y-6">
          
          {/* 1. Hero Section */}
          <section className="relative overflow-hidden rounded-2xl bg-slate-900 py-6 md:py-10 px-5 md:px-10 text-white shadow-xl border border-slate-800">
            <div className="absolute inset-0 opacity-20 pointer-events-none">
              <img 
                src="https://img.freepik.com/free-vector/gradient-technological-background_23-2148884155.jpg" 
                alt="Background Pattern" 
                className="w-full h-full object-cover"
              />
            </div>
            
            <div className="relative z-10 flex flex-col md:grid md:grid-cols-4 items-center gap-6 md:gap-8">
              <div className="md:col-span-3 space-y-4 md:space-y-6 text-center md:text-left">
                <div className="space-y-2">
                  <h1 className="text-xl md:text-3xl lg:text-4xl font-black tracking-tight">
                    {t("welcome")} <span className="text-blue-400">Dean {user.name}</span>
                  </h1>
                  <p className="text-slate-300 text-xs md:text-lg font-medium">
                    {t("today")} {today}
                  </p>
                </div>
                <div className="flex justify-center md:justify-start">
                  <Button asChild className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold transition-all shadow-lg shadow-blue-500/20 px-5 md:px-8 py-4 md:py-6 text-xs md:text-base">
                    <Link href="/dashboard/reports">
                      {t("ctaReport")}
                      <ArrowRight className="ml-2 h-4 w-4 md:h-5 md:w-5" />
                    </Link>
                  </Button>
                </div>
              </div>
              <div className="hidden md:block md:col-span-1">
                <img 
                  src="https://img.freepik.com/free-vector/business-team-brainstorming-discussing-startup-project_74855-6909.jpg?w=1060" 
                  alt="Executive Illustration" 
                  className="w-full h-auto object-contain rounded-2xl shadow-2xl"
                />
              </div>
            </div>
          </section>

          {/* 2. "My University" Command Center */}
          <section>
            <Card className="border-slate-200 shadow-sm rounded-2xl overflow-hidden bg-white group">
              <div className="flex flex-col md:flex-row">
                <div className="h-24 md:h-40 md:w-[35%] relative overflow-hidden">
                  <div className={cn(
                    "absolute inset-0 w-full h-full",
                    !user.university?.coverImage && "bg-gradient-to-r from-slate-800 to-blue-900"
                  )}>
                    {user.university?.coverImage && (
                      <img 
                        src={user.university.coverImage} 
                        alt="University Building" 
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                    )}
                  </div>
                  <div className="absolute inset-0 bg-black/40 backdrop-blur-[1px]" />
                  
                  <div className="absolute top-3 left-3 md:top-4 md:left-4">
                    <div className="w-12 h-12 md:w-20 md:h-20 rounded-xl md:rounded-2xl bg-white p-1.5 md:p-3 shadow-2xl border border-white/10 backdrop-blur-xl flex items-center justify-center overflow-hidden">
                      {user.university?.logo ? (
                        <img src={user.university.logo} alt="Logo" className="max-w-full max-h-full object-contain" />
                      ) : (
                        <div className="w-full h-full bg-slate-50 flex items-center justify-center text-slate-900">
                          <Building2 className="w-8 h-8 md:w-10 md:h-10" />
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="absolute bottom-3 left-3 md:bottom-4 md:left-4 text-white">
                    <h3 className="text-sm md:text-lg font-black tracking-tight">{user.university?.short_code || "MTUN"}</h3>
                  </div>
                </div>

                <div className="flex-1 p-4 md:p-6 flex flex-col justify-center bg-white relative">
                  <div className="md:absolute md:top-6 md:right-6 mb-4 md:mb-0">
                    <Button asChild variant="outline" size="sm" className="w-full md:w-auto rounded-xl font-bold border-slate-200 text-slate-600 hover:bg-slate-50">
                      <Link href="/dashboard/my-university">
                        {t("university.cta")}
                        <ExternalLink className="ml-2 h-3.5 w-3.5" />
                      </Link>
                    </Button>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <h2 className="text-lg md:text-2xl font-black text-slate-900 tracking-tight">{user.university?.name}</h2>
                      <p className="text-slate-400 font-bold uppercase tracking-widest text-[8px] md:text-[10px]">{t("university.badge")}</p>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 md:gap-6">
                      {[
                        { label: t("university.stats.staff"), value: stats.staffCount, icon: Users, color: "text-blue-600" },
                        { label: t("university.stats.research"), value: stats.researchCount, icon: FlaskConical, color: "text-indigo-600" },
                        { label: t("university.stats.partners"), value: stats.partnerCount, icon: Handshake, color: "text-emerald-600" },
                        { label: t("university.stats.meetings"), value: stats.meetingCount, icon: CalendarIcon, color: "text-amber-600" },
                      ].map((stat, i) => (
                        <div key={i} className="flex items-center gap-2 md:gap-3">
                          <div className={cn("w-7 h-7 md:w-10 md:h-10 rounded-lg md:rounded-xl bg-slate-50 flex items-center justify-center shrink-0", stat.color)}>
                            <stat.icon className="w-3.5 h-3.5 md:w-5 md:h-5" />
                          </div>
                          <div>
                            <p className="text-base md:text-2xl font-black text-slate-900 leading-none">{stat.value}</p>
                            <p className="text-[8px] md:text-[9px] font-black uppercase text-slate-400 tracking-widest mt-1">{stat.label}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </section>

          {/* 3. Pending Approvals */}
          <section className="space-y-4">
            <div className="flex items-center justify-between px-2">
              <div className="flex items-center gap-3">
                <h2 className="text-base md:text-lg font-black text-slate-900 tracking-tight uppercase">{t("approvals.title")}</h2>
                {pendingApprovals.length > 0 && (
                  <Badge className="bg-rose-500 text-white border-none rounded-full px-2 py-0.5 text-[8px] md:text-[9px] font-black">
                    {pendingApprovals.length} <span className="hidden xs:inline ml-1">{t("approvals.badge")}</span>
                  </Badge>
                )}
              </div>
              <Link href="/dashboard/approvals" className="text-[9px] md:text-[10px] font-black uppercase tracking-widest text-blue-600 hover:underline">
                {t("approvals.viewAll")}
              </Link>
            </div>

            {pendingApprovals.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
                {pendingApprovals.slice(0, 3).map((meeting) => (
                  <Card key={meeting.id} className="border-slate-200 shadow-sm rounded-2xl overflow-hidden bg-white border-l-4 border-l-amber-500 flex flex-col group hover:shadow-md transition-all">
                    <CardHeader className="p-3 md:p-4 pb-0">
                      <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center gap-2 text-[8px] md:text-[9px] font-black text-slate-400 uppercase tracking-widest">
                          <CalendarIcon className="w-3 h-3" />
                          {format(new Date(meeting.date), "MMM dd")}
                        </div>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-6 w-6 rounded-full hover:bg-slate-100"
                          onClick={() => setSelectedMeeting(meeting)}
                        >
                          <Eye className="h-3.5 w-3.5 text-slate-400" />
                        </Button>
                      </div>
                      <CardTitle className="text-xs md:text-sm font-bold text-slate-900 leading-tight line-clamp-1">
                        {meeting.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-3 md:p-4 flex-1">
                      <div className="flex items-center gap-2 mb-3 md:mb-4">
                        <Avatar className="h-5 w-5 md:h-6 md:w-6 border border-slate-100">
                          <AvatarImage src={meeting.created_by?.image || undefined} className="object-cover" />
                          <AvatarFallback className="bg-blue-600 text-white text-[7px] md:text-[8px] font-black">
                            {meeting.created_by?.name?.split(' ').map((n: any) => n[0]).join('').substring(0, 2).toUpperCase() || "US"}
                          </AvatarFallback>
                        </Avatar>
                        <span className="text-[9px] md:text-[10px] font-bold text-slate-600 truncate">{meeting.created_by?.name || "System User"}</span>
                      </div>
                      <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-2 text-[9px] md:text-[10px] text-slate-500 font-medium">
                          <Clock className="w-3 h-3 text-slate-300" />
                          {format(new Date(meeting.start_time), "HH:mm")}
                        </div>
                      </div>
                    </CardContent>
                    <div className="p-2 md:p-3 bg-slate-50/50 border-t border-slate-100 grid grid-cols-2 gap-2">
                      <RejectMeetingButton id={meeting.id} />
                      <ApproveMeetingButton id={meeting.id} />
                    </div>
                  </Card>
                ))}
              </div>
            ) : (
              <Card className="border-none shadow-sm rounded-2xl overflow-hidden bg-gradient-to-br from-emerald-50 to-teal-50 p-6 md:p-10 border border-emerald-100">
                <div className="flex flex-col items-center text-center space-y-4">
                  <div className="w-12 h-12 md:w-16 md:h-16 rounded-full bg-white shadow-sm flex items-center justify-center text-emerald-500">
                    <CheckCircle2 className="h-8 w-8 md:h-10 md:w-10" />
                  </div>
                  <div className="space-y-1">
                    <h3 className="text-lg md:text-xl font-black text-slate-900">{t("approvals.emptyTitle")}</h3>
                    <p className="text-sm text-slate-500 font-medium">{t("approvals.emptyDesc")}</p>
                  </div>
                  <div className="pt-2">
                    <Badge variant="outline" className="bg-white/50 border-emerald-200 text-emerald-700 font-bold px-4 py-1 rounded-full flex items-center gap-2">
                      <Coffee className="h-3 w-3" />
                      {t("approvals.emptyBadge")}
                    </Badge>
                  </div>
                </div>
              </Card>
            )}
          </section>

          {/* 4. Activity Overview (Full Width) */}
          <Card className="border-slate-200 shadow-sm rounded-2xl bg-white p-4 md:p-8">
            <CardHeader className="px-0 pt-0 pb-4 md:pb-6">
              <CardTitle className="text-sm md:text-lg font-black text-slate-900 uppercase tracking-widest flex items-center gap-2 md:gap-3">
                <TrendingUp className="h-4 w-4 md:h-5 md:w-5 text-emerald-600" />
                {t("activity.title")}
              </CardTitle>
            </CardHeader>
            <CardContent className="px-0 pb-0 h-[200px] md:h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={monthlyStats}>
                  <defs>
                    <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#2563eb" stopOpacity={0.2}/>
                      <stop offset="95%" stopColor="#2563eb" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis 
                    dataKey="name" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fontSize: 10, fontWeight: 700, fill: '#94a3b8' }} 
                  />
                  <YAxis hide />
                  <Tooltip 
                    contentStyle={{ borderRadius: '1rem', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="value" 
                    stroke="#2563eb" 
                    strokeWidth={3} 
                    fillOpacity={1} 
                    fill="url(#colorValue)" 
                  />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Right Sidebar: Calendar & Activity */}
        <div className="w-full lg:w-80 space-y-6 bg-white border-t lg:border-t-0 lg:border-l border-slate-200 p-4 md:p-6 lg:p-6 -mx-0 md:-mx-0 lg:-mx-0 lg:-my-8 min-h-fit lg:min-h-screen flex flex-col">
          {/* Calendar Widget */}
          <Card className="border-slate-200 shadow-md rounded-2xl bg-white overflow-hidden shrink-0">
            <CardContent className="p-4">
              <div className="w-full flex justify-center">
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={setSelectedDate}
                  className="rounded-xl border-none"
                  modifiers={{ 
                    hasMeeting: isMeetingDay,
                    today: new Date()
                  }}
                  modifiersClassNames={{
                    hasMeeting: "relative after:content-[''] after:absolute after:bottom-[2px] after:left-1/2 after:-translate-x-1/2 after:w-1.5 after:h-1.5 after:bg-amber-500 after:rounded-full",
                    today: "bg-blue-50 text-blue-600 font-bold"
                  }}
                  classNames={{
                    months: "flex flex-col space-y-4",
                    month: "space-y-4",
                    caption: "flex justify-center pt-1 relative items-center px-10",
                    caption_label: "text-xs font-black uppercase tracking-widest text-slate-900",
                    nav: "space-x-1 flex items-center",
                    nav_button: "h-6 w-6 bg-transparent p-0 opacity-50 hover:opacity-100 transition-opacity",
                    nav_button_previous: "absolute left-1",
                    nav_button_next: "absolute right-1",
                    table: "w-full border-collapse space-y-1",
                    head_row: "flex justify-between",
                    head_cell: "w-9 font-normal text-[0.8rem] text-slate-400",
                    row: "flex w-full mt-2 justify-between",
                    cell: "h-9 w-9 text-center text-sm p-0 relative focus-within:relative focus-within:z-20",
                    day: "h-9 w-9 p-0 font-normal aria-selected:opacity-100 hover:bg-slate-100 rounded-md transition-colors",
                    day_selected: "bg-blue-600 text-white hover:bg-blue-700 hover:text-white focus:bg-blue-600 focus:text-white rounded-md shadow-md shadow-blue-500/30",
                    day_today: "bg-blue-50 text-blue-600 font-bold rounded-md",
                    day_outside: "text-slate-300 opacity-50",
                    day_disabled: "text-slate-300 opacity-50",
                    day_range_middle: "aria-selected:bg-accent aria-selected:text-accent-foreground",
                    day_hidden: "invisible",
                  }}
                />
              </div>
            </CardContent>
          </Card>

          {/* Selected Date Schedule */}
          <div className="space-y-4 shrink-0">
            <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] px-2 flex items-center justify-between">
              {t("calendar.scheduleFor")} {selectedDate ? format(selectedDate, "MMM dd") : t("calendar.today")}
              <Badge variant="outline" className="rounded-full text-[8px] font-black uppercase tracking-widest border-slate-200">
                {selectedDateMeetings.length}
              </Badge>
            </h3>
            <div className="space-y-3">
              {selectedDateMeetings.length > 0 ? (
                selectedDateMeetings.map((meeting) => (
                  <div key={meeting.id} className="bg-white p-4 rounded-2xl shadow-sm border border-slate-200 flex items-start gap-3 group hover:shadow-md transition-all">
                    <div className="flex flex-col items-center justify-center w-10 h-10 rounded-xl bg-blue-50 text-blue-600 shrink-0">
                      <span className="text-[10px] font-black uppercase">{format(new Date(meeting.start_time), "HH:mm")}</span>
                    </div>
                    <div className="overflow-hidden">
                      <h4 className="text-xs font-bold text-slate-900 truncate group-hover:text-blue-600 transition-colors">{meeting.title}</h4>
                      <div className="flex items-center gap-1.5 mt-1 text-[9px] text-slate-400 font-bold uppercase tracking-wider">
                        <MapPin className="w-2.5 h-2.5" />
                        <span className="truncate">{meeting.location || "Virtual"}</span>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-8 text-center bg-slate-50/50 rounded-2xl border border-dashed border-slate-200">
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">{t("calendar.noMeetings")}</p>
                </div>
              )}
            </div>
          </div>

          {/* View Full Calendar Button */}
          <div className="my-4">
            <Button asChild variant="outline" className="w-full py-6 rounded-xl bg-blue-50 border-blue-100 text-blue-600 font-black text-[10px] uppercase tracking-widest hover:bg-blue-100 transition-all shadow-sm">
              <Link href="/dashboard/meetings">
                {t("calendar.viewFull")}
                <ChevronRight className="ml-1 h-3 w-3" />
              </Link>
            </Button>
          </div>

          {/* Recent Activity */}
          <div className="space-y-4 flex-1 pt-4 border-t border-slate-100 overflow-hidden">
            <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] px-2 flex items-center gap-2">
              <TrendingUp className="h-3 w-3 text-blue-600" />
              {t("activity.recentTitle")}
            </h3>
            <div className="space-y-4 overflow-y-auto pr-2 custom-scrollbar">
              {recentActivity.slice(0, 5).map((activity, i) => (
                <div key={i} className="relative pl-10 group">
                  <div className={cn(
                    "absolute left-0 top-0.5 w-8 h-8 rounded-lg flex items-center justify-center z-10 shadow-sm transition-transform group-hover:scale-110",
                    activity.type === 'meeting' ? "bg-blue-50 text-blue-600" : "bg-indigo-50 text-indigo-600"
                  )}>
                    {activity.type === 'meeting' ? <CalendarIcon className="w-4 h-4" /> : <FlaskConical className="w-4 h-4" />}
                  </div>
                  <div className="overflow-hidden">
                    <h4 className="text-xs font-bold text-slate-700 group-hover:text-blue-600 transition-colors line-clamp-1">{activity.title}</h4>
                    <p className="text-[9px] text-slate-400 font-black uppercase tracking-widest mt-0.5">
                      {format(new Date(activity.date), "dd MMM yyyy")}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Meeting Details Dialog */}
      <Dialog open={!!selectedMeeting} onOpenChange={(open) => !open && setSelectedMeeting(null)}>
        <DialogContent className="sm:max-w-2xl w-[95vw] max-h-[85vh] overflow-y-auto rounded-[2rem] border-none shadow-2xl p-0">
          <div className="bg-slate-900 p-6 md:p-8 text-white relative sticky top-0 z-20">
            <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
              <CalendarIcon className="h-32 w-32" />
            </div>
            <DialogHeader className="relative z-10">
              <div className="flex items-center gap-3 mb-4">
                <Badge className="bg-blue-500 text-white border-none rounded-full px-3 py-1 text-[10px] font-black uppercase tracking-widest">
                  {t("dialog.badge")}
                </Badge>
                {selectedMeeting && (
                  <span className="text-slate-400 text-xs font-bold">
                    {format(new Date(selectedMeeting.date), "MMMM dd, yyyy")}
                  </span>
                )}
              </div>
              <DialogTitle className="text-xl md:text-3xl font-black tracking-tight leading-tight">
                {selectedMeeting?.title}
              </DialogTitle>
              <div className="flex items-center gap-4 mt-2 text-slate-400">
                <div className="flex items-center gap-1.5 text-xs font-bold">
                  <MapPin className="h-3.5 w-3.5" />
                  {selectedMeeting?.location || t("dialog.location")}
                </div>
                <div className="flex items-center gap-1.5 text-xs font-bold">
                  <Clock className="h-3.5 w-3.5" />
                  {selectedMeeting && format(new Date(selectedMeeting.start_time), "HH:mm")}
                </div>
              </div>
            </DialogHeader>
          </div>

          <div className="p-6 md:p-8 space-y-8">
            <div className="space-y-1">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{t("dialog.requestor")}</p>
              <div className="flex items-center gap-3 bg-slate-50 p-3 rounded-xl border border-slate-100 w-fit">
                <Avatar className="h-8 w-8 border-2 border-white shadow-sm">
                  <AvatarImage src={selectedMeeting?.created_by?.image} />
                  <AvatarFallback className="bg-blue-600 text-white text-[10px] font-black">
                    {selectedMeeting?.created_by?.name?.substring(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="flex flex-col">
                  <span className="text-sm font-bold text-slate-700">{selectedMeeting?.created_by?.name}</span>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{t("dialog.staffLabel")}</span>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{t("dialog.agenda")}</p>
              <div className="bg-slate-50 rounded-2xl p-4 md:p-6 border border-slate-100">
                <div 
                  className="text-sm text-slate-600 space-y-2 [&_h2]:font-bold [&_h2]:text-slate-900 [&_h2]:mb-2 [&_strong]:font-bold [&_strong]:text-slate-800 [&_ul]:list-disc [&_ul]:pl-5 [&_li]:mb-1"
                  dangerouslySetInnerHTML={{ __html: selectedMeeting?.agenda_details || selectedMeeting?.description || t("dialog.noDetails") }} 
                />
              </div>
            </div>
          </div>

          <div className="sticky bottom-0 bg-white/80 backdrop-blur-md p-4 md:p-6 border-t border-slate-100 mt-auto">
            <div className="grid grid-cols-2 gap-4">
              <div className="flex-1">
                <RejectMeetingButton 
                  id={selectedMeeting?.id} 
                  className="w-full h-12 border-rose-200 text-rose-600 hover:bg-rose-50 hover:text-rose-700 font-bold text-sm md:text-base rounded-xl flex items-center justify-center gap-2"
                >
                  <XCircle className="h-5 w-5" />
                  <span className="hidden sm:inline">{t("dialog.reject")}</span>
                  <span className="sm:hidden">{t("dialog.rejectShort")}</span>
                </RejectMeetingButton>
              </div>
              <div className="flex-1">
                <ApproveMeetingButton 
                  id={selectedMeeting?.id} 
                  className="w-full h-12 bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg shadow-emerald-200 font-bold text-sm md:text-base rounded-xl flex items-center justify-center gap-2"
                >
                  <FileSignature className="h-5 w-5" />
                  <span className="hidden sm:inline">{t("dialog.approve")}</span>
                  <span className="sm:hidden">{t("dialog.approveShort")}</span>
                </ApproveMeetingButton>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
