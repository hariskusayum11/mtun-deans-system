"use server";

import { PrismaClient, Role, MeetingStatus } from "@prisma/client";
import { MeetingSchema } from "@/lib/validators";
import { z } from "zod";
import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";
import {
  sendMeetingRequestEmail,
  sendMeetingInvitationEmail,
  sendMeetingStatusEmail,
} from "@/lib/mail";
import fs from "node:fs";
import path from "node:path";
import { promisify } from "node:util";
import { pipeline } from "node:stream";

const pump = promisify(pipeline);
const db = new PrismaClient();

export async function getMeetings() {
  try {
    const session = await auth();
    if (!session?.user) {
      return [];
    }

    const user = session.user;
    let whereClause: any = {};

    if (user.role !== Role.super_admin && user.universityId) {
      whereClause.university_id = user.universityId;
    } else if (user.role !== Role.super_admin && !user.universityId) {
      return [];
    }

    const meetings = await db.meeting.findMany({
      where: whereClause,
      include: {
        university: true,
        created_by: true,
        participants: true,
      } as any,
      orderBy: {
        date: "desc",
      },
    });
    return meetings;
  } catch (error) {
    console.error("Error fetching meetings:", error);
    return [];
  }
}

export async function createMeeting(
  formData: FormData
): Promise<{ success?: string; error?: string }> {
  try {
    const session = await auth();
    if (!session?.user || !session.user.email) {
      return { error: "Not authenticated." };
    }

    // Get Real User from DB to ensure we have the correct ID
    const dbUser = await db.user.findUnique({
      where: { email: session.user.email },
    });

    if (!dbUser) {
      return { error: "User not found in database." };
    }

    const topic = formData.get("topic") as string;
    const dateString = formData.get("date") as string;
    const startTimeString = formData.get("startTime") as string;
    const endTimeString = formData.get("endTime") as string | null;
    const meetingType = formData.get("meetingType") as "on-site" | "online";
    const location = formData.get("location") as string | null;
    const meetingLink = formData.get("meetingLink") as string | null;
    const agenda = formData.get("agenda") as string | null;
    const participantsJson = formData.get("participants") as string;
    const universityId = formData.get("universityId") as string;

    const parsedParticipantIds = JSON.parse(participantsJson) as string[];

    const validatedData = MeetingSchema.parse({
      title: topic,
      date: dateString,
      start_time: startTimeString,
      location: meetingType === "on-site" ? location || "" : "",
      agenda_details: agenda || "",
      agenda_file_url: "",
      minutes_details: "",
      minutes_file_url: "",
      attendees: JSON.stringify(parsedParticipantIds),
      status: MeetingStatus.PENDING,
      university_id: universityId,
    });

    let universityIdToAssign: string | null = null;

    if (session.user.role === Role.super_admin) {
      if (!validatedData.university_id) {
        return { error: "University is required for Super Admin." };
      }
      universityIdToAssign = validatedData.university_id;
    } else if (session.user.universityId) {
      universityIdToAssign = session.user.universityId;
    } else {
      return { error: "User is not associated with a university." };
    }

    const meetingDate = new Date(validatedData.date);
    const meetingStartTime = new Date(
      `${validatedData.date}T${validatedData.start_time}:00.000Z`
    );
    const meetingEndTime = endTimeString
      ? new Date(`${dateString}T${endTimeString}:00.000Z`)
      : null;

    // Map the session user to created_by_id (snake_case) to track meeting ownership
    const createdMeeting = await db.meeting.create({
      data: {
        title: validatedData.title,
        date: meetingDate,
        start_time: meetingStartTime,
        end_time: meetingEndTime,
        location: validatedData.location || null,
        meeting_link: meetingType === "online" ? meetingLink || null : null,
        agenda_details: validatedData.agenda_details || null,
        attendees: validatedData.attendees || null, // Keep for compatibility
        status: MeetingStatus.PENDING,
        university_id: universityIdToAssign,
        dean_approved: false,
        created_by_id: dbUser.id,
        participants: {
          connect: parsedParticipantIds.map((id) => ({ id })),
        },
      },
    });

    // --- Email Notification Logic ---
    try {
      const deanUser = await db.user.findFirst({
        where: {
          role: Role.dean,
          university_id: universityIdToAssign,
        },
        select: {
          email: true,
        },
      });

      const participants = await db.staff.findMany({
        where: {
          id: {
            in: parsedParticipantIds,
          },
        },
        select: {
          name: true,
        },
      });
      const participantNames = participants.map((p) => p.name).join(", ");

      if (deanUser?.email) {
        await sendMeetingRequestEmail(deanUser.email, {
          topic: createdMeeting.title,
          date: createdMeeting.date,
          startTime: createdMeeting.start_time,
          endTime: createdMeeting.end_time || undefined,
          meetingType: createdMeeting.meeting_link ? "online" : "on-site",
          location: createdMeeting.location || undefined,
          meetingLink: createdMeeting.meeting_link || undefined,
          agenda: createdMeeting.agenda_details || undefined,
          participants: participantNames,
          universityId: createdMeeting.university_id,
        });
      }
    } catch (emailError) {
      console.error("Failed to send meeting request email:", emailError);
    }
    // --- End Email Notification Logic ---

    revalidatePath("/dashboard/meetings");
    return { success: "Meeting scheduled successfully." };
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return { error: error.message };
    }
    console.error("Error creating meeting:", error);
    return { error: "Failed to schedule meeting." };
  }
}

