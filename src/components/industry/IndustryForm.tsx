"use client";

import React, { useState } from 'react';
import { 
  Building2, 
  Tag, 
  Globe, 
  Upload,
  MapPin,
  User,
  Phone,
  Mail,
  Loader2,
  X,
  Info,
  Contact,
  Search,
  CheckCircle2
} from 'lucide-react';
import { cn } from "@/lib/utils";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { Badge } from "@/components/ui/badge";

interface IndustryFormProps {
  onSubmit: (formData: FormData) => Promise<void>;
  currentUserUniversity: { id: string; name: string };
  universities?: any[]; // Kept for backward compatibility
  defaultValues?: any;
  title?: string;
  description?: string;
  submitLabel?: string;
}

const IndustryForm = ({ 
  onSubmit, 
  currentUserUniversity,
  defaultValues,
  title,
  description,
  submitLabel
}: IndustryFormProps) => {
  const t = useTranslations("Industry.form");

  const displayTitle = title || (defaultValues ? t("titleEdit") : t("titleAdd"));
  const displayDescription = description || (defaultValues ? t("descriptionEdit") : t("descriptionAdd"));
  const displaySubmitLabel = submitLabel || (defaultValues ? t("actions.update") : t("actions.save"));

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(defaultValues?.image_url || null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  const handleFormAction = async (formData: FormData) => {
    setIsSubmitting(true);
    setError(null);
    try {
      await onSubmit(formData);
    } catch (err: any) {
      setError(err.message || "Something went wrong");
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        {/* Header */}
        <div className="px-8 py-6 border-b border-gray-100 bg-gray-50/30">
          <h1 className="text-xl font-bold text-gray-900">{displayTitle}</h1>
          <p className="text-sm text-gray-500 mt-1">{displayDescription}</p>
        </div>

        {/* Form */}
        <form action={handleFormAction} className="p-8 space-y-10">
          <input type="hidden" name="university_id" value={currentUserUniversity.id} />

          {/* Section 1: Company Profile */}
          <div className="space-y-6">
            <div className="flex items-center gap-2 text-blue-600">
              <Building2 className="h-5 w-5" />
              <h2 className="text-sm font-black uppercase tracking-widest">{t("sections.profile")}</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2 space-y-2">
                <label className="text-sm font-bold text-gray-700 ml-1">{t("fields.name")}</label>
                <div className="relative group">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500 transition-colors">
                    <Building2 className="h-4 w-4" />
                  </div>
                  <input
                    name="name"
                    required
                    defaultValue={defaultValues?.name}
                    placeholder={t("fields.namePlaceholder")}
                    className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700 ml-1">{t("fields.sector")}</label>
                <div className="relative group">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500 transition-colors">
                    <Tag className="h-4 w-4" />
                  </div>
                  <input
                    name="sector"
                    defaultValue={defaultValues?.sector}
                    placeholder={t("fields.sectorPlaceholder")}
                    className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700 ml-1">{t("fields.website")}</label>
                <div className="relative group">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500 transition-colors">
                    <Globe className="h-4 w-4" />
                  </div>
                  <input
                    name="website"
                    type="url"
                    defaultValue={defaultValues?.website}
                    placeholder={t("fields.websitePlaceholder")}
                    className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Section 2: Contact Info */}
          <div className="space-y-6">
            <div className="flex items-center gap-2 text-blue-600">
              <Contact className="h-5 w-5" />
              <h2 className="text-sm font-black uppercase tracking-widest">{t("sections.contact")}</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700 ml-1">{t("fields.contactPerson")}</label>
                <div className="relative group">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500 transition-colors">
                    <User className="h-4 w-4" />
                  </div>
                  <input
                    name="contact_person"
                    required
                    defaultValue={defaultValues?.contact_person}
                    placeholder={t("fields.contactPersonPlaceholder")}
                    className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700 ml-1">{t("fields.phone")}</label>
                <div className="relative group">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500 transition-colors">
                    <Phone className="h-4 w-4" />
                  </div>
                  <input
                    name="phone"
                    required
                    defaultValue={defaultValues?.phone}
                    placeholder={t("fields.phonePlaceholder")}
                    className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                  />
                </div>
              </div>

              <div className="md:col-span-2 space-y-2">
                <label className="text-sm font-bold text-gray-700 ml-1">{t("fields.email")}</label>
                <div className="relative group">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500 transition-colors">
                    <Mail className="h-4 w-4" />
                  </div>
                  <input
                    name="email"
                    type="email"
                    defaultValue={defaultValues?.email}
                    placeholder={t("fields.emailPlaceholder")}
                    className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Section 3: Media & Affiliation */}
          <div className="space-y-6">
            <div className="flex items-center gap-2 text-blue-600">
              <Upload className="h-5 w-5" />
              <h2 className="text-sm font-black uppercase tracking-widest">{t("sections.media")}</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <label className="text-sm font-bold text-gray-700 ml-1">{t("fields.logo")}</label>
                <div className="flex items-center gap-4">
                  <div className="h-20 w-20 rounded-2xl bg-gray-50 border-2 border-dashed border-gray-200 flex items-center justify-center overflow-hidden">
                    {previewUrl ? (
                      <img src={previewUrl} alt="Preview" className="h-full w-full object-cover" />
                    ) : (
                        <Building2 className="h-8 w-8 text-gray-300" />
                      )}
                  </div>
                  <div className="flex-1">
                    <input
                      type="file"
                      name="logo"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="block w-full text-xs text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-bold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 transition-all cursor-pointer"
                    />
                    <p className="text-[10px] text-gray-400 mt-2 font-medium">{t("fields.logoSubtitle")}</p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <label className="text-sm font-bold text-gray-700 ml-1">{t("fields.university")}</label>
                <div className="p-4 bg-blue-50/50 border border-blue-100 rounded-2xl flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-blue-600 shadow-sm">
                    <CheckCircle2 className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-blue-400">{t("fields.linked")}</p>
                    <p className="text-sm font-bold text-blue-900">{currentUserUniversity.name}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700 ml-1">{t("fields.address")}</label>
              <div className="relative group">
                <div className="absolute left-3 top-3 text-gray-400 group-focus-within:text-blue-500 transition-colors">
                  <MapPin className="h-4 w-4" />
                </div>
                <textarea
                  name="address"
                  rows={3}
                  defaultValue={defaultValues?.address}
                  placeholder={t("fields.addressPlaceholder")}
                  className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                />
              </div>
            </div>
          </div>

          {error && (
            <div className="p-4 bg-red-50 border border-red-100 rounded-xl flex items-center gap-3 text-red-700 text-sm font-medium">
              <X className="h-4 w-4" />
              {error}
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center justify-end gap-4 pt-8 border-t border-gray-100">
            <Link href="/dashboard/industry" className="px-8 py-3 rounded-xl text-sm font-bold text-gray-500 hover:bg-gray-100 transition-all">
              {t("actions.cancel")}
            </Link>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-10 py-3 rounded-xl text-sm font-bold transition-all shadow-lg shadow-blue-500/20 active:scale-95 disabled:opacity-50"
            >
              {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : displaySubmitLabel}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default IndustryForm;
