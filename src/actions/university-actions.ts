"use server";

import { PrismaClient, Role } from "@prisma/client";
import { UniversitySchema } from "@/lib/validators";
import { z } from "zod";
import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth"; // Import auth

const db = new PrismaClient();

export async function getUniversities() {
  try {
    const universities = await db.university.findMany({
      orderBy: { name: "asc" },
    });
    return universities;
  } catch (error) {
    console.error("Error fetching universities:", error);
    return [];
  }
}

export async function createUniversity(
  data: z.infer<typeof UniversitySchema>
): Promise<{ success?: string; error?: string }> {
  try {
    const session = await auth();
    if (!session?.user || session.user.role !== Role.super_admin) {
      return { error: "You are not authorized to create universities." };
    }

    const validatedData = UniversitySchema.parse(data);
    await db.university.create({ data: validatedData });
    revalidatePath("/dashboard/universities");
    return { success: "University created successfully." };
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return { error: error.message };
    }
    if (error.code === 'P2002') {
      return { error: "This Short Code is already taken. Please choose another one." };
    }
    console.error("Error creating university:", error);
    return { error: "Failed to create university." };
  }
}

export async function getUniversityById(id: string) {
  try {
    const university = await db.university.findUnique({
      where: { id },
    });
    return university;
  } catch (error) {
    console.error(`Error fetching university with ID ${id}:`, error);
    return null;
  }
}

export async function updateUniversity(
  id: string,
  data: z.infer<typeof UniversitySchema>
): Promise<{ success?: string; error?: string }> {
  try {
    const session = await auth();
    if (!session?.user || session.user.role !== Role.super_admin) {
      return { error: "You are not authorized to update universities." };
    }

    const validatedData = UniversitySchema.parse(data);
    await db.university.update({
      where: { id },
      data: validatedData,
    });
    revalidatePath("/dashboard/universities");
    return { success: "University updated successfully." };
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return { error: error.message };
    }
    if (error.code === 'P2002') {
      return { error: "This Short Code is already taken. Please choose another one." };
    }
    console.error(`Error updating university with ID ${id}:`, error);
    return { error: "Failed to update university." };
  }
}

export async function deleteUniversity(id: string): Promise<{ success?: string; error?: string }> {
  try {
    const session = await auth();
    if (!session?.user || session.user.role !== Role.super_admin) {
      return { error: "You are not authorized to delete universities." };
    }

    await db.university.delete({
      where: { id },
    });
    revalidatePath("/dashboard/universities");
    return { success: "University deleted successfully." };
  } catch (error: any) { // Fixed: Added (error: any) to the catch block
    console.error(`Error deleting university with ID ${id}:`, error);
    return { error: "Failed to delete university." };
  }
}
