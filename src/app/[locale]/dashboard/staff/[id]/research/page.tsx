import { db } from "@/lib/db";
import { notFound } from "next/navigation";
import { Link } from "@/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChevronLeft, PlusCircle, FlaskConical } from "lucide-react";
import { DataTable } from "@/components/ui/data-table";
import { columns } from "../research-columns"; // Reusing the columns definition
import { Prisma } from "@prisma/client"; // Import Prisma namespace

// Define a type for Staff with their research projects and collaborators (ExternalPartner)
type StaffWithResearchProjects = Prisma.StaffGetPayload<{
  include: {
    research_projects: {
      include: {
        collaborators: true; // Reverted to collaborators
      };
    };
    university: true;
  };
}>;

interface StaffResearchPageProps {
  params: {
    id: string;
    locale: string;
  };
}

export default async function StaffResearchPage({ params }: StaffResearchPageProps) {
  const { id: staffId } = params;

  const staff: StaffWithResearchProjects | null = await db.staff.findUnique({
    where: { id: staffId },
    include: {
      research_projects: {
        include: {
          collaborators: true, // Reverted to collaborators
        },
      },
      university: true,
    },
  });

  if (!staff) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-[#F6F8FC] p-4 space-y-4 w-full max-w-full">
      {/* Header (Outside Card) */}
      <div className="flex items-center justify-between mb-4">
        <div className="space-y-1">
          <Link href="/dashboard/staff" className="flex items-center text-sm text-slate-500 hover:text-blue-600 transition-colors mb-2">
            <ChevronLeft className="h-4 w-4 mr-1" />
            Back to Staff List
          </Link>
          <h2 className="text-2xl font-bold tracking-tight text-slate-800">
            Research Portfolio
          </h2>
          <p className="text-muted-foreground text-sm">
            Projects by {staff.name}
          </p>
        </div>
        <Link href={`/dashboard/research/create?staff_id=${staff.id}`}>
          <Button
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-6 rounded-2xl text-sm font-bold transition-all shadow-lg shadow-blue-500/20 active:scale-95 gap-2"
          >
            <PlusCircle className="h-5 w-5" />
            Add Project
          </Button>
        </Link>
      </div>

      {/* Content (Inside White Card) */}
      <Card className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <CardHeader className="px-6 py-4 border-b border-slate-100">
          <CardTitle className="text-lg font-bold text-slate-800">
            Research Projects
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          {staff.research_projects.length === 0 ? (
            <div className="text-center text-slate-500 py-8">
              <FlaskConical className="h-16 w-16 text-slate-200 mx-auto mb-4" />
              <div className="text-lg font-bold text-slate-800">No research projects found.</div>
              <div className="text-sm mt-2">This staff member has not added any research projects yet.</div>
            </div>
          ) : (
            <DataTable columns={columns} data={staff.research_projects} />
          )}
        </CardContent>
      </Card>
    </div>
  );
}
