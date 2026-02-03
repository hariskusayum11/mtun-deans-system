"use server";

import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { ProfileSchema } from "@/lib/validators";
import { revalidatePath } from "next/cache";

export async function updateProfile(values: any) {
  const session = await auth();

  if (!session?.user?.id) {
    return { error: "Unauthorized" };
  }

  const validatedFields = ProfileSchema.safeParse(values);

  if (!validatedFields.success) {
    return { error: "Invalid fields!" };
  }

  const { name, phoneNumber } = validatedFields.data;

  try {
    // @ts-ignore - phoneNumber might not be in generated types yet
    await db.user.update({
      where: { id: session.user.id },
      data: {
        name,
        phoneNumber,
      },
    });

    revalidatePath("/dashboard/profile");
    return { success: "Profile updated successfully!" };
  } catch (error) {
    console.error("Error updating profile:", error);
    return { error: "Something went wrong!" };
  }
}
