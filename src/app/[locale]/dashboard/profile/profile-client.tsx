"use client";

import { useState, useTransition } from "react";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ProfileSchema } from "@/lib/validators";
import { updateProfile } from "@/actions/update-profile";
import { User, University, Role } from "@prisma/client";
import { 
  User as UserIcon, 
  Mail, 
  Phone, 
  Shield, 
  School, 
  CheckCircle2, 
  AlertCircle,
  Save,
  Loader2
} from "lucide-react";
import { cn } from "@/lib/utils";
import toast from "react-hot-toast";

interface ProfileClientProps {
  user: User & {
    university: University | null;
  };
}

export default function ProfileClient({ user }: ProfileClientProps) {
  const [isPending, startTransition] = useTransition();
  
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(ProfileSchema),
    defaultValues: {
      name: user.name || "",
      // @ts-ignore
      phoneNumber: user.phoneNumber || "",
    },
  });

  const onSubmit = (values: any) => {
    startTransition(async () => {
      const result = await updateProfile(values);
      if (result.error) {
        toast.error(result.error);
      } else {
        toast.success(result.success || "Profile updated!");
      }
    });
  };

  // @ts-ignore
  const avatarUrl = user.image || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name || "User")}&background=0D47A1&color=fff&size=128`;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
      {/* Left Column: Profile Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="lg:col-span-1"
      >
        <div className="bg-white rounded-2xl md:rounded-3xl shadow-xl shadow-blue-900/5 overflow-hidden border border-gray-100 relative">
          {/* Card Header Gradient */}
          <div className="h-32 bg-gradient-to-br from-blue-900 to-indigo-800" />
          
          <div className="px-6 pb-8 -mt-16 flex flex-col items-center text-center">
            {/* Avatar */}
            <div className="relative">
              <div className="w-32 h-32 rounded-3xl border-4 border-white shadow-lg overflow-hidden bg-white">
                <img 
                  src={avatarUrl} 
                  alt={user.name || "User"} 
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute -bottom-2 -right-2 bg-green-500 w-6 h-6 rounded-full border-4 border-white" title="Online" />
            </div>

            <div className="mt-4">
              <h2 className="text-2xl font-bold text-gray-900">{user.name || "No Name"}</h2>
              <p className="text-blue-600 font-medium uppercase tracking-wider text-xs mt-1">
                {user.role.replace("_", " ")}
              </p>
            </div>

            <div className="w-full mt-8 space-y-4 text-left">
              <div className="flex items-center gap-3 p-3 rounded-2xl bg-gray-50 border border-gray-100">
                <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center text-blue-600">
                  <Mail className="w-5 h-5" />
                </div>
                <div className="overflow-hidden">
                  <p className="text-xs text-gray-500 font-medium uppercase">Email Address</p>
                  <p className="text-sm font-semibold text-gray-900 truncate">{user.email}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 rounded-2xl bg-gray-50 border border-gray-100">
                <div className="w-10 h-10 rounded-xl bg-indigo-100 flex items-center justify-center text-indigo-600">
                  <School className="w-5 h-5" />
                </div>
                <div className="overflow-hidden">
                  <p className="text-xs text-gray-500 font-medium uppercase">University</p>
                  <p className="text-sm font-semibold text-gray-900 truncate">
                    {user.university?.name || "MTUN Central"}
                  </p>
                </div>
              </div>
            </div>

            {/* Decorative Badge Footer */}
            <div className="mt-8 pt-6 border-t border-gray-100 w-full flex justify-center gap-4">
              <div className="flex flex-col items-center">
                <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Status</span>
                <span className="text-sm font-bold text-green-600">Verified</span>
              </div>
              <div className="w-px h-8 bg-gray-100" />
              <div className="flex flex-col items-center">
                <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">ID</span>
                <span className="text-sm font-bold text-gray-900">#{user.id.slice(0, 8)}</span>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Right Column: Edit Form */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="lg:col-span-2"
      >
        <div className="bg-white rounded-2xl md:rounded-3xl shadow-xl shadow-blue-900/5 border border-gray-100 overflow-hidden">
          <div className="p-6 md:p-8 border-b border-gray-50 bg-gray-50/50">
            <h3 className="text-lg md:text-xl font-bold text-gray-900">Edit Profile</h3>
            <p className="text-xs md:text-sm text-gray-500">Update your personal details and contact information.</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="p-6 md:p-8 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Full Name */}
              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-gray-700 ml-1">Full Name</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <UserIcon className="h-5 w-5 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
                  </div>
                  <input
                    {...register("name")}
                    className={cn(
                      "block w-full rounded-xl border-gray-200 pl-10 pr-4 py-3 text-gray-900 placeholder-gray-400 transition-all duration-200",
                      "focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none",
                      errors.name && "border-red-500 focus:border-red-500 focus:ring-red-500/20"
                    )}
                    placeholder="Enter your full name"
                  />
                </div>
                {errors.name && <p className="text-xs text-red-500 ml-1">{errors.name.message as string}</p>}
              </div>

              {/* Phone Number */}
              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-gray-700 ml-1">Phone Number</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Phone className="h-5 w-5 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
                  </div>
                  <input
                    {...register("phoneNumber")}
                    className={cn(
                      "block w-full rounded-xl border-gray-200 pl-10 pr-4 py-3 text-gray-900 placeholder-gray-400 transition-all duration-200",
                      "focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none",
                      errors.phoneNumber && "border-red-500 focus:border-red-500 focus:ring-red-500/20"
                    )}
                    placeholder="+66 81 234 5678"
                  />
                </div>
                {errors.phoneNumber && <p className="text-xs text-red-500 ml-1">{errors.phoneNumber.message as string}</p>}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Email (Read-only) */}
              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-gray-400 ml-1">Email Address (Read-only)</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-gray-300" />
                  </div>
                  <input
                    value={user.email}
                    disabled
                    className="block w-full rounded-xl border-gray-100 bg-gray-50 pl-10 pr-4 py-3 text-gray-400 cursor-not-allowed"
                  />
                </div>
              </div>

              {/* Role (Read-only) */}
              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-gray-400 ml-1">Account Role (Read-only)</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Shield className="h-5 w-5 text-gray-300" />
                  </div>
                  <input
                    value={user.role.replace("_", " ")}
                    disabled
                    className="block w-full rounded-xl border-gray-100 bg-gray-50 pl-10 pr-4 py-3 text-gray-400 cursor-not-allowed capitalize"
                  />
                </div>
              </div>
            </div>

            {/* University (Read-only) */}
            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-gray-400 ml-1">Affiliated University (Read-only)</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <School className="h-5 w-5 text-gray-300" />
                </div>
                <input
                  value={user.university?.name || "MTUN Central"}
                  disabled
                  className="block w-full rounded-xl border-gray-100 bg-gray-50 pl-10 pr-4 py-3 text-gray-400 cursor-not-allowed"
                />
              </div>
            </div>

            <div className="pt-6 flex justify-end">
              <button
                type="submit"
                disabled={isPending}
                className="w-full md:w-auto flex items-center justify-center gap-2 px-8 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold rounded-xl shadow-lg shadow-blue-500/25 hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 disabled:opacity-50"
              >
                {isPending ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <Save className="w-5 h-5" />
                )}
                Save Changes
              </button>
            </div>
          </form>
        </div>
      </motion.div>
    </div>
  );
}
