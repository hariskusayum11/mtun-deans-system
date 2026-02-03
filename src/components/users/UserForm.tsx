"use client";

import React from 'react';
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { CreateUserSchema } from "@/lib/validators";
import { Role, University } from "@prisma/client";
import { 
  User, 
  Mail, 
  Shield, 
  Building, 
  Loader2,
  X
} from 'lucide-react';
import { cn } from "@/lib/utils";
import Link from "next/link";

type UserFormInputs = z.infer<typeof CreateUserSchema>;

interface UserFormProps {
  universities: University[];
  onSubmit: (data: any) => Promise<void>;
  isSubmitting: boolean;
  error?: string | null;
  defaultValues?: any;
  title?: string;
  description?: string;
  submitLabel?: string;
}

const UserForm = ({ 
  universities, 
  onSubmit, 
  isSubmitting, 
  error, 
  defaultValues,
  title = "Add New User",
  description = "Create a new system user and assign their role and university.",
  submitLabel = "Create User"
}: UserFormProps) => {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting: internalIsSubmitting },
  } = useForm<any>({
    resolver: zodResolver(CreateUserSchema),
    defaultValues: defaultValues || {
      role: Role.data_entry,
      university_id: "",
    },
  });

  const selectedRole = watch("role");

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
            {/* Name */}
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700 ml-1">Full Name</label>
              <div className="relative group">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500 transition-colors">
                  <User className="h-4 w-4" />
                </div>
                <input
                  {...register("name")}
                  placeholder="John Doe"
                  className={cn(
                    "w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all",
                    errors.name && "border-red-500 focus:ring-red-500/20 focus:border-red-500"
                  )}
                />
              </div>
              {errors.name && <p className="text-xs font-medium text-red-500 ml-1">{errors.name.message as string}</p>}
            </div>

            {/* Email */}
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700 ml-1">Email Address</label>
              <div className="relative group">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500 transition-colors">
                  <Mail className="h-4 w-4" />
                </div>
                <input
                  {...register("email")}
                  type="email"
                  placeholder="john@example.com"
                  className={cn(
                    "w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all",
                    errors.email && "border-red-500 focus:ring-red-500/20 focus:border-red-500"
                  )}
                />
              </div>
              {errors.email && <p className="text-xs font-medium text-red-500 ml-1">{errors.email.message as string}</p>}
            </div>

            {/* Role */}
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700 ml-1">System Role</label>
              <div className="relative group">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500 transition-colors">
                  <Shield className="h-4 w-4" />
                </div>
                <select
                  {...register("role")}
                  className={cn(
                    "w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all appearance-none",
                    errors.role && "border-red-500 focus:ring-red-500/20 focus:border-red-500"
                  )}
                >
                  {Object.values(Role).map((role) => (
                    <option key={role} value={role}>
                      {role.replace("_", " ").toUpperCase()}
                    </option>
                  ))}
                </select>
              </div>
              {errors.role && <p className="text-xs font-medium text-red-500 ml-1">{errors.role.message as string}</p>}
            </div>

            {/* University */}
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700 ml-1">University</label>
              <div className="relative group">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500 transition-colors">
                  <Building className="h-4 w-4" />
                </div>
                <select
                  {...register("university_id")}
                  disabled={selectedRole === Role.super_admin}
                  className={cn(
                    "w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all appearance-none disabled:bg-gray-50 disabled:text-gray-400 disabled:cursor-not-allowed",
                    errors.university_id && "border-red-500 focus:ring-red-500/20 focus:border-red-500"
                  )}
                >
                  <option value="">Select University</option>
                  {universities.map((uni) => (
                    <option key={uni.id} value={uni.id}>
                      {uni.name}
                    </option>
                  ))}
                </select>
              </div>
              {errors.university_id && <p className="text-xs font-medium text-red-500 ml-1">{errors.university_id.message as string}</p>}
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
              href="/dashboard/users"
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

export default UserForm;
