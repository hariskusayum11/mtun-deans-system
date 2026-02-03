"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { 
  Building, 
  MapPin, 
  MoreHorizontal, 
  Pencil, 
  Trash2
} from "lucide-react";
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
import { deleteFacility } from "@/actions/data-actions";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { useState } from "react";

export type Facility = {
  id: string;
  name: string;
  description: string | null;
  location: string | null;
  image_url: string | null;
  university: {
    name: string;
    short_code: string;
  } | null;
};

const ActionsCell = ({ facility }: { facility: Facility }) => {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);

  const onDelete = async () => {
    setIsDeleting(true);
    try {
      await deleteFacility(facility.id);
      toast.success("Facility deleted successfully!");
      router.refresh();
    } catch (error) {
      toast.error("Failed to delete facility.");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="flex justify-end">
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
            onClick={() => router.push(`/dashboard/facilities/${facility.id}/edit`)}
            className="gap-2 text-sm font-bold text-slate-700 focus:bg-slate-50 rounded-lg cursor-pointer"
          >
            <Pencil className="h-3.5 w-3.5" />
            Edit Facility
          </DropdownMenuItem>
          
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <DropdownMenuItem onSelect={(e) => e.preventDefault()} className="gap-2 text-sm font-bold text-red-600 focus:bg-red-50 focus:text-red-600 rounded-lg cursor-pointer">
                <Trash2 className="h-3.5 w-3.5" />
                Delete Facility
              </DropdownMenuItem>
            </AlertDialogTrigger>
            <AlertDialogContent className="rounded-[2rem]">
              <AlertDialogHeader>
                <AlertDialogTitle className="text-xl font-black">Delete Facility?</AlertDialogTitle>
                <AlertDialogDescription className="font-medium">
                  This action cannot be undone. This will permanently delete the facility
                  "<span className="font-bold text-gray-900">{facility.name}</span>" and remove its data from our servers.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel className="rounded-xl font-bold">Cancel</AlertDialogCancel>
                <AlertDialogAction 
                  onClick={onDelete} 
                  disabled={isDeleting}
                  className="bg-red-600 hover:bg-red-700 text-white rounded-xl font-bold"
                >
                  {isDeleting ? "Deleting..." : "Delete Facility"}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export const columns: ColumnDef<Facility>[] = [
  {
    accessorKey: "name",
    header: "Facility",
    cell: ({ row }) => {
      const facility = row.original;
      return (
        <div className="flex items-center gap-4">
          <Avatar className="h-14 w-14 rounded-2xl border border-slate-200 shadow-sm group-hover:scale-105 transition-transform">
            <AvatarImage src={facility.image_url || ""} alt={facility.name} className="object-cover" />
            <AvatarFallback className="bg-blue-50 text-blue-600">
              <Building className="w-6 h-6" />
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <span className="text-sm font-bold text-gray-900">{facility.name}</span>
            {facility.description && (
              <span className="text-xs text-gray-500 line-clamp-1 max-w-xs">{facility.description}</span>
            )}
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "location",
    header: "Location",
    cell: ({ row }) => {
      const location = row.getValue("location") as string;
      return (
        <div className="flex items-center gap-2 text-gray-600">
          <MapPin className="h-4 w-4 text-gray-400" />
          <span className="text-sm font-medium">{location || "N/A"}</span>
        </div>
      );
    },
  },
  {
    accessorKey: "university.short_code",
    header: "University",
    cell: ({ row }) => {
      const shortCode = row.original.university?.short_code || "MTUN";
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold border uppercase tracking-tight bg-indigo-50 text-indigo-700 border-indigo-100">
          {shortCode}
        </span>
      );
    },
  },
  {
    id: "actions",
    header: () => <div className="text-right">Actions</div>,
    cell: ({ row }) => <ActionsCell facility={row.original} />,
    size: 100,
  },
];
