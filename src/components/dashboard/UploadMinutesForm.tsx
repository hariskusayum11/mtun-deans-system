"use client";

import { useState, forwardRef } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { addMeetingMinutes } from "@/actions/meeting-actions"; // Server action to add minutes
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import SubmitButton from "@/components/form/SubmitButton";
import { useDropzone } from "react-dropzone";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import toast from "react-hot-toast";
import { useTranslations } from "next-intl";
import { Paperclip, X, Bold, Italic, List, ListOrdered, FileText, Trash2 } from "lucide-react"; // Import Trash2
import ConfirmModal from "@/components/ui/ConfirmModal"; // Import ConfirmModal

// --- Zod Schema for Form Validation ---
const UploadMinutesSchema = z.object({
  minutesSummary: z.string().min(10, "Minutes summary is required."),
  // file: z.any().optional(), // File validation will be handled by react-dropzone and server action
});

type UploadMinutesInputs = z.infer<typeof UploadMinutesSchema>;

// --- Tiptap Editor Component (reused from CreateMeetingForm) ---
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
    immediatelyRender: false, // CRITICAL: Fix Tiptap SSR hydration error
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

// --- Main UploadMinutesForm Component ---
interface UploadMinutesFormProps {
  meetingId: string;
}

export default function UploadMinutesForm({ meetingId }: UploadMinutesFormProps) {
  const t = useTranslations("Meetings.uploadMinutes");
  const tCommon = useTranslations("Common"); // For modal translations
  const router = useRouter();
  const [files, setFiles] = useState<File[]>([]);
  const [formError, setFormError] = useState<string | null>(null);
  const [isRemoveFileModalOpen, setIsRemoveFileModalOpen] = useState(false);

  const {
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm<UploadMinutesInputs>({
    resolver: zodResolver(UploadMinutesSchema),
    defaultValues: {
      minutesSummary: "",
    },
  });

  // React Dropzone setup
  const { getRootProps, getInputProps } = useDropzone({
    onDrop: (acceptedFiles) => {
      if (acceptedFiles.length > 1) {
        toast.error(t("errors.singleFile"));
        return;
      }
      setFiles(acceptedFiles);
    },
    accept: {
      'application/pdf': ['.pdf'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
    },
    maxFiles: 1,
  });

  const handleRemoveFileClick = () => {
    setIsRemoveFileModalOpen(true);
  };

  const confirmRemoveFile = () => {
    setFiles([]);
    setIsRemoveFileModalOpen(false);
  };

  const onSubmit = async (data: UploadMinutesInputs) => {
    setFormError(null);
    if (files.length === 0) {
      setFormError(t("errors.noFile"));
      toast.error(t("errors.noFile"));
      return;
    }

    const formData = new FormData();
    formData.append("minutes_details", data.minutesSummary);
    formData.append("minutes_file", files[0]); // Assuming only one file

    // Mock file upload to a cloud service and get a URL
    const mockFileUploadUrl = `https://example.com/minutes/${meetingId}/${files[0].name}`;
    formData.append("minutes_file_url", mockFileUploadUrl);

    const result = await addMeetingMinutes(meetingId, formData);

    if (result?.error) {
      toast.error(result.error);
      setFormError(result.error);
    } else {
      toast.success(t("toastSuccess"));
      router.refresh(); // Revalidate data on the server to show updated minutes
    }
  };

  return (
    <div className="bg-white shadow-lg rounded-xl p-8">
      <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
        <FileText className="h-6 w-6 mr-3 text-blue-500" /> {t("title")}
      </h2>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Minutes Summary Rich Text Editor */}
        <div>
          <label htmlFor="minutesSummary" className="block text-sm font-bold text-gray-700 mb-2">
            {t("fields.summary")}
          </label>
          <Controller
            name="minutesSummary"
            control={control}
            render={({ field }) => (
              <TiptapEditor
                content={field.value || ""}
                onChange={field.onChange}
                placeholder={t("fields.summaryPlaceholder")}
              />
            )}
          />
          {errors.minutesSummary && (
            <p className="mt-2 text-sm text-red-600">{errors.minutesSummary.message}</p>
          )}
        </div>

        {/* File Upload */}
        <div>
          <label className="block text-sm font-bold text-gray-700 mb-2">
            {t("fields.file")}
          </label>
          <div
            {...getRootProps()}
            className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:border-blue-500 transition-colors duration-300"
          >
            <input {...getInputProps()} />
            <Paperclip className="h-8 w-8 text-gray-400 mx-auto mb-2" />
            <p className="text-gray-600">{t("fields.filePlaceholder")}</p>
            <p className="text-xs text-gray-500 mt-1">{t("fields.fileSubtitle")}</p>
          </div>
          <aside className="mt-4">
            {files.length > 0 && (
              <h4 className="text-sm font-semibold text-gray-700 mb-2">{t("fields.selectedFile")}</h4>
            )}
            <ul className="space-y-2">
              {files.map((file) => (
                <li key={file.name} className="flex items-center justify-between bg-gray-100 p-3 rounded-md">
                  <span className="text-gray-700 text-sm">{file.name}</span>
                  <button
                    type="button"
                    onClick={handleRemoveFileClick}
                    className="text-red-500 hover:text-red-700 ml-4"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </li>
              ))}
            </ul>
          </aside>
        </div>

        {/* Form Error */}
        {formError && (
          <div className="rounded-md bg-red-50 p-3 text-sm text-red-700">
            {formError}
          </div>
        )}

        {/* Submit Button */}
        <div className="flex justify-end">
          <SubmitButton label={t("actions.submit")} className="px-6 py-3 text-base bg-blue-600 hover:bg-blue-700" />
        </div>
      </form>

      <ConfirmModal
        isOpen={isRemoveFileModalOpen}
        onClose={() => setIsRemoveFileModalOpen(false)}
        onConfirm={confirmRemoveFile}
        title={tCommon("deleteTitle")}
        description={tCommon("deleteDesc")}
        variant="danger"
        icon={Trash2}
      />
    </div>
  );
}
