"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  MoreHorizontal,
  Pencil,
  Trash2,
  CalendarDays,
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
import { deleteIndustryActivity } from "@/actions/data-actions";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
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

export type Activity = {
  id: string;
  name: string; // Activity Name
  partner_name: string; // Partner (Company/Uni)
  partner_type: "Company" | "University"; // To differentiate partner type
  date: Date; // Date
  type: "MOU" | "MOA" | "Activity"; // Type (MOU/MOA/Activity)
  status: string; // Status
};

export const columns: ColumnDef<Activity>[] = [
  {
    accessorKey: "name",
    header: "Activity Name",
    cell: ({ row }) => {
      const activity = row.original;
      return (
        <div className="font-bold text-slate-900">{activity.name}</div>
      );
    },
  },
  {
    accessorKey: "partner_name",
    header: "Partner",
    cell: ({ row }) => {
      const activity = row.original;
      return (
        <div className="flex flex-col gap-1">
          <span className="font-bold text-slate-700">{activity.partner_name}</span>
          <Badge variant="outline" className="rounded-lg px-2 py-0.5 text-[10px] font-black uppercase tracking-widest border-slate-200 text-slate-600 bg-slate-50/50">
            {activity.partner_type}
          </Badge>
        </div>
      );
    },
  },
  {
    accessorKey: "date",
    header: "Date",
    cell: ({ row }) => {
      const date = row.getValue("date") as Date;
      return (
        <div className="flex items-center gap-2 text-sm font-medium text-slate-700">
          <CalendarDays className="h-4 w-4 text-slate-400" />
          {format(date, "PPP")}
        </div>
      );
    },
  },
  {
    accessorKey: "type",
    header: "Type",
    cell: ({ row }) => {
      const type = row.getValue("type") as string;
      return (
        <Badge className="rounded-lg px-2 py-0.5 text-[10px] font-black uppercase tracking-widest bg-blue-100 text-blue-700 border-blue-200">
          {type}
        </Badge>
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
            return "bg-green-100 text-green-700 border-green-200";
          case "pending":
            return "bg-yellow-100 text-yellow-700 border-yellow-200";
          case "cancelled":
            return "bg-red-100 text-red-700 border-red-200";
          default:
            return "bg-slate-100 text-slate-700 border-slate-200";
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
    id: "actions",
    cell: ({ row }) => {
      const activity = row.original;
      const router = useRouter();

      const onDelete = async () => {
        try {
          await deleteIndustryActivity(activity.id);
          toast.success("Activity deleted successfully!");
          router.refresh();
        } catch (error) {
          toast.error("Failed to delete activity.");
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
                onClick={() => router.push(`/dashboard/industry/activities/${activity.id}/edit`)}
                className="gap-2 text-sm font-bold text-slate-700 focus:bg-slate-50 rounded-lg cursor-pointer"
              >
                <Pencil className="h-3.5 w-3.5" />
                Edit Activity
              </DropdownMenuItem>

              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <DropdownMenuItem onSelect={(e) => e.preventDefault()} className="gap-2 text-sm font-bold text-red-600 focus:bg-red-50 focus:text-red-600 rounded-lg cursor-pointer">
                    <Trash2 className="h-3.5 w-3.5" />
                    Delete Activity
                  </DropdownMenuItem>
                </AlertDialogTrigger>
                <AlertDialogContent className="rounded-[2rem]">
                  <AlertDialogHeader>
                    <AlertDialogTitle className="text-xl font-black">Delete Industry Activity?</AlertDialogTitle>
                    <AlertDialogDescription className="font-medium">
                      This action cannot be undone. This will permanently delete the activity
                      "<span className="font-bold text-gray-900">{activity.name}</span>".
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel className="rounded-xl font-bold">Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={onDelete} className="bg-red-600 hover:bg-red-700 text-white rounded-xl font-bold">
                      Delete Activity
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
