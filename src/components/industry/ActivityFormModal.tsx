"use client";

import React, { useState, useEffect } from "react";
import { createIndustryActivity, updateIndustryActivity } from "@/actions/data-actions";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Plus, FileText, Calendar, User, Info, Pencil } from "lucide-react";
import SubmitButton from "@/components/form/SubmitButton";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

interface ActivityFormModalProps {
  companyId: string;
  universityId: string;
  initialData?: {
    id: string;
    project_name: string;
    date: Date;
    status: string;
    action: string | null;
    pic_company: string;
    pic_university: string;
  };
  trigger?: React.ReactNode;
}

export default function ActivityFormModal({
  companyId,
  universityId,
  initialData,
  trigger,
}: ActivityFormModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();

  const isEdit = !!initialData;

  const handleSubmit = async (formData: FormData) => {
    try {
      if (isEdit) {
        await updateIndustryActivity(initialData.id, formData);
        toast.success("Activity updated successfully!");
      } else {
        await createIndustryActivity(formData);
        toast.success("Activity added successfully!");
      }
      setIsOpen(false);
      router.refresh();
    } catch (error: any) {
      toast.error(error.message || "Failed to save activity");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-6 rounded-2xl text-sm font-bold transition-all shadow-lg shadow-blue-500/20 active:scale-95 gap-2">
            <Plus className="h-5 w-5" />
            Add New Activity
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] rounded-[2rem] p-0 overflow-hidden border-none [&>button]:hidden">
        <div className="bg-white overflow-hidden">
          {/* Header */}
          <div className="px-8 py-6 border-b border-gray-100 bg-gray-50/30">
            <h1 className="text-xl font-bold text-gray-900">
              {isEdit ? "Edit Activity" : "Add New Activity"}
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              {isEdit ? "Update the details of this collaboration activity." : "Record a new collaboration activity with this partner."}
            </p>
          </div>

          <form action={handleSubmit} className="p-8 space-y-8">
            <input type="hidden" name="company_id" value={companyId} />
            <input type="hidden" name="university_id" value={universityId} />

            {/* Section 1: Basic Info */}
            <div className="space-y-6">
              <div className="flex items-center gap-2 text-blue-600">
                <Info className="h-5 w-5" />
                <h2 className="text-sm font-black uppercase tracking-widest">
                  Activity Details
                </h2>
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="project_name"
                  className="text-sm font-bold text-gray-700 ml-1"
                >
                  Project Name *
                </Label>
                <div className="relative group">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500 transition-colors">
                    <FileText className="h-4 w-4" />
                  </div>
                  <Input
                    id="project_name"
                    name="project_name"
                    required
                    placeholder="e.g. Joint Research Phase 1"
                    defaultValue={initialData?.project_name}
                    className="pl-10 rounded-xl border-gray-200 focus:ring-blue-500/20 focus:border-blue-500 h-11"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label
                    htmlFor="date"
                    className="text-sm font-bold text-gray-700 ml-1"
                  >
                    Date *
                  </Label>
                  <div className="relative group">
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500 transition-colors">
                      <Calendar className="h-4 w-4" />
                    </div>
                    <Input
                      id="date"
                      name="date"
                      type="date"
                      required
                      defaultValue={initialData?.date ? new Date(initialData.date).toISOString().split('T')[0] : ""}
                      className="pl-10 rounded-xl border-gray-200 focus:ring-blue-500/20 focus:border-blue-500 h-11"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label
                    htmlFor="status"
                    className="text-sm font-bold text-gray-700 ml-1"
                  >
                    Status *
                  </Label>
                  <Input
                    id="status"
                    name="status"
                    required
                    placeholder="e.g. Ongoing"
                    defaultValue={initialData?.status}
                    className="rounded-xl border-gray-200 focus:ring-blue-500/20 focus:border-blue-500 h-11"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="action"
                  className="text-sm font-bold text-gray-700 ml-1"
                >
                  Action / Details
                </Label>
                <Textarea
                  id="action"
                  name="action"
                  placeholder="Describe the activity..."
                  rows={3}
                  defaultValue={initialData?.action || ""}
                  className="rounded-2xl border-gray-200 focus:ring-blue-500/20 focus:border-blue-500 min-h-[100px]"
                />
              </div>
            </div>

            {/* Section 2: PIC Info */}
            <div className="space-y-6">
              <div className="flex items-center gap-2 text-blue-600">
                <User className="h-5 w-5" />
                <h2 className="text-sm font-black uppercase tracking-widest">
                  Personnel In Charge
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label
                    htmlFor="pic_company"
                    className="text-sm font-bold text-gray-700 ml-1"
                  >
                    PIC Company *
                  </Label>
                  <div className="relative group">
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500 transition-colors">
                      <User className="h-4 w-4" />
                    </div>
                    <Input
                      id="pic_company"
                      name="pic_company"
                      required
                      placeholder="Name from company"
                      defaultValue={initialData?.pic_company}
                      className="pl-10 rounded-xl border-gray-200 focus:ring-blue-500/20 focus:border-blue-500 h-11"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label
                    htmlFor="pic_university"
                    className="text-sm font-bold text-gray-700 ml-1"
                  >
                    PIC University *
                  </Label>
                  <div className="relative group">
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500 transition-colors">
                      <User className="h-4 w-4" />
                    </div>
                    <Input
                      id="pic_university"
                      name="pic_university"
                      required
                      placeholder="Name from university"
                      defaultValue={initialData?.pic_university}
                      className="pl-10 rounded-xl border-gray-200 focus:ring-blue-500/20 focus:border-blue-500 h-11"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end gap-4 pt-8 border-t border-gray-100">
              <Button
                type="button"
                variant="ghost"
                onClick={() => setIsOpen(false)}
                className="px-8 py-3 rounded-xl text-sm font-bold text-gray-500 hover:bg-gray-100 transition-all"
              >
                Cancel
              </Button>
              <SubmitButton
                label={isEdit ? "Save Changes" : "Add Activity"}
                className="bg-blue-600 hover:bg-blue-700 text-white px-10 py-3 rounded-xl text-sm font-bold transition-all shadow-lg shadow-blue-500/20 active:scale-95"
              />
            </div>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
