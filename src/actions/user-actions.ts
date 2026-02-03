"use server";

import { PrismaClient, Role } from "@prisma/client";
import { CreateUserSchema } from "@/lib/validators";
import { z } from "zod";
import { revalidatePath } from "next/cache";
import bcrypt from "bcryptjs";
import { sendUserWelcomeEmail } from "@/lib/mail";
import { createNotification } from "./notification-actions"; // Import createNotification
import { NotificationType } from "@prisma/client"; // Import NotificationType

const db = new PrismaClient();

// Helper function to generate random password
function generateRandomPassword(length: number = 10): string {
  const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*";
  let retVal = "";
  for (let i = 0, n = charset.length; i < length; ++i) {
    retVal += charset.charAt(Math.floor(Math.random() * n));
  }
  return retVal;
}

export async function getUsers() {
  try {
    const users = await db.user.findMany({
      include: {
        university: true,
      },
      orderBy: {
        created_at: "desc", // Assuming you have a created_at field in your User model
      },
    });
    return users;
  } catch (error) {
    console.error("Error fetching users:", error);
    return [];
  }
}

export async function createUser(
  data: z.infer<typeof CreateUserSchema>
): Promise<{ success?: string; error?: string }> {
  try {
    const validatedData = CreateUserSchema.parse(data);

    // Generate temporary password
    const temporaryPassword = generateRandomPassword(10);
    const hashedPassword = await bcrypt.hash(temporaryPassword, 10);

    const newUser = await db.user.create({
      data: {
        name: validatedData.name,
        email: validatedData.email,
        password_hash: hashedPassword,
        role: validatedData.role,
        university_id: validatedData.university_id,
      },
    });

    // Send welcome email with temporary password
    try {
      await sendUserWelcomeEmail(validatedData.email, validatedData.name, temporaryPassword);
    } catch (emailError) {
      console.error("Failed to send welcome email:", emailError);
      // We still return success because the user was created in DB
      return { success: "User created successfully, but failed to send welcome email." };
    }

    // Send in-app notification to the new user
    if (newUser.id) {
      await createNotification({
        userId: newUser.id,
        title: "Welcome to MTUN Deans' System!",
        message: `Your account has been created. Your temporary password is: ${temporaryPassword}. Please change it after logging in.`,
        type: NotificationType.INFO,
        actionUrl: "/change-password", // Direct new user to change password
      });
    }

    revalidatePath("/dashboard/users");
    return { success: "User created successfully. Welcome email sent." };
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return { error: error.message };
    }
    if (error.code === 'P2002') {
      return { error: "This email is already registered. Please use another one." };
    }
    console.error("Error creating user:", error);
    return { error: "Failed to create user." };
  }
}

export async function getUserById(id: string) {
  try {
    const user = await db.user.findUnique({
      where: { id },
      include: {
        university: true,
      },
    });
    return user;
  } catch (error) {
    console.error(`Error fetching user with ID ${id}:`, error);
    return null;
  }
}

export async function updateUser(
  id: string,
  data: any // Using 'any' as per instruction, but ideally a refined Zod schema for update
): Promise<{ success?: string; error?: string }> {
  try {
    const { password, ...otherData } = data;
    const updateData: any = {
      name: otherData.name,
      email: otherData.email,
      role: otherData.role,
      university_id: otherData.university_id === "" ? null : otherData.university_id,
    };

    if (password && password.length > 0) {
      updateData.password_hash = await bcrypt.hash(password, 10);
    }

    await db.user.update({
      where: { id },
      data: updateData,
    });

    revalidatePath("/dashboard/users");
    return { success: "User updated successfully." };
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return { error: error.message };
    }
    if (error.code === 'P2002') {
      return { error: "This email is already registered. Please use another one." };
    }
    console.error(`Error updating user with ID ${id}:`, error);
    return { error: "Failed to update user." };
  }
}

export async function deleteUser(id: string): Promise<{ success?: string; error?: string }> {
  try {
    await db.user.delete({
      where: { id },
    });
    revalidatePath("/dashboard/users");
    return { success: "User deleted successfully." };
  } catch (error) {
    console.error(`Error deleting user with ID ${id}:`, error);
    return { error: "Failed to delete user." };
  }
}
