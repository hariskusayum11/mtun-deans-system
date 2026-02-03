"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

export type LoginLog = {
  id: string;
  email: string;
  status: string;
  ip_address: string | null;
  timestamp: Date;
};

export const columns: ColumnDef<LoginLog>[] = [
  {
    accessorKey: "email",
    header: "Email",
    cell: ({ row }) => {
      return <span className="font-medium text-slate-900">{row.getValue("email")}</span>;
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("status") as string;
      return (
        <Badge
          className={cn(
            "rounded-xl px-3 py-1 text-[10px] font-black uppercase tracking-[0.1em] border shadow-sm",
            status === "SUCCESS"
              ? "bg-emerald-50 text-emerald-700 border-emerald-100"
              : "bg-red-50 text-red-700 border-red-100"
          )}
        >
          {status}
        </Badge>
      );
    },
  },
  {
    accessorKey: "ip_address",
    header: "IP Address",
    cell: ({ row }) => {
      return <span className="text-slate-500 font-mono text-xs">{row.getValue("ip_address") || "N/A"}</span>;
    },
  },
  {
    accessorKey: "timestamp",
    header: "Time",
    cell: ({ row }) => {
      const date = row.getValue("timestamp") as Date;
      return (
        <span className="text-slate-500 text-sm font-medium">
          {format(date, "dd/MM/yyyy HH:mm")}
        </span>
      );
    },
  },
];
