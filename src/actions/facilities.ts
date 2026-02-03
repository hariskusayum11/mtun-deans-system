"use server";

import { PrismaClient, Role } from "@prisma/client";
import { FacilitySchema } from "@/lib/validators";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import fs from "fs/promises";
import path from "path";

const db = new PrismaClient();

export async function createFacility(formData: FormData) {
  const session = await auth();
  if (!session?.user) {
    throw new Error("Not authenticated.");
  }

  const user = session.user;

  const name = formData.get("name") as string;
  const description = formData.get("description") as string;
  const location = formData.get("location") as string;
  const imageFile = formData.get("image") as File | null;
  const university_id = formData.get("university_id") as string;

  let imageUrl = null;

  // Handle File Upload
  if (imageFile && imageFile.size > 0) {
    const uploadDir = path.join(process.cwd(), "public", "uploads", "facilities");
    
    // Ensure directory exists
    try {
      await fs.access(uploadDir);
    } catch {
      await fs.mkdir(uploadDir, { recursive: true });
    }

    const fileName = `${Date.now()}-${imageFile.name.replace(/\s+/g, "-")}`;
    const filePath = path.join(uploadDir, fileName);
    
    const buffer = Buffer.from(await imageFile.arrayBuffer());
    await fs.writeFile(filePath, buffer);
    
    imageUrl = `/uploads/facilities/${fileName}`;
  }

  try {
    // Validate data
    const validatedData = FacilitySchema.parse({
      name,
      description: description || undefined,
      location: location || undefined,
      university_id: university_id || user.universityId,
    });

    await db.facility.create({
      data: {
        name: validatedData.name,
        description: validatedData.description || null,
        location: validatedData.location || null,
        image_url: imageUrl,
        university_id: validatedData.university_id as string,
      },
    });

    revalidatePath("/dashboard/facilities");
  } catch (error: any) {
    console.error("Error creating facility:", error);
    throw new Error(error.message || "Failed to create facility.");
  }

  redirect("/dashboard/facilities");
}

export async function updateFacility(id: string, formData: FormData) {
  const session = await auth();
  if (!session?.user) {
    throw new Error("Not authenticated.");
  }

  const user = session.user;

  const name = formData.get("name") as string;
  const description = formData.get("description") as string;
  const location = formData.get("location") as string;
  const imageFile = formData.get("image") as File | null;
  const university_id = formData.get("university_id") as string;

  const existingFacility = await db.facility.findUnique({
    where: { id },
  });

  if (!existingFacility) {
    throw new Error("Facility not found.");
  }

  let imageUrl = existingFacility.image_url;

  // Handle File Upload if a new one is provided
  if (imageFile && imageFile.size > 0) {
    const uploadDir = path.join(process.cwd(), "public", "uploads", "facilities");
    
    try {
      await fs.access(uploadDir);
    } catch {
      await fs.mkdir(uploadDir, { recursive: true });
    }

    const fileName = `${Date.now()}-${imageFile.name.replace(/\s+/g, "-")}`;
    const filePath = path.join(uploadDir, fileName);
    
    const buffer = Buffer.from(await imageFile.arrayBuffer());
    await fs.writeFile(filePath, buffer);
    
    imageUrl = `/uploads/facilities/${fileName}`;
  }

  try {
    const validatedData = FacilitySchema.parse({
      name,
      description: description || undefined,
      location: location || undefined,
      university_id: university_id || existingFacility.university_id,
    });

    await db.facility.update({
      where: { id },
      data: {
        name: validatedData.name,
        description: validatedData.description || null,
        location: validatedData.location || null,
        image_url: imageUrl,
        university_id: validatedData.university_id as string,
      },
    });

    revalidatePath("/dashboard/facilities");
  } catch (error: any) {
    console.error("Error updating facility:", error);
    throw new Error(error.message || "Failed to update facility.");
  }

  redirect("/dashboard/facilities");
}
