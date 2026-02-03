"use client";

import React from "react";
import { createStaff, updateStaff } from "@/actions/data-actions";
import { Role, University } from "@prisma/client";
import {
  Card,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  UserPlus,
  GraduationCap,
  Info,
  Image as ImageIcon,
  Mail,
  Phone,
  Briefcase,
  Building,
  X,
  Save,
  Loader2
} from "lucide-react";
import Link from "next/link";
import SubmitButton from "@/components/form/SubmitButton";
import { cn } from "@/lib/utils";

interface StaffFormProps {
  staff?: any;
  universities: University[];
  userRole: Role;
  userUniversityId?: string | null;
}

const StaffForm = ({
  staff,
  universities,
  userRole,
  userUniversityId,
}: StaffFormProps) => {
  const isEdit = !!staff;
  const action = isEdit ? updateStaff.bind(null, staff.id) : createStaff;

  return (
    <div className="w-full max-w-4xl mx-auto p-4 md:p-0">
      <Card className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        {/* Header */}
        <div className="px-6 md:px-8 py-4 md:py-6 border-b border-gray-100 bg-gray-50/30">
          <h1 className="text-lg md:text-xl font-bold text-gray-900">
            {isEdit ? "Edit Staff Profile" : "Add New Staff"}
          </h1>
          <p className="text-xs md:text-sm text-gray-500 mt-1">
            {isEdit
              ? "Update the information for this staff member."
              : "Register a new staff member to the system."}
          </p>
        </div>

        <form action={action} className="p-6 md:p-8 space-y-8 md:space-y-10">
          {/* Section 1: Personal Info */}
          <div className="space-y-6">
            <div className="flex items-center gap-2 text-blue-600">
              <Info className="h-5 w-5" />
              <h2 className="text-sm font-black uppercase tracking-widest">
                Personal Information
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2 space-y-2">
                <Label htmlFor="name" className="text-sm font-bold text-gray-700 ml-1">
                  Staff Name *
                </Label>
                <div className="relative group">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500 transition-colors">
                    <UserPlus className="h-4 w-4" />
                  </div>
                  <Input
                    id="name"
                    name="name"
                    placeholder="e.g. Dr. John Doe"
                    required
                    defaultValue={staff?.name}
                    className="pl-10 rounded-xl border-gray-200 focus:ring-blue-500/20 focus:border-blue-500 h-11"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-bold text-gray-700 ml-1">
                  Email Address
                </Label>
                <div className="relative group">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500 transition-colors">
                    <Mail className="h-4 w-4" />
                  </div>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="john.doe@university.edu"
                    defaultValue={staff?.email || ""}
                    className="pl-10 rounded-xl border-gray-200 focus:ring-blue-500/20 focus:border-blue-500 h-11"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone" className="text-sm font-bold text-gray-700 ml-1">
                  Phone Number
                </Label>
                <div className="relative group">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500 transition-colors">
                    <Phone className="h-4 w-4" />
                  </div>
                  <Input
                    id="phone"
                    name="phone"
                    type="tel"
                    placeholder="+66 81 234 5678"
                    defaultValue={staff?.phone || ""}
                    className="pl-10 rounded-xl border-gray-200 focus:ring-blue-500/20 focus:border-blue-500 h-11"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Section 2: Academic Info */}
          <div className="space-y-6">
            <div className="flex items-center gap-2 text-blue-600">
              <GraduationCap className="h-5 w-5" />
              <h2 className="text-sm font-black uppercase tracking-widest">
                Academic Information
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="faculty" className="text-sm font-bold text-gray-700 ml-1">
                  Faculty / COE
                </Label>
                <div className="relative group">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500 transition-colors">
                    <Building className="h-4 w-4" />
                  </div>
                  <Input
                    id="faculty"
                    name="faculty"
                    placeholder="e.g. Engineering"
                    defaultValue={staff?.faculty || ""}
                    className="pl-10 rounded-xl border-gray-200 focus:ring-blue-500/20 focus:border-blue-500 h-11"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="department" className="text-sm font-bold text-gray-700 ml-1">
                  Department *
                </Label>
                <div className="relative group">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500 transition-colors">
                    <Briefcase className="h-4 w-4" />
                  </div>
                  <Input
                    id="department"
                    name="department"
                    placeholder="e.g. Computer Science"
                    required
                    defaultValue={staff?.department}
                    className="pl-10 rounded-xl border-gray-200 focus:ring-blue-500/20 focus:border-blue-500 h-11"
                  />
                </div>
              </div>

              <div className="md:col-span-2 space-y-2">
                <Label htmlFor="position" className="text-sm font-bold text-gray-700 ml-1">
                  Position *
                </Label>
                <Input
                  id="position"
                  name="position"
                  placeholder="e.g. Assistant Professor"
                  required
                  defaultValue={staff?.position}
                  className="rounded-xl border-gray-200 focus:ring-blue-500/20 focus:border-blue-500 h-11"
                />
              </div>
            </div>
          </div>

          {/* Section 3: Additional Details */}
          <div className="space-y-6">
            <div className="flex items-center gap-2 text-blue-600">
              <ImageIcon className="h-5 w-5" />
              <h2 className="text-sm font-black uppercase tracking-widest">
                Additional Details
              </h2>
            </div>

            <div className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="expertise" className="text-sm font-bold text-gray-700 ml-1">
                  Expertise
                </Label>
                <Textarea
                  id="expertise"
                  name="expertise"
                  placeholder="Describe areas of expertise..."
                  rows={4}
                  defaultValue={staff?.expertise || ""}
                  className="rounded-2xl border-gray-200 focus:ring-blue-500/20 focus:border-blue-500 min-h-[100px]"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="image_url" className="text-sm font-bold text-gray-700 ml-1">
                  Profile Image URL
                </Label>
                <Input
                  id="image_url"
                  name="image_url"
                  type="url"
                  placeholder="https://example.com/photo.jpg"
                  defaultValue={staff?.image_url || ""}
                  className="rounded-xl border-gray-200 focus:ring-blue-500/20 focus:border-blue-500 h-11"
                />
              </div>

              {userRole === Role.super_admin && (
                <div className="space-y-2 pt-4 border-t border-gray-100">
                  <Label htmlFor="university_id" className="text-sm font-bold text-gray-700 ml-1">
                    Assign University *
                  </Label>
                  <select
                    id="university_id"
                    name="university_id"
                    required
                    defaultValue={staff?.university_id || ""}
                    className="flex h-11 w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
                  >
                    <option value="">Select a university</option>
                    {universities.map((uni) => (
                      <option key={uni.id} value={uni.id}>
                        {uni.name}
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row items-center justify-end gap-3 md:gap-4 pt-6 md:pt-8 border-t border-gray-100">
            <Link
              href="/dashboard/staff"
              className="w-full sm:w-auto text-center px-8 py-3 rounded-xl text-sm font-bold text-gray-500 hover:bg-gray-100 transition-all"
            >
              Cancel
            </Link>
            <SubmitButton
              label={isEdit ? "Update Staff Profile" : "Create Staff Member"}
              className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white px-10 py-3 rounded-xl text-sm font-bold transition-all shadow-lg shadow-blue-500/20 active:scale-95"
            />
          </div>
        </form>
      </Card>
    </div>
  );
};

export default StaffForm;
