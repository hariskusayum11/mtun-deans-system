"use client";

import { useState, useTransition } from "react";
import { getPendingMeetings, updateMeetingStatus } from "@/actions/approval-actions";
import { MeetingStatus } from "@prisma/client";
import { CheckCircle, XCircle, Clock, CalendarDays, BookOpen } from "lucide-react";
import { cn } from "@/lib/utils";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";

// Define types for the data received from getPendingMeetings
interface PendingMeeting {
  id: string;
  title: string;
  date: Date;
  start_time: Date;
  agenda_details: string | null;
  university: { name: string } | null;
  attendees: string | null; // Assuming this contains JSON string of participant IDs
}

interface PendingApprovalsProps {
  initialPendingMeetings: PendingMeeting[];
}

export default function PendingApprovals({ initialPendingMeetings }: PendingApprovalsProps) {
  const t = useTranslations("Dashboard.dean.approvals");
  const router = useRouter();
  const [pendingMeetings, setPendingMeetings] = useState<PendingMeeting[]>(initialPendingMeetings);
  const [isPending, startTransition] = useTransition();

  const handleStatusUpdate = async (meetingId: string, newStatus: MeetingStatus) => {
    startTransition(async () => {
      const result = await updateMeetingStatus(meetingId, newStatus);
      if (result?.error) {
        toast.error(result.error);
      } else {
        toast.success(result.success || `Meeting status updated to ${newStatus.toLowerCase()}.`); // Provide a default message
        // Optimistically update UI or revalidate
        setPendingMeetings((prev) => prev.filter((meeting) => meeting.id !== meetingId));
        router.refresh(); // Revalidate data on the server
      }
    });
  };

  const getStatusBadgeClass = (status: MeetingStatus) => {
    switch (status) {
      case MeetingStatus.PENDING:
        return "bg-yellow-100 text-yellow-800";
      case MeetingStatus.APPROVED:
        return "bg-green-100 text-green-800";
      case MeetingStatus.REJECTED:
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getRequestedBy = (attendeesJson: string | null) => {
    try {
      const participants = JSON.parse(attendeesJson || '[]') as string[];
      // For simplicity, assume the first participant is the requester.
      // In a real app, you'd fetch user details based on ID.
      return participants.length > 0 ? `Staff ID: ${participants[0]}` : 'N/A';
    } catch (e) {
      return 'N/A';
    }
  };

  return (
    <div className="bg-white shadow-lg rounded-xl p-8">
      <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
        <Clock className="h-6 w-6 mr-3 text-yellow-500" /> {t("title")}
      </h2>

      {pendingMeetings.length === 0 ? (
        <p className="text-gray-500">{t("emptyDesc")}</p>
      ) : (
        <div className="space-y-6">
          {pendingMeetings.map((meeting) => (
            <div key={meeting.id} className="border border-gray-200 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow duration-300">
              <h3 className="text-xl font-semibold text-gray-800 mb-2">{meeting.title}</h3>
              <p className="text-gray-600 text-sm mb-1">
                <span className="font-medium">Requested By:</span> {getRequestedBy(meeting.attendees)}
              </p>
              <p className="text-gray-600 text-sm mb-1">
                <span className="font-medium">University:</span> {meeting.university?.name || 'N/A'}
              </p>
              <p className="text-gray-600 text-sm mb-3">
                <span className="font-medium">Date:</span> {new Date(meeting.date).toLocaleDateString()} at {new Date(meeting.start_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })}
              </p>
              <div className="flex items-center text-gray-700 text-sm mb-4">
                <BookOpen className="h-4 w-4 mr-2" />
                <p className="flex-1">{meeting.agenda_details ? meeting.agenda_details.substring(0, 100) + '...' : 'No agenda summary.'}</p>
              </div>

              <div className="flex space-x-3 mt-4">
                <button
                  onClick={() => handleStatusUpdate(meeting.id, MeetingStatus.APPROVED)}
                  className="flex items-center bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-md transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={isPending}
                >
                  <CheckCircle className="h-5 w-5 mr-2" />
                  Approve
                </button>
                <button
                  onClick={() => handleStatusUpdate(meeting.id, MeetingStatus.REJECTED)}
                  className="flex items-center bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-md transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={isPending}
                >
                  <XCircle className="h-5 w-5 mr-2" />
                  Reject
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
