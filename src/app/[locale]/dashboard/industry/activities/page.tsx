"use server";

import {
  PrismaClient,
  Role,
  IndustryActivity,
  Company,
} from "@prisma/client";
import {
  StaffSchema,
  FacilitySchema,
  CompanySchema,
  IndustryActivitySchema,
} from "@/lib/validators";
import { z } from "zod";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";

/**
 * ✅ Prisma singleton (กัน dev/hot-reload สร้าง connection ซ้ำ)
 */
const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };
const db = globalForPrisma.prisma ?? new PrismaClient();
if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = db;

/**
 * Type helper: Prisma result includes company relation
 */
type IndustryActivityWithCompany = IndustryActivity & {
  company: Company;
};

// -----------------------------
// STAFF CRUD
// -----------------------------

export async function getStaff() {
  try {
    const session = await auth();
    if (!session?.user) return [];

    const user = session.user;
    const whereClause: any = {};

    // Strict isolation: non-super_admin see only own university
    if (user.role !== Role.super_admin) {
      if (!user.universityId) return [];
      whereClause.university_id = user.universityId;
    }

    return await db.staff.findMany({
      where: whereClause,
      include: {
        university: true,
        _count: { select: { research_projects: true } },
      },
      orderBy: { name: "asc" },
    });
  } catch (error) {
    console.error("Error fetching staff:", error);
    return [];
  }
}

export async function createStaff(formData: FormData) {
  const session = await auth();
  if (!session?.user) throw new Error("Not authenticated.");

  const user = session.user;

  const name = formData.get("name") as string;
  const position = formData.get("position") as string;
  const department = formData.get("department") as string;
  const faculty = formData.get("faculty") as string;
  const expertise = formData.get("expertise") as string;
  const email = formData.get("email") as string;
  const phone = formData.get("phone") as string;
  const image_url = formData.get("image_url") as string;
  const university_id_from_form = formData.get("university_id") as string;

  try {
    const validatedData = StaffSchema.parse({
      name,
      position,
      department,
      faculty: faculty || undefined,
      expertise: expertise || undefined,
      email: email || undefined,
      phone: phone || undefined,
      image_url: image_url || undefined,
      university_id:
        user.role === Role.super_admin
          ? university_id_from_form
          : user.universityId,
    });

    let universityIdToAssign: string;

    if (user.role === Role.super_admin) {
      if (!validatedData.university_id) {
        throw new Error("University is required for Super Admin.");
      }
      universityIdToAssign = validatedData.university_id;
    } else {
      if (!user.universityId) {
        throw new Error("User is not associated with a university.");
      }
      universityIdToAssign = user.universityId;
    }

    // Duplicate check: email unique (only if provided)
    if (validatedData.email) {
      const existing = await db.staff.findUnique({
        where: { email: validatedData.email },
      });
      if (existing) throw new Error("Staff with this email already exists.");
    }

    await db.staff.create({
      data: {
        name: validatedData.name,
        position: validatedData.position,
        department: validatedData.department,
        faculty: validatedData.faculty || null,
        expertise: validatedData.expertise || null,
        email: validatedData.email || null,
        phone: validatedData.phone || null,
        image_url: validatedData.image_url || null,
        university_id: universityIdToAssign,
      },
    });

    revalidatePath("/dashboard/staff");
  } catch (error: any) {
    console.log("Error creating staff:", error);
    if (error instanceof z.ZodError) throw new Error(error.message);
    throw new Error("Failed to create staff: " + error.message);
  }

  redirect("/dashboard/staff");
}

export async function deleteStaff(id: string) {
  const session = await auth();
  if (!session?.user) throw new Error("Unauthorized");

  const user = session.user;

  const existing = await db.staff.findUnique({
    where: { id },
    select: { university_id: true },
  });

  if (!existing) throw new Error("Staff not found.");

  if (user.role !== Role.super_admin && existing.university_id !== user.universityId) {
    throw new Error("You are not authorized to delete this staff member.");
  }

  await db.staff.delete({ where: { id } });
  revalidatePath("/dashboard/staff");
}

