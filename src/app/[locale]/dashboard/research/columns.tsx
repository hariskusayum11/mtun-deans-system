"use client";

import { useState } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, Pencil, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from "@/components/ui/dialog";
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
import ProjectForm from "@/components/research/ProjectForm";
import { deleteResearchProject } from "@/actions/research";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

export type ResearchProject = {
  id: string;
  title: string;
  description: string | null;
  status: string | null;
  staff_id: string;
  staff: {
    name: string;
    image_url: string | null;
  };
  collaborators: {
    id: string;
    name: string;
  }[];
};

const ActionsCell = ({ project }: { project: ResearchProject }) => {
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
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
          
          <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
            <DialogTrigger asChild>
              <DropdownMenuItem onSelect={(e) => e.preventDefault()} className="gap-2 text-sm font-bold text-slate-700 focus:bg-slate-50 rounded-lg cursor-pointer">
                <Pencil className="h-3.5 w-3.5" />
                Edit Project
              </DropdownMenuItem>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px] rounded-[2rem] p-0 overflow-hidden border-none [&>button]:hidden">
              <ProjectForm project={project} setOpen={setIsEditDialogOpen} />
            </DialogContent>
          </Dialog>

          <AlertDialog>
            <AlertDialogTrigger asChild>
              <DropdownMenuItem onSelect={(e) => e.preventDefault()} className="gap-2 text-sm font-bold text-red-600 focus:bg-red-50 focus:text-red-600 rounded-lg cursor-pointer">
                <Trash2 className="h-3.5 w-3.5" />
                Delete Project
              </DropdownMenuItem>
            </AlertDialogTrigger>
            <AlertDialogContent className="rounded-[2rem]">
              <AlertDialogHeader>
                <AlertDialogTitle className="text-xl font-black">Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription className="font-medium">
                  This action cannot be undone. This will permanently delete the project
                  "<span className="font-bold text-gray-900">{project.title}</span>" and remove its data from our servers.
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
};

export const columns: ColumnDef<ResearchProject>[] = [
  {
    accessorKey: "title",
    header: "Project Name",
    cell: ({ row }) => {
      const project = row.original;
      return (
        <div className="flex flex-col gap-1">
          <span className="font-bold text-slate-900">{project.title}</span>
          {project.description && (
            <span className="text-xs text-slate-500 line-clamp-1 max-w-[300px]">
              {project.description}
            </span>
          )}
        </div>
      );
    },
  },
  {
    accessorKey: "staff.name",
    header: "Head Researcher",
    cell: ({ row }) => {
      const staff = row.original.staff;
      return (
        <div className="flex items-center gap-3">
          <Avatar className="h-8 w-8 border border-slate-200">
            <AvatarImage src={staff.image_url || ""} alt={staff.name} />
            <AvatarFallback className="bg-slate-100 text-slate-600 text-[10px] font-bold">
              {staff.name.charAt(0)}
            </AvatarFallback>
          </Avatar>
          <span className="text-sm font-medium text-slate-700">{staff.name}</span>
        </div>
      );
    },
  },
  {
    accessorKey: "collaborators",
    header: "Partners",
    cell: ({ row }) => {
      const partners = row.original.collaborators;
      const displayLimit = 2;
      const hasMore = partners.length > displayLimit;
      const visiblePartners = partners.slice(0, displayLimit);

      return (
        <div className="flex flex-wrap gap-1.5">
          {visiblePartners.map((p) => (
            <Badge
              key={p.id}
              variant="outline"
              className="rounded-lg px-2 py-0 text-[10px] font-bold border-slate-200 text-slate-600 bg-slate-50/50"
            >
              {p.name}
            </Badge>
          ))}
          {hasMore && (
            <Badge
              variant="outline"
              className="rounded-lg px-2 py-0 text-[10px] font-bold border-slate-200 text-slate-400 bg-transparent"
            >
              +{partners.length - displayLimit} more
            </Badge>
          )}
          {partners.length === 0 && (
            <span className="text-[10px] text-slate-400 italic font-medium">Internal</span>
          )}
        </div>
      );
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.original.status;
      return (
        <Badge
          className={cn(
            "rounded-xl px-3 py-1 text-[10px] font-black uppercase tracking-[0.1em] border shadow-sm",
            status === "Completed"
              ? "bg-slate-100 text-slate-600 border-slate-200"
              : "bg-emerald-50 text-emerald-700 border-emerald-100"
          )}
        >
          {status || "Ongoing"}
        </Badge>
      );
    },
  },
  {
    id: "actions",
    cell: ({ row }) => <ActionsCell project={row.original} />,
  },
];
