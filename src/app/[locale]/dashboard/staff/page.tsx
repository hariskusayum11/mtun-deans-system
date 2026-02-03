import { getStaff } from "@/actions/data-actions";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Role } from "@prisma/client";
import StaffTable from "@/components/staff/StaffTable";
import { Plus } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default async function StaffManagementPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  const user = session.user;
  const staff = await getStaff();

  return (
    <div className="space-y-6 md:space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-4xl font-black text-gray-900 tracking-tight">Staff Management</h1>
          <p className="text-sm md:text-base text-gray-500 mt-1 font-medium">Manage university personnel and their research profiles.</p>
        </div>
        {(user.role === Role.super_admin || user.role === Role.data_entry) && (
          <Button
            asChild
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-6 rounded-2xl text-sm font-bold transition-all shadow-lg shadow-blue-500/20 active:scale-95 gap-2"
          >
            <Link href="/dashboard/staff/create">
              <Plus className="h-5 w-5" />
              Add New Staff
            </Link>
          </Button>
        )}
      </div>

      <StaffTable 
        staff={staff as any} 
        isAdmin={user.role === Role.super_admin} 
      />
    </div>
  );
}
