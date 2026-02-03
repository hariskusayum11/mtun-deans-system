import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Role } from "@prisma/client";
import CreateMeetingForm from "@/components/dashboard/CreateMeetingForm";
import { db } from "@/lib/db";

// Define types for staff data
type StaffMember = {
  id: string;
  name: string;
  department: string;
  image_url: string | null;
};

export default async function CreateMeetingPage() {
  const session = await auth();
  if (!session?.user) {
    redirect("/login");
  }

  const user = session.user;
  const allowedRoles = [Role.super_admin, Role.dean, Role.data_entry];
  if (!allowedRoles.includes(user.role)) {
    redirect("/dashboard"); // Redirect to dashboard if not authorized
  }

  let staffList: StaffMember[] = [];
  let universityId: string | null = null;

  try {
    if (user.role === Role.super_admin) {
      // For super_admin, fetch all staff
      staffList = await db.staff.findMany({
        select: {
          id: true,
          name: true,
          department: true,
          image_url: true,
        },
        orderBy: {
          name: 'asc',
        },
      });
      // Super admin can select university, but for this form, we'll assume a default or handle it in the form itself
      // For now, we'll pass an empty string if no specific university is selected by super_admin
      universityId = ""; 
    } else if (user.universityId) {
      // For dean or data_entry, fetch staff from their university
      staffList = await db.staff.findMany({
        where: {
          university_id: user.universityId,
        },
        select: {
          id: true,
          name: true,
          department: true,
          image_url: true,
        },
        orderBy: {
          name: 'asc',
        },
      });
      universityId = user.universityId;
    } else {
      // Should not happen if roles are correctly managed, but as a fallback
      return <div className="container mx-auto p-4 text-red-500">User is not associated with a university.</div>;
    }
  } catch (error) {
    console.error("Error fetching staff list:", error);
    return <div className="container mx-auto p-4 text-red-500">Error loading staff data. Please check logs.</div>;
  }

  if (!universityId && user.role !== Role.super_admin) {
    return <div className="container mx-auto p-4 text-red-500">University ID is missing for this user role.</div>;
  }

  // Fetch real users who have the role of 'dean'
  const deans = await db.user.findMany({
    where: {
      role: Role.dean,
    },
    include: {
      university: {
        select: {
          name: true,
          short_code: true, // Using short_code as abbreviation based on schema
        },
      },
    },
    orderBy: {
      name: "asc",
    },
  });

  const availableDeans = deans.map((dean) => ({
    value: dean.id,
    label: `${dean.name || dean.email} (${dean.university?.short_code || "N/A"})`,
  }));

  return (
    <CreateMeetingForm 
      staffList={staffList} 
      universityId={universityId || ""} 
      availableDeans={availableDeans}
    />
  );
}
