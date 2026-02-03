"use server";

import * as z from "zod";
import { auth, signIn } from "@/lib/auth";
import { LoginSchema } from "@/lib/validators";
import { AuthError } from "next-auth";
import { PrismaClient, LoginStatus } from "@prisma/client"; // Import PrismaClient and LoginStatus
import { headers } from "next/headers"; // Import headers for IP and User Agent
import bcrypt from "bcryptjs"; // Import bcryptjs for password comparison

const db = new PrismaClient();
const LOCKOUT_THRESHOLD = 5;
const LOCKOUT_DURATION_MINUTES = 15;

export async function loginAction(values: z.infer<typeof LoginSchema>) {
  const validatedFields = LoginSchema.safeParse(values);

  if (!validatedFields.success) {
    return { error: "Invalid input data." };
  }

  const { email, password } = validatedFields.data;

  const ipAddress = headers().get("x-forwarded-for") || headers().get("x-real-ip") || "UNKNOWN";
  const userAgent = headers().get("user-agent") || "UNKNOWN";

  let user = null;
  try {
    user = await db.user.findUnique({
      where: { email },
    });
  } catch (dbError) {
    console.error("Database error fetching user:", dbError);
    // Log failed attempt even if user lookup fails due to DB issue
    await db.loginLog.create({
      data: {
        email,
        ip_address: ipAddress,
        user_agent: userAgent,
        status: LoginStatus.FAILED,
        user_id: null, // User ID unknown if lookup failed
      },
    });
    return { error: "An unexpected error occurred. Please try again." };
  }

  // If user not found, log failed attempt and return generic error
  if (!user) {
    await db.loginLog.create({
      data: {
        email,
        ip_address: ipAddress,
        user_agent: userAgent,
        status: LoginStatus.FAILED,
        user_id: null,
      },
    });
    return { error: "Invalid email or password" };
  }

  // 1. Account Lockout Logic
  if (user.lockedUntil && user.lockedUntil > new Date()) {
    // Log locked attempt
    await db.loginLog.create({
      data: {
        user_id: user.id,
        email,
        ip_address: ipAddress,
        user_agent: userAgent,
        status: LoginStatus.LOCKED,
      },
    });
    return { error: "Account locked. Please try again later." };
  }

  try {
    // 2. Password Validation & Failure Handling
    const passwordMatch = await bcrypt.compare(password, user.password_hash);

    if (passwordMatch) {
      // Password matches: Reset failed attempts, update last login
      await db.user.update({
        where: { id: user.id },
        data: {
          failedLoginAttempts: 0,
          lockedUntil: null,
          lastLoginAt: new Date(),
        },
      });
      // Create LoginLog entry for success
      await db.loginLog.create({
        data: {
          user_id: user.id,
          email,
          ip_address: ipAddress,
          user_agent: userAgent,
          status: LoginStatus.SUCCESS,
        },
      });

      await signIn("credentials", {
        email,
        password,
        redirectTo: "/dashboard",
      });

      return { success: "Login successful!" }; // This line might not be reached due to redirect
    } else {
      // Password fails: Increment failed attempts
      const updatedAttempts = user.failedLoginAttempts + 1;
      let newLockedUntil: Date | null = null;
      let loginStatus: LoginStatus = LoginStatus.FAILED;

      if (updatedAttempts >= LOCKOUT_THRESHOLD) {
        newLockedUntil = new Date(Date.now() + LOCKOUT_DURATION_MINUTES * 60 * 1000);
        loginStatus = LoginStatus.LOCKED;
      }

      await db.user.update({
        where: { id: user.id },
        data: {
          failedLoginAttempts: updatedAttempts,
          lockedUntil: newLockedUntil,
        },
      });
      // Create LoginLog entry for failed/locked attempt
      await db.loginLog.create({
        data: {
          user_id: user.id,
          email,
          ip_address: ipAddress,
          user_agent: userAgent,
          status: loginStatus,
        },
      });

      // Return generic error for failed password
      return { error: "Invalid email or password" };
    }
  } catch (error) {
    if ((error as Error).message.includes("NEXT_REDIRECT")) {
      throw error;
    }

    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          // This case should ideally be handled by our custom password check above
          return { error: "Invalid email or password" };
        default:
          console.error("AuthError during signIn:", error);
          return { error: "An unexpected authentication error occurred." };
      }
    }

    console.error("Unexpected error during login:", error);
    return { error: "An unexpected error occurred. Please try again." };
  }
}

export async function updatePassword(values: any) {
  const session = await auth();
  if (!session?.user) {
    return { error: "Unauthorized" };
  }

  const { newPassword, confirmPassword } = values;

  if (newPassword !== confirmPassword) {
    return { error: "Passwords do not match" };
  }

  if (newPassword.length < 6) {
    return { error: "Password must be at least 6 characters" };
  }

  try {
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await db.user.update({
      where: { id: session.user.id },
      data: {
        password_hash: hashedPassword,
        isPasswordChanged: true,
      },
    });

    return { success: "Password updated successfully" };
  } catch (error) {
    console.error("Error updating password:", error);
    return { error: "Failed to update password" };
  }
}
