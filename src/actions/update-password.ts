"use server";

import { z } from "zod";
import bcrypt from "bcryptjs";
import { db } from "@/lib/db";
import { auth, signOut } from "@/lib/auth";
import { ChangePasswordSchema } from "@/lib/validators";

/**
 * Server Action to handle the "Force Change Password" flow.
 * Updates the password and marks isPasswordChanged as true.
 * Then forces a logout to clear the stale session and prevent redirect loops.
 */
export async function updatePassword(values: z.infer<typeof ChangePasswordSchema>) {
  const session = await auth();

  if (!session?.user?.id) {
    return { error: "Unauthorized" };
  }

  const validatedFields = ChangePasswordSchema.safeParse(values);

  if (!validatedFields.success) {
    return { error: "Invalid fields!" };
  }

  const { password } = validatedFields.data;
  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    // 1. Update Database
    await db.user.update({
      where: { id: session.user.id },
      data: {
        password_hash: hashedPassword,
        isPasswordChanged: true,
      },
    });
  } catch (error) {
    console.error("Error updating password:", error);
    return { error: "Something went wrong!" };
  }

  // 2. Force Logout (Kill Stale Session)
  // ✅ CRITICAL: We use signOut to immediately invalidate the old session 
  // where isPasswordChanged was still false. This prevents the redirect loop.
  // Called outside try-catch to allow Next.js redirect to function correctly.
  await signOut({ 
    redirect: true, 
    redirectTo: "/login" 
  });
}
