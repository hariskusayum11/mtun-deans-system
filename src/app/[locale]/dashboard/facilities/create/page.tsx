import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import FacilityForm from "@/components/facilities/FacilityForm";
import { createFacility } from "@/actions/facilities";

export default async function CreateFacilityPage() {
  const session = await auth();
  if (!session?.user) {
    redirect("/login");
  }

  const user = session.user;
  
  // Fetch current user's university info
  const university = await db.university.findUnique({
    where: { id: user.universityId as string },
    select: { id: true, name: true }
  });

  if (!university) {
    return <div className="p-10 text-center text-red-500 font-bold">User university not found.</div>;
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-black text-gray-900 tracking-tight">Add New Facility</h1>
        <p className="text-gray-500 mt-1 font-medium">Register a new facility for {university.name}.</p>
      </div>

      <FacilityForm 
        onSubmit={createFacility}
        currentUserUniversity={university}
      />
    </div>
  );
}
