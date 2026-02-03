"use client";

import React, { useState, useEffect } from "react";
import CreatableSelect from "react-select/creatable";
import {
  createResearchProject,
  updateResearchProject,
} from "@/actions/research";
import {
  getExternalPartners,
  getStaff,
} from "@/actions/data-actions";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
} from "@/components/ui/card";
import {
  FlaskConical,
  Users,
  Info,
  Save,
  Loader2,
  X,
  User as UserIcon,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import toast from "react-hot-toast";
import { useTranslations } from "next-intl";
import Link from "next/link";
import SubmitButton from "@/components/form/SubmitButton";

interface Partner {
  id: string;
  name: string;
}

interface Staff {
  id: string;
  name: string;
  image_url: string | null;
}

interface ProjectFormProps {
  staffList?: Staff[];
  partnersList?: Partner[];
  project?: {
    id: string;
    title: string;
    status: string | null;
    description: string | null;
    staff_id: string;
    collaborators: Partner[];
  };
  onSuccess?: () => void;
  setOpen?: (open: boolean) => void;
}

const ProjectForm = ({ staffList: initialStaffList = [], partnersList: initialPartnersList = [], project, onSuccess, setOpen }: ProjectFormProps) => {
  const t = useTranslations("Research.form");
  const [partners, setPartners] = useState<{ label: string; value: string }[]>(
    initialPartnersList.map((p) => ({ label: p.name, value: p.name }))
  );
  const [staffList, setStaffList] = useState<Staff[]>(initialStaffList);
  const [selectedPartners, setSelectedPartners] = useState<{ label: string; value: string }[]>(
    project?.collaborators.map((p) => ({ label: p.name, value: p.name })) || []
  );
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const isEdit = !!project;

  // Only fetch if lists are empty to prevent infinite loops
  useEffect(() => {
    const fetchData = async () => {
      if (partners.length === 0) {
        const data = await getExternalPartners();
        setPartners(data.map((p: any) => ({ label: p.name, value: p.name })));
      }
      
      if (staffList.length === 0) {
        const staffData = await getStaff();
        setStaffList(staffData.map((s: any) => ({ id: s.id, name: s.name, image_url: s.image_url })));
      }
    };
    fetchData();
  }, []); // Empty dependency array is key to stopping the loop

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (isLoading) return;

    setIsLoading(true);
    const formData = new FormData(event.currentTarget);
    formData.append(
      "collaborators",
      JSON.stringify(selectedPartners.map((p) => p.value))
    );

    try {
      const result = project 
        ? await updateResearchProject(project.id, formData)
        : await createResearchProject(formData);

      if (result?.error) {
        toast.error(result.error);
      } else {
        toast.success(project ? t("toastSuccessEdit") : t("toastSuccessAdd"));
        if (setOpen) {
          setOpen(false);
        } else if (onSuccess) {
          onSuccess();
        }
        router.refresh();
      }
    } catch (error: any) {
      toast.error(t("toastError"));
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    if (setOpen) {
      setOpen(false);
    } else if (onSuccess) {
      onSuccess();
    } else {
      router.push("/dashboard/research");
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      <Card className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        {/* Header */}
        <div className="px-8 py-6 border-b border-gray-100 bg-gray-50/30">
          <h1 className="text-xl font-bold text-gray-900">
            {isEdit ? t("titleEdit") : t("titleAdd")}
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            {isEdit ? t("descriptionEdit") : t("descriptionAdd")}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-10">
          {/* Section 1: Project Details */}
          <div className="space-y-6">
            <div className="flex items-center gap-2 text-blue-600">
              <Info className="h-5 w-5" />
              <h2 className="text-sm font-black uppercase tracking-widest">
                {t("sections.details")}
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2 space-y-2">
                <Label htmlFor="title" className="text-sm font-bold text-gray-700 ml-1">
                  {t("fields.title")}
                </Label>
                <Input
                  id="title"
                  name="title"
                  placeholder={t("fields.titlePlaceholder")}
                  required
                  defaultValue={project?.title}
                  className="rounded-xl border-gray-200 focus:ring-blue-500/20 focus:border-blue-500 h-11"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="staff_id" className="text-sm font-bold text-gray-700 ml-1 flex items-center gap-2">
                  <UserIcon className="h-4 w-4 text-slate-400" />
                  {t("fields.headResearcher")}
                </Label>
                <Select name="staff_id" required defaultValue={project?.staff_id}>
                  <SelectTrigger className="rounded-xl border-gray-200 focus:ring-blue-500/20 focus:border-blue-500 h-11">
                    <SelectValue placeholder={t("fields.selectResearcher")} />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl border-gray-200">
                    {staffList.length > 0 ? (
                      staffList.map((staff) => (
                        <SelectItem key={staff.id} value={staff.id}>
                          <div className="flex items-center gap-2">
                            <Avatar className="h-6 w-6">
                              <AvatarImage src={staff.image_url || ""} />
                              <AvatarFallback className="text-[10px]">{staff.name.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <span className="text-sm">{staff.name}</span>
                          </div>
                        </SelectItem>
                      ))
                    ) : (
                      <SelectItem value="none" disabled>{t("fields.noStaff")}</SelectItem>
                    )}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="status" className="text-sm font-bold text-gray-700 ml-1">
                  {t("fields.status")}
                </Label>
                <select
                  id="status"
                  name="status"
                  defaultValue={project?.status || "Ongoing"}
                  className="flex h-11 w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
                >
                  <option value="Ongoing">{t("fields.statusOngoing")}</option>
                  <option value="Completed">{t("fields.statusCompleted")}</option>
                  <option value="Pending">{t("fields.statusPending")}</option>
                </select>
              </div>

              <div className="md:col-span-2 space-y-2">
                <Label className="text-sm font-bold text-gray-700 ml-1 flex items-center gap-2">
                  <Users className="h-4 w-4 text-slate-400" />
                  {t("fields.partners")}
                </Label>
                <CreatableSelect
                  isMulti
                  options={partners}
                  value={selectedPartners}
                  onChange={(newValue) => setSelectedPartners(newValue as any)}
                  placeholder={t("fields.partnersPlaceholder")}
                  className="text-sm"
                  styles={{
                    control: (base, state) => ({
                      ...base,
                      borderRadius: "0.75rem",
                      minHeight: "44px",
                      borderColor: state.isFocused ? "rgb(59 130 246)" : "rgb(226 232 240)",
                      boxShadow: state.isFocused ? "0 0 0 1px rgb(59 130 246)" : "none",
                      "&:hover": {
                        borderColor: "rgb(203 213 225)"
                      }
                    }),
                    menu: (base) => ({
                      ...base,
                      borderRadius: "0.75rem",
                      overflow: "hidden",
                      boxShadow: "0 10px 15px -3px rgb(0 0 0 / 0.1)"
                    }),
                    multiValue: (base) => ({
                      ...base,
                      backgroundColor: "rgb(239 246 255)",
                      borderRadius: "0.5rem",
                    }),
                    multiValueLabel: (base) => ({
                      ...base,
                      color: "rgb(29 78 216)",
                      fontWeight: "700",
                      fontSize: "11px",
                      padding: "2px 6px"
                    })
                  }}
                />
              </div>
            </div>
          </div>

          {/* Section 2: Description */}
          <div className="space-y-6">
            <div className="flex items-center gap-2 text-blue-600">
              <Info className="h-5 w-5" />
              <h2 className="text-sm font-black uppercase tracking-widest">
                {t("sections.additional")}
              </h2>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description" className="text-sm font-bold text-gray-700 ml-1">
                {t("fields.description")}
              </Label>
              <Textarea
                id="description"
                name="description"
                placeholder={t("fields.descriptionPlaceholder")}
                rows={4}
                defaultValue={project?.description || ""}
                className="rounded-2xl border-gray-200 focus:ring-blue-500/20 focus:border-blue-500 min-h-[120px]"
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-4 pt-8 border-t border-gray-100">
            <Button
              type="button"
              variant="ghost"
              onClick={handleCancel}
              className="px-8 py-3 rounded-xl text-sm font-bold text-gray-500 hover:bg-gray-100 transition-all"
            >
              {t("actions.cancel")}
            </Button>
            <SubmitButton
              label={isEdit ? t("actions.update") : t("actions.create")}
              className="bg-blue-600 hover:bg-blue-700 text-white px-10 py-3 rounded-xl text-sm font-bold transition-all shadow-lg shadow-blue-500/20 active:scale-95"
            />
          </div>
        </form>
      </Card>
    </div>
  );
};

export default ProjectForm;
