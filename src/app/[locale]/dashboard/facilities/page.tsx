import { getFacilities } from "@/actions/data-actions";
import { auth } from "@/lib/auth";
import { Role } from "@prisma/client";
import { redirect } from "next/navigation";
import { DataTable } from "@/components/ui/data-table";
import { columns } from "@/components/facilities/columns";
import { PlusCircle, Search, Filter } from "lucide-react"; // Changed Plus to PlusCircle, added Search and Filter
import { Link } from "@/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input"; // Added Input
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu"; // Added Dropdown components
import { getTranslations } from "next-intl/server"; // Added getTranslations
import React, { useState } from "react"; // Added useState for client-side filtering

export default async function FacilityManagementPage() {
  const session = await auth();
  const t = await getTranslations("Facilities"); // Assuming translations for page title/description
  const tCommon = await getTranslations("Common");

  if (!session?.user) {
    redirect("/login");
  }

  const user = session.user;
  const facilities = await getFacilities();

  // Client-side filtering states (assuming this page will be a client component or pass these to a client component)
  // For now, we'll keep it server-side for initial render and assume client-side interaction will be handled by a client component if needed.
  // For this refactor, we'll apply the visual structure.

  const filteredFacilities = facilities; // Placeholder for actual filtering logic if implemented client-side

  return (
    <div className="min-h-screen bg-[#F6F8FC] p-4 space-y-4 w-full max-w-full">
      
      {/* Page Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="space-y-1">
          <h2 className="text-2xl font-bold tracking-tight text-slate-800">
            Facility Management {/* Hardcoded for now, can be translated */}
          </h2>
          <p className="text-muted-foreground text-sm">
            Manage university laboratories, equipment, and research facilities. {/* Hardcoded for now, can be translated */}
          </p>
        </div>
        {(user.role === Role.super_admin || user.role === Role.data_entry) && (
          <Link href="/dashboard/facilities/create">
          <Button
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-6 rounded-2xl text-sm font-bold transition-all shadow-lg shadow-blue-500/20 active:scale-95 gap-2"
          >
            <PlusCircle className="h-5 w-5" />
            Add Facility {/* Hardcoded for now, can be translated */}
          </Button>
          </Link>
        )}
      </div>

      {/* The White Card Container - wraps Search, Filters, and Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        {/* Header Section (Toolbar): Search Input and Dropdown Filters */}
        <div className="flex items-center justify-between border-b border-slate-100 p-4">
          <div className="relative w-full max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input
              placeholder={tCommon("searchPlaceholder")}
              className="w-full pl-9 rounded-xl border-slate-200 focus-visible:ring-blue-200"
              // Add onChange and value for search term if this were a client component
            />
          </div>
          <div className="flex items-center gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="flex items-center gap-2 rounded-xl border-slate-200 text-slate-600 hover:bg-slate-50">
                  <Filter className="h-4 w-4" />
                  {tCommon("filters")}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-[200px]">
                <DropdownMenuItem>Filter Option 1</DropdownMenuItem>
                <DropdownMenuItem>Filter Option 2</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Body Section (Table) */}
        <div className="p-0 overflow-x-auto">
          <DataTable 
            columns={columns as any} 
            data={filteredFacilities as any}
            // Removed searchColumn, searchPlaceholder, filterColumn, filterOptions props
          />
        </div>
      </div>
    </div>
  );
}
