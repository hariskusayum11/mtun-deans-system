"use server";

import { PrismaClient, Role } from "@prisma/client";
import { CompanySchema } from "@/lib/validators";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import fs from "fs/promises";
import path from "path";

const db = new PrismaClient();

export async function createIndustryPartner(formData: FormData) {
  const session = await auth();
  if (!session?.user) {
    throw new Error("Not authenticated.");
  }

  const user = session.user;

  const name = formData.get("name") as string;
  const sector = formData.get("sector") as string;
  const address = formData.get("address") as string;
  const contact_person = formData.get("contact_person") as string;
  const phone = formData.get("phone") as string;
  const email = formData.get("email") as string;
  const website = formData.get("website") as string;
  const logoFile = formData.get("logo") as File | null;
  const university_id = formData.get("university_id") as string;

  let imageUrl = null;

  // Handle File Upload
  if (logoFile && logoFile.size > 0) {
    const uploadDir = path.join(process.cwd(), "public", "uploads", "logos");
    
    // Ensure directory exists
    try {
      await fs.access(uploadDir);
    } catch {
      await fs.mkdir(uploadDir, { recursive: true });
    }

    const fileName = `${Date.now()}-${logoFile.name.replace(/\s+/g, "-")}`;
    const filePath = path.join(uploadDir, fileName);
    
    const buffer = Buffer.from(await logoFile.arrayBuffer());
    await fs.writeFile(filePath, buffer);
    
    imageUrl = `/uploads/logos/${fileName}`;
  }

  try {
    // Validate data (excluding image_url which we handle manually)
    const validatedData = CompanySchema.parse({
      name,
      sector: sector || undefined,
      address: address || undefined,
      contact_person,
      phone,
      email: email || undefined,
      website: website || undefined,
      university_id: university_id || user.universityId,
    });

    await db.company.create({
      data: {
        name: validatedData.name,
        sector: validatedData.sector || null,
        address: validatedData.address || null,
        contact_person: validatedData.contact_person,
        phone: validatedData.phone,
        email: validatedData.email || null,
        website: validatedData.website || null,
        image_url: imageUrl,
        university_id: validatedData.university_id as string,
      },
    });

    revalidatePath("/dashboard/industry");
  } catch (error: any) {
    console.error("Error creating industry partner:", error);
    throw new Error(error.message || "Failed to create industry partner.");
  }

  redirect("/dashboard/industry");
}

export async function getCompaniesListForSelect() {
  try {
    const companies = await db.company.findMany({
      select: {
        id: true,
        name: true,
      },
      orderBy: {
        name: 'asc',
      },
    });
    return companies;
  } catch (error: any) {
    console.error("Error fetching companies for select:", error);
    throw new Error(error.message || "Failed to fetch companies for select.");
  }
}




export async function updateIndustryPartner(id: string, formData: FormData) {
  const session = await auth();
  if (!session?.user) {
    throw new Error("Not authenticated.");
  }

  const user = session.user;

  const name = formData.get("name") as string;
  const sector = formData.get("sector") as string;
  const address = formData.get("address") as string;
  const contact_person = formData.get("contact_person") as string;
  const phone = formData.get("phone") as string;
  const email = formData.get("email") as string;
  const website = formData.get("website") as string;
  const logoFile = formData.get("logo") as File | null;
  const university_id = formData.get("university_id") as string;

  const existingCompany = await db.company.findUnique({
    where: { id },
  });

  if (!existingCompany) {
    throw new Error("Partner not found.");
  }

  let imageUrl = existingCompany.image_url;

  // Handle File Upload if a new one is provided
  if (logoFile && logoFile.size > 0) {
    const uploadDir = path.join(process.cwd(), "public", "uploads", "logos");
    
    try {
      await fs.access(uploadDir);
    } catch {
      await fs.mkdir(uploadDir, { recursive: true });
    }

    const fileName = `${Date.now()}-${logoFile.name.replace(/\s+/g, "-")}`;
    const filePath = path.join(uploadDir, fileName);
    
    const buffer = Buffer.from(await logoFile.arrayBuffer());
    await fs.writeFile(filePath, buffer);
    
    imageUrl = `/uploads/logos/${fileName}`;
  }

  try {
    const validatedData = CompanySchema.parse({
      name,
      sector: sector || undefined,
      address: address || undefined,
      contact_person,
      phone,
      email: email || undefined,
      website: website || undefined,
      university_id: university_id || existingCompany.university_id,
    });

    await db.company.update({
      where: { id },
      data: {
        name: validatedData.name,
        sector: validatedData.sector || null,
        address: validatedData.address || null,
        contact_person: validatedData.contact_person,
        phone: validatedData.phone,
        email: validatedData.email || null,
        website: validatedData.website || null,
        image_url: imageUrl,
        university_id: validatedData.university_id as string,
      },
    });

    revalidatePath("/dashboard/industry");
  } catch (error: any) {
    console.error("Error updating industry partner:", error);
    throw new Error(error.message || "Failed to update industry partner.");
  }

  redirect("/dashboard/industry");
}
