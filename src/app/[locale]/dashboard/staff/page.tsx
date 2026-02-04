import { getStaff } from "@/actions/data-actions";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Role } from "@prisma/client";
import StaffTable from "@/components/staff/StaffTable";
import { PlusCircle } from "lucide-react"; // Changed Plus to PlusCircle for consistency
import { Link } from "@/navigation"; // Use next-intl's Link
import { Button } from "@/components/ui/button";
import { getTranslations } from "next-intl/server"; // Added for translations

export default async function StaffManagementPage() {
  const session = await auth();
  const t = await getTranslations("Dashboard.sidebar"); // Assuming translations for page title/description

  if (!session?.user) {
    redirect("/login");
  }

  const user = session.user;
  const staff = await getStaff();

  return (
    <div className="min-h-screen bg-[#F6F8FC] p-4 space-y-4 w-full max-w-full">
      
      {/* Page Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="space-y-1">
          <h2 className="text-2xl font-bold tracking-tight text-slate-800">
            Staff Management {/* Hardcoded for now, can be translated */}
          </h2>
          <p className="text-muted-foreground text-sm">
            Manage university personnel and their research profiles. {/* Hardcoded for now, can be translated */}
          </p>
        </div>
        {(user.role === Role.super_admin || user.role === Role.data_entry) && (
          <Link href="/dashboard/staff/create">
          <Button
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-6 rounded-2xl text-sm font-bold transition-all shadow-lg shadow-blue-500/20 active:scale-95 gap-2"
          >
            <PlusCircle className="h-5 w-5" />
            Add New Staff {/* Hardcoded for now, can be translated */}
          </Button>
          </Link>
        )}
      </div>

      {/* The White Card Container - wraps StaffTable */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <StaffTable 
          staff={staff as any} 
          isAdmin={user.role === Role.super_admin} 
        />
      </div>
    </div>
  );
}