export async function updateStaff(id: string, formData: FormData) {
  const session = await auth();
  if (!session?.user) throw new Error("Not authenticated.");

  const user = session.user;

  const name = formData.get("name") as string;
  const position = formData.get("position") as string;
  const department = formData.get("department") as string;
  const faculty = formData.get("faculty") as string;
  const expertise = formData.get("expertise") as string;
  const email = formData.get("email") as string;
  const phone = formData.get("phone") as string;
  const image_url = formData.get("image_url") as string;
  const university_id_from_form = formData.get("university_id") as string;

  try {
    const validatedData = StaffSchema.parse({
      name,
      position,
      department,
      faculty: faculty || undefined,
      expertise: expertise || undefined,
      email: email || undefined,
      phone: phone || undefined,
      image_url: image_url || undefined,
      university_id:
        user.role === Role.super_admin
          ? university_id_from_form
          : user.universityId,
    });

    let universityIdToAssign: string;

    if (user.role === Role.super_admin) {
      if (!validatedData.university_id) {
        throw new Error("University is required for Super Admin.");
      }
      universityIdToAssign = validatedData.university_id;
    } else {
      if (!user.universityId) {
        throw new Error("User is not associated with a university.");
      }
      universityIdToAssign = user.universityId;
    }

    await db.staff.update({
      where: { id },
      data: {
        name: validatedData.name,
        position: validatedData.position,
        department: validatedData.department,
        faculty: validatedData.faculty || null,
        expertise: validatedData.expertise || null,
        email: validatedData.email || null,
        phone: validatedData.phone || null,
        image_url: validatedData.image_url || null,
        university_id: universityIdToAssign,
      },
    });

    revalidatePath("/dashboard/staff");
  } catch (error: any) {
    console.log("Error updating staff:", error);
    if (error instanceof z.ZodError) throw new Error(error.message);
    throw new Error("Failed to update staff: " + error.message);
  }

  redirect("/dashboard/staff");
}

// -----------------------------
// COMPANY CRUD
// -----------------------------

export async function getCompanies() {
  try {
    const session = await auth();
    if (!session?.user) return [];

    const user = session.user;
    const whereClause: any = {};

    if (user.role !== Role.super_admin) {
      if (!user.universityId) return [];
      whereClause.university_id = user.universityId;
    }

    return await db.company.findMany({
      where: whereClause,
      include: {
        university: true,
        industry_activities: true,
      },
      orderBy: { name: "asc" },
    });
  } catch (error) {
    console.error("Error fetching companies:", error);
    return [];
  }
}

export async function createCompany(formData: FormData) {
  const session = await auth();
  if (!session?.user) throw new Error("Not authenticated.");

  const user = session.user;

  const name = formData.get("name") as string;
  const sector = formData.get("sector") as string;
  const address = formData.get("address") as string;
  const contact_person = formData.get("contact_person") as string;
  const phone = formData.get("phone") as string;
  const email = formData.get("email") as string;
  const website = formData.get("website") as string;
  const image_url = formData.get("image_url") as string;
  const university_id_from_form = formData.get("university_id") as string;

  try {
    const validatedData = CompanySchema.parse({
      name,
      sector: sector || undefined,
      address: address || undefined,
      contact_person,
      phone,
      email: email || undefined,
      website: website || undefined,
      image_url: image_url || undefined,
      university_id:
        user.role === Role.super_admin
          ? university_id_from_form
          : user.universityId,
    });

    let universityIdToAssign: string;

    if (user.role === Role.super_admin) {
      if (!validatedData.university_id) {
        throw new Error("University is required for Super Admin.");
      }
      universityIdToAssign = validatedData.university_id;
    } else {
      if (!user.universityId) {
        throw new Error("User is not associated with a university.");
      }
      universityIdToAssign = user.universityId;
    }

    await db.company.create({
      data: {
        name: validatedData.name,
        sector: validatedData.sector || null,
        address: validatedData.address || null,
        contact_person: validatedData.contact_person,
        phone: validatedData.phone,
        email: validatedData.email || null,
        website: validatedData.website || null,
        image_url: validatedData.image_url || null,
        university_id: universityIdToAssign,
      },
    });

    revalidatePath("/dashboard/industry");
  } catch (error: any) {
    console.log("Error creating company:", error);
    if (error instanceof z.ZodError) throw new Error(error.message);
    throw new Error("Failed to create company: " + error.message);
  }

  redirect("/dashboard/industry");
}

