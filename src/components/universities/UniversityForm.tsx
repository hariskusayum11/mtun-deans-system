"use client";

import React from 'react';
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { UniversitySchema } from "@/lib/validators";
import { 
  Building2, 
  Tag, 
  Globe, 
  Image as ImageIcon,
  MapPin,
  Loader2,
  X
} from 'lucide-react';
import { cn } from "@/lib/utils";
import Link from "next/link";

type UniversityFormInputs = z.infer<typeof UniversitySchema>;

interface UniversityFormProps {
  onSubmit: (data: UniversityFormInputs) => Promise<void>;
  isSubmitting: boolean;
  error?: string | null;
  defaultValues?: any;
  title?: string;
  description?: string;
  submitLabel?: string;
}

const UniversityForm = ({ 
  onSubmit, 
  isSubmitting, 
  error, 
  defaultValues,
  title = "Add New University",
  description = "Register a new MTUN member university and set up its profile.",
  submitLabel = "Save University"
}: UniversityFormProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting: internalIsSubmitting },
  } = useForm<any>({
    resolver: zodResolver(UniversitySchema),
    defaultValues: defaultValues || {
      name: "",
      short_code: "",
      website: "",
      logo_url: "",
    },
  });

  return (
    <div className="w-full max-w-2xl mx-auto p-4 md:p-0">
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        {/* Header */}
        <div className="px-6 md:px-8 py-4 md:py-6 border-b border-gray-100 bg-gray-50/30">
          <h1 className="text-lg md:text-xl font-bold text-gray-900">{title}</h1>
          <p className="text-xs md:text-sm text-gray-500 mt-1">{description}</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="p-6 md:p-8 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* University Name */}
            <div className="space-y-2 md:col-span-2">
              <label className="text-sm font-bold text-gray-700 ml-1">University Name</label>
              <div className="relative group">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500 transition-colors">
                  <Building2 className="h-4 w-4" />
                </div>
                <input
                  {...register("name")}
                  placeholder="e.g. Universiti Malaysia Pahang Al-Sultan Abdullah"
                  className={cn(
                    "w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all",
                    errors.name && "border-red-500 focus:ring-red-500/20 focus:border-red-500"
                  )}
                />
              </div>
              {errors.name && <p className="text-xs font-medium text-red-500 ml-1">{errors.name.message as string}</p>}
            </div>

            {/* Short Code */}
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700 ml-1">Short Code</label>
              <div className="relative group">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500 transition-colors">
                  <Tag className="h-4 w-4" />
                </div>
                <input
                  {...register("short_code")}
                  placeholder="e.g. UMPSA"
                  className={cn(
                    "w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all",
                    errors.short_code && "border-red-500 focus:ring-red-500/20 focus:border-red-500"
                  )}
                />
              </div>
              {errors.short_code && <p className="text-xs font-medium text-red-500 ml-1">{errors.short_code.message as string}</p>}
            </div>

            {/* Website URL */}
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700 ml-1">Website URL</label>
              <div className="relative group">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500 transition-colors">
                  <Globe className="h-4 w-4" />
                </div>
                <input
                  {...register("website")}
                  type="url"
                  placeholder="https://www.umpsa.edu.my"
                  className={cn(
                    "w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all",
                    errors.website && "border-red-500 focus:ring-red-500/20 focus:border-red-500"
                  )}
                />
              </div>
              {errors.website && <p className="text-xs font-medium text-red-500 ml-1">{errors.website.message as string}</p>}
            </div>

            {/* Logo URL */}
            <div className="space-y-2 md:col-span-2">
              <label className="text-sm font-bold text-gray-700 ml-1">Logo URL</label>
              <div className="relative group">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500 transition-colors">
                  <ImageIcon className="h-4 w-4" />
                </div>
                <input
                  {...register("logo_url")}
                  type="url"
                  placeholder="https://example.com/logo.png"
                  className={cn(
                    "w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all",
                    errors.logo_url && "border-red-500 focus:ring-red-500/20 focus:border-red-500"
                  )}
                />
              </div>
              {errors.logo_url && <p className="text-xs font-medium text-red-500 ml-1">{errors.logo_url.message as string}</p>}
            </div>
          </div>

          {error && (
            <div className="p-4 bg-red-50 border border-red-100 rounded-xl flex items-center gap-3 text-red-700 text-sm font-medium">
              <X className="h-4 w-4" />
              {error}
            </div>
          )}

          {/* Actions */}
          <div className="flex flex-col sm:flex-row items-center justify-end gap-3 pt-4 border-t border-gray-100">
            <Link
              href="/dashboard/universities"
              className="w-full sm:w-auto text-center px-6 py-2.5 rounded-xl text-sm font-bold text-gray-500 hover:bg-gray-100 transition-all"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={isSubmitting || internalIsSubmitting}
              className="w-full sm:w-auto flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 md:py-2.5 rounded-xl text-sm font-bold transition-all shadow-lg shadow-blue-500/20 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting || internalIsSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : (
                submitLabel
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UniversityForm;
