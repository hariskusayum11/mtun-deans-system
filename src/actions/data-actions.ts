"use server";

import { PrismaClient, Role } from "@prisma/client";
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

const db = new PrismaClient();

// --- STAFF CRUD ---

export async function getStaff() {
  try {
    const session = await auth();
    if (!session?.user) {
      return [];
    }

    const user = session.user;
    let whereClause: any = {};

    // Strict Isolation: Users must ONLY see data from their own university
    if (user.role !== Role.super_admin) {
      if (!user.universityId) return [];
      whereClause.university_id = user.universityId;
    }

    const staff = await db.staff.findMany({
      where: whereClause,
      include: {
        university: true,
        _count: {
          select: { research_projects: true },
        },
      },
      orderBy: {
        name: "asc",
      },
    });
    return staff;
  } catch (error) {
    console.error("Error fetching staff:", error);
    return [];
  }
}

export async function createStaff(formData: FormData) {
  const session = await auth();
  if (!session?.user) {
    throw new Error("Not authenticated.");
  }

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
    // Validate data using Zod schema
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

    let universityIdToAssign: string | null = null;

    if (user.role === Role.super_admin) {
      if (!validatedData.university_id) {
        throw new Error("University is required for Super Admin.");
      }
      universityIdToAssign = validatedData.university_id;
    } else if (user.universityId) {
      universityIdToAssign = user.universityId;
    } else {
      throw new Error("User is not associated with a university.");
    }

    // Duplicate Check: Ensure email is unique
    if (validatedData.email) {
      const existingStaff = await db.staff.findUnique({
        where: { email: validatedData.email },
      });
      if (existingStaff) {
        throw new Error("Staff with this email already exists.");
      }
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
    if (error instanceof z.ZodError) {
      throw new Error(error.message);
    }
    throw new Error("Failed to create staff: " + error.message);
  }
  redirect("/dashboard/staff");
}

export async function deleteStaff(id: string) {
  const session = await auth();
  if (!session) throw new Error("Unauthorized");

  const user = session.user;
  const existingStaff = await db.staff.findUnique({
    where: { id },
    select: { university_id: true },
  });

  if (!existingStaff) {
    throw new Error("Staff not found.");
  }

  // Authorization check
  if (
    user.role !== Role.super_admin &&
    existingStaff.university_id !== user.universityId
  ) {
    throw new Error("You are not authorized to delete this staff member.");
  }

  await db.staff.delete({ where: { id } });
  revalidatePath("/dashboard/staff");
}

export async function updateStaff(id: string, formData: FormData) {
  const session = await auth();
  if (!session?.user) {
    throw new Error("Not authenticated.");
  }

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

    let universityIdToAssign: string | null = null;

    if (user.role === Role.super_admin) {
      if (!validatedData.university_id) {
        throw new Error("University is required for Super Admin.");
      }
      universityIdToAssign = validatedData.university_id;
    } else if (user.universityId) {
      universityIdToAssign = user.universityId;
    } else {
      throw new Error("User is not associated with a university.");
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
    if (error instanceof z.ZodError) {
      throw new Error(error.message);
    }
    throw new Error("Failed to update staff: " + error.message);
  }
  redirect("/dashboard/staff");
}

// --- COMPANY CRUD ---

export async function getCompanies() {
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
      return []; // Non-admin without universityId
    }

    const companies = await db.company.findMany({
      where: whereClause,
      include: {
        university: true,
        industry_activities: true, // Include industry activities
      },
      orderBy: {
        name: "asc",
      },
    });
    return companies;
  } catch (error) {
    console.error("Error fetching companies:", error);
    return [];
  }
}

export async function createCompany(formData: FormData) {
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

    let universityIdToAssign: string | null = null;

    if (user.role === Role.super_admin) {
      if (!validatedData.university_id) {
        throw new Error("University is required for Super Admin.");
      }
      universityIdToAssign = validatedData.university_id;
    } else if (user.universityId) {
      universityIdToAssign = user.universityId;
    } else {
      throw new Error("User is not associated with a university.");
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
    if (error instanceof z.ZodError) {
      throw new Error(error.message);
    }
    throw new Error("Failed to create company: " + error.message);
  }
  redirect("/dashboard/industry");
}