export async function deleteCompany(id: string) {
  const session = await auth();
  if (!session?.user) throw new Error("Unauthorized");

  const user = session.user;

  const existing = await db.company.findUnique({
    where: { id },
    select: { university_id: true },
  });

  if (!existing) throw new Error("Company not found.");

  if (user.role !== Role.super_admin && existing.university_id !== user.universityId) {
    throw new Error("You are not authorized to delete this company.");
  }

  await db.company.delete({ where: { id } });
  revalidatePath("/dashboard/industry");
}

export async function deleteCompanyAction(formData: FormData) {
  const id = formData.get("id") as string;
  await deleteCompany(id);
}

export async function updateCompany(id: string, formData: FormData) {
  const session = await auth();
  if (!session?.user) throw new Error("Not authenticated.");

  const user = session.user;

  const name = formData.get("name") as string;
  const sector = formData.get("sector") as string;
  const address = formData.get("address") as string;
  const contact_person = formData.get("contact_person") as string;
  const phone = formData.get("phone") as string;
  const email = formData.get("email") as string;
  const website = formData.get("website") as string;
  const image_url = formData.get("image_url") as string;
  const university_id_from_form = formData.get("university_id") as string;

  try {
    const validatedData = CompanySchema.parse({
      name,
      sector: sector || undefined,
      address: address || undefined,
      contact_person,
      phone,
      email: email || undefined,
      website: website || undefined,
      image_url: image_url || undefined,
      university_id:
        user.role === Role.super_admin
          ? university_id_from_form
          : user.universityId,
    });

    let universityIdToAssign: string;

    if (user.role === Role.super_admin) {
      if (!validatedData.university_id) {
        throw new Error("University is required for Super Admin.");
      }
      universityIdToAssign = validatedData.university_id;
    } else {
      if (!user.universityId) {
        throw new Error("User is not associated with a university.");
      }
      universityIdToAssign = user.universityId;
    }

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
        image_url: validatedData.image_url || null,
        university_id: universityIdToAssign,
      },
    });

    revalidatePath("/dashboard/industry");
  } catch (error: any) {
    console.log("Error updating company:", error);
    if (error instanceof z.ZodError) throw new Error(error.message);
    throw new Error("Failed to update company: " + error.message);
  }

  redirect("/dashboard/industry");
}

export async function getCompanyById(id: string) {
  return db.company.findUnique({
    where: { id },
    include: { university: true, industry_activities: true },
  });
}

// -----------------------------
// INDUSTRY ACTIVITY CRUD
// -----------------------------

export async function createIndustryActivity(formData: FormData) {
  const session = await auth();
  if (!session?.user) throw new Error("Not authenticated.");
  const user = session.user;

  const project_name = formData.get("project_name") as string;
  const date_str = formData.get("date") as string;

  // ✅ รองรับ type (ถ้าไม่ส่งมา ใช้ default)
  const type = (formData.get("type") as string) || "Activity";

  const status = formData.get("status") as string;
  const action = formData.get("action") as string;
  const pic_company = formData.get("pic_company") as string;
  const pic_university = formData.get("pic_university") as string;
  const company_id = formData.get("company_id") as string;

  try {
    const validatedData = IndustryActivitySchema.parse({
      project_name,
      date: date_str,
      type,
      status,
      action: action || undefined,
      pic_company,
      pic_university,
      company_id,
      university_id: user.universityId,
    });

    const existingCompany = await db.company.findUnique({
      where: { id: company_id },
      select: { university_id: true },
    });

    if (!existingCompany) throw new Error("Company not found.");

    if (
      user.role !== Role.super_admin &&
      existingCompany.university_id !== user.universityId
    ) {
      throw new Error("You are not authorized to add activities for this company.");
    }

    await db.industryActivity.create({
      data: {
        project_name: validatedData.project_name,
        date: new Date(validatedData.date),
        type: validatedData.type ?? "Activity",
        status: validatedData.status,
        action: validatedData.action || null,
        pic_company: validatedData.pic_company,
        pic_university: validatedData.pic_university,
        company_id: validatedData.company_id,
        university_id: validatedData.university_id,
      },
    });

    revalidatePath(`/dashboard/industry/${company_id}/activities`);
    revalidatePath(`/dashboard/industry/activities`);
  } catch (error: any) {
    console.log("Error creating industry activity:", error);
    if (error instanceof z.ZodError) throw new Error(error.message);
    throw new Error("Failed to create industry activity: " + error.message);
  }

  redirect(`/dashboard/industry/${company_id}/activities`);
}

