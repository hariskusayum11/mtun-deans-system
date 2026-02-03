"use client";

import { useState, useEffect, forwardRef } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { MeetingSchema } from "@/lib/validators";
import { updateMeeting } from "@/actions/meeting-actions";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { Role, University, MeetingStatus, Meeting as PrismaMeeting, Staff } from "@prisma/client";
import { useSession } from "next-auth/react";
import SubmitButton from "@/components/form/SubmitButton";
import Select from "react-select";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import toast from "react-hot-toast";
import { Calendar, Clock, MapPin, Link as LinkIcon, Users, Paperclip, X, Bold, Italic, List, ListOrdered, Briefcase } from "lucide-react";

// Extend Prisma's University type to include staff for this context
type UniversityWithStaff = University & {
  staff: Staff[];
};

type MeetingWithUniversity = PrismaMeeting & {
  university: { name: string } | null;
  agenda_details: string | null;
  agenda_file_url: string | null;
  minutes_details: string | null;
  minutes_file_url: string | null;
  dean_approved: boolean;
  attendees: string | null;
};

// --- Zod Schema for Form Validation ---
// Re-defining here to ensure it matches the server-side schema for client-side validation
const MeetingFormSchema = z.object({
  topic: z.string().min(3, "Meeting topic is required."),
  date: z.date({ message: "Meeting date is required." }),
  startTime: z.date({ message: "Meeting start time is required." }),
  endTime: z.date().optional(),
  meetingType: z.enum(["on-site", "online"]),
  location: z.string().optional().or(z.literal('')),
  meetingLink: z.string().url("Invalid URL format.").optional().or(z.literal('')),
  agenda: z.string().min(10, "Agenda details are required.").optional().or(z.literal('')),
  participants: z.array(z.string()).min(1, "At least one participant is required."),
  universityId: z.string().min(1, "University is required."),
  status: z.nativeEnum(MeetingStatus), // Ensure status is part of the schema
});

type MeetingFormInputs = z.infer<typeof MeetingFormSchema>;

// --- Custom DatePicker Input (for react-hook-form Controller) ---
const CustomDatePickerInput = forwardRef(({ value, onClick, placeholder }: any, ref: any) => (
  <button className="w-full py-2 px-3 rounded-md border border-gray-300 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-left" onClick={onClick} ref={ref}>
    {value ? value : placeholder}
  </button>
));
CustomDatePickerInput.displayName = 'CustomDatePickerInput';

// --- Tiptap Editor Component ---
interface TiptapEditorProps {
  content: string;
  onChange: (html: string) => void;
  placeholder?: string;
}

const TiptapEditor = ({ content, onChange, placeholder }: TiptapEditorProps) => {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        bulletList: { keepMarks: true, keepAttributes: false },
        orderedList: { keepMarks: true, keepAttributes: false },
      }),
    ],
    content: content,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: "prose max-w-none p-4 min-h-[150px] border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500",
      },
    },
    immediatelyRender: false,
  });

  if (!editor) {
    return null;
  }

  return (
    <div className="border border-gray-300 rounded-md">
      <div className="flex items-center space-x-1 p-2 border-b border-gray-200 bg-gray-50 rounded-t-md">
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBold().run()}
          disabled={!editor.can().chain().focus().toggleBold().run()}
          className={cn("p-1 rounded", editor.isActive("bold") ? "bg-blue-200" : "hover:bg-gray-200")}
        >
          <Bold className="h-4 w-4" />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          disabled={!editor.can().chain().focus().toggleItalic().run()}
          className={cn("p-1 rounded", editor.isActive("italic") ? "bg-blue-200" : "hover:bg-gray-200")}
        >
          <Italic className="h-4 w-4" />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={cn("p-1 rounded", editor.isActive("bulletList") ? "bg-blue-200" : "hover:bg-gray-200")}
        >
          <List className="h-4 w-4" />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={cn("p-1 rounded", editor.isActive("orderedList") ? "bg-blue-200" : "hover:bg-gray-200")}
        >
          <ListOrdered className="h-4 w-4" />
        </button>
      </div>
      <EditorContent editor={editor} />
    </div>
  );
};

