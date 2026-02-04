"use client";

import { useState } from "react";
import { PlusCircle, Search, Filter, Edit, Trash2, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import { columns } from "./columns";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from "@/components/ui/dialog";
import ProjectForm from "@/components/research/ProjectForm";
import { Role } from "@prisma/client";
import { Input } from "@/components/ui/input";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { useTranslations } from "next-intl";

interface ResearchClientProps {
  projects: any[];
  staffList: any[];
  partners: any[];
  userRole: Role;
}

export default function ResearchClient({ projects, staffList, partners, userRole }: ResearchClientProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const t = useTranslations("Dashboard.research");
  const tCommon = useTranslations("Common");

  // Mock filter options for status
  const statusFilterOptions = [
    { label: "All Status", value: "all" },
    { label: "Ongoing", value: "Ongoing" },
    { label: "Completed", value: "Completed" },
    { label: "Pending", value: "Pending" },
  ];

  // Filter projects based on search term
  const filteredProjects = projects.filter(
    (project: any) =>
      project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.staff?.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      {/* Header Section (Toolbar): Search Input and Dropdown Filters */}
      <div className="flex items-center justify-between border-b border-slate-100 p-4">
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <Input
            type="text"
            placeholder="Search projects..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 rounded-xl border-slate-200 focus-visible:ring-blue-200"
          />
        </div>
        <div className="flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="flex items-center gap-2 rounded-xl border-slate-200 text-slate-600 hover:bg-slate-50">
                <Filter className="h-4 w-4" />
                {tCommon("filters")}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-[200px]">
              {statusFilterOptions.map((option) => (
                <DropdownMenuItem key={option.value}>{option.label}</DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Body Section (Table) */}
      <div className="p-0 overflow-x-auto">
        <DataTable
          columns={columns}
          data={filteredProjects}
          // Removed searchColumn and filterColumn props as they are now handled manually
        />
      </div>
    </>
  );
}
