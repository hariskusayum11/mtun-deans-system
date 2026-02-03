import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import IndustryForm from "@/components/industry/IndustryForm";
import { updateIndustryPartner } from "@/actions/industry";
import { Role } from "@prisma/client";

export default async function EditIndustryPage({ params }: { params: { id: string } }) {
  const session = await auth();
  if (!session?.user) {
    redirect("/login");
  }

  const company = await db.company.findUnique({
    where: { id: params.id },
    include: { university: true }
  });

  if (!company) {
    return <div className="p-10 text-center text-red-500 font-bold">Partner not found.</div>;
  }

  // Authorization check
  if (session.user.role !== Role.super_admin && company.university_id !== session.user.universityId) {
    return <div className="p-10 text-center text-red-500 font-bold">You are not authorized to edit this partner.</div>;
  }

  // Fetch current user's university info
  const userUniversity = await db.university.findUnique({
    where: { id: session.user.universityId as string },
    select: { id: true, name: true }
  });

  if (!userUniversity) {
    return <div className="p-10 text-center text-red-500 font-bold">User university not found.</div>;
  }

  const updatePartnerWithId = updateIndustryPartner.bind(null, company.id);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-black text-gray-900 tracking-tight">Edit Partner</h1>
        <p className="text-gray-500 mt-1 font-medium">Update the profile for {company.name}.</p>
      </div>

      <IndustryForm 
        onSubmit={updatePartnerWithId}
        currentUserUniversity={userUniversity}
        defaultValues={company}
        title={`Edit ${company.name}`}
        submitLabel="Save Changes"
      />
    </div>
  );
}
