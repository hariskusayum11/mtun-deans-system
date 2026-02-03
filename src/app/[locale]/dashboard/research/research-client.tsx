"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
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

interface ResearchClientProps {
  projects: any[];
  staffList: any[];
  partners: any[];
  userRole: Role;
}

export default function ResearchClient({ projects, staffList, partners, userRole }: ResearchClientProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="space-y-6 md:space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-4xl font-black text-gray-900 tracking-tight">
            Research Projects
          </h1>
          <p className="text-sm md:text-base text-gray-500 mt-1 font-medium">
            Monitor and manage all university research projects.
          </p>
        </div>

        {(userRole === Role.super_admin || userRole === Role.data_entry) && (
          <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
              <Button className="w-full md:w-auto bg-blue-600 hover:bg-blue-700 text-white px-6 py-6 rounded-2xl text-sm font-bold transition-all shadow-lg shadow-blue-500/20 active:scale-95 gap-2">
                <Plus className="h-5 w-5" />
                Add Project
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px] w-[95vw] rounded-[2rem] p-0 overflow-hidden border-none [&>button]:hidden">
              <ProjectForm staffList={staffList} partnersList={partners} setOpen={setIsOpen} />
            </DialogContent>
          </Dialog>
        )}
      </div>

      <DataTable
        columns={columns}
        data={projects}
        searchColumn="title"
        searchPlaceholder="Search projects or researchers..."
        filterColumn="status"
        filterOptions={[
          { label: "Ongoing", value: "Ongoing" },
          { label: "Completed", value: "Completed" },
        ]}
      />
    </div>
  );
}
