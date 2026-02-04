"use client";

import React, { useState, useEffect } from "react";
import { createIndustryActivity, updateIndustryActivity } from "@/actions/data-actions"; // Assuming these actions will be updated or new ones created
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Plus, FileText, Calendar, User, Info, Pencil, Tag } from "lucide-react"; // Added Tag icon
import SubmitButton from "@/components/form/SubmitButton";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Define the Zod schema for activity validation
const ActivitySchema = z.object({
  company_id: z.string().min(1, { message: "Company is required." }),
  university_id: z.string().min(1, { message: "University is required." }),
  project_name: z.string().min(1, { message: "Project name is required." }),
  date: z.string().min(1, { message: "Date is required." }),
  type: z.string().min(1, { message: "Type is required." }), // Added type validation
  status: z.string().min(1, { message: "Status is required." }),
  action: z.string().optional(),
  pic_company: z.string().min(1, { message: "PIC Company is required." }),
  pic_university: z.string().min(1, { message: "PIC University is required." }),
});

interface ActivityFormModalProps {
  companyId?: string; // Made optional
  universityId: string;
  initialData?: {
    id: string;
    project_name: string;
    date: Date;
    type: string; // Added type to initialData
    status: string;
    action: string | null;
    pic_company: string;
    pic_university: string;
    company_id: string; // Added company_id to initialData
  };
  companiesList?: { id: string; name: string }[]; // New optional prop
  trigger?: React.ReactNode;
}

export default function ActivityFormModal({
  companyId,
  universityId,
  initialData,
  companiesList,
  trigger,
}: ActivityFormModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();

  const isEdit = !!initialData;

  const form = useForm<z.infer<typeof ActivitySchema>>({
    resolver: zodResolver(ActivitySchema),
    defaultValues: {
      company_id: initialData?.company_id || companyId || "",
      university_id: universityId,
      project_name: initialData?.project_name || "",
      date: initialData?.date ? new Date(initialData.date).toISOString().split('T')[0] : "",
      type: initialData?.type || "", // Default for new type field
      status: initialData?.status || "",
      action: initialData?.action || "",
      pic_company: initialData?.pic_company || "",
      pic_university: initialData?.pic_university || "",
    },
  });

  const onSubmit = async (values: z.infer<typeof ActivitySchema>) => {
    try {
      const formData = new FormData();
      Object.entries(values).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          formData.append(key, value);
        }
      });

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
        <div className="bg-white flex flex-col h-full">
          {/* Header */}
          <div className="px-8 py-6 border-b border-gray-100 bg-gray-50/30">
            <h1 className="text-xl font-bold text-gray-900">
              {isEdit ? "Edit Activity" : "Add New Activity"}
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              {isEdit ? "Update the details of this collaboration activity." : "Record a new collaboration activity."}
            </p>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col h-full">
              <div className="p-8 space-y-8 flex-grow overflow-y-auto max-h-[calc(100vh-200px)]"> {/* Added max-h and overflow-y-auto */}
                <input type="hidden" name="university_id" value={universityId} />

                {/* Conditional Company Select */}
                {!companyId && companiesList && (
                  <FormField
                    control={form.control}
                    name="company_id"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-bold text-gray-700 ml-1">
                          Select Company *
                        </FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger className="rounded-xl border-gray-200 focus:ring-blue-500/20 focus:border-blue-500 h-11">
                              <SelectValue placeholder="Select a company" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {companiesList.map((company) => (
                              <SelectItem key={company.id} value={company.id}>
                                {company.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}
                {companyId && (
                  <input type="hidden" name="company_id" value={companyId} />
                )}

                {/* Section 1: Basic Info */}
                <div className="space-y-6">
                  <div className="flex items-center gap-2 text-blue-600">
                    <Info className="h-5 w-5" />
                    <h2 className="text-sm font-black uppercase tracking-widest">
                      Activity Details
                    </h2>
                  </div>

                  <FormField
                    control={form.control}
                    name="project_name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-bold text-gray-700 ml-1">
                          Project Name *
                        </FormLabel>
                        <FormControl>
                          <div className="relative group">
                            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500 transition-colors">
                              <FileText className="h-4 w-4" />
                            </div>
                            <Input
                              placeholder="e.g. Joint Research Phase 1"
                              className="pl-10 rounded-xl border-gray-200 focus:ring-blue-500/20 focus:border-blue-500 h-11"
                              {...field}
                            />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="date"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm font-bold text-gray-700 ml-1">
                            Date *
                          </FormLabel>
                          <FormControl>
                            <div className="relative group">
                              <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500 transition-colors">
                                <Calendar className="h-4 w-4" />
                              </div>
                              <Input
                                type="date"
                                className="pl-10 rounded-xl border-gray-200 focus:ring-blue-500/20 focus:border-blue-500 h-11"
                                {...field}
                              />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="type"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm font-bold text-gray-700 ml-1">
                            Type *
                          </FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger className="rounded-xl border-gray-200 focus:ring-blue-500/20 focus:border-blue-500 h-11">
                                <SelectValue placeholder="Select activity type" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="MOU">MOU</SelectItem>
                              <SelectItem value="MOA">MOA</SelectItem>
                              <SelectItem value="Activity">Activity</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="status"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-bold text-gray-700 ml-1">
                          Status *
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="e.g. Ongoing"
                            className="rounded-xl border-gray-200 focus:ring-blue-500/20 focus:border-blue-500 h-11"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="action"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-bold text-gray-700 ml-1">
                          Action / Details
                        </FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Describe the activity..."
                            rows={3}
                            className="rounded-2xl border-gray-200 focus:ring-blue-500/20 focus:border-blue-500 min-h-[100px]"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
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
                    <FormField
                      control={form.control}
                      name="pic_company"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm font-bold text-gray-700 ml-1">
                            PIC Company *
                          </FormLabel>
                          <FormControl>
                            <div className="relative group">
                              <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500 transition-colors">
                                <User className="h-4 w-4" />
                              </div>
                              <Input
                                placeholder="Name from company"
                                className="pl-10 rounded-xl border-gray-200 focus:ring-blue-500/20 focus:border-blue-500 h-11"
                                {...field}
                              />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="pic_university"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm font-bold text-gray-700 ml-1">
                            PIC University *
                          </FormLabel>
                          <FormControl>
                            <div className="relative group">
                              <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500 transition-colors">
                                <User className="h-4 w-4" />
                              </div>
                              <Input
                                placeholder="Name from university"
                                className="pl-10 rounded-xl border-gray-200 focus:ring-blue-500/20 focus:border-blue-500 h-11"
                                {...field}
                              />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-end gap-4 pt-8 border-t border-gray-100 bg-gray-50/30"> {/* Moved actions outside scrollable area */}
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
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