export async function getMeetingById(id: string) {
  try {
    const meeting = await db.meeting.findUnique({
      where: { id },
      include: {
        university: true,
        created_by: true,
        participants: true,
      } as any,
    });
    return meeting;
  } catch (error) {
    console.error(`Error fetching meeting with ID ${id}:`, error);
    return null;
  }
}

export async function updateMeeting(
  id: string,
  formData: FormData
): Promise<{ success?: string; error?: string }> {
  try {
    const session = await auth();
    if (!session?.user) {
      return { error: "Not authenticated." };
    }

    const user = session.user;

    const topic = formData.get("topic") as string;
    const dateString = formData.get("date") as string;
    const startTimeString = formData.get("startTime") as string;
    const endTimeString = formData.get("endTime") as string | null;
    const meetingType = formData.get("meetingType") as "on-site" | "online";
    const location = formData.get("location") as string | null;
    const meetingLink = formData.get("meetingLink") as string | null;
    const agenda = formData.get("agenda") as string | null;
    const participantsJson = formData.get("participants") as string;
    const universityId = formData.get("universityId") as string;
    const status = formData.get("status") as MeetingStatus;

    const parsedParticipants = JSON.parse(participantsJson) as string[];

    const validatedData = MeetingSchema.parse({
      title: topic,
      date: dateString,
      start_time: startTimeString,
      location: meetingType === "on-site" ? location || "" : "",
      agenda_details: agenda || "",
      agenda_file_url: "",
      minutes_details: "",
      minutes_file_url: "",
      attendees: JSON.stringify(parsedParticipants),
      status: status,
      university_id: universityId,
    });

    let universityIdToAssign: string | null = null;

    if (user.role === Role.super_admin) {
      if (!validatedData.university_id) {
        return { error: "University is required for Super Admin." };
      }
      universityIdToAssign = validatedData.university_id;
    } else if (user.universityId) {
      universityIdToAssign = user.universityId;
    } else {
      return { error: "User is not associated with a university." };
    }

    const meetingDate = new Date(validatedData.date);
    const meetingStartTime = new Date(
      `${validatedData.date}T${validatedData.start_time}:00.000Z`
    );
    const meetingEndTime = endTimeString
      ? new Date(`${dateString}T${endTimeString}:00.000Z`)
      : null;

    await db.meeting.update({
      where: { id },
      data: {
        title: validatedData.title,
        date: meetingDate,
        start_time: meetingStartTime,
        end_time: meetingEndTime,
        location: validatedData.location || null,
        meeting_link: meetingType === "online" ? meetingLink || null : null,
        agenda_details: validatedData.agenda_details || null,
        attendees: validatedData.attendees || null,
        status: validatedData.status,
        university_id: universityIdToAssign,
        participants: {
          set: parsedParticipants.map((id) => ({ id })),
        },
      },
    });

    revalidatePath("/dashboard/meetings");
    return { success: "Meeting updated successfully." };
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return { error: error.message };
    }
    console.error(`Error updating meeting with ID ${id}:`, error);
    return { error: "Failed to update meeting." };
  }
}

