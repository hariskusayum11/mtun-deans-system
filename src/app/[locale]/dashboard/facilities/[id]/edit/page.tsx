import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import FacilityForm from "@/components/facilities/FacilityForm";
import { updateFacility } from "@/actions/facilities";
import { Role } from "@prisma/client";

export default async function EditFacilityPage({ params }: { params: { id: string } }) {
  const session = await auth();
  if (!session?.user) {
    redirect("/login");
  }

  const facility = await db.facility.findUnique({
    where: { id: params.id },
    include: { university: true }
  });

  if (!facility) {
    return <div className="p-10 text-center text-red-500 font-bold">Facility not found.</div>;
  }

  // Authorization check
  if (session.user.role !== Role.super_admin && facility.university_id !== session.user.universityId) {
    return <div className="p-10 text-center text-red-500 font-bold">You are not authorized to edit this facility.</div>;
  }

  // Fetch current user's university info
  const userUniversity = await db.university.findUnique({
    where: { id: session.user.universityId as string },
    select: { id: true, name: true }
  });

  if (!userUniversity) {
    return <div className="p-10 text-center text-red-500 font-bold">User university not found.</div>;
  }

  const updateFacilityWithId = updateFacility.bind(null, facility.id);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-black text-gray-900 tracking-tight">Edit Facility</h1>
        <p className="text-gray-500 mt-1 font-medium">Update the details for {facility.name}.</p>
      </div>

      <FacilityForm 
        onSubmit={updateFacilityWithId}
        currentUserUniversity={userUniversity}
        initialData={facility}
        title={`Edit ${facility.name}`}
        submitLabel="Save Changes"
      />
    </div>
  );
}
