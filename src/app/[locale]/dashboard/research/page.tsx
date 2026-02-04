import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { getResearchProjects } from "@/actions/research";
import { Role } from "@prisma/client";
import { db } from "@/lib/db";
import ResearchClient from "./research-client";
import { PlusCircle } from "lucide-react";
import { Link } from "@/navigation";
import { Button } from "@/components/ui/button";
import { getTranslations } from "next-intl/server";

export default async function ResearchManagementPage() {
  const session = await auth();
  const t = await getTranslations("Dashboard.research");

  if (!session?.user) {
    redirect("/login");
  }

  const user = session.user;
  const projects = await getResearchProjects();

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
      
      {/* Page Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="space-y-1">
          <h2 className="text-2xl font-bold tracking-tight text-slate-800">
            Research Projects {/* Hardcoded for now, can be translated */}
          </h2>
          <p className="text-muted-foreground text-sm">
            Monitor and manage all university research projects. {/* Hardcoded for now, can be translated */}
          </p>
        </div>

        {(user.role === Role.super_admin || user.role === Role.data_entry) && (
          <Link href="/dashboard/research/create">
            <Button
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-6 rounded-2xl text-sm font-bold transition-all shadow-lg shadow-blue-500/20 active:scale-95 gap-2"
            >
              <PlusCircle className="h-5 w-5" />
              Add Project {/* Hardcoded for now, can be translated */}
            </Button>
          </Link>
        )}
      </div>

      {/* The White Card Container - wraps ResearchClient */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <ResearchClient 
          projects={projects} 
          staffList={staffList} 
          partners={partners}
          userRole={user.role} 
        />
      </div>
    </div>
  );
}
