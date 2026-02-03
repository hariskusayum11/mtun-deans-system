import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { deleteResearchProject } from "@/actions/data-actions";
import { Role, Staff, ResearchProject, University } from "@prisma/client";
import Link from "next/link";
import { db } from "@/lib/db";
import ProjectForm from "@/components/research/ProjectForm";
import { cn } from "@/lib/utils";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Pencil, Trash2, Plus, ArrowLeft, FlaskConical } from "lucide-react";

interface ManageProjectsPageProps {
  params: {
    id: string;
  };
}

type ResearchProjectWithCollaborators = ResearchProject & {
  collaborators: any[];
};

type StaffWithProjectsAndUniversity = Staff & {
  research_projects: ResearchProjectWithCollaborators[];
  university: University | null;
};

export default async function ManageProjectsPage({
  params,
}: ManageProjectsPageProps) {
  const session = await auth();
  if (!session?.user) {
    redirect("/login");
  }

  const user = session.user;
  const staffMember = (await getStaffById(
    params.id
  )) as StaffWithProjectsAndUniversity | null;

  if (!staffMember) {
    return (
      <div className="flex min-h-full items-center justify-center bg-gray-100 p-4">
        <div className="rounded-md bg-red-50 p-3 text-sm text-red-700">
          Staff member not found.
        </div>
      </div>
    );
  }

  // Authorization check
  if (
    user.role !== Role.super_admin &&
    staffMember.university_id !== user.universityId
  ) {
    redirect("/dashboard/staff");
  }

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Link
              href="/dashboard/staff"
              className="hover:text-primary flex items-center gap-1 transition-colors"
            >
              <ArrowLeft className="h-3 w-3" />
              Back to Staff
            </Link>
          </div>
          <h1 className="text-4xl font-black text-gray-900 tracking-tight">
            Research Projects
          </h1>
          <p className="text-gray-500 font-medium">
            Managing projects for <span className="text-blue-600 font-bold">{staffMember.name}</span>
          </p>
        </div>

        <Dialog>
          <DialogTrigger asChild>
            <Button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-6 rounded-2xl text-sm font-bold transition-all shadow-lg shadow-blue-500/20 active:scale-95 gap-2">
              <Plus className="h-5 w-5" />
              Add Project
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[525px] rounded-[2rem]">
            <DialogHeader>
              <DialogTitle className="text-2xl font-black">Add New Project</DialogTitle>
              <DialogDescription className="font-medium">
                Fill in the details below to create a new research project.
              </DialogDescription>
            </DialogHeader>
            <ProjectForm staffId={params.id} />
          </DialogContent>
        </Dialog>
      </div>

      {/* Projects List */}
      <div className="grid gap-6">
        {staffMember.research_projects.length === 0 ? (
          <div className="bg-white rounded-[2.5rem] border border-dashed border-gray-200 p-20 text-center">
            <div className="flex flex-col items-center gap-4">
              <div className="w-20 h-20 rounded-full bg-gray-50 flex items-center justify-center">
                <FlaskConical className="w-10 h-10 text-gray-200" />
              </div>
              <div className="space-y-1">
                <p className="text-xl font-bold text-gray-900">No projects found</p>
                <p className="text-gray-500 font-medium">Click the button above to add your first project.</p>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50/50 text-gray-400 text-[10px] uppercase font-black tracking-[0.2em] border-b border-gray-100">
                    <th className="px-10 py-5">Project Details</th>
                    <th className="px-10 py-5">Collaborators</th>
                    <th className="px-10 py-5">Status</th>
                    <th className="px-10 py-5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {staffMember.research_projects.map((project) => (
                    <tr key={project.id} className="hover:bg-gray-50/50 transition-colors group">
                      <td className="px-10 py-8">
                        <div className="space-y-1 max-w-md">
                          <h3 className="text-base font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                            {project.title}
                          </h3>
                          <p className="text-sm text-gray-500 line-clamp-2 font-medium leading-relaxed">
                            {project.description || "No description provided."}
                          </p>
                        </div>
                      </td>
                      <td className="px-10 py-8">
                        <div className="flex flex-wrap gap-1.5">
                          {project.collaborators.length > 0 ? (
                            project.collaborators.map((c, idx) => (
                              <Badge
                                key={c.id}
                                variant="secondary"
                                className={cn(
                                  "rounded-lg px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider border-none",
                                  idx % 3 === 0 ? "bg-blue-50 text-blue-600" : 
                                  idx % 3 === 1 ? "bg-purple-50 text-purple-600" : 
                                  "bg-amber-50 text-amber-600"
                                )}
                              >
                                {c.name}
                              </Badge>
                            ))
                          ) : (
                            <span className="text-xs text-gray-400 italic font-medium">Internal Project</span>
                          )}
                        </div>
                      </td>
                      <td className="px-10 py-8">
                        <Badge
                          className={cn(
                            "rounded-xl px-3 py-1 text-[10px] font-black uppercase tracking-[0.1em] border shadow-sm",
                            project.status === "Completed"
                              ? "bg-emerald-50 text-emerald-700 border-emerald-100"
                              : project.status === "Ongoing"
                              ? "bg-indigo-50 text-indigo-700 border-indigo-100"
                              : "bg-slate-50 text-slate-700 border-slate-100"
                          )}
                        >
                          {project.status || "Unknown"}
                        </Badge>
                      </td>
                      <td className="px-10 py-8 text-right">
                        <div className="flex justify-end items-center gap-2">
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button variant="outline" size="icon" className="h-9 w-9 rounded-xl border-gray-200 hover:bg-gray-50 hover:text-blue-600 transition-all">
                                <Pencil className="h-4 w-4" />
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-[525px] rounded-[2rem]">
                              <DialogHeader>
                                <DialogTitle className="text-2xl font-black">Edit Project</DialogTitle>
                                <DialogDescription className="font-medium">
                                  Update the project information below.
                                </DialogDescription>
                              </DialogHeader>
                              <ProjectForm staffId={params.id} project={project} />
                            </DialogContent>
                          </Dialog>

                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button variant="outline" size="icon" className="h-9 w-9 rounded-xl border-gray-200 hover:bg-red-50 hover:text-red-600 hover:border-red-100 transition-all">
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent className="rounded-[2rem]">
                              <AlertDialogHeader>
                                <AlertDialogTitle className="text-xl font-black">Are you absolutely sure?</AlertDialogTitle>
                                <AlertDialogDescription className="font-medium">
                                  This action cannot be undone. This will permanently delete the project
                                  "<span className="font-bold text-gray-900">{project.title}</span>" and remove its data from our servers.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel className="rounded-xl font-bold">Cancel</AlertDialogCancel>
                                <form action={async () => {
                                  "use server";
                                  await deleteResearchProject(project.id);
                                }}>
                                  <AlertDialogAction type="submit" className="bg-red-600 hover:bg-red-700 text-white rounded-xl font-bold">
                                    Delete Project
                                  </AlertDialogAction>
                                </form>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

async function getStaffById(id: string) {
  const staff = await db.staff.findUnique({
    where: { id },
    include: {
      university: true,
      research_projects: {
        include: {
          collaborators: true,
        },
      },
    },
  } as any);
  return staff;
}
