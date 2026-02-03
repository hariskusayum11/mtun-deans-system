"use client";

import { useState, useEffect } from "react";
import { getMeetings } from "@/actions/meeting-actions";
import { Role, Meeting as PrismaMeeting, MeetingStatus, University } from "@prisma/client";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, addMonths, subMonths } from "date-fns";
import { ChevronLeft, ChevronRight, Search, Filter, CalendarDays, Clock } from "lucide-react";
import { useTranslations } from "next-intl";
import Select from "react-select"; // For filtering by university

type MeetingWithUniversity = PrismaMeeting & {
  university: { name: string } | null;
};

interface MeetingCalendarViewProps {
  initialMeetings: MeetingWithUniversity[];
  userRole: Role;
  universities: { id: string; name: string }[]; // List of all universities for filter
}

export default function MeetingCalendarView({ initialMeetings, userRole, universities }: MeetingCalendarViewProps) {
  const t = useTranslations("Meetings.calendar");
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<MeetingStatus | "all">("all");
  const [selectedUniversity, setSelectedUniversity] = useState<string | "all">("all");
  const [filteredMeetings, setFilteredMeetings] = useState<MeetingWithUniversity[]>(initialMeetings);

  const startOfCurrentMonth = startOfMonth(currentMonth);
  const endOfCurrentMonth = endOfMonth(currentMonth);
  const daysInMonth = eachDayOfInterval({ start: startOfCurrentMonth, end: endOfCurrentMonth });

  useEffect(() => {
    let results = initialMeetings;

    if (searchTerm) {
      results = results.filter(meeting =>
        meeting.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        meeting.location?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        meeting.university?.name?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedStatus !== "all") {
      results = results.filter(meeting => meeting.status === selectedStatus);
    }

    if (selectedUniversity !== "all") {
      results = results.filter(meeting => meeting.university_id === selectedUniversity);
    }

    setFilteredMeetings(results);
  }, [searchTerm, selectedStatus, selectedUniversity, initialMeetings]);

  const goToNextMonth = () => {
    setCurrentMonth(addMonths(currentMonth, 1));
  };

  const goToPreviousMonth = () => {
    setCurrentMonth(subMonths(currentMonth, 1));
  };

  const getMeetingsForDay = (day: Date) => {
    return filteredMeetings.filter(meeting => isSameDay(new Date(meeting.date), day));
  };

  const universityOptions = [{ value: "all", label: t("allUniversities") }, ...universities.map(uni => ({ value: uni.id, label: uni.name }))];
  const statusOptions = [{ value: "all", label: t("allStatuses") }, ...Object.values(MeetingStatus).map(status => ({ value: status, label: status.replace("_", " ") }))];

  return (
    <div className="container mx-auto p-4 max-w-full">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">{t("title")}</h1>

      {/* Filter and Search Bar */}
      <div className="bg-white shadow-lg rounded-xl p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder={t("searchPlaceholder")}
              className="w-full py-2 pl-10 pr-4 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Select
            options={statusOptions}
            value={statusOptions.find(option => option.value === selectedStatus)}
            onChange={(option) => setSelectedStatus(option?.value as MeetingStatus | "all")}
            classNamePrefix="react-select"
            placeholder={t("filterStatus")}
          />
          <Select
            options={universityOptions}
            value={universityOptions.find(option => option.value === selectedUniversity)}
            onChange={(option) => setSelectedUniversity(option?.value as string | "all")}
            classNamePrefix="react-select"
            placeholder={t("filterUniversity")}
          />
        </div>
      </div>

      {/* Calendar Navigation */}
      <div className="flex items-center justify-between bg-blue-800 text-white p-4 rounded-t-lg">
        <button onClick={goToPreviousMonth} className="p-2 rounded-full hover:bg-blue-700">
          <ChevronLeft className="h-6 w-6" />
        </button>
        <h2 className="text-xl font-semibold">{format(currentMonth, "MMMM yyyy")}</h2>
        <button onClick={goToNextMonth} className="p-2 rounded-full hover:bg-blue-700">
          <ChevronRight className="h-6 w-6" />
        </button>
      </div>

      {/* Calendar Grid */}
      <div className="bg-white shadow-lg rounded-b-xl border border-gray-200">
        <div className="grid grid-cols-7 text-center text-sm font-medium text-gray-600 border-b border-gray-200">
          {[
            t("days.sun"), 
            t("days.mon"), 
            t("days.tue"), 
            t("days.wed"), 
            t("days.thu"), 
            t("days.fri"), 
            t("days.sat")
          ].map((day) => (
            <div key={day} className="py-3">{day}</div>
          ))}
        </div>
        <div className="grid grid-cols-7">
          {daysInMonth.map((day, index) => {
            const dayMeetings = getMeetingsForDay(day);
            const isToday = isSameDay(day, new Date());
            const isCurrentMonth = isSameMonth(day, currentMonth);

            return (
              <div
                key={index}
                className={cn(
                  "border border-gray-100 p-2 h-32 flex flex-col",
                  !isCurrentMonth && "text-gray-400 bg-gray-50",
                  isToday && "bg-blue-50 ring-2 ring-blue-500 ring-opacity-50"
                )}
              >
                <span className={cn("text-sm font-medium mb-1", isToday && "text-blue-800")}>
                  {format(day, "d")}
                </span>
                <div className="flex-1 overflow-y-auto space-y-1">
                  {dayMeetings.map((meeting) => (
                    <Link
                      key={meeting.id}
                      href={`/dashboard/meetings/${meeting.id}`}
                      className={cn(
                        "block text-xs p-1 rounded-md truncate",
                        meeting.status === MeetingStatus.APPROVED && "bg-green-200 text-green-800 hover:bg-green-300",
                        meeting.status === MeetingStatus.PENDING && "bg-yellow-200 text-yellow-800 hover:bg-yellow-300",
                        meeting.status === MeetingStatus.REJECTED && "bg-red-200 text-red-800 hover:bg-red-300",
                        meeting.status === MeetingStatus.COMPLETED && "bg-blue-200 text-blue-800 hover:bg-blue-300",
                      )}
                      title={meeting.title}
                    >
                      {meeting.title}
                    </Link>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
