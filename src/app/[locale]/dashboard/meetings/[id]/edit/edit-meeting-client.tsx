"use client";

import { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { updateMeeting } from "@/actions/meeting-actions";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { cn } from "@/lib/utils";
import Select from "react-select";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import toast from "react-hot-toast";
import { 
  Calendar, 
  Clock, 
  MapPin, 
  Link as LinkIcon, 
  Users, 
  X, 
  FileText,
  Loader2,
  Info,
  ListPlus,
  Bold,
  Italic,
  List,
  ListOrdered,
  ArrowLeft,
  Save,
  Briefcase
} from "lucide-react";
import { Role, MeetingStatus, Meeting as PrismaMeeting, University } from "@prisma/client";
import { format } from "date-fns";

// --- Zod Schema for Form Validation ---
const MeetingFormSchema = z.object({
  topic: z.string().min(3, "Meeting topic is required."),
  date: z.string().min(1, "Meeting date is required."),
  startTime: z.string().min(1, "Meeting start time is required."),
  endTime: z.string().optional(),
  meetingType: z.enum(["on-site", "online"]),
  location: z.string().optional(),
  meetingLink: z.string().url("Invalid URL format.").optional().or(z.literal('')),
  agenda: z.string().min(10, "Agenda details are required.").optional(),
  participants: z.array(z.string()).min(1, "At least one participant is required."),
  universityId: z.string().min(1, "University is required."),
  status: z.nativeEnum(MeetingStatus),
});

type MeetingFormInputs = z.infer<typeof MeetingFormSchema>;

// --- Tiptap Editor Component ---
const TiptapEditor = ({ editor }: { editor: any }) => {
  if (!editor) return null;

  return (
    <div className="border border-gray-300 rounded-xl overflow-hidden focus-within:ring-2 focus-within:ring-blue-500/20 focus-within:border-blue-500 transition-all bg-white">
      <div className="flex items-center gap-1 p-2 border-b border-gray-200 bg-gray-50/50">
        {[
          { icon: Bold, action: () => editor.chain().focus().toggleBold().run(), active: 'bold' },
          { icon: Italic, action: () => editor.chain().focus().toggleItalic().run(), active: 'italic' },
          { icon: List, action: () => editor.chain().focus().toggleBulletList().run(), active: 'bulletList' },
          { icon: ListOrdered, action: () => editor.chain().focus().toggleOrderedList().run(), active: 'orderedList' },
        ].map((btn, i) => (
          <button
            key={i}
            type="button"
            onClick={btn.action}
            className={cn(
              "p-1.5 rounded-lg transition-colors", 
              editor.isActive(btn.active) ? "bg-blue-100 text-blue-600" : "hover:bg-gray-200 text-gray-500"
            )}
          >
            <btn.icon className="h-4 w-4" />
          </button>
        ))}
      </div>
      <EditorContent editor={editor} />
    </div>
  );
};

interface EditMeetingClientProps {
  meeting: PrismaMeeting;
  userRole: Role;
  availableDeans: { value: string; label: string }[];
}

export default function EditMeetingClient({ meeting, userRole, availableDeans }: EditMeetingClientProps) {
  const router = useRouter();
  const [formError, setFormError] = useState<string | null>(null);

  const { register, handleSubmit, control, watch, setValue, formState: { errors, isSubmitting } } = useForm<MeetingFormInputs>({
    resolver: zodResolver(MeetingFormSchema),
    defaultValues: {
      topic: meeting.title || "",
      date: meeting.date ? format(new Date(meeting.date), "yyyy-MM-dd") : "",
      startTime: meeting.start_time ? format(new Date(meeting.start_time), "HH:mm") : "",
      endTime: meeting.end_time ? format(new Date(meeting.end_time), "HH:mm") : "",
      meetingType: meeting.meeting_link ? "online" : "on-site",
      location: meeting.location || "",
      meetingLink: meeting.meeting_link || "",
      agenda: meeting.agenda_details || "",
      participants: JSON.parse(meeting.attendees || '[]') as string[],
      universityId: meeting.university_id || "",
      status: meeting.status,
    },
  });

  const editor = useEditor({
    extensions: [StarterKit],
    content: meeting.agenda_details || "",
    onUpdate: ({ editor }) => {
      setValue("agenda", editor.getHTML(), { shouldValidate: true });
    },
    editorProps: {
      attributes: {
        class: "prose prose-sm max-w-none p-4 min-h-[200px] focus:outline-none font-medium text-gray-600 leading-relaxed",
      },
    },
    immediatelyRender: false,
  });

  const meetingType = watch("meetingType");

  const onSubmit = async (data: MeetingFormInputs) => {
    setFormError(null);
    const formData = new FormData();
    formData.append("topic", data.topic);
    formData.append("date", data.date);
    formData.append("startTime", data.startTime);
    if (data.endTime) formData.append("endTime", data.endTime);
    formData.append("meetingType", data.meetingType);
    if (data.location) formData.append("location", data.location);
    if (data.meetingLink) formData.append("meetingLink", data.meetingLink);
    if (data.agenda) formData.append("agenda", data.agenda);
    formData.append("participants", JSON.stringify(data.participants));
    formData.append("universityId", data.universityId);
    formData.append("status", data.status);

    const result = await updateMeeting(meeting.id, formData);
    if (result?.error) {
      toast.error(result.error);
      setFormError(result.error);
    } else {
      toast.success("Meeting updated successfully!");
      router.push(`/dashboard/meetings/${meeting.id}`);
      router.refresh();
    }
  };

  const insertStandardAgenda = () => {
    const template = `
      <h2><strong>AGENDA & TIMELINE</strong></h2>
      <p><strong>[09:00 - 09:15] 1. Chairman's Welcome & Opening Remarks</strong></p>
      <ul>
        <li>Presenter: Chairman</li>
        <li>Note: Welcome address & Quorum check.</li>
      </ul>
      <p><strong>[09:15 - 09:30] 2. Adoption of Minutes</strong></p>
      <ul>
        <li>Presenter: Secretary</li>
        <li>Note: Approval of minutes from the previous meeting.</li>
      </ul>
      <p><strong>[09:30 - 10:30] 3. Matters Arising (Follow-up)</strong></p>
      <ul>
        <li>Topic A: ... (Presenter: ...)</li>
        <li>Topic B: ... (Presenter: ...)</li>
      </ul>
      <p><strong>[10:30 - 10:45] -- Coffee Break --</strong></p>
      <p><strong>[10:45 - 11:45] 4. Items for Discussion / Approval</strong></p>
      <ul>
        <li>Topic C: Budget Allocation (Presenter: Treasurer)</li>
        <li>Topic D: Strategic Plan Update (Presenter: Host Dean)</li>
      </ul>
      <p><strong>[11:45 - 12:00] 5. Any Other Business (AOB)</strong></p>
      <ul>
        <li>Next meeting schedule.</li>
        <li>Closing remarks.</li>
      </ul>
    `;
    
    if (editor) {
      editor.commands.setContent(template);
      setValue("agenda", template, { shouldValidate: true });
    }
  };

  const inputClasses = "w-full h-[42px] px-4 py-2 bg-white border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 transition-all text-sm text-gray-900";

  return (
    <div className="max-w-4xl mx-auto pb-20 px-4">
      <Link 
        href={`/dashboard/meetings/${meeting.id}`} 
        className="inline-flex items-center text-sm font-bold text-gray-500 hover:text-gray-900 mb-8 transition-all group"
      >
        <div className="p-2 rounded-xl group-hover:bg-gray-100 mr-2 transition-all">
          <ArrowLeft size={18} />
        </div>
        Back to Details
      </Link>

      <div className="bg-white rounded-[2.5rem] border border-gray-200 shadow-sm overflow-hidden">
        {/* Header */}
        <div className="px-8 py-6 border-b border-gray-100 bg-gray-50/30">
          <h1 className="text-xl font-bold text-gray-900">Edit Meeting</h1>
          <p className="text-sm text-gray-500 mt-1">Update the details for: <span className="font-bold text-blue-600">{meeting.title}</span></p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="p-8 space-y-10">
          {/* Section 1: Basic Info */}
          <div className="space-y-6">
            <div className="flex items-center gap-2 text-blue-600">
              <Info className="h-5 w-5" />
              <h2 className="text-sm font-black uppercase tracking-widest">Meeting Information</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2 space-y-2">
                <label className="text-sm font-bold text-gray-700 ml-1">Meeting Topic</label>
                <div className="relative group">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500 transition-colors">
                    <FileText className="h-4 w-4" />
                  </div>
                  <input
                    {...register("topic")}
                    placeholder="e.g. MTUN Quarterly Review 2024"
                    className={cn(
                      "w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all",
                      errors.topic && "border-red-500"
                    )}
                  />
                </div>
                {errors.topic && <p className="text-xs font-medium text-red-500 ml-1">{errors.topic.message}</p>}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700 ml-1">Date</label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none z-10" />
                  <input
                    type="date"
                    {...register("date")}
                    className={cn(inputClasses, "pl-10", errors.date && "border-red-500")}
                  />
                </div>
                {errors.date && <p className="text-xs font-medium text-red-500 ml-1">{errors.date.message}</p>}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-700 ml-1">Start Time</label>
                  <div className="relative">
                    <Clock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none z-10" />
                    <input
                      type="time"
                      {...register("startTime")}
                      className={cn(inputClasses, "pl-10", errors.startTime && "border-red-500")}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-700 ml-1">End Time</label>
                  <div className="relative">
                    <Clock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none z-10" />
                    <input
                      type="time"
                      {...register("endTime")}
                      className={cn(inputClasses, "pl-10")}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Section 2: Location & Type */}
          <div className="space-y-6">
            <div className="flex items-center gap-2 text-blue-600">
              <MapPin className="h-5 w-5" />
              <h2 className="text-sm font-black uppercase tracking-widest">Location & Format</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700 ml-1">Meeting Type</label>
                <div className="flex p-1 bg-gray-100 rounded-xl w-fit">
                  {["on-site", "online"].map((type) => (
                    <button
                      key={type}
                      type="button"
                      onClick={() => setValue("meetingType", type as any)}
                      className={cn(
                        "px-6 py-2 rounded-lg text-xs font-black uppercase tracking-widest transition-all",
                        meetingType === type ? "bg-white text-blue-600 shadow-sm" : "text-gray-500 hover:text-gray-700"
                      )}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700 ml-1">
                  {meetingType === 'on-site' ? 'Location / Room' : 'Meeting Link'}
                </label>
                <div className="relative group">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500 transition-colors">
                    {meetingType === 'on-site' ? <MapPin className="h-4 w-4" /> : <LinkIcon className="h-4 w-4" />}
                  </div>
                  <input
                    {...register(meetingType === 'on-site' ? "location" : "meetingLink")}
                    placeholder={meetingType === 'on-site' ? "e.g. Conference Room A" : "https://zoom.us/j/..."}
                    className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Section 3: Participants & Agenda */}
          <div className="space-y-6">
            <div className="flex items-center gap-2 text-blue-600">
              <Users className="h-5 w-5" />
              <h2 className="text-sm font-black uppercase tracking-widest">Participants & Agenda</h2>
            </div>

            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700 ml-1">Invite Participants</label>
                <Controller
                  control={control}
                  name="participants"
                  render={({ field }) => (
                    <Select
                      {...field}
                      options={availableDeans}
                      isMulti
                      classNamePrefix="react-select"
                      placeholder="Search and select staff..."
                      onChange={(opts) => field.onChange(opts ? opts.map(o => o.value) : [])}
                      value={availableDeans.filter(o => (field.value || []).includes(o.value))}
                      styles={{
                        control: (base) => ({
                          ...base,
                          borderRadius: '12px',
                          padding: '2px',
                          borderColor: '#E5E7EB',
                          boxShadow: 'none',
                          '&:hover': { borderColor: '#3B82F6' }
                        }),
                        multiValue: (base) => ({ ...base, backgroundColor: '#EFF6FF', borderRadius: '8px' }),
                        multiValueLabel: (base) => ({ ...base, color: '#1D4ED8', fontWeight: '700', fontSize: '11px' }),
                      }}
                    />
                  )}
                />
                {errors.participants && <p className="text-xs font-medium text-red-500 ml-1">{errors.participants.message}</p>}
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between mb-1">
                  <label className="text-sm font-bold text-gray-700 ml-1">Agenda Details</label>
                  <button
                    type="button"
                    onClick={insertStandardAgenda}
                    className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-blue-600 hover:text-blue-700 bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-lg transition-all"
                  >
                    <ListPlus size={14} />
                    Insert Standard Agenda
                  </button>
                </div>
                <TiptapEditor editor={editor} />
                {errors.agenda && <p className="text-xs font-medium text-red-500 ml-1">{errors.agenda.message}</p>}
              </div>
            </div>
          </div>

          {/* Section 4: Status (Only for Super Admin) */}
          {userRole === Role.super_admin && (
            <div className="space-y-6">
              <div className="flex items-center gap-2 text-blue-600">
                <Briefcase className="h-5 w-5" />
                <h2 className="text-sm font-black uppercase tracking-widest">Administrative</h2>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700 ml-1">Meeting Status</label>
                <select
                  {...register("status")}
                  className={inputClasses}
                >
                  {Object.values(MeetingStatus).map((status) => (
                    <option key={status} value={status}>{status}</option>
                  ))}
                </select>
              </div>
            </div>
          )}

          {formError && (
            <div className="rounded-xl bg-red-50 p-4 text-sm text-red-700 border border-red-100">
              {formError}
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center justify-end gap-4 pt-8 border-t border-gray-100">
            <Link 
              href={`/dashboard/meetings/${meeting.id}`} 
              className="px-8 py-3 rounded-xl text-sm font-bold text-gray-500 hover:bg-gray-100 transition-all"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-10 py-3 rounded-xl text-sm font-bold transition-all shadow-lg shadow-blue-500/20 active:scale-95 disabled:opacity-50"
            >
              {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : (
                <>
                  <Save size={18} />
                  Update Meeting
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
