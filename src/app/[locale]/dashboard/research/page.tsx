import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { getResearchProjects } from "@/actions/research";
import { Role } from "@prisma/client";
import { db } from "@/lib/db";
import ResearchClient from "./research-client";
import { getExternalPartners } from "@/actions/data-actions";

export default async function ResearchManagementPage() {
  const session = await auth();
  if (!session?.user) {
    redirect("/login");
  }

  const user = session.user;
  const projects = await getResearchProjects();

  // Fetch staff list and partners server-side to prevent client-side fetch loops
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
    getExternalPartners()
  ]);

  return (
    <ResearchClient 
      projects={projects} 
      staffList={staffList} 
      partners={partners}
      userRole={user.role} 
    />
  );
}
