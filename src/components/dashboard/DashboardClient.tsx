"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";
import { Role, MeetingStatus } from "@prisma/client";
import { User } from "next-auth";
import { CalendarDays, Users, Building2, ClipboardCheck } from "lucide-react"; // Icons

interface DashboardClientProps {
  user: User;
  stats: {
    staffCount: number;
    industryCount: number;
    pendingCount: number;
  };
  upcomingMeetings: {
    id: string;
    date: Date;
    title: string;
    start_time: Date;
    status: MeetingStatus;
  }[];
}

export default function DashboardClient({ user, stats, upcomingMeetings }: DashboardClientProps) {
  const currentDate = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

  const getStatusBadgeClass = (status: MeetingStatus) => {
    switch (status) {
      case MeetingStatus.PENDING:
        return "bg-yellow-100 text-yellow-800";
      case MeetingStatus.APPROVED:
        return "bg-green-100 text-green-800";
      case MeetingStatus.REJECTED:
        return "bg-red-100 text-red-800";
      case MeetingStatus.COMPLETED:
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="container mx-auto p-4 max-w-6xl">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-800 text-white p-8 rounded-xl shadow-lg mb-8">
        <h1 className="text-4xl font-bold mb-2">Welcome, {user.name || user.email}!</h1>
        <p className="text-xl mb-4">Role: {user.role?.replace("_", " ") || "N/A"}</p>
        <p className="text-lg">{currentDate}</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white shadow-md rounded-xl p-6 flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-700">Total Staff</h3>
            <p className="text-4xl font-bold text-blue-600">{stats.staffCount}</p>
          </div>
          <Users className="h-12 w-12 text-blue-400" />
        </div>
        <div className="bg-white shadow-md rounded-xl p-6 flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-700">Industry Partners</h3>
            <p className="text-4xl font-bold text-purple-600">{stats.industryCount}</p>
          </div>
          <Building2 className="h-12 w-12 text-purple-400" />
        </div>
        <div className="bg-white shadow-md rounded-xl p-6 flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-700">Pending Approvals</h3>
            <p className="text-4xl font-bold text-yellow-600">{stats.pendingCount}</p>
          </div>
          <ClipboardCheck className="h-12 w-12 text-yellow-400" />
        </div>
      </div>

      {/* Main Content Area (Grid 2:1) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left (Wide): Upcoming Schedule */}
        <div className="lg:col-span-2 bg-white shadow-md rounded-xl p-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4 flex items-center">
            <CalendarDays className="h-6 w-6 mr-2 text-gray-600" /> Upcoming Schedule
          </h2>
          {upcomingMeetings.length === 0 ? (
            <p className="text-gray-500">No upcoming meetings scheduled.</p>
          ) : (
            <ul className="space-y-4">
              {upcomingMeetings.map((meeting) => (
                <li key={meeting.id} className="flex items-center space-x-4 p-3 border rounded-lg hover:bg-gray-50">
                  <div className="flex-shrink-0 text-center">
                    <div className="text-xs text-gray-500">{new Date(meeting.date).toLocaleDateString('en-US', { month: 'short' }).toUpperCase()}</div>
                    <div className="text-2xl font-bold text-blue-600">{new Date(meeting.date).getDate()}</div>
                  </div>
                  <div className="flex-1">
                    <p className="text-lg font-medium text-gray-800">{meeting.title}</p>
                    <p className="text-sm text-gray-600">
                      {new Date(meeting.start_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })} - {meeting.status.replace("_", " ")}
                    </p>
                  </div>
                  <span
                    className={cn(
                      "inline-flex items-center px-3 py-0.5 rounded-full text-sm font-medium",
                      getStatusBadgeClass(meeting.status)
                    )}
                  >
                    {meeting.status.replace("_", " ")}
                  </span>
                  <Link href={`/dashboard/meetings/${meeting.id}`} className="text-blue-600 hover:underline text-sm">
                    View
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Right (Narrow): Quick Actions */}
        <div className="lg:col-span-1 bg-white shadow-md rounded-xl p-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">⚡ Quick Actions</h2>
          <div className="space-y-4">
            <Link
              href="/dashboard/meetings/create"
              className="block w-full text-center bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-4 rounded-md transition-colors"
            >
              Schedule Meeting
            </Link>
            <Link
              href="/dashboard/staff/create"
              className="block w-full text-center bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-4 rounded-md transition-colors"
            >
              Add Staff
            </Link>
            <Link
              href="/dashboard/industry/create"
              className="block w-full text-center bg-purple-500 hover:bg-purple-600 text-white font-bold py-3 px-4 rounded-md transition-colors"
            >
              Add Industry Partner
            </Link>
            <Link
              href="/dashboard/reports"
              className="block w-full text-center bg-gray-500 hover:bg-gray-600 text-white font-bold py-3 px-4 rounded-md transition-colors"
            >
              View Reports
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
