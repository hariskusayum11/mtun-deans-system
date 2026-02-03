import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { getUniversities } from "@/actions/university-actions";
import { Role } from "@prisma/client";
import { db } from "@/lib/db";
import StaffForm from "@/components/staff/StaffForm";

interface EditStaffPageProps {
  params: {
    id: string;
  };
}

async function getStaffById(id: string) {
  const staff = await db.staff.findUnique({
    where: { id },
    include: {
      university: true,
      research_projects: true,
    },
  });
  return staff;
}

export default async function EditStaffPage({ params }: EditStaffPageProps) {
  const session = await auth();
  if (!session?.user) {
    redirect("/login");
  }

  const user = session.user;
  const staffMember = await getStaffById(params.id);
  const universities = await getUniversities();

  if (!staffMember) {
    return (
      <div className="container mx-auto p-4 max-w-5xl">
        <div className="rounded-md bg-red-50 p-3 text-sm text-red-700">
          Staff member not found.
        </div>
      </div>
    );
  }

  // Authorization check
  if (user.role !== Role.super_admin && staffMember.university_id !== user.universityId) {
    redirect("/dashboard/staff");
  }

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      <div className="flex flex-col gap-2">
        <h1 className="text-4xl font-black text-gray-900 tracking-tight">Edit Staff</h1>
        <p className="text-gray-500 font-medium">
          Updating profile for <span className="text-blue-600 font-bold">{staffMember.name}</span>
        </p>
      </div>

      <StaffForm 
        staff={staffMember}
        universities={universities} 
        userRole={user.role} 
        userUniversityId={user.universityId} 
      />
    </div>
  );
}
