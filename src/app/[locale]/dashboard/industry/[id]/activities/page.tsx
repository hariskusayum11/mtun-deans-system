import { getCompanyById } from "@/actions/data-actions";
import { auth } from "@/lib/auth";
import { Role, IndustryActivity, Company } from "@prisma/client";
import { redirect } from "next/navigation";
import { DataTable } from "@/components/ui/data-table";
import { columns } from "./columns";
import { Plus, Search, Filter } from "lucide-react";
import { Link } from "@/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { getTranslations } from "next-intl/server";
import React from "react";
import { db } from "@/lib/db";

// Define a type that includes the company relation for Prisma query results
type IndustryActivityWithCompany = IndustryActivity & {
  company: Company;
  type: string; // Add the 'type' field as it now exists in the Prisma model
};

export default async function CompanyActivitiesPage({ params }: { params: { id: string } }) {
  const session = await auth();
  const t = await getTranslations("Industry");
  const tCommon = await getTranslations("Common");

  if (!session?.user) {
    redirect("/login");
  }

  const allowedRoles = [Role.super_admin, Role.dean, Role.data_entry];
  if (!allowedRoles.includes(session.user.role)) {
    return <div className="p-10 text-center text-red-500 font-bold">Access Denied</div>;
  }

  const company = await getCompanyById(params.id);

  if (!company) {
    return (
      <div className="min-h-screen bg-[#F6F8FC] p-4 space-y-4 w-full max-w-full">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-3xl font-bold tracking-tight text-slate-800">
            Industry Activities
          </h2>
        </div>
        <div className="bg-white rounded-2xl border shadow-sm overflow-hidden p-20 text-center">
          <h2 className="text-2xl font-black text-slate-900">Company not found</h2>
          <p className="text-slate-500 mt-2">The company you are looking for does not exist or has been removed.</p>
          <Link href="/dashboard/industry" className="mt-8 inline-flex items-center text-blue-600 font-bold hover:underline">
            Back to Industry List
          </Link>
        </div>
      </div>
    );
  }

  let rawActivities: IndustryActivityWithCompany[] = [];
  const userUniversityId = session.user.universityId;

  if (session.user.role === Role.super_admin) {
    rawActivities = await db.industryActivity.findMany({
      where: {
        company_id: params.id,
      },
      include: {
        company: true,
      },
      orderBy: {
        date: 'desc',
      },
    }) as IndustryActivityWithCompany[];
  } else if (userUniversityId) {
    rawActivities = await db.industryActivity.findMany({
      where: {
        company_id: params.id,
        university_id: userUniversityId,
      },
      include: {
        company: true,
      },
      orderBy: {
        date: 'desc',
      },
    }) as IndustryActivityWithCompany[];
  } else {
    rawActivities = [];
  }

  // Map Prisma result to match the Activity type expected by the DataTable
  const activities = rawActivities.map(activity => ({
    id: activity.id,
    name: activity.project_name,
    partner_name: activity.company?.name || "N/A",
    partner_type: "Company", // Assuming all activities here are with companies
    date: activity.date,
    type: activity.type, // Use the 'type' field from the Prisma model
    status: activity.status,
  }));

  // Extract unique types for the filter
  const activityTypes = Array.from(new Set(activities.map(a => a.type).filter(Boolean))) as string[];
  const activityTypeOptions = activityTypes.map(type => ({
    label: type,
    value: type
  }));

  const filteredActivities = activities; // Placeholder for actual client-side filtering logic if implemented

  return (
    <div className="min-h-screen bg-[#F6F8FC] p-4 space-y-4 w-full max-w-full">

      {/* Header (Outside Card) */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-3xl font-bold tracking-tight text-slate-800">
          Industry Activities for {company.name}
        </h2>
        {(session.user.role === Role.super_admin || session.user.role === Role.data_entry) && (
          <Link href={`/dashboard/industry/${params.id}/activities/create`}>
            <Button
              className="bg-green-600 hover:bg-green-700 text-white px-6 py-6 rounded-2xl text-sm font-bold transition-all shadow-lg shadow-green-500/20 active:scale-95 gap-2"
            >
              <Plus className="h-5 w-5" />
              Add Activity
            </Button>
          </Link>
        )}
      </div>

      {/* Content Card (Unified Container) */}
      <div className="bg-white rounded-2xl border shadow-sm overflow-hidden">
        {/* Toolbar (Top of Card): Search Input and Dropdown Filters */}
        <div className="flex items-center justify-between border-b border-slate-100 p-4">
          <div className="relative w-full max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input
              placeholder="Search activities..."
              className="w-full pl-9 rounded-xl border-slate-200 focus-visible:ring-blue-200"
              // Add onChange and value for search term if this were a client component
            />
          </div>
          <div className="flex items-center gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="flex items-center gap-2 rounded-xl border-slate-200 text-slate-600 hover:bg-slate-50">
                  <Filter className="h-4 w-4" />
                  All Types
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-[200px]">
                {activityTypeOptions.map((option) => (
                  <DropdownMenuItem key={option.value}>{option.label}</DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Table (Body of Card) */}
        <div className="p-0 overflow-x-auto">
          <DataTable
            columns={columns as any}
            data={filteredActivities as any}
            // Row hover effect will be handled in columns.tsx or a custom row component if DataTable doesn't support it directly.
          />
        </div>
      </div>
    </div>
  );
}
