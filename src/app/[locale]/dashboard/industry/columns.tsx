"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { 
  History, 
  User, 
  Phone, 
  Mail, 
  Building2,
  MoreHorizontal,
  Pencil,
  Trash2
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
import { deleteCompany } from "@/actions/data-actions";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

export type Company = {
  id: string;
  name: string;
  sector: string | null;
  contact_person: string;
  phone: string;
  email: string | null;
  image_url: string | null;
  university: {
    name: string;
    short_code: string;
  } | null;
};

export const columns: ColumnDef<Company>[] = [
  {
    accessorKey: "name",
    header: "Company",
    cell: ({ row }) => {
      const company = row.original;
      return (
        <div className="flex items-center gap-3">
          <Avatar className="h-10 w-10 rounded-xl border border-slate-200 shadow-sm">
            <AvatarImage src={company.image_url || ""} alt={company.name} />
            <AvatarFallback className="bg-blue-600 text-white font-black">
              {company.name.charAt(0)}
            </AvatarFallback>
          </Avatar>
          <span className="font-bold text-slate-900">{company.name}</span>
        </div>
      );
    },
  },
  {
    accessorKey: "sector",
    header: "Sector",
    cell: ({ row }) => {
      const sector = row.getValue("sector") as string;
      return (
        <Badge variant="outline" className="rounded-lg px-2 py-0.5 text-[10px] font-black uppercase tracking-widest border-slate-200 text-slate-600 bg-slate-50/50">
          {sector || "General"}
        </Badge>
      );
    },
  },
  {
    accessorKey: "contact_person",
    header: "Contact Info",
    cell: ({ row }) => {
      const company = row.original;
      return (
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2 text-sm font-bold text-slate-700">
            <User className="h-3.5 w-3.5 text-slate-400" />
            {company.contact_person}
          </div>
          <div className="flex items-center gap-2 text-[11px] font-medium text-slate-500">
            <Phone className="h-3 w-3 text-slate-400" />
            {company.phone}
          </div>
        </div>
      );
    },
  },
  {
    id: "collaboration",
    header: "Collaboration",
    cell: ({ row }) => {
      const company = row.original;
      return (
        <Button asChild variant="ghost" size="sm" className="rounded-xl hover:bg-blue-50 hover:text-blue-600 font-bold gap-2 transition-all">
          <Link href={`/dashboard/industry/${company.id}/activities`}>
            <History className="h-4 w-4" />
            View History
          </Link>
        </Button>
      );
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const company = row.original;
      const router = useRouter();

      const onDelete = async () => {
        try {
          await deleteCompany(company.id);
          toast.success("Partner deleted successfully!");
          router.refresh();
        } catch (error) {
          toast.error("Failed to delete partner.");
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
                onClick={() => router.push(`/dashboard/industry/${company.id}/edit`)}
                className="gap-2 text-sm font-bold text-slate-700 focus:bg-slate-50 rounded-lg cursor-pointer"
              >
                <Pencil className="h-3.5 w-3.5" />
                Edit Partner
              </DropdownMenuItem>
              
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <DropdownMenuItem onSelect={(e) => e.preventDefault()} className="gap-2 text-sm font-bold text-red-600 focus:bg-red-50 focus:text-red-600 rounded-lg cursor-pointer">
                    <Trash2 className="h-3.5 w-3.5" />
                    Delete Partner
                  </DropdownMenuItem>
                </AlertDialogTrigger>
                <AlertDialogContent className="rounded-[2rem]">
                  <AlertDialogHeader>
                    <AlertDialogTitle className="text-xl font-black">Delete Industry Partner?</AlertDialogTitle>
                    <AlertDialogDescription className="font-medium">
                      This action cannot be undone. This will permanently delete the partner
                      "<span className="font-bold text-gray-900">{company.name}</span>" and all associated activity logs.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel className="rounded-xl font-bold">Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={onDelete} className="bg-red-600 hover:bg-red-700 text-white rounded-xl font-bold">
                      Delete Partner
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
