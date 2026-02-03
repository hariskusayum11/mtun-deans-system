import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { db } from "@/lib/db";
import { Role, MeetingStatus } from "@prisma/client";
import MinutesListView from "@/components/dashboard/minutes/MinutesListView";

export default async function MinutesPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  const user = session.user;

  // Only data entry, dean, and super admin roles can access this page
  if (
    user.role !== Role.data_entry &&
    user.role !== Role.dean &&
    user.role !== Role.super_admin
  ) {
    redirect("/dashboard"); // Redirect to dashboard if not authorized
  }

  try {
    // Fetch approved meetings.
    // If your schema tracks 'minutes_uploaded' status, you can filter for those missing minutes:
    // where: { status: MeetingStatus.APPROVED, minutes_uploaded: false }
    const approvedMeetings = await db.meeting.findMany({
      where: {
        status: MeetingStatus.APPROVED,
        // Optionally filter by university for data_entry and dean roles
        ...(user.universityId && user.role !== Role.super_admin && { university_id: user.universityId }),
      },
      include: {
        university: {
          select: { name: true, short_code: true },
        },
      },
      orderBy: {
        date: "asc",
      },
    });

    const meetingsWithUniversityName = approvedMeetings.map((meeting) => ({
      ...meeting,
      universityName: meeting.university?.name || "N/A",
    }));

    return <MinutesListView meetings={meetingsWithUniversityName} />;
  } catch (error) {
    console.error("Error fetching approved meetings for minutes:", error);
    return <MinutesListView meetings={[]} />;
  }
}