export async function deleteCompany(id: string) {
  const session = await auth();
  if (!session) throw new Error("Unauthorized");

  const user = session.user;
  const existingCompany = await db.company.findUnique({
    where: { id },
    select: { university_id: true },
  });

  if (!existingCompany) {
    throw new Error("Company not found.");
  }

  // Authorization check
  if (
    user.role !== Role.super_admin &&
    existingCompany.university_id !== user.universityId
  ) {
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

    let universityIdToAssign: string | null = null;

    if (user.role === Role.super_admin) {
      if (!validatedData.university_id) {
        throw new Error("University is required for Super Admin.");
      }
      universityIdToAssign = validatedData.university_id;
    } else if (user.universityId) {
      universityIdToAssign = user.universityId;
    } else {
      throw new Error("User is not associated with a university.");
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
    if (error instanceof z.ZodError) {
      throw new Error(error.message);
    }
    throw new Error("Failed to update company: " + error.message);
  }
  redirect("/dashboard/industry");
}

export async function getCompanyById(id: string) {
  const company = await db.company.findUnique({
    where: { id },
    include: {
      university: true,
      industry_activities: true,
    },
  });
  return company;
}

export async function deleteIndustryActivityAction(formData: FormData) {
  const id = formData.get("id") as string;
  await deleteIndustryActivity(id);
}

// --- INDUSTRY ACTIVITY CRUD ---
export async function createIndustryActivity(formData: FormData) {
  const session = await auth();
  if (!session?.user) {
    throw new Error("Not authenticated.");
  }

  const user = session.user;

  const project_name = formData.get("project_name") as string;
  const date_str = formData.get("date") as string;
  const status = formData.get("status") as string;
  const action = formData.get("action") as string;
  const pic_company = formData.get("pic_company") as string;
  const pic_university = formData.get("pic_university") as string;
  const company_id = formData.get("company_id") as string;

  try {
    const validatedData = IndustryActivitySchema.parse({
      project_name,
      date: date_str,
      status,
      action: action || undefined,
      pic_company,
      pic_university,
      company_id,
      university_id: user.universityId, // Automatically assign from session
    });

    // Authorization check: Ensure the user is authorized to add activities for this company
    const existingCompany = await db.company.findUnique({
      where: { id: company_id },
      select: { university_id: true },
    });

    if (!existingCompany) {
      throw new Error("Company not found.");
    }

    if (
      user.role !== Role.super_admin &&
      existingCompany.university_id !== user.universityId
    ) {
      throw new Error(
        "You are not authorized to add activities for this company."
      );
    }

    await db.industryActivity.create({
      data: {
        project_name: validatedData.project_name,
        date: new Date(validatedData.date),
        status: validatedData.status,
        action: validatedData.action || null,
        pic_company: validatedData.pic_company,
        pic_university: validatedData.pic_university,
        company_id: validatedData.company_id,
        university_id: validatedData.university_id,
      },
    });
    revalidatePath(`/dashboard/industry/${company_id}/activities`);
  } catch (error: any) {
    console.log("Error creating industry activity:", error);
    if (error instanceof z.ZodError) {
      throw new Error(error.message);
    }
    throw new Error("Failed to create industry activity: " + error.message);
  }
  redirect(`/dashboard/industry/${company_id}/activities`);
}

export async function updateIndustryActivity(id: string, formData: FormData) {
  const session = await auth();
  if (!session?.user) {
    throw new Error("Not authenticated.");
  }

  const user = session.user;

  const project_name = formData.get("project_name") as string;
  const date_str = formData.get("date") as string;
  const status = formData.get("status") as string;
  const action = formData.get("action") as string;
  const pic_company = formData.get("pic_company") as string;
  const pic_university = formData.get("pic_university") as string;
  const company_id = formData.get("company_id") as string;

  try {
    const validatedData = IndustryActivitySchema.parse({
      project_name,
      date: date_str,
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

    if (!existingActivity) {
      throw new Error("Activity not found.");
    }

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
        status: validatedData.status,
        action: validatedData.action || null,
        pic_company: validatedData.pic_company,
        pic_university: validatedData.pic_university,
      },
    });
    revalidatePath(`/dashboard/industry/${company_id}/activities`);
  } catch (error: any) {
    console.log("Error updating industry activity:", error);
    if (error instanceof z.ZodError) {
      throw new Error(error.message);
    }
    throw new Error("Failed to update industry activity: " + error.message);
  }
  redirect(`/dashboard/industry/${company_id}/activities`);
}

