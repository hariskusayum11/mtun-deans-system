import { auth } from "@/lib/auth";
import { Role } from "@prisma/client";
import { redirect } from "next/navigation";
import { getTranslations } from "next-intl/server";
import React from "react";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import ActivityFormModal from "@/components/industry/ActivityFormModal";
import { getCompaniesListForSelect } from "@/actions/industry";

export default async function CreateIndustryActivityPage() {
  const session = await auth();
  const t = await getTranslations("Industry");

  if (!session?.user) {
    redirect("/login");
  }

  const allowedRoles = [Role.super_admin, Role.dean, Role.data_entry];
  if (!allowedRoles.includes(session.user.role)) {
    return <div className="p-10 text-center text-red-500 font-bold">Access Denied</div>;
  }

  const companiesList = await getCompaniesListForSelect();

  return (
    <div className="min-h-screen bg-[#F6F8FC] p-4 space-y-4 w-full max-w-full">
      {/* Header (Outside Card) */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-3xl font-bold tracking-tight text-slate-800">
          Add New Industry Activity
        </h2>
        <Link
          href="/dashboard/industry/activities"
          className="inline-flex items-center text-xs font-black uppercase tracking-widest text-slate-400 hover:text-blue-600 transition-colors"
        >
          <ArrowLeft className="h-3 w-3 mr-2" />
          Back to All Activities
        </Link>
      </div>

      {/* Content Card (Unified Container) */}
      <div className="bg-white rounded-2xl border shadow-sm overflow-hidden p-8">
        <ActivityFormModal
          universityId={session.user.universityId || ""}
          companiesList={companiesList}
        />
      </div>
    </div>
  );
}
