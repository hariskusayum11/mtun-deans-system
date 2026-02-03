import { auth } from "@/lib/auth";
import { getMeetingById } from "@/actions/meeting-actions";
import { notFound, redirect } from "next/navigation";
import { format } from "date-fns";
import { 
  Calendar, 
  Clock, 
  MapPin, 
  Link as LinkIcon, 
  FileText, 
  User, 
  ArrowLeft, 
  Download, 
  Edit,
  Building2,
  Users,
  CheckCircle2,
  AlertCircle,
  FileCheck,
  ExternalLink
} from "lucide-react";
import Link from "next/link";
import { Role, MeetingStatus } from "@prisma/client";
import { cn } from "@/lib/utils";

export default async function MeetingDetailsPage({ params }: { params: { id: string } }) {
  const session = await auth();
  
  if (!session?.user) {
    redirect("/login");
  }

  const meeting = await getMeetingById(params.id);

  if (!meeting) {
    notFound();
  }

  const user = session.user;
  const isHost = user.universityId === meeting.university_id; 
  const isAdmin = user.role === Role.super_admin;
  const isCompleted = meeting.status === MeetingStatus.COMPLETED;

  const getStatusConfig = (status: MeetingStatus) => {
    switch (status) {
      case MeetingStatus.COMPLETED:
        return {
          label: "Completed",
          className: "bg-emerald-50 text-emerald-700 border-emerald-100",
          icon: CheckCircle2
        };
      case MeetingStatus.APPROVED:
        return {
          label: "Approved",
          className: "bg-blue-50 text-blue-700 border-blue-100",
          icon: FileCheck
        };
      case MeetingStatus.PENDING:
        return {
          label: "Pending Approval",
          className: "bg-amber-50 text-amber-700 border-amber-100",
          icon: Clock
        };
      case MeetingStatus.REJECTED:
        return {
          label: "Rejected",
          className: "bg-rose-50 text-rose-700 border-rose-100",
          icon: AlertCircle
        };
      default:
        return {
          label: status,
          className: "bg-gray-50 text-gray-700 border-gray-100",
          icon: AlertCircle
        };
    }
  };

  const statusConfig = getStatusConfig(meeting.status);
  const StatusIcon = statusConfig.icon;

  // Parse attendees if they are stored as a JSON string
  let attendeeCount = 0;
  try {
    if (meeting.attendees) {
      const parsed = JSON.parse(meeting.attendees);
      attendeeCount = Array.isArray(parsed) ? parsed.length : 0;
    }
  } catch (e) {
    console.error("Error parsing attendees:", e);
  }

  return (
    <div className="max-w-7xl mx-auto pb-20 px-4 sm:px-6 lg:px-8">
      {/* Top Navigation & Actions */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 pt-4">
        <Link 
          href="/dashboard/meetings" 
          className="inline-flex items-center text-sm font-bold text-gray-500 hover:text-gray-900 transition-all group"
        >
          <div className="p-2 rounded-xl group-hover:bg-gray-100 mr-2 transition-all">
            <ArrowLeft size={18} />
          </div>
          Back to Meetings
        </Link>

        <div className="flex items-center gap-3">
          {(isHost || isAdmin) && meeting.status !== MeetingStatus.COMPLETED && (
            <Link 
              href={`/dashboard/meetings/${meeting.id}/edit`}
              className="flex items-center justify-center gap-2 bg-white border border-gray-200 hover:border-blue-500 hover:text-blue-600 text-gray-600 px-5 py-2.5 rounded-2xl text-sm font-bold transition-all shadow-sm active:scale-95"
            >
              <Edit size={18} />
              Edit Meeting
            </Link>
          )}
        </div>
      </div>

      {/* Header Section */}
      <div className="mb-10">
        <div className="flex flex-wrap items-center gap-4 mb-4">
          <div className={cn(
            "inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.15em] border shadow-sm",
            statusConfig.className
          )}>
            <StatusIcon size={14} />
            {statusConfig.label}
          </div>
          <span className="text-gray-300">|</span>
          <span className="text-sm font-bold text-gray-400 uppercase tracking-widest">
            ID: {meeting.id.split('-')[0]}
          </span>
        </div>
        <h1 className="text-4xl md:text-5xl font-black text-gray-900 tracking-tight leading-tight max-w-4xl">
          {meeting.title}
        </h1>
      </div>

      {/* Main Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column (2/3) */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Card 1: Meeting Info */}
          <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden">
            <div className="px-8 py-6 border-b border-gray-50 bg-gray-50/30">
              <h3 className="text-sm font-black text-gray-900 uppercase tracking-widest flex items-center gap-2">
                <Building2 className="w-4 h-4 text-blue-600" />
                Meeting Information
              </h3>
            </div>
            <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-600 shrink-0">
                  <Calendar className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Date</p>
                  <p className="text-base font-bold text-gray-900">{format(new Date(meeting.date), "EEEE, d MMMM yyyy")}</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-2xl bg-amber-50 flex items-center justify-center text-amber-600 shrink-0">
                  <Clock className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Time Schedule</p>
                  <p className="text-base font-bold text-gray-900">
                    {format(new Date(meeting.start_time), "HH:mm")}
                    {meeting.end_time && ` — ${format(new Date(meeting.end_time), "HH:mm")}`}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-2xl bg-emerald-50 flex items-center justify-center text-emerald-600 shrink-0">
                  {meeting.meeting_link ? <LinkIcon className="w-6 h-6" /> : <MapPin className="w-6 h-6" />}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">
                    {meeting.meeting_link ? "Online Meeting Link" : "Physical Location"}
                  </p>
                  {meeting.meeting_link ? (
                    <a 
                      href={meeting.meeting_link} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-base font-bold text-blue-600 hover:underline flex items-center gap-1 truncate"
                    >
                      Join Meeting <ExternalLink size={14} />
                    </a>
                  ) : (
                    <p className="text-base font-bold text-gray-900">{meeting.location || "Location not specified"}</p>
                  )}
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-2xl bg-purple-50 flex items-center justify-center text-purple-600 shrink-0">
                  <Building2 className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Host University</p>
                  <p className="text-base font-bold text-gray-900">{meeting.university?.name || "MTUN Secretariat"}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Card 2: Agenda */}
          <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden">
            <div className="px-8 py-6 border-b border-gray-50 bg-gray-50/30">
              <h3 className="text-sm font-black text-gray-900 uppercase tracking-widest flex items-center gap-2">
                <FileText className="w-4 h-4 text-blue-600" />
                Meeting Agenda
              </h3>
            </div>
            <div className="p-8">
              <div className="prose prose-blue max-w-none">
                {meeting.agenda_details ? (
                  <div 
                    className="text-gray-600 leading-relaxed whitespace-pre-wrap font-medium"
                    dangerouslySetInnerHTML={{ __html: meeting.agenda_details }} 
                  />
                ) : (
                  <div className="flex flex-col items-center justify-center py-10 text-gray-400 italic">
                    <FileText size={40} className="mb-2 opacity-20" />
                    <p>No agenda details have been provided for this meeting.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Right Column (1/3) */}
        <div className="space-y-8">
          
          {/* Card 3: Participants */}
          <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden">
            <div className="px-8 py-6 border-b border-gray-50 bg-gray-50/30">
              <h3 className="text-sm font-black text-gray-900 uppercase tracking-widest flex items-center gap-2">
                <Users className="w-4 h-4 text-blue-600" />
                Participants
              </h3>
            </div>
            <div className="p-8">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-14 h-14 rounded-2xl bg-gray-50 flex items-center justify-center text-gray-900 font-black text-xl border border-gray-100">
                  {attendeeCount}
                </div>
                <div>
                  <p className="text-sm font-bold text-gray-900">Total Attendees</p>
                  <p className="text-xs text-gray-400 font-medium">Confirmed participants</p>
                </div>
              </div>
              <p className="text-xs text-gray-500 leading-relaxed italic">
                Detailed participant list is available in the meeting minutes report.
              </p>
            </div>
          </div>

          {/* Card 4: Minutes & Outcome */}
          <div className={cn(
            "rounded-[2.5rem] border shadow-sm overflow-hidden transition-all",
            isCompleted 
              ? "bg-emerald-50/30 border-emerald-100" 
              : "bg-white border-gray-100"
          )}>
            <div className={cn(
              "px-8 py-6 border-b",
              isCompleted ? "border-emerald-100 bg-emerald-50/50" : "border-gray-50 bg-gray-50/30"
            )}>
              <h3 className="text-sm font-black text-gray-900 uppercase tracking-widest flex items-center gap-2">
                <CheckCircle2 className={cn("w-4 h-4", isCompleted ? "text-emerald-600" : "text-gray-400")} />
                Minutes & Outcome
              </h3>
            </div>
            <div className="p-8">
              {isCompleted ? (
                <div className="space-y-6">
                  <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-emerald-100 shadow-sm">
                    <p className="text-[10px] font-black text-emerald-600 uppercase tracking-widest mb-3">Summary</p>
                    <p className="text-sm text-gray-700 font-medium leading-relaxed">
                      {meeting.minutes_details || "The meeting has been concluded successfully."}
                    </p>
                  </div>
                  
                  {meeting.minutes_file_url && (
                    <a 
                      href={meeting.minutes_file_url} 
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full flex items-center justify-center gap-3 bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-4 rounded-2xl text-sm font-bold transition-all shadow-lg shadow-emerald-500/20 active:scale-95"
                    >
                      <Download size={20} />
                      Download Minutes
                    </a>
                  )}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-10 text-center">
                  <div className="w-16 h-16 rounded-full bg-gray-50 flex items-center justify-center mb-4 border border-dashed border-gray-200">
                    <Clock className="w-8 h-8 text-gray-300 animate-pulse" />
                  </div>
                  <h4 className="text-sm font-bold text-gray-900 mb-1">Waiting for Minutes</h4>
                  <p className="text-xs text-gray-400 font-medium max-w-[200px]">
                    Minutes will be available once the meeting is marked as completed.
                  </p>
                </div>
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