export async function deleteIndustryActivity(id: string) {
  const session = await auth();
  if (!session) throw new Error("Unauthorized");

  const user = session.user;
  const existingActivity = await db.industryActivity.findUnique({
    where: { id },
    select: { company: { select: { id: true, university_id: true } } },
  });

  if (!existingActivity) {
    throw new Error("Industry activity not found.");
  }

  // Authorization check
  if (
    user.role !== Role.super_admin &&
    existingActivity.company.university_id !== user.universityId
  ) {
    throw new Error("You are not authorized to delete this industry activity.");
  }

  await db.industryActivity.delete({ where: { id } });
  revalidatePath(
    `/dashboard/industry/${existingActivity.company.id}/activities`
  );
}

// --- FACILITY CRUD ---

export async function getFacilities() {
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
      return []; // Non-admin without universityId
    }

    const facilities = await db.facility.findMany({
      where: whereClause,
      include: {
        university: true,
      },
      orderBy: {
        name: "asc",
      },
    });
    return facilities;
  } catch (error) {
    console.error("Error fetching facilities:", error);
    return [];
  }
}

export async function createFacility(formData: FormData) {
  const session = await auth();
  if (!session?.user) {
    throw new Error("Not authenticated.");
  }

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

    let universityIdToAssign: string | null = null;

    if (user.role === Role.super_admin) {
      if (!validatedData.university_id) {
        throw new Error("University is required for Super Admin.");
      }
      universityIdToAssign = validatedData.university_id;
    } else if (user.universityId) {
      universityIdToAssign = user.universityId;
    } else {
      throw new Error("User is not associated with a university.");
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
    if (error instanceof z.ZodError) {
      throw new Error(error.message);
    }
    throw new Error("Failed to create facility: " + error.message);
  }
  redirect("/dashboard/facilities");
}

export async function deleteFacility(id: string) {
  const session = await auth();
  if (!session) throw new Error("Unauthorized");

  const user = session.user;
  const existingFacility = await db.facility.findUnique({
    where: { id },
    select: { university_id: true },
  });

  if (!existingFacility) {
    throw new Error("Facility not found.");
  }

  // Authorization check
  if (
    user.role !== Role.super_admin &&
    existingFacility.university_id !== user.universityId
  ) {
    throw new Error("You are not authorized to delete this facility.");
  }

  await db.facility.delete({ where: { id } });
  revalidatePath("/dashboard/facilities");
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

    let universityIdToAssign: string | null = null;

    if (user.role === Role.super_admin) {
      if (!validatedData.university_id) {
        throw new Error("University is required for Super Admin.");
      }
      universityIdToAssign = validatedData.university_id;
    } else if (user.universityId) {
      universityIdToAssign = user.universityId;
    } else {
      throw new Error("User is not associated with a university.");
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
    if (error instanceof z.ZodError) {
      throw new Error(error.message);
    }
    throw new Error("Failed to update facility: " + error.message);
  }
  redirect("/dashboard/facilities");
}

export async function getFacilityById(id: string) {
  const facility = await db.facility.findUnique({
    where: { id },
    include: {
      university: true,
    },
  });
  return facility;
}

export async function getExternalPartners() {
  try {
    const partners = await db.externalPartner.findMany({
      orderBy: { name: "asc" },
    });
    return partners;
  } catch (error) {
    console.error("Error fetching external partners:", error);
    return [];
  }
}
