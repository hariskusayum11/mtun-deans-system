"use server";

import { PrismaClient, Role, MeetingStatus } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";
import { sendMeetingStatusEmail, sendMeetingInvitationEmail } from "@/lib/mail";
import { createNotification } from "./notification-actions"; // Import createNotification
import { NotificationType } from "@prisma/client"; // Import NotificationType
import { format } from "date-fns"; // Import format

const db = new PrismaClient();

export async function getPendingMeetings() {
  try {
    const session = await auth();
    if (
      !session?.user ||
      (session.user.role !== Role.dean && session.user.role !== Role.super_admin)
    ) {
      return [];
    }

    const user = session.user;
    let whereClause: any = {
      status: MeetingStatus.PENDING,
    };

    // Filter by university if the user is a Dean
    if (user.role === Role.dean && user.universityId) {
      whereClause.university_id = user.universityId;
    } else if (user.role === Role.dean && !user.universityId) {
      return []; // Dean without a university_id cannot see any meetings
    }

    const pendingMeetings = await db.meeting.findMany({
      where: whereClause,
      select: {
        // Explicitly select fields needed for PendingApprovals component
        id: true,
        title: true,
        date: true,
        start_time: true,
        agenda_details: true,
        university: {
          select: {
            name: true,
          },
        },
        attendees: true, // Needed to potentially get creator's name
      },
      orderBy: {
        date: "asc",
      },
    });
    return pendingMeetings;
  } catch (error) {
    console.error("Error fetching pending meetings:", error);
    return [];
  }
}

export async function updateMeetingStatus(
  meetingId: string,
  newStatus: MeetingStatus
): Promise<{ success?: string; error?: string }> {
  try {
    const session = await auth();
    if (
      !session?.user ||
      (session.user.role !== Role.dean && session.user.role !== Role.super_admin)
    ) {
      return { error: "Not authorized to update meeting status." };
    }

    const user = session.user;

    // Fetch the created_by relation (snake_case) to send the notification to the original creator, not the approver
    const existingMeeting = await (db.meeting.findUnique({
      where: { id: meetingId },
      include: {
        created_by: true,
        participants: true,
        university: true,
      },
    }) as any);

    if (!existingMeeting) {
      return { error: "Meeting not found." };
    }

    // Authorization check: Dean can only approve/reject meetings from their university
    if (
      user.role === Role.dean &&
      existingMeeting.university_id !== user.universityId
    ) {
      return { error: "You are not authorized to approve/reject this meeting." };
    }

    // Only allow status change from PENDING
    if (existingMeeting.status !== MeetingStatus.PENDING) {
      return {
        error: "Meeting is not in PENDING status and cannot be updated.",
      };
    }

    const updatedMeeting = await (db.meeting.update({
      where: { id: meetingId },
      data: {
        status: newStatus,
        dean_approved: newStatus === MeetingStatus.APPROVED,
      },
      include: {
        created_by: true,
        participants: true,
        university: true,
      },
    }) as any);

    // --- Email Notifications ---
    try {
      const creatorEmail = updatedMeeting.created_by.email;

      // Creator Email Notification: Send to creatorEmail, NOT session.user.email
      if (creatorEmail) {
        await sendMeetingStatusEmail(creatorEmail, {
          topic: updatedMeeting.title,
          status: newStatus,
          meetingId: updatedMeeting.id,
        });
      }

      // Creator In-App Notification
      if (updatedMeeting.created_by_id) {
        await createNotification({
          userId: updatedMeeting.created_by_id,
          title: `Your meeting "${updatedMeeting.title}" was ${newStatus.toLowerCase()}.`,
          message: `The meeting scheduled for ${format(new Date(updatedMeeting.date), "dd MMM yyyy")} has been ${newStatus.toLowerCase()}.`,
          type: newStatus === MeetingStatus.APPROVED ? NotificationType.SUCCESS : NotificationType.INFO,
          actionUrl: `/dashboard/meetings/${updatedMeeting.id}`,
        });
      }

      // Participant Invitations: Loop through participants (only if APPROVED)
      if (
        newStatus === MeetingStatus.APPROVED &&
        updatedMeeting.participants.length > 0
      ) {
        for (const participant of updatedMeeting.participants) {
          if (participant.email) {
            await sendMeetingInvitationEmail(participant.email, {
              topic: updatedMeeting.title,
              date: updatedMeeting.date,
              startTime: updatedMeeting.start_time,
              endTime: updatedMeeting.end_time || undefined,
              meetingType: updatedMeeting.meeting_link ? "online" : "on-site",
              location: updatedMeeting.location || undefined,
              meetingLink: updatedMeeting.meeting_link || undefined,
              agenda: updatedMeeting.agenda_details || undefined,
              hostUniversityName: updatedMeeting.university?.name || "MTUN",
            });
          }
        }
      }
    } catch (emailError) {
      console.error("Failed to send meeting notification emails or create in-app notifications:", emailError);
    }
    // --- End Email Notification ---

    revalidatePath("/dashboard/approvals");
    revalidatePath("/dashboard/meetings"); // Revalidate meetings list as well
    return { success: `Meeting ${newStatus.toLowerCase()} successfully.` };
  } catch (error: any) {
    console.error(`Error updating meeting status for ID ${meetingId}:`, error);
    return { error: "Failed to update meeting status." };
  }
}
