"use client";

import React, { useState, useRef } from "react";
import { X, FileUp, FileText, Paperclip } from "lucide-react";
import { updateMeetingMinutes } from "@/actions/meeting-actions";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";

interface UploadMinutesModalProps {
  meetingId: string;
  meetingTitle: string;
  isOpen: boolean;
  onClose: () => void;
  initialData?: {
    minutes_details: string | null;
    minutes_file_url: string | null;
  };
}

export default function UploadMinutesModal({
  meetingId,
  meetingTitle,
  isOpen,
  onClose,
  initialData,
}: UploadMinutesModalProps) {
  const t = useTranslations("Meetings.modal");
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [minutesSummary, setMinutesSummary] = useState(initialData?.minutes_details || "");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  if (!isOpen) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!minutesSummary.trim()) {
      toast.error(t("errors.summary"));
      return;
    }

    setIsSubmitting(true);
    try {
      const formData = new FormData();
      formData.append("meetingId", meetingId);
      formData.append("minutesSummary", minutesSummary);
      if (selectedFile) {
        formData.append("file", selectedFile);
      }

      const result = await updateMeetingMinutes(formData);
      
      if (result.success) {
        toast.success(result.success);
        onClose();
        router.refresh();
      } else if (result.error) {
        toast.error(result.error);
      }
    } catch (error) {
      toast.error(t("errors.unexpected"));
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="bg-white w-full max-w-lg rounded-[2rem] shadow-2xl border border-gray-100 overflow-hidden animate-in zoom-in-95 duration-300">
        {/* Header */}
        <div className="px-8 py-6 border-b border-gray-50 flex items-center justify-between bg-gray-50/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-lg shadow-blue-500/20">
              <FileUp className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-black text-gray-900 tracking-tight">{t("title")}</h3>
              <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest">{t("meetingLabel")} {meetingTitle}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          <div className="space-y-2">
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-1">
              {t("summaryLabel")}
            </label>
            <div className="relative">
              <FileText className="absolute left-4 top-4 h-5 w-5 text-gray-400" />
              <textarea
                value={minutesSummary}
                onChange={(e) => setMinutesSummary(e.target.value)}
                placeholder={t("summaryPlaceholder")}
                className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-transparent rounded-2xl text-sm focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all min-h-[120px] resize-none"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-1">
              {t("fileLabel")}
            </label>
            <div className="relative">
              <Paperclip className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 z-10" />
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept=".pdf,.doc,.docx"
                className="hidden"
              />
              <div 
                onClick={() => fileInputRef.current?.click()}
                className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-transparent rounded-2xl text-sm hover:bg-gray-100 focus-within:bg-white focus-within:ring-2 focus-within:ring-blue-500/20 focus-within:border-blue-500 transition-all cursor-pointer flex items-center min-h-[54px]"
              >
                <span className={cn(
                  "truncate",
                  selectedFile ? "text-gray-900 font-bold" : "text-gray-500"
                )}>
                  {selectedFile ? selectedFile.name : t("filePlaceholder")}
                </span>
              </div>
            </div>
            {initialData?.minutes_file_url && !selectedFile && (
              <p className="text-[10px] text-blue-600 font-bold ml-1">
                {t("currentFile")} <a href={initialData.minutes_file_url} target="_blank" rel="noopener noreferrer" className="underline hover:text-blue-800">{initialData.minutes_file_url.split('/').pop()}</a>
              </p>
            )}
            <p className="text-[10px] text-gray-400 font-medium ml-1 italic">
              {t("fileFormats")}
            </p>
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-4 rounded-2xl text-sm font-bold text-gray-500 hover:bg-gray-50 transition-all border border-transparent hover:border-gray-100"
            >
              {t("actions.cancel")}
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white px-6 py-4 rounded-2xl text-sm font-bold transition-all shadow-lg shadow-blue-500/20 active:scale-95 flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <div className="h-5 w-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <FileUp className="w-5 h-5" />
                  {initialData ? t("actions.update") : t("actions.complete")}
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
