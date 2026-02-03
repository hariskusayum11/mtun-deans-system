import { getCompanies } from "@/actions/data-actions";
import { auth } from "@/lib/auth";
import { Role } from "@prisma/client";
import { redirect } from "next/navigation";
import { DataTable } from "@/components/ui/data-table";
import { columns } from "./columns";
import { Plus } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default async function IndustryPage() {
  const session = await auth();
  if (!session?.user) {
    redirect("/login");
  }

  const allowedRoles = [Role.super_admin, Role.dean, Role.data_entry];
  if (!allowedRoles.includes(session.user.role)) {
    return <div className="p-10 text-center text-red-500 font-bold">Access Denied</div>;
  }

  const companies = await getCompanies();
  
  // Extract unique sectors for the filter
  const sectors = Array.from(new Set(companies.map(c => c.sector).filter(Boolean))) as string[];
  const sectorOptions = sectors.map(sector => ({
    label: sector,
    value: sector
  }));

  return (
    <div className="space-y-6 md:space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-4xl font-black text-gray-900 tracking-tight">Industry Partners</h1>
          <p className="text-sm md:text-base text-gray-500 mt-1 font-medium">Manage corporate collaborations and industry activities.</p>
        </div>
        {(session.user.role === Role.super_admin || session.user.role === Role.data_entry) && (
          <Button asChild className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-6 rounded-2xl text-sm font-bold transition-all shadow-lg shadow-blue-500/20 active:scale-95 gap-2">
            <Link href="/dashboard/industry/create">
              <Plus className="h-5 w-5" />
              Add Partner
            </Link>
          </Button>
        )}
      </div>

      <DataTable 
        columns={columns as any} 
        data={companies as any}
        searchColumn="name"
        searchPlaceholder="Search partners by name..."
        filterColumn="sector"
        filterOptions={sectorOptions}
      />
    </div>
  );
}
