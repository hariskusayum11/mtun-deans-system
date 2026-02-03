import { auth } from "@/lib/auth";
import { getMeetingById } from "@/actions/meeting-actions";
import { notFound, redirect } from "next/navigation";
import { Role } from "@prisma/client";
import { db } from "@/lib/db";
import EditMeetingClient from "./edit-meeting-client";

export default async function EditMeetingPage({ params }: { params: { id: string } }) {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const meeting = await getMeetingById(params.id);

  if (!meeting) {
    notFound();
  }

  const isHost = session.user.universityId === meeting.university_id;
  const isAdmin = session.user.role === Role.super_admin;
  
  if (!isHost && !isAdmin) {
    return <div className="p-8 text-red-500">You are not authorized to edit this meeting.</div>;
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
          short_code: true,
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
    <EditMeetingClient 
      meeting={meeting as any} 
      userRole={session.user.role} 
      availableDeans={availableDeans}
    />
  );
}
