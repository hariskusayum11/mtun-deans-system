"use server";

import { z } from "zod";
import bcrypt from "bcryptjs";
import { NewPasswordSchema } from "@/lib/validators";
import { db } from "@/lib/db";

/**
 * Server Action to handle password reset via email token.
 * Validates the token, hashes the new password, and updates the user record.
 * Crucially sets isPasswordChanged to true to prevent forced redirection on next login.
 */
export const newPassword = async (
  values: z.infer<typeof NewPasswordSchema>,
  token?: string | null
) => {
  // 1. Check if token is provided
  if (!token) {
    return { error: "Missing token!" };
  }

  // 2. Validate input fields (password and confirmPassword)
  const validatedFields = NewPasswordSchema.safeParse(values);

  if (!validatedFields.success) {
    return { error: "Invalid fields!" };
  }

  const { password } = validatedFields.data;

  // 3. Verify the token exists in the database
  const existingToken = await db.passwordResetToken.findUnique({
    where: { token }
  });

  if (!existingToken) {
    return { error: "Invalid token!" };
  }

  // 4. Check if the token has expired
  const hasExpired = new Date(existingToken.expires) < new Date();

  if (hasExpired) {
    return { error: "Token has expired!" };
  }

  // 5. Find the user associated with this email
  const existingUser = await db.user.findUnique({
    where: { email: existingToken.email }
  });

  if (!existingUser) {
    return { error: "Email does not exist!" };
  }

  // 6. Hash the new password
  const hashedPassword = await bcrypt.hash(password, 10);

  // 7. Update the user record
  // ✅ FIX: Set isPasswordChanged: true alongside password_hash
  // This ensures the user is marked as having set their own password and 
  // satisfies the force-change check in the auth middleware.
  await db.user.update({
    where: { id: existingUser.id },
    data: { 
      password_hash: hashedPassword,
      isPasswordChanged: true, 
    }
  });

  // 8. Delete the used reset token
  await db.passwordResetToken.delete({
    where: { id: existingToken.id }
  });

  return { success: "Password updated successfully!" };
};
