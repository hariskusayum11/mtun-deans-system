"use client";

import { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { createMeeting } from "@/actions/meeting-actions";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { cn } from "@/lib/utils";
import Select from "react-select";
import { useDropzone } from "react-dropzone";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import toast from "react-hot-toast";
import { useTranslations } from "next-intl";
import { 
  Calendar, 
  Clock, 
  MapPin, 
  Link as LinkIcon, 
  Users, 
  Paperclip, 
  X, 
  FileText,
  Loader2,
  Info,
  ListPlus,
  Bold,
  Italic,
  List,
  ListOrdered,
  Video, // Added for online meeting type icon
  Laptop, // Added for online meeting type icon
  Building2 // Changed from Building for on-site meeting type icon
} from "lucide-react";

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
});

type MeetingFormInputs = z.infer<typeof MeetingFormSchema>;

// --- Tiptap Editor Component ---
const TiptapEditor = ({ editor }: { editor: any }) => {
  if (!editor) return null;

  return (
    <div className="border border-slate-200 rounded-xl overflow-hidden focus-within:ring-2 focus-within:ring-blue-500/20 focus-within:border-blue-500 transition-all bg-white">
      <div className="flex items-center gap-1 p-2 border-b border-slate-100 bg-slate-50/50">
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
              editor.isActive(btn.active) ? "bg-blue-100 text-blue-600" : "hover:bg-slate-200 text-slate-500"
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

interface CreateMeetingFormProps {
  staffList: { id: string; name: string; department: string; image_url: string | null }[];
  universityId: string;
  availableDeans: { value: string; label: string }[];
}

export default function CreateMeetingForm({ staffList, universityId, availableDeans }: CreateMeetingFormProps) {
  const t = useTranslations("Meetings.create");
  const router = useRouter();
  const [files, setFiles] = useState<File[]>([]);
  const [formError, setFormError] = useState<string | null>(null);

  const { register, handleSubmit, control, watch, setValue, formState: { errors, isSubmitting } } = useForm<MeetingFormInputs>({
    resolver: zodResolver(MeetingFormSchema),
    defaultValues: {
      topic: "",
      meetingType: "on-site",
      universityId: universityId,
      agenda: "",
    },
  });

  const editor = useEditor({
    extensions: [StarterKit],
    content: "",
    onUpdate: ({ editor }) => {
      setValue("agenda", editor.getHTML(), { shouldValidate: true });
    },
    editorProps: {
      attributes: {
        class: "prose prose-sm max-w-none p-4 min-h-[200px] focus:outline-none font-medium text-slate-600 leading-relaxed",
      },
    },
    immediatelyRender: false,
  });

  const meetingType = watch("meetingType");

  const { getRootProps, getInputProps } = useDropzone({
    onDrop: (acceptedFiles) => setFiles((prev) => [...prev, ...acceptedFiles]),
    accept: { 'application/pdf': ['.pdf'], 'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'] },
  });

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
    files.forEach((file) => formData.append("attachments", file));

    const result = await createMeeting(formData);
    if (result?.error) {
      toast.error(result.error);
      setFormError(result.error);
    } else {
      toast.success(t("toastSuccess"));
      router.push("/dashboard/meetings");
    }
  };

  const participantOptions = availableDeans;

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

  const inputClasses = "w-full h-[42px] px-4 py-2 bg-white border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-sm text-slate-900";
  const labelClasses = "text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1";

  return (
    <div className="p-4 space-y-4"> {/* Main Layout Wrapper */}
      {/* Header (Outside Card) */}
      <div className="space-y-1">
        <h2 className="text-2xl font-bold tracking-tight text-slate-800">{t("title")}</h2>
        <p className="text-muted-foreground text-sm">{t("description")}</p>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm"> {/* White Card Wrapper, removed overflow-hidden */}
        <form id="create-meeting-form" onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-6"> {/* Form with internal padding and spacing, removed flex flex-col h-full and internal scroll */}
          {/* Section 1: Basic Info */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-blue-600">
              <Info className="h-4 w-4" />
              <h2 className={labelClasses}>{t("sections.info")}</h2>
            </div>
            
            <div className="grid grid-cols-1 gap-4"> {/* Single column grid for topic */}
              <div className="space-y-2">
                <label className={labelClasses}>{t("fields.topic")}</label>
                <div className="relative group">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors">
                    <FileText className="h-4 w-4" />
                  </div>
                  <input
                    {...register("topic")}
                    placeholder={t("fields.topicPlaceholder")}
                    className={cn(
                      "w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-xl text-base focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all", // Slightly larger input
                      errors.topic && "border-red-500"
                    )}
                  />
                </div>
                {errors.topic && <p className="text-xs font-medium text-red-500 ml-1">{errors.topic.message}</p>}
              </div>

              {/* Time Section: 3-column grid */}
              <div className="grid grid-cols-3 gap-4">
                <div className="col-span-3 md:col-span-1 space-y-2"> {/* Date Picker (50% on md, full on mobile) */}
                  <label className={labelClasses}>{t("fields.date")}</label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none z-10" />
                    <input
                      type="date"
                      {...register("date")}
                      className={cn(inputClasses, "pl-10", errors.date && "border-red-500")}
                    />
                  </div>
                  {errors.date && <p className="text-xs font-medium text-red-500 ml-1">{errors.date.message}</p>}
                </div>

                <div className="col-span-2 md:col-span-1 space-y-2"> {/* Start Time (25% on md, half on mobile) */}
                  <label className={labelClasses}>{t("fields.startTime")}</label>
                  <div className="relative">
                    <Clock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none z-10" />
                    <input
                      type="time"
                      {...register("startTime")}
                      className={cn(inputClasses, "pl-10", errors.startTime && "border-red-500")}
                    />
                  </div>
                  {errors.startTime && <p className="text-xs font-medium text-red-500 ml-1">{errors.startTime.message}</p>}
                </div>
                <div className="col-span-1 space-y-2"> {/* End Time (25% on md, half on mobile) */}
                  <label className={labelClasses}>{t("fields.endTime")}</label>
                  <div className="relative">
                    <Clock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none z-10" />
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
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-blue-600">
              <MapPin className="h-4 w-4" />
              <h2 className={labelClasses}>{t("sections.location")}</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Location Type: 2 Large Clickable Cards */}
              <div className="col-span-full grid grid-cols-2 gap-4">
                <div
                  onClick={() => setValue("meetingType", "on-site")}
                  className={cn(
                    "flex flex-col items-center justify-center p-6 rounded-xl border-2 cursor-pointer transition-all",
                    meetingType === "on-site"
                      ? "border-blue-500 bg-blue-50 text-blue-700 shadow-md"
                      : "border-slate-200 bg-white text-slate-600 hover:border-blue-300 hover:bg-slate-50"
                  )}
                >
                  <Building2 className="h-8 w-8 mb-2" />
                  <span className="text-sm font-bold uppercase">{t("fields.onSite")}</span>
                </div>
                <div
                  onClick={() => setValue("meetingType", "online")}
                  className={cn(
                    "flex flex-col items-center justify-center p-6 rounded-xl border-2 cursor-pointer transition-all",
                    meetingType === "online"
                      ? "border-blue-500 bg-blue-50 text-blue-700 shadow-md"
                      : "border-slate-200 bg-white text-slate-600 hover:border-blue-300 hover:bg-slate-50"
                  )}
                >
                  <Laptop className="h-8 w-8 mb-2" />
                  <span className="text-sm font-bold uppercase">{t("fields.online")}</span>
                </div>
              </div>

              <div className="col-span-full space-y-2">
                <label className={labelClasses}>
                  {meetingType === 'on-site' ? t("fields.location") : t("fields.link")}
                </label>
                <div className="relative group">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors">
                    {meetingType === 'on-site' ? <MapPin className="h-4 w-4" /> : <LinkIcon className="h-4 w-4" />}
                  </div>
                  <input
                    {...register(meetingType === 'on-site' ? "location" : "meetingLink")}
                    placeholder={meetingType === 'on-site' ? t("fields.locationPlaceholder") : t("fields.linkPlaceholder")}
                    className={cn(inputClasses, "pl-10")}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Section 3: Participants & Agenda */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-blue-600">
              <Users className="h-4 w-4" />
              <h2 className={labelClasses}>{t("sections.participants")}</h2>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <label className={labelClasses}>{t("fields.participants")}</label>
                <Controller
                  control={control}
                  name="participants"
                  render={({ field }) => (
                    <Select
                      {...field}
                      options={participantOptions}
                      isMulti
                      classNamePrefix="react-select"
                      placeholder={t("fields.participantsPlaceholder")}
                      onChange={(opts) => field.onChange(opts ? opts.map(o => o.value) : [])}
                      value={participantOptions.filter(o => (field.value || []).includes(o.value))}
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
                  <label className={labelClasses}>{t("fields.agenda")}</label>
                  <button
                    type="button"
                    onClick={insertStandardAgenda}
                    className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-blue-600 hover:text-blue-700 bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-lg transition-all"
                  >
                    <span className="flex items-center gap-1.5">
                      <ListPlus size={14} />
                      {t("fields.insertAgenda")}
                    </span>
                  </button>
                </div>
                <TiptapEditor editor={editor} />
                {errors.agenda && <p className="text-xs font-medium text-red-500 ml-1">{errors.agenda.message}</p>}
              </div>
            </div>
          </div>

          {/* Section 4: Attachments */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-blue-600">
              <Paperclip className="h-4 w-4" />
              <h2 className={labelClasses}>{t("sections.attachments")}</h2>
            </div>

            <div {...getRootProps()} className="border-2 border-dashed border-slate-200 rounded-2xl p-8 text-center hover:border-blue-400 hover:bg-blue-50/30 transition-all cursor-pointer group">
              <input {...getInputProps()} />
              <div className="w-14 h-14 rounded-xl bg-slate-50 flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform">
                <Paperclip className="h-7 w-7 text-slate-400" />
              </div>
              <p className="text-sm font-bold text-slate-900">{t("dropzone.title")}</p>
              <p className="text-xs text-slate-400 mt-1">{t("dropzone.subtitle")}</p>
            </div>

            {files.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {files.map((file, i) => (
                  <div key={i} className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-100">
                    <div className="flex items-center gap-3">
                      <FileText className="h-5 w-5 text-blue-500" />
                      <span className="text-xs font-bold text-slate-700 truncate max-w-[150px]">{file.name}</span>
                    </div>
                    <button type="button" onClick={() => setFiles(f => f.filter(x => x !== file))} className="p-1 hover:bg-red-100 text-red-500 rounded-lg transition-colors">
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Form Footer with Actions */}
          <div className="mt-8 pt-6 border-t border-slate-100 flex justify-end gap-4"> {/* Reverted actions to be part of the form flow */}
            <Link href="/dashboard/meetings" className="px-5 py-2.5 rounded-xl text-sm font-bold text-slate-500 hover:bg-slate-50 transition-all">
              {t("actions.cancel")}
            </Link>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-xl text-sm font-bold transition-all shadow-lg shadow-blue-500/20 active:scale-95 disabled:opacity-50"
            >
              {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : t("actions.submit")}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