export async function approveMeeting(
  id: string
): Promise<{ success?: string; error?: string }> {
  try {
    const session = await auth();
    if (!session?.user) {
      return { error: "Not authenticated." };
    }

    const user = session.user;

    if (user.role !== Role.dean && user.role !== Role.super_admin) {
      return { error: "You are not authorized to approve meetings." };
    }

    const existingMeeting = await db.meeting.findUnique({
      where: { id },
      include: {
        university: true,
        created_by: true,
        participants: true,
      },
    });

    if (!existingMeeting) {
      return { error: "Meeting not found." };
    }

    if (existingMeeting.status !== MeetingStatus.PENDING) {
      return { error: "Meeting is not pending approval." };
    }

    if (
      user.role === Role.dean &&
      existingMeeting.university_id !== user.universityId
    ) {
      return { error: "You are not authorized to approve this meeting." };
    }

    const updatedMeeting = await db.meeting.update({
      where: { id },
      data: {
        status: MeetingStatus.APPROVED,
        dean_approved: true,
      },
      include: {
        created_by: true,
        participants: true,
        university: true,
      } as any,
    });

    // --- Email Notifications ---
    try {
      const creatorEmail = (updatedMeeting as any).created_by?.email;
      const participants = (updatedMeeting as any).participants || [];

      if (creatorEmail) {
        await sendMeetingStatusEmail(creatorEmail, {
          topic: updatedMeeting.title,
          status: MeetingStatus.APPROVED,
          meetingId: updatedMeeting.id,
        });
      }

      if (participants.length > 0) {
        for (const participant of participants) {
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
              hostUniversityName:
                (updatedMeeting as any).university?.name || "MTUN",
            });
          }
        }
      }
    } catch (emailError) {
      console.error(
        `Failed to send meeting notification emails for meeting ID ${id}:`,
        emailError
      );
    }
    // --- End Email Notification Logic ---

    revalidatePath("/dashboard/approvals");
    revalidatePath("/dashboard/meetings");
    return {
      success: `Meeting ${MeetingStatus.APPROVED.toLowerCase()} successfully.`,
    };
  } catch (error: any) {
    console.error(`Error approving meeting with ID ${id}:`, error);
    return { error: "Failed to approve meeting." };
  }
}

export async function addMeetingMinutes(
  id: string,
  formData: FormData
): Promise<{ success?: string; error?: string }> {
  try {
    const session = await auth();
    if (!session?.user) {
      return { error: "Not authenticated." };
    }

    const user = session.user;

    const minutes_details = formData.get("minutes_details") as string;
    const minutes_file_url = formData.get("minutes_file_url") as string;

    const existingMeeting = await db.meeting.findUnique({
      where: { id },
      select: { university_id: true },
    });

    if (!existingMeeting) {
      return { error: "Meeting not found." };
    }

    if (
      user.role !== Role.super_admin &&
      existingMeeting.university_id !== user.universityId
    ) {
      return {
        error: "You are not authorized to add minutes to this meeting.",
      };
    }

    await db.meeting.update({
      where: { id },
      data: {
        minutes_details: minutes_details || null,
        minutes_file_url: minutes_file_url || null,
        status: MeetingStatus.COMPLETED,
      },
    });

    revalidatePath(`/dashboard/meetings/${id}/edit`);
    revalidatePath("/dashboard/meetings");
    return { success: "Meeting minutes added successfully." };
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return { error: error.message };
    }
    console.error(`Error adding meeting minutes for ID ${id}:`, error);
    return { error: "Failed to add meeting minutes." };
  }
}

export async function deleteMeeting(
  id: string
): Promise<{ success?: string; error?: string }> {
  try {
    await db.meeting.delete({
      where: { id },
    });
    revalidatePath("/dashboard/meetings");
    return { success: "Meeting deleted successfully!" };
  } catch (error) {
    console.error(`Error deleting meeting with ID ${id}:`, error);
    return { error: "Failed to delete meeting." };
  }
}

export async function updateMeetingMinutes(
  formData: FormData
): Promise<{ success?: string; error?: string }> {
  try {
    const session = await auth();
    if (!session?.user) {
      return { error: "Not authenticated." };
    }

    const meetingId = formData.get("meetingId") as string;
    const minutesSummary = formData.get("minutesSummary") as string;
    const file = formData.get("file") as File | null;

    if (!meetingId) return { error: "Meeting ID is required." };
    if (!minutesSummary) return { error: "Minutes summary is required." };

    let fileUrl = undefined;

    if (file && file.size > 0) {
      const fileName = `${Date.now()}-${file.name.replace(/\s+/g, "-")}`;
      const uploadDir = path.join(process.cwd(), "public", "uploads");
      const filePath = path.join(uploadDir, fileName);

      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
      }

      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      fs.writeFileSync(filePath, buffer);

      fileUrl = `/uploads/${fileName}`;
    }

    await db.meeting.update({
      where: { id: meetingId },
      data: {
        minutes_details: minutesSummary,
        ...(fileUrl && { minutes_file_url: fileUrl }),
        status: MeetingStatus.COMPLETED,
      },
    });

    // Revalidate the meetings table
    revalidatePath("/dashboard/meetings");

    return {
      success:
        "Meeting minutes updated successfully and status set to COMPLETED.",
    };
  } catch (error) {
    console.error("Error updating meeting minutes:", error);
    return { error: "Failed to update meeting minutes." };
  }
}
