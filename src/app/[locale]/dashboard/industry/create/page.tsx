import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import IndustryForm from "@/components/industry/IndustryForm";
import { createIndustryPartner } from "@/actions/industry";

export default async function CreateIndustryPage() {
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
        <h1 className="text-4xl font-black text-gray-900 tracking-tight">Add New Partner</h1>
        <p className="text-gray-500 mt-1 font-medium">Register a new industry collaborator for {university.name}.</p>
      </div>

      <IndustryForm 
        onSubmit={createIndustryPartner}
        currentUserUniversity={university}
        universities={[]} // Not needed anymore but kept for prop compatibility if needed
      />
    </div>
  );
}