export async function updateIndustryActivity(id: string, formData: FormData) {
  const session = await auth();
  if (!session?.user) throw new Error("Not authenticated.");
  const user = session.user;

  const project_name = formData.get("project_name") as string;
  const date_str = formData.get("date") as string;

  // ✅ รองรับ type (ถ้าไม่ส่งมา ใช้ default)
  const type = (formData.get("type") as string) || "Activity";

  const status = formData.get("status") as string;
  const action = formData.get("action") as string;
  const pic_company = formData.get("pic_company") as string;
  const pic_university = formData.get("pic_university") as string;
  const company_id = formData.get("company_id") as string;

  try {
    const validatedData = IndustryActivitySchema.parse({
      project_name,
      date: date_str,
      type,
      status,
      action: action || undefined,
      pic_company,
      pic_university,
      company_id,
      university_id: user.universityId,
    });

    const existingActivity = await db.industryActivity.findUnique({
      where: { id },
      include: { company: true },
    });

    if (!existingActivity) throw new Error("Activity not found.");

    if (
      user.role !== Role.super_admin &&
      existingActivity.company.university_id !== user.universityId
    ) {
      throw new Error("You are not authorized to update this activity.");
    }

    await db.industryActivity.update({
      where: { id },
      data: {
        project_name: validatedData.project_name,
        date: new Date(validatedData.date),
        type: validatedData.type ?? "Activity",
        status: validatedData.status,
        action: validatedData.action || null,
        pic_company: validatedData.pic_company,
        pic_university: validatedData.pic_university,
      },
    });

    revalidatePath(`/dashboard/industry/${company_id}/activities`);
    revalidatePath(`/dashboard/industry/activities`);
  } catch (error: any) {
    console.log("Error updating industry activity:", error);
    if (error instanceof z.ZodError) throw new Error(error.message);
    throw new Error("Failed to update industry activity: " + error.message);
  }

  redirect(`/dashboard/industry/${company_id}/activities`);
}

export async function deleteIndustryActivity(id: string) {
  const session = await auth();
  if (!session?.user) throw new Error("Unauthorized");

  const user = session.user;

  const existing = await db.industryActivity.findUnique({
    where: { id },
    select: { company: { select: { id: true, university_id: true } } },
  });

  if (!existing) throw new Error("Industry activity not found.");

  if (
    user.role !== Role.super_admin &&
    existing.company.university_id !== user.universityId
  ) {
    throw new Error("You are not authorized to delete this industry activity.");
  }

  await db.industryActivity.delete({ where: { id } });

  revalidatePath(`/dashboard/industry/${existing.company.id}/activities`);
  revalidatePath(`/dashboard/industry/activities`);
}

export async function deleteIndustryActivityAction(formData: FormData) {
  const id = formData.get("id") as string;
  await deleteIndustryActivity(id);
}

/**
 * ✅ Used by: /dashboard/industry/activities page
 * Returns Activity[] shape expected by UI columns
 */
export async function getAllIndustryActivities() {
  try {
    const session = await auth();
    if (!session?.user) return [];

    const user = session.user;
    const whereClause: any = {};

    if (user.role !== Role.super_admin) {
      if (!user.universityId) return [];
      whereClause.university_id = user.universityId;
    }

    const activities = await db.industryActivity.findMany({
      where: whereClause,
      include: { company: true },
      orderBy: { date: "desc" },
    });

    return activities.map((activity: IndustryActivityWithCompany) => ({
      id: activity.id,
      name: activity.project_name,
      partner_name: activity.company?.name || "N/A",
      partner_type: "Company" as const,
      date: activity.date,

      // ✅ สำคัญ: page ใช้ a.type
      type: activity.type,

      status: activity.status,
    }));
  } catch (error) {
    console.error("Error fetching all industry activities:", error);
    return [];
  }
}

// -----------------------------
// FACILITY CRUD
// -----------------------------

