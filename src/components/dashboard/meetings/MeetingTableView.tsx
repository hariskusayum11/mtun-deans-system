"use client";

import { useState } from "react";
import { Role, Meeting as PrismaMeeting, MeetingStatus } from "@prisma/client";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import { useTranslations } from "next-intl";
import { 
  Trash2, 
  Edit, 
  Search, 
  Plus, 
  Calendar, 
  Clock, 
  MapPin, 
  Building,
  MoreHorizontal,
  FileUp,
  ClipboardCheck,
  FilePenLine,
  CheckCircle
} from "lucide-react";
import toast from "react-hot-toast";
import { deleteMeeting } from "@/actions/meeting-actions";
import RowActions from "@/components/ui/row-actions";
import UploadMinutesModal from "@/components/meetings/UploadMinutesModal";
import ConfirmModal from "@/components/ui/ConfirmModal";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"; // Import Card components
import { Badge } from "@/components/ui/badge"; // Import Badge component

type MeetingWithUniversity = PrismaMeeting & {
  university: { name: string } | null;
};

interface MeetingTableViewProps {
  initialMeetings: MeetingWithUniversity[];
  userRole: Role;
}

export default function MeetingTableView({ initialMeetings, userRole }: MeetingTableViewProps) {
  const t = useTranslations("Meetings.list");
  const tCommon = useTranslations("Common");
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedMeeting, setSelectedMeeting] = useState<{ 
    id: string; 
    title: string;
    minutes_details?: string | null;
    minutes_file_url?: string | null;
  } | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [meetingToDeleteId, setMeetingToDeleteId] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>("All Status");

  const filteredMeetings = initialMeetings.filter(meeting => 
    (filterStatus === "All Status" || meeting.status === filterStatus) &&
    (meeting.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (meeting.location?.toLowerCase().includes(searchTerm.toLowerCase()) ?? false) ||
    (meeting.university?.name.toLowerCase().includes(searchTerm.toLowerCase()) ?? false))
  );

  const getStatusBadgeVariant = (status: MeetingStatus) => {
    switch (status) {
      case MeetingStatus.APPROVED:
      case MeetingStatus.COMPLETED:
        return "success";
      case MeetingStatus.PENDING:
        return "warning";
      case MeetingStatus.REJECTED:
        return "destructive";
      default:
        return "default";
    }
  };

  const handleDeleteClick = (meetingId: string) => {
    setMeetingToDeleteId(meetingId);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (meetingToDeleteId) {
      const result = await deleteMeeting(meetingToDeleteId);
      if (result?.error) {
        toast.error(result.error);
      } else {
        toast.success(t("toastDeleteSuccess"));
        router.refresh();
      }
      setIsDeleteModalOpen(false);
      setMeetingToDeleteId(null);
    }
  };

  return (
    <div className="p-4 space-y-4"> {/* Main Layout Wrapper */}
      <ConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={confirmDelete}
        title={tCommon("deleteTitle")}
        description={tCommon("deleteDesc")}
        variant="danger"
        icon={Trash2}
      />

      {/* Page Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{t("title")}</h1>
          <p className="text-sm text-muted-foreground mt-1">{t("description")}</p>
        </div>
        {(userRole === Role.super_admin || userRole === Role.data_entry) && (
          <Link
            href="/dashboard/meetings/create"
            className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl text-sm font-bold transition-all shadow-lg shadow-blue-500/20 active:scale-95"
          >
            <Plus className="h-5 w-5" />
            {t("ctaCreate")}
          </Link>
        )}
      </div>

      {/* Content Card: Search Bar, Filters, and Table */}
      <Card className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <CardHeader className="p-4 border-b border-slate-100 flex flex-col md:flex-row gap-4 items-center">
          <div className="relative flex-1 w-full">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder={t("searchPlaceholder")}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-2.5 bg-gray-50 border border-transparent rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
            />
          </div>
          <div className="flex items-center gap-2 w-full md:w-auto">
              <select 
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="bg-gray-50 border border-transparent rounded-xl px-4 py-2.5 text-sm font-bold text-gray-600 focus:ring-2 focus:ring-blue-500/20 transition-all outline-none cursor-pointer"
              >
                  <option value="All Status">{t("filterStatus")}</option>
                  <option value={MeetingStatus.PENDING}>{t("statusPending")}</option>
                  <option value={MeetingStatus.APPROVED}>{t("statusApproved")}</option>
                  <option value={MeetingStatus.COMPLETED}>{t("statusCompleted")}</option>
                  <option value={MeetingStatus.REJECTED}>{tCommon("rejected")}</option> {/* Added rejected status */}
              </select>
          </div>
        </CardHeader>

        <CardContent className="p-0">
          {/* Desktop Table View */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 text-slate-400 text-[10px] uppercase font-black tracking-[0.2em] border-b border-slate-100">
                  <th className="px-6 py-3">{t("table.topic")}</th>
                  <th className="px-6 py-3">{t("table.schedule")}</th>
                  <th className="px-6 py-3">{t("table.location")}</th>
                  <th className="px-6 py-3">{t("table.university")}</th>
                  <th className="px-6 py-3">{t("table.status")}</th>
                  <th className="px-6 py-3 text-right">{t("table.actions")}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredMeetings.map((meeting) => (
                  <tr key={meeting.id} className="hover:bg-slate-50 transition-all group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600 shrink-0 group-hover:scale-110 transition-transform">
                          <Calendar className="w-5 h-5" />
                        </div>
                        <span className="text-sm font-bold text-slate-800 max-w-xs truncate">{meeting.title}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="text-sm font-bold text-slate-800">{format(new Date(meeting.date), "dd MMM yyyy")}</span>
                        <span className="text-[10px] text-slate-500 font-medium flex items-center gap-1 mt-0.5">
                          <Clock className="h-3 w-3" /> {format(new Date(meeting.start_time), "HH:mm")}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-slate-600">
                        <MapPin className="h-4 w-4 text-slate-400" />
                        <span className="text-sm font-medium">{meeting.location || t("online")}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        {meeting.university?.name && (
                          <span className="text-xs font-medium text-slate-500">{meeting.university.name}</span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <Badge variant={getStatusBadgeVariant(meeting.status)}>
                        {tCommon(meeting.status.toLowerCase().replace(/_/g, ''))}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        {(userRole === Role.super_admin || userRole === Role.data_entry) && 
                         (meeting.status === MeetingStatus.APPROVED || meeting.status === MeetingStatus.COMPLETED) && (
                          <button
                            onClick={() => setSelectedMeeting({ 
                              id: meeting.id, 
                              title: meeting.title,
                              minutes_details: meeting.minutes_details,
                              minutes_file_url: meeting.minutes_file_url
                            })}
                            className={cn(
                              "p-2 rounded-lg transition-all group/btn relative",
                              meeting.status === MeetingStatus.COMPLETED 
                                ? "hover:bg-blue-50 text-blue-600" 
                                : "hover:bg-emerald-50 text-emerald-600"
                            )}
                            title={meeting.status === MeetingStatus.COMPLETED ? t("actions.updateMinutes") : t("actions.uploadMinutes")}
                          >
                            {meeting.status === MeetingStatus.COMPLETED ? (
                              <FilePenLine className="h-5 w-5" />
                            ) : (
                              <FileUp className="h-5 w-5" />
                            )}
                            <span className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 px-2 py-1 bg-gray-900 text-white text-[10px] font-bold rounded opacity-0 group-hover/btn:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                              {meeting.status === MeetingStatus.COMPLETED ? t("actions.updateMinutes") : t("actions.uploadMinutes")}
                            </span>
                          </button>
                        )}
                        {(userRole === Role.super_admin || userRole === Role.data_entry) ? (
                          <RowActions 
                            id={meeting.id}
                            resourceName="Meeting"
                            viewUrl={`/dashboard/meetings/${meeting.id}`}
                            onEdit={() => router.push(`/dashboard/meetings/${meeting.id}/edit`)}
                            onDelete={() => handleDeleteClick(meeting.id)}
                          />
                        ) : (
                          <Link 
                            href={`/dashboard/meetings/${meeting.id}`}
                            className="p-2 rounded-lg hover:bg-blue-50 text-blue-600 transition-all text-xs font-black uppercase tracking-widest"
                          >
                            {t("actions.view")}
                          </Link>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Card View */}
          <div className="md:hidden divide-y divide-slate-100"> {/* Changed divide-gray-50 to divide-slate-100 */}
            {filteredMeetings.map((meeting) => (
              <div key={meeting.id} className="p-4 space-y-3"> {/* Reduced space-y to space-y-3 */}
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600 shrink-0">
                      <Calendar className="w-5 h-5" />
                    </div>
                    <div className="flex flex-col min-w-0">
                      <span className="text-sm font-bold text-slate-800 truncate">{meeting.title}</span>
                      <span className="text-[10px] text-slate-500 font-medium flex items-center gap-1 mt-0.5">
                        {format(new Date(meeting.date), "dd MMM yyyy")} • {format(new Date(meeting.start_time), "HH:mm")}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    {(userRole === Role.super_admin || userRole === Role.data_entry) && 
                     (meeting.status === MeetingStatus.APPROVED || meeting.status === MeetingStatus.COMPLETED) && (
                      <button
                        onClick={() => setSelectedMeeting({ 
                          id: meeting.id, 
                          title: meeting.title,
                          minutes_details: meeting.minutes_details,
                          minutes_file_url: meeting.minutes_file_url
                        })}
                        className={cn(
                          "p-2 rounded-lg transition-all",
                          meeting.status === MeetingStatus.COMPLETED 
                            ? "text-blue-600 bg-blue-50" 
                            : "text-emerald-600 bg-emerald-50"
                        )}
                      >
                        {meeting.status === MeetingStatus.COMPLETED ? (
                          <FilePenLine className="h-4 w-4" />
                        ) : (
                          <FileUp className="h-4 w-4" />
                        )}
                      </button>
                    )}
                    {(userRole === Role.super_admin || userRole === Role.data_entry) ? (
                      <RowActions 
                        id={meeting.id}
                        resourceName="Meeting"
                        viewUrl={`/dashboard/meetings/${meeting.id}`}
                        onEdit={() => router.push(`/dashboard/meetings/${meeting.id}/edit`)}
                        onDelete={() => handleDeleteClick(meeting.id)}
                      />
                    ) : (
                      <Link 
                        href={`/dashboard/meetings/${meeting.id}`}
                        className="p-2 rounded-lg bg-blue-50 text-blue-600 text-[10px] font-black uppercase tracking-widest"
                      >
                        {t("actions.view")}
                      </Link>
                    )}
                  </div>
                </div>
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-1.5 text-[10px] text-slate-500 font-medium truncate"> {/* Changed text-gray-500 to text-slate-500 */}
                    <MapPin className="h-3 w-3 text-slate-400" /> {/* Changed text-gray-400 to text-slate-400 */}
                    {meeting.location || t("online")}
                  </div>
                  <Badge variant={getStatusBadgeVariant(meeting.status)}>
                    {tCommon(meeting.status.toLowerCase().replace(/_/g, ''))}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
          {filteredMeetings.length === 0 && (
            <div className="px-6 py-10 text-center"> {/* Reduced padding */}
              <div className="flex flex-col items-center gap-3"> {/* Reduced gap */}
                <div className="w-14 h-14 rounded-full bg-slate-50 flex items-center justify-center"> {/* Reduced size and changed bg */}
                  <Calendar className="w-7 h-7 text-slate-200" /> {/* Reduced size and changed text color */}
                </div>
                <p className="text-sm font-bold text-slate-400">{t("empty")}</p> {/* Changed text-gray-400 to text-slate-400 */}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {selectedMeeting && (
        <UploadMinutesModal
          meetingId={selectedMeeting.id}
          meetingTitle={selectedMeeting.title}
          isOpen={!!selectedMeeting}
          onClose={() => setSelectedMeeting(null)}
          initialData={{
            minutes_details: selectedMeeting.minutes_details || null,
            minutes_file_url: selectedMeeting.minutes_file_url || null
          }}
        />
      )}
    </div>
  );
}
