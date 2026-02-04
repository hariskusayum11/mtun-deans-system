"use server";

import { db } from "@/lib/db";
import { auth } from "@/lib/auth";
import { Role } from "@prisma/client";
import { ResearchProjectSchema } from "@/lib/validators";
import { z } from "zod";
import { revalidatePath } from "next/cache";
import { createNotification } from "./notification-actions"; // Import createNotification
import { NotificationType } from "@prisma/client"; // Import NotificationType

function toTitleCase(str: string) {
  return str
    .toLowerCase()
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

export async function getResearchProjects() {
  try {
    const session = await auth();
    if (!session?.user) {
      throw new Error("Unauthorized");
    }

    const user = session.user;
    let whereClause: any = {};

    // Strict Isolation: Users must ONLY see data from their own university
    if (user.role !== Role.super_admin) {
      if (!user.universityId) return [];
      whereClause.staff = {
        university_id: user.universityId,
      };
    }

    const projects = await db.researchProject.findMany({
      where: whereClause,
      include: {
        staff: {
          select: {
            name: true,
            image_url: true,
          },
        },
        collaborators: { // Reverted to collaborators
          select: {
            id: true,
            name: true,
          },
        },
      },
      orderBy: {
        updated_at: "desc",
      },
    });

    return projects;
  } catch (error) {
    console.error("Error fetching research projects:", error);
    return [];
  }
}

export async function createResearchProject(formData: FormData): Promise<{ success?: string; error?: string }> {
  try {
    const session = await auth();
    if (!session?.user) {
      return { error: "Not authenticated." };
    }

    const user = session.user;

    const title = formData.get("title") as string;
    const collaboratorsJson = formData.get("collaborators") as string; // Reverted field name
    const status = formData.get("status") as string;
    const description = formData.get("description") as string;
    const staff_id = formData.get("staff_id") as string;

    const parsedCollaborators = JSON.parse(
      collaboratorsJson || "[]"
    ) as string[]; // Parse as array of names
    
    const validatedData = ResearchProjectSchema.parse({
      title,
      collaborators: parsedCollaborators, // Reverted to collaborators
      status: status || undefined,
      description: description || undefined,
      staff_id,
    });

    // Authorization check: Ensure the user is authorized to add projects for this staff
    const existingStaff = await db.staff.findUnique({
      where: { id: staff_id },
      select: { university_id: true },
    });

    if (!existingStaff) {
      return { error: "Staff member not found." };
    }

    if (
      user.role !== Role.super_admin &&
      existingStaff.university_id !== user.universityId
    ) {
      return { error: "You are not authorized to add projects for this staff member." };
    }

    const newProject = await db.researchProject.create({
      data: {
        title: validatedData.title,
        status: validatedData.status || "Ongoing",
        description: validatedData.description || null,
        staff_id: validatedData.staff_id,
        collaborators: { // Reverted to collaborators
          connectOrCreate: validatedData.collaborators.map((name) => {
            const formattedName = toTitleCase(name.trim());
            return {
              where: { name: formattedName },
              create: { name: formattedName },
            };
          }),
        },
      },
    });

    // Notify the Dean(s) of the staff's university
    if (newProject.id && existingStaff.university_id) {
      const deans = await db.user.findMany({
        where: {
          role: Role.dean,
          university_id: existingStaff.university_id,
        },
        select: { id: true },
      });

      for (const dean of deans) {
        await createNotification({
          userId: dean.id,
          title: "New Research Project Submitted",
          message: `A new research project "${newProject.title}" has been submitted by staff from your university.`,
          type: NotificationType.INFO,
          actionUrl: `/dashboard/research/${newProject.id}`, // Assuming a detail page for research projects
        });
      }
    }
    
    revalidatePath(`/dashboard/staff/${staff_id}/research`); // Changed path
    revalidatePath("/dashboard/research");
    return { success: "Project created successfully." };
  } catch (error: any) {
    console.error("Error creating research project:", error);
    if (error instanceof z.ZodError) {
      return { error: error.issues.map((e: any) => e.message).join(", ") };
    }
    return { error: error.message || "Failed to create research project." };
  }
}

export async function updateResearchProject(id: string, formData: FormData): Promise<{ success?: string; error?: string }> {
  try {
    const session = await auth();
    if (!session?.user) {
      return { error: "Not authenticated." };
    }

    const user = session.user;

    const title = formData.get("title") as string;
    const collaboratorsJson = formData.get("collaborators") as string; // Reverted field name
    const status = formData.get("status") as string;
    const description = formData.get("description") as string;
    const staff_id = formData.get("staff_id") as string;

    const parsedCollaborators = JSON.parse(
      collaboratorsJson || "[]"
    ) as string[]; // Parse as array of names
    
    const validatedData = ResearchProjectSchema.parse({
      title,
      collaborators: parsedCollaborators, // Reverted to collaborators
      status: status || undefined,
      description: description || undefined,
      staff_id,
    });

    const existingProject = await db.researchProject.findUnique({
      where: { id },
      include: { staff: true, collaborators: true }, // Reverted to collaborators
    });

    if (!existingProject) {
      return { error: "Research project not found." };
    }

    if (
      user.role !== Role.super_admin &&
      existingProject.staff.university_id !== user.universityId
    ) {
      return { error: "You are not authorized to update this research project." };
    }

    // Disconnect old collaborators
    const disconnectOperations = existingProject.collaborators.map(partner => ({ id: partner.id }));
    // Connect new collaborators
    const connectOrCreateOperations = parsedCollaborators.map((name) => {
      const formattedName = toTitleCase(name.trim());
      return {
        where: { name: formattedName },
        create: { name: formattedName },
      };
    });

    await db.researchProject.update({
      where: { id },
      data: {
        title: validatedData.title,
        status: validatedData.status || "Ongoing",
        description: validatedData.description || null,
        staff_id: validatedData.staff_id,
        collaborators: {
          disconnect: disconnectOperations,
          connectOrCreate: connectOrCreateOperations,
        },
      },
    });
    
    revalidatePath(`/dashboard/staff/${staff_id}/research`); // Changed path
    revalidatePath("/dashboard/research");
    return { success: "Project updated successfully." };
  } catch (error: any) {
    console.error("Error updating research project:", error);
    if (error instanceof z.ZodError) {
      return { error: error.issues.map((e: any) => e.message).join(", ") };
    }
    return { error: error.message || "Failed to update research project." };
  }
}

export async function deleteResearchProject(id: string) {
  const session = await auth();
  if (!session) throw new Error("Unauthorized");

  const user = session.user;
  const existingProject = await db.researchProject.findUnique({
    where: { id },
    select: { staff: { select: { id: true, university_id: true } } },
  });

  if (!existingProject) {
    throw new Error("Research project not found.");
  }

  // Authorization check
  if (
    user.role !== Role.super_admin &&
    existingProject.staff.university_id !== user.universityId
  ) {
    throw new Error("You are not authorized to delete this research project.");
  }

  await db.researchProject.delete({ where: { id } });
  revalidatePath(`/dashboard/staff/${existingProject.staff.id}/research`); // Changed path
  revalidatePath("/dashboard/research");
}

export async function getResearchProjectsByStaffId(staffId: string) {
  try {
    const session = await auth();
    if (!session?.user) {
      throw new Error("Unauthorized");
    }

    const user = session.user;
    let whereClause: any = {
      staff_id: staffId,
    };

    // Strict Isolation: Users must ONLY see data from their own university
    if (user.role !== Role.super_admin) {
      if (!user.universityId) return [];
      whereClause.staff = {
        university_id: user.universityId,
      };
    }

    const projects = await db.researchProject.findMany({
      where: whereClause,
      include: {
        staff: {
          select: {
            name: true,
            image_url: true,
          },
        },
        collaborators: { // Reverted to collaborators
          select: {
            id: true,
            name: true,
          },
        },
      },
      orderBy: {
        updated_at: "desc",
      },
    });

    return projects;
  } catch (error) {
    console.error("Error fetching research projects by staff ID:", error);
    return [];
  }
}
