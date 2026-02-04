import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { getTranslations } from "next-intl/server";
import React from "react";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { db } from "@/lib/db";
import { Role } from "@prisma/client";
import ProjectForm from "@/components/research/ProjectForm";
import { getExternalPartners, getStaff } from "@/actions/data-actions"; // Import getStaff and getExternalPartners

export default async function CreateStaffResearchProjectPage({ params }: { params: { id: string } }) {
  const session = await auth();
  const t = await getTranslations("Research.form");

  if (!session?.user) {
    redirect("/login");
  }

  const user = session.user;

  const staffMember = await db.staff.findUnique({
    where: { id: params.id },
    select: {
      id: true,
      name: true,
      image_url: true,
      university_id: true,
    },
  });

  if (!staffMember) {
    return (
      <div className="min-h-screen bg-[#F6F8FC] p-4 space-y-4 w-full max-w-full">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-3xl font-bold tracking-tight text-slate-800">
            Add Research Project
          </h2>
          <Link
            href={`/dashboard/staff/${params.id}`}
            className="inline-flex items-center text-xs font-black uppercase tracking-widest text-slate-400 hover:text-blue-600 transition-colors"
          >
            <ArrowLeft className="h-3 w-3 mr-2" />
            Back to Staff Profile
          </Link>
        </div>
        <div className="bg-white rounded-2xl border shadow-sm overflow-hidden p-20 text-center">
          <h2 className="text-2xl font-black text-slate-900">Staff not found</h2>
          <p className="text-slate-500 mt-2">The staff member you are looking for does not exist or has been removed.</p>
        </div>
      </div>
    );
  }

  // Fetch all staff and external partners for the ProjectForm
  const [allStaffList, allExternalPartnersList] = await Promise.all([
    getStaff(), // Fetches all staff based on user role
    getExternalPartners(), // Fetches all external partners
  ]);

  // Filter staffList to include only the current staff member for pre-selection
  const staffListForForm = allStaffList.filter(s => s.id === staffMember.id);

  return (
    <div className="min-h-screen bg-[#F6F8FC] p-4 space-y-4 w-full max-w-full">
      
      {/* Header (Outside Card) */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-3xl font-bold tracking-tight text-slate-800">
          {t("titleAdd")} for {staffMember.name}
        </h2>
        <Link
          href={`/dashboard/staff/${params.id}`}
          className="inline-flex items-center text-xs font-black uppercase tracking-widest text-slate-400 hover:text-blue-600 transition-colors"
        >
          <ArrowLeft className="h-3 w-3 mr-2" />
          Back to Staff Profile
        </Link>
      </div>

      {/* Content Card (Unified Container) */}
      <div className="bg-white rounded-2xl border shadow-sm overflow-hidden p-8">
        <ProjectForm
          universityId={user.universityId || ""}
          staffList={staffListForForm} // Pass filtered staff list for head researcher
          externalPartnersList={allExternalPartnersList} // Pass external partners for collaborators
          project={{ // Pass as 'project' prop
            staff_id: staffMember.id,
            title: "",
            status: "Ongoing",
            description: "",
            collaborators: [], // Empty array of ExternalPartner for new project
            id: "", // Not applicable for create, but required by type
          }}
        />
      </div>
    </div>
  );
}