// --- Main EditMeetingClient Component ---
interface EditMeetingClientProps {
  meeting: MeetingWithUniversity;
  userRole: Role;
  universities: UniversityWithStaff[]; // Use the extended type
}

export default function EditMeetingClient({ meeting, userRole, universities }: EditMeetingClientProps) {
  const router = useRouter();
  const { data: session } = useSession();
  const [formError, setFormError] = useState<string | null>(null);
  const [loadingUniversities, setLoadingUniversities] = useState(false); // Already fetched in Server Component

  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<MeetingFormInputs>({
    resolver: zodResolver(MeetingFormSchema),
    defaultValues: {
      topic: meeting.title || "",
      date: new Date(meeting.date),
      startTime: new Date(meeting.start_time),
      endTime: meeting.end_time ? new Date(meeting.end_time) : undefined,
      meetingType: meeting.meeting_link ? "online" : "on-site",
      location: meeting.location || "",
      meetingLink: meeting.meeting_link || "",
      agenda: meeting.agenda_details || "",
      participants: JSON.parse(meeting.attendees || '[]') as string[],
      universityId: meeting.university_id || "",
      status: meeting.status,
    },
  });

  const meetingType = watch("meetingType");

  // Options for react-select
  const participantOptions = (userRole === Role.super_admin)
    ? universities.flatMap(uni => uni.staff.map(staff => ({
        value: staff.id,
        label: staff.name,
        image_url: staff.image_url,
        department: staff.department,
      })))
    : (universities.find(uni => uni.id === meeting.university_id)?.staff || []).map(staff => ({
        value: staff.id,
        label: staff.name,
        image_url: staff.image_url,
        department: staff.department,
      }));

  const onSubmit = async (data: MeetingFormInputs) => {
    setFormError(null);
    const formData = new FormData();
    formData.append("topic", data.topic);
    formData.append("date", data.date.toISOString().split('T')[0]);
    formData.append("startTime", data.startTime.toTimeString().split(' ')[0].substring(0, 5));
    if (data.endTime) {
      formData.append("endTime", data.endTime.toTimeString().split(' ')[0].substring(0, 5));
    }
    formData.append("meetingType", data.meetingType);
    if (data.location) formData.append("location", data.location);
    if (data.meetingLink) formData.append("meetingLink", data.meetingLink);
    if (data.agenda) formData.append("agenda", data.agenda);
    formData.append("participants", JSON.stringify(data.participants));
    formData.append("universityId", data.universityId);
    formData.append("status", data.status); // Ensure status is passed

    const result = await updateMeeting(meeting.id, formData);
    if (result?.error) {
      toast.error(result.error);
      setFormError(result.error);
    } else {
      toast.success("Meeting updated successfully!");
      router.push("/dashboard/meetings");
    }
  };

  return (
    <div className="container mx-auto p-4 max-w-5xl">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Edit Meeting: {meeting.title}</h1>

      <div className="bg-white shadow-lg rounded-xl p-8">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Meeting Details */}
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Meeting Details</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="topic" className="block text-sm font-bold text-gray-700 mb-2">
                Topic *
              </label>
              <div className="relative">
                <input
                  id="topic"
                  type="text"
                  {...register("topic")}
                  className={cn(
                    "w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 py-3 pl-10",
                    errors.topic && "border-red-500"
                  )}
                  required
                />
                <Briefcase className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              </div>
              {errors.topic && (
                <p className="mt-2 text-sm text-red-600">{errors.topic.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="date" className="block text-sm font-bold text-gray-700 mb-2">
                Date *
              </label>
              <Controller
                control={control}
                name="date"
                render={({ field }) => (
                  <div className="relative">
                    <DatePicker
                      selected={field.value}
                      onChange={(date: Date | null) => field.onChange(date || undefined)}
                      customInput={<CustomDatePickerInput placeholder="Select date" />}
                      dateFormat="yyyy-MM-dd"
                      className={cn(
                        "w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 py-3 pl-10",
                        errors.date && "border-red-500"
                      )}
                    />
                    <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  </div>
                )}
              />
              {errors.date && (
                <p className="mt-2 text-sm text-red-600">{errors.date.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="startTime" className="block text-sm font-bold text-gray-700 mb-2">
                Start Time *
              </label>
              <Controller
                control={control}
                name="startTime"
                render={({ field }) => (
                  <div className="relative">
                    <DatePicker
                      selected={field.value}
                      onChange={(date: Date | null) => field.onChange(date || undefined)}
                      showTimeSelect
                      showTimeSelectOnly
                      timeIntervals={15}
                      timeCaption="Time"
                      dateFormat="HH:mm"
                      customInput={<CustomDatePickerInput placeholder="Select start time" />}
                      className={cn(
                        "w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 py-3 pl-10",
                        errors.startTime && "border-red-500"
                      )}
                    />
                    <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  </div>
                )}
              />
              {errors.startTime && (
                <p className="mt-2 text-sm text-red-600">{errors.startTime.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="endTime" className="block text-sm font-bold text-gray-700 mb-2">
                End Time (Optional)
              </label>
              <Controller
                control={control}
                name="endTime"
                render={({ field }) => (
                  <div className="relative">
                    <DatePicker
                      selected={field.value}
                      onChange={(date: Date | null) => field.onChange(date || undefined)}
                      showTimeSelect
                      showTimeSelectOnly
                      timeIntervals={15}
                      timeCaption="Time"
                      dateFormat="HH:mm"
                      customInput={<CustomDatePickerInput placeholder="Select end time" />}
                      className={cn(
                        "w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 py-3 pl-10",
                        errors.endTime && "border-red-500"
                      )}
                    />
                    <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  </div>
                )}
              />
              {errors.endTime && (
                <p className="mt-2 text-sm text-red-600">{errors.endTime.message}</p>
              )}
            </div>
          </div>

          {/* Meeting Type */}
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Meeting Type *</label>
            <div className="flex space-x-4">
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  {...register("meetingType")}
                  value="on-site"
                  className="form-radio h-4 w-4 text-blue-600"
                />
                <span className="ml-2 text-gray-700">On-site</span>
              </label>
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  {...register("meetingType")}
                  value="online"
                  className="form-radio h-4 w-4 text-blue-600"
                />
                <span className="ml-2 text-gray-700">Online</span>
              </label>
            </div>
            {errors.meetingType && (
              <p className="mt-2 text-sm text-red-600">{errors.meetingType.message}</p>
            )}
          </div>

          {/* Conditional Inputs */}
          {meetingType === "on-site" && (
            <div>
              <label htmlFor="location" className="block text-sm font-bold text-gray-700 mb-2">
                Location/Room
              </label>
              <div className="relative">
                <input
                  id="location"
                  type="text"
                  {...register("location")}
                  className={cn(
                    "w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 py-3 pl-10",
                    errors.location && "border-red-500"
                  )}
                />
                <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              </div>
              {errors.location && (
                <p className="mt-2 text-sm text-red-600">{errors.location.message}</p>
              )}
            </div>
          )}

          {meetingType === "online" && (
            <div>
              <label htmlFor="meetingLink" className="block text-sm font-bold text-gray-700 mb-2">
                Meeting Link
              </label>
              <div className="relative">
                <input
                  id="meetingLink"
                  type="url"
                  {...register("meetingLink")}
                  className={cn(
                    "w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 py-3 pl-10",
                    errors.meetingLink && "border-red-500"
                  )}
                />
                <LinkIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              </div>
              {errors.meetingLink && (
                <p className="mt-2 text-sm text-red-600">{errors.meetingLink.message}</p>
              )}
            </div>
          )}

          {/* Agenda Rich Text Editor */}
          <div>
            <label htmlFor="agenda" className="block text-sm font-bold text-gray-700 mb-2">
              Agenda *
            </label>
            <Controller
              name="agenda"
              control={control}
              render={({ field }) => (
                <TiptapEditor
                  content={field.value || ""}
                  onChange={field.onChange}
                  placeholder="Write your agenda here..."
                />
              )}
            />
            {errors.agenda && (
              <p className="mt-2 text-sm text-red-600">{errors.agenda.message}</p>
            )}
          </div>

          {/* Participants Multi-select */}
          <div>
            <label htmlFor="participants" className="block text-sm font-bold text-gray-700 mb-2">
              Participants *
            </label>
            <Controller
              control={control}
              name="participants"
              render={({ field }) => (
                <Select
                  {...field}
                  options={participantOptions}
                  isMulti
                  classNamePrefix="react-select"
                  placeholder="Select participants..."
                  onChange={(selectedOptions) =>
                    field.onChange(selectedOptions ? selectedOptions.map((option: any) => option.value) : [])
                  }
                  value={participantOptions.filter(option => field.value.includes(option.value))}
                  formatOptionLabel={({ label, image_url, department }: any) => (
                    <div className="flex items-center">
                      {image_url && (
                        <Image src={image_url} alt={label} width={24} height={24} className="rounded-full mr-2" />
                      )}
                      <div>
                        <span className="font-medium">{label}</span>
                        {department && <span className="text-gray-500 text-xs ml-2">({department})</span>}
                      </div>
                    </div>
                  )}
                  styles={{
                    control: (base, state) => ({
                      ...base,
                      borderColor: errors.participants ? 'rgb(239 68 68)' : base.borderColor,
                      boxShadow: state.isFocused ? (errors.participants ? '0 0 0 1px rgb(239 68 68)' : '0 0 0 1px rgb(59 130 246)') : 'none',
                      '&:hover': {
                        borderColor: errors.participants ? 'rgb(239 68 68)' : base.borderColor,
                      }
                    }),
                    multiValue: (base) => ({
                      ...base,
                      backgroundColor: '#e0e7ff', // Light blue background for selected tags
                    }),
                    multiValueLabel: (base) => ({
                      ...base,
                      color: '#374151', // Dark gray text
                    }),
                    multiValueRemove: (base) => ({
                      ...base,
                      color: '#6b7280',
                      '&:hover': {
                        backgroundColor: '#93c5fd', // Blue-300 on hover
                        color: 'white',
                      },
                    }),
                  }}
                />
              )}
            />
            {errors.participants && (
              <p className="mt-2 text-sm text-red-600">{errors.participants.message}</p>
            )}
          </div>

          {/* Status (Only editable by Super Admin) */}
          {userRole === Role.super_admin && (
            <div>
              <label htmlFor="status" className="block text-sm font-bold text-gray-700 mb-2">
                Status *
              </label>
              <select
                id="status"
                {...register("status")}
                className={cn(
                  "w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 py-3",
                  errors.status && "border-red-500"
                )}
                required
              >
                {Object.values(MeetingStatus).map((statusOption) => (
                  <option key={statusOption} value={statusOption}>
                    {statusOption.replace("_", " ")}
                  </option>
                ))}
              </select>
              {errors.status && (
                <p className="mt-2 text-sm text-red-600">{errors.status.message}</p>
              )}
            </div>
          )}

          {formError && (
            <div className="rounded-md bg-red-50 p-3 text-sm text-red-700">
              {formError}
            </div>
          )}

          <div className="flex justify-end space-x-3 mt-8">
            <Link
              href="/dashboard/meetings"
              className="inline-flex items-center rounded-md border border-gray-300 bg-white px-6 py-3 text-base font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            >
              Cancel
            </Link>
            <SubmitButton label="Update Meeting" className="px-6 py-3 text-base bg-blue-600 hover:bg-blue-700" />
          </div>
        </form>
      </div>
    </div>
  );
}
