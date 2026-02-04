import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { getTranslations } from "next-intl/server";
import React from "react";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { db } from "@/lib/db";
import { Role } from "@prisma/client";
import ProjectForm from "@/components/research/ProjectForm";

export default async function CreateResearchProjectPage() {
  const session = await auth();
  const t = await getTranslations("Research.form");

  if (!session?.user) {
    redirect("/login");
  }

  const user = session.user;

  // Fetch staff and partners for the ProjectForm
  const [staffList, partners] = await Promise.all([
    db.staff.findMany({
      where: user.role !== Role.super_admin ? { university_id: user.universityId as string } : {},
      select: {
        id: true,
        name: true,
        image_url: true,
      },
      orderBy: {
        name: "asc",
      },
    }),
    db.company.findMany({
      select: {
        id: true,
        name: true,
      },
      orderBy: {
        name: "asc",
      },
    }),
  ]);

  return (
    <div className="min-h-screen bg-[#F6F8FC] p-4 space-y-4 w-full max-w-full">
      
      {/* Header (Outside Card) */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-3xl font-bold tracking-tight text-slate-800">
          {t("titleAdd")}
        </h2>
        <Link
          href="/dashboard/research"
          className="inline-flex items-center text-xs font-black uppercase tracking-widest text-slate-400 hover:text-blue-600 transition-colors"
        >
          <ArrowLeft className="h-3 w-3 mr-2" />
          Back to Research Projects
        </Link>
      </div>

      {/* Content Card (Unified Container) */}
      <div className="bg-white rounded-2xl border shadow-sm overflow-hidden p-8">
        <ProjectForm
          universityId={user.universityId || ""}
          staffList={staffList}
          partnersList={partners}
        />
      </div>
    </div>
  );
}
