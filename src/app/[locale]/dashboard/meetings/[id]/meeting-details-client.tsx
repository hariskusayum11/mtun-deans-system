"use client";

import { useState } from "react";
import { approveMeeting, addMeetingMinutes } from "@/actions/meeting-actions";
import { Role, MeetingStatus, Meeting as PrismaMeeting } from "@prisma/client";
import Link from "next/link";
import { cn } from "@/lib/utils";
import SubmitButton from "@/components/form/SubmitButton";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

type MeetingWithUniversity = PrismaMeeting & {
  university: { name: string } | null;
  agenda_details: string | null;
  agenda_file_url: string | null;
  minutes_details: string | null;
  minutes_file_url: string | null;
  dean_approved: boolean;
};

interface MeetingDetailsClientProps {
  meeting: MeetingWithUniversity;
  userRole: Role;
}

export default function MeetingDetailsClient({ meeting, userRole }: MeetingDetailsClientProps) {
  const router = useRouter();
  const { data: session } = useSession(); // Use session from context, not re-fetch
  const [showMinutesForm, setShowMinutesForm] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const handleApproveMeeting = async () => {
    setFormError(null);
    const result = await approveMeeting(meeting.id);
    if (result?.error) {
      setFormError(result.error);
    } else {
      router.refresh(); // Revalidate data
    }
  };

  const handleAddMinutes = async (formData: FormData) => {
    setFormError(null);
    const result = await addMeetingMinutes(meeting.id, formData);
    if (result?.error) {
      setFormError(result.error);
    } else {
      setShowMinutesForm(false);
      router.refresh(); // Revalidate data
    }
  };

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
    <div className="container mx-auto p-4 max-w-5xl">
      <div className="bg-white shadow-lg rounded-xl p-8">
        {/* Header */}
        <div className="mb-6 border-b pb-4">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">{meeting.title}</h1>
          <p className="text-gray-600 mb-1">
            Date: {new Date(meeting.date).toLocaleDateString()} at{" "}
            {new Date(meeting.start_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </p>
          <p className="text-gray-600 mb-1">Location: {meeting.location || "N/A"}</p>
          <p className="text-gray-600 mb-1">University: {meeting.university?.name || "N/A"}</p>
          <span
            className={cn(
              "inline-flex items-center px-3 py-0.5 rounded-full text-sm font-medium",
              getStatusBadgeClass(meeting.status)
            )}
          >
            {meeting.status.replace("_", " ")}
          </span>
        </div>

        {formError && (
          <div className="rounded-md bg-red-50 p-3 text-sm text-red-700 mb-4">
            {formError}
          </div>
        )}

        {/* Agenda Section */}
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-3">Agenda</h2>
          {meeting.agenda_details ? (
            <p className="text-gray-700 whitespace-pre-wrap">{meeting.agenda_details}</p>
          ) : (
            <p className="text-gray-500">No agenda details provided.</p>
          )}
          {meeting.agenda_file_url && (
            <p className="mt-2">
              <Link href={meeting.agenda_file_url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                View Agenda Attachment
              </Link>
            </p>
          )}
        </div>

        {/* Action Section (Role Based) */}
        <div className="mb-6 border-t pt-6">
          {meeting.status === MeetingStatus.PENDING && userRole === Role.dean && (
            <form action={handleApproveMeeting}>
              <SubmitButton label="Approve Meeting" className="bg-green-600 hover:bg-green-700 px-6 py-3 text-base" />
            </form>
          )}

          {(meeting.status === MeetingStatus.APPROVED || meeting.status === MeetingStatus.PENDING) &&
            (userRole === Role.dean || userRole === Role.data_entry) &&
            !meeting.minutes_details && !showMinutesForm && (
              <button
                onClick={() => setShowMinutesForm(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-md text-base"
              >
                Add Minutes
              </button>
            )}
        </div>

        {/* Add Minutes Form (Conditional) */}
        {showMinutesForm && (
          <div className="mt-6 bg-gray-50 p-6 rounded-lg shadow-inner">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Add Meeting Minutes</h3>
            <form action={handleAddMinutes} className="space-y-4">
              <div>
                <label htmlFor="minutes_details" className="block text-sm font-bold text-gray-700 mb-2">
                  Minutes Details (Confidential) *
                </label>
                <textarea
                  id="minutes_details"
                  name="minutes_details"
                  rows={6}
                  required
                  className="w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 py-3"
                ></textarea>
              </div>
              <div>
                <label htmlFor="minutes_file_url" className="block text-sm font-bold text-gray-700 mb-2">
                  Minutes Attachment URL (Optional)
                </label>
                <input
                  type="url"
                  id="minutes_file_url"
                  name="minutes_file_url"
                  className="w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 py-3"
                />
              </div>
              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setShowMinutesForm(false)}
                  className="inline-flex items-center rounded-md border border-gray-300 bg-white px-6 py-3 text-base font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                >
                  Cancel
                </button>
                <SubmitButton label="Save Minutes" className="px-6 py-3 text-base bg-blue-600 hover:bg-blue-700" />
              </div>
            </form>
          </div>
        )}

        {/* Minutes Section (Confidential) */}
        {meeting.minutes_details && (
          <div className="mt-6 border-t pt-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-3">Meeting Minutes (Confidential)</h2>
            <p className="text-gray-700 whitespace-pre-wrap">{meeting.minutes_details}</p>
            {meeting.minutes_file_url && (
              <p className="mt-2">
                <Link href={meeting.minutes_file_url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                  View Minutes Attachment
                </Link>
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