export async function getFacilities() {
  try {
    const session = await auth();
    if (!session?.user) return [];

    const user = session.user;
    const whereClause: any = {};

    if (user.role !== Role.super_admin) {
      if (!user.universityId) return [];
      whereClause.university_id = user.universityId;
    }

    return await db.facility.findMany({
      where: whereClause,
      include: { university: true },
      orderBy: { name: "asc" },
    });
  } catch (error) {
    console.error("Error fetching facilities:", error);
    return [];
  }
}

export async function createFacility(formData: FormData) {
  const session = await auth();
  if (!session?.user) throw new Error("Not authenticated.");
  const user = session.user;

  const name = formData.get("name") as string;
  const description = formData.get("description") as string;
  const location = formData.get("location") as string;
  const image_url = formData.get("image_url") as string;
  const university_id_from_form = formData.get("university_id") as string;

  try {
    const validatedData = FacilitySchema.parse({
      name,
      description: description || undefined,
      location: location || undefined,
      image_url: image_url || undefined,
      university_id:
        user.role === Role.super_admin
          ? university_id_from_form
          : user.universityId,
    });

    let universityIdToAssign: string;

    if (user.role === Role.super_admin) {
      if (!validatedData.university_id) {
        throw new Error("University is required for Super Admin.");
      }
      universityIdToAssign = validatedData.university_id;
    } else {
      if (!user.universityId) {
        throw new Error("User is not associated with a university.");
      }
      universityIdToAssign = user.universityId;
    }

    await db.facility.create({
      data: {
        name: validatedData.name,
        description: validatedData.description || null,
        location: validatedData.location || null,
        image_url: validatedData.image_url || null,
        university_id: universityIdToAssign,
      },
    });

    revalidatePath("/dashboard/facilities");
  } catch (error: any) {
    console.log("Error creating facility:", error);
    if (error instanceof z.ZodError) throw new Error(error.message);
    throw new Error("Failed to create facility: " + error.message);
  }

  redirect("/dashboard/facilities");
}

export async function deleteFacility(id: string) {
  const session = await auth();
  if (!session?.user) throw new Error("Unauthorized");

  const user = session.user;

  const existing = await db.facility.findUnique({
    where: { id },
    select: { university_id: true },
  });

  if (!existing) throw new Error("Facility not found.");

  if (user.role !== Role.super_admin && existing.university_id !== user.universityId) {
    throw new Error("You are not authorized to delete this facility.");
  }

  await db.facility.delete({ where: { id } });
  revalidatePath("/dashboard/facilities");
}

export async function updateFacility(id: string, formData: FormData) {
  const session = await auth();
  if (!session?.user) throw new Error("Not authenticated.");
  const user = session.user;

  const name = formData.get("name") as string;
  const description = formData.get("description") as string;
  const location = formData.get("location") as string;
  const image_url = formData.get("image_url") as string;
  const university_id_from_form = formData.get("university_id") as string;

  try {
    const validatedData = FacilitySchema.parse({
      name,
      description: description || undefined,
      location: location || undefined,
      image_url: image_url || undefined,
      university_id:
        user.role === Role.super_admin
          ? university_id_from_form
          : user.universityId,
    });

    let universityIdToAssign: string;

    if (user.role === Role.super_admin) {
      if (!validatedData.university_id) {
        throw new Error("University is required for Super Admin.");
      }
      universityIdToAssign = validatedData.university_id;
    } else {
      if (!user.universityId) {
        throw new Error("User is not associated with a university.");
      }
      universityIdToAssign = user.universityId;
    }

    await db.facility.update({
      where: { id },
      data: {
        name: validatedData.name,
        description: validatedData.description || null,
        location: validatedData.location || null,
        image_url: validatedData.image_url || null,
        university_id: universityIdToAssign,
      },
    });

    revalidatePath("/dashboard/facilities");
  } catch (error: any) {
    console.log("Error updating facility:", error);
    if (error instanceof z.ZodError) throw new Error(error.message);
    throw new Error("Failed to update facility: " + error.message);
  }

  redirect("/dashboard/facilities");
}

export async function getFacilityById(id: string) {
  return db.facility.findUnique({
    where: { id },
    include: { university: true },
  });
}

export async function getExternalPartners() {
  try {
    return await db.externalPartner.findMany({
      orderBy: { name: "asc" },
    });
  } catch (error) {
    console.error("Error fetching external partners:", error);
    return [];
  }
}
