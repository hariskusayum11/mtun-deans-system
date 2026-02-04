"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  MoreHorizontal,
  Pencil,
  Trash2,
  FlaskConical,
} from "lucide-react";
import Link from "next/link";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { deleteResearchProject } from "@/actions/research"; // Assuming this action exists
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

export type ResearchProject = {
  id: string;
  title: string;
  status: string | null;
  description: string | null;
  staff_id: string;
  collaborators: { id: string; name: string }[]; // Reverted to collaborators
};

export const columns: ColumnDef<ResearchProject>[] = [
  {
    accessorKey: "title",
    header: "Project Title",
    cell: ({ row }) => {
      const project = row.original;
      return (
        <div className="font-bold text-slate-900">{project.title}</div>
      );
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("status") as string;
      const getStatusColor = (status: string) => {
        switch (status.toLowerCase()) {
          case "completed":
            return "bg-emerald-50 text-emerald-700 border-emerald-100";
          case "ongoing":
            return "bg-blue-50 text-blue-700 border-blue-100";
          case "pending":
            return "bg-amber-50 text-amber-700 border-amber-100";
          default:
            return "bg-slate-50 text-slate-700 border-slate-100";
        }
      };
      return (
        <Badge className={`rounded-lg px-2 py-0.5 text-[10px] font-black uppercase tracking-widest ${getStatusColor(status)}`}>
          {status}
        </Badge>
      );
    },
  },
  {
    accessorKey: "collaborators",
    header: "Collaborators",
    cell: ({ row }) => {
      const collaborators = row.original.collaborators;
      return (
        <div className="flex flex-wrap gap-1">
          {collaborators.length > 0 ? (
            collaborators.map((collab) => (
              <Badge key={collab.id} variant="outline" className="rounded-lg px-2 py-0.5 text-[10px] font-black uppercase tracking-widest border-slate-200 text-slate-600 bg-slate-50/50">
                {collab.name}
              </Badge>
            ))
          ) : (
            <span className="text-slate-400 text-xs">No collaborators</span>
          )}
        </div>
      );
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const project = row.original;
      const router = useRouter();

      const onDelete = async () => {
        try {
          await deleteResearchProject(project.id);
          toast.success("Project deleted successfully!");
          router.refresh();
        } catch (error) {
          toast.error("Failed to delete project.");
        }
      };

      return (
        <div className="text-right">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0 hover:bg-slate-100 rounded-lg">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4 text-slate-500" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="rounded-xl border-slate-200 shadow-xl">
              <DropdownMenuLabel className="text-[10px] uppercase font-black text-slate-400 tracking-widest">Actions</DropdownMenuLabel>
              <DropdownMenuSeparator className="bg-slate-100" />
              <DropdownMenuItem
                onClick={() => router.push(`/dashboard/research/${project.id}/edit`)}
                className="gap-2 text-sm font-bold text-slate-700 focus:bg-slate-50 rounded-lg cursor-pointer"
              >
                <Pencil className="h-3.5 w-3.5" />
                Edit Project
              </DropdownMenuItem>

              {/* AlertDialog for Delete Confirmation */}
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <DropdownMenuItem onSelect={(e) => e.preventDefault()} className="gap-2 text-sm font-bold text-red-600 focus:bg-red-50 focus:text-red-600 rounded-lg cursor-pointer">
                    <Trash2 className="h-3.5 w-3.5" />
                    Delete Project
                  </DropdownMenuItem>
                </AlertDialogTrigger>
                <AlertDialogContent className="rounded-[2rem]">
                  <AlertDialogHeader>
                    <AlertDialogTitle className="text-xl font-black">Delete Research Project?</AlertDialogTitle>
                    <AlertDialogDescription className="font-medium">
                      This action cannot be undone. This will permanently delete the project
                      "<span className="font-bold text-gray-900">{project.title}</span>".
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel className="rounded-xl font-bold">Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={onDelete} className="bg-red-600 hover:bg-red-700 text-white rounded-xl font-bold">
                      Delete Project
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      );
    },
  },
];
