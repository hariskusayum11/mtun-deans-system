import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { Role } from "@prisma/client";
import { DataTable } from "@/components/ui/data-table";
import { columns } from "./columns";

export default async function SystemLogsPage() {
  const session = await auth();
  if (!session?.user || session.user.role !== Role.super_admin) {
    redirect("/dashboard");
  }

  const logs = await db.loginLog.findMany({
    orderBy: {
      timestamp: "desc",
    },
  });

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-black text-gray-900 tracking-tight">
          System Logs
        </h1>
        <p className="text-gray-500 mt-1 font-medium">
          Monitor user login activities and security events.
        </p>
      </div>

      <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden p-8">
        <DataTable
          columns={columns as any}
          data={logs as any}
          searchColumn="email"
          searchPlaceholder="Search by email..."
          filterColumn="status"
          filterOptions={[
            { label: "Success", value: "SUCCESS" },
            { label: "Failed", value: "FAILED" },
          ]}
        />
      </div>
    </div>
  );
}
