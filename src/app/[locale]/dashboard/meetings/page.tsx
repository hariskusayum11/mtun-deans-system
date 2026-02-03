import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { PrismaClient, Role, Meeting as PrismaMeeting, MeetingStatus, University } from "@prisma/client";
import MeetingTableView from "@/components/dashboard/meetings/MeetingTableView";
import MeetingCalendarView from "@/components/dashboard/meetings/MeetingCalendarView";

const db = new PrismaClient();

type MeetingWithUniversity = PrismaMeeting & {
  university: { name: string } | null;
};

export default async function MeetingsPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  const user = session.user;
  const allowedRoles = [Role.super_admin, Role.dean, Role.data_entry];
  if (!allowedRoles.includes(user.role)) {
    return <div className="container mx-auto p-4 text-red-500">You do not have permission to view this page.</div>;
  }

  let meetings: MeetingWithUniversity[] = [];
  let universities: { id: string; name: string }[] = [];

  try {
    // Fetch all meetings
    meetings = await db.meeting.findMany({
      include: {
        university: true,
      },
      orderBy: {
        date: "asc",
      },
    });

    // Fetch all universities for the calendar filter
    universities = await db.university.findMany({
      select: {
        id: true,
        name: true,
      },
      orderBy: {
        name: 'asc',
      },
    });

  } catch (error) {
    console.error("Error fetching meetings or universities:", error);
    return <div className="container mx-auto p-4 text-red-500">Failed to load meeting data.</div>;
  }

  if (user.role === Role.dean) {
    return <MeetingCalendarView initialMeetings={meetings} userRole={user.role} universities={universities} />;
  } else {
    return <MeetingTableView initialMeetings={meetings} userRole={user.role} />;
  }
}
