"use server";

import { db } from "@/lib/db";
import { NotificationType } from "@prisma/client"; // Ensure NotificationType is imported

interface CreateNotificationProps {
  userId: string;
  title: string;
  message: string;
  type: NotificationType;
  actionUrl?: string;
}

export async function createNotification({
  userId,
  title,
  message,
  type,
  actionUrl,
}: CreateNotificationProps) {
  try {
    await db.notification.create({
      data: {
        userId,
        title,
        message,
        type,
        actionUrl,
      },
    });
    return { success: "Notification created successfully!" };
  } catch (error) {
    console.error("Error creating notification:", error);
    return { error: "Failed to create notification." };
  }
}
