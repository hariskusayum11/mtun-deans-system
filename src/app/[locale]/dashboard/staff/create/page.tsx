import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { getUniversities } from "@/actions/university-actions";
import StaffForm from "@/components/staff/StaffForm";

export default async function CreateStaffPage() {
  const session = await auth();
  if (!session?.user) {
    redirect("/login");
  }

  const user = session.user;
  const universities = await getUniversities();

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      <div className="flex flex-col gap-2">
        <h1 className="text-4xl font-black text-gray-900 tracking-tight">Add New Staff</h1>
        <p className="text-gray-500 font-medium">Register a new staff member to the system.</p>
      </div>

      <StaffForm 
        universities={universities} 
        userRole={user.role} 
        userUniversityId={user.universityId} 
      />
    </div>
  );
}
