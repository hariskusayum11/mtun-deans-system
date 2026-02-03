"use client";

import React from "react";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { format } from "date-fns";
import {
  FileText,
  UploadCloud,
  Eye,
  Edit,
  Calendar as CalendarIcon,
  University,
  CheckCircle,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface Meeting {
  id: string;
  date: Date;
  title: string;
  universityName: string;
  status: string;
  minutes_url?: string | null; // Assuming a field to track if minutes are uploaded
}

interface MinutesListViewProps {
  meetings: Meeting[];
}

export default function MinutesListView({ meetings }: MinutesListViewProps) {
  const t = useTranslations("Meetings.minutesList");

  return (
    <div className="space-y-6 p-4 md:p-6 lg:p-8">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h1 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight">
            {t("title")}
          </h1>
          <p className="text-slate-500 text-sm md:text-base font-medium">
            {t("description")}
          </p>
        </div>
      </div>

      <Card className="border-slate-200 shadow-sm rounded-2xl bg-white overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[700px]">
            <thead>
              <tr className="bg-gray-50/50 text-slate-400 text-[10px] uppercase font-black tracking-[0.2em] border-b border-slate-100">
                <th className="px-6 md:px-8 py-4 md:py-5">{t("table.date")}</th>
                <th className="px-6 md:px-8 py-4 md:py-5">{t("table.title")}</th>
                <th className="px-6 md:px-8 py-4 md:py-5">{t("table.university")}</th>
                <th className="px-6 md:px-8 py-4 md:py-5">{t("table.status")}</th>
                <th className="px-6 md:px-8 py-4 md:py-5 text-right">{t("table.actions")}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {meetings.length > 0 ? (
                meetings.map((meeting) => (
                  <tr key={meeting.id} className="hover:bg-slate-50/80 transition-all group">
                    <td className="px-6 md:px-8 py-4 md:py-6">
                      <div className="flex items-center gap-2 text-xs font-bold text-slate-700">
                        <CalendarIcon className="h-3.5 w-3.5 text-slate-400" />
                        {format(new Date(meeting.date), "MMM dd, yyyy")}
                      </div>
                    </td>
                    <td className="px-6 md:px-8 py-4 md:py-6">
                      <span className="text-sm font-bold text-slate-900">{meeting.title}</span>
                    </td>
                    <td className="px-6 md:px-8 py-4 md:py-6">
                      <div className="flex items-center gap-2 text-xs text-slate-600">
                        <University className="h-3.5 w-3.5 text-slate-400" />
                        {meeting.universityName}
                      </div>
                    </td>
                    <td className="px-6 md:px-8 py-4 md:py-6">
                      <Badge className="bg-emerald-50 text-emerald-700 border-emerald-100 text-[8px] font-black uppercase tracking-widest">
                        <CheckCircle className="h-2.5 w-2.5 mr-1" />
                        {meeting.status}
                      </Badge>
                    </td>
                    <td className="px-6 md:px-8 py-4 md:py-6 text-right">
                      {meeting.minutes_url ? (
                        <Button asChild variant="outline" size="sm" className="rounded-lg text-xs font-bold">
                          <Link href={`/dashboard/meetings/${meeting.id}/edit-minutes`}>
                            <Edit className="h-3.5 w-3.5 mr-2" />
                            {t("viewEditButton")}
                          </Link>
                        </Button>
                      ) : (
                        <Button asChild size="sm" className="bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold">
                          <Link href={`/dashboard/meetings/${meeting.id}/upload-minutes`}>
                            <UploadCloud className="h-3.5 w-3.5 mr-2" />
                            {t("uploadButton")}
                          </Link>
                        </Button>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="px-6 md:px-8 py-20 text-center text-slate-500">
                    <div className="flex flex-col items-center gap-4">
                      <FileText className="h-16 w-16 text-slate-200" />
                      <p className="text-lg font-bold">{t("empty")}</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
