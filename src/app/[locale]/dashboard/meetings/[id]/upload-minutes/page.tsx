import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { db } from "@/lib/db";
import UploadMinutesForm from "@/components/dashboard/UploadMinutesForm";
import { Role } from "@prisma/client";
import Link from "next/link"; // Import Link
import { ArrowLeft } from "lucide-react"; // Import ArrowLeft

interface UploadMinutesPageProps {
  params: {
    locale: string;
    id: string; // Meeting ID
  };
}

export default async function UploadMinutesPage({ params }: UploadMinutesPageProps) {
  const t = await getTranslations("Meetings.uploadMinutes");
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

  const meetingId = params.id;

  try {
    const meeting = await db.meeting.findUnique({
      where: { id: meetingId },
      select: {
        id: true,
        title: true,
        date: true,
        status: true,
        minutes_file_url: true, // Corrected field name to match schema
      },
    });

    if (!meeting) {
      // Handle case where meeting is not found
      return (
        <div className="p-8 text-center">
          <h1 className="text-2xl font-bold text-red-600">{t("errors.meetingNotFound")}</h1>
          <p className="text-slate-500 mt-2">{t("errors.meetingNotFoundDesc")}</p>
        </div>
      );
    }

    return (
      <div className="container mx-auto py-10">
        <div className="mb-6">
          <Link href="/dashboard/minutes" className="inline-flex items-center text-blue-600 hover:underline text-sm font-medium">
            <ArrowLeft className="h-4 w-4 mr-2" />
            {t("backToMinutesList")}
          </Link>
        </div>
        <UploadMinutesForm meetingId={meeting.id} />
      </div>
    );
  } catch (error) {
    console.error("Error fetching meeting for minutes upload:", error);
    return (
      <div className="p-8 text-center">
        <h1 className="text-2xl font-bold text-red-600">{t("errors.fetchError")}</h1>
        <p className="text-slate-500 mt-2">{t("errors.fetchErrorDesc")}</p>
      </div>
    );
  }
}
